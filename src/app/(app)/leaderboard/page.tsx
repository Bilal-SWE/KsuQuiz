import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LeaderboardTable, formatDuration, type LeaderboardRow } from '@/components/student/leaderboard-table';

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

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-1">الترتيب العام</h1>
      <p className="text-sm text-muted mb-6">
        مجموع الإجابات الصحيحة في كل الاختبارات، وعند التعادل يتقدم الأسرع. تُحسب أول محاولة لكل اختبار فقط.
      </p>

      {me && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'ترتيبك', value: `${me.rank} من ${rows.length}` },
            { label: 'الإجابات الصحيحة', value: `${me.score} / ${me.total}` },
            { label: 'نسبة الدقة', value: `${accuracy}%` },
            { label: 'الاختبارات', value: `${me.exams}` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-3">
              <p className="text-xs text-muted">{s.label}</p>
              <p className="text-lg font-bold mt-1">{s.value}</p>
            </div>
          ))}
          <p className="col-span-full text-xs text-muted">
            الوقت الإجمالي: <span dir="ltr">{formatDuration(me.seconds)}</span>
          </p>
        </div>
      )}

      <LeaderboardTable
        rows={rows}
        currentUserId={session.user.id}
        showExams
        emptyText="لا يوجد ترتيب بعد. أكمل أول اختبار لتظهر هنا."
      />
    </div>
  );
}
