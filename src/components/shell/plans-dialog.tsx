'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Check, Crown, ExternalLink, Sparkles, Users, X } from 'lucide-react';
import { SubscribeButton } from '@/components/shell/subscribe-button';
import { fetchMySubscription, isActiveSubscription, type Subscription } from '@/lib/subscription';

const FREE: { text: string; included: boolean }[] = [
  { text: 'أول درسين من كل مادة', included: true },
  { text: 'التمرين والاختبار في أول درسين', included: true },
  { text: 'الترتيب لكل اختبار والترتيب العام', included: true },
  { text: 'باقي الدروس في المواد', included: false },
];

const PLAN_FEATURES = [
  'جميع الدروس في كل المواد',
  'التمرين والاختبار في كل درس',
  'شرح لكل إجابة',
  'الترتيب لكل اختبار والترتيب العام',
  'الإلغاء في أي وقت',
];

const formatDate = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'medium' }).format(new Date(iso)) : '';

function CurrentBadge({ dark }: { dark?: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${dark ? 'bg-accent text-ink' : 'bg-ink text-background'}`}>
      خطتك الحالية
    </span>
  );
}

function EmailInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      dir="ltr"
      className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-background placeholder:text-white/40 focus:border-accent focus:outline-none"
    />
  );
}

export function PlansDialog({ userId, open, onClose }: { userId?: string; open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [buddyEmail1, setBuddyEmail1] = useState('');
  const [buddyEmail2, setBuddyEmail2] = useState('');

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

  const manageSub = subscribed && (
    <>
      <p className="mb-2 text-center text-xs text-on-ink-muted">
        {cancelled ? `ملغى، ويبقى فعّالاً حتى ${formatDate(sub!.ends_at)}` : `يتجدد في ${formatDate(sub!.renews_at)}`}
      </p>
      {sub?.customer_portal_url ? (
        <a
          href={sub.customer_portal_url}
          target="_blank"
          rel="noopener noreferrer"
          className="press flex h-11 w-full items-center justify-center gap-2 rounded-full bg-surface text-sm font-extrabold text-ink hover:bg-surface-hover"
        >
          إدارة الاشتراك
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : (
        <Link
          href="/profile"
          onClick={onClose}
          className="press flex h-11 w-full items-center justify-center rounded-full bg-surface text-sm font-extrabold text-ink hover:bg-surface-hover"
        >
          إدارة الاشتراك
        </Link>
      )}
    </>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plans-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 backdrop-blur-sm animate-fade-up sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-5xl overflow-y-auto rounded-t-[28px] bg-background shadow-2xl sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-3 end-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface text-muted shadow-sm hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-5 pt-7 pb-4 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-ink">
            <Crown className="h-6 w-6" />
          </span>
          <h2 id="plans-title" className="mt-3 text-xl font-extrabold sm:text-2xl">
            اختر خطتك
          </h2>
          <p className="mt-1 text-sm text-muted">ابدأ مجاناً، واشترك متى احتجت لفتح كل الدروس</p>
        </div>

        <div className="grid gap-3 px-4 pb-5 sm:grid-cols-2 lg:grid-cols-4 sm:px-5">
          {/* Solo plan */}
          <section className="relative flex flex-col overflow-hidden rounded-3xl bg-ink p-5 text-background sm:order-2">
            <span className="pointer-events-none absolute -top-12 -end-12 h-32 w-32 rounded-full bg-primary/40" aria-hidden="true" />
            <div className="relative flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-lg font-extrabold">
                <Crown className="h-5 w-5 text-accent" />
                الشهرية
              </h3>
              {loaded && subscribed && <CurrentBadge dark />}
            </div>
            <p className="relative mt-2 text-xs text-on-ink-muted">لشخص واحد</p>
            <p className="relative mt-2 flex items-end gap-1.5">
              <span className="text-4xl font-extrabold tabular-nums">4.99</span>
              <span className="pb-1 text-sm text-on-ink-muted">ريال / شهرياً</span>
            </p>
            <ul className="relative mt-4 flex-1 space-y-2">
              {PLAN_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="relative mt-5">
              {!loaded ? (
                <div className="h-11 animate-pulse rounded-full bg-ink-raised" />
              ) : subscribed ? manageSub : (
                <SubscribeButton plan="solo" className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-extrabold text-ink hover:brightness-105">
                  اشترك الآن
                </SubscribeButton>
              )}
            </div>
          </section>

          {/* Free plan */}
          <section className="flex flex-col rounded-3xl border border-border bg-surface p-5 sm:order-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-lg font-extrabold">
                <Sparkles className="h-5 w-5 text-primary-ink" />
                المجانية
              </h3>
              {loaded && !subscribed && <CurrentBadge />}
            </div>
            <p className="mt-3 flex items-end gap-1.5">
              <span className="text-4xl font-extrabold tabular-nums">0</span>
              <span className="pb-1 text-sm text-muted">ريال</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              {FREE.map((f) => (
                <li key={f.text} className={`flex items-center gap-2 text-sm ${f.included ? '' : 'text-muted'}`}>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      f.included ? 'bg-success-light text-success-ink' : 'bg-error-light text-error'
                    }`}
                  >
                    {f.included ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex h-11 items-center justify-center rounded-full bg-surface-hover text-sm font-bold text-muted">
              {loaded && !subscribed ? 'خطتك الحالية' : 'متاحة للجميع'}
            </p>
          </section>

          {/* Duo plan */}
          <section className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-sky to-[#2563eb] p-5 text-white sm:order-3">
            <span className="pointer-events-none absolute -top-10 -end-10 h-28 w-28 rounded-full bg-white/10" aria-hidden="true" />
            <div className="relative flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-lg font-extrabold">
                <Users className="h-5 w-5" />
                القطة الثنائية
              </h3>
            </div>
            <p className="relative mt-1 text-xs text-white/70">أنت وصديقك، اشتراك واحد</p>
            <p className="relative mt-2 flex items-end gap-1.5">
              <span className="text-4xl font-extrabold tabular-nums">6.99</span>
              <span className="pb-1 text-sm text-white/70">ريال / شهرياً</span>
            </p>
            <p className="relative mt-1 text-xs text-white/60">3.50 ريال لكل شخص</p>
            <ul className="relative mt-3 flex-1 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                كل مميزات الشهرية لشخصين
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                أدخل إيميل صديقك وسيحصل على كل الدروس
              </li>
            </ul>
            <div className="relative mt-4 space-y-2">
              <EmailInput value={buddyEmail1} onChange={setBuddyEmail1} placeholder="إيميل صديقك" />
              {!loaded ? (
                <div className="h-11 animate-pulse rounded-full bg-white/10" />
              ) : subscribed ? manageSub : (
                <SubscribeButton
                  plan="duo"
                  buddyEmails={[buddyEmail1]}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-extrabold text-sky hover:bg-white/90"
                >
                  اشترك مع صديقك
                </SubscribeButton>
              )}
            </div>
          </section>

          {/* Trio plan */}
          <section className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] p-5 text-white sm:order-4">
            <span className="pointer-events-none absolute -top-10 -end-10 h-28 w-28 rounded-full bg-white/10" aria-hidden="true" />
            <div className="relative flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-lg font-extrabold">
                <Users className="h-5 w-5" />
                القطة الثلاثية
              </h3>
            </div>
            <p className="relative mt-1 text-xs text-white/70">أنت وصديقين، اشتراك واحد</p>
            <p className="relative mt-2 flex items-end gap-1.5">
              <span className="text-4xl font-extrabold tabular-nums">9.99</span>
              <span className="pb-1 text-sm text-white/70">ريال / شهرياً</span>
            </p>
            <p className="relative mt-1 text-xs text-white/60">3.33 ريال لكل شخص</p>
            <ul className="relative mt-3 flex-1 space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                كل مميزات الشهرية لثلاث أشخاص
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                أدخل إيميلات أصدقائك وسيحصلون على كل الدروس
              </li>
            </ul>
            <div className="relative mt-4 space-y-2">
              <EmailInput value={buddyEmail1} onChange={setBuddyEmail1} placeholder="إيميل الصديق الأول" />
              <EmailInput value={buddyEmail2} onChange={setBuddyEmail2} placeholder="إيميل الصديق الثاني" />
              {!loaded ? (
                <div className="h-11 animate-pulse rounded-full bg-white/10" />
              ) : subscribed ? manageSub : (
                <SubscribeButton
                  plan="trio"
                  buddyEmails={[buddyEmail1, buddyEmail2]}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-extrabold text-[#7c3aed] hover:bg-white/90"
                >
                  اشترك مع أصدقائك
                </SubscribeButton>
              )}
            </div>
          </section>
        </div>

        <p className="border-t border-border px-5 py-3 text-center text-xs text-muted">
          يتجدد الاشتراك شهرياً، ويمكنك الإلغاء في أي وقت.{' '}
          <Link href="/refund" onClick={onClose} className="text-primary-ink hover:underline">
            سياسة الاسترجاع
          </Link>
        </p>
      </div>
    </div>,
    document.body,
  );
}
