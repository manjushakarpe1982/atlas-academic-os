"""
classes.py — Add Class API

POST   /api/classes                     Create class
PATCH  /api/classes/{id}               Update class name/term
POST   /api/classes/{id}/upload        Upload syllabus → start async parse
GET    /api/classes/{id}/parse-status  Poll parse progress
GET    /api/classes/{id}/draft         Get Claude parsed results
PATCH  /api/classes/{id}/draft         Save user edits to draft
POST   /api/classes/{id}/confirm       Write draft to DB tables
GET    /api/classes                    List classes
"""

import asyncio
import base64
import io
import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, UploadFile, File
from pydantic import BaseModel

import anthropic

from app.config import settings
from app.utils.supabase_client import supabase
from app.utils.auth_helpers import get_user_id

router = APIRouter(prefix="/api/classes", tags=["classes"])

# In-memory parse job store: { class_id: { status, progress, step, file_id } }
_parse_jobs: dict = {}

SYLLABUS_PROMPT = """You are an academic syllabus parser.
Your job is to extract structured course information from a syllabus image, PDF, or text.
Return ONLY valid JSON matching the required schema.

STRICT RULES:
* Return ONLY raw JSON.
* Do NOT include markdown, explanations, comments, or extra text.
* Never invent, assume, or hallucinate values.
* If a field cannot be confidently found, return null.
* Do NOT omit fields from the schema.
* Confidence must be one of: "high", "medium", or "low".
* If uncertain, use "medium" or "low" confidence.
* Grade weights should sum to approximately 100. If they do not, set confidence of uncertain items to "low".
* Dates must use YYYY-MM-DD format.
* If a date is missing a year, infer the year from the academic term if clearly available. Otherwise return null.
* If multiple instructors exist, return the primary instructor.
* If week information is unavailable, set week_hint to null.
* Never guess dates, percentages, instructor names, or grade weights.
* Return a maximum of 30 assessments and 25 topics.

Return this exact JSON schema:
{
  "course_name": string | null,
  "course_code": string | null,
  "instructor": string | null,
  "credit_hours": number | null,
  "grade_weights": [
    { "category": string, "weight_pct": number | null, "confidence": "high" | "medium" | "low" }
  ],
  "assessments": [
    { "title": string, "category": string | null, "due_date": "YYYY-MM-DD" | null, "confidence": "high" | "medium" | "low" }
  ],
  "topics": [
    { "title": string, "week_hint": number | null, "chapter_ref": string | null, "confidence": "high" | "medium" | "low" }
  ],
  "grade_scale_override": null
}"""


# ── Helpers ───────────────────────────────────────────────────────────────

def _get_user(request: Request) -> str:
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        return get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")


def _get_class(class_id: str, user_id: str) -> dict:
    result = supabase.table("classes").select("*").eq("id", class_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise HTTPException(404, "Class not found")
    return result.data


def _extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception:
        return ""


def _extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs)
    except Exception:
        return ""


async def _parse_with_claude(class_id: str, file_id: str, user_id: str,
                              file_bytes: bytes, mime_type: str, file_text: Optional[str]):
    """Background task — calls Claude, saves result to parsed_results using real file_id."""
    _parse_jobs[class_id]["step"] = "Sending to Claude AI..."
    _parse_jobs[class_id]["progress"] = 15
    try:
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

        if file_text:
            # PDF / DOCX — text mode
            content = [{"type": "text", "text": SYLLABUS_PROMPT + "\n\n---\nSYLLABUS CONTENT:\n" + file_text}]
        else:
            # Image — vision mode
            b64 = base64.standard_b64encode(file_bytes).decode("utf-8")
            content = [
                {"type": "text",  "text": SYLLABUS_PROMPT},
                {"type": "image", "source": {"type": "base64", "media_type": mime_type, "data": b64}},
            ]

        _parse_jobs[class_id].update({"progress": 40, "step": "Reading syllabus..."})

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=8192,
            messages=[{"role": "user", "content": content}],
        )

        _parse_jobs[class_id].update({"progress": 80, "step": "Processing results..."})

        raw_text = response.content[0].text.strip()
        # Strip markdown fences if present
        if raw_text.startswith("```"):
            parts = raw_text.split("```")
            raw_text = parts[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip()

        parsed = json.loads(raw_text)

        # Save to parsed_results using the real file_id from files table
        supabase.table("parsed_results").upsert({
            "file_id":      file_id,       # ← real FK to files.id
            "user_id":      user_id,
            "raw_result":   parsed,
            "suggestions":  [],
            "course_name":  parsed.get("course_name"),
            "instructor":   parsed.get("instructor"),
            "credit_hours": parsed.get("credit_hours"),
            "model_used":   "claude-haiku-4-5-20251001",
        }).execute()

        # Update file status to done
        supabase.table("files").update({"status": "done", "pipeline_step": 1}).eq("id", file_id).execute()

        _parse_jobs[class_id].update({"status": "done", "progress": 100, "step": "Complete"})
        print(f"[Parse] Done for class {class_id}")

    except json.JSONDecodeError as e:
        err = f"JSON parse error: {e}"
        _parse_jobs[class_id].update({"status": "failed", "progress": 0, "step": err})
        supabase.table("files").update({"status": "failed", "error_message": err}).eq("id", file_id).execute()
    except Exception as e:
        err = str(e)
        _parse_jobs[class_id].update({"status": "failed", "progress": 0, "step": err})
        supabase.table("files").update({"status": "failed", "error_message": err}).eq("id", file_id).execute()


# ── Models ────────────────────────────────────────────────────────────────

class CreateClassRequest(BaseModel):
    name: str = ""
    term: str = "Fall 2026"

class UpdateClassRequest(BaseModel):
    name: Optional[str] = None
    term: Optional[str] = None

class UpdateDraftRequest(BaseModel):
    course_name:          Optional[str]  = None
    course_code:          Optional[str]  = None
    instructor:           Optional[str]  = None
    credit_hours:         Optional[int]  = None
    grade_weights:        Optional[list] = None
    assessments:          Optional[list] = None
    topics:               Optional[list] = None
    grade_scale_override: Optional[dict] = None


# ── GET /api/classes ───────────────────────────────────────────────────────

@router.get("")
async def list_classes(request: Request):
    user_id = _get_user(request)
    result  = supabase.table("classes").select("*").eq("user_id", user_id).order("created_at").execute()
    return {"classes": result.data or []}


# ── POST /api/classes ──────────────────────────────────────────────────────

@router.post("", status_code=201)
async def create_class(req: CreateClassRequest, request: Request):
    user_id = _get_user(request)
    result  = supabase.table("classes").insert({
        "user_id": user_id,
        "name":    req.name.strip() or "Untitled Class",
        "term":    req.term,
    }).execute()
    if not result.data:
        raise HTTPException(500, "Failed to create class")
    return result.data[0]


# ── PATCH /api/classes/{id} ────────────────────────────────────────────────

@router.patch("/{class_id}")
async def update_class(class_id: str, req: UpdateClassRequest, request: Request):
    user_id = _get_user(request)
    _get_class(class_id, user_id)
    updates = {k: v for k, v in req.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    result = supabase.table("classes").update(updates).eq("id", class_id).execute()
    return result.data[0]


# ── POST /api/classes/{id}/upload ──────────────────────────────────────────

@router.post("/{class_id}/upload")
async def upload_syllabus(class_id: str, request: Request, file: UploadFile = File(...)):
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    allowed = {
        "application/pdf":   "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "image/jpeg": "jpg",
        "image/jpg":  "jpg",
        "image/png":  "png",
    }
    ct = file.content_type or ""
    if ct not in allowed:
        raise HTTPException(400, f"Unsupported file type: {ct}. Allowed: PDF, DOCX, JPG, PNG")

    file_bytes = await file.read()
    if len(file_bytes) > 50 * 1024 * 1024:
        raise HTTPException(400, "File too large. Maximum 50MB.")

    # 1. Insert file record FIRST to get a real file_id
    file_result = supabase.table("files").insert({
        "user_id":       user_id,
        "class_id":      class_id,
        "original_name": file.filename or "syllabus",
        "mime_type":     ct,
        "size_bytes":    len(file_bytes),
        "extension":     allowed[ct],
        "category":      "syllabus",
        "storage_bucket": settings.storage_bucket,
        "storage_path":  "",        # will update after upload
        "status":        "uploading",
        "pipeline_step": 0,
    }).execute()

    if not file_result.data:
        raise HTTPException(500, "Failed to create file record")

    file_id      = file_result.data[0]["id"]
    storage_path = f"syllabi/{user_id}/{file_id}.{allowed[ct]}"

    # 2. Upload to Supabase Storage
    try:
        supabase.storage.from_(settings.storage_bucket).upload(
            storage_path,
            file_bytes,
            {"content-type": ct, "upsert": "true"},
        )
    except Exception as e:
        supabase.table("files").update({"status": "failed", "error_message": str(e)}).eq("id", file_id).execute()
        raise HTTPException(500, f"Storage upload failed: {e}")

    # 3. Update file record with storage path + parsing status
    supabase.table("files").update({
        "storage_path": storage_path,
        "status":       "parsing",
    }).eq("id", file_id).execute()

    # 4. Update class with syllabus_file_id
    supabase.table("classes").update({"syllabus_file_id": file_id}).eq("id", class_id).execute()

    # 5. Extract text for PDF/DOCX; None for images (Claude Vision)
    file_text = None
    if ct == "application/pdf":
        file_text = _extract_text_from_pdf(file_bytes)
    elif "wordprocessingml" in ct:
        file_text = _extract_text_from_docx(file_bytes)

    # 6. Start background parse
    _parse_jobs[class_id] = {
        "status":   "parsing",
        "progress": 5,
        "step":     "Upload complete, starting AI...",
        "file_id":  file_id,
    }
    asyncio.create_task(_parse_with_claude(class_id, file_id, user_id, file_bytes, ct, file_text))

    return {
        "file_id": file_id,
        "status":  "parsing",
        "message": "Syllabus uploaded. AI parsing started.",
    }


# ── GET /api/classes/{id}/parse-status ────────────────────────────────────

@router.get("/{class_id}/parse-status")
async def parse_status(class_id: str, request: Request):
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    job = _parse_jobs.get(class_id)
    if not job:
        # Check DB in case server restarted
        cls = supabase.table("classes").select("syllabus_file_id").eq("id", class_id).single().execute()
        fid = cls.data.get("syllabus_file_id") if cls.data else None
        if fid:
            pr = supabase.table("parsed_results").select("id").eq("file_id", fid).execute()
            if pr.data:
                return {"status": "done", "progress": 100, "step": "Complete"}
        return {"status": "pending", "progress": 0, "step": "Not started"}

    return job


# ── GET /api/classes/{id}/draft ────────────────────────────────────────────

@router.get("/{class_id}/draft")
async def get_draft(class_id: str, request: Request):
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    cls = supabase.table("classes").select("syllabus_file_id").eq("id", class_id).single().execute()
    fid = cls.data.get("syllabus_file_id") if cls.data else None
    if not fid:
        raise HTTPException(404, "No syllabus uploaded yet.")

    result = supabase.table("parsed_results").select("raw_result").eq("file_id", fid).execute()
    if not result.data:
        raise HTTPException(404, "Parsing not complete yet.")

    return result.data[0]["raw_result"]


# ── PATCH /api/classes/{id}/draft ─────────────────────────────────────────

@router.patch("/{class_id}/draft")
async def update_draft(class_id: str, req: UpdateDraftRequest, request: Request):
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    cls = supabase.table("classes").select("syllabus_file_id").eq("id", class_id).single().execute()
    fid = cls.data.get("syllabus_file_id") if cls.data else None
    if not fid:
        raise HTTPException(404, "No syllabus uploaded yet.")

    result = supabase.table("parsed_results").select("raw_result").eq("file_id", fid).execute()
    if not result.data:
        raise HTTPException(404, "No draft found.")

    current = result.data[0]["raw_result"] or {}
    merged  = {**current, **req.model_dump(exclude_none=True)}

    supabase.table("parsed_results").update({"raw_result": merged}).eq("file_id", fid).execute()
    return {"saved": True, "draft": merged}


# ── POST /api/classes/{id}/confirm ────────────────────────────────────────

@router.post("/{class_id}/confirm")
async def confirm_class(class_id: str, request: Request):
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    cls = supabase.table("classes").select("syllabus_file_id").eq("id", class_id).single().execute()
    fid = cls.data.get("syllabus_file_id") if cls.data else None
    if not fid:
        raise HTTPException(404, "No syllabus uploaded yet.")

    result = supabase.table("parsed_results").select("raw_result").eq("file_id", fid).execute()
    if not result.data:
        raise HTTPException(404, "No draft to confirm.")

    draft = result.data[0]["raw_result"] or {}

    # Update classes
    supabase.table("classes").update({
        "name":         draft.get("course_name") or draft.get("course_code") or "Untitled",
        "instructor":   draft.get("instructor"),
        "credit_hours": draft.get("credit_hours"),
    }).eq("id", class_id).execute()

    # Replace grade_weights
    supabase.table("grade_weights").delete().eq("class_id", class_id).execute()
    for w in (draft.get("grade_weights") or []):
        if w.get("category") and w.get("weight_pct") is not None:
            supabase.table("grade_weights").insert({
                "class_id":   class_id, "user_id": user_id,
                "category":   w["category"], "weight_pct": w["weight_pct"],
                "confidence": w.get("confidence", "medium"),
            }).execute()

    # Replace assessments
    supabase.table("assessments").delete().eq("class_id", class_id).execute()
    for a in (draft.get("assessments") or []):
        if a.get("title"):
            supabase.table("assessments").insert({
                "class_id":   class_id, "user_id": user_id,
                "title":      a["title"], "category": a.get("category"),
                "due_date":   a.get("due_date"), "confidence": a.get("confidence", "medium"),
                "source":     "syllabus",
            }).execute()

    # Replace topics
    supabase.table("topics").delete().eq("class_id", class_id).execute()
    for t in (draft.get("topics") or []):
        if t.get("title"):
            supabase.table("topics").insert({
                "class_id":    class_id, "user_id": user_id,
                "title":       t["title"], "week_hint": t.get("week_hint"),
                "chapter_ref": t.get("chapter_ref"), "confidence": t.get("confidence", "medium"),
                "source":      "syllabus",
            }).execute()

    supabase.table("files").update({"status": "done"}).eq("id", fid).execute()
    return {"class_id": class_id, "status": "confirmed"}

# ── GET /api/classes/{id} ─────────────────────────────────────────────────

@router.get("/{class_id}")
async def get_class_by_id(class_id: str, request: Request):
    user_id = _get_user(request)
    cls = _get_class(class_id, user_id)
    return cls


# ── Models ────────────────────────────────────────────────────────────────

class GradeEntry(BaseModel):
    assessment: str
    category:   str
    score:      float
    total:      float

class SaveGradesRequest(BaseModel):
    grades: list[GradeEntry]


# ── POST /api/classes/{id}/grades ─────────────────────────────────────────

@router.post("/{class_id}/grades")
async def save_grades(class_id: str, req: SaveGradesRequest, request: Request):
    """Save student-entered grades for a class. Replaces existing manual grades."""
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    if not req.grades:
        return {"saved": 0}

    # Delete existing manual grades for this class
    supabase.table("grades").delete() \
        .eq("class_id", class_id) \
        .eq("user_id", user_id) \
        .eq("source", "manual") \
        .execute()

    # Insert new grades
    saved = 0
    for g in req.grades:
        if g.assessment.strip() and g.total > 0:
            supabase.table("grades").insert({
                "user_id":    user_id,
                "class_id":   class_id,
                "category":   g.category,
                "title":      g.assessment.strip(),
                "score":      g.score,
                "max_score":  g.total,
                "source":     "manual",
            }).execute()
            saved += 1

    return {"saved": saved, "message": f"{saved} grade(s) saved successfully."}


# ── POST /api/classes/{id}/grades/add ──────────────────────────────────────

@router.post("/{class_id}/grades/add")
async def add_single_grade(class_id: str, request: Request):
    """Add a single grade without deleting existing grades."""
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    body = await request.json()
    title = (body.get("title") or "").strip()
    category = body.get("category", "")
    score = body.get("score")
    max_score = body.get("max_score")

    if not title:
        raise HTTPException(400, "Title is required")
    if score is None or max_score is None or float(max_score) <= 0:
        raise HTTPException(400, "Valid score and max_score required")

    result = supabase.table("grades").insert({
        "user_id":   user_id,
        "class_id":  class_id,
        "category":  category,
        "title":     title,
        "score":     float(score),
        "max_score": float(max_score),
        "source":    "manual",
    }).execute()

    return {"grade": result.data[0] if result.data else None}

@router.get("/{class_id}/grades")
async def get_grades(class_id: str, request: Request):
    """Get all saved grades for a class."""
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    result = supabase.table("grades") \
        .select("*") \
        .eq("class_id", class_id) \
        .eq("user_id", user_id) \
        .order("created_at") \
        .execute()

    return {"grades": result.data or []}


# ── PATCH /api/classes/{id}/grades/{grade_id} ──────────────────────────────

@router.patch("/{class_id}/grades/{grade_id}")
async def update_grade(class_id: str, grade_id: str, request: Request):
    """Update a single grade."""
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    body = await request.json()
    update_data = {}
    if "title" in body:    update_data["title"] = body["title"]
    if "category" in body: update_data["category"] = body["category"]
    if "score" in body:    update_data["score"] = body["score"]
    if "max_score" in body: update_data["max_score"] = body["max_score"]

    if not update_data:
        raise HTTPException(400, "No fields to update")

    result = supabase.table("grades") \
        .update(update_data) \
        .eq("id", grade_id) \
        .eq("class_id", class_id) \
        .eq("user_id", user_id) \
        .execute()

    if not result.data:
        raise HTTPException(404, "Grade not found")

    return {"grade": result.data[0]}


# ── DELETE /api/classes/{id}/grades/{grade_id} ─────────────────────────────

@router.delete("/{class_id}/grades/{grade_id}")
async def delete_grade(class_id: str, grade_id: str, request: Request):
    """Delete a single grade."""
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    result = supabase.table("grades") \
        .delete() \
        .eq("id", grade_id) \
        .eq("class_id", class_id) \
        .eq("user_id", user_id) \
        .execute()

    return {"deleted": True}


# ── GET /api/classes/{id}/grade-weights ────────────────────────────────────

@router.get("/{class_id}/grade-weights")
async def get_grade_weights(class_id: str, request: Request):
    """Get grade weights for a class."""
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    result = supabase.table("grade_weights") \
        .select("*") \
        .eq("class_id", class_id) \
        .eq("user_id", user_id) \
        .order("weight_pct", desc=True) \
        .execute()

    return {"weights": result.data or []}


# ── GET /api/classes/{id}/assignments ──────────────────────────────────────

@router.get("/{class_id}/assignments")
async def get_assignments(class_id: str, request: Request):
    """
    Returns assignments for a class with stats and completion status.
    Combines assessments + grades to determine what's done.
    """
    from datetime import datetime, timedelta
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    today = datetime.utcnow().date()
    week_end = (today + timedelta(days=7)).isoformat()
    today_str = today.isoformat()

    # Fetch assessments for this class
    assess_res = supabase.table("assessments") \
        .select("id, title, category, due_date") \
        .eq("class_id", class_id).eq("user_id", user_id) \
        .order("due_date").execute()
    assessments = assess_res.data or []

    # Fetch grade weights for weight lookup
    weights_res = supabase.table("grade_weights") \
        .select("category, weight_pct") \
        .eq("class_id", class_id).eq("user_id", user_id).execute()
    weight_map = {w.get("category", "").lower(): w.get("weight_pct", 0) for w in (weights_res.data or [])}

    # Fetch grades to check completion
    grades_res = supabase.table("grades") \
        .select("title, category") \
        .eq("class_id", class_id).eq("user_id", user_id).execute()
    grade_titles = {(g.get("title", "").lower().strip(), g.get("category", "").lower().strip()) for g in (grades_res.data or [])}

    # Build assignment list with computed fields
    items = []
    stats = {"upcoming": 0, "overdue": 0, "completed": 0, "due_this_week": 0}

    for a in assessments:
        title = a.get("title", "")
        category = a.get("category", "")
        due_date = a.get("due_date", "")
        weight = weight_map.get(category.lower(), 0)

        # Check if completed (matching grade exists)
        is_completed = (title.lower().strip(), category.lower().strip()) in grade_titles

        # Calculate days left
        days_left = None
        if due_date:
            try:
                due_dt = datetime.strptime(due_date, "%Y-%m-%d").date()
                days_left = (due_dt - today).days
            except Exception:
                pass

        # Determine priority
        if is_completed:
            priority = "COMPLETED"
            stats["completed"] += 1
        elif days_left is not None and days_left < 0:
            priority = "OVERDUE"
            stats["overdue"] += 1
        elif days_left is not None and days_left <= 3:
            priority = "HIGH"
            stats["upcoming"] += 1
        elif days_left is not None and days_left <= 7:
            priority = "MEDIUM"
            stats["upcoming"] += 1
        else:
            priority = "LOW"
            stats["upcoming"] += 1

        # Due this week
        if due_date and today_str <= due_date <= week_end and not is_completed:
            stats["due_this_week"] += 1

        # Action button text
        if is_completed:
            action = "Done"
        elif category.lower() in ("exam", "midterm", "final"):
            action = "Study"
        elif category.lower() == "quiz":
            action = "Prepare"
        else:
            action = "View"

        # Due text
        if is_completed:
            due_text = f"Completed"
        elif days_left is not None:
            if days_left == 0:
                due_text = f"Due Today, {due_date}"
            elif days_left == 1:
                due_text = f"Due Tomorrow, {_fmt_date(due_date)}"
            elif days_left > 1:
                due_text = f"Due in {days_left} days, {_fmt_date(due_date)}"
            else:
                due_text = f"Overdue by {abs(days_left)} days, {_fmt_date(due_date)}"
        else:
            due_text = due_date or "No date"

        items.append({
            "id":        a.get("id"),
            "title":     title,
            "category":  category,
            "due_date":  due_date,
            "days_left": days_left,
            "weight":    weight,
            "priority":  priority,
            "action":    action,
            "due_text":  due_text,
            "completed": is_completed,
        })

    # Atlas insight
    high_items = [i for i in items if i["priority"] in ("HIGH", "OVERDUE")]
    high_weight = sum(i["weight"] for i in high_items)
    insight = None
    if high_items:
        insight = f"You have {len(high_items)} high priority assessment{'s' if len(high_items) != 1 else ''} coming up that {'are' if len(high_items) != 1 else 'is'} worth {high_weight}% of your grade."

    return {"assignments": items, "stats": stats, "insight": insight}


def _fmt_date(d: str) -> str:
    """Format 2026-06-25 → Jun 25"""
    try:
        from datetime import datetime
        dt = datetime.strptime(d, "%Y-%m-%d")
        return dt.strftime("%b %d").replace(" 0", " ")
    except Exception:
        return d


# ── GET /api/classes/{id}/topics ───────────────────────────────────────────

@router.get("/{class_id}/topics")
async def get_topics(class_id: str, request: Request):
    """Get all topics for a class."""
    user_id = _get_user(request)
    _get_class(class_id, user_id)

    result = supabase.table("topics") \
        .select("*") \
        .eq("class_id", class_id) \
        .eq("user_id", user_id) \
        .order("created_at") \
        .execute()

    return {"topics": result.data or []}


# ── GET /api/classes/{id}/overview ─────────────────────────────────────────

@router.get("/{class_id}/overview")
async def get_class_overview(class_id: str, request: Request):
    """
    Returns overview data for a class:
    - classInfo: instructor, term, credits
    - currentGrade: average grade %
    - syllabusFile: uploaded file info
    - insight: strongest + weakest category
    - nextDeadline: nearest upcoming event
    """
    from datetime import datetime
    user_id = _get_user(request)
    cls = _get_class(class_id, user_id)

    # ── Class Info ──
    class_info = {
        "name":         cls.get("name", ""),
        "instructor":   cls.get("instructor"),
        "term":         cls.get("term"),
        "credit_hours": cls.get("credit_hours"),
    }

    # ── Current Grade (average from grades table) ──
    grades_res = supabase.table("grades") \
        .select("score, max_score, category") \
        .eq("class_id", class_id).eq("user_id", user_id).execute()
    grades = grades_res.data or []

    current_grade = None
    total_grades = len(grades)
    if grades:
        try:
            current_grade = round(
                sum(g["score"] / g["max_score"] * 100 for g in grades) / len(grades)
            )
        except (ZeroDivisionError, TypeError, KeyError):
            pass

    # ── Insight: strongest + weakest category ──
    category_grades: dict[str, list] = {}
    for g in grades:
        cat = g.get("category", "Other")
        if cat not in category_grades:
            category_grades[cat] = []
        try:
            category_grades[cat].append(g["score"] / g["max_score"] * 100)
        except (ZeroDivisionError, TypeError, KeyError):
            pass

    strongest = None
    weakest = None
    if category_grades:
        cat_avgs = {cat: round(sum(scores) / len(scores)) for cat, scores in category_grades.items() if scores}
        if cat_avgs:
            best_cat = max(cat_avgs, key=cat_avgs.get)
            worst_cat = min(cat_avgs, key=cat_avgs.get)
            strongest = {"category": best_cat, "avg": cat_avgs[best_cat]}
            if best_cat != worst_cat:
                weakest = {"category": worst_cat, "avg": cat_avgs[worst_cat]}

    # ── Syllabus File ──
    file_res = supabase.table("files") \
        .select("id, original_name, created_at") \
        .eq("class_id", class_id).eq("user_id", user_id) \
        .order("created_at", desc=True).limit(1).execute()
    syllabus_file = None
    if file_res.data:
        f = file_res.data[0]
        syllabus_file = {
            "id":   f.get("id"),
            "name": f.get("original_name", "Syllabus"),
            "date": f.get("created_at"),
        }

    # ── Upcoming Deadlines (from assessments + calendar events for this class) ──
    now_str = datetime.utcnow().date().isoformat()
    now_dt = datetime.utcnow().date()

    deadlines = []

    # Source 1: assessments table
    assess_res = supabase.table("assessments") \
        .select("title, category, due_date") \
        .eq("class_id", class_id).eq("user_id", user_id) \
        .gte("due_date", now_str) \
        .order("due_date").limit(10).execute()

    for a in (assess_res.data or []):
        due = a.get("due_date", "")
        days_left = None
        if due:
            try:
                days_left = (datetime.strptime(due, "%Y-%m-%d").date() - now_dt).days
            except Exception:
                pass
        deadlines.append({
            "title":     a.get("title", ""),
            "category":  a.get("category", ""),
            "due_date":  due,
            "days_left": days_left,
            "source":    "syllabus",
        })

    # Source 2: calendar events matched by class name
    class_name = cls.get("name", "").lower()
    if class_name:
        cal_res = supabase.table("calendar_events") \
            .select("title, start_date, category") \
            .eq("user_id", user_id) \
            .gte("start_date", datetime.utcnow().isoformat()) \
            .order("start_date").limit(30).execute()

        existing_titles = {d["title"].lower().strip() for d in deadlines}
        for ev in (cal_res.data or []):
            ev_title = ev.get("title") or ""
            if class_name not in ev_title.lower():
                continue
            if ev_title.lower().strip() in existing_titles:
                continue
            due = (ev.get("start_date") or "")[:10]
            days_left = None
            try:
                days_left = (datetime.strptime(due, "%Y-%m-%d").date() - now_dt).days
            except Exception:
                pass
            deadlines.append({
                "title":     ev_title,
                "category":  ev.get("category", ""),
                "due_date":  due,
                "days_left": days_left,
                "source":    "calendar",
            })

    # Sort by due_date
    deadlines.sort(key=lambda x: x.get("due_date") or "9999")

    return {
        "classInfo":     class_info,
        "currentGrade":  current_grade,
        "totalGrades":   total_grades,
        "insight":       {"strongest": strongest, "weakest": weakest},
        "syllabusFile":  syllabus_file,
        "deadlines":     deadlines,
    }


# ── DELETE /api/classes/{id} ──────────────────────────────────────────────

@router.delete("/{class_id}")
async def delete_class(class_id: str, request: Request):
    """Delete a class and ALL associated data (grades, weights, assessments, topics, files, parsed results)."""
    user_id = _get_user(request)

    # Verify class exists and belongs to user
    cls = _get_class(class_id, user_id)

    class_name = cls.get("name", "Unknown Class")

    # Delete all related data in order (child tables first)
    supabase.table("grades").delete().eq("class_id", class_id).eq("user_id", user_id).execute()
    supabase.table("grade_weights").delete().eq("class_id", class_id).execute()
    supabase.table("assessments").delete().eq("class_id", class_id).execute()
    supabase.table("topics").delete().eq("class_id", class_id).execute()
    supabase.table("parsed_results").delete().eq("class_id", class_id).execute()

    # Delete files from storage + DB
    file_result = supabase.table("files").select("id, storage_bucket, storage_path") \
        .eq("class_id", class_id).eq("user_id", user_id).execute()

    for f in (file_result.data or []):
        if f.get("storage_bucket") and f.get("storage_path"):
            try:
                supabase.storage.from_(f["storage_bucket"]).remove([f["storage_path"]])
            except Exception:
                pass

    supabase.table("files").delete().eq("class_id", class_id).eq("user_id", user_id).execute()

    # Delete the class itself
    supabase.table("classes").delete().eq("id", class_id).eq("user_id", user_id).execute()

    print(f"[DeleteClass] Deleted class '{class_name}' ({class_id}) for user {user_id}")

    return {"message": f"Class '{class_name}' and all associated data deleted successfully", "id": class_id}


# ============================================================================
# FILE MANAGEMENT — LIST & DELETE
# ============================================================================

@router.get("/files/all")
async def list_user_files(request: Request):
    """List all uploaded files for the current user, with class names."""
    user_id = _get_user(request)

    # Get all files for the user
    file_result = supabase.table("files") \
        .select("id, original_name, mime_type, size_bytes, extension, category, status, class_id, created_at") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()

    files = file_result.data or []

    # Get all classes for the user to map class_id → name
    class_result = supabase.table("classes") \
        .select("id, name") \
        .eq("user_id", user_id) \
        .execute()

    class_map = {c["id"]: c["name"] for c in (class_result.data or [])}

    # Attach class_name to each file
    for f in files:
        f["class_name"] = class_map.get(f.get("class_id"), "Unknown Class") if f.get("class_id") else "No Class"

    return {"files": files}


@router.delete("/files/{file_id}")
async def delete_user_file(file_id: str, request: Request):
    """Delete a specific uploaded file."""
    user_id = _get_user(request)

    # Verify the file belongs to the user
    file_result = supabase.table("files") \
        .select("id, storage_bucket, storage_path") \
        .eq("id", file_id) \
        .eq("user_id", user_id) \
        .execute()

    if not file_result.data:
        raise HTTPException(404, "File not found")

    file_data = file_result.data[0]

    # Try to delete from Supabase Storage if path exists
    if file_data.get("storage_bucket") and file_data.get("storage_path"):
        try:
            supabase.storage.from_(file_data["storage_bucket"]).remove([file_data["storage_path"]])
        except Exception as e:
            print(f"Warning: Could not delete from storage: {e}")

    # Delete the database record
    supabase.table("files").delete().eq("id", file_id).eq("user_id", user_id).execute()

    return {"message": "File deleted successfully", "id": file_id}


@router.delete("/files/all/delete")
async def delete_all_user_files(request: Request):
    """Delete all uploaded files for the current user."""
    user_id = _get_user(request)

    # Get all files to clean up storage
    file_result = supabase.table("files") \
        .select("id, storage_bucket, storage_path") \
        .eq("user_id", user_id) \
        .execute()

    files = file_result.data or []
    deleted_count = 0

    for f in files:
        # Try to delete from storage
        if f.get("storage_bucket") and f.get("storage_path"):
            try:
                supabase.storage.from_(f["storage_bucket"]).remove([f["storage_path"]])
            except Exception:
                pass

    # Delete all file records from DB
    if files:
        supabase.table("files").delete().eq("user_id", user_id).execute()
        deleted_count = len(files)

    return {"message": f"{deleted_count} file(s) deleted successfully", "deleted_count": deleted_count}


# ── POST /api/study/summary ────────────────────────────────────────────────

from app.config import settings
import anthropic as anthropic_lib

@router.post("/study/summary")
async def generate_study_summary(request: Request):
    """Generate or retrieve an AI-powered study summary for a topic."""
    import json as json_lib
    user_id = _get_user(request)
    body = await request.json()
    class_name = body.get("class_name", "")
    class_id = body.get("class_id", "")
    topic_id = body.get("topic_id", "")
    topic_title = body.get("topic_title", "")
    topic_description = body.get("topic_description", "")
    regenerate = body.get("regenerate", False)

    if not class_name or not topic_title:
        raise HTTPException(400, "class_name and topic_title required")

    # ── Check DB for existing summary (unless regenerate) ──
    if topic_id and not regenerate:
        try:
            existing = supabase.table("study_summaries") \
                .select("summary_json, updated_at, feedback") \
                .eq("user_id", user_id) \
                .eq("topic_id", topic_id) \
                .limit(1).execute()
            if existing.data:
                return {
                    "summary": existing.data[0]["summary_json"],
                    "cached": True,
                    "updated_at": existing.data[0]["updated_at"],
                    "feedback": existing.data[0].get("feedback"),
                }
        except Exception as check_err:
            import logging
            logging.error(f"Failed to check cached summary: {check_err}")

    # ── Generate with AI ──
    if not settings.anthropic_api_key:
        return {"summary": None, "error": "AI not configured"}

    try:
        client = anthropic_lib.Anthropic(api_key=settings.anthropic_api_key)

        system_prompt = (
            "You are Atlas AI, a study assistant for college students.\n"
            "Your job is to create concise, accurate study summaries from academic course content.\n\n"
            "RULES:\n"
            "- Focus only on the provided topic. Do not include unrelated information.\n"
            "- Use simple, student-friendly language. Explain concepts clearly.\n"
            "- Prioritize accuracy — never fabricate facts, formulas, or definitions.\n"
            "- If information is missing or uncertain, say so instead of guessing.\n"
            "- Highlight key definitions, important facts, formulas, and concepts.\n"
            "- Include 5-8 key concepts ordered from foundational to advanced.\n"
            "- Each definition should be concise (1-2 sentences) but complete enough to study from.\n"
            "- The 'remember' field should contain the single most critical takeaway.\n"
            "- The 'connections' field should link this topic to related concepts in the same course.\n"
            "- The 'studyTip' should be a specific, actionable study technique for this topic.\n"
            "- The 'keyTakeaways' field must contain 3-5 important summary points.\n\n"
            "RESPONSE FORMAT: JSON only. No markdown fences. No preamble. No extra text.\n"
            "{\n"
            '  "title": "Topic Title",\n'
            '  "keyConcepts": [\n'
            '    {"term": "Term Name", "definition": "Clear, concise definition"}\n'
            '  ],\n'
            '  "remember": "The single most important takeaway",\n'
            '  "connections": "How this topic connects to other concepts in the course",\n'
            '  "studyTip": "A specific, actionable study technique for this topic",\n'
            '  "keyTakeaways": [\n'
            '    "Important point 1",\n'
            '    "Important point 2",\n'
            '    "Important point 3"\n'
            '  ]\n'
            "}"
        )

        user_message = f"Generate a study summary for the topic \"{topic_title}\" in the class \"{class_name}\"."
        if regenerate:
            import random
            user_message += f"\n\nIMPORTANT: This is a REGENERATION request. Create a COMPLETELY DIFFERENT summary with different key concepts, different examples, and different explanations. Variation seed: {random.randint(1000,9999)}"
        if topic_description:
            user_message += f"\n\nTopic description: {topic_description}"

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1500,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

        summary_data = json_lib.loads(raw)

        # ── Save to DB ──
        save_status = "skipped"
        save_error = None
        print(f"[SUMMARY SAVE] topic_id={topic_id}, class_id={class_id}, user_id={user_id}")

        if topic_id and class_id:
            try:
                from datetime import datetime
                now_ts = datetime.utcnow().isoformat()

                existing = supabase.table("study_summaries") \
                    .select("id") \
                    .eq("user_id", user_id) \
                    .eq("topic_id", topic_id) \
                    .limit(1).execute()

                print(f"[SUMMARY SAVE] existing check: {existing.data}")

                if existing.data:
                    supabase.table("study_summaries") \
                        .update({"summary_json": summary_data, "updated_at": now_ts}) \
                        .eq("id", existing.data[0]["id"]) \
                        .execute()
                    save_status = "updated"
                else:
                    ins_result = supabase.table("study_summaries").insert({
                        "user_id":      user_id,
                        "class_id":     class_id,
                        "topic_id":     topic_id,
                        "summary_json": summary_data,
                    }).execute()
                    print(f"[SUMMARY SAVE] insert result: {ins_result.data}")
                    save_status = "inserted"
            except Exception as save_err:
                save_status = "failed"
                save_error = str(save_err)
                print(f"[SUMMARY SAVE] ERROR: {save_err}")
        else:
            print(f"[SUMMARY SAVE] SKIPPED - topic_id or class_id empty")

        return {"summary": summary_data, "cached": False, "save_status": save_status, "save_error": save_error}

    except Exception as e:
        return {"summary": None, "error": str(e)}


# ── POST /api/classes/study/flashcards ─────────────────────────────────────

@router.post("/study/flashcards")
async def generate_study_flashcards(request: Request):
    """Generate or retrieve AI-powered flashcards for a topic."""
    import json as json_lib
    user_id = _get_user(request)
    body = await request.json()
    class_name = body.get("class_name", "")
    class_id = body.get("class_id", "")
    topic_id = body.get("topic_id", "")
    topic_title = body.get("topic_title", "")
    topic_description = body.get("topic_description", "")
    regenerate = body.get("regenerate", False)

    if not class_name or not topic_title:
        raise HTTPException(400, "class_name and topic_title required")

    # ── Check DB cache ──
    if topic_id and not regenerate:
        try:
            existing = supabase.table("study_flashcards") \
                .select("flashcards_json, updated_at") \
                .eq("user_id", user_id) \
                .eq("topic_id", topic_id) \
                .limit(1).execute()
            if existing.data:
                return {
                    "flashcards": existing.data[0]["flashcards_json"],
                    "cached": True,
                    "updated_at": existing.data[0]["updated_at"],
                }
        except Exception as e:
            print(f"[FLASHCARDS CHECK] ERROR: {e}")

    # ── Generate with AI ──
    if not settings.anthropic_api_key:
        return {"flashcards": None, "error": "AI not configured"}

    try:
        client = anthropic_lib.Anthropic(api_key=settings.anthropic_api_key)

        system_prompt = (
            "You are Atlas AI, an educational assistant that creates high-quality study flashcards.\n"
            "Your task is to generate flashcards from the provided topic content.\n\n"
            "RULES:\n"
            "- Create concise question-answer flashcards.\n"
            "- Focus on important concepts, definitions, formulas, processes, and facts.\n"
            "- Questions should be clear and specific.\n"
            "- Answers should be short and easy to memorize (1-2 sentences max).\n"
            "- Avoid duplicate flashcards.\n"
            "- Use simple, student-friendly language.\n"
            "- Generate between 10 and 20 flashcards depending on topic complexity.\n"
            "- Do not invent information not present in the source material.\n"
            "- If information is uncertain, skip it rather than guessing.\n"
            "- Each flashcard should test ONE concept only.\n"
            "- Order flashcards from foundational to advanced.\n"
            "- If a concept involves a formula, include it in the answer.\n"
            "- Assign difficulty: 'easy' for definitions, 'medium' for explanations, 'hard' for application.\n\n"
            "RESPONSE FORMAT: JSON only. No markdown fences. No preamble. No extra text.\n"
            "{\n"
            '  "title": "Topic Title",\n'
            '  "totalCards": 12,\n'
            '  "cards": [\n'
            '    {"id": 1, "question": "Clear specific question", "answer": "Short memorable answer", "difficulty": "easy|medium|hard"}\n'
            '  ]\n'
            "}"
        )

        user_message = f"Generate study flashcards for the topic \"{topic_title}\" in the class \"{class_name}\"."
        if regenerate:
            import random
            user_message += f"\n\nIMPORTANT: This is a REGENERATION request. Generate COMPLETELY DIFFERENT flashcards covering different aspects. Use different questions and angles. Variation seed: {random.randint(1000,9999)}"
        if topic_description:
            user_message += f"\n\nTopic description: {topic_description}"

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

        flashcards_data = json_lib.loads(raw)

        # ── Save to DB ──
        save_status = "skipped"
        if topic_id and class_id:
            try:
                from datetime import datetime
                now_ts = datetime.utcnow().isoformat()

                existing = supabase.table("study_flashcards") \
                    .select("id") \
                    .eq("user_id", user_id) \
                    .eq("topic_id", topic_id) \
                    .limit(1).execute()

                if existing.data:
                    supabase.table("study_flashcards") \
                        .update({"flashcards_json": flashcards_data, "updated_at": now_ts}) \
                        .eq("id", existing.data[0]["id"]) \
                        .execute()
                    save_status = "updated"
                else:
                    supabase.table("study_flashcards").insert({
                        "user_id":         user_id,
                        "class_id":        class_id,
                        "topic_id":        topic_id,
                        "flashcards_json": flashcards_data,
                    }).execute()
                    save_status = "inserted"
                print(f"[FLASHCARDS SAVE] {save_status}")
            except Exception as save_err:
                save_status = "failed"
                print(f"[FLASHCARDS SAVE] ERROR: {save_err}")

        return {"flashcards": flashcards_data, "cached": False, "save_status": save_status}

    except Exception as e:
        return {"flashcards": None, "error": str(e)}


# ── POST /api/classes/study/quiz ───────────────────────────────────────────

@router.post("/study/quiz")
async def generate_study_quiz(request: Request):
    """Generate or retrieve AI-powered practice quiz for a topic."""
    import json as json_lib
    user_id = _get_user(request)
    body = await request.json()
    class_name = body.get("class_name", "")
    class_id = body.get("class_id", "")
    topic_id = body.get("topic_id", "")
    topic_title = body.get("topic_title", "")
    topic_description = body.get("topic_description", "")
    regenerate = body.get("regenerate", False)

    if not class_name or not topic_title:
        raise HTTPException(400, "class_name and topic_title required")

    # ── Check DB cache ──
    if topic_id and not regenerate:
        try:
            existing = supabase.table("study_quizzes") \
                .select("quiz_json, updated_at") \
                .eq("user_id", user_id) \
                .eq("topic_id", topic_id) \
                .limit(1).execute()
            if existing.data:
                return {
                    "quiz": existing.data[0]["quiz_json"],
                    "cached": True,
                    "updated_at": existing.data[0]["updated_at"],
                }
        except Exception as e:
            print(f"[QUIZ CHECK] ERROR: {e}")

    # ── Generate with AI ──
    if not settings.anthropic_api_key:
        return {"quiz": None, "error": "AI not configured"}

    try:
        client = anthropic_lib.Anthropic(api_key=settings.anthropic_api_key)

        system_prompt = (
            "You are Atlas AI, an educational assistant that creates practice quizzes for students.\n"
            "Your task is to generate high-quality quiz questions from the provided topic content.\n\n"
            "RULES:\n"
            "- Create multiple-choice questions (MCQs).\n"
            "- Focus on important concepts, definitions, facts, formulas, and processes.\n"
            "- Questions should test understanding, not just memorization.\n"
            "- Each question must have exactly 4 answer choices.\n"
            "- Only one answer should be correct.\n"
            "- Include a brief explanation for the correct answer.\n"
            "- Avoid duplicate questions.\n"
            "- Use simple, student-friendly language.\n"
            "- Generate between 10 and 15 questions depending on topic complexity.\n"
            "- Do not invent information that is not present in the source material.\n"
            "- Distractors (wrong options) should be plausible but clearly wrong.\n"
            "- Avoid 'all of the above' or 'none of the above' options.\n"
            "- Order questions from easy to hard.\n"
            "- Assign difficulty: 'easy' for recall, 'medium' for understanding, 'hard' for application.\n\n"
            "RESPONSE FORMAT: JSON only. No markdown fences. No preamble. No extra text.\n"
            "{\n"
            '  "title": "Topic Title Quiz",\n'
            '  "totalQuestions": 10,\n'
            '  "questions": [\n'
            '    {\n'
            '      "id": 1,\n'
            '      "question": "Clear question text",\n'
            '      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],\n'
            '      "correctIndex": 0,\n'
            '      "explanation": "Brief explanation of why this is correct",\n'
            '      "difficulty": "easy|medium|hard"\n'
            '    }\n'
            '  ]\n'
            "}"
        )

        user_message = f"Generate a practice quiz for the topic \"{topic_title}\" in the class \"{class_name}\"."
        if regenerate:
            import random
            user_message += f"\n\nIMPORTANT: This is a REGENERATION request. Generate COMPLETELY DIFFERENT questions from any previous version. Use different angles, different examples, different scenarios. Variation seed: {random.randint(1000,9999)}"
        if topic_description:
            user_message += f"\n\nTopic description: {topic_description}"

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=8192,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

        quiz_data = json_lib.loads(raw)

        # ── Save to DB ──
        save_status = "skipped"
        if topic_id and class_id:
            try:
                from datetime import datetime
                now_ts = datetime.utcnow().isoformat()

                existing = supabase.table("study_quizzes") \
                    .select("id") \
                    .eq("user_id", user_id) \
                    .eq("topic_id", topic_id) \
                    .limit(1).execute()

                if existing.data:
                    supabase.table("study_quizzes") \
                        .update({"quiz_json": quiz_data, "updated_at": now_ts}) \
                        .eq("id", existing.data[0]["id"]) \
                        .execute()
                    save_status = "updated"
                else:
                    supabase.table("study_quizzes").insert({
                        "user_id":  user_id,
                        "class_id": class_id,
                        "topic_id": topic_id,
                        "quiz_json": quiz_data,
                    }).execute()
                    save_status = "inserted"
                print(f"[QUIZ SAVE] {save_status}")
            except Exception as save_err:
                save_status = "failed"
                print(f"[QUIZ SAVE] ERROR: {save_err}")

        return {"quiz": quiz_data, "cached": False, "save_status": save_status}

    except Exception as e:
        return {"quiz": None, "error": str(e)}


# ── POST /api/classes/study/targeted ───────────────────────────────────────

@router.post("/study/targeted")
async def generate_targeted_practice(request: Request):
    """Generate or retrieve AI-powered targeted practice for weak areas in a topic."""
    import json as json_lib
    user_id = _get_user(request)
    body = await request.json()
    class_name = body.get("class_name", "")
    class_id = body.get("class_id", "")
    topic_id = body.get("topic_id", "")
    topic_title = body.get("topic_title", "")
    topic_description = body.get("topic_description", "")
    difficulty = body.get("difficulty", "medium")
    regenerate = body.get("regenerate", False)

    if not class_name or not topic_title:
        raise HTTPException(400, "class_name and topic_title required")

    # ── Check DB cache ──
    if topic_id and not regenerate:
        try:
            existing = supabase.table("study_targeted") \
                .select("targeted_json, updated_at") \
                .eq("user_id", user_id) \
                .eq("topic_id", topic_id) \
                .limit(1).execute()
            if existing.data:
                return {
                    "targeted": existing.data[0]["targeted_json"],
                    "cached": True,
                    "updated_at": existing.data[0]["updated_at"],
                }
        except Exception as e:
            print(f"[TARGETED CHECK] ERROR: {e}")

    # ── Generate with AI ──
    if not settings.anthropic_api_key:
        return {"targeted": None, "error": "AI not configured"}

    try:
        client = anthropic_lib.Anthropic(api_key=settings.anthropic_api_key)

        system_prompt = (
            "You are Atlas AI, an educational assistant that creates targeted practice exercises for students.\n"
            "Your goal is to help students improve weak areas and strengthen understanding of difficult concepts.\n\n"
            "RULES:\n"
            "- Identify 2-3 sub-topics or concepts that students commonly struggle with in this topic.\n"
            "- Create application-based and reasoning-based questions, not just recall.\n"
            "- Encourage critical thinking rather than simple memorization.\n"
            "- Cover misconceptions and common mistakes students make.\n"
            "- Generate 8-12 practice questions total (3-4 per weak area).\n"
            "- Each question must be multiple-choice with exactly 4 options, one correct.\n"
            "- Include a concise explanation for every answer (1-2 sentences max).\n"
            "- If formulas are involved, include the key formula in the explanation.\n"
            "- Do not invent information not present in standard academic material.\n"
            "- Use simple, student-friendly language.\n"
            "- Include confidence percentage for each weak area (how likely students struggle with it).\n"
            f"- Current difficulty: {difficulty} (easy = basic understanding, medium = application, hard = analysis & problem-solving).\n"
            "- Adjust question complexity based on the requested difficulty level.\n\n"
            "RESPONSE FORMAT: JSON only. No markdown fences. No preamble. No extra text.\n"
            "{\n"
            '  "title": "Topic Title - Targeted Practice",\n'
            '  "difficulty": "' + difficulty + '",\n'
            '  "weakAreas": [\n'
            '    {\n'
            '      "id": 1,\n'
            '      "name": "Sub-topic or concept name",\n'
            '      "confidence": 45,\n'
            '      "description": "Why students struggle with this and common misconceptions",\n'
            '      "questions": [\n'
            '        {\n'
            '          "id": 1,\n'
            '          "question": "Application or reasoning-based question",\n'
            '          "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],\n'
            '          "correctIndex": 0,\n'
            '          "explanation": "Detailed explanation with worked solution if applicable"\n'
            '        }\n'
            '      ]\n'
            '    }\n'
            '  ],\n'
            '  "totalQuestions": 10,\n'
            '  "studyAdvice": "Specific advice for improving in these weak areas"\n'
            "}"
        )

        user_message = f"Generate targeted practice for the topic \"{topic_title}\" in the class \"{class_name}\" at {difficulty} difficulty."
        if regenerate:
            import random
            user_message += f"\n\nIMPORTANT: This is a REGENERATION request. Generate COMPLETELY DIFFERENT questions focusing on different weak areas. Variation seed: {random.randint(1000,9999)}"
        if topic_description:
            user_message += f"\n\nTopic description: {topic_description}"

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=8192,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )
        raw = response.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1] if "\n" in raw else raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]
        raw = raw.strip()

        targeted_data = json_lib.loads(raw)

        # ── Save to DB ──
        save_status = "skipped"
        if topic_id and class_id:
            try:
                from datetime import datetime
                now_ts = datetime.utcnow().isoformat()

                existing = supabase.table("study_targeted") \
                    .select("id") \
                    .eq("user_id", user_id) \
                    .eq("topic_id", topic_id) \
                    .limit(1).execute()

                if existing.data:
                    supabase.table("study_targeted") \
                        .update({"targeted_json": targeted_data, "updated_at": now_ts}) \
                        .eq("id", existing.data[0]["id"]) \
                        .execute()
                    save_status = "updated"
                else:
                    supabase.table("study_targeted").insert({
                        "user_id":       user_id,
                        "class_id":      class_id,
                        "topic_id":      topic_id,
                        "targeted_json": targeted_data,
                    }).execute()
                    save_status = "inserted"
                print(f"[TARGETED SAVE] {save_status}")
            except Exception as save_err:
                save_status = "failed"
                print(f"[TARGETED SAVE] ERROR: {save_err}")

        return {"targeted": targeted_data, "cached": False, "save_status": save_status}

    except Exception as e:
        return {"targeted": None, "error": str(e)}


# ── GET /api/classes/study/progress/{topic_id} ─────────────────────────────

@router.get("/study/progress/{topic_id}")
async def get_study_progress(topic_id: str, request: Request):
    """Check which study materials have been completed for a topic."""
    user_id = _get_user(request)

    progress = {}
    tables = {
        "summary":   "study_summaries",
        "flashcards": "study_flashcards",
        "quiz":      "study_quizzes",
        "targeted":  "study_targeted",
    }

    for key, table in tables.items():
        try:
            col = "summary_json" if key == "summary" else f"{key}_json" if key != "targeted" else "targeted_json"
            result = supabase.table(table) \
                .select("id, updated_at") \
                .eq("user_id", user_id) \
                .eq("topic_id", topic_id) \
                .limit(1).execute()
            progress[key] = {
                "completed": bool(result.data),
                "updated_at": result.data[0]["updated_at"] if result.data else None,
            }
        except Exception:
            progress[key] = {"completed": False, "updated_at": None}

    return {"progress": progress}


# ── POST /api/classes/study/feedback ───────────────────────────────────────

@router.post("/study/feedback")
async def save_study_feedback(request: Request):
    """Save thumbs up/down feedback for a study summary."""
    user_id = _get_user(request)
    body = await request.json()
    topic_id = body.get("topic_id", "")
    feedback = body.get("feedback")  # 'up', 'down', or null

    if not topic_id:
        raise HTTPException(400, "topic_id required")
    if feedback not in ('up', 'down', None):
        raise HTTPException(400, "feedback must be 'up', 'down', or null")

    try:
        result = supabase.table("study_summaries") \
            .update({"feedback": feedback}) \
            .eq("user_id", user_id) \
            .eq("topic_id", topic_id) \
            .execute()
        return {"saved": bool(result.data), "feedback": feedback}
    except Exception as e:
        return {"saved": False, "error": str(e)}


# ── POST /api/classes/study/save-attempt ───────────────────────────────────

@router.post("/study/save-attempt")
async def save_study_attempt(request: Request):
    """Save a study attempt with score and content for history tracking.
    is_retake=true: same attempt_number, increment retake_number
    is_retake=false: new attempt_number, retake_number=0
    """
    user_id = _get_user(request)
    body = await request.json()
    topic_id = body.get("topic_id", "")
    class_id = body.get("class_id", "")
    material_type = body.get("material_type", "")
    content_json = body.get("content_json", {})
    score = body.get("score", 0)
    total = body.get("total", 0)
    is_retake = body.get("is_retake", False)
    retake_attempt = body.get("attempt_number", None)

    if not topic_id or not material_type:
        raise HTTPException(400, "topic_id and material_type required")

    is_retake = body.get("is_retake", False)
    parent_attempt = body.get("parent_attempt", None)

    try:
        if is_retake and parent_attempt:
            # Re-Take: same attempt_number, next retake_number
            existing_r = supabase.table("study_attempts") \
                .select("retake_number") \
                .eq("user_id", user_id).eq("topic_id", topic_id) \
                .eq("material_type", material_type).eq("attempt_number", parent_attempt) \
                .order("retake_number", desc=True).limit(1).execute()
            next_r = (existing_r.data[0].get("retake_number", 0) + 1) if existing_r.data else 1
            supabase.table("study_attempts").insert({
                "user_id": user_id, "topic_id": topic_id, "class_id": class_id,
                "material_type": material_type, "attempt_number": parent_attempt,
                "retake_number": next_r, "content_json": content_json,
                "score": score, "total": total,
            }).execute()
            print(f"[SAVE ATTEMPT] Saved retake #{next_r} of attempt #{parent_attempt}")
            return {"success": True, "attempt_number": parent_attempt, "retake_number": next_r}
        else:
            # Regenerate: new attempt_number
            existing = supabase.table("study_attempts") \
                .select("attempt_number") \
                .eq("user_id", user_id).eq("topic_id", topic_id) \
                .eq("material_type", material_type) \
                .order("attempt_number", desc=True).limit(1).execute()
            next_num = (existing.data[0]["attempt_number"] + 1) if existing.data else 1
            supabase.table("study_attempts").insert({
                "user_id": user_id, "topic_id": topic_id, "class_id": class_id,
                "material_type": material_type, "attempt_number": next_num,
                "retake_number": 0, "content_json": content_json,
                "score": score, "total": total,
            }).execute()
            print(f"[SAVE ATTEMPT] Saved new attempt #{next_num}")
            return {"success": True, "attempt_number": next_num}
    except Exception as e:
        print(f"[SAVE ATTEMPT] ERROR: {e}")
        return {"success": False, "error": str(e)}


# ── GET /api/classes/study/attempts/{topic_id}/{material_type} ─────────────

@router.get("/study/attempts/{topic_id}/{material_type}")
async def get_study_attempts(topic_id: str, material_type: str, request: Request):
    """Get all attempts as a simple flat list, sorted newest first."""
    user_id = _get_user(request)

    try:
        result = supabase.table("study_attempts") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("topic_id", topic_id) \
            .eq("material_type", material_type) \
            .order("attempt_number").order("retake_number") \
            .execute()

        all_rows = result.data or []
        # Group by attempt_number
        grouped: dict = {}
        for row in all_rows:
            an = row.get("attempt_number", 1)
            if an not in grouped:
                grouped[an] = []
            grouped[an].append(row)

        attempts = []
        for an in sorted(grouped.keys()):
            rows = sorted(grouped[an], key=lambda r: r.get("retake_number", 0))
            attempts.append({
                "attempt_number": an,
                "original": rows[0],
                "retakes": rows[1:],
                "retake_count": len(rows) - 1,
            })

        best_pct = max((round(r["score"] / r["total"] * 100) if r["total"] > 0 else 0 for r in all_rows), default=0)
        print(f"[GET ATTEMPTS] topic={topic_id} type={material_type} groups={len(attempts)} rows={len(all_rows)} best={best_pct}")

        return {
            "attempts": attempts,
            "total_attempts": len(attempts),
            "best_percentage": best_pct,
        }
    except Exception as e:
        return {"attempts": [], "all_rows": [], "total_attempts": 0, "error": str(e)}
