'use client';

import { useMemo, useState } from 'react';
import { Check, Compass, FolderOpen, LayoutGrid, Plus, Search, X } from 'lucide-react';
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
};

const UNCATEGORIZED = 'none';

export function ExploreSubjects({
  subjects,
  categories,
  enrolledIds,
  initialQuery,
  initialCategory,
}: {
  subjects: Subject[];
  categories: Category[];
  enrolledIds: string[];
  initialQuery: string;
  initialCategory: string;
}) {
  const { t } = useI18n();
  const E = t.explore;
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(initialCategory);
  const [enrolled, setEnrolled] = useState(new Set(enrolledIds));

  const validIds = new Set(categories.map((c) => c.id));
  const catOf = (s: Subject) => (s.category_id && validIds.has(s.category_id) ? s.category_id : UNCATEGORIZED);
  const hasUncategorized = subjects.some((s) => catOf(s) === UNCATEGORIZED);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    subjects.forEach((s) => {
      const k = catOf(s);
      m[k] = (m[k] ?? 0) + 1;
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, categories]);

  const filtered = subjects.filter((s) => {
    if (active !== 'all' && catOf(s) !== active) return false;
    if (query.trim() && !normalizeArabic(s.name).includes(normalizeArabic(query))) return false;
    return true;
  });

  const showGrouped = active === 'all' && !query.trim() && categories.length > 0;
  const groups = showGrouped
    ? [
        ...categories.map((c) => ({ key: c.id, name: c.name, color: c.color, items: filtered.filter((s) => catOf(s) === c.id) })),
        { key: UNCATEGORIZED, name: E.otherSubjects, color: 'violet', items: filtered.filter((s) => catOf(s) === UNCATEGORIZED) },
      ].filter((g) => g.items.length > 0)
    : [];

  const selectCategory = (key: string) => {
    setActive(key);
    const url = new URL(window.location.href);
    if (key === 'all') url.searchParams.delete('c');
    else url.searchParams.set('c', key);
    window.history.replaceState(null, '', url);
  };

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
            <SubjectCard subject={subject} />
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
          </div>
        );
      })}
    </div>
  );

  const chips = [
    { key: 'all', name: E.all, count: subjects.length, color: null as string | null },
    ...categories.map((c) => ({ key: c.id, name: c.name, count: counts[c.id] ?? 0, color: c.color })),
    ...(hasUncategorized && categories.length > 0
      ? [{ key: UNCATEGORIZED, name: E.other, count: counts[UNCATEGORIZED] ?? 0, color: null }]
      : []),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-primary-light to-surface px-4 pt-7 pb-5 text-center sm:px-8 sm:pt-10 sm:pb-6 animate-fade-up">
        <span className="pointer-events-none absolute -top-16 -start-16 h-48 w-48 rounded-full bg-primary/10" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-20 -end-10 h-40 w-40 rounded-full bg-accent/15" aria-hidden="true" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-bold text-primary-ink shadow-sm">
            <Compass className="h-3.5 w-3.5" />
            {E.eyebrow}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">{E.title}</h1>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted sm:text-base">{fmt(E.available, { n: subjects.length })}</p>

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

          {categories.length > 0 && (
            <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <div className="mx-auto flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
                {chips.map((chip) => {
                  const isActive = active === chip.key;
                  const col = chip.color ? categoryColor(chip.color) : null;
                  return (
                    <button
                      key={chip.key}
                      onClick={() => selectCategory(chip.key)}
                      aria-pressed={isActive}
                      className={`press inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold transition cursor-pointer ${
                        isActive ? 'bg-ink text-background shadow-md' : 'bg-surface text-muted shadow-sm hover:text-ink'
                      }`}
                    >
                      {chip.key === 'all' ? (
                        <LayoutGrid className="h-4 w-4" />
                      ) : (
                        <span className={`h-2.5 w-2.5 rounded-full ring-1 ring-ink/15 ${col ? col.dot : 'bg-muted/50'}`} />
                      )}
                      {chip.name}
                      <span className={`rounded-full px-1.5 text-xs ${isActive ? 'bg-white/15' : 'bg-surface-hover'}`}>{chip.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
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
