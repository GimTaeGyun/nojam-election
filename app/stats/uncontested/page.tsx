import Link from "next/link";
import { getUncontested, getUncontestedByParty, type UncontestedCandidate } from "@/lib/uncontested";
import { buildCandidateHref } from "@/lib/candidateHref";
import { DDayBadge } from "@/components/DDayBadge";
import { formatThousandWonAsKrw } from "@/lib/parseNum";
import type { Candidate } from "@/data/types";
import { isAdmin } from "@/lib/auth";
import { maskedName, maskedParty } from "@/lib/mask";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "이미 당선된 자들이 있다? — 무투표 당선 112명 (2026 지방선거)",
  description:
    "2026 6월 3일 지방선거에서 후보가 1명뿐이라 투표 없이 자동 당선되는 후보 112명 전체 명단. 구청장 3명 + 시·도의원 109명. 선관위 공식 자료.",
  keywords: [
    "무투표 당선",
    "단독 출마",
    "지방선거 자동 당선",
    "2026 지방선거",
    "노잼선거",
    "선거구",
  ],
  openGraph: {
    title: "이미 당선된 자들이 있다? — 무투표 당선 112명",
    description: "표 없이 당선된 112명. 구청장 3명 + 시·도의원 109명. 선관위 공식 자료.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "이미 당선된 자들이 있다? — 노잼선거",
    description: "표 없이 당선된 112명 전체 명단.",
  },
  alternates: { canonical: "https://nojam.kr/stats/uncontested" },
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

export default function UncontestedPage() {
  const admin = isAdmin();
  const raw = getUncontested();
  // 데모 모드: 이름·정당 마스킹. 정당별 분포는 partyKey 기준이라 유지.
  const maskList = (list: UncontestedCandidate[]): UncontestedCandidate[] =>
    admin
      ? list
      : list.map((c, i) => ({
          ...c,
          name: maskedName(i),
          party: maskedParty(c.partyKey),
          property: undefined,
          criminalRecord: c.criminalRecord && c.criminalRecord !== "없음" ? "신고 있음" : "없음",
        }));
  const mayors = maskList(raw.mayors);
  const councilors = maskList(raw.councilors);
  const all = [...mayors, ...councilors];
  const byParty = admin
    ? getUncontestedByParty()
    : getUncontestedByParty().map((p) => ({ ...p, party: maskedParty(p.partyKey) }));
  const total = all.length;

  // 시·도의원: regionName 단위로 그룹화
  const councilByRegion = groupBy(councilors, (c) => c.regionName);
  const mayorByRegion = groupBy(mayors, (c) => c.regionName);

  return (
    <article className="py-10">
      <header className="mb-10">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tightest">
            이미 당선된 자들이 <span className="text-neon">있다?</span>
          </h1>
          <DDayBadge className="font-mono text-xs text-paper/40" />
        </div>
        <p className="text-sm text-paper/60 mt-3 leading-relaxed">
          후보가 <strong className="text-paper">1명뿐</strong>인 선거구는 투표 없이 자동 당선됩니다 (공직선거법 무투표 당선).
          이번 선거에서 그렇게 결정된 후보가 전국 <strong className="text-neon">{total}명</strong>이에요.
        </p>
        <p className="text-[11px] text-paper/40 mt-2 leading-relaxed">
          ※ 구·시·군의원은 중선거구제(한 선거구 2~4자리)로 정원 데이터 부족 — 본 페이지에 포함되지 않습니다.
        </p>
      </header>

      {/* 큰 숫자 보드 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-xl p-6 mb-10">
        <div className="text-[10px] font-mono text-neon/80">표 안 받고 당선</div>
        <div className="text-5xl sm:text-6xl font-black tracking-tightest mt-1">
          {total}<span className="text-2xl text-paper/60 ml-2">명</span>
        </div>
        <div className="text-xs text-paper/70 mt-2 font-mono">
          시·도의원 {councilors.length} + 구청장·시장·군수 {mayors.length}
        </div>
      </section>

      {/* 정당별 분포 */}
      <section className="mb-12">
        <div className="text-[11px] font-mono text-paper/40 mb-2">정당별 분포</div>
        <div className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {byParty.map((p) => {
            const pct = (p.count / total) * 100;
            return (
              <div key={p.partyKey} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ background: PARTY_HEX[p.partyKey] ?? PARTY_HEX.indep }}
                  aria-hidden
                />
                <span className="font-bold w-28 sm:w-32 truncate">{p.party}</span>
                <div className="flex-1 h-2 bg-paper/[0.04] rounded-sm overflow-hidden">
                  <div
                    className="h-full"
                    style={{ width: `${pct}%`, background: "rgba(212,255,0,0.55)" }}
                  />
                </div>
                <span className="font-mono text-sm tabular-nums shrink-0">
                  {p.count}명 <span className="text-paper/40 text-xs">({pct.toFixed(0)}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 구청장 섹션 */}
      <section className="mb-10">
        <h2 className="text-xl font-black tracking-tightest mb-1">
          구청장·시장·군수 <span className="text-neon">{mayors.length}명</span>
        </h2>
        <div className="text-xs text-paper/50 font-mono mb-4">단독 출마 — 무투표 당선</div>
        <div className="space-y-2">
          {Array.from(mayorByRegion.entries()).map(([regionName, list]) => (
            <RegionGroup key={regionName} regionName={regionName} list={list} />
          ))}
        </div>
      </section>

      {/* 시·도의원 섹션 */}
      <section className="mb-12">
        <h2 className="text-xl font-black tracking-tightest mb-1">
          시·도의원 <span className="text-neon">{councilors.length}명</span>
        </h2>
        <div className="text-xs text-paper/50 font-mono mb-4">단독 출마 — 무투표 당선</div>
        <div className="space-y-4">
          {Array.from(councilByRegion.entries()).map(([regionName, list]) => (
            <RegionGroup key={regionName} regionName={regionName} list={list} />
          ))}
        </div>
      </section>

      {/* 중립성 안내 */}
      <section className="border border-paper/10 rounded-lg p-5 mb-6 bg-paper/[0.02]">
        <div className="text-[11px] font-mono text-paper/50 mb-2">⚠︎ 알아두실 점</div>
        <ul className="text-sm text-paper/75 leading-relaxed space-y-1.5">
          <li>
            무투표 당선은 공직선거법상 정상 절차입니다. 단독 출마 자체가 후보 본인의 잘못은 아닙니다.
          </li>
          <li>
            다만 "지역 정치 경쟁 부재"라는 시스템적 의미가 있습니다 — 시민의 선택권이 없는 상태입니다.
          </li>
          <li>
            본 사이트는 특정 후보·정당을 지지하거나 반대하지 않습니다. 사실 정리입니다.
          </li>
        </ul>
      </section>

      <section className="text-xs text-paper/40 leading-relaxed border-t border-paper/10 pt-4">
        <p>
          데이터 출처:{" "}
          <a href="https://info.nec.go.kr" target="_blank" rel="noreferrer" className="text-neon underline">
            중앙선거관리위원회 선거통계시스템
          </a>{" "}
          후보자 명부 (추출일: 2026-05-29). 후보 클릭 시 해당 지역 페이지로 이동합니다.
        </p>
      </section>
    </article>
  );
}

function RegionGroup({
  regionName,
  list,
}: {
  regionName: string;
  list: UncontestedCandidate[];
}) {
  return (
    <div className="border border-paper/10 rounded-lg overflow-hidden">
      <div className="bg-paper/[0.03] px-4 py-2 flex items-baseline justify-between gap-2">
        <span className="font-bold text-sm">{regionName}</span>
        <span className="text-[11px] font-mono text-paper/50">{list.length}명</span>
      </div>
      <ul className="divide-y divide-paper/5">
        {list.map((c, i) => (
          <li key={`${c.regionCode}-${c.district}-${c.constituency ?? ""}-${i}`}>
            <Link
              href={buildCandidateHref({
                regionCode: c.regionCode,
                race: c.race,
                name: c.name,
                district: c.district,
              })}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper/[0.03] transition-colors"
            >
              <span
                className="inline-block w-1 h-3.5 rounded-sm shrink-0"
                style={{ background: PARTY_HEX[c.partyKey] ?? PARTY_HEX.indep }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-[11px] text-paper/55 ml-1.5">{c.party}</span>
                </div>
                <div className="text-[10px] font-mono text-paper/45 truncate">
                  {c.district}
                  {c.constituency && c.constituency !== c.district && ` · ${c.constituency}`}
                </div>
              </div>
              {c.property && (
                <span className="text-[10px] font-mono text-paper/50 tabular-nums shrink-0 hidden sm:inline">
                  {formatThousandWonAsKrw(c.property)}
                </span>
              )}
              {c.criminalRecord && c.criminalRecord !== "없음" && (
                <span className="text-[10px] font-mono text-neon tabular-nums shrink-0">
                  전과 {c.criminalRecord}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function groupBy<T, K>(arr: T[], keyFn: (t: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of arr) {
    const k = keyFn(item);
    const list = map.get(k) ?? [];
    list.push(item);
    map.set(k, list);
  }
  return map;
}
