'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Check, Crown, ExternalLink, Minus, X } from 'lucide-react';
import { SubscribeButton } from '@/components/shell/subscribe-button';
import { fetchMySubscription, isActiveSubscription, type Subscription } from '@/lib/subscription';

// One row per feature: what the free plan gets and what the monthly plan gets.
// true = included, false = not included, a string = included with that note.
const ROWS: { label: string; free: boolean | string; paid: boolean | string }[] = [
  { label: 'أول درسين من كل مادة', free: true, paid: true },
  { label: 'جميع الدروس في كل المواد', free: false, paid: true },
  { label: 'وضع التمرين مع الشرح', free: 'الدروس المجانية', paid: 'كل الدروس' },
  { label: 'وضع الاختبار بالمؤقت', free: 'الدروس المجانية', paid: 'كل الدروس' },
  { label: 'الترتيب لكل اختبار والترتيب العام', free: true, paid: true },
  { label: 'الإلغاء في أي وقت', free: false, paid: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-success-light text-success-ink">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  if (value === false)
    return (
      <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-surface-hover text-muted/60">
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  return <span className="block text-center text-xs font-bold text-primary-ink">{value}</span>;
}

const formatDate = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'medium' }).format(new Date(iso)) : '';

// The crown in the header opens this: free vs monthly side by side, with the action that
// fits the student (subscribe, or manage an existing subscription).
export function PlansDialog({ userId, open, onClose }: { userId?: string; open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (!userId) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    fetchMySubscription(userId).then((s) => {
      setSub(s);
      setLoaded(true);
    });
  }, [open, userId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const subscribed = isActiveSubscription(sub);
  const cancelled = subscribed && sub?.status === 'cancelled';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plans-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm animate-fade-up sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-surface shadow-2xl sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-surface/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 id="plans-title" className="text-lg font-extrabold">
              الخطط والاشتراك
            </h2>
            <p className="text-xs text-muted">قارن بين الخطة المجانية والاشتراك الشهري</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface-hover hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {/* Plan headers */}
          <div className="grid grid-cols-[1fr_88px_88px] items-end gap-2 sm:grid-cols-[1fr_110px_110px]">
            <span />
            <div className="relative rounded-2xl bg-surface-hover px-2 pt-3 pb-2.5 text-center">
              {loaded && !subscribed && (
                <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-background">
                  خطتك الحالية
                </span>
              )}
              <p className="text-sm font-bold">المجانية</p>
              <p className="mt-1 text-lg font-extrabold">0</p>
              <p className="text-[11px] text-muted">ريال</p>
            </div>
            <div className="relative rounded-2xl bg-ink px-2 pt-3 pb-2.5 text-center text-background">
              {loaded && subscribed && (
                <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-ink">
                  خطتك الحالية
                </span>
              )}
              <p className="flex items-center justify-center gap-1 text-sm font-bold">
                <Crown className="h-3.5 w-3.5 text-accent" />
                الشهرية
              </p>
              <p className="mt-1 text-lg font-extrabold tabular-nums">4.99</p>
              <p className="text-[11px] text-on-ink-muted">ريال / شهر</p>
            </div>
          </div>

          {/* Feature comparison */}
          <dl className="mt-3 divide-y divide-border">
            {ROWS.map((r) => (
              <div key={r.label} className="grid grid-cols-[1fr_88px_88px] items-center gap-2 py-2.5 sm:grid-cols-[1fr_110px_110px]">
                <dt className="text-sm font-medium">{r.label}</dt>
                <dd>
                  <Cell value={r.free} />
                </dd>
                <dd>
                  <Cell value={r.paid} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="sticky bottom-0 space-y-2 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur">
          {!loaded ? (
            <div className="h-12 animate-pulse rounded-full bg-surface-hover" />
          ) : subscribed ? (
            <>
              <p className="text-center text-xs text-muted">
                {cancelled ? `اشتراكك ملغى ويبقى فعّالاً حتى ${formatDate(sub!.ends_at)}` : `اشتراكك فعّال ويتجدد في ${formatDate(sub!.renews_at)}`}
              </p>
              {sub?.customer_portal_url ? (
                <a
                  href={sub.customer_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-base font-extrabold text-background hover:bg-ink-raised"
                >
                  إدارة الاشتراك
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="press flex h-12 w-full items-center justify-center rounded-full bg-ink text-base font-extrabold text-background hover:bg-ink-raised"
                >
                  إدارة الاشتراك
                </Link>
              )}
            </>
          ) : (
            <>
              <SubscribeButton className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-extrabold text-on-primary hover:bg-primary-hover">
                <Crown className="h-5 w-5" />
                اشترك الآن بـ 4.99 ريال شهرياً
              </SubscribeButton>
              <p className="text-center text-xs text-muted">
                يتجدد شهرياً، ويمكنك الإلغاء في أي وقت.{' '}
                <Link href="/refund" onClick={onClose} className="text-primary-ink hover:underline">
                  سياسة الاسترجاع
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
