import { Sparkles } from 'lucide-react';

export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center py-14 px-4 text-center animate-fade-up">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary animate-float">
        {icon ?? <Sparkles className="h-7 w-7" />}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted mb-5 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
