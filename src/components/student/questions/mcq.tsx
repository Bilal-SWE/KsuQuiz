'use client';

import { ImageZoom } from '@/components/ui/image-zoom';
import { AnswerOption, type OptionState } from '@/components/student/questions/answer-option';

type Props = {
  content: Record<string, any>;
  onAnswer: (optionId: string) => void;
  feedback?: { is_correct: boolean; correct_answer: string } | null;
  disabled?: boolean;
  selectedOption?: string;
  hideStem?: boolean;
};

export function McqQuestion({ content, onAnswer, feedback, disabled, selectedOption, hideStem }: Props) {
  const options = content.options as { id: string; text?: string; image?: string | null }[];

  const state = (optionId: string): OptionState => {
    if (!feedback) return selectedOption === optionId ? 'selected' : 'idle';
    if (optionId === feedback.correct_answer) return 'correct';
    if (optionId === selectedOption) return 'wrong';
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

      <div className="flex flex-col gap-1.5 stagger sm:gap-2">
        {options.map((option) => (
          <AnswerOption key={option.id} state={state(option.id)} disabled={disabled} onClick={() => onAnswer(option.id)}>
            <span dir="auto">{option.text}</span>
            {option.image && <ImageZoom src={option.image} className="mt-2" />}
          </AnswerOption>
        ))}
      </div>
    </div>
  );
}
