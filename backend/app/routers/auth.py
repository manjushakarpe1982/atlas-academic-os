from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from app.utils.supabase_client import supabase

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    first_name: str      = Field(min_length=1, max_length=50)
    last_name:  str      = Field(default="", max_length=50)
    email:      EmailStr
    password:   str      = Field(min_length=8, max_length=128)

class SignupResponse(BaseModel):
    message:  str
    user_id:  str
    email:    str

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str = Field(min_length=1)

class LoginResponse(BaseModel):
    message:       str
    user_id:       str
    email:         str
    access_token:  str
    refresh_token: str
    full_name:     str


# ── helpers ────────────────────────────────────────────────────────────────

def _friendly_auth_error(raw: str) -> str:
    """Convert raw Supabase error messages into user-friendly text."""
    msg = raw.lower()
    if "rate limit" in msg or "email rate" in msg or "too many" in msg:
        return (
            "Too many sign-up attempts. Please wait a few minutes and try again, "
            "or use a different email address."
        )
    if "already registered" in msg or "already exists" in msg or "duplicate" in msg:
        return "This email is already registered. Try logging in instead."
    if "invalid email" in msg:
        return "Please enter a valid email address."
    if "weak password" in msg or "password should" in msg:
        return "Password is too weak. Use at least 8 characters with letters and numbers."
    if "network" in msg or "connection" in msg:
        return "Connection error. Please check your internet and try again."
    return "Something went wrong. Please try again in a moment."


# ── POST /api/auth/signup ──────────────────────────────────────────────────

@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Atlas account",
)
async def signup(body: SignupRequest):
    """
    Creates a new user with Supabase Auth and saves their profile.

    Note: In Supabase dashboard → Authentication → Settings,
    set 'Enable email confirmations' to OFF during development
    to avoid the email rate limit (3 emails/hour on free tier).
    """

    # 1. Create auth user
    try:
        auth_res = supabase.auth.sign_up({
            "email":    body.email,
            "password": body.password,
        })
    except Exception as e:
        raw = str(e)
        raise HTTPException(
            status_code=429 if "rate" in raw.lower() else 400,
            detail=_friendly_auth_error(raw),
        )

    if not auth_res.user:
        raise HTTPException(
            status_code=400,
            detail="Could not create account. The email may already be registered.",
        )

    user_id = auth_res.user.id
    email   = auth_res.user.email

    # 2. Save profile
    try:
        supabase.table("users").insert({
            "id":         user_id,
            "email":      email,
            "first_name": body.first_name,
            "last_name":  body.last_name,
            "full_name":  f"{body.first_name} {body.last_name}".strip(),
        }).execute()
    except Exception as e:
        print(f"[signup] profile insert failed for {user_id}: {e}")

    return SignupResponse(
        message="Account created successfully.",
        user_id=user_id,
        email=email,
    )


# ── POST /api/auth/login ───────────────────────────────────────────────────

@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in to Atlas",
)
async def login(body: LoginRequest):
    """
    Authenticates a user via Supabase.
    Returns access_token + refresh_token for the frontend to store.
    """

    # 1. Sign in with Supabase
    try:
        auth_res = supabase.auth.sign_in_with_password({
            "email":    body.email,
            "password": body.password,
        })
    except Exception as e:
        raw = str(e).lower()
        if any(w in raw for w in ["invalid", "credentials", "wrong", "password", "not found"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password. Please try again.",
            )
        if "email not confirmed" in raw:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=(
                    "Please verify your email before logging in. "
                    "Check your inbox for the confirmation link, "
                    "or disable email confirmation in Supabase dashboard."
                ),
            )
        raise HTTPException(
            status_code=500,
            detail=f"Login error: {str(e)}",
        )

    if not auth_res.user or not auth_res.session:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password. Please try again.",
        )

    user_id       = auth_res.user.id
    email         = auth_res.user.email
    access_token  = auth_res.session.access_token
    refresh_token = auth_res.session.refresh_token

    # 2. Fetch profile
    full_name = ""
    try:
        profile = (
            supabase.table("users")
            .select("full_name")
            .eq("id", user_id)
            .single()
            .execute()
        )
        if profile.data:
            full_name = profile.data.get("full_name", "")
    except Exception as e:
        print(f"[login] profile fetch failed for {user_id}: {e}")

    return LoginResponse(
        message="Login successful.",
        user_id=user_id,
        email=email,
        access_token=access_token,
        refresh_token=refresh_token,
        full_name=full_name,
    )
