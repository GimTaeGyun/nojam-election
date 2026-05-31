import governorsData from "@/data/governors.json";
import superintendentsData from "@/data/superintendents.json";
import mayorsData from "@/data/mayors.json";
import councilorsData from "@/data/councilors.json";

export interface SearchItem {
  name: string;
  party: string;
  regionCode: string;
  regionName: string;
  race: "gov" | "edu" | "mayor" | "council";
  district?: string;
  constituency?: string;
  property?: string;
  criminalRecord?: string;
}

interface Raw {
  regionName: string;
  candidates: Array<{
    name: string;
    party: string;
    property?: string;
    criminalRecord?: string;
  }>;
}

interface RawMayors {
  regionName: string;
  candidates: Array<{
    name: string;
    party: string;
    district: string;
    property?: string;
    criminalRecord?: string;
  }>;
}

interface RawCouncilors {
  regionName: string;
  candidates: Array<{
    name: string;
    party: string;
    district: string;
    constituency: string;
    property?: string;
    criminalRecord?: string;
  }>;
}

const GOVERNORS = governorsData as unknown as Record<string, Raw>;
const SUPERINTENDENTS = superintendentsData as unknown as Record<string, Raw>;
const MAYORS = mayorsData as unknown as Record<string, RawMayors>;
const COUNCILORS = councilorsData as unknown as Record<string, RawCouncilors>;

export const ALL_CANDIDATES: SearchItem[] = [
  ...Object.entries(GOVERNORS).flatMap(([code, r]) =>
    r.candidates.map((c) => ({
      name: c.name,
      party: c.party,
      regionCode: code,
      regionName: r.regionName,
      race: "gov" as const,
      property: c.property,
      criminalRecord: c.criminalRecord,
    })),
  ),
  ...Object.entries(SUPERINTENDENTS).flatMap(([code, r]) =>
    r.candidates.map((c) => ({
      name: c.name,
      party: c.party,
      regionCode: code,
      regionName: r.regionName,
      race: "edu" as const,
      property: c.property,
      criminalRecord: c.criminalRecord,
    })),
  ),
  ...Object.entries(MAYORS).flatMap(([code, r]) =>
    r.candidates.map((c) => ({
      name: c.name,
      party: c.party,
      regionCode: code,
      regionName: r.regionName,
      race: "mayor" as const,
      district: c.district,
      property: c.property,
      criminalRecord: c.criminalRecord,
    })),
  ),
  ...Object.entries(COUNCILORS).flatMap(([code, r]) =>
    r.candidates.map((c) => ({
      name: c.name,
      party: c.party,
      regionCode: code,
      regionName: r.regionName,
      race: "council" as const,
      district: c.district,
      constituency: c.constituency,
      property: c.property,
      criminalRecord: c.criminalRecord,
    })),
  ),
];

// 한글 초성 추출
const INITIALS = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

function getInitial(ch: string): string {
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return ch;
  return INITIALS[Math.floor((code - 0xac00) / 588)];
}

function getInitials(s: string): string {
  return Array.from(s).map(getInitial).join("");
}

const CONSONANT_ONLY = /^[ㄱ-ㅎ]+$/;

export function searchCandidates(query: string, limit = 12): SearchItem[] {
  const q = query.trim();
  if (!q) return [];

  if (CONSONANT_ONLY.test(q)) {
    // 자음만 입력 → 이름의 초성이 입력으로 시작 (startsWith)
    // 예: "ㄱ" → 김XX, "ㅇㅅㅎ" → 오세훈
    return ALL_CANDIDATES.filter((c) => getInitials(c.name).startsWith(q)).slice(0, limit);
  }

  // 일반 텍스트 → 이름은 시작 매칭, 정당은 부분 일치
  // 예: "오" → 오세훈, "더불어" → 더불어민주당 전원
  return ALL_CANDIDATES.filter(
    (c) => c.name.startsWith(q) || c.party.includes(q),
  ).slice(0, limit);
}
