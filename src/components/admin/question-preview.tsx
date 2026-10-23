'use client';

import { Badge } from '@/components/ui/badge';

const typeLabels: Record<string, string> = {
  mcq: 'اختيار من متعدد',
  true_false: 'صح / خطأ',
  matching: 'مطابقة',
};

export function QuestionPreview({ question }: { question: { type: string; content: any; explanation: string | null } }) {
  const content = question.content;

  return (
    <div>
      <Badge className="mb-2">{typeLabels[question.type] ?? question.type}</Badge>
      <p className="font-medium mb-2">{content.question?.text}</p>
      {content.question?.image && (
        <img src={content.question.image} alt="" className="h-24 rounded-lg mb-2 object-contain" />
      )}

      {question.type === 'mcq' && content.options && (
        <div className="space-y-1 text-sm">
          {content.options.map((opt: any) => (
            <div
              key={opt.id}
              className={`rounded p-2 ${opt.id === content.correct ? 'bg-green-50 text-green-800 font-medium' : 'text-muted'}`}
            >
              {opt.text}
              {opt.id === content.correct && ' ✓'}
              {opt.image && <img src={opt.image} alt="" className="h-12 mt-1 rounded" />}
            </div>
          ))}
        </div>
      )}

      {question.type === 'true_false' && (
        <p className="text-sm">
          الإجابة: <span className="font-medium text-green-700">{content.correct ? 'صح' : 'خطأ'}</span>
        </p>
      )}

      {question.type === 'matching' && content.left && (
        <div className="text-sm space-y-1">
          {content.left.map((l: any, i: number) => (
            <div key={l.id} className="flex gap-2">
              <span className="text-muted">{l.text}</span>
              <span>←→</span>
              <span className="text-green-700">{content.right?.[i]?.text}</span>
            </div>
          ))}
        </div>
      )}

      {question.explanation && (
        <p className="text-xs text-muted mt-2 border-t pt-2">الشرح: {question.explanation}</p>
      )}
    </div>
  );
}
