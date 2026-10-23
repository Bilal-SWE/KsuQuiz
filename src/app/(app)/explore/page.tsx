import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExploreSubjects } from '@/components/student/explore-subjects';

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const params = await searchParams;
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, description, cover_image')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('subject_id')
    .eq('student_id', user.id);

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.subject_id));

  return (
    <ExploreSubjects
      subjects={subjects ?? []}
      enrolledIds={[...enrolledIds]}
      initialQuery={params.q ?? ''}
    />
  );
}
