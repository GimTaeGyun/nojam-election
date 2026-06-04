import Link from "next/link";
import { computePartyStats, getOverallStats } from "@/lib/partyStats";
import { computeEduCriminal, getEduCriminalSummary } from "@/lib/eduCriminalStats";
import { DDayBadge } from "@/components/DDayBadge";
import { CriminalTabsView } from "@/components/CriminalTabsView";
import { isAdmin } from "@/lib/auth";
import { maskedName, maskedParty } from "@/lib/mask";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "후보 전과 신고 현황 — 시·도지사 + 교육감 (2026 지방선거)",
  description:
    "2026 6월 3일 지방선거, 시·도지사 후보 정당별 전과 신고 비율 + 교육감 후보 전과 신고 명단. 한 페이지에서 둘 다. 선관위 공식 자료 전수 집계.",
  keywords: [
    "후보자 전과 신고",
    "정당별 전과",
    "교육감 전과",
    "지방선거 전과",
    "후보 전과 통계",
    "더불어민주당 전과",
    "국민의힘 전과",
    "진보당 전과",
    "시·도지사 후보 전과",
    "교육감 후보 전과",
    "노잼선거",
    "2026 지방선거",
  ],
  openGraph: {
    title: "후보 전과 신고 현황 — 시·도지사 + 교육감 (2026 지방선거)",
    description:
      "시·도지사 후보 정당별 전과 비율 + 교육감 후보 전과 명단. 한 곳에서 다 본다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "후보 전과 신고 현황 — 노잼선거",
    description: "시·도지사 정당별 + 교육감 후보별. 한 곳에서 다 본다.",
  },
  alternates: {
    canonical: "https://nojam.kr/stats/parties",
  },
};

export default function StatsCriminalPage() {
  const admin = isAdmin();
  const govStatsRaw = computePartyStats();
  const eduListRaw = computeEduCriminal();
  // 데모 모드: 정당명·후보명 마스킹. 건수·비율 통계는 그대로.
  const govStats = admin
    ? govStatsRaw
    : govStatsRaw.map((s) => ({
        ...s,
        party: maskedParty(s.partyKey),
        candidates: s.candidates.map((c, i) => ({ ...c, name: `후보 #${i + 1}` })),
      }));
  const eduList = admin
    ? eduListRaw
    : eduListRaw.map((e, i) => ({ ...e, name: maskedName(i) }));
  const govOverall = getOverallStats();
  const eduSummary = getEduCriminalSummary();

  return (
    <article className="py-10">
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            후보 <span className="text-neon">전과 신고</span> 현황
          </h1>
          <DDayBadge className="font-mono text-xs text-paper/40" />
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          2026 제9회 전국동시지방선거 <strong className="text-paper">시·도지사 + 교육감</strong> 한 페이지.
          중앙선관위가 공개한 후보자 명부의 "전과기록유무(건수)" 항목을 집계했습니다.
        </p>
      </header>

      <CriminalTabsView
        gov={{ stats: govStats, overall: govOverall }}
        edu={{ list: eduList, summary: eduSummary }}
      />

      {/* 명시적 주석 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-lg p-5 mb-10">
        <div className="text-[11px] font-mono text-neon/80 mb-2">⚠︎ 이 표를 보실 때 알아두실 점</div>
        <ul className="text-sm text-paper/85 leading-relaxed space-y-2">
          <li>
            <strong className="text-paper">전과의 "건수"만 표시되며 종류는 별도</strong>입니다.
            전과는 음주운전·도로교통법 위반 같은 일반 범죄부터, 노동운동·집회 시위 관련
            (집시법·노조법 위반), 선거법 위반 등 매우 다양한 카테고리를 포함합니다.
          </li>
          <li>
            전과 건수만으로 후보의 자질을 판단하시면 곤란합니다. 종류별로 의미가 크게 다릅니다.
            구체적인 죄목은{" "}
            <a className="text-neon underline" href="https://info.nec.go.kr" target="_blank" rel="noreferrer">
              선관위 사이트
            </a>
            에서 후보 본인의 정보공개 자료를 확인하세요.
          </li>
          <li>
            출마자 수가 적은 정당(1~5명)은 비율 변동이 크니 참고용으로만 보세요.
          </li>
          <li>
            본 사이트는 특정 정당·후보를 지지하거나 반대하지 않습니다. 단순 팩트 정리이며,
            해석은 독자께 맡깁니다.
          </li>
        </ul>
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
        <p className="mt-1">
          오류·정정 요청은{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdjGx_x7QkvQvM2-GWZ7M8KrqFCRS-Crp6CAfmNav-MhWJp7g/viewform"
            target="_blank"
            rel="noreferrer"
            className="text-neon underline"
          >
            문의 폼
          </a>
          으로.
        </p>
      </section>
    </article>
  );
}
