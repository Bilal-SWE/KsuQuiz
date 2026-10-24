'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'اكتب اسمك').max(100),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح').max(200),
  subject: z.enum(['general', 'support', 'billing', 'refund', 'other']),
  message: z.string().trim().min(10, 'الرسالة قصيرة جداً').max(3000, 'الرسالة طويلة جداً'),
  website: z.string().max(0).optional(),
});

export async function submitContactMessage(input: z.input<typeof contactSchema>) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const { website, ...data } = parsed.data;

  const { error } = await supabase.from('contact_messages').insert({ ...data, user_id: session?.user.id ?? null });
  if (error) return { ok: false as const, error: 'تعذّر إرسال الرسالة، حاول مرة أخرى' };
  return { ok: true as const };
}
