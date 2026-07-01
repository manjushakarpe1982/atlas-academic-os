"""
Notification API: preferences, log, and generation.
"""
from fastapi import APIRouter, HTTPException, Request
import jwt, datetime
from app.config import settings
from app.utils.supabase_client import supabase

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


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


DEFAULTS = {
    "quiz_reminder": True, "assignment_alert": True,
    "study_reminder": True, "weekly_summary": False,
    "new_grades": True, "tips_updates": False,
    "reminder_time": "7:00 PM",
}


# ── GET /api/notifications/preferences ────────────────────────────────────

@router.get("/preferences")
async def get_notification_preferences(request: Request):
    user_id = _get_user(request)
    try:
        result = supabase.table("notification_preferences") \
            .select("*").eq("user_id", user_id).execute()

        if result.data:
            return {"success": True, "preferences": result.data[0]}

        row = {**DEFAULTS, "user_id": user_id}
        supabase.table("notification_preferences").insert(row).execute()
        return {"success": True, "preferences": row}
    except Exception as e:
        print(f"[NOTIF PREFS GET] ERROR: {e}")
        return {"success": True, "preferences": {**DEFAULTS}}


# ── PUT /api/notifications/preferences/toggle ─────────────────────────────

@router.put("/preferences/toggle")
async def toggle_notification_preference(request: Request):
    user_id = _get_user(request)
    body = await request.json()
    key = body.get("key", "")
    value = body.get("value", False)

    allowed = ["quiz_reminder", "assignment_alert", "study_reminder",
               "weekly_summary", "new_grades", "tips_updates"]

    if key not in allowed:
        raise HTTPException(400, f"Invalid key: {key}")

    try:
        existing = supabase.table("notification_preferences") \
            .select("id").eq("user_id", user_id).execute()

        if existing.data:
            supabase.table("notification_preferences") \
                .update({key: value}).eq("user_id", user_id).execute()
        else:
            row = {**DEFAULTS, "user_id": user_id, key: value}
            supabase.table("notification_preferences").insert(row).execute()

        return {"success": True, "key": key, "value": value}
    except Exception as e:
        print(f"[NOTIF TOGGLE] ERROR: {e}")
        return {"success": False, "error": str(e)}


# ── PUT /api/notifications/preferences/time ───────────────────────────────

@router.put("/preferences/time")
async def update_reminder_time(request: Request):
    user_id = _get_user(request)
    body = await request.json()
    time_val = body.get("time", "7:00 PM")

    try:
        existing = supabase.table("notification_preferences") \
            .select("id").eq("user_id", user_id).execute()

        if existing.data:
            supabase.table("notification_preferences") \
                .update({"reminder_time": time_val}).eq("user_id", user_id).execute()
        else:
            row = {**DEFAULTS, "user_id": user_id, "reminder_time": time_val}
            supabase.table("notification_preferences").insert(row).execute()

        return {"success": True, "time": time_val}
    except Exception as e:
        print(f"[NOTIF TIME] ERROR: {e}")
        return {"success": False, "error": str(e)}


# ── PUT /api/notifications/preferences (full update) ─────────────────────

@router.put("/preferences")
async def update_notification_preferences(request: Request):
    user_id = _get_user(request)
    body = await request.json()

    allowed = ["quiz_reminder", "assignment_alert", "study_reminder",
               "weekly_summary", "new_grades", "tips_updates", "reminder_time"]
    updates = {k: v for k, v in body.items() if k in allowed}

    if not updates:
        raise HTTPException(400, "No valid fields")

    try:
        existing = supabase.table("notification_preferences") \
            .select("id").eq("user_id", user_id).execute()

        if existing.data:
            supabase.table("notification_preferences") \
                .update(updates).eq("user_id", user_id).execute()
        else:
            supabase.table("notification_preferences") \
                .insert({**DEFAULTS, "user_id": user_id, **updates}).execute()

        return {"success": True}
    except Exception as e:
        print(f"[NOTIF UPDATE] ERROR: {e}")
        return {"success": False, "error": str(e)}


# ── GET /api/notifications ────────────────────────────────────────────────

@router.get("")
async def get_notifications(request: Request):
    user_id = _get_user(request)
    try:
        result = supabase.table("notification_log") \
            .select("*").eq("user_id", user_id) \
            .order("created_at", desc=True).limit(50).execute()

        notifications = result.data or []
        unread = sum(1 for n in notifications if not n.get("read", False))
        return {"success": True, "notifications": notifications, "unread_count": unread}
    except Exception as e:
        print(f"[NOTIF GET] ERROR: {e}")
        return {"success": True, "notifications": [], "unread_count": 0}


# ── PUT /api/notifications/{id}/read ──────────────────────────────────────

@router.put("/{notification_id}/read")
async def mark_notification_read(notification_id: str, request: Request):
    user_id = _get_user(request)
    try:
        supabase.table("notification_log") \
            .update({"read": True}).eq("id", notification_id).eq("user_id", user_id).execute()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── PUT /api/notifications/read-all ───────────────────────────────────────

@router.put("/read-all")
async def mark_all_read(request: Request):
    user_id = _get_user(request)
    try:
        supabase.table("notification_log") \
            .update({"read": True}).eq("user_id", user_id).eq("read", False).execute()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── POST /api/notifications/generate ──────────────────────────────────────

@router.post("/generate")
async def generate_notifications(request: Request):
    user_id = _get_user(request)

    try:
        now = datetime.datetime.utcnow()
        today = now.strftime("%Y-%m-%d")
        tomorrow = (now + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        week_end = (now + datetime.timedelta(days=7)).strftime("%Y-%m-%d")

        # Query 1: preferences
        prefs_res = supabase.table("notification_preferences") \
            .select("*").eq("user_id", user_id).execute()
        prefs = prefs_res.data[0] if prefs_res.data else DEFAULTS

        # Query 2: classes
        classes_res = supabase.table("classes").select("id, name").eq("user_id", user_id).execute()
        classes = classes_res.data or []
        class_map = {c["id"]: c["name"] for c in classes}

        # Query 3: ALL assessments in ONE query
        all_assess_data = []
        if classes:
            all_assess = supabase.table("assessments") \
                .select("title, due_date, category, class_id") \
                .eq("user_id", user_id) \
                .gte("due_date", today).lte("due_date", week_end).execute()
            all_assess_data = all_assess.data or []

        # Query 4: calendar events
        cal_res = supabase.table("calendar_events") \
            .select("title, start_date, category") \
            .eq("user_id", user_id) \
            .gte("start_date", today).lte("start_date", week_end + "T23:59:59").execute()

        # Query 5: existing notifications today (bulk duplicate check)
        existing_res = supabase.table("notification_log") \
            .select("title").eq("user_id", user_id) \
            .gte("created_at", today + "T00:00:00").execute()
        existing_titles = set(e["title"] for e in (existing_res.data or []))

        notifications = []

        # From assessments
        for a in all_assess_data:
            cname = class_map.get(a.get("class_id", ""), "")
            cat = (a.get("category") or "").lower()
            due = a.get("due_date", "")
            title = a.get("title", "")
            is_quiz = "quiz" in cat or "exam" in cat or "test" in cat
            is_assign = "homework" in cat or "assignment" in cat or "lab" in cat

            if is_quiz and prefs.get("quiz_reminder", True):
                if due == today:
                    notifications.append({"user_id": user_id, "type": "quiz_reminder",
                        "title": f"Quiz Today: {title}", "body": f"{cname} — due today!"})
                elif due == tomorrow:
                    notifications.append({"user_id": user_id, "type": "quiz_reminder",
                        "title": f"Quiz Tomorrow: {title}", "body": f"{cname} — due tomorrow!"})

            if is_assign and prefs.get("assignment_alert", True) and due in (today, tomorrow):
                notifications.append({"user_id": user_id, "type": "assignment_alert",
                    "title": f"Assignment Due: {title}", "body": f"{cname} — due soon."})

        # Study reminder
        if prefs.get("study_reminder", True) and classes:
            notifications.append({"user_id": user_id, "type": "study_reminder",
                "title": "Time to Study!", "body": f"You have {len(classes)} class{'es' if len(classes) > 1 else ''}. Stay on track!"})

        # Calendar events
        for ev in (cal_res.data or []):
            ev_date_raw = ev.get("start_date", "")
            ev_date = ev_date_raw[:10] if ev_date_raw else ""
            ev_title = ev.get("title", "")
            ev_cat = (ev.get("category") or "").lower()
            n_type = "quiz_reminder" if ("quiz" in ev_cat or "exam" in ev_cat or "test" in ev_cat) else "assignment_alert"

            if ev_date == today:
                notifications.append({"user_id": user_id, "type": n_type,
                    "title": f"Today: {ev_title}", "body": f"{ev_title} is scheduled for today!"})
            elif ev_date == tomorrow:
                notifications.append({"user_id": user_id, "type": n_type,
                    "title": f"Tomorrow: {ev_title}", "body": f"{ev_title} is scheduled for tomorrow."})

            if ev_date_raw and "T" in ev_date_raw:
                try:
                    ev_time = datetime.datetime.fromisoformat(ev_date_raw.replace("Z", "").replace("+00:00", ""))
                    diff_mins = (ev_time - now).total_seconds() / 60
                    if 0 < diff_mins <= 60:
                        time_str = ev_time.strftime("%I:%M %p").lstrip("0")
                        notifications.append({"user_id": user_id, "type": n_type,
                            "title": f"Starting soon: {ev_title}", "body": f"{ev_title} starts at {time_str} — less than 1 hour!"})
                    elif 60 < diff_mins <= 120:
                        time_str = ev_time.strftime("%I:%M %p").lstrip("0")
                        notifications.append({"user_id": user_id, "type": n_type,
                            "title": f"Reminder: {ev_title}", "body": f"{ev_title} starts at {time_str} — about 1 hour away."})
                except Exception:
                    pass

        # Batch insert — skip duplicates
        new_notifs = [n for n in notifications if n["title"] not in existing_titles]
        if new_notifs:
            supabase.table("notification_log").insert(new_notifs).execute()

        return {"success": True, "generated": len(notifications), "saved": len(new_notifs)}
    except Exception as e:
        print(f"[NOTIF GENERATE] ERROR: {e}")
        return {"success": True, "generated": 0, "saved": 0}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str, request: Request):
    user_id = _get_user(request)
    try:
        supabase.table("notification_log") \
            .delete().eq("id", notification_id).eq("user_id", user_id).execute()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── DELETE /api/notifications/clear-all ───────────────────────────────────

@router.delete("/clear-all")
async def clear_all_notifications(request: Request):
    user_id = _get_user(request)
    try:
        supabase.table("notification_log").delete().eq("user_id", user_id).execute()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}
