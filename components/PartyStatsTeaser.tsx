import Link from "next/link";
import { computePartyStats, getOverallStats } from "@/lib/partyStats";
import { isAdmin } from "@/lib/auth";
import { maskedParty } from "@/lib/mask";

// 메인 페이지용 시·도지사 정당별 전과 티저 카드
export function PartyStatsTeaser() {
  const admin = isAdmin();
  const statsRaw = computePartyStats();
  const stats = admin ? statsRaw : statsRaw.map((s) => ({ ...s, party: maskedParty(s.partyKey) }));
  const overall = getOverallStats();

  const top3 = stats
    .filter((s) => s.total >= 3 && s.hasCrim > 0)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3);

  return (
    <Link
      href="/stats/parties#gov"
      className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-5 sm:p-6"
    >
      <div className="text-[11px] font-mono text-neon/80 mb-2">시·도지사</div>
      <h2 className="text-xl sm:text-2xl font-black tracking-tightest">
        정당별 <span className="text-neon">전과 신고</span>
      </h2>
      <p className="text-xs text-paper/60 mt-1.5 leading-relaxed">
        {overall.total}명 중 {overall.hasCrim}명 전과 신고 · 정당별 비율
      </p>

      {top3.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {top3.map((s) => (
            <div key={s.party} className="border border-paper/10 rounded-md p-2 bg-ink/40">
              <div className="text-[9px] font-mono text-paper/40 truncate">{s.party}</div>
              <div className="text-lg font-black text-neon tracking-tightest mt-0.5">
                {(s.rate * 100).toFixed(0)}%
              </div>
              <div className="text-[9px] text-paper/50 font-mono mt-0.5">
                {s.hasCrim}/{s.total}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-neon mt-4 font-semibold">전체 보기 →</div>
    </Link>
  );
}
