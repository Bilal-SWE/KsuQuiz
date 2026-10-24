import { createClient } from '@/lib/supabase/server';
import { CategoryManager } from '@/components/admin/category-manager';
import type { Category } from '@/lib/categories';

export default async function CategoriesPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: subjects }] = await Promise.all([
    supabase.from('categories').select('id, name, color, sort_order').order('sort_order'),
    supabase.from('subjects').select('category_id'),
  ]);

  const counts: Record<string, number> = {};
  (subjects ?? []).forEach((s) => {
    if (s.category_id) counts[s.category_id] = (counts[s.category_id] ?? 0) + 1;
  });

  return <CategoryManager initial={(categories as Category[]) ?? []} counts={counts} />;
}
