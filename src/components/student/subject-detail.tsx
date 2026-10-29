'use client';

import Link from 'next/link';
import { ArrowRight, Clock, ListChecks, Lock } from 'lucide-react';
import { FILLS } from '@/components/student/subject-card';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

type Lesson = { id: string; title: string; sort_order: number; status?: string };
type Attempt = { lesson_id: string; score: number | null; total: number | null; finished_at: string | null };

export function SubjectDetail({
  subject,
  lessons,
  attempts,
  freeLessons,
  questionCounts,
}: {
  subject: { id: string; name: string; description: string | null; cover_image: string | null };
  lessons: Lesson[];
  attempts: Attempt[];
  // How many lessons a free student can open; null when everything is unlocked.
  freeLessons: number | null;
  questionCounts: Record<string, number>;
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
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-primary-light to-surface px-4 pt-6 pb-7 text-center sm:px-8 sm:pt-8 sm:pb-9 animate-fade-up">
        <span className="pointer-events-none absolute -top-16 -start-16 h-48 w-48 rounded-full bg-primary/10" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-20 -end-10 h-40 w-40 rounded-full bg-accent/15" aria-hidden="true" />
        <div className="relative">
          <Link
            href="/my-subjects"
            className="press inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-bold text-muted shadow-sm hover:text-ink"
          >
            <ArrowRight className="h-3.5 w-3.5 ltr:-scale-x-100" />
            {S.back}
          </Link>
          <h1 dir="auto" className="mt-3 text-2xl font-extrabold sm:text-4xl">
            {subject.name}
          </h1>
          {subject.description && (
            <p dir="auto" className="mx-auto mt-1.5 max-w-md text-sm text-muted sm:text-base">
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
              // "Soon" lessons are listed but cannot be opened; the free allowance counts
              // only published lessons, matching can_access_lesson in the database.
              const soon = lesson.status === 'soon';
              const publishedIndex = lessons.slice(0, i).filter((l) => l.status !== 'soon').length;
              const locked = !soon && freeLessons !== null && publishedIndex >= freeLessons;
              const best = bestPct(lesson.id);
              const body = (
                <>
                  <div className="aspect-[16/10] overflow-hidden">
                    <div
                      className={`relative flex h-full w-full items-center justify-center ${FILLS[i % FILLS.length]} transition-transform duration-500 group-hover:scale-105`}
                    >
                      <span className="absolute -start-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
                      <span className="absolute -bottom-6 end-8 h-10 w-10 rounded-full bg-white/25" />
                      <span className={`relative text-2xl font-bold sm:text-3xl ${locked || soon ? 'opacity-40' : ''}`}>{i + 1}</span>
                      {soon && (
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-accent-ink shadow-md">
                            <Clock className="h-4 w-4" />
                          </span>
                          <span className="rounded-full bg-surface/90 px-2.5 py-0.5 text-[11px] font-bold text-accent-ink shadow-sm">{S.soon}</span>
                        </span>
                      )}
                      {locked && (
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-background shadow-md">
                            <Lock className="h-4 w-4" />
                          </span>
                          <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-background shadow-sm">{S.locked}</span>
                        </span>
                      )}
                      {!soon && (
                        <span className="absolute top-1.5 start-1.5 inline-flex items-center gap-1 rounded-full bg-surface/95 px-2 py-0.5 text-[11px] font-bold text-ink shadow-sm">
                          <ListChecks className="h-3 w-3 text-primary-ink" />
                          {fmt(t.subjectCard.questions, { n: questionCounts[lesson.id] ?? 0 })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-2.5 py-2 text-center sm:px-3">
                    <h3 dir="auto" className="truncate text-sm font-bold text-foreground sm:text-base">
                      {lesson.title}
                    </h3>
                  </div>
                </>
              );
              return soon ? (
                <div
                  key={lesson.id}
                  aria-disabled="true"
                  title={S.soonHint}
                  className="card block cursor-not-allowed overflow-hidden !rounded-2xl opacity-70 grayscale-[40%]"
                >
                  {body}
                </div>
              ) : (
                <Link
                  key={lesson.id}
                  href={`/subjects/${subject.id}/lessons/${lesson.id}`}
                  title={best === null ? S.startLesson : S.continue}
                  className="card card-hover group block overflow-hidden !rounded-2xl press"
                >
                  {body}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
