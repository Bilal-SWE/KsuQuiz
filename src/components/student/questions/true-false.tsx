'use client';

import { ImageZoom } from '@/components/ui/image-zoom';

type Props = {
  content: Record<string, any>;
  onAnswer: (value: boolean) => void;
  feedback?: { is_correct: boolean; correct_answer: boolean } | null;
  disabled?: boolean;
  selectedValue?: boolean;
};

export function TrueFalseQuestion({ content, onAnswer, feedback, disabled, selectedValue }: Props) {
  const getStyle = (value: boolean) => {
    if (!feedback) {
      return selectedValue === value
        ? 'border-primary bg-primary-light'
        : 'border-border hover:border-primary/50';
    }
    if (value === feedback.correct_answer) return 'border-green-500 bg-green-50';
    if (value === selectedValue && !feedback.is_correct) return 'border-red-500 bg-red-50';
    return 'border-border opacity-60';
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-base font-medium">{content.question?.text}</p>
        {content.question?.image && <ImageZoom src={content.question.image} className="mt-2" />}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { value: true, label: 'صح' },
          { value: false, label: 'خطأ' },
        ].map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => !disabled && onAnswer(value)}
            disabled={disabled}
            className={`rounded-lg border p-4 text-center font-medium transition-colors cursor-pointer ${getStyle(value)} ${disabled ? 'cursor-default' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
