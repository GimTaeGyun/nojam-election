import Link from "next/link";
import { computeWealthRanking, getWealthSummary } from "@/lib/wealthStats";
import { formatKrw } from "@/lib/parseNum";

// 메인 페이지용 재산 랭킹 티저
// Top 5명 보여주고 전체 페이지로 유도
export function WealthTeaser() {
  const ranking = computeWealthRanking().slice(0, 5);
  const summary = getWealthSummary();
  const max = ranking[0]?.wealthWon ?? 1;

  return (
    <Link
      href="/stats/wealth"
      className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-6 sm:p-8"
    >
      <div className="text-[11px] font-mono text-neon/80 mb-2">전국 한 눈에</div>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tightest">
        시·도지사 후보 <span className="text-neon">재산 순위</span>
      </h2>
      <p className="text-sm text-paper/60 mt-2 leading-relaxed">
        전국 {summary.total}명 중 1위와 꼴찌의 격차 {summary.gap}배. 10억 이상 {summary.over10b}명.
      </p>

      <div className="mt-5 space-y-1.5">
        {ranking.map((e) => {
          const pct = (e.wealthWon / max) * 100;
          return (
            <div key={`${e.regionCode}-${e.name}-${e.rank}`} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-xs text-neon/70 w-5 text-right shrink-0">
                {e.rank}
              </span>
              <span className="font-semibold w-14 shrink-0 truncate">{e.name}</span>
              <span className="text-[10px] text-paper/45 w-16 sm:w-20 shrink-0 truncate">
                {e.regionName}
              </span>
              <div className="flex-1 h-3 bg-paper/[0.04] rounded-sm overflow-hidden min-w-0">
                <div
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    background: e.rank === 1 ? "#d4ff00" : "rgba(212,255,0,0.55)",
                  }}
                />
              </div>
              <span
                className={`font-mono text-xs tabular-nums min-w-[70px] text-right shrink-0 ${
                  e.rank === 1 ? "text-neon font-bold" : "text-paper/85"
                }`}
              >
                {formatKrw(e.wealthWon)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-neon mt-5 font-semibold">전체 {summary.total}명 보기 →</div>
    </Link>
  );
}
