export function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mmss = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return h > 0 ? `${h}:${mmss}` : mmss;
}
