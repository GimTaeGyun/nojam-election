import Link from "next/link";
import {
  getTopWealth,
  getBottomWealth,
  getTopCriminal,
  getTopRunCount,
  getYoungest,
  getOldest,
  getOverallStats,
  type TopEntry,
} from "@/lib/overallStats";
import { formatKrw } from "@/lib/parseNum";
import { DDayBadge } from "@/components/DDayBadge";
import type { Candidate } from "@/data/types";

export const metadata = {
  title: "전국 후보 Top 5 컬렉션 — 2026 지방선거",
  description:
    "2026 6월 3일 지방선거, 전국 6,700+명 후보 중 재산 Top 5·하위 5, 전과 Top 5, 출마 베테랑 Top 5, 최연소·최고령 Top 5. 한 곳에서 다 본다.",
  keywords: [
    "지방선거 후보 순위",
    "전국 후보 Top",
    "후보자 재산 1위",
    "후보 전과 1위",
    "최연소 후보",
    "출마 베테랑",
    "노잼선거",
    "2026 지방선거",
  ],
  openGraph: {
    title: "전국 후보 Top 5 컬렉션 — 2026 지방선거",
    description:
      "전국 6,700+명 후보 중 재산·전과·나이·출마 베테랑 Top 5 한 곳에서.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "전국 후보 Top 5 — 노잼선거",
    description: "전국 후보 재산·전과·나이·출마 베테랑 Top 5.",
  },
  alternates: { canonical: "https://nojam.kr/stats/top5" },
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

export default function StatsTop5Page() {
  const overall = getOverallStats();
  const topWealth = getTopWealth(5);
  const bottomWealth = getBottomWealth(5);
  const topCriminal = getTopCriminal(5);
  const topRun = getTopRunCount(5);
  const youngest = getYoungest(5);
  const oldest = getOldest(5);

  return (
    <article className="py-10">
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            전국 후보 <span className="text-neon">Top 5</span>
          </h1>
          <DDayBadge className="font-mono text-xs text-paper/40" />
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          2026 제9회 전국동시지방선거 <strong className="text-paper">전 선거직 {overall.total.toLocaleString()}명</strong>{" "}
          중 카테고리별 상위 5명. 선관위 공식 자료.
        </p>
        <p className="text-[11px] text-paper/40 mt-2 leading-relaxed">
          ※ 광역의원비례대표·기초의원비례대표·국회의원 선거는 제외했습니다.
        </p>
      </header>

      {/* 큰 숫자 보드 */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-12">
        <Stat label="총 후보" value={`${overall.total.toLocaleString()}명`} />
        <Stat label="평균 재산" value={formatKrw(overall.avgWealth)} accent />
        <Stat label="평균 나이" value={`${overall.avgAge}세`} accent />
        <Stat label="전과 신고" value={`${overall.hasCrim}명 (${(overall.crimRate * 100).toFixed(0)}%)`} accent />
      </section>

      {/* Top 5 카드 그리드 */}
      <div className="grid md:grid-cols-2 gap-4">
        <Top5Card
          emoji="💰"
          title="재산 Top 5"
          subtitle="가장 부자 후보"
          entries={topWealth}
        />
        <Top5Card
          emoji="💸"
          title="재산 하위 5"
          subtitle="가장 가난한 후보"
          entries={bottomWealth}
        />
        <Top5Card
          emoji="📋"
          title="전과 신고 Top 5"
          subtitle="건수 많은 순"
          entries={topCriminal}
          emptyMessage="전과 신고 후보 없음"
        />
        <Top5Card
          emoji="🔁"
          title="출마 베테랑 Top 5"
          subtitle="입후보 횟수 많은 순"
          entries={topRun}
          emptyMessage="입후보 데이터 없음"
        />
        <Top5Card
          emoji="🌱"
          title="최연소 Top 5"
          subtitle="가장 젊은 후보"
          entries={youngest}
        />
        <Top5Card
          emoji="🎂"
          title="최고령 Top 5"
          subtitle="가장 노련한 후보"
          entries={oldest}
        />
      </div>

      {/* 명시적 주석 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-lg p-5 mt-10 mb-6">
        <div className="text-[11px] font-mono text-neon/80 mb-2">⚠︎ 이 표를 보실 때 알아두실 점</div>
        <ul className="text-sm text-paper/85 leading-relaxed space-y-2">
          <li>
            모든 값은 후보 본인이 선관위에 신고한 자료입니다 (재산·전과·생년월일·출마 횟수).
          </li>
          <li>
            전과는 건수만 표시되며 종류는 별도입니다. 음주운전 1건과 노동운동 1건은 의미가 다릅니다.
          </li>
          <li>
            재산 1위 후보가 곧 "좋은 후보"라는 의미가 아닙니다. 단순 팩트 정리이며, 해석은 독자께 맡깁니다.
          </li>
          <li>
            본 사이트는 특정 후보를 지지·반대하지 않습니다.
          </li>
        </ul>
      </section>

      <section className="text-xs text-paper/40 leading-relaxed border-t border-paper/10 pt-4">
        <p>
          데이터 출처:{" "}
          <a href="https://info.nec.go.kr" target="_blank" rel="noreferrer" className="text-neon underline">
            중앙선거관리위원회 선거통계시스템
          </a>{" "}
          후보자 명부 (추출일: 2026-05-29).
        </p>
      </section>
    </article>
  );
}

function Top5Card({
  emoji,
  title,
  subtitle,
  entries,
  emptyMessage,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  entries: TopEntry[];
  emptyMessage?: string;
}) {
  return (
    <section className="border border-paper/15 rounded-xl p-4 bg-paper/[0.02]">
      <header className="mb-3 flex items-start gap-2">
        <span className="text-2xl shrink-0 leading-none" aria-hidden>
          {emoji}
        </span>
        <div>
          <h2 className="text-base font-black tracking-tightest">{title}</h2>
          <div className="text-[10px] text-paper/50 font-mono mt-0.5">{subtitle}</div>
        </div>
      </header>

      {entries.length === 0 ? (
        <div className="text-xs text-paper/40 text-center py-6">
          {emptyMessage ?? "데이터 없음"}
        </div>
      ) : (
        <ol className="space-y-1.5">
          {entries.map((e) => {
            const hex = PARTY_HEX[e.partyKey] ?? PARTY_HEX.indep;
            const candParam = `cand=${encodeURIComponent(e.name)}`;
            const districtParam = e.district ? `district=${encodeURIComponent(e.district)}&` : "";
            const href =
              e.race === "mayor" || e.race === "council" || e.race === "local"
                ? `/${e.regionCode}?${districtParam}${candParam}#${e.raceHash}`
                : `/${e.regionCode}?${candParam}#${e.raceHash}`;

            return (
              <li key={`${title}-${e.rank}-${e.name}`}>
                <Link
                  href={href}
                  className="flex items-center gap-2 hover:bg-paper/[0.03] rounded-md px-2 py-1.5 -mx-2 transition-colors"
                >
                  <span
                    className={`font-mono text-sm w-4 text-right shrink-0 tabular-nums ${
                      e.rank === 1 ? "text-neon font-bold" : "text-paper/50"
                    }`}
                  >
                    {e.rank}
                  </span>
                  <span
                    className="inline-block w-1 h-3 rounded-sm shrink-0"
                    style={{ background: hex }}
                    aria-hidden
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <span className="font-semibold text-sm truncate">{e.name}</span>
                      <span className="text-[10px] text-paper/55 truncate">{e.party}</span>
                    </div>
                    <span className="text-[9px] text-paper/40 truncate">
                      {e.raceLabel} · {e.shortName}
                    </span>
                  </div>
                  <span
                    className={`ml-auto font-mono text-xs tabular-nums shrink-0 ${
                      e.rank === 1 ? "text-neon font-bold" : "text-paper/85"
                    }`}
                  >
                    {e.valueLabel}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-paper/10 rounded-lg p-3">
      <div className="text-[10px] font-mono text-paper/40">{label}</div>
      <div
        className={`text-base sm:text-xl font-black tracking-tightest mt-1 ${
          accent ? "text-neon" : "text-paper"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
