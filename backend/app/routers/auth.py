from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from app.utils.supabase_client import supabase
from app.config import settings

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
    onboarding_completed: bool = False


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
    onboarding_completed = False
    try:
        profile = (
            supabase.table("users")
            .select("full_name, onboarding_completed")
            .eq("id", user_id)
            .single()
            .execute()
        )
        if profile.data:
            full_name = profile.data.get("full_name", "")
            onboarding_completed = bool(profile.data.get("onboarding_completed", False))
    except Exception as e:
        print(f"[login] profile fetch failed for {user_id}: {e}")

    return LoginResponse(
        message="Login successful.",
        user_id=user_id,
        email=email,
        access_token=access_token,
        refresh_token=refresh_token,
        full_name=full_name,
        onboarding_completed=onboarding_completed,
    )


# ── Password reset ─────────────────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    access_token: str          # recovery JWT from the email link
    new_password: str          # the new password the user typed


class SimpleMessage(BaseModel):
    message: str


@router.post(
    "/forgot-password",
    response_model=SimpleMessage,
    summary="Send a password-reset email to the given address",
)
async def forgot_password(body: ForgotPasswordRequest):
    """
    Asks Supabase Auth to email a recovery link. We call Supabase's auth
    REST API directly (instead of the SDK) because the SDK's
    reset_password_for_email is unreliable when the client is initialised
    with the service key — Supabase silently returns success without
    queueing the email. Calling the /auth/v1/recover endpoint directly works.

    We always return a success-shaped message even if the email isn't
    registered, to avoid leaking which addresses have accounts.
    """
    import httpx

    url = f"{settings.supabase_url}/auth/v1/recover"
    headers = {
        "apikey": settings.supabase_service_key,
        "Authorization": f"Bearer {settings.supabase_service_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "email": body.email,
        # Where Supabase redirects the user after they click the email link.
        "redirect_to": f"{settings.frontend_url}/reset-password",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.post(url, headers=headers, json=payload)
        if res.status_code >= 400:
            # Log the exact reason so it shows up in our server logs.
            print(f"[forgot-password] supabase {res.status_code}: {res.text}")
    except Exception as e:
        print(f"[forgot-password] network error for {body.email}: {e}")

    return SimpleMessage(
        message="If an account exists for that email, a reset link has been sent."
    )


@router.post(
    "/reset-password",
    response_model=SimpleMessage,
    summary="Set a new password using the recovery token from the email link",
)
async def reset_password(body: ResetPasswordRequest):
    """
    The user clicked the link in the recovery email, which delivered a
    recovery access token. We use it to authenticate the update_user call
    that sets the new password.
    """
    if len(body.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters.",
        )

    try:
        # Validate the recovery token belongs to a real user.
        user_res = supabase.auth.get_user(body.access_token)
        user = getattr(user_res, "user", None)
        if not user or not getattr(user, "id", None):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="This reset link is invalid or has expired. Please request a new one.",
            )

        # Update the user's password via the admin API (service key).
        supabase.auth.admin.update_user_by_id(
            user.id,
            {"password": body.new_password},
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[reset-password] error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not reset password. The link may have expired — please request a new one.",
        )

    return SimpleMessage(message="Password updated. You can now log in with your new password.")
