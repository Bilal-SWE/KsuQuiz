-- Number of questions in each subject's published lessons, for the counter on subject cards.

create or replace function public.subject_question_counts()
returns table (subject_id uuid, question_count bigint)
language sql stable security definer set search_path = '' as $$
  select l.subject_id, count(q.id)
  from public.lessons l
  join public.questions q on q.lesson_id = l.id
  where l.status = 'published'
  group by l.subject_id;
$$;

grant execute on function public.subject_question_counts() to authenticated;
