CREATE TABLE IF NOT EXISTS study_targeted (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    class_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    targeted_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_study_targeted_user_topic 
    ON study_targeted(user_id, topic_id);
