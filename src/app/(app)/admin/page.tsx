import { createClient } from '@/lib/supabase/server';
import { AdminSubjectsList } from '@/components/admin/subjects-list';
import type { Category } from '@/lib/categories';
import { sortByName } from '@/lib/sort';

export default async function AdminPage() {
  const supabase = await createClient();

  const [{ data: subjects }, { data: categories }] = await Promise.all([
    supabase.from('subjects').select('*'),
    supabase.from('categories').select('id, name, color, sort_order').order('sort_order'),
  ]);

  return <AdminSubjectsList subjects={sortByName(subjects ?? [])} categories={(categories as Category[]) ?? []} />;
}
