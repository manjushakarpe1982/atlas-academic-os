"""
parser.py — AI parsing via Claude API (Prompt specs 4.1, 4.4, 4.6).

One function per file category. Each function:
  1. Builds a strict system prompt specifying JSON-only output.
  2. Calls Claude claude-sonnet-4-20250514.
  3. Parses the response defensively and returns a typed dict.

The caller (files.py background task) is responsible for:
  - Reading the file bytes and extracting text (via extractor.py).
  - Storing the result in the `parsed_results` table.
  - Updating the file's status and extracted_summary.

All Claude calls use the Anthropic Python SDK (anthropic>=0.25.0).
ANTHROPIC_API_KEY must be set in the environment / .env file.
"""

from __future__ import annotations

import json
import os
import re
from typing import Any, Optional

import anthropic

# ── Client ─────────────────────────────────────────────────────────────────
# The SDK reads ANTHROPIC_API_KEY from the environment automatically.
_client: Optional[anthropic.Anthropic] = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    return _client


MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 4096


# ── Helpers ─────────────────────────────────────────────────────────────────

def _call_claude(system: str, user: str) -> dict[str, Any]:
    """
    Call Claude and return parsed JSON.
    Strips markdown fences defensively before parsing.
    Raises ValueError if the response is not valid JSON.
    """
    client = _get_client()
    msg = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    raw = msg.content[0].text.strip()

    # Strip ```json ... ``` or ``` ... ``` fences
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Claude returned non-JSON: {e}\n\nRaw output:\n{raw[:500]}") from e


def _safe_call(system: str, user: str) -> tuple[dict[str, Any] | None, str | None]:
    """Wrapper that catches all errors and returns (result, error_message)."""
    try:
        return _call_claude(system, user), None
    except Exception as e:
        return None, str(e)


# ── 4.1  Syllabus parser ────────────────────────────────────────────────────

SYLLABUS_SYSTEM = """You extract structured course information from a syllabus.
Return ONLY valid JSON matching this exact schema — no prose, no markdown fences.
For any field you are unsure about, set its confidence to "medium" or "low".
Never invent dates or weights. If you cannot find a value, use null.
Weights should sum to approximately 100; if they don't, set confidence "low" on all weight items.
Dates with no year should inherit the most likely current academic year.

Schema:
{
  "course_name": string | null,
  "instructor": string | null,
  "credit_hours": integer | null,
  "office_hours": string | null,
  "grade_scale_override": object | null,
  "grade_weights": [
    {"category": string, "weight_pct": number, "confidence": "high"|"medium"|"low"}
  ],
  "assessments": [
    {"title": string, "category": string, "due_date": "YYYY-MM-DD"|null, "confidence": "high"|"medium"|"low"}
  ],
  "topics": [
    {"title": string, "week_hint": integer|null, "chapter_ref": string|null, "confidence": "high"|"medium"|"low"}
  ]
}"""


def parse_syllabus(text: str) -> tuple[dict[str, Any] | None, str | None]:
    """
    Parse a syllabus text and return structured course data.
    Returns (result_dict, error_message). One of them will be None.
    """
    user = f"Here is the syllabus text to parse:\n\n{text}"
    return _safe_call(SYLLABUS_SYSTEM, user)


def build_syllabus_summary(result: dict[str, Any]) -> str:
    """Build the extracted_summary string shown in the file card."""
    parts = []
    if result.get("course_name"):
        parts.append(result["course_name"])
    weights = result.get("grade_weights", [])
    if weights:
        parts.append(f"{len(weights)} grade categories")
    assessments = result.get("assessments", [])
    dated = [a for a in assessments if a.get("due_date")]
    if dated:
        parts.append(f"{len(dated)} deadline{'s' if len(dated) != 1 else ''} found")
    topics = result.get("topics", [])
    if topics:
        parts.append(f"{len(topics)} topics")
    if result.get("instructor"):
        parts.append(f"Instructor: {result['instructor']}")
    return " · ".join(parts) if parts else "Syllabus parsed"


# ── 4.4  Study material: notes / slides summary ─────────────────────────────

NOTES_SYSTEM = """You extract key study information from course notes or lecture slides.
Return ONLY valid JSON — no prose, no markdown fences.

Schema:
{
  "title_guess": string,
  "main_topics": [{"title": string, "summary": string, "key_terms": [string]}],
  "key_concepts": [string],
  "potential_exam_topics": [string],
  "summary": string
}"""


def parse_notes_or_slides(text: str, category: str) -> tuple[dict[str, Any] | None, str | None]:
    """Parse lecture slides or course notes."""
    label = "lecture slides" if "slide" in category else "course notes"
    user = f"Here are the {label} to analyse:\n\n{text}"
    return _safe_call(NOTES_SYSTEM, user)


def build_notes_summary(result: dict[str, Any]) -> str:
    parts = []
    topics = result.get("main_topics", [])
    if topics:
        parts.append(f"{len(topics)} topics")
    exam = result.get("potential_exam_topics", [])
    if exam:
        parts.append(f"{len(exam)} potential exam topics")
    if result.get("title_guess"):
        parts.append(result["title_guess"])
    return " · ".join(parts) if parts else "Notes analysed"


# ── 4.6  Quiz / graded work: score + topic extraction ───────────────────────

QUIZ_SYSTEM = """You extract assessment information from a quiz, exam, or graded assignment.
Return ONLY valid JSON — no prose, no markdown fences.

Schema:
{
  "assessment_title": string | null,
  "score": number | null,
  "max_score": number | null,
  "percentage": number | null,
  "topics_tested": [string],
  "weak_areas": [string],
  "question_types": [string],
  "needs_confirmation": boolean
}"""


def parse_quiz_or_graded(text: str, category: str) -> tuple[dict[str, Any] | None, str | None]:
    """Parse a quiz, exam, or graded work to extract scores and weak topics."""
    label = "graded assignment" if category == "graded_work" else category
    user = f"Here is the {label} to analyse:\n\n{text}"
    return _safe_call(QUIZ_SYSTEM, user)


def build_quiz_summary(result: dict[str, Any]) -> str:
    parts = []
    if result.get("score") is not None and result.get("max_score"):
        pct = result.get("percentage") or round(result["score"] / result["max_score"] * 100)
        parts.append(f"Score: {result['score']}/{result['max_score']} ({pct}%)")
    topics = result.get("topics_tested", [])
    if topics:
        parts.append(f"{len(topics)} topics tested")
    weak = result.get("weak_areas", [])
    if weak:
        parts.append(f"Weak: {', '.join(weak[:2])}")
    if result.get("needs_confirmation"):
        parts.append("⚠ Confirm score")
    return " · ".join(parts) if parts else "Assessment analysed"


# ── Generic document summary ─────────────────────────────────────────────────

GENERIC_SYSTEM = """You summarise an academic document.
Return ONLY valid JSON — no prose, no markdown fences.

Schema:
{
  "document_type": string,
  "title_guess": string,
  "summary": string,
  "key_points": [string],
  "relevant_topics": [string]
}"""


def parse_generic(text: str, category: str) -> tuple[dict[str, Any] | None, str | None]:
    user = f"Here is the {category} document to summarise:\n\n{text}"
    return _safe_call(GENERIC_SYSTEM, user)


def build_generic_summary(result: dict[str, Any]) -> str:
    parts = []
    if result.get("title_guess"):
        parts.append(result["title_guess"])
    points = result.get("key_points", [])
    if points:
        parts.append(f"{len(points)} key points")
    topics = result.get("relevant_topics", [])
    if topics:
        parts.append(", ".join(topics[:3]))
    return " · ".join(parts) if parts else "Document analysed"


# ── Dispatcher ───────────────────────────────────────────────────────────────

def parse_file(
    text: str,
    category: str,
) -> tuple[dict[str, Any] | None, str | None, str]:
    """
    Dispatch to the right parser based on file category.

    Returns:
        (result, error_message, extracted_summary)
        result is None if parsing failed.
    """
    if not text.strip():
        return None, "No text could be extracted from this file.", "No text extracted"

    if category == "syllabus":
        result, err = parse_syllabus(text)
        summary = build_syllabus_summary(result) if result else "Syllabus parse failed"
        return result, err, summary

    if category in ("lecture_slides", "notes", "review_sheet", "announcement"):
        result, err = parse_notes_or_slides(text, category)
        summary = build_notes_summary(result) if result else "Analysis failed"
        return result, err, summary

    if category in ("quiz", "exam", "graded_work", "assignment"):
        result, err = parse_quiz_or_graded(text, category)
        summary = build_quiz_summary(result) if result else "Analysis failed"
        return result, err, summary

    # Fallback: generic summary
    result, err = parse_generic(text, category)
    summary = build_generic_summary(result) if result else "Analysis failed"
    return result, err, summary
