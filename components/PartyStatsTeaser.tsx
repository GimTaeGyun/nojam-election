import Link from "next/link";
import { computePartyStats, getOverallStats } from "@/lib/partyStats";

// 메인 페이지용 정당별 분석 티저 카드
// "한 곳에서 다 본다"는 차별점을 미리보기로 보여줌
export function PartyStatsTeaser() {
  const stats = computePartyStats();
  const overall = getOverallStats();

  // 비율 높은 상위 3개 (출마자 3명 이상인 정당만 — 1~2명 정당은 변동성 큼)
  const top3 = stats
    .filter((s) => s.total >= 3 && s.hasCrim > 0)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3);

  return (
    <Link
      href="/stats/parties"
      className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-6 sm:p-8"
    >
      <div className="text-[11px] font-mono text-neon/80 mb-2">정당별</div>
      <h2 className="text-2xl sm:text-3xl font-black tracking-tightest">
        시·도지사 <span className="text-neon">전과 신고</span>
      </h2>
      <p className="text-sm text-paper/60 mt-2 leading-relaxed">
        후보 {overall.total}명 중 {overall.hasCrim}명이 전과 신고.
        한국 어디서도 한 곳에서 안 보여주는 데이터.
      </p>

      {top3.length > 0 && (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {top3.map((s) => (
            <div key={s.party} className="border border-paper/10 rounded-md p-3 bg-ink/40">
              <div className="text-[10px] font-mono text-paper/40 truncate">{s.party}</div>
              <div className="text-xl font-black text-neon tracking-tightest mt-0.5">
                {(s.rate * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-paper/50 font-mono mt-0.5">
                {s.hasCrim}/{s.total}명
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-5">
        <div className="text-xs text-neon font-semibold">전체 보기 →</div>
        <div className="text-[10px] text-paper/50">
          + 교육감 전과는{" "}
          <span className="text-paper/70 underline">/stats/edu-criminal</span>
        </div>
      </div>
    </Link>
  );
}
