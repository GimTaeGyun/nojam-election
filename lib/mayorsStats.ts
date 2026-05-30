import mayorsData from "@/data/mayors.json";
import { REGIONS_META } from "@/data/regions";
import { parseThousandWon, parseCriminalCount } from "./parseNum";
import type { Candidate } from "@/data/types";

interface RawCandidate {
  district: string;
  name: string;
  party: string;
  partyKey: string;
  property?: string;
  criminalRecord?: string;
  age?: number | null;
}

interface RawRegion {
  regionName: string;
  candidates: RawCandidate[];
}

const RAW = mayorsData as unknown as Record<string, RawRegion>;

// 시도 코드 → shortName 매핑
const SHORT_NAME: Record<string, string> = Object.fromEntries(
  REGIONS_META.map((r) => [r.code, r.shortName]),
);

export interface RegionStat {
  regionCode: string;
  regionName: string;
  shortName: string;
  totalCount: number;
  districtCount: number;
  totalWealth: number;
  avgWealth: number;
  top?: { name: string; party: string; district: string; wealth: number };
  hasCrim: number;
  totalCrimCount: number;
}

export interface TopEntry {
  rank: number;
  name: string;
  party: string;
  partyKey: Candidate["partyKey"];
  district: string;
  regionCode: string;
  regionName: string;
  shortName: string;
  wealth: number;
}

export interface PartyStat {
  party: string;
  partyKey: Candidate["partyKey"];
  total: number;
  hasCrim: number;
  totalCrimCount: number;
  rate: number;
}

/** 시도별 통계 (재산 평균 큰 순으로 정렬) */
export function computeRegionStats(): RegionStat[] {
  const stats: RegionStat[] = [];
  for (const [code, r] of Object.entries(RAW)) {
    const districts = new Set<string>();
    let totalWealth = 0;
    let hasCrim = 0;
    let totalCrimCount = 0;
    let top: RegionStat["top"];

    for (const c of r.candidates) {
      districts.add(c.district);
      const w = parseThousandWon(c.property);
      totalWealth += w;
      if (!top || w > top.wealth) {
        top = { name: c.name, party: c.party, district: c.district, wealth: w };
      }
      const cn = parseCriminalCount(c.criminalRecord);
      if (cn > 0) {
        hasCrim++;
        totalCrimCount += cn;
      }
    }

    stats.push({
      regionCode: code,
      regionName: r.regionName,
      shortName: SHORT_NAME[code] ?? code,
      totalCount: r.candidates.length,
      districtCount: districts.size,
      totalWealth,
      avgWealth: r.candidates.length > 0 ? Math.floor(totalWealth / r.candidates.length) : 0,
      top,
      hasCrim,
      totalCrimCount,
    });
  }
  return stats.sort((a, b) => b.avgWealth - a.avgWealth);
}

/** 전국 재산 Top N */
export function computeTopWealth(limit = 20): TopEntry[] {
  const all: Omit<TopEntry, "rank">[] = [];
  for (const [code, r] of Object.entries(RAW)) {
    for (const c of r.candidates) {
      all.push({
        name: c.name,
        party: c.party,
        partyKey: c.partyKey as Candidate["partyKey"],
        district: c.district,
        regionCode: code,
        regionName: r.regionName,
        shortName: SHORT_NAME[code] ?? code,
        wealth: parseThousandWon(c.property),
      });
    }
  }
  return all
    .sort((a, b) => b.wealth - a.wealth)
    .slice(0, limit)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

/** 정당별 통계 */
export function computePartyStats(): PartyStat[] {
  const m: Record<string, PartyStat> = {};
  for (const r of Object.values(RAW)) {
    for (const c of r.candidates) {
      if (!m[c.party]) {
        m[c.party] = {
          party: c.party,
          partyKey: c.partyKey as Candidate["partyKey"],
          total: 0,
          hasCrim: 0,
          totalCrimCount: 0,
          rate: 0,
        };
      }
      m[c.party].total++;
      const cn = parseCriminalCount(c.criminalRecord);
      if (cn > 0) {
        m[c.party].hasCrim++;
        m[c.party].totalCrimCount += cn;
      }
    }
  }
  return Object.values(m)
    .map((s) => ({ ...s, rate: s.total > 0 ? s.hasCrim / s.total : 0 }))
    .sort((a, b) => b.total - a.total);
}

/** 전체 요약 */
export function getOverall() {
  let total = 0;
  let districts = new Set<string>();
  let totalWealth = 0;
  let hasCrim = 0;
  const parties = new Set<string>();
  for (const r of Object.values(RAW)) {
    for (const c of r.candidates) {
      total++;
      districts.add(`${r.regionName}|${c.district}`);
      totalWealth += parseThousandWon(c.property);
      parties.add(c.party);
      if (parseCriminalCount(c.criminalRecord) > 0) hasCrim++;
    }
  }
  return {
    total,
    districtCount: districts.size,
    avgWealth: total > 0 ? Math.floor(totalWealth / total) : 0,
    partyCount: parties.size,
    hasCrim,
    crimRate: total > 0 ? hasCrim / total : 0,
  };
}
