from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Supabase ───────────────────────────────────────────────────────────
    supabase_url: str
    supabase_service_key: str

    # ── Frontend ───────────────────────────────────────────────────────────
    frontend_url: str = "http://localhost:3000"

    # ── File storage ───────────────────────────────────────────────────────
    # Set STORAGE_BACKEND=supabase to use Supabase Storage (free, easiest).
    # Set STORAGE_BACKEND=s3 and fill the S3_* vars to use AWS S3 / R2 / etc.
    storage_backend: str = "supabase"       # "supabase" | "s3"
    storage_bucket:  str = "atlas-files"    # bucket / storage bucket name

    # S3-compatible (used when storage_backend=s3)
    s3_endpoint_url:       str = ""         # leave empty for AWS; set for R2/MinIO
    s3_access_key_id:      str = ""
    s3_secret_access_key:  str = ""
    s3_region:             str = "us-east-1"

    # ── Upload limits ──────────────────────────────────────────────────────
    max_file_size_bytes: int = 500 * 1024 * 1024   # 500 MB (FR-1.2)

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
