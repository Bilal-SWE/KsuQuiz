'use client';

import Link from 'next/link';
import { ArrowRight, Lock, RotateCcw } from 'lucide-react';
import { FILLS } from '@/components/student/subject-card';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

type Lesson = { id: string; title: string; sort_order: number };
type Attempt = { lesson_id: string; score: number | null; total: number | null; finished_at: string | null };

export function SubjectDetail({
  subject,
  lessons,
  attempts,
  freeLessons,
}: {
  subject: { id: string; name: string; description: string | null; cover_image: string | null };
  lessons: Lesson[];
  attempts: Attempt[];
  // How many lessons a free student can open; null when everything is unlocked.
  freeLessons: number | null;
}) {
  const { t } = useI18n();
  const S = t.subject;
  const finishedFor = (lessonId: string) => attempts.filter((a) => a.lesson_id === lessonId && a.finished_at);

  const bestPct = (lessonId: string) => {
    const finished = finishedFor(lessonId);
    if (finished.length === 0) return null;
    return Math.max(...finished.map((a) => Math.round(((a.score ?? 0) / Math.max(1, a.total ?? 1)) * 100)));
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      <section className="hero p-5 sm:p-8 animate-fade-up">
        <div className="relative z-10">
          <Link href="/my-subjects" className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white">
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
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 stagger">
            {lessons.map((lesson, i) => {
              const locked = freeLessons !== null && i >= freeLessons;
              const best = bestPct(lesson.id);
              const tries = finishedFor(lesson.id).length;
              const scoreCls =
                best === null
                  ? ''
                  : best >= 70
                    ? 'bg-success-light text-success-ink'
                    : best >= 50
                      ? 'bg-warning-light text-warning-ink'
                      : 'bg-error-light text-error';
              return (
                <Link
                  key={lesson.id}
                  href={`/subjects/${subject.id}/lessons/${lesson.id}`}
                  title={best === null ? S.startLesson : S.continue}
                  className="card card-hover group block overflow-hidden !rounded-2xl press"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <div
                      className={`relative flex h-full w-full items-center justify-center ${FILLS[i % FILLS.length]} transition-transform duration-500 group-hover:scale-105`}
                    >
                      <span className="absolute -start-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
                      <span className="absolute -bottom-6 end-8 h-10 w-10 rounded-full bg-white/25" />
                      <span className={`relative text-2xl font-bold sm:text-3xl ${locked ? 'opacity-40' : ''}`}>{i + 1}</span>
                      {locked && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-background shadow-md">
                            <Lock className="h-4 w-4" />
                          </span>
                        </span>
                      )}
                      {best !== null && (
                        <span className={`absolute top-1.5 end-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${scoreCls}`}>
                          {best}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-2.5 py-2 text-center sm:px-3">
                    <h3 dir="auto" className="truncate text-sm font-bold text-foreground sm:text-base">
                      {lesson.title}
                    </h3>
                    <p className="mt-0.5 flex items-center justify-center gap-1 truncate text-xs text-muted">
                      {locked ? (
                        <span className="font-bold text-accent-ink">{S.locked}</span>
                      ) : tries > 0 ? (
                        <>
                          <RotateCcw className="h-3 w-3 shrink-0" />
                          {fmt(S.attempts, { n: tries })}
                        </>
                      ) : (
                        S.notStarted
                      )}
                    </p>
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
