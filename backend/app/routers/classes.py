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
            max_tokens=4096,
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


# ── GET /api/classes/{id}/grades ──────────────────────────────────────────

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
