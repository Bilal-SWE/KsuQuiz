import Link from 'next/link';
import { Check, Crown, Sparkles, Users } from 'lucide-react';
import { SubscribeButton } from '@/components/shell/subscribe-button';
import { PricingCard } from '@/components/shell/pricing-card';
import { getI18n } from '@/i18n/server';

export async function PricingSection() {
  const { t } = await getI18n();
  const P = t.pricing;

  return (
    <section id="pricing" className="scroll-mt-20 pb-16">
      <div className="mx-auto mb-6 max-w-xl text-center sm:mb-10">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {P.title1} <span className="gradient-text">{P.title2}</span>
        </h2>
        <p className="mt-2 text-muted">{P.subtitle}</p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 stagger">
        {/* Free */}
        <div className="card flex flex-col p-4 sm:p-6">
          <PricingCard detailsLabel={P.showDetails}>
            {/* Header: always visible */}
            <>
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-ink sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <h3 className="text-base font-bold sm:text-xl">{P.freeName}</h3>
              <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">{P.freeTagline}</p>
              <p className="mt-3 text-2xl font-bold sm:mt-5 sm:text-4xl">
                {P.freePrice} <span className="text-xs font-medium text-muted sm:text-base">{P.currency}</span>
              </p>
            </>
            {/* Features: hidden on mobile until expanded */}
            <ul className="mt-3 flex-1 space-y-2 sm:mt-6 sm:space-y-3">
              {P.freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-ink sm:h-4 sm:w-4" />
                  {f}
                </li>
              ))}
            </ul>
            {/* CTA */}
            <Link
              href="/auth/signup"
              className="press mt-3 inline-flex items-center justify-center rounded-full border border-border bg-surface px-3 py-2.5 text-xs font-medium hover:bg-surface-hover hover:border-primary/30 sm:mt-8 sm:px-4 sm:py-3 sm:text-sm"
            >
              {P.freeCta}
            </Link>
          </PricingCard>
        </div>

        {/* Solo */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-ink p-4 text-white shadow-[0_20px_50px_-20px_rgb(15_157_138/0.45)] sm:p-6">
          <PricingCard detailsLabel={P.showDetails}>
            <>
              <span className="pointer-events-none absolute -end-12 -top-12 h-36 w-36 rounded-full bg-primary" />
              <span className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <h3 className="relative text-base font-bold sm:text-xl">{P.premiumName}</h3>
              <p className="relative mt-0.5 text-xs text-white/80 sm:mt-1 sm:text-sm">{P.premiumTagline}</p>
              <p className="relative mt-3 text-xl font-bold leading-snug sm:mt-5 sm:text-2xl">
                {P.premiumPrice}
                <span className="block text-xs font-medium text-white/75 sm:text-sm">{P.premiumPriceNote}</span>
              </p>
            </>
            <ul className="relative mt-3 flex-1 space-y-2 sm:mt-6 sm:space-y-3">
              {P.premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white sm:h-4 sm:w-4" />
                  {f}
                </li>
              ))}
            </ul>
            <SubscribeButton className="relative mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-primary-ink shadow-lg hover:bg-white/90 sm:mt-8 sm:px-4 sm:py-3 sm:text-sm" />
          </PricingCard>
        </div>

        {/* Duo */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-sky to-[#2563eb] p-4 text-white shadow-[0_20px_50px_-20px_rgb(59_130_246/0.35)] sm:p-6">
          <PricingCard detailsLabel={P.showDetails}>
            <>
              <span className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
              <span className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <h3 className="relative text-base font-bold sm:text-xl">{P.duoName}</h3>
              <p className="relative mt-0.5 text-xs text-white/80 sm:mt-1 sm:text-sm">{P.duoTagline}</p>
              <p className="relative mt-3 text-xl font-bold leading-snug sm:mt-5 sm:text-2xl">
                {P.duoPrice}
                <span className="block text-xs font-medium text-white/75 sm:text-sm">{P.duoPriceNote}</span>
              </p>
            </>
            <ul className="relative mt-3 flex-1 space-y-2 sm:mt-6 sm:space-y-3">
              {P.duoFeatures.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white sm:h-4 sm:w-4" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="press relative mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-sky shadow-lg hover:bg-white/90 sm:mt-8 sm:px-4 sm:py-3 sm:text-sm"
            >
              {P.duoCta}
            </Link>
          </PricingCard>
        </div>

        {/* Trio */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] p-4 text-white shadow-[0_20px_50px_-20px_rgb(124_58_237/0.35)] sm:p-6">
          <PricingCard detailsLabel={P.showDetails}>
            <>
              <span className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
              <span className="relative mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 sm:mb-4 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <h3 className="relative text-base font-bold sm:text-xl">{P.trioName}</h3>
              <p className="relative mt-0.5 text-xs text-white/80 sm:mt-1 sm:text-sm">{P.trioTagline}</p>
              <p className="relative mt-3 text-xl font-bold leading-snug sm:mt-5 sm:text-2xl">
                {P.trioPrice}
                <span className="block text-xs font-medium text-white/75 sm:text-sm">{P.trioPriceNote}</span>
              </p>
            </>
            <ul className="relative mt-3 flex-1 space-y-2 sm:mt-6 sm:space-y-3">
              {P.trioFeatures.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs sm:gap-2 sm:text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white sm:h-4 sm:w-4" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="press relative mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-[#7c3aed] shadow-lg hover:bg-white/90 sm:mt-8 sm:px-4 sm:py-3 sm:text-sm"
            >
              {P.trioCta}
            </Link>
          </PricingCard>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        {P.refundNote}{' '}
        <Link href="/refund" className="text-primary-ink hover:underline">
          {t.footer.refund}
        </Link>
        .
      </p>
    </section>
  );
}
