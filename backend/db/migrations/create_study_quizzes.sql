CREATE TABLE IF NOT EXISTS study_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    class_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    quiz_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_study_quizzes_user_topic 
    ON study_quizzes(user_id, topic_id);
