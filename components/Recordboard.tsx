import type { Candidate } from "@/data/types";
import {
  parseThousandWon,
  parseCriminalCount,
  parseRunCount,
  formatKrw,
} from "@/lib/parseNum";

interface Record {
  emoji: string;
  label: string;
  candidate: Candidate;
  value: string;
}

function buildRecords(list: Candidate[]): Record[] {
  if (list.length === 0) return [];

  const richest = [...list].sort(
    (a, b) => parseThousandWon(b.property) - parseThousandWon(a.property)
  )[0];
  const poorest = [...list].sort(
    (a, b) => parseThousandWon(a.property) - parseThousandWon(b.property)
  )[0];
  const mostCrim = [...list].sort(
    (a, b) => parseCriminalCount(b.criminalRecord) - parseCriminalCount(a.criminalRecord)
  )[0];
  const youngest = [...list].sort((a, b) => (a.age ?? 999) - (b.age ?? 999))[0];
  const oldest = [...list].sort((a, b) => (b.age ?? 0) - (a.age ?? 0))[0];
  const mostRun = [...list].sort(
    (a, b) => parseRunCount(b.runCount) - parseRunCount(a.runCount)
  )[0];

  const records: Record[] = [
    {
      emoji: "💰",
      label: "최고 부자",
      candidate: richest,
      value: formatKrw(parseThousandWon(richest.property)),
    },
    {
      emoji: "💸",
      label: "최저 재산",
      candidate: poorest,
      value: formatKrw(parseThousandWon(poorest.property)),
    },
  ];
  // 전과 0건만 있는 경우 카드 숨김 (네거티브 없으면 의미 없음)
  if (parseCriminalCount(mostCrim.criminalRecord) > 0) {
    records.push({
      emoji: "📋",
      label: "전과 신고 최다",
      candidate: mostCrim,
      value: mostCrim.criminalRecord,
    });
  }
  records.push({
    emoji: "🌱",
    label: "최연소",
    candidate: youngest,
    value: `${youngest.age}세`,
  });
  records.push({
    emoji: "🎂",
    label: "최고령",
    candidate: oldest,
    value: `${oldest.age}세`,
  });
  records.push({
    emoji: "🔁",
    label: "출마 베테랑",
    candidate: mostRun,
    value: mostRun.runCount ?? "—",
  });
  return records;
}

export function Recordboard({ candidates, raceTitle }: { candidates: Candidate[]; raceTitle: string }) {
  const records = buildRecords(candidates);
  if (records.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[11px] font-mono text-neon/70">기네스 기록</div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tightest">
            {raceTitle} <span className="text-paper/50 font-normal text-base">의 극단값</span>
          </h2>
        </div>
        <div className="text-[11px] text-paper/40 font-mono">click → 후보 카드로</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {records.map((r) => (
          <a
            key={r.label}
            href={`#candidate-${r.candidate.number}`}
            className="card-hover border border-paper/15 rounded-xl p-4 bg-paper/[0.02] block"
          >
            <div className="text-[10px] font-mono text-neon/70 flex items-center gap-1">
              <span>{r.emoji}</span>
              <span>{r.label}</span>
            </div>
            <div className="text-lg sm:text-xl font-black tracking-tightest mt-1 leading-tight">
              {r.candidate.name}
            </div>
            <div className="text-xs text-paper/50 mt-0.5">{r.candidate.party}</div>
            <div className="text-sm text-neon font-bold mt-2">{r.value}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
