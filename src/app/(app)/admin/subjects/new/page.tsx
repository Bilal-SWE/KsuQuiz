'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createSubject } from '@/app/actions/admin';
import { SubjectForm, type SubjectFormData } from '@/components/admin/subject-form';

export default function NewSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: SubjectFormData) => {
    setLoading(true);
    const subject = await createSubject(data);
    router.push(`/admin/subjects/${subject.id}`);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary-ink mb-4">
        <ArrowRight className="h-3.5 w-3.5" />
        لوحة التحكم
      </Link>
      <h1 className="text-2xl font-bold mb-6">إضافة مادة جديدة</h1>
      <SubjectForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
