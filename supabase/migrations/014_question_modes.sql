-- Which mode each question appears in. Existing questions stay in both,
-- so current lessons behave exactly as before.
alter table public.questions
  add column if not exists in_practice boolean not null default true,
  add column if not exists in_exam boolean not null default true;

alter table public.questions drop constraint if exists questions_in_some_mode;
alter table public.questions
  add constraint questions_in_some_mode check (in_practice or in_exam);
