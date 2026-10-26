-- Subject "عرب 100" with a published lesson on the medial hamza (10 questions).
-- Run once in the Supabase SQL Editor. It stops if the subject already exists.

-- Allow fill-in-the-blanks questions (same as migration 007, safe to re-run)
alter table public.questions drop constraint if exists questions_type_check;
alter table public.questions
  add constraint questions_type_check
  check (type in ('mcq', 'true_false', 'fill_blanks'));

do $$
declare
  v_owner uuid;
  v_subject uuid;
  v_lesson uuid;
begin
  if exists (select 1 from public.subjects where name = 'عرب 100') then
    raise exception 'المادة "عرب 100" موجودة مسبقاً';
  end if;

  select id into v_owner from public.profiles where role = 'owner' order by created_at limit 1;
  if v_owner is null then
    raise exception 'لا يوجد حساب مالك لربط المحتوى به';
  end if;

  insert into public.subjects (name, name_normalized, description, status, created_by, updated_by)
  values (
    'عرب 100',
    public.normalize_arabic('عرب 100'),
    'مهارات الكتابة العربية: قواعد الإملاء ورسم الهمزة.',
    'published',
    v_owner,
    v_owner
  )
  returning id into v_subject;

  insert into public.lessons (subject_id, title, sort_order, status, created_by, updated_by)
  values (v_subject, 'الهمزة المتوسطة', 1, 'published', v_owner, v_owner)
  returning id into v_lesson;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "على أي أساس تُحدَّد صورة كتابة الهمزة المتوسطة؟", "image": null},
    "options": [
      {"id": "a", "text": "حركة الحرف الذي بعدها فقط", "image": null, "explanation": null},
      {"id": "b", "text": "المقارنة بين حركة الهمزة وحركة الحرف الذي قبلها", "image": null, "explanation": null},
      {"id": "c", "text": "نوع الكلمة: اسم أو فعل", "image": null, "explanation": null},
      {"id": "d", "text": "عدد حروف الكلمة", "image": null, "explanation": null}
    ],
    "correct": "b"
  }'::jsonb,
  'نقارن حركة الهمزة بحركة الحرف الذي قبلها، ونكتب الهمزة على الحرف الذي يناسب أقوى الحركتين.', 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما ترتيب الحركات من الأقوى إلى الأضعف عند كتابة الهمزة المتوسطة؟", "image": null},
    "options": [
      {"id": "a", "text": "الفتحة، ثم الضمة، ثم الكسرة، ثم السكون", "image": null, "explanation": null},
      {"id": "b", "text": "الضمة، ثم الكسرة، ثم الفتحة، ثم السكون", "image": null, "explanation": null},
      {"id": "c", "text": "الكسرة، ثم الضمة، ثم الفتحة، ثم السكون", "image": null, "explanation": null},
      {"id": "d", "text": "السكون، ثم الفتحة، ثم الضمة، ثم الكسرة", "image": null, "explanation": null}
    ],
    "correct": "c"
  }'::jsonb,
  'الكسرة أقوى الحركات وتناسبها الياء، ثم الضمة وتناسبها الواو، ثم الفتحة ويناسبها الألف، والسكون أضعفها.', 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "اختر الكتابة الصحيحة للفعل الماضي المبني للمجهول من (سأل):", "image": null},
    "options": [
      {"id": "a", "text": "سُأِل", "image": null, "explanation": "الهمزة مكسورة، والكسرة لا يناسبها الألف."},
      {"id": "b", "text": "سُؤِل", "image": null, "explanation": "الضمة قبل الهمزة أضعف من كسرة الهمزة، فلا تُكتب على الواو."},
      {"id": "c", "text": "سُئِل", "image": null, "explanation": "صحيح: الهمزة مكسورة، والكسرة أقوى من ضمة السين، فتُكتب على الياء."},
      {"id": "d", "text": "سُءِل", "image": null, "explanation": "لا تُكتب الهمزة على السطر هنا."}
    ],
    "correct": "c"
  }'::jsonb,
  'في (سُئِل) الهمزة مكسورة وما قبلها مضموم، والكسرة أقوى فتُكتب على الياء (النبرة).', 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي الكلمات التالية كُتبت الهمزة فيها كتابة صحيحة؟", "image": null},
    "options": [
      {"id": "a", "text": "يَسْئَل", "image": null, "explanation": null},
      {"id": "b", "text": "يَسْأَل", "image": null, "explanation": null},
      {"id": "c", "text": "يَسْؤَل", "image": null, "explanation": null},
      {"id": "d", "text": "يَسْءَل", "image": null, "explanation": null}
    ],
    "correct": "b"
  }'::jsonb,
  'في (يَسْأَل) الهمزة مفتوحة وما قبلها ساكن، والفتحة أقوى من السكون فتُكتب على الألف.', 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "تُكتب الهمزة في كلمة (مُؤْمِن) على الواو لأن:", "image": null},
    "options": [
      {"id": "a", "text": "الهمزة مضمومة", "image": null, "explanation": null},
      {"id": "b", "text": "الهمزة ساكنة وما قبلها مضموم، والضمة أقوى من السكون", "image": null, "explanation": null},
      {"id": "c", "text": "الحرف الذي بعدها مكسور", "image": null, "explanation": null},
      {"id": "d", "text": "الكلمة اسم وليست فعلاً", "image": null, "explanation": null}
    ],
    "correct": "b"
  }'::jsonb,
  'الهمزة في (مُؤْمِن) ساكنة والميم قبلها مضمومة، والضمة أقوى من السكون فتُكتب على الواو.', 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما الكتابة الصحيحة لكلمة البئر (مصدر الماء)؟", "image": null},
    "options": [
      {"id": "a", "text": "بِأْر", "image": null, "explanation": null},
      {"id": "b", "text": "بِؤْر", "image": null, "explanation": null},
      {"id": "c", "text": "بِئْر", "image": null, "explanation": null},
      {"id": "d", "text": "بِءْر", "image": null, "explanation": null}
    ],
    "correct": "c"
  }'::jsonb,
  'الهمزة ساكنة والباء قبلها مكسورة، والكسرة أقوى الحركات فتُكتب على الياء: بِئْر.', 6, v_owner, v_owner),

  (v_lesson, 'true_false', '{
    "question": {"text": "تُكتب الهمزة في كلمة (رَأْس) على الألف لأنها ساكنة وما قبلها مفتوح.", "image": null},
    "correct": true
  }'::jsonb,
  'صحيح: الفتحة أقوى من السكون، والفتحة يناسبها الألف.', 7, v_owner, v_owner),

  (v_lesson, 'true_false', '{
    "question": {"text": "الكتابة الصحيحة هي (مسئلة) وليست (مسألة).", "image": null},
    "correct": false
  }'::jsonb,
  'خطأ: الصواب (مَسْأَلَة)؛ فالهمزة مفتوحة وما قبلها ساكن، والفتحة أقوى فتُكتب على الألف.', 8, v_owner, v_owner),

  (v_lesson, 'true_false', '{
    "question": {"text": "تُكتب الهمزة في كلمة (تَفَاؤُل) على الواو.", "image": null},
    "correct": true
  }'::jsonb,
  'صحيح: الهمزة مضمومة وما قبلها ألف ساكنة، والضمة أقوى من السكون فتُكتب على الواو.', 9, v_owner, v_owner),

  (v_lesson, 'fill_blanks', '{
    "question": {"text": "أكمل قواعد كتابة الهمزة المتوسطة باختيار الكلمة المناسبة:", "image": null},
    "items": [
      {"id": "k3m9x2pa", "raw": "إذا كانت الهمزة أو ما قبلها مكسوراً تُكتب على [الياء]",
       "segments": [{"type": "text", "value": "إذا كانت الهمزة أو ما قبلها مكسوراً تُكتب على "}, {"type": "blank", "id": "b7q1w4zt"}]},
      {"id": "p2n8v5rc", "raw": "إذا كانت الهمزة أو ما قبلها مضموماً ولا كسرة تُكتب على [الواو]",
       "segments": [{"type": "text", "value": "إذا كانت الهمزة أو ما قبلها مضموماً ولا كسرة تُكتب على "}, {"type": "blank", "id": "h6d3j9ym"}]},
      {"id": "t4f7s1qe", "raw": "إذا كانت الهمزة أو ما قبلها مفتوحاً ولا كسرة ولا ضمة تُكتب على [الألف]",
       "segments": [{"type": "text", "value": "إذا كانت الهمزة أو ما قبلها مفتوحاً ولا كسرة ولا ضمة تُكتب على "}, {"type": "blank", "id": "r8c2x6nu"}]}
    ],
    "words": [
      {"id": "w5g8k1lo", "text": "الواو"},
      {"id": "z3v7b2ma", "text": "السطر"},
      {"id": "e9h4n6py", "text": "الألف"},
      {"id": "u1x5c8dq", "text": "الياء"}
    ],
    "correct": {"b7q1w4zt": "الياء", "h6d3j9ym": "الواو", "r8c2x6nu": "الألف"},
    "distractors": ["السطر"]
  }'::jsonb,
  'الكسرة يناسبها الياء، والضمة تناسبها الواو، والفتحة يناسبها الألف، وتُقدَّم الحركة الأقوى دائماً.', 10, v_owner, v_owner);

  raise notice 'تمت إضافة مادة عرب 100 ودرس الهمزة المتوسطة (10 أسئلة)';
end $$;
