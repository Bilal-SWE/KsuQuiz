import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdminSubjectsList } from '@/components/admin/subjects-list';

export default async function AdminPage() {
  await connection();
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminSubjectsList subjects={subjects ?? []} />;
}
