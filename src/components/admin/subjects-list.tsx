'use client';

import Link from 'next/link';
import { ChevronLeft, FolderOpen, Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { SubjectCover } from '@/components/student/subject-card';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  cover_image?: string | null;
  status: string;
  created_at: string;
};

export function AdminSubjectsList({ subjects }: { subjects: Subject[] }) {
  const published = subjects.filter((s) => s.status === 'published').length;

  return (
    <div className="space-y-6">
      <section className="hero p-6 sm:p-8 animate-fade-up">
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
        <div className="space-y-3 stagger">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/admin/subjects/${subject.id}`}
              className="card card-hover group flex items-center gap-4 p-3 press"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <SubjectCover subject={{ ...subject, cover_image: subject.cover_image ?? null }} className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold truncate">{subject.name}</h3>
                {subject.description && <p className="text-sm text-muted line-clamp-1">{subject.description}</p>}
              </div>
              <Badge variant={subject.status === 'published' ? 'success' : 'warning'}>
                {subject.status === 'published' ? 'منشور' : 'مسودة'}
              </Badge>
              <ChevronLeft className="h-5 w-5 text-muted transition-transform group-hover:-translate-x-1" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
