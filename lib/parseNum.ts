import type { Candidate } from "@/data/types";

// 선관위 raw 문자열을 정렬 가능한 숫자로 변환

/** 천원 단위 raw ("1,823,897") → 원 단위 숫자 */
export function parseThousandWon(raw?: string): number {
  if (!raw) return 0;
  const n = Number(raw.replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n * 1000 : 0;
}

/** 전과기록 "없음" / "0건" / "2건" → 숫자 */
export function parseCriminalCount(raw?: string): number {
  if (!raw || raw === "없음" || raw === "0건") return 0;
  const m = raw.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

/** "3회" → 3 */
export function parseRunCount(raw?: string): number {
  if (!raw) return 0;
  const m = raw.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

/** 원 단위 숫자 → "12억 3,400만원" 형태 */
export function formatKrw(won: number): string {
  if (won === 0) return "0원";
  const eok = Math.floor(won / 100_000_000);
  const man = Math.floor((won % 100_000_000) / 10_000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (parts.length === 0) parts.push(`${won.toLocaleString()}`);
  return `${parts.join(" ")}원`;
}

/** 천원 raw 문자열 → "12억 3,400만원" 직행 */
export function formatThousandWonAsKrw(raw?: string): string {
  return formatKrw(parseThousandWon(raw));
}

/** 정렬 키 추출 — 어떤 기준이든 숫자 하나 리턴 */
export type SortKey =
  | "property_desc"
  | "property_asc"
  | "age_desc"
  | "age_asc"
  | "criminal_desc"
  | "tax_desc"
  | "run_desc";

export function getSortValue(c: Candidate, key: SortKey): number {
  switch (key) {
    case "property_desc":
    case "property_asc":
      return parseThousandWon(c.property);
    case "age_desc":
    case "age_asc":
      return c.age ?? 0;
    case "criminal_desc":
      return parseCriminalCount(c.criminalRecord);
    case "tax_desc":
      return parseThousandWon(c.taxPaid);
    case "run_desc":
      return parseRunCount(c.runCount);
  }
}

export function sortCandidates(list: Candidate[], key: SortKey): Candidate[] {
  const sorted = [...list].sort((a, b) => {
    const va = getSortValue(a, key);
    const vb = getSortValue(b, key);
    return key.endsWith("_asc") ? va - vb : vb - va;
  });
  return sorted;
}
