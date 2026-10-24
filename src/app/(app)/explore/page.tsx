import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExploreSubjects } from '@/components/student/explore-subjects';
import type { Category } from '@/lib/categories';

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; c?: string }>;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const params = await searchParams;
  const [{ data: subjects }, { data: enrollments }, { data: categories }] = await Promise.all([
    supabase
      .from('subjects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('enrollments')
      .select('subject_id')
      .eq('student_id', session.user.id),
    supabase.from('categories').select('id, name, color, sort_order').order('sort_order'),
  ]);

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.subject_id));

  return (
    <ExploreSubjects
      subjects={(subjects ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        cover_image: s.cover_image,
        category_id: s.category_id ?? null,
      }))}
      categories={(categories as Category[]) ?? []}
      enrolledIds={[...enrolledIds]}
      initialQuery={params.q ?? ''}
      initialCategory={params.c ?? 'all'}
    />
  );
}
