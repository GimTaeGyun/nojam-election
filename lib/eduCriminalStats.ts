import superintendentsData from "@/data/superintendents.json";
import { parseCriminalCount } from "./parseNum";

export interface EduCriminalEntry {
  name: string;
  regionName: string;
  regionCode: string;
  count: number;
  raw: string;
}

interface Raw {
  regionName: string;
  candidates: Array<{
    name: string;
    criminalRecord?: string;
  }>;
}

const RAW = superintendentsData as unknown as Record<string, Raw>;

export function computeEduCriminal(): EduCriminalEntry[] {
  const result: EduCriminalEntry[] = [];
  for (const [code, region] of Object.entries(RAW)) {
    for (const c of region.candidates) {
      const n = parseCriminalCount(c.criminalRecord);
      if (n > 0) {
        result.push({
          name: c.name,
          regionName: region.regionName,
          regionCode: code,
          count: n,
          raw: c.criminalRecord ?? "",
        });
      }
    }
  }
  return result.sort((a, b) => b.count - a.count);
}

export function getEduCriminalSummary() {
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
