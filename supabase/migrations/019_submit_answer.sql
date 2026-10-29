-- Grade and save a multiple-choice or true/false answer in one round trip.
-- Runs as the calling student (security invoker), so RLS still applies to every read and write.
-- Returns null for other question types; the app then grades them itself.

create or replace function public.submit_answer(p_attempt uuid, p_question uuid, p_response jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_attempt record;
  v_question record;
  v_row jsonb;
  v_correct boolean;
  v_option jsonb;
begin
  select id, mode into v_attempt
  from public.attempts
  where id = p_attempt and student_id = auth.uid();
  if v_attempt.id is null then
    raise exception 'المحاولة غير موجودة';
  end if;

  select * into v_question from public.questions where id = p_question;
  if v_question.id is null then
    raise exception 'السؤال غير موجود';
  end if;

  -- in_practice / in_exam come from migration 014; read them loosely so this also works without it.
  v_row := to_jsonb(v_question);
  if (v_attempt.mode = 'exam' and coalesce((v_row ->> 'in_exam')::boolean, true) = false)
     or (v_attempt.mode = 'practice' and coalesce((v_row ->> 'in_practice')::boolean, true) = false) then
    raise exception 'السؤال ليس ضمن هذا الوضع';
  end if;

  if v_question.type not in ('mcq', 'true_false') then
    return null;
  end if;

  v_correct := (v_question.content -> 'correct') = p_response;

  insert into public.answers (attempt_id, question_id, response, is_correct, answered_at)
  values (p_attempt, p_question, p_response, v_correct, now())
  on conflict (attempt_id, question_id)
  do update set response = excluded.response, is_correct = excluded.is_correct, answered_at = excluded.answered_at;

  if v_attempt.mode = 'practice' then
    if v_question.type = 'mcq' then
      select o into v_option
      from jsonb_array_elements(v_question.content -> 'options') o
      where o ->> 'id' = p_response #>> '{}'
      limit 1;
    end if;
    return jsonb_build_object(
      'is_correct', v_correct,
      'correct_answer', v_question.content -> 'correct',
      'explanation', v_question.explanation,
      'option_explanation', v_option ->> 'explanation'
    );
  end if;

  return jsonb_build_object('saved', true);
end;
$$;

grant execute on function public.submit_answer(uuid, uuid, jsonb) to authenticated;
