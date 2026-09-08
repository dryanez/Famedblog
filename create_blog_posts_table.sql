-- Create blog_posts table for storing all blog content in Supabase
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft', -- draft, scheduled, published
    scheduled_date TIMESTAMP WITH TIME ZONE,
    published_date TIMESTAMP WITH TIME ZONE,
    
    -- Context tracking (remembers PDF and topic used)
    pdf_uri TEXT,
    pdf_name TEXT,
    selected_topic JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled ON blog_posts(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow all operations (admin-only app)
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts
    FOR ALL
    USING (true)
    WITH CHECK (true);
