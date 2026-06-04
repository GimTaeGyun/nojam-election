import { DDayHero } from "@/components/DDayHero";
import { RegionGrid } from "@/components/RegionGrid";
import { WhyNojam } from "@/components/WhyNojam";
import { Disclaimer } from "@/components/Disclaimer";
import { PartyStatsTeaser } from "@/components/PartyStatsTeaser";
import { WealthTeaser } from "@/components/WealthTeaser";
import { EduCriminalTeaser } from "@/components/EduCriminalTeaser";
import { MayorsTeaser } from "@/components/MayorsTeaser";
import { CouncilorsTeaser } from "@/components/CouncilorsTeaser";
import { LocalCouncilorsTeaser } from "@/components/LocalCouncilorsTeaser";
import { Top5Teaser } from "@/components/Top5Teaser";
import { UncontestedTeaser } from "@/components/UncontestedTeaser";

// 관리자 쿠키 따라 마스킹 분기되어야 하므로 정적 캐시 금지.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <DDayHero />
      <div className="mb-4">
        <Disclaimer />
      </div>

      {/* 전국 Top 5 컬렉션 (전체 후보 종합 임팩트 — D-2 시점 후킹) */}
      <Top5Teaser />

      {/* 무투표 당선 — 표 안 받고 당선된 112명 */}
      <UncontestedTeaser />

      <RegionGrid />

      {/* 4 통계 카드 — 시·도지사 / 교육감 × 재산 / 전과 */}
      <section className="py-12 border-t border-paper/10">
        <div className="text-[11px] font-mono text-neon/70 mb-3">차별 콘텐츠 · 한 곳에서 다 본다</div>
        <div className="grid sm:grid-cols-2 gap-3">
          <WealthTeaser race="gov" />
          <PartyStatsTeaser />
          <WealthTeaser race="edu" />
          <EduCriminalTeaser />
        </div>
      </section>

      {/* 구청장·시장·군수 통계 큰 배너 */}
      <MayorsTeaser />

      {/* 시·도의원 통계 큰 배너 */}
      <CouncilorsTeaser />

      {/* 구·시·군의원 통계 큰 배너 */}
      <LocalCouncilorsTeaser />

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
