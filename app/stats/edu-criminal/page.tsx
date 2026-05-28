import Link from "next/link";
import { computeEduCriminal, getEduCriminalSummary } from "@/lib/eduCriminalStats";
import { ddayLabel } from "@/lib/dday";

export const metadata = {
  title: "교육감 후보 전과 신고 현황 — 2026 지방선거",
  description:
    "2026 6월 3일 지방선거 전국 시·도 교육감 후보의 전과 신고 명단. 교육감은 정당 소속이 없어 후보별로 정리. 중앙선관위 공식 자료.",
  keywords: [
    "교육감 후보 전과",
    "교육감 전과 신고",
    "교육감 후보자",
    "2026 교육감 선거",
    "교육감 후보 정보",
    "노잼선거",
  ],
  openGraph: {
    title: "교육감 후보 전과 신고 현황 — 2026 지방선거",
    description: "전국 시·도 교육감 후보 전과 신고 명단. 선관위 공식 자료.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "교육감 후보 전과 신고 — 노잼선거",
    description: "전국 시·도 교육감 후보 전과 신고 명단.",
  },
  alternates: { canonical: "https://nojam.kr/stats/edu-criminal" },
};

export default function StatsEduCriminalPage() {
  const list = computeEduCriminal();
  const summary = getEduCriminalSummary();

  return (
    <article className="py-10">
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            교육감 후보 <span className="text-neon">전과 신고</span>
          </h1>
          <span className="font-mono text-xs text-paper/40">{ddayLabel()}</span>
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          2026 제9회 전국동시지방선거 <strong className="text-paper">교육감 후보 {summary.total}명</strong>.
          교육감은 정당 소속이 없어 후보별로 전과 신고 현황을 정리했습니다.
        </p>
      </header>

      {/* 요약 */}
      <section className="grid grid-cols-3 gap-2 mb-10">
        <Stat label="총 후보" value={`${summary.total}명`} />
        <Stat label="전과 신고" value={`${summary.hasCrim}명`} accent />
        <Stat label="비율" value={`${(summary.rate * 100).toFixed(1)}%`} accent />
      </section>

      {/* 명단 (건수 많은 순) */}
      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tightest mb-1">전과 신고 후보 명단</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">건수 많은 순 · 클릭 시 해당 지역으로</div>

        {list.length === 0 ? (
          <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/50">
            전과 신고가 있는 교육감 후보가 없습니다.
          </div>
        ) : (
          <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
            {list.map((e, i) => (
              <Link
                key={`${e.regionCode}-${e.name}-${i}`}
                href={`/${e.regionCode}#edu`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
              >
                <span className="font-mono text-sm w-7 text-right text-paper/50 tabular-nums">
                  {i + 1}
                </span>
                <span className="font-semibold w-20 sm:w-24 truncate text-sm">{e.name}</span>
                <span className="text-[11px] text-paper/50 flex-1 truncate">{e.regionName}</span>
                <span className="font-mono text-xs text-neon font-bold tabular-nums">{e.raw}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 명시적 주석 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-lg p-5 mb-10">
        <div className="text-[11px] font-mono text-neon/80 mb-2">⚠︎ 이 표를 보실 때 알아두실 점</div>
        <ul className="text-sm text-paper/85 leading-relaxed space-y-2">
          <li>
            <strong className="text-paper">전과의 "건수"만 표시되며 종류는 별도</strong>입니다.
            교육감 후보의 전과는 교육 현장 관련 사안(집회 시위 등)부터 일반 범죄까지 다양합니다.
          </li>
          <li>
            전과 건수만으로 후보 자질을 판단하시면 곤란합니다. 종류별로 의미가 크게 다릅니다.
            구체적 죄목은{" "}
            <a className="text-neon underline" href="https://info.nec.go.kr" target="_blank" rel="noreferrer">
              선관위 사이트
            </a>
            에서 후보 본인의 정보공개 자료를 확인하세요.
          </li>
          <li>
            본 사이트는 특정 후보를 지지·반대하지 않습니다. 단순 팩트 정리이며, 해석은 독자께 맡깁니다.
          </li>
        </ul>
      </section>

      {/* 관련 페이지 */}
      <section className="text-xs text-paper/50 leading-relaxed mb-6">
        시·도지사 후보 정당별 전과 신고 →{" "}
        <Link href="/stats/parties" className="text-neon underline">
          /stats/parties
        </Link>
      </section>

      {/* 출처 */}
      <section className="text-xs text-paper/40 leading-relaxed border-t border-paper/10 pt-4">
        <p>
          데이터 출처:{" "}
          <a href="https://info.nec.go.kr" target="_blank" rel="noreferrer" className="text-neon underline">
            중앙선거관리위원회 선거통계시스템
          </a>{" "}
          후보자 명부 (추출일: 2026-05-26).
        </p>
      </section>
    </article>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-paper/10 rounded-lg p-3">
      <div className="text-[10px] font-mono text-paper/40">{label}</div>
      <div
        className={`text-xl sm:text-2xl font-black tracking-tightest mt-1 ${
          accent ? "text-neon" : "text-paper"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
