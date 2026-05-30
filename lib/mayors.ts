import mayorsData from "@/data/mayors.json";
import type { Candidate } from "@/data/types";

interface RawMayor {
  district: string;
  number: number;
  name: string;
  hanja?: string;
  party: string;
  partyKey: string;
  age?: number | null;
  gender?: string | null;
  birth?: string;
  address?: string;
  occupation?: string;
  education?: string[];
  career?: string[];
  property?: string;
  military?: string;
  taxPaid?: string;
  taxArrears5yr?: string;
  taxArrearsCurrent?: string;
  criminalRecord?: string;
  runCount?: string;
}

interface RawRegion {
  regionName: string;
  candidates: RawMayor[];
}

const RAW = mayorsData as unknown as Record<string, RawRegion>;

export interface MayorCandidate extends Candidate {
  district: string;
}

const toMayor = (m: RawMayor): MayorCandidate => ({
  district: m.district,
  number: m.number,
  name: m.name,
  hanja: m.hanja || undefined,
  party: m.party,
  partyKey: m.partyKey as Candidate["partyKey"],
  age: m.age ?? undefined,
  gender: m.gender ?? undefined,
  birth: m.birth,
  address: m.address,
  occupation: m.occupation,
  education: m.education,
  career: m.career,
  property: m.property,
  military: m.military,
  taxPaid: m.taxPaid,
  taxArrears5yr: m.taxArrears5yr,
  taxArrearsCurrent: m.taxArrearsCurrent,
  criminalRecord: m.criminalRecord || "없음",
  runCount: m.runCount,
});

/** 시도 코드 기준 모든 구청장 후보 */
export function getMayorsByRegion(regionCode: string): MayorCandidate[] {
  const r = RAW[regionCode];
  if (!r) return [];
  return r.candidates.map(toMayor);
}

/** 시도 안의 unique 선거구 목록 (가나다 순) */
export function getDistrictsByRegion(regionCode: string): string[] {
  const r = RAW[regionCode];
  if (!r) return [];
  const set = new Set<string>();
  for (const c of r.candidates) set.add(c.district);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
}

/** 특정 선거구의 후보들 */
export function getMayorsByDistrict(
  regionCode: string,
  district: string,
): MayorCandidate[] {
  return getMayorsByRegion(regionCode).filter((c) => c.district === district);
}

/** 시도 구청장 후보 수 */
export function getMayorCountByRegion(regionCode: string): number {
  const r = RAW[regionCode];
  return r ? r.candidates.length : 0;
}
