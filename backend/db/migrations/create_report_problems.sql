-- ============================================================
-- MIGRATION: Create report_problems table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.report_problems (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    description         TEXT NOT NULL,
    severity            TEXT NOT NULL DEFAULT 'medium'
        CHECK (severity IN ('low', 'medium', 'high')),
    screenshot_url      TEXT,
    status              TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority            TEXT NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    response_from_admin TEXT,
    resolved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_problems_user_id ON public.report_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_report_problems_status  ON public.report_problems(status);

-- Auto-update updated_at on every row change
DROP TRIGGER IF EXISTS trg_report_problems_updated_at ON public.report_problems;
CREATE TRIGGER trg_report_problems_updated_at
  BEFORE UPDATE ON public.report_problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
