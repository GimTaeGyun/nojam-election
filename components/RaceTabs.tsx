"use client";

import { useState, useEffect } from "react";
import type { Race } from "@/data/types";
import { Recordboard } from "./Recordboard";
import { Leaderboard } from "./Leaderboard";
import { CandidateCard } from "./CandidateCard";
import { formatThousandWonAsKrw } from "@/lib/parseNum";

// URL hash ↔ race.type 매핑
const HASH_TO_TYPE: Record<string, Race["type"]> = {
  governor: "광역단체장",
  edu: "교육감",
  mayor: "기초단체장",
};
const TYPE_TO_HASH: Record<Race["type"], string> = {
  광역단체장: "governor",
  교육감: "edu",
  기초단체장: "mayor",
};

const TAB_LABEL: Record<Race["type"], string> = {
  광역단체장: "시·도지사",
  교육감: "교육감",
  기초단체장: "구청장",
};

export function RaceTabs({ races }: { races: Race[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    const targetType = HASH_TO_TYPE[hash];
    if (targetType) {
      const idx = races.findIndex((r) => r.type === targetType);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [races]);

  const handleTab = (idx: number) => {
    setActiveIdx(idx);
    const race = races[idx];
    const hashKey = TYPE_TO_HASH[race.type];
    if (hashKey && typeof window !== "undefined") {
      history.replaceState(null, "", `#${hashKey}`);
    }
  };

  if (races.length === 0) {
    return (
      <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/50">
        후보 정보가 아직 없습니다.
      </div>
    );
  }

  if (races.length === 1) {
    return <RaceSection race={races[0]} />;
  }

  const active = races[activeIdx];

  return (
    <>
      <div className="flex border-b border-paper/10 mb-8 sticky top-12 bg-ink/95 backdrop-blur-sm z-20 -mx-5 px-5 sm:-mx-8 sm:px-8">
        {races.map((race, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={race.type}
              onClick={() => handleTab(i)}
              className={`flex-1 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-neon text-neon"
                  : "border-transparent text-paper/50 hover:text-paper/80"
              }`}
            >
              {TAB_LABEL[race.type]}
              <span className="ml-1.5 text-[10px] opacity-70 font-mono">
                {race.candidates.length}명
              </span>
            </button>
          );
        })}
      </div>

      <RaceSection race={active} />
    </>
  );
}

function RaceSection({ race }: { race: Race }) {
  // 구청장은 별도 처리 (선거구 셀렉트 기반)
  if (race.type === "기초단체장") {
    return <MayorSection race={race} />;
  }

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[11px] font-mono text-neon/70">{race.type}</div>
          <h2 className="text-2xl font-black tracking-tightest">{race.title}</h2>
        </div>
        <div className="text-xs text-paper/40 font-mono">
          {race.candidates.length}명 출마
        </div>
      </div>

      <Recordboard candidates={race.candidates} raceTitle={race.title} />
      <Leaderboard candidates={race.candidates} />

      <div className="mb-4">
        <div className="text-[11px] font-mono text-neon/70 mb-1">후보 카드</div>
        <h3 className="text-lg font-black tracking-tightest">전체 후보 보기</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {race.candidates.map((c) => (
          <div
            key={`${race.type}-${c.number}`}
            id={`candidate-${c.number}`}
            className="scroll-mt-24"
          >
            <CandidateCard c={c} />
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto border border-paper/10 rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-paper/[0.03] text-paper/50 font-mono">
            <tr>
              <th className="text-left px-3 py-2 font-normal">기호</th>
              <th className="text-left px-3 py-2 font-normal">정당</th>
              <th className="text-left px-3 py-2 font-normal">전과</th>
              <th className="text-left px-3 py-2 font-normal">재산</th>
              <th className="text-left px-3 py-2 font-normal">납세</th>
            </tr>
          </thead>
          <tbody>
            {race.candidates.map((c) => (
              <tr key={`row-${c.number}`} className="border-t border-paper/5">
                <td className="px-3 py-2 font-mono text-paper/70">{c.number}</td>
                <td className="px-3 py-2">{c.party}</td>
                <td
                  className={`px-3 py-2 ${
                    c.criminalRecord !== "없음" ? "text-neon" : "text-paper/80"
                  }`}
                >
                  {c.criminalRecord}
                </td>
                <td className="px-3 py-2 text-paper/80">
                  {formatThousandWonAsKrw(c.property)}
                </td>
                <td className="px-3 py-2 text-paper/80">
                  {formatThousandWonAsKrw(c.taxPaid)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// 구청장 전용 섹션 — 선거구 셀렉트 후 그 후보들만 표시
function MayorSection({ race }: { race: Race }) {
  // 모든 선거구 목록 추출
  const districts = Array.from(
    new Set(race.candidates.map((c) => c.district).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b, "ko"));

  const [district, setDistrict] = useState("");

  // URL ?district= 파라미터로 초기값 설정 (마운트 시 한 번)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const d = params.get("district") ?? "";
    if (d && districts.includes(d)) {
      setDistrict(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = district
    ? race.candidates.filter((c) => c.district === district)
    : [];

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[11px] font-mono text-neon/70">{race.type}</div>
          <h2 className="text-2xl font-black tracking-tightest">{race.title}</h2>
        </div>
        <div className="text-xs text-paper/40 font-mono">
          {districts.length}개 선거구 · {race.candidates.length}명
        </div>
      </div>

      {/* 선거구 셀렉터 */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-paper/80 mb-2 block">
          선거구 선택
        </label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          style={{ colorScheme: "dark" }}
          className="w-full sm:w-72 bg-paper/[0.03] border border-paper/15 focus:border-neon/60 focus:outline-none rounded-lg px-4 py-3 text-sm text-paper"
          aria-label="구·시·군 선거구 선택"
        >
          <option value="" style={{ background: "#0a0a0a", color: "#fafafa" }}>
            선거구 고르기
          </option>
          {districts.map((d) => (
            <option
              key={d}
              value={d}
              style={{ background: "#0a0a0a", color: "#fafafa" }}
            >
              {d}
            </option>
          ))}
        </select>
      </div>

      {!district ? (
        <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/50 text-sm">
          위에서 본인 동네 선거구를 골라주세요.
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/50 text-sm">
          이 선거구에는 후보 정보가 없습니다.
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="text-[11px] font-mono text-neon/70 mb-1">{district}</div>
            <h3 className="text-lg font-black tracking-tightest">
              {district} 후보 {filtered.length}명
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((c) => (
              <div
                key={`mayor-${district}-${c.number}`}
                id={`candidate-${c.number}`}
                className="scroll-mt-24"
              >
                <CandidateCard c={c} />
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto border border-paper/10 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-paper/[0.03] text-paper/50 font-mono">
                <tr>
                  <th className="text-left px-3 py-2 font-normal">기호</th>
                  <th className="text-left px-3 py-2 font-normal">정당</th>
                  <th className="text-left px-3 py-2 font-normal">전과</th>
                  <th className="text-left px-3 py-2 font-normal">재산</th>
                  <th className="text-left px-3 py-2 font-normal">납세</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={`row-${c.number}`} className="border-t border-paper/5">
                    <td className="px-3 py-2 font-mono text-paper/70">{c.number}</td>
                    <td className="px-3 py-2">{c.party}</td>
                    <td
                      className={`px-3 py-2 ${
                        c.criminalRecord !== "없음" ? "text-neon" : "text-paper/80"
                      }`}
                    >
                      {c.criminalRecord}
                    </td>
                    <td className="px-3 py-2 text-paper/80">
                      {formatThousandWonAsKrw(c.property)}
                    </td>
                    <td className="px-3 py-2 text-paper/80">
                      {formatThousandWonAsKrw(c.taxPaid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
