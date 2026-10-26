-- Islamic culture courses (سلم): 8 subjects, each with 12 lessons.
-- Subjects and lessons are published right away.
-- Run once in the Supabase SQL Editor. Subjects that already exist are skipped.

do $$
declare
  v_owner uuid;
  v_subject uuid;
  v_course record;
begin
  select id into v_owner from public.profiles where role = 'owner' order by created_at limit 1;
  if v_owner is null then
    raise exception 'لا يوجد حساب مالك لربط المحتوى به';
  end if;

  for v_course in
    select * from (values
      ('سلم 100', 'دراسات في السيرة النبوية'),
      ('سلم 101', 'أصول الثقافة الإسلامية'),
      ('سلم 102', 'الأسرة في الإسلام'),
      ('سلم 103', 'النظام الاقتصادي الإسلامي'),
      ('سلم 104', 'النظام السياسي الإسلامي'),
      ('سلم 105', 'حقوق الإنسان'),
      ('سلم 106', 'الفقه الطبي'),
      ('سلم 109', 'المرأة ودورها التنموي')
    ) as c(name, description)
  loop
    if exists (select 1 from public.subjects where name = v_course.name) then
      raise notice 'تم تخطي "%" لأنها موجودة مسبقاً', v_course.name;
      continue;
    end if;

    insert into public.subjects (name, name_normalized, description, status, created_by, updated_by)
    values (v_course.name, public.normalize_arabic(v_course.name), v_course.description, 'published', v_owner, v_owner)
    returning id into v_subject;

    insert into public.lessons (subject_id, title, sort_order, status, created_by, updated_by)
    select v_subject, 'الدرس ' || n, n, 'published', v_owner, v_owner
    from generate_series(1, 12) as n;
  end loop;
end $$;

-- Cover images (files in public/covers). Safe to re-run; also covers subjects added earlier.
update public.subjects s
set cover_image = '/covers/salm-' || substring(s.name from '[0-9]+') || '.svg'
where s.name in ('سلم 100', 'سلم 101', 'سلم 102', 'سلم 103', 'سلم 104', 'سلم 105', 'سلم 106', 'سلم 109');
