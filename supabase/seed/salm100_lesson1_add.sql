-- سلم 100, lesson 1: add the 10 questions of "مفهوم السيرة النبوية ومصادرها، وحال العرب قبل البعثة"
-- next to the questions already in the lesson. A question whose text is already there is
-- skipped, so running this twice adds nothing new.

do $$
declare
  v_owner uuid;
  v_lesson uuid;
  v_order int;
  v_added int := 0;
begin
  select id into v_owner from public.profiles where role = 'owner' order by created_at limit 1;
  if v_owner is null then
    raise exception 'لا يوجد حساب مالك لربط المحتوى به';
  end if;

  select l.id into v_lesson
  from public.lessons l
  join public.subjects s on s.id = l.subject_id
  where s.name = 'سلم 100' and l.sort_order = 1
  order by l.created_at limit 1;
  if v_lesson is null then
    raise exception 'لم يُعثر على الدرس 1 في المادة "سلم 100"';
  end if;

  select coalesce(max(sort_order), 0) into v_order from public.questions where lesson_id = v_lesson;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$السيرة في الاصطلاح هي:$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"السيرة في الاصطلاح هي:","image":null},"options":[{"id":"a","text":"قصص الأولين وتاريخهم","image":null,"explanation":null},{"id":"b","text":"ذكر أحداث حياة الرسول ﷺ من مولده إلى وفاته مرتبة زمنياً","image":null,"explanation":null},{"id":"c","text":"الطريقة والهيئة التي يكون عليها الإنسان","image":null,"explanation":null},{"id":"d","text":"أخبار المعارك والفتوحات الإسلامية","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$السيرة اصطلاحاً: ما يتعلق بحياة النبي ﷺ وأحداثها من مولده إلى وفاته مرتبة ترتيباً زمنياً، أما «الطريقة والهيئة» فهو معناها اللغوي.$e$, v_order + 1, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$أي من الكتب التالية يُعد من المصادر التكميلية للسيرة النبوية؟$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"أي من الكتب التالية يُعد من المصادر التكميلية للسيرة النبوية؟","image":null},"options":[{"id":"a","text":"القرآن الكريم","image":null,"explanation":null},{"id":"b","text":"كتب الحديث الشريف","image":null,"explanation":null},{"id":"c","text":"كتب التراجم والطبقات الخاصة بالصحابة","image":null,"explanation":null},{"id":"d","text":"كتب دلائل النبوة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$القرآن والحديث وكتب الدلائل من المصادر الأصلية، وكتب التراجم والطبقات مصادر تكميلية تضيف تفاصيل عن الصحابة والأحداث.$e$, v_order + 2, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$الصنم الذي كان أعظم أصنام الكعبة وهو تمثال من العقيق الأحمر:$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"الصنم الذي كان أعظم أصنام الكعبة وهو تمثال من العقيق الأحمر:","image":null},"options":[{"id":"a","text":"اللات","image":null,"explanation":null},{"id":"b","text":"هُبَل","image":null,"explanation":null},{"id":"c","text":"العُزَّى","image":null,"explanation":null},{"id":"d","text":"مناة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$هُبَل أعظم أصنام قريش في جوف الكعبة، وكان من العقيق الأحمر على صورة إنسان.$e$, v_order + 3, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$ما هو (المِرباع) الذي كان يُعطى لزعيم القبيلة في الجاهلية؟$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"ما هو (المِرباع) الذي كان يُعطى لزعيم القبيلة في الجاهلية؟","image":null},"options":[{"id":"a","text":"ما يصطفيه لنفسه قبل القسمة","image":null,"explanation":null},{"id":"b","text":"ما أصيب من مال العدو قبل اللقاء","image":null,"explanation":null},{"id":"c","text":"ربع الغنيمة","image":null,"explanation":null},{"id":"d","text":"ما لا يقبل القسمة من الغنيمة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$المرباع ربع الغنيمة يأخذه الرئيس، أما ما يصطفيه لنفسه فهو «الصفايا».$e$, v_order + 4, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$كم دامت حرب البسوس بين بكر وتغلب في الجاهلية؟$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"كم دامت حرب البسوس بين بكر وتغلب في الجاهلية؟","image":null},"options":[{"id":"a","text":"عشرين عاماً","image":null,"explanation":null},{"id":"b","text":"ثلاثين عاماً","image":null,"explanation":null},{"id":"c","text":"أربعين عاماً","image":null,"explanation":null},{"id":"d","text":"خمسين عاماً","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$استمرت حرب البسوس بين بكر وتغلب نحو أربعين عاماً.$e$, v_order + 5, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$أول من سَيَّب السوائب وأدخل عبادة الأصنام إلى العرب هو:$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"أول من سَيَّب السوائب وأدخل عبادة الأصنام إلى العرب هو:","image":null},"options":[{"id":"a","text":"قصي بن كلاب","image":null,"explanation":null},{"id":"b","text":"قس بن ساعدة الإيادي","image":null,"explanation":null},{"id":"c","text":"زيد بن عمرو بن نفيل","image":null,"explanation":null},{"id":"d","text":"عمرو بن لحي الخزاعي","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$عمرو بن لحي الخزاعي أول من غيّر دين إبراهيم، فجلب الأصنام وسيّب السوائب.$e$, v_order + 6, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$من هو الذي جمع قريشاً في مكة وبنى دار الندوة؟$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"من هو الذي جمع قريشاً في مكة وبنى دار الندوة؟","image":null},"options":[{"id":"a","text":"عبد المطلب بن هاشم","image":null,"explanation":null},{"id":"b","text":"هاشم بن عبد مناف","image":null,"explanation":null},{"id":"c","text":"قصي بن كلاب","image":null,"explanation":null},{"id":"d","text":"عمرو بن عامر","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قصي بن كلاب جمع قريشاً في مكة فسُمّي «مُجمِّعاً»، وبنى دار الندوة للتشاور.$e$, v_order + 7, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$القبيلة التي استحلت حرمة البيت وظلموا فيه فسلط الله عليهم خزاعة فأخرجوهم هي:$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"القبيلة التي استحلت حرمة البيت وظلموا فيه فسلط الله عليهم خزاعة فأخرجوهم هي:","image":null},"options":[{"id":"a","text":"ثقيف","image":null,"explanation":null},{"id":"b","text":"كنانة","image":null,"explanation":null},{"id":"c","text":"جُرهم","image":null,"explanation":null},{"id":"d","text":"تغلب","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$جُرهم ولاة البيت بعد إسماعيل، بغوا فيه واستحلوا حرمته فأخرجتهم خزاعة.$e$, v_order + 8, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$ماذا كان يعبد الأوس والخزرج ويعظمونه أشد الإعظام قبل الإسلام؟$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"ماذا كان يعبد الأوس والخزرج ويعظمونه أشد الإعظام قبل الإسلام؟","image":null},"options":[{"id":"a","text":"اللات","image":null,"explanation":null},{"id":"b","text":"العزى","image":null,"explanation":null},{"id":"c","text":"مناة","image":null,"explanation":null},{"id":"d","text":"هبل","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$كانت مناة بالمشلل قرب قديد، وكان الأوس والخزرج يعظمونها ويهلّون لها.$e$, v_order + 9, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  if not exists (select 1 from public.questions where lesson_id = v_lesson and content->'question'->>'text' = $q$من هم "الحنفاء" قبل ظهور الإسلام؟$q$) then
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by)
    values (v_lesson, 'mcq', $j${"question":{"text":"من هم \"الحنفاء\" قبل ظهور الإسلام؟","image":null},"options":[{"id":"a","text":"فئة أنكروا الأوثان وعبدوا الله على دين إبراهيم عليه السلام","image":null,"explanation":null},{"id":"b","text":"كهنة العرب الذين يتنبؤون بالمستقبل","image":null,"explanation":null},{"id":"c","text":"زعماء القبائل الكبرى","image":null,"explanation":null},{"id":"d","text":"سدنة الكعبة وحراسها","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$الحنفاء قلة اعتزلوا عبادة الأوثان وبقوا على التوحيد، مثل زيد بن عمرو بن نفيل وورقة بن نوفل.$e$, v_order + 10, v_owner, v_owner);
    v_added := v_added + 1;
  end if;

  raise notice 'أُضيف % سؤال إلى الدرس', v_added;
end $$;
