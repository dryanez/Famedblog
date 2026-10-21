create table if not exists public.guide_requests (
 id uuid primary key default gen_random_uuid(),
 email text not null,
 first_name text not null,
 locale text not null check (locale in ('en','ar','es')),
 marketing_requested boolean not null default false,
 consent_version text not null default 'guide-editorial-v1-20261021',
 consent_text text,
 token_hash text unique,
 created_at timestamptz not null default now(),
 confirmed_at timestamptz,
 withdrawn_at timestamptz,
 provider_message_id text
);
alter table public.guide_requests enable row level security;
revoke all on public.guide_requests from anon, authenticated;
grant all on public.guide_requests to service_role;
create index if not exists guide_requests_email_created on public.guide_requests(email,created_at desc);

alter table public.guide_requests add column if not exists editorial_eligible boolean not null default false;

alter table public.guide_requests add column if not exists guide_token_hash text unique;
