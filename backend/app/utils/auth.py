"""
FastAPI dependency that authenticates a request using the Supabase
access token sent by the frontend in the `Authorization: Bearer <token>`
header. Returns the authenticated user's id.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.utils.supabase_client import supabase

# `auto_error=False` lets us return a clean 401 instead of FastAPI's default.
_bearer = HTTPBearer(auto_error=False)


async def get_current_user_id(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> str:
    """Resolve the current user's id from the bearer token, or raise 401."""
    if creds is None or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in again.",
        )

    token = creds.credentials

    try:
        # Validate the JWT against Supabase Auth and fetch the user.
        res = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please log in again.",
        )

    user = getattr(res, "user", None)
    if user is None or not getattr(user, "id", None):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please log in again.",
        )

    return user.id
