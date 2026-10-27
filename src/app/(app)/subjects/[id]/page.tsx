import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { SubjectDetail } from '@/components/student/subject-detail';
import { FREE_LESSONS_PER_SUBJECT, hasFullAccess } from '@/lib/access';

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const [{ data: subject }, { data: lessons }] = await Promise.all([
    supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single(),
    supabase
      .from('lessons')
      .select('id, title, sort_order, status')
      .eq('subject_id', id)
      .in('status', ['published', 'soon'])
      .order('sort_order'),
  ]);

  if (!subject) notFound();

  const [{ data: attempts }, fullAccess] = await Promise.all([
    supabase
      .from('attempts')
      .select('lesson_id, score, total, finished_at')
      .eq('student_id', session.user.id)
      .in('lesson_id', (lessons ?? []).map((l) => l.id)),
    hasFullAccess(supabase, session.user.id),
  ]);

  return (
    <SubjectDetail
      subject={subject}
      lessons={lessons ?? []}
      attempts={attempts ?? []}
      freeLessons={fullAccess ? null : FREE_LESSONS_PER_SUBJECT}
    />
  );
}
