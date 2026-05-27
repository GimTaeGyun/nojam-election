import { DDayHero } from "@/components/DDayHero";
import { RegionGrid } from "@/components/RegionGrid";
import { WhyNojam } from "@/components/WhyNojam";
import { Disclaimer } from "@/components/Disclaimer";
import { PartyStatsTeaser } from "@/components/PartyStatsTeaser";

export default function HomePage() {
  return (
    <>
      <DDayHero />
      <div className="mb-4">
        <Disclaimer />
      </div>
      <RegionGrid />
      <PartyStatsTeaser />
      <WhyNojam />

      {/* 가벼운 클로징 카피 */}
      <section className="py-16 border-t border-paper/10 text-center">
        <p className="text-2xl sm:text-3xl font-black tracking-tightest text-paper/80">
          이거 보고도 안 가면 <span className="text-neon">어쩔 수 없고~</span>
        </p>
        <p className="text-xs text-paper/40 mt-3">
          그래도 한 표는 한 표 · 6월 3일 수요일 06:00 — 18:00
        </p>
      </section>
    </>
  );
}
