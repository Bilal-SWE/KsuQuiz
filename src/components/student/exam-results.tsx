'use client';

import { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, CircleCheck, CircleX, Clock, Lightbulb, RotateCcw } from 'lucide-react';
import type { LeaderRow, LessonRank } from '@/app/actions/quiz';
import { formatDuration } from '@/lib/format';
import { FillBlanksQuestion } from '@/components/student/questions/fill-blanks';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

type ReviewItem = {
  question_id: string;
  response: any;
  is_correct: boolean | null;
  correct_answer: any;
  explanation: string | null;
  option_explanation: string | null;
};

type Question = {
  id: string;
  type: string;
  content: Record<string, any>;
};

const CONFETTI_COLORS = ['#0F9D8A', '#FFB400', '#2E9E4F', '#3B82F6', '#0B1F33'];

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i % 12) * 0.08,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotate: (i * 47) % 360,
  }));
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, rotate: `${p.rotate}deg` }}
        />
      ))}
    </div>
  );
}

// Score ring that fills up and counts to the score, like the unfinished-practice screen.
function ScoreRing({ score, total, pct }: { score: number; total: number; pct: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (score === 0) return;
    const step = Math.max(1, Math.ceil(score / 12));
    let value = 0;
    const t = setInterval(() => {
      value = Math.min(score, value + step);
      setShown(value);
      if (value >= score) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, [score]);

  const R = 52;
  const C = 2 * Math.PI * R;
  const color = pct >= 70 ? 'stroke-success' : pct >= 50 ? 'stroke-accent' : 'stroke-error';
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={R} fill="none" strokeWidth="10" className="stroke-border" />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - (total ? shown / total : 0))}
          className={`${color} transition-[stroke-dashoffset] duration-300`}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tabular-nums" dir="ltr">
          {shown}/{total}
        </span>
        <span className="text-sm font-bold text-muted tabular-nums">{pct}%</span>
      </span>
    </div>
  );
}

const MEDALS = ['bg-accent text-ink', 'bg-[#D5DDE3] text-ink', 'bg-[#E8B98A] text-ink'];

// The lesson's top five with correct answers and time; the student's own row is
// highlighted, or added below the five when they are not among them.
function TopFive({ rank }: { rank: LessonRank }) {
  const { t } = useI18n();
  const LB = t.leaderboard;
  const showMeBelow = !rank.top.some((r) => r.isMe);

  const Row = ({ r }: { r: LeaderRow }) => (
    <li
      className={`grid grid-cols-[28px_1fr_52px_52px] items-center gap-2 rounded-xl px-2 py-2 text-sm ${
        r.isMe ? 'bg-primary-light font-bold ring-1 ring-primary/30' : ''
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold tabular-nums ${
          MEDALS[r.rank - 1] ?? 'bg-surface-hover text-muted'
        }`}
      >
        {r.rank}
      </span>
      <span dir="auto" className="min-w-0 truncate text-start font-medium">
        {r.name || LB.studentFallback}
        {r.isMe && <span className="ms-1 text-xs text-primary-ink">{LB.you}</span>}
      </span>
      <span className="text-center font-bold tabular-nums" dir="ltr">
        {r.score}/{r.total}
      </span>
      <span className="text-center text-xs text-muted tabular-nums" dir="ltr">
        {formatDuration(r.seconds)}
      </span>
    </li>
  );

  return (
    <div className="rounded-2xl border border-border p-2">
      <div className="grid grid-cols-[28px_1fr_52px_52px] gap-2 px-2 pb-1 text-[11px] font-bold text-muted">
        <span>#</span>
        <span className="text-start">{LB.student}</span>
        <span className="text-center">{LB.correct}</span>
        <span className="text-center">{LB.time}</span>
      </div>
      <ol className="space-y-0.5">
        {rank.top.map((r) => (
          <Row key={r.rank + r.name} r={r} />
        ))}
        {showMeBelow && (
          <>
            <li className="py-0.5 text-center text-xs text-muted" aria-hidden="true">
              ⋯
            </li>
            <Row r={rank.me} />
          </>
        )}
      </ol>
    </div>
  );
}

type Status = 'correct' | 'wrong' | 'unanswered';
const statusOf = (item: ReviewItem): Status =>
  item.response == null ? 'unanswered' : item.is_correct ? 'correct' : 'wrong';

const STATUS_STYLE: Record<Status, { icon: React.ElementType; tile: string; border: string }> = {
  correct: { icon: CircleCheck, tile: 'bg-success-light text-success-ink', border: 'border-s-success' },
  wrong: { icon: CircleX, tile: 'bg-error-light text-error', border: 'border-s-error' },
  unanswered: { icon: Clock, tile: 'bg-surface-hover text-muted', border: 'border-s-border' },
};

export function ExamResults({
  lessonTitle,
  result,
  questions,
  onBack,
  onRetry,
}: {
  lessonTitle: string;
  result: { score: number; total: number; review: ReviewItem[]; rank?: LessonRank | null };
  questions: Question[];
  onBack: () => void;
  onRetry: () => void;
}) {
  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
  const { t } = useI18n();
  const R = t.results;
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [onlyMistakes, setOnlyMistakes] = useState(false);

  const counts = { correct: 0, wrong: 0, unanswered: 0 };
  result.review.forEach((item) => counts[statusOf(item)]++);

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const items = result.review
    .map((item, index) => ({ item, index, q: questions.find((q) => q.id === item.question_id) }))
    .filter(({ item, q }) => q && (!onlyMistakes || statusOf(item) !== 'correct'));

  const answerText = (q: Question, value: any) => {
    if (q.type === 'mcq') return q.content.options?.find((o: any) => o.id === value)?.text ?? value;
    if (q.type === 'true_false') return value ? t.question.true : t.question.false;
    return '';
  };

  return (
    <div className="relative mx-auto flex max-w-xl flex-col gap-4">
      {pct >= 70 && <Confetti />}

      <span dir="auto" className="truncate text-center text-sm font-medium text-muted">
        {lessonTitle}
      </span>

      <section className="card relative flex flex-col items-center gap-4 !rounded-[28px] px-5 py-7 text-center animate-fade-up">
        <ScoreRing score={result.score} total={result.total} pct={pct} />
        <div className="flex flex-wrap justify-center gap-2 text-sm font-bold">
          <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-success-ink">
            <CircleCheck className="h-4 w-4" />
            {fmt(R.correctCount, { n: counts.correct })}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-error-light px-3 py-1 text-error">
            <CircleX className="h-4 w-4" />
            {fmt(R.wrongCount, { n: counts.wrong })}
          </span>
          {counts.unanswered > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-hover px-3 py-1 text-muted">
              <Clock className="h-4 w-4" />
              {fmt(R.unansweredCount, { n: counts.unanswered })}
            </span>
          )}
        </div>

        {result.rank && (
          <div className="w-full border-t border-border pt-4">
            <p className="mb-2 text-start text-sm font-bold">{R.rankTitle}</p>
            <TopFive rank={result.rank} />
            {!result.rank.countsThisAttempt && <p className="mt-2 text-xs text-muted">{R.rankBestOnly}</p>}
          </div>
        )}
      </section>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="press flex h-11 max-w-44 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-border bg-surface text-base font-bold text-ink hover:border-ink sm:h-12"
        >
          <BookOpen className="h-5 w-5" />
          {R.backToLessons}
        </button>
        <button
          type="button"
          onClick={onRetry}
          className="press flex h-11 max-w-44 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-base font-extrabold text-on-primary hover:bg-primary-hover sm:h-12"
        >
          <RotateCcw className="h-5 w-5" />
          {R.retry}
        </button>
      </div>

      <section className="mt-2 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{R.reviewTitle}</h2>
          {counts.wrong + counts.unanswered > 0 && (
            <div className="flex gap-1 rounded-full bg-surface-hover p-1 text-xs font-bold" role="tablist">
              {[
                { on: false, label: R.filterAll },
                { on: true, label: R.filterMistakes },
              ].map((f) => (
                <button
                  key={f.label}
                  type="button"
                  role="tab"
                  aria-selected={onlyMistakes === f.on}
                  onClick={() => setOnlyMistakes(f.on)}
                  className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${onlyMistakes === f.on ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {items.map(({ item, index, q }) => {
          const status = statusOf(item);
          const style = STATUS_STYLE[status];
          const open = openIds.has(item.question_id);
          return (
            <div key={item.question_id} className={`card overflow-hidden !rounded-2xl border-s-4 ${style.border}`}>
              <button
                type="button"
                onClick={() => toggle(item.question_id)}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center gap-3 p-3 text-start hover:bg-surface-hover"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.tile}`}>
                  <style.icon className="h-[18px] w-[18px]" aria-label={R[status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : 'unanswered']} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-muted">{fmt(R.questionN, { n: index + 1 })}</span>
                  <bdi className="line-clamp-2 block text-sm font-bold">{q!.content.question?.text}</bdi>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>

              {open && (
                <div className="space-y-2 border-t border-border px-4 py-3 text-sm animate-fade-up">
                  {(q!.type === 'mcq' || q!.type === 'true_false') && (
                    <>
                      <p className={status === 'correct' ? 'text-success-ink' : status === 'wrong' ? 'text-error' : 'text-muted'}>
                        {status === 'unanswered' ? R.noAnswer : `${R.yourAnswer} ${answerText(q!, item.response)}`}
                      </p>
                      {status !== 'correct' && (
                        <p className="font-bold text-success-ink">
                          {R.correctAnswer} {answerText(q!, item.correct_answer)}
                        </p>
                      )}
                    </>
                  )}

                  {q!.type === 'fill_blanks' && (
                    <FillBlanksQuestion
                      content={{ ...q!.content, question: undefined }}
                      feedback={{ is_correct: !!item.is_correct, correct_answer: item.correct_answer ?? {} }}
                      disabled
                      savedResponse={item.response}
                    />
                  )}

                  {(item.explanation || item.option_explanation) && (
                    <div className="flex gap-2 rounded-xl bg-accent-light/60 p-3 text-foreground/85">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                      <div className="space-y-1">
                        {item.option_explanation && <p dir="auto">{item.option_explanation}</p>}
                        {item.explanation && <p dir="auto">{item.explanation}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
