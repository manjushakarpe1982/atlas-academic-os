-- Study Summaries: stores AI-generated topic summaries per user
CREATE TABLE IF NOT EXISTS study_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    summary_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, topic_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_study_summaries_user_topic ON study_summaries(user_id, topic_id);

-- Enable RLS
ALTER TABLE study_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can only access their own summaries
CREATE POLICY "Users can manage own summaries"
    ON study_summaries FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
