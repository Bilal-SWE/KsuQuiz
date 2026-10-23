import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserManagement } from '@/components/admin/user-management';

export const instant = false;

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'owner') redirect('/admin');

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return <UserManagement users={users ?? []} currentUserId={user.id} />;
}
