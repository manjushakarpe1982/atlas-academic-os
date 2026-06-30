CREATE TABLE IF NOT EXISTS study_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    class_id UUID NOT NULL,
    material_type TEXT NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    retake_number INTEGER NOT NULL DEFAULT 0,
    content_json JSONB NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_study_attempts_user_topic 
    ON study_attempts(user_id, topic_id, material_type);

