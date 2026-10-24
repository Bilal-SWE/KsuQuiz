'use client';

import { Check, X } from 'lucide-react';
import { ImageZoom } from '@/components/ui/image-zoom';
import { GRADIENTS } from '@/components/student/subject-card';

type Props = {
  content: Record<string, any>;
  onAnswer: (optionId: string) => void;
  feedback?: { is_correct: boolean; correct_answer: string } | null;
  disabled?: boolean;
  selectedOption?: string;
  hideStem?: boolean;
};

const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

export function McqQuestion({ content, onAnswer, feedback, disabled, selectedOption, hideStem }: Props) {
  const options = content.options as { id: string; text?: string; image?: string | null }[];

  const state = (optionId: string): 'idle' | 'selected' | 'correct' | 'wrong' | 'dim' => {
    if (!feedback) return selectedOption === optionId ? 'selected' : 'idle';
    if (optionId === feedback.correct_answer) return 'correct';
    if (optionId === selectedOption) return 'wrong';
    return 'dim';
  };

  const cardStyles = {
    idle: 'card-hover',
    selected: 'border-primary ring-4 ring-primary/15',
    correct: 'border-success bg-success-light animate-pop',
    wrong: 'border-error bg-error-light animate-shake',
    dim: 'opacity-55',
  };

  const badge = (s: keyof typeof cardStyles, i: number) => {
    if (s === 'correct') return 'bg-success';
    if (s === 'wrong') return 'bg-error';
    if (s === 'dim') return 'bg-muted/40';
    return `bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`;
  };

  return (
    <div>
      {!hideStem && (
        <div className="mb-5">
          <p className="text-lg font-bold leading-relaxed">{content.question?.text}</p>
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
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white ${badge(s, i)}`}>
                {s === 'correct' ? <Check className="h-5 w-5" /> : s === 'wrong' ? <X className="h-5 w-5" /> : LETTERS[i] ?? i + 1}
              </span>
              <span className="flex-1">
                <span className="font-medium">{option.text}</span>
                {option.image && <ImageZoom src={option.image} className="mt-1" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
