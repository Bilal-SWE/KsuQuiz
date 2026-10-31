import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExploreSubjects } from '@/components/student/explore-subjects';
import type { Category } from '@/lib/categories';
import { sortByName } from '@/lib/sort';
import { getQuestionCounts } from '@/lib/question-counts';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const params = await searchParams;
  const [{ data: profile }, { data: subjects }, { data: enrollments }, { data: categories }, questionCounts] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase
      .from('subjects')
      .select('*')
      .in('status', ['published', 'soon']),
    supabase
      .from('enrollments')
      .select('subject_id')
      .eq('student_id', user.id),
    supabase.from('categories').select('id, name, color, sort_order').order('sort_order'),
    getQuestionCounts(supabase),
  ]);

  if (profile?.role === 'admin' || profile?.role === 'owner') redirect('/admin');

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.subject_id));

  return (
    <ExploreSubjects
      subjects={sortByName(subjects ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        cover_image: s.cover_image,
        category_id: s.category_id ?? null,
        question_count: questionCounts[s.id] ?? 0,
        status: s.status as 'published' | 'soon',
      }))}
      categories={(categories as Category[]) ?? []}
      enrolledIds={[...enrolledIds]}
      initialQuery={params.q ?? ''}
    />
  );
}
