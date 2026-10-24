'use client';

import { Crown, Medal } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { formatDuration } from '@/lib/format';

export type LeaderboardRow = {
  rank: number;
  student_id: string;
  full_name: string;
  score: number;
  total: number;
  seconds: number;
  exams?: number;
};

const rankStyle: Record<number, string> = {
  1: 'bg-accent text-ink',
  2: 'bg-sky text-ink',
  3: 'bg-primary text-ink',
};

export function Podium({ rows, currentUserId }: { rows: LeaderboardRow[]; currentUserId: string }) {
  const B = useI18n().t.leaderboard;
  const order = [rows[1], rows[0], rows[2]].filter(Boolean);
  const heights: Record<number, string> = { 1: 'h-28', 2: 'h-20', 3: 'h-16' };

  return (
    <div className="card flex items-end justify-center gap-3 px-4 pt-6 pb-0 sm:gap-6 animate-fade-up">
      {order.map((r) => (
        <div key={r.student_id} className="flex w-24 flex-col items-center sm:w-28">
          {r.rank === 1 && <Crown className="mb-1 h-6 w-6 text-accent animate-float" />}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold shadow-lg ring-4 ring-surface ${rankStyle[r.rank] ?? 'bg-primary-light text-primary-ink'}`}
          >
            {(r.full_name || '?').charAt(0)}
          </div>
          <p className={`mt-2 w-full truncate text-center text-sm font-bold ${r.student_id === currentUserId ? 'text-primary-ink' : ''}`}>
            <bdi>{r.full_name || B.studentFallback}</bdi>
          </p>
          <p className="text-xs text-muted">
            {r.score} / {r.total}
          </p>
          <div
            className={`mt-2 flex w-full items-start justify-center rounded-t-xl pt-2 text-lg font-bold ${heights[r.rank] ?? 'h-12'} ${
              r.rank === 1 ? 'bg-accent-light text-accent-ink' : r.rank === 2 ? 'bg-sky/15 text-ink' : 'bg-primary-light text-primary-ink'
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
  const B = useI18n().t.leaderboard;
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
            <th className="py-2.5 px-3 text-start font-medium">{B.student}</th>
            {showExams && <th className="py-2.5 px-3 text-center font-medium hidden sm:table-cell">{B.exams}</th>}
            <th className="py-2.5 px-3 text-center font-medium">{B.correct}</th>
            <th className="py-2.5 px-3 text-center font-medium">{B.time}</th>
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
                    <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-ink">
                      {(r.full_name || '?').charAt(0)}
                    </span>
                    <span className="font-medium truncate max-w-[9rem] sm:max-w-none">
                      <bdi>{r.full_name || B.studentFallback}</bdi>
                      {isMe && <span className="ms-1 text-xs text-primary-ink">{B.you}</span>}
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
