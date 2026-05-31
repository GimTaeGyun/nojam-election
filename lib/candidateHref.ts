// 후보 카드로 자동 점프하는 URL을 만드는 헬퍼.
// RaceTabs가 ?cand=이름 쿼리를 보고 카드로 자동 스크롤합니다.
// 새 통계 페이지 만들 때는 무조건 이 헬퍼 쓰는 게 안전.

export type CandidateRace = "gov" | "edu" | "mayor" | "council" | "local";

const RACE_HASH: Record<CandidateRace, string> = {
  gov: "governor",
  edu: "edu",
  mayor: "mayor",
  council: "council",
  local: "local",
};

export interface CandidateLinkInput {
  regionCode: string;
  race: CandidateRace;
  name: string;
  district?: string;
}

/**
 * 후보 카드로 직행하는 URL 생성.
 * @example
 * buildCandidateHref({ regionCode: "seoul", race: "gov", name: "오세훈" })
 * // → "/seoul?cand=%EC%98%A4%EC%84%B8%ED%9B%88#governor"
 *
 * buildCandidateHref({ regionCode: "seoul", race: "mayor", name: "정문헌", district: "종로구" })
 * // → "/seoul?district=%EC%A2%85%EB%A1%9C%EA%B5%AC&cand=%EC%A0%95%EB%AC%B8%ED%97%8C#mayor"
 */
export function buildCandidateHref(input: CandidateLinkInput): string {
  const params = new URLSearchParams();
  if (input.district) {
    params.set("district", input.district);
  }
  params.set("cand", input.name);
  const hash = RACE_HASH[input.race];
  return `/${input.regionCode}?${params.toString()}#${hash}`;
}
