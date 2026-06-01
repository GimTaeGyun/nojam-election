import mayorsData from "@/data/mayors.json";
import councilorsData from "@/data/councilors.json";
import type { Candidate } from "@/data/types";

// 무투표 당선 (단독 출마) 후보 추출.
// - 시·도지사·교육감: 전국 0건 (모두 후보 2명 이상)
// - 구청장·시장·군수: district 당 후보가 1명인 경우
// - 시·도의원: (district, constituency) 페어 당 후보가 1명인 경우
// - 구·시·군의원: 중선거구제(2~4자리)라 정원 데이터 부족 — 별도 처리 안 함

interface RawCandidate {
  district?: string;
  constituency?: string;
  number?: number;
  name: string;
  party: string;
  partyKey: string;
  age?: number | null;
  property?: string;
  criminalRecord?: string;
}
interface RawRegion {
  regionName: string;
  candidates: RawCandidate[];
}

export type UncontestedRace = "mayor" | "council";

export interface UncontestedCandidate {
  race: UncontestedRace;
  regionCode: string;
  regionName: string;
  district: string;
  constituency?: string;
  name: string;
  party: string;
  partyKey: Candidate["partyKey"];
  property?: string;
  criminalRecord?: string;
}

function extractMayors(): UncontestedCandidate[] {
  const data = mayorsData as unknown as Record<string, RawRegion>;
  const byDistrict = new Map<string, { regionCode: string; regionName: string; cands: RawCandidate[] }>();
  for (const [regionCode, region] of Object.entries(data)) {
    for (const c of region.candidates) {
      const district = c.district || "";
      if (!district) continue;
      const key = `${regionCode}__${district}`;
      let entry = byDistrict.get(key);
      if (!entry) {
        entry = { regionCode, regionName: region.regionName, cands: [] };
        byDistrict.set(key, entry);
      }
      entry.cands.push(c);
    }
  }
  const result: UncontestedCandidate[] = [];
  for (const [key, entry] of byDistrict.entries()) {
    if (entry.cands.length !== 1) continue;
    const c = entry.cands[0];
    const district = key.split("__")[1];
    result.push({
      race: "mayor",
      regionCode: entry.regionCode,
      regionName: entry.regionName,
      district,
      name: c.name,
      party: c.party,
      partyKey: c.partyKey as Candidate["partyKey"],
      property: c.property,
      criminalRecord: c.criminalRecord,
    });
  }
  return result;
}

function extractCouncilors(): UncontestedCandidate[] {
  const data = councilorsData as unknown as Record<string, RawRegion>;
  const byConstituency = new Map<
    string,
    { regionCode: string; regionName: string; district: string; constituency: string; cands: RawCandidate[] }
  >();
  for (const [regionCode, region] of Object.entries(data)) {
    for (const c of region.candidates) {
      const district = c.district || "";
      const constituency = c.constituency || "";
      if (!district || !constituency) continue;
      const key = `${regionCode}__${district}__${constituency}`;
      let entry = byConstituency.get(key);
      if (!entry) {
        entry = { regionCode, regionName: region.regionName, district, constituency, cands: [] };
        byConstituency.set(key, entry);
      }
      entry.cands.push(c);
    }
  }
  const result: UncontestedCandidate[] = [];
  for (const entry of byConstituency.values()) {
    if (entry.cands.length !== 1) continue;
    const c = entry.cands[0];
    result.push({
      race: "council",
      regionCode: entry.regionCode,
      regionName: entry.regionName,
      district: entry.district,
      constituency: entry.constituency,
      name: c.name,
      party: c.party,
      partyKey: c.partyKey as Candidate["partyKey"],
      property: c.property,
      criminalRecord: c.criminalRecord,
    });
  }
  return result;
}

// 모듈 레벨 캐시
let CACHE: { all: UncontestedCandidate[]; mayors: UncontestedCandidate[]; councilors: UncontestedCandidate[] } | null = null;

export function getUncontested(): {
  all: UncontestedCandidate[];
  mayors: UncontestedCandidate[];
  councilors: UncontestedCandidate[];
} {
  if (CACHE) return CACHE;
  const mayors = extractMayors().sort(
    (a, b) =>
      a.regionName.localeCompare(b.regionName, "ko") ||
      a.district.localeCompare(b.district, "ko"),
  );
  const councilors = extractCouncilors().sort(
    (a, b) =>
      a.regionName.localeCompare(b.regionName, "ko") ||
      a.district.localeCompare(b.district, "ko") ||
      (a.constituency || "").localeCompare(b.constituency || "", "ko"),
  );
  CACHE = { all: [...mayors, ...councilors], mayors, councilors };
  return CACHE;
}

/** 정당별 무투표 당선자 분포 */
export function getUncontestedByParty(): { party: string; partyKey: Candidate["partyKey"]; count: number }[] {
  const { all } = getUncontested();
  const map = new Map<string, { party: string; partyKey: Candidate["partyKey"]; count: number }>();
  for (const c of all) {
    const e = map.get(c.partyKey) ?? { party: c.party, partyKey: c.partyKey, count: 0 };
    e.count += 1;
    map.set(c.partyKey, e);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}
