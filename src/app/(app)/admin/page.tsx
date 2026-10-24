import { createClient } from '@/lib/supabase/server';
import { AdminSubjectsList } from '@/components/admin/subjects-list';

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminSubjectsList subjects={subjects ?? []} />;
}
