CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    quiz_reminder BOOLEAN DEFAULT true,
    assignment_alert BOOLEAN DEFAULT true,
    study_reminder BOOLEAN DEFAULT true,
    weekly_summary BOOLEAN DEFAULT false,
    new_grades BOOLEAN DEFAULT true,
    tips_updates BOOLEAN DEFAULT false,
    reminder_time TEXT DEFAULT '7:00 PM',
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_prefs_user ON notification_preferences(user_id);

-- Notification log (tracks sent notifications)
CREATE TABLE IF NOT EXISTS notification_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_log_user ON notification_log(user_id, created_at DESC);
