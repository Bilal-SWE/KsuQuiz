'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CircleCheck, CircleX, Lightbulb, RotateCcw } from 'lucide-react';
import { FillBlanksQuestion } from '@/components/student/questions/fill-blanks';
import { useI18n } from '@/i18n/client';

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

// The Result design's teal score disc: "8/10" over "correct answers".
function ScoreCircle({ score, total, label }: { score: number; total: number; label: string }) {
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

  return (
    <div className="flex h-[168px] w-[168px] flex-col items-center justify-center rounded-full bg-primary text-on-primary animate-pop">
      <span className="text-[56px] font-extrabold leading-none tabular-nums" dir="ltr">
        {shown}/{total}
      </span>
      <span className="mt-1 text-base font-bold">{label}</span>
    </div>
  );
}

function verdictKey(pct: number) {
  if (pct === 100) return 'perfect' as const;
  if (pct >= 85) return 'excellent' as const;
  if (pct >= 70) return 'good' as const;
  if (pct >= 50) return 'fair' as const;
  return 'low' as const;
}

export function ExamResults({
  lessonTitle,
  result,
  questions,
  onBack,
  onRetry,
}: {
  lessonTitle: string;
  result: { score: number; total: number; review: ReviewItem[] };
  questions: Question[];
  onBack: () => void;
  onRetry: () => void;
}) {
  const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
  const { t } = useI18n();
  const R = t.results;
  const v = R.verdicts[verdictKey(pct)];
  const wrong = result.total - result.score;

  return (
    <div className="relative max-w-2xl mx-auto space-y-6">
      {pct >= 70 && <Confetti />}

      <section className="relative flex flex-col items-center gap-6 rounded-[28px] bg-ink px-6 pt-10 pb-7 text-center text-background animate-fade-up">
        <p dir="auto" className="text-sm font-bold text-on-ink-muted">
          {lessonTitle}
        </p>
        <ScoreCircle score={result.score} total={result.total} label={R.correctAnswers} />
        <div className="flex flex-col gap-2">
          <h1 className="text-[34px] font-extrabold">{v.title}</h1>
          <p className="text-lg text-on-ink-muted">{v.sub}</p>
        </div>

        <div className="flex w-full max-w-sm gap-3">
          <div className="flex-1 rounded-[20px] bg-ink-raised p-4">
            <div className="text-[26px] font-extrabold tabular-nums">{pct}%</div>
            <div className="text-sm text-on-ink-muted">{t.leaderboard.accuracy}</div>
          </div>
          <div className="flex-1 rounded-[20px] bg-ink-raised p-4">
            <div className="text-[26px] font-extrabold tabular-nums">{wrong}</div>
            <div className="text-sm text-on-ink-muted">{R.wrong}</div>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="press flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-4 py-4 text-[19px] font-extrabold text-on-primary hover:bg-primary-hover"
          >
            <RotateCcw className="h-5 w-5" />
            {R.retry}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="press flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-on-ink-muted px-4 py-3.5 text-lg font-bold text-background hover:bg-ink-raised"
          >
            <ArrowRight className="h-5 w-5 ltr:-scale-x-100" />
            {R.backToLessons}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">{R.reviewTitle}</h2>
        <div className="space-y-3 stagger">
          {result.review.map((item, index) => {
            const q = questions.find((q) => q.id === item.question_id);
            if (!q) return null;
            return (
              <div
                key={item.question_id}
                className={`card border-s-4 p-4 ${item.is_correct ? 'border-s-success' : 'border-s-error'}`}
              >
                <div className="mb-2 flex items-start gap-2">
                  {item.is_correct ? (
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success-ink" />
                  ) : (
                    <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-error" />
                  )}
                  <p className="text-sm font-bold">
                    <span className="text-muted">{index + 1}. </span>
                    <bdi>{q.content.question?.text}</bdi>
                  </p>
                </div>

                {q.type === 'mcq' && (
                  <div className="ms-7 space-y-1 text-sm">
                    <p className={item.is_correct ? 'text-success-ink' : 'text-error'}>
                      {item.response == null
                        ? R.noAnswer
                        : `${R.yourAnswer} ${q.content.options?.find((o: any) => o.id === item.response)?.text ?? item.response}`}
                    </p>
                    {!item.is_correct && (
                      <p className="text-success-ink">
                        {R.correctAnswer} {q.content.options?.find((o: any) => o.id === item.correct_answer)?.text ?? item.correct_answer}
                      </p>
                    )}
                  </div>
                )}

                {q.type === 'true_false' && (
                  <div className="ms-7 space-y-1 text-sm">
                    <p className={item.is_correct ? 'text-success-ink' : 'text-error'}>
                      {item.response == null
                        ? R.noAnswer
                        : `${R.yourAnswer} ${item.response ? t.question.true : t.question.false}`}
                    </p>
                    {!item.is_correct && (
                      <p className="text-success-ink">
                        {R.correctAnswer} {item.correct_answer ? t.question.true : t.question.false}
                      </p>
                    )}
                  </div>
                )}

                {q.type === 'fill_blanks' && (
                  <div className="ms-7 mt-2">
                    <FillBlanksQuestion
                      content={{ ...q.content, question: undefined }}
                      feedback={{ is_correct: !!item.is_correct, correct_answer: item.correct_answer ?? {} }}
                      disabled
                      savedResponse={item.response}
                    />
                  </div>
                )}

                {(item.explanation || item.option_explanation) && (
                  <div className="ms-7 mt-3 flex gap-2 rounded-xl bg-warning-light/60 p-3 text-sm text-foreground/80">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning-ink" />
                    <div className="space-y-1">
                      {item.option_explanation && <p dir="auto">{item.option_explanation}</p>}
                      {item.explanation && <p dir="auto">{item.explanation}</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
