-- Run this in your Supabase SQL Editor

-- 1. Create the leads table
create table leads (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  first_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  source text default 'website'
);

-- 2. Enable Row Level Security (RLS)
alter table leads enable row level security;

-- 3. Create a policy that allows the anon role (website) to INSERT new rows
create policy "Allow anonymous inserts"
on leads
for insert
to anon
with check (true);

-- 4. Create a policy that allows only service_role (backend) to SELECT/VIEW (keep leads private)
create policy "Allow service role to view"
on leads
for select
to service_role
using (true);

-- Optional: Allow anon to view their own leads (not recommended normally for a simple lead form unless auth is used)
-- For now, keep it write-only for public.
