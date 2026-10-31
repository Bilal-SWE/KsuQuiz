import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/ui/logo';
import { SiteFooter } from '@/components/shell/site-footer';
import { PricingSection } from '@/components/shell/pricing-section';
import { DemoQuiz } from '@/components/landing/demo-quiz';
import { CountUp } from '@/components/landing/count-up';
import { VisitTracker } from '@/components/landing/visit-tracker';
import { SubjectCover } from '@/components/student/subject-card';
import { getI18n } from '@/i18n/server';
import { APP_NAME } from '@/lib/constants';
import { sortByName } from '@/lib/sort';
import { landingContent } from './content';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: `${APP_NAME} | ${t.landing.metaTitle}`, description: t.landing.metaDescription };
}

export default async function WelcomePage() {
  const { locale } = await getI18n();
  const c = landingContent[locale];
  const supabase = await createClient();

  const [{ count: questionCount }, { data: subjectRows }, { data: lessonRows }, { data: publicStats }] =
    await Promise.all([
      supabase.from('questions').select('id', { count: 'exact', head: true }),
      supabase.from('subjects').select('id, name, description, cover_image, category_id, status').in('status', ['published', 'soon']),
      supabase.from('lessons').select('subject_id').eq('status', 'published'),
      supabase.rpc('get_public_stats' as any),
    ]);
  const people = (publicStats ?? {}) as { students?: number; visits?: number };

  const lessonsPer: Record<string, number> = {};
  for (const l of lessonRows ?? []) lessonsPer[l.subject_id] = (lessonsPer[l.subject_id] ?? 0) + 1;
  const subjects = sortByName((subjectRows ?? []) as any[]).map((s) => ({ ...s, lessons: lessonsPer[s.id] ?? 0 }));
  const previewSubjects = subjects.slice(0, 4);

  const stats = [
    { value: questionCount ?? 0, label: c.hero.stats.questions },
    { value: subjects.length, label: c.hero.stats.subjects },
    { value: lessonRows?.length ?? 0, label: c.hero.stats.lessons },
    { value: Number(people.students ?? 0), label: c.hero.stats.students },
  ].filter((s) => s.value > 0);

  const navLinks = [
    { href: '#try', label: c.nav.try },
    { href: '#subjects', label: c.nav.subjects },
    { href: '#pricing', label: c.nav.pricing },
    { href: '#faq', label: c.nav.faq },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
          <Link href="/welcome" className="grow" aria-label={APP_NAME}>
            <Logo markClassName="h-8 w-8 sm:h-9 sm:w-9" textClassName="text-lg sm:text-xl" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-hover hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <Link href="/auth/login" className="hidden rounded-full px-3 py-1.5 text-sm font-bold text-ink hover:bg-surface-hover sm:inline-flex">
              {c.nav.login}
            </Link>
            <Link href="/auth/signup" className="press rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary hover:bg-primary-hover">
              {c.nav.start}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="try" className="relative overflow-hidden scroll-mt-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-light/50 to-transparent" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pt-10 pb-16 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-24">
            <div className="flex flex-col gap-5 text-center animate-fade-up lg:text-start">
              <span className="mx-auto rounded-full bg-accent-light px-4 py-1.5 text-sm font-bold text-accent-ink lg:mx-0">{c.hero.eyebrow}</span>
              <h1 className="text-[34px] font-extrabold leading-[1.12] sm:text-5xl lg:text-[56px]">
                {c.hero.title1}
                <br />
                <span className="text-primary-ink">{c.hero.title2}</span>
              </h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">{c.hero.text}</p>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link href="/auth/signup" className="press rounded-full bg-primary px-6 py-3 text-base font-extrabold text-on-primary shadow-lg shadow-primary/25 hover:bg-primary-hover">
                  {c.hero.ctaSignup}
                </Link>
                <Link href="/auth/login" className="press rounded-full border-2 border-border bg-surface px-6 py-3 text-base font-bold text-ink hover:border-ink sm:hidden">
                  {c.nav.login}
                </Link>
              </div>
              {stats.length > 0 && (
                <dl className="mx-auto mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mx-0">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-border bg-surface/80 px-3 py-3 text-center backdrop-blur">
                      <dd className="text-2xl font-extrabold text-ink">
                        <CountUp value={s.value} locale={locale} />
                      </dd>
                      <dt className="mt-0.5 text-xs font-medium text-muted">{s.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="mx-auto w-full max-w-md animate-fade-up">
              <DemoQuiz d={c.demo} />
            </div>
          </div>
        </section>

        {/* Subjects preview */}
        <section id="subjects" className="scroll-mt-20 bg-ink text-background">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold sm:text-3xl">{c.subjects.title}</h2>
              <p className="mt-2 text-sm text-on-ink-muted sm:text-base">{c.subjects.text}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 stagger">
              {previewSubjects.map((s) => (
                <Link
                  key={s.id}
                  href="/auth/signup"
                  className="group flex flex-col overflow-hidden rounded-2xl bg-ink-raised ring-1 ring-white/10 transition-transform hover:scale-[1.02]"
                >
                  <SubjectCover subject={s} />
                  <div className="p-3">
                    <h3 className="truncate text-sm font-bold">{s.name}</h3>
                    <p className="mt-0.5 text-xs text-on-ink-muted">{s.lessons} {locale === 'ar' ? 'درس' : 'lessons'}</p>
                  </div>
                </Link>
              ))}
            </div>
            {subjects.length > 4 && (
              <div className="mt-8 text-center">
                <Link
                  href="/auth/login"
                  className="press inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/20"
                >
                  {c.subjects.seeAll}
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <div id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 sm:px-6 sm:pt-24">
          <PricingSection />
        </div>

        {/* Group subscriptions */}
        <section id="group" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-8 sm:px-6 sm:pb-12">
          <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary-light/40 to-surface px-5 py-10 sm:px-10 sm:py-14">
            <div className="mb-8 flex items-center justify-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-ink">
                <Users className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-extrabold sm:text-3xl">{c.group.title}</h2>
            </div>
            <p className="mx-auto mb-8 max-w-lg text-center text-sm text-muted sm:text-base">{c.group.text}</p>
            <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
              {c.group.plans.map((p) => (
                <div key={p.name} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="mt-1 text-2xl font-extrabold text-primary-ink">{p.price} <span className="text-sm font-medium text-muted">{locale === 'ar' ? 'ريال/شهر' : 'SAR/mo'}</span></p>
                  <p className="mt-0.5 text-sm font-bold text-accent-ink">{p.per}</p>
                  <p className="mt-2 text-sm text-muted">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <h3 className="mb-3 text-center text-base font-bold">{c.group.howTitle}</h3>
              <ol className="mx-auto flex max-w-lg flex-col gap-2">
                {c.group.howSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-ink">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-14 sm:px-6 sm:pb-20">
          <h2 className="mb-6 text-center text-2xl font-extrabold sm:text-3xl">{c.faq.title}</h2>
          <div className="space-y-2.5">
            {c.faq.items.map((f, i) => (
              <details key={f.q} open={i === 0} className="group rounded-2xl border border-border bg-surface px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-12 text-center text-background sm:py-16">
            <span className="pointer-events-none absolute -top-20 -start-20 h-56 w-56 rounded-full bg-primary/20" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-16 -end-16 h-48 w-48 rounded-full bg-accent/15" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-4">
              <h2 className="text-2xl font-extrabold sm:text-4xl">{c.final.title}</h2>
              <p className="text-base font-medium text-on-ink-muted sm:text-lg">{c.final.text}</p>
              <Link href="/auth/signup" className="press mt-2 rounded-full bg-primary px-8 py-3 text-base font-extrabold text-on-primary shadow-lg shadow-primary/25 hover:bg-primary-hover">
                {c.final.cta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <VisitTracker />
    </div>
  );
}
