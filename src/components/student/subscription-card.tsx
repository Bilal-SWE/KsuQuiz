'use client';

import { useCallback, useEffect, useState } from 'react';
import { Crown, ExternalLink, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SubscribeButton } from '@/components/shell/subscribe-button';

type Subscription = {
  status: string;
  renews_at: string | null;
  ends_at: string | null;
  customer_portal_url: string | null;
};

const isActive = (s: Subscription | null) =>
  !!s &&
  (['active', 'on_trial', 'past_due'].includes(s.status) ||
    (s.status === 'cancelled' && !!s.ends_at && new Date(s.ends_at) > new Date()));

const formatDate = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'long' }).format(new Date(iso)) : '';

// The student's plan on the profile page. Right after checkout the webhook may still be
// on its way, so it checks again for a short while before giving up.
export function SubscriptionCard({ userId }: { userId: string }) {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const load = useCallback(async () => {
    const { data } = await createClient()
      .from('subscriptions' as any)
      .select('status, renews_at, ends_at, customer_portal_url')
      .eq('user_id', userId)
      .maybeSingle();
    setSub((data as Subscription | null) ?? null);
    setLoaded(true);
    return data as Subscription | null;
  }, [userId]);

  useEffect(() => {
    load();
    // Lemon Squeezy sends the student back to /profile?subscribed=1 after paying.
    if (new URLSearchParams(window.location.search).get('subscribed') === '1') setWaiting(true);
  }, [load]);

  useEffect(() => {
    if (!waiting) return;
    let tries = 0;
    const t = setInterval(async () => {
      tries += 1;
      const latest = await load();
      if (isActive(latest) || tries >= 10) {
        clearInterval(t);
        setWaiting(false);
      }
    }, 3000);
    return () => clearInterval(t);
  }, [waiting, load]);

  if (!loaded) return <div className="card h-28 animate-pulse p-5" />;

  const active = isActive(sub);

  if (active && sub) {
    const cancelled = sub.status === 'cancelled';
    return (
      <section className="card space-y-3 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-ink">
            <Crown className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-bold">الاشتراك الشهري</h2>
            <p className="text-sm text-muted">
              {cancelled
                ? `ملغى، ويبقى فعّالاً حتى ${formatDate(sub.ends_at)}`
                : sub.status === 'past_due'
                  ? 'تعذّر تجديد الدفع، حدّث بطاقتك من صفحة إدارة الاشتراك'
                  : `فعّال، ويتجدد في ${formatDate(sub.renews_at)}`}
            </p>
          </div>
        </div>
        {sub.customer_portal_url && (
          <a
            href={sub.customer_portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-1.5 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold hover:border-ink"
          >
            إدارة الاشتراك أو إلغاؤه
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </section>
    );
  }

  return (
    <section className="card space-y-3 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary-ink">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold">{waiting ? 'جاري تفعيل اشتراكك…' : 'الباقة المجانية'}</h2>
          <p className="text-sm text-muted">
            {waiting ? 'تم استلام الدفع، وسيُفعَّل اشتراكك خلال لحظات.' : 'أول درسين من كل مادة. اشترك لتفتح جميع الدروس.'}
          </p>
        </div>
      </div>
      {!waiting && (
        <SubscribeButton className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold text-on-primary hover:bg-primary-hover">
          <Crown className="h-4 w-4" />
          اشترك بـ 4.99 ريال شهرياً
        </SubscribeButton>
      )}
    </section>
  );
}
