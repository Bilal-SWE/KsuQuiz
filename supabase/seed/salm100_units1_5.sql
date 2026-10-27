-- سلم 100 (دراسات في السيرة النبوية): the first five units, 10 questions each.
-- Units go into lessons 1-5 of the subject (renamed to the unit titles and published).
-- Option order is shuffled for these lessons, since most correct answers are option ج.
-- Run in the Supabase SQL Editor. A lesson that already has questions is skipped, so
-- running it twice does not duplicate anything. Answers and explanations were written
-- for review: check them before students rely on them.

do $$
declare
  v_owner uuid;
  v_subject uuid;
  v_lesson uuid;
begin
  select id into v_owner from public.profiles where role = 'owner' order by created_at limit 1;
  if v_owner is null then
    raise exception 'لا يوجد حساب مالك لربط المحتوى به';
  end if;

  select id into v_subject from public.subjects where name = 'سلم 100' limit 1;
  if v_subject is null then
    raise exception 'المادة "سلم 100" غير موجودة، شغّل ملف islamic_culture_courses.sql أولاً';
  end if;

  -- Unit 1
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 1
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$مفهوم السيرة النبوية ومصادرها، وحال العرب قبل البعثة$t$, 1, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$مفهوم السيرة النبوية ومصادرها، وحال العرب قبل البعثة$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 1: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"السيرة في الاصطلاح هي:","image":null},"options":[{"id":"a","text":"قصص الأولين وتاريخهم","image":null,"explanation":null},{"id":"b","text":"ذكر أحداث حياة الرسول ﷺ من مولده إلى وفاته مرتبة زمنياً","image":null,"explanation":null},{"id":"c","text":"الطريقة والهيئة التي يكون عليها الإنسان","image":null,"explanation":null},{"id":"d","text":"أخبار المعارك والفتوحات الإسلامية","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$السيرة اصطلاحاً: ما يتعلق بحياة النبي ﷺ وأحداثها من مولده إلى وفاته مرتبة ترتيباً زمنياً، أما «الطريقة والهيئة» فهو معناها اللغوي.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"أي من الكتب التالية يُعد من المصادر التكميلية للسيرة النبوية؟","image":null},"options":[{"id":"a","text":"القرآن الكريم","image":null,"explanation":null},{"id":"b","text":"كتب الحديث الشريف","image":null,"explanation":null},{"id":"c","text":"كتب التراجم والطبقات الخاصة بالصحابة","image":null,"explanation":null},{"id":"d","text":"كتب دلائل النبوة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$القرآن والحديث وكتب الدلائل من المصادر الأصلية، وكتب التراجم والطبقات مصادر تكميلية تضيف تفاصيل عن الصحابة والأحداث.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الصنم الذي كان أعظم أصنام الكعبة وهو تمثال من العقيق الأحمر:","image":null},"options":[{"id":"a","text":"اللات","image":null,"explanation":null},{"id":"b","text":"هُبَل","image":null,"explanation":null},{"id":"c","text":"العُزَّى","image":null,"explanation":null},{"id":"d","text":"مناة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$هُبَل أعظم أصنام قريش في جوف الكعبة، وكان من العقيق الأحمر على صورة إنسان.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"ما هو (المِرباع) الذي كان يُعطى لزعيم القبيلة في الجاهلية؟","image":null},"options":[{"id":"a","text":"ما يصطفيه لنفسه قبل القسمة","image":null,"explanation":null},{"id":"b","text":"ما أصيب من مال العدو قبل اللقاء","image":null,"explanation":null},{"id":"c","text":"ربع الغنيمة","image":null,"explanation":null},{"id":"d","text":"ما لا يقبل القسمة من الغنيمة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$المرباع ربع الغنيمة يأخذه الرئيس، أما ما يصطفيه لنفسه فهو «الصفايا».$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"كم دامت حرب البسوس بين بكر وتغلب في الجاهلية؟","image":null},"options":[{"id":"a","text":"عشرين عاماً","image":null,"explanation":null},{"id":"b","text":"ثلاثين عاماً","image":null,"explanation":null},{"id":"c","text":"أربعين عاماً","image":null,"explanation":null},{"id":"d","text":"خمسين عاماً","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$استمرت حرب البسوس بين بكر وتغلب نحو أربعين عاماً.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"أول من سَيَّب السوائب وأدخل عبادة الأصنام إلى العرب هو:","image":null},"options":[{"id":"a","text":"قصي بن كلاب","image":null,"explanation":null},{"id":"b","text":"قس بن ساعدة الإيادي","image":null,"explanation":null},{"id":"c","text":"زيد بن عمرو بن نفيل","image":null,"explanation":null},{"id":"d","text":"عمرو بن لحي الخزاعي","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$عمرو بن لحي الخزاعي أول من غيّر دين إبراهيم، فجلب الأصنام وسيّب السوائب.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من هو الذي جمع قريشاً في مكة وبنى دار الندوة؟","image":null},"options":[{"id":"a","text":"عبد المطلب بن هاشم","image":null,"explanation":null},{"id":"b","text":"هاشم بن عبد مناف","image":null,"explanation":null},{"id":"c","text":"قصي بن كلاب","image":null,"explanation":null},{"id":"d","text":"عمرو بن عامر","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قصي بن كلاب جمع قريشاً في مكة فسُمّي «مُجمِّعاً»، وبنى دار الندوة للتشاور.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"القبيلة التي استحلت حرمة البيت وظلموا فيه فسلط الله عليهم خزاعة فأخرجوهم هي:","image":null},"options":[{"id":"a","text":"ثقيف","image":null,"explanation":null},{"id":"b","text":"كنانة","image":null,"explanation":null},{"id":"c","text":"جُرهم","image":null,"explanation":null},{"id":"d","text":"تغلب","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$جُرهم ولاة البيت بعد إسماعيل، بغوا فيه واستحلوا حرمته فأخرجتهم خزاعة.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"ماذا كان يعبد الأوس والخزرج ويعظمونه أشد الإعظام قبل الإسلام؟","image":null},"options":[{"id":"a","text":"اللات","image":null,"explanation":null},{"id":"b","text":"العزى","image":null,"explanation":null},{"id":"c","text":"مناة","image":null,"explanation":null},{"id":"d","text":"هبل","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$كانت مناة بالمشلل قرب قديد، وكان الأوس والخزرج يعظمونها ويهلّون لها.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من هم \"الحنفاء\" قبل ظهور الإسلام؟","image":null},"options":[{"id":"a","text":"فئة أنكروا الأوثان وعبدوا الله على دين إبراهيم عليه السلام","image":null,"explanation":null},{"id":"b","text":"كهنة العرب الذين يتنبؤون بالمستقبل","image":null,"explanation":null},{"id":"c","text":"زعماء القبائل الكبرى","image":null,"explanation":null},{"id":"d","text":"سدنة الكعبة وحراسها","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$الحنفاء قلة اعتزلوا عبادة الأوثان وبقوا على التوحيد، مثل زيد بن عمرو بن نفيل وورقة بن نوفل.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 2
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 2
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$مراحل حياته الأولى، وما سبقها من مبشرات$t$, 2, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$مراحل حياته الأولى، وما سبقها من مبشرات$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 2: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"أين كان الراهب الذي أوصى سلمان الفارسي رضي الله عنه باتباع النبي المبعوث؟","image":null},"options":[{"id":"a","text":"في بصرى","image":null,"explanation":null},{"id":"b","text":"في عمورية","image":null,"explanation":null},{"id":"c","text":"في نجران","image":null,"explanation":null},{"id":"d","text":"في خيبر","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$آخر من صحبهم سلمان راهب عمورية، فأخبره بنبي يُبعث بأرض ذات نخل وأوصاه باتباعه.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"يلتقي نسب النبي ﷺ من جهة أبيه وأمه في جده:","image":null},"options":[{"id":"a","text":"عبد مناف","image":null,"explanation":null},{"id":"b","text":"لؤي","image":null,"explanation":null},{"id":"c","text":"كلاب بن مُرَّة","image":null,"explanation":null},{"id":"d","text":"مضر","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$أمه آمنة بنت وهب بن عبد مناف بن زهرة بن كلاب، فيلتقي نسبها بنسب أبيه في كلاب بن مرة.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"يوم وشهر ولادة النبي ﷺ المشهور عند كُتاب السيرة هو:","image":null},"options":[{"id":"a","text":"الجمعة 12 ربيع الأول","image":null,"explanation":null},{"id":"b","text":"الاثنين 12 ربيع الأول","image":null,"explanation":null},{"id":"c","text":"الاثنين 9 ربيع الأول","image":null,"explanation":null},{"id":"d","text":"الخميس 12 ربيع الأول","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$المشهور عند أهل السيرة أنه وُلد يوم الاثنين الثاني عشر من ربيع الأول عام الفيل، وولادته يوم الاثنين ثابتة في صحيح مسلم.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"أول من أرضع النبي ﷺ بعد أمه هي:","image":null},"options":[{"id":"a","text":"ثويبة مولاة أبي لهب","image":null,"explanation":null},{"id":"b","text":"حليمة السعدية","image":null,"explanation":null},{"id":"c","text":"أم أيمن","image":null,"explanation":null},{"id":"d","text":"آمنة بنت وهب","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$أرضعته ثويبة مولاة أبي لهب أياماً، ثم استُرضع في بني سعد عند حليمة السعدية.$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"وقعت حادثة شق الصدر الأولى في بادية بني سعد وكان عمر النبي ﷺ حينها:","image":null},"options":[{"id":"a","text":"سنتين","image":null,"explanation":null},{"id":"b","text":"ثلاث سنوات","image":null,"explanation":null},{"id":"c","text":"أربع سنوات","image":null,"explanation":null},{"id":"d","text":"خمس سنوات","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$وقعت حادثة شق الصدر الأولى وهو في بني سعد في نحو الرابعة من عمره.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"ما معنى (سنة شهباء) في قصة إرضاع حليمة للنبي ﷺ؟","image":null},"options":[{"id":"a","text":"سنة كثيرة الأمطار","image":null,"explanation":null},{"id":"b","text":"سنة قحط وجدب لا خضرة فيها","image":null,"explanation":null},{"id":"c","text":"سنة انتشرت فيها الأمراض","image":null,"explanation":null},{"id":"d","text":"سنة مليئة بالحروب","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$السنة الشهباء سنة القحط والجدب، سُمّيت بذلك لبياض الأرض فيها وخلوها من الخضرة.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"مَن الصحابي الذي روى قصة شق صدر النبي ﷺ عندما كان يلعب مع الغلمان؟","image":null},"options":[{"id":"a","text":"عبدالله بن عباس","image":null,"explanation":null},{"id":"b","text":"أنس بن مالك رضي الله عنه","image":null,"explanation":null},{"id":"c","text":"أبو هريرة","image":null,"explanation":null},{"id":"d","text":"علي بن أبي طالب","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$روى مسلم في صحيحه عن أنس بن مالك رضي الله عنه أن جبريل أتى النبي ﷺ وهو يلعب مع الغلمان فشق صدره.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"سُمّي عام ولادة النبي ﷺ بعام الفيل؛ لأن:","image":null},"options":[{"id":"a","text":"قريشاً استخدمت الفيلة في تجارتها","image":null,"explanation":null},{"id":"b","text":"أبرهة الأشرم غزا مكة بفيل لهدم الكعبة","image":null,"explanation":null},{"id":"c","text":"الفيلة كثرت في جزيرة العرب","image":null,"explanation":null},{"id":"d","text":"العرب اتخذوا الفيل صنماً للعبادة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$في ذلك العام جاء أبرهة الأشرم بجيشه ومعه الفيل لهدم الكعبة، فأهلكه الله كما في سورة الفيل.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"ما هو الاسم القديم لمكة المكرمة المذكور في حادثة الجبابرة؟","image":null},"options":[{"id":"a","text":"بكة (لأنها تبك أعناق الجبابرة)","image":null,"explanation":null},{"id":"b","text":"البطحاء","image":null,"explanation":null},{"id":"c","text":"أم القرى","image":null,"explanation":null},{"id":"d","text":"البلد الأمين","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$من أسمائها «بكة» لأنها تبك أعناق الجبابرة، أي تدقها، فلا يقصدها جبار بسوء إلا قصمه الله.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من الذي سماه \"محمداً\" يوم سابعه؟","image":null},"options":[{"id":"a","text":"أمه آمنة","image":null,"explanation":null},{"id":"b","text":"عمه أبو طالب","image":null,"explanation":null},{"id":"c","text":"جده عبد المطلب","image":null,"explanation":null},{"id":"d","text":"عمه حمزة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$سمّاه جده عبد المطلب «محمداً» يوم سابعه، رجاء أن يُحمد في السماء والأرض.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 3
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 3
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$حياته من الطفولة إلى البعثة$t$, 3, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$حياته من الطفولة إلى البعثة$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 3: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"توفيت أم النبي ﷺ آمنة بنت وهب في منطقة بين مكة والمدينة تُسمى:","image":null},"options":[{"id":"a","text":"بدر","image":null,"explanation":null},{"id":"b","text":"يثرب","image":null,"explanation":null},{"id":"c","text":"الأبواء","image":null,"explanation":null},{"id":"d","text":"الجحفة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$توفيت آمنة بالأبواء وهي عائدة من زيارة أخوال عبد المطلب بيثرب، والنبي ﷺ ابن ست سنين.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"كم كان عمر النبي ﷺ عندما توفي جده عبد المطلب؟","image":null},"options":[{"id":"a","text":"ست سنين","image":null,"explanation":null},{"id":"b","text":"سبع سنين","image":null,"explanation":null},{"id":"c","text":"ثماني سنين","image":null,"explanation":null},{"id":"d","text":"عشر سنين","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$توفي عبد المطلب والنبي ﷺ ابن ثماني سنين، فكفله عمه أبو طالب.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"حاضنة النبي ﷺ ومولاته التي عادت به إلى مكة بعد وفاة أمه هي:","image":null},"options":[{"id":"a","text":"حليمة السعدية","image":null,"explanation":null},{"id":"b","text":"ثويبة","image":null,"explanation":null},{"id":"c","text":"أم أيمن (بركة بنت ثعلبة)","image":null,"explanation":null},{"id":"d","text":"فاطمة بنت أسد","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$أم أيمن بركة الحبشية حاضنته، رجعت به إلى مكة بعد وفاة أمه بالأبواء.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"ما هي الحكمة من رعي الأنبياء للغنم؟","image":null},"options":[{"id":"a","text":"كسب المال الوفير","image":null,"explanation":null},{"id":"b","text":"تقوية الأبدان على السفر","image":null,"explanation":null},{"id":"c","text":"اكتساب الحلم والشفقة والصبر لتربية الأمة","image":null,"explanation":null},{"id":"d","text":"التعرف على طرق القوافل","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$رعي الغنم يعوّد على الصبر والحلم والشفقة وحسن السياسة، وهي صفات يحتاجها من يقود الأمة.$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"مَن هو شريك النبي ﷺ في التجارة بمكة والذي شهد له بالأمانة وحسن التعامل؟","image":null},"options":[{"id":"a","text":"ميسرة","image":null,"explanation":null},{"id":"b","text":"أبو بكر الصديق","image":null,"explanation":null},{"id":"c","text":"السائب بن أبي السائب","image":null,"explanation":null},{"id":"d","text":"عثمان بن عفان","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قال السائب بن أبي السائب للنبي ﷺ: «كنت شريكي في الجاهلية فكنت خير شريك، لا تداريني ولا تماريني».$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"تزوج النبي ﷺ خديجة بنت خويلد رضي الله عنها وكان عمره حينها:","image":null},"options":[{"id":"a","text":"20 سنة","image":null,"explanation":null},{"id":"b","text":"25 سنة","image":null,"explanation":null},{"id":"c","text":"30 سنة","image":null,"explanation":null},{"id":"d","text":"40 سنة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$تزوجها وهو في الخامسة والعشرين بعد عودته من تجارتها إلى الشام.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"شارك النبي ﷺ أعمامه في حرب الفجار وكان دوره:","image":null},"options":[{"id":"a","text":"القيادة العسكرية","image":null,"explanation":null},{"id":"b","text":"المبارزة بالسيف","image":null,"explanation":null},{"id":"c","text":"ينبل عن أعمامه (يرد عنهم النبل)","image":null,"explanation":null},{"id":"d","text":"علاج الجرحى","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قال ﷺ: «كنت أنبل على أعمامي»، أي يجهّز لهم النبل ويرد عنهم نبل العدو.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الحلف الذي عُقد في الجاهلية لنصرة المظلوم وشارك فيه النبي ﷺ هو:","image":null},"options":[{"id":"a","text":"حلف المطيبين","image":null,"explanation":null},{"id":"b","text":"حلف الأحابيش","image":null,"explanation":null},{"id":"c","text":"حلف الفضول","image":null,"explanation":null},{"id":"d","text":"حلف المخزوميين","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$حلف الفضول تعاهدت فيه بطون من قريش على نصرة المظلوم، وقال عنه ﷺ: «لو أُدعى به في الإسلام لأجبت».$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"في أي دار اجتمعت قريش لعقد حلف الفضول؟","image":null},"options":[{"id":"a","text":"دار الندوة","image":null,"explanation":null},{"id":"b","text":"دار الأرقم بن أبي الأرقم","image":null,"explanation":null},{"id":"c","text":"دار عبد الله بن جدعان","image":null,"explanation":null},{"id":"d","text":"دار أبي سفيان","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$عُقد حلف الفضول في دار عبد الله بن جدعان التيمي لشرفه وسنّه.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"كم كان عمر النبي ﷺ عندما شارك في تجديد بناء الكعبة ووضع الحجر الأسود؟","image":null},"options":[{"id":"a","text":"25 عاماً","image":null,"explanation":null},{"id":"b","text":"30 عاماً","image":null,"explanation":null},{"id":"c","text":"35 عاماً","image":null,"explanation":null},{"id":"d","text":"40 عاماً","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$جدّدت قريش بناء الكعبة والنبي ﷺ ابن خمس وثلاثين سنة، وحكّموه في وضع الحجر الأسود.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 4
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 4
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$بعثة النبي وبدايات الدعوة في العهد المكي$t$, 4, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$بعثة النبي وبدايات الدعوة في العهد المكي$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 4: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"أول ما بُدئ به النبي ﷺ من الوحي هو:","image":null},"options":[{"id":"a","text":"تكليم الملائكة له مباشرة","image":null,"explanation":null},{"id":"b","text":"الرؤيا الصادقة في النوم","image":null,"explanation":null},{"id":"c","text":"الإلهام في القلب","image":null,"explanation":null},{"id":"d","text":"سماع الأصوات من السماء","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$قالت عائشة رضي الله عنها: «أول ما بُدئ به رسول الله ﷺ من الوحي الرؤيا الصالحة في النوم، فكان لا يرى رؤيا إلا جاءت مثل فلق الصبح».$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"أول من آمن بالنبي ﷺ من الرجال هو:","image":null},"options":[{"id":"a","text":"علي بن أبي طالب","image":null,"explanation":null},{"id":"b","text":"زيد بن حارثة","image":null,"explanation":null},{"id":"c","text":"أبو بكر الصديق","image":null,"explanation":null},{"id":"d","text":"عثمان بن عفان","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$أول من آمن من الرجال الأحرار أبو بكر، ومن الصبيان علي، ومن الموالي زيد بن حارثة.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"استمرت فترة الدعوة السرية في مكة مدة:","image":null},"options":[{"id":"a","text":"سنة واحدة","image":null,"explanation":null},{"id":"b","text":"سنتين","image":null,"explanation":null},{"id":"c","text":"ثلاث سنوات","image":null,"explanation":null},{"id":"d","text":"خمس سنوات","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$استمرت الدعوة سراً ثلاث سنوات حتى نزل قوله تعالى: ﴿فاصدع بما تؤمر﴾.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"قال له ورقة بن نوفل: \"هذا الناموس الذي نزل على موسى\"، يقصد بـ(الناموس):","image":null},"options":[{"id":"a","text":"الوحي والقرآن","image":null,"explanation":null},{"id":"b","text":"الملك جبريل عليه السلام","image":null,"explanation":null},{"id":"c","text":"كتاب التوراة","image":null,"explanation":null},{"id":"d","text":"الدين الجديد","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$الناموس صاحب السر، والمراد به جبريل عليه السلام الذي ينزل بالوحي على الأنبياء.$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من الذين قال عنهم النبي ﷺ: \"صبراً آل ياسر؛ فإن موعدكم الجنة\"؟","image":null},"options":[{"id":"a","text":"بلال بن رباح وأهله","image":null,"explanation":null},{"id":"b","text":"خباب بن الأرت وأهله","image":null,"explanation":null},{"id":"c","text":"مصعب بن عمير وأهله","image":null,"explanation":null},{"id":"d","text":"عمار بن ياسر وأبوه ياسر وأمه سمية","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$مرّ النبي ﷺ بعمار وأبيه ياسر وأمه سمية وهم يُعذَّبون فقال ذلك، وكانت سمية أول شهيدة في الإسلام.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"حدثت الهجرة الأولى إلى الحبشة في شهر رجب من السنة:","image":null},"options":[{"id":"a","text":"الرابعة من البعثة","image":null,"explanation":null},{"id":"b","text":"الخامسة من البعثة","image":null,"explanation":null},{"id":"c","text":"السادسة من البعثة","image":null,"explanation":null},{"id":"d","text":"السابعة من البعثة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$كانت الهجرة الأولى إلى الحبشة في رجب من السنة الخامسة للبعثة.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"استمر حصار قريش للمسلمين في شِعب أبي طالب مدة:","image":null},"options":[{"id":"a","text":"سنة واحدة","image":null,"explanation":null},{"id":"b","text":"سنتين","image":null,"explanation":null},{"id":"c","text":"ثلاث سنوات","image":null,"explanation":null},{"id":"d","text":"أربع سنوات","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$استمر الحصار في شعب أبي طالب ثلاث سنوات حتى نُقضت الصحيفة.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"تُوفي أبو طالب وخديجة رضي الله عنها في عام واحد سُمي تاريخياً بـ:","image":null},"options":[{"id":"a","text":"عام الوفود","image":null,"explanation":null},{"id":"b","text":"عام الحزن","image":null,"explanation":null},{"id":"c","text":"عام الرمادة","image":null,"explanation":null},{"id":"d","text":"عام المقاطعة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$سُمّي عام الحزن لفقد النبي ﷺ فيه عمه أبا طالب وزوجه خديجة رضي الله عنها.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الغلام النصراني الذي قدّم قطفاً من العنب للنبي ﷺ في محنة الطائف هو:","image":null},"options":[{"id":"a","text":"ميسرة","image":null,"explanation":null},{"id":"b","text":"ورقة بن نوفل","image":null,"explanation":null},{"id":"c","text":"عداس","image":null,"explanation":null},{"id":"d","text":"زيد","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$عداس غلام نصراني من نينوى، قدّم العنب للنبي ﷺ ثم أسلم لما عرف أنه نبي.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"أرسل النبي ﷺ رجلاً من خزاعة ليجيره عند عودته من الطائف إلى مكة، فأجاره:","image":null},"options":[{"id":"a","text":"المطعم بن عدي","image":null,"explanation":null},{"id":"b","text":"أبو طالب","image":null,"explanation":null},{"id":"c","text":"العاص بن وائل","image":null,"explanation":null},{"id":"d","text":"سهيل بن عمرو","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$رفض الأخنس بن شريق وسهيل بن عمرو أن يجيراه، فأجاره المطعم بن عدي فدخل مكة في جواره.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 5
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 5
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$أحداث ووقائع من العهد المكي وبداية الهجرة$t$, 5, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$أحداث ووقائع من العهد المكي وبداية الهجرة$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 5: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"متى وقعت حادثة الإسراء والمعراج على أحد الأقوال المشهورة؟","image":null},"options":[{"id":"a","text":"قبل البعثة بسنة","image":null,"explanation":null},{"id":"b","text":"بعد البعثة بسنتين","image":null,"explanation":null},{"id":"c","text":"قبل الهجرة بثلاث سنين","image":null,"explanation":null},{"id":"d","text":"بعد الهجرة بسنة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$وقع الإسراء والمعراج في مكة قبل الهجرة، واختُلف في تحديد سنته؛ ومن الأقوال أنه قبل الهجرة بسنة، وقيل بثلاث سنين.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"خُففت الصلوات ليلة المعراج إلى خمس صلوات بناءً على نصيحة النبي:","image":null},"options":[{"id":"a","text":"إبراهيم عليه السلام","image":null,"explanation":null},{"id":"b","text":"موسى عليه السلام","image":null,"explanation":null},{"id":"c","text":"عيسى عليه السلام","image":null,"explanation":null},{"id":"d","text":"يوسف عليه السلام","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$كان موسى عليه السلام يقول له: «ارجع إلى ربك فاسأله التخفيف» حتى صارت خمس صلوات.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"كم كان عدد الأنصار الذين بايعوا النبي ﷺ في بيعة العقبة الأولى؟","image":null},"options":[{"id":"a","text":"ستة رجال","image":null,"explanation":null},{"id":"b","text":"اثنا عشر رجلاً","image":null,"explanation":null},{"id":"c","text":"ثلاثة وسبعون رجلاً","image":null,"explanation":null},{"id":"d","text":"خمسون رجلاً","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$بايعه في العقبة الأولى اثنا عشر رجلاً، أما الستة فهم أول من أسلم من الأنصار قبلها، والثلاثة والسبعون في العقبة الثانية.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"السفير الذي أرسله النبي ﷺ مع أهل بيعة العقبة الأولى ليُقرئهم القرآن هو:","image":null},"options":[{"id":"a","text":"عبد الله بن أم مكتوم","image":null,"explanation":null},{"id":"b","text":"مصعب بن عمير","image":null,"explanation":null},{"id":"c","text":"زيد بن حارثة","image":null,"explanation":null},{"id":"d","text":"علي بن أبي طالب","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$أرسل النبي ﷺ مصعب بن عمير معهم يعلمهم القرآن والإسلام، فكان أول سفير في الإسلام.$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"بيعة العقبة الثانية كانت على:","image":null},"options":[{"id":"a","text":"عدم الشرك والسرقة والزنا فقط","image":null,"explanation":null},{"id":"b","text":"الهجرة للحبشة","image":null,"explanation":null},{"id":"c","text":"السمع والطاعة والنصرة ومنعه مما يمنعون منه أنفسهم","image":null,"explanation":null},{"id":"d","text":"مقاطعة قريش تجارياً","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$بايعوه على السمع والطاعة والنفقة والنصرة وأن يمنعوه مما يمنعون منه أنفسهم وأهليهم، أما البيعة على ترك الشرك والسرقة فكانت في العقبة الأولى.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"في مؤامرة دار الندوة لقتل النبي ﷺ، تمثل إبليس لقريش في صورة:","image":null},"options":[{"id":"a","text":"تاجر من اليمن","image":null,"explanation":null},{"id":"b","text":"شاب من كنانة","image":null,"explanation":null},{"id":"c","text":"شيخ كبير من أهل نجد","image":null,"explanation":null},{"id":"d","text":"راهب نصراني","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$دخل عليهم إبليس في صورة شيخ نجدي، وأيّد رأي أبي جهل بأن يضربه شباب من كل قبيلة ضربة رجل واحد.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من هو الدليل الذي استأجره النبي ﷺ وأبو بكر ليدلهما على طريق الهجرة؟","image":null},"options":[{"id":"a","text":"عبد الله بن أريقط","image":null,"explanation":null},{"id":"b","text":"عامر بن فهيرة","image":null,"explanation":null},{"id":"c","text":"سراقة بن مالك","image":null,"explanation":null},{"id":"d","text":"زيد بن حارثة","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$استأجرا عبد الله بن أريقط من بني الديل، وكان على دين قريش لكنه كان أميناً هادياً بالطريق.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الكلمة التي قالها النبي ﷺ لأبي بكر في غار ثور عندما خاف من المشركين كما في الحديث الصحيح:","image":null},"options":[{"id":"a","text":"اصبر فإن النصر قريب","image":null,"explanation":null},{"id":"b","text":"يا أبا بكر ما ظنك باثنين الله ثالثهما","image":null,"explanation":null},{"id":"c","text":"اللهم احفظنا بحفظك","image":null,"explanation":null},{"id":"d","text":"إن معي ربي سيهدين","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$في الصحيحين قال أبو بكر: لو أن أحدهم نظر تحت قدميه لأبصرنا، فقال ﷺ: «ما ظنك يا أبا بكر باثنين الله ثالثهما»، وفيه نزل: ﴿لا تحزن إن الله معنا﴾.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"المرأة الخزاعية التي مر بخيمتها النبي ﷺ في طريق الهجرة ومسح ضرع شاتها فحلبت هي:","image":null},"options":[{"id":"a","text":"أسماء بنت أبي بكر","image":null,"explanation":null},{"id":"b","text":"أم معبد","image":null,"explanation":null},{"id":"c","text":"أم أيمن","image":null,"explanation":null},{"id":"d","text":"خديجة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$أم معبد الخزاعية، مسح النبي ﷺ ضرع شاتها الهزيلة فدرّت، ووصفته لزوجها وصفاً مشهوراً.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"أول عمل أنجزه النبي ﷺ أثناء إقامته في \"قباء\" قبل دخوله المدينة هو:","image":null},"options":[{"id":"a","text":"المؤاخاة بين المهاجرين والأنصار","image":null,"explanation":null},{"id":"b","text":"إبرام وثيقة المدينة","image":null,"explanation":null},{"id":"c","text":"تأسيس مسجد قباء","image":null,"explanation":null},{"id":"d","text":"بناء بيوته ﷺ","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$أسس مسجد قباء، وهو أول مسجد أُسس على التقوى، أما المؤاخاة والوثيقة وبناء المسجد النبوي فكانت في المدينة.$e$, 10, v_owner, v_owner);
  end if;
end $$;
