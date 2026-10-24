'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Inbox, Mail, MailOpen, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { deleteContactMessage, setContactMessageRead } from '@/app/actions/admin';

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const subjectLabels: Record<string, string> = {
  general: 'استفسار عام',
  support: 'مشكلة تقنية',
  billing: 'الاشتراك والدفع',
  refund: 'استرداد مبلغ',
  other: 'أخرى',
};

export function MessagesInbox({ initial }: { initial: ContactMessage[] }) {
  const [messages, setMessages] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const unread = messages.filter((m) => !m.is_read).length;

  const toggleOpen = (m: ContactMessage) => {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.is_read) {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: true } : x)));
      setContactMessageRead(m.id, true).catch(() => {});
    }
  };

  const markUnread = (m: ContactMessage) => {
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: false } : x)));
    setContactMessageRead(m.id, false).catch(() => {});
  };

  const remove = async (m: ContactMessage) => {
    if (!confirm('حذف هذه الرسالة نهائياً؟')) return;
    const before = messages;
    setMessages((prev) => prev.filter((x) => x.id !== m.id));
    try {
      await deleteContactMessage(m.id);
    } catch (e: any) {
      setMessages(before);
      alert(e.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary-ink">
          <ArrowRight className="h-3.5 w-3.5" />
          لوحة التحكم
        </Link>
        <h1 className="mt-1 text-2xl font-bold">الرسائل</h1>
        <p className="text-sm text-muted">
          {messages.length} رسالة{unread > 0 ? `، منها ${unread} غير مقروءة` : ''}
        </p>
      </div>

      {messages.length === 0 ? (
        <EmptyState icon={<Inbox className="h-7 w-7" />} title="لا توجد رسائل" description="تظهر هنا رسائل الزوار من صفحة اتصل بنا" />
      ) : (
        <div className="space-y-3 stagger">
          {messages.map((m) => {
            const open = openId === m.id;
            return (
              <div key={m.id} className={`card overflow-hidden ${m.is_read ? '' : 'border-primary/40'}`}>
                <button onClick={() => toggleOpen(m)} className="flex w-full items-center gap-3 p-4 text-start cursor-pointer">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      m.is_read ? 'bg-surface-hover text-muted' : 'bg-primary-light text-primary-ink'
                    }`}
                  >
                    {m.is_read ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`truncate ${m.is_read ? 'font-medium' : 'font-bold'}`}>{m.name}</span>
                      <Badge variant={m.subject === 'refund' || m.subject === 'billing' ? 'warning' : 'default'}>
                        {subjectLabels[m.subject] ?? m.subject}
                      </Badge>
                    </span>
                    <span className="block truncate text-sm text-muted">{m.message}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted" suppressHydrationWarning>
                    {new Date(m.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
                  </span>
                </button>
                {open && (
                  <div className="border-t border-border p-4 animate-slide-in">
                    <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <a href={`mailto:${m.email}`} dir="ltr" className="text-sm font-medium text-primary-ink hover:underline">
                        {m.email}
                      </a>
                      <div className="flex gap-1">
                        <button
                          onClick={() => markUnread(m)}
                          className="rounded-xl px-3 py-1.5 text-xs text-muted hover:bg-surface-hover cursor-pointer"
                        >
                          تعليم كغير مقروءة
                        </button>
                        <button
                          onClick={() => remove(m)}
                          aria-label="حذف"
                          className="rounded-xl p-2 text-muted hover:bg-error-light hover:text-error cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
