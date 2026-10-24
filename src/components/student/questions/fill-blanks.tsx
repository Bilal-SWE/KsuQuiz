'use client';

import { useState } from 'react';
import { ImageZoom } from '@/components/ui/image-zoom';
import { Button } from '@/components/ui/button';
import type { FillItem, FillWord } from '@/lib/fill-blanks';
import { useI18n } from '@/i18n/client';

type Props = {
  content: Record<string, any>;
  onAnswer?: (response: Record<string, string>) => void;
  feedback?: { is_correct: boolean; correct_answer: Record<string, string> } | null;
  disabled?: boolean;
  savedResponse?: Record<string, string>;
};

export function FillBlanksQuestion({ content, onAnswer, feedback, disabled, savedResponse }: Props) {
  const Q = useI18n().t.question;
  const items = (content.items ?? []) as FillItem[];
  const words = (content.words ?? []) as FillWord[];
  const blankIds = items.flatMap((it) => it.segments.filter((s) => s.type === 'blank').map((s) => (s as { id: string }).id));

  const [filled, setFilled] = useState<Record<string, string>>(savedResponse ?? {});
  const [active, setActive] = useState<string | null>(() => blankIds.find((id) => !savedResponse?.[id]) ?? null);

  const textById = new Map(words.map((w) => [w.id, w.text]));
  const usedWordIds = new Set(Object.values(filled));
  const allFilled = blankIds.length > 0 && blankIds.every((id) => filled[id]);
  const changed = JSON.stringify(filled) !== JSON.stringify(savedResponse ?? {});

  const pickWord = (wordId: string) => {
    if (disabled || usedWordIds.has(wordId)) return;
    const target = active ?? blankIds.find((id) => !filled[id]);
    if (!target) return;
    const next = { ...filled, [target]: wordId };
    setFilled(next);
    setActive(blankIds.find((id) => !next[id]) ?? null);
  };

  const clickBlank = (blankId: string) => {
    if (disabled) return;
    if (filled[blankId]) {
      const next = { ...filled };
      delete next[blankId];
      setFilled(next);
    }
    setActive(blankId);
  };

  const blankStyle = (blankId: string) => {
    if (feedback) {
      return textById.get(filled[blankId]) === feedback.correct_answer?.[blankId]
        ? 'border-success bg-success-light text-success-ink animate-pop'
        : 'border-error bg-error-light text-error animate-shake';
    }
    if (active === blankId) return 'border-sky bg-sky/10 ring-4 ring-sky/20';
    if (filled[blankId]) return 'border-sky bg-surface text-ink animate-pop';
    return 'border-dashed border-muted/40 text-muted hover:border-sky';
  };

  return (
    <div>
      {content.question?.text && (
        <div className="mb-4">
          <p dir="auto" className="text-lg font-bold leading-relaxed">
            {content.question.text}
          </p>
          {content.question?.image && <ImageZoom src={content.question.image} className="mt-3" />}
        </div>
      )}

      <div className="mb-5 overflow-hidden rounded-2xl border-2 border-primary/15">
        <div className="bg-primary-light px-3 py-2 text-xs font-bold text-primary-ink">{Q.wordBank}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {words.map((w) => {
            const used = usedWordIds.has(w.id);
            return (
              <button
                key={w.id}
                onClick={() => pickWord(w.id)}
                disabled={disabled || used}
                className={`border-t border-s border-primary/10 px-3 py-3 text-sm font-medium transition press ${
                  used ? 'text-muted line-through opacity-40' : disabled ? '' : 'hover:bg-primary hover:text-ink cursor-pointer'
                }`}
              >
                <span dir="auto">{w.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ol className="space-y-3">
        {items.map((item, index) => (
          <li key={item.id} dir="auto" className="flex gap-2 text-sm leading-9">
            <span className="text-muted">{index + 1}.</span>
            <span>
              {item.segments.map((seg, i) =>
                seg.type === 'text' ? (
                  <span key={i}>{seg.value}</span>
                ) : (
                  <span key={i} className="inline-flex items-baseline gap-1">
                    <button
                      onClick={() => clickBlank(seg.id)}
                      disabled={disabled}
                      className={`mx-1 inline-block min-w-20 rounded-md border-2 px-2 leading-7 text-center font-medium transition-colors ${blankStyle(seg.id)} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {textById.get(filled[seg.id]) ?? ' '}
                    </button>
                    {feedback && textById.get(filled[seg.id]) !== feedback.correct_answer?.[seg.id] && (
                      <span className="text-xs text-green-700">({feedback.correct_answer?.[seg.id]})</span>
                    )}
                  </span>
                ),
              )}
            </span>
          </li>
        ))}
      </ol>

      {!disabled && onAnswer && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {allFilled ? Q.reviewThenConfirm : Q.pickBlank}
          </p>
          {allFilled && changed && (
            <Button onClick={() => onAnswer(filled)} className="text-sm">
              {Q.confirmAnswer}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
