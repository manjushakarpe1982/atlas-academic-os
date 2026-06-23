CREATE TABLE IF NOT EXISTS study_flashcards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    class_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    flashcards_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_study_flashcards_user_topic 
    ON study_flashcards(user_id, topic_id);

ALTER TABLE study_flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own flashcards"
    ON study_flashcards FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);