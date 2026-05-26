import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegion, REGIONS } from "@/data/candidates";
import { CandidateCard } from "@/components/CandidateCard";
import { ShareBar } from "@/components/ShareBar";
import { Disclaimer } from "@/components/Disclaimer";
import { ddayLabel } from "@/lib/dday";

// 천원 단위 raw 문자열 ("1,823,897") → "18억 2,389만원"
function fmtKrw(raw?: string): string {
  if (!raw) return "—";
  const num = Number(raw.replace(/[^\d-]/g, ""));
  if (!Number.isFinite(num)) return raw;
  const won = num * 1000;
  if (won === 0) return "0원";
  const eok = Math.floor(won / 100_000_000);
  const man = Math.floor((won % 100_000_000) / 10_000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (parts.length === 0) parts.push(`${won.toLocaleString()}`);
  return `${parts.join(" ")}원`;
}

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

      {/* 각 선거별 카드 그리드 */}
      {r.races.map((race) => (
        <section key={race.type} className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono text-neon/70">{race.type}</div>
              <h2 className="text-2xl font-black tracking-tightest">{race.title}</h2>
            </div>
            <div className="text-xs text-paper/40 font-mono">
              {race.candidates.length}명 출마
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {race.candidates.map((c) => (
              <CandidateCard key={`${race.type}-${c.number}`} c={c} />
            ))}
          </div>

          {/* 보너스: 비교 한 줄 (전과/재산 한눈에) */}
          <div className="mt-4 overflow-x-auto border border-paper/10 rounded-lg">
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
                    <td className="px-3 py-2 text-paper/80">{fmtKrw(c.property)}</td>
                    <td className="px-3 py-2 text-paper/80">{fmtKrw(c.taxPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

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
