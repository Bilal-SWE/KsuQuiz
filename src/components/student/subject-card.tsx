'use client';

import Link from 'next/link';
import { Check, ListChecks } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  question_count?: number;
};

// The design's pastel card fills; navy text keeps 4.5:1 on each.
export const FILLS = [
  'bg-pastel-teal text-ink',
  'bg-pastel-amber text-ink',
  'bg-pastel-blue text-ink',
  'bg-pastel-peach text-ink',
];

export function subjectFill(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FILLS[h % FILLS.length];
}

export function SubjectCover({ subject, className = '' }: { subject: Subject; className?: string }) {
  if (subject.cover_image) {
    return <img src={subject.cover_image} alt={subject.name} className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <div className={`relative flex h-full w-full items-center justify-center ${subjectFill(subject.name)} ${className}`}>
      <span className="absolute -start-6 -top-6 h-24 w-24 rounded-full bg-white/20" />
      <span className="absolute -bottom-6 end-8 h-10 w-10 rounded-full bg-white/25" />
      <span className="relative text-2xl font-bold sm:text-3xl">
        {(subject.name.trim().replace(/^ال(?=\S{2})/, '') || subject.name).charAt(0)}
      </span>
    </div>
  );
}

export function SubjectCard({ subject, enrolled, soon }: { subject: Subject; enrolled?: boolean; soon?: boolean }) {
  const { t } = useI18n();

  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className={`h-full w-full transition-transform duration-500 ${soon ? 'grayscale' : 'group-hover:scale-105'}`}>
          <SubjectCover subject={subject} />
        </div>
        {soon && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/40">
            <span className="rounded-full bg-accent-light px-3 py-1 text-xs font-bold text-accent-ink shadow">قريباً</span>
          </span>
        )}
        {!soon && subject.question_count !== undefined && (
          <span className="absolute top-1.5 start-1.5 inline-flex items-center gap-1 rounded-full bg-surface/95 px-2 py-0.5 text-[11px] font-bold text-ink shadow-sm backdrop-blur">
            <ListChecks className="h-3 w-3 text-primary-ink" />
            {fmt(t.subjectCard.questions, { n: subject.question_count })}
          </span>
        )}
      </div>
      <div className="px-2.5 py-2 text-center sm:px-3">
        <div className="flex items-center justify-center gap-1.5">
          <h3 dir="auto" className="min-w-0 truncate text-sm font-bold text-foreground sm:text-base">
            {subject.name}
          </h3>
          {enrolled && <Check className="h-3.5 w-3.5 shrink-0 text-success-ink" aria-label={t.subjectCard.enrolled} />}
        </div>
        {subject.description && (
          <p dir="auto" className="mt-0.5 truncate text-xs text-muted">
            {subject.description}
          </p>
        )}
      </div>
    </>
  );

  if (soon) {
    return (
      <div className="card group block overflow-hidden !rounded-2xl opacity-75 cursor-default">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/subjects/${subject.id}`}
      title={t.subjectCard.startStudying}
      className="card card-hover group block overflow-hidden !rounded-2xl press"
    >
      {inner}
    </Link>
  );
}
