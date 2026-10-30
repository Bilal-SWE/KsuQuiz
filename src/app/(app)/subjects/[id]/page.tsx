import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { SubjectDetail } from '@/components/student/subject-detail';
import { FREE_LESSONS_PER_SUBJECT, hasFullAccess } from '@/lib/access';

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

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

  const lessonIds = (lessons ?? []).map((l) => l.id);
  const [{ data: attempts }, fullAccess, { data: questionRows }] = await Promise.all([
    supabase
      .from('attempts')
      .select('lesson_id, score, total, finished_at')
      .eq('student_id', user.id)
      .in('lesson_id', (lessons ?? []).map((l) => l.id)),
    hasFullAccess(supabase, user.id),
    // Students can read questions of published lessons only, so 'soon' lessons count as zero.
    supabase.from('questions').select('lesson_id').in('lesson_id', lessonIds),
  ]);

  const questionCounts: Record<string, number> = {};
  for (const q of questionRows ?? []) questionCounts[q.lesson_id] = (questionCounts[q.lesson_id] ?? 0) + 1;

  return (
    <SubjectDetail
      subject={subject}
      lessons={lessons ?? []}
      attempts={attempts ?? []}
      freeLessons={fullAccess ? null : FREE_LESSONS_PER_SUBJECT}
      questionCounts={questionCounts}
    />
  );
}
