import { REGIONS_META } from "@/data/regions";
import { CandidateSearch } from "./CandidateSearch";
import { RegionCard } from "./RegionCard";
import { isAdmin } from "@/lib/auth";

export function RegionGrid() {
  const admin = isAdmin();
  return (
    <section className="py-10 border-t border-paper/10">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tightest">
          내 동네 <span className="text-neon">한 번 보기</span>
        </h2>
        <span className="text-xs text-paper/40 font-mono">16개 시·도</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {REGIONS_META.map((r) => (
          <RegionCard key={r.code} code={r.code} shortName={r.shortName} vibe={r.vibe} />
        ))}
      </div>

      {/* 후보 이름 검색 — 데모 모드에선 의미 없으므로 관리자만 노출 */}
      {admin && <CandidateSearch />}
    </section>
  );
}
