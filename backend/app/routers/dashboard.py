"""
dashboard.py — Dashboard API with FocusTask Engine

GET /api/dashboard

focusTask is built by combining 3 data sources:
  1. calendar_events (ICS sync)  → WHEN is it due (start_date)
  2. grade_weights (syllabus AI) → HOW MUCH is it worth (weight_pct)
  3. grades (student-entered)    → WHERE is the student now (current_grade)

The engine matches each calendar event to a class, then looks up
the grade weight and current grade for that class to score priority.
"""
from datetime import datetime, timedelta
from typing import Optional
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


# ====================================================================
# FOCUS TASK ENGINE
# ====================================================================

# ── Category detection from calendar event title ──

CATEGORY_PATTERNS = {
    "final":      ["final exam", "final"],
    "midterm":    ["midterm", "mid-term", "mid term"],
    "exam":       ["exam", "test"],
    "quiz":       ["quiz"],
    "lab":        ["lab report", "lab"],
    "homework":   ["homework", "hw", "assignment", "problem set", "pset"],
    "project":    ["project", "presentation"],
    "essay":      ["essay", "paper", "report", "writing"],
}


def _detect_category(title: str) -> str:
    """Detect assessment type from calendar event title."""
    t = title.lower()
    for category, keywords in CATEGORY_PATTERNS.items():
        for kw in keywords:
            if kw in t:
                return category
    return "assignment"


def _match_class(event_title: str, classes: list) -> Optional[dict]:
    """
    Match a calendar event to a class by checking if the class name
    appears in the event title.
    
    Examples:
      event: "Biology 1107 - Quiz 3"   → matches class "Biology 1107"
      event: "BIOL 1107 Midterm"       → matches class "Biology 1107" (partial)
      event: "Calc HW 5"               → matches class "Calculus 251" (partial)
    """
    t = event_title.lower().strip()

    # Pass 1: Full class name in event title
    for c in classes:
        name = (c.get("name") or "").lower().strip()
        if name and name in t:
            return c

    # Pass 2: First word of class name (e.g. "Biology" matches "Biology Quiz")
    for c in classes:
        name = (c.get("name") or "").lower().strip()
        if name:
            first_word = name.split()[0]
            if len(first_word) >= 3 and first_word in t:
                return c

    return None


def _find_weight(class_id: str, category: str, all_weights: list) -> Optional[float]:
    """
    Find the grade weight for a class + category.
    
    grade_weights has: class_id, category ("quiz", "exam", "homework"), weight_pct (20)
    We match by class_id + category.
    """
    cat = category.lower()

    # Direct match
    for w in all_weights:
        if w.get("class_id") == class_id:
            w_cat = (w.get("category") or "").lower()
            if w_cat == cat:
                return w.get("weight_pct")

    # Fuzzy match: "quiz" matches "quizzes", "exam" matches "exams"
    for w in all_weights:
        if w.get("class_id") == class_id:
            w_cat = (w.get("category") or "").lower()
            if cat in w_cat or w_cat in cat:
                return w.get("weight_pct")

    # Match broader categories: midterm/final → exam weight
    if cat in ("midterm", "final"):
        for w in all_weights:
            if w.get("class_id") == class_id:
                w_cat = (w.get("category") or "").lower()
                if "exam" in w_cat or "midterm" in w_cat or "final" in w_cat:
                    return w.get("weight_pct")

    return None


def _class_avg_grade(class_id: str, all_grades: list) -> Optional[float]:
    """Calculate average grade for a class from the grades table."""
    cg = [g for g in all_grades if g.get("class_id") == class_id]
    if not cg:
        return None
    try:
        avg = sum(g["score"] / g["max_score"] * 100 for g in cg) / len(cg)
        return round(avg, 1)
    except (ZeroDivisionError, TypeError, KeyError):
        return None


# ── Scoring functions ──

def _urgency_score(days_left: Optional[int]) -> float:
    if days_left is None:
        return 20.0
    if days_left <= 0:  return 100.0
    if days_left == 1:  return 95.0
    if days_left == 2:  return 85.0
    if days_left == 3:  return 70.0
    if days_left <= 5:  return 50.0
    if days_left <= 7:  return 30.0
    if days_left <= 14: return 15.0
    return 5.0


def _impact_score(weight_pct: Optional[float]) -> float:
    if weight_pct is None: return 50.0
    if weight_pct >= 30:   return 100.0
    if weight_pct >= 20:   return 80.0
    if weight_pct >= 15:   return 60.0
    if weight_pct >= 10:   return 40.0
    if weight_pct >= 5:    return 20.0
    return 10.0


def _grade_need_score(current_grade: Optional[float]) -> float:
    if current_grade is None: return 50.0
    if current_grade < 60:    return 100.0
    if current_grade < 70:    return 85.0
    if current_grade < 80:    return 60.0
    if current_grade < 90:    return 35.0
    return 15.0


def _category_bonus(category: str) -> float:
    if category in ("final", "midterm"):  return 15.0
    if category in ("exam", "test"):      return 10.0
    if category == "quiz":                return 5.0
    return 0.0


def _priority_score(days_left, weight_pct, current_grade, category) -> float:
    """SCORE = (urgency × 40%) + (impact × 35%) + (need × 25%) + bonus"""
    return (
        _urgency_score(days_left) * 0.40 +
        _impact_score(weight_pct) * 0.35 +
        _grade_need_score(current_grade) * 0.25 +
        _category_bonus(category)
    )


def _priority_label(score: float) -> str:
    if score >= 70:  return "High"
    if score >= 45:  return "Medium"
    return "Low"


def _confidence_level(has_weight: bool, has_grade: bool, has_class_match: bool) -> str:
    if has_class_match and has_weight and has_grade:
        return "HIGH"
    if has_class_match and (has_weight or has_grade):
        return "MEDIUM"
    return "LOW"


def _build_reason(days_left, weight_pct, current_grade, category) -> str:
    parts = []
    if weight_pct and weight_pct >= 10:
        parts.append(f"Worth {weight_pct}% of your grade")
    elif category in ("exam", "final", "midterm", "quiz"):
        parts.append("High-stakes assessment")
    if days_left is not None:
        if days_left <= 0:     parts.append("Due today")
        elif days_left == 1:   parts.append("Due tomorrow")
        elif days_left <= 3:   parts.append(f"Due in {days_left} days")
    if current_grade is not None and current_grade < 75:
        parts.append(f"Current grade {round(current_grade)}% needs improvement")
    return " + ".join(parts) if parts else "Upcoming deadline"


def _study_mins(weight_pct, current_grade, days_left, category) -> int:
    mins = 30
    if weight_pct and weight_pct >= 20:           mins += 15
    if current_grade is not None and current_grade < 70: mins += 15
    if days_left is not None and days_left <= 1:  mins += 15
    if category in ("exam", "final", "midterm"):  mins += 15
    return max(20, min(mins, 90))


def _due_display(days_left: Optional[int], due_date_str: Optional[str]) -> str:
    if days_left is None:
        return due_date_str or "Upcoming"
    if days_left <= 0: return "Today"
    if days_left == 1: return "Tomorrow"
    if due_date_str:
        try:
            dt = datetime.strptime(due_date_str, "%Y-%m-%d")
            return dt.strftime("%a, %b %d")
        except Exception:
            pass
    return f"In {days_left} days"


def build_focus_task(
    calendar_events: list,
    all_weights: list,
    all_grades: list,
    classes: list,
    now: datetime,
) -> Optional[dict]:
    """
    FocusTask Engine — combines 3 data sources:
      1. calendar_events → WHEN (due date from ICS sync)
      2. grade_weights   → HOW MUCH (weight from syllabus AI)
      3. grades          → WHERE NOW (current grade from student entry)

    For each calendar event:
      - Match to a class by title
      - Detect category (quiz/exam/homework) from title
      - Look up grade_weight for that class + category
      - Look up current_grade for that class
      - Score using urgency + impact + need
    Pick the highest scored candidate.
    """

    # Pre-build class grade map
    class_grade_map: dict[str, float] = {}
    for c in classes:
        avg = _class_avg_grade(c["id"], all_grades)
        if avg is not None:
            class_grade_map[c["id"]] = avg

    class_map = {c["id"]: c.get("name", "") for c in classes}

    candidates = []

    # ── Score each calendar event ──
    for ev in calendar_events:
        ev_title = ev.get("title", "")
        start_date = ev.get("start_date", "")

        # Parse due date
        due_date_str = None
        days_left = None
        if start_date:
            try:
                if "T" in start_date:
                    due_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00")).date()
                else:
                    due_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
                days_left = (due_dt - now.date()).days
                due_date_str = due_dt.isoformat()
            except Exception:
                continue

        # Skip past events
        if days_left is not None and days_left < 0:
            continue

        # Detect category from title
        category = _detect_category(ev_title)

        # Match to a class
        matched_class = _match_class(ev_title, classes)
        matched_class_id = matched_class["id"] if matched_class else ""
        matched_class_name = matched_class.get("name", "") if matched_class else ""

        # Look up grade weight (source 2)
        weight_pct = None
        if matched_class_id:
            weight_pct = _find_weight(matched_class_id, category, all_weights)

        # Look up current grade (source 3)
        current_grade = class_grade_map.get(matched_class_id) if matched_class_id else None

        # Calculate priority score
        score = _priority_score(days_left, weight_pct, current_grade, category)

        candidates.append({
            "title":          ev_title,
            "class_name":     matched_class_name,
            "class_id":       matched_class_id,
            "due_date":       due_date_str,
            "days_left":      days_left,
            "category":       category,
            "weight_pct":     float(weight_pct) if weight_pct else None,
            "current_grade":  round(current_grade) if current_grade else None,
            "priority_score": round(score, 1),
            "confidence":     _confidence_level(
                has_class_match=matched_class is not None,
                has_weight=weight_pct is not None,
                has_grade=current_grade is not None,
            ),
        })

    # ── Pick the winner ──
    if candidates:
        candidates.sort(key=lambda x: x["priority_score"], reverse=True)
        w = candidates[0]

        return {
            "title":                  w["title"],
            "class_name":             w["class_name"],
            "class_id":               w["class_id"],
            "due_date":               w["due_date"],
            "days_left":              w["days_left"],
            "due_display":            _due_display(w["days_left"], w["due_date"]),
            "category":               w["category"],
            "weight_pct":             w["weight_pct"],
            "current_grade":          w["current_grade"],
            "priority":               _priority_label(w["priority_score"]),
            "priority_score":         w["priority_score"],
            "confidence":             w["confidence"],
            "reason":                 _build_reason(w["days_left"], w["weight_pct"], w["current_grade"], w["category"]),
            "recommended_study_mins": _study_mins(w["weight_pct"], w["current_grade"], w["days_left"], w["category"]),
        }

    # ── Fallback: No calendar events — use lowest-grade class ──
    if class_grade_map:
        worst_id = min(class_grade_map, key=class_grade_map.get)
        worst_grade = class_grade_map[worst_id]
        return {
            "title":                  f"Review {class_map.get(worst_id, 'class')}",
            "class_name":             class_map.get(worst_id, ""),
            "class_id":               worst_id,
            "due_date":               None,
            "days_left":              None,
            "due_display":            "This week",
            "category":               "review",
            "weight_pct":             None,
            "current_grade":          round(worst_grade),
            "priority":               "Medium",
            "priority_score":         40.0,
            "confidence":             "LOW",
            "reason":                 f"Current grade {round(worst_grade)}% needs improvement",
            "recommended_study_mins": 30,
        }

    # Fallback: Has classes but nothing else
    if classes:
        first = classes[0]
        return {
            "title":                  f"Start studying {first.get('name', '')}",
            "class_name":             first.get("name", ""),
            "class_id":               first["id"],
            "due_date":               None,
            "days_left":              None,
            "due_display":            "Get started",
            "category":               "review",
            "weight_pct":             None,
            "current_grade":          None,
            "priority":               "Low",
            "priority_score":         20.0,
            "confidence":             "LOW",
            "reason":                 "Begin reviewing for this class",
            "recommended_study_mins": 30,
        }

    return None


# ====================================================================
# DASHBOARD ENDPOINT
# ====================================================================

@router.get("")
async def get_dashboard(request: Request):
    user_id = _get_user(request)
    now = datetime.utcnow()

    # ── Fetch user profile ──
    user_res = supabase.table("users").select("full_name, email, school").eq("id", user_id).execute()
    user = user_res.data[0] if user_res.data else {}

    # ── Fetch classes ──
    classes_res = supabase.table("classes").select("*").eq("user_id", user_id).order("created_at").execute()
    classes = classes_res.data or []

    # ── Fetch calendar events (ALL future) — SOURCE 1: due dates ──
    cal_res = supabase.table("calendar_events") \
        .select("*").eq("user_id", user_id) \
        .gte("start_date", now.isoformat()) \
        .order("start_date").limit(30).execute()
    calendar_events = cal_res.data or []

    # ── Fetch grade weights — SOURCE 2: how much it's worth ──
    weights_res = supabase.table("grade_weights").select("*").eq("user_id", user_id).execute()
    all_weights = weights_res.data or []

    # ── Fetch grades — SOURCE 3: current performance ──
    grades_res = supabase.table("grades").select("*").eq("user_id", user_id).execute()
    all_grades = grades_res.data or []

    # ── Fetch assessments (for upcomingDeadlines + stats only, NOT for focusTask) ──
    today_str = now.date().isoformat()
    in_14_str = (now + timedelta(days=14)).date().isoformat()
    assess_res = supabase.table("assessments") \
        .select("*, classes(name)").eq("user_id", user_id) \
        .gte("due_date", today_str).lte("due_date", in_14_str) \
        .order("due_date").limit(20).execute()
    assessments = assess_res.data or []

    # ── Stats: deadlines this week ──
    week_start = (now - timedelta(days=now.weekday())).date().isoformat()
    week_end = (now - timedelta(days=now.weekday()) + timedelta(days=6)).date().isoformat()
    week_assess_res = supabase.table("assessments") \
        .select("id").eq("user_id", user_id) \
        .gte("due_date", week_start).lte("due_date", week_end).execute()
    deadlines_this_week = len(week_assess_res.data or [])

    # Also count calendar events this week
    week_cal_res = supabase.table("calendar_events") \
        .select("id").eq("user_id", user_id) \
        .gte("start_date", week_start).lte("start_date", week_end).execute()
    deadlines_this_week += len(week_cal_res.data or [])

    # ── Grades this week (for weekly progress) ──
    week_start_dt = (now - timedelta(days=now.weekday())).isoformat()
    grades_week_res = supabase.table("grades").select("class_id").eq("user_id", user_id) \
        .gte("recorded_at", week_start_dt).execute()
    grades_this_week = grades_week_res.data or []

    # ================================================================
    # BUILD RESPONSE
    # ================================================================

    # ── summary ──
    hour = now.hour
    if hour < 12:      greeting = "Good Morning"
    elif hour < 17:    greeting = "Good Afternoon"
    else:              greeting = "Good Evening"

    # High priority = calendar events due within next 7 days
    high_priority_count = 0
    in_7_days = (now + timedelta(days=7)).isoformat()
    for ev in calendar_events:
        start = ev.get("start_date", "")
        if start and start <= in_7_days:
            high_priority_count += 1

    summary = {
        "greeting":             greeting,
        "name":                 user.get("full_name", "Student"),
        "deadlines_this_week":  deadlines_this_week,
        "high_priority_tasks":  high_priority_count,
    }

    # ── focusTask — THE ENGINE (calendar + weights + grades) ──
    focus_task = build_focus_task(
        calendar_events=calendar_events,
        all_weights=all_weights,
        all_grades=all_grades,
        classes=classes,
        now=now,
    )

    # ── todayPlan ──
    today_plan = []
    for c in classes[:4]:
        done = any(g.get("class_id") == c["id"] for g in grades_this_week)
        today_plan.append({
            "class_id":   c["id"],
            "class_name": c.get("name", ""),
            "mins":       45,
            "done":       done,
        })

    # ── upcomingDeadlines (from assessments for structured data) ──
    upcoming_deadlines = []

    # Add from assessments
    for a in assessments[:5]:
        class_name = ""
        if isinstance(a.get("classes"), dict):
            class_name = a["classes"].get("name", "")
        due_display = a.get("due_date", "")
        day_name = ""
        if a.get("due_date"):
            try:
                due_dt = datetime.strptime(a["due_date"], "%Y-%m-%d")
                days_diff = (due_dt.date() - now.date()).days
                if days_diff == 0:     due_display = "Today"
                elif days_diff == 1:   due_display = "Tomorrow"
                else:                  due_display = due_dt.strftime("%a, %b %d")
                day_name = due_dt.strftime("%A")
            except Exception:
                pass

        cat = (a.get("category") or "").lower()
        ttl = (a.get("title") or "").lower()
        priority = "High" if any(kw in cat or kw in ttl for kw in ["exam","quiz","final","midterm","test"]) else "Medium"

        upcoming_deadlines.append({
            "id":          a.get("id", ""),
            "title":       a.get("title", ""),
            "class_name":  class_name,
            "due_date":    a.get("due_date"),
            "due_display": due_display,
            "day_name":    day_name,
            "category":    a.get("category", "assignment"),
            "priority":    priority,
        })

    # Also add calendar events not already covered by assessments
    existing_titles = {d["title"].lower().strip() for d in upcoming_deadlines}
    for ev in calendar_events[:5]:
        ev_title = ev.get("title", "")
        if ev_title.lower().strip() in existing_titles:
            continue
        start = ev.get("start_date", "")
        due_display = start
        day_name = ""
        if start:
            try:
                if "T" in start:
                    dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
                else:
                    dt = datetime.strptime(start, "%Y-%m-%d")
                days_diff = (dt.date() - now.date()).days
                if days_diff == 0:     due_display = "Today"
                elif days_diff == 1:   due_display = "Tomorrow"
                else:                  due_display = dt.strftime("%a, %b %d")
                day_name = dt.strftime("%A")
            except Exception:
                pass

        cat = _detect_category(ev_title)
        priority = "High" if cat in ("exam","final","midterm","quiz") else "Medium"

        upcoming_deadlines.append({
            "id":          ev.get("id", ""),
            "title":       ev_title,
            "class_name":  (_match_class(ev_title, classes) or {}).get("name", ""),
            "due_date":    start[:10] if start and len(start) >= 10 else start,
            "due_display": due_display,
            "day_name":    day_name,
            "category":    cat,
            "priority":    priority,
        })

    # Sort by due_date and limit to 5
    upcoming_deadlines.sort(key=lambda x: x.get("due_date") or "9999")
    upcoming_deadlines = upcoming_deadlines[:5]

    # ── classGrades ──
    class_grades = []
    for c in classes:
        avg = _class_avg_grade(c["id"], all_grades)
        class_grades.append({
            "id":         c["id"],
            "name":       c.get("name", ""),
            "term":       c.get("term", ""),
            "instructor": c.get("instructor"),
            "grade":      round(avg) if avg else None,
        })

    # ── weeklyProgress ──
    sessions_goal = max(len(classes), 5)
    sessions_done = len(set(g.get("class_id") for g in grades_this_week))
    pct = round(sessions_done / sessions_goal * 100) if sessions_goal > 0 else 0

    weekly_progress = {
        "sessions_done": sessions_done,
        "sessions_goal": sessions_goal,
        "pct":           min(pct, 100),
    }

    # ── aiRecommendation ──
    ai_recommendation = None
    if classes and settings.anthropic_api_key:
        try:
            class_names = ", ".join(c.get("name", "") for c in classes[:3])
            urgent = focus_task["title"] if focus_task else "upcoming assignments"
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

    # ── FINAL RESPONSE ──
    return {
        "summary":            summary,
        "focusTask":          focus_task,
        "todayPlan":          today_plan,
        "upcomingDeadlines":  upcoming_deadlines,
        "classGrades":        class_grades,
        "weeklyProgress":     weekly_progress,
        "aiRecommendation":   ai_recommendation,
    }


# ── GET /api/dashboard/study-plan ──────────────────────────────────────────

@router.get("/study-plan")
async def get_study_plan(request: Request):
    """
    Returns personalized study plan data:
    - focusItem: highest priority class + topic to study
    - sessions: recommended study sessions (incomplete topics)
    - deadlines: upcoming deadlines across all classes
    """
    from datetime import datetime, timedelta

    user_id = _get_user(request)

    # Get user name
    first_name = "Student"
    try:
        users_res = supabase.table("users").select("full_name").eq("id", user_id).limit(1).execute()
        print(f"[STUDY PLAN] users query result: {users_res.data}")
        if users_res.data and users_res.data[0].get("full_name"):
            first_name = users_res.data[0]["full_name"].split()[0]
    except Exception as e:
        print(f"[STUDY PLAN] users query error: {e}")

    # Fallback: try auth token metadata
    if first_name == "Student":
        try:
            auth_header = request.headers.get("Authorization") or request.headers.get("authorization") or ""
            token = auth_header.replace("Bearer ", "")
            user_resp = supabase.auth.get_user(token)
            meta = user_resp.user.user_metadata or {}
            name = meta.get("full_name") or meta.get("name") or ""
            if name:
                first_name = name.split()[0]
                print(f"[STUDY PLAN] got name from auth metadata: {first_name}")
        except Exception as e:
            print(f"[STUDY PLAN] auth metadata error: {e}")

    today = datetime.utcnow().date()
    today_str = today.isoformat()
    week_str = (today + timedelta(days=7)).isoformat()

    # ── Get all classes ──
    classes_res = supabase.table("classes") \
        .select("id, name, term") \
        .eq("user_id", user_id).execute()
    classes = classes_res.data or []
    class_map = {c["id"]: c["name"] for c in classes}

    if not classes:
        return {
            "firstName": first_name,
            "focusItem": None,
            "sessions": [],
            "deadlines": [],
        }

    class_ids = [c["id"] for c in classes]

    # ── Get grades per class (for current grade) ──
    grades_res = supabase.table("grades") \
        .select("class_id, score, max_score") \
        .eq("user_id", user_id).execute()
    grades = grades_res.data or []

    class_grades: dict = {}
    for g in grades:
        cid = g.get("class_id")
        if cid not in class_grades:
            class_grades[cid] = []
        try:
            class_grades[cid].append(g["score"] / g["max_score"] * 100)
        except (ZeroDivisionError, TypeError, KeyError):
            pass

    class_avg = {}
    for cid, scores in class_grades.items():
        if scores:
            class_avg[cid] = round(sum(scores) / len(scores))

    # ── Get upcoming assessments/calendar events ──
    all_deadlines = []

    # From assessments
    for cid in class_ids:
        assess_res = supabase.table("assessments") \
            .select("title, category, due_date") \
            .eq("class_id", cid).eq("user_id", user_id) \
            .gte("due_date", today_str) \
            .order("due_date").limit(5).execute()
        for a in (assess_res.data or []):
            due = a.get("due_date", "")
            days_left = None
            if due:
                try:
                    days_left = (datetime.strptime(due, "%Y-%m-%d").date() - today).days
                except Exception:
                    pass
            all_deadlines.append({
                "title": a.get("title", ""),
                "category": a.get("category", ""),
                "className": class_map.get(cid, ""),
                "classId": cid,
                "due_date": due,
                "days_left": days_left,
            })

    # From calendar events
    cal_res = supabase.table("calendar_events") \
        .select("title, start_date, category") \
        .eq("user_id", user_id) \
        .gte("start_date", datetime.utcnow().isoformat()) \
        .order("start_date").limit(30).execute()

    existing_titles = {d["title"].lower().strip() for d in all_deadlines}
    for ev in (cal_res.data or []):
        ev_title = ev.get("title", "")
        if ev_title.lower().strip() in existing_titles:
            continue
        due = (ev.get("start_date") or "")[:10]
        days_left = None
        try:
            days_left = (datetime.strptime(due, "%Y-%m-%d").date() - today).days
        except Exception:
            pass
        # Match to class (multi-pass: full name → first word → course code)
        matched_class = ""
        matched_cid = ""
        ev_lower = ev_title.lower()
        for cid, cname in class_map.items():
            cname_lower = cname.lower()
            # Pass 1: full class name in event title
            if cname_lower in ev_lower:
                matched_class = cname; matched_cid = cid; break
            # Pass 2: event title contains first word of class name (if 4+ chars)
            first_word = cname_lower.split()[0] if cname_lower else ""
            if len(first_word) >= 4 and first_word in ev_lower:
                matched_class = cname; matched_cid = cid; break
            # Pass 3: class name words in event title (e.g., "BIOL" or "1107")
            for word in cname_lower.split():
                if len(word) >= 3 and word in ev_lower:
                    matched_class = cname; matched_cid = cid; break
            if matched_cid: break
            # Pass 4: event title words in class name (e.g., "Math" in "Engineering Mathematics III")
            for word in ev_lower.split():
                if len(word) >= 4 and word in cname_lower:
                    matched_class = cname; matched_cid = cid; break
            if matched_cid: break
        all_deadlines.append({
            "title": ev_title,
            "category": ev.get("category", ""),
            "className": matched_class,
            "classId": matched_cid,
            "due_date": due,
            "days_left": days_left,
        })

    all_deadlines.sort(key=lambda x: x.get("due_date") or "9999")

    # ── Get grade weights per class ──
    weights_res = supabase.table("grade_weights") \
        .select("class_id, category, weight_pct") \
        .eq("user_id", user_id).execute()
    weights = weights_res.data or []
    # Find max weight per class
    class_max_weight: dict = {}
    for w in weights:
        cid = w.get("class_id")
        pct = w.get("weight_pct", 0)
        if cid not in class_max_weight or pct > class_max_weight[cid].get("weight_pct", 0):
            class_max_weight[cid] = w

    # ── Determine Focus Item (highest priority) ──
    # Priority = closest exam + lowest grade + highest weight
    focus = None
    best_score = -1

    for dl in all_deadlines:
        cid = dl.get("classId") or ""
        cat = (dl.get("category") or "").lower()
        is_exam = "exam" in cat or "midterm" in cat or "final" in cat or "quiz" in cat
        days = dl.get("days_left")
        if days is None or days < 0:
            continue

        cid = dl.get("classId")
        grade = class_avg.get(cid, 50)
        urgency = max(0, 100 - days * 10) if days <= 10 else 0
        need = max(0, 100 - grade)
        exam_bonus = 30 if is_exam else 0
        score = urgency + need + exam_bonus

        if score > best_score:
            best_score = score
            # Find a topic for this class
            topic_title = ""
            if cid:
                try:
                    topics_res = supabase.table("topics") \
                        .select("title") \
                        .eq("class_id", cid).eq("user_id", user_id) \
                        .order("created_at").limit(1).execute()
                    if topics_res.data:
                        topic_title = topics_res.data[0].get("title", "")
                except Exception:
                    pass

            max_w = class_max_weight.get(cid, {}) if cid else {}
            focus = {
                "className": dl.get("className", "") or dl.get("title", "").split(" - ")[0],
                "classId": cid,
                "topic": topic_title,
                "examTitle": dl.get("title", ""),
                "examDate": dl.get("due_date", ""),
                "daysLeft": days,
                "currentGrade": class_avg.get(cid) if cid else None,
                "potentialImpact": max_w.get("weight_pct", 0),
            }

    # ── Recommended Sessions (topics with incomplete study materials) ──
    sessions = []
    print(f"[STUDY PLAN] Building sessions for {len(class_ids)} classes: {class_ids[:3]}")
    for cid in class_ids[:3]:
        if not cid:
            continue
        try:
            topics_res = supabase.table("topics") \
                .select("id, title") \
                .eq("class_id", cid).eq("user_id", user_id) \
                .order("created_at").limit(3).execute()
            print(f"[STUDY PLAN] Class {cid}: found {len(topics_res.data or [])} topics")

            for t in (topics_res.data or []):
                # Check if summary exists
                try:
                    sum_res = supabase.table("study_summaries") \
                        .select("id") \
                        .eq("user_id", user_id).eq("topic_id", t["id"]) \
                        .limit(1).execute()
                    has_summary = bool(sum_res.data)
                except Exception:
                    has_summary = False

                # Check if quiz exists
                try:
                    quiz_res = supabase.table("study_quizzes") \
                        .select("id") \
                        .eq("user_id", user_id).eq("topic_id", t["id"]) \
                        .limit(1).execute()
                    has_quiz = bool(quiz_res.data)
                except Exception:
                    has_quiz = False

            completed = 0
            if has_summary: completed += 1
            if has_quiz: completed += 1

            # Find nearest deadline for this class
            class_deadlines = [d for d in all_deadlines if d.get("classId") == cid and d.get("days_left") is not None and d.get("days_left", 99) >= 0]
            nearest = class_deadlines[0] if class_deadlines else None
            urgency_text = ""
            if nearest:
                dl = nearest.get("days_left", 99)
                if dl <= 2:
                    urgency_text = f"Exam in {dl} days"
                elif dl <= 7:
                    urgency_text = f"Due in {dl} days"
                else:
                    urgency_text = f"{dl} days left"

            sessions.append({
                "topicId": t["id"],
                "title": t["title"],
                "className": class_map.get(cid, ""),
                "classId": cid,
                "completed": completed,
                "total": 4,
                "urgencyText": urgency_text,
                "isHighImpact": nearest and nearest.get("days_left", 99) <= 3,
            })
        except Exception as e:
            print(f"[STUDY PLAN] Error building session for class {cid}: {e}")

    # Sort sessions: high impact first, then least completed
    sessions.sort(key=lambda s: (0 if s["isHighImpact"] else 1, s["completed"]))
    sessions = sessions[:5]
    print(f"[STUDY PLAN] Total sessions: {len(sessions)}")

    # Top 5 deadlines
    top_deadlines = []
    for dl in all_deadlines[:5]:
        due = dl.get("due_date", "")
        month = ""
        day = ""
        if due:
            try:
                d = datetime.strptime(due, "%Y-%m-%d")
                month = d.strftime("%b").upper()
                day = str(d.day)
            except Exception:
                pass
        top_deadlines.append({
            **dl,
            "month": month,
            "day": day,
        })

    return {
        "firstName": first_name,
        "focusItem": focus,
        "sessions": sessions,
        "deadlines": top_deadlines,
    }
