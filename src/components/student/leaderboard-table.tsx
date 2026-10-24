export type LeaderboardRow = {
  rank: number;
  student_id: string;
  full_name: string;
  score: number;
  total: number;
  seconds: number;
  exams?: number;
};

export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mmss = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return h > 0 ? `${h}:${mmss}` : mmss;
}

const medal = ['bg-yellow-100 text-yellow-800', 'bg-gray-200 text-gray-700', 'bg-orange-100 text-orange-800'];

export function LeaderboardTable({
  rows,
  currentUserId,
  showExams = false,
  emptyText,
}: {
  rows: LeaderboardRow[];
  currentUserId: string;
  showExams?: boolean;
  emptyText: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted text-center py-6">{emptyText}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-surface-hover text-muted">
          <tr>
            <th className="py-2 px-3 text-start font-medium w-12">#</th>
            <th className="py-2 px-3 text-start font-medium">الطالب</th>
            {showExams && <th className="py-2 px-3 text-center font-medium">الاختبارات</th>}
            <th className="py-2 px-3 text-center font-medium">الصحيحة</th>
            <th className="py-2 px-3 text-center font-medium">الوقت</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isMe = r.student_id === currentUserId;
            return (
              <tr key={r.student_id} className={`border-t border-border ${isMe ? 'bg-primary-light' : ''}`}>
                <td className="py-2 px-3">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      medal[r.rank - 1] ?? 'text-muted'
                    }`}
                  >
                    {r.rank}
                  </span>
                </td>
                <td className="py-2 px-3 font-medium">
                  {r.full_name || 'طالب'}
                  {isMe && <span className="text-xs text-primary ms-1">(أنت)</span>}
                </td>
                {showExams && <td className="py-2 px-3 text-center">{r.exams}</td>}
                <td className="py-2 px-3 text-center">
                  {r.score} / {r.total}
                </td>
                <td className="py-2 px-3 text-center tabular-nums" dir="ltr">
                  {formatDuration(r.seconds)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
