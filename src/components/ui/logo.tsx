// The Quizzy mark, copied exactly from the design system's assets/Logos/mark.svg.
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="KSU Quiz">
      <path
        d="M60 8C31 8 10 28 10 55c0 15 7 28 18 37l-6 20 23-11c5 1 10 2 15 2 29 0 50-21 50-48S89 8 60 8z"
        fill="#FF5A36"
      />
      <path
        d="M45 44c0-10 7-16 16-16s16 6 16 14c0 7-4 10-9 13-4 2-6 4-6 9v3"
        fill="none"
        stroke="#fff"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="62" cy="83" r="7" fill="#FFC93C" />
    </svg>
  );
}

// On a brand-colored or dark background the identity allows the mark alone, never the wordmark.
export function Logo({
  markClassName,
  textClassName = 'text-lg',
  variant = 'color',
}: {
  markClassName?: string;
  textClassName?: string;
  variant?: 'color' | 'light';
}) {
  if (variant === 'light') return <LogoMark className={markClassName} />;
  return (
    <span className="inline-flex items-center gap-2" dir="ltr">
      <LogoMark className={markClassName} />
      <span className={`font-bold tracking-tight text-ink ${textClassName}`}>KSU Quiz</span>
    </span>
  );
}
