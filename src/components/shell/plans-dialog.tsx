'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Check, Crown, ExternalLink, Sparkles, Users, X } from 'lucide-react';
import { SubscribeButton } from '@/components/shell/subscribe-button';
import { fetchMySubscription, isActiveSubscription, type Subscription } from '@/lib/subscription';

const FREE_FEATURES = ['أول درسين من كل مادة', 'تمرين واختبار للدرسين', 'ترتيب الطلاب', 'تصفح المواد'];
const PAID_FEATURES = ['كل الدروس بدون حدود', 'تمرين واختبار لكل درس', 'شرح لكل إجابة', 'ترتيب الطلاب', 'إلغاء أي وقت'];

const formatDate = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { dateStyle: 'medium' }).format(new Date(iso)) : '';

function GroupDialog({ open, onClose, loaded, subscribed }: { open: boolean; onClose: () => void; loaded: boolean; subscribed: boolean }) {
  const [buddyEmail1, setBuddyEmail1] = useState('');
  const [buddyEmail2, setBuddyEmail2] = useState('');

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 backdrop-blur-sm animate-fade-up sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-t-[28px] bg-background p-5 shadow-2xl sm:rounded-[28px] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-3 end-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 text-center">
          <Users className="mx-auto h-8 w-8 text-sky" />
          <h3 className="mt-2 text-base font-extrabold sm:text-lg">اشتراك المجموعات</h3>
          <p className="mt-1 text-xs text-muted">اشترك مع أصدقائك بسعر أقل لكل شخص</p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">مجموعة شخصين</div>
                <div className="text-xs text-muted">3.50 ر.س / شخص شهرياً</div>
              </div>
              <div className="text-lg font-bold text-primary-ink">6.99</div>
            </div>
            <input
              type="email"
              value={buddyEmail1}
              onChange={(e) => setBuddyEmail1(e.target.value)}
              placeholder="إيميل صديقك"
              dir="ltr"
              className="mt-2 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs placeholder:text-muted/50 focus:border-primary focus:outline-none"
            />
            {!subscribed && loaded && (
              <SubscribeButton plan="duo" buddyEmails={[buddyEmail1]} className="mt-2 w-full rounded-full bg-sky px-3 py-1.5 text-xs font-bold text-white hover:bg-sky/90">
                اشترك
              </SubscribeButton>
            )}
          </div>

          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">مجموعة 3 أشخاص</div>
                <div className="text-xs text-muted">3.33 ر.س / شخص شهرياً</div>
              </div>
              <div className="text-lg font-bold text-primary-ink">9.99</div>
            </div>
            <input
              type="email"
              value={buddyEmail1}
              onChange={(e) => setBuddyEmail1(e.target.value)}
              placeholder="إيميل الصديق الأول"
              dir="ltr"
              className="mt-2 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs placeholder:text-muted/50 focus:border-primary focus:outline-none"
            />
            <input
              type="email"
              value={buddyEmail2}
              onChange={(e) => setBuddyEmail2(e.target.value)}
              placeholder="إيميل الصديق الثاني"
              dir="ltr"
              className="mt-1.5 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs placeholder:text-muted/50 focus:border-primary focus:outline-none"
            />
            {!subscribed && loaded && (
              <SubscribeButton plan="trio" buddyEmails={[buddyEmail1, buddyEmail2]} className="mt-2 w-full rounded-full bg-[#7c3aed] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#7c3aed]/90">
                اشترك
              </SubscribeButton>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function PlansDialog({ userId, open, onClose }: { userId?: string; open: boolean; onClose: () => void }) {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 backdrop-blur-sm animate-fade-up sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-background shadow-2xl sm:rounded-[28px]"
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

        {/* Header with gradient */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-transparent px-4 pt-6 pb-5 text-center sm:px-5 sm:pt-8 sm:pb-6">
          <span className="pointer-events-none absolute -top-10 -start-10 h-32 w-32 rounded-full bg-primary/10" aria-hidden="true" />
          <span className="pointer-events-none absolute -bottom-8 -end-8 h-24 w-24 rounded-full bg-accent/15" aria-hidden="true" />
          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-amber-400 shadow-[0_8px_20px_-6px_rgb(245_158_11/0.5)] sm:h-16 sm:w-16">
            <Crown className="h-7 w-7 text-white sm:h-8 sm:w-8" />
          </span>
          <h2 id="plans-title" className="relative mt-3 text-xl font-extrabold sm:mt-4 sm:text-2xl">
            اختر خطتك
          </h2>
          <p className="relative mt-1 text-xs text-muted sm:text-sm">ابدأ مجاناً، واشترك متى احتجت لفتح كل الدروس</p>
        </div>

        {/* Two plan cards side by side */}
        <div className="grid grid-cols-2 gap-2.5 px-3 pb-3 sm:gap-4 sm:px-5 sm:pb-5">
          {/* Monthly — highlighted, comes first (right in RTL) */}
          <div className="relative rounded-2xl border-2 border-primary bg-gradient-to-b from-primary/10 to-transparent p-3 shadow-[0_8px_30px_-10px_rgb(15_157_138/0.3)] sm:p-4">
            <span className="absolute -top-2.5 start-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-on-primary shadow-sm sm:text-xs">
              الأفضل قيمة
            </span>
            <div className="mb-4 pt-2 text-center sm:mb-5">
              <Crown className="mx-auto h-7 w-7 text-accent sm:h-8 sm:w-8" />
              <div className="mt-2 text-base font-extrabold sm:text-lg">شهرية</div>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black text-primary-ink sm:text-3xl">4.99</span>
                <span className="text-xs font-medium text-muted">ريال/شهر</span>
              </div>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {PAID_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3 w-3 text-primary-ink" strokeWidth={3} />
                  </span>
                  <span className="text-xs font-medium leading-tight sm:text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 text-center sm:mt-6">
              {!loaded ? (
                <div className="mx-auto h-10 w-24 animate-pulse rounded-full bg-surface" />
              ) : subscribed ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary-ink">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    خطتك الحالية
                  </span>
                  <p className="mt-1.5 text-[10px] text-muted sm:text-[11px]">
                    {cancelled ? `ملغى، فعّال حتى ${formatDate(sub!.ends_at)}` : `يتجدد ${formatDate(sub!.renews_at)}`}
                  </p>
                  {sub?.customer_portal_url ? (
                    <a
                      href={sub.customer_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold text-ink shadow-sm hover:bg-surface-hover"
                    >
                      إدارة الاشتراك
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="press mt-2 inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold text-ink shadow-sm hover:bg-surface-hover"
                    >
                      إدارة الاشتراك
                    </Link>
                  )}
                </>
              ) : (
                <SubscribeButton plan="solo" className="inline-block w-full rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-[0_6px_16px_-6px_rgb(15_157_138/0.45)] hover:brightness-110 active:scale-[0.97] transition sm:px-6">
                  اشترك الآن
                </SubscribeButton>
              )}
            </div>
          </div>

          {/* Free */}
          <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
            <div className="mb-4 pt-2 text-center sm:mb-5">
              <Sparkles className="mx-auto h-7 w-7 text-muted sm:h-8 sm:w-8" />
              <div className="mt-2 text-base font-extrabold sm:text-lg">مجانية</div>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-black text-foreground sm:text-3xl">0</span>
                <span className="text-xs font-medium text-muted">ريال</span>
              </div>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-hover">
                    <Check className="h-3 w-3 text-muted" strokeWidth={3} />
                  </span>
                  <span className="text-xs font-medium leading-tight text-foreground/80 sm:text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 text-center sm:mt-6">
              {loaded && !subscribed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-3 py-1 text-xs font-bold text-muted">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  خطتك الحالية
                </span>
              ) : (
                <span className="text-xs text-muted">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Group subscription button */}
        {!subscribed && loaded && (
          <div className="px-3 pb-3 sm:px-5 sm:pb-4">
            <button
              type="button"
              onClick={() => setGroupOpen(true)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-gradient-to-b from-surface to-surface-hover px-5 py-3 text-sm font-bold text-ink shadow-sm hover:shadow-md transition"
            >
              <Users className="h-4.5 w-4.5 text-sky" />
              اشتراك المجموعات — سعر أقل لكل شخص
            </button>
          </div>
        )}

        <p className="border-t border-border px-4 py-3 text-center text-[10px] text-muted sm:px-5 sm:py-3.5 sm:text-xs">
          يتجدد الاشتراك شهرياً، ويمكنك الإلغاء في أي وقت.{' '}
          <Link href="/refund" onClick={onClose} className="text-primary-ink hover:underline">
            سياسة الاسترجاع
          </Link>
        </p>
      </div>

      <GroupDialog open={groupOpen} onClose={() => setGroupOpen(false)} loaded={loaded} subscribed={subscribed} />
    </div>,
    document.body,
  );
}
