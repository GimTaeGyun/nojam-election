import type { Candidate } from "@/data/types";

// 정당 컬러 (공식 정당색 기준, 일부는 대표 컬러로 근사)
const PARTY_HEX: Record<Candidate["partyKey"], string> = {
  democratic: "#152484", // 더불어민주당
  ppp: "#E61E2B",        // 국민의힘
  rebuilding: "#06275E", // 조국혁신당
  reform: "#FF7920",     // 개혁신당
  justice: "#FFCD00",    // 정의당
  progressive: "#D6001C",// 진보당
  green: "#7BBA3C",      // 녹색당
  women: "#A50034",      // 여성의당
  freedom: "#1B468B",    // 자유통일당 계열
  alliance: "#3A3A3A",   // 국민연합
  indep: "#6B7280",      // 무소속/기타
};

// 글자색 어두운 배경엔 흰색, 노란 계열엔 검정
const DARK_TEXT_KEYS = new Set<Candidate["partyKey"]>(["justice"]);

export function PartyChip({ candidate }: { candidate: Candidate }) {
  const hex = PARTY_HEX[candidate.partyKey] ?? PARTY_HEX.indep;
  const useDark = DARK_TEXT_KEYS.has(candidate.partyKey);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-sm"
      style={{ background: hex, color: useDark ? "#0a0a0a" : "#fff" }}
    >
      <span>기호 {candidate.number}</span>
      <span className="opacity-80">·</span>
      <span>{candidate.party}</span>
    </span>
  );
}
