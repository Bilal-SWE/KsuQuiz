'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, FolderOpen, Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SubjectCover } from '@/components/student/subject-card';
import { setSubjectsCategory } from '@/app/actions/admin';
import { categoryColor, type Category } from '@/lib/categories';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image?: string | null;
  status: string;
  created_at: string;
  category_id?: string | null;
};

const NONE = 'none';

export function AdminSubjectsList({ subjects: initial, categories }: { subjects: Subject[]; categories: Category[] }) {
  const [subjects, setSubjects] = useState(initial);
  const [filter, setFilter] = useState<string>('all');
  const published = subjects.filter((s) => s.status === 'published').length;

  const countFor = (key: string) =>
    key === 'all'
      ? subjects.length
      : subjects.filter((s) => (key === NONE ? !s.category_id : s.category_id === key)).length;

  const shown =
    filter === 'all' ? subjects : subjects.filter((s) => (filter === NONE ? !s.category_id : s.category_id === filter));

  const changeCategory = async (id: string, value: string) => {
    const categoryId = value === NONE ? null : value;
    const before = subjects;
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, category_id: categoryId } : s)));
    try {
      await setSubjectsCategory([id], categoryId);
    } catch (err: any) {
      setSubjects(before);
      alert(err.message);
    }
  };

  const chips = [
    { key: 'all', label: 'الكل' },
    ...categories.map((c) => ({ key: c.id, label: c.name })),
    { key: NONE, label: 'بدون تصنيف' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="hero p-5 sm:p-8 animate-fade-up">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">لوحة التحكم</h1>
            <p className="mt-1 text-sm text-white/80">
              {subjects.length} مادة، منها {published} منشورة
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/subjects/new"
              className="press inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-primary-ink shadow-lg hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              إضافة مادة
            </Link>
            <Link
              href="/admin/categories"
              className="press inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
            >
              <FolderOpen className="h-4 w-4" />
              التصنيفات
            </Link>
            <Link
              href="/admin/messages"
              className="press inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
            >
              <Inbox className="h-4 w-4" />
              الرسائل
            </Link>
          </div>
        </div>
      </section>

      {subjects.length === 0 ? (
        <EmptyState
          title="لا توجد مواد"
          description="ابدأ بإضافة مادة جديدة"
          action={
            <Link href="/admin/subjects/new">
              <Button>إضافة مادة</Button>
            </Link>
          }
        />
      ) : (
        <>
          {categories.length > 0 && (
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {chips.map((chip) => {
                const active = filter === chip.key;
                return (
                  <button
                    key={chip.key}
                    onClick={() => setFilter(chip.key)}
                    aria-pressed={active}
                    className={`press inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      active ? 'bg-ink text-background' : 'border border-border bg-surface text-muted hover:text-ink'
                    }`}
                  >
                    {chip.label}
                    <span className={`text-xs ${active ? 'text-on-ink-muted' : 'text-muted/70'}`}>{countFor(chip.key)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {shown.length === 0 ? (
            <p className="card py-10 text-center text-sm text-muted">لا توجد مواد هنا</p>
          ) : (
            <div className="space-y-2.5 stagger">
              {shown.map((subject) => {
                const cat = categories.find((c) => c.id === subject.category_id);
                return (
                  <div key={subject.id} className="card card-hover flex items-center gap-3 p-3">
                    <Link href={`/admin/subjects/${subject.id}`} className="group flex min-w-0 flex-1 items-center gap-3 press">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                        <SubjectCover subject={{ ...subject, cover_image: subject.cover_image ?? null }} className="text-lg" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="flex items-center gap-2 font-bold">
                          <span className="truncate">{subject.name}</span>
                          <Badge variant={subject.status === 'published' ? 'success' : 'warning'}>
                            {subject.status === 'published' ? 'منشور' : 'مسودة'}
                          </Badge>
                        </h3>
                        {subject.description && <p className="text-sm text-muted line-clamp-1">{subject.description}</p>}
                      </div>
                      <ChevronLeft className="hidden h-5 w-5 shrink-0 text-muted transition-transform group-hover:-translate-x-1 sm:block" />
                    </Link>
                    {categories.length > 0 && (
                      <select
                        value={subject.category_id ?? NONE}
                        onChange={(e) => changeCategory(subject.id, e.target.value)}
                        aria-label={`تصنيف ${subject.name}`}
                        title="تغيير التصنيف"
                        className={`w-28 shrink-0 cursor-pointer truncate rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/40 sm:w-36 ${
                          cat ? categoryColor(cat.color).fill : 'bg-surface-hover text-muted'
                        }`}
                      >
                        <option value={NONE}>بدون تصنيف</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
