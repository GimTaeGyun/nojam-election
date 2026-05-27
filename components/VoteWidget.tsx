"use client";

import { useEffect, useState } from "react";

type Counts = { fun: number; nojam: number };
type Vote = "fun" | "nojam";

const STORAGE_KEY = "nojam_vote_v1";

export function VoteWidget() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [myVote, setMyVote] = useState<Vote | null>(null);
  const [loading, setLoading] = useState(false);

  // 마운트 시: LocalStorage 확인 + 카운트 fetch
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "fun" || stored === "nojam") {
      setMyVote(stored);
    }
    fetch("/api/votes")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.fun === "number" && typeof d.nojam === "number") {
          setCounts({ fun: d.fun, nojam: d.nojam });
        }
      })
      .catch(() => void 0);
  }, []);

  const submit = async (vote: Vote) => {
    if (myVote) return; // 중복 방지 (같은 브라우저)
    setLoading(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      });
      if (!res.ok) throw new Error("vote failed");
      const data: Counts = await res.json();
      setCounts(data);
      setMyVote(vote);
      localStorage.setItem(STORAGE_KEY, vote);
    } catch {
      // 실패해도 일단 본인 표시 (UX 끊김 방지)
      setMyVote(vote);
      localStorage.setItem(STORAGE_KEY, vote);
    } finally {
      setLoading(false);
    }
  };

  const total = (counts?.fun ?? 0) + (counts?.nojam ?? 0);
  const funPct = total > 0 ? Math.round(((counts?.fun ?? 0) / total) * 100) : 50;
  const nojamPct = total > 0 ? 100 - funPct : 50;

  return (
    <section id="vote" className="mt-16 mb-4 border border-paper/10 rounded-xl p-5 scroll-mt-20">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-[11px] font-mono text-neon/70">한 줄 평가</div>
          <h3 className="text-lg font-black tracking-tightest">
            {myVote ? "참여 감사합니다 ✓" : "이 사이트 어땠어요?"}
          </h3>
        </div>
        {counts && (
          <div className="text-[11px] text-paper/40 font-mono tabular-nums">
            총 {total.toLocaleString()}표
          </div>
        )}
      </div>

      {!myVote ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => submit("nojam")}
            disabled={loading}
            className="border border-paper/15 hover:border-paper/40 rounded-lg py-3 text-center transition-colors disabled:opacity-50"
          >
            <div className="text-xl">💤</div>
            <div className="text-xs font-bold mt-0.5">노잼이었음</div>
          </button>
          <button
            onClick={() => submit("fun")}
            disabled={loading}
            className="border border-neon/40 hover:border-neon bg-neon/[0.04] hover:bg-neon/[0.08] rounded-lg py-3 text-center transition-colors disabled:opacity-50"
          >
            <div className="text-xl">🚀</div>
            <div className="text-xs font-bold mt-0.5 text-neon">유잼이었음</div>
          </button>
        </div>
      ) : (
        <div>
          {/* 노잼 막대 */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 w-28">
              <span>💤</span>
              <span className="text-xs font-semibold">노잼</span>
              {myVote === "nojam" && (
                <span className="text-[10px] text-neon font-mono">내 표</span>
              )}
            </div>
            <div className="flex-1 h-5 bg-paper/[0.04] rounded-sm overflow-hidden">
              <div
                className="h-full bg-paper/40"
                style={{ width: `${nojamPct}%` }}
              />
            </div>
            <span className="font-mono text-xs tabular-nums w-20 text-right">
              {(counts?.nojam ?? 0).toLocaleString()} · {nojamPct}%
            </span>
          </div>
          {/* 유잼 막대 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-28">
              <span>🚀</span>
              <span className="text-xs font-semibold text-neon">유잼</span>
              {myVote === "fun" && (
                <span className="text-[10px] text-neon font-mono">내 표</span>
              )}
            </div>
            <div className="flex-1 h-5 bg-paper/[0.04] rounded-sm overflow-hidden">
              <div
                className="h-full bg-neon"
                style={{ width: `${funPct}%` }}
              />
            </div>
            <span className="font-mono text-xs tabular-nums w-20 text-right">
              {(counts?.fun ?? 0).toLocaleString()} · {funPct}%
            </span>
          </div>
          <div className="text-[10px] text-paper/40 font-mono mt-3">
            결과는 실시간 집계. 본인 한 표는 같은 기기에서 한 번만.
          </div>
        </div>
      )}
    </section>
  );
}
