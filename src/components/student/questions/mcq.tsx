'use client';

import { ImageZoom } from '@/components/ui/image-zoom';

type Props = {
  content: Record<string, any>;
  onAnswer: (optionId: string) => void;
  feedback?: { is_correct: boolean; correct_answer: string } | null;
  disabled?: boolean;
  selectedOption?: string;
};

export function McqQuestion({ content, onAnswer, feedback, disabled, selectedOption }: Props) {
  const options = content.options as { id: string; text?: string; image?: string | null }[];

  const getOptionStyle = (optionId: string) => {
    if (!feedback) {
      return selectedOption === optionId
        ? 'border-primary bg-primary-light'
        : 'border-border hover:border-primary/50';
    }
    if (optionId === feedback.correct_answer) return 'border-green-500 bg-green-50';
    if (optionId === selectedOption && !feedback.is_correct) return 'border-red-500 bg-red-50';
    return 'border-border opacity-60';
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-base font-medium">{content.question?.text}</p>
        {content.question?.image && <ImageZoom src={content.question.image} className="mt-2" />}
      </div>

      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => !disabled && onAnswer(option.id)}
            disabled={disabled}
            className={`w-full text-start rounded-lg border p-3 transition-colors cursor-pointer ${getOptionStyle(option.id)} ${disabled ? 'cursor-default' : ''}`}
          >
            <span className="text-sm">{option.text}</span>
            {option.image && <ImageZoom src={option.image} className="mt-1" />}
          </button>
        ))}
      </div>
    </div>
  );
}
