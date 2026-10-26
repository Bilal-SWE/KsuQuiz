import { createClient } from '@/lib/supabase/server';
import { CategoryManager } from '@/components/admin/category-manager';
import type { Category } from '@/lib/categories';
import { sortByName } from '@/lib/sort';

export default async function CategoriesPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: subjects }] = await Promise.all([
    supabase.from('categories').select('id, name, color, sort_order').order('sort_order'),
    supabase.from('subjects').select('id, name, status, category_id'),
  ]);

  return (
    <CategoryManager
      initial={(categories as Category[]) ?? []}
      initialSubjects={sortByName((subjects as any[]) ?? [])}
    />
  );
}
