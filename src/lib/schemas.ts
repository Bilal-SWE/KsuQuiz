import { z } from 'zod';

const textWithImage = z.object({
  text: z.string().min(1, 'النص مطلوب'),
  image: z.string().url().nullable().optional(),
});

const textOrImage = z.object({
  text: z.string().optional().default(''),
  image: z.string().url().nullable().optional(),
}).refine(
  (data) => data.text.length > 0 || (data.image != null && data.image.length > 0),
  { message: 'يجب إدخال نص أو صورة على الأقل' },
);

const mcqOption = z.object({
  id: z.string().min(1),
  text: z.string().optional().default(''),
  image: z.string().url().nullable().optional(),
}).refine(
  (data) => data.text.length > 0 || (data.image != null && data.image.length > 0),
  { message: 'يجب إدخال نص أو صورة لكل خيار' },
);

export const mcqContentSchema = z.object({
  question: textWithImage,
  options: z.array(mcqOption).min(2, 'يجب إضافة خيارين على الأقل').max(6),
  correct: z.string().min(1, 'يجب تحديد الإجابة الصحيحة'),
});

export const trueFalseContentSchema = z.object({
  question: textWithImage,
  correct: z.boolean(),
});

const matchingItem = z.object({
  id: z.string().min(1),
  text: z.string().optional().default(''),
  image: z.string().url().nullable().optional(),
}).refine(
  (data) => data.text.length > 0 || (data.image != null && data.image.length > 0),
  { message: 'يجب إدخال نص أو صورة لكل عنصر' },
);

export const matchingContentSchema = z.object({
  question: textWithImage,
  left: z.array(matchingItem).min(2, 'يجب إضافة عنصرين على الأقل'),
  right: z.array(matchingItem).min(2, 'يجب إضافة عنصرين على الأقل'),
  pairs: z.record(z.string(), z.string()),
});

export const questionContentSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('mcq'), content: mcqContentSchema }),
  z.object({ type: z.literal('true_false'), content: trueFalseContentSchema }),
  z.object({ type: z.literal('matching'), content: matchingContentSchema }),
]);

export type McqContent = z.infer<typeof mcqContentSchema>;
export type TrueFalseContent = z.infer<typeof trueFalseContentSchema>;
export type MatchingContent = z.infer<typeof matchingContentSchema>;
export type QuestionContent = McqContent | TrueFalseContent | MatchingContent;

export const subjectSchema = z.object({
  name: z.string().min(1, 'اسم المادة مطلوب').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const lessonSchema = z.object({
  title: z.string().min(1, 'عنوان الدرس مطلوب').max(200),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});
