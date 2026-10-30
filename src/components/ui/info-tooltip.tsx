'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export function InfoTooltip({ label, title, items }: { label: string; title: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-muted shadow-sm transition-colors hover:text-ink hover:bg-surface-hover"
      >
        {label}
      </button>
      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-80 rounded-2xl border border-border bg-surface p-4 shadow-2xl animate-fade-up">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-foreground">{title}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <ol className="mt-3 space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary-ink">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
