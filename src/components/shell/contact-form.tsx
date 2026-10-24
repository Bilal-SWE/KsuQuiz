'use client';

import { useState } from 'react';
import { CircleCheck, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitContactMessage } from '@/app/actions/contact';

const subjects = [
  { value: 'general', label: 'استفسار عام' },
  { value: 'support', label: 'مشكلة تقنية' },
  { value: 'billing', label: 'الاشتراك والدفع' },
  { value: 'refund', label: 'استرداد مبلغ' },
  { value: 'other', label: 'أخرى' },
] as const;

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<(typeof subjects)[number]['value']>('general');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const res = await submitContactMessage({ name, email, subject, message, website });
    setSending(false);
    if (res.ok) setSent(true);
    else setError(res.error);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center animate-fade-up">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success-light text-success animate-pop">
          <CircleCheck className="h-8 w-8" />
        </span>
        <h3 className="text-lg font-bold">وصلتنا رسالتك</h3>
        <p className="text-sm text-muted">سنرد عليك على بريدك الإلكتروني في أقرب وقت.</p>
        <Button
          variant="secondary"
          onClick={() => {
            setSent(false);
            setMessage('');
          }}
        >
          إرسال رسالة أخرى
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="c_name" label="الاسم" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          id="c_email"
          label="البريد الإلكتروني"
          type="email"
          dir="ltr"
          className="text-left"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="c_subject" className="mb-1.5 block text-sm font-medium">الموضوع</label>
        <select
          id="c_subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as typeof subject)}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary"
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <Textarea id="c_message" label="رسالتك" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" loading={sending} className="w-full sm:w-auto px-6">
        <Send className="h-4 w-4" />
        إرسال
      </Button>
    </form>
  );
}
