"""
grades.py — Grades CRUD + currentGrade calculation (Phase 4).

POST   /api/grades              Add a grade manually
GET    /api/grades              List grades (filter by class_id)
PATCH  /api/grades/{id}         Update a grade
DELETE /api/grades/{id}         Delete a grade
GET    /api/grades/class/{class_id}/summary   Current grade + breakdown
"""

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from app.utils.auth import get_current_user_id
from app.utils.supabase_client import supabase

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────

class GradeCreate(BaseModel):
    class_id:      str
    category:      str           # must match a grade_weights.category
    title:         Optional[str] = None
    score:         float
    max_score:     float
    assessment_id: Optional[str] = None
    notes:         Optional[str] = None
    source:        str = "manual"

class GradeUpdate(BaseModel):
    category:  Optional[str]   = None
    title:     Optional[str]   = None
    score:     Optional[float] = None
    max_score: Optional[float] = None
    notes:     Optional[str]   = None

class GradeRecord(BaseModel):
    id:            str
    user_id:       str
    class_id:      str
    assessment_id: Optional[str]
    category:      str
    title:         Optional[str]
    score:         float
    max_score:     float
    percentage:    float
    source:        str
    notes:         Optional[str]
    recorded_at:   str
    created_at:    str

class GradeSummary(BaseModel):
    class_id:       str
    class_name:     str
    current_grade:  Optional[float]   # weighted average %
    letter_grade:   Optional[str]
    grade_weights:  list[dict]
    breakdown:      list[dict]        # per-category avg + weight
    total_entries:  int
    confidence:     str               # high | medium | low

class SimpleMessage(BaseModel):
    message: str


# ── Helpers ────────────────────────────────────────────────────────────────

def _pct(score: float, max_score: float) -> float:
    if not max_score: return 0.0
    return round((score / max_score) * 100, 1)

def _letter(pct: float) -> str:
    if pct >= 93: return "A"
    if pct >= 90: return "A−"
    if pct >= 87: return "B+"
    if pct >= 83: return "B"
    if pct >= 80: return "B−"
    if pct >= 77: return "C+"
    if pct >= 73: return "C"
    if pct >= 70: return "C−"
    if pct >= 60: return "D"
    return "F"

def _row_to_record(r: dict) -> GradeRecord:
    return GradeRecord(
        id=str(r["id"]), user_id=str(r["user_id"]),
        class_id=str(r["class_id"]),
        assessment_id=str(r["assessment_id"]) if r.get("assessment_id") else None,
        category=r["category"], title=r.get("title"),
        score=r["score"], max_score=r["max_score"],
        percentage=_pct(r["score"], r["max_score"]),
        source=r.get("source", "manual"), notes=r.get("notes"),
        recorded_at=str(r["recorded_at"]), created_at=str(r["created_at"]),
    )

def _compute_grade(weights: list[dict], grades: list[dict]) -> tuple[Optional[float], str]:
    """
    Weighted grade calculation from spec §3.2.
    Falls back to simple average when no weights or no category matches.
    """
    if not grades:
        return None, "low"

    # Confidence from spec §3.8
    grade_count = len(grades)
    conf = "high" if grade_count >= 5 else "medium" if grade_count >= 2 else "low"

    # Simple average fallback when no weights configured
    if not weights:
        scores = [_pct(g["score"], g["max_score"]) for g in grades if g.get("max_score")]
        avg = round(sum(scores) / len(scores), 1) if scores else None
        return avg, "low"  # low confidence — no syllabus weights

    # Weighted calculation
    cat_scores: dict[str, list[float]] = {}
    for g in grades:
        cat = g.get("category", "")
        if cat:
            cat_scores.setdefault(cat, []).append(_pct(g["score"], g["max_score"]))

    graded_weight = 0.0
    weighted_sum  = 0.0
    for w in weights:
        cat = w.get("category", "")
        if cat in cat_scores:
            avg = sum(cat_scores[cat]) / len(cat_scores[cat])
            graded_weight  += w.get("weight_pct", 0)
            weighted_sum   += avg * w.get("weight_pct", 0)

    if graded_weight == 0:
        # No category matches — fall back to simple average
        scores = [_pct(g["score"], g["max_score"]) for g in grades if g.get("max_score")]
        avg = round(sum(scores) / len(scores), 1) if scores else None
        return avg, "low"

    return round(weighted_sum / graded_weight, 1), conf


# ── POST /api/grades ───────────────────────────────────────────────────────

@router.post("", response_model=GradeRecord, status_code=status.HTTP_201_CREATED)
async def add_grade(body: GradeCreate, user_id: str = Depends(get_current_user_id)):
    # Verify class ownership
    try:
        supabase.table("classes").select("id").eq("id", body.class_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Class not found.")

    grade_id = str(uuid.uuid4())
    row = {
        "id":            grade_id,
        "user_id":       user_id,
        "class_id":      body.class_id,
        "assessment_id": body.assessment_id,
        "category":      body.category,
        "title":         body.title,
        "score":         body.score,
        "max_score":     body.max_score,
        "source":        body.source,
        "notes":         body.notes,
    }
    try:
        supabase.table("grades").insert(row).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not save grade: {exc}")

    try:
        res = supabase.table("grades").select("*").eq("id", grade_id).single().execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Grade saved but could not fetch: {exc}")

    return _row_to_record(res.data)


# ── GET /api/grades ────────────────────────────────────────────────────────

@router.get("", response_model=list[GradeRecord])
async def list_grades(
    class_id: Optional[str] = Query(None),
    user_id:  str = Depends(get_current_user_id),
):
    try:
        q = supabase.table("grades").select("*").eq("user_id", user_id).order("recorded_at", desc=True)
        if class_id:
            q = q.eq("class_id", class_id)
        res = q.execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not list grades: {exc}")
    return [_row_to_record(r) for r in (res.data or [])]


# ── GET /api/grades/class/{class_id}/summary ──────────────────────────────

@router.get("/class/{class_id}/summary", response_model=GradeSummary)
async def get_grade_summary(class_id: str, user_id: str = Depends(get_current_user_id)):
    # Verify ownership + get class name
    try:
        cls_res = supabase.table("classes").select("id,name").eq("id", class_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Class not found.")

    class_name = cls_res.data.get("name", "")

    # Fetch grade weights
    try:
        weights = (supabase.table("grade_weights").select("*").eq("class_id", class_id).execute()).data or []
    except Exception:
        weights = []

    # Fetch grades
    try:
        grades = (supabase.table("grades").select("*").eq("class_id", class_id).eq("user_id", user_id).execute()).data or []
    except Exception:
        grades = []

    current_grade, confidence = _compute_grade(weights, grades)

    # Build per-category breakdown
    cat_scores: dict[str, list[float]] = {}
    for g in grades:
        cat = g.get("category", "")
        if cat:
            cat_scores.setdefault(cat, []).append(_pct(g["score"], g["max_score"]))

    breakdown = []
    for w in weights:
        cat = w.get("category", "")
        scores = cat_scores.get(cat, [])
        avg = round(sum(scores) / len(scores), 1) if scores else None
        breakdown.append({
            "category":   cat,
            "weight_pct": w.get("weight_pct", 0),
            "confidence": w.get("confidence", "medium"),
            "avg_score":  avg,
            "count":      len(scores),
        })

    return GradeSummary(
        class_id=class_id,
        class_name=class_name,
        current_grade=current_grade,
        letter_grade=_letter(current_grade) if current_grade is not None else None,
        grade_weights=[{"category": w.get("category"), "weight_pct": w.get("weight_pct"), "confidence": w.get("confidence","medium")} for w in weights],
        breakdown=breakdown,
        total_entries=len(grades),
        confidence=confidence,
    )


# ── PATCH /api/grades/{grade_id} ──────────────────────────────────────────

@router.patch("/{grade_id}", response_model=GradeRecord)
async def update_grade(grade_id: str, body: GradeUpdate, user_id: str = Depends(get_current_user_id)):
    try:
        supabase.table("grades").select("id").eq("id", grade_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Grade not found.")

    update: dict = {}
    if body.category  is not None: update["category"]  = body.category
    if body.title     is not None: update["title"]     = body.title
    if body.score     is not None: update["score"]     = body.score
    if body.max_score is not None: update["max_score"] = body.max_score
    if body.notes     is not None: update["notes"]     = body.notes

    if update:
        supabase.table("grades").update(update).eq("id", grade_id).execute()

    res = supabase.table("grades").select("*").eq("id", grade_id).single().execute()
    return _row_to_record(res.data)


# ── DELETE /api/grades/{grade_id} ─────────────────────────────────────────

@router.delete("/{grade_id}", response_model=SimpleMessage)
async def delete_grade(grade_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        supabase.table("grades").select("id").eq("id", grade_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Grade not found.")
    supabase.table("grades").delete().eq("id", grade_id).execute()
    return SimpleMessage(message="Grade deleted.")
