"""
files.py — File upload router (Step 1).

POST /api/files/upload   — receive, validate, store, classify, return record.
GET  /api/files          — list this user's uploaded files.
DELETE /api/files/{id}   — delete a file record + its storage object.
"""

import mimetypes
import os
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status, Query
from pydantic import BaseModel

from app.config import settings
from app.utils.auth import get_current_user_id
from app.utils.classifier import classify_file
from app.utils.storage import storage_client, make_storage_path
from app.utils.supabase_client import supabase

router = APIRouter()

ALLOWED_EXTENSIONS = {
    "pdf", "docx", "doc", "pptx", "ppt", "txt", "md",
    "mp3", "m4a", "wav", "ogg", "aac",
    "mp4", "mov", "webm",
    "jpg", "jpeg", "png", "webp",
}

PIPELINE_STEPS = ["uploading", "classifying", "parsing", "indexing", "ready"]


# ── Schemas ────────────────────────────────────────────────────────────────

class FileRecord(BaseModel):
    id:                str
    user_id:           str
    class_id:          Optional[str]
    original_name:     str
    mime_type:         Optional[str]
    size_bytes:        Optional[int]
    size_label:        str               # human-readable e.g. "2.1 MB"
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


# ── POST /api/files/upload ─────────────────────────────────────────────────

@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a class material file",
)
async def upload_file(
    file:     UploadFile = File(...),
    class_id: Optional[str] = Form(None),
    user_id:  str = Depends(get_current_user_id),
):
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
            detail=f"File too large. Maximum is {settings.max_file_size_bytes // (1024*1024)} MB.",
        )

    # 3. MIME
    mime_type = file.content_type or mimetypes.guess_type(original_name)[0] or "application/octet-stream"

    # 4. Insert DB row (status=uploading) — frontend shows row immediately
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

    # 5. Upload to storage
    storage_path = make_storage_path(user_id, original_name)
    try:
        await storage_client.upload(data=data, path=storage_path, content_type=mime_type)
    except Exception as exc:
        supabase.table("files").update({
            "status": "error", "pipeline_step": 0,
            "error_message": f"Storage upload failed: {exc}",
        }).eq("id", file_id).execute()
        raise HTTPException(status_code=500, detail=f"Storage upload failed: {exc}")

    supabase.table("files").update({
        "storage_path": storage_path,
        "status":       "classifying",
        "pipeline_step": 1,
    }).eq("id", file_id).execute()

    # 6. Classify
    try:
        category = classify_file(original_name=original_name, extension=extension)
    except Exception:
        category = "other"

    supabase.table("files").update({
        "category":        category,
        "category_source": "auto",
        "status":          "classifying",
        "pipeline_step":   1,
    }).eq("id", file_id).execute()

    # 7. Fetch + return
    try:
        result = supabase.table("files").select("*").eq("id", file_id).single().execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Upload succeeded but could not fetch record: {exc}")

    return UploadResponse(
        message="File uploaded successfully.",
        file=_row_to_record(result.data),
    )


# ── GET /api/files ─────────────────────────────────────────────────────────

@router.get("", response_model=FileListResponse, summary="List uploaded files")
async def list_files(
    search:  Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
):
    try:
        res = (
            supabase.table("files")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not list files: {exc}")

    rows = res.data or []
    if search:
        term = search.lower()
        rows = [r for r in rows if term in r["original_name"].lower()]

    return FileListResponse(files=[_row_to_record(r) for r in rows], total=len(rows))


# ── DELETE /api/files/{file_id} ────────────────────────────────────────────

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
        except Exception as exc:
            print(f"[delete_file] storage delete failed: {exc}")

    try:
        supabase.table("files").delete().eq("id", file_id).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {exc}")

    return SimpleMessage(message=f"'{row['original_name']}' deleted.")
