"""
files.py — File upload, list, delete, parse results.

POST   /api/files/upload          Upload → store → classify → trigger AI parse
GET    /api/files                 List user's files
GET    /api/files/{id}            Single file record
GET    /api/files/{id}/results    AI-parsed results for a file
PATCH  /api/files/{id}/category   Override category
DELETE /api/files/{id}            Delete file + storage object

Pipeline stages (pipeline_step 0-4):
  0 uploading → 1 classifying → 2 parsing → 3 indexing → 4 ready
  status = 'error' at any step if something fails
"""

import mimetypes
import os
import time
import uuid
from typing import Any, Optional

from fastapi import (
    APIRouter, BackgroundTasks, Depends, File, Form,
    HTTPException, Query, UploadFile, status,
)
from pydantic import BaseModel

from app.config import settings
from app.utils.auth import get_current_user_id
from app.utils.classifier import classify_file, VALID_CATEGORIES
from app.utils.storage import storage_client, make_storage_path
from app.utils.supabase_client import supabase

router = APIRouter()

import os as _os
MODEL_NAME = _os.environ.get("ATLAS_PARSE_MODEL_NAME", "claude-haiku-4-5-20251001")

ALLOWED_EXTENSIONS = {
    "pdf", "docx", "doc", "pptx", "ppt", "txt", "md",
    "mp3", "m4a", "wav", "ogg", "aac",
    "mp4", "mov", "webm",
    "jpg", "jpeg", "png", "webp",
}

# Categories for which we run text extraction + AI parsing
PARSEABLE_CATEGORIES = {
    "syllabus", "lecture_slides", "notes", "review_sheet",
    "assignment", "quiz", "exam", "graded_work", "announcement",
}
# Audio/video/image — no text extraction in Phase 1
SKIP_PARSE_EXTENSIONS = {
    "mp3", "m4a", "wav", "ogg", "aac",
    "mp4", "mov", "webm",
    "jpg", "jpeg", "png", "webp",
}


# ── Schemas ────────────────────────────────────────────────────────────────

class FileRecord(BaseModel):
    id:                str
    user_id:           str
    class_id:          Optional[str]
    original_name:     str
    mime_type:         Optional[str]
    size_bytes:        Optional[int]
    size_label:        str
    extension:         Optional[str]
    category:          str
    category_source:   str
    storage_path:      Optional[str]
    status:            str
    pipeline_step:     int
    error_message:     Optional[str]
    extracted_summary: Optional[str]
    created_at:        str
    updated_at:        str


class UploadResponse(BaseModel):
    message: str
    file:    FileRecord


class FileListResponse(BaseModel):
    files: list[FileRecord]
    total: int


class ParsedResultResponse(BaseModel):
    file_id:   str
    category:  str
    status:    str
    result:    Optional[dict[str, Any]]
    summary:   Optional[str]
    error:     Optional[str]


class CategoryOverrideRequest(BaseModel):
    category: str


class SimpleMessage(BaseModel):
    message: str


# ── Helpers ────────────────────────────────────────────────────────────────

def _fmt_size(n: Optional[int]) -> str:
    if not n:
        return "—"
    if n < 1024:
        return f"{n} B"
    if n < 1024 ** 2:
        return f"{n / 1024:.0f} KB"
    if n < 1024 ** 3:
        return f"{n / 1024 ** 2:.1f} MB"
    return f"{n / 1024 ** 3:.1f} GB"


def _row_to_record(row: dict) -> FileRecord:
    return FileRecord(
        id=str(row["id"]),
        user_id=str(row["user_id"]),
        class_id=str(row["class_id"]) if row.get("class_id") else None,
        original_name=row["original_name"],
        mime_type=row.get("mime_type"),
        size_bytes=row.get("size_bytes"),
        size_label=_fmt_size(row.get("size_bytes")),
        extension=row.get("extension"),
        category=row["category"],
        category_source=row["category_source"],
        storage_path=row.get("storage_path"),
        status=row["status"],
        pipeline_step=row["pipeline_step"],
        error_message=row.get("error_message"),
        extracted_summary=row.get("extracted_summary"),
        created_at=str(row["created_at"]),
        updated_at=str(row["updated_at"]),
    )


def _set_status(file_id: str, status_str: str, step: int, extra: dict | None = None) -> None:
    payload = {"status": status_str, "pipeline_step": step, **(extra or {})}
    supabase.table("files").update(payload).eq("id", file_id).execute()


# ── Background parse task ───────────────────────────────────────────────────

def _run_parse(file_id: str, user_id: str, data: bytes, extension: str, category: str) -> None:
    """
    Background task: extract text → call Claude → store results → mark ready.
    """
    import traceback
    print(f"[parse] START file_id={file_id} ext={extension} category={category}")

    # Skip audio / video / images — no text to extract
    if extension in SKIP_PARSE_EXTENSIONS:
        _set_status(file_id, "ready", 4, {
            "extracted_summary": f"{extension.upper()} uploaded — AI analysis available after transcription (coming soon)"
        })
        print(f"[parse] SKIP (media file) file_id={file_id}")
        return

    # Step 2: parsing
    _set_status(file_id, "parsing", 2)

    try:
        from app.utils.extractor import extract_text, smart_truncate
        from app.utils.parser import parse_file

        # Extract text
        print(f"[parse] extracting text file_id={file_id}")
        raw_text = extract_text(data, extension)
        print(f"[parse] extracted {len(raw_text)} chars file_id={file_id}")

        if not raw_text.strip():
            _set_status(file_id, "ready", 4, {
                "extracted_summary": "Could not extract text from this file — try a text-based PDF or DOCX"
            })
            print(f"[parse] EMPTY TEXT file_id={file_id}")
            return

        text = smart_truncate(raw_text, category)
        print(f"[parse] truncated to {len(text)} chars, calling Claude file_id={file_id}")

        # Step 3: call Claude
        _set_status(file_id, "indexing", 3)
        t0 = time.monotonic()
        result, error_msg, summary = parse_file(text, category)
        duration_ms = int((time.monotonic() - t0) * 1000)
        print(f"[parse] Claude done in {duration_ms}ms error={error_msg} file_id={file_id}")

        # Store parsed result — delete first then insert (works in all SDK versions)
        supabase.table("parsed_results").delete().eq("file_id", file_id).execute()
        supabase.table("parsed_results").insert({
            "file_id":          file_id,
            "user_id":          user_id,
            "raw_result":       result or {},
            "model_used":       MODEL_NAME,
            "parse_duration_ms": duration_ms,
            "parse_error":      error_msg,
            "course_name":  (result or {}).get("course_name"),
            "instructor":   (result or {}).get("instructor"),
            "credit_hours": (result or {}).get("credit_hours"),
            "office_hours": (result or {}).get("office_hours"),
        }).execute()

        # For syllabi, also persist grade_weights, assessments, topics
        if category == "syllabus" and result:
            _persist_syllabus_data(file_id, user_id, result)

        # Generate suggestions inside the same background task — no extra API call needed
        # We already have the parsed result, just ask Claude for suggestions in one more call
        suggestions_json = []
        if result:
            try:
                import json as _j
                import re as _r
                sug_system = (
                    "Generate 5 study suggestions from this document data. "
                    "Return ONLY a JSON array of 5 objects, no prose, no fences. "
                    'Each: {"emoji":str,"text":str,"impact":str,"color":str}. '
                    "color options: text-red-600 bg-red-50 border-red-200 | "
                    "text-amber-600 bg-amber-50 border-amber-200 | "
                    "text-indigo-600 bg-indigo-50 border-indigo-200 | "
                    "text-purple-600 bg-purple-50 border-purple-200 | "
                    "text-blue-600 bg-blue-50 border-blue-200. "
                    "Base suggestions ONLY on the provided data. Never invent."
                )
                sug_user = f"Category: {category}\nData: {_j.dumps(result)[:2000]}"
                from app.utils.parser import _get_client
                sug_msg = _get_client().messages.create(
                    model=MODEL_NAME, max_tokens=400,
                    system=sug_system,
                    messages=[{"role": "user", "content": sug_user}],
                )
                sug_raw = sug_msg.content[0].text.strip()
                sug_raw = _r.sub(r"^```(?:json)?\s*|\s*```$", "", sug_raw).strip()
                suggestions_json = _j.loads(sug_raw)[:5]
                print(f"[parse] suggestions generated: {len(suggestions_json)} items")
            except Exception as sug_exc:
                print(f"[parse] suggestions failed (non-fatal): {sug_exc}")

        # Save suggestions to parsed_results row
        if suggestions_json:
            try:
                supabase.table("parsed_results").update({
                    "suggestions": suggestions_json
                }).eq("file_id", file_id).execute()
            except Exception as e:
                print(f"[parse] could not save suggestions: {e}")

        # Mark ready
        _set_status(file_id, "ready", 4, {
            "extracted_summary": summary,
            "error_message": error_msg,
        })

    except Exception as exc:
        import traceback
        full_error = traceback.format_exc()
        print(f"[parse] ERROR file_id={file_id}:\n{full_error}")
        _set_status(file_id, "error", 2, {
            "error_message": f"AI parsing failed: {exc}"
        })


def _persist_syllabus_data(file_id: str, user_id: str, result: dict) -> None:
    """Persist extracted grade weights, assessments, topics to their own tables."""
    try:
        # Grade weights
        weights = result.get("grade_weights", [])
        if weights:
            rows = [
                {
                    "file_id": file_id,
                    "user_id": user_id,
                    "category": w.get("category", "Unknown"),
                    "weight_pct": w.get("weight_pct", 0),
                    "confidence": w.get("confidence", "medium"),
                }
                for w in weights if w.get("category")
            ]
            if rows:
                # Delete old weights for this file first
                supabase.table("grade_weights").delete().eq("file_id", file_id).execute()
                supabase.table("grade_weights").insert(rows).execute()

        # Assessments / deadlines
        assessments = result.get("assessments", [])
        if assessments:
            rows = [
                {
                    "file_id":    file_id,
                    "user_id":    user_id,
                    "title":      a.get("title", "Untitled"),
                    "category":   a.get("category"),
                    "due_date":   a.get("due_date"),
                    "source":     "syllabus",
                    "confidence": a.get("confidence", "medium"),
                }
                for a in assessments if a.get("title")
            ]
            if rows:
                supabase.table("assessments").delete().eq("file_id", file_id).execute()
                supabase.table("assessments").insert(rows).execute()

        # Topics
        topics = result.get("topics", [])
        if topics:
            rows = [
                {
                    "file_id":    file_id,
                    "user_id":    user_id,
                    "title":      t.get("title", "Untitled"),
                    "source":     "syllabus",
                    "week_hint":  t.get("week_hint"),
                    "chapter_ref": t.get("chapter_ref"),
                    "confidence": t.get("confidence", "medium"),
                }
                for t in topics if t.get("title")
            ]
            if rows:
                supabase.table("topics").delete().eq("file_id", file_id).execute()
                supabase.table("topics").insert(rows).execute()

    except Exception as exc:
        print(f"[_persist_syllabus_data] non-fatal error: {exc}")


# ── POST /api/files/upload ──────────────────────────────────────────────────

@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a study material file",
)
async def upload_file(
    background_tasks: BackgroundTasks,
    file:     UploadFile = File(...),
    class_id: Optional[str] = Form(None),
    user_id:  str = Depends(get_current_user_id),
):
    """
    Upload a file. Three synchronous steps happen before the response:
      1. Validate extension + size
      2. Store bytes in Supabase Storage
      3. Classify by filename/extension

    Then immediately returns the file record (status = 'classifying').

    A background task then runs:
      4. Extract text (PDF/DOCX/PPTX/TXT)
      5. Call Claude to parse the content
      6. Store results in parsed_results table
      7. Update file status → 'ready'

    The frontend polls GET /api/files/{id} to see status progress.
    """

    original_name = file.filename or "unknown"
    extension = os.path.splitext(original_name)[-1].lstrip(".").lower()

    # 1. Validate extension
    if not extension or extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"'.{extension}' is not supported. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}.",
        )

    # 2. Read + size check
    data = await file.read()
    size_bytes = len(data)
    if size_bytes > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Max is {settings.max_file_size_bytes // (1024*1024)} MB.",
        )

    mime_type = file.content_type or mimetypes.guess_type(original_name)[0] or "application/octet-stream"

    # 3. Insert DB row
    file_id = str(uuid.uuid4())
    try:
        supabase.table("files").insert({
            "id":              file_id,
            "user_id":         user_id,
            "class_id":        class_id or None,
            "original_name":   original_name,
            "mime_type":       mime_type,
            "size_bytes":      size_bytes,
            "extension":       extension,
            "category":        "other",
            "category_source": "auto",
            "storage_bucket":  settings.storage_bucket,
            "status":          "uploading",
            "pipeline_step":   0,
        }).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not create file record: {exc}")

    # 4. Upload to storage
    storage_path = make_storage_path(user_id, original_name)
    try:
        await storage_client.upload(data=data, path=storage_path, content_type=mime_type)
    except Exception as exc:
        _set_status(file_id, "error", 0, {"error_message": f"Storage upload failed: {exc}"})
        raise HTTPException(status_code=500, detail=f"Storage upload failed: {exc}")

    _set_status(file_id, "classifying", 1, {"storage_path": storage_path})

    # 5. Classify
    try:
        category = classify_file(original_name=original_name, extension=extension)
    except Exception:
        category = "other"

    supabase.table("files").update({
        "category": category,
        "category_source": "auto",
    }).eq("id", file_id).execute()

    # 6. Kick off background AI parse — non-blocking
    background_tasks.add_task(_run_parse, file_id, user_id, data, extension, category)

    # 7. Return current record (status still 'classifying' — background task will update it)
    try:
        result = supabase.table("files").select("*").eq("id", file_id).single().execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Upload succeeded but could not fetch record: {exc}")

    return UploadResponse(
        message="File uploaded. AI analysis is running in the background.",
        file=_row_to_record(result.data),
    )


# ── GET /api/files ──────────────────────────────────────────────────────────

@router.get("", response_model=FileListResponse, summary="List uploaded files")
async def list_files(
    search:   Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    user_id:  str = Depends(get_current_user_id),
):
    try:
        q = (
            supabase.table("files")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
        )
        if category and category in VALID_CATEGORIES:
            q = q.eq("category", category)
        res = q.execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not list files: {exc}")

    rows = res.data or []
    if search:
        term = search.lower()
        rows = [r for r in rows if term in r["original_name"].lower()]

    return FileListResponse(files=[_row_to_record(r) for r in rows], total=len(rows))


# ── GET /api/files/{file_id} ────────────────────────────────────────────────

@router.get("/{file_id}", response_model=FileRecord, summary="Get single file")
async def get_file(file_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        res = (
            supabase.table("files")
            .select("*")
            .eq("id", file_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=404, detail="File not found.")
    if not res.data:
        raise HTTPException(status_code=404, detail="File not found.")
    return _row_to_record(res.data)


# ── GET /api/files/{file_id}/results ───────────────────────────────────────

@router.get(
    "/{file_id}/results",
    response_model=ParsedResultResponse,
    summary="Get AI-parsed results for a file",
)
async def get_file_results(file_id: str, user_id: str = Depends(get_current_user_id)):
    """
    Returns the full AI-parsed result for a file.
    The result shape depends on category:
      - syllabus:       course_name, grade_weights[], assessments[], topics[]
      - notes/slides:   main_topics[], key_concepts[], potential_exam_topics[]
      - quiz/graded:    score, max_score, weak_areas[], topics_tested[]
      - other:          summary, key_points[], relevant_topics[]

    Returns 404 while the file is still processing (status != 'ready').
    Returns the result + any parse error once processing is done.
    """
    # Verify ownership
    try:
        file_res = (
            supabase.table("files")
            .select("id, status, category, extracted_summary")
            .eq("id", file_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=404, detail="File not found.")

    file_row = file_res.data
    if not file_row:
        raise HTTPException(status_code=404, detail="File not found.")

    # Fetch parsed result
    try:
        pr_res = (
            supabase.table("parsed_results")
            .select("*")
            .eq("file_id", file_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not fetch results: {exc}")

    rows = pr_res.data or []
    pr = rows[0] if rows else None

    return ParsedResultResponse(
        file_id=file_id,
        category=file_row["category"],
        status=file_row["status"],
        result=pr["raw_result"] if pr else None,
        summary=file_row.get("extracted_summary"),
        error=pr["parse_error"] if pr else None,
    )


# ── PATCH /api/files/{file_id}/category ────────────────────────────────────

@router.patch("/{file_id}/category", response_model=FileRecord, summary="Override category")
async def override_category(
    file_id: str,
    body:    CategoryOverrideRequest,
    user_id: str = Depends(get_current_user_id),
):
    if body.category not in VALID_CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Invalid category '{body.category}'.")
    try:
        supabase.table("files").select("id").eq("id", file_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="File not found.")

    supabase.table("files").update({
        "category": body.category,
        "category_source": "user_override",
    }).eq("id", file_id).execute()

    return await get_file(file_id, user_id)


# ── DELETE /api/files/{file_id} ─────────────────────────────────────────────

@router.delete("/{file_id}", response_model=SimpleMessage, summary="Delete a file")
async def delete_file(file_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        res = (
            supabase.table("files")
            .select("id, storage_path, original_name")
            .eq("id", file_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=404, detail="File not found.")

    row = res.data
    if row.get("storage_path"):
        try:
            await storage_client.delete(row["storage_path"])
        except Exception as e:
            print(f"[delete_file] storage delete failed: {e}")

    try:
        supabase.table("files").delete().eq("id", file_id).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {exc}")

    return SimpleMessage(message=f"'{row['original_name']}' deleted.")


# ── PATCH /api/files/{file_id}/fields ──────────────────────────────────────
# Feature 1: Edit extracted fields after parsing

class EditFieldsRequest(BaseModel):
    """Student corrections to AI-extracted fields. All fields optional."""
    course_name:  Optional[str] = None
    instructor:   Optional[str] = None
    credit_hours: Optional[int] = None
    office_hours: Optional[str] = None
    category:     Optional[str] = None   # also updates files.category

class EditFieldsResponse(BaseModel):
    message: str
    file_id: str

@router.patch(
    "/{file_id}/fields",
    response_model=EditFieldsResponse,
    summary="Save student corrections to AI-extracted fields",
)
async def edit_fields(
    file_id: str,
    body:    EditFieldsRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Saves the student's one-tap corrections to the parsed result.
    Only the fields provided in the request body are updated.
    category_source is set to 'user_override' if category is changed.
    """
    # Verify ownership
    try:
        supabase.table("files").select("id").eq("id", file_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="File not found.")

    # Update parsed_results row
    pr_update: dict = {}
    if body.course_name  is not None: pr_update["course_name"]  = body.course_name
    if body.instructor   is not None: pr_update["instructor"]   = body.instructor
    if body.credit_hours is not None: pr_update["credit_hours"] = body.credit_hours
    if body.office_hours is not None: pr_update["office_hours"] = body.office_hours

    if pr_update:
        try:
            # Also update raw_result so it stays in sync
            pr_res = supabase.table("parsed_results").select("raw_result").eq("file_id", file_id).limit(1).execute()
            rows = pr_res.data or []
            if rows:
                raw = rows[0].get("raw_result") or {}
                raw.update(pr_update)
                supabase.table("parsed_results").update({
                    **pr_update,
                    "raw_result": raw,
                }).eq("file_id", file_id).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Could not update fields: {exc}")

    # Update category on files table if provided
    if body.category:
        if body.category not in VALID_CATEGORIES:
            raise HTTPException(status_code=400, detail=f"Invalid category '{body.category}'.")
        try:
            supabase.table("files").update({
                "category": body.category,
                "category_source": "user_override",
            }).eq("id", file_id).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Could not update category: {exc}")

    return EditFieldsResponse(message="Fields updated successfully.", file_id=file_id)


# ── PATCH /api/files/{file_id}/link-class ──────────────────────────────────
# Feature 2: Link a file to a class

class LinkClassRequest(BaseModel):
    class_id: Optional[str] = None   # pass null to unlink

class LinkClassResponse(BaseModel):
    message:  str
    file_id:  str
    class_id: Optional[str]

@router.patch(
    "/{file_id}/link-class",
    response_model=LinkClassResponse,
    summary="Link or unlink a file to a class",
)
async def link_class(
    file_id: str,
    body:    LinkClassRequest,
    user_id: str = Depends(get_current_user_id),
):
    """
    Links the file to a class (or unlinks if class_id is null).
    When a syllabus is linked to a class, its grade_weights, assessments,
    and topics rows are also updated with the class_id.
    """
    # Verify file ownership
    try:
        supabase.table("files").select("id, category").eq("id", file_id).eq("user_id", user_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="File not found.")

    # If linking to a class, verify the class belongs to this user
    if body.class_id:
        try:
            cls = supabase.table("classes").select("id").eq("id", body.class_id).eq("user_id", user_id).single().execute()
            if not cls.data:
                raise HTTPException(status_code=404, detail="Class not found.")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=404, detail="Class not found.")

    # Update files table
    try:
        supabase.table("files").update({
            "class_id": body.class_id,
        }).eq("id", file_id).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not link file: {exc}")

    # Cascade class_id to related rows (grade_weights, assessments, topics)
    if body.class_id:
        for table in ["grade_weights", "assessments", "topics"]:
            try:
                supabase.table(table).update({"class_id": body.class_id}).eq("file_id", file_id).execute()
            except Exception:
                pass  # non-fatal

        # If this file is a syllabus, set it as the class syllabus_file_id
        try:
            file_cat = supabase.table("files").select("category").eq("id", file_id).single().execute()
            if file_cat.data and file_cat.data.get("category") == "syllabus":
                supabase.table("classes").update({
                    "syllabus_file_id": file_id
                }).eq("id", body.class_id).execute()
        except Exception:
            pass  # non-fatal

    msg = f"File linked to class." if body.class_id else "File unlinked from class."
    return LinkClassResponse(message=msg, file_id=file_id, class_id=body.class_id)


# ── POST /api/files/upload-image ────────────────────────────────────────────
# Feature 3: Photo grade reading (Prompt 4.6)

class GradeReadItem(BaseModel):
    class_hint:        Optional[str]
    title:             Optional[str]
    score:             Optional[float]
    max_score:         Optional[float]
    percentage:        Optional[float]
    needs_confirmation: bool = False

class PhotoGradeResponse(BaseModel):
    message: str
    grades:  list[GradeReadItem]
    file_id: str

@router.post(
    "/upload-image",
    response_model=PhotoGradeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a grade photo and extract scores with AI (Prompt 4.6)",
)
async def upload_image_grade(
    file:     UploadFile = File(...),
    class_id: Optional[str] = Form(None),
    user_id:  str = Depends(get_current_user_id),
):
    """
    Upload a photo of a returned quiz/test or a gradebook screenshot.
    Claude reads the image directly and extracts scores.

    Supports: jpg, jpeg, png, webp.
    Returns a list of extracted grade items with needs_confirmation flag
    for any ambiguous values.
    """
    original_name = file.filename or "grade_photo.jpg"
    extension = os.path.splitext(original_name)[-1].lstrip(".").lower()

    IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
    if extension not in IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Only image files are supported here. Got '.{extension}'.",
        )

    data = await file.read()
    size_bytes = len(data)

    if size_bytes > 20 * 1024 * 1024:  # 20 MB limit for images
        raise HTTPException(status_code=413, detail="Image too large. Maximum is 20 MB.")

    mime_type = file.content_type or f"image/{extension}"

    # Store the image in Supabase Storage
    file_id = str(uuid.uuid4())
    storage_path = make_storage_path(user_id, original_name)

    try:
        supabase.table("files").insert({
            "id":              file_id,
            "user_id":         user_id,
            "class_id":        class_id or None,
            "original_name":   original_name,
            "mime_type":       mime_type,
            "size_bytes":      size_bytes,
            "extension":       extension,
            "category":        "graded_work",
            "category_source": "auto",
            "storage_bucket":  settings.storage_bucket,
            "status":          "parsing",
            "pipeline_step":   2,
        }).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not create file record: {exc}")

    try:
        await storage_client.upload(data=data, path=storage_path, content_type=mime_type)
        supabase.table("files").update({"storage_path": storage_path}).eq("id", file_id).execute()
    except Exception as exc:
        supabase.table("files").update({"status": "error", "error_message": str(exc)}).eq("id", file_id).execute()
        raise HTTPException(status_code=500, detail=f"Storage upload failed: {exc}")

    # Call Claude with the image directly (vision — Prompt 4.6)
    try:
        import base64 as _b64
        import json as _json
        import re as _re
        from app.config import settings as _settings
        import anthropic as _anthropic

        client = _anthropic.Anthropic(api_key=_settings.anthropic_api_key)

        image_b64 = _b64.standard_b64encode(data).decode("utf-8")
        media_type_map = {
            "jpg": "image/jpeg", "jpeg": "image/jpeg",
            "png": "image/png", "webp": "image/webp",
        }
        media_type = media_type_map.get(extension, "image/jpeg")

        system = (
            "You read grade information from photos of returned quizzes, tests, or gradebook screenshots. "
            "Return ONLY a JSON array. No prose, no markdown fences. "
            'Each item: {"class_hint":str|null,"title":str|null,"score":num|null,"max_score":num|null,"percentage":num|null,"needs_confirmation":bool}. '
            "Set needs_confirmation=true if the score is unclear or ambiguous. "
            "For a gradebook screenshot return all visible grades as separate items. "
            "Never invent scores — if you cannot read a value clearly, set it to null and needs_confirmation=true."
        )

        msg = client.messages.create(
            model=MODEL_NAME,
            max_tokens=512,
            system=system,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Extract all grade information from this image.",
                    },
                ],
            }],
        )

        raw = msg.content[0].text.strip()
        raw = _re.sub(r"^```(?:json)?\s*|\s*```$", "", raw).strip()
        grades_data = _json.loads(raw)

        grades = [
            GradeReadItem(
                class_hint=g.get("class_hint"),
                title=g.get("title"),
                score=g.get("score"),
                max_score=g.get("max_score"),
                percentage=g.get("percentage"),
                needs_confirmation=g.get("needs_confirmation", True),
            )
            for g in grades_data
        ]

        # Save result to parsed_results
        supabase.table("parsed_results").delete().eq("file_id", file_id).execute()
        supabase.table("parsed_results").insert({
            "file_id":   file_id,
            "user_id":   user_id,
            "raw_result": {"grades": grades_data},
            "model_used": MODEL_NAME,
        }).execute()

        # Mark ready
        summary = f"{len(grades)} grade{'s' if len(grades) != 1 else ''} extracted"
        if any(g.needs_confirmation for g in grades):
            summary += " · some need confirmation"
        supabase.table("files").update({
            "status": "ready",
            "pipeline_step": 4,
            "extracted_summary": summary,
        }).eq("id", file_id).execute()

    except Exception as exc:
        supabase.table("files").update({
            "status": "error",
            "pipeline_step": 2,
            "error_message": f"Grade reading failed: {exc}",
        }).eq("id", file_id).execute()
        raise HTTPException(status_code=500, detail=f"Grade reading failed: {exc}")

    return PhotoGradeResponse(
        message="Grade photo processed successfully.",
        grades=grades,
        file_id=file_id,
    )

# ── GET /api/files/{file_id}/suggestions ───────────────────────────────────
# Reads suggestions saved during the parse step — NO extra Claude call.

class SuggestionItem(BaseModel):
    emoji:  str
    text:   str
    impact: str
    color:  str

class SuggestionsResponse(BaseModel):
    file_id:     str
    suggestions: list[SuggestionItem]

@router.get(
    "/{file_id}/suggestions",
    response_model=SuggestionsResponse,
    summary="Get AI study suggestions (pre-generated during parse)",
)
async def get_suggestions(
    file_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """
    Returns the suggestions that were generated during the background
    parse task. No new Claude call is made here — suggestions are
    saved to parsed_results.suggestions when the file is first processed.
    """
    # Verify ownership
    try:
        file_res = (
            supabase.table("files")
            .select("id, status")
            .eq("id", file_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=404, detail="File not found.")

    if not file_res.data:
        raise HTTPException(status_code=404, detail="File not found.")
    if file_res.data["status"] != "ready":
        raise HTTPException(status_code=400, detail="File is not ready yet.")

    # Read suggestions from DB
    try:
        pr_res = (
            supabase.table("parsed_results")
            .select("suggestions")
            .eq("file_id", file_id)
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not fetch suggestions: {exc}")

    rows = pr_res.data or []
    raw_suggestions = (rows[0].get("suggestions") or []) if rows else []

    suggestions = [
        SuggestionItem(
            emoji=s.get("emoji", "📖"),
            text=s.get("text", "Review this material"),
            impact=s.get("impact", "Study Tip"),
            color=s.get("color", "text-blue-600 bg-blue-50 border-blue-200"),
        )
        for s in raw_suggestions[:5]
    ]

    # If no suggestions saved yet (old files before this fix), return fallback
    if not suggestions:
        suggestions = [
            SuggestionItem(emoji="📖", text="Review all topics from this material",    impact="Study Tip",    color="text-blue-600 bg-blue-50 border-blue-200"),
            SuggestionItem(emoji="🃏", text="Create flashcards for key terms",         impact="Study Tip",    color="text-purple-600 bg-purple-50 border-purple-200"),
            SuggestionItem(emoji="❓", text="Test yourself with a practice quiz",      impact="Medium Impact",color="text-amber-600 bg-amber-50 border-amber-200"),
            SuggestionItem(emoji="🔁", text="Re-read sections you found difficult",    impact="Study Tip",    color="text-indigo-600 bg-indigo-50 border-indigo-200"),
            SuggestionItem(emoji="🧠", text="Explain each topic out loud to yourself", impact="High Impact",  color="text-red-600 bg-red-50 border-red-200"),
        ]

    return SuggestionsResponse(file_id=file_id, suggestions=suggestions)

