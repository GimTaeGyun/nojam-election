import Link from "next/link";
import { getUncontested } from "@/lib/uncontested";

export function UncontestedTeaser() {
  const { all, mayors, councilors } = getUncontested();
  const total = all.length;

  return (
    <section className="py-4 border-t border-paper/10">
      <Link
        href="/stats/uncontested"
        className="card-hover block border border-neon/40 bg-neon/[0.04] rounded-xl p-5 sm:p-7"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-3xl sm:text-4xl shrink-0" aria-hidden>🗳️</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-mono text-neon/80 mb-1">투표 전에 결정</div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tightest leading-tight">
              이미 당선된 자들이 <span className="text-neon">있다?</span>
            </h2>
            <p className="text-xs sm:text-sm text-paper/60 mt-1 leading-relaxed">
              표 안 받고 당선 — <strong className="text-paper/85">{total}명</strong> · 단독 출마 = 자동 당선
            </p>
            <p className="text-[10px] text-paper/40 mt-0.5 leading-relaxed">
              시·도의원 {councilors.length} + 구청장 {mayors.length}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end shrink-0">
            <div className="text-4xl font-black tracking-tightest text-neon tabular-nums">{total}</div>
            <div className="text-[10px] font-mono text-paper/40">명</div>
          </div>
          <div className="text-base sm:text-lg text-neon font-bold shrink-0">→</div>
        </div>
      </Link>
    </section>
  );
}
