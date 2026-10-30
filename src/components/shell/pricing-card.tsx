'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function PricingCard({
  children,
  detailsLabel,
}: {
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
  detailsLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [header, features, cta] = children;

  return (
    <>
      {header}
      {/* Desktop: always visible */}
      <div className="hidden sm:contents">{features}{cta}</div>
      {/* Mobile: collapsible */}
      <div className="sm:hidden">
        {open && <div className="animate-fade-up">{features}</div>}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-full py-1.5 text-[11px] font-bold text-muted hover:text-foreground transition-colors"
        >
          {detailsLabel}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {cta}
      </div>
    </>
  );
}
