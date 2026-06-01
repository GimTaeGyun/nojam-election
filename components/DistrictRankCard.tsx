import {
  getDistrictRank,
  getDistrictsTopBottom,
  type RaceKey,
  type DistrictEntry,
  type DistrictMetric,
} from "@/lib/districtRank";
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

export function DistrictRankCard({ race, regionCode, district }: Props) {
  const rank = getDistrictRank(race, regionCode, district);
  if (!rank.found) return null;

  const { n, avgWealth, totalCrim, wealthRank, crimRank, totalDistricts } = rank;
  const wealthPct = topPercentile(wealthRank, totalDistricts);
  const raceLabel = RACE_LABEL[race];
  const lowSample = n < 3;

  // 재산 막대: 등수 높을수록(=부자일수록) 막대 길게
  const wealthBarWidth = Math.max(2, 100 - wealthPct);
  // 전과 막대: 1위(가장 많은 곳)이 100%, 꼴찌가 0%
  const crimBarWidth = totalCrim > 0
    ? Math.max(2, 100 - ((crimRank - 1) / totalDistricts) * 100)
    : 0;

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
            <span className="text-[10px] font-mono text-paper/60">전과 신고 건수 합</span>
          </div>
          <div className="text-lg sm:text-xl font-black tracking-tightest tabular-nums mt-1">
            {totalCrim}<span className="text-xs text-paper/50 ml-1">건</span>
          </div>
          {totalCrim > 0 ? (
            <>
              <div className="text-xs text-paper/85 font-bold mt-1 tabular-nums">
                전국 {crimRank}위 <span className="text-paper/40 font-normal text-[10px]">/ {totalDistricts}</span>
              </div>
              <div className="h-[3px] bg-paper/10 rounded-sm mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-neon/55 rounded-sm"
                  style={{ width: `${crimBarWidth}%` }}
                />
              </div>
              <div className="text-[9px] font-mono text-paper/40 mt-1">
                후보 1인당 평균 {(totalCrim / n).toFixed(1)}건
              </div>
            </>
          ) : (
            <div className="text-xs text-paper/50 mt-1">
              전과 신고 후보 없음
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-paper/40 leading-relaxed mt-2.5">
        ※ 후보 {n}명의 신고값 평균. 후보 개개인의 사정은 다 다릅니다. 같은 선거직(<strong className="text-paper/60">{raceLabel}</strong>)끼리만 비교한 등수입니다.
      </p>

      {/* 전국 Top 5 / Bottom 5 — 같은 race 기준 */}
      <TopBottomLists race={race} regionCode={regionCode} district={district} raceLabel={raceLabel} />
    </section>
  );
}

function TopBottomLists({
  race,
  regionCode,
  district,
  raceLabel,
}: {
  race: RaceKey;
  regionCode: string;
  district: string;
  raceLabel: string;
}) {
  const wealth = getDistrictsTopBottom(race, "wealth", 5);
  const crim = getDistrictsTopBottom(race, "crim", 5);

  return (
    <div className="mt-4 pt-4 border-t border-paper/10">
      <div className="text-[11px] font-mono text-paper/50 mb-2">
        전국 {raceLabel} 동네 Top 5
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <RankList
          title="💰 평균 재산 (부자 동네)"
          entries={wealth.top}
          mineRegionCode={regionCode}
          mineDistrict={district}
          metric="wealth"
          highlightTone="top"
        />
        <RankList
          title="📋 전과 신고 건수 합"
          entries={crim.top}
          mineRegionCode={regionCode}
          mineDistrict={district}
          metric="crim"
          highlightTone="top"
        />
      </div>
    </div>
  );
}

function formatEntryValue(e: DistrictEntry, metric: DistrictMetric): string {
  if (metric === "wealth") return formatKrw(e.value);
  return `${e.value}건`;
}

function RankList({
  title,
  entries,
  mineRegionCode,
  mineDistrict,
  metric,
  highlightTone,
}: {
  title: string;
  entries: DistrictEntry[];
  mineRegionCode: string;
  mineDistrict: string;
  metric: DistrictMetric;
  highlightTone: "top" | "bottom";
}) {
  return (
    <div className="border border-paper/10 rounded-lg p-3 bg-ink/40">
      <div className="text-[10px] font-mono text-paper/60 mb-2">{title}</div>
      <ol className="space-y-1">
        {entries.map((e) => {
          const mine = e.regionCode === mineRegionCode && e.district === mineDistrict;
          const lowSample = e.n < 3;
          // 전과 0건은 동률이 많아 순위 자체가 무의미. 숫자 숨김.
          const hideRank = metric === "crim" && e.value === 0;
          return (
            <li
              key={`${e.regionCode}-${e.district}`}
              className={`flex items-baseline gap-2 px-2 py-1 rounded ${
                mine ? "bg-neon/15 ring-1 ring-neon/40" : ""
              }`}
            >
              <span
                className={`font-mono text-xs tabular-nums w-6 text-right shrink-0 ${
                  mine ? "text-neon font-bold" : "text-paper/50"
                }`}
              >
                {hideRank ? "—" : e.rank}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs truncate ${
                    mine ? "text-neon font-bold" : "text-paper/85"
                  }`}
                >
                  {e.regionName} {e.district}
                  {mine && <span className="ml-1 text-[9px] font-mono">← 우리 동네</span>}
                </div>
                <div className="text-[9px] font-mono text-paper/40">
                  n={e.n}
                  {lowSample && " · 표본 작음"}
                </div>
              </div>
              <span
                className={`font-mono text-xs tabular-nums shrink-0 ${
                  highlightTone === "top" ? "text-neon" : "text-paper/70"
                }`}
              >
                {formatEntryValue(e, metric)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
