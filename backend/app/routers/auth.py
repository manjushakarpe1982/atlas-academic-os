# Backend: app/routers/auth.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional
import secrets
import os
from dotenv import load_dotenv

load_dotenv()

# ============================================================================
# Configuration
# ============================================================================

SECRET_KEY = os.getenv("SECRET_KEY", "test-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# ============================================================================
# Pydantic Models
# ============================================================================

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    password_confirm: str

class VerifyEmailRequest(BaseModel):
    code: str = Field(min_length=6, max_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ============================================================================
# In-Memory Database (For Development)
# ============================================================================

# Users: {email: {id, email, password_hash, email_verified}}
USERS = {}

# Verification codes: {code: {email, user_id, expires_at}}
VERIFICATIONS = {}

# ============================================================================
# Helper Functions
# ============================================================================

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    try:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"Error hashing password: {e}")
        raise

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False

def create_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT token"""
    try:
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode,
            SECRET_KEY,
            algorithm=ALGORITHM
        )
        
        return encoded_jwt
    except Exception as e:
        print(f"Error creating token: {e}")
        raise

def send_verification_email(email: str, code: str):
    """Send verification email (prints to console for development)"""
    print(f"\n{'='*60}")
    print(f"📧 VERIFICATION EMAIL SENT")
    print(f"{'='*60}")
    print(f"To: {email}")
    print(f"Code: {code}")
    print(f"{'='*60}\n")

# ============================================================================
# Router
# ============================================================================

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ============================================================================
# ENDPOINT 1: POST /api/auth/signup
# ============================================================================

@router.post("/signup", status_code=201)
async def signup(request: SignupRequest):
    """Create new account"""
    try:
        # Validate password confirmation
        if request.password != request.password_confirm:
            raise HTTPException(
                status_code=400,
                detail="Passwords do not match"
            )
        
        # Validate password strength
        if not any(c.isupper() for c in request.password):
            raise HTTPException(status_code=400, detail="Password must contain uppercase")
        if not any(c.islower() for c in request.password):
            raise HTTPException(status_code=400, detail="Password must contain lowercase")
        if not any(c.isdigit() for c in request.password):
            raise HTTPException(status_code=400, detail="Password must contain number")
        
        # Check if email exists
        if request.email in USERS:
            raise HTTPException(status_code=409, detail="Email already exists")
        
        # Create user
        user_id = secrets.token_hex(8)
        hashed_password = hash_password(request.password)
        
        USERS[request.email] = {
            "id": user_id,
            "email": request.email,
            "password_hash": hashed_password,
            "email_verified": False,
            "created_at": datetime.now().isoformat()
        }
        
        # Generate verification code
        verification_code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
        
        # Store verification
        VERIFICATIONS[verification_code] = {
            "email": request.email,
            "user_id": user_id,
            "expires_at": (datetime.now() + timedelta(hours=24)).isoformat()
        }
        
        # Send email
        send_verification_email(request.email, verification_code)
        
        return {
            "status": "success",
            "message": "Account created. Check your email.",
            "user_id": user_id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ============================================================================
# ENDPOINT 2: POST /api/auth/verify-email
# ============================================================================

@router.post("/verify-email", status_code=200)
async def verify_email(request: VerifyEmailRequest):
    """Verify email with code"""
    try:
        # Find verification
        if request.code not in VERIFICATIONS:
            raise HTTPException(status_code=400, detail="Invalid code")
        
        verification = VERIFICATIONS[request.code]
        
        # Check expiry
        expires_at = datetime.fromisoformat(verification["expires_at"])
        if datetime.now() > expires_at:
            del VERIFICATIONS[request.code]
            raise HTTPException(status_code=400, detail="Code expired")
        
        # Mark email as verified
        email = verification["email"]
        if email in USERS:
            USERS[email]["email_verified"] = True
        
        # Delete code
        del VERIFICATIONS[request.code]
        
        return {
            "status": "success",
            "message": "Email verified. You can now login."
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Verify email error: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ============================================================================
# ENDPOINT 3: POST /api/auth/login
# ============================================================================

@router.post("/login", status_code=200)
async def login(request: LoginRequest):
    """Login with email and password"""
    try:
        # Find user
        if request.email not in USERS:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = USERS[request.email]
        
        # Check email verified
        if not user["email_verified"]:
            raise HTTPException(status_code=401, detail="Email not verified")
        
        # Verify password
        if not verify_password(request.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create tokens
        access_token = create_token(
            data={"sub": user["id"], "email": user["email"]},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        refresh_token = create_token(
            data={"sub": user["id"], "type": "refresh"},
            expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        )
        
        return {
            "status": "success",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user["id"],
                "email": user["email"]
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# ============================================================================
# Health Check
# ============================================================================

@router.get("/health")
async def health():
    """Health check"""
    return {
        "status": "healthy",
        "module": "auth"
    }
