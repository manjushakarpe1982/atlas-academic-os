"""
classifier.py — Heuristic file classifier (FR-1.3, FR-1.4).

Classifies an uploaded file into one of Atlas's categories using:
  1. Filename heuristics (regex patterns on the original filename).
  2. Extension mapping (audio → lecture_audio, pptx → lecture_slides, etc.).
  3. Content sniffing for PDFs/DOCX (first-page text scan) — optional,
     runs only when the file bytes are available.

Returns one of:
  syllabus | lecture_slides | lecture_audio | notes | assignment |
  quiz | exam | graded_work | review_sheet | announcement | image | other

Design notes
────────────
• The classifier intentionally does NOT call the LLM — that happens
  separately during the "parsing" pipeline step. This keeps classification
  fast (< 50 ms) so the UI can show the result immediately.
• Patterns are ordered from most-specific to least-specific; the first
  match wins.
• To override a classification the frontend calls PATCH /api/files/{id}/category
  which sets category_source = 'user_override'.
"""

import re
from typing import Optional

# ── Category definitions ────────────────────────────────────────────────────

# All valid category values (mirrors the frontend FileCategory type)
VALID_CATEGORIES = {
    "syllabus",
    "lecture_slides",
    "lecture_audio",
    "notes",
    "assignment",
    "quiz",
    "exam",
    "graded_work",
    "review_sheet",
    "announcement",
    "image",
    "other",
}

# ── Extension maps ──────────────────────────────────────────────────────────

AUDIO_EXTENSIONS    = {"mp3", "m4a", "wav", "ogg", "aac", "flac"}
VIDEO_EXTENSIONS    = {"mp4", "mov", "webm", "avi", "mkv"}
IMAGE_EXTENSIONS    = {"jpg", "jpeg", "png", "gif", "webp", "heic", "tiff", "bmp"}
SLIDE_EXTENSIONS    = {"pptx", "ppt", "key"}
DOCUMENT_EXTENSIONS = {"pdf", "docx", "doc", "rtf", "odt", "txt", "md"}


# ── Filename heuristic patterns ─────────────────────────────────────────────

# (pattern, category) — first match wins; patterns are case-insensitive
FILENAME_PATTERNS: list[tuple[re.Pattern, str]] = [
    # Syllabus
    (re.compile(r"\bsyllabus\b",          re.I), "syllabus"),
    (re.compile(r"\bcourse.?outline\b",   re.I), "syllabus"),
    (re.compile(r"\bcourse.?info\b",      re.I), "syllabus"),
    (re.compile(r"\bclass.?schedule\b",   re.I), "syllabus"),

    # Graded work
    (re.compile(r"\bgraded\b",            re.I), "graded_work"),
    (re.compile(r"\bfeedback\b",          re.I), "graded_work"),
    (re.compile(r"\bscore\b",             re.I), "graded_work"),
    (re.compile(r"\breturn(ed)?\b",       re.I), "graded_work"),
    (re.compile(r"\bmarked\b",            re.I), "graded_work"),

    # Review sheet
    (re.compile(r"\breview.?sheet\b",     re.I), "review_sheet"),
    (re.compile(r"\bstudy.?guide\b",      re.I), "review_sheet"),
    (re.compile(r"\bcheat.?sheet\b",      re.I), "review_sheet"),
    (re.compile(r"\bexam.?prep\b",        re.I), "review_sheet"),
    (re.compile(r"\bfinal.?review\b",     re.I), "review_sheet"),

    # Exam
    (re.compile(r"\bmidterm\b",           re.I), "exam"),
    (re.compile(r"\bfinal.?exam\b",       re.I), "exam"),
    (re.compile(r"\bpractice.?exam\b",    re.I), "exam"),
    (re.compile(r"\bexam\s*\d",           re.I), "exam"),

    # Quiz
    (re.compile(r"\bquiz\b",              re.I), "quiz"),
    (re.compile(r"\bquizzes\b",           re.I), "quiz"),

    # Assignment / homework / lab
    (re.compile(r"\bassignment\b",        re.I), "assignment"),
    (re.compile(r"\bhomework\b",          re.I), "assignment"),
    (re.compile(r"\bhw\s*\d",             re.I), "assignment"),
    (re.compile(r"\bproblem.?set\b",      re.I), "assignment"),
    (re.compile(r"\bps\s*\d",             re.I), "assignment"),
    (re.compile(r"\blab.?report\b",       re.I), "assignment"),
    (re.compile(r"\bproject\b",           re.I), "assignment"),
    (re.compile(r"\bessay\b",             re.I), "assignment"),

    # Lecture slides
    (re.compile(r"\blecture.?slide",      re.I), "lecture_slides"),
    (re.compile(r"\bslide",               re.I), "lecture_slides"),
    (re.compile(r"\bpresent",             re.I), "lecture_slides"),
    (re.compile(r"\blecture\s*\d",        re.I), "lecture_slides"),
    (re.compile(r"\bweek\s*\d+.?slide",   re.I), "lecture_slides"),

    # Lecture audio / recording
    (re.compile(r"\blecture.?rec",        re.I), "lecture_audio"),
    (re.compile(r"\brecording\b",         re.I), "lecture_audio"),
    (re.compile(r"\baudio\b",             re.I), "lecture_audio"),
    (re.compile(r"\bclass.?rec",          re.I), "lecture_audio"),

    # Announcement
    (re.compile(r"\bannouncement\b",      re.I), "announcement"),
    (re.compile(r"\bnotice\b",            re.I), "announcement"),

    # Notes
    (re.compile(r"\bnotes?\b",            re.I), "notes"),
    (re.compile(r"\bsummary\b",           re.I), "notes"),
    (re.compile(r"\boutline\b",           re.I), "notes"),
]


# ── Content sniffing (optional) ─────────────────────────────────────────────

# Keywords that suggest a syllabus in the first-page text
_SYLLABUS_CONTENT_KEYWORDS = [
    "course objectives", "learning objectives", "grading", "grade breakdown",
    "office hours", "course description", "textbook", "attendance policy",
    "late policy", "academic integrity", "prerequisites",
]

_REVIEW_CONTENT_KEYWORDS = [
    "will be on the exam", "exam topics", "review topics",
    "key terms", "important concepts",
]

_GRADED_CONTENT_KEYWORDS = [
    "your score", "total points", "points earned", "feedback", "grade:",
]


def _sniff_content(first_page_text: str) -> Optional[str]:
    """
    Scan the first page of a document for telltale phrases.
    Returns a category string, or None if nothing matched.
    """
    t = first_page_text.lower()

    syllabus_hits = sum(1 for kw in _SYLLABUS_CONTENT_KEYWORDS if kw in t)
    if syllabus_hits >= 3:
        return "syllabus"

    review_hits = sum(1 for kw in _REVIEW_CONTENT_KEYWORDS if kw in t)
    if review_hits >= 2:
        return "review_sheet"

    graded_hits = sum(1 for kw in _GRADED_CONTENT_KEYWORDS if kw in t)
    if graded_hits >= 2:
        return "graded_work"

    return None


# ── Public interface ─────────────────────────────────────────────────────────

def classify_file(
    original_name: str,
    extension: str,
    first_page_text: Optional[str] = None,
) -> str:
    """
    Classify a file and return a category string.

    Args:
        original_name:    The filename as uploaded (e.g. "BIO101_Syllabus.pdf").
        extension:        Lowercase extension without dot (e.g. "pdf").
        first_page_text:  Optional extracted text from the first page/slide.
                          Pass None to skip content sniffing.

    Returns:
        Category string from VALID_CATEGORIES.
    """
    ext = extension.lower().lstrip(".")

    # 1. Extension-only rules (audio, video, images, slides)
    if ext in AUDIO_EXTENSIONS or ext in VIDEO_EXTENSIONS:
        # Still run filename patterns to distinguish 'recording' from plain music
        for pattern, category in FILENAME_PATTERNS:
            if pattern.search(original_name):
                if category == "lecture_audio":
                    return "lecture_audio"
        return "lecture_audio"

    if ext in IMAGE_EXTENSIONS:
        return "image"

    if ext in SLIDE_EXTENSIONS:
        # PPTX → lecture_slides unless filename says otherwise
        for pattern, category in FILENAME_PATTERNS:
            if pattern.search(original_name):
                return category
        return "lecture_slides"

    # 2. Filename heuristics (works for PDF, DOCX, TXT, etc.)
    for pattern, category in FILENAME_PATTERNS:
        if pattern.search(original_name):
            return category

    # 3. Content sniffing (if text was extracted)
    if first_page_text:
        sniffed = _sniff_content(first_page_text)
        if sniffed:
            return sniffed

    return "other"
