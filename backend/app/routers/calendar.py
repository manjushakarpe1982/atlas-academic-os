"""
calendar.py — Simple calendar sync

POST /api/calendar/sync    — fetch ICS URL → parse → save to DB
GET  /api/calendar/events  — return saved events for current user
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import httpx

from app.utils.supabase_client import supabase
from app.utils.auth_helpers import get_user_id

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


# ── Models ────────────────────────────────────────────────────────────────

class SyncRequest(BaseModel):
    ics_url: str
    school:  Optional[str] = None


# ── Helpers ───────────────────────────────────────────────────────────────

def _get_user(request: Request) -> str:
    auth = request.headers.get("Authorization") or request.headers.get("authorization") or ""
    if not auth:
        raise HTTPException(401, "Authorization header missing")
    try:
        return get_user_id(auth)
    except Exception:
        raise HTTPException(401, "Invalid or expired token")


def _parse_ics(text: str) -> list[dict]:
    """
    Simple ICS parser — no external libraries needed.
    Returns list of events with title, start, end, category.
    """
    events   = []
    current  = {}
    in_event = False

    for raw_line in text.splitlines():
        line = raw_line.strip()

        if line == "BEGIN:VEVENT":
            in_event = True
            current  = {}
            continue

        if line == "END:VEVENT":
            in_event = False
            if current.get("title"):
                events.append(current)
            current = {}
            continue

        if not in_event:
            continue

        # Parse key:value
        if ":" not in line:
            continue
        key, _, value = line.partition(":")

        if key in ("DTSTART", "DTSTART;VALUE=DATE", "DTSTART;TZID=UTC"):
            current["start_date"] = _parse_date(value)
        elif key in ("DTEND", "DTEND;VALUE=DATE"):
            current["end_date"] = _parse_date(value)
        elif key == "SUMMARY":
            current["title"] = value.strip()
        elif key == "DESCRIPTION":
            current["description"] = value.strip()
        elif key == "CATEGORIES":
            current["category"] = value.strip().lower()
        elif key == "LOCATION":
            current["location"] = value.strip()
        elif key == "UID":
            current["external_uid"] = value.strip()

    return events


def _parse_date(value: str) -> Optional[str]:
    """Parse ICS date string to ISO format."""
    value = value.strip()
    try:
        if "T" in value:
            dt = datetime.strptime(value[:15], "%Y%m%dT%H%M%S")
        else:
            dt = datetime.strptime(value[:8], "%Y%m%d")
        return dt.isoformat()
    except Exception:
        return None


# ── POST /api/calendar/sync ───────────────────────────────────────────────

@router.post("/sync")
async def sync_calendar(req: SyncRequest, request: Request):
    user_id = _get_user(request)

    if not req.ics_url.startswith("http"):
        raise HTTPException(400, "Invalid URL. Must start with http or https.")

    # 1. Fetch the ICS file
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(req.ics_url, follow_redirects=True)
        if response.status_code != 200:
            raise HTTPException(400, f"Could not fetch calendar URL. Status: {response.status_code}")
        ics_text = response.text
    except httpx.TimeoutException:
        raise HTTPException(408, "Calendar URL took too long to respond.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Could not fetch calendar: {str(e)}")

    # 2. Parse ICS
    events = _parse_ics(ics_text)
    if not events:
        raise HTTPException(400, "No events found in this calendar feed. Check the URL.")

    # 3. Save calendar feed record
    try:
        # Upsert — one feed per user
        existing = supabase.table("calendar_feeds") \
            .select("id").eq("user_id", user_id).execute()

        if existing.data:
            feed_id = existing.data[0]["id"]
            supabase.table("calendar_feeds").update({
                "ics_url":       req.ics_url,
                "school":        req.school,
                "last_synced_at": datetime.utcnow().isoformat(),
                "last_status":   "synced",
            }).eq("id", feed_id).execute()
        else:
            feed_result = supabase.table("calendar_feeds").insert({
                "user_id":       user_id,
                "ics_url":       req.ics_url,
                "school":        req.school,
                "last_synced_at": datetime.utcnow().isoformat(),
                "last_status":   "synced",
            }).execute()
            feed_id = feed_result.data[0]["id"]
    except Exception as e:
        raise HTTPException(500, f"Database error saving feed: {e}")

    # 4. Delete old events for this user, insert fresh
    try:
        supabase.table("calendar_events").delete().eq("user_id", user_id).execute()
        for ev in events:
            if ev.get("title") and ev.get("start_date"):
                supabase.table("calendar_events").insert({
                    "user_id":      user_id,
                    "feed_id":      feed_id,
                    "title":        ev["title"],
                    "start_date":   ev["start_date"],
                    "end_date":     ev.get("end_date"),
                    "description":  ev.get("description"),
                    "category":     ev.get("category", "other"),
                    "location":     ev.get("location"),
                    "external_uid": ev.get("external_uid"),
                }).execute()
    except Exception as e:
        raise HTTPException(500, f"Database error saving events: {e}")

    return {
        "message":      f"Calendar synced successfully. {len(events)} events imported.",
        "events_count": len(events),
        "synced_at":    datetime.utcnow().isoformat(),
    }


# ── GET /api/calendar/events ──────────────────────────────────────────────

@router.get("/events")
async def get_events(request: Request):
    user_id = _get_user(request)

    try:
        result = supabase.table("calendar_events") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("start_date") \
            .execute()
    except Exception as e:
        raise HTTPException(500, f"Database error: {e}")

    return {"events": result.data or []}


# ── GET /api/calendar/all-events ───────────────────────────────────────────

@router.get("/all-events")
async def get_all_calendar_events(request: Request):
    """Fetch all events from calendar_events + assessments, combined and deduplicated."""
    user_id = _get_user(request)

    # Get classes for name lookup
    classes_res = supabase.table("classes").select("id, name").eq("user_id", user_id).execute()
    class_map = {c["id"]: c["name"] for c in (classes_res.data or [])}

    # Get grade weights for weight lookup
    weights_res = supabase.table("grade_weights").select("class_id, category, weight_pct").eq("user_id", user_id).execute()
    weight_map = {}
    for w in (weights_res.data or []):
        key = (w.get("class_id", ""), (w.get("category") or "").lower())
        weight_map[key] = w.get("weight_pct", 0)

    # Get grades for current grade lookup
    grades_res = supabase.table("grades").select("class_id, score, max_score").eq("user_id", user_id).execute()
    class_grades: dict = {}
    for g in (grades_res.data or []):
        cid = g.get("class_id")
        if cid not in class_grades:
            class_grades[cid] = []
        try:
            class_grades[cid].append(g["score"] / g["max_score"] * 100)
        except (ZeroDivisionError, TypeError, KeyError):
            pass
    class_avg = {cid: round(sum(s) / len(s)) for cid, s in class_grades.items() if s}

    events = []
    seen_titles = set()

    def detect_type(category: str, title: str) -> str:
        cat = (category or "").lower()
        ttl = (title or "").lower()
        if "exam" in cat or "midterm" in cat or "final" in cat or "exam" in ttl or "midterm" in ttl or "final" in ttl:
            return "exam"
        if "quiz" in cat or "quiz" in ttl:
            return "quiz"
        if "lab" in cat or "lab" in ttl:
            return "assignment"
        if "assignment" in cat or "homework" in cat or "hw" in cat:
            return "assignment"
        if "study" in cat or "study" in ttl:
            return "study"
        if "lecture" in cat or "class" in cat or "lecture" in ttl:
            return "class"
        return "assignment"

    # 1. Assessments (from syllabus)
    for cid in class_map:
        try:
            assess_res = supabase.table("assessments") \
                .select("id, title, category, due_date") \
                .eq("class_id", cid).eq("user_id", user_id) \
                .order("due_date").execute()
            for a in (assess_res.data or []):
                title = a.get("title", "")
                category = a.get("category", "")
                due_date = a.get("due_date", "")
                event_type = detect_type(category, title)
                weight = weight_map.get((cid, category.lower()), 0)

                seen_titles.add(title.lower().strip())
                events.append({
                    "id": a.get("id", ""),
                    "title": title,
                    "type": event_type,
                    "className": class_map.get(cid, ""),
                    "classId": cid,
                    "date": due_date,
                    "time": "",
                    "endTime": "",
                    "location": "",
                    "description": "",
                    "weight": weight,
                    "currentGrade": class_avg.get(cid),
                    "source": "syllabus",
                })
        except Exception:
            pass

    # 2. Calendar events (from ICS sync)
    try:
        cal_res = supabase.table("calendar_events") \
            .select("id, title, start_date, end_date, description, category, location") \
            .eq("user_id", user_id) \
            .order("start_date").execute()

        for ev in (cal_res.data or []):
            title = ev.get("title", "")
            if title.lower().strip() in seen_titles:
                continue

            start = ev.get("start_date") or ""
            end = ev.get("end_date") or ""
            date_part = start[:10] if start else ""
            time_part = ""
            end_time = ""

            if len(start) > 10:
                try:
                    from datetime import datetime
                    dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
                    time_part = dt.strftime("%I:%M %p").lstrip("0")
                except Exception:
                    pass
            if len(end) > 10:
                try:
                    from datetime import datetime
                    dt = datetime.fromisoformat(end.replace("Z", "+00:00"))
                    end_time = dt.strftime("%I:%M %p").lstrip("0")
                except Exception:
                    pass

            category = ev.get("category", "")
            event_type = detect_type(category, title)

            # Match to class
            matched_class = ""
            matched_cid = ""
            for cid, cname in class_map.items():
                cname_lower = cname.lower()
                title_lower = title.lower()
                if cname_lower in title_lower:
                    matched_class = cname; matched_cid = cid; break
                for word in cname_lower.split():
                    if len(word) >= 3 and word in title_lower:
                        matched_class = cname; matched_cid = cid; break
                if matched_cid: break

            weight = 0
            if matched_cid:
                weight = weight_map.get((matched_cid, category.lower()), 0)

            events.append({
                "id": ev.get("id", ""),
                "title": title,
                "type": event_type,
                "className": matched_class,
                "classId": matched_cid,
                "date": date_part,
                "time": time_part,
                "endTime": end_time,
                "location": ev.get("location", "") or "",
                "description": ev.get("description", "") or "",
                "weight": weight,
                "currentGrade": class_avg.get(matched_cid) if matched_cid else None,
                "source": "calendar",
            })
    except Exception:
        pass

    # Sort by date
    events.sort(key=lambda e: e.get("date") or "9999")

    return {"events": events, "total": len(events)}


# ── POST /api/calendar/add-event ───────────────────────────────────────────

@router.post("/add-event")
async def add_calendar_event(request: Request):
    """Add a new event to calendar_events table."""
    user_id = _get_user(request)
    body = await request.json()

    title = body.get("title", "").strip()
    event_type = body.get("type", "other")
    date = body.get("date", "")
    start_time = body.get("startTime", "")
    end_time = body.get("endTime", "")
    class_name = body.get("className", "")
    notes = body.get("notes", "")
    location = body.get("location", "")

    if not title or not date:
        raise HTTPException(400, "title and date required")

    # Build start_date with time if provided
    start_date = date
    if start_time:
        start_date = f"{date}T{start_time}"
    end_date = None
    if end_time:
        end_date = f"{date}T{end_time}"

    try:
        result = supabase.table("calendar_events").insert({
            "user_id":     user_id,
            "title":       title,
            "start_date":  start_date,
            "end_date":    end_date,
            "category":    event_type,
            "description": notes,
            "location":    location,
        }).execute()
        return {"success": True, "event": result.data[0] if result.data else None}
    except Exception as e:
        raise HTTPException(500, f"Failed to save event: {e}")


# ── POST /api/calendar/add-study-session ───────────────────────────────────

@router.post("/add-study-session")
async def add_study_session(request: Request):
    """Add a study session as a calendar event."""
    user_id = _get_user(request)
    body = await request.json()

    subject = body.get("subject", "").strip()
    topic = body.get("topic", "").strip()
    date = body.get("date", "")
    time = body.get("time", "")
    duration = body.get("duration", "45")
    notes = body.get("notes", "")

    if not subject or not date:
        raise HTTPException(400, "subject and date required")

    title = f"{subject} - {topic}" if topic else f"{subject} Study Session"

    start_date = date
    if time:
        start_date = f"{date}T{time}"

    # Calculate end time from duration
    end_date = None
    if time and duration:
        try:
            from datetime import datetime, timedelta
            dur_min = int(duration.replace(" minutes", "").replace("min", "").strip())
            start_dt = datetime.fromisoformat(start_date)
            end_dt = start_dt + timedelta(minutes=dur_min)
            end_date = end_dt.isoformat()
        except Exception:
            pass

    try:
        result = supabase.table("calendar_events").insert({
            "user_id":     user_id,
            "title":       title,
            "start_date":  start_date,
            "end_date":    end_date,
            "category":    "study",
            "description": notes,
            "location":    "",
        }).execute()
        return {"success": True, "event": result.data[0] if result.data else None}
    except Exception as e:
        raise HTTPException(500, f"Failed to save study session: {e}")


# ── DELETE /api/calendar/delete-event ──────────────────────────────────────

@router.post("/delete-event")
async def delete_calendar_event(request: Request):
    """Delete an event from calendar_events or assessments."""
    user_id = _get_user(request)
    body = await request.json()
    event_id = body.get("id", "")
    source = body.get("source", "calendar")

    if not event_id:
        raise HTTPException(400, "event id required")

    try:
        if source == "syllabus":
            supabase.table("assessments") \
                .delete().eq("id", event_id).eq("user_id", user_id).execute()
        else:
            supabase.table("calendar_events") \
                .delete().eq("id", event_id).eq("user_id", user_id).execute()
        return {"success": True, "deleted": event_id}
    except Exception as e:
        raise HTTPException(500, f"Failed to delete event: {e}")


# ── POST /api/calendar/update-event ────────────────────────────────────────

@router.post("/update-event")
async def update_calendar_event(request: Request):
    """Update an existing calendar event."""
    user_id = _get_user(request)
    body = await request.json()
    event_id = body.get("id", "")
    source = body.get("source", "calendar")

    if not event_id:
        raise HTTPException(400, "event id required")

    title = body.get("title", "").strip()
    event_type = body.get("type", "")
    date = body.get("date", "")
    start_time = body.get("startTime", "")
    end_time = body.get("endTime", "")
    notes = body.get("notes", "")

    try:
        if source == "syllabus":
            updates = {}
            if title: updates["title"] = title
            if event_type: updates["category"] = event_type
            if date: updates["due_date"] = date
            if updates:
                supabase.table("assessments") \
                    .update(updates).eq("id", event_id).eq("user_id", user_id).execute()
        else:
            updates = {}
            if title: updates["title"] = title
            if event_type: updates["category"] = event_type
            if notes is not None: updates["description"] = notes

            start_date = date
            if start_time: start_date = f"{date}T{start_time}"
            if date: updates["start_date"] = start_date

            end_date = None
            if end_time and date: end_date = f"{date}T{end_time}"
            if end_date: updates["end_date"] = end_date

            if updates:
                supabase.table("calendar_events") \
                    .update(updates).eq("id", event_id).eq("user_id", user_id).execute()

        return {"success": True}
    except Exception as e:
        raise HTTPException(500, f"Failed to update event: {e}")
