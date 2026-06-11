-- ============================================================
-- ATLAS ACADEMIC OS — Complete Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- ── USERS ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email            TEXT UNIQUE NOT NULL,
    password_hash    TEXT NOT NULL,
    full_name        TEXT,
    email_verified   BOOLEAN NOT NULL DEFAULT FALSE,
    school           TEXT CHECK (school IN ('arkansas', 'tamu', 'other')),
    acknowledged_at  TIMESTAMPTZ,
    ack_version      TEXT,
    last_login_at    TIMESTAMPTZ,
    deleted_at       TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── CLASSES ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.classes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name             TEXT NOT NULL,
    instructor       TEXT,
    credit_hours     INT,
    term             TEXT DEFAULT 'Fall 2026',
    syllabus_file_id UUID,
    textbook_isbn    TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classes_user_id ON public.classes(user_id);

DROP TRIGGER IF EXISTS trg_classes_updated_at ON public.classes;
CREATE TRIGGER trg_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── GRADE WEIGHTS ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.grade_weights (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id    UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_id     UUID,
    category    TEXT NOT NULL,
    weight_pct  NUMERIC NOT NULL,
    confidence  TEXT NOT NULL DEFAULT 'medium'
        CHECK (confidence IN ('high', 'medium', 'low')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grade_weights_class_id ON public.grade_weights(class_id);

-- ── ASSESSMENTS ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.assessments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id    UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_id     UUID,
    title       TEXT NOT NULL,
    category    TEXT,
    due_date    DATE,
    source      TEXT NOT NULL DEFAULT 'manual'
        CHECK (source IN ('syllabus', 'ics', 'manual')),
    confidence  TEXT NOT NULL DEFAULT 'medium',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_class_id ON public.assessments(class_id);
CREATE INDEX IF NOT EXISTS idx_assessments_due_date  ON public.assessments(due_date);

-- ── GRADES ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.grades (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    class_id      UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
    category      TEXT NOT NULL,
    title         TEXT,
    score         NUMERIC NOT NULL,
    max_score     NUMERIC NOT NULL,
    recorded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source        TEXT NOT NULL DEFAULT 'manual'
        CHECK (source IN ('manual', 'photo')),
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grades_user_id  ON public.grades(user_id);
CREATE INDEX IF NOT EXISTS idx_grades_class_id ON public.grades(class_id);

-- ── TOPICS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.topics (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    class_id    UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    file_id     UUID,
    title       TEXT NOT NULL,
    source      TEXT NOT NULL DEFAULT 'syllabus'
        CHECK (source IN ('syllabus', 'textbook_toc')),
    week_hint   INT,
    chapter_ref TEXT,
    confidence  TEXT NOT NULL DEFAULT 'medium',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topics_class_id ON public.topics(class_id);

-- ── FILES ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.files (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    class_id          UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    original_name     TEXT NOT NULL,
    mime_type         TEXT,
    size_bytes        INT,
    extension         TEXT,
    category          TEXT NOT NULL DEFAULT 'other',
    storage_bucket    TEXT,
    storage_path      TEXT,
    status            TEXT NOT NULL DEFAULT 'uploading',
    pipeline_step     INT NOT NULL DEFAULT 0,
    error_message     TEXT,
    extracted_summary TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_user_id  ON public.files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_class_id ON public.files(class_id);

DROP TRIGGER IF EXISTS trg_files_updated_at ON public.files;
CREATE TRIGGER trg_files_updated_at
  BEFORE UPDATE ON public.files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── PARSED RESULTS ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.parsed_results (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id           UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    raw_result        JSONB NOT NULL DEFAULT '{}',
    suggestions       JSONB NOT NULL DEFAULT '[]',
    course_name       TEXT,
    instructor        TEXT,
    credit_hours      INT,
    model_used        TEXT,
    parse_duration_ms INT,
    parse_error       TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_parsed_results_file_id ON public.parsed_results(file_id);

-- ── CALENDAR FEEDS ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.calendar_feeds (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    ics_url        TEXT NOT NULL,
    school         TEXT,
    last_synced_at TIMESTAMPTZ,
    last_status    TEXT DEFAULT 'pending',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
