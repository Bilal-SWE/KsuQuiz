import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AdminLessonDetail } from '@/components/admin/lesson-detail';

export default async function AdminLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  await connection();
  const { id: subjectId, lessonId } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (!lesson || lesson.subject_id !== subjectId) notFound();

  const { data: subject } = await supabase
    .from('subjects')
    .select('name')
    .eq('id', subjectId)
    .single();

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('sort_order');

  return (
    <AdminLessonDetail
      subjectId={subjectId}
      subjectName={subject?.name ?? ''}
      lesson={lesson}
      questions={questions ?? []}
    />
  );
}
