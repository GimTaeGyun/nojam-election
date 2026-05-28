"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { PartyStat } from "@/lib/partyStats";
import type { EduCriminalEntry } from "@/lib/eduCriminalStats";
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

interface GovProps {
  stats: PartyStat[];
  overall: { total: number; hasCrim: number; totalCount: number; rate: number };
}
interface EduProps {
  list: EduCriminalEntry[];
  summary: { total: number; hasCrim: number; totalCount: number; rate: number };
}

interface Props {
  gov: GovProps;
  edu: EduProps;
}

type Tab = "gov" | "edu";
const HASH_TO_TAB: Record<string, Tab> = { gov: "gov", edu: "edu" };

export function CriminalTabsView({ gov, edu }: Props) {
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

  return (
    <>
      {/* 탭 */}
      <div className="flex border-b border-paper/10 mb-8">
        <button
          onClick={() => setTabAndHash("gov")}
          className={`flex-1 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
            tab === "gov" ? "border-neon text-neon" : "border-transparent text-paper/50 hover:text-paper/80"
          }`}
        >
          시·도지사 <span className="ml-1 text-[10px] opacity-70 font-mono">{gov.overall.total}명</span>
        </button>
        <button
          onClick={() => setTabAndHash("edu")}
          className={`flex-1 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
            tab === "edu" ? "border-neon text-neon" : "border-transparent text-paper/50 hover:text-paper/80"
          }`}
        >
          교육감 <span className="ml-1 text-[10px] opacity-70 font-mono">{edu.summary.total}명</span>
        </button>
      </div>

      {tab === "gov" ? <GovView gov={gov} /> : <EduView edu={edu} />}
    </>
  );
}

function GovView({ gov }: { gov: GovProps }) {
  const { stats, overall } = gov;
  const maxRate = Math.max(...stats.map((s) => s.rate));

  return (
    <>
      <div className="text-sm text-paper/60 mb-6 leading-relaxed">
        시·도지사 후보는 정당 소속이라 <strong className="text-paper">정당별 비율</strong>로 집계합니다.
      </div>

      <section className="grid grid-cols-3 gap-2 mb-10">
        <Stat label="총 출마자" value={`${overall.total}명`} />
        <Stat label="전과 신고" value={`${overall.hasCrim}명`} accent />
        <Stat label="비율" value={`${(overall.rate * 100).toFixed(1)}%`} accent />
      </section>

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
                    className="h-full rounded-sm"
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
                    <li key={`${s.party}-${c.name}`} className="flex items-baseline gap-2 text-paper/80">
                      <span className="font-semibold">{c.name}</span>
                      <span className="text-xs text-paper/40">{c.region}</span>
                      <span className="ml-auto font-mono text-xs text-neon">{c.raw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>
    </>
  );
}

function EduView({ edu }: { edu: EduProps }) {
  const { list, summary } = edu;

  return (
    <>
      <div className="text-sm text-paper/60 mb-6 leading-relaxed">
        교육감 후보는 정당 소속이 없어 <strong className="text-paper">후보별 명단</strong>으로 집계합니다.
      </div>

      <section className="grid grid-cols-3 gap-2 mb-10">
        <Stat label="총 후보" value={`${summary.total}명`} />
        <Stat label="전과 신고" value={`${summary.hasCrim}명`} accent />
        <Stat label="비율" value={`${(summary.rate * 100).toFixed(1)}%`} accent />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tightest mb-1">전과 신고 후보 명단</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">건수 많은 순 · 클릭 시 해당 지역으로</div>

        {list.length === 0 ? (
          <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/50">
            전과 신고가 있는 교육감 후보가 없습니다.
          </div>
        ) : (
          <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
            {list.map((e, i) => (
              <Link
                key={`${e.regionCode}-${e.name}-${i}`}
                href={`/${e.regionCode}#edu`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
              >
                <span className="font-mono text-sm w-7 text-right text-paper/50 tabular-nums">
                  {i + 1}
                </span>
                <span className="font-semibold w-20 sm:w-24 truncate text-sm">{e.name}</span>
                <span className="text-[11px] text-paper/50 flex-1 truncate">{e.regionName}</span>
                <span className="font-mono text-xs text-neon font-bold tabular-nums">{e.raw}</span>
              </Link>
            ))}
          </div>
        )}
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
