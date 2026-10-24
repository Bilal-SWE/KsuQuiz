-- Leaderboards count only each student's FIRST finished exam attempt per lesson,
-- so retaking a memorized exam never improves rank.

create index if not exists attempts_lesson_mode_finished_idx
  on public.attempts (lesson_id, mode, finished_at);

create or replace function public.first_exam_attempts()
returns table (
  student_id uuid,
  lesson_id uuid,
  score int,
  total int,
  duration_seconds int,
  finished_at timestamptz
)
language sql stable security definer set search_path = '' as $$
  select distinct on (a.student_id, a.lesson_id)
    a.student_id,
    a.lesson_id,
    coalesce(a.score, 0),
    coalesce(a.total, 0),
    greatest(0, extract(epoch from (a.finished_at - a.started_at)))::int,
    a.finished_at
  from public.attempts a
  join public.profiles p on p.id = a.student_id and p.role = 'student'
  join public.lessons l on l.id = a.lesson_id and l.status = 'published'
  where a.mode = 'exam' and a.finished_at is not null
  order by a.student_id, a.lesson_id, a.finished_at asc;
$$;

revoke execute on function public.first_exam_attempts() from public, anon, authenticated;

create or replace function public.get_lesson_leaderboard(p_lesson_id uuid)
returns table (
  rank bigint,
  student_id uuid,
  full_name text,
  score int,
  total int,
  duration_seconds int
)
language sql stable security definer set search_path = '' as $$
  select
    rank() over (order by f.score desc, f.duration_seconds asc),
    f.student_id,
    p.full_name,
    f.score,
    f.total,
    f.duration_seconds
  from public.first_exam_attempts() f
  join public.profiles p on p.id = f.student_id
  where f.lesson_id = p_lesson_id
  order by 1, p.full_name;
$$;

create or replace function public.get_global_leaderboard()
returns table (
  rank bigint,
  student_id uuid,
  full_name text,
  exams_count bigint,
  total_score bigint,
  total_questions bigint,
  total_seconds bigint
)
language sql stable security definer set search_path = '' as $$
  with agg as (
    select
      f.student_id,
      count(*) as exams_count,
      sum(f.score) as total_score,
      sum(f.total) as total_questions,
      sum(f.duration_seconds) as total_seconds
    from public.first_exam_attempts() f
    group by f.student_id
  )
  select
    rank() over (order by a.total_score desc, a.total_seconds asc),
    a.student_id,
    p.full_name,
    a.exams_count,
    a.total_score,
    a.total_questions,
    a.total_seconds
  from agg a
  join public.profiles p on p.id = a.student_id
  order by 1, p.full_name;
$$;

revoke execute on function public.get_lesson_leaderboard(uuid) from public, anon;
revoke execute on function public.get_global_leaderboard() from public, anon;
grant execute on function public.get_lesson_leaderboard(uuid) to authenticated;
grant execute on function public.get_global_leaderboard() to authenticated;
