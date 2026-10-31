-- Allow 'soon' status on subjects (mirrors lessons which already support it).
alter table public.subjects drop constraint if exists subjects_status_check;
alter table public.subjects add constraint subjects_status_check check (status in ('draft', 'published', 'soon'));
