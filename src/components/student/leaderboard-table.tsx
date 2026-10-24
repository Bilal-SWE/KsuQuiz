import { Crown, Medal } from 'lucide-react';

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

const rankStyle: Record<number, string> = {
  1: 'bg-gradient-to-br from-amber-300 to-yellow-500 text-white',
  2: 'bg-gradient-to-br from-slate-300 to-slate-400 text-white',
  3: 'bg-gradient-to-br from-orange-300 to-orange-500 text-white',
};

export function Podium({ rows, currentUserId }: { rows: LeaderboardRow[]; currentUserId: string }) {
  const order = [rows[1], rows[0], rows[2]].filter(Boolean);
  const heights: Record<number, string> = { 1: 'h-28', 2: 'h-20', 3: 'h-16' };

  return (
    <div className="card flex items-end justify-center gap-3 px-4 pt-6 pb-0 sm:gap-6 animate-fade-up">
      {order.map((r) => (
        <div key={r.student_id} className="flex w-24 flex-col items-center sm:w-28">
          {r.rank === 1 && <Crown className="mb-1 h-6 w-6 text-amber-400 animate-float" />}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold shadow-lg ring-4 ring-surface ${rankStyle[r.rank] ?? 'bg-primary-light text-primary'}`}
          >
            {(r.full_name || '?').charAt(0)}
          </div>
          <p className={`mt-2 w-full truncate text-center text-sm font-bold ${r.student_id === currentUserId ? 'text-primary' : ''}`}>
            {r.full_name || 'طالب'}
          </p>
          <p className="text-xs text-muted">
            {r.score} / {r.total}
          </p>
          <div
            className={`mt-2 flex w-full items-start justify-center rounded-t-xl pt-2 text-lg font-bold ${heights[r.rank] ?? 'h-12'} ${
              r.rank === 1 ? 'bg-amber-100 text-amber-600' : r.rank === 2 ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-600'
            }`}
          >
            {r.rank}
          </div>
        </div>
      ))}
    </div>
  );
}

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
    return (
      <div className="card flex flex-col items-center gap-2 py-10 text-center">
        <Medal className="h-10 w-10 text-primary/40 animate-float" />
        <p className="text-sm text-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm whitespace-nowrap [&_th]:px-2 [&_td]:px-2 sm:[&_th]:px-3 sm:[&_td]:px-3">
        <thead className="bg-surface-hover text-muted">
          <tr>
            <th className="py-2.5 px-3 text-start font-medium w-14">#</th>
            <th className="py-2.5 px-3 text-start font-medium">الطالب</th>
            {showExams && <th className="py-2.5 px-3 text-center font-medium hidden sm:table-cell">الاختبارات</th>}
            <th className="py-2.5 px-3 text-center font-medium">الصحيحة</th>
            <th className="py-2.5 px-3 text-center font-medium">الوقت</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isMe = r.student_id === currentUserId;
            return (
              <tr
                key={r.student_id}
                className={`border-t border-border transition-colors ${isMe ? 'bg-primary-light/70' : 'hover:bg-surface-hover/60'}`}
              >
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      rankStyle[r.rank] ?? 'bg-surface-hover text-muted'
                    }`}
                  >
                    {r.rank}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                      {(r.full_name || '?').charAt(0)}
                    </span>
                    <span className="font-medium truncate max-w-[9rem] sm:max-w-none">
                      {r.full_name || 'طالب'}
                      {isMe && <span className="ms-1 text-xs text-primary">(أنت)</span>}
                    </span>
                  </div>
                </td>
                {showExams && <td className="py-2.5 px-3 text-center hidden sm:table-cell">{r.exams}</td>}
                <td className="py-2.5 px-3 text-center font-bold">
                  {r.score}
                  <span className="font-normal text-muted"> / {r.total}</span>
                </td>
                <td className="py-2.5 px-3 text-center tabular-nums text-muted" dir="ltr">
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
