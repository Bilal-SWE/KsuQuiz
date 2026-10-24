import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AdminSubjectDetail } from '@/components/admin/subject-detail';

export default async function AdminSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: subject }, { data: lessons }] = await Promise.all([
    supabase.from('subjects').select('*').eq('id', id).single(),
    supabase.from('lessons').select('*').eq('subject_id', id).order('sort_order'),
  ]);

  if (!subject) notFound();

  return <AdminSubjectDetail subject={subject} lessons={lessons ?? []} />;
}
