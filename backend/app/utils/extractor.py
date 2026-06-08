"""
extractor.py — Extract plain text from uploaded files.

Supports: PDF, DOCX, PPTX, TXT, MD.
Audio/video/image files return an empty string — they are handled
by separate transcription / vision pipelines (future phases).

All functions are synchronous and safe to call from a FastAPI
background task. They receive raw bytes (already read from storage)
and return a plain-text string.
"""

from __future__ import annotations
import io
from typing import Optional


# ── PDF ────────────────────────────────────────────────────────────────────

def _extract_pdf(data: bytes) -> str:
    try:
        import pypdf  # pip install pypdf
        reader = pypdf.PdfReader(io.BytesIO(data))
        pages = []
        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text.strip())
        return "\n\n".join(pages)
    except Exception as e:
        raise RuntimeError(f"PDF extraction failed: {e}") from e


# ── DOCX ───────────────────────────────────────────────────────────────────

def _extract_docx(data: bytes) -> str:
    try:
        from docx import Document  # pip install python-docx
        doc = Document(io.BytesIO(data))
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        # Also pull text from tables
        for table in doc.tables:
            for row in table.rows:
                cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if cells:
                    paragraphs.append(" | ".join(cells))
        return "\n\n".join(paragraphs)
    except Exception as e:
        raise RuntimeError(f"DOCX extraction failed: {e}") from e


# ── PPTX ───────────────────────────────────────────────────────────────────

def _extract_pptx(data: bytes) -> str:
    try:
        from pptx import Presentation  # pip install python-pptx
        prs = Presentation(io.BytesIO(data))
        slides_text = []
        for i, slide in enumerate(prs.slides, 1):
            parts = [f"--- Slide {i} ---"]
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    parts.append(shape.text.strip())
            if len(parts) > 1:
                slides_text.append("\n".join(parts))
        return "\n\n".join(slides_text)
    except Exception as e:
        raise RuntimeError(f"PPTX extraction failed: {e}") from e


# ── TXT / MD ───────────────────────────────────────────────────────────────

def _extract_text(data: bytes) -> str:
    for encoding in ("utf-8", "latin-1", "cp1252"):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


# ── Public interface ────────────────────────────────────────────────────────

def extract_text(data: bytes, extension: str) -> str:
    """
    Extract plain text from file bytes.

    Args:
        data:      Raw file bytes.
        extension: Lowercase extension without dot (e.g. 'pdf', 'docx').

    Returns:
        Extracted text string, or empty string if the file type
        does not support text extraction (audio, video, image).

    Raises:
        RuntimeError: if a supported format fails to parse.
    """
    ext = extension.lower().lstrip(".")

    if ext == "pdf":
        return _extract_pdf(data)
    if ext in ("docx", "doc"):
        return _extract_docx(data)
    if ext in ("pptx", "ppt"):
        return _extract_pptx(data)
    if ext in ("txt", "md"):
        return _extract_text(data)

    # Audio, video, images — no text extraction in this phase
    return ""


def truncate_for_claude(text: str, max_chars: int = 80_000) -> str:
    """
    Truncate extracted text to a safe length for Claude's context window.
    80 000 chars ≈ ~20 000 tokens, well within claude-sonnet-4 limits.
    Truncation happens at a paragraph boundary where possible.
    """
    if len(text) <= max_chars:
        return text
    # Try to cut at a paragraph boundary
    cut = text.rfind("\n\n", 0, max_chars)
    if cut > max_chars * 0.8:
        return text[:cut] + "\n\n[... truncated for length ...]"
    return text[:max_chars] + "\n\n[... truncated for length ...]"
