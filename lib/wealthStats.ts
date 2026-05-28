import governorsData from "@/data/governors.json";
import superintendentsData from "@/data/superintendents.json";
import type { Candidate } from "@/data/types";
import { parseThousandWon } from "./parseNum";

export interface WealthEntry {
  rank: number;
  name: string;
  party: string;
  partyKey: Candidate["partyKey"];
  regionName: string;
  regionCode: string;
  wealthWon: number;
  wealthRaw: string;
}

interface Raw {
  regionName: string;
  candidates: Array<{
    name: string;
    party: string;
    partyKey: string;
    property?: string;
  }>;
}

const GOVERNORS = governorsData as unknown as Record<string, Raw>;
const SUPERINTENDENTS = superintendentsData as unknown as Record<string, Raw>;

export type RaceKind = "gov" | "edu";

function buildRanking(source: Record<string, Raw>): WealthEntry[] {
  const all: Omit<WealthEntry, "rank">[] = [];
  for (const [code, region] of Object.entries(source)) {
    for (const c of region.candidates) {
      all.push({
        name: c.name,
        party: c.party,
        partyKey: c.partyKey as Candidate["partyKey"],
        regionName: region.regionName,
        regionCode: code,
        wealthWon: parseThousandWon(c.property),
        wealthRaw: c.property ?? "",
      });
    }
  }
  return all
    .sort((a, b) => b.wealthWon - a.wealthWon)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

export function computeWealthRanking(race: RaceKind = "gov"): WealthEntry[] {
  return buildRanking(race === "gov" ? GOVERNORS : SUPERINTENDENTS);
}

export function getWealthSummary(race: RaceKind = "gov") {
  const ranking = computeWealthRanking(race);
  const total = ranking.length;
  const sum = ranking.reduce((acc, e) => acc + e.wealthWon, 0);
  const avg = total > 0 ? Math.floor(sum / total) : 0;
  const median = total > 0 ? ranking[Math.floor(total / 2)].wealthWon : 0;
  const over10b = ranking.filter((e) => e.wealthWon >= 1_000_000_000).length;
  const top = ranking[0];
  const bottom = ranking[ranking.length - 1];
  const gap = top && bottom && bottom.wealthWon > 0
    ? Math.round(top.wealthWon / bottom.wealthWon)
    : 0;
  return { total, sum, avg, median, over10b, top, bottom, gap };
}
