'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Check, RotateCcw } from 'lucide-react';
import { GRADIENTS } from '@/components/student/subject-card';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

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
  const { t } = useI18n();
  const S = t.subject;
  const finishedFor = (lessonId: string) => attempts.filter((a) => a.lesson_id === lessonId && a.finished_at);

  const bestPct = (lessonId: string) => {
    const finished = finishedFor(lessonId);
    if (finished.length === 0) return null;
    return Math.max(...finished.map((a) => Math.round(((a.score ?? 0) / Math.max(1, a.total ?? 1)) * 100)));
  };

  const doneCount = lessons.filter((l) => finishedFor(l.id).length > 0).length;
  const progress = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="hero p-6 sm:p-8 animate-fade-up">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white">
            <ArrowRight className="h-3.5 w-3.5 ltr:-scale-x-100" />
            {S.back}
          </Link>
          <h1 dir="auto" className="mt-2 text-2xl sm:text-3xl font-bold">
            {subject.name}
          </h1>
          {subject.description && (
            <p dir="auto" className="mt-2 max-w-md text-sm text-white/80">
              {subject.description}
            </p>
          )}
          <div className="mt-5 max-w-sm">
            <div className="mb-1.5 flex items-center justify-between text-xs text-white/85">
              <span>{S.progress}</span>
              <span>{fmt(S.lessonsDone, { done: doneCount, total: lessons.length })}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{S.lessons}</h2>
          {lessons.length > 0 && <span className="text-sm text-muted">{fmt(S.lessonsCount, { n: lessons.length })}</span>}
        </div>

        {lessons.length === 0 ? (
          <p className="card text-center text-muted py-12">{S.noLessons}</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {lessons.map((lesson, i) => {
              const best = bestPct(lesson.id);
              const tries = finishedFor(lesson.id).length;
              const badge =
                best === null
                  ? { text: S.notStarted, cls: 'bg-surface-hover text-muted' }
                  : best >= 70
                    ? { text: `${best}%`, cls: 'bg-success-light text-success' }
                    : best >= 50
                      ? { text: `${best}%`, cls: 'bg-warning-light text-warning' }
                      : { text: `${best}%`, cls: 'bg-error-light text-error' };
              return (
                <Link
                  key={lesson.id}
                  href={`/subjects/${subject.id}/lessons/${lesson.id}`}
                  className="card card-hover group block overflow-hidden press"
                >
                  <div className="aspect-[16/8] overflow-hidden">
                    <div
                      className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} transition-transform duration-500 group-hover:scale-105`}
                    >
                      <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/15" />
                      <span className="absolute -bottom-8 right-6 h-20 w-20 rounded-full bg-white/10" />
                      <span className="relative text-4xl font-bold text-white/95">{i + 1}</span>
                      {best !== null && (
                        <span className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-success shadow">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 dir="auto" className="font-bold text-foreground">
                        {lesson.title}
                      </h3>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.text}</span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                      {tries > 0 ? (
                        <>
                          <RotateCcw className="h-3.5 w-3.5" />
                          {fmt(S.attempts, { n: tries })}
                        </>
                      ) : (
                        S.firstAttempt
                      )}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      <BookOpen className="h-3.5 w-3.5" />
                      {best === null ? S.startLesson : S.continue}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
