'use client';

import Link from 'next/link';
import { BookOpen, Check, Crown, Lock } from 'lucide-react';
import { SubscribeButton } from '@/components/shell/subscribe-button';
import { useI18n } from '@/i18n/client';

// Shown instead of the quiz when a free student opens a lesson past the free ones.
export function LockedLesson({ subjectId, lessonTitle }: { subjectId: string; lessonTitle: string }) {
  const { t } = useI18n();
  const L = t.lesson;
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 animate-fade-up">
      <span dir="auto" className="truncate text-center text-sm font-medium text-muted">
        {lessonTitle}
      </span>

      <section className="card flex flex-col items-center gap-4 !rounded-[28px] px-5 py-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-light text-accent-ink">
          <Lock className="h-8 w-8" />
        </span>
        <div>
          <h1 className="text-xl font-extrabold sm:text-2xl">{L.lockedTitle}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">{L.lockedText}</p>
        </div>
        <ul className="w-full space-y-2 text-start">
          {t.pricing.premiumFeatures.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-ink">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <SubscribeButton className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-extrabold text-on-primary hover:bg-primary-hover">
          <Crown className="h-5 w-5" />
          {L.lockedCta}
        </SubscribeButton>
        <p className="text-xs text-muted">{t.pricing.premiumPriceNote}</p>
      </section>

      <Link
        href={`/subjects/${subjectId}`}
        className="press mx-auto flex h-9 items-center gap-1.5 rounded-full border-2 border-border bg-surface px-5 text-sm font-bold text-ink hover:border-ink"
      >
        <BookOpen className="h-4 w-4" />
        {L.backToLessons}
      </Link>
    </div>
  );
}
