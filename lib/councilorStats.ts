import councilorsData from "@/data/councilors.json";
import { REGIONS_META } from "@/data/regions";
import { parseThousandWon, parseCriminalCount } from "./parseNum";
import type { Candidate } from "@/data/types";

interface RawCandidate {
  district: string;
  constituency: string;
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

const RAW = councilorsData as unknown as Record<string, RawRegion>;

const SHORT_NAME: Record<string, string> = Object.fromEntries(
  REGIONS_META.map((r) => [r.code, r.shortName]),
);

export interface RegionStat {
  regionCode: string;
  regionName: string;
  shortName: string;
  totalCount: number;
  districtCount: number;
  constituencyCount: number;
  totalWealth: number;
  avgWealth: number;
  hasCrim: number;
  totalCrimCount: number;
}

export interface TopEntry {
  rank: number;
  name: string;
  party: string;
  partyKey: Candidate["partyKey"];
  district: string;
  constituency: string;
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

export function computeRegionStats(): RegionStat[] {
  const stats: RegionStat[] = [];
  for (const [code, r] of Object.entries(RAW)) {
    const districts = new Set<string>();
    const constituencies = new Set<string>();
    let totalWealth = 0;
    let hasCrim = 0;
    let totalCrimCount = 0;

    for (const c of r.candidates) {
      districts.add(c.district);
      constituencies.add(c.constituency);
      totalWealth += parseThousandWon(c.property);
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
      constituencyCount: constituencies.size,
      totalWealth,
      avgWealth: r.candidates.length > 0 ? Math.floor(totalWealth / r.candidates.length) : 0,
      hasCrim,
      totalCrimCount,
    });
  }
  return stats.sort((a, b) => b.avgWealth - a.avgWealth);
}

export function computeTopWealth(limit = 20): TopEntry[] {
  const all: Omit<TopEntry, "rank">[] = [];
  for (const [code, r] of Object.entries(RAW)) {
    for (const c of r.candidates) {
      all.push({
        name: c.name,
        party: c.party,
        partyKey: c.partyKey as Candidate["partyKey"],
        district: c.district,
        constituency: c.constituency,
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

export function getOverall() {
  let total = 0;
  const districts = new Set<string>();
  const constituencies = new Set<string>();
  let totalWealth = 0;
  let hasCrim = 0;
  const parties = new Set<string>();
  for (const r of Object.values(RAW)) {
    for (const c of r.candidates) {
      total++;
      districts.add(`${r.regionName}|${c.district}`);
      constituencies.add(`${r.regionName}|${c.constituency}`);
      totalWealth += parseThousandWon(c.property);
      parties.add(c.party);
      if (parseCriminalCount(c.criminalRecord) > 0) hasCrim++;
    }
  }
  return {
    total,
    districtCount: districts.size,
    constituencyCount: constituencies.size,
    avgWealth: total > 0 ? Math.floor(totalWealth / total) : 0,
    partyCount: parties.size,
    hasCrim,
    crimRate: total > 0 ? hasCrim / total : 0,
  };
}
