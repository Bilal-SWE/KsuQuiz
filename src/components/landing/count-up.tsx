'use client';

import { useEffect, useRef, useState } from 'react';

// Counts from 0 to the value once it scrolls into view.
export function CountUp({ value, locale }: { value: number; locale: string }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const format = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US');

  useEffect(() => {
    const el = ref.current;
    if (!el || value === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShown(0);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 900);
        setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {format.format(shown)}
    </span>
  );
}
