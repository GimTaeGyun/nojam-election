import Link from "next/link";
import { REGIONS_META } from "@/data/regions";

export function RegionGrid() {
  return (
    <section className="py-10 border-t border-paper/10">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tightest">
          내 동네 <span className="text-neon">한 번 보기</span>
        </h2>
        <span className="text-xs text-paper/40 font-mono">17개 시·도</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {REGIONS_META.map((r) => (
          <Link
            key={r.code}
            href={`/${r.code}`}
            className="card-hover group border border-paper/10 rounded-lg p-4 hover:bg-paper/[0.03]"
          >
            <div className="text-xs text-paper/40 font-mono">{r.code.toUpperCase()}</div>
            <div className="text-xl font-black tracking-tight mt-1">{r.shortName}</div>
            <div className="text-[11px] text-paper/50 mt-1 line-clamp-1">{r.vibe}</div>
            <div className="mt-3 text-[11px] text-neon/70 group-hover:text-neon">
              후보 보러가기 →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
