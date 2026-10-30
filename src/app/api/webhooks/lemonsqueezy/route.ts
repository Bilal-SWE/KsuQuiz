import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/lemonsqueezy';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Receives subscription events from Lemon Squeezy and keeps public.subscriptions in sync.
export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, request.headers.get('x-signature'))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const event: string = payload?.meta?.event_name ?? '';
  const data = payload?.data;

  // Payment events carry invoices; the matching subscription_updated event follows,
  // so only the subscription object itself is stored.
  if (!event.startsWith('subscription_') || data?.type !== 'subscriptions') {
    return NextResponse.json({ ok: true, ignored: event });
  }

  const attrs = data.attributes ?? {};
  const supabase = createAdminClient();
  const subscriptionId = String(data.id);

  // The student's id comes from the checkout's custom data; later events for the same
  // subscription fall back to the row saved the first time.
  let userId: string | undefined = payload?.meta?.custom_data?.user_id;
  if (!userId) {
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('ls_subscription_id', subscriptionId)
      .maybeSingle();
    userId = existing?.user_id;
  }
  if (!userId) {
    console.error('Lemon Squeezy webhook without a user id', event, subscriptionId);
    return NextResponse.json({ ok: true, ignored: 'no user' });
  }

  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      ls_subscription_id: subscriptionId,
      ls_customer_id: attrs.customer_id != null ? String(attrs.customer_id) : null,
      status: attrs.status,
      renews_at: attrs.renews_at ?? null,
      ends_at: attrs.ends_at ?? null,
      customer_portal_url: attrs.urls?.customer_portal ?? null,
      update_payment_url: attrs.urls?.update_payment_method ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('Saving subscription failed', error);
    return NextResponse.json({ error: 'save failed' }, { status: 500 });
  }

  // Save buddy records on first subscription creation (duo/trio plans).
  const customData = payload?.meta?.custom_data;
  const plan: string | undefined = customData?.plan;
  const buddyEmails: string[] = customData?.buddy_emails ?? [];

  if (event === 'subscription_created' && (plan === 'duo' || plan === 'trio') && buddyEmails.length > 0) {
    await supabase.from('buddy_subscriptions').delete().eq('subscription_user_id', userId);

    for (const email of buddyEmails) {
      const normalised = email.trim().toLowerCase();
      const { data: buddyUserId } = await supabase
        .rpc('find_user_id_by_email', { p_email: normalised });

      await supabase.from('buddy_subscriptions').insert({
        subscription_user_id: userId,
        buddy_email: normalised,
        buddy_user_id: buddyUserId ?? null,
        plan,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
