import type { Candidate, PartyKey } from "@/data/types";
import { parseThousandWon, parseCriminalCount } from "./parseNum";

// 데모 모드 마스킹.
// 선거 종료 후 공개 페이지에서 후보 개인정보 노출 X.
// 관리자 로그인 시에만 원본 데이터 노출.

/** 정당 영구 셔플 매핑 — 한 번 박고 일관 사용 */
const PARTY_LABEL: Record<PartyKey, string> = {
  democratic: "정당-α",
  ppp: "정당-β",
  rebuilding: "정당-γ",
  reform: "정당-δ",
  justice: "정당-ε",
  progressive: "정당-ζ",
  green: "정당-η",
  women: "정당-θ",
  freedom: "정당-ι",
  alliance: "정당-κ",
  indep: "무소속",
};

/** 재산 구간화 (원 단위 입력) */
export function maskWealthAmount(won: number): string {
  if (won < 0) return "빚 있음";
  if (won === 0) return "0";
  if (won < 100_000_000) return "1억 미만";
  if (won < 500_000_000) return "1~5억";
  if (won < 1_000_000_000) return "5~10억";
  if (won < 5_000_000_000) return "10~50억";
  if (won < 10_000_000_000) return "50~100억";
  if (won < 50_000_000_000) return "100~500억";
  return "500억+";
}

/** 전과 건수 라벨화 */
export function maskCrimCount(count: number): string {
  if (count === 0) return "없음";
  if (count <= 2) return "낮음 (1~2건)";
  if (count <= 5) return "중간 (3~5건)";
  if (count <= 10) return "많음 (6~10건)";
  return "매우 많음 (10건+)";
}

/** 생년월일 마스킹: "1962.12.12" → "1962.**.**" */
function maskBirth(b?: string): string | undefined {
  if (!b) return undefined;
  const year = b.split(".")[0];
  if (!year) return "****.**.**";
  return `${year}.**.**`;
}

/** 주소 마스킹: 시·도까지만 */
function maskAddress(a?: string, regionName?: string): string {
  if (regionName) return `${regionName} ***`;
  if (!a) return "***";
  const tokens = a.split(/\s+/);
  return (tokens[0] ?? "") + " ***";
}

/**
 * 후보자 한 명 마스킹.
 * 통계는 원본 숫자(property·criminalRecord) 그대로 두고,
 * UI 표시 단계에서 구간/라벨 변환은 별도로 해야 함.
 * 다만 UI 일관성 위해 여기서 미리 표시용 문자열로 바꿔도 됨 — 옵션은 분리.
 */
export function maskCandidate(c: Candidate, idx: number, regionName?: string): Candidate {
  return {
    ...c,
    name: `후보 #${c.number}-${idx + 1}`,
    hanja: undefined,
    party: PARTY_LABEL[c.partyKey] ?? "정당-?",
    // partyKey는 그대로 둠 (정당 색 매핑에 사용, 셔플된 라벨이라 식별 불가)
    birth: maskBirth(c.birth),
    address: maskAddress(c.address, regionName),
    occupation: "***",
    education: c.education && c.education.length > 0 ? ["*** 대학교 졸업"] : undefined,
    career: c.career && c.career.length > 0 ? ["*** 활동", "*** 경력"] : undefined,
    pledges: c.pledges && c.pledges.length > 0 ? ["*** 공약"] : undefined,
    // 재산: 원본은 천원 단위 문자열. 표시는 구간화.
    property: c.property ? formatWealthMasked(c.property) : undefined,
    criminalRecord: maskCrimCount(parseCriminalCount(c.criminalRecord)),
    taxPaid: c.taxPaid ? "***" : undefined,
    taxArrears5yr: c.taxArrears5yr ? "***" : undefined,
    taxArrearsCurrent: c.taxArrearsCurrent ? "***" : undefined,
    runCount: c.runCount, // 입후보 횟수는 식별 정보 약함, 유지
    trivia: undefined,
  };
}

/** 천원 단위 문자열 → 구간 라벨 ("12,345,678" → "10~50억" 등) */
function formatWealthMasked(rawThousandWon: string): string {
  const won = parseThousandWon(rawThousandWon);
  return maskWealthAmount(won);
}

/** 후보자 배열 일괄 마스킹 */
export function maskCandidates(list: Candidate[], regionName?: string): Candidate[] {
  return list.map((c, i) => maskCandidate(c, i, regionName));
}

// 통계 페이지용 가벼운 마스킹 헬퍼.
// 통계 결과 객체에 들어있는 name·party만 마스킹 (Top N 리스트 등).

/** 익명 후보 이름 — idx 기반 */
export function maskedName(idx: number): string {
  return `후보 #${idx + 1}`;
}

/** 정당 이름만 익명 라벨로 (partyKey 기반) */
export function maskedParty(partyKey: PartyKey): string {
  return PARTY_LABEL[partyKey] ?? "정당-?";
}

/**
 * 통계 페이지의 Top N 리스트 같은 곳에서 사용.
 * { name, party, partyKey, ... } 형태의 객체를 마스킹.
 */
export function maskEntry<T extends { name: string; party: string; partyKey: PartyKey }>(
  e: T,
  idx: number,
): T {
  return {
    ...e,
    name: maskedName(idx),
    party: maskedParty(e.partyKey),
  };
}

