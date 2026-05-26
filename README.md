# 노잼선거 (NOJAM ELECTION)

> 정치 노잼인 거 아는데, 5분만.
>
> 2026년 6월 3일 제9회 전국동시지방선거 — 우리 동네 시·도지사 + 교육감 후보를 30초 룰로 정리한 팩트 기반 사이트.

---

## 컨셉 요약

| 항목 | 내용 |
| --- | --- |
| 사이트명 | 노잼선거 / NOJAM ELECTION |
| 한 줄 카피 | 정치 노잼인 거 아는데, 5분만. |
| 톤 | 쿨하게 팩트만, B급 위트 살짝, 다크모드 + 네온 포인트 |
| 데이터 | 중앙선거관리위원회 (info.nec.go.kr) 공식 자료 |
| 중립성 | 모든 후보 동일 양식·동일 분량, 선관위 부여 기호 순 |

### 7가지 바이럴 장치
1. **자조적 D-Day** — 상단 마키와 히어로에 "노잼까지 D-N"
2. **"5분 가이드"** 카피 — 진지함 대신 효율
3. **카드 1장 = 후보 1명** — 인스타·카톡 캡쳐 공유 친화
4. **공유 버튼** — 네이티브 share API + 링크 복사
5. **"몰랐쥬?" 트리비아** — 후보별 1줄 팩트
6. **다크모드 + 네온 시그니처** — 정치 사이트 답지 않은 무드
7. **"이거 보고도 안 가면 어쩔 수 없고~"** — 가벼운 자기인식 클로징

---

## 빠른 시작

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 프로덕션 빌드
```

> Node 18.17+ 권장 (Next.js 14 요구사항).

---

## 배포

### Vercel (가장 빠름, 무료)
1. 이 폴더를 GitHub 저장소로 푸시
2. [vercel.com](https://vercel.com) 에서 "New Project" → GitHub 저장소 선택
3. 그대로 Deploy. 도메인 연결은 프로젝트 설정의 Domains 메뉴.

### Netlify
Vercel과 유사. Build command `next build`, Publish directory는 비워두고 Netlify Next.js 어댑터가 처리.

### 정적 호스팅 (GitHub Pages 등)
`next.config.mjs` 상단의 `output: "export"` 주석을 해제하면 `npm run build` 시 `out/` 폴더에 정적 파일이 생성됩니다.
※ 단, `output: "export"` 모드에서는 `opengraph-image.tsx` 의 dynamic OG가 빌드 타임에 고정 이미지로 굽혀집니다.

### 도메인
프로젝트 코드 곳곳의 `https://nojam.vote` 를 실제 도메인으로 일괄 치환하세요.
- `app/layout.tsx` 의 `SITE_URL`
- `app/sitemap.ts`, `app/robots.ts`
- `app/opengraph-image.tsx`, `app/[region]/opengraph-image.tsx` 의 푸터 표기

---

## 데이터 업데이트 (선관위 실데이터 반영)

후보 등록 마감(2026년 5월 16일) 이후, 중앙선관위에서 후보자 정보를 공개합니다.

### 1. 데이터 출처
- **공식 사이트**: [info.nec.go.kr](https://info.nec.go.kr) — 후보자명·정당·공약·전과·재산·납세·병역·학력
- **정책 공약**: [policy.nec.go.kr](https://policy.nec.go.kr)
- **공공데이터포털**: [data.go.kr](https://www.data.go.kr) — 과거 선거 결과 OpenAPI

### 2. 교체 절차
`data/candidates.ts` 의 `buildRaces()` 헬퍼를 지우고, 아래와 같이 정적 `Candidate` 객체로 직접 작성합니다.

```ts
import type { Region, Candidate } from "./types";

const SEOUL_GOV: Candidate[] = [
  {
    number: 1,
    name: "홍길동",
    party: "○○당",
    partyKey: "democratic",
    age: 52,
    gender: "남",
    occupation: "現 ○○ 국회의원",
    education: ["서울대 정치학과", "○○대학원 정치학 박사"],
    career: ["前 ○○부 장관", "前 ○○시 시장"],
    pledges: ["GTX-X 노선 추진", "청년 주거 5만호", "..."],
    criminalRecord: "없음",
    property: "12억 3,400만원",
    taxPaid: "1억 8,700만원",
    military: "육군 병장 만기전역",
    trivia: "본 사이트가 사실 확인한 1줄 팩트",
  },
  // ...
];

export const REGIONS: Region[] = [
  {
    code: "seoul", name: "서울특별시", shortName: "서울",
    races: [
      { type: "광역단체장", title: "서울특별시장", candidates: SEOUL_GOV },
      // ...
    ],
  },
  // ...
];
export const IS_SAMPLE_DATA = false; // 실데이터 반영 후 false 로 변경
```

`IS_SAMPLE_DATA = false` 로 바꾸면 상단 노란 경고 배너가 자동으로 사라집니다.

### 3. JSON 분리(선택)
빈번한 업데이트가 예상되면 `data/regions.json` 으로 분리한 뒤 `candidates.ts` 에서 `import`로 불러오는 구조로 리팩터링하세요.

---

## 디렉터리 구조

```
nojam-election/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 + 메타데이터
│   ├── page.tsx                # 메인 (히어로 + 지역 그리드)
│   ├── globals.css             # 전역 스타일 + 그레인 효과
│   ├── opengraph-image.tsx     # 메인 OG 카드 (1200x630)
│   ├── not-found.tsx           # 404
│   ├── sitemap.ts              # /sitemap.xml
│   ├── robots.ts               # /robots.txt
│   ├── about/
│   │   └── page.tsx            # 소개 / 중립성 / 데이터 출처
│   └── [region]/
│       ├── page.tsx            # 지역별 후보 페이지
│       └── opengraph-image.tsx # 지역별 OG 카드
├── components/
│   ├── Marquee.tsx             # 상단 노란 마키 띠
│   ├── DDayHero.tsx            # 메인 히어로
│   ├── RegionGrid.tsx          # 17개 시·도 그리드
│   ├── WhyNojam.tsx            # 왜 노잼선거? 섹션
│   ├── Disclaimer.tsx          # 샘플 데이터 경고
│   ├── CandidateCard.tsx       # 후보 카드 (캡쳐 공유 최적화)
│   ├── PartyChip.tsx           # 정당 칩
│   ├── ShareBar.tsx            # 공유 버튼 (네이티브 + 복사)
│   └── Footer.tsx              # 풋터
├── data/
│   ├── types.ts                # TS 타입 정의
│   ├── regions.ts              # 17개 시·도 메타
│   └── candidates.ts           # 후보 데이터 (현재: 샘플)
├── lib/
│   └── dday.ts                 # D-Day 계산
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 홍보 전략 (실전 팁)

### 트위터/X
- 사이트 링크 + 한 줄 카피
- 좋은 트윗 예: "지방선거 노잼인 거 인정. 그래서 만들었음. 5분이면 내 동네 후보 다 봄. nojam.vote"

### 인스타
- 카드형 디자인이라 캡쳐해서 스토리에 그대로 올리기 좋음
- 첫 슬라이드: 노란 D-Day 카운터 캡쳐
- 두 번째 슬라이드: 본인 지역 후보 비교 표

### 카톡 단톡방
- 사이트의 ShareBar "친구한테 보내기" 한 방으로 카톡 공유 가능 (Web Share API)
- iOS/Android 모두 지원

### 커뮤니티 (DC/펨코/디시 등)
- "정치 노잼이라 만든 사이트" 식의 자조적 톤으로 글 작성
- 본인 지역 후보 정리표를 캡쳐해서 본문에 첨부

### 언론·블로거
- 후보 등록 마감 직후(5/17~) 보도자료 페이지 1장 (사이트 소개 + 중립성 명시)
- 데이터 출처가 선관위 공식이라는 점을 강조

---

## 라이선스 / 면책

- 본 사이트는 비당파적 시민 프로젝트입니다.
- 후보자 정보는 중앙선관위 공개자료를 그대로 인용합니다.
- 오류·정정 요청은 사이트 풋터의 메일로 받습니다.
- 사이트 코드는 자유롭게 포크해서 다른 선거에도 재활용하셔도 됩니다.

---

**선거일: 2026년 6월 3일 (수) 06:00 – 18:00**
