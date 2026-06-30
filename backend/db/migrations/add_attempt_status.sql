-- Add status and progress tracking to study_attempts
ALTER TABLE study_attempts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
ALTER TABLE study_attempts ADD COLUMN IF NOT EXISTS current_index INTEGER DEFAULT 0;
ALTER TABLE study_attempts ADD COLUMN IF NOT EXISTS answers_so_far JSONB DEFAULT '[]';
ALTER TABLE study_attempts ADD COLUMN IF NOT EXISTS score_so_far INTEGER DEFAULT 0;
