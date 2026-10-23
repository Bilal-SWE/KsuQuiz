'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
};

export function AdminSubjectsList({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">المواد</h1>
        <Link href="/admin/subjects/new">
          <Button>إضافة مادة</Button>
        </Link>
      </div>

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
        <div className="space-y-3">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/admin/subjects/${subject.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:shadow-sm transition-shadow"
            >
              <div>
                <h3 className="font-medium">{subject.name}</h3>
                {subject.description && (
                  <p className="text-sm text-muted line-clamp-1">{subject.description}</p>
                )}
              </div>
              <Badge variant={subject.status === 'published' ? 'success' : 'warning'}>
                {subject.status === 'published' ? 'منشور' : 'مسودة'}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
