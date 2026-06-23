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


# ============================================================================
# REPORT PROBLEM — PYDANTIC MODELS
# ============================================================================

class ReportProblemRequest(BaseModel):
    """Report a problem request"""
    description: str = Field(..., min_length=10, max_length=2000)
    severity: str = Field(default="medium", max_length=20)
    
    @validator('severity')
    def validate_severity(cls, v):
        allowed = ['low', 'medium', 'high']
        if v not in allowed:
            raise ValueError(f"Severity must be one of {allowed}")
        return v
    
    @validator('description')
    def validate_description(cls, v):
        if not v.strip():
            raise ValueError("Description cannot be empty")
        return v.strip()


class ReportProblemResponse(BaseModel):
    """Response from report problem submission"""
    id: str
    description: str
    severity: str
    status: str
    created_at: str


# ============================================================================
# REPORT PROBLEM — API ENDPOINTS
# ============================================================================

@router.post("/report-problem", response_model=ReportProblemResponse, status_code=201)
async def submit_report_problem(request_data: ReportProblemRequest, request: Request):
    """
    Submit a problem report.
    
    Severity levels: low, medium, high
    
    All reports are stored in Supabase `report_problems` table
    and are visible in the Supabase dashboard.
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
        # Insert into Supabase — visible in Supabase dashboard
        response = supabase.table("report_problems").insert({
            "user_id": user_id,
            "description": request_data.description,
            "severity": request_data.severity,
            "status": "open",
            "priority": "high" if request_data.severity == "high" else "normal",
            "created_at": datetime.utcnow().isoformat(),
        }).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to create problem report"
            )
        
        data = response.data[0]
        print(f"[ReportProblem] New report from user {user_id}: severity={request_data.severity}")
        
        return ReportProblemResponse(
            id=data["id"],
            description=data["description"],
            severity=data["severity"],
            status=data["status"],
            created_at=data["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating problem report: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create problem report"
        )


@router.get("/report-problem/requests")
async def get_user_report_problems(request: Request):
    """Get all problem reports for the current user"""
    
    # Get user from token
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        response = supabase.table("report_problems").select(
            "id, description, severity, status, priority, created_at, response_from_admin, resolved_at"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        
        return response.data if response.data else []
    
    except Exception as e:
        print(f"Error fetching problem reports: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch problem reports"
        )


@router.get("/report-problem/requests/{report_id}")
async def get_report_problem_detail(report_id: str, request: Request):
    """Get details of a specific problem report"""
    
    # Get user from token
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        response = supabase.table("report_problems").select(
            "*"
        ).eq("id", report_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Problem report not found"
            )
        
        return response.data[0]
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching problem report: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch problem report"
        )


# ============================================================================
# FEATURE REQUEST — PYDANTIC MODELS
# ============================================================================

class FeatureRequestCreate(BaseModel):
    """Feature request submission"""
    title: str = Field(..., min_length=3, max_length=80)
    description: str = Field(..., min_length=10, max_length=1000)
    category: str = Field(default="other", max_length=30)
    importance: int = Field(default=3, ge=1, le=5)
    
    @validator('title')
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()
    
    @validator('description')
    def validate_description(cls, v):
        if not v.strip():
            raise ValueError("Description cannot be empty")
        return v.strip()
    
    @validator('category')
    def validate_category(cls, v):
        allowed = ['ui_ux', 'new_feature', 'performance', 'integration', 'other']
        if v not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return v


class FeatureRequestResponse(BaseModel):
    """Response from feature request submission"""
    id: str
    title: str
    description: str
    category: str
    importance: int
    status: str
    created_at: str


# ============================================================================
# FEATURE REQUEST — API ENDPOINTS
# ============================================================================

@router.post("/feature-request", response_model=FeatureRequestResponse, status_code=201)
async def submit_feature_request(request_data: FeatureRequestCreate, request: Request):
    """
    Submit a feature request.
    
    Categories: ui_ux, new_feature, performance, integration, other
    Importance: 1-5 (1=nice to have, 5=critical need)
    
    All requests are stored in Supabase `feature_requests` table
    and are visible in the Supabase dashboard.
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
        # Map importance to priority for admin triage
        priority = "normal"
        if request_data.importance >= 5:
            priority = "high"
        elif request_data.importance <= 2:
            priority = "low"

        # Insert into Supabase — visible in Supabase dashboard
        response = supabase.table("feature_requests").insert({
            "user_id": user_id,
            "title": request_data.title,
            "description": request_data.description,
            "category": request_data.category,
            "importance": request_data.importance,
            "status": "submitted",
            "priority": priority,
            "created_at": datetime.utcnow().isoformat(),
        }).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to create feature request"
            )
        
        data = response.data[0]
        print(f"[FeatureRequest] New request from user {user_id}: title={request_data.title}, category={request_data.category}")
        
        return FeatureRequestResponse(
            id=data["id"],
            title=data["title"],
            description=data["description"],
            category=data["category"],
            importance=data["importance"],
            status=data["status"],
            created_at=data["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating feature request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create feature request"
        )


@router.get("/feature-request/requests")
async def get_user_feature_requests(request: Request):
    """Get all feature requests for the current user"""
    
    # Get user from token
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        response = supabase.table("feature_requests").select(
            "id, title, category, importance, status, priority, created_at, response_from_admin, resolved_at"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        
        return response.data if response.data else []
    
    except Exception as e:
        print(f"Error fetching feature requests: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch feature requests"
        )


@router.get("/feature-request/requests/{request_id}")
async def get_feature_request_detail(request_id: str, request: Request):
    """Get details of a specific feature request"""
    
    # Get user from token
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        user_id = get_user_id(auth)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    try:
        response = supabase.table("feature_requests").select(
            "*"
        ).eq("id", request_id).eq("user_id", user_id).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Feature request not found"
            )
        
        return response.data[0]
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching feature request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch feature request"
        )
