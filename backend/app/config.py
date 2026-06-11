from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url:         str
    supabase_key:         str = ""
    supabase_service_key: str = ""
    frontend_url:         str = "http://localhost:3000"
    backend_url:          str = "http://localhost:8000"
    jwt_secret:           str = "atlas-secret-change-in-production"
    jwt_algorithm:        str = "HS256"

    def get_key(self) -> str:
        return self.supabase_service_key or self.supabase_key

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

settings = Settings()