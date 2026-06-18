"""
auth.py — Authentication router.

POST /api/auth/signup   Create account → returns access_token immediately
POST /api/auth/login    Login → returns access_token
POST /api/auth/school   Save school selection (requires token)
GET  /api/auth/me       Get current user profile (requires token)
"""
import secrets
from datetime import datetime, timedelta
from typing import Optional
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

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token:            str
    password:         str
    confirm_password: str

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
            "id,email,full_name,school,acknowledged_at,created_at,profile_picture_url"
        ).eq("id", user_id).single().execute()
    except Exception:
        raise HTTPException(404, "User not found")

    return result.data

# ── POST /api/auth/forgot-password ────────────────────────────────────────

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    if not req.email or "@" not in req.email:
        raise HTTPException(400, "Valid email address required")

    email = req.email.lower().strip()

    # Look up user — always return 200 to prevent email enumeration
    try:
        result = supabase.table("users").select("id,email,full_name").eq("email", email).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    if not result.data:
        # Return success anyway — don't reveal if email exists
        return {"message": "If an account exists for this email, a reset link has been sent."}

    user = result.data[0]

    # Generate secure token + expiry (1 hour)
    reset_token  = secrets.token_urlsafe(32)
    token_expiry = (datetime.utcnow() + timedelta(hours=1)).isoformat()

    try:
        supabase.table("users").update({
            "reset_token":        reset_token,
            "reset_token_expiry": token_expiry,
        }).eq("id", user["id"]).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    # Build reset URL
    from app.config import settings
    from app.utils.email import send_password_reset_email

    reset_url = f"{settings.frontend_url}/auth/reset-password?token={reset_token}"

    # Send email — works in dev (prints URL) and production (sends via Resend)
    full_name = user.get("full_name", "")
    email_sent = send_password_reset_email(email, full_name, reset_url)

    response = {"message": "If an account exists for this email, a reset link has been sent."}

    # Only expose reset_url when no API key is set (dev mode)
    if not settings.resend_api_key:
        response["reset_url"] = reset_url
        response["dev_note"]  = "Set RESEND_API_KEY in .env to send real emails"

    return response


# ── POST /api/auth/reset-password ─────────────────────────────────────────

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    if not req.token:
        raise HTTPException(400, "Reset token is required")
    if req.password != req.confirm_password:
        raise HTTPException(400, "Passwords do not match")
    if len(req.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")
    if not any(c.isupper() for c in req.password):
        raise HTTPException(400, "Password must contain an uppercase letter")
    if not any(c.isdigit() for c in req.password):
        raise HTTPException(400, "Password must contain a number")

    # Look up token
    try:
        result = supabase.table("users").select(
            "id,email,reset_token,reset_token_expiry"
        ).eq("reset_token", req.token).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    if not result.data:
        raise HTTPException(400, "Invalid or expired reset link. Please request a new one.")

    user = result.data[0]

    # Check expiry
    expiry = user.get("reset_token_expiry")
    if expiry and datetime.utcnow() > datetime.fromisoformat(expiry.replace("Z", "")):
        raise HTTPException(400, "Reset link has expired. Please request a new one.")

    # Update password and clear token
    try:
        supabase.table("users").update({
            "password_hash":      hash_password(req.password),
            "reset_token":        None,
            "reset_token_expiry": None,
        }).eq("id", user["id"]).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    print(f"[ResetPassword] Password reset for: {user['email']}")
    return {"message": "Password reset successfully. You can now sign in."}



# ── PATCH /api/auth/me ────────────────────────────────────────────────────

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    email:     Optional[str] = None
    university:Optional[str] = None
    major:     Optional[str] = None
    year:      Optional[str] = None

@router.patch("/me")
async def update_me(req: UpdateProfileRequest, request: Request):
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

    updates: dict = {}
    if req.full_name is not None:
        if len(req.full_name.strip()) < 2:
            raise HTTPException(400, "Name must be at least 2 characters")
        updates["full_name"] = req.full_name.strip()
    if req.email is not None:
        if "@" not in req.email:
            raise HTTPException(400, "Invalid email address")
        updates["email"] = req.email.strip().lower()
    if req.university is not None:
        updates["university"] = req.university.strip()
    if req.major is not None:
        updates["major"] = req.major.strip()
    if req.year is not None:
        updates["year"] = req.year.strip()

    if not updates:
        raise HTTPException(400, "No fields to update")

    try:
        result = supabase.table("users").update(updates).eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(500, "Update failed")
        user = result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    return {
        "message":   "Profile updated successfully",
        "full_name": user.get("full_name"),
        "email":     user.get("email"),
    }

@router.get("/health")
async def health():
    return {"status": "ok"}


# ── POST /api/auth/me/profile-picture ────────────────────────────────────
import os
from fastapi import File, UploadFile

@router.post("/me/profile-picture")
async def upload_profile_picture(file: UploadFile = File(...), request: Request = None):
    """Upload user profile picture"""
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(400, "Invalid file type. Only JPEG, PNG, GIF, WebP allowed.")

    # Validate file size (5MB max)
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(400, "File too large. Maximum 5MB allowed.")

    # Upload to Supabase Storage
    try:
        bucket_name = "profile-pictures"
        file_path = f"{user_id}/{file.filename}"
        
        # Upload file
        supabase.storage.from_(bucket_name).upload(
            file_path,
            file_content,
            {"content-type": file.content_type},
        )
        
        # Get public URL
        profile_picture_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
        
        # Update user in database
        result = supabase.table("users").update({
            "profile_picture_url": profile_picture_url
        }).eq("id", user_id).execute()
        
        if not result.data:
            raise HTTPException(500, "Failed to update profile picture")
        
        return {
            "message": "Profile picture updated successfully",
            "profile_picture_url": profile_picture_url
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ProfilePictureUpload] Error: {e}")
        raise HTTPException(500, f"Upload failed: {str(e)}")
