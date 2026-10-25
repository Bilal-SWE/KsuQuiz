'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/i18n/client';
import { Crown, Sparkles, X } from 'lucide-react';

export function SubscribeButton({
  className = '',
  title,
  children,
}: {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} title={title} aria-label={title} className={`press cursor-pointer ${className}`}>
        {children ?? (
          <>
            <Crown className="h-4 w-4" />
            {t.subscribe.button}
          </>
        )}
      </button>

      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscribe-soon-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-surface text-center text-foreground shadow-2xl animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label={t.subscribe.close}
              className="absolute top-3 end-3 z-10 rounded-full p-1.5 text-white/80 hover:bg-white/15 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="hero rounded-none px-6 py-8">
              <span className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 animate-float">
                <Sparkles className="h-8 w-8" />
              </span>
            </div>
            <div className="p-6">
              <h2 id="subscribe-soon-title" className="text-2xl font-bold">
                {t.subscribe.soonTitle}
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">{t.subscribe.soonText}</p>
              <button
                onClick={() => setOpen(false)}
                className="press mt-5 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-on-primary cursor-pointer hover:brightness-110"
              >
                {t.subscribe.ok}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
