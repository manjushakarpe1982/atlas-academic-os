"""
Onboarding endpoints.

Stores everything collected across the 5-step onboarding wizard in the
`onboarding` table, and flips `users.onboarding_completed` when the user
finishes (or skips) setup.

All routes require a valid Supabase access token (see utils/auth.py).
"""

from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.utils.supabase_client import supabase
from app.utils.auth import get_current_user_id

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────

class FixedEvent(BaseModel):
    label: str = ""
    days: List[str] = Field(default_factory=list)
    time: str = ""
    emoji: str = "📅"


class OnboardingData(BaseModel):
    # Step 1
    role: Optional[str] = None
    # Step 2
    institution: Optional[str] = None
    field_of_study: Optional[str] = None
    year_level: Optional[str] = None
    target_gpa: Optional[float] = None
    # Step 3
    goals: List[str] = Field(default_factory=list)
    top_priority: Optional[str] = None
    # Step 4
    study_time: Optional[str] = None
    session_length: Optional[str] = None
    weekday_hours: Optional[float] = None
    weekend_hours: Optional[float] = None
    sleep_start: Optional[str] = None
    sleep_end: Optional[str] = None
    fixed_events: List[FixedEvent] = Field(default_factory=list)


class OnboardingResponse(OnboardingData):
    completed: bool = False


class SaveResponse(BaseModel):
    message: str
    completed: bool


# ── helpers ────────────────────────────────────────────────────────────────

def _ensure_user_row(user_id: str) -> bool:
    """
    Make sure a public.users row exists for this auth user.

    Email/password signup creates this row, but OAuth (Google) users may not
    have one yet. The onboarding table has an FK to public.users, so we create
    a minimal profile row from the auth record if it's missing.

    Returns True if a profile row exists (either already existed or was just
    created). Returns False on failure so the caller can return a clean error
    instead of letting the FK violation surface to the user.
    """
    # 1. Does the profile row already exist?
    try:
        existing = (
            supabase.table("users").select("id").eq("id", user_id).limit(1).execute()
        )
        if existing.data:
            return True
    except Exception as e:
        print(f"[ensure_user_row] existence check failed for {user_id}: {e}")

    # 2. Pull basic profile info from the auth user, if available.
    email = None
    full_name = ""
    first_name = ""
    last_name = ""
    try:
        admin_user = supabase.auth.admin.get_user_by_id(user_id)
        u = getattr(admin_user, "user", None)
        if u:
            email = getattr(u, "email", None)
            meta = getattr(u, "user_metadata", None) or {}
            full_name = meta.get("full_name") or meta.get("name") or ""
            first_name = meta.get("first_name") or (full_name.split(" ")[0] if full_name else "")
            last_name  = meta.get("last_name")  or (" ".join(full_name.split(" ")[1:]) if full_name else "")
    except Exception as e:
        print(f"[ensure_user_row] auth fetch failed for {user_id}: {e}")
        # Continue anyway — we can create a row without an email.

    # 3. Insert the profile row.
    payload = {
        "id": user_id,
        "email": email or "",          # column is nullable but use empty string defensively
        "full_name": full_name,
        "first_name": first_name,
        "last_name": last_name,
        "onboarding_completed": False,
    }
    try:
        supabase.table("users").upsert(payload, on_conflict="id").execute()
        return True
    except Exception as e:
        print(f"[ensure_user_row] insert failed for {user_id}: {e}")
        # Retry with the absolute minimum payload in case extra columns are the issue.
        try:
            supabase.table("users").upsert(
                {"id": user_id, "onboarding_completed": False}, on_conflict="id"
            ).execute()
            return True
        except Exception as e2:
            print(f"[ensure_user_row] minimal insert also failed for {user_id}: {e2}")
            return False


def _row_to_response(row: dict) -> OnboardingResponse:
    """Map a DB row into the response model (with safe defaults)."""
    return OnboardingResponse(
        role=row.get("role"),
        institution=row.get("institution"),
        field_of_study=row.get("field_of_study"),
        year_level=row.get("year_level"),
        target_gpa=row.get("target_gpa"),
        goals=row.get("goals") or [],
        top_priority=row.get("top_priority"),
        study_time=row.get("study_time"),
        session_length=row.get("session_length"),
        weekday_hours=row.get("weekday_hours"),
        weekend_hours=row.get("weekend_hours"),
        sleep_start=row.get("sleep_start"),
        sleep_end=row.get("sleep_end"),
        fixed_events=row.get("fixed_events") or [],
        completed=bool(row.get("completed", False)),
    )


# ── GET /api/onboarding ────────────────────────────────────────────────────

@router.get(
    "",
    response_model=OnboardingResponse,
    summary="Fetch the current user's onboarding data",
)
async def get_onboarding(user_id: str = Depends(get_current_user_id)):
    """Return saved onboarding data, or an empty default if none exists yet."""
    try:
        res = (
            supabase.table("onboarding")
            .select("*")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load onboarding: {e}")

    if res.data:
        return _row_to_response(res.data[0])

    # Nothing saved yet — return an empty shell so the UI can start fresh.
    return OnboardingResponse()


# ── PUT /api/onboarding ────────────────────────────────────────────────────

@router.put(
    "",
    response_model=SaveResponse,
    summary="Save (upsert) onboarding data",
)
async def save_onboarding(
    body: OnboardingData,
    complete: bool = False,
    user_id: str = Depends(get_current_user_id),
):
    """
    Upsert the user's onboarding data.

    Pass `?complete=true` (sent on the final step / skip) to also mark
    onboarding as finished, which sets `users.onboarding_completed = true`.
    """
    payload = body.model_dump()
    # jsonb columns
    payload["fixed_events"] = [e for e in payload.get("fixed_events", [])]
    payload["goals"] = payload.get("goals", [])
    payload["user_id"] = user_id
    payload["completed"] = complete

    if not _ensure_user_row(user_id):
        raise HTTPException(
            status_code=500,
            detail="Could not initialise your account profile. Please log out and back in, then try again.",
        )

    try:
        supabase.table("onboarding").upsert(payload, on_conflict="user_id").execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save onboarding: {e}")

    if complete:
        try:
            supabase.table("users").update(
                {"onboarding_completed": True}
            ).eq("id", user_id).execute()
        except Exception as e:
            # Non-fatal: the onboarding row is saved either way.
            print(f"[onboarding] could not flag user complete {user_id}: {e}")

    return SaveResponse(
        message="Onboarding saved." if not complete else "Onboarding complete.",
        completed=complete,
    )


# ── POST /api/onboarding/complete ──────────────────────────────────────────

@router.post(
    "/complete",
    response_model=SaveResponse,
    summary="Mark onboarding as complete without changing data",
)
async def complete_onboarding(user_id: str = Depends(get_current_user_id)):
    """Used by the 'Skip for now' action — flag complete, leave data as-is."""
    if not _ensure_user_row(user_id):
        raise HTTPException(
            status_code=500,
            detail="Could not initialise your account profile. Please log out and back in, then try again.",
        )
    try:
        supabase.table("onboarding").upsert(
            {"user_id": user_id, "completed": True}, on_conflict="user_id"
        ).execute()
        supabase.table("users").update(
            {"onboarding_completed": True}
        ).eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not complete onboarding: {e}")

    return SaveResponse(message="Onboarding complete.", completed=True)
