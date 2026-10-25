'use client';

import Link from 'next/link';
import { BookOpen, Check } from 'lucide-react';
import { useI18n } from '@/i18n/client';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
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
      <span className="relative text-3xl font-bold sm:text-4xl">
        {(subject.name.trim().replace(/^ال(?=\S{2})/, '') || subject.name).charAt(0)}
      </span>
    </div>
  );
}

export function SubjectCard({ subject, enrolled }: { subject: Subject; enrolled?: boolean }) {
  const { t } = useI18n();
  return (
    <Link href={`/subjects/${subject.id}`} className="card card-hover group flex overflow-hidden press sm:block">
      <div className="w-24 shrink-0 overflow-hidden sm:aspect-[16/8] sm:w-auto">
        <div className="h-full min-h-24 w-full transition-transform duration-500 group-hover:scale-105">
          <SubjectCover subject={subject} />
        </div>
      </div>
      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 dir="auto" className="font-bold text-foreground">
            {subject.name}
          </h3>
          {enrolled && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success-ink">
              <Check className="h-3 w-3" />
              {t.subjectCard.enrolled}
            </span>
          )}
        </div>
        {subject.description && (
          <p dir="auto" className="mt-1 text-sm text-muted line-clamp-2">
            {subject.description}
          </p>
        )}
        <span className="mt-3 hidden items-center gap-1 text-xs font-medium text-primary-ink opacity-0 transition-opacity group-hover:opacity-100 sm:inline-flex">
          <BookOpen className="h-3.5 w-3.5" />
          {t.subjectCard.startStudying}
        </span>
      </div>
    </Link>
  );
}
