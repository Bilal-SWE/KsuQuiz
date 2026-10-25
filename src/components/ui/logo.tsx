// The Quizzy mark, copied exactly from the design: a teal tile holding a white Q whose tail is an amber check.
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="KSU Quiz">
      <rect x="8" y="8" width="104" height="104" rx="30" fill="#0F9D8A" />
      <circle cx="57" cy="57" r="24" fill="none" stroke="#fff" strokeWidth="11" />
      <path
        d="M66 68l10 10 18-20"
        fill="none"
        stroke="#FFB400"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// On a teal or dark background the identity allows the mark alone, never the wordmark.
export function Logo({
  markClassName = 'h-9 w-9 sm:h-11 sm:w-11',
  textClassName = 'text-lg sm:text-2xl',
  variant = 'color',
}: {
  markClassName?: string;
  textClassName?: string;
  variant?: 'color' | 'light';
}) {
  if (variant === 'light') return <LogoMark className={markClassName} />;
  return (
    <span className="inline-flex items-center gap-2 sm:gap-3" dir="ltr">
      <LogoMark className={markClassName} />
      <span className={`font-extrabold tracking-tight text-ink ${textClassName}`}>KSU Quiz</span>
    </span>
  );
}
