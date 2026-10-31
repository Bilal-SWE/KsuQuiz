'use client';

import { useState } from 'react';
import { Check, FolderOpen, Plus, Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { normalizeArabic } from '@/lib/arabic';
import { categoryColor, type Category } from '@/lib/categories';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';
import { SubjectCard } from '@/components/student/subject-card';
import { EmptyState } from '@/components/ui/empty-state';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  category_id: string | null;
  question_count?: number;
  status?: 'published' | 'soon';
};

const UNCATEGORIZED = 'none';

export function ExploreSubjects({
  subjects,
  categories,
  enrolledIds,
  initialQuery,
}: {
  subjects: Subject[];
  categories: Category[];
  enrolledIds: string[];
  initialQuery: string;
}) {
  const { t } = useI18n();
  const E = t.explore;
  const [query, setQuery] = useState(initialQuery);
  const [enrolled, setEnrolled] = useState(new Set(enrolledIds));

  const validIds = new Set(categories.map((c) => c.id));
  const catOf = (s: Subject) => (s.category_id && validIds.has(s.category_id) ? s.category_id : UNCATEGORIZED);
  const filtered = subjects.filter((s) => {
    if (query.trim() && !normalizeArabic(s.name).includes(normalizeArabic(query))) return false;
    return true;
  });

  const showGrouped = !query.trim() && categories.length > 0;
  const groups = showGrouped
    ? [
        ...categories.map((c) => ({ key: c.id, name: c.name, color: c.color, items: filtered.filter((s) => catOf(s) === c.id) })),
        { key: UNCATEGORIZED, name: E.otherSubjects, color: 'violet', items: filtered.filter((s) => catOf(s) === UNCATEGORIZED) },
      ].filter((g) => g.items.length > 0)
    : [];

  const toggleEnroll = async (subjectId: string) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;
    const wasEnrolled = enrolled.has(subjectId);

    setEnrolled((prev) => {
      const next = new Set(prev);
      if (wasEnrolled) next.delete(subjectId);
      else next.add(subjectId);
      return next;
    });

    if (wasEnrolled) {
      await supabase.from('enrollments').delete().match({ student_id: userId, subject_id: subjectId });
    } else {
      await supabase.from('enrollments').insert({ student_id: userId, subject_id: subjectId });
    }
  };

  const renderGrid = (items: Subject[]) => (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 stagger">
      {items.map((subject) => {
        const isEnrolled = enrolled.has(subject.id);
        return (
          <div key={subject.id} className="relative">
            <SubjectCard subject={subject} soon={subject.status === 'soon'} />
            {subject.status !== 'soon' && (
              <button
                type="button"
                onClick={() => toggleEnroll(subject.id)}
                title={isEnrolled ? E.inMySubjects : E.addToMySubjects}
                aria-label={isEnrolled ? E.inMySubjects : E.addToMySubjects}
                aria-pressed={isEnrolled}
                className={`press absolute top-1.5 end-1.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors ${
                  isEnrolled
                    ? 'bg-primary text-on-primary hover:bg-primary-hover'
                    : 'border border-border bg-surface text-primary-ink hover:bg-primary-light'
                }`}
              >
                {isEnrolled ? <Check className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" strokeWidth={3} />}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-primary-light to-surface px-4 pt-7 pb-5 text-center sm:px-8 sm:pt-10 sm:pb-6 animate-fade-up">
        <span className="pointer-events-none absolute -top-16 -start-16 h-48 w-48 rounded-full bg-primary/10" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-20 -end-10 h-40 w-40 rounded-full bg-accent/15" aria-hidden="true" />

        <div className="relative">
          <h1 className="text-2xl font-extrabold sm:text-4xl">{E.title}</h1>

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
              {fmt(E.resultsCount, { n: filtered.length })}
            </p>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-7 w-7" />}
          title={E.noResults}
          description={query ? E.tryDifferent : E.noneInCategory}
        />
      ) : showGrouped ? (
        <div className="space-y-10">
          {groups.map((g) => {
            const col = categoryColor(g.color);
            return (
              <section key={g.key}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${col.fill}`}>
                      <FolderOpen className="h-5 w-5" />
                    </span>
                    {g.name}
                  </h2>
                  <span className="text-sm text-muted">{fmt(E.subjectsCount, { n: g.items.length })}</span>
                </div>
                {renderGrid(g.items)}
              </section>
            );
          })}
        </div>
      ) : (
        renderGrid(filtered)
      )}
    </div>
  );
}
