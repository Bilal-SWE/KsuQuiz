'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { BookOpenCheck, ChevronDown, ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuestionEditor } from '@/components/admin/question-editor';
import { QuestionPreview } from '@/components/admin/question-preview';
import { deleteQuestion, setQuestionsMode, updateLessonSettings } from '@/app/actions/admin';

type Lesson = {
  id: string;
  title: string;
  status: string;
  subject_id: string;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  question_seconds?: number;
};

type Question = {
  id: string;
  type: string;
  content: any;
  explanation: string | null;
  sort_order: number;
  in_practice?: boolean;
  in_exam?: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  mcq: 'اختيار من متعدد',
  true_false: 'صح أو خطأ',
  fill_blanks: 'املأ الفراغات',
};

const inPractice = (q: Question) => q.in_practice !== false;
const inExam = (q: Question) => q.in_exam !== false;

// A question card that shows only its text until opened.
function QuestionCard({
  question,
  number,
  open,
  onToggle,
  onEdit,
  onDelete,
  extra,
}: {
  question: Question;
  number: number;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="card !rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 p-2 sm:p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl p-1 text-start hover:bg-surface-hover"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-sm font-bold text-muted">{number}</span>
          <span className="min-w-0 flex-1">
            <span dir="auto" className="block truncate font-medium">
              {question.content?.question?.text || '—'}
            </span>
            <span className="text-xs text-muted">{TYPE_LABELS[question.type] ?? question.type}</span>
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {extra}
        <button
          type="button"
          onClick={onEdit}
          title="تعديل"
          aria-label="تعديل السؤال"
          className="rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-primary-ink cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="حذف"
          aria-label="حذف السؤال"
          className="rounded-lg p-2 text-muted hover:bg-error-light hover:text-error cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <div className="border-t border-border px-4 py-3 animate-fade-up">
          <QuestionPreview question={question} />
        </div>
      )}
    </div>
  );
}

export function AdminLessonDetail({
  subjectId,
  subjectName,
  lesson,
  questions: initialQuestions,
}: {
  subjectId: string;
  subjectName: string;
  lesson: Lesson;
  questions: Question[];
}) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState(initialQuestions);
  const [shuffleQuestions, setShuffleQuestions] = useState(lesson.shuffle_questions ?? false);
  const [shuffleOptions, setShuffleOptions] = useState(lesson.shuffle_options ?? false);
  const [questionSeconds, setQuestionSeconds] = useState(String(lesson.question_seconds ?? 60));
  const [secondsSaved, setSecondsSaved] = useState(false);
  const [, startTransition] = useTransition();

  const practiceCount = questions.filter(inPractice).length;
  const examCount = questions.filter(inExam).length;
  const notInExam = questions.filter((q) => !inExam(q));

  const saveSeconds = () => {
    const n = Math.min(7200, Math.max(30, Number(questionSeconds) || 60));
    setQuestionSeconds(String(n));
    if (n === (lesson.question_seconds ?? 60) && !secondsSaved) return;
    startTransition(async () => {
      try {
        await updateLessonSettings(lesson.id, { question_seconds: n });
        setSecondsSaved(true);
      } catch {
        alert('تعذّر حفظ الوقت. تأكد من تشغيل ملف التحديث 013 في قاعدة البيانات.');
      }
    });
  };

  const toggleOpen = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleDeleteQuestion = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    startTransition(async () => {
      await deleteQuestion(id);
    });
  };

  const setMode = async (ids: string[], mode: { in_practice?: boolean; in_exam?: boolean }) => {
    const before = questions;
    setQuestions((prev) => prev.map((q) => (ids.includes(q.id) ? { ...q, ...mode } : q)));
    try {
      await setQuestionsMode(ids, mode);
    } catch (err: any) {
      setQuestions(before);
      alert(err.message);
    }
  };

  const toggleMode = (q: Question, field: 'in_practice' | 'in_exam') => {
    const next = { in_practice: inPractice(q), in_exam: inExam(q), [field]: !(field === 'in_practice' ? inPractice(q) : inExam(q)) };
    if (!next.in_practice && !next.in_exam) {
      alert('يجب أن يظهر السؤال في التمرين أو الاختبار على الأقل');
      return;
    }
    setMode([q.id], { [field]: next[field] });
  };

  const openEditor = (q: Question | null) => {
    setEditingQuestion(q);
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionDone = (saved?: Question) => {
    setShowEditor(false);
    if (saved) {
      setQuestions((prev) => {
        const exists = prev.find((q) => q.id === saved.id);
        if (exists) return prev.map((q) => (q.id === saved.id ? saved : q));
        return [...prev, saved];
      });
    }
    setEditingQuestion(null);
  };

  const cardProps = (q: Question) => ({
    question: q,
    open: openIds.has(q.id),
    onToggle: () => toggleOpen(q.id),
    onEdit: () => openEditor(q),
    onDelete: () => handleDeleteQuestion(q.id),
  });

  return (
    <div>
      <div className="text-sm text-muted mb-2">
        <Link href="/admin" className="hover:text-primary-ink">المواد</Link>
        {' / '}
        <Link href={`/admin/subjects/${subjectId}`} className="hover:text-primary-ink">{subjectName}</Link>
        {' / '}
        <span>{lesson.title}</span>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-xl font-bold">{lesson.title}</h1>
        <Badge variant={lesson.status === 'published' ? 'success' : 'warning'}>
          {lesson.status === 'published' ? 'منشور' : lesson.status === 'soon' ? 'قريباً' : 'مسودة'}
        </Badge>
      </div>

      {/* Lesson Settings */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-4">
        <h3 className="font-bold text-sm mb-3">إعدادات الدرس</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shuffleQuestions}
              onChange={(e) => {
                const val = e.target.checked;
                setShuffleQuestions(val);
                startTransition(() => updateLessonSettings(lesson.id, { shuffle_questions: val }));
              }}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm">ترتيب الأسئلة بشكل عشوائي</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => {
                const val = e.target.checked;
                setShuffleOptions(val);
                startTransition(() => updateLessonSettings(lesson.id, { shuffle_options: val }));
              }}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm">ترتيب الخيارات بشكل عشوائي</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm">مدة الاختبار</span>
            <input
              type="number"
              min={30}
              max={7200}
              step={30}
              value={questionSeconds}
              onChange={(e) => {
                setQuestionSeconds(e.target.value);
                setSecondsSaved(false);
              }}
              onBlur={saveSeconds}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              className="w-24 rounded-lg border border-border bg-surface px-2 py-1 text-center text-sm tabular-nums outline-none focus:border-primary"
            />
            <span className="text-sm text-muted">ثانية</span>
            {secondsSaved && <span className="text-xs text-success-ink">تم الحفظ</span>}
          </label>
        </div>
      </div>

      {showEditor && (
        <div className="mb-6">
          <QuestionEditor
            key={editingQuestion?.id ?? 'new'}
            lessonId={lesson.id}
            question={editingQuestion}
            defaultPlacement={{ in_practice: true, in_exam: true }}
            onDone={handleQuestionDone}
            onCancel={() => {
              setShowEditor(false);
              setEditingQuestion(null);
            }}
          />
        </div>
      )}

      {/* All questions in one list, each marked for practice, exam, or both */}
      <section className="space-y-2.5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-bold">الأسئلة ({questions.length})</h3>
            <p className="text-sm text-muted">
              في التمرين: {practiceCount} · في الاختبار: {examCount} (مدة الاختبار: {questionSeconds} ثانية)
            </p>
          </div>
          {notInExam.length > 0 && (
            <button
              type="button"
              onClick={() => setMode(notInExam.map((q) => q.id), { in_exam: true })}
              className="press cursor-pointer rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-on-primary hover:bg-primary-hover"
            >
              إضافة كل الأسئلة إلى الاختبار
            </button>
          )}
        </div>

        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            number={i + 1}
            {...cardProps(q)}
            extra={
              <div className="flex shrink-0 gap-1">
                {([
                  { field: 'in_practice', label: 'تمرين', on: inPractice(q), Icon: BookOpenCheck },
                  { field: 'in_exam', label: 'اختبار', on: inExam(q), Icon: ClipboardList },
                ] as const).map(({ field, label, on, Icon }) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleMode(q, field)}
                    aria-pressed={on}
                    title={on ? `يظهر في ال${label}، اضغط لإزالته` : `اضغط لإضافته إلى ال${label}`}
                    className={`press inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                      on ? 'bg-primary-light text-primary-ink' : 'bg-error-light text-error line-through hover:no-underline hover:ring-1 hover:ring-error/40'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            }
          />
        ))}

        {questions.length === 0 && <p className="card py-8 text-center text-sm text-muted">لا توجد أسئلة بعد</p>}

        <button
          type="button"
          onClick={() => openEditor(null)}
          className="press flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-bold text-muted hover:border-primary hover:text-primary-ink"
        >
          <Plus className="h-4 w-4" />
          إضافة سؤال
        </button>
      </section>
    </div>
  );
}
