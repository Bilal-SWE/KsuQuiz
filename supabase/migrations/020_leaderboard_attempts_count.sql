drop function if exists public.get_lesson_leaderboard(uuid);

-- Show ALL students (excluding admin/owner) in the lesson leaderboard, even
-- those who never attempted the exam.  Students with attempts are ranked first
-- (by score desc, time asc); students without attempts come after with no rank.

create or replace function public.get_lesson_leaderboard(p_lesson_id uuid)
returns table (
  rank bigint,
  student_id uuid,
  full_name text,
  score int,
  total int,
  duration_seconds int,
  attempt_count bigint
)
language sql stable security definer set search_path = '' as $$
  select
    case when f.student_id is not null
      then rank() over (
        partition by (f.student_id is not null)
        order by coalesce(f.score, 0) desc, coalesce(f.duration_seconds, 0) asc
      )
    end as rank,
    p.id,
    p.full_name,
    coalesce(f.score, 0),
    coalesce(f.total, 0),
    coalesce(f.duration_seconds, 0),
    (
      select count(*)
      from public.attempts a
      where a.student_id = p.id
        and a.lesson_id = p_lesson_id
        and a.mode = 'exam'
        and a.finished_at is not null
    )
  from public.profiles p
  left join public.best_exam_attempts() f
    on f.student_id = p.id and f.lesson_id = p_lesson_id
  where p.role = 'student'
  order by (f.student_id is not null) desc, rank nulls last, p.full_name;
$$;

revoke execute on function public.get_lesson_leaderboard(uuid) from public, anon;
grant execute on function public.get_lesson_leaderboard(uuid) to authenticated;
