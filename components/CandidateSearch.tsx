"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { searchCandidates, type SearchItem } from "@/lib/searchCandidates";
import { formatThousandWonAsKrw } from "@/lib/parseNum";

export function CandidateSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results: SearchItem[] = useMemo(() => searchCandidates(q), [q]);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const showResults = open && q.trim().length > 0;

  return (
    <div className="mt-6" ref={wrapRef}>
      <label className="flex items-center gap-2 text-sm font-bold text-paper/85 mb-2">
        <span aria-hidden>🔍</span>
        <span>이름으로 찾기</span>
        <span className="text-[10px] text-paper/40 font-mono font-normal">자음·정당명도 OK</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="후보 이름 또는 자음 (예: ㅇ, 오)"
          className="w-full bg-paper/[0.03] border border-paper/15 focus:border-neon/60 focus:outline-none rounded-lg px-4 py-3 text-sm text-paper placeholder:text-paper/30"
          aria-label="후보 이름 검색"
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-paper/40 hover:text-neon"
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}

        {showResults && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-ink border border-paper/15 rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-3 text-xs text-paper/40">
                일치하는 후보가 없습니다.
              </div>
            ) : (
              <ul>
                {results.map((c, i) => {
                  const wealth = formatThousandWonAsKrw(c.property);
                  const crim = c.criminalRecord || "없음";
                  return (
                    <li key={`${c.regionCode}-${c.race}-${c.name}-${i}`}>
                      <Link
                        href={`/${c.regionCode}#${c.race}`}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 hover:bg-paper/[0.04] border-b border-paper/5 last:border-b-0 text-sm leading-snug"
                      >
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-paper/30 mx-1.5">·</span>
                        <span className="text-paper/70">{c.party}</span>
                        <span className="text-paper/30 mx-1.5">·</span>
                        <span className="text-paper/70 tabular-nums">{wealth}</span>
                        <span className="text-paper/30 mx-1.5">·</span>
                        <span className="text-paper/70">전과 {crim}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
