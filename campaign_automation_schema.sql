-- Create campaign_automation table for storing enabled/disabled state
CREATE TABLE IF NOT EXISTS campaign_automation (
    campaign_id TEXT PRIMARY KEY,
    enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default values for all automated campaigns (enabled by default)
INSERT INTO campaign_automation (campaign_id, enabled) VALUES
    ('exam_urgency_14d', true),
    ('exam_urgency_special_offer', true),
    ('exam_urgency_7d', true),
    ('exam_urgency_3d', true),
    ('subscription_expiry', true),
    ('welcome_day0', true),
    ('holiday_special', true)
ON CONFLICT (campaign_id) DO NOTHING;

-- Enable RLS
ALTER TABLE campaign_automation ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Allow read campaign_automation" ON campaign_automation
    FOR SELECT USING (true);

-- Allow service role to update
CREATE POLICY "Allow update campaign_automation" ON campaign_automation
    FOR ALL USING (true);
