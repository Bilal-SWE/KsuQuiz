import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { SubjectDetail } from '@/components/student/subject-detail';

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (!subject) notFound();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, sort_order')
    .eq('subject_id', id)
    .eq('status', 'published')
    .order('sort_order');

  const { data: attempts } = await supabase
    .from('attempts')
    .select('lesson_id, score, total, finished_at')
    .eq('student_id', user.id)
    .in('lesson_id', (lessons ?? []).map((l) => l.id));

  return (
    <SubjectDetail
      subject={subject}
      lessons={lessons ?? []}
      attempts={attempts ?? []}
    />
  );
}
