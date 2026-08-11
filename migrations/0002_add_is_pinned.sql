ALTER TABLE comments ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0;
CREATE INDEX idx_comments_page_pinned ON comments(page_slug, is_pinned);
