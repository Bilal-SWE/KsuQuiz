import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Clock, ListChecks, Target, Trophy } from 'lucide-react';
import { LeaderboardTable, Podium, type LeaderboardRow } from '@/components/student/leaderboard-table';
import { InfoTooltip } from '@/components/ui/info-tooltip';
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
    rank: r.rank != null ? Number(r.rank) : 0,
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
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <section className="relative rounded-[28px] border border-border bg-gradient-to-b from-primary-light to-surface px-5 py-6 sm:px-8 sm:py-8 animate-fade-up">
        <div className="relative flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{B.title}</h1>
          <InfoTooltip label={B.infoLabel} title={B.infoTitle} items={B.infoCriteria} />
        </div>
      </section>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
          {stats.map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <span className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${s.tone}`}>
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

      {rows.filter((r) => r.rank > 0).length >= 3 && <Podium rows={rows.filter((r) => r.rank > 0).slice(0, 3)} currentUserId={session.user.id} />}

      <LeaderboardTable rows={rows} currentUserId={session.user.id} showExams emptyText={B.empty} />
    </div>
  );
}
