'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, Check, CheckCheck, ClipboardList, Eye, ImagePlus, Lightbulb, ListChecks, MessageSquareText, Plus, TextCursorInput, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/admin/image-upload';
import { createQuestion, updateQuestion } from '@/app/actions/admin';
import { buildFillBlanksContent, parseDistractors } from '@/lib/fill-blanks';

type Question = {
  id: string;
  type: string;
  content: any;
  explanation: string | null;
  in_practice?: boolean;
  in_exam?: boolean;
};

type SavedQuestion = {
  id: string;
  type: string;
  content: any;
  explanation: string | null;
  sort_order: number;
  in_practice: boolean;
  in_exam: boolean;
};

type Props = {
  lessonId: string;
  question: Question | null;
  onDone: (saved?: SavedQuestion) => void;
  onCancel: () => void;
  // Where a new question appears; existing questions keep their own placement.
  defaultPlacement?: { in_practice: boolean; in_exam: boolean };
};

type Option = { id: string; text: string; image: string; explanation: string; showImage: boolean; showExplanation: boolean };

const TYPES = [
  { value: 'mcq', label: 'اختيار من متعدد', desc: 'خيارات وإجابة واحدة صحيحة', icon: ListChecks },
  { value: 'true_false', label: 'صح أو خطأ', desc: 'عبارة يحكم عليها الطالب', icon: CheckCheck },
  { value: 'fill_blanks', label: 'املأ الفراغات', desc: 'جمل وبنك كلمات', icon: TextCursorInput },
];

// Empty fields follow the page direction so Arabic placeholders sit on the right;
// once there is text, its own direction decides.
const textDir = (value: string) => (value.trim() ? 'auto' : undefined);

const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

const fieldClass =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-muted/70 focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition';

function Step({ n, title, hint, error, children }: { n: number; title: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-start gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-background">{n}</span>
        <div className="min-w-0">
          <h4 className="font-bold leading-7">{title}</h4>
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
      </div>
      {children}
      {error && <p className="text-sm font-medium text-error">{error}</p>}
    </section>
  );
}

const toOption = (o: any): Option => ({
  id: o.id,
  text: o.text ?? '',
  image: o.image ?? '',
  explanation: o.explanation ?? '',
  showImage: !!o.image,
  showExplanation: !!o.explanation,
});

export function QuestionEditor({ lessonId, question, onDone, onCancel, defaultPlacement }: Props) {
  const [type, setType] = useState(question?.type ?? 'mcq');
  const [questionText, setQuestionText] = useState(question?.content?.question?.text ?? '');
  const [questionImage, setQuestionImage] = useState(question?.content?.question?.image ?? '');
  const [showQuestionImage, setShowQuestionImage] = useState(!!question?.content?.question?.image);
  const [explanation, setExplanation] = useState(question?.explanation ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ text?: string; answers?: string; placement?: string; save?: string }>({});
  const [inPractice, setInPractice] = useState(question ? question.in_practice !== false : defaultPlacement?.in_practice ?? true);
  const [inExam, setInExam] = useState(question ? question.in_exam !== false : defaultPlacement?.in_exam ?? false);

  const [options, setOptions] = useState<Option[]>(
    question?.type === 'mcq' && question.content.options
      ? question.content.options.map(toOption)
      : ['a', 'b', 'c', 'd'].map((id) => toOption({ id })),
  );
  const [correctOption, setCorrectOption] = useState<string>(question?.type === 'mcq' ? question.content.correct ?? 'a' : 'a');
  const [correctBool, setCorrectBool] = useState<boolean>(question?.type === 'true_false' ? question.content.correct ?? true : true);

  const [fillItems, setFillItems] = useState<string[]>(
    question?.type === 'fill_blanks' && question.content.items ? question.content.items.map((i: any) => i.raw ?? '') : ['', ''],
  );
  const [distractorsText, setDistractorsText] = useState<string>(
    question?.type === 'fill_blanks' ? (question.content.distractors ?? []).join('، ') : '',
  );
  const fillPreview = useMemo(
    () => (type === 'fill_blanks' ? buildFillBlanksContent(fillItems, parseDistractors(distractorsText)) : null),
    [type, fillItems, distractorsText],
  );

  const updateOption = (index: number, patch: Partial<Option>) =>
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, ...patch } : o)));

  const addOption = () => {
    const used = new Set(options.map((o) => o.id));
    const id = 'abcdefgh'.split('').find((c) => !used.has(c)) ?? String(Date.now());
    setOptions((prev) => [...prev, toOption({ id })]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== index);
    setOptions(next);
    if (!next.find((o) => o.id === correctOption)) setCorrectOption(next[0].id);
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!questionText.trim()) next.text = 'اكتب نص السؤال';
    if (type === 'mcq') {
      const filled = options.filter((o) => o.text.trim() || o.image);
      const correct = options.find((o) => o.id === correctOption);
      if (filled.length < 2) next.answers = 'أضف خيارين على الأقل';
      else if (!correct || !(correct.text.trim() || correct.image)) next.answers = 'حدّد إجابة صحيحة غير فارغة';
    }
    if (!inPractice && !inExam) next.placement = 'اختر وضعاً واحداً على الأقل';
    if (type === 'fill_blanks' && (fillPreview?.blankCount ?? 0) === 0) {
      next.answers = 'ضع كلمة واحدة على الأقل بين قوسين [ ] لتصبح فراغاً';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (loading || !validate()) return;
    setLoading(true);

    const stem = { text: questionText.trim(), image: questionImage || null };
    let content: any;
    if (type === 'fill_blanks') {
      const { blankCount, ...built } = buildFillBlanksContent(fillItems, parseDistractors(distractorsText));
      content = { question: stem, ...built };
    } else if (type === 'mcq') {
      content = {
        question: stem,
        options: options
          .filter((o) => o.text.trim() || o.image)
          .map((o) => ({ id: o.id, text: o.text.trim(), image: o.image || null, explanation: o.explanation.trim() || null })),
        correct: correctOption,
      };
    } else {
      content = { question: stem, correct: correctBool };
    }

    const expl = explanation.trim();
    const placement = { in_practice: inPractice, in_exam: inExam };
    // Both is the database default, so it needs no columns (keeps saving working before migration 014).
    const wasBoth = !question || (question.in_practice !== false && question.in_exam !== false);
    const sent = inPractice && inExam && wasBoth ? {} : placement;
    try {
      if (question) {
        await updateQuestion(question.id, { type, content, explanation: expl, ...sent });
        onDone({ id: question.id, type, content, explanation: expl || null, sort_order: (question as any).sort_order ?? 0, ...placement });
      } else {
        const created = await createQuestion(lessonId, { type, content, explanation: expl, ...sent });
        onDone({ id: created.id, type, content, explanation: expl || null, sort_order: 999, ...placement });
      }
    } catch (err: any) {
      setErrors({ save: err?.message || 'تعذّر حفظ السؤال، حاول مرة أخرى' });
    }
    setLoading(false);
  };

  // Ctrl/Cmd + Enter saves from anywhere in the form.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const currentType = TYPES.find((t) => t.value === type) ?? TYPES[0];

  return (
    <div className="card overflow-hidden !rounded-3xl animate-fade-up">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="text-lg font-extrabold">{question ? 'تعديل السؤال' : 'سؤال جديد'}</h3>
          <p className="text-xs text-muted">املأ الخطوات بالترتيب، والمعاينة تتحدّث مباشرة</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="إغلاق"
          className="press flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface-hover hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-7 p-5">
          <Step n={1} title="نوع السؤال" hint={question ? 'لا يمكن تغيير النوع بعد الإنشاء' : undefined}>
            {question ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-sm font-bold text-primary-ink">
                <currentType.icon className="h-4 w-4" />
                {currentType.label}
              </span>
            ) : (
              <div className="grid gap-2 sm:grid-cols-3" role="radiogroup">
                {TYPES.map((t) => {
                  const active = type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setType(t.value);
                        setErrors({});
                      }}
                      className={`press flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-start transition-colors sm:flex-col sm:items-start ${
                        active ? 'border-primary bg-primary-light' : 'border-border bg-surface hover:border-primary/50'
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-primary text-on-primary' : 'bg-surface-hover text-ink'}`}>
                        <t.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{t.label}</span>
                        <span className="block text-xs text-muted">{t.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </Step>

          <Step n={2} title="نص السؤال" error={errors.text}>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={type === 'true_false' ? 'اكتب العبارة التي سيحكم عليها الطالب' : 'اكتب السؤال هنا'}
              rows={3}
              dir={textDir(questionText)}
              className={`${fieldClass} min-h-24 resize-y text-base ${errors.text ? 'border-error' : ''}`}
            />
            {showQuestionImage || questionImage ? (
              <div className="rounded-2xl border border-dashed border-border p-3">
                <ImageUpload value={questionImage} onChange={setQuestionImage} />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowQuestionImage(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary-ink hover:underline"
              >
                <ImagePlus className="h-4 w-4" />
                إضافة صورة للسؤال
              </button>
            )}
          </Step>

          <Step
            n={3}
            title={type === 'fill_blanks' ? 'الجمل والفراغات' : 'الإجابة'}
            hint={
              type === 'mcq'
                ? 'اضغط على حرف الخيار لتجعله الإجابة الصحيحة'
                : type === 'true_false'
                  ? 'اختر الحكم الصحيح على العبارة'
                  : 'ضع الكلمة المطلوبة بين قوسين مربعين، مثل: عاصمة السعودية هي [الرياض]'
            }
            error={errors.answers}
          >
            {type === 'mcq' && (
              <div className="space-y-2">
                {options.map((o, i) => {
                  const isCorrect = correctOption === o.id;
                  return (
                    <div
                      key={o.id}
                      className={`rounded-2xl border-2 p-2 transition-colors ${isCorrect ? 'border-success bg-success-light/60' : 'border-border bg-surface'}`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCorrectOption(o.id)}
                          title={isCorrect ? 'الإجابة الصحيحة' : 'اجعلها الإجابة الصحيحة'}
                          aria-label={`${isCorrect ? 'الإجابة الصحيحة' : 'اجعلها الإجابة الصحيحة'}: الخيار ${LETTERS[i]}`}
                          aria-pressed={isCorrect}
                          className={`press flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-sm font-extrabold transition-colors ${
                            isCorrect ? 'bg-success text-white' : 'bg-surface-hover text-muted hover:bg-success-light hover:text-success-ink'
                          }`}
                        >
                          {isCorrect ? <Check className="h-4 w-4" strokeWidth={3} /> : LETTERS[i]}
                        </button>
                        <input
                          value={o.text}
                          onChange={(e) => updateOption(i, { text: e.target.value })}
                          placeholder={`الخيار ${LETTERS[i]}`}
                          dir={textDir(o.text)}
                          className="min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-surface"
                        />
                        <button
                          type="button"
                          onClick={() => updateOption(i, { showImage: !o.showImage })}
                          title="صورة للخيار"
                          aria-label="صورة للخيار"
                          className={`rounded-lg p-1.5 cursor-pointer ${o.showImage || o.image ? 'text-primary-ink' : 'text-muted hover:text-ink'}`}
                        >
                          <ImagePlus className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateOption(i, { showExplanation: !o.showExplanation })}
                          title="شرح لهذا الخيار"
                          aria-label="شرح لهذا الخيار"
                          className={`rounded-lg p-1.5 cursor-pointer ${o.showExplanation || o.explanation ? 'text-primary-ink' : 'text-muted hover:text-ink'}`}
                        >
                          <MessageSquareText className="h-4 w-4" />
                        </button>
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(i)}
                            title="حذف الخيار"
                            aria-label="حذف الخيار"
                            className="rounded-lg p-1.5 text-muted hover:bg-error-light hover:text-error cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      {(o.showImage || o.image) && (
                        <div className="mt-2 ps-11">
                          <ImageUpload value={o.image} onChange={(url) => updateOption(i, { image: url })} />
                        </div>
                      )}
                      {(o.showExplanation || o.explanation) && (
                        <div className="mt-2 ps-11">
                          <input
                            value={o.explanation}
                            onChange={(e) => updateOption(i, { explanation: e.target.value })}
                            placeholder="لماذا هذا الخيار صحيح أو خطأ؟ (يظهر للطالب إذا اختاره)"
                            dir={textDir(o.explanation)}
                            className={`${fieldClass} py-2`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="press flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-2.5 text-sm font-bold text-muted hover:border-primary hover:text-primary-ink"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة خيار
                  </button>
                )}
              </div>
            )}

            {type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: 'صح', Icon: Check },
                  { value: false, label: 'خطأ', Icon: X },
                ].map(({ value, label, Icon }) => {
                  const active = correctBool === value;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setCorrectBool(value)}
                      aria-pressed={active}
                      className={`press flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 py-5 font-bold transition-colors ${
                        active ? 'border-success bg-success-light text-success-ink' : 'border-border bg-surface text-muted hover:border-success/50'
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-success text-white' : 'bg-surface-hover'}`}>
                        <Icon className="h-5 w-5" strokeWidth={3} />
                      </span>
                      {label}
                      {active && <span className="text-xs font-medium">الإجابة الصحيحة</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {type === 'fill_blanks' && (
              <div className="space-y-2">
                {fillItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover text-sm font-bold text-muted">{i + 1}</span>
                    <input
                      value={item}
                      onChange={(e) => setFillItems((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                      placeholder="الجملة مع [الكلمة] بين قوسين"
                      dir={textDir(item)}
                      className={fieldClass}
                    />
                    {fillItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFillItems((prev) => prev.filter((_, j) => j !== i))}
                        aria-label="حذف الجملة"
                        className="rounded-lg p-1.5 text-muted hover:bg-error-light hover:text-error cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFillItems((prev) => [...prev, ''])}
                  className="press flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-2.5 text-sm font-bold text-muted hover:border-primary hover:text-primary-ink"
                >
                  <Plus className="h-4 w-4" />
                  إضافة جملة
                </button>
                <div className="pt-2">
                  <label className="mb-1.5 block text-sm font-medium">كلمات إضافية للتمويه (اختياري)</label>
                  <input
                    value={distractorsText}
                    onChange={(e) => setDistractorsText(e.target.value)}
                    placeholder="افصل بينها بفاصلة: جدة، الدمام، مكة"
                    dir={textDir(distractorsText)}
                    className={fieldClass}
                  />
                </div>
              </div>
            )}
          </Step>

          <Step n={4} title="الشرح (اختياري)" hint="يظهر للطالب بعد الإجابة في التمرين، وفي مراجعة نتيجة الاختبار">
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="وضّح سبب الإجابة الصحيحة"
              rows={2}
              dir={textDir(explanation)}
              className={`${fieldClass} min-h-20 resize-y`}
            />
          </Step>

          <Step n={5} title="يظهر في" hint="التمرين والاختبار منفصلان، ويمكن أن يظهر السؤال في أحدهما أو كليهما" error={errors.placement}>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'التمرين', on: inPractice, set: setInPractice, Icon: BookOpenCheck },
                { label: 'الاختبار', on: inExam, set: setInExam, Icon: ClipboardList },
              ].map(({ label, on, set, Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => set(!on)}
                  aria-pressed={on}
                  className={`press inline-flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                    on ? 'border-primary bg-primary-light text-primary-ink' : 'border-border bg-surface text-muted hover:border-primary/50'
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md ${on ? 'bg-primary text-on-primary' : 'border-2 border-border'}`}>
                    {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </Step>
        </div>

        {/* Live preview */}
        <aside className="border-t border-border bg-background p-5 lg:border-s lg:border-t-0">
          <div className="lg:sticky lg:top-20">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-muted">
              <Eye className="h-4 w-4" />
              كما يراه الطالب
            </p>
            <div className="space-y-2">
              <div className="rounded-2xl bg-ink px-4 py-3 text-background">
                <p dir="auto" className={`text-sm font-extrabold leading-relaxed ${questionText.trim() ? '' : 'opacity-50'}`}>
                  {questionText.trim() || 'نص السؤال يظهر هنا'}
                </p>
                {questionImage && <img src={questionImage} alt="" className="mt-2 max-h-28 rounded-xl bg-surface object-contain" />}
              </div>

              {type === 'mcq' &&
                options.map((o, i) => {
                  const empty = !o.text.trim() && !o.image;
                  const isCorrect = correctOption === o.id;
                  return (
                    <div
                      key={o.id}
                      className={`flex items-center justify-between gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold ${
                        isCorrect ? 'border-success bg-success-light' : 'border-border bg-surface'
                      } ${empty ? 'opacity-40' : ''}`}
                    >
                      <span dir="auto" className="min-w-0 truncate">{o.text.trim() || (o.image ? 'صورة' : `الخيار ${LETTERS[i]}`)}</span>
                      {isCorrect && <Check className="h-4 w-4 shrink-0 text-success-ink" strokeWidth={3} />}
                    </div>
                  );
                })}

              {type === 'true_false' && (
                <div className="grid grid-cols-2 gap-2">
                  {[true, false].map((v) => (
                    <div
                      key={String(v)}
                      className={`rounded-xl border-2 py-3 text-center text-sm font-bold ${
                        correctBool === v ? 'border-success bg-success-light text-success-ink' : 'border-border bg-surface'
                      }`}
                    >
                      {v ? 'صح' : 'خطأ'}
                    </div>
                  ))}
                </div>
              )}

              {type === 'fill_blanks' && fillPreview && (
                <div className="space-y-2 rounded-xl bg-surface p-3 text-sm">
                  {fillPreview.items.length === 0 && <p className="text-muted">الجمل تظهر هنا</p>}
                  {fillPreview.items.map((item, i) => (
                    <p key={item.id} dir="auto" className="leading-8">
                      <span className="text-muted">{i + 1}. </span>
                      {item.segments.map((s, j) =>
                        s.type === 'text' ? (
                          <span key={j}>{s.value}</span>
                        ) : (
                          <span key={j} className="mx-1 inline-block min-w-14 border-b-2 border-dashed border-primary text-center text-xs font-bold text-success-ink">
                            {fillPreview.correct[s.id]}
                          </span>
                        ),
                      )}
                    </p>
                  ))}
                  {fillPreview.words.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
                      {fillPreview.words.map((w) => (
                        <span key={w.id} className="rounded-lg border border-border bg-background px-2 py-0.5 text-xs font-medium">
                          {w.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {explanation.trim() && (
                <div className="flex gap-2 rounded-xl bg-success-light px-3 py-2 text-xs leading-relaxed">
                  <Lightbulb className="mt-px h-4 w-4 shrink-0 text-success-ink" />
                  <p dir="auto">{explanation.trim()}</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface/95 px-5 py-3 backdrop-blur">
        <p className="hidden text-xs text-muted sm:block">
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-sans" dir="ltr">Ctrl + Enter</kbd> للحفظ
        </p>
        {errors.save && <p className="text-sm font-medium text-error">{errors.save}</p>}
        <div className="ms-auto flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            <Check className="h-4 w-4" />
            {question ? 'حفظ التعديلات' : 'إضافة السؤال'}
          </Button>
        </div>
      </div>
    </div>
  );
}
