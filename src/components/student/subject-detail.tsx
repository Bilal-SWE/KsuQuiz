'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type Lesson = { id: string; title: string; sort_order: number };
type Attempt = { lesson_id: string; score: number | null; total: number | null; finished_at: string | null };

export function SubjectDetail({
  subject,
  lessons,
  attempts,
}: {
  subject: { id: string; name: string; description: string | null; cover_image: string | null };
  lessons: Lesson[];
  attempts: Attempt[];
}) {
  const lessonAttempts = (lessonId: string) =>
    attempts.filter((a) => a.lesson_id === lessonId && a.finished_at);

  const bestScore = (lessonId: string) => {
    const finished = lessonAttempts(lessonId);
    if (finished.length === 0) return null;
    const best = finished.reduce((a, b) =>
      (a.score ?? 0) / (a.total ?? 1) > (b.score ?? 0) / (b.total ?? 1) ? a : b,
    );
    return { score: best.score ?? 0, total: best.total ?? 1 };
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">{subject.name}</h1>
      {subject.description && (
        <p className="text-sm text-muted mb-6">{subject.description}</p>
      )}

      <div className="space-y-3">
        {lessons.map((lesson, i) => {
          const best = bestScore(lesson.id);
          const attemptCount = lessonAttempts(lesson.id).length;
          return (
            <Link
              key={lesson.id}
              href={`/subjects/${subject.id}/lessons/${lesson.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-primary text-sm font-bold">
                  {i + 1}
                </span>
                <span className="font-medium">{lesson.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {attemptCount > 0 && (
                  <Badge variant="default">{attemptCount} محاولة</Badge>
                )}
                {best && (
                  <Badge variant={best.score / best.total >= 0.7 ? 'success' : 'warning'}>
                    {Math.round((best.score / best.total) * 100)}%
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <p className="text-center text-muted py-12">لا توجد دروس منشورة في هذه المادة حالياً</p>
      )}
    </div>
  );
}
