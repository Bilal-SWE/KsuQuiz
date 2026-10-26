-- Remove the matching question type entirely.
-- Deleting the questions also deletes their saved answers (answers.question_id cascades).
delete from public.questions where type = 'matching';

alter table public.questions drop constraint if exists questions_type_check;
alter table public.questions
  add constraint questions_type_check
  check (type in ('mcq', 'true_false', 'fill_blanks'));
