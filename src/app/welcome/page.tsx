import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenCheck, Clock, Crown, ListChecks, Smartphone, Trophy } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/ui/logo';
import { SiteFooter } from '@/components/shell/site-footer';
import { PricingSection } from '@/components/shell/pricing-section';
import { LanguageToggle } from '@/i18n/client';
import { getI18n } from '@/i18n/server';
import { fmt } from '@/i18n/format';
import type { Dictionary } from '@/i18n/dictionaries/ar';
import { categoryColor, type Category } from '@/lib/categories';
import { APP_NAME } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: `${APP_NAME} | ${t.landing.metaTitle}`, description: t.landing.metaDescription };
}

const featureStyles = [
  { icon: BookOpenCheck, tint: 'bg-pastel-teal' },
  { icon: Clock, tint: 'bg-pastel-amber' },
  { icon: Trophy, tint: 'bg-pastel-blue' },
  { icon: Crown, tint: 'bg-pastel-peach' },
  { icon: ListChecks, tint: 'bg-pastel-teal' },
  { icon: Smartphone, tint: 'bg-pastel-amber' },
];

function toLocaleDigits(n: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(n);
}

function PreviewCard({ p }: { p: Dictionary['landing']['preview'] }) {
  return (
    <div className="flex w-full max-w-[440px] flex-col gap-4 rounded-3xl bg-surface p-5 sm:gap-[18px] sm:rounded-[32px] sm:p-7 shadow-[0_24px_48px_rgb(11_31_51/0.12)]">
      <div className="flex items-center justify-between text-[15px] font-bold text-muted">
        <span>{p.questionOf}</span>
        <span className="rounded-full bg-accent px-3.5 py-1 text-ink tabular-nums" dir="ltr">
          {p.timer}
        </span>
      </div>
      <h2 className="text-xl font-bold leading-normal sm:text-[26px]">{p.question}</h2>
      <div className="flex flex-col gap-2.5 text-base font-medium sm:gap-3 sm:text-[19px]">
        {p.options.map((o, i) =>
          i === p.correctIndex ? (
            <div key={o} className="rounded-[20px] border-2 border-success bg-success-light px-4 py-3 font-bold sm:px-5 sm:py-3.5">
              {o}
            </div>
          ) : (
            <div key={o} className="rounded-[20px] border-2 border-border px-4 py-3 sm:px-5 sm:py-3.5">
              {o}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default async function WelcomePage() {
  const { t, locale } = await getI18n();
  const L = t.landing;
  const supabase = await createClient();
  const [subjects, questions, { data: categories }, { data: subjectRows }] = await Promise.all([
    supabase.from('subjects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('questions').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id, name, color, sort_order').order('sort_order'),
    supabase.from('subjects').select('*').eq('status', 'published'),
  ]);

  const perCategory: Record<string, number> = {};
  for (const s of (subjectRows as any[]) ?? []) {
    if (s.category_id) perCategory[s.category_id] = (perCategory[s.category_id] ?? 0) + 1;
  }
  const shownCategories = ((categories as Category[]) ?? []).filter((c) => perCategory[c.id]);
  const subjectCount = subjects.count ?? 0;
  const questionCount = questions.count ?? 0;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-8 sm:py-5">
        <Link href="/" className="grow" aria-label={APP_NAME}>
          <Logo markClassName="h-8 w-8 sm:h-10 sm:w-10" textClassName="text-lg sm:text-2xl" />
        </Link>
        <nav className="hidden md:flex gap-6 text-base font-medium text-muted">
          {shownCategories.length > 0 && (
            <a href="#cats" className="hover:text-ink">
              {L.navCategories}
            </a>
          )}
          <a href="#how" className="hover:text-ink">
            {L.navHow}
          </a>
          <a href="#pricing" className="hover:text-ink">
            {L.navPricing}
          </a>
        </nav>
        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <Link
            href="/auth/signup"
            className="press rounded-full bg-primary px-4 py-1.5 text-sm font-bold sm:px-5 sm:py-2 text-on-primary hover:bg-primary-hover"
          >
            {L.startNow}
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-10 px-4 pt-4 pb-12 sm:gap-12 sm:px-8 sm:pt-14 sm:pb-[72px]">
          <div className="flex flex-[1_1_460px] flex-col gap-5 sm:gap-6 animate-fade-up">
            {questionCount > 0 && subjectCount > 0 && (
              <span className="self-start rounded-full bg-accent-light px-4 py-1.5 text-[15px] font-bold text-ink">
                {fmt(L.heroBadge, { q: toLocaleDigits(questionCount, locale), s: toLocaleDigits(subjectCount, locale) })}
              </span>
            )}
            <h1 className="text-[28px] font-extrabold sm:text-[36px] leading-[1.2] sm:text-[64px] sm:leading-[1.15]">
              {L.heroTitle1}
              <br />
              {L.heroTitle2}
            </h1>
            <p className="max-w-[520px] text-base leading-[1.7] text-muted sm:text-[21px]">{L.heroText}</p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/auth/signup"
                className="press rounded-full bg-primary px-6 py-3 text-base font-extrabold sm:px-9 sm:py-4 sm:text-[19px] text-on-primary hover:bg-primary-hover"
              >
                {L.ctaCreate}
              </Link>
              <Link
                href="/auth/login"
                className="press rounded-full border-2 border-ink bg-surface px-6 py-3 text-base font-bold sm:px-9 sm:py-4 sm:text-[19px] text-ink hover:bg-surface-hover"
              >
                {L.ctaHaveAccount}
              </Link>
            </div>
          </div>
          <div className="flex flex-[1_1_380px] justify-center animate-fade-up">
            <PreviewCard p={L.preview} />
          </div>
        </section>

        {shownCategories.length > 0 && (
          <section id="cats" className="mx-auto flex max-w-[1200px] scroll-mt-6 flex-col gap-5 px-4 pt-4 pb-12 sm:gap-7 sm:px-8 sm:pt-8 sm:pb-16">
            <h2 className="text-[28px] font-extrabold sm:text-[36px]">{L.categoriesTitle}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 stagger">
              {shownCategories.map((c) => (
                <Link
                  key={c.id}
                  href="/auth/signup"
                  className={`press flex min-h-[100px] flex-col gap-1.5 rounded-3xl p-5 sm:min-h-[120px] sm:gap-2 sm:rounded-[28px] sm:p-7 transition hover:-translate-y-0.5 ${categoryColor(c.color).fill}`}
                >
                  <span dir="auto" className="text-xl font-extrabold sm:text-[26px]">
                    {c.name}
                  </span>
                  <span className="text-base font-medium">
                    {fmt(L.categorySubjects, { n: toLocaleDigits(perCategory[c.id], locale) })}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="how" className="scroll-mt-6 bg-ink text-background">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-12 sm:gap-9 sm:px-8 sm:py-[72px]">
            <h2 className="text-[28px] font-extrabold sm:text-[36px]">{L.howTitle}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 sm:gap-8">
              {L.steps.map((s, i) => (
                <div key={s.title} className="flex flex-col gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-xl sm:h-[52px] sm:w-[52px] sm:text-2xl font-extrabold text-ink">
                    {toLocaleDigits(i + 1, locale)}
                  </span>
                  <h3 className="text-xl font-bold sm:text-2xl">{s.title}</h3>
                  <p className="text-base leading-[1.7] text-on-ink-muted sm:text-[17px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1200px] scroll-mt-6 px-4 py-12 sm:px-8 sm:py-16">
          <h2 className="mb-5 text-[28px] font-extrabold sm:text-[36px]">
            {L.featuresTitle1} {L.featuresTitle2}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 stagger">
            {L.features.map((f, i) => {
              const style = featureStyles[i] ?? featureStyles[0];
              return (
                <div key={f.title} className="card p-5 sm:p-7">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-ink ${style.tint}`}>
                    <style.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{f.title}</h3>
                  <p className="mt-1 text-base leading-[1.7] text-muted sm:text-[17px]">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <PricingSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
