import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExploreSubjects } from '@/components/student/explore-subjects';

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const params = await searchParams;
  const [{ data: subjects }, { data: enrollments }] = await Promise.all([
    supabase
      .from('subjects')
      .select('id, name, description, cover_image')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('enrollments')
      .select('subject_id')
      .eq('student_id', session.user.id),
  ]);

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.subject_id));

  return (
    <ExploreSubjects
      subjects={subjects ?? []}
      enrolledIds={[...enrolledIds]}
      initialQuery={params.q ?? ''}
    />
  );
}
