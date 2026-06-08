from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Supabase ───────────────────────────────────────────────────────────
    supabase_url: str
    supabase_service_key: str

    # ── Frontend ───────────────────────────────────────────────────────────
    frontend_url: str = "http://localhost:3000"

    # ── AI ─────────────────────────────────────────────────────────────────
    anthropic_api_key: str = ""   # required for AI parsing

    # ── File storage ───────────────────────────────────────────────────────
    storage_backend: str = "supabase"   # "supabase" | "s3"
    storage_bucket:  str = "atlas-files"

    # S3-compatible (only used when storage_backend=s3)
    s3_endpoint_url:      str = ""
    s3_access_key_id:     str = ""
    s3_secret_access_key: str = ""
    s3_region:            str = "us-east-1"

    # ── Upload limits ──────────────────────────────────────────────────────
    max_file_size_bytes: int = 500 * 1024 * 1024   # 500 MB

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
