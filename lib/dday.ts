// 선거일: 2026년 6월 3일 (수)
export const ELECTION_DATE = new Date(2026, 5, 3); // month is 0-indexed

export function daysUntilElection(now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(2026, 5, 3);
  const ms = target.getTime() - today.getTime();
  return Math.ceil(ms / 86400000);
}

export function ddayLabel(now: Date = new Date()): string {
  const d = daysUntilElection(now);
  if (d > 0) return `D-${d}`;
  if (d === 0) return "D-DAY";
  return `D+${Math.abs(d)}`;
}
