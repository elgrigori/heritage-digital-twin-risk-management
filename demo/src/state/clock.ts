// Small mock-clock helper: parse "HH:MM:SS", add seconds, format back.

export function parseClock(s: string): number {
  const [h, m, sec] = s.split(":").map(Number);
  return h * 3600 + m * 60 + (sec || 0);
}

export function fmtClock(totalSeconds: number): string {
  const t = ((totalSeconds % 86400) + 86400) % 86400;
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}`;
}

export function addSeconds(base: string, seconds: number): string {
  return fmtClock(parseClock(base) + seconds);
}
