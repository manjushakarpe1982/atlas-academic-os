"""
storage.py — Unified file-storage abstraction.

Supports two backends (configured via STORAGE_BACKEND env var):

  supabase  — Supabase Storage (default, easiest for development).
              Requires the bucket to exist in your Supabase project.
              Dashboard → Storage → New bucket → name it 'atlas-files',
              set to Private, and enable RLS.

  s3        — Any S3-compatible service (AWS S3, Cloudflare R2, MinIO …).
              Requires S3_ACCESS_KEY_ID + S3_SECRET_ACCESS_KEY in .env.

Usage:
    from app.utils.storage import storage_client
    path = await storage_client.upload(data=bytes, path="user_id/file.pdf", content_type="application/pdf")
    url  = storage_client.get_public_url(path)        # signed URL (private bucket)
    await storage_client.delete(path)
"""

import io
import uuid
from typing import Optional

import httpx

from app.config import settings
from app.utils.supabase_client import supabase


# ── Helpers ────────────────────────────────────────────────────────────────

def _make_storage_path(user_id: str, original_name: str) -> str:
    """
    Build a unique storage path that stays inside the user's 'folder'.
    Pattern:  <user_id>/<uuid>_<sanitised-filename>
    """
    safe_name = "".join(
        c if (c.isalnum() or c in "._-") else "_"
        for c in original_name
    )
    unique_prefix = uuid.uuid4().hex[:8]
    return f"{user_id}/{unique_prefix}_{safe_name}"


# ── Supabase Storage backend ───────────────────────────────────────────────

class SupabaseStorageClient:
    """Thin wrapper around the Supabase Python SDK's storage API."""

    def __init__(self, bucket: str) -> None:
        self.bucket = bucket

    def _bucket(self):
        return supabase.storage.from_(self.bucket)

    async def upload(
        self,
        data: bytes,
        path: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Upload bytes to Supabase Storage. Returns the storage path."""
        self._bucket().upload(
            path=path,
            file=data,
            file_options={"content-type": content_type, "upsert": "true"},
        )
        return path

    def get_signed_url(self, path: str, expires_in: int = 3600) -> str:
        """Return a time-limited signed URL for a private-bucket file."""
        res = self._bucket().create_signed_url(path, expires_in)
        return res.get("signedURL", "")

    async def delete(self, path: str) -> None:
        self._bucket().remove([path])


# ── S3-compatible backend ──────────────────────────────────────────────────

class S3StorageClient:
    """
    Async S3 client using httpx + AWS SigV4 signing via boto3.
    boto3 is only imported when storage_backend=s3, so it stays
    out of the default dependency set.
    """

    def __init__(self, bucket: str) -> None:
        self.bucket = bucket

    def _get_client(self):
        import boto3  # lazy import — only needed for S3 backend

        kwargs: dict = {
            "aws_access_key_id":     settings.s3_access_key_id,
            "aws_secret_access_key": settings.s3_secret_access_key,
            "region_name":           settings.s3_region,
        }
        if settings.s3_endpoint_url:
            kwargs["endpoint_url"] = settings.s3_endpoint_url
        return boto3.client("s3", **kwargs)

    async def upload(
        self,
        data: bytes,
        path: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        client = self._get_client()
        client.put_object(
            Bucket=self.bucket,
            Key=path,
            Body=data,
            ContentType=content_type,
        )
        return path

    def get_signed_url(self, path: str, expires_in: int = 3600) -> str:
        client = self._get_client()
        return client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": path},
            ExpiresIn=expires_in,
        )

    async def delete(self, path: str) -> None:
        client = self._get_client()
        client.delete_object(Bucket=self.bucket, Key=path)


# ── Factory ────────────────────────────────────────────────────────────────

def _make_storage_client():
    backend = settings.storage_backend.lower()
    bucket  = settings.storage_bucket
    if backend == "s3":
        return S3StorageClient(bucket)
    return SupabaseStorageClient(bucket)


storage_client = _make_storage_client()

# Export the path builder so the router can use it
make_storage_path = _make_storage_path
