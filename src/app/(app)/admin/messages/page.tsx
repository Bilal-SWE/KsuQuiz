import { createClient } from '@/lib/supabase/server';
import { MessagesInbox, type ContactMessage } from '@/components/admin/messages-inbox';

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('contact_messages')
    .select('id, name, email, subject, message, is_read, created_at')
    .order('created_at', { ascending: false });

  return <MessagesInbox initial={(data as ContactMessage[]) ?? []} />;
}
