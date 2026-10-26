'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createSubscriptionCheckout } from '@/lib/lemonsqueezy';

// Returns where the subscribe button should send the visitor: sign-up when logged out,
// the profile page when already subscribed, otherwise a fresh Lemon Squeezy checkout.
export async function startCheckout(): Promise<{ url: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { url: '/auth/signup' };

  const [{ data: active }, { data: profile }] = await Promise.all([
    supabase.rpc('has_active_subscription' as any, { p_user_id: user.id }),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ]);
  if (active) return { url: '/profile' };

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https');

  try {
    const url = await createSubscriptionCheckout({
      userId: user.id,
      email: user.email,
      name: profile?.full_name,
      redirectUrl: `${proto}://${host}/profile?subscribed=1`,
    });
    return { url };
  } catch {
    throw new Error('تعذّر فتح صفحة الدفع، حاول مرة أخرى');
  }
}
