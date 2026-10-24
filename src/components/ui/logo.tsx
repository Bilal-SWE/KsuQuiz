export function LogoMark({ className = 'h-9 w-9', variant = 'color' }: { className?: string; variant?: 'color' | 'light' }) {
  const light = variant === 'light';
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="KSU Quiz">
      <defs>
        <linearGradient id="ksuq-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#c026d3" />
        </linearGradient>
        <mask id="ksuq-cut">
          <rect width="64" height="64" fill="white" />
          <path d="M26 37l8.5 8.5L52 24" stroke="black" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </mask>
      </defs>
      <rect width="64" height="64" rx="18" fill={light ? 'rgb(255 255 255 / 0.16)' : 'url(#ksuq-bg)'} />
      <circle cx="29" cy="29" r="14" fill="none" stroke="white" strokeWidth="6.5" mask="url(#ksuq-cut)" />
      <path d="M26 37l8.5 8.5L52 24" stroke="white" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="13" r="4.5" fill="#fb923c" />
    </svg>
  );
}

export function Logo({ markClassName, textClassName = 'text-lg', variant = 'color' }: {
  markClassName?: string;
  textClassName?: string;
  variant?: 'color' | 'light';
}) {
  return (
    <span className="inline-flex items-center gap-2" dir="ltr">
      <LogoMark className={markClassName} variant={variant} />
      <span className={`font-bold tracking-tight ${textClassName} ${variant === 'light' ? 'text-white' : 'text-foreground'}`}>
        KSU{' '}
        <span className={variant === 'light' ? 'text-white/85' : 'gradient-text'}>Quiz</span>
      </span>
    </span>
  );
}
