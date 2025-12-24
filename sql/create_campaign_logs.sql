-- Create a table to track sent campaign emails
CREATE TABLE IF NOT EXISTS campaign_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id text NOT NULL, -- Can be 'exam_urgency_14d' (default) or a UUID (custom)
  user_email text NOT NULL,
  user_id integer REFERENCES users(id),
  status text DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked'
  sent_at timestamp with time zone DEFAULT now(),
  resend_email_id text, -- ID returned by Resend API
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Add index for faster queries by campaign
CREATE INDEX IF NOT EXISTS idx_campaign_logs_campaign_id ON campaign_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_logs_user_email ON campaign_logs(user_email);
