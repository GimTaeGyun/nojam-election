import Link from "next/link";
import { computeEduCriminal, getEduCriminalSummary } from "@/lib/eduCriminalStats";

// 메인 페이지용 교육감 전과 신고 티저
export function EduCriminalTeaser() {
  const list = computeEduCriminal().slice(0, 5);
  const summary = getEduCriminalSummary();

  return (
    <Link
      href="/stats/parties#edu"
      className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-5 sm:p-6"
    >
      <div className="text-[11px] font-mono text-neon/80 mb-2">교육감</div>
      <h2 className="text-xl sm:text-2xl font-black tracking-tightest">
        <span className="text-neon">전과 신고</span> 후보
      </h2>
      <p className="text-xs text-paper/60 mt-1.5 leading-relaxed">
        {summary.total}명 중 {summary.hasCrim}명 전과 신고 · 정당 없이 후보별
      </p>

      {list.length === 0 ? (
        <div className="mt-4 text-xs text-paper/40 text-center py-4">
          전과 신고 있는 후보가 없습니다.
        </div>
      ) : (
        <div className="mt-4 space-y-1">
          {list.map((e, i) => (
            <div key={`${e.regionCode}-${e.name}-${i}`} className="flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] text-neon/70 w-4 text-right shrink-0">
                {i + 1}
              </span>
              <span className="font-semibold w-16 shrink-0 truncate">{e.name}</span>
              <span className="text-[10px] text-paper/45 flex-1 truncate">
                {e.regionName.replace("특별시", "").replace("광역시", "").replace("특별자치", "").replace("도", "").slice(0, 6)}
              </span>
              <span className="font-mono text-[10px] text-neon font-bold tabular-nums shrink-0">
                {e.raw}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-neon mt-4 font-semibold">전체 보기 →</div>
    </Link>
  );
}
