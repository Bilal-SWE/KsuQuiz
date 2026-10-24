import { TextareaHTMLAttributes, forwardRef } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, className = '', id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-muted/70 focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition resize-y min-h-[80px] ${error ? 'border-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  ),
);
Textarea.displayName = 'Textarea';
