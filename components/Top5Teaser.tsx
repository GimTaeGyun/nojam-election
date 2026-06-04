import Link from "next/link";
import {
  getOverallStats,
  getTopWealth,
  getBottomWealth,
  getTopCriminal,
  getTopRunCount,
  getYoungest,
  getOldest,
} from "@/lib/overallStats";
import { isAdmin } from "@/lib/auth";
import { maskedName, maskedParty } from "@/lib/mask";

export function Top5Teaser() {
  const admin = isAdmin();
  const overall = getOverallStats();
  const maskOne = (e: ReturnType<typeof getTopWealth>[number] | undefined, idx: number) =>
    !e || admin ? e : { ...e, name: maskedName(idx), party: maskedParty(e.partyKey) };

  // 6개 항목 1위만 (데모 모드면 마스킹)
  const items = [
    { emoji: "💰", label: "최고 부자",   entry: maskOne(getTopWealth(1)[0], 0) },
    { emoji: "💸", label: "최저 재산",   entry: maskOne(getBottomWealth(1)[0], 1) },
    { emoji: "📋", label: "전과 1위",    entry: maskOne(getTopCriminal(1)[0], 2) },
    { emoji: "🔁", label: "출마 베테랑", entry: maskOne(getTopRunCount(1)[0], 3) },
    { emoji: "🌱", label: "최연소",      entry: maskOne(getYoungest(1)[0], 4) },
    { emoji: "🎂", label: "최고령",      entry: maskOne(getOldest(1)[0], 5) },
  ];

  return (
    <section className="py-4 border-t border-paper/10">
      <Link
        href="/stats/top5"
        className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-5 sm:p-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <div className="text-3xl sm:text-4xl" aria-hidden>🏆</div>
            <div>
              <div className="text-[11px] font-mono text-neon/80 mb-1">전국 종합</div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tightest leading-tight">
                후보 <span className="text-neon">Top 5</span> 컬렉션
              </h2>
              <p className="text-xs sm:text-sm text-paper/60 mt-1 leading-relaxed">
                전국 {overall.total.toLocaleString()}명 · 카테고리별 1위 한 눈에
              </p>
              <p className="text-[10px] text-paper/40 mt-0.5 leading-relaxed">
                ※ 비례대표·국회의원 선거 제외
              </p>
            </div>
          </div>
          <div className="text-base sm:text-lg text-neon font-bold shrink-0 sm:text-right">
            전국 Top 5 →
          </div>
        </div>

        {/* 6개 1위 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-5 border-t border-neon/15">
          {items.map((it) => (
            <div
              key={it.label}
              className="border border-paper/10 rounded-lg p-3 bg-ink/40 hover:border-neon/30 transition-colors"
            >
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-2xl shrink-0 leading-none" aria-hidden>
                  {it.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono text-neon/70 truncate">{it.label}</div>
                  <div className="text-[9px] text-paper/40 font-mono mt-0.5">
                    {it.entry?.raceLabel ?? "—"}
                  </div>
                </div>
              </div>
              {it.entry ? (
                <>
                  <div className="text-base font-black tracking-tightest truncate">
                    {it.entry.name}
                  </div>
                  <div className="text-xs text-neon font-bold tabular-nums mt-0.5">
                    {it.entry.valueLabel}
                  </div>
                </>
              ) : (
                <div className="text-xs text-paper/40 py-1">데이터 없음</div>
              )}
            </div>
          ))}
        </div>
      </Link>
    </section>
  );
}
