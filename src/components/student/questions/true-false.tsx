'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { ImageZoom } from '@/components/ui/image-zoom';

type Props = {
  content: Record<string, any>;
  onAnswer: (value: boolean) => void;
  feedback?: { is_correct: boolean; correct_answer: boolean } | null;
  disabled?: boolean;
  selectedValue?: boolean;
  hideStem?: boolean;
};

export function TrueFalseQuestion({ content, onAnswer, feedback, disabled, selectedValue, hideStem }: Props) {
  const getStyle = (value: boolean) => {
    if (!feedback) return selectedValue === value ? 'border-primary ring-4 ring-primary/15' : 'card-hover';
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
          { value: true, label: 'صح', icon: ThumbsUp, tint: 'from-emerald-500 to-teal-500' },
          { value: false, label: 'خطأ', icon: ThumbsDown, tint: 'from-orange-400 to-rose-500' },
        ].map(({ value, label, icon: Icon, tint }) => (
          <button
            key={String(value)}
            onClick={() => !disabled && onAnswer(value)}
            disabled={disabled}
            className={`card flex flex-col items-center gap-3 p-5 font-bold transition duration-200 press ${getStyle(value)} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tint} text-white shadow-md`}>
              <Icon className="h-7 w-7" />
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
