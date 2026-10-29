drop function if exists public.get_global_leaderboard();

-- Show ALL students (excluding admin/owner) in the global leaderboard, even
-- those who never attempted any exam.  Students with attempts are ranked first
-- (by total score desc, total time asc); students without attempts come after.

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
    from public.best_exam_attempts() f
    group by f.student_id
  )
  select
    case when a.student_id is not null
      then rank() over (
        partition by (a.student_id is not null)
        order by coalesce(a.total_score, 0) desc, coalesce(a.total_seconds, 0) asc
      )
    end as rank,
    p.id,
    p.full_name,
    coalesce(a.exams_count, 0),
    coalesce(a.total_score, 0),
    coalesce(a.total_questions, 0),
    coalesce(a.total_seconds, 0)
  from public.profiles p
  left join agg a on a.student_id = p.id
  where p.role = 'student'
  order by (a.student_id is not null) desc, rank nulls last, p.full_name;
$$;

revoke execute on function public.get_global_leaderboard() from public, anon;
grant execute on function public.get_global_leaderboard() to authenticated;
