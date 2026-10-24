'use client';

import { Check, X } from 'lucide-react';
import { ImageZoom } from '@/components/ui/image-zoom';
import { FILLS } from '@/components/student/subject-card';
import { useI18n } from '@/i18n/client';

type Props = {
  content: Record<string, any>;
  onAnswer: (optionId: string) => void;
  feedback?: { is_correct: boolean; correct_answer: string } | null;
  disabled?: boolean;
  selectedOption?: string;
  hideStem?: boolean;
};

export function McqQuestion({ content, onAnswer, feedback, disabled, selectedOption, hideStem }: Props) {
  const LETTERS = useI18n().t.question.letters;
  const options = content.options as { id: string; text?: string; image?: string | null }[];

  const state = (optionId: string): 'idle' | 'selected' | 'correct' | 'wrong' | 'dim' => {
    if (!feedback) return selectedOption === optionId ? 'selected' : 'idle';
    if (optionId === feedback.correct_answer) return 'correct';
    if (optionId === selectedOption) return 'wrong';
    return 'dim';
  };

  const cardStyles = {
    idle: 'card-hover',
    selected: 'border-sky ring-4 ring-sky/20',
    correct: 'border-success bg-success-light animate-pop',
    wrong: 'border-error bg-error-light animate-shake',
    dim: 'opacity-55',
  };

  const badge = (s: keyof typeof cardStyles, i: number) => {
    if (s === 'correct') return 'bg-success text-ink';
    if (s === 'wrong') return 'bg-error text-white';
    if (s === 'dim') return 'bg-surface-hover text-muted';
    if (s === 'selected') return 'bg-sky text-ink';
    return FILLS[i % FILLS.length];
  };

  return (
    <div>
      {!hideStem && (
        <div className="mb-5">
          <p dir="auto" className="text-lg font-bold leading-relaxed">
            {content.question?.text}
          </p>
          {content.question?.image && <ImageZoom src={content.question.image} className="mt-3" />}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 stagger">
        {options.map((option, i) => {
          const s = state(option.id);
          return (
            <button
              key={option.id}
              onClick={() => !disabled && onAnswer(option.id)}
              disabled={disabled}
              className={`card flex w-full items-center gap-3 p-3 text-start transition duration-200 press ${cardStyles[s]} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold ${badge(s, i)}`}>
                {s === 'correct' ? <Check className="h-5 w-5" /> : s === 'wrong' ? <X className="h-5 w-5" /> : LETTERS[i] ?? i + 1}
              </span>
              <span className="flex-1">
                <span dir="auto" className="font-medium">
                  {option.text}
                </span>
                {option.image && <ImageZoom src={option.image} className="mt-1" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
