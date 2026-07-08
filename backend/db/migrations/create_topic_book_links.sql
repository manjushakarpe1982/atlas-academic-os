-- Book TOC stored on the book row
ALTER TABLE class_books ADD COLUMN IF NOT EXISTS toc JSONB DEFAULT '[]';

-- Links between syllabus topics and book chapters (a topic can link to multiple chapters)
CREATE TABLE IF NOT EXISTS topic_book_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    class_id UUID NOT NULL,
    topic_id UUID NOT NULL,
    book_id UUID NOT NULL,
    chapter_number INTEGER,
    chapter_title TEXT DEFAULT '',
    confidence TEXT DEFAULT '',
    match_type TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE topic_book_links ADD COLUMN IF NOT EXISTS confidence TEXT DEFAULT '';
ALTER TABLE topic_book_links ADD COLUMN IF NOT EXISTS match_type TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_topic_book_links_topic ON topic_book_links(topic_id, user_id);
CREATE INDEX IF NOT EXISTS idx_topic_book_links_class ON topic_book_links(class_id, user_id);
