'use client';

import Link from 'next/link';
import { Compass, Trophy } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth-context';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { SubjectCard } from '@/components/student/subject-card';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الخير';
  if (h < 18) return 'مساء النور';
  return 'مساء الخير';
}

export function StudentHome({ subjects }: { subjects: Subject[] }) {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')[0];

  return (
    <div className="space-y-8">
      <section className="hero p-6 sm:p-8 animate-fade-up">
        <div className="relative z-10">
          <p className="text-sm text-white/80" suppressHydrationWarning>
            {greeting()}
            {firstName ? `، ${firstName}` : ''}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold">جاهز لتحدٍّ جديد اليوم؟</h1>
          <p className="mt-2 max-w-md text-sm text-white/80">
            تدرّب على أسئلة موادك، اختبر نفسك، وتنافس مع زملائك على الصدارة.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/explore"
              className="press inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-lg hover:bg-white/90"
            >
              <Compass className="h-4 w-4" />
              تصفح المواد
            </Link>
            <Link
              href="/leaderboard"
              className="press inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
            >
              <Trophy className="h-4 w-4" />
              الترتيب العام
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">موادي</h2>
          {subjects.length > 0 && <span className="text-sm text-muted">{subjects.length} مادة</span>}
        </div>

        {subjects.length === 0 ? (
          <EmptyState
            title="ابدأ بإضافة أول مادة"
            description="تصفح المواد المتاحة وأضف ما يناسبك لتبدأ التدريب"
            action={
              <Link href="/explore">
                <Button>تصفح المواد</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} enrolled />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
