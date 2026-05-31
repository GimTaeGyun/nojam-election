import Link from "next/link";
import {
  computeRegionStats,
  computeTopWealth,
  computeBottomWealth,
  computeTopCriminal,
  computePartyStats,
  getOverall,
} from "@/lib/councilorStats";
import { formatKrw } from "@/lib/parseNum";
import { ddayLabel } from "@/lib/dday";
import { buildCandidateHref } from "@/lib/candidateHref";
import type { Candidate } from "@/data/types";

export const metadata = {
  title: "시·도의원 후보 통계 — 2026 지방선거",
  description:
    "2026 6월 3일 지방선거, 전국 시·도의원 후보의 시도별 평균 재산 비교, 전국 재산 Top 20, 정당별 출마자·전과 신고 현황. 중앙선관위 공식 자료.",
  keywords: [
    "시도의원 후보",
    "광역의원",
    "지방선거 시도의원",
    "후보자 재산",
    "후보자 전과",
    "노잼선거",
    "2026 지방선거",
  ],
  openGraph: {
    title: "시·도의원 후보 통계 — 2026 지방선거",
    description:
      "전국 시·도의원 후보 · 시도별 비교 · 재산 Top 20 · 정당별 분석.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "시·도의원 통계 — 노잼선거",
    description: "전국 시·도의원 후보 · 시도별 비교 · 재산 Top 20.",
  },
  alternates: { canonical: "https://nojam.kr/stats/councilors" },
};

const PARTY_HEX: Record<Candidate["partyKey"], string> = {
  democratic: "#152484",
  ppp: "#E61E2B",
  rebuilding: "#06275E",
  reform: "#FF7920",
  justice: "#FFCD00",
  progressive: "#D6001C",
  green: "#7BBA3C",
  women: "#A50034",
  freedom: "#1B468B",
  alliance: "#3A3A3A",
  indep: "#6B7280",
};

export default function StatsCouncilorsPage() {
  const overall = getOverall();
  const regions = computeRegionStats();
  const topWealth = computeTopWealth(10);
  const bottomWealth = computeBottomWealth(10);
  const topCriminal = computeTopCriminal(20);
  const parties = computePartyStats();

  const maxRegionAvg = regions[0]?.avgWealth ?? 1;
  const maxTopWealth = topWealth[0]?.wealth ?? 1;
  const maxTopCriminal = topCriminal[0]?.count ?? 1;
  const maxPartyTotal = parties[0]?.total ?? 1;

  return (
    <article className="py-10">
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            시·도의원 <span className="text-neon">통계</span>
          </h1>
          <span className="font-mono text-xs text-paper/40">{ddayLabel()}</span>
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          2026 제9회 전국동시지방선거 <strong className="text-paper">광역의원 후보 {overall.total.toLocaleString()}명 · {overall.constituencyCount}개 선거구 전수</strong>.
          중앙선관위 공개 자료를 시도별·정당별로 집계했습니다.
        </p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
        <Stat label="총 후보" value={`${overall.total.toLocaleString()}명`} />
        <Stat label="선거구" value={`${overall.constituencyCount}개`} />
        <Stat label="평균 재산" value={formatKrw(overall.avgWealth)} accent />
        <Stat
          label="전과 신고"
          value={`${overall.hasCrim}명 (${(overall.crimRate * 100).toFixed(0)}%)`}
          accent
        />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-black tracking-tightest mb-1">시도별 평균 재산</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">평균 큰 순</div>

        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {regions.map((r, i) => {
            const pct = maxRegionAvg > 0 ? (r.avgWealth / maxRegionAvg) * 100 : 0;
            const isTop = i === 0;
            return (
              <Link
                key={r.regionCode}
                href={`/${r.regionCode}#council`}
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
              >
                <span
                  className={`font-mono text-sm w-6 text-right tabular-nums ${
                    isTop ? "text-neon font-bold" : "text-paper/50"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-semibold w-16 sm:w-20 truncate text-sm">{r.shortName}</span>
                <span className="text-[10px] text-paper/40 hidden sm:inline-block w-24">
                  {r.totalCount}명 · {r.constituencyCount}선거구
                </span>
                <div className="flex-1 h-5 bg-paper/[0.04] rounded-sm relative overflow-hidden min-w-0">
                  <div
                    className="absolute left-0 top-0 h-full rounded-sm"
                    style={{
                      width: `${Math.max(pct, 0.5)}%`,
                      background: isTop ? "#d4ff00" : "rgba(212,255,0,0.55)",
                    }}
                  />
                </div>
                <span
                  className={`font-mono text-xs min-w-[90px] sm:min-w-[110px] text-right shrink-0 tabular-nums ${
                    isTop ? "text-neon font-bold" : "text-paper/85"
                  }`}
                >
                  {formatKrw(r.avgWealth)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-black tracking-tightest mb-1">전국 재산 Top 10</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">전국 {overall.total.toLocaleString()}명 중 상위</div>

        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {topWealth.map((e) => {
            const pct = (e.wealth / maxTopWealth) * 100;
            const isTop = e.rank === 1;
            const hex = PARTY_HEX[e.partyKey] ?? PARTY_HEX.indep;
            return (
              <Link
                key={`${e.regionCode}-${e.constituency}-${e.name}-${e.rank}`}
                href={buildCandidateHref({ regionCode: e.regionCode, race: "council", name: e.name, district: e.district })}
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
              >
                <span
                  className={`font-mono text-sm w-7 text-right tabular-nums ${
                    isTop ? "text-neon font-bold" : "text-paper/50"
                  }`}
                >
                  {e.rank}
                </span>
                <span className="font-semibold w-16 sm:w-20 truncate text-sm">{e.name}</span>
                <span
                  className="hidden sm:inline-block w-1 h-3 rounded-sm shrink-0"
                  style={{ background: hex }}
                  aria-hidden
                />
                <span className="text-[10px] text-paper/50 hidden sm:inline-block w-20 truncate">
                  {e.party}
                </span>
                <span className="text-[10px] text-paper/40 truncate flex-shrink min-w-0 hidden md:inline">
                  {e.shortName} {e.constituency}
                </span>
                <span className="text-[10px] text-paper/40 truncate md:hidden">
                  {e.constituency}
                </span>
                <div className="flex-1 h-5 bg-paper/[0.04] rounded-sm relative overflow-hidden min-w-0">
                  <div
                    className="absolute left-0 top-0 h-full rounded-sm"
                    style={{
                      width: `${Math.max(pct, 0.5)}%`,
                      background: isTop ? "#d4ff00" : "rgba(212,255,0,0.55)",
                    }}
                  />
                </div>
                <span
                  className={`font-mono text-xs min-w-[90px] sm:min-w-[110px] text-right shrink-0 tabular-nums ${
                    isTop ? "text-neon font-bold" : "text-paper/85"
                  }`}
                >
                  {formatKrw(e.wealth)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 전국 재산 하위 10 */}
      <section className="mb-12">
        <h2 className="text-xl font-black tracking-tightest mb-1">전국 재산 하위 10</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">재산 신고액 적은 순</div>

        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {bottomWealth.map((e) => {
            const hex = PARTY_HEX[e.partyKey] ?? PARTY_HEX.indep;
            return (
              <Link
                key={`bw-${e.regionCode}-${e.constituency}-${e.name}-${e.rank}`}
                href={buildCandidateHref({ regionCode: e.regionCode, race: "council", name: e.name, district: e.district })}
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
              >
                <span className="font-mono text-sm w-7 text-right tabular-nums text-paper/50">
                  {e.rank}
                </span>
                <span className="font-semibold w-16 sm:w-20 truncate text-sm">{e.name}</span>
                <span
                  className="hidden sm:inline-block w-1 h-3 rounded-sm shrink-0"
                  style={{ background: hex }}
                  aria-hidden
                />
                <span className="text-[10px] text-paper/50 hidden sm:inline-block w-20 truncate">
                  {e.party}
                </span>
                <span className="text-[10px] text-paper/40 truncate flex-1 min-w-0">
                  {e.shortName} {e.constituency}
                </span>
                <span className="font-mono text-xs min-w-[90px] sm:min-w-[110px] text-right shrink-0 tabular-nums text-paper/85">
                  {formatKrw(e.wealth)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 전국 전과 신고 Top 20 */}
      <section className="mb-12">
        <h2 className="text-xl font-black tracking-tightest mb-1">전국 전과 신고 Top 20</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">건수 많은 순 · 클릭 시 해당 구·시·군으로</div>

        {topCriminal.length === 0 ? (
          <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/50 text-sm">
            전과 신고가 있는 후보가 없습니다.
          </div>
        ) : (
          <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
            {topCriminal.map((e) => {
              const pct = (e.count / maxTopCriminal) * 100;
              const isTop = e.rank === 1;
              const hex = PARTY_HEX[e.partyKey] ?? PARTY_HEX.indep;
              return (
                <Link
                  key={`crim-${e.regionCode}-${e.constituency}-${e.name}-${e.rank}`}
                  href={buildCandidateHref({ regionCode: e.regionCode, race: "council", name: e.name, district: e.district })}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
                >
                  <span
                    className={`font-mono text-sm w-7 text-right tabular-nums ${
                      isTop ? "text-neon font-bold" : "text-paper/50"
                    }`}
                  >
                    {e.rank}
                  </span>
                  <span className="font-semibold w-16 sm:w-20 truncate text-sm">{e.name}</span>
                  <span
                    className="hidden sm:inline-block w-1 h-3 rounded-sm shrink-0"
                    style={{ background: hex }}
                    aria-hidden
                  />
                  <span className="text-[10px] text-paper/50 hidden sm:inline-block w-20 truncate">
                    {e.party}
                  </span>
                  <span className="text-[10px] text-paper/40 hidden md:inline-block truncate flex-shrink min-w-0">
                    {e.shortName} {e.constituency}
                  </span>
                  <span className="text-[10px] text-paper/40 md:hidden truncate">{e.constituency}</span>
                  <div className="flex-1 h-5 bg-paper/[0.04] rounded-sm relative overflow-hidden min-w-0">
                    <div
                      className="absolute left-0 top-0 h-full rounded-sm"
                      style={{
                        width: `${Math.max(pct, 2)}%`,
                        background: isTop ? "#d4ff00" : "rgba(212,255,0,0.55)",
                      }}
                    />
                  </div>
                  <span
                    className={`font-mono text-xs min-w-[55px] sm:min-w-[70px] text-right shrink-0 tabular-nums ${
                      isTop ? "text-neon font-bold" : "text-paper/85"
                    }`}
                  >
                    {e.raw}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-black tracking-tightest mb-1">정당별 출마자 / 전과 신고</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">출마자 수 많은 순</div>

        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {parties.map((s) => {
            const pct = maxPartyTotal > 0 ? (s.total / maxPartyTotal) * 100 : 0;
            return (
              <div key={s.party} className="p-4 hover:bg-paper/[0.03] transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: PARTY_HEX[s.partyKey] ?? PARTY_HEX.indep }}
                    aria-hidden
                  />
                  <span className="font-bold text-base w-28 sm:w-32 truncate">{s.party}</span>
                  <span className="text-xs text-paper/60 font-mono">
                    {s.total.toLocaleString()}명 출마
                  </span>
                  {s.hasCrim > 0 && (
                    <span className="ml-auto text-xs text-paper/70">
                      전과 <span className="text-neon font-bold">{s.hasCrim}명</span> ({(s.rate * 100).toFixed(0)}%)
                    </span>
                  )}
                </div>
                <div className="h-2 bg-paper/[0.04] rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: `${pct}%`,
                      background: "rgba(212,255,0,0.55)",
                    }}
                  />
                </div>
                {s.totalCrimCount > 0 && (
                  <div className="mt-2 text-[11px] text-paper/40 font-mono">
                    전과 총 {s.totalCrimCount.toLocaleString()}건
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="border border-neon/40 bg-neon/[0.04] rounded-lg p-5 mb-10">
        <div className="text-[11px] font-mono text-neon/80 mb-2">⚠︎ 이 표를 보실 때 알아두실 점</div>
        <ul className="text-sm text-paper/85 leading-relaxed space-y-2">
          <li>
            <strong className="text-paper">재산은 후보 본인 신고액</strong>, <strong className="text-paper">전과는 본인 신고 건수</strong>입니다.
            종류는 별도이며 후보 본인 정보공개 자료(선관위)에서 확인 가능합니다.
          </li>
          <li>
            시도별 평균은 후보 1인당 평균입니다. 한 시도 안에서도 선거구별 격차는 큽니다.
          </li>
          <li>
            본 사이트는 특정 후보를 지지·반대하지 않습니다. 단순 팩트 정리이며, 해석은 독자께 맡깁니다.
          </li>
        </ul>
      </section>

      <section className="text-sm text-paper/60 leading-relaxed mb-6 text-center border-t border-paper/10 pt-6">
        본인 선거구 후보 자세히 보려면{" "}
        <Link href="/" className="text-neon underline">
          메인 → 시·도 선택 → 시·도의원 탭 → 구·시·군 선택
        </Link>
      </section>

      <section className="text-xs text-paper/40 leading-relaxed border-t border-paper/10 pt-4">
        <p>
          데이터 출처:{" "}
          <a href="https://info.nec.go.kr" target="_blank" rel="noreferrer" className="text-neon underline">
            중앙선거관리위원회 선거통계시스템
          </a>{" "}
          후보자 명부 (추출일: 2026-05-29).
        </p>
      </section>
    </article>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-paper/10 rounded-lg p-3">
      <div className="text-[10px] font-mono text-paper/40">{label}</div>
      <div
        className={`text-base sm:text-xl font-black tracking-tightest mt-1 ${
          accent ? "text-neon" : "text-paper"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
