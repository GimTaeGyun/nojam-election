import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegion, REGIONS } from "@/data/candidates";
import { CandidateCard } from "@/components/CandidateCard";
import { ShareBar } from "@/components/ShareBar";
import { Disclaimer } from "@/components/Disclaimer";
import { Recordboard } from "@/components/Recordboard";
import { Leaderboard } from "@/components/Leaderboard";
import { ddayLabel } from "@/lib/dday";
import { formatThousandWonAsKrw } from "@/lib/parseNum";

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.code }));
}

export function generateMetadata({ params }: { params: { region: string } }) {
  const r = getRegion(params.region);
  if (!r) return {};
  return {
    title: `${r.name} 후보 정리`,
    description: `${r.name} 시·도지사·교육감 후보 누군지 30초 만에 보기. 정치 노잼인 거 아는데, 5분만.`,
  };
}

export default function RegionPage({ params }: { params: { region: string } }) {
  const r = getRegion(params.region);
  if (!r) notFound();

  return (
    <>
      {/* 페이지 헤더 */}
      <section className="pt-10 pb-6">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 전체 지역
        </Link>
        <div className="mt-3 flex items-baseline gap-3">
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

      {/* 각 선거별 — 1) 기네스 기록 2) 랭킹 3) 카드 그리드 */}
      {r.races.map((race) => (
        <section key={race.type} className="mb-14">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono text-neon/70">{race.type}</div>
              <h2 className="text-2xl font-black tracking-tightest">{race.title}</h2>
            </div>
            <div className="text-xs text-paper/40 font-mono">
              {race.candidates.length}명 출마
            </div>
          </div>

          {/* 1. 기네스 기록 보드 */}
          <Recordboard candidates={race.candidates} raceTitle={race.title} />

          {/* 2. 정렬 토글 리더보드 */}
          <Leaderboard candidates={race.candidates} />

          {/* 3. 후보별 디테일 카드 */}
          <div className="mb-4">
            <div className="text-[11px] font-mono text-neon/70 mb-1">후보 카드</div>
            <h3 className="text-lg font-black tracking-tightest">전체 후보 보기</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {race.candidates.map((c) => (
              <div key={`${race.type}-${c.number}`} id={`candidate-${c.number}`} className="scroll-mt-20">
                <CandidateCard c={c} />
              </div>
            ))}
          </div>

          {/* 4. 보너스: 비교 한 줄 (전과/재산 한눈에) */}
          <div className="mt-6 overflow-x-auto border border-paper/10 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-paper/[0.03] text-paper/50 font-mono">
                <tr>
                  <th className="text-left px-3 py-2 font-normal">기호</th>
                  <th className="text-left px-3 py-2 font-normal">정당</th>
                  <th className="text-left px-3 py-2 font-normal">전과</th>
                  <th className="text-left px-3 py-2 font-normal">재산</th>
                  <th className="text-left px-3 py-2 font-normal">납세</th>
                </tr>
              </thead>
              <tbody>
                {race.candidates.map((c) => (
                  <tr key={`row-${c.number}`} className="border-t border-paper/5">
                    <td className="px-3 py-2 font-mono text-paper/70">{c.number}</td>
                    <td className="px-3 py-2">{c.party}</td>
                    <td
                      className={`px-3 py-2 ${
                        c.criminalRecord !== "없음" ? "text-neon" : "text-paper/80"
                      }`}
                    >
                      {c.criminalRecord}
                    </td>
                    <td className="px-3 py-2 text-paper/80">{formatThousandWonAsKrw(c.property)}</td>
                    <td className="px-3 py-2 text-paper/80">{formatThousandWonAsKrw(c.taxPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

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
