"use client";

import { useEffect, useState } from "react";

// 헤더 가운데에 들어가는 미니 투표 카운터.
// 클릭 시 푸터의 VoteWidget(#vote)으로 스크롤.
export function HeaderVoteMini() {
  const [counts, setCounts] = useState<{ fun: number; nojam: number }>({ fun: 0, nojam: 0 });

  useEffect(() => {
    fetch("/api/votes")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.fun === "number" && typeof d.nojam === "number") {
          setCounts({ fun: d.fun, nojam: d.nojam });
        }
      })
      .catch(() => void 0);
  }, []);

  return (
    <a
      href="#vote"
      className="hidden sm:flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
      aria-label="이 사이트 평가하기"
    >
      <span className="text-paper/85">
        💤 노잼{" "}
        <span className="font-mono tabular-nums">{counts.nojam.toLocaleString()}</span>
      </span>
      <span className="text-paper/30">vs</span>
      <span className="text-neon">
        🚀 유잼{" "}
        <span className="font-mono tabular-nums">{counts.fun.toLocaleString()}</span>
      </span>
    </a>
  );
}

// 모바일용 (좁은 화면, 한글 빼고 컴팩트)
export function HeaderVoteMiniMobile() {
  const [counts, setCounts] = useState<{ fun: number; nojam: number }>({ fun: 0, nojam: 0 });

  useEffect(() => {
    fetch("/api/votes")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.fun === "number" && typeof d.nojam === "number") {
          setCounts({ fun: d.fun, nojam: d.nojam });
        }
      })
      .catch(() => void 0);
  }, []);

  return (
    <a
      href="#vote"
      className="sm:hidden flex items-center gap-1 text-[11px] font-mono tabular-nums hover:opacity-80"
      aria-label="이 사이트 평가하기"
    >
      <span className="text-paper/85">💤 {counts.nojam}</span>
      <span className="text-paper/30">vs</span>
      <span className="text-neon">🚀 {counts.fun}</span>
    </a>
  );
}
