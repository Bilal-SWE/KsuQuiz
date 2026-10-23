-- Add unique constraint so upsert works (one answer per question per attempt)
-- First deduplicate any existing rows, keeping the latest
delete from public.answers a
  using public.answers b
  where a.attempt_id = b.attempt_id
    and a.question_id = b.question_id
    and a.answered_at < b.answered_at;

alter table public.answers
  add constraint answers_attempt_question_unique unique (attempt_id, question_id);

-- Add missing delete policy for answers (students can delete their own)
create policy "answers_delete" on public.answers
  for delete using (
    exists (
      select 1 from public.attempts a
      where a.id = attempt_id and a.student_id = auth.uid()
    )
  );
