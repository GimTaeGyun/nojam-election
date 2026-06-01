import mayorsData from "@/data/mayors.json";
import councilorsData from "@/data/councilors.json";
import localCouncilorsData from "@/data/localCouncilors.json";
import { parseThousandWon, parseCriminalCount } from "./parseNum";

// 구·시·군(district) 단위 종합 통계 + 전국 랭킹.
// 같은 선거직(구청장 / 시·도의원 / 구·시·군의원)끼리만 비교.

interface RawCandidate {
  district?: string;
  name: string;
  property?: string;
  criminalRecord?: string;
}
interface RawRegion {
  regionName: string;
  candidates: RawCandidate[];
}

export type RaceKey = "mayor" | "council" | "local";

const SOURCES: Record<RaceKey, Record<string, RawRegion>> = {
  mayor: mayorsData as unknown as Record<string, RawRegion>,
  council: councilorsData as unknown as Record<string, RawRegion>,
  local: localCouncilorsData as unknown as Record<string, RawRegion>,
};

interface DistrictAgg {
  regionCode: string;
  regionName: string;
  district: string;
  n: number;
  totalWealth: number; // 원 단위 누적
  hasCrimCount: number; // 전과 신고한 후보 수
}

function aggregate(race: RaceKey): DistrictAgg[] {
  const src = SOURCES[race];
  const map = new Map<string, DistrictAgg>();

  for (const [regionCode, region] of Object.entries(src)) {
    for (const c of region.candidates) {
      const district = c.district || "";
      if (!district) continue;
      const key = `${regionCode}__${district}`;
      let agg = map.get(key);
      if (!agg) {
        agg = {
          regionCode,
          regionName: region.regionName,
          district,
          n: 0,
          totalWealth: 0,
          hasCrimCount: 0,
        };
        map.set(key, agg);
      }
      agg.n += 1;
      agg.totalWealth += parseThousandWon(c.property);
      if (parseCriminalCount(c.criminalRecord) > 0) {
        agg.hasCrimCount += 1;
      }
    }
  }

  return Array.from(map.values());
}

// 모듈 레벨 캐시 (서버에서 한 번만 계산)
const CACHE: Record<RaceKey, DistrictAgg[] | null> = {
  mayor: null,
  council: null,
  local: null,
};

function getAggs(race: RaceKey): DistrictAgg[] {
  if (!CACHE[race]) CACHE[race] = aggregate(race);
  return CACHE[race]!;
}

export interface DistrictRankResult {
  found: true;
  n: number; // 해당 구·시·군 후보 수
  avgWealth: number; // 원 단위 평균
  crimRate: number; // 0~1 비율
  wealthRank: number; // 재산 평균 높은 순 (1위 = 가장 부자)
  crimRank: number; // 전과 비율 높은 순 (1위 = 가장 많은 곳)
  totalDistricts: number; // 전국 비교 풀 크기
  regionName: string;
  district: string;
}

export type DistrictRank = DistrictRankResult | { found: false };

export function getDistrictRank(
  race: RaceKey,
  regionCode: string,
  district: string,
): DistrictRank {
  const aggs = getAggs(race);
  const target = aggs.find(
    (a) => a.regionCode === regionCode && a.district === district,
  );
  if (!target) return { found: false };

  const total = aggs.length;
  const avgWealth = target.totalWealth / target.n;
  const crimRate = target.hasCrimCount / target.n;

  // 재산: 평균 높은 순 (1위 = 가장 부자)
  // 같은 값일 경우 안정적 정렬 위해 키 사용 (영향 미미)
  const wealthSorted = [...aggs].sort(
    (a, b) => b.totalWealth / b.n - a.totalWealth / a.n,
  );
  const wealthRank =
    wealthSorted.findIndex(
      (a) => a.regionCode === regionCode && a.district === district,
    ) + 1;

  // 전과: 비율 높은 순 (1위 = 가장 많은 곳)
  const crimSorted = [...aggs].sort(
    (a, b) => b.hasCrimCount / b.n - a.hasCrimCount / a.n,
  );
  const crimRank =
    crimSorted.findIndex(
      (a) => a.regionCode === regionCode && a.district === district,
    ) + 1;

  return {
    found: true,
    n: target.n,
    avgWealth,
    crimRate,
    wealthRank,
    crimRank,
    totalDistricts: total,
    regionName: target.regionName,
    district: target.district,
  };
}
