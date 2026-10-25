'use client';

import { Check, X } from 'lucide-react';
import { ImageZoom } from '@/components/ui/image-zoom';
import { useI18n } from '@/i18n/client';
import { AnswerOption, type OptionState } from '@/components/student/questions/answer-option';

type Props = {
  content: Record<string, any>;
  onAnswer: (value: boolean) => void;
  feedback?: { is_correct: boolean; correct_answer: boolean } | null;
  disabled?: boolean;
  selectedValue?: boolean;
  hideStem?: boolean;
};

export function TrueFalseQuestion({ content, onAnswer, feedback, disabled, selectedValue, hideStem }: Props) {
  const { t } = useI18n();

  const state = (value: boolean): OptionState => {
    if (!feedback) return selectedValue === value ? 'selected' : 'idle';
    if (value === feedback.correct_answer) return 'correct';
    if (value === selectedValue) return 'wrong';
    return 'dim';
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

      <div className="grid grid-cols-2 gap-2 stagger sm:gap-3">
        {[
          { value: true, label: t.question.true, Icon: Check, tint: 'bg-success-light text-success-ink' },
          { value: false, label: t.question.false, Icon: X, tint: 'bg-error-light text-error' },
        ].map(({ value, label, Icon, tint }) => (
          <AnswerOption
            key={String(value)}
            layout="tile"
            state={state(value)}
            disabled={disabled}
            onClick={() => onAnswer(value)}
            icon={
              <span className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 ${tint}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
              </span>
            }
          >
            {label}
          </AnswerOption>
        ))}
      </div>
    </div>
  );
}
