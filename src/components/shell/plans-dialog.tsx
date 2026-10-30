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

        <div className="px-4 pt-5 pb-4 text-center sm:px-5 sm:pt-7 sm:pb-5">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-ink sm:h-12 sm:w-12">
            <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <h2 id="plans-title" className="mt-2 text-lg font-extrabold sm:mt-3 sm:text-2xl">
            اختر خطتك
          </h2>
          <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">ابدأ مجاناً، واشترك متى احتجت لفتح كل الدروس</p>
        </div>

        {/* Two plan cards side by side */}
        <div className="grid grid-cols-2 gap-2.5 px-3 pb-3 sm:gap-4 sm:px-5 sm:pb-5">
          {/* Free */}
          <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
            <div className="mb-3 text-center sm:mb-4">
              <Sparkles className="mx-auto h-6 w-6 text-primary-ink sm:h-7 sm:w-7" />
              <div className="mt-1.5 text-base font-extrabold sm:text-lg">مجانية</div>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-ink" strokeWidth={3} />
                  <span className="text-xs font-medium leading-tight sm:text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center sm:mt-5">
              {loaded && !subscribed ? (
                <span className="text-xs font-bold text-muted">خطتك الحالية</span>
              ) : (
                <span className="text-xs text-muted">—</span>
              )}
            </div>
          </div>

          {/* Monthly */}
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-3 sm:p-4">
            <div className="mb-3 text-center sm:mb-4">
              <Crown className="mx-auto h-6 w-6 text-accent sm:h-7 sm:w-7" />
              <div className="mt-1.5 text-base font-extrabold sm:text-lg">شهرية</div>
              <div className="text-lg font-bold text-primary-ink sm:text-xl">4.99 <span className="text-xs font-medium text-muted">ريال</span></div>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {PAID_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink" strokeWidth={3} />
                  <span className="text-xs font-medium leading-tight sm:text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center sm:mt-5">
              {!loaded ? (
                <div className="mx-auto h-8 w-20 animate-pulse rounded-full bg-surface" />
              ) : subscribed ? (
                <>
                  <span className="text-xs font-bold text-primary-ink">خطتك الحالية</span>
                  <p className="mt-1 text-[10px] text-muted">
                    {cancelled ? `ملغى، فعّال حتى ${formatDate(sub!.ends_at)}` : `يتجدد ${formatDate(sub!.renews_at)}`}
                  </p>
                  {sub?.customer_portal_url ? (
                    <a
                      href={sub.customer_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press mt-1.5 inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-surface-hover"
                    >
                      إدارة الاشتراك
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="press mt-1.5 inline-flex items-center rounded-full bg-surface px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-surface-hover"
                    >
                      إدارة الاشتراك
                    </Link>
                  )}
                </>
              ) : (
                <SubscribeButton plan="solo" className="inline-block rounded-full bg-primary px-5 py-2 text-xs font-bold text-on-primary hover:bg-primary-hover sm:px-6 sm:py-2.5 sm:text-sm">
                  اشترك الآن
                </SubscribeButton>
              )}
            </div>
          </div>
        </div>

        {/* Group subscription button */}
        {!subscribed && loaded && (
          <div className="px-3 pb-3 sm:px-5 sm:pb-5">
            <button
              type="button"
              onClick={() => setGroupOpen(true)}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold text-ink shadow-sm hover:bg-surface-hover"
            >
              <Users className="h-4 w-4 text-sky" />
              اشتراك المجموعات
            </button>
          </div>
        )}

        <p className="border-t border-border px-4 py-2.5 text-center text-[10px] text-muted sm:px-5 sm:py-3 sm:text-xs">
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
