'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { QuestionEditor } from '@/components/admin/question-editor';
import { QuestionPreview } from '@/components/admin/question-preview';
import { deleteQuestion } from '@/app/actions/admin';

type Lesson = {
  id: string;
  title: string;
  status: string;
  subject_id: string;
};

type Question = {
  id: string;
  type: string;
  content: any;
  explanation: string | null;
  sort_order: number;
};

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
  const router = useRouter();
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState(initialQuestions);
  const [, startTransition] = useTransition();

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    startTransition(async () => {
      await deleteQuestion(id);
    });
  };

  const handleQuestionDone = () => {
    setShowEditor(false);
    setEditingQuestion(null);
    router.refresh();
  };

  return (
    <div>
      <div className="text-sm text-muted mb-2">
        <Link href="/admin" className="hover:text-primary">المواد</Link>
        {' / '}
        <Link href={`/admin/subjects/${subjectId}`} className="hover:text-primary">{subjectName}</Link>
        {' / '}
        <span>{lesson.title}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">{lesson.title}</h1>
          <Badge variant={lesson.status === 'published' ? 'success' : 'warning'}>
            {lesson.status === 'published' ? 'منشور' : 'مسودة'}
          </Badge>
        </div>
        <Button onClick={() => { setEditingQuestion(null); setShowEditor(true); }}>
          إضافة سؤال
        </Button>
      </div>

      {showEditor && (
        <div className="mb-6 rounded-xl border border-border bg-surface p-5">
          <QuestionEditor
            lessonId={lesson.id}
            question={editingQuestion}
            onDone={handleQuestionDone}
            onCancel={() => {
              setShowEditor(false);
              setEditingQuestion(null);
            }}
          />
        </div>
      )}

      {questions.length === 0 && !showEditor ? (
        <EmptyState title="لا توجد أسئلة" description="ابدأ بإضافة سؤال جديد" />
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted">سؤال {index + 1}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="text-xs px-2 py-1"
                    onClick={() => {
                      setEditingQuestion(q);
                      setShowEditor(true);
                    }}
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-xs px-2 py-1 text-error"
                    onClick={() => handleDeleteQuestion(q.id)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
              <QuestionPreview question={q} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
