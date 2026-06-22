-- ============================================================
-- MIGRATION: Create feature_requests table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.feature_requests (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title               TEXT NOT NULL,
    description         TEXT NOT NULL,
    category            TEXT NOT NULL DEFAULT 'other'
        CHECK (category IN ('ui_ux', 'new_feature', 'performance', 'integration', 'other')),
    importance          INT NOT NULL DEFAULT 3
        CHECK (importance >= 1 AND importance <= 5),
    status              TEXT NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'under_review', 'planned', 'in_progress', 'completed', 'declined')),
    priority            TEXT NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    admin_notes         TEXT,
    response_from_admin TEXT,
    resolved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_requests_user_id  ON public.feature_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_status   ON public.feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_requests_category ON public.feature_requests(category);

-- Auto-update updated_at on every row change
DROP TRIGGER IF EXISTS trg_feature_requests_updated_at ON public.feature_requests;
CREATE TRIGGER trg_feature_requests_updated_at
  BEFORE UPDATE ON public.feature_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
