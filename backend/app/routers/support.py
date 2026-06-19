"""
support.py — Contact Support router.

POST /api/support/contact           Submit a support request
GET  /api/support/contact/requests  Get user's support requests
GET  /api/support/contact/requests/{id}  Get request details
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, validator
from app.utils.supabase_client import supabase
from app.utils.auth_helpers import get_user_id

router = APIRouter(prefix="/api/support", tags=["support"])

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ContactSupportRequest(BaseModel):
    """Contact support request"""
    category: str = Field(..., min_length=1, max_length=50)
    subject: str = Field(..., min_length=5, max_length=255)
    message: str = Field(..., min_length=10, max_length=5000)
    
    @validator('category')
    def validate_category(cls, v):
        allowed = ['bug', 'billing', 'account', 'calendar', 'ai-study', 'other']
        if v not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return v
    
    @validator('subject')
    def validate_subject(cls, v):
        if not v.strip():
            raise ValueError("Subject cannot be empty")
        return v.strip()
    
    @validator('message')
    def validate_message(cls, v):
        if not v.strip():
            raise ValueError("Message cannot be empty")
        return v.strip()


class ContactSupportResponse(BaseModel):
    """Response from contact support submission"""
    id: str
    category: str
    subject: str
    message: str
    status: str
    created_at: str


# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.post("/contact", response_model=ContactSupportResponse, status_code=201)
async def submit_contact_support(request_data: ContactSupportRequest, request: Request):
    """
    Submit a contact support request
    
    Categories: bug, billing, account, calendar, ai-study, other
    """
    
    # Get user from token
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        # Insert into Supabase
        response = supabase.table("contact_support_requests").insert({
            "user_id": user_id,
            "category": request_data.category,
            "subject": request_data.subject,
            "message": request_data.message,
            "status": "open",
            "priority": "normal",
            "created_at": datetime.utcnow().isoformat(),
        }).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to create support request"
            )
        
        data = response.data[0]
        
        return ContactSupportResponse(
            id=data["id"],
            category=data["category"],
            subject=data["subject"],
            message=data["message"],
            status=data["status"],
            created_at=data["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating support request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create support request"
        )


@router.get("/contact/requests")
async def get_user_support_requests(request: Request):
    """Get all support requests for the current user"""
    
    # Get user from token
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        response = supabase.table("contact_support_requests").select(
            "id, category, subject, status, priority, created_at, response_from_admin, resolved_at"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        
        return response.data if response.data else []
    
    except Exception as e:
        print(f"Error fetching support requests: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch support requests"
        )


@router.get("/contact/requests/{request_id}")
async def get_support_request_detail(request_id: str, request: Request):
    """Get details of a specific support request"""
    
    # Get user from token
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        response = supabase.table("contact_support_requests").select(
            "*"
        ).eq("id", request_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Support request not found"
            )
        
        return response.data[0]
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching support request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch support request"
        )
