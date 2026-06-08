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
    Runs after the upload response has already been returned to the client.
    The frontend polls GET /api/files or GET /api/files/{id} to see status updates.
    """
    # Skip audio / video / images — no text to extract
    if extension in SKIP_PARSE_EXTENSIONS:
        _set_status(file_id, "ready", 4, {
            "extracted_summary": f"{extension.upper()} uploaded — AI analysis available after transcription (coming soon)"
        })
        return

    # Step 2: parsing
    _set_status(file_id, "parsing", 2)

    try:
        # Import here so the router doesn't fail if libs are missing at startup
        from app.utils.extractor import extract_text, truncate_for_claude
        from app.utils.parser import parse_file

        # Extract text
        raw_text = extract_text(data, extension)
        if not raw_text.strip():
            _set_status(file_id, "ready", 4, {
                "extracted_summary": "Could not extract text from this file — try a text-based PDF or DOCX"
            })
            return

        text = truncate_for_claude(raw_text)

        # Step 3: call Claude
        _set_status(file_id, "indexing", 3)
        t0 = time.monotonic()
        result, error_msg, summary = parse_file(text, category)
        duration_ms = int((time.monotonic() - t0) * 1000)

        # Store parsed result
        supabase.table("parsed_results").upsert({
            "file_id":          file_id,
            "user_id":          user_id,
            "raw_result":       result or {},
            "model_used":       "claude-sonnet-4-6",
            "parse_duration_ms": duration_ms,
            "parse_error":      error_msg,
            # Denormalised fields for syllabi
            "course_name":  (result or {}).get("course_name"),
            "instructor":   (result or {}).get("instructor"),
            "credit_hours": (result or {}).get("credit_hours"),
            "office_hours": (result or {}).get("office_hours"),
        }, on_conflict="file_id").execute()

        # For syllabi, also persist grade_weights, assessments, topics
        if category == "syllabus" and result:
            _persist_syllabus_data(file_id, user_id, result)

        # Mark ready
        _set_status(file_id, "ready", 4, {
            "extracted_summary": summary,
            "error_message": error_msg,
        })

    except Exception as exc:
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
            .maybeSingle()
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not fetch results: {exc}")

    pr = pr_res.data

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
