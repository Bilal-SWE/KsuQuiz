import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StudentHome } from '@/components/student/student-home';

export const instant = false;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/auth/login');

  const [{ data: profile }, { data: enrollments }] = await Promise.all([
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
  ]);

  if (profile?.role === 'admin' || profile?.role === 'owner') {
    redirect('/admin');
  }

  const enrolledSubjects = (enrollments ?? [])
    .map((e) => (e as any).subjects)
    .filter(Boolean);

  return <StudentHome subjects={enrolledSubjects} />;
}
