'use client';

import Link from 'next/link';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
};

export function SubjectCard({ subject, enrolled }: { subject: Subject; enrolled?: boolean }) {
  return (
    <Link
      href={`/subjects/${subject.id}`}
      className="block rounded-xl border border-border bg-surface p-4 hover:shadow-md transition-shadow"
    >
      {subject.cover_image && (
        <div className="mb-3 aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img
            src={subject.cover_image}
            alt={subject.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="font-semibold text-foreground mb-1">{subject.name}</h3>
      {subject.description && (
        <p className="text-sm text-muted line-clamp-2">{subject.description}</p>
      )}
      {enrolled && (
        <span className="inline-block mt-2 text-xs text-primary font-medium">مسجّل</span>
      )}
    </Link>
  );
}
