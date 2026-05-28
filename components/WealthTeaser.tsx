import Link from "next/link";
import { computeWealthRanking, getWealthSummary, type RaceKind } from "@/lib/wealthStats";
import { formatKrw } from "@/lib/parseNum";

const RACE_LABEL: Record<RaceKind, string> = {
  gov: "시·도지사",
  edu: "교육감",
};

// 메인 페이지용 재산 랭킹 티저 — race prop으로 시도지사/교육감 둘 다 처리
export function WealthTeaser({ race = "gov" }: { race?: RaceKind }) {
  const ranking = computeWealthRanking(race).slice(0, 5);
  const summary = getWealthSummary(race);
  const max = ranking[0]?.wealthWon ?? 1;
  const label = RACE_LABEL[race];

  return (
    <Link
      href={`/stats/wealth#${race}`}
      className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-5 sm:p-6"
    >
      <div className="text-[11px] font-mono text-neon/80 mb-2">{label}</div>
      <h2 className="text-xl sm:text-2xl font-black tracking-tightest">
        <span className="text-neon">재산</span> 순위
      </h2>
      <p className="text-xs text-paper/60 mt-1.5 leading-relaxed">
        {summary.total}명 · 1위÷꼴찌 {summary.gap > 0 ? `${summary.gap}배` : "—"} · 10억 이상 {summary.over10b}명
      </p>

      <div className="mt-4 space-y-1.5">
        {ranking.map((e) => {
          const pct = (e.wealthWon / max) * 100;
          return (
            <div key={`${e.regionCode}-${e.name}-${e.rank}`} className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] text-neon/70 w-4 text-right shrink-0">
                {e.rank}
              </span>
              <span className="font-semibold w-14 shrink-0 truncate">{e.name}</span>
              <span className="text-[9px] text-paper/45 w-14 shrink-0 truncate hidden xs:inline">
                {e.regionName.replace("특별시", "").replace("광역시", "").replace("특별자치", "").replace("도", "").slice(0, 4)}
              </span>
              <div className="flex-1 h-2.5 bg-paper/[0.04] rounded-sm overflow-hidden min-w-0">
                <div
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    background: e.rank === 1 ? "#d4ff00" : "rgba(212,255,0,0.55)",
                  }}
                />
              </div>
              <span
                className={`font-mono text-[10px] tabular-nums min-w-[60px] text-right shrink-0 ${
                  e.rank === 1 ? "text-neon font-bold" : "text-paper/85"
                }`}
              >
                {formatKrw(e.wealthWon)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-neon mt-4 font-semibold">전체 보기 →</div>
    </Link>
  );
}
