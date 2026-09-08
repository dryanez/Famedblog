-- Create campaign_sends table to track which users received which campaigns
CREATE TABLE IF NOT EXISTS public.campaign_sends (
    id BIGSERIAL PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign_user 
    ON public.campaign_sends(campaign_id, user_id);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_campaign_sends_user_id 
    ON public.campaign_sends(user_id);

-- Enable RLS
ALTER TABLE public.campaign_sends ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role can manage campaign_sends" 
    ON public.campaign_sends 
    FOR ALL 
    USING (true);

-- Grant permissions
GRANT ALL ON public.campaign_sends TO service_role;
GRANT USAGE, SELECT ON SEQUENCE campaign_sends_id_seq TO service_role;
