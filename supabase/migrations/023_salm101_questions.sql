-- سلم 101: أصول الثقافة الإسلامية – 50 سؤال (الفصول 1-5)
-- Questions are inserted into lessons 1-5 of سلم 101 (10 questions per lesson/chapter).

do $$
declare
  v_owner   uuid;
  v_subject uuid;
  v_lesson  uuid;
begin
  select id into v_owner from public.profiles where role = 'owner' order by created_at limit 1;
  select id into v_subject from public.subjects where name = 'سلم 101';

  if v_subject is null then
    raise exception 'Subject سلم 101 not found';
  end if;

  -- ═══════════════════════════════════════════════════════════
  -- الفصل الأول: تعريف الثقافة  (الدرس 1)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 1;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "المعنى اللغوي لكلمة \"ثقافة\" المشتقة من (ثقف) في المعاجم العربية يدور حول:", "image": null},
    "options": [
      {"id": "a", "text": "الزراعة واستنبات الأرض", "image": null, "explanation": null},
      {"id": "b", "text": "الحذق والفطنة وسرعة الأخذ والتعلم", "image": null, "explanation": null},
      {"id": "c", "text": "التقدم الصناعي والعمراني", "image": null, "explanation": null},
      {"id": "d", "text": "الأخلاق والآداب العامة", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أوائل من استعمل كلمة \"ثقافة\" (Culture) بمعناها المجازي (فلاحة العقل) في العهد الروماني:", "image": null},
    "options": [
      {"id": "a", "text": "تايلور", "image": null, "explanation": null},
      {"id": "b", "text": "شيشرون", "image": null, "explanation": null},
      {"id": "c", "text": "رالف لينتون", "image": null, "explanation": null},
      {"id": "d", "text": "مالك بن نبي", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "عرّف مجمع اللغة العربية بالقاهرة الثقافة بأنها:", "image": null},
    "options": [
      {"id": "a", "text": "العلوم والمعارف والفنون التي يُطلب الحذق فيها", "image": null, "explanation": null},
      {"id": "b", "text": "التطور الصناعي للأمم", "image": null, "explanation": null},
      {"id": "c", "text": "نمط الحياة في المدينة", "image": null, "explanation": null},
      {"id": "d", "text": "مجموعة العادات والتقاليد فقط", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الثقافة بمعناها \"النوعي\" الخاص بالأمم تعني أنها:", "image": null},
    "options": [
      {"id": "a", "text": "تراث بشري مشاع بين جميع الأمم بلا تمييز", "image": null, "explanation": null},
      {"id": "b", "text": "تختص بالعلوم التجريبية والتطبيقية", "image": null, "explanation": null},
      {"id": "c", "text": "اصطلاح يجسد خصائص كل أمة ويبرز مقوماتها العقدية والفكرية", "image": null, "explanation": null},
      {"id": "d", "text": "مرادفة لمصطلح المدنية المادية", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يُعرّف علم الثقافة الإسلامية اصطلاحاً بأنه:", "image": null},
    "options": [
      {"id": "a", "text": "العلم الذي يدرس الأحكام الفقهية العملية", "image": null, "explanation": null},
      {"id": "b", "text": "العلم بمنهاج الإسلام الشمولي في القيم والنظم والفكر، ونقد التراث الإنساني", "image": null, "explanation": null},
      {"id": "c", "text": "العلم الذي يهتم بجمع الأحاديث النبوية", "image": null, "explanation": null},
      {"id": "d", "text": "العلم الذي يبحث في الفنون المعمارية الإسلامية", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "وردت مادة (ثقف) في القرآن الكريم في قوله تعالى: (فَإِمَّا تَثْقَفَنَّهُمْ فِي الْحَرْبِ...) بمعنى:", "image": null},
    "options": [
      {"id": "a", "text": "تعلمهم", "image": null, "explanation": null},
      {"id": "b", "text": "تظفر بهم وتدركهم", "image": null, "explanation": null},
      {"id": "c", "text": "تحاورهم", "image": null, "explanation": null},
      {"id": "d", "text": "تقرأ عليهم", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "قول ابن السكيت: \"رجل ثقف لقف\" يعني:", "image": null},
    "options": [
      {"id": "a", "text": "ضابطاً لما يحويه قائماً به (واسع المعرفة)", "image": null, "explanation": null},
      {"id": "b", "text": "كثير السفر والترحال", "image": null, "explanation": null},
      {"id": "c", "text": "محارباً شجاعاً", "image": null, "explanation": null},
      {"id": "d", "text": "شاعراً فصيحاً", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "علم الثقافة الإسلامية يعتبر الجسر الذي يربط بين:", "image": null},
    "options": [
      {"id": "a", "text": "العلوم التجريبية والعلوم النظرية", "image": null, "explanation": null},
      {"id": "b", "text": "الماضي والحاضر والمستقبل المنشود", "image": null, "explanation": null},
      {"id": "c", "text": "الحضارة اليونانية والإسلامية", "image": null, "explanation": null},
      {"id": "d", "text": "الاقتصاد والسياسة", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أهداف علم الثقافة الإسلامية بناء ملكة في المسلم تجعله يميز بين الغث والسمين، وهي ملكة:", "image": null},
    "options": [
      {"id": "a", "text": "النقد الصحيح", "image": null, "explanation": null},
      {"id": "b", "text": "الحفظ السريع", "image": null, "explanation": null},
      {"id": "c", "text": "الجدل والمراء", "image": null, "explanation": null},
      {"id": "d", "text": "التقليد الأعمى", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "تعريف تايلور للثقافة يتسم بـ:", "image": null},
    "options": [
      {"id": "a", "text": "التركيز على الدين فقط", "image": null, "explanation": null},
      {"id": "b", "text": "العمومية، حيث يشمل المعرفة والعقائد والفن والأخلاق والقانون", "image": null, "explanation": null},
      {"id": "c", "text": "النوعية والخصوصية الإسلامية", "image": null, "explanation": null},
      {"id": "d", "text": "استبعاد الجانب الأخلاقي", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الفصل الثاني: علاقة الثقافة بغيرها  (الدرس 2)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 2;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "يعتبر الدين في الثقافة الإسلامية:", "image": null},
    "options": [
      {"id": "a", "text": "جزءاً ثانوياً متغيراً", "image": null, "explanation": null},
      {"id": "b", "text": "ظاهرة اجتماعية من صنع الإنسان", "image": null, "explanation": null},
      {"id": "c", "text": "الأساس الأول الذي تقوم عليه وتستمد منه ذاتيتها وتصوراتها", "image": null, "explanation": null},
      {"id": "d", "text": "منفصلاً تماماً عن توجيه الحياة", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "النظرة العلمانية الغربية للدين تتمثل في:", "image": null},
    "options": [
      {"id": "a", "text": "جعله المحرك الأساسي للحضارة", "image": null, "explanation": null},
      {"id": "b", "text": "عزل الدين عن الحياة وتوجيه الفكر", "image": null, "explanation": null},
      {"id": "c", "text": "دمجه مع العلوم التجريبية", "image": null, "explanation": null},
      {"id": "d", "text": "فرضه على كافة جوانب الثقافة", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"القيم\" في علم الثقافة تمثل:", "image": null},
    "options": [
      {"id": "a", "text": "المظاهر المادية والتقنية للمجتمع", "image": null, "explanation": null},
      {"id": "b", "text": "المعارف العلمية التجريبية", "image": null, "explanation": null},
      {"id": "c", "text": "الصفات العينية الحسنة الكامنة في الأقوال والأفعال والتي لا تتغير", "image": null, "explanation": null},
      {"id": "d", "text": "النظم السياسية والاقتصادية", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو الفرق الأساسي بين الثقافة و\"العلم\" (بمعنى المعرفة التجريبية)؟", "image": null},
    "options": [
      {"id": "a", "text": "لا يوجد فرق بينهما", "image": null, "explanation": null},
      {"id": "b", "text": "الثقافة ذاتية وخاصة بأمتها، بينما العلم التجريبي مشاع وملْك للبشرية", "image": null, "explanation": null},
      {"id": "c", "text": "العلم يختص بالأخلاق والثقافة تختص بالمادة", "image": null, "explanation": null},
      {"id": "d", "text": "الثقافة تهتم بالجزئيات والعلم يهتم بالكليات", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "تشير \"المدنية\" في الاصطلاح غالباً إلى:", "image": null},
    "options": [
      {"id": "a", "text": "الجانب الروحي والعقائدي", "image": null, "explanation": null},
      {"id": "b", "text": "نمط الحياة في المدينة وما يستلزمه من إنشاءات مادية وتنظيمية", "image": null, "explanation": null},
      {"id": "c", "text": "العلوم الشرعية والفقهية", "image": null, "explanation": null},
      {"id": "d", "text": "الشعر والأدب القديم", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "العلاقة بين الثقافة والمدنية هي علاقة:", "image": null},
    "options": [
      {"id": "a", "text": "تضاد وتنافر", "image": null, "explanation": null},
      {"id": "b", "text": "انفصال تام", "image": null, "explanation": null},
      {"id": "c", "text": "تأثير وتأثر، فالمظاهر المادية للمدنية تنسجم مع معتقدات الإنسان وثقافته", "image": null, "explanation": null},
      {"id": "d", "text": "ترادف تام بلا أي فرق", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يرى المفكر \"مالك بن نبي\" أن الحضارة والثقافة:", "image": null},
    "options": [
      {"id": "a", "text": "متناقضتان تماماً", "image": null, "explanation": null},
      {"id": "b", "text": "الحضارة أعم من الثقافة", "image": null, "explanation": null},
      {"id": "c", "text": "جوهرهما واحد، فالحضارة هي مجموعة من القيم الثقافية المحققة", "image": null, "explanation": null},
      {"id": "d", "text": "الثقافة مادية والحضارة روحية", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الميزة الكبرى للإسلام في علاقته بالعلم والمعرفة أنه:", "image": null},
    "options": [
      {"id": "a", "text": "يكتفي بالعلوم الشرعية فقط", "image": null, "explanation": null},
      {"id": "b", "text": "يحث على ولوج أبواب المعرفة ويشجع التفكير والتأمل", "image": null, "explanation": null},
      {"id": "c", "text": "يرفض العلوم التجريبية", "image": null, "explanation": null},
      {"id": "d", "text": "يفصل بين العلم والدين", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي من الآتي يغلب عليه الجانب المعنوي والروحي والقيمي للأمة؟", "image": null},
    "options": [
      {"id": "a", "text": "المدنية", "image": null, "explanation": null},
      {"id": "b", "text": "الثقافة", "image": null, "explanation": null},
      {"id": "c", "text": "التكنولوجيا", "image": null, "explanation": null},
      {"id": "d", "text": "المعرفة التجريبية", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "انفصال الثقافة عن القيم يؤدي إلى:", "image": null},
    "options": [
      {"id": "a", "text": "التطور السريع", "image": null, "explanation": null},
      {"id": "b", "text": "الضمور في المفاهيم والقصور في النظم", "image": null, "explanation": null},
      {"id": "c", "text": "الإبداع الفكري", "image": null, "explanation": null},
      {"id": "d", "text": "الاندماج مع الحضارات الأخرى", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الفصل الثالث: علم الثقافة (النشأة والمنهج)  (الدرس 3)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 3;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "ثقافة العرب في الجاهلية كانت تعتمد بشكل كبير على:", "image": null},
    "options": [
      {"id": "a", "text": "العلوم التجريبية والنظريات الفلسفية", "image": null, "explanation": null},
      {"id": "b", "text": "الشعر، الخطب، الأمثال، وبقايا دين إبراهيم", "image": null, "explanation": null},
      {"id": "c", "text": "التأليف المنهجي والكتب المترجمة", "image": null, "explanation": null},
      {"id": "d", "text": "الصناعات الدقيقة", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ساهم الإسلام في بناء ونشر الثقافة من خلال:", "image": null},
    "options": [
      {"id": "a", "text": "الحث على التعليم والقراءة (اقرأ)", "image": null, "explanation": null},
      {"id": "b", "text": "تشجيع تعلم لغات الأمم الأخرى", "image": null, "explanation": null},
      {"id": "c", "text": "حركة الفتح الإسلامي والانفتاح الإيجابي", "image": null, "explanation": null},
      {"id": "d", "text": "جميع ما سبق", "image": null, "explanation": null}
    ],
    "correct": "d"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "في المرحلة الأولى (ما قبل تدوين العلوم)، اتسمت ثقافة المسلمين بـ:", "image": null},
    "options": [
      {"id": "a", "text": "النظرة الشمولية للإسلام المستمدة من القرآن", "image": null, "explanation": null},
      {"id": "b", "text": "التخصص الدقيق في كل علم", "image": null, "explanation": null},
      {"id": "c", "text": "التأثر بالفلسفة اليونانية", "image": null, "explanation": null},
      {"id": "d", "text": "الجمود والتقليد", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "العالم الذي ألف كتاب \"حجة الله البالغة\" محاولاً التجديد وعرض الإسلام بمنهج شمولي هو:", "image": null},
    "options": [
      {"id": "a", "text": "أبو حامد الغزالي", "image": null, "explanation": null},
      {"id": "b", "text": "ولي الله الدهلوي", "image": null, "explanation": null},
      {"id": "c", "text": "ابن تيمية", "image": null, "explanation": null},
      {"id": "d", "text": "الشافعي", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "متى بدأ تدريس مادة \"الثقافة الإسلامية\" كعلم مستقل في الجامعات؟", "image": null},
    "options": [
      {"id": "a", "text": "في القرن الأول الهجري", "image": null, "explanation": null},
      {"id": "b", "text": "في العصر العباسي", "image": null, "explanation": null},
      {"id": "c", "text": "في العصر الحديث (1954م بجامعة دمشق)", "image": null, "explanation": null},
      {"id": "d", "text": "في الأندلس", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من الأسباب التي دعت إلى تأسيس علم الثقافة الإسلامية في العصر الحديث:", "image": null},
    "options": [
      {"id": "a", "text": "الاستغناء عن العلوم الفقهية", "image": null, "explanation": null},
      {"id": "b", "text": "التصدي للغزو الثقافي الغربي والاستشراق وإبراز شمولية الإسلام", "image": null, "explanation": null},
      {"id": "c", "text": "الدعوة للانغلاق عن العالم", "image": null, "explanation": null},
      {"id": "d", "text": "إلغاء تدريس العقيدة", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من سمات منهج علم الثقافة الإسلامية \"الشمولية\"، وتعني:", "image": null},
    "options": [
      {"id": "a", "text": "دراسة الأحكام الفقهية بالتفصيل الممل", "image": null, "explanation": null},
      {"id": "b", "text": "التناول الكلي للموضوع باعتباره وحدة مترابطة تتداخل عناصرها", "image": null, "explanation": null},
      {"id": "c", "text": "الاكتفاء بالجانب الروحي فقط", "image": null, "explanation": null},
      {"id": "d", "text": "دراسة التاريخ بمعزل عن الدين", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من سمات منهج علم الثقافة \"التأصيل\"، ويقصد به:", "image": null},
    "options": [
      {"id": "a", "text": "نقد التراث البشري", "image": null, "explanation": null},
      {"id": "b", "text": "الاعتماد في بناء التصور على الكتاب والسنة وفهم سلف الأمة", "image": null, "explanation": null},
      {"id": "c", "text": "المقارنة مع الأديان الأخرى", "image": null, "explanation": null},
      {"id": "d", "text": "الاعتماد على الفلسفة الغربية", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "السمة التي تبرز كفاية الإسلام وكماله وقدرته على تحقيق إنسانية الإنسان من خلال عرضه مقابل المبادئ الأخرى تسمى:", "image": null},
    "options": [
      {"id": "a", "text": "التأصيل", "image": null, "explanation": null},
      {"id": "b", "text": "النقد", "image": null, "explanation": null},
      {"id": "c", "text": "المقارنة", "image": null, "explanation": null},
      {"id": "d", "text": "الشمولية", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "النقد في منهج الثقافة الإسلامية يعتبر:", "image": null},
    "options": [
      {"id": "a", "text": "عملية هدم وتشويه للآخر فقط", "image": null, "explanation": null},
      {"id": "b", "text": "نقداً إيجابياً بناءً يقوم على الهدم للباطل والانتقاء للنافع", "image": null, "explanation": null},
      {"id": "c", "text": "مجرد مقارنة تاريخية", "image": null, "explanation": null},
      {"id": "d", "text": "قبول كل ما يأتي من الخارج دون فحص", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الفصل الرابع: أهمية علم الثقافة الإسلامية وخصائصه  (الدرس 4)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 4;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "من أبرز فوائد دراسة علم الثقافة الإسلامية:", "image": null},
    "options": [
      {"id": "a", "text": "المحافظة على سمات شخصية الأمة من التلاشي والذوبان", "image": null, "explanation": null},
      {"id": "b", "text": "تشجيع التغريب في المجتمع", "image": null, "explanation": null},
      {"id": "c", "text": "إضعاف الانتماء الديني", "image": null, "explanation": null},
      {"id": "d", "text": "التركيز على الجانب المادي فقط", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "إحدى خصائص الثقافة الإسلامية أنها \"ربانية المصدر\"، وهذا يعني:", "image": null},
    "options": [
      {"id": "a", "text": "أنها اجتهاد بشري بحت", "image": null, "explanation": null},
      {"id": "b", "text": "أنها تعتمد على العقل والتجربة فقط", "image": null, "explanation": null},
      {"id": "c", "text": "أنها تستمد مبادئها من الوحي (القرآن والسنة) المعصوم من الخطأ", "image": null, "explanation": null},
      {"id": "d", "text": "أنها تتأثر بالأساطير القديمة", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الخاصية التي تعني أن الثقافة الإسلامية ترتكز على أركان الإيمان الستة وتنبثق منها أحكامها هي:", "image": null},
    "options": [
      {"id": "a", "text": "السلوكية", "image": null, "explanation": null},
      {"id": "b", "text": "الإنسانية", "image": null, "explanation": null},
      {"id": "c", "text": "عقدية الاتجاه", "image": null, "explanation": null},
      {"id": "d", "text": "العالمية", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الثقافة الإسلامية تتميز بأنها \"أصيلة\"، والمقصود بذلك:", "image": null},
    "options": [
      {"id": "a", "text": "أنها تطورت عن الفلسفة الرومانية", "image": null, "explanation": null},
      {"id": "b", "text": "أنها ذات نشأة مستقلة مرتبطة بالوحي ولم تتولد عن ثقافات أخرى", "image": null, "explanation": null},
      {"id": "c", "text": "أنها قديمة ولا تصلح للعصر الحاضر", "image": null, "explanation": null},
      {"id": "d", "text": "أنها ترفض كل حديث ومبتكر", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من خصائص الثقافة الإسلامية \"الواقعية\"، وتتجلى في:", "image": null},
    "options": [
      {"id": "a", "text": "التنكر لمطالب الجسد", "image": null, "explanation": null},
      {"id": "b", "text": "الاعتراف بمكونات الإنسان (جسد، عقل، روح) وتلبية أشواقه في حدود الشرع", "image": null, "explanation": null},
      {"id": "c", "text": "الخيال والمثالية التي لا يمكن تطبيقها", "image": null, "explanation": null},
      {"id": "d", "text": "إهمال النوازع الفطرية", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "التوازن في الثقافة الإسلامية يعني:", "image": null},
    "options": [
      {"id": "a", "text": "التركيز على الآخرة وإهمال الدنيا تماماً", "image": null, "explanation": null},
      {"id": "b", "text": "التركيز على الدنيا وإهمال الآخرة", "image": null, "explanation": null},
      {"id": "c", "text": "التوفيق بين روح الإنسان وجسده، وبين دنياه وآخرته دون طغيان جانب", "image": null, "explanation": null},
      {"id": "d", "text": "المساواة بين الحق والباطل", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "تعتبر الثقافة الإسلامية \"سلوكية\"، لأنها:", "image": null},
    "options": [
      {"id": "a", "text": "تفصل بين القول والفعل", "image": null, "explanation": null},
      {"id": "b", "text": "تبقى مجرد أفكار نظرية خيالية", "image": null, "explanation": null},
      {"id": "c", "text": "تترجم الأفكار والقيم إلى واقع عملي وقانون سلوكي", "image": null, "explanation": null},
      {"id": "d", "text": "تعتمد على علم النفس الغربي", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الخاصية التي تجعل الثقافة الإسلامية تخاطب البشر جميعاً وتتخطى حدود الجنس والزمن والأرض هي:", "image": null},
    "options": [
      {"id": "a", "text": "الإنسانية والعالمية", "image": null, "explanation": null},
      {"id": "b", "text": "المحلية", "image": null, "explanation": null},
      {"id": "c", "text": "الإقليمية", "image": null, "explanation": null},
      {"id": "d", "text": "العصبية", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يساهم علم الثقافة الإسلامية في بناء \"الأمن النفسي\" للفرد المسلم من خلال:", "image": null},
    "options": [
      {"id": "a", "text": "التخويف المستمر من المستقبل", "image": null, "explanation": null},
      {"id": "b", "text": "تأكيد انتمائه لجماعة المسلمين وتوثيق صلته بقيمه ومبادئه", "image": null, "explanation": null},
      {"id": "c", "text": "عزله عن المجتمع", "image": null, "explanation": null},
      {"id": "d", "text": "تشكيكه في مصادر دينه", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "نص ميثاق المنظمة الإسلامية للعلوم والتربية والثقافة (الإيسيسكو) على:", "image": null},
    "options": [
      {"id": "a", "text": "جعل الثقافة الإسلامية محور مناهج التعليم في جميع مراحله ومستوياته", "image": null, "explanation": null},
      {"id": "b", "text": "إلغاء مقررات الثقافة الإسلامية", "image": null, "explanation": null},
      {"id": "c", "text": "اقتصار الثقافة الإسلامية على المساجد", "image": null, "explanation": null},
      {"id": "d", "text": "دمج الثقافة الإسلامية مع الفلسفة الغربية", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الفصل الخامس: مصادر علم الثقافة الإسلامية ومحاوره  (الدرس 5)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 5;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "المصدر الأول والأساسي لعلم الثقافة الإسلامية هو:", "image": null},
    "options": [
      {"id": "a", "text": "العقل والتجربة", "image": null, "explanation": null},
      {"id": "b", "text": "الوحي (القرآن والسنة)", "image": null, "explanation": null},
      {"id": "c", "text": "التراث البشري", "image": null, "explanation": null},
      {"id": "d", "text": "العادات والتقاليد", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من سمات أسلوب \"القرآن الكريم\" في عرضه للتشريعات والقيم:", "image": null},
    "options": [
      {"id": "a", "text": "التفصيل الدقيق لكل الجزئيات الفقهية", "image": null, "explanation": null},
      {"id": "b", "text": "الأسلوب الإجمالي الذي يضع القواعد العامة والثابتة", "image": null, "explanation": null},
      {"id": "c", "text": "اقتصاره على مخاطبة العرب فقط", "image": null, "explanation": null},
      {"id": "d", "text": "إهمال القضايا الإنسانية", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أسلوب \"السنة النبوية\" يتميز غالباً بـ:", "image": null},
    "options": [
      {"id": "a", "text": "الإجمال والاختصار الشديد", "image": null, "explanation": null},
      {"id": "b", "text": "عدم التطرق للأمور العملية", "image": null, "explanation": null},
      {"id": "c", "text": "البيان والتفصيل لمجمل القرآن الكريم وتفريع الجزئيات", "image": null, "explanation": null},
      {"id": "d", "text": "الاقتصار على العقيدة فقط", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من ثمرات اعتماد الثقافة الإسلامية على الوحي:", "image": null},
    "options": [
      {"id": "a", "text": "الصحة والصدق في القضايا الغيبية والعصمة من الزلل", "image": null, "explanation": null},
      {"id": "b", "text": "التشكيك في المعارف الإنسانية", "image": null, "explanation": null},
      {"id": "c", "text": "التناقض مع العقل السليم", "image": null, "explanation": null},
      {"id": "d", "text": "إلغاء دور العقل البشري تماماً", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "المصدر الثاني للثقافة الإسلامية وهو \"التراث الإسلامي\" يشمل:", "image": null},
    "options": [
      {"id": "a", "text": "الأساطير والخرافات القديمة", "image": null, "explanation": null},
      {"id": "b", "text": "ما خلفه علماء المسلمين من إجماع وقياس وتفسير وتاريخ وحضارة", "image": null, "explanation": null},
      {"id": "c", "text": "الفلسفات اليونانية القديمة", "image": null, "explanation": null},
      {"id": "d", "text": "القوانين الوضعية الحديثة", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "كيف تنظر الثقافة الإسلامية إلى \"الخبرات الإنسانية النافعة\" (العقل والعلوم)؟", "image": null},
    "options": [
      {"id": "a", "text": "ترفضها رفضاً قاطعاً", "image": null, "explanation": null},
      {"id": "b", "text": "تقدمها على نصوص الوحي", "image": null, "explanation": null},
      {"id": "c", "text": "تستند إليها كمصدر إضافي بشرط ألا تتعارض مع نصوص الوحي وألا تكون مضرة", "image": null, "explanation": null},
      {"id": "d", "text": "تعتبرها المصدر الوحيد للتشريع", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "لماذا لا يستقل العقل وحده في تأسيس ثقافة المجتمع الإسلامي؟", "image": null},
    "options": [
      {"id": "a", "text": "لأن العقل لا يخطئ أبداً", "image": null, "explanation": null},
      {"id": "b", "text": "لأن العقل محدود، والناس متفاوتون في إدراكهم وتغلب عليهم الأهواء أحياناً", "image": null, "explanation": null},
      {"id": "c", "text": "لأن الإسلام يرفض التفكير", "image": null, "explanation": null},
      {"id": "d", "text": "لأن العقل محصور في القضايا الغيبية فقط", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "المحور الثقافي الذي يُعنى بدراسة قضايا الألوهية، العبادة، الأخلاق، الاقتصاد، والسياسة يُسمى محور:", "image": null},
    "options": [
      {"id": "a", "text": "المذهبيات الفكرية", "image": null, "explanation": null},
      {"id": "b", "text": "القيم", "image": null, "explanation": null},
      {"id": "c", "text": "النظم", "image": null, "explanation": null},
      {"id": "d", "text": "المفاهيم", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "دراسة الرأسمالية، الاشتراكية، العلمانية، والعولمة في الثقافة الإسلامية تندرج تحت محور:", "image": null},
    "options": [
      {"id": "a", "text": "النظم الإسلامية", "image": null, "explanation": null},
      {"id": "b", "text": "المذهبيات الفكرية المعاصرة", "image": null, "explanation": null},
      {"id": "c", "text": "القيم الأخلاقية", "image": null, "explanation": null},
      {"id": "d", "text": "التراث الإسلامي", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يقصد بمحور \"القيم\" في علم الثقافة الإسلامية:", "image": null},
    "options": [
      {"id": "a", "text": "التشريعات والأعراف التي تقوم عليها الدولة", "image": null, "explanation": null},
      {"id": "b", "text": "الأحكام الثابتة التي تقوّم سلوكيات الناس مثل الحق، العدل، والصدق", "image": null, "explanation": null},
      {"id": "c", "text": "النظريات المادية الحديثة", "image": null, "explanation": null},
      {"id": "d", "text": "التطور الصناعي والتكنولوجي", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

end $$;
