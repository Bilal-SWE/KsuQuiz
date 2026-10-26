'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CircleCheck, CircleX, RotateCcw, X } from 'lucide-react';
import { AnswerOption, type OptionState } from '@/components/student/questions/answer-option';
import { fmt } from '@/i18n/format';
import type { LandingContent } from '@/app/welcome/content';

// A short playable quiz on the landing page, graded in the browser.
export function DemoQuiz({ d }: { d: LandingContent['demo'] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = d.questions[index];
  const total = d.questions.length;
  const answered = picked !== null;
  const isRight = answered && picked === q.correct;

  const choose = (value: number | boolean) => {
    if (answered) return;
    setPicked(value);
    if (value === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const stateFor = (value: number | boolean): OptionState => {
    if (!answered) return 'idle';
    if (value === q.correct) return 'correct';
    if (value === picked) return 'wrong';
    return 'dim';
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[28px] bg-ink p-6 text-center text-background shadow-[0_24px_48px_rgb(11_31_51/0.2)] animate-pop sm:p-8">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-extrabold text-on-primary tabular-nums" dir="ltr">
          {score}/{total}
        </span>
        <div>
          <h3 className="text-xl font-extrabold sm:text-2xl">{d.doneTitle}</h3>
          <p className="mt-1 text-sm text-on-ink-muted">{fmt(d.doneScore, { s: score, n: total })}</p>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-on-ink-muted">{d.doneText}</p>
        <div className="flex w-full max-w-sm flex-col gap-2.5">
          <Link
            href="/auth/signup"
            className="press rounded-full bg-primary px-5 py-3 text-base font-extrabold text-on-primary hover:bg-primary-hover"
          >
            {d.signup}
          </Link>
          <button
            type="button"
            onClick={restart}
            className="press inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-on-ink-muted/50 px-5 py-2.5 text-sm font-bold hover:bg-ink-raised"
          >
            <RotateCcw className="h-4 w-4" />
            {d.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-[28px] bg-surface p-4 shadow-[0_24px_48px_rgb(11_31_51/0.12)] sm:gap-4 sm:p-6">
      <div className="flex items-center justify-between text-xs font-bold text-muted sm:text-sm">
        <span className="rounded-full bg-accent-light px-3 py-1 text-accent-ink">{d.label}</span>
        <span>{fmt(d.of, { i: index + 1, n: total })}</span>
      </div>

      <div className="flex justify-center gap-1.5" aria-hidden="true">
        {d.questions.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-primary' : i < index ? 'w-4 bg-primary/40' : 'w-4 bg-border'}`}
          />
        ))}
      </div>

      <div key={index} className="flex flex-col gap-3 animate-fade-up">
        <h3 className="rounded-2xl bg-ink px-4 py-3 text-base font-extrabold leading-relaxed text-background sm:text-lg">{q.text}</h3>

        {q.kind === 'mcq' ? (
          <div className="flex flex-col gap-2">
            {q.options.map((o, i) => (
              <AnswerOption key={o} state={stateFor(i)} disabled={answered} onClick={() => choose(i)}>
                {o}
              </AnswerOption>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {[true, false].map((v) => (
              <AnswerOption
                key={String(v)}
                layout="tile"
                state={stateFor(v)}
                disabled={answered}
                onClick={() => choose(v)}
                icon={
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${v ? 'bg-success-light text-success-ink' : 'bg-error-light text-error'}`}>
                    {v ? <Check className="h-4 w-4" strokeWidth={3} /> : <X className="h-4 w-4" strokeWidth={3} />}
                  </span>
                }
              >
                {v ? d.true : d.false}
              </AnswerOption>
            ))}
          </div>
        )}

        {answered && (
          <div
            className={`flex gap-2 rounded-xl px-3 py-2 text-[13px] leading-snug animate-slide-in sm:text-sm ${isRight ? 'bg-success-light' : 'bg-error-light'}`}
            role="status"
          >
            {isRight ? <CircleCheck className="mt-px h-4 w-4 shrink-0 text-success-ink" /> : <CircleX className="mt-px h-4 w-4 shrink-0 text-error" />}
            <p className="text-foreground/85">
              <span className={`font-bold ${isRight ? 'text-success-ink' : 'text-error'}`}>{isRight ? d.correct : d.wrong}.</span> {q.why}
            </p>
          </div>
        )}

        {answered && (
          <button
            type="button"
            onClick={next}
            className="press mx-auto inline-flex h-11 w-full max-w-56 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-base font-extrabold text-on-primary hover:bg-primary-hover animate-fade-up"
          >
            {index + 1 >= total ? d.finish : d.next}
            <ArrowLeft className="h-5 w-5 ltr:-scale-x-100" />
          </button>
        )}
      </div>
    </div>
  );
}
