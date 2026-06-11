"""
ack.py — Pre-upload acknowledgment endpoint.

POST /api/ack
  - Requires valid JWT in Authorization header
  - Records acknowledged_at timestamp + ack_version in users table
  - Must be called before any file upload is allowed
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.utils.supabase_client import supabase
from app.utils.auth_helpers import get_user_id

router = APIRouter(tags=["acknowledgment"])


class AckRequest(BaseModel):
    ack_version: str = "1.0"


@router.post("/api/ack")
async def record_acknowledgment(req: AckRequest, request: Request):
    # Get user from token
    auth = (
        request.headers.get("Authorization") or
        request.headers.get("authorization") or ""
    )
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

    # Save to Supabase
    try:
        supabase.table("users").update({
            "acknowledged_at": datetime.utcnow().isoformat(),
            "ack_version":     req.ack_version,
        }).eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    return {
        "message":        "Acknowledgment recorded",
        "ack_version":    req.ack_version,
        "acknowledged_at": datetime.utcnow().isoformat(),
    }
