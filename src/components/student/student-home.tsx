'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { normalizeArabic } from '@/lib/arabic';
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
  question_count?: number;
};

export function StudentHome({ subjects }: { subjects: Subject[] }) {
  const { t } = useI18n();
  const H = t.home;
  const E = t.explore;
  const [query, setQuery] = useState('');
  const q = normalizeArabic(query.trim());
  const shown = q ? subjects.filter((s) => normalizeArabic(s.name).includes(q)) : subjects;

  return (
    <div className="space-y-5 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-primary-light to-surface px-4 pt-7 pb-5 text-center sm:px-8 sm:pt-10 sm:pb-6 animate-fade-up">
        <span className="pointer-events-none absolute -top-16 -start-16 h-48 w-48 rounded-full bg-primary/10" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-20 -end-10 h-40 w-40 rounded-full bg-accent/15" aria-hidden="true" />

        <div className="relative">
          <h1 className="text-2xl font-extrabold sm:text-4xl">{H.mySubjects}</h1>

          <div className="relative mx-auto mt-5 max-w-xl">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-ink" />
            <input
              type="search"
              placeholder={E.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={E.search}
              className="w-full rounded-full border-2 border-transparent bg-surface py-3.5 ps-12 pe-12 text-base text-foreground shadow-[0_10px_30px_-12px_rgb(11_31_51/0.25)] placeholder:text-muted/70 focus:border-primary focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={E.clearSearch}
                className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface-hover text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {query.trim() && (
            <p className="mt-2 text-xs font-medium text-muted" role="status">
              {fmt(E.resultsCount, { n: shown.length })}
            </p>
          )}
        </div>
      </section>

      <section>
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
        ) : shown.length === 0 ? (
          <EmptyState icon={<Search className="h-7 w-7" />} title={E.noResults} description={E.tryDifferent} />
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 stagger">
            {shown.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} enrolled />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
