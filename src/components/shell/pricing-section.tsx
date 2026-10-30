import Link from 'next/link';
import { Check, Crown, Sparkles, Users } from 'lucide-react';
import { SubscribeButton } from '@/components/shell/subscribe-button';
import { getI18n } from '@/i18n/server';

export async function PricingSection() {
  const { t } = await getI18n();
  const P = t.pricing;

  return (
    <section id="pricing" className="scroll-mt-20 pb-16">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className="text-3xl font-bold">
          {P.title1} <span className="gradient-text">{P.title2}</span>
        </h2>
        <p className="mt-2 text-muted">{P.subtitle}</p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 stagger">
        {/* Free */}
        <div className="card flex flex-col p-6">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary-ink">
            <Sparkles className="h-6 w-6" />
          </span>
          <h3 className="text-xl font-bold">{P.freeName}</h3>
          <p className="mt-1 text-sm text-muted">{P.freeTagline}</p>
          <p className="mt-5 text-4xl font-bold">
            {P.freePrice} <span className="text-base font-medium text-muted">{P.currency}</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {P.freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-ink" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="press mt-8 inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium hover:bg-surface-hover hover:border-primary/30"
          >
            {P.freeCta}
          </Link>
        </div>

        {/* Solo */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-[0_20px_50px_-20px_rgb(15_157_138/0.45)]">
          <span className="pointer-events-none absolute -end-12 -top-12 h-36 w-36 rounded-full bg-primary" />
          <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
            <Crown className="h-6 w-6" />
          </span>
          <h3 className="relative text-xl font-bold">{P.premiumName}</h3>
          <p className="relative mt-1 text-sm text-white/80">{P.premiumTagline}</p>
          <p className="relative mt-5 text-2xl font-bold leading-snug">
            {P.premiumPrice}
            <span className="block text-sm font-medium text-white/75">{P.premiumPriceNote}</span>
          </p>
          <ul className="relative mt-6 flex-1 space-y-3">
            {P.premiumFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                {f}
              </li>
            ))}
          </ul>
          <SubscribeButton className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary-ink shadow-lg hover:bg-white/90" />
        </div>

        {/* Duo */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-sky to-[#2563eb] p-6 text-white shadow-[0_20px_50px_-20px_rgb(59_130_246/0.35)]">
          <span className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
            <Users className="h-6 w-6" />
          </span>
          <h3 className="relative text-xl font-bold">{P.duoName}</h3>
          <p className="relative mt-1 text-sm text-white/80">{P.duoTagline}</p>
          <p className="relative mt-5 text-2xl font-bold leading-snug">
            {P.duoPrice}
            <span className="block text-sm font-medium text-white/75">{P.duoPriceNote}</span>
          </p>
          <ul className="relative mt-6 flex-1 space-y-3">
            {P.duoFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="press relative mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-sky shadow-lg hover:bg-white/90"
          >
            {P.duoCta}
          </Link>
        </div>

        {/* Trio */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] p-6 text-white shadow-[0_20px_50px_-20px_rgb(124_58_237/0.35)]">
          <span className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <span className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
            <Users className="h-6 w-6" />
          </span>
          <h3 className="relative text-xl font-bold">{P.trioName}</h3>
          <p className="relative mt-1 text-sm text-white/80">{P.trioTagline}</p>
          <p className="relative mt-5 text-2xl font-bold leading-snug">
            {P.trioPrice}
            <span className="block text-sm font-medium text-white/75">{P.trioPriceNote}</span>
          </p>
          <ul className="relative mt-6 flex-1 space-y-3">
            {P.trioFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="press relative mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#7c3aed] shadow-lg hover:bg-white/90"
          >
            {P.trioCta}
          </Link>
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
