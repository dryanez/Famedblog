-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow read access to everyone (or authenticated users/service role)
CREATE POLICY "Allow read access to knowledge_base" ON public.knowledge_base
    FOR SELECT USING (true);

-- Allow full access to admins/service role
CREATE POLICY "Allow full access to knowledge_base" ON public.knowledge_base
    FOR ALL USING (true);

-- Create index for search performance if needed later
CREATE INDEX IF NOT EXISTS knowledge_base_category_idx ON public.knowledge_base (category);
