import { getDistrictRank, type RaceKey } from "@/lib/districtRank";
import { formatKrw } from "@/lib/parseNum";

interface Props {
  race: RaceKey;
  regionCode: string;
  district: string;
}

const RACE_LABEL: Record<RaceKey, string> = {
  mayor: "구청장·시장·군수",
  council: "시·도의원",
  local: "구·시·군의원",
};

// 백분위 라벨 (100% = 1위, 0% = 꼴찌). 재산 기준 "상위 ?%" 표기용.
function topPercentile(rank: number, total: number): number {
  return Math.max(0, Math.min(100, ((rank - 1) / total) * 100));
}

// 전과 비율 위치 라벨 (1위 = 가장 많은 곳이라 등수 직관 어려움)
function crimZone(rank: number, total: number): { label: string; tone: "high" | "mid" | "low" } {
  const pct = (rank - 1) / total; // 0 = 가장 많은 곳, 1 = 가장 적은 곳
  if (pct < 0.2) return { label: "전과 많은 편", tone: "high" };
  if (pct > 0.8) return { label: "전과 적은 편", tone: "low" };
  return { label: "중간", tone: "mid" };
}

export function DistrictRankCard({ race, regionCode, district }: Props) {
  const rank = getDistrictRank(race, regionCode, district);
  if (!rank.found) return null;

  const { n, avgWealth, crimRate, wealthRank, crimRank, totalDistricts } = rank;
  const wealthPct = topPercentile(wealthRank, totalDistricts);
  const crim = crimZone(crimRank, totalDistricts);
  const raceLabel = RACE_LABEL[race];
  const lowSample = n < 3;

  // 재산 막대: 등수 높을수록(=부자일수록) 막대 길게
  const wealthBarWidth = Math.max(2, 100 - wealthPct);
  // 전과 막대: 1위(가장 많은 곳)이 100%, 꼴찌가 0%
  const crimBarWidth = Math.max(2, 100 - ((crimRank - 1) / totalDistricts) * 100);

  const crimToneClasses =
    crim.tone === "high"
      ? "text-neon"
      : crim.tone === "low"
      ? "text-paper/85"
      : "text-paper/70";

  return (
    <section className="border border-paper/15 rounded-xl p-4 sm:p-5 bg-paper/[0.02] mb-6">
      <div className="flex items-baseline justify-between mb-1 gap-2 flex-wrap">
        <div>
          <div className="text-[10px] font-mono text-neon/70">{district} · {raceLabel}</div>
          <h3 className="text-base sm:text-lg font-black tracking-tightest mt-0.5">
            {district}는 전국에서 몇 등?
          </h3>
        </div>
        <span className="text-[10px] font-mono text-paper/40">
          후보 {n}명{lowSample ? " (표본 작음)" : ""} · 전국 {totalDistricts}개 구·시·군 비교
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {/* 재산 */}
        <div className="border border-neon/40 bg-neon/[0.04] rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base" aria-hidden>💰</span>
            <span className="text-[10px] font-mono text-neon/80">평균 재산</span>
          </div>
          <div className="text-lg sm:text-xl font-black tracking-tightest tabular-nums mt-1">
            {formatKrw(avgWealth)}
          </div>
          <div className="text-xs text-neon font-bold mt-1 tabular-nums">
            전국 {wealthRank}위 <span className="text-paper/40 font-normal text-[10px]">/ {totalDistricts}</span>
          </div>
          <div className="h-[3px] bg-paper/10 rounded-sm mt-1.5 overflow-hidden">
            <div
              className="h-full bg-neon rounded-sm"
              style={{ width: `${wealthBarWidth}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-paper/40 mt-1">
            상위 {wealthPct.toFixed(1)}%
          </div>
        </div>

        {/* 전과 */}
        <div className="border border-paper/15 rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base" aria-hidden>📋</span>
            <span className="text-[10px] font-mono text-paper/60">전과 신고 비율</span>
          </div>
          <div className="text-lg sm:text-xl font-black tracking-tightest tabular-nums mt-1">
            {(crimRate * 100).toFixed(1)}%
          </div>
          <div className={`text-xs font-bold mt-1 tabular-nums ${crimToneClasses}`}>
            전국 {crimRank}위 <span className="text-paper/40 font-normal text-[10px]">/ {totalDistricts}</span>
          </div>
          <div className="h-[3px] bg-paper/10 rounded-sm mt-1.5 overflow-hidden">
            <div
              className="h-full bg-neon/55 rounded-sm"
              style={{ width: `${crimBarWidth}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-paper/40 mt-1">
            {crim.label}
          </div>
        </div>
      </div>

      <p className="text-[10px] text-paper/40 leading-relaxed mt-2.5">
        ※ 후보 {n}명의 신고값 평균. 후보 개개인의 사정은 다 다릅니다. 같은 선거직(<strong className="text-paper/60">{raceLabel}</strong>)끼리만 비교한 등수입니다.
      </p>
    </section>
  );
}
