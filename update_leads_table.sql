-- Add exam_date and german_level columns to leads table
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS exam_date DATE,
ADD COLUMN IF NOT EXISTS german_level TEXT CHECK (german_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', NULL));

-- 2. Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads';

-- Expected output: You should see email, first_name, created_at, source, exam_date, german_level
