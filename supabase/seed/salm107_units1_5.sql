-- سلم 107 (أخلاقيات المهنة): the first five units, 10 questions each.
-- Creates the subject if it does not exist yet (published, with its cover).
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

  select id into v_subject from public.subjects where name = 'سلم 107' limit 1;
  if v_subject is null then
    insert into public.subjects (name, name_normalized, description, cover_image, status, created_by, updated_by)
    values ('سلم 107', public.normalize_arabic('سلم 107'), $t$أخلاقيات المهنة$t$, '/covers/salm-107.svg', 'published', v_owner, v_owner)
    returning id into v_subject;
  end if;

  -- Unit 1
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 1
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$مفهوم الأخلاق ومكانتها$t$, 1, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$مفهوم الأخلاق ومكانتها$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 1: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"الخُلُق (بضم الخاء واللام) يختص بـ:","image":null},"options":[{"id":"a","text":"الهيئات والصور المدركة بالبصر","image":null,"explanation":null},{"id":"b","text":"القوى والسجايا المدركة بالبصيرة","image":null,"explanation":null},{"id":"c","text":"الطبع الغريزي الذي لا يتكلفه الإنسان","image":null,"explanation":null},{"id":"d","text":"المظهر الخارجي للإنسان","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$الخَلْق يختص بالهيئات والصور المدركة بالبصر، والخُلُق يختص بالقوى والسجايا المدركة بالبصيرة.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"عرّف الإمام الغزالي الخُلُق بأنه:","image":null},"options":[{"id":"a","text":"ما طبع عليه الإنسان من الأدب","image":null,"explanation":null},{"id":"b","text":"إفراد الله سبحانه بالقصد في الطاعة","image":null,"explanation":null},{"id":"c","text":"هيئة في النفس راسخة عنها تصدر الأفعال بسهولة ويسر من غير حاجة إلى فكر وروية","image":null,"explanation":null},{"id":"d","text":"وضع كل شيء في موضعه اللائق به","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$هذا تعريف الغزالي في الإحياء، أما «إفراد الله بالقصد» فهو تعريف الإخلاص، و«وضع الشيء في موضعه» تعريف العدل.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من الأدلة على أن الأخلاق الحسنة من أعلى درجات الإيمان، قول النبي ﷺ:","image":null},"options":[{"id":"a","text":"(إنما بعثت لأتمم صالح الأخلاق)","image":null,"explanation":null},{"id":"b","text":"(أكمل المؤمنين إيماناً أحسنهم خلقاً)","image":null,"explanation":null},{"id":"c","text":"(إن من خياركم أحسنكم أخلاقاً)","image":null,"explanation":null},{"id":"d","text":"(البر حسن الخلق)","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$الحديث يربط كمال الإيمان بحسن الخلق صراحة: «أكمل المؤمنين إيماناً أحسنهم خلقاً».$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"يدرك المسلم بحسن خلقه درجة:","image":null},"options":[{"id":"a","text":"المجاهد في سبيل الله","image":null,"explanation":null},{"id":"b","text":"المتصدق بماله","image":null,"explanation":null},{"id":"c","text":"الصائم القائم","image":null,"explanation":null},{"id":"d","text":"المعتكف في المسجد","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قال ﷺ: «إن المؤمن ليدرك بحسن خلقه درجة الصائم القائم».$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من ثمرات ارتباط الأخلاق بالعقيدة أن التوحيد هو غاية العدل؛ لأنه:","image":null},"options":[{"id":"a","text":"ينهى عن الفحشاء والمنكر","image":null,"explanation":null},{"id":"b","text":"يطهر النفس من الشح","image":null,"explanation":null},{"id":"c","text":"وضع للعبادة في موضعها الحق وتوجه بها إلى من هو أهل لها","image":null,"explanation":null},{"id":"d","text":"يدرب النفس على كبح الشهوات","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$العدل وضع الشيء في موضعه، والتوحيد صرف العبادة لمستحقها وحده، فهو أعظم العدل كما أن الشرك أعظم الظلم.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"العبادة التي تنتزع من النفس الحقد والشح وتزرع فيها حب الإيثار والتكافل هي:","image":null},"options":[{"id":"a","text":"الصلاة","image":null,"explanation":null},{"id":"b","text":"الزكاة","image":null,"explanation":null},{"id":"c","text":"الصيام","image":null,"explanation":null},{"id":"d","text":"الحج","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$قال تعالى: ﴿خذ من أموالهم صدقة تطهرهم وتزكيهم بها﴾، فالزكاة تطهر النفس من الشح وتنمي التكافل.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"في مجال الاقتصاد والتجارة، نهى الإسلام عن الاحتكار، وقال النبي ﷺ:","image":null},"options":[{"id":"a","text":"(لعن رسول الله آكل الربا وموكله)","image":null,"explanation":null},{"id":"b","text":"(البيعان بالخيار ما لم يتفرقا)","image":null,"explanation":null},{"id":"c","text":"(لا يحتكر إلا خاطئ)","image":null,"explanation":null},{"id":"d","text":"(من غشنا فليس منا)","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$حديث «لا يحتكر إلا خاطئ» رواه مسلم، وهو النص في النهي عن الاحتكار تحديداً.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"القول بأن \"الخُلُق هو الطبع المتكلف، والخِيم هو الطبع الغريزي\" ذكره:","image":null},"options":[{"id":"a","text":"الإمام الغزالي","image":null,"explanation":null},{"id":"b","text":"ابن تيمية","image":null,"explanation":null},{"id":"c","text":"الإمام القرطبي","image":null,"explanation":null},{"id":"d","text":"ابن القيم","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$ذكره القرطبي في تفسير قوله تعالى: ﴿وإنك لعلى خلق عظيم﴾، ففرّق بين الخلق المكتسب والخيم الغريزي.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"قول النبي ﷺ: (لو أن فاطمة فعلت ذلك لقطعت يدها) يدل على ارتباط الأخلاق بـ:","image":null},"options":[{"id":"a","text":"مجال السياسة والحكم (إقامة العدل)","image":null,"explanation":null},{"id":"b","text":"مجال الأسرة والتربية","image":null,"explanation":null},{"id":"c","text":"مجال الاقتصاد والتجارة","image":null,"explanation":null},{"id":"d","text":"مجال العبادات","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$قاله ﷺ في قصة المخزومية، تأكيداً لإقامة العدل وتطبيق الحدود على الجميع دون محاباة.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من آثار الأخلاق الحسنة على الفرد والمجتمع:","image":null},"options":[{"id":"a","text":"كسب رضا الله تعالى","image":null,"explanation":null},{"id":"b","text":"إنجاز الأعمال وزيادة الإنتاج","image":null,"explanation":null},{"id":"c","text":"مكافحة الجرائم والانحرافات","image":null,"explanation":null},{"id":"d","text":"جميع ما سبق","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$كلها من آثار الأخلاق الحسنة: رضا الله، وزيادة الإنتاج، وحماية المجتمع من الجرائم.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 2
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 2
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$مفهوم المهنة وأهميتها$t$, 2, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$مفهوم المهنة وأهميتها$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 2: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"تُعرّف المهنة اصطلاحاً بأنها:","image":null},"options":[{"id":"a","text":"الحذق بالخدمة والعمل","image":null,"explanation":null},{"id":"b","text":"نشاط يتخذه الشخص وسيلة للاكتساب بالطرق المشروعة","image":null,"explanation":null},{"id":"c","text":"هيئة راسخة في النفس","image":null,"explanation":null},{"id":"d","text":"القوة والأمانة في العمل","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$«الحذق بالخدمة والعمل» معناها اللغوي، أما اصطلاحاً فهي نشاط يتخذه الشخص وسيلة للكسب المشروع.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"في قوله تعالى: {فَامْشُوا فِي مَنَاكِبِهَا}، فسّرها السعدي بأن المشي هنا يقصد به:","image":null},"options":[{"id":"a","text":"السفر للسياحة","image":null,"explanation":null},{"id":"b","text":"المشي للعبادة","image":null,"explanation":null},{"id":"c","text":"لطلب الرزق والمكاسب","image":null,"explanation":null},{"id":"d","text":"الجهاد في سبيل الله","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قال السعدي: أي لطلب الرزق والمكاسب، ولذلك قال بعدها: ﴿وكلوا من رزقه﴾.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"النبي الذي أخبر الله تعالى أنه علّمه \"صنعة لبوس\" (صناعة الدروع) هو:","image":null},"options":[{"id":"a","text":"آدم عليه السلام","image":null,"explanation":null},{"id":"b","text":"نوح عليه السلام","image":null,"explanation":null},{"id":"c","text":"داود عليه السلام","image":null,"explanation":null},{"id":"d","text":"موسى عليه السلام","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قال تعالى عن داود عليه السلام: ﴿وعلمناه صنعة لبوس لكم لتحصنكم من بأسكم﴾.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"المهنة التي عمل بها جميع الأنبياء عليهم السلام هي:","image":null},"options":[{"id":"a","text":"التجارة","image":null,"explanation":null},{"id":"b","text":"الحدادة","image":null,"explanation":null},{"id":"c","text":"النجارة","image":null,"explanation":null},{"id":"d","text":"رعي الغنم","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$قال ﷺ: «ما بعث الله نبياً إلا رعى الغنم».$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"في قوله تعالى: {وَآخَرُونَ يَضْرِبُونَ فِي الْأَرْضِ يَبْتَغُونَ مِن فَضْلِ اللَّهِ وَآخَرُونَ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ}، قرن الله تعالى العمل بـ:","image":null},"options":[{"id":"a","text":"الصلاة","image":null,"explanation":null},{"id":"b","text":"الجهاد في سبيل الله","image":null,"explanation":null},{"id":"c","text":"الزكاة","image":null,"explanation":null},{"id":"d","text":"الحج","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$قرنت الآية الساعين في طلب الرزق بالمجاهدين في سبيل الله، دلالة على فضل العمل.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"التاجر الصدوق الأمين يحشر يوم القيامة مع:","image":null},"options":[{"id":"a","text":"النبيين والصديقين والشهداء","image":null,"explanation":null},{"id":"b","text":"الصائمين القائمين","image":null,"explanation":null},{"id":"c","text":"المتصدقين","image":null,"explanation":null},{"id":"d","text":"أئمة العدل","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$قال ﷺ: «التاجر الصدوق الأمين مع النبيين والصديقين والشهداء».$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من وسائل علاج مشكلة البطالة التي تعتبر القرض وسيلة مهمة لإعانة المحتاج وبناء مستقبله:","image":null},"options":[{"id":"a","text":"تأهيل الشباب لسوق العمل","image":null,"explanation":null},{"id":"b","text":"القروض الحسنة","image":null,"explanation":null},{"id":"c","text":"منع الاحتكار","image":null,"explanation":null},{"id":"d","text":"توزيع الثروات","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$القرض الحسن يعين المحتاج على بدء عمل يكسب منه، فيكون من وسائل علاج البطالة.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"تعتبر \"كوريا الجنوبية\" نموذجاً مذكوراً في المقرر للتدليل على:","image":null},"options":[{"id":"a","text":"التكافل الاجتماعي","image":null,"explanation":null},{"id":"b","text":"تحقيق القفزة الشاملة بالتقدم التقني والمهني","image":null,"explanation":null},{"id":"c","text":"محاربة الاحتكار","image":null,"explanation":null},{"id":"d","text":"توزيع الدخول والثروات","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$يذكر المقرر كوريا الجنوبية مثالاً على النهوض الشامل عبر الاهتمام بالتقنية والتأهيل المهني.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"قال النبي ﷺ: (إن قامت الساعة وبيد أحدكم فسيلة، فإن استطاع ألا يقوم حتى يغرسها فليفعل)، الفسيلة هي:","image":null},"options":[{"id":"a","text":"الفأس","image":null,"explanation":null},{"id":"b","text":"صغار الغنم","image":null,"explanation":null},{"id":"c","text":"صغار النخل","image":null,"explanation":null},{"id":"d","text":"وعاء الماء","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$الفسيلة النخلة الصغيرة، والحديث حث على العمل والإنتاج حتى آخر لحظة.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"العاطلون عن العمل الذين بلغوا السن الذي يؤهلهم للعمل والإنتاج، يُطلق على حالتهم مصطلح:","image":null},"options":[{"id":"a","text":"التفريط","image":null,"explanation":null},{"id":"b","text":"البطالة","image":null,"explanation":null},{"id":"c","text":"الاحتكار","image":null,"explanation":null},{"id":"d","text":"الاستهلاك","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$البطالة وجود قادرين على العمل وراغبين فيه في سن الإنتاج دون أن يجدوا عملاً.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 3
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 3
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$شروط المهنة$t$, 3, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$شروط المهنة$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 3: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"الشرط الأول من شروط المهنة في الإسلام هو:","image":null},"options":[{"id":"a","text":"أن يكون العمل نافعاً","image":null,"explanation":null},{"id":"b","text":"إبرام العقد","image":null,"explanation":null},{"id":"c","text":"كون العمل مشروعاً (مباحاً)","image":null,"explanation":null},{"id":"d","text":"احترام العامل","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$أول الشروط أن يكون العمل مباحاً في أصله، فلا يجوز العمل في المحرمات مهما كان نفعها المادي.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"العمل في إنتاج أفلام أو مواقع تشكك في العقيدة الإسلامية يخل بشرط:","image":null},"options":[{"id":"a","text":"كون العمل مشروعاً في ذاته","image":null,"explanation":null},{"id":"b","text":"كونه نافعاً (لأنه يتضمن ضرراً معنوياً/عقدياً)","image":null,"explanation":null},{"id":"c","text":"إبرام العقد","image":null,"explanation":null},{"id":"d","text":"احترام العامل","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$يصنفه المقرر ضمن شرط النفع، لأن ضرره معنوي يمس عقيدة الناس.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"عقد العمل في الفقه الإسلامي يُعد من أنواع عقود:","image":null},"options":[{"id":"a","text":"البيع","image":null,"explanation":null},{"id":"b","text":"الوكالة","image":null,"explanation":null},{"id":"c","text":"الإجارة","image":null,"explanation":null},{"id":"d","text":"الجعالة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$عقد العمل إجارة على منفعة الأشخاص، أي بيع منفعة العامل بأجرة معلومة.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"القاعدة الشرعية في الشروط التعاقدية \"من اشترط شرطاً ليس في كتاب الله فهو باطل\" تعني:","image":null},"options":[{"id":"a","text":"عدم جواز كتابة العقود","image":null,"explanation":null},{"id":"b","text":"أن الشروط غير المكتوبة في القرآن باطلة","image":null,"explanation":null},{"id":"c","text":"أن الشرط إذا كان مخالفاً لنصوص القرآن والسنة (يحل حراماً أو يحرم حلالاً) فهو باطل","image":null,"explanation":null},{"id":"d","text":"أنه لا يجوز وضع شروط في عقد العمل","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$المراد «ليس في حكم الله وشرعه»، فالشرط الباطل ما خالف الشرع، أما الشروط المباحة فجائزة.$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"منع نظام العمل السعودي تكليف العامل بعمل يختلف اختلافاً جوهرياً عن المتفق عليه إلا لضرورة ولمدة لا تتجاوز 30 يوماً، هذا يحقق شرط:","image":null},"options":[{"id":"a","text":"كون العمل مشروعاً","image":null,"explanation":null},{"id":"b","text":"كون العمل نافعاً","image":null,"explanation":null},{"id":"c","text":"إبرام العقد والوفاء به","image":null,"explanation":null},{"id":"d","text":"ألا يؤدي العمل لمشقة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$إلزام صاحب العمل بما اتفق عليه في العقد من الوفاء بالعقود، قال تعالى: ﴿أوفوا بالعقود﴾.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الحديث الشريف: (ثلاثة أنا خصمهم يوم القيامة... ورجل استأجر أجيراً فاستوفى منه ولم يعطه أجره) يدل على وجوب:","image":null},"options":[{"id":"a","text":"تحديد ساعات العمل","image":null,"explanation":null},{"id":"b","text":"تحديد أجرة العمل والوفاء بها","image":null,"explanation":null},{"id":"c","text":"سلامة العامل من الأخطار","image":null,"explanation":null},{"id":"d","text":"كتابة العقد","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$الحديث وعيد شديد لمن أكل أجر العامل، فيجب تحديد الأجرة والوفاء بها.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"جمع العنب لبيعه لمن يصنعه خمراً يُعد عملاً محرماً لأنه يخل بشرط:","image":null},"options":[{"id":"a","text":"كون العمل مشروعاً في أصله","image":null,"explanation":null},{"id":"b","text":"ألا يؤدي العمل إلى أمر محرم (الوسائل لها أحكام المقاصد)","image":null,"explanation":null},{"id":"c","text":"إبرام العقد","image":null,"explanation":null},{"id":"d","text":"احترام العامل","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$جمع العنب مباح في أصله، لكنه يحرم إذا كان وسيلة إلى محرم، لأن الوسائل لها أحكام المقاصد.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الخلوة غير الشرعية في بيئة العمل تتعارض مع شرط:","image":null},"options":[{"id":"a","text":"كون العمل نافعاً","image":null,"explanation":null},{"id":"b","text":"الوفاء بالعقود","image":null,"explanation":null},{"id":"c","text":"ألا يؤدي العمل إلى أمر محرم","image":null,"explanation":null},{"id":"d","text":"احترام العامل","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$العمل مباح في أصله، لكن ما يصاحبه من خلوة محرمة يجعله مؤدياً إلى محرم.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"إعطاء فترة للصلاة والطعام والراحة أثناء العمل، وعدم تشغيل الأحداث في أعمال خطرة، يدخل ضمن شرط:","image":null},"options":[{"id":"a","text":"مشروعية العمل","image":null,"explanation":null},{"id":"b","text":"إبرام العقد","image":null,"explanation":null},{"id":"c","text":"احترام العامل ومعاملته معاملة لائقة","image":null,"explanation":null},{"id":"d","text":"نفع العمل للمجتمع","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$هذه من حقوق العامل وحفظ كرامته وسلامته، وتندرج تحت احترامه ومعاملته معاملة لائقة.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"أي من الشروط التالية يعتبر شرطاً لتوثيق العقد ودفع الغرر بين الطرفين؟","image":null},"options":[{"id":"a","text":"تحديد نوع العمل وحجمه ومدته","image":null,"explanation":null},{"id":"b","text":"أن يكون العمل مباحاً","image":null,"explanation":null},{"id":"c","text":"عدم السخرية من العامل","image":null,"explanation":null},{"id":"d","text":"إعطاء العامل فترة للراحة","image":null,"explanation":null}],"correct":"a"}$j$::jsonb, $e$تحديد نوع العمل وحجمه ومدته يرفع الجهالة والغرر ويمنع النزاع بين الطرفين.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 4
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 4
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$خُلُق الإخلاص والصدق$t$, 4, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$خُلُق الإخلاص والصدق$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 4: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"يُقصد بـ \"السجايا الحميدة والسلوكيات الفاضلة التي يتعين أن يتحلى الموظفون بها عند أدائهم واجبهم الوظيفي\":","image":null},"options":[{"id":"a","text":"الكفاءة المهنية","image":null,"explanation":null},{"id":"b","text":"أخلاقيات المهنة","image":null,"explanation":null},{"id":"c","text":"الثقافة التنظيمية","image":null,"explanation":null},{"id":"d","text":"الإدارة الإسلامية","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$هذا تعريف أخلاقيات المهنة: الصفات والسلوكيات التي يلتزم بها الموظف في أداء عمله.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من أسباب زيادة الحاجة لدراسة أخلاقيات المهنة وتطبيقها في العصر الحديث:","image":null},"options":[{"id":"a","text":"سيطرة العلم والآلة واستغناء بعض المهن عن الأيدي البشرية","image":null,"explanation":null},{"id":"b","text":"انفتاح العالم عبر الفضائيات وشبكات الاتصال","image":null,"explanation":null},{"id":"c","text":"تضحية العامل بالابتعاد عن وطنه (الهجرة للعمل)","image":null,"explanation":null},{"id":"d","text":"جميع ما سبق","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$كلها من أسباب زيادة الحاجة إلى أخلاقيات المهنة في هذا العصر.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"إفراد الله سبحانه بالقصد في الطاعة، هو تعريف لـ:","image":null},"options":[{"id":"a","text":"الصدق","image":null,"explanation":null},{"id":"b","text":"الأمانة","image":null,"explanation":null},{"id":"c","text":"الإخلاص","image":null,"explanation":null},{"id":"d","text":"العفاف","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$الإخلاص أن يقصد العبد بعمله وجه الله وحده دون غيره.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"قال الفضيل بن عياض في قوله تعالى {لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلاً}: الخالص إذا كان لله، والصواب إذا كان:","image":null},"options":[{"id":"a","text":"متقناً","image":null,"explanation":null},{"id":"b","text":"سريعاً","image":null,"explanation":null},{"id":"c","text":"على السُّنة","image":null,"explanation":null},{"id":"d","text":"نافعاً للناس","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قال الفضيل: أحسن العمل أخلصه وأصوبه، والخالص ما كان لله، والصواب ما كان على السنة.$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من صور الإخلاص في المعاملات والمهن:","image":null},"options":[{"id":"a","text":"أن يقصد الموظف بعمله الاستعفاف عن السؤال","image":null,"explanation":null},{"id":"b","text":"أن ينوي الاستعانة بالكسب على طاعة الله ورعاية أسرته","image":null,"explanation":null},{"id":"c","text":"أن يقصد القيام بفرض من فروض الكفايات ونفع وطنه","image":null,"explanation":null},{"id":"d","text":"جميع ما سبق","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$كل هذه نيات صالحة تجعل العمل الدنيوي عبادة يؤجر عليها الموظف.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"\"القول بما يطابق الواقع من غير زيادة ولا نقصان\" هو تعريف:","image":null},"options":[{"id":"a","text":"الأمانة","image":null,"explanation":null},{"id":"b","text":"الصدق","image":null,"explanation":null},{"id":"c","text":"الإخلاص","image":null,"explanation":null},{"id":"d","text":"العدل","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$الصدق مطابقة الخبر للواقع، والكذب مخالفته.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"قوله ﷺ: (البيعان بالخيار ما لم يتفرقا... فإن صدقا وبيّنا بورك لهما في بيعهما) يدل على أهمية الصدق في:","image":null},"options":[{"id":"a","text":"القول","image":null,"explanation":null},{"id":"b","text":"الوعد","image":null,"explanation":null},{"id":"c","text":"المعاملة","image":null,"explanation":null},{"id":"d","text":"نقل الأفكار","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$الحديث في البيع والشراء، فهو صدق في المعاملة ببيان حال السلعة وعدم كتمان عيوبها.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"من صور الصدق \"ألا يقول المرء غير ما يعمل، وأن ينفذ ما تعهد بتنفيذه في موعده\"، هذا يُسمى الصدق في:","image":null},"options":[{"id":"a","text":"أداء الشهادة","image":null,"explanation":null},{"id":"b","text":"الوعد والعهد","image":null,"explanation":null},{"id":"c","text":"نقل الأفكار","image":null,"explanation":null},{"id":"d","text":"المعاملة التجارية","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$الوفاء بما وعد به الإنسان وتعهد به في وقته هو الصدق في الوعد والعهد.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"يرى ابن القيم أن \"استواء الأفعال على الأمر والمتابعة كاستواء الرأس على الجسد\" هو:","image":null},"options":[{"id":"a","text":"الصدق في الأقوال","image":null,"explanation":null},{"id":"b","text":"الصدق في الأعمال","image":null,"explanation":null},{"id":"c","text":"الصدق في الأحوال","image":null,"explanation":null},{"id":"d","text":"الإخلاص في النية","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$قسّم ابن القيم الصدق: في الأقوال استواء اللسان عليها، وفي الأعمال استواء الأفعال على الأمر والمتابعة، وفي الأحوال استواء أعمال القلب والجوارح على الإخلاص.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الدليل على أن خُلُق الصدق قابل للاكتساب والتنمية والمجاهدة، قوله ﷺ:","image":null},"options":[{"id":"a","text":"(عليكم بالصدق)","image":null,"explanation":null},{"id":"b","text":"(إن الصدق يهدي إلى البر)","image":null,"explanation":null},{"id":"c","text":"(وما يزال الرجل يصدق ويتحرى الصدق حتى يكتب عند الله صديقاً)","image":null,"explanation":null},{"id":"d","text":"(فإن صدقا وبينا بورك لهما)","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قوله «ما يزال يصدق ويتحرى» يدل على المداومة والمجاهدة حتى يصير الصدق صفة راسخة فيه.$e$, 10, v_owner, v_owner);
  end if;

  -- Unit 5
  select id into v_lesson from public.lessons
    where subject_id = v_subject and sort_order = 5
    order by created_at limit 1;
  if v_lesson is null then
    insert into public.lessons (subject_id, title, sort_order, status, shuffle_options, created_by, updated_by)
    values (v_subject, $t$خُلُق الأمانة، والعفاف، والعدل$t$, 5, 'published', true, v_owner, v_owner)
    returning id into v_lesson;
  else
    update public.lessons set title = $t$خُلُق الأمانة، والعفاف، والعدل$t$, status = 'published', shuffle_options = true, updated_by = v_owner
    where id = v_lesson;
  end if;

  if exists (select 1 from public.questions where lesson_id = v_lesson) then
    raise notice 'الوحدة 5: الدرس فيه أسئلة مسبقاً، تم تخطي إضافة الأسئلة';
  else
    insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values
    (v_lesson, 'mcq', $j${"question":{"text":"ذكر ابن الجوزي أن الأمانة في القرآن تأتي على ثلاثة أوجه، ليس منها:","image":null},"options":[{"id":"a","text":"الفرائض","image":null,"explanation":null},{"id":"b","text":"الوديعة","image":null,"explanation":null},{"id":"c","text":"العفة","image":null,"explanation":null},{"id":"d","text":"الإخلاص","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$الأوجه الثلاثة عند ابن الجوزي: الفرائض، والوديعة، والعفة، وليس منها الإخلاص.$e$, 1, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"قوله ﷺ: (آية المنافق ثلاث...) وفي رواية (لا إيمان لمن لا أمانة له)، يدل على:","image":null},"options":[{"id":"a","text":"أن الأمانة من شروط صحة الصلاة","image":null,"explanation":null},{"id":"b","text":"نفي كمال الإيمان عمن لا أمانة له","image":null,"explanation":null},{"id":"c","text":"أن الخائن يخرج من ملة الإسلام","image":null,"explanation":null},{"id":"d","text":"أن الأمانة محصورة في حفظ المال فقط","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$النفي هنا نفي لكمال الإيمان الواجب، لا لأصله، فالخائن لا يخرج من الإسلام لكنه ناقص الإيمان.$e$, 2, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الحفاظ على المال العام للشركة وعدم استغلال المنصب للمصالح الشخصية، يندرج تحت الأمانة في:","image":null},"options":[{"id":"a","text":"حقيقة المهنة (الأسرار)","image":null,"explanation":null},{"id":"b","text":"التصرف في المهنة","image":null,"explanation":null},{"id":"c","text":"وسيلة المهنة","image":null,"explanation":null},{"id":"d","text":"أوقات المهنة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$التصرف في المهنة يعني أن يستعمل الموظف ما تحت يده من مال وصلاحيات لمصلحة العمل لا لمصلحته الشخصية.$e$, 3, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"\"الكف عن الحرام والسؤال من الناس\" هو تعريف:","image":null},"options":[{"id":"a","text":"الأمانة","image":null,"explanation":null},{"id":"b","text":"العفاف","image":null,"explanation":null},{"id":"c","text":"العدل","image":null,"explanation":null},{"id":"d","text":"القناعة","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$العفاف كف النفس عما لا يحل، وعن سؤال الناس.$e$, 4, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"الهدايا والإكراميات التي تُدفع للموظفين من أرباب المصالح لإنجاز معاملاتهم تُعد من:","image":null},"options":[{"id":"a","text":"الصدقة المباحة","image":null,"explanation":null},{"id":"b","text":"المكافآت التشجيعية","image":null,"explanation":null},{"id":"c","text":"الغُلُول (الرشوة المحرمة)","image":null,"explanation":null},{"id":"d","text":"الأمانة","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$قال ﷺ: «هدايا العمال غلول»، لأنها تُعطى للموظف بسبب وظيفته فتؤثر في عدله.$e$, 5, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"وضع كل شيء في موضعه اللائق به من غير زيادة ولا نقصان، هو تعريف:","image":null},"options":[{"id":"a","text":"الأمانة","image":null,"explanation":null},{"id":"b","text":"المساواة","image":null,"explanation":null},{"id":"c","text":"العدل","image":null,"explanation":null},{"id":"d","text":"العفاف","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$العدل وضع الشيء في موضعه، وهو أعم من المساواة، فقد يقتضي العدل التفريق بين المختلفين.$e$, 6, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"عدم مبالغة الموظف في وصف سلبيات رئيسه، والإنصاف بين جوانبه الإيجابية والسلبية، يمثل العدل في تعامل:","image":null},"options":[{"id":"a","text":"الرئيس مع مرؤوسيه","image":null,"explanation":null},{"id":"b","text":"الموظف مع رئيسه","image":null,"explanation":null},{"id":"c","text":"الموظفين مع بعضهم","image":null,"explanation":null},{"id":"d","text":"الموظف مع المستفيدين (المراجعين)","image":null,"explanation":null}],"correct":"b"}$j$::jsonb, $e$الإنصاف في الحكم على الرئيس وذكر محاسنه مع أخطائه من عدل الموظف مع رئيسه.$e$, 7, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"إعطاء كل مُراجع (مستفيد) حقه وعدم تقديم الأصدقاء والأقارب على حساب الآخرين، يمثل العدل في تعامل:","image":null},"options":[{"id":"a","text":"الرئيس مع مرؤوسيه","image":null,"explanation":null},{"id":"b","text":"الموظف مع رئيسه","image":null,"explanation":null},{"id":"c","text":"الموظفين مع بعضهم","image":null,"explanation":null},{"id":"d","text":"الموظف مع المستفيدين (العملاء)","image":null,"explanation":null}],"correct":"d"}$j$::jsonb, $e$المساواة بين المراجعين في الخدمة وعدم المحاباة من عدل الموظف مع المستفيدين.$e$, 8, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"المادة في نظام العمل التي تتيح للعامل طلب إعادته للعمل إذا فُصل بغير سبب مشروع، تجسد خُلُق:","image":null},"options":[{"id":"a","text":"التعاون","image":null,"explanation":null},{"id":"b","text":"العفاف","image":null,"explanation":null},{"id":"c","text":"العدل","image":null,"explanation":null},{"id":"d","text":"الإخلاص","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$حماية العامل من الفصل التعسفي وإنصافه من صور العدل في الأنظمة.$e$, 9, v_owner, v_owner),
    (v_lesson, 'mcq', $j${"question":{"text":"حديث: (استعمل النبي رجلاً من الأزد يقال له ابن اللتبية على الصدقة، فلما قدم قال: هذا لكم وهذا أهدي لي...)، يستدل به على وجوب التزام الموظف بـ:","image":null},"options":[{"id":"a","text":"العدل بين الناس","image":null,"explanation":null},{"id":"b","text":"الصدق في الحديث","image":null,"explanation":null},{"id":"c","text":"العفاف (وعدم قبول هدايا العمال/الرشوة)","image":null,"explanation":null},{"id":"d","text":"التبكير إلى العمل","image":null,"explanation":null}],"correct":"c"}$j$::jsonb, $e$أنكر النبي ﷺ عليه وقال: «أفلا جلس في بيت أبيه وأمه فينظر أيهدى له أم لا»، فلا يقبل الموظف هدايا بسبب عمله.$e$, 10, v_owner, v_owner);
  end if;
end $$;
