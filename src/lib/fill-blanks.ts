export type FillSegment = { type: 'text'; value: string } | { type: 'blank'; id: string };
export type FillItem = { id: string; raw?: string; segments: FillSegment[] };
export type FillWord = { id: string; text: string };

const BLANK_RE = /\[([^\[\]]+)\]/g;

// Random ids so a word's id never reveals which blank it belongs to.
const randomId = () => Math.random().toString(36).slice(2, 10);

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function parseDistractors(text: string): string[] {
  return text
    .split(/[,،\n]/)
    .map((w) => w.trim())
    .filter(Boolean);
}

export function buildFillBlanksContent(rawItems: string[], distractors: string[]) {
  const correct: Record<string, string> = {};
  const words: FillWord[] = [];

  const items: FillItem[] = rawItems
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const segments: FillSegment[] = [];
      let last = 0;
      for (const m of raw.matchAll(BLANK_RE)) {
        const start = m.index ?? 0;
        if (start > last) segments.push({ type: 'text', value: raw.slice(last, start) });
        const blankId = randomId();
        const answer = m[1].trim();
        segments.push({ type: 'blank', id: blankId });
        correct[blankId] = answer;
        words.push({ id: randomId(), text: answer });
        last = start + m[0].length;
      }
      if (last < raw.length) segments.push({ type: 'text', value: raw.slice(last) });
      return { id: randomId(), raw, segments };
    });

  distractors.forEach((text) => words.push({ id: randomId(), text }));

  return {
    items,
    words: shuffle(words),
    correct,
    distractors,
    blankCount: Object.keys(correct).length,
  };
}

export function gradeFillBlanks(
  content: { words: FillWord[]; correct: Record<string, string> },
  response: Record<string, string> | null | undefined,
): boolean {
  if (!response) return false;
  const used = Object.values(response);
  if (new Set(used).size !== used.length) return false;
  const textById = new Map(content.words.map((w) => [w.id, w.text]));
  return Object.entries(content.correct).every(
    ([blankId, answer]) => textById.get(response[blankId]) === answer,
  );
}
