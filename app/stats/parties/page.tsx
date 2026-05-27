import Link from "next/link";
import { computePartyStats, getOverallStats } from "@/lib/partyStats";
import { ddayLabel } from "@/lib/dday";
import type { Candidate } from "@/data/types";

export const metadata = {
  title: "정당별 출마자 전과 신고 현황",
  description:
    "2026 지방선거 시·도지사 후보 정당별 전과 신고 비율. 선관위 공개 자료 기준. 한 곳에서 다 본다.",
};

// PartyChip과 동일한 색
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

export default function StatsPartiesPage() {
  const stats = computePartyStats();
  const overall = getOverallStats();

  const top = stats[0];
  const maxRate = Math.max(...stats.map((s) => s.rate));

  return (
    <article className="py-10">
      {/* 헤더 */}
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            정당별 <span className="text-neon">전과 신고</span> 현황
          </h1>
          <span className="font-mono text-xs text-paper/40">{ddayLabel()}</span>
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          2026 제9회 전국동시지방선거 <strong className="text-paper">시·도지사 후보</strong> 한정.
          중앙선관위가 공개한 후보자 명부의 "전과기록유무(건수)" 항목을 정당별로 집계한 자료입니다.
        </p>
      </header>

      {/* 전체 통계 카드 */}
      <section className="grid grid-cols-3 gap-2 mb-10">
        <Stat label="총 출마자" value={`${overall.total}명`} />
        <Stat label="전과 신고" value={`${overall.hasCrim}명`} accent />
        <Stat label="비율" value={`${(overall.rate * 100).toFixed(1)}%`} accent />
      </section>

      {/* 정당별 표 + 막대 */}
      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tightest mb-1">정당별 출마자 / 전과 신고</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">출마자 수 많은 순</div>

        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {stats.map((s) => {
            const pctBar = maxRate > 0 ? (s.rate / maxRate) * 100 : 0;
            const isAllCrim = s.rate === 1 && s.total > 0;
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
                    {s.hasCrim} / {s.total}
                  </span>
                  <div className="ml-auto flex items-baseline gap-1">
                    <span
                      className={`font-mono text-lg font-black tabular-nums ${
                        isAllCrim ? "text-neon" : "text-paper/90"
                      }`}
                    >
                      {(s.rate * 100).toFixed(0)}
                    </span>
                    <span className="text-xs text-paper/50">%</span>
                  </div>
                </div>

                <div className="h-2 bg-paper/[0.04] rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{
                      width: `${pctBar}%`,
                      background: isAllCrim ? "#d4ff00" : "rgba(212,255,0,0.55)",
                    }}
                  />
                </div>

                {s.totalCrimCount > 0 && (
                  <div className="mt-2 text-[11px] text-paper/40 font-mono">
                    총 {s.totalCrimCount}건 · 1인당 평균 {s.avgPerPerson.toFixed(1)}건
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 명시적 주석 — 매우 중요 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-lg p-5 mb-10">
        <div className="text-[11px] font-mono text-neon/80 mb-2">⚠︎ 이 표를 보실 때 알아두실 점</div>
        <ul className="text-sm text-paper/85 leading-relaxed space-y-2">
          <li>
            <strong className="text-paper">전과의 "건수"만 표시되며 종류는 별도</strong>입니다.
            전과는 음주운전·도로교통법 위반 같은 일반 범죄부터, 노동운동·집회 시위 관련
            (집시법·노조법 위반), 선거법 위반 등 매우 다양한 카테고리를 포함합니다.
          </li>
          <li>
            전과 건수만으로 후보의 자질을 판단하시면 곤란합니다. 종류별로 의미가 크게 다릅니다.
            구체적인 죄목은 후보 본인의 정보공개 자료(선관위 사이트)에서 확인하세요.
          </li>
          <li>
            출마자 수가 적은 정당(1~5명)은 비율 변동이 크니 참고용으로만 보세요. 단 1명 출마에 전과
            1건이면 100%가 됩니다.
          </li>
          <li>
            본 사이트는 특정 정당·후보를 지지하거나 반대하지 않습니다. 단순 팩트 정리이며,
            해석은 독자께 맡깁니다.
          </li>
        </ul>
      </section>

      {/* 전과 신고 후보 명단 */}
      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tightest mb-1">전과 신고 후보 명단</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">정당별, 건수 많은 순</div>

        <div className="space-y-4">
          {stats
            .filter((s) => s.hasCrim > 0)
            .sort((a, b) => b.hasCrim - a.hasCrim)
            .map((s) => (
              <div key={s.party} className="border border-paper/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: PARTY_HEX[s.partyKey] ?? PARTY_HEX.indep }}
                    aria-hidden
                  />
                  <span className="font-bold">{s.party}</span>
                  <span className="text-xs text-paper/50 font-mono">
                    {s.hasCrim}명 · 총 {s.totalCrimCount}건
                  </span>
                </div>
                <ul className="space-y-1 text-sm">
                  {s.candidates.map((c) => (
                    <li
                      key={`${s.party}-${c.name}`}
                      className="flex items-baseline gap-2 text-paper/80"
                    >
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-xs text-paper/40">{c.region}</span>
                      <span className="ml-auto font-mono text-xs text-neon">
                        {c.raw}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      {/* 출처 + 풋터 안내 */}
      <section className="text-xs text-paper/40 leading-relaxed border-t border-paper/10 pt-4">
        <p>
          데이터 출처:{" "}
          <a
            href="https://info.nec.go.kr"
            target="_blank"
            rel="noreferrer"
            className="text-neon underline"
          >
            중앙선거관리위원회 선거통계시스템
          </a>{" "}
          후보자 명부 (추출일: 2026-05-26).
        </p>
        <p className="mt-1">
          오류·정정 요청은{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdjGx_x7QkvQvM2-GWZ7M8KrqFCRS-Crp6CAfmNav-MhWJp7g/viewform"
            target="_blank"
            rel="noreferrer"
            className="text-neon underline"
          >
            문의 폼
          </a>
          으로 보내주세요.
        </p>
      </section>
    </article>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-paper/10 rounded-lg p-4">
      <div className="text-[10px] font-mono text-paper/40">{label}</div>
      <div
        className={`text-2xl sm:text-3xl font-black tracking-tightest mt-1 ${
          accent ? "text-neon" : "text-paper"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
