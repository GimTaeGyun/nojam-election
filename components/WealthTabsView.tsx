"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { WealthEntry } from "@/lib/wealthStats";
import { formatKrw } from "@/lib/parseNum";
import { buildCandidateHref } from "@/lib/candidateHref";
import type { Candidate } from "@/data/types";

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

interface Summary {
  total: number;
  avg: number;
  over10b: number;
  gap: number;
  top: WealthEntry | undefined;
  bottom: WealthEntry | undefined;
}

interface Props {
  govRanking: WealthEntry[];
  govSummary: Summary;
  eduRanking: WealthEntry[];
  eduSummary: Summary;
}

type Tab = "gov" | "edu";
const HASH_TO_TAB: Record<string, Tab> = { gov: "gov", edu: "edu" };

export function WealthTabsView({ govRanking, govSummary, eduRanking, eduSummary }: Props) {
  const [tab, setTab] = useState<Tab>("gov");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    const t = HASH_TO_TAB[hash];
    if (t) setTab(t);
  }, []);

  const setTabAndHash = (t: Tab) => {
    setTab(t);
    if (typeof window !== "undefined") {
      history.replaceState(null, "", `#${t}`);
    }
  };

  const isGov = tab === "gov";
  const ranking = isGov ? govRanking : eduRanking;
  const summary = isGov ? govSummary : eduSummary;
  const maxWealth = ranking[0]?.wealthWon ?? 1;
  const raceLabel = isGov ? "시·도지사" : "교육감";
  const showParty = isGov; // 교육감은 정당 무의미

  return (
    <>
      {/* 탭 전환 */}
      <div className="flex border-b border-paper/10 mb-8">
        <button
          onClick={() => setTabAndHash("gov")}
          className={`flex-1 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
            isGov ? "border-neon text-neon" : "border-transparent text-paper/50 hover:text-paper/80"
          }`}
        >
          시·도지사 <span className="ml-1 text-[10px] opacity-70 font-mono">{govRanking.length}명</span>
        </button>
        <button
          onClick={() => setTabAndHash("edu")}
          className={`flex-1 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
            !isGov ? "border-neon text-neon" : "border-transparent text-paper/50 hover:text-paper/80"
          }`}
        >
          교육감 <span className="ml-1 text-[10px] opacity-70 font-mono">{eduRanking.length}명</span>
        </button>
      </div>

      {/* 요약 통계 */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
        <Stat label="총 후보" value={`${summary.total}명`} />
        <Stat label="평균 재산" value={formatKrw(summary.avg)} accent />
        <Stat label="10억 이상" value={`${summary.over10b}명`} accent />
        <Stat label="1위 ÷ 꼴찌" value={summary.gap > 0 ? `${summary.gap}배` : "—"} accent />
      </section>

      {/* Top-Bottom */}
      {summary.top && summary.bottom && (
        <section className="grid grid-cols-2 gap-3 mb-10">
          <div className="border border-neon/40 bg-neon/[0.04] rounded-xl p-4">
            <div className="text-[10px] font-mono text-neon/80">최고 부자 ({raceLabel})</div>
            <Link
              href={buildCandidateHref({ regionCode: summary.top.regionCode, race: isGov ? "gov" : "edu", name: summary.top.name })}
              className="block text-xl font-black tracking-tightest mt-1 hover:text-neon"
            >
              {summary.top.name}
            </Link>
            <div className="text-xs text-paper/60 mt-1">
              {showParty ? `${summary.top.party} · ` : ""}{summary.top.regionName}
            </div>
            <div className="text-base text-neon font-bold mt-2 tabular-nums">
              {formatKrw(summary.top.wealthWon)}
            </div>
          </div>
          <div className="border border-paper/15 rounded-xl p-4">
            <div className="text-[10px] font-mono text-paper/50">최저 재산 ({raceLabel})</div>
            <Link
              href={buildCandidateHref({ regionCode: summary.bottom.regionCode, race: isGov ? "gov" : "edu", name: summary.bottom.name })}
              className="block text-xl font-black tracking-tightest mt-1 hover:text-neon"
            >
              {summary.bottom.name}
            </Link>
            <div className="text-xs text-paper/60 mt-1">
              {showParty ? `${summary.bottom.party} · ` : ""}{summary.bottom.regionName}
            </div>
            <div className="text-base font-bold mt-2 tabular-nums">
              {formatKrw(summary.bottom.wealthWon)}
            </div>
          </div>
        </section>
      )}

      {/* 전체 랭킹 */}
      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tightest mb-1">{raceLabel} 전체 순위</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">재산 신고액 많은 순 · 클릭 시 해당 지역으로</div>

        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {ranking.map((e) => {
            const pct = (e.wealthWon / maxWealth) * 100;
            const isTop = e.rank === 1;
            const hex = PARTY_HEX[e.partyKey] ?? PARTY_HEX.indep;
            return (
              <Link
                key={`${e.regionCode}-${e.name}-${e.rank}`}
                href={buildCandidateHref({ regionCode: e.regionCode, race: isGov ? "gov" : "edu", name: e.name })}
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
                {showParty && (
                  <span
                    className="hidden sm:inline-block w-1 h-3 rounded-sm shrink-0"
                    style={{ background: hex }}
                    aria-hidden
                  />
                )}
                {showParty && (
                  <span className="text-[10px] text-paper/50 hidden sm:inline-block w-20 truncate">
                    {e.party}
                  </span>
                )}
                <span className="text-[10px] text-paper/40 hidden md:inline-block w-24 truncate">
                  {e.regionName}
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
                  {formatKrw(e.wealthWon)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-paper/10 rounded-lg p-3">
      <div className="text-[10px] font-mono text-paper/40">{label}</div>
      <div
        className={`text-xl sm:text-2xl font-black tracking-tightest mt-1 ${
          accent ? "text-neon" : "text-paper"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
