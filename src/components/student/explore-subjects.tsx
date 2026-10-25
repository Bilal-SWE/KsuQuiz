'use client';

import { useMemo, useState } from 'react';
import { Check, FolderOpen, LayoutGrid, Plus, Search } from 'lucide-react';
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 stagger">
      {items.map((subject) => {
        const isEnrolled = enrolled.has(subject.id);
        return (
          <div key={subject.id} className="flex flex-col gap-2">
            <SubjectCard subject={subject} enrolled={isEnrolled} />
            <button
              onClick={() => toggleEnroll(subject.id)}
              className={`press inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                isEnrolled
                  ? 'border border-border bg-surface text-muted hover:border-error/40 hover:text-error'
                  : 'bg-primary text-on-primary shadow-[0_6px_16px_-6px_rgb(15_157_138/0.45)] hover:brightness-110'
              }`}
            >
              {isEnrolled ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isEnrolled ? E.inMySubjects : E.addToMySubjects}
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
      <section className="hero p-5 sm:p-8 animate-fade-up">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold">{E.title}</h1>
          <p className="mt-1 text-sm text-white/80">{fmt(E.available, { n: subjects.length })}</p>
          <div className="relative mt-5 max-w-lg">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              placeholder={E.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border-0 bg-white py-3.5 ps-12 pe-4 text-sm text-foreground shadow-lg placeholder:text-muted/70 focus:outline-none focus:ring-4 focus:ring-white/40"
            />
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex w-max gap-2">
            {chips.map((chip) => {
              const isActive = active === chip.key;
              const col = chip.color ? categoryColor(chip.color) : null;
              return (
                <button
                  key={chip.key}
                  onClick={() => selectCategory(chip.key)}
                  className={`press inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? `${col ? col.fill : 'bg-primary text-on-primary'} shadow-md`
                      : 'border border-border bg-surface text-muted hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {chip.key === 'all' ? (
                    <LayoutGrid className="h-4 w-4" />
                  ) : (
                    <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-white' : col ? col.dot : 'bg-muted/50'}`} />
                  )}
                  {chip.name}
                  <span className={`rounded-full px-1.5 text-xs ${isActive ? 'bg-white/25' : 'bg-surface-hover'}`}>{chip.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
                  {g.key !== UNCATEGORIZED && g.items.length > 3 ? (
                    <button onClick={() => selectCategory(g.key)} className="text-sm font-medium text-primary-ink hover:underline cursor-pointer">
                      {fmt(E.viewAll, { n: g.items.length })}
                    </button>
                  ) : (
                    <span className="text-sm text-muted">{fmt(E.subjectsCount, { n: g.items.length })}</span>
                  )}
                </div>
                {renderGrid(g.key === UNCATEGORIZED ? g.items : g.items.slice(0, 3))}
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
