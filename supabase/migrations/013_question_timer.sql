  -- Seconds allowed per question in exam mode (set per lesson by the admin).
  alter table public.lessons
    add column if not exists question_seconds int not null default 60
    check (question_seconds between 10 and 600);
