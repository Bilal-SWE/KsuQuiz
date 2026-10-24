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
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} | ذاكر بذكاء وتصدّر الترتيب`,
  description: 'منصة تدريب على أسئلة موادك: تمارين مع شرح، اختبارات، وترتيب تنافسي بين الطلاب.',
};

const features = [
  {
    icon: BookOpenCheck,
    title: 'تمارين مع شرح',
    desc: 'اعرف الإجابة الصحيحة فوراً مع شرح لكل خيار، لتفهم لا لتحفظ.',
    tint: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Clock,
    title: 'اختبارات بالوقت',
    desc: 'اختبر نفسك بجدية، واعرف نتيجتك ومراجعة أخطائك في النهاية.',
    tint: 'from-violet-500 to-fuchsia-500',
  },
  {
    icon: Trophy,
    title: 'ترتيب لكل اختبار',
    desc: 'شاهد ترتيبك بين زملائك في كل درس قبل أن تبدأ وبعد أن تنتهي.',
    tint: 'from-amber-400 to-orange-500',
  },
  {
    icon: Crown,
    title: 'ترتيب عام عادل',
    desc: 'تُحسب أول محاولة فقط، فلا مكان لتكرار الأسئلة وحفظها بالبصم.',
    tint: 'from-orange-400 to-rose-500',
  },
  {
    icon: ListChecks,
    title: 'أسئلة متنوعة',
    desc: 'اختيار من متعدد، صح أو خطأ، واملأ الفراغات من بنك كلمات.',
    tint: 'from-sky-500 to-indigo-500',
  },
  {
    icon: Smartphone,
    title: 'على جوالك',
    desc: 'تصميم مريح للجوال، ذاكر في أي وقت ومن أي مكان.',
    tint: 'from-pink-500 to-purple-500',
  },
];

const steps = [
  { icon: UserPlus, title: 'أنشئ حسابك', desc: 'تسجيل سريع بالبريد الإلكتروني.' },
  { icon: Sparkles, title: 'أضف موادك', desc: 'اختر المواد التي تدرسها من القائمة.' },
  { icon: Medal, title: 'تدرّب وتنافس', desc: 'حل التمارين، اختبر نفسك، وتصدّر الترتيب.' },
];

function PreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -top-5 -left-3 z-20 flex items-center gap-2 rounded-2xl bg-surface px-3 py-2 text-foreground shadow-xl animate-float">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <Trophy className="h-4 w-4" />
        </span>
        <span className="text-xs">
          <span className="block text-muted">ترتيبك</span>
          <span className="font-bold">الأول</span>
        </span>
      </div>

      <div className="relative z-10 rounded-3xl bg-surface p-4 text-foreground shadow-2xl">
        <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-surface-hover">
          <div className="h-full w-3/5 rounded-full bg-gradient-to-l from-primary to-fuchsia-500" />
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 p-4 text-white">
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px]">السؤال 3 من 5</span>
          <p className="mt-2 font-bold">ما ناتج 12 × 3؟</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { l: 'أ', t: '32', s: '' },
            { l: 'ب', t: '36', s: 'correct' },
            { l: 'ج', t: '38', s: '' },
            { l: 'د', t: '42', s: '' },
          ].map((o, i) => (
            <div
              key={o.l}
              className={`flex items-center gap-2 rounded-xl border p-2 text-sm ${
                o.s === 'correct' ? 'border-success bg-success-light' : 'border-border opacity-70'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white ${
                  o.s === 'correct'
                    ? 'bg-success'
                    : ['bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-orange-400'][i]
                }`}
              >
                {o.s === 'correct' ? <Check className="h-4 w-4" /> : o.l}
              </span>
              {o.t}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2 rounded-xl bg-success-light p-2.5 text-xs text-success">
          <Lightbulb className="h-4 w-4 shrink-0 text-warning" />
          أحسنت! 12 × 3 = 36
        </div>
      </div>

      <div className="absolute -bottom-5 -right-3 z-20 flex items-center gap-2 rounded-2xl bg-surface px-3 py-2 text-foreground shadow-xl animate-float [animation-delay:1.2s]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-xs font-bold text-white">
          92%
        </span>
        <span className="text-xs font-bold">نتيجة ممتازة</span>
      </div>
    </div>
  );
}

export default async function WelcomePage() {
  const supabase = await createClient();
  const [subjects, lessons, questions] = await Promise.all([
    supabase.from('subjects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('lessons').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('questions').select('id', { count: 'exact', head: true }),
  ]);
  const stats = [
    { value: subjects.count ?? 0, label: 'مادة' },
    { value: lessons.count ?? 0, label: 'درس' },
    { value: questions.count ?? 0, label: 'سؤال' },
  ].filter((s) => s.value > 0);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted">
            <a href="#features" className="rounded-xl px-3 py-2 hover:bg-surface-hover hover:text-foreground">المميزات</a>
            <a href="#how" className="rounded-xl px-3 py-2 hover:bg-surface-hover hover:text-foreground">كيف تبدأ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="press rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface-hover">
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/signup"
              className="press rounded-xl bg-gradient-to-l from-primary to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-[0_6px_16px_-6px_rgb(109_40_217/0.6)] hover:brightness-110"
            >
              ابدأ مجاناً
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
                منصة تدريب لطلاب الجامعة
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight">
                ذاكر بذكاء،
                <br />
                وتصدّر الترتيب
              </h1>
              <p className="mt-4 max-w-md text-base text-white/85 leading-relaxed">
                حل أسئلة موادك بطريقة ممتعة، افهم أخطاءك مع الشرح، وتنافس مع زملائك على المراكز الأولى.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="press inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-lg hover:bg-white/90"
                >
                  أنشئ حسابك الآن
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="press inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
                >
                  لدي حساب
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
              <PreviewCard />
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 py-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="text-3xl font-bold">
              كل ما تحتاجه <span className="gradient-text">لتتفوّق</span>
            </h2>
            <p className="mt-2 text-muted">أدوات بسيطة تجعل المذاكرة عادة ممتعة.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {features.map((f) => (
              <div key={f.title} className="card card-hover group p-6">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.tint} text-white shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6`}
                >
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="scroll-mt-20 pb-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="text-3xl font-bold">ابدأ في ثلاث خطوات</h2>
            <p className="mt-2 text-muted">أقل من دقيقة وتكون جاهزاً لأول تمرين.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 stagger">
            {steps.map((s, i) => (
              <div key={s.title} className="card overflow-hidden">
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600">
                  <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/15" />
                  <span className="relative text-4xl font-bold text-white/95">{i + 1}</span>
                </div>
                <div className="flex items-start gap-3 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="hero mb-16 px-6 py-12 text-center sm:px-12">
          <div className="relative z-10 mx-auto max-w-lg">
            <h2 className="text-3xl font-bold">جاهز تبدأ التحدي؟</h2>
            <p className="mt-2 text-white/85">انضم الآن وابدأ أول اختبار لك اليوم.</p>
            <Link
              href="/auth/signup"
              className="press mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg hover:bg-white/90"
            >
              أنشئ حسابك مجاناً
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-surface/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
          <Logo markClassName="h-7 w-7" textClassName="text-base" />
          <p>© {new Date().getFullYear()} {APP_NAME}</p>
        </div>
      </footer>
    </div>
  );
}
