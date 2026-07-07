CREATE TABLE IF NOT EXISTS class_books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    class_id UUID NOT NULL,
    isbn TEXT DEFAULT '',
    title TEXT NOT NULL,
    authors TEXT DEFAULT '',
    publisher TEXT DEFAULT '',
    published_date TEXT DEFAULT '',
    page_count INTEGER,
    cover_url TEXT DEFAULT '',
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_class_books_class ON class_books(class_id, user_id);
