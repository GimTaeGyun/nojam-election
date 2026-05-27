import governorsData from "@/data/governors.json";
import type { Candidate } from "@/data/types";
import { parseCriminalCount } from "./parseNum";

export interface PartyStat {
  party: string;
  partyKey: Candidate["partyKey"];
  /** 출마자 수 */
  total: number;
  /** 전과 신고 있는 후보 수 */
  hasCrim: number;
  /** 전과 총 건수 (모든 후보 합산) */
  totalCrimCount: number;
  /** 전과 신고 비율 (0~1) */
  rate: number;
  /** 전과 신고 1인당 평균 건수 */
  avgPerPerson: number;
  /** 전과 신고 후보 명단 */
  candidates: { name: string; region: string; count: number; raw: string }[];
}

interface Raw {
  regionName: string;
  candidates: Array<{
    name: string;
    party: string;
    partyKey: string;
    criminalRecord?: string;
  }>;
}

const RAW = governorsData as unknown as Record<string, Raw>;

export function computePartyStats(): PartyStat[] {
  const stats: Record<string, PartyStat> = {};

  for (const region of Object.values(RAW)) {
    for (const c of region.candidates) {
      if (!stats[c.party]) {
        stats[c.party] = {
          party: c.party,
          partyKey: c.partyKey as Candidate["partyKey"],
          total: 0,
          hasCrim: 0,
          totalCrimCount: 0,
          rate: 0,
          avgPerPerson: 0,
          candidates: [],
        };
      }
      const s = stats[c.party];
      s.total++;
      const n = parseCriminalCount(c.criminalRecord);
      if (n > 0) {
        s.hasCrim++;
        s.totalCrimCount += n;
        s.candidates.push({
          name: c.name,
          region: region.regionName,
          count: n,
          raw: c.criminalRecord ?? "",
        });
      }
    }
  }

  // 비율·평균 계산 후 출마자 수 많은 순 정렬
  return Object.values(stats)
    .map((s) => ({
      ...s,
      rate: s.total > 0 ? s.hasCrim / s.total : 0,
      avgPerPerson: s.hasCrim > 0 ? s.totalCrimCount / s.hasCrim : 0,
      candidates: s.candidates.sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.total - a.total);
}

export function getOverallStats() {
  let total = 0;
  let hasCrim = 0;
  let totalCount = 0;
  for (const region of Object.values(RAW)) {
    for (const c of region.candidates) {
      total++;
      const n = parseCriminalCount(c.criminalRecord);
      if (n > 0) {
        hasCrim++;
        totalCount += n;
      }
    }
  }
  return { total, hasCrim, totalCount, rate: total > 0 ? hasCrim / total : 0 };
}
