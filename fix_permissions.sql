-- FIX PERMISSIONS SCRIPT
-- Run this in Supabase SQL Editor to unblock the "42501" error.

-- 1. First, verify the table exists (this won't error if it exists)
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  first_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  source text default 'website'
);

-- 2. Enable RLS (Security)
alter table leads enable row level security;

-- 3. DROP existing policies to clear any bad configuration
drop policy if exists "Allow anonymous inserts" on leads;
drop policy if exists "Allow service role to view" on leads;
drop policy if exists "Enable insert for anon" on leads;
drop policy if exists "Enable read for service_role" on leads;

-- 4. RE-CREATE the Insert Policy (Allows "anon" / website users to add rows)
create policy "Enable insert for anon"
on leads
for insert
to anon
with check (true);

-- 5. RE-CREATE the View Policy (Allows "service_role" / backend to see rows)
create policy "Enable read for service_role"
on leads
for select
to service_role
using (true);

-- 6. CRITICAL: Grant actual INSERT permission to the anon role (sometimes missed)
grant insert on table leads to anon;
grant select on table leads to anon; -- Needed for the unique email check
