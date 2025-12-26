-- Payment Tracking Schema
-- Run this in Supabase SQL Editor

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Stripe Data
    stripe_payment_id TEXT UNIQUE NOT NULL,
    stripe_customer_id TEXT,
    stripe_session_id TEXT,
    
    -- User Data
    user_email TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Payment Details
    amount_total INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'eur',
    status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'refunded', 'failed'
    
    -- Product Info
    product_name TEXT,
    product_id TEXT,
    price_id TEXT,
    quantity INTEGER DEFAULT 1,
    
    -- Timestamps
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional metadata
    metadata JSONB
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_product ON payments(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Admin can see all payments
CREATE POLICY "Admin can view all payments"
ON payments FOR SELECT
USING (auth.jwt() ->> 'email' = 'dr.felipeyanez@gmail.com');

-- Admin can insert payments (from webhook)
CREATE POLICY "Admin can insert payments"
ON payments FOR INSERT
WITH CHECK (true); -- Webhook will insert, we'll verify via API key

-- Create a view for revenue analytics
CREATE OR REPLACE VIEW revenue_by_day AS
SELECT 
    DATE(payment_date) as date,
    COUNT(*) as orders,
    SUM(amount_total) as revenue_cents,
    SUM(amount_total) / 100.0 as revenue_eur,
    ARRAY_AGG(DISTINCT product_name) as products
FROM payments
WHERE status = 'paid'
GROUP BY DATE(payment_date)
ORDER BY date DESC;

-- Create a view for product performance
CREATE OR REPLACE VIEW product_performance AS
SELECT 
    product_name,
    product_id,
    COUNT(*) as units_sold,
    SUM(amount_total) as total_revenue_cents,
    SUM(amount_total) / 100.0 as total_revenue_eur,
    AVG(amount_total) / 100.0 as avg_price_eur,
    MIN(payment_date) as first_sale,
    MAX(payment_date) as last_sale
FROM payments
WHERE status = 'paid'
GROUP BY product_name, product_id
ORDER BY total_revenue_cents DESC;

-- Grant access to service role
GRANT ALL ON payments TO service_role;
GRANT SELECT ON revenue_by_day TO service_role;
GRANT SELECT ON product_performance TO service_role;
