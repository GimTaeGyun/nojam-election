import Link from "next/link";
import { computeWealthRanking, getWealthSummary } from "@/lib/wealthStats";
import { DDayBadge } from "@/components/DDayBadge";
import { WealthTabsView } from "@/components/WealthTabsView";
import { isAdmin } from "@/lib/auth";
import { maskedName, maskedParty } from "@/lib/mask";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "전국 시·도지사·교육감 후보 재산 순위 — 2026 지방선거",
  description:
    "2026 6월 3일 지방선거, 전국 16개 시·도지사 후보 54명·교육감 후보 58명의 재산 신고액 전체 순위. 가장 부자 후보, 평균, 격차까지 한 곳에서. 중앙선관위 공식 자료.",
  keywords: [
    "시도지사 재산",
    "교육감 재산",
    "후보 재산 순위",
    "지방선거 재산",
    "2026 지방선거 부자 후보",
    "서울시장 재산",
    "경기지사 재산",
    "교육감 후보 재산",
    "후보자 재산 신고",
    "노잼선거",
  ],
  openGraph: {
    title: "전국 시·도지사·교육감 후보 재산 순위 — 2026 지방선거",
    description:
      "시·도지사 + 교육감 후보 112명의 재산 신고액 순위. 1위 vs 꼴찌 격차, 평균, 10억 이상 후보 수까지.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "전국 후보 재산 순위 — 노잼선거",
    description: "시·도지사 + 교육감 후보 재산 신고액 전체 순위.",
  },
  alternates: { canonical: "https://nojam.kr/stats/wealth" },
};

export default function StatsWealthPage() {
  const admin = isAdmin();
  const govRankingRaw = computeWealthRanking("gov");
  const eduRankingRaw = computeWealthRanking("edu");
  const govRanking = admin
    ? govRankingRaw
    : govRankingRaw.map((e, i) => ({ ...e, name: maskedName(i), party: maskedParty(e.partyKey) }));
  const eduRanking = admin
    ? eduRankingRaw
    : eduRankingRaw.map((e, i) => ({ ...e, name: maskedName(i), party: maskedParty(e.partyKey) }));
  const govSummary = getWealthSummary("gov");
  const eduSummary = getWealthSummary("edu");

  return (
    <article className="py-10">
      {/* 헤더 */}
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            후보 <span className="text-neon">재산 순위</span>
          </h1>
          <DDayBadge className="font-mono text-xs text-paper/40" />
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          2026 제9회 전국동시지방선거 <strong className="text-paper">시·도지사 {govRanking.length}명 + 교육감 {eduRanking.length}명 전수</strong>.
          중앙선관위 공개 자료의 재산 신고액을 큰 순으로 정렬했습니다.
        </p>
      </header>

      {/* 탭 + 본문 (클라이언트) */}
      <WealthTabsView
        govRanking={govRanking}
        govSummary={govSummary}
        eduRanking={eduRanking}
        eduSummary={eduSummary}
      />

      {/* 명시적 주석 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-lg p-5 mb-10">
        <div className="text-[11px] font-mono text-neon/80 mb-2">⚠︎ 이 표를 보실 때 알아두실 점</div>
        <ul className="text-sm text-paper/85 leading-relaxed space-y-2">
          <li>
            <strong className="text-paper">재산은 후보 본인이 신고한 금액</strong>입니다.
            부동산·금융자산·예금·차량·회원권 등 종합 합계이며, 부채(차입금)는 차감된 순자산 기준입니다.
          </li>
          <li>
            재산 액수만으로 후보의 자질을 판단하지 마세요. 직업·경력·세대 구성·상속 여부 등 맥락이 다 다릅니다.
          </li>
          <li>
            구체적 재산 내역은{" "}
            <a className="text-neon underline" href="https://info.nec.go.kr" target="_blank" rel="noreferrer">
              선관위 사이트
            </a>
            에서 확인하세요.
          </li>
          <li>
            본 사이트는 특정 후보를 지지·반대하지 않습니다. 단순 팩트 정리이며, 해석은 독자께 맡깁니다.
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
          오류·정정은{" "}
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
