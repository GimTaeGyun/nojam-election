import Link from "next/link";
import { computeWealthRanking, getWealthSummary } from "@/lib/wealthStats";
import { formatKrw } from "@/lib/parseNum";
import { ddayLabel } from "@/lib/dday";
import type { Candidate } from "@/data/types";

export const metadata = {
  title: "전국 시·도지사 후보 재산 순위 — 2026 지방선거",
  description:
    "2026 6월 3일 지방선거, 전국 16개 시·도지사 후보 54명의 재산 신고액 전체 순위. 가장 부자 후보, 평균, 격차까지 한 곳에서. 중앙선관위 공식 자료.",
  keywords: [
    "시도지사 재산",
    "후보 재산 순위",
    "지방선거 재산",
    "2026 지방선거 부자 후보",
    "서울시장 재산",
    "경기지사 재산",
    "후보자 재산 신고",
    "노잼선거",
  ],
  openGraph: {
    title: "전국 시·도지사 후보 재산 순위 — 2026 지방선거",
    description:
      "전국 16개 시·도지사 후보 54명의 재산 신고액 순위. 1위 vs 꼴찌 격차, 평균, 10억 이상 후보 수까지.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "전국 시·도지사 후보 재산 순위 — 노잼선거",
    description:
      "전국 시·도지사 후보 54명 재산 신고액 전체 순위. 1위 vs 꼴찌 격차.",
  },
  alternates: { canonical: "https://nojam.kr/stats/wealth" },
};

const PARTY_HEX: Record<Candidate["partyKey"], string> = {
  democratic: "#152484",
  ppp: "#E61E2B",
  rebuilding: "#06275E",
  reform: "#FF7920",
  justice: "#FFCD00",
  progressive: "#D6001C",
  green: "#7BBA3C",
  women: "#A50034",
  freedom: "#1B468B",
  alliance: "#3A3A3A",
  indep: "#6B7280",
};

export default function StatsWealthPage() {
  const ranking = computeWealthRanking();
  const summary = getWealthSummary();
  const maxWealth = ranking[0]?.wealthWon ?? 1;

  return (
    <article className="py-10">
      {/* 헤더 */}
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            전국 시·도지사 <span className="text-neon">재산 순위</span>
          </h1>
          <span className="font-mono text-xs text-paper/40">{ddayLabel()}</span>
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          2026 제9회 전국동시지방선거 <strong className="text-paper">시·도지사 후보 {summary.total}명 전수</strong>.
          중앙선관위가 공개한 후보자 명부의 재산 신고액을 큰 순으로 정렬했습니다.
        </p>
      </header>

      {/* 요약 통계 */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-10">
        <Stat label="총 후보" value={`${summary.total}명`} />
        <Stat label="평균 재산" value={formatKrw(summary.avg)} accent />
        <Stat label="10억 이상" value={`${summary.over10b}명`} accent />
        <Stat label="1위 ÷ 꼴찌" value={`${summary.gap}배`} accent />
      </section>

      {/* Top-Bottom 비교 */}
      {summary.top && summary.bottom && (
        <section className="grid grid-cols-2 gap-3 mb-10">
          <div className="border border-neon/40 bg-neon/[0.04] rounded-xl p-4">
            <div className="text-[10px] font-mono text-neon/80">최고 부자</div>
            <Link
              href={`/${summary.top.regionCode}`}
              className="block text-xl font-black tracking-tightest mt-1 hover:text-neon"
            >
              {summary.top.name}
            </Link>
            <div className="text-xs text-paper/60 mt-1">
              {summary.top.party} · {summary.top.regionName}
            </div>
            <div className="text-base text-neon font-bold mt-2 tabular-nums">
              {formatKrw(summary.top.wealthWon)}
            </div>
          </div>
          <div className="border border-paper/15 rounded-xl p-4">
            <div className="text-[10px] font-mono text-paper/50">최저 재산</div>
            <Link
              href={`/${summary.bottom.regionCode}`}
              className="block text-xl font-black tracking-tightest mt-1 hover:text-neon"
            >
              {summary.bottom.name}
            </Link>
            <div className="text-xs text-paper/60 mt-1">
              {summary.bottom.party} · {summary.bottom.regionName}
            </div>
            <div className="text-base font-bold mt-2 tabular-nums">
              {formatKrw(summary.bottom.wealthWon)}
            </div>
          </div>
        </section>
      )}

      {/* 전체 랭킹 */}
      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tightest mb-1">전체 순위</h2>
        <div className="text-xs text-paper/50 font-mono mb-4">재산 신고액 많은 순 · 클릭 시 해당 지역으로</div>

        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {ranking.map((e) => {
            const pct = (e.wealthWon / maxWealth) * 100;
            const isTop = e.rank === 1;
            const hex = PARTY_HEX[e.partyKey] ?? PARTY_HEX.indep;
            return (
              <Link
                key={`${e.regionCode}-${e.name}-${e.rank}`}
                href={`/${e.regionCode}`}
                className="flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
              >
                <span
                  className={`font-mono text-sm w-7 text-right tabular-nums ${
                    isTop ? "text-neon font-bold" : "text-paper/50"
                  }`}
                >
                  {e.rank}
                </span>
                <span className="font-semibold w-16 sm:w-20 truncate text-sm">
                  {e.name}
                </span>
                <span
                  className="hidden sm:inline-block w-1 h-3 rounded-sm shrink-0"
                  style={{ background: hex }}
                  aria-hidden
                />
                <span className="text-[10px] text-paper/50 hidden sm:inline-block w-20 truncate">
                  {e.party}
                </span>
                <span className="text-[10px] text-paper/40 hidden md:inline-block w-24 truncate">
                  {e.regionName}
                </span>
                <div className="flex-1 h-5 bg-paper/[0.04] rounded-sm relative overflow-hidden min-w-0">
                  <div
                    className="absolute left-0 top-0 h-full rounded-sm"
                    style={{
                      width: `${Math.max(pct, 0.5)}%`,
                      background: isTop ? "#d4ff00" : "rgba(212,255,0,0.55)",
                    }}
                  />
                </div>
                <span
                  className={`font-mono text-xs min-w-[90px] sm:min-w-[110px] text-right shrink-0 tabular-nums ${
                    isTop ? "text-neon font-bold" : "text-paper/85"
                  }`}
                >
                  {formatKrw(e.wealthWon)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

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
            구체적 재산 내역은 후보 본인의 정보공개 자료(<a className="text-neon underline" href="https://info.nec.go.kr" target="_blank" rel="noreferrer">선관위 사이트</a>)에서 확인하세요.
          </li>
          <li>
            본 사이트는 특정 후보를 지지하거나 반대하지 않습니다. 단순 팩트 정리이며, 해석은 독자께 맡깁니다.
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
