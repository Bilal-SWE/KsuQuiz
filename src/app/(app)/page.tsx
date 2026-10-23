import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { StudentHome } from '@/components/student/student-home';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin' || profile?.role === 'owner') {
    redirect('/admin');
  }

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      subject_id,
      subjects (id, name, description, cover_image, status)
    `)
    .eq('student_id', user.id);

  const enrolledSubjects = (enrollments ?? [])
    .map((e) => (e as any).subjects)
    .filter(Boolean);

  return <StudentHome subjects={enrolledSubjects} />;
}
