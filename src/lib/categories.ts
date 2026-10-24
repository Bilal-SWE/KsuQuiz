export type Category = { id: string; name: string; color: string; sort_order: number };

// Keys are stored in the database, so they stay fixed; the colors follow the brand palette.
export const CATEGORY_COLORS: Record<string, { label: string; fill: string; dot: string }> = {
  orange: { label: 'مرجاني', fill: 'bg-primary text-ink', dot: 'bg-primary' },
  violet: { label: 'كحلي', fill: 'bg-ink text-background', dot: 'bg-ink' },
  sky: { label: 'أزرق', fill: 'bg-sky text-ink', dot: 'bg-sky' },
  emerald: { label: 'نعناعي', fill: 'bg-success text-ink', dot: 'bg-success' },
  amber: { label: 'ذهبي', fill: 'bg-accent text-ink', dot: 'bg-accent' },
  pink: { label: 'مرجاني فاتح', fill: 'bg-primary-light text-primary-ink', dot: 'bg-primary-light' },
};

export function categoryColor(color: string | null | undefined) {
  return CATEGORY_COLORS[color ?? ''] ?? CATEGORY_COLORS.orange;
}
