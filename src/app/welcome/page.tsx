import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpenCheck, ChevronDown, Timer } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/ui/logo';
import { SiteFooter } from '@/components/shell/site-footer';
import { PricingSection } from '@/components/shell/pricing-section';
import { DemoQuiz } from '@/components/landing/demo-quiz';
import { SubjectBrowser } from '@/components/landing/subject-browser';
import { CountUp } from '@/components/landing/count-up';
import { VisitTracker } from '@/components/landing/visit-tracker';
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

  const [{ count: questionCount }, { data: subjectRows }, { data: lessonRows }, { data: categories }, { data: publicStats }] =
    await Promise.all([
      supabase.from('questions').select('id', { count: 'exact', head: true }),
      supabase.from('subjects').select('id, name, description, cover_image, category_id').eq('status', 'published'),
      supabase.from('lessons').select('subject_id').eq('status', 'published'),
      supabase.from('categories').select('id, name').order('sort_order'),
      // Null until migration 012 is run; the two counters are simply hidden then.
      supabase.rpc('get_public_stats' as any),
    ]);
  const people = (publicStats ?? {}) as { students?: number; visits?: number };

  const lessonsPer: Record<string, number> = {};
  for (const l of lessonRows ?? []) lessonsPer[l.subject_id] = (lessonsPer[l.subject_id] ?? 0) + 1;
  const subjects = sortByName((subjectRows ?? []) as any[]).map((s) => ({ ...s, lessons: lessonsPer[s.id] ?? 0 }));

  const stats = [
    { value: questionCount ?? 0, label: c.hero.stats.questions },
    { value: subjects.length, label: c.hero.stats.subjects },
    { value: lessonRows?.length ?? 0, label: c.hero.stats.lessons },
    { value: Number(people.students ?? 0), label: c.hero.stats.students },
    { value: Number(people.visits ?? 0), label: c.hero.stats.visits },
  ].filter((s) => s.value > 0);

  const modes = [
    { m: c.modes.practice, Icon: BookOpenCheck, dark: false },
    { m: c.modes.exam, Icon: Timer, dark: true },
  ];

  const navLinks = [
    { href: '#try', label: c.nav.try },
    { href: '#subjects', label: c.nav.subjects },
    { href: '#how', label: c.nav.how },
    { href: '#faq', label: c.nav.faq },
  ];

  return (
    <div className="min-h-screen">
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
        {/* Hero with the playable quiz */}
        <section id="try" className="mx-auto grid max-w-6xl scroll-mt-20 items-center gap-8 px-4 pt-8 pb-14 sm:px-6 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-20">
          <div className="flex flex-col gap-5 text-center animate-fade-up lg:text-start">
            <span className="mx-auto rounded-full bg-accent-light px-4 py-1.5 text-sm font-bold text-accent-ink lg:mx-0">{c.hero.eyebrow}</span>
            <h1 className="text-[34px] font-extrabold leading-[1.15] sm:text-5xl lg:text-6xl">
              {c.hero.title1}
              <br />
              <span className="text-primary-ink">{c.hero.title2}</span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">{c.hero.text}</p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/auth/signup" className="press rounded-full bg-primary px-6 py-3 text-base font-extrabold text-on-primary hover:bg-primary-hover">
                {c.hero.ctaSignup}
              </Link>
              <Link href="/auth/login" className="press rounded-full border-2 border-border bg-surface px-6 py-3 text-base font-bold text-ink hover:border-ink sm:hidden">
                {c.nav.login}
              </Link>
            </div>
            {stats.length > 0 && (
              <dl className="mx-auto mt-2 flex flex-wrap justify-center gap-x-8 gap-y-3 lg:mx-0 lg:justify-start">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl font-extrabold sm:text-3xl">
                      <CountUp value={s.value} locale={locale} />
                    </dd>
                    <dd className="text-xs font-medium text-muted sm:text-sm">{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="mx-auto w-full max-w-md animate-fade-up">
            <DemoQuiz d={c.demo} />
          </div>
        </section>

        {/* Subjects */}
        <section id="subjects" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{c.subjects.title}</h2>
            <p className="mt-1.5 text-sm text-muted sm:text-base">{c.subjects.text}</p>
          </div>
          <SubjectBrowser s={c.subjects} subjects={subjects} categories={categories ?? []} />
        </section>

        {/* Practice vs exam */}
        <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{c.modes.title}</h2>
            <p className="mt-1.5 text-sm text-muted sm:text-base">{c.modes.text}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 stagger">
            {modes.map(({ m, Icon, dark }) => (
              <article
                key={m.name}
                className={`flex flex-col rounded-[24px] p-5 sm:p-6 ${dark ? 'bg-ink text-background' : 'card'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${dark ? 'bg-accent text-ink' : 'bg-primary text-on-primary'}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold sm:text-2xl">{m.name}</h3>
                    <p className={`text-sm font-medium ${dark ? 'text-on-ink-muted' : 'text-muted'}`}>{m.goal}</p>
                  </div>
                </div>
                <dl className={`mt-5 flex-1 divide-y ${dark ? 'divide-ink-raised' : 'divide-border'}`}>
                  {m.rows.map((r) => (
                    <div key={r.label} className="py-2.5 first:pt-0">
                      <dt className={`text-xs font-bold ${dark ? 'text-accent' : 'text-primary-ink'}`}>{r.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium sm:text-base">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className={`mt-4 rounded-full px-4 py-2 text-center text-sm font-bold ${dark ? 'bg-ink-raised' : 'bg-primary-light text-primary-ink'}`}>
                  {m.when}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-14 bg-ink text-background">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="text-center text-2xl font-extrabold sm:text-3xl">{c.how.title}</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {c.how.steps.map((s, i) => (
                <li key={s.title} className="flex flex-col items-center gap-2 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg font-extrabold text-ink">
                    {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(i + 1)}
                  </span>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="text-sm text-on-ink-muted">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
          <PricingSection />
        </div>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-14 sm:px-6 sm:pb-20">
          <h2 className="mb-5 text-center text-2xl font-extrabold sm:text-3xl">{c.faq.title}</h2>
          <div className="space-y-2.5">
            {c.faq.items.map((f, i) => (
              <details key={f.q} open={i === 0} className="card group !rounded-2xl px-4 py-3 sm:px-5 sm:py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final call */}
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="flex flex-col items-center gap-4 rounded-[28px] bg-primary px-6 py-10 text-center text-on-primary sm:py-14">
            <h2 className="text-2xl font-extrabold sm:text-4xl">{c.final.title}</h2>
            <p className="text-base font-medium sm:text-lg">{c.final.text}</p>
            <Link href="/auth/signup" className="press rounded-full bg-ink px-8 py-3 text-base font-extrabold text-background hover:bg-ink-raised">
              {c.final.cta}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
      <VisitTracker />
    </div>
  );
}
