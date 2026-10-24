'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export type ContactError = 'name' | 'email' | 'messageShort' | 'messageLong' | 'failed';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'name').max(100, 'name'),
  email: z.string().trim().email('email').max(200, 'email'),
  subject: z.enum(['general', 'support', 'billing', 'refund', 'other']),
  message: z.string().trim().min(10, 'messageShort').max(3000, 'messageLong'),
  website: z.string().max(0).optional(),
});

export async function submitContactMessage(
  input: z.input<typeof contactSchema>,
): Promise<{ ok: true } | { ok: false; error: ContactError }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const code = parsed.error.issues[0].message;
    const known: ContactError[] = ['name', 'email', 'messageShort', 'messageLong'];
    return { ok: false, error: known.includes(code as ContactError) ? (code as ContactError) : 'failed' };
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const { website, ...data } = parsed.data;

  const { error } = await supabase.from('contact_messages').insert({ ...data, user_id: session?.user.id ?? null });
  if (error) return { ok: false, error: 'failed' };
  return { ok: true };
}
