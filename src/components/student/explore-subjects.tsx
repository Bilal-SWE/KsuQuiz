'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { normalizeArabic } from '@/lib/arabic';
import { SubjectCard } from '@/components/student/subject-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
};

export function ExploreSubjects({
  subjects,
  enrolledIds,
  initialQuery,
}: {
  subjects: Subject[];
  enrolledIds: string[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [enrolled, setEnrolled] = useState(new Set(enrolledIds));
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = query.trim()
    ? subjects.filter((s) =>
        normalizeArabic(s.name).includes(normalizeArabic(query)),
      )
    : subjects;

  const toggleEnroll = async (subjectId: string) => {
    const supabase = createClient();
    if (enrolled.has(subjectId)) {
      await supabase.from('enrollments').delete().match({
        student_id: (await supabase.auth.getUser()).data.user!.id,
        subject_id: subjectId,
      });
      setEnrolled((prev) => {
        const next = new Set(prev);
        next.delete(subjectId);
        return next;
      });
    } else {
      const userId = (await supabase.auth.getUser()).data.user!.id;
      await supabase.from('enrollments').insert({
        student_id: userId,
        subject_id: subjectId,
      });
      setEnrolled((prev) => new Set(prev).add(subjectId));
    }
    startTransition(() => router.refresh());
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">تصفح المواد</h1>

      <div className="mb-6">
        <Input
          placeholder="ابحث عن مادة..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد نتائج"
          description={query ? 'جرّب كلمات بحث مختلفة' : 'لا توجد مواد منشورة حالياً'}
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((subject) => (
            <div key={subject.id} className="relative">
              <SubjectCard subject={subject} enrolled={enrolled.has(subject.id)} />
              <div className="mt-2">
                <Button
                  variant={enrolled.has(subject.id) ? 'secondary' : 'primary'}
                  className="w-full text-sm"
                  onClick={() => toggleEnroll(subject.id)}
                >
                  {enrolled.has(subject.id) ? 'إزالة من موادي' : 'إضافة إلى موادي'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
