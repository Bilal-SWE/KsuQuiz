import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Clock, ListChecks, Target, Trophy } from 'lucide-react';
import { LeaderboardTable, Podium, type LeaderboardRow } from '@/components/student/leaderboard-table';
import { formatDuration } from '@/lib/format';
import { getI18n } from '@/i18n/server';
import { fmt } from '@/i18n/format';

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/auth/login');

  const [{ data }, { t }] = await Promise.all([supabase.rpc('get_global_leaderboard'), getI18n()]);
  const B = t.leaderboard;

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
        { label: B.yourRank, value: `${me.rank}`, sub: fmt(B.ofN, { n: rows.length }), icon: Trophy, tone: 'bg-accent-light text-accent-ink', ltr: false },
        { label: B.correctAnswers, value: `${me.score}`, sub: fmt(B.ofN, { n: me.total }), icon: ListChecks, tone: 'bg-success-light text-success-ink', ltr: false },
        { label: B.accuracy, value: `${accuracy}%`, sub: fmt(B.examsCount, { n: me.exams ?? 0 }), icon: Target, tone: 'bg-primary-light text-primary-ink', ltr: false },
        { label: B.totalTime, value: formatDuration(me.seconds), sub: B.inExams, icon: Clock, tone: 'bg-accent-light text-accent-ink', ltr: true },
      ]
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <section className="hero p-6 sm:p-8 animate-fade-up">
        <div className="relative z-10 flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 animate-float">
            <Trophy className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{B.title}</h1>
            <p className="mt-1 text-sm text-white/80">{B.subtitle}</p>
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
              <p className="text-xl font-bold" dir={s.ltr ? 'ltr' : undefined}>
                {s.value}
              </p>
              <p className="text-xs text-muted">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {rows.length >= 3 && <Podium rows={rows.slice(0, 3)} currentUserId={session.user.id} />}

      <LeaderboardTable rows={rows} currentUserId={session.user.id} showExams emptyText={B.empty} />
    </div>
  );
}
