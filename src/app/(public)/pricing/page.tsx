import { Check, Crown, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import { getI18n } from '@/i18n/server';

const FREE_FEATURES = ['أول درسين من كل مادة', 'تمرين واختبار للدرسين', 'ترتيب الطلاب', 'تصفح المواد'];
const PAID_FEATURES = ['كل الدروس بدون حدود', 'تمرين واختبار لكل درس', 'شرح لكل إجابة', 'ترتيب الطلاب', 'إلغاء أي وقت'];

export default async function PricingPage() {
  const { t } = await getI18n();

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center sm:mb-8">
        <h1 className="text-xl font-extrabold sm:text-3xl">
          {t.pricing.title1} <span className="gradient-text">{t.pricing.title2}</span>
        </h1>
        <p className="mt-1.5 text-xs text-muted sm:mt-2 sm:text-sm">{t.pricing.subtitle}</p>
      </div>

      <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-4">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <div className="mb-4 text-center sm:mb-5">
            <Sparkles className="mx-auto h-7 w-7 text-primary-ink sm:h-8 sm:w-8" />
            <div className="mt-2 text-lg font-extrabold sm:text-xl">مجانية</div>
          </div>
          <ul className="space-y-3 sm:space-y-3.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-ink sm:h-5 sm:w-5" strokeWidth={3} />
                <span className="text-xs font-medium leading-snug sm:text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 text-center sm:mt-6">
            <Link
              href="/auth/signup"
              className="inline-block rounded-full border border-border px-5 py-2 text-xs font-bold hover:bg-surface-hover sm:px-6 sm:py-2.5 sm:text-sm"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </div>

        {/* Monthly */}
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4 sm:p-5">
          <div className="mb-4 text-center sm:mb-5">
            <Crown className="mx-auto h-7 w-7 text-accent sm:h-8 sm:w-8" />
            <div className="mt-2 text-lg font-extrabold sm:text-xl">شهرية</div>
            <div className="text-xl font-bold text-primary-ink sm:text-2xl">4.99 <span className="text-xs font-medium text-muted sm:text-sm">ريال</span></div>
          </div>
          <ul className="space-y-3 sm:space-y-3.5">
            {PAID_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-ink sm:h-5 sm:w-5" strokeWidth={3} />
                <span className="text-xs font-medium leading-snug sm:text-sm">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 text-center sm:mt-6">
            <Link
              href="/auth/signup"
              className="inline-block rounded-full bg-primary px-5 py-2 text-xs font-bold text-on-primary hover:bg-primary-hover sm:px-6 sm:py-2.5 sm:text-sm"
            >
              اشترك الآن
            </Link>
          </div>
        </div>
      </div>

      {/* Group subscription button */}
      <Link
        href="/auth/signup"
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold text-ink shadow-sm hover:bg-surface-hover sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
      >
        <Users className="h-4 w-4 text-sky sm:h-5 sm:w-5" />
        اشتراك المجموعات
      </Link>

      <p className="mt-3 text-center text-[11px] text-muted sm:mt-4 sm:text-xs">
        {t.pricing.refundNote}{' '}
        <Link href="/refund" className="text-primary-ink hover:underline">{t.footer.refund}</Link>
      </p>
    </div>
  );
}
