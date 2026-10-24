import Link from 'next/link';
import { Check, Crown, Sparkles } from 'lucide-react';
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

      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2 stagger">
        <div className="card flex flex-col p-6 sm:p-8">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
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
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/auth/signup"
            className="press mt-8 inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium hover:bg-surface-hover hover:border-primary/30"
          >
            {P.freeCta}
          </Link>
        </div>

        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 p-6 text-white shadow-[0_20px_50px_-20px_rgb(109_40_217/0.6)] sm:p-8">
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <span className="absolute top-5 end-5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold ring-1 ring-white/30">{P.soon}</span>
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
          <SubscribeButton className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-primary shadow-lg hover:bg-white/90" />
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        {P.refundNote}{' '}
        <Link href="/refund" className="text-primary hover:underline">
          {t.footer.refund}
        </Link>
        .
      </p>
    </section>
  );
}
