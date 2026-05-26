// 노잼선거 데이터 타입
// 중앙선관위 후보자정보 공개 자료 (info.nec.go.kr) 의 컬럼을 본떠 설계.

export type PartyKey =
  | "democratic" // 더불어민주당
  | "ppp" // 국민의힘
  | "rebuilding" // 조국혁신당
  | "reform" // 개혁신당
  | "justice" // 정의당
  | "progressive" // 진보당
  | "green" // 녹색당
  | "women" // 여성의당
  | "freedom" // 자유통일당 / 기독자유통일당
  | "alliance" // 국민연합
  | "indep"; // 무소속/기타

export type RaceType =
  | "광역단체장" // 시·도지사
  | "교육감";

export interface Candidate {
  /** 기호 (선관위 부여 번호) */
  number: number;
  /** 후보자명 (한글) */
  name: string;
  /** 한자명 (있을 시) */
  hanja?: string;
  /** 정당명 (한글 원문) */
  party: string;
  /** 정당 컬러 키 */
  partyKey: PartyKey;
  /** 나이 (선거일 기준) */
  age?: number;
  /** 성별 */
  gender?: string;
  /** 생년월일 (YYYY.MM.DD) */
  birth?: string;
  /** 주소 (시·군·구 + 도로명) */
  address?: string;
  /** 현재 직업/직책 */
  occupation?: string;
  /** 학력 (다중 줄) */
  education?: string[];
  /** 주요 경력 (다중 줄) */
  career?: string[];
  /** 5대 공약 / 핵심 공약 — 별도 수집 시 채워짐 */
  pledges?: string[];
  /** 전과 ("없음" / "n건") */
  criminalRecord: string;
  /** 재산 신고액 (천원 단위 문자열, 예: "1,823,897") */
  property?: string;
  /** 최근 5년 납부액 (천원 단위) */
  taxPaid?: string;
  /** 최근 5년간 체납액 */
  taxArrears5yr?: string;
  /** 현체납액 */
  taxArrearsCurrent?: string;
  /** 병역 */
  military?: string;
  /** 입후보 횟수 (예: "3회") */
  runCount?: string;
  /** 트리비아 (선택) */
  trivia?: string;
}

export interface Race {
  type: RaceType;
  /** 선거명 풀네임 */
  title: string;
  candidates: Candidate[];
}

export interface Region {
  /** URL slug */
  code: string;
  /** 정식 행정구역명 */
  name: string;
  /** 짧은 이름 */
  shortName: string;
  /** 한 줄 카피 */
  vibe?: string;
  races: Race[];
}
