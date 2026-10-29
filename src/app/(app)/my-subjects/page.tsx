import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StudentHome } from '@/components/student/student-home';
import { sortByName } from '@/lib/sort';
import { getQuestionCounts } from '@/lib/question-counts';

export default async function MySubjectsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/auth/login');

  const [{ data: profile }, { data: enrollments }, questionCounts] = await Promise.all([
    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single(),
    supabase
      .from('enrollments')
      .select(`
        subject_id,
        subjects (id, name, description, cover_image, status)
      `)
      .eq('student_id', session.user.id),
    getQuestionCounts(supabase),
  ]);

  if (profile?.role === 'admin' || profile?.role === 'owner') {
    redirect('/admin');
  }

  const enrolledSubjects = sortByName(
    (enrollments ?? []).map((e) => (e as any).subjects).filter(Boolean),
  ).map((s: any) => ({ ...s, question_count: questionCounts[s.id] ?? 0 }));

  return <StudentHome subjects={enrolledSubjects} />;
}
