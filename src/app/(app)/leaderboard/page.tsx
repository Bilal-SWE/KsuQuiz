import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Clock, ListChecks, Target, Trophy } from 'lucide-react';
import { LeaderboardTable, Podium, formatDuration, type LeaderboardRow } from '@/components/student/leaderboard-table';

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const { data } = await supabase.rpc('get_global_leaderboard');

  const rows: LeaderboardRow[] = ((data as any[]) ?? []).map((r) => ({
    rank: Number(r.rank),
    student_id: r.student_id,
    full_name: r.full_name,
    score: Number(r.total_score),
    total: Number(r.total_questions),
    seconds: Number(r.total_seconds),
    exams: Number(r.exams_count),
  }));

  const me = rows.find((r) => r.student_id === session.user.id);
  const accuracy = me && me.total > 0 ? Math.round((me.score / me.total) * 100) : 0;

  const stats = me
    ? [
        { label: 'ترتيبك', value: `${me.rank}`, sub: `من ${rows.length}`, icon: Trophy, tone: 'bg-amber-100 text-amber-600' },
        { label: 'الإجابات الصحيحة', value: `${me.score}`, sub: `من ${me.total}`, icon: ListChecks, tone: 'bg-success-light text-success' },
        { label: 'نسبة الدقة', value: `${accuracy}%`, sub: `${me.exams} اختبار`, icon: Target, tone: 'bg-primary-light text-primary' },
        { label: 'الوقت الإجمالي', value: formatDuration(me.seconds), sub: 'في الاختبارات', icon: Clock, tone: 'bg-accent-light text-accent' },
      ]
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <section className="hero p-6 sm:p-8 animate-fade-up">
        <div className="relative z-10 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 animate-float">
            <Trophy className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">الترتيب العام</h1>
            <p className="mt-1 text-sm text-white/80">
              مجموع الإجابات الصحيحة في كل الاختبارات، والأسرع يتقدم عند التعادل. تُحسب أول محاولة فقط.
            </p>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
          {stats.map((s) => (
            <div key={s.label} className="card p-4">
              <span className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <p className="text-xs text-muted">{s.label}</p>
              <p className="text-xl font-bold" dir={s.label === 'الوقت الإجمالي' ? 'ltr' : undefined}>
                {s.value}
              </p>
              <p className="text-xs text-muted">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {rows.length >= 3 && <Podium rows={rows.slice(0, 3)} currentUserId={session.user.id} />}

      <LeaderboardTable
        rows={rows}
        currentUserId={session.user.id}
        showExams
        emptyText="لا يوجد ترتيب بعد. أكمل أول اختبار لتظهر هنا."
      />
    </div>
  );
}
