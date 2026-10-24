'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/image-upload';
import { createQuestion, updateQuestion } from '@/app/actions/admin';
import { buildFillBlanksContent, parseDistractors } from '@/lib/fill-blanks';

type Question = {
  id: string;
  type: string;
  content: any;
  explanation: string | null;
};

type SavedQuestion = {
  id: string;
  type: string;
  content: any;
  explanation: string | null;
  sort_order: number;
};

type Props = {
  lessonId: string;
  question: Question | null;
  onDone: (saved?: SavedQuestion) => void;
  onCancel: () => void;
};

export function QuestionEditor({ lessonId, question, onDone, onCancel }: Props) {
  const [type, setType] = useState(question?.type ?? 'mcq');
  const [questionText, setQuestionText] = useState(question?.content?.question?.text ?? '');
  const [questionImage, setQuestionImage] = useState(question?.content?.question?.image ?? '');
  const [explanation, setExplanation] = useState(question?.explanation ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // MCQ state
  const [options, setOptions] = useState<{ id: string; text: string; image: string; explanation: string }[]>(
    question?.type === 'mcq' && question.content.options
      ? question.content.options.map((o: any) => ({ id: o.id, text: o.text, image: o.image ?? '', explanation: o.explanation ?? '' }))
      : [
          { id: 'a', text: '', image: '', explanation: '' },
          { id: 'b', text: '', image: '', explanation: '' },
          { id: 'c', text: '', image: '', explanation: '' },
          { id: 'd', text: '', image: '', explanation: '' },
        ],
  );
  const [correctOption, setCorrectOption] = useState(
    question?.type === 'mcq' ? question.content.correct ?? 'a' : 'a',
  );

  // True/False state
  const [correctBool, setCorrectBool] = useState(
    question?.type === 'true_false' ? question.content.correct ?? true : true,
  );

  // Matching state
  const [leftItems, setLeftItems] = useState<{ id: string; text: string; image: string }[]>(
    question?.type === 'matching' && question.content.left
      ? question.content.left
      : [
          { id: 'l1', text: '', image: '' },
          { id: 'l2', text: '', image: '' },
        ],
  );
  const [rightItems, setRightItems] = useState<{ id: string; text: string; image: string }[]>(
    question?.type === 'matching' && question.content.right
      ? question.content.right
      : [
          { id: 'r1', text: '', image: '' },
          { id: 'r2', text: '', image: '' },
        ],
  );

  // Fill-in-the-blanks state
  const [fillItems, setFillItems] = useState<string[]>(
    question?.type === 'fill_blanks' && question.content.items
      ? question.content.items.map((i: any) => i.raw ?? '')
      : ['', ''],
  );
  const [distractorsText, setDistractorsText] = useState<string>(
    question?.type === 'fill_blanks' ? (question.content.distractors ?? []).join('، ') : '',
  );
  const fillPreview = useMemo(
    () => (type === 'fill_blanks' ? buildFillBlanksContent(fillItems, parseDistractors(distractorsText)) : null),
    [type, fillItems, distractorsText],
  );

  const handleSubmit = async () => {
    if (!questionText.trim()) {
      setError('نص السؤال مطلوب');
      return;
    }
    if (type === 'fill_blanks' && (fillPreview?.blankCount ?? 0) === 0) {
      setError('ضع كلمة واحدة على الأقل بين قوسين [ ] لتصبح فراغاً');
      return;
    }
    setError('');
    setLoading(true);

    let content: any;
    switch (type) {
      case 'fill_blanks': {
        const { blankCount, ...built } = buildFillBlanksContent(fillItems, parseDistractors(distractorsText));
        content = { question: { text: questionText, image: questionImage || null }, ...built };
        break;
      }
      case 'mcq':
        content = {
          question: { text: questionText, image: questionImage || null },
          options: options.map((o) => ({
            id: o.id,
            text: o.text,
            image: o.image || null,
            explanation: o.explanation || null,
          })),
          correct: correctOption,
        };
        break;
      case 'true_false':
        content = {
          question: { text: questionText, image: questionImage || null },
          correct: correctBool,
        };
        break;
      case 'matching':
        content = {
          question: { text: questionText, image: questionImage || null },
          left: leftItems.map((i) => ({ id: i.id, text: i.text, image: i.image || null })),
          right: rightItems.map((i) => ({ id: i.id, text: i.text, image: i.image || null })),
          pairs: Object.fromEntries(leftItems.map((l, idx) => [l.id, rightItems[idx]?.id])),
        };
        break;
    }

    try {
      if (question) {
        await updateQuestion(question.id, { type, content, explanation });
        onDone({ id: question.id, type, content, explanation, sort_order: (question as any).sort_order ?? 0 });
      } else {
        const created = await createQuestion(lessonId, { type, content, explanation });
        onDone({ id: created.id, type, content, explanation, sort_order: 999 });
      }
    } catch {
      setError('حدث خطأ');
    }
    setLoading(false);
  };

  const addOption = () => {
    const id = String.fromCharCode(97 + options.length);
    setOptions([...options, { id, text: '', image: '', explanation: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (!newOptions.find((o) => o.id === correctOption)) {
      setCorrectOption(newOptions[0].id);
    }
  };

  const addMatchingPair = () => {
    const lId = `l${leftItems.length + 1}`;
    const rId = `r${rightItems.length + 1}`;
    setLeftItems([...leftItems, { id: lId, text: '', image: '' }]);
    setRightItems([...rightItems, { id: rId, text: '', image: '' }]);
  };

  const removeMatchingPair = (index: number) => {
    if (leftItems.length <= 2) return;
    setLeftItems(leftItems.filter((_, i) => i !== index));
    setRightItems(rightItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold">{question ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h3>

      {!question && (
        <div className="flex gap-2">
          {[
            { value: 'mcq', label: 'اختيار من متعدد' },
            { value: 'true_false', label: 'صح / خطأ' },
            { value: 'fill_blanks', label: 'املأ الفراغات' },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium border transition-colors cursor-pointer ${
                type === t.value ? 'border-primary bg-primary-light text-primary' : 'border-border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <Textarea
        label="نص السؤال"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        error={error}
      />

      <div>
        <label className="text-sm font-medium block mb-1.5">صورة السؤال (اختياري)</label>
        <ImageUpload value={questionImage} onChange={setQuestionImage} />
      </div>

      {/* MCQ Options */}
      {type === 'mcq' && (
        <div className="space-y-3">
          <label className="text-sm font-medium">الخيارات:</label>
          {options.map((option, index) => (
            <div key={option.id} className="flex items-start gap-2">
              <input
                type="radio"
                name="correct"
                checked={correctOption === option.id}
                onChange={() => setCorrectOption(option.id)}
                className="mt-3 accent-primary cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = { ...option, text: e.target.value };
                    setOptions(newOptions);
                  }}
                  placeholder={`خيار ${index + 1}`}
                />
                <ImageUpload
                  value={option.image}
                  onChange={(url) => {
                    const newOptions = [...options];
                    newOptions[index] = { ...option, image: url };
                    setOptions(newOptions);
                  }}
                />
                <Input
                  value={option.explanation}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = { ...option, explanation: e.target.value };
                    setOptions(newOptions);
                  }}
                  placeholder="شرح هذا الخيار (اختياري)"
                />
              </div>
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="text-error text-sm mt-2 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {options.length < 6 && (
            <Button variant="ghost" onClick={addOption} className="text-sm">
              + إضافة خيار
            </Button>
          )}
          <p className="text-xs text-muted">اختر الإجابة الصحيحة بالضغط على الدائرة</p>
        </div>
      )}

      {/* True/False */}
      {type === 'true_false' && (
        <div>
          <label className="text-sm font-medium block mb-2">الإجابة الصحيحة:</label>
          <div className="flex gap-3">
            {[
              { value: true, label: 'صح' },
              { value: false, label: 'خطأ' },
            ].map(({ value, label }) => (
              <button
                key={String(value)}
                onClick={() => setCorrectBool(value)}
                className={`rounded-lg px-6 py-2 border font-medium cursor-pointer ${
                  correctBool === value ? 'border-primary bg-primary-light text-primary' : 'border-border'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fill in the blanks */}
      {type === 'fill_blanks' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">الجمل:</label>
            <p className="text-xs text-muted mt-0.5">
              اكتب كل جملة وضع الكلمة المطلوبة بين قوسين مربعين، مثل: عاصمة السعودية هي [الرياض]
            </p>
          </div>
          {fillItems.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-sm text-muted mt-2.5 w-5">{index + 1}.</span>
              <div className="flex-1">
                <Input
                  value={item}
                  onChange={(e) => {
                    const next = [...fillItems];
                    next[index] = e.target.value;
                    setFillItems(next);
                  }}
                  placeholder="الجملة مع [الكلمة] بين قوسين"
                />
              </div>
              {fillItems.length > 1 && (
                <button
                  onClick={() => setFillItems(fillItems.filter((_, i) => i !== index))}
                  className="text-error text-sm mt-2 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <Button variant="ghost" onClick={() => setFillItems([...fillItems, ''])} className="text-sm">
            + إضافة جملة
          </Button>

          <Input
            label="كلمات إضافية للتمويه (اختياري)"
            value={distractorsText}
            onChange={(e) => setDistractorsText(e.target.value)}
            placeholder="جدة، الدمام، مكة"
          />

          {fillPreview && fillPreview.words.length > 0 && (
            <div className="rounded-lg bg-surface-hover p-3">
              <p className="text-xs text-muted mb-2">بنك الكلمات كما سيراه الطالب ({fillPreview.blankCount} فراغ):</p>
              <div className="flex flex-wrap gap-2">
                {fillPreview.words.map((w) => (
                  <span key={w.id} className="rounded-md border border-border bg-surface px-2 py-1 text-sm">
                    {w.text}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Matching (legacy questions only) */}
      {type === 'matching' && (
        <div className="space-y-3">
          <label className="text-sm font-medium">أزواج المطابقة (كل صف = زوج):</label>
          {leftItems.map((left, index) => (
            <div key={left.id} className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-hover">
              <div>
                <Input
                  value={left.text}
                  onChange={(e) => {
                    const items = [...leftItems];
                    items[index] = { ...left, text: e.target.value };
                    setLeftItems(items);
                  }}
                  placeholder={`العنصر ${index + 1} (يمين)`}
                />
                <div className="mt-1">
                  <ImageUpload
                    value={left.image}
                    onChange={(url) => {
                      const items = [...leftItems];
                      items[index] = { ...left, image: url };
                      setLeftItems(items);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={rightItems[index]?.text ?? ''}
                    onChange={(e) => {
                      const items = [...rightItems];
                      items[index] = { ...items[index], text: e.target.value };
                      setRightItems(items);
                    }}
                    placeholder={`المطابق ${index + 1} (يسار)`}
                  />
                  <div className="mt-1">
                    <ImageUpload
                      value={rightItems[index]?.image ?? ''}
                      onChange={(url) => {
                        const items = [...rightItems];
                        items[index] = { ...items[index], image: url };
                        setRightItems(items);
                      }}
                    />
                  </div>
                </div>
                {leftItems.length > 2 && (
                  <button
                    onClick={() => removeMatchingPair(index)}
                    className="text-error text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
          <Button variant="ghost" onClick={addMatchingPair} className="text-sm">
            + إضافة زوج
          </Button>
        </div>
      )}

      <Textarea
        label="الشرح (اختياري)"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        placeholder="يظهر للطالب بعد الإجابة"
      />

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-2">
        <Button onClick={handleSubmit} loading={loading}>
          {question ? 'حفظ' : 'إضافة'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
