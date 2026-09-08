-- Migration Script: Move existing leads to users table
-- Run this in your Supabase SQL Editor

-- 1. Insert all leads from 'leads' table into 'users' table
-- Only insert if email doesn't already exist in users
INSERT INTO users (email, full_name, account_type, created_date, german_level, exam_date)
SELECT 
    l.email,
    COALESCE(l.first_name, 'Lead Subscriber') as full_name,
    'lead' as account_type,
    l.created_at as created_date,
    NULL as german_level,  -- Old leads don't have this data
    NULL as exam_date      -- Old leads don't have this data
FROM leads l
WHERE NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = l.email
);

-- 2. Verify migration
SELECT 
    COUNT(*) as total_lead_magnet_users,
    COUNT(CASE WHEN exam_date IS NULL THEN 1 END) as missing_exam_date,
    COUNT(CASE WHEN german_level IS NULL THEN 1 END) as missing_german_level
FROM users 
WHERE account_type = 'lead';

-- Expected output: Shows how many leads were migrated and how many are missing data
