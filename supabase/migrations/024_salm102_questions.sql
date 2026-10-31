-- سلم 102: الأسرة في الإسلام – 50 سؤال (الوحدات 1-5)
-- Questions are inserted into lessons 1-5 of سلم 102 (10 questions per lesson/unit).

do $$
declare
  v_owner   uuid;
  v_subject uuid;
  v_lesson  uuid;
begin
  select id into v_owner from public.profiles where role = 'owner' order by created_at limit 1;
  select id into v_subject from public.subjects where name = 'سلم 102';

  if v_subject is null then
    raise exception 'Subject سلم 102 not found';
  end if;

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الأولى: مفهوم الأسرة في الإسلام  (الدرس 1)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 1;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو التعريف الاصطلاحي للأسرة في الإسلام؟", "image": null},
    "options": [
      {"id": "a", "text": "مجموعة من الأفراد يعيشون في مسكن واحد.", "image": null, "explanation": null},
      {"id": "b", "text": "رابطة شرعية تتكون من زوج وزوجة وأولاد غالباً، وتحكمها مجموعة من الحقوق والواجبات.", "image": null, "explanation": null},
      {"id": "c", "text": "عشيرة الرجل وأهل بيته الذين يتقوى بهم.", "image": null, "explanation": null},
      {"id": "d", "text": "مجموعة من الأقارب من جهة الأب فقط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من هو مصدر \"القوامة\" في الأسرة المسلمة بناءً على النصوص الشرعية؟", "image": null},
    "options": [
      {"id": "a", "text": "الزوج.", "image": null, "explanation": null},
      {"id": "b", "text": "الزوجة.", "image": null, "explanation": null},
      {"id": "c", "text": "الأبناء الأكبر سناً.", "image": null, "explanation": null},
      {"id": "d", "text": "الجد.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"الأسرة الكبرى\" في المفهوم الإسلامي تطلق على:", "image": null},
    "options": [
      {"id": "a", "text": "الزوج والزوجة والأولاد فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "الزوج والزوجة والأولاد، والجد الأكبر وأبناؤه وزوجاتهم والأعمام والأخوال.", "image": null, "explanation": null},
      {"id": "c", "text": "القبيلة بأكملها.", "image": null, "explanation": null},
      {"id": "d", "text": "الجيران والأصدقاء المقربين.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من مظاهر عناية الإسلام بالأسرة أنه ربط الحث على تكوينها بـ:", "image": null},
    "options": [
      {"id": "a", "text": "زيادة الثروة المالية.", "image": null, "explanation": null},
      {"id": "b", "text": "التفاخر بالأحساب والأنساب.", "image": null, "explanation": null},
      {"id": "c", "text": "إشباع غرائز الفطرة البشرية في الأنس وتحصيل الأولاد.", "image": null, "explanation": null},
      {"id": "d", "text": "الحصول على الوجاهة الاجتماعية.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي مما يلي يُعد من خصائص الأسرة المسلمة؟", "image": null},
    "options": [
      {"id": "a", "text": "الانغلاق التام عن المجتمع لتجنب الفتن.", "image": null, "explanation": null},
      {"id": "b", "text": "الانفتاح الرشيد على المجتمع والتأثر به والتأثير فيه.", "image": null, "explanation": null},
      {"id": "c", "text": "التركيز على تحقيق الغايات الدنيوية فقط.", "image": null, "explanation": null},
      {"id": "d", "text": "الاعتماد المطلق على القوانين الوضعية.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هي الغاية الأخروية الكبرى للأسرة المسلمة؟", "image": null},
    "options": [
      {"id": "a", "text": "تكثير النسل فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "تحقيق الاستقرار المالي.", "image": null, "explanation": null},
      {"id": "c", "text": "فوز جميع أعضائها برضى الله وجنته والنجاة من النار.", "image": null, "explanation": null},
      {"id": "d", "text": "تأهيل الأولاد لعمارة الأرض.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ورد في القرآن الكريم لفظ مرادف للأسرة في قوله تعالى: (وَأَنذِرْ عَشِيرَتَكَ الْأَقْرَبِينَ)، وهو لفظ:", "image": null},
    "options": [
      {"id": "a", "text": "الرهط.", "image": null, "explanation": null},
      {"id": "b", "text": "العشيرة.", "image": null, "explanation": null},
      {"id": "c", "text": "الأهل.", "image": null, "explanation": null},
      {"id": "d", "text": "القوم.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أهمية الأسرة أنها تصون المجتمعات من التفكك عبر:", "image": null},
    "options": [
      {"id": "a", "text": "منع الزواج المبكر.", "image": null, "explanation": null},
      {"id": "b", "text": "الزواج الشرعي الذي يعف النفوس ويحفظ الأنساب.", "image": null, "explanation": null},
      {"id": "c", "text": "إجبار الأبناء على العمل في سن مبكرة.", "image": null, "explanation": null},
      {"id": "d", "text": "الانعزال عن المجتمعات الأخرى.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الزوجة في الأسرة المسلمة هي مصدر:", "image": null},
    "options": [
      {"id": "a", "text": "القوامة.", "image": null, "explanation": null},
      {"id": "b", "text": "الحافظية.", "image": null, "explanation": null},
      {"id": "c", "text": "النفقة.", "image": null, "explanation": null},
      {"id": "d", "text": "التأديب بالضرب.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "العلاقة بين أفراد الأسرة المسلمة (الزوجين، الآباء والأبناء، الإخوة) مبنية في الأصل على:", "image": null},
    "options": [
      {"id": "a", "text": "المحاسبة المالية الدقيقة.", "image": null, "explanation": null},
      {"id": "b", "text": "المودة والرحمة.", "image": null, "explanation": null},
      {"id": "c", "text": "الخوف والترهيب.", "image": null, "explanation": null},
      {"id": "d", "text": "التنافس المادي.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الثانية: ضوابط العلاقة بين الجنسين  (الدرس 2)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 2;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو الموقف العام للإسلام من \"الميل الفطري\" بين الذكر والأنثى؟", "image": null},
    "options": [
      {"id": "a", "text": "أنكره وحاربه واعتبره رجساً.", "image": null, "explanation": null},
      {"id": "b", "text": "أطلق له العنان دون أي قيود.", "image": null, "explanation": null},
      {"id": "c", "text": "اعترف به وشرع الزواج لتلبية هذه الفطرة وحرم ما سواه.", "image": null, "explanation": null},
      {"id": "d", "text": "اعتبره حرية شخصية مطلقة.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هي الوسيلة الوحيدة المشروعة التي أباحها الإسلام لإقامة علاقة خاصة بين الرجل والمرأة؟", "image": null},
    "options": [
      {"id": "a", "text": "الخطبة.", "image": null, "explanation": null},
      {"id": "b", "text": "الزواج العرفي غير الموثق.", "image": null, "explanation": null},
      {"id": "c", "text": "الزواج الشرعي (أو ملك اليمين في الماضي).", "image": null, "explanation": null},
      {"id": "d", "text": "الصداقة البريئة.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "حكم الخلوة بين الرجل والمرأة الأجنبية عنه في الإسلام:", "image": null},
    "options": [
      {"id": "a", "text": "مباحة إذا دعت الحاجة.", "image": null, "explanation": null},
      {"id": "b", "text": "مكروهة.", "image": null, "explanation": null},
      {"id": "c", "text": "محرمة مطلقاً سداً للذريعة.", "image": null, "explanation": null},
      {"id": "d", "text": "مستحبة للتعارف قبل الزواج.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو الشرط الذي يرفع تحريم الخلوة بين الرجل والمرأة؟", "image": null},
    "options": [
      {"id": "a", "text": "وجود محرم للمرأة.", "image": null, "explanation": null},
      {"id": "b", "text": "أن تكون الخلوة في مكان عام.", "image": null, "explanation": null},
      {"id": "c", "text": "أن يكون الرجل معلماً للمرأة.", "image": null, "explanation": null},
      {"id": "d", "text": "أن يكونا كبيرين في السن.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الغاية الكبرى من غض البصر كما ورد في قوله تعالى: (قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ...) هي:", "image": null},
    "options": [
      {"id": "a", "text": "حماية العين من الأمراض.", "image": null, "explanation": null},
      {"id": "b", "text": "التزكية وطهارة القلوب.", "image": null, "explanation": null},
      {"id": "c", "text": "احترام العادات والتقاليد.", "image": null, "explanation": null},
      {"id": "d", "text": "تجنب الخلافات الاجتماعية.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هي عقوبة \"غير المحصن\" (غير المتزوج) إذا وقع في جريمة الزنا؟", "image": null},
    "options": [
      {"id": "a", "text": "الرجم بالحجارة حتى الموت.", "image": null, "explanation": null},
      {"id": "b", "text": "الجلد مائة والتغريب سنة.", "image": null, "explanation": null},
      {"id": "c", "text": "السجن المؤبد.", "image": null, "explanation": null},
      {"id": "d", "text": "التعزير بالمال.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هي عقوبة \"المحصن\" (المتزوج) إذا وقع في جريمة الزنا؟", "image": null},
    "options": [
      {"id": "a", "text": "الجلد مائة.", "image": null, "explanation": null},
      {"id": "b", "text": "التغريب عن البلد.", "image": null, "explanation": null},
      {"id": "c", "text": "الرجم بالحجارة حتى الموت.", "image": null, "explanation": null},
      {"id": "d", "text": "التوبيخ والتشهير.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي مما يلي يُعد من الحكم في تحريم الزنا؟", "image": null},
    "options": [
      {"id": "a", "text": "حفظ الأنساب من الاختلاط.", "image": null, "explanation": null},
      {"id": "b", "text": "الحماية من الأمراض الفتاكة.", "image": null, "explanation": null},
      {"id": "c", "text": "حفظ كرامة المرأة وعرضها.", "image": null, "explanation": null},
      {"id": "d", "text": "جميع ما سبق صحيح.", "image": null, "explanation": null}
    ],
    "correct": "d"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "في الحديث: \"ألا أخبرك بخير ما يكنز المرء؟ المرأة الصالحة...\"، ما هو دور المرأة الصالحة إذا غاب عنها زوجها؟", "image": null},
    "options": [
      {"id": "a", "text": "تخرج للعمل لتزيد الدخل.", "image": null, "explanation": null},
      {"id": "b", "text": "تحفظه في نفسها وماله.", "image": null, "explanation": null},
      {"id": "c", "text": "تنتقل للعيش مع أسرتها.", "image": null, "explanation": null},
      {"id": "d", "text": "تستقبل الضيوف الأجانب في بيته.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الخطاب الشرعي بالأمر بغض البصر موجه إلى:", "image": null},
    "options": [
      {"id": "a", "text": "الرجال فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "النساء فقط.", "image": null, "explanation": null},
      {"id": "c", "text": "الرجال والنساء معاً.", "image": null, "explanation": null},
      {"id": "d", "text": "غير المتزوجين فقط.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الثالثة: مقدمات تكوين الأسرة  (الدرس 3)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 3;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "المعيار الأهم والأول الذي حث الإسلام على مراعاته عند اختيار الزوج والزوجة هو:", "image": null},
    "options": [
      {"id": "a", "text": "الحسب والنسب.", "image": null, "explanation": null},
      {"id": "b", "text": "المال والثراء.", "image": null, "explanation": null},
      {"id": "c", "text": "الجمال الخارجي.", "image": null, "explanation": null},
      {"id": "d", "text": "الدين والصلاح.", "image": null, "explanation": null}
    ],
    "correct": "d"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو المقصود بـ \"نكاح الشغار\" المحرم شرعاً؟", "image": null},
    "options": [
      {"id": "a", "text": "زواج الرجل من امرأة غنية بنية طلاقها.", "image": null, "explanation": null},
      {"id": "b", "text": "أن يزوج الرجل موليته لآخر على أن يزوجه الآخر موليته ولا مهر بينهما.", "image": null, "explanation": null},
      {"id": "c", "text": "الزواج لفترة محددة بالاتفاق.", "image": null, "explanation": null},
      {"id": "d", "text": "زواج الرجل من أخت زوجته المتوفاة.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو الحكم الشرعي لخطبة المسلم على خطبة أخيه المسلم؟", "image": null},
    "options": [
      {"id": "a", "text": "مباح إذا كان الخاطب الثاني أغنى.", "image": null, "explanation": null},
      {"id": "b", "text": "مستحب للتنافس.", "image": null, "explanation": null},
      {"id": "c", "text": "محرم حتى يترك الخاطب الأول أو يأذن.", "image": null, "explanation": null},
      {"id": "d", "text": "مكروه كراهة تنزيه.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "حث النبي ﷺ على النظر إلى المخطوبة لأنه:", "image": null},
    "options": [
      {"id": "a", "text": "أحرى أن يؤدم (يدوم) بينهما.", "image": null, "explanation": null},
      {"id": "b", "text": "شرط لصحة عقد النكاح.", "image": null, "explanation": null},
      {"id": "c", "text": "واجب لا يصح النكاح إلا به.", "image": null, "explanation": null},
      {"id": "d", "text": "تقليد اجتماعي.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من الشروط الشرعية عند النظر إلى المخطوبة:", "image": null},
    "options": [
      {"id": "a", "text": "أن يكون في خلوة تامة بينهما.", "image": null, "explanation": null},
      {"id": "b", "text": "أن ينظر إليها بشهوة.", "image": null, "explanation": null},
      {"id": "c", "text": "أن يقتصر النظر على ما يظهر غالباً (كالوجه واليدين).", "image": null, "explanation": null},
      {"id": "d", "text": "أن تخرج معه في نزهة عامة.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "المحرمات من النساء تحريماً مؤبداً بسبب \"النسب\" يشمل:", "image": null},
    "options": [
      {"id": "a", "text": "أخت الزوجة.", "image": null, "explanation": null},
      {"id": "b", "text": "العمات والخالات.", "image": null, "explanation": null},
      {"id": "c", "text": "زوجة الأخ.", "image": null, "explanation": null},
      {"id": "d", "text": "ابنة الخال.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي من هؤلاء النساء يحرم على الرجل الزواج بها تحريماً \"مؤقتاً\"؟", "image": null},
    "options": [
      {"id": "a", "text": "أم الزوجة.", "image": null, "explanation": null},
      {"id": "b", "text": "زوجة الابن.", "image": null, "explanation": null},
      {"id": "c", "text": "أخت الزوجة (الجمع بين الأختين).", "image": null, "explanation": null},
      {"id": "d", "text": "بنت الأخ.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يحرم من الرضاعة ما يحرم من:", "image": null},
    "options": [
      {"id": "a", "text": "المصاهرة.", "image": null, "explanation": null},
      {"id": "b", "text": "الجوار.", "image": null, "explanation": null},
      {"id": "c", "text": "الولادة (النسب).", "image": null, "explanation": null},
      {"id": "d", "text": "الصداقة.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من الأخلاق المستحبة بين الزوجين \"التودد\"، ويعني:", "image": null},
    "options": [
      {"id": "a", "text": "ترجيح جانب الخير على الشر.", "image": null, "explanation": null},
      {"id": "b", "text": "طلاقة الوجه والتبسم.", "image": null, "explanation": null},
      {"id": "c", "text": "التقرب من الآخر بما يحب قوله وفعله الجالب للمحبة.", "image": null, "explanation": null},
      {"id": "d", "text": "كثرة العتاب.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "هل يشترط إذن المخطوبة أو علمها بجواز نظر الخاطب إليها (عند جمهور الفقهاء)؟", "image": null},
    "options": [
      {"id": "a", "text": "نعم، يشترط إذنها صراحة.", "image": null, "explanation": null},
      {"id": "b", "text": "لا يشترط إذنها أو علمها إذا أمن الفتنة.", "image": null, "explanation": null},
      {"id": "c", "text": "يشترط علمها دون إذنها.", "image": null, "explanation": null},
      {"id": "d", "text": "يحرم النظر إليها مطلقاً.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الرابعة: الزواج، وأحكامه  (الدرس 4)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 4;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو الحكم الأصلي للزواج في الإسلام لمن يملك القدرة ولا يخشى الوقوع في الزنا؟", "image": null},
    "options": [
      {"id": "a", "text": "الوجوب.", "image": null, "explanation": null},
      {"id": "b", "text": "المندوب (المستحب).", "image": null, "explanation": null},
      {"id": "c", "text": "المباح (مستوى واحد مع غيره من المباحات).", "image": null, "explanation": null},
      {"id": "d", "text": "المكروه.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "متى يكون الزواج \"واجباً\" على المسلم؟", "image": null},
    "options": [
      {"id": "a", "text": "إذا بلغ سن العشرين.", "image": null, "explanation": null},
      {"id": "b", "text": "إذا كان يخشى على نفسه الزنا وهو قادر على تكاليف النكاح.", "image": null, "explanation": null},
      {"id": "c", "text": "إذا أمره أصدقاؤه بذلك.", "image": null, "explanation": null},
      {"id": "d", "text": "إذا كان لا يشتهي النساء.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي مما يلي يُعد من \"أركان\" عقد الزواج التي لا ينعقد بدونها؟", "image": null},
    "options": [
      {"id": "a", "text": "المهر الكثيف.", "image": null, "explanation": null},
      {"id": "b", "text": "الإيجاب والقبول.", "image": null, "explanation": null},
      {"id": "c", "text": "إقامة حفل الزفاف (الوليمة).", "image": null, "explanation": null},
      {"id": "d", "text": "توثيق العقد في المحكمة حصراً.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "كيف يكون استئذان \"البكر\" عند إرادة تزويجها؟", "image": null},
    "options": [
      {"id": "a", "text": "بنطقها الصريح بالرفض.", "image": null, "explanation": null},
      {"id": "b", "text": "بسكوتها إقراراً وحياءً.", "image": null, "explanation": null},
      {"id": "c", "text": "لا تُستأذن البكر بل تُجبر.", "image": null, "explanation": null},
      {"id": "d", "text": "بتوكيل محامٍ عنها.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما حكم العقد إذا شرط الزوج عدم دفع مهر لزوجته؟", "image": null},
    "options": [
      {"id": "a", "text": "العقد باطل ويجب فسخه.", "image": null, "explanation": null},
      {"id": "b", "text": "العقد صحيح والشرط فاسد، ولها مهر المثل.", "image": null, "explanation": null},
      {"id": "c", "text": "العقد موقوف على إجازة القاضي.", "image": null, "explanation": null},
      {"id": "d", "text": "العقد صحيح والشرط صحيح ولا شيء لها.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "نكاح \"المتعة\" (الزواج المؤقت بمدة معينة) حكمه في الإسلام:", "image": null},
    "options": [
      {"id": "a", "text": "محرم باطل ومنسوخ بالإجماع.", "image": null, "explanation": null},
      {"id": "b", "text": "مباح عند الحاجة.", "image": null, "explanation": null},
      {"id": "c", "text": "مكروه كراهة تنزيه.", "image": null, "explanation": null},
      {"id": "d", "text": "واجب في السفر.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"العَضْل\" محرم شرعاً، والمقصود به:", "image": null},
    "options": [
      {"id": "a", "text": "إجبار المرأة على الزواج ممن لا ترضاه.", "image": null, "explanation": null},
      {"id": "b", "text": "منع المرأة من التزويج بكفئها إذا طلبت ذلك ورضيت به.", "image": null, "explanation": null},
      {"id": "c", "text": "المغالاة في المهور.", "image": null, "explanation": null},
      {"id": "d", "text": "الزواج بنية الطلاق.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو حكم الزواج بنية الطلاق (أن يضمر الرجل تطليقها بعد مدة)؟", "image": null},
    "options": [
      {"id": "a", "text": "مباح إذا كانت المرأة أجنبية.", "image": null, "explanation": null},
      {"id": "b", "text": "زواج مؤقت باطل (متعة) ومحرم لاشتماله على الغش ومخالفة مقاصد النكاح.", "image": null, "explanation": null},
      {"id": "c", "text": "مستحب للتعفف في السفر.", "image": null, "explanation": null},
      {"id": "d", "text": "مكروه فقط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي من الشروط التالية يُعد شرطاً \"صحيحاً وملزماً\" في عقد النكاح؟", "image": null},
    "options": [
      {"id": "a", "text": "اشتراط الزوج ألا ينفق على زوجته.", "image": null, "explanation": null},
      {"id": "b", "text": "اشتراط الزوجة إكمال دراستها أو استمرارها في وظيفتها.", "image": null, "explanation": null},
      {"id": "c", "text": "اشتراط الزوج أن يطلقها بعد شهر.", "image": null, "explanation": null},
      {"id": "d", "text": "اشتراط الزوجة طلاق ضرتها.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "المغالاة في المهور والإسراف في حفلات الزفاف تعتبر:", "image": null},
    "options": [
      {"id": "a", "text": "من السنة ودليل على الكرم.", "image": null, "explanation": null},
      {"id": "b", "text": "مباحة ولا حرج فيها.", "image": null, "explanation": null},
      {"id": "c", "text": "من أكبر معوقات النكاح ومخالفة لهدي النبي ﷺ القائل: \"خير النكاح أيسره\".", "image": null, "explanation": null},
      {"id": "d", "text": "واجبة لضمان حقوق المرأة.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الخامسة: الحقوق الزوجية المشتركة  (الدرس 5)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 5;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "الحقوق المشتركة بين الزوجين هي:", "image": null},
    "options": [
      {"id": "a", "text": "الحقوق التي يختص بها الزوج فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "الحقوق التي لا يستقل بها طرف عن آخر بل تجب لكل منهما حال مشاركته للآخر.", "image": null, "explanation": null},
      {"id": "c", "text": "الحقوق المالية والتجارية للزوجة.", "image": null, "explanation": null},
      {"id": "d", "text": "الحقوق المتعلقة بحضانة الأطفال بعد الطلاق.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من الحقوق المشتركة \"الاستمتاع والإعفاف\"، فما حكم هجران الزوجة لفراش زوجها بغير عذر شرعي؟", "image": null},
    "options": [
      {"id": "a", "text": "مباح.", "image": null, "explanation": null},
      {"id": "b", "text": "محرم وتستحق اللعنة والوعيد الشديد.", "image": null, "explanation": null},
      {"id": "c", "text": "مكروه كراهة تنزيه.", "image": null, "explanation": null},
      {"id": "d", "text": "خلاف الأولى.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يُحرم الوطء (الجماع) في الإسلام في حالات محددة منها:", "image": null},
    "options": [
      {"id": "a", "text": "فترة الحمل.", "image": null, "explanation": null},
      {"id": "b", "text": "وقت صيام التطوع.", "image": null, "explanation": null},
      {"id": "c", "text": "فترة الحيض والنفاس وفي نهار رمضان والدبر.", "image": null, "explanation": null},
      {"id": "d", "text": "أثناء السفر.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو \"الإيلاء\"؟", "image": null},
    "options": [
      {"id": "a", "text": "أن يطلق الرجل امرأته ثلاثاً.", "image": null, "explanation": null},
      {"id": "b", "text": "أن يحلف الرجل على ترك وطء زوجته أكثر من أربعة أشهر.", "image": null, "explanation": null},
      {"id": "c", "text": "أن يتهم الرجل زوجته بالزنا.", "image": null, "explanation": null},
      {"id": "d", "text": "أن يعلق طلاقها على شرط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أمثلة \"التعاون على طاعة الله\" بين الزوجين المذكورة في الأحاديث:", "image": null},
    "options": [
      {"id": "a", "text": "إيقاظ أحدهما الآخر لقيام الليل ونضح الماء في وجهه بلطف.", "image": null, "explanation": null},
      {"id": "b", "text": "إجبار الزوجة على العمل خارج المنزل.", "image": null, "explanation": null},
      {"id": "c", "text": "اشتراط الزوج على زوجته عدم زيارة أهلها.", "image": null, "explanation": null},
      {"id": "d", "text": "مراقبة الهاتف الشخصي للطرف الآخر.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "التناهي عن المعصية بين الزوجين يستلزم:", "image": null},
    "options": [
      {"id": "a", "text": "السكوت عن خطأ الآخر إرضاءً له.", "image": null, "explanation": null},
      {"id": "b", "text": "النصح بالكف عن المعصية وبيان مغبتها وعدم السكوت على المنكر.", "image": null, "explanation": null},
      {"id": "c", "text": "فضح المعصية أمام الناس.", "image": null, "explanation": null},
      {"id": "d", "text": "طلب الطلاق فوراً عند أول خطأ.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "إفشاء تفاصيل أسرار الاستمتاع الزوجي للآخرين يُعد في الإسلام:", "image": null},
    "options": [
      {"id": "a", "text": "مباحاً للتعلم.", "image": null, "explanation": null},
      {"id": "b", "text": "مكروهًا.", "image": null, "explanation": null},
      {"id": "c", "text": "محرماً ويُعد فاعله من أشر الناس منزلة يوم القيامة.", "image": null, "explanation": null},
      {"id": "d", "text": "مستحباً للتفاخر.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "حق \"التوارث\" بين الزوجين يثبت:", "image": null},
    "options": [
      {"id": "a", "text": "بعد الدخول فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "بمجرد تمام عقد النكاح الصحيح، ولو قبل الدخول.", "image": null, "explanation": null},
      {"id": "c", "text": "بعد إنجاب الطفل الأول.", "image": null, "explanation": null},
      {"id": "d", "text": "بعد مرور سنة على الزواج.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "مبدأ \"التشاور\" بين الزوجين في إدارة الأسرة يُعد:", "image": null},
    "options": [
      {"id": "a", "text": "أمراً ممدوحاً شرعاً ومستحباً لما فيه من التحرز وقوة الرأي.", "image": null, "explanation": null},
      {"id": "b", "text": "محظوراً لأن القوامة تمنع التشاور.", "image": null, "explanation": null},
      {"id": "c", "text": "واجباً في الأمور المالية فقط.", "image": null, "explanation": null},
      {"id": "d", "text": "دليلاً على ضعف شخصية الزوج.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الاهتمام بالمظهر والتزين:", "image": null},
    "options": [
      {"id": "a", "text": "واجب على الزوجة ومحرم على الزوج.", "image": null, "explanation": null},
      {"id": "b", "text": "مستحب للزوجين وهو حق لكليهما، عملاً بقوله تعالى: (وَلَهُنَّ مِثْلُ الَّذِي عَلَيْهِنَّ بِالْمَعْرُوفِ).", "image": null, "explanation": null},
      {"id": "c", "text": "غير مشروع في الإسلام لأنه من زينة الدنيا.", "image": null, "explanation": null},
      {"id": "d", "text": "مقتصر على أيام الأعياد فقط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

end $$;
