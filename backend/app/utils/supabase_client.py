from supabase import create_client, Client
from app.config import settings

# Single Supabase client — uses SERVICE KEY for full access
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_key,
)
