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
