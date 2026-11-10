-- Guide requests in every site language (emails + guide-ready page in the reader's language).
alter table public.guide_requests drop constraint if exists guide_requests_locale_check;
alter table public.guide_requests add constraint guide_requests_locale_check check (locale in ('en','ar','es','de','ru','fr','tr'));
