'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSubject } from '@/app/actions/admin';
import { SubjectForm } from '@/components/admin/subject-form';

export default function NewSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: { name: string; description?: string; status?: string; cover_image?: string }) => {
    setLoading(true);
    const subject = await createSubject(data);
    router.push(`/admin/subjects/${subject.id}`);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-6">إضافة مادة جديدة</h1>
      <SubjectForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
