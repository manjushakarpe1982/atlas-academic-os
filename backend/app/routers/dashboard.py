"""
dashboard.py — Aggregated dashboard data

GET /api/dashboard
  Returns: classes, upcoming events, study plan, weekly progress, AI recommendation
  Pulls from: classes, assessments, grade_weights, calendar_events, grades tables
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Request
import anthropic
from app.config import settings
from app.utils.supabase_client import supabase
from app.utils.auth_helpers import get_user_id

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def _get_user(request: Request) -> str:
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        return get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")


@router.get("")
async def get_dashboard(request: Request):
    user_id = _get_user(request)
    now     = datetime.utcnow()

    # 1. Classes
    classes_res = supabase.table("classes").select("*").eq("user_id", user_id).order("created_at").execute()
    classes = classes_res.data or []

    # 2. Upcoming calendar events (next 14 days)
    in_14 = (now + timedelta(days=14)).isoformat()
    events_res = supabase.table("calendar_events") \
        .select("*").eq("user_id", user_id) \
        .gte("start_date", now.isoformat()) \
        .lte("start_date", in_14) \
        .order("start_date").limit(10).execute()
    events = events_res.data or []

    # 3. Assessments due soon (next 14 days)
    assess_res = supabase.table("assessments") \
        .select("*, classes(name)") \
        .eq("user_id", user_id) \
        .gte("due_date", now.date().isoformat()) \
        .lte("due_date", (now + timedelta(days=14)).date().isoformat()) \
        .order("due_date").limit(10).execute()
    assessments = assess_res.data or []

    # 4. Grades entered this week (for weekly progress)
    week_start  = (now - timedelta(days=now.weekday())).isoformat()
    grades_res  = supabase.table("grades").select("*").eq("user_id", user_id) \
        .gte("recorded_at", week_start).execute()
    grades_this_week = grades_res.data or []

    # 5. Build upcoming deadlines (combine assessments + events)
    deadlines = []
    for a in assessments[:5]:
        class_name = ""
        if isinstance(a.get("classes"), dict):
            class_name = a["classes"].get("name", "")
        deadlines.append({
            "title":      a.get("title", ""),
            "due_date":   a.get("due_date"),
            "category":   a.get("category", "assignment"),
            "confidence": a.get("confidence", "medium"),
            "class_name": class_name,
        })

    # 6. Build study plan from classes (each class = one session)
    study_plan = [
        {"class_name": c.get("name",""), "mins": 45, "done": False}
        for c in classes[:4]
    ]

    # 7. Weekly progress
    total_sessions_goal = 5
    sessions_done = len(set(g.get("class_id") for g in grades_this_week))

    # 8. Build class summaries with grade data
    class_summaries = []
    for c in classes:
        # Get grade weights for this class
        gw_res = supabase.table("grade_weights").select("*").eq("class_id", c["id"]).execute()
        weights = gw_res.data or []
        # Get grades for this class
        gr_res  = supabase.table("grades").select("*").eq("class_id", c["id"]).execute()
        gr      = gr_res.data or []
        # Simple average grade
        avg_grade = None
        if gr:
            avg_grade = round(sum(g["score"] / g["max_score"] * 100 for g in gr) / len(gr))

        class_summaries.append({
            "id":        c["id"],
            "name":      c.get("name", ""),
            "term":      c.get("term", ""),
            "grade":     avg_grade,
            "weights":   weights[:4],
            "instructor":c.get("instructor"),
        })

    # 9. AI recommendation using Claude Haiku
    ai_recommendation = None
    if classes and settings.anthropic_api_key:
        try:
            class_names = ", ".join(c.get("name","") for c in classes[:3])
            urgent = deadlines[0]["title"] if deadlines else "upcoming assignments"
            client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=150,
                messages=[{
                    "role": "user",
                    "content": (
                        f"Student has these classes: {class_names}. "
                        f"Most urgent item: {urgent}. "
                        "Give a short 2-sentence study recommendation for today. "
                        "Be specific and motivating. Plain text only, no markdown."
                    )
                }]
            )
            ai_recommendation = response.content[0].text.strip()
        except Exception:
            ai_recommendation = None

    return {
        "classes":        class_summaries,
        "deadlines":      deadlines,
        "study_plan":     study_plan,
        "calendar_events": events[:5],
        "weekly_progress": {
            "sessions_done": sessions_done,
            "sessions_goal": total_sessions_goal,
            "pct": round(sessions_done / total_sessions_goal * 100),
        },
        "ai_recommendation": ai_recommendation,
        "stats": {
            "deadlines_this_week":   len(deadlines),
            "high_priority_count":   len([d for d in deadlines if d.get("confidence") == "high"]),
        }
    }
