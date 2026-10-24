import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  Clock,
  Crown,
  Lightbulb,
  ListChecks,
  Medal,
  Smartphone,
  Sparkles,
  Trophy,
  UserPlus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/ui/logo';
import { SiteFooter } from '@/components/shell/site-footer';
import { PricingSection } from '@/components/shell/pricing-section';
import { LanguageToggle } from '@/i18n/client';
import { getI18n } from '@/i18n/server';
import type { Dictionary } from '@/i18n/dictionaries/ar';
import { APP_NAME } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: `${APP_NAME} | ${t.landing.metaTitle}`, description: t.landing.metaDescription };
}

const featureStyles = [
  { icon: BookOpenCheck, tint: 'from-emerald-500 to-teal-500' },
  { icon: Clock, tint: 'from-violet-500 to-fuchsia-500' },
  { icon: Trophy, tint: 'from-amber-400 to-orange-500' },
  { icon: Crown, tint: 'from-orange-400 to-rose-500' },
  { icon: ListChecks, tint: 'from-sky-500 to-indigo-500' },
  { icon: Smartphone, tint: 'from-pink-500 to-purple-500' },
];

const stepIcons = [UserPlus, Sparkles, Medal];

function PreviewCard({ p }: { p: Dictionary['landing']['preview'] }) {
  const options = [
    { t: '32', correct: false },
    { t: '36', correct: true },
    { t: '38', correct: false },
    { t: '42', correct: false },
  ];
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -top-5 -left-3 z-20 flex items-center gap-2 rounded-2xl bg-surface px-3 py-2 text-foreground shadow-xl animate-float">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <Trophy className="h-4 w-4" />
        </span>
        <span className="text-xs">
          <span className="block text-muted">{p.yourRank}</span>
          <span className="font-bold">{p.first}</span>
        </span>
      </div>

      <div className="relative z-10 rounded-3xl bg-surface p-4 text-foreground shadow-2xl">
        <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-surface-hover">
          <div className="h-full w-3/5 rounded-full bg-gradient-to-l from-primary to-fuchsia-500" />
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 p-4 text-white">
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px]">{p.questionOf}</span>
          <p className="mt-2 font-bold">{p.question}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {options.map((o, i) => (
            <div
              key={o.t}
              className={`flex items-center gap-2 rounded-xl border p-2 text-sm ${
                o.correct ? 'border-success bg-success-light' : 'border-border opacity-70'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white ${
                  o.correct ? 'bg-success' : ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-orange-400'][i]
                }`}
              >
                {o.correct ? <Check className="h-4 w-4" /> : p.letters[i]}
              </span>
              {o.t}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2 rounded-xl bg-success-light p-2.5 text-xs text-success">
          <Lightbulb className="h-4 w-4 shrink-0 text-warning" />
          {p.feedback}
        </div>
      </div>

      <div className="absolute -bottom-5 -right-3 z-20 flex items-center gap-2 rounded-2xl bg-surface px-3 py-2 text-foreground shadow-xl animate-float [animation-delay:1.2s]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-xs font-bold text-white">92%</span>
        <span className="text-xs font-bold">{p.great}</span>
      </div>
    </div>
  );
}

export default async function WelcomePage() {
  const { t } = await getI18n();
  const L = t.landing;
  const supabase = await createClient();
  const [subjects, lessons, questions] = await Promise.all([
    supabase.from('subjects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('questions').select('id', { count: 'exact', head: true }),
  ]);
  const stats = [
    { value: subjects.count ?? 0, label: L.statSubjects },
    { value: lessons.count ?? 0, label: L.statLessons },
    { value: questions.count ?? 0, label: L.statQuestions },
  ].filter((s) => s.value > 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted">
            <a href="#features" className="rounded-xl px-3 py-2 hover:bg-surface-hover hover:text-foreground">{L.navFeatures}</a>
            <a href="#how" className="rounded-xl px-3 py-2 hover:bg-surface-hover hover:text-foreground">{L.navHow}</a>
            <a href="#pricing" className="rounded-xl px-3 py-2 hover:bg-surface-hover hover:text-foreground">{L.navPricing}</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageToggle />
            <Link href="/auth/login" className="press hidden sm:inline-flex rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface-hover">
              {t.common.login}
            </Link>
            <Link
              href="/auth/signup"
              className="press rounded-xl bg-gradient-to-l from-primary to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgb(109_40_217/0.6)] hover:brightness-110"
            >
              {t.common.startFree}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <section className="hero mt-6 px-6 py-12 sm:px-12 sm:py-16 animate-fade-up">
          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25">
                <Sparkles className="h-3.5 w-3.5" />
                {L.badge}
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight">
                {L.heroTitle1}
                <br />
                {L.heroTitle2}
              </h1>
              <p className="mt-4 max-w-md text-base text-white/85 leading-relaxed">{L.heroText}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="press inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-lg hover:bg-white/90"
                >
                  {L.ctaCreate}
                  <ArrowLeft className="h-4 w-4 ltr:-scale-x-100" />
                </Link>
                <Link
                  href="/auth/login"
                  className="press inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
                >
                  {L.ctaHaveAccount}
                </Link>
              </div>
              {stats.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-3xl font-bold">{s.value}</p>
                      <p className="text-xs text-white/75">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="py-6">
              <PreviewCard p={L.preview} />
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 py-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="text-3xl font-bold">
              {L.featuresTitle1} <span className="gradient-text">{L.featuresTitle2}</span>
            </h2>
            <p className="mt-2 text-muted">{L.featuresSubtitle}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {L.features.map((f, i) => {
              const style = featureStyles[i] ?? featureStyles[0];
              return (
                <div key={f.title} className="card card-hover group p-6">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${style.tint} text-white shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6`}
                  >
                    <style.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="how" className="scroll-mt-20 pb-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="text-3xl font-bold">{L.howTitle}</h2>
            <p className="mt-2 text-muted">{L.howSubtitle}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 stagger">
            {L.steps.map((s, i) => {
              const Icon = stepIcons[i] ?? Sparkles;
              return (
                <div key={s.title} className="card overflow-hidden">
                  <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600">
                    <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/15" />
                    <span className="relative text-4xl font-bold text-white/95">{i + 1}</span>
                  </div>
                  <div className="flex items-start gap-3 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold">{s.title}</h3>
                      <p className="mt-0.5 text-sm text-muted">{s.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <PricingSection />

        <section className="hero mb-16 px-6 py-12 text-center sm:px-12">
          <div className="relative z-10 mx-auto max-w-lg">
            <h2 className="text-3xl font-bold">{L.finalTitle}</h2>
            <p className="mt-2 text-white/85">{L.finalText}</p>
            <Link
              href="/auth/signup"
              className="press mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg hover:bg-white/90"
            >
              {L.finalCta}
              <ArrowLeft className="h-4 w-4 ltr:-scale-x-100" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
