export type Category = { id: string; name: string; color: string; sort_order: number };

export const CATEGORY_COLORS: Record<string, { label: string; gradient: string; chip: string; dot: string }> = {
  violet: { label: 'بنفسجي', gradient: 'from-violet-500 to-fuchsia-500', chip: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  sky: { label: 'أزرق', gradient: 'from-sky-500 to-indigo-500', chip: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  emerald: { label: 'أخضر', gradient: 'from-emerald-500 to-teal-500', chip: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  orange: { label: 'برتقالي', gradient: 'from-orange-400 to-rose-500', chip: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  amber: { label: 'ذهبي', gradient: 'from-amber-400 to-orange-500', chip: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  pink: { label: 'وردي', gradient: 'from-pink-500 to-purple-500', chip: 'bg-pink-100 text-pink-700', dot: 'bg-pink-500' },
};

export function categoryColor(color: string | null | undefined) {
  return CATEGORY_COLORS[color ?? ''] ?? CATEGORY_COLORS.violet;
}
