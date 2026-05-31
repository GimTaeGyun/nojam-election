import governorsData from "@/data/governors.json";
import superintendentsData from "@/data/superintendents.json";
import mayorsData from "@/data/mayors.json";
import councilorsData from "@/data/councilors.json";
import localCouncilorsData from "@/data/localCouncilors.json";
import { REGIONS_META } from "@/data/regions";
import { parseThousandWon, parseCriminalCount, parseRunCount } from "./parseNum";
import type { Candidate } from "@/data/types";

export type RaceKind = "gov" | "edu" | "mayor" | "council" | "local";

export const RACE_LABEL: Record<RaceKind, string> = {
  gov: "시·도지사",
  edu: "교육감",
  mayor: "구청장",
  council: "시·도의원",
  local: "구·시·군의원",
};

export const RACE_HASH: Record<RaceKind, string> = {
  gov: "governor",
  edu: "edu",
  mayor: "mayor",
  council: "council",
  local: "local",
};

interface RawCandidate {
  name: string;
  party: string;
  partyKey: string;
  property?: string;
  taxPaid?: string;
  criminalRecord?: string;
  runCount?: string;
  age?: number | null;
  district?: string;
  constituency?: string;
}

interface RawRegion {
  regionName: string;
  candidates: RawCandidate[];
}

const SHORT_NAME: Record<string, string> = Object.fromEntries(
  REGIONS_META.map((r) => [r.code, r.shortName]),
);

interface UnifiedCandidate {
  name: string;
  party: string;
  partyKey: Candidate["partyKey"];
  race: RaceKind;
  regionCode: string;
  regionName: string;
  shortName: string;
  district?: string;
  constituency?: string;
  wealth: number;
  taxPaid: number;
  criminalCount: number;
  criminalRaw: string;
  runCount: number;
  runRaw: string;
  age: number | null;
}

function buildUnified(): UnifiedCandidate[] {
  const all: UnifiedCandidate[] = [];
  const datasets: Array<[Record<string, RawRegion>, RaceKind]> = [
    [governorsData as unknown as Record<string, RawRegion>, "gov"],
    [superintendentsData as unknown as Record<string, RawRegion>, "edu"],
    [mayorsData as unknown as Record<string, RawRegion>, "mayor"],
    [councilorsData as unknown as Record<string, RawRegion>, "council"],
    [localCouncilorsData as unknown as Record<string, RawRegion>, "local"],
  ];

  for (const [source, race] of datasets) {
    for (const [code, region] of Object.entries(source)) {
      for (const c of region.candidates) {
        all.push({
          name: c.name,
          party: c.party,
          partyKey: c.partyKey as Candidate["partyKey"],
          race,
          regionCode: code,
          regionName: region.regionName,
          shortName: SHORT_NAME[code] ?? code,
          district: c.district,
          constituency: c.constituency,
          wealth: parseThousandWon(c.property),
          taxPaid: parseThousandWon(c.taxPaid),
          criminalCount: parseCriminalCount(c.criminalRecord),
          criminalRaw: c.criminalRecord ?? "없음",
          runCount: parseRunCount(c.runCount),
          runRaw: c.runCount ?? "",
          age: c.age ?? null,
        });
      }
    }
  }
  return all;
}

const ALL = buildUnified();

export interface TopEntry {
  rank: number;
  name: string;
  party: string;
  partyKey: Candidate["partyKey"];
  race: RaceKind;
  raceLabel: string;
  raceHash: string;
  regionCode: string;
  regionName: string;
  shortName: string;
  district?: string;
  constituency?: string;
  // 보여줄 값 (카테고리별)
  value: number;
  valueLabel: string;
}

function nameSort(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name, "ko");
}

function makeEntry(
  c: UnifiedCandidate,
  rank: number,
  value: number,
  valueLabel: string,
): TopEntry {
  return {
    rank,
    name: c.name,
    party: c.party,
    partyKey: c.partyKey,
    race: c.race,
    raceLabel: RACE_LABEL[c.race],
    raceHash: RACE_HASH[c.race],
    regionCode: c.regionCode,
    regionName: c.regionName,
    shortName: c.shortName,
    district: c.district,
    constituency: c.constituency,
    value,
    valueLabel,
  };
}

import { formatKrw } from "./parseNum";

export function getTopWealth(limit = 5): TopEntry[] {
  return [...ALL]
    .sort((a, b) => b.wealth - a.wealth || a.name.localeCompare(b.name, "ko"))
    .slice(0, limit)
    .map((c, i) => makeEntry(c, i + 1, c.wealth, formatKrw(c.wealth)));
}

export function getBottomWealth(limit = 5): TopEntry[] {
  return [...ALL]
    .sort((a, b) => a.wealth - b.wealth || a.name.localeCompare(b.name, "ko"))
    .slice(0, limit)
    .map((c, i) => makeEntry(c, i + 1, c.wealth, formatKrw(c.wealth)));
}

export function getTopCriminal(limit = 5): TopEntry[] {
  return [...ALL]
    .filter((c) => c.criminalCount > 0)
    .sort((a, b) => b.criminalCount - a.criminalCount || nameSort(a, b))
    .slice(0, limit)
    .map((c, i) => makeEntry(c, i + 1, c.criminalCount, c.criminalRaw));
}

export function getTopRunCount(limit = 5): TopEntry[] {
  return [...ALL]
    .filter((c) => c.runCount > 0)
    .sort((a, b) => b.runCount - a.runCount || nameSort(a, b))
    .slice(0, limit)
    .map((c, i) => makeEntry(c, i + 1, c.runCount, c.runRaw));
}

export function getYoungest(limit = 5): TopEntry[] {
  return [...ALL]
    .filter((c) => c.age !== null && c.age > 0)
    .sort((a, b) => (a.age ?? 999) - (b.age ?? 999) || nameSort(a, b))
    .slice(0, limit)
    .map((c, i) => makeEntry(c, i + 1, c.age ?? 0, `${c.age}세`));
}

export function getOldest(limit = 5): TopEntry[] {
  return [...ALL]
    .filter((c) => c.age !== null && c.age > 0)
    .sort((a, b) => (b.age ?? 0) - (a.age ?? 0) || nameSort(a, b))
    .slice(0, limit)
    .map((c, i) => makeEntry(c, i + 1, c.age ?? 0, `${c.age}세`));
}

export function getOverallStats() {
  const total = ALL.length;
  const totalRegions = new Set(ALL.map((c) => c.regionCode)).size;
  const parties = new Set(ALL.map((c) => c.party));
  let totalWealth = 0;
  let ageSum = 0;
  let ageCount = 0;
  let hasCrim = 0;
  for (const c of ALL) {
    totalWealth += c.wealth;
    if (c.age !== null && c.age > 0) {
      ageSum += c.age;
      ageCount++;
    }
    if (c.criminalCount > 0) hasCrim++;
  }
  return {
    total,
    totalRegions,
    partyCount: parties.size,
    avgWealth: total > 0 ? Math.floor(totalWealth / total) : 0,
    avgAge: ageCount > 0 ? Math.round(ageSum / ageCount) : 0,
    hasCrim,
    crimRate: total > 0 ? hasCrim / total : 0,
  };
}
