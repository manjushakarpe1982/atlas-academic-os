"""
auth.py — Authentication router.

POST /api/auth/signup   Create account → returns access_token immediately
POST /api/auth/login    Login → returns access_token
POST /api/auth/school   Save school selection (requires token)
GET  /api/auth/me       Get current user profile (requires token)
"""
import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.utils.supabase_client import supabase
from app.utils.auth_helpers import hash_password, verify_password, create_token, get_user_id

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ── Models ─────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    full_name:        str
    email:            str
    password:         str
    confirm_password: str

class LoginRequest(BaseModel):
    email:    str
    password: str

class SchoolRequest(BaseModel):
    school: str  # "arkansas" | "tamu" | "other"

# ── Helpers ─────────────────────────────────────────────────────────────────

def _user_response(user: dict, token: str) -> dict:
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {
            "id":              str(user["id"]),
            "email":           user["email"],
            "full_name":       user.get("full_name", ""),
            "school":          user.get("school"),
            "acknowledged_at": user.get("acknowledged_at"),
        }
    }

# ── POST /api/auth/signup ───────────────────────────────────────────────────

@router.post("/signup", status_code=201)
async def signup(req: SignupRequest):
    # Validate
    if not req.full_name or len(req.full_name.strip()) < 2:
        raise HTTPException(400, "Full name must be at least 2 characters")
    if not req.email or "@" not in req.email:
        raise HTTPException(400, "Valid email address required")
    if req.password != req.confirm_password:
        raise HTTPException(400, "Passwords do not match")
    if len(req.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    if not any(c.isupper() for c in req.password):
        raise HTTPException(400, "Password must contain an uppercase letter")
    if not any(c.isdigit() for c in req.password):
        raise HTTPException(400, "Password must contain a number")

    # Check existing user
    try:
        existing = supabase.table("users").select("id").eq("email", req.email).execute()
        if existing.data:
            raise HTTPException(400, "An account with this email already exists")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    # Create user in Supabase
    try:
        result = supabase.table("users").insert({
            "full_name":      req.full_name.strip(),
            "email":          req.email.lower().strip(),
            "password_hash":  hash_password(req.password),
            "email_verified": True,   # No email verification step
            "school":         None,
            "acknowledged_at": None,
            "ack_version":    None,
        }).execute()
        if not result.data:
            raise HTTPException(500, "Failed to create user")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to create account: {e}")

    user  = result.data[0]
    token = create_token(str(user["id"]), user["email"])
    print(f"[Signup] Created: {req.email}")
    return _user_response(user, token)

# ── POST /api/auth/login ────────────────────────────────────────────────────

@router.post("/login")
async def login(req: LoginRequest):
    try:
        result = supabase.table("users").select("*").eq("email", req.email.lower().strip()).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    if not result.data:
        raise HTTPException(401, "Invalid email or password")

    user = result.data[0]
    if not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(401, "Invalid email or password")

    # Update last login
    try:
        supabase.table("users").update({
            "last_login_at": datetime.utcnow().isoformat()
        }).eq("id", user["id"]).execute()
    except Exception:
        pass

    token = create_token(str(user["id"]), user["email"])
    print(f"[Login] Success: {req.email}")
    return _user_response(user, token)

# ── POST /api/auth/school ───────────────────────────────────────────────────

@router.post("/school")
async def save_school(req: SchoolRequest, request: Request):
    if req.school not in ("arkansas", "tamu", "other"):
        raise HTTPException(400, "School must be: arkansas, tamu, or other")

    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

    try:
        supabase.table("users").update({"school": req.school}).eq("id", user_id).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    return {"message": "School saved", "school": req.school}

# ── GET /api/auth/me ────────────────────────────────────────────────────────

@router.get("/me")
async def get_me(request: Request):
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

    try:
        result = supabase.table("users").select(
            "id,email,full_name,school,acknowledged_at,created_at"
        ).eq("id", user_id).single().execute()
    except Exception:
        raise HTTPException(404, "User not found")

    return result.data

@router.get("/health")
async def health():
    return {"status": "ok"}
