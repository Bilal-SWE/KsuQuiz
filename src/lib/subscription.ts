import { createClient } from '@/lib/supabase/client';

export type Subscription = {
  status: string;
  renews_at: string | null;
  ends_at: string | null;
  customer_portal_url: string | null;
};

// Paid up, or cancelled but still inside the period already paid for
// (same rule as public.has_active_subscription in migration 015).
export const isActiveSubscription = (s: Subscription | null) =>
  !!s &&
  (['active', 'on_trial', 'past_due'].includes(s.status) ||
    (s.status === 'cancelled' && !!s.ends_at && new Date(s.ends_at) > new Date()));

// The signed-in student's subscription row, read in the browser (RLS returns only their own).
export async function fetchMySubscription(userId: string): Promise<Subscription | null> {
  const { data } = await createClient()
    .from('subscriptions' as any)
    .select('status, renews_at, ends_at, customer_portal_url')
    .eq('user_id', userId)
    .maybeSingle();
  return (data as Subscription | null) ?? null;
}
