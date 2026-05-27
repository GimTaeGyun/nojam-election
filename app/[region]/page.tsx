import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegion, REGIONS } from "@/data/candidates";
import { ShareBar } from "@/components/ShareBar";
import { Disclaimer } from "@/components/Disclaimer";
import { RaceTabs } from "@/components/RaceTabs";
import { ddayLabel } from "@/lib/dday";

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.code }));
}

export function generateMetadata({ params }: { params: { region: string } }) {
  const r = getRegion(params.region);
  if (!r) return {};
  const govCount = r.races.find((x) => x.type === "광역단체장")?.candidates.length ?? 0;
  const eduCount = r.races.find((x) => x.type === "교육감")?.candidates.length ?? 0;
  const title = `${r.shortName} 시·도지사·교육감 후보 비교 — 재산·전과·납세 한눈에`;
  const description = `2026 지방선거 ${r.name} 시·도지사 ${govCount}명·교육감 ${eduCount}명 후보의 재산·전과·납세·학력·경력을 1분 안에 정렬·비교. 선관위 공식 자료 기반.`;
  return {
    title,
    description,
    keywords: [
      `${r.shortName} 후보`,
      `${r.shortName} 시장 후보`,
      `${r.shortName} 도지사 후보`,
      `${r.shortName} 시·도지사`,
      `${r.shortName} 교육감 후보`,
      `${r.shortName} 후보 비교`,
      `${r.shortName} 후보 전과`,
      `${r.shortName} 후보 재산`,
      `${r.name} 2026 지방선거`,
      "노잼선거",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://nojam.kr/${r.code}`,
    },
  };
}

export default function RegionPage({ params }: { params: { region: string } }) {
  const r = getRegion(params.region);
  if (!r) notFound();

  return (
    <>
      {/* 페이지 헤더 */}
      <section className="pt-6 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-paper/70 hover:text-neon border border-paper/15 hover:border-neon/50 rounded-md px-3 py-1.5 transition-colors"
        >
          <span aria-hidden>←</span>
          <span>다른 지역 보기</span>
        </Link>
        <div className="mt-4 flex items-baseline gap-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tightest">
            {r.shortName}
            <span className="text-neon">.</span>
          </h1>
          <span className="font-mono text-xs text-paper/40">{r.name}</span>
        </div>
        {r.vibe && <p className="text-sm text-paper/50 mt-2">"{r.vibe}"</p>}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs bg-neon text-ink px-2 py-1 rounded-sm font-bold">
            {ddayLabel()}
          </span>
          <span className="text-xs text-paper/60">
            6.3 (수) · 우리 동네 시·도지사 + 교육감
          </span>
          <div className="ml-auto">
            <ShareBar title={`${r.name} 후보 한 번 보기 — 노잼선거`} />
          </div>
        </div>
      </section>

      <div className="mb-6">
        <Disclaimer />
      </div>

      {/* 탭 전환: 시·도지사 ↔ 교육감 */}
      <RaceTabs races={r.races} />

      {/* 기초·의원 선거 안내 */}
      <section className="my-6 border border-paper/10 rounded-lg p-4 bg-paper/[0.02]">
        <div className="text-[11px] font-mono text-paper/40 mb-1">참고</div>
        <p className="text-sm text-paper/70 leading-relaxed">
          이번 선거에서는 <strong className="text-paper/90">구청장·시장·군수(기초단체장)</strong>,
          <strong className="text-paper/90"> 시·도의원</strong>,
          <strong className="text-paper/90"> 구·시·군의원</strong>도 같이 뽑아요.
          후보 수가 워낙 많아 본 사이트에는 담지 못했습니다 — 본인 지역구 후보 정보는{" "}
          <a
            href="https://info.nec.go.kr"
            target="_blank"
            rel="noreferrer"
            className="text-neon underline"
          >
            중앙선관위 사이트
          </a>
          에서 직접 확인하세요.
        </p>
      </section>

      {/* 클로징 CTA */}
      <section className="py-12 text-center border-t border-paper/10">
        <p className="text-xl sm:text-2xl font-black tracking-tightest">
          친구한테 보내기. <span className="text-neon">그게 우리 동네 4년을 바꿈.</span>
        </p>
        <div className="mt-4 flex justify-center">
          <ShareBar title={`${r.name} 후보 한 번 보기 — 노잼선거`} />
        </div>
      </section>
    </>
  );
}
