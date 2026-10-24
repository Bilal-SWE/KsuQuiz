'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { ImageZoom } from '@/components/ui/image-zoom';
import { useI18n } from '@/i18n/client';

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
  const getStyle = (value: boolean) => {
    if (!feedback) return selectedValue === value ? 'border-sky ring-4 ring-sky/20' : 'card-hover';
    if (value === feedback.correct_answer) return 'border-success bg-success-light animate-pop';
    if (value === selectedValue && !feedback.is_correct) return 'border-error bg-error-light animate-shake';
    return 'opacity-55';
  };

  return (
    <div>
      {!hideStem && (
        <div className="mb-5">
          <p className="text-lg font-bold leading-relaxed">{content.question?.text}</p>
          {content.question?.image && <ImageZoom src={content.question.image} className="mt-3" />}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 stagger">
        {[
          { value: true, label: t.question.true, icon: ThumbsUp, tint: 'bg-success text-ink' },
          { value: false, label: t.question.false, icon: ThumbsDown, tint: 'bg-error text-white' },
        ].map(({ value, label, icon: Icon, tint }) => (
          <button
            key={String(value)}
            onClick={() => !disabled && onAnswer(value)}
            disabled={disabled}
            className={`card flex flex-col items-center gap-3 p-5 font-bold transition duration-200 press ${getStyle(value)} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tint} shadow-md`}>
              <Icon className="h-7 w-7" />
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
