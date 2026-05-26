import type { Region } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// 노잼선거 — 시·도 메타 데이터 (2026년 기준 16개 광역자치단체)
// ※ 광주광역시 + 전라남도가 "전남광주통합특별시"로 통합되어 광역 16개로 재편.
// ─────────────────────────────────────────────────────────────────────────

export const REGIONS_META: Omit<Region, "races">[] = [
  { code: "seoul",            name: "서울특별시",         shortName: "서울",         vibe: "그래 너 사는 그 동네 맞아" },
  { code: "busan",            name: "부산광역시",         shortName: "부산",         vibe: "마! 한 번 봐봐라" },
  { code: "daegu",            name: "대구광역시",         shortName: "대구",         vibe: "확실하게 보고 가입시다" },
  { code: "incheon",          name: "인천광역시",         shortName: "인천",         vibe: "공항만 인천이 아닙니다" },
  { code: "daejeon",          name: "대전광역시",         shortName: "대전",         vibe: "중간점검의 도시" },
  { code: "ulsan",            name: "울산광역시",         shortName: "울산",         vibe: "공장 말고 정치도" },
  { code: "sejong",           name: "세종특별자치시",     shortName: "세종",         vibe: "수도권 다음은 여기" },
  { code: "gyeonggi",         name: "경기도",              shortName: "경기",         vibe: "인구 1340만의 무게" },
  { code: "gangwon",          name: "강원특별자치도",     shortName: "강원",         vibe: "스키만 타고 갈래?" },
  { code: "chungbuk",         name: "충청북도",            shortName: "충북",         vibe: "조용히 중요한 곳" },
  { code: "chungnam",         name: "충청남도",            shortName: "충남",         vibe: "기업 많은 동네" },
  { code: "jeonbuk",          name: "전북특별자치도",     shortName: "전북",         vibe: "비빔밥 말고 후보도" },
  { code: "gwangju_jeonnam",  name: "전남광주통합특별시", shortName: "전남광주",     vibe: "통합 후 첫 선거" },
  { code: "gyeongbuk",        name: "경상북도",            shortName: "경북",         vibe: "광역의 형님" },
  { code: "gyeongnam",        name: "경상남도",            shortName: "경남",         vibe: "산업의 본진" },
  { code: "jeju",             name: "제주특별자치도",     shortName: "제주",         vibe: "여행 말고 정치도" },
];

export const REGION_BY_CODE: Record<string, Omit<Region, "races">> =
  Object.fromEntries(REGIONS_META.map((r) => [r.code, r]));
