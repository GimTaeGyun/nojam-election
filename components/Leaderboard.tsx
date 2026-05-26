"use client";

import { useState, useMemo } from "react";
import type { Candidate } from "@/data/types";
import {
  sortCandidates,
  parseThousandWon,
  formatKrw,
  parseCriminalCount,
  parseRunCount,
  type SortKey,
} from "@/lib/parseNum";

const TABS: { key: SortKey; label: string }[] = [
  { key: "property_desc", label: "재산 ↓" },
  { key: "age_asc",       label: "어린 순" },
  { key: "age_desc",      label: "나이 많은 순" },
  { key: "criminal_desc", label: "전과 많은 순" },
  { key: "tax_desc",      label: "납세 많은 순" },
  { key: "run_desc",      label: "출마 베테랑" },
];

// 정당색 (PartyChip과 동일)
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

function valueFor(c: Candidate, key: SortKey): { num: number; label: string } {
  switch (key) {
    case "property_desc":
    case "property_asc": {
      const n = parseThousandWon(c.property);
      return { num: n, label: formatKrw(n) };
    }
    case "age_desc":
    case "age_asc":
      return { num: c.age ?? 0, label: `${c.age ?? "—"}세` };
    case "criminal_desc": {
      const n = parseCriminalCount(c.criminalRecord);
      return { num: n, label: n === 0 ? "없음" : `${n}건` };
    }
    case "tax_desc": {
      const n = parseThousandWon(c.taxPaid);
      return { num: n, label: formatKrw(n) };
    }
    case "run_desc": {
      const n = parseRunCount(c.runCount);
      return { num: n, label: c.runCount ?? "—" };
    }
  }
}

export function Leaderboard({ candidates }: { candidates: Candidate[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("property_desc");

  const { sorted, max } = useMemo(() => {
    const s = sortCandidates(candidates, sortKey);
    const m = Math.max(1, ...s.map((c) => valueFor(c, sortKey).num));
    return { sorted: s, max: m };
  }, [candidates, sortKey]);

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[11px] font-mono text-neon/70">랭킹</div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tightest">
            기준 바꿔서 비교
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {TABS.map((t) => {
          const active = sortKey === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setSortKey(t.key)}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-colors ${
                active
                  ? "bg-neon text-ink"
                  : "border border-paper/15 text-paper/70 hover:border-paper/40"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
        {sorted.map((c, idx) => {
          const v = valueFor(c, sortKey);
          const pct = max === 0 ? 0 : Math.max(2, (v.num / max) * 100);
          const isTop = idx === 0 && v.num > 0;
          const hex = PARTY_HEX[c.partyKey] ?? PARTY_HEX.indep;
          return (
            <a
              key={`${c.number}-${c.name}`}
              href={`#candidate-${c.number}`}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-paper/[0.03] transition-colors"
            >
              <span
                className={`font-mono text-sm w-6 text-right ${
                  isTop ? "text-neon font-bold" : "text-paper/50"
                }`}
              >
                {idx + 1}
              </span>
              <span className="text-sm font-semibold w-16 sm:w-20 truncate">
                {c.name}
              </span>
              <span className="text-[10px] text-paper/50 w-16 sm:w-20 truncate hidden sm:block">
                {c.party}
              </span>
              <span
                className="hidden sm:inline-block w-1 h-3 rounded-sm shrink-0"
                style={{ background: hex }}
                aria-hidden
              />
              <div className="flex-1 h-5 bg-paper/[0.04] rounded-sm relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-sm"
                  style={{
                    width: `${pct}%`,
                    background: isTop ? "#d4ff00" : "rgba(212,255,0,0.55)",
                  }}
                />
              </div>
              <span
                className={`font-mono text-xs min-w-[70px] sm:min-w-[90px] text-right shrink-0 ${
                  isTop ? "text-neon font-bold" : "text-paper/85"
                }`}
              >
                {v.label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
