import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AdminLessonDetail } from '@/components/admin/lesson-detail';

export const instant = false;

export default async function AdminLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: subjectId, lessonId } = await params;
  const supabase = await createClient();

  const [{ data: lesson }, { data: subject }, { data: questions }] = await Promise.all([
    supabase.from('lessons').select('*').eq('id', lessonId).single(),
    supabase.from('subjects').select('name').eq('id', subjectId).single(),
    supabase.from('questions').select('*').eq('lesson_id', lessonId).order('sort_order'),
  ]);

  if (!lesson || lesson.subject_id !== subjectId) notFound();

  return (
    <AdminLessonDetail
      subjectId={subjectId}
      subjectName={subject?.name ?? ''}
      lesson={lesson}
      questions={questions ?? []}
    />
  );
}
