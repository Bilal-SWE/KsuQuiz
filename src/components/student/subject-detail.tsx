'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Check, RotateCcw } from 'lucide-react';
import { FILLS } from '@/components/student/subject-card';
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
    <div className="space-y-5 sm:space-y-8">
      <section className="hero p-5 sm:p-8 animate-fade-up">
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
          <div className="mt-4 max-w-sm sm:mt-5">
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
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h2 className="text-lg font-bold sm:text-xl">{S.lessons}</h2>
          {lessons.length > 0 && <span className="text-sm text-muted">{fmt(S.lessonsCount, { n: lessons.length })}</span>}
        </div>

        {lessons.length === 0 ? (
          <p className="card text-center text-muted py-12">{S.noLessons}</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 stagger">
            {lessons.map((lesson, i) => {
              const best = bestPct(lesson.id);
              const tries = finishedFor(lesson.id).length;
              const badge =
                best === null
                  ? { text: S.notStarted, cls: 'bg-surface-hover text-muted' }
                  : best >= 70
                    ? { text: `${best}%`, cls: 'bg-success-light text-success-ink' }
                    : best >= 50
                      ? { text: `${best}%`, cls: 'bg-warning-light text-warning-ink' }
                      : { text: `${best}%`, cls: 'bg-error-light text-error' };
              return (
                <Link
                  key={lesson.id}
                  href={`/subjects/${subject.id}/lessons/${lesson.id}`}
                  className="card card-hover group flex overflow-hidden press sm:block"
                >
                  <div className="w-20 shrink-0 overflow-hidden sm:aspect-[16/8] sm:w-auto">
                    <div
                      className={`relative flex h-full min-h-20 w-full items-center justify-center ${FILLS[i % FILLS.length]} transition-transform duration-500 group-hover:scale-105`}
                    >
                      <span className="absolute -start-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
                      <span className="absolute -bottom-6 end-8 h-10 w-10 rounded-full bg-white/25" />
                      <span className="relative text-3xl font-bold sm:text-4xl">{i + 1}</span>
                      {best !== null && (
                        <span className="absolute top-1.5 end-1.5 flex h-6 w-6 items-center sm:top-3 sm:end-3 sm:h-7 sm:w-7 justify-center rounded-full bg-white text-success-ink shadow">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 p-3 sm:p-4">
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
                    <span className="mt-3 hidden items-center gap-1 text-xs font-medium text-primary-ink opacity-0 sm:inline-flex transition-opacity group-hover:opacity-100">
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
