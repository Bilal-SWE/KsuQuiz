'use client';

import { useState, useEffect } from 'react';
import { ImageZoom } from '@/components/ui/image-zoom';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/i18n/format';

type Item = { id: string; text?: string; image?: string | null };

type Props = {
  content: Record<string, any>;
  onAnswer: (pairs: Record<string, string>) => void;
  feedback?: { is_correct: boolean; correct_answer: Record<string, string> } | null;
  disabled?: boolean;
  savedPairs?: Record<string, string>;
};

const PAIR_COLORS = [
  'bg-blue-100 border-blue-400',
  'bg-green-100 border-green-400',
  'bg-purple-100 border-purple-400',
  'bg-orange-100 border-orange-400',
  'bg-pink-100 border-pink-400',
  'bg-teal-100 border-teal-400',
];

export function MatchingQuestion({ content, onAnswer, feedback, disabled, savedPairs }: Props) {
  const Q = useI18n().t.question;
  const left = content.left as Item[];
  const right = content.right as Item[];
  const [pairs, setPairs] = useState<Record<string, string>>(savedPairs ?? {});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const pairIndex = (leftId: string): number => {
    const keys = Object.keys(pairs);
    return keys.indexOf(leftId);
  };

  const rightPairIndex = (rightId: string): number => {
    const entry = Object.entries(pairs).find(([, r]) => r === rightId);
    if (!entry) return -1;
    return Object.keys(pairs).indexOf(entry[0]);
  };

  const handleLeftClick = (leftId: string) => {
    if (disabled) return;
    if (pairs[leftId]) {
      // Undo this pair
      setPairs((prev) => {
        const next = { ...prev };
        delete next[leftId];
        return next;
      });
      return;
    }
    setSelectedLeft(leftId);
  };

  const handleRightClick = (rightId: string) => {
    if (disabled || !selectedLeft) return;
    if (Object.values(pairs).includes(rightId)) return; // Already paired

    const newPairs = { ...pairs, [selectedLeft]: rightId };
    setPairs(newPairs);
    setSelectedLeft(null);

    // Auto-submit when all paired
    if (Object.keys(newPairs).length === left.length) {
      onAnswer(newPairs);
    }
  };

  const getLeftStyle = (id: string) => {
    if (feedback) {
      const correct = feedback.correct_answer;
      if (pairs[id] === correct[id]) return 'border-green-500 bg-green-50';
      return 'border-red-500 bg-red-50';
    }
    if (selectedLeft === id) return 'border-primary bg-primary-light ring-2 ring-primary';
    const idx = pairIndex(id);
    if (idx >= 0) return PAIR_COLORS[idx % PAIR_COLORS.length];
    return 'border-border hover:border-primary/50';
  };

  const getRightStyle = (id: string) => {
    if (feedback) {
      const isCorrectlyPaired = Object.entries(feedback.correct_answer).some(
        ([l, r]) => r === id && pairs[l] === id,
      );
      return isCorrectlyPaired ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
    }
    const idx = rightPairIndex(id);
    if (idx >= 0) return PAIR_COLORS[idx % PAIR_COLORS.length];
    if (Object.values(pairs).includes(id)) return 'border-gray-300 opacity-50';
    return 'border-border hover:border-primary/50';
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-base font-medium">{content.question?.text}</p>
        {content.question?.image && <ImageZoom src={content.question.image} className="mt-2" />}
        <p className="text-xs text-muted mt-2">{Q.matchingHint}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Right column (displayed on right in RTL) */}
        <div className="space-y-2">
          {left.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              disabled={disabled}
              className={`w-full text-start rounded-lg border-2 p-3 text-sm transition-all cursor-pointer ${getLeftStyle(item.id)} ${disabled ? 'cursor-default' : ''}`}
            >
              {item.text}
              {item.image && <ImageZoom src={item.image} className="mt-1" />}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {right.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              disabled={disabled || !selectedLeft}
              className={`w-full text-start rounded-lg border-2 p-3 text-sm transition-all cursor-pointer ${getRightStyle(item.id)} ${disabled || !selectedLeft ? 'cursor-default' : ''}`}
            >
              {item.text}
              {item.image && <ImageZoom src={item.image} className="mt-1" />}
            </button>
          ))}
        </div>
      </div>

      {!disabled && Object.keys(pairs).length > 0 && Object.keys(pairs).length < left.length && (
        <p className="text-xs text-muted text-center mt-3">
          {fmt(Q.matchedCount, { a: Object.keys(pairs).length, n: left.length })}
        </p>
      )}
    </div>
  );
}
