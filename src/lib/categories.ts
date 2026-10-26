export type Category = { id: string; name: string; color: string; sort_order: number };

// Keys are stored in the database, so they stay fixed; the fills are shades of green from
// lightest to darkest. Light shades use navy text, dark shades white, each above 4.5:1.
export const CATEGORY_COLORS: Record<string, { label: string; fill: string; dot: string }> = {
  orange: { label: 'أخضر نعناعي', fill: 'bg-[#E3F6EC] text-ink', dot: 'bg-[#E3F6EC]' },
  amber: { label: 'أخضر فاتح', fill: 'bg-[#C3EBD5] text-ink', dot: 'bg-[#C3EBD5]' },
  sky: { label: 'أخضر ربيعي', fill: 'bg-[#94DBB5] text-ink', dot: 'bg-[#94DBB5]' },
  pink: { label: 'أخضر زمردي', fill: 'bg-[#4FBF86] text-ink', dot: 'bg-[#4FBF86]' },
  emerald: { label: 'أخضر غامق', fill: 'bg-[#1E7F4F] text-white', dot: 'bg-[#1E7F4F]' },
  violet: { label: 'أخضر داكن', fill: 'bg-[#0F4D30] text-white', dot: 'bg-[#0F4D30]' },
};

export function categoryColor(color: string | null | undefined) {
  return CATEGORY_COLORS[color ?? ''] ?? CATEGORY_COLORS.orange;
}
