'use client';

import Link from 'next/link';
import { BookOpen, Check } from 'lucide-react';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
};

export const GRADIENTS = [
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-pink-500 to-purple-500',
];

export function subjectGradient(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

export function SubjectCover({ subject, className = '' }: { subject: Subject; className?: string }) {
  if (subject.cover_image) {
    return <img src={subject.cover_image} alt={subject.name} className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${subjectGradient(subject.name)} ${className}`}>
      <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/15" />
      <span className="absolute -bottom-8 right-6 h-20 w-20 rounded-full bg-white/10" />
      <span className="relative text-4xl font-bold text-white/95">
        {(subject.name.trim().replace(/^ال(?=\S{2})/, '') || subject.name).charAt(0)}
      </span>
    </div>
  );
}

export function SubjectCard({ subject, enrolled }: { subject: Subject; enrolled?: boolean }) {
  return (
    <Link href={`/subjects/${subject.id}`} className="card card-hover group block overflow-hidden press">
      <div className="aspect-[16/8] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <SubjectCover subject={subject} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground">{subject.name}</h3>
          {enrolled && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success">
              <Check className="h-3 w-3" />
              مسجّل
            </span>
          )}
        </div>
        {subject.description && <p className="mt-1 text-sm text-muted line-clamp-2">{subject.description}</p>}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          <BookOpen className="h-3.5 w-3.5" />
          ابدأ المذاكرة
        </span>
      </div>
    </Link>
  );
}
