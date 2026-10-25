export type Category = { id: string; name: string; color: string; sort_order: number };

// Keys are stored in the database, so they stay fixed; the fills are the design's pastel card colors.
export const CATEGORY_COLORS: Record<string, { label: string; fill: string; dot: string }> = {
  orange: { label: 'فيروزي', fill: 'bg-pastel-teal text-ink', dot: 'bg-primary' },
  amber: { label: 'ذهبي', fill: 'bg-pastel-amber text-ink', dot: 'bg-accent' },
  sky: { label: 'أزرق', fill: 'bg-pastel-blue text-ink', dot: 'bg-sky' },
  pink: { label: 'خوخي', fill: 'bg-pastel-peach text-ink', dot: 'bg-error' },
  emerald: { label: 'أخضر', fill: 'bg-success-light text-ink', dot: 'bg-success' },
  violet: { label: 'كحلي', fill: 'bg-ink text-background', dot: 'bg-ink' },
};

export function categoryColor(color: string | null | undefined) {
  return CATEGORY_COLORS[color ?? ''] ?? CATEGORY_COLORS.orange;
}
