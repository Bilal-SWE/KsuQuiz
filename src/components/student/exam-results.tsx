'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CircleCheck, CircleX, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const CONFETTI_COLORS = ['#FF5A36', '#FFC93C', '#2EC4A0', '#4C8DFF', '#1B1B2F'];

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

function ScoreRing({ pct }: { pct: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const r = 52;
  const c = 2 * Math.PI * r;
  const color = pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)';
  const textColor = pct >= 70 ? 'var(--success-ink)' : pct >= 50 ? 'var(--warning-ink)' : 'var(--error)';

  return (
    <div className="relative h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--surface-hover)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * shown) / 100}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: textColor }}>
          {pct}%
        </span>
      </div>
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

      <section className="card relative flex flex-col items-center px-6 py-8 text-center animate-fade-up">
        <p className="text-sm text-muted">{lessonTitle}</p>
        <div className="my-4">
          <ScoreRing pct={pct} />
        </div>
        <h1 className="text-2xl font-bold">{v.title}</h1>
        <p className="mt-1 text-sm text-muted">{v.sub}</p>

        <div className="mt-5 grid w-full max-w-xs grid-cols-2 gap-3">
          <div className="rounded-2xl bg-success-light p-3 text-success-ink">
            <p className="text-2xl font-bold">{result.score}</p>
            <p className="text-xs font-medium">{R.correct}</p>
          </div>
          <div className="rounded-2xl bg-error-light p-3 text-error">
            <p className="text-2xl font-bold">{wrong}</p>
            <p className="text-xs font-medium">{R.wrong}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={onRetry} className="px-5">
            <RotateCcw className="h-4 w-4" />
            {R.retry}
          </Button>
          <Button variant="secondary" onClick={onBack}>
            <ArrowRight className="h-4 w-4 ltr:-scale-x-100" />
            {R.backToLessons}
          </Button>
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
                      {R.yourAnswer} {q.content.options?.find((o: any) => o.id === item.response)?.text ?? item.response}
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
                      {R.yourAnswer} {item.response ? t.question.true : t.question.false}
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

                {q.type === 'matching' && !item.is_correct && (
                  <p className="ms-7 text-sm text-error">{R.someMatchesWrong}</p>
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
