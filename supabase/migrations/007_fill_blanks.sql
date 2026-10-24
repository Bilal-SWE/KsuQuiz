-- Add the fill-in-the-blanks question type (matching stays valid for existing rows)
alter table public.questions drop constraint if exists questions_type_check;
alter table public.questions
  add constraint questions_type_check
  check (type in ('mcq', 'matching', 'true_false', 'fill_blanks'));
