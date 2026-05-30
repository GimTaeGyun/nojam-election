import type { Region, Candidate, Race } from "./types";
import { REGIONS_META } from "./regions";
import governorsData from "./governors.json";
import superintendentsData from "./superintendents.json";
import mayorsData from "./mayors.json";

// ─────────────────────────────────────────────────────────────────────────
// 노잼선거 — 후보자 데이터
// 출처: 중앙선거관리위원회 선거통계시스템 (info.nec.go.kr) 후보자 명부
// 추출일: 2026-05-26
// ─────────────────────────────────────────────────────────────────────────

type RawCandidates = Record<
  string,
  {
    regionName: string;
    candidates: Array<{
      number: number;
      name: string;
      hanja?: string;
      party: string;
      partyKey: string;
      age?: number | null;
      gender?: string | null;
      birth?: string;
      address?: string;
      occupation?: string;
      education?: string[];
      career?: string[];
      property?: string;
      military?: string;
      taxPaid?: string;
      taxArrears5yr?: string;
      taxArrearsCurrent?: string;
      criminalRecord?: string;
      runCount?: string;
    }>;
  }
>;

const GOVERNORS = governorsData as unknown as RawCandidates;
const SUPERINTENDENTS = superintendentsData as unknown as RawCandidates;

type RawMayors = Record<
  string,
  {
    regionName: string;
    candidates: Array<
      RawCandidates[string]["candidates"][number] & { district: string }
    >;
  }
>;
const MAYORS = mayorsData as unknown as RawMayors;

const toCandidate = (c: RawCandidates[string]["candidates"][number]): Candidate => ({
  number: c.number,
  name: c.name,
  hanja: c.hanja || undefined,
  party: c.party,
  partyKey: c.partyKey as Candidate["partyKey"],
  age: c.age ?? undefined,
  gender: c.gender ?? undefined,
  birth: c.birth,
  address: c.address,
  occupation: c.occupation,
  education: c.education,
  career: c.career,
  property: c.property,
  military: c.military,
  taxPaid: c.taxPaid,
  taxArrears5yr: c.taxArrears5yr,
  taxArrearsCurrent: c.taxArrearsCurrent,
  criminalRecord: c.criminalRecord || "없음",
  runCount: c.runCount,
});

const buildRaces = (regionCode: string, regionName: string): Race[] => {
  const races: Race[] = [];

  const gov = GOVERNORS[regionCode];
  if (gov && gov.candidates.length) {
    races.push({
      type: "광역단체장",
      title: `${regionName} 시·도지사`,
      candidates: gov.candidates.map(toCandidate),
    });
  }

  const edu = SUPERINTENDENTS[regionCode];
  if (edu && edu.candidates.length) {
    races.push({
      type: "교육감",
      title: `${regionName} 교육감`,
      candidates: edu.candidates.map(toCandidate),
    });
  }

  const mayors = MAYORS[regionCode];
  if (mayors && mayors.candidates.length) {
    races.push({
      type: "기초단체장",
      title: `${regionName} 구청장·시장·군수`,
      candidates: mayors.candidates.map((m) => ({
        ...toCandidate(m),
        district: m.district,
      })),
    });
  }

  return races;
};

export const REGIONS: Region[] = REGIONS_META.map((meta) => ({
  ...meta,
  races: buildRaces(meta.code, meta.name),
}));

export const getRegion = (code: string): Region | undefined =>
  REGIONS.find((r) => r.code === code);

// 실데이터 사용 중. 샘플 배너 비활성.
export const IS_SAMPLE_DATA = false;
