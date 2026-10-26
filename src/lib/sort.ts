const collator = new Intl.Collator('ar', { numeric: true, sensitivity: 'base' });

// Alphabetical by name; numbers compare by value so "سلم 100" comes before "سلم 101".
export function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => collator.compare(a.name, b.name));
}
