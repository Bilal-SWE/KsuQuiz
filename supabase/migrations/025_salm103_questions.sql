-- سلم 103: النظام الاقتصادي الإسلامي – 50 سؤال (الوحدات 1-5)
-- Questions are inserted into lessons 1-5 of سلم 103 (10 questions per lesson/unit).

do $$
declare
  v_owner   uuid;
  v_subject uuid;
  v_lesson  uuid;
begin
  select id into v_owner from public.profiles where role = 'owner' order by created_at limit 1;
  select id into v_subject from public.subjects where name = 'سلم 103';

  if v_subject is null then
    raise exception 'Subject سلم 103 not found';
  end if;

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الأولى: تعريف النظام الاقتصادي الإسلامي ونشأته وأهدافه  (الدرس 1)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 1;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "يُعرّف النظام الاقتصادي الإسلامي بأنه مجموعة القواعد والأحكام الشرعية المتعلقة بـ:", "image": null},
    "options": [
      {"id": "a", "text": "العبادات والمعاملات الفقهية البحتة.", "image": null, "explanation": null},
      {"id": "b", "text": "ضبط العلاقات المالية واستغلال الثروات.", "image": null, "explanation": null},
      {"id": "c", "text": "تنظيم السياسة الخارجية للدولة.", "image": null, "explanation": null},
      {"id": "d", "text": "تطوير الصناعات الثقيلة فقط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ينقسم النظام الاقتصادي الإسلامي إلى قسمين هما:", "image": null},
    "options": [
      {"id": "a", "text": "قسم قديم وقسم حديث.", "image": null, "explanation": null},
      {"id": "b", "text": "قسم عقائدي وقسم أخلاقي.", "image": null, "explanation": null},
      {"id": "c", "text": "قسم ثابت (مستمد من الكتاب والسنة) وقسم مرن (متغير وفقاً للمصالح).", "image": null, "explanation": null},
      {"id": "d", "text": "قسم زراعي وقسم صناعي.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من التطبيقات الاقتصادية للنبي ﷺ لمعالجة ضعف الدخل الفردي للمهاجرين في المدينة:", "image": null},
    "options": [
      {"id": "a", "text": "فرض الضرائب الباهظة.", "image": null, "explanation": null},
      {"id": "b", "text": "المؤاخاة بينهم وبين الأنصار والحث على العمل.", "image": null, "explanation": null},
      {"id": "c", "text": "الاعتماد على قروض خارجية.", "image": null, "explanation": null},
      {"id": "d", "text": "احتكار التجارة للدولة.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "كيف حقق النبي ﷺ الاستقلال الاقتصادي للمسلمين في المدينة؟", "image": null},
    "options": [
      {"id": "a", "text": "بالاعتماد الكلي على أسواق الروم.", "image": null, "explanation": null},
      {"id": "b", "text": "بمصادرة أموال التجار في المدينة.", "image": null, "explanation": null},
      {"id": "c", "text": "بإنشاء سوق جديد للمسلمين تسود فيه قيم ومبادئ الإسلام.", "image": null, "explanation": null},
      {"id": "d", "text": "بمنع التجارة نهائياً والاعتماد على الزراعة.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "في أي عهد من عهود الدولة الإسلامية ظهرت \"الميزانية، والسفاتج، والمصارف، والدواوين\"؟", "image": null},
    "options": [
      {"id": "a", "text": "العهد النبوي.", "image": null, "explanation": null},
      {"id": "b", "text": "عهد الخلافة الراشدة.", "image": null, "explanation": null},
      {"id": "c", "text": "عهد ما قبل الإسلام.", "image": null, "explanation": null},
      {"id": "d", "text": "عهد ما بعد الخلافة الراشدة.", "image": null, "explanation": null}
    ],
    "correct": "d"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو الموقف الصحيح إذا انحسر تطبيق بعض أحكام الاقتصاد الإسلامي في دولة ما؟", "image": null},
    "options": [
      {"id": "a", "text": "يُحكم على النظام الاقتصادي الإسلامي بعدم الصلاحية.", "image": null, "explanation": null},
      {"id": "b", "text": "يُوصف اقتصاد الدولة بأنه غير إسلامي في هذه الجزئية فقط، ولا تلازم بين الحكم بكون النظام إسلامياً وتطبيقه بالكامل.", "image": null, "explanation": null},
      {"id": "c", "text": "تُعتبر الدولة كافرة بالنظام المالي.", "image": null, "explanation": null},
      {"id": "d", "text": "يُلغى النظام الاقتصادي كاملاً ويُستبدل بنظام أجنبي.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أهداف النظام الاقتصادي الإسلامي (عمارة الأرض واستثمار خيراتها) استناداً لقوله تعالى:", "image": null},
    "options": [
      {"id": "a", "text": "(هُوَ أَنشَأَكُم مِّنَ الْأَرْضِ وَاسْتَعْمَرَكُمْ فِيهَا).", "image": null, "explanation": null},
      {"id": "b", "text": "(وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا).", "image": null, "explanation": null},
      {"id": "c", "text": "(وَلَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ).", "image": null, "explanation": null},
      {"id": "d", "text": "(إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ...).", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يسعى النظام الاقتصادي الإسلامي للحد من التفاوت الكبير في المعيشة عبر:", "image": null},
    "options": [
      {"id": "a", "text": "مصادرة أموال الأغنياء بالقوة.", "image": null, "explanation": null},
      {"id": "b", "text": "منع الملكية الخاصة تماماً.", "image": null, "explanation": null},
      {"id": "c", "text": "عقود التبرعات كالصدقة والوقف والوصية.", "image": null, "explanation": null},
      {"id": "d", "text": "تحديد رواتب متساوية لجميع الأفراد بغض النظر عن عملهم.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"الفيء\" في النظام الاقتصادي الإسلامي هو:", "image": null},
    "options": [
      {"id": "a", "text": "ما يؤخذ من المسلمين كضريبة.", "image": null, "explanation": null},
      {"id": "b", "text": "ما رده الله على أهل دينه من أموال من خالفهم بلا قتال.", "image": null, "explanation": null},
      {"id": "c", "text": "الأموال المستخرجة من باطن الأرض (المعادن).", "image": null, "explanation": null},
      {"id": "d", "text": "الأموال المتروكة بلا وارث.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أهداف النظام الاقتصادي الإسلامي \"تحقيق الغنى\" ودفع الفرد للاستغناء عن سؤال الناس، ويدل على ذلك قول النبي ﷺ:", "image": null},
    "options": [
      {"id": "a", "text": "(لأن يحتطب أحدكم حزمة على ظهره، خير له من أن يسأل أحداً).", "image": null, "explanation": null},
      {"id": "b", "text": "(إنما الأعمال بالنيات).", "image": null, "explanation": null},
      {"id": "c", "text": "(الدين النصيحة).", "image": null, "explanation": null},
      {"id": "d", "text": "(لا ضرر ولا ضرار).", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الثانية: المبادئ الاعتقادية العامة  (الدرس 2)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 2;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "المبدأ الاعتقادي الذي يقر بأن الله هو المالك الحقيقي للمال وأن ملكية الإنسان تابعة لملكية الله هو مبدأ:", "image": null},
    "options": [
      {"id": "a", "text": "كفاية الخيرات.", "image": null, "explanation": null},
      {"id": "b", "text": "الإيمان بالقضاء والقدر.", "image": null, "explanation": null},
      {"id": "c", "text": "المال مال الله.", "image": null, "explanation": null},
      {"id": "d", "text": "المال وسيلة لطاعة الله.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ينظر الإسلام إلى ملكية الإنسان للمال على أنها ملكية:", "image": null},
    "options": [
      {"id": "a", "text": "مطلقة بلا أي قيود.", "image": null, "explanation": null},
      {"id": "b", "text": "ملكية انتفاع واستخلاف خاضعة لضوابط الشريعة.", "image": null, "explanation": null},
      {"id": "c", "text": "ملكية مؤقتة تنتهي بمرور سنة.", "image": null, "explanation": null},
      {"id": "d", "text": "ملكية جماعية لا نصيب للفرد فيها.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي من الآتي يمثل نظرة النظام الاقتصادي الإسلامي لـ \"المشكلة الاقتصادية\"؟", "image": null},
    "options": [
      {"id": "a", "text": "هي مشكلة ندرة الموارد الطبيعية وعجز الطبيعة.", "image": null, "explanation": null},
      {"id": "b", "text": "هي مشكلة سلوكية تتمثل في سوء استغلال وتوزيع الثروة والظلم والإسراف.", "image": null, "explanation": null},
      {"id": "c", "text": "هي مشكلة زيادة عدد السكان بشكل لا يمكن السيطرة عليه.", "image": null, "explanation": null},
      {"id": "d", "text": "هي مشكلة نقص في التشريعات الربوية.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "تسخير البشر بعضهم لبعض (لِيَتَّخِذَ بَعْضُهُم بَعْضًا سُخْرِيًّا) يعني:", "image": null},
    "options": [
      {"id": "a", "text": "الاستعباد والقهر.", "image": null, "explanation": null},
      {"id": "b", "text": "السخرية والاستهزاء بالآخرين.", "image": null, "explanation": null},
      {"id": "c", "text": "أن يخدم بعضهم بعضاً وتتكامل أدوارهم (فالأغنياء مسخرون للفقراء والعكس).", "image": null, "explanation": null},
      {"id": "d", "text": "أن يعمل الفقراء بدون مقابل.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "كيف ينظر الإسلام إلى \"المال\" بالنسبة للمسلم؟", "image": null},
    "options": [
      {"id": "a", "text": "غاية في حد ذاته يجب السعي لها بأي وسيلة.", "image": null, "explanation": null},
      {"id": "b", "text": "شر محض يجب التخلص منه.", "image": null, "explanation": null},
      {"id": "c", "text": "وسيلة لطاعة الله وعبادته وللاستعانة به على فعل الخيرات.", "image": null, "explanation": null},
      {"id": "d", "text": "مقصور على فئة الأغنياء فقط.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ضرب القرآن الكريم مثلاً لمن طغى بماله ونسي حق الله فيه وأرجع الفضل لعلمه بـ:", "image": null},
    "options": [
      {"id": "a", "text": "فرعون.", "image": null, "explanation": null},
      {"id": "b", "text": "أصحاب الكهف.", "image": null, "explanation": null},
      {"id": "c", "text": "قارون.", "image": null, "explanation": null},
      {"id": "d", "text": "هامان.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الإيمان بأن \"الله هو واهب الأرزاق جميعاً\" يثمر في نفس المسلم:", "image": null},
    "options": [
      {"id": "a", "text": "التواكل وترك العمل.", "image": null, "explanation": null},
      {"id": "b", "text": "المضي في السعي لطلب الرزق بنفس هادئة وبذل المال باعتدال دون خوف من الفقر.", "image": null, "explanation": null},
      {"id": "c", "text": "الحرص الشديد والبخل بالمال.", "image": null, "explanation": null},
      {"id": "d", "text": "التعدي على أموال الآخرين لزيادة الرزق.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "معيار الربح في النظام الاقتصادي الإسلامي مقارنة بالنظم الوضعية:", "image": null},
    "options": [
      {"id": "a", "text": "يهتم بالمردود المادي فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "يُقدم المسلم أحياناً على عمل بلا مردود مادي (كالقرض الحسن) احتساباً للأجر الأخروي.", "image": null, "explanation": null},
      {"id": "c", "text": "يمنع الأرباح المالية نهائياً.", "image": null, "explanation": null},
      {"id": "d", "text": "يعتمد على الفوائد الربوية.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الإيمان بالقضاء والقدر في الجانب الاقتصادي يقتضي:", "image": null},
    "options": [
      {"id": "a", "text": "الرضا بما قسم الله مع الأخذ بالأسباب (أخذ الحلال وترك الحرام).", "image": null, "explanation": null},
      {"id": "b", "text": "الجلوس في المنزل وانتظار الرزق.", "image": null, "explanation": null},
      {"id": "c", "text": "السخط عند الخسارة التجارية.", "image": null, "explanation": null},
      {"id": "d", "text": "العمل في المجالات المحرمة إذا لم يتوفر الحلال.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "حديث (لا تزول قدما عبد يوم القيامة حتى يُسأل عن...) يوضح أن الحساب على المال يكون من جهتين هما:", "image": null},
    "options": [
      {"id": "a", "text": "مقداره ونوعه.", "image": null, "explanation": null},
      {"id": "b", "text": "جهة الاكتساب (من أين اكتسبه) وجهة الإنفاق (فيم أنفقه).", "image": null, "explanation": null},
      {"id": "c", "text": "زكاته وصدقاته فقط.", "image": null, "explanation": null},
      {"id": "d", "text": "إرثه ووصيته فقط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الثالثة: المبادئ الأخلاقية والتشريعية العامة  (الدرس 3)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 3;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "خُلق \"السماحة\" في الاقتصاد الإسلامي يتمثل في:", "image": null},
    "options": [
      {"id": "a", "text": "التنازل عن كل الأموال للآخرين.", "image": null, "explanation": null},
      {"id": "b", "text": "السهولة والجود وعدم الإلحاح في البيع والشراء والاقتضاء.", "image": null, "explanation": null},
      {"id": "c", "text": "قبول الغش والتدليس من البائع.", "image": null, "explanation": null},
      {"id": "d", "text": "المماطلة في سداد الديون.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من التطبيقات الرائعة لخلق السماحة في الإسلام تجاه المدين المعسر:", "image": null},
    "options": [
      {"id": "a", "text": "مضاعفة الدين عليه.", "image": null, "explanation": null},
      {"id": "b", "text": "سجنه حتى يسدد.", "image": null, "explanation": null},
      {"id": "c", "text": "إنظاره (تأجيله) إلى ميسرة، أو التصدق عليه بالدين وهو الأفضل.", "image": null, "explanation": null},
      {"id": "d", "text": "بيع ممتلكاته الأساسية جبراً.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "خُلق \"القناعة\" في الجانب المادي يعني:", "image": null},
    "options": [
      {"id": "a", "text": "الرضا بالفقر وعدم السعي للعمل.", "image": null, "explanation": null},
      {"id": "b", "text": "ترك التشوف (التطلع) إلى المفقود والاستغناء بالموجود مع عدم الشره.", "image": null, "explanation": null},
      {"id": "c", "text": "بخل الإنسان على نفسه وأهله.", "image": null, "explanation": null},
      {"id": "d", "text": "إنفاق كل المال وعدم ادخار شيء.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "الإيثار هو من أرقى الأخلاق الإسلامية ويعني:", "image": null},
    "options": [
      {"id": "a", "text": "أن يؤثر الإنسان نفسه على غيره دائماً.", "image": null, "explanation": null},
      {"id": "b", "text": "تقديم الغير على النفس، كما فعل الأنصار مع المهاجرين (وَيُؤْثِرُونَ عَلَىٰ أَنفُسِهِمْ وَلَوْ كَانَ بِهِمْ خَصَاصَةٌ).", "image": null, "explanation": null},
      {"id": "c", "text": "المساواة التامة في التوزيع.", "image": null, "explanation": null},
      {"id": "d", "text": "احتكار السلع وقت الأزمات.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "المبدأ التشريعي \"الأمر بالقسط (العدل)\" في المعاملات المالية يقتضي:", "image": null},
    "options": [
      {"id": "a", "text": "العدل فقط مع الأقارب والأصدقاء.", "image": null, "explanation": null},
      {"id": "b", "text": "العدل مع جميع الناس حتى الخصوم (وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا).", "image": null, "explanation": null},
      {"id": "c", "text": "محاباة الفقير لفقره ضد الغني.", "image": null, "explanation": null},
      {"id": "d", "text": "تقديم مصلحة التاجر دائماً.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أنواع \"الأمانة\" في المعاملات المالية في الإسلام:", "image": null},
    "options": [
      {"id": "a", "text": "رد الودائع إلى أربابها.", "image": null, "explanation": null},
      {"id": "b", "text": "عدم الغش.", "image": null, "explanation": null},
      {"id": "c", "text": "حفظ السر وأداء الزكاة.", "image": null, "explanation": null},
      {"id": "d", "text": "جميع ما سبق.", "image": null, "explanation": null}
    ],
    "correct": "d"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"الوفاء بالعقود\" في الإسلام (يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ) يُعد:", "image": null},
    "options": [
      {"id": "a", "text": "مستحباً فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "ملزماً ديانةً وقضاءً، ويشمل جميع العقود المباحة.", "image": null, "explanation": null},
      {"id": "c", "text": "ملزماً قضاءً دون ديانة.", "image": null, "explanation": null},
      {"id": "d", "text": "خاصاً بالعقود المكتوبة فقط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "نهت الشريعة الإسلامية عن أكل أموال اليتامى ظلماً واعتبرته من:", "image": null},
    "options": [
      {"id": "a", "text": "الصغائر.", "image": null, "explanation": null},
      {"id": "b", "text": "المباحات للولي.", "image": null, "explanation": null},
      {"id": "c", "text": "الكبائر (إِنَّهُ كَانَ حُوبًا كَبِيرًا).", "image": null, "explanation": null},
      {"id": "d", "text": "المكروهات.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ما هو أثر التزام التجار المسلمين بالأخلاق الإسلامية (كالصدق والأمانة) تاريخياً؟", "image": null},
    "options": [
      {"id": "a", "text": "فشلهم في التجارة الدولية.", "image": null, "explanation": null},
      {"id": "b", "text": "عداء الشعوب الأخرى لهم.", "image": null, "explanation": null},
      {"id": "c", "text": "انتشار الإسلام في أصقاع المعمورة مثل جنوب شرق آسيا وأفريقيا.", "image": null, "explanation": null},
      {"id": "d", "text": "انغلاقهم على أنفسهم.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "أي مما يلي يمثل امتثالاً لخلق \"النصيحة\" في الاقتصاد الإسلامي؟", "image": null},
    "options": [
      {"id": "a", "text": "كتمان العيب في السلعة لزيادة الربح.", "image": null, "explanation": null},
      {"id": "b", "text": "تزيين الباطل للمشتري.", "image": null, "explanation": null},
      {"id": "c", "text": "إرشاد المشتري وصدقه، وعدم محبة إلا ما يحب لنفسه كما فعل جرير بن عبدالله.", "image": null, "explanation": null},
      {"id": "d", "text": "بيع السلع المحرمة خفية.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الرابعة: الحرية الاقتصادية المنضبطة  (الدرس 4)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 4;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "القاعدة الفقهية التي تعتبر الأساس لـ \"الحرية الاقتصادية\" في الإسلام هي:", "image": null},
    "options": [
      {"id": "a", "text": "الأصل في المعاملات الإباحة.", "image": null, "explanation": null},
      {"id": "b", "text": "الأصل في العبادات التوقيف.", "image": null, "explanation": null},
      {"id": "c", "text": "المشقة تجلب التيسير.", "image": null, "explanation": null},
      {"id": "d", "text": "اليقين لا يزول بالشك.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ضابط \"المشروعية\" في الإنتاج يُلزم المسلم بـ:", "image": null},
    "options": [
      {"id": "a", "text": "إنتاج السلع بأقل تكلفة حتى لو كانت محرمة.", "image": null, "explanation": null},
      {"id": "b", "text": "تجنب إنتاج السلع المحرمة (كالخمر والملاهي) والتوجه لإنتاج ما يحفظ ضروريات الإنسان.", "image": null, "explanation": null},
      {"id": "c", "text": "احتكار السلع لزيادة الأسعار.", "image": null, "explanation": null},
      {"id": "d", "text": "تقليد الصناعات الغربية في كل شيء.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "عند تعارض المصالح في عملية الإنتاج، فإن القاعدة الشرعية تنص على:", "image": null},
    "options": [
      {"id": "a", "text": "تقديم المصلحة الخاصة على المصلحة العامة.", "image": null, "explanation": null},
      {"id": "b", "text": "تقديم المصلحة العامة على الخاصة، والكبرى على الصغرى.", "image": null, "explanation": null},
      {"id": "c", "text": "تقديم التحسينات على الضروريات.", "image": null, "explanation": null},
      {"id": "d", "text": "ترك المشروع بالكامل لتجنب التعارض.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من تطبيقات القاعدة الفقهية (يُتحمل الضرر الخاص لدفع الضرر العام) في الاقتصاد:", "image": null},
    "options": [
      {"id": "a", "text": "السماح باحتكار السلع لزيادة ثروة التاجر.", "image": null, "explanation": null},
      {"id": "b", "text": "منع الحاكم للمستثمرين من إقامة مصانع تسبب تلوثاً للبيئة أو تلحق أضراراً بالناس.", "image": null, "explanation": null},
      {"id": "c", "text": "تعويض التاجر من أموال الفقراء.", "image": null, "explanation": null},
      {"id": "d", "text": "إجبار الناس على شراء سلع معينة.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "إذا تعارضت مصلحة جلب المال من السياحة مع مضار السماح بالخمور والمقامرة، فالقاعدة المطبقة هي:", "image": null},
    "options": [
      {"id": "a", "text": "الضرورات تبيح المحظورات.", "image": null, "explanation": null},
      {"id": "b", "text": "درء المفاسد (المضار) مقدم على جلب المصالح.", "image": null, "explanation": null},
      {"id": "c", "text": "العادة محكمة.", "image": null, "explanation": null},
      {"id": "d", "text": "الأعمال بالنيات.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "ينظر الإسلام إلى \"الاستهلاك (الإنفاق)\" على أنه:", "image": null},
    "options": [
      {"id": "a", "text": "غاية نهائية للإنسان يستهلك لمجرد اللذة (كما في الاقتصاد الوضعي).", "image": null, "explanation": null},
      {"id": "b", "text": "محرم تماماً ويجب التقشف المطلق.", "image": null, "explanation": null},
      {"id": "c", "text": "حق وواجب بالقدر الذي يعين الفرد على تحقيق غاياته بإشباع حاجاته باعتدال.", "image": null, "explanation": null},
      {"id": "d", "text": "مسموح للرجال دون النساء.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من الضوابط الشرعية الواردة على الإنفاق:", "image": null},
    "options": [
      {"id": "a", "text": "النهي عن الإنفاق على السلع الضارة والخبيثة (كالمسكرات).", "image": null, "explanation": null},
      {"id": "b", "text": "وجوب إنفاق كل الدخل وعدم الادخار.", "image": null, "explanation": null},
      {"id": "c", "text": "الإسراف في الكماليات لإظهار النعمة.", "image": null, "explanation": null},
      {"id": "d", "text": "التباهي والتفاخر في الحفلات.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "قيمة \"التوسط في الإنفاق\" المذكورة في قوله تعالى (وَالَّذِينَ إِذَا أَنفَقُوا لَمْ يُسْرِفُوا وَلَمْ يَقْتُرُوا) تعني:", "image": null},
    "options": [
      {"id": "a", "text": "إنفاق كل ما في الجيب.", "image": null, "explanation": null},
      {"id": "b", "text": "البخل الشديد لتوفير المال.", "image": null, "explanation": null},
      {"id": "c", "text": "الاعتدال والاقتصاد بين الإسراف والبخل.", "image": null, "explanation": null},
      {"id": "d", "text": "شراء الماركات العالمية فقط.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "وفقاً لترتيب أولويات الإنفاق في الإسلام، يجب البدء أولاً بـ:", "image": null},
    "options": [
      {"id": "a", "text": "التحسينيات والكماليات.", "image": null, "explanation": null},
      {"id": "b", "text": "الحاجيات.", "image": null, "explanation": null},
      {"id": "c", "text": "الضروريات التي لا تقوم الحياة بدونها.", "image": null, "explanation": null},
      {"id": "d", "text": "الاستثمارات طويلة الأجل.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "حسب حديث النبي ﷺ (ابدأ بنفسك فتصدق عليها...)، ما هو الترتيب الصحيح للمسؤوليات في الإنفاق؟", "image": null},
    "options": [
      {"id": "a", "text": "الأصدقاء، ثم النفس، ثم الزوجة.", "image": null, "explanation": null},
      {"id": "b", "text": "النفس، ثم الأهل (الزوجة والولد)، ثم ذوي القرابة.", "image": null, "explanation": null},
      {"id": "c", "text": "الجيران، ثم النفس، ثم الأهل.", "image": null, "explanation": null},
      {"id": "d", "text": "القرابة، ثم النفس، ثم الأهل.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

  -- ═══════════════════════════════════════════════════════════
  -- الوحدة الخامسة: أبرز أنواع المعاملات المالية المحرمة  (الدرس 5)
  -- ═══════════════════════════════════════════════════════════
  select id into v_lesson from public.lessons
  where subject_id = v_subject and sort_order = 5;

  insert into public.questions (lesson_id, type, content, explanation, sort_order, created_by, updated_by) values

  (v_lesson, 'mcq', '{
    "question": {"text": "\"بيع الغرر\" المحرم شرعاً هو البيع الذي:", "image": null},
    "options": [
      {"id": "a", "text": "يكون فيه المشتري غريباً عن البلد.", "image": null, "explanation": null},
      {"id": "b", "text": "فيه جهل بالمبيع، أو بثمنه، أو بسلامته، أو بأجله (مجهول العاقبة).", "image": null, "explanation": null},
      {"id": "c", "text": "يتم بالتقسيط المريح.", "image": null, "explanation": null},
      {"id": "d", "text": "يشترك فيه أكثر من بائع.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 1, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من أمثلة بيوع الغرر التي نهى عنها النبي ﷺ:", "image": null},
    "options": [
      {"id": "a", "text": "بيع الذهب بالفضة يداً بيد.", "image": null, "explanation": null},
      {"id": "b", "text": "بيع الثمار قبل أن يبدو صلاحها.", "image": null, "explanation": null},
      {"id": "c", "text": "بيع السلع المستعملة.", "image": null, "explanation": null},
      {"id": "d", "text": "بيع العقارات المؤجرة.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 2, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "يُشترط في \"الغرر\" حتى يكون مؤثراً ومانعاً من صحة العقد أن يكون:", "image": null},
    "options": [
      {"id": "a", "text": "يسيراً جداً.", "image": null, "explanation": null},
      {"id": "b", "text": "في أمر تابع وليس أساسياً.", "image": null, "explanation": null},
      {"id": "c", "text": "كثيراً، وفي المعقود عليه أصالة، وألا تدعو الحاجة الماسة للعقد.", "image": null, "explanation": null},
      {"id": "d", "text": "بين أقارب من الدرجة الأولى.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 3, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"ربا النسيئة\" (ربا الجاهلية) يقصد به:", "image": null},
    "options": [
      {"id": "a", "text": "الزيادة في أحد العوضين مقابل تأخير الدفع أو القبض في الأموال الربوية.", "image": null, "explanation": null},
      {"id": "b", "text": "مبادلة ذهب بذهب مع زيادة في الوزن.", "image": null, "explanation": null},
      {"id": "c", "text": "بيع سلعة بثمن أغلى من سعر السوق.", "image": null, "explanation": null},
      {"id": "d", "text": "بيع العملات الورقية المختلفة يداً بيد.", "image": null, "explanation": null}
    ],
    "correct": "a"
  }', null, 4, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"ربا الفضل\" (الربا الخفي) يقصد به:", "image": null},
    "options": [
      {"id": "a", "text": "تأخير سداد الدين المعسر.", "image": null, "explanation": null},
      {"id": "b", "text": "الزيادة في مبادلة مال ربوي بمال ربوي من جنسه (كبيع كيلوغرام تمر بكيلوغرامين تمر).", "image": null, "explanation": null},
      {"id": "c", "text": "أخذ قرض من البنك.", "image": null, "explanation": null},
      {"id": "d", "text": "شراء سيارة بالتقسيط.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 5, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "إذا بيع مال ربوي بجنسه (مثل: ذهب بذهب، أو تمر بتمر)، ما هي الشروط لصحة البيع وعدم الوقوع في الربا؟", "image": null},
    "options": [
      {"id": "a", "text": "التقابض في المجلس فقط.", "image": null, "explanation": null},
      {"id": "b", "text": "التساوي في المقدار فقط.", "image": null, "explanation": null},
      {"id": "c", "text": "التقابض في مجلس العقد قبل التفرق، والتساوي بينهما في المقدار.", "image": null, "explanation": null},
      {"id": "d", "text": "لا يوجد شروط، يجوز بيعها بأي طريقة.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 6, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "إذا اختلفت الأجناس الربوية واتحدت العلة (مثل: بيع ذهب بفضة، أو ريالات بدولارات)، فالشرط هو:", "image": null},
    "options": [
      {"id": "a", "text": "التساوي في المقدار والتقابض.", "image": null, "explanation": null},
      {"id": "b", "text": "التقابض في مجلس العقد (يجوز التفاضل ويحرم التأجيل).", "image": null, "explanation": null},
      {"id": "c", "text": "التساوي في المقدار (يجوز التأجيل).", "image": null, "explanation": null},
      {"id": "d", "text": "لا يشترط التقابض ولا التساوي.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 7, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "من الآثار الاقتصادية السلبية للربا:", "image": null},
    "options": [
      {"id": "a", "text": "زيادة الإنتاجية في المجتمع.", "image": null, "explanation": null},
      {"id": "b", "text": "انخفاض أسعار السلع.", "image": null, "explanation": null},
      {"id": "c", "text": "انخفاض إنتاجية رأس المال الحقيقي، وارتفاع الأسعار، وتوليد الصراع الطبقي.", "image": null, "explanation": null},
      {"id": "d", "text": "التوزيع العادل للثروات.", "image": null, "explanation": null}
    ],
    "correct": "c"
  }', null, 8, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "\"الميسر\" المحرم شرعاً يشمل:", "image": null},
    "options": [
      {"id": "a", "text": "كل مسابقة فيها جائزة مجانية من جهة خارجية.", "image": null, "explanation": null},
      {"id": "b", "text": "الألعاب والرهانات التي يدفع فيها الأطراف مالاً، والغالب يأخذ من المغلوب ماله (القمار).", "image": null, "explanation": null},
      {"id": "c", "text": "بيع الأسهم في السوق المالي.", "image": null, "explanation": null},
      {"id": "d", "text": "التأمين التعاوني التكافلي.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 9, v_owner, v_owner),

  (v_lesson, 'mcq', '{
    "question": {"text": "المسابقات المباحة التي يجوز أخذ العوض (الجائزة) فيها استثناءً بحديث (لا سبق إلا في خف أو نصل أو حافر) تشمل:", "image": null},
    "options": [
      {"id": "a", "text": "مسابقات ألعاب الورق والنرد.", "image": null, "explanation": null},
      {"id": "b", "text": "مسابقات الخيل والإبل والرمي (وما يلحق بها كالمسابقات النافعة للدين والأمة).", "image": null, "explanation": null},
      {"id": "c", "text": "اليانصيب وأرقام السحب التجارية التي يدفع فيها المشترك مالاً.", "image": null, "explanation": null},
      {"id": "d", "text": "المراهنة على نتائج مباريات كرة القدم.", "image": null, "explanation": null}
    ],
    "correct": "b"
  }', null, 10, v_owner, v_owner);

end $$;
