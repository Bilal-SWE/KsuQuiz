-- Add shuffle settings to lessons
alter table public.lessons
  add column shuffle_questions boolean not null default false,
  add column shuffle_options boolean not null default false;
