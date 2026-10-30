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
  attempts?: number;
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
          <p dir="auto" className={`mt-2 w-full truncate text-center text-sm font-bold ${r.student_id === currentUserId ? 'text-primary-ink' : ''}`}>
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
            <th className="py-2.5 px-3 text-start font-medium w-14 border-e border-border">#</th>
            <th className="py-2.5 px-3 text-start font-medium border-e border-border">{B.student}</th>
            {showExams && <th className="py-2.5 px-3 text-center font-medium hidden sm:table-cell border-e border-border">{B.exams}</th>}
            <th className="py-2.5 px-3 text-center font-medium border-e border-border">{B.correct}</th>
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
                <td className="py-2.5 px-3 border-e border-border">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      r.rank === 0 ? 'bg-surface-hover text-muted/40' : (rankStyle[r.rank] ?? 'bg-surface-hover text-muted')
                    }`}
                  >
                    {r.rank === 0 ? '–' : r.rank}
                  </span>
                </td>
                <td className="py-2.5 px-3 border-e border-border">
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-ink">
                      {(r.full_name || '?').charAt(0)}
                    </span>
                    <span className="font-medium truncate max-w-[9rem] sm:max-w-none" dir="auto">
                      <bdi>{r.full_name || B.studentFallback}</bdi>
                      {isMe && <span className="ms-1 text-xs text-primary-ink">{B.you}</span>}
                    </span>
                  </div>
                </td>
                {showExams && <td className="py-2.5 px-3 text-center hidden sm:table-cell border-e border-border">{r.rank === 0 ? '–' : r.exams}</td>}
                <td className={`py-2.5 px-3 text-center border-e border-border ${r.rank === 0 ? 'text-muted/40' : 'font-bold'}`}>
                  {r.rank === 0 ? '–' : <>{r.score}<span className="font-normal text-muted"> / {r.total}</span></>}
                </td>
                <td className={`py-2.5 px-3 text-center tabular-nums ${r.rank === 0 ? 'text-muted/40' : 'text-muted'}`} dir="ltr">
                  {r.rank === 0 ? '–' : formatDuration(r.seconds)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const MEDALS: Record<number, string> = {
  1: 'bg-accent text-ink',
  2: 'bg-[#D5DDE3] text-ink',
  3: 'bg-[#E8B98A] text-ink',
};

// Card-style ranking for one lesson: rank, initial, name, correct answers, and time per row.
export function RankingList({ rows, currentUserId, emptyText }: { rows: LeaderboardRow[]; currentUserId: string; emptyText: string }) {
  const B = useI18n().t.leaderboard;
  if (rows.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 !rounded-3xl py-10 text-center">
        <Medal className="h-10 w-10 text-primary/40 animate-float" />
        <p className="text-sm text-muted">{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="card !rounded-3xl p-2">
      <div className="grid grid-cols-[32px_1fr_40px_56px_56px] gap-2 px-3 pt-1 pb-2 text-[11px] font-bold text-muted">
        <span>#</span>
        <span className="text-start">{B.student}</span>
        <span className="text-center">{B.attempts}</span>
        <span className="text-center">{B.correct}</span>
        <span className="text-center">{B.time}</span>
      </div>
      <ol className="space-y-1">
        {rows.map((r) => {
          const isMe = r.student_id === currentUserId;
          return (
            <li
              key={r.student_id}
              className={`grid grid-cols-[32px_1fr_40px_56px_56px] items-center gap-2 rounded-2xl px-3 py-2.5 text-sm ${
                isMe ? 'bg-primary-light ring-1 ring-primary/30' : 'odd:bg-surface-hover/50'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold tabular-nums ${
                  r.rank === 0 ? 'bg-surface text-muted/40 ring-1 ring-border/50' : (MEDALS[r.rank] ?? 'bg-surface text-muted ring-1 ring-border')
                }`}
              >
                {r.rank === 0 ? '–' : r.rank}
              </span>
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-primary-ink ring-1 ring-border">
                  {(r.full_name || '?').charAt(0)}
                </span>
                <span dir="auto" className={`min-w-0 truncate ${isMe ? 'font-extrabold' : 'font-medium'}`}>
                  <bdi>{r.full_name || B.studentFallback}</bdi>
                  {isMe && <span className="ms-1 text-xs font-bold text-primary-ink">{B.you}</span>}
                </span>
              </span>
              <span className="text-center text-xs text-muted tabular-nums" dir="ltr">
                {r.attempts || '–'}
              </span>
              <span className={`text-center tabular-nums ${r.rank === 0 ? 'text-muted/40' : 'font-bold'}`} dir="ltr">
                {r.rank === 0 ? '–' : `${r.score}/${r.total}`}
              </span>
              <span className={`text-center text-xs tabular-nums ${r.rank === 0 ? 'text-muted/40' : 'text-muted'}`} dir="ltr">
                {r.rank === 0 ? '–' : formatDuration(r.seconds)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
