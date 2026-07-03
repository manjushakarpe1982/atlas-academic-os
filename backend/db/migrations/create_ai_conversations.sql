CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    class_id TEXT DEFAULT NULL,
    class_name TEXT DEFAULT '',
    topic_id TEXT DEFAULT NULL,
    topic_title TEXT DEFAULT '',
    messages JSONB DEFAULT '[]',
    last_message TEXT DEFAULT '',
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON ai_conversations(user_id, updated_at DESC);
