"""
classes.py — Classes CRUD router (Phase 2).

POST   /api/classes              Create a class
GET    /api/classes              List all classes for current user
GET    /api/classes/{id}         Get single class with files, grades, topics
PATCH  /api/classes/{id}         Update class details
DELETE /api/classes/{id}         Delete class + cascade
"""

import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.utils.auth import get_current_user_id
from app.utils.supabase_client import supabase

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────

class ClassCreate(BaseModel):
    name:             str
    instructor:       Optional[str] = None
    credit_hours:     Optional[int] = None
    term:             Optional[str] = "Fall 2026"
    textbook_isbn:    Optional[str] = None
    syllabus_file_id: Optional[str] = None

class ClassUpdate(BaseModel):
    name:             Optional[str] = None
    instructor:       Optional[str] = None
    credit_hours:     Optional[int] = None
    term:             Optional[str] = None
    textbook_isbn:    Optional[str] = None
    syllabus_file_id: Optional[str] = None

class GradeWeightItem(BaseModel):
    id:          str
    category:    str
    weight_pct:  float
    confidence:  str

class AssessmentItem(BaseModel):
    id:         str
    title:      str
    category:   Optional[str]
    due_date:   Optional[str]
    source:     str
    confidence: Optional[str]

class TopicItem(BaseModel):
    id:          str
    title:       str
    source:      str
    week_hint:   Optional[int]
    chapter_ref: Optional[str]
    confidence:  Optional[str]

class FileItem(BaseModel):
    id:                str
    original_name:     str
    category:          str
    status:            str
    size_label:        str
    extracted_summary: Optional[str]
    created_at:        str

class GradeItem(BaseModel):
    id:           str
    category:     str
    score:        float
    max_score:    float
    recorded_at:  str
    source:       str

class ClassRecord(BaseModel):
    id:               str
    user_id:          str
    name:             str
    instructor:       Optional[str]
    credit_hours:     Optional[int]
    term:             Optional[str]
    syllabus_file_id: Optional[str]
    textbook_isbn:    Optional[str]
    created_at:       str
    updated_at:       str
    # Computed
    grade_weights:    list[GradeWeightItem] = []
    assessments:      list[AssessmentItem]  = []
    topics:           list[TopicItem]       = []
    files:            list[FileItem]        = []
    grades:           list[GradeItem]       = []
    current_grade:    Optional[float]       = None
    file_count:       int                   = 0
    topic_count:      int                   = 0

class ClassListItem(BaseModel):
    id:            str
    name:          str
    instructor:    Optional[str]
    credit_hours:  Optional[int]
    term:          Optional[str]
    created_at:    str
    file_count:    int   = 0
    topic_count:   int   = 0
    current_grade: Optional[float] = None

class ClassListResponse(BaseModel):
    classes: list[ClassListItem]
    total:   int

class SimpleMessage(BaseModel):
    message: str


# ── Helpers ────────────────────────────────────────────────────────────────

def _fmt_size(n: Optional[int]) -> str:
    if not n: return "—"
    if n < 1024: return f"{n} B"
    if n < 1024**2: return f"{n/1024:.0f} KB"
    if n < 1024**3: return f"{n/1024**2:.1f} MB"
    return f"{n/1024**3:.1f} GB"


def _compute_current_grade(weights: list[dict], grades: list[dict]) -> Optional[float]:
    """
    Weighted grade calculation from spec §3.2.
    Falls back to simple average when no grade weights exist.
    """
    if not grades:
        return None

    # Simple average fallback when no weights configured
    if not weights:
        scores = [(g["score"] / g["max_score"]) * 100 for g in grades if g.get("max_score")]
        return round(sum(scores) / len(scores), 1) if scores else None

    # Weighted calculation
    cat_scores: dict[str, list[float]] = {}
    for g in grades:
        cat = g.get("category", "")
        if cat:
            cat_scores.setdefault(cat, []).append(
                (g["score"] / g["max_score"]) * 100
                if g.get("max_score") else 0
            )

    graded_weight = 0.0
    weighted_sum  = 0.0
    for w in weights:
        cat = w.get("category", "")
        if cat in cat_scores:
            avg = sum(cat_scores[cat]) / len(cat_scores[cat])
            graded_weight += w.get("weight_pct", 0)
            weighted_sum  += avg * w.get("weight_pct", 0)

    if graded_weight == 0:
        # No category matches — fall back to simple average of all grades
        scores = [(g["score"] / g["max_score"]) * 100 for g in grades if g.get("max_score")]
        return round(sum(scores) / len(scores), 1) if scores else None

    return round(weighted_sum / graded_weight, 1)


# ── POST /api/classes ──────────────────────────────────────────────────────

@router.post("", response_model=ClassRecord, status_code=status.HTTP_201_CREATED)
async def create_class(body: ClassCreate, user_id: str = Depends(get_current_user_id)):
    class_id = str(uuid.uuid4())
    row = {
        "id":               class_id,
        "user_id":          user_id,
        "name":             body.name.strip(),
        "instructor":       body.instructor,
        "credit_hours":     body.credit_hours,
        "term":             body.term or "Fall 2026",
        "textbook_isbn":    body.textbook_isbn,
        "syllabus_file_id": body.syllabus_file_id,
    }
    try:
        supabase.table("classes").insert(row).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not create class: {exc}")

    return await get_class(class_id, user_id)


# ── GET /api/classes ───────────────────────────────────────────────────────

@router.get("", response_model=ClassListResponse)
async def list_classes(user_id: str = Depends(get_current_user_id)):
    try:
        res = (
            supabase.table("classes")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not list classes: {exc}")

    rows = res.data or []
    items = []
    for r in rows:
        cid = str(r["id"])
        # File count
        fc = 0
        try:
            fr = supabase.table("files").select("id", count="exact").eq("class_id", cid).execute()
            fc = fr.count or 0
        except Exception:
            pass
        # Topic count
        tc = 0
        try:
            tr = supabase.table("topics").select("id", count="exact").eq("class_id", cid).execute()
            tc = tr.count or 0
        except Exception:
            pass
        # Current grade
        gw, gr = [], []
        try:
            gw = (supabase.table("grade_weights").select("*").eq("class_id", cid).execute()).data or []
            gr = (supabase.table("grades").select("*").eq("class_id", cid).execute()).data or []
        except Exception:
            pass
        cg = _compute_current_grade(gw, gr)

        items.append(ClassListItem(
            id=cid, name=r["name"],
            instructor=r.get("instructor"), credit_hours=r.get("credit_hours"),
            term=r.get("term"), created_at=str(r["created_at"]),
            file_count=fc, topic_count=tc, current_grade=cg,
        ))

    return ClassListResponse(classes=items, total=len(items))


# ── GET /api/classes/{class_id} ────────────────────────────────────────────

@router.get("/{class_id}", response_model=ClassRecord)
async def get_class(class_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        res = (
            supabase.table("classes")
            .select("*")
            .eq("id", class_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Class not found.")
    if not res.data:
        raise HTTPException(status_code=404, detail="Class not found.")
    r = res.data

    # Fetch related data
    def fetch(table: str, **filters) -> list[dict]:
        try:
            q = supabase.table(table).select("*")
            for k, v in filters.items():
                q = q.eq(k, v)
            return q.execute().data or []
        except Exception:
            return []

    weights     = fetch("grade_weights", class_id=class_id)
    assessments = fetch("assessments",   class_id=class_id)
    topics      = fetch("topics",        class_id=class_id)
    grades_raw  = fetch("grades",        class_id=class_id)

    # Files linked to this class
    files_raw: list[dict] = []
    try:
        files_raw = (
            supabase.table("files").select("*")
            .eq("class_id", class_id)
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        ).data or []
    except Exception:
        pass

    current_grade = _compute_current_grade(weights, grades_raw)

    return ClassRecord(
        id=str(r["id"]), user_id=str(r["user_id"]),
        name=r["name"], instructor=r.get("instructor"),
        credit_hours=r.get("credit_hours"), term=r.get("term"),
        syllabus_file_id=str(r["syllabus_file_id"]) if r.get("syllabus_file_id") else None,
        textbook_isbn=r.get("textbook_isbn"),
        created_at=str(r["created_at"]), updated_at=str(r["updated_at"]),
        grade_weights=[GradeWeightItem(id=str(w["id"]),category=w["category"],weight_pct=w["weight_pct"],confidence=w.get("confidence","medium")) for w in weights],
        assessments=[AssessmentItem(id=str(a["id"]),title=a["title"],category=a.get("category"),due_date=str(a["due_date"]) if a.get("due_date") else None,source=a.get("source","syllabus"),confidence=a.get("confidence")) for a in assessments],
        topics=[TopicItem(id=str(t["id"]),title=t["title"],source=t.get("source","syllabus"),week_hint=t.get("week_hint"),chapter_ref=t.get("chapter_ref"),confidence=t.get("confidence")) for t in topics],
        files=[FileItem(id=str(f["id"]),original_name=f["original_name"],category=f["category"],status=f["status"],size_label=_fmt_size(f.get("size_bytes")),extracted_summary=f.get("extracted_summary"),created_at=str(f["created_at"])) for f in files_raw],
        grades=[GradeItem(id=str(g["id"]),category=g.get("category",""),score=g["score"],max_score=g["max_score"],recorded_at=str(g["recorded_at"]),source=g.get("source","manual")) for g in grades_raw],
        current_grade=current_grade,
        file_count=len(files_raw),
        topic_count=len(topics),
    )


# ── PATCH /api/classes/{class_id} ─────────────────────────────────────────

@router.patch("/{class_id}", response_model=ClassRecord)
async def update_class(class_id: str, body: ClassUpdate, user_id: str = Depends(get_current_user_id)):
    try:
        supabase.table("classes").select("id").eq("id", class_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Class not found.")

    update: dict[str, Any] = {}
    if body.name          is not None: update["name"]             = body.name.strip()
    if body.instructor    is not None: update["instructor"]       = body.instructor
    if body.credit_hours  is not None: update["credit_hours"]     = body.credit_hours
    if body.term          is not None: update["term"]             = body.term
    if body.textbook_isbn is not None: update["textbook_isbn"]    = body.textbook_isbn
    if body.syllabus_file_id is not None: update["syllabus_file_id"] = body.syllabus_file_id

    if update:
        try:
            supabase.table("classes").update(update).eq("id", class_id).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Could not update class: {exc}")

    return await get_class(class_id, user_id)


# ── DELETE /api/classes/{class_id} ────────────────────────────────────────

@router.delete("/{class_id}", response_model=SimpleMessage)
async def delete_class(class_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        res = supabase.table("classes").select("id,name").eq("id", class_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Class not found.")
    name = res.data.get("name", "Class")
    try:
        supabase.table("classes").delete().eq("id", class_id).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not delete class: {exc}")
    return SimpleMessage(message=f"'{name}' deleted.")

# ── POST /api/classes/{class_id}/grade-weights ────────────────────────────

class GradeWeightInput(BaseModel):
    category:   str
    weight_pct: float

class GradeWeightsSet(BaseModel):
    weights: list[GradeWeightInput]

@router.post("/{class_id}/grade-weights", response_model=ClassRecord)
async def set_grade_weights(
    class_id: str,
    body: GradeWeightsSet,
    user_id: str = Depends(get_current_user_id),
):
    """Manually set grade weights for a class."""
    try:
        supabase.table("classes").select("id").eq("id", class_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Class not found.")

    if not body.weights:
        raise HTTPException(status_code=400, detail="At least one weight required.")

    total = sum(w.weight_pct for w in body.weights)
    if total < 90 or total > 110:
        raise HTTPException(status_code=400, detail=f"Weights must sum to ~100%. Got {total}%.")

    try:
        # Delete existing manual weights (keep syllabus-linked ones separate)
        supabase.table("grade_weights").delete().eq("class_id", class_id).is_("file_id", "null").execute()
        # Insert new weights
        rows = [
            {
                "class_id":   class_id,
                "user_id":    user_id,
                "category":   w.category,
                "weight_pct": w.weight_pct,
                "confidence": "high",
            }
            for w in body.weights
        ]
        supabase.table("grade_weights").insert(rows).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not save weights: {exc}")

    return await get_class(class_id, user_id)
