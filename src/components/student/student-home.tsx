'use client';

import Link from 'next/link';
import { Compass, Trophy } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth-context';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';
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
  const { profile } = useAuth();
  const { t, locale } = useI18n();
  const H = t.home;
  const firstName = profile?.full_name?.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? H.morning : hour < 18 ? H.afternoon : H.evening;
  const comma = locale === 'ar' ? '، ' : ', ';

  return (
    <div className="space-y-5 sm:space-y-8">
      <section className="hero p-5 sm:p-8 animate-fade-up">
        <div className="relative z-10">
          <p className="text-sm text-white/80" suppressHydrationWarning>
            {greeting}
            {firstName ? `${comma}${firstName}` : ''}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{H.heroTitle}</h1>
          <p className="mt-2 max-w-md text-sm text-white/80">{H.heroText}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/"
              className="press inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-primary-ink shadow-lg hover:bg-white/90"
            >
              <Compass className="h-4 w-4" />
              {H.browse}
            </Link>
            <Link
              href="/leaderboard"
              className="press inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
            >
              <Trophy className="h-4 w-4" />
              {H.overallRank}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{H.mySubjects}</h2>
          {subjects.length > 0 && <span className="text-sm text-muted">{fmt(H.subjectsCount, { n: subjects.length })}</span>}
        </div>

        {subjects.length === 0 ? (
          <EmptyState
            title={H.emptyTitle}
            description={H.emptyDesc}
            action={
              <Link href="/">
                <Button>{H.browse}</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 stagger">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} enrolled />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
