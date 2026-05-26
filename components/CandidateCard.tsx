import type { Candidate } from "@/data/types";
import { PartyChip } from "./PartyChip";

// 천원 단위 문자열("1,823,897") → "18억 2,389만원" 형태로 보기 좋게 변환
function formatKrwFromThousand(raw?: string): string {
  if (!raw) return "—";
  const num = Number(raw.replace(/[^\d-]/g, ""));
  if (!Number.isFinite(num)) return raw;
  const won = num * 1000; // 천원 → 원
  if (won === 0) return "0원";
  const eok = Math.floor(won / 100_000_000);
  const man = Math.floor((won % 100_000_000) / 10_000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (parts.length === 0) parts.push(`${won.toLocaleString()}`);
  return `${parts.join(" ")}원`;
}

// 후보 카드 — 캡쳐해서 공유하기 좋은 정사각형 베이스
export function CandidateCard({ c }: { c: Candidate }) {
  const property = formatKrwFromThousand(c.property);
  const taxPaid = formatKrwFromThousand(c.taxPaid);
  const hasCrim = c.criminalRecord !== "없음" && c.criminalRecord !== "0건";
  const military = (c.military || "—").replace(/\s*\(.*?\)/, "");

  return (
    <article className="border border-paper/15 rounded-xl p-5 bg-paper/[0.02] flex flex-col gap-4 card-hover">
      {/* 헤더: 정당 + 이름 */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <PartyChip candidate={c} />
          <h3 className="text-2xl font-black tracking-tightest mt-2 flex items-baseline gap-2">
            {c.name}
            {c.hanja && (
              <span className="text-xs font-normal text-paper/30 tracking-normal">
                {c.hanja}
              </span>
            )}
          </h3>
          <div className="text-xs text-paper/50 mt-1">
            {[c.age && `${c.age}세`, c.gender, c.occupation].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div className="font-mono text-5xl text-paper/15 font-black leading-none">
          {String(c.number).padStart(2, "0")}
        </div>
      </header>

      {/* 학력 + 경력 (공약 자리 차지 - 공약 데이터는 추후) */}
      {c.career && c.career.length > 0 && (
        <div>
          <div className="text-[11px] font-mono text-neon/70 mb-1.5">주요 경력</div>
          <ul className="space-y-1">
            {c.career.slice(0, 3).map((p, i) => (
              <li key={i} className="text-sm leading-snug flex gap-2">
                <span className="text-neon/60">·</span>
                <span className="text-paper/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.education && c.education.length > 0 && (
        <div>
          <div className="text-[11px] font-mono text-paper/40 mb-1.5">학력</div>
          <ul className="space-y-0.5">
            {c.education.slice(0, 2).map((p, i) => (
              <li key={i} className="text-xs leading-snug text-paper/70">
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 핵심 팩트 4종 */}
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <Fact label="전과" value={c.criminalRecord} highlight={hasCrim} />
        <Fact label="재산" value={property} />
        <Fact label="납세 (5년)" value={taxPaid} />
        <Fact label="병역" value={military} />
      </dl>

      {/* 몰랐쥬 - 트리비아 (실데이터엔 없음, 옵션) */}
      {c.trivia && (
        <div className="border border-neon/30 bg-neon/[0.04] rounded-md px-3 py-2">
          <div className="text-[10px] font-mono text-neon/70">몰랐쥬?</div>
          <div className="text-xs text-paper/85 mt-0.5">{c.trivia}</div>
        </div>
      )}
    </article>
  );
}

function Fact({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="border border-paper/10 rounded-md px-2.5 py-1.5">
      <dt className="text-[10px] text-paper/40 font-mono">{label}</dt>
      <dd className={`mt-0.5 font-semibold ${highlight ? "text-neon" : "text-paper/90"}`}>
        {value}
      </dd>
    </div>
  );
}
