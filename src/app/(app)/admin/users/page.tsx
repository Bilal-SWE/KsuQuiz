import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserManagement } from '@/components/admin/user-management';

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const [{ data: profile }, { data: users }] = await Promise.all([
    supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single(),
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false }),
  ]);

  if (profile?.role !== 'owner' && profile?.role !== 'admin') redirect('/');

  return <UserManagement users={users ?? []} currentUserId={session.user.id} currentRole={profile.role} />;
}
