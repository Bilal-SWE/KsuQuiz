// Landing page copy. Kept beside the page because nothing else uses it.

export type DemoQuestion =
  | { kind: 'mcq'; text: string; options: string[]; correct: number; why: string }
  | { kind: 'tf'; text: string; correct: boolean; why: string };

export const landingContent = {
  ar: {
    nav: { try: 'جرّب كويزاً', subjects: 'المواد', how: 'كيف تعمل', pricing: 'التسعير', faq: 'أسئلة شائعة', login: 'دخول', start: 'ابدأ مجاناً' },
    hero: {
      eyebrow: 'كويزات تدريبية لطلاب الجامعة',
      title1: 'اختبر فهمك',
      title2: 'قبل يوم الاختبار',
      text: 'أسئلة تدريبية على موادك الجامعية، مقسّمة على الدروس، ومع كل إجابة شرح يوضح لك لماذا أخطأت وكيف تصحح فهمك.',
      ctaTry: 'جرّب كويزاً الآن',
      ctaSignup: 'أنشئ حساباً مجاناً',
      stats: { questions: 'سؤال تدريبي', subjects: 'مادة', lessons: 'درس', students: 'طالب مسجّل', visits: 'زيارة' },
    },
    demo: {
      label: 'كويز تجريبي',
      of: 'سؤال {i} من {n}',
      true: 'صح',
      false: 'خطأ',
      correct: 'إجابة صحيحة',
      wrong: 'إجابة خاطئة',
      next: 'السؤال التالي',
      finish: 'اعرض النتيجة',
      doneTitle: 'أنهيت الكويز التجريبي',
      doneScore: 'أجبت {s} من {n} إجابات صحيحة',
      doneText: 'داخل المنصة كويزات كاملة لكل درس في موادك، ونتيجتك تُحفظ وتدخل بها الترتيب.',
      signup: 'أنشئ حسابك وأكمل',
      retry: 'أعد المحاولة',
      questions: [
        {
          kind: 'mcq',
          text: 'أي كلمة كُتبت فيها الهمزة المتوسطة كتابة صحيحة؟',
          options: ['مسئلة', 'مسألة', 'مسؤلة'],
          correct: 1,
          why: 'الهمزة مفتوحة وما قبلها ساكن، والفتحة تناسبها الألف، فتُكتب على ألف: مسألة.',
        },
        {
          kind: 'tf',
          text: 'في وضع التمرين يظهر لك شرح الإجابة مباشرة بعد كل سؤال.',
          correct: true,
          why: 'صحيح. أما وضع الاختبار فيخفي الإجابات حتى تنهي الكويز، ثم يعرض نتيجتك ومراجعة أخطائك.',
        },
        {
          kind: 'mcq',
          text: 'أي محاولة تُحسب لك في ترتيب الطلاب؟',
          options: ['كل محاولاتك', 'أفضل محاولة', 'أول محاولة فقط'],
          correct: 1,
          why: 'تُحسب أفضل نتيجة لك في كل اختبار، فكل محاولة جديدة فرصة لتحسين مركزك.',
        },
      ] as DemoQuestion[],
    },
    subjects: {
      title: 'مواد متاحة الآن',
      text: 'اختر تصنيفاً واطّلع على المواد التي فيها كويزات جاهزة.',
      all: 'الكل',
      lessons: '{n} درس',
      empty: 'تُضاف مواد جديدة قريباً.',
      seeAll: 'سجّل دخولك لرؤية كل المواد',
    },
    modes: {
      title: 'كل كويز تحله بطريقتين',
      text: 'اختر الطريقة المناسبة قبل أن تبدأ أي درس.',
      practice: {
        name: 'تمرين',
        goal: 'لتفهم الدرس',
        rows: [
          { label: 'بعد كل سؤال', value: 'تظهر الإجابة الصحيحة مع شرحها فوراً' },
          { label: 'إذا خرجت', value: 'ترجع وتكمل من حيث توقفت' },
          { label: 'الترتيب', value: 'لا يُحسب، تدرّب براحتك' },
        ],
        when: 'استخدمه أثناء المذاكرة',
      },
      exam: {
        name: 'اختبار',
        goal: 'لتقيس مستواك',
        rows: [
          { label: 'الوقت', value: 'مؤقت لكل سؤال، فأجب قبل أن ينتهي' },
          { label: 'بعد كل سؤال', value: 'لا تظهر الإجابة حتى تنهي الكويز' },
          { label: 'في النهاية', value: 'نتيجتك ومراجعة لكل خطأ مع الشرح' },
          { label: 'الترتيب', value: 'أفضل نتيجة لك تدخلك ترتيب الطلاب' },
        ],
        when: 'استخدمه قبل الاختبار الحقيقي',
      },
    },
    how: {
      title: 'تبدأ في أقل من دقيقة',
      steps: [
        { title: 'أنشئ حسابك', desc: 'بالبريد الإلكتروني، بدون أي رسوم.' },
        { title: 'اختر موادك', desc: 'ابحث عن موادك وأضفها إلى قائمتك.' },
        { title: 'حل الكويزات', desc: 'تدرّب، راجع أخطاءك، وتابع ترتيبك.' },
      ],
    },
    faq: {
      title: 'أسئلة شائعة',
      items: [
        {
          q: 'هل الأسئلة تجميعات؟',
          a: 'لا. جميع الأسئلة كويزات تدريبية أُعدّت للمراجعة، وليست أسئلة تجميعات، ولا تغني عن المحاضرات والمراجع المعتمدة.',
        },
        { q: 'هل المنصة مجانية؟', a: 'أول درسين من كل مادة مجاناً. لفتح جميع الدروس اشترك شهرياً بـ 4.99 ريال، ويمكنك الإلغاء في أي وقت.' },
        { q: 'هل أستطيع إعادة الكويز؟', a: 'نعم، أعد أي كويز كما تشاء، ويحسب الترتيب أفضل نتيجة حققتها.' },
        { q: 'ما الفرق بين التمرين والاختبار؟', a: 'التمرين يعرض الإجابة والشرح بعد كل سؤال، والاختبار له مؤقت لكل سؤال ويخفي الإجابات حتى النهاية، ثم يعرض نتيجتك ومراجعة أخطائك.' },
        { q: 'هل يعمل الموقع على الجوال؟', a: 'نعم، صُمم أولاً للجوال، ويعمل كذلك على الكمبيوتر بدون تثبيت أي تطبيق.' },
      ],
    },
    group: {
      title: 'اشترك مع أصدقائك ووفّر',
      text: 'ادفع اشتراك واحد وشارك الوصول مع صديق أو صديقين.',
      plans: [
        { name: 'القطة الثنائية', price: '6.99', per: '3.50 لكل شخص', desc: 'أنت وصديقك، اشتراك واحد يفتح كل الدروس لكما.' },
        { name: 'القطة الثلاثية', price: '9.99', per: '3.33 لكل شخص', desc: 'أنت وصديقين، اشتراك واحد يفتح كل الدروس لكم.' },
      ],
      howTitle: 'كيف تشترك مع أصدقائك؟',
      howSteps: ['اختر القطة الثنائية أو الثلاثية', 'أدخل إيميلات أصدقائك المسجلين', 'ادفع مرة واحدة والكل يحصل على كل الدروس'],
      cta: 'اعرف المزيد عن الأسعار',
    },
    final: {
      title: 'جاهز لأول كويز؟',
      text: 'أنشئ حسابك وابدأ المراجعة الآن.',
      cta: 'ابدأ مجاناً',
    },
  },
  en: {
    nav: { try: 'Try a quiz', subjects: 'Subjects', how: 'How it works', pricing: 'Pricing', faq: 'FAQ', login: 'Log in', start: 'Start free' },
    hero: {
      eyebrow: 'Practice quizzes for university students',
      title1: 'Test your understanding',
      title2: 'before exam day',
      text: 'Practice questions for your university courses, organized by lesson, with an explanation for every answer that shows why you got it wrong and how to fix it.',
      ctaTry: 'Try a quiz now',
      ctaSignup: 'Create a free account',
      stats: { questions: 'practice questions', subjects: 'subjects', lessons: 'lessons', students: 'registered students', visits: 'visits' },
    },
    demo: {
      label: 'Sample quiz',
      of: 'Question {i} of {n}',
      true: 'True',
      false: 'False',
      correct: 'Correct',
      wrong: 'Not quite',
      next: 'Next question',
      finish: 'See my score',
      doneTitle: 'You finished the sample quiz',
      doneScore: 'Correct answers: {s} of {n}',
      doneText: 'Inside the platform there is a full quiz for every lesson in your courses, and your score is saved and counts on the leaderboard.',
      signup: 'Create an account and continue',
      retry: 'Try again',
      questions: [
        {
          kind: 'mcq',
          text: 'Which word is spelled correctly?',
          options: ['acommodate', 'accommodate', 'accomodate'],
          correct: 1,
          why: 'It takes a double "c" and a double "m": accommodate.',
        },
        {
          kind: 'tf',
          text: 'In practice mode you see the explanation right after each question.',
          correct: true,
          why: 'True. Exam mode hides the answers until you finish, then shows your score and a review of your mistakes.',
        },
        {
          kind: 'mcq',
          text: 'Which attempt counts on the student leaderboard?',
          options: ['Every attempt', 'Your best attempt', 'Only your first attempt'],
          correct: 1,
          why: 'Your best score in each exam counts, so every new attempt is a chance to move up.',
        },
      ] as DemoQuestion[],
    },
    subjects: {
      title: 'Subjects available now',
      text: 'Pick a category to see the subjects with ready-made quizzes.',
      all: 'All',
      lessons: 'Lessons: {n}',
      empty: 'New subjects are coming soon.',
      seeAll: 'Log in to see all subjects',
    },
    modes: {
      title: 'Take every quiz two ways',
      text: 'Pick the one that fits before you start a lesson.',
      practice: {
        name: 'Practice',
        goal: 'To understand the lesson',
        rows: [
          { label: 'After each question', value: 'The right answer and its explanation appear right away' },
          { label: 'If you leave', value: 'Come back and continue where you stopped' },
          { label: 'Leaderboard', value: 'Not counted, so practice freely' },
        ],
        when: 'Use it while studying',
      },
      exam: {
        name: 'Exam',
        goal: 'To measure your level',
        rows: [
          { label: 'Time', value: 'A timer for every question, so answer before it runs out' },
          { label: 'After each question', value: 'Answers stay hidden until you finish' },
          { label: 'At the end', value: 'Your score and a review of every mistake' },
          { label: 'Leaderboard', value: 'Your best score puts you on the student leaderboard' },
        ],
        when: 'Use it before the real exam',
      },
    },
    how: {
      title: 'Start in under a minute',
      steps: [
        { title: 'Create your account', desc: 'With your email, free of charge.' },
        { title: 'Choose your subjects', desc: 'Find your courses and add them to your list.' },
        { title: 'Take the quizzes', desc: 'Practice, review your mistakes, and follow your rank.' },
      ],
    },
    faq: {
      title: 'Frequently asked questions',
      items: [
        {
          q: 'Are these compiled past-exam questions?',
          a: 'No. All questions are practice quizzes written for revision. They are not compiled past-exam questions and do not replace your lectures and approved references.',
        },
        { q: 'Is it free?', a: 'The first two lessons of every subject are free. To unlock every lesson, subscribe for SAR 4.99 a month and cancel anytime.' },
        { q: 'Can I retake a quiz?', a: 'Yes, as often as you like, and the leaderboard counts your best score.' },
        { q: 'What is the difference between practice and exam?', a: 'Practice shows the answer and explanation after each question. Exam has a timer for every question and hides the answers until the end, then shows your score and a review.' },
        { q: 'Does it work on my phone?', a: 'Yes. It is designed for phones first and works on computers too, with nothing to install.' },
      ],
    },
    group: {
      title: 'Subscribe with friends and save',
      text: 'Pay one subscription and share access with one or two friends.',
      plans: [
        { name: 'Duo plan', price: '6.99', per: 'SAR 3.50 each', desc: 'You and a friend, one subscription that unlocks every lesson for both.' },
        { name: 'Trio plan', price: '9.99', per: 'SAR 3.33 each', desc: 'You and two friends, one subscription that unlocks every lesson for all three.' },
      ],
      howTitle: 'How to subscribe with friends?',
      howSteps: ['Choose the Duo or Trio plan', "Enter your friends' registered emails", 'Pay once and everyone gets every lesson'],
      cta: 'See all pricing options',
    },
    final: {
      title: 'Ready for your first quiz?',
      text: 'Create your account and start revising now.',
      cta: 'Start free',
    },
  },
};

export type LandingContent = (typeof landingContent)['ar'];
