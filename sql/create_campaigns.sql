-- Create the campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    target_audience TEXT,
    goal TEXT,
    tone TEXT,
    content TEXT, -- Stores the generated HTML
    status TEXT DEFAULT 'draft',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all access for now (since we are in development/demo mode with anon key)
-- precise policy can be tightened later
CREATE POLICY "Enable read/write for all users" ON public.campaigns
    FOR ALL USING (true) WITH CHECK (true);
