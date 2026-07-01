"""
Profile-related API endpoints: feedback, export data, account management.
"""
from fastapi import APIRouter, HTTPException, Request
import jwt, datetime
from app.config import settings
from app.utils.supabase_client import supabase

router = APIRouter(prefix="/api/profile", tags=["profile"])


def _get_user(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        token = auth.replace("Bearer ", "")
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload["sub"]
    except Exception:
        raise HTTPException(401, "Invalid or expired token")


# ── POST /api/profile/recommendation-feedback ─────────────────────────────

@router.post("/recommendation-feedback")
async def save_recommendation_feedback(request: Request):
    """Save helpful/not-helpful feedback for study recommendations."""
    user_id = _get_user(request)
    body = await request.json()

    feedback_type = body.get("feedback_type", "")
    reason = body.get("reason", None)
    focus_task_title = body.get("focus_task_title", "")
    focus_task_category = body.get("focus_task_category", "")

    if not feedback_type:
        raise HTTPException(400, "feedback_type required")

    try:
        supabase.table("recommendation_feedback").insert({
            "user_id": user_id,
            "feedback_type": feedback_type,
            "reason": reason,
            "focus_task_title": focus_task_title,
            "focus_task_category": focus_task_category,
        }).execute()

        return {"success": True}
    except Exception as e:
        print(f"[FEEDBACK] ERROR: {e}")
        return {"success": False, "error": str(e)}


# ── POST /api/profile/export-data ─────────────────────────────────────────

@router.post("/export-data")
async def export_user_data(request: Request):
    """Export user data for selected class or all classes."""
    user_id = _get_user(request)
    body = await request.json()
    class_id = body.get("class_id", "all")
    items = body.get("items", [])

    try:
        export = {}

        # Get classes
        if class_id == "all":
            classes_res = supabase.table("classes").select("*").eq("user_id", user_id).execute()
        else:
            classes_res = supabase.table("classes").select("*").eq("id", class_id).eq("user_id", user_id).execute()

        class_list = classes_res.data or []
        class_ids = [c["id"] for c in class_list]

        if "course-info" in items:
            export["classes"] = [{
                "name": c.get("name", ""),
                "code": c.get("code", ""),
                "instructor": c.get("instructor", ""),
                "term": c.get("term", ""),
                "credit_hours": c.get("credit_hours"),
                "school_name": c.get("school_name", ""),
                "created_at": c.get("created_at", ""),
            } for c in class_list]

        if "grades" in items and class_ids:
            all_grades = []
            for cid in class_ids:
                grades_res = supabase.table("grades").select("*").eq("class_id", cid).eq("user_id", user_id).execute()
                for g in (grades_res.data or []):
                    class_name = next((c["name"] for c in class_list if c["id"] == cid), "")
                    all_grades.append({
                        "class": class_name,
                        "name": g.get("name", ""),
                        "score": g.get("score"),
                        "total": g.get("total"),
                        "date": g.get("date", ""),
                        "category": g.get("category", ""),
                    })
            export["grades"] = all_grades

        if "assignments" in items and class_ids:
            all_assessments = []
            for cid in class_ids:
                assess_res = supabase.table("assessments").select("*").eq("class_id", cid).eq("user_id", user_id).execute()
                for a in (assess_res.data or []):
                    class_name = next((c["name"] for c in class_list if c["id"] == cid), "")
                    all_assessments.append({
                        "class": class_name,
                        "title": a.get("title", ""),
                        "category": a.get("category", ""),
                        "due_date": a.get("due_date", ""),
                        "date_note": a.get("date_note", ""),
                        "weight": a.get("weight"),
                    })
            export["assignments"] = all_assessments

        if "dates" in items:
            all_events = []
            events_res = supabase.table("calendar_events").select("*").eq("user_id", user_id).execute()
            for e in (events_res.data or []):
                all_events.append({
                    "title": e.get("title", ""),
                    "date": e.get("start_date", ""),
                    "end_date": e.get("end_date", ""),
                    "category": e.get("category", ""),
                    "description": e.get("description", ""),
                    "location": e.get("location", ""),
                })
            export["calendar_events"] = all_events

        if "study-plan" in items and class_ids:
            all_topics = []
            for cid in class_ids:
                topics_res = supabase.table("topics").select("*").eq("class_id", cid).eq("user_id", user_id).execute()
                for t in (topics_res.data or []):
                    class_name = next((c["name"] for c in class_list if c["id"] == cid), "")
                    all_topics.append({
                        "class": class_name,
                        "title": t.get("title", ""),
                        "week": t.get("week"),
                        "priority": t.get("priority", ""),
                    })
            export["study_topics"] = all_topics

        if "notes" in items and class_ids:
            all_attempts = []
            for cid in class_ids:
                attempts_res = supabase.table("study_attempts").select("*").eq("class_id", cid).execute()
                for a in (attempts_res.data or []):
                    all_attempts.append({
                        "material_type": a.get("material_type", ""),
                        "attempt_number": a.get("attempt_number"),
                        "score": a.get("score"),
                        "total": a.get("total"),
                        "status": a.get("status", ""),
                        "completed_at": a.get("completed_at", ""),
                    })
            export["study_attempts"] = all_attempts

        export["exported_at"] = datetime.datetime.utcnow().isoformat() + "Z"
        export["user_id"] = user_id

        return {"success": True, "data": export}
    except Exception as e:
        print(f"[EXPORT] ERROR: {e}")
        return {"success": False, "error": str(e)}
