type Variant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent';

const variants: Record<Variant, string> = {
  default: 'bg-surface-hover text-muted',
  primary: 'bg-primary-light text-primary-ink',
  success: 'bg-success-light text-success-ink',
  warning: 'bg-warning-light text-warning-ink',
  error: 'bg-error-light text-error',
  accent: 'bg-accent-light text-accent-ink',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
