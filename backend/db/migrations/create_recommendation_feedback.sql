CREATE TABLE IF NOT EXISTS recommendation_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    feedback_type TEXT NOT NULL,
    reason TEXT DEFAULT NULL,
    focus_task_title TEXT DEFAULT NULL,
    focus_task_category TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rec_feedback_user ON recommendation_feedback(user_id);


