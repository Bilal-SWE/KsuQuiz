'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createSubscriptionCheckout, type CheckoutPlan } from '@/lib/lemonsqueezy';

// Returns where the subscribe button should send the visitor: sign-up when logged out,
// the profile page when already subscribed, otherwise a fresh Lemon Squeezy checkout.
export async function startCheckout(plan?: CheckoutPlan, buddyEmails?: string[]): Promise<{ url: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { url: '/auth/signup' };

  const [{ data: active }, { data: profile }] = await Promise.all([
    supabase.rpc('has_active_subscription' as any, { p_user_id: user.id }),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ]);
  if (active) return { url: '/profile' };

  const selectedPlan = plan ?? 'solo';
  const emails = (buddyEmails ?? [])
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && e !== user.email?.toLowerCase());

  if (selectedPlan === 'duo' && emails.length !== 1) throw new Error('أدخل إيميل صديقك');
  if (selectedPlan === 'trio' && emails.length !== 2) throw new Error('أدخل إيميلات الأصدقاء');

  // Verify all buddy emails belong to registered users.
  for (const email of emails) {
    const { data: exists } = await supabase.rpc('email_exists' as any, { p_email: email });
    if (!exists) throw new Error(`الإيميل ${email} غير مسجل في الموقع`);
  }

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https');

  try {
    const url = await createSubscriptionCheckout({
      userId: user.id,
      email: user.email,
      name: profile?.full_name,
      redirectUrl: `${proto}://${host}/profile?subscribed=1`,
      plan: selectedPlan,
      buddyEmails: emails.length ? emails : undefined,
    });
    return { url };
  } catch (err: any) {
    if (err?.message?.includes('غير مسجل') || err?.message?.startsWith('أدخل')) throw err;
    throw new Error('تعذّر فتح صفحة الدفع، حاول مرة أخرى');
  }
}
