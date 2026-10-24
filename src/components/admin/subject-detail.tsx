'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  updateSubject,
  deleteSubject,
  createLesson,
  deleteLesson,
  updateLesson,
  reorderLessons,
} from '@/app/actions/admin';
import { SubjectForm } from '@/components/admin/subject-form';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  status: string;
  category_id?: string | null;
};

type Lesson = {
  id: string;
  title: string;
  sort_order: number;
  status: string;
};

export function AdminSubjectDetail({ subject: initialSubject, lessons: initialLessons }: { subject: Subject; lessons: Lesson[] }) {
  const router = useRouter();
  const { profile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState(initialLessons);
  const [subject, setSubject] = useState(initialSubject);
  const [, startTransition] = useTransition();

  const handleUpdateSubject = async (data: any) => {
    await updateSubject(subject.id, data);
    setSubject((prev) => ({ ...prev, ...data }));
    setEditing(false);
  };

  const handleDeleteSubject = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة وجميع دروسها؟')) return;
    await deleteSubject(subject.id);
    router.push('/admin');
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;
    setLoading(true);
    const title = newLessonTitle;
    setNewLessonTitle('');
    startTransition(async () => {
      const lesson = await createLesson(subject.id, { title });
      setLessons((prev) => [...prev, { id: lesson.id, title, sort_order: prev.length + 1, status: 'draft' }]);
      setLoading(false);
    });
  };

  const handleToggleLessonStatus = async (lesson: Lesson) => {
    const newStatus = lesson.status === 'published' ? 'draft' : 'published';
    setLessons((prev) => prev.map((l) => l.id === lesson.id ? { ...l, status: newStatus } : l));
    startTransition(async () => {
      await updateLesson(lesson.id, { status: newStatus });
    });
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    startTransition(async () => {
      await deleteLesson(lessonId);
    });
  };

  const moveLesson = async (index: number, direction: -1 | 1) => {
    const ordered = [...lessons];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;
    [ordered[index], ordered[targetIndex]] = [ordered[targetIndex], ordered[index]];
    setLessons(ordered);
    startTransition(async () => {
      await reorderLessons(subject.id, ordered.map((l) => l.id));
    });
  };

  if (editing) {
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-6">تعديل المادة</h1>
        <SubjectForm
          onSubmit={handleUpdateSubject}
          initial={subject}
        />
        <Button variant="ghost" onClick={() => setEditing(false)} className="w-full mt-2">
          إلغاء
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{subject.name}</h1>
            <Badge variant={subject.status === 'published' ? 'success' : 'warning'}>
              {subject.status === 'published' ? 'منشور' : 'مسودة'}
            </Badge>
          </div>
          {subject.description && <p className="text-sm text-muted mt-1">{subject.description}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>تعديل</Button>
          {profile?.role === 'owner' && (
            <Button variant="danger" onClick={handleDeleteSubject}>حذف</Button>
          )}
        </div>
      </div>

      {/* Lessons */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">الدروس</h2>

        <form onSubmit={handleAddLesson} className="flex gap-2 mb-4">
          <Input
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="عنوان الدرس الجديد"
            className="flex-1"
          />
          <Button type="submit" loading={loading}>إضافة</Button>
        </form>

        {lessons.length === 0 ? (
          <EmptyState title="لا توجد دروس" description="ابدأ بإضافة درس جديد" />
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveLesson(index, -1)}
                      disabled={index === 0}
                      className="text-xs text-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveLesson(index, 1)}
                      disabled={index === lessons.length - 1}
                      className="text-xs text-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                    >
                      ▼
                    </button>
                  </div>
                  <Link
                    href={`/admin/subjects/${subject.id}/lessons/${lesson.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {lesson.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={lesson.status === 'published' ? 'success' : 'warning'}>
                    {lesson.status === 'published' ? 'منشور' : 'مسودة'}
                  </Badge>
                  <Button
                    variant="ghost"
                    className="text-xs px-2 py-1"
                    onClick={() => handleToggleLessonStatus(lesson)}
                  >
                    {lesson.status === 'published' ? 'إخفاء' : 'نشر'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-xs px-2 py-1 text-error"
                    onClick={() => handleDeleteLesson(lesson.id)}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
