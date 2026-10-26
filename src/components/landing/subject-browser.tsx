'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SubjectCover } from '@/components/student/subject-card';
import { fmt } from '@/i18n/format';
import type { LandingContent } from '@/app/welcome/content';

type Item = { id: string; name: string; description: string | null; cover_image: string | null; category_id: string | null; lessons: number };
type Cat = { id: string; name: string };

const LIMIT = 8;

// Published subjects filtered by category chips; every card leads to sign-up.
export function SubjectBrowser({ s, subjects, categories }: { s: LandingContent['subjects']; subjects: Item[]; categories: Cat[] }) {
  const [active, setActive] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const usedCategories = categories.filter((c) => subjects.some((x) => x.category_id === c.id));
  const filtered = active === 'all' ? subjects : subjects.filter((x) => x.category_id === active);
  const shown = showAll ? filtered : filtered.slice(0, LIMIT);

  if (subjects.length === 0) return <p className="card py-10 text-center text-muted">{s.empty}</p>;

  return (
    <div className="flex flex-col gap-4">
      {usedCategories.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: 'all', name: s.all }, ...usedCategories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActive(c.id);
                setShowAll(false);
              }}
              aria-pressed={active === c.id}
              className={`press shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                active === c.id ? 'bg-ink text-background' : 'border border-border bg-surface text-muted hover:text-ink'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div key={active} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 stagger">
        {shown.map((x) => (
          <Link key={x.id} href="/auth/signup" className="card card-hover group block overflow-hidden !rounded-2xl press">
            <div className="aspect-[16/10] overflow-hidden">
              <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                <SubjectCover subject={x} />
              </div>
            </div>
            <div className="px-2.5 py-2 text-center">
              <p dir="auto" className="truncate text-sm font-bold sm:text-base">{x.name}</p>
              <p dir="auto" className="truncate text-xs text-muted">
                {x.description || fmt(s.lessons, { n: x.lessons })}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length > LIMIT && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="press mx-auto cursor-pointer rounded-full border-2 border-border bg-surface px-5 py-2 text-sm font-bold hover:border-ink"
        >
          + {filtered.length - LIMIT}
        </button>
      )}
    </div>
  );
}
