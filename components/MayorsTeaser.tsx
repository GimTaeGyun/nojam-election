import Link from "next/link";
import { getOverall, computeRegionStats } from "@/lib/mayorsStats";
import { formatKrw } from "@/lib/parseNum";

// 메인 페이지: 4카드 그리드 아래 큰 가로 배너
export function MayorsTeaser() {
  const overall = getOverall();
  const regions = computeRegionStats();
  const top3 = regions.slice(0, 3);

  return (
    <section className="py-8 border-t border-paper/10">
      <Link
        href="/stats/mayors"
        className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-5 sm:p-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl sm:text-4xl" aria-hidden>🏛</div>
            <div>
              <div className="text-[11px] font-mono text-neon/80 mb-1">기초단체장 통계</div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tightest leading-tight">
                구청장·시장·군수 <span className="text-neon">{overall.total}명</span>
              </h2>
              <p className="text-xs sm:text-sm text-paper/60 mt-1 leading-relaxed">
                전국 {overall.districtCount}개 선거구 · 평균 재산 {formatKrw(overall.avgWealth)} · 정당 {overall.partyCount}개
              </p>
            </div>
          </div>
          <div className="text-base sm:text-lg text-neon font-bold shrink-0 sm:text-right">
            전국 통계 →
          </div>
        </div>

        {/* Top 3 시도 평균 재산 미리보기 */}
        {top3.length > 0 && (
          <div className="mt-5 pt-5 border-t border-neon/15 grid grid-cols-3 gap-2">
            {top3.map((r, i) => (
              <div key={r.regionCode} className="border border-paper/10 rounded-md p-3 bg-ink/40">
                <div className="text-[10px] font-mono text-neon/70">
                  {i === 0 ? "🥇 가장 부자 동네" : `${i + 1}위`}
                </div>
                <div className="text-base font-black tracking-tightest mt-1">
                  {r.shortName}
                </div>
                <div className="text-[10px] text-paper/60 mt-1">
                  평균 {formatKrw(r.avgWealth)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Link>
    </section>
  );
}
