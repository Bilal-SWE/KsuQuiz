'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { SubjectCard } from '@/components/student/subject-card';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
};

export function StudentHome({ subjects }: { subjects: Subject[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">موادي</h1>
        <Link href="/explore">
          <Button variant="secondary">تصفح المواد</Button>
        </Link>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          title="لم تضف أي مادة بعد"
          description="تصفح المواد المتاحة وأضف ما يناسبك"
          action={
            <Link href="/explore">
              <Button>تصفح المواد</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} enrolled />
          ))}
        </div>
      )}
    </div>
  );
}
