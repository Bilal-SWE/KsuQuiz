'use client';

import { Check, X } from 'lucide-react';
import { useI18n } from '@/i18n/client';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dim';

const styles: Record<OptionState, string> = {
  idle: 'border-border bg-surface hover:border-primary',
  selected: 'border-primary bg-primary-light',
  correct: 'border-success bg-success-light font-bold animate-pop',
  wrong: 'border-error bg-error-light animate-shake',
  dim: 'border-border bg-surface opacity-60',
};

const layouts = {
  row: 'min-h-10 w-full justify-between gap-2 rounded-xl px-3 py-2 text-start text-sm sm:min-h-12 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-2.5 sm:text-lg',
  tile: 'aspect-square max-h-24 w-full flex-col justify-center gap-1 rounded-2xl p-2 text-center text-base sm:max-h-28 sm:gap-1.5 sm:rounded-3xl sm:text-lg',
};

// One answer, as in the Question design: a full-width row, or a square tile for true/false.
export function AnswerOption({
  state,
  disabled,
  onClick,
  layout = 'row',
  icon,
  children,
}: {
  state: OptionState;
  disabled?: boolean;
  onClick: () => void;
  layout?: keyof typeof layouts;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const Q = useI18n().t.question;
  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      aria-pressed={state === 'selected'}
      className={`press flex items-center border-2 font-semibold text-ink transition ${layouts[layout]} ${styles[state]} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {icon}
      <span className={layout === 'row' ? 'flex-1' : ''}>{children}</span>
      {state === 'correct' && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-success-ink sm:text-sm">
          <Check className="h-4 w-4" strokeWidth={3} />
          {Q.correctMark}
        </span>
      )}
      {state === 'wrong' && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-error sm:text-sm">
          <X className="h-4 w-4" strokeWidth={3} />
          {Q.wrongMark}
        </span>
      )}
    </button>
  );
}
