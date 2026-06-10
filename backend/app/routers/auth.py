from supabase import create_client, Client
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import bcrypt
import jwt
import string
import random
import json

# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"⚠️ Supabase connection error: {e}")
    supabase = None

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Models
class SignupRequest(BaseModel):
    email: str
    password: str
    confirm_password: str
    terms_agreed: bool

class VerifyRequest(BaseModel):
    email: str
    code: str

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: bool = False

# Temp storage for verification codes (until email is verified)
verification_codes = {}

# Helper functions
def hash_password(password: str) -> str:
    """Hash password with bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except:
        return False

def create_token(user_id: str, email: str) -> str:
    """Create JWT token"""
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, "atlas-secret-key-2026", algorithm="HS256")

def send_verification_email(email: str, code: str):
    """Print code to console (development)"""
    print(f"\n{'='*60}")
    print(f"📧 VERIFICATION EMAIL SENT")
    print(f"{'='*60}")
    print(f"To: {email}")
    print(f"Code: {code}")
    print(f"{'='*60}\n")

@router.post("/signup")
async def signup(request: SignupRequest):
    """Create new user account"""
    try:
        # Validation
        if not request.email or not request.password:
            raise HTTPException(status_code=400, detail="Email and password required")
        
        if request.password != request.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords don't match")
        
        if len(request.password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        
        if not any(c.isupper() for c in request.password):
            raise HTTPException(status_code=400, detail="Password must contain uppercase letter")
        
        if not any(c.isdigit() for c in request.password):
            raise HTTPException(status_code=400, detail="Password must contain number")
        
        if not request.terms_agreed:
            raise HTTPException(status_code=400, detail="Must agree to terms")
        
        # Check if user exists in Supabase
        response = supabase.table("users").select("*").eq("email", request.email).execute()
        
        if response.data and len(response.data) > 0:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Generate verification code
        code = ''.join(random.choices(string.digits, k=6))
        
        # Hash password
        hashed_password = hash_password(request.password)
        
        # Store in Supabase
        user_data = {
            "email": request.email,
            "password_hash": hashed_password,
            "first_name": "",
            "last_name": "",
            "full_name": "",
            "email_verified": False,
            "created_at": datetime.utcnow().isoformat(),
            "onboarding_completed": False
        }
        
        insert_response = supabase.table("users").insert(user_data).execute()
        
        if not insert_response.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        # Store verification code temporarily
        verification_codes[request.email] = {
            "code": code,
            "expires": datetime.utcnow() + timedelta(minutes=10)
        }
        
        # Send code to console
        send_verification_email(request.email, code)
        
        return {
            "message": "Account created. Check backend console for verification code.",
            "email": request.email
        }
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")

@router.post("/verify-email")
async def verify_email(request: VerifyRequest):
    """Verify email with code"""
    try:
        # Check code
        if request.email not in verification_codes:
            raise HTTPException(status_code=400, detail="No verification code found")
        
        stored = verification_codes[request.email]
        
        if stored["code"] != request.code:
            raise HTTPException(status_code=400, detail="Invalid code")
        
        if datetime.utcnow() > stored["expires"]:
            raise HTTPException(status_code=400, detail="Code expired")
        
        # Update user in Supabase
        supabase.table("users").update({
            "email_verified": True
        }).eq("email", request.email).execute()
        
        # Remove code
        del verification_codes[request.email]
        
        return {"message": "Email verified successfully"}
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Verify error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(request: LoginRequest):
    """Login user"""
    try:
        # Get user from Supabase
        response = supabase.table("users").select("*").eq("email", request.email).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = response.data[0]
        
        # Verify password
        if not verify_password(request.password, user.get("password_hash", "")):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Check email verified
        if not user.get("email_verified", False):
            raise HTTPException(status_code=401, detail="Email not verified. Please verify your email first.")
        
        # Create tokens
        access_token = create_token(user["id"], user["email"])
        refresh_token = create_token(user["id"], user["email"])
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "full_name": user.get("full_name", "")
            }
        }
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health():
    """Health check"""
    return {"status": "ok", "supabase_connected": supabase is not None}