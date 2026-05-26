import { daysUntilElection, ddayLabel } from "@/lib/dday";

export function DDayHero() {
  const d = daysUntilElection();
  const label = ddayLabel();
  return (
    <section className="pt-10 pb-8">
      <div className="flex items-baseline gap-3 text-neon/70 text-xs font-mono mb-3">
        <span className="bg-neon text-ink px-1.5 py-0.5 rounded-sm font-bold">NOJAM</span>
        <span>제9회 전국동시지방선거 · 2026.06.03 (수)</span>
      </div>

      <h1 className="text-5xl sm:text-7xl font-black tracking-tightest leading-[0.95]">
        정치 <span className="text-neon">노잼</span>인 거 <br className="sm:hidden" />
        아는데
        <br />
        그래도 <span className="text-neon">5분</span>만.
      </h1>

      <p className="mt-6 text-sm sm:text-base text-paper/70 max-w-xl">
        다들 정당만 보고 찍잖아. 우리 동네 시장이 누군지, 교육감이 뭘 한다는 사람인지 정도는 알고 가자.
        팩트만, 빠르게.
      </p>

      <div className="mt-8 inline-flex items-center gap-4 border border-neon/40 px-5 py-3 rounded-lg">
        <span className="font-mono text-neon text-3xl sm:text-4xl font-black">{label}</span>
        <div className="text-xs text-paper/60 leading-tight">
          <div>6.3 수요일</div>
          <div className="text-paper/40">투표 마감 18시</div>
        </div>
      </div>
    </section>
  );
}
