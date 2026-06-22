import Link from "next/link";

export const metadata = {
  title: "노잼선거 공부 가이드 — 코드에서 뭘 배워야 하나",
  description:
    "노잼선거 코드 베이스로 백엔드 개발자가 풀스택으로 확장하기 위한 학습 가이드. Next.js App Router, React Server Components, Vercel, Upstash, 인증·SEO 등 10개 영역.",
  alternates: { canonical: "https://nojam.kr/study" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface Topic {
  num: number;
  emoji: string;
  title: string;
  whyNeeded: string;
  whereInCode: { path: string; note: string }[];
  resources: { label: string; url: string }[];
  checkQuestions: string[];
  priority: "필수" | "중요" | "보너스";
}

const TOPICS: Topic[] = [
  {
    num: 1,
    emoji: "⚛️",
    title: "Next.js 14 App Router",
    priority: "필수",
    whyNeeded:
      "노잼선거의 라우팅·렌더링 모드·메타데이터 전부 App Router 기반. Server Component vs Client Component 차이를 모르면 코드 절반 못 읽는다.",
    whereInCode: [
      { path: "app/page.tsx", note: "메인 페이지 — 서버 컴포넌트" },
      { path: "app/[region]/page.tsx", note: "동적 라우팅 ([region])" },
      { path: "app/api/votes/route.ts", note: "API Route — Edge runtime" },
      { path: "components/RaceTabs.tsx", note: '"use client" 클라이언트 컴포넌트' },
      { path: "components/DDayBadge.tsx", note: "클라이언트 컴포넌트 — 매분 갱신" },
    ],
    resources: [
      { label: "Next.js 공식 튜토리얼 (무료, 한국어)", url: "https://nextjs.org/learn" },
      { label: "App Router 공식 문서", url: "https://nextjs.org/docs/app" },
      { label: "Server Components 깊이", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components" },
    ],
    checkQuestions: [
      "왜 페이지에 `export const dynamic = \"force-dynamic\"` 을 썼나? (힌트: 마스킹 토글)",
      "`generateMetadata`와 정적 `metadata` 객체 차이?",
      "`use client`를 안 쓰면 무엇이 안 되나?",
      "`cookies()` 함수를 클라이언트 컴포넌트에서 쓰면? (안 됨)",
    ],
  },
  {
    num: 2,
    emoji: "🎣",
    title: "React 기초 (Hooks)",
    priority: "필수",
    whyNeeded:
      "백엔드 SpringBoot만 했다면 React useState/useEffect가 낯설다. 노잼선거 클라이언트 컴포넌트 거의 다 hooks 기반.",
    whereInCode: [
      { path: "components/VoteWidget.tsx", note: "useState · useEffect · fetch" },
      { path: "components/Countdown.tsx", note: "setInterval로 매초 갱신" },
      { path: "components/RaceTabs.tsx", note: "URL hash·query 보는 useEffect" },
      { path: "components/BoardClient.tsx", note: "페이징 + 폼 상태" },
    ],
    resources: [
      { label: "React 공식 튜토리얼 (Tic-Tac-Toe)", url: "https://react.dev/learn/tutorial-tic-tac-toe" },
      { label: "Hooks 개요", url: "https://react.dev/reference/react/hooks" },
    ],
    checkQuestions: [
      "`useState`의 setter를 호출하면 컴포넌트가 어떻게 다시 렌더되나?",
      "`useEffect`의 두 번째 인자(deps 배열) 의미?",
      "Hydration mismatch는 왜 발생? 노잼선거에서 어떻게 해결?",
      "함수 컴포넌트에서 `this` 못 쓰는 이유?",
    ],
  },
  {
    num: 3,
    emoji: "🔷",
    title: "TypeScript",
    priority: "중요",
    whyNeeded:
      "Java/Spring과 비슷한 정적 타입이지만 구조적 타이핑·유니온 타입·제네릭이 더 유연. 노잼선거 전체가 TS.",
    whereInCode: [
      { path: "data/types.ts", note: "Candidate · Race · Region 인터페이스" },
      { path: "lib/mask.ts", note: "Generic `maskEntry<T>` 함수" },
      { path: "lib/districtRank.ts", note: "Union 타입 `'wealth' | 'crim'`" },
    ],
    resources: [
      { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { label: "TS for Java/C# 개발자", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html" },
    ],
    checkQuestions: [
      "`interface`와 `type` 차이? 언제 어떤 거 쓰나?",
      "`Candidate['partyKey']`처럼 타입에서 값 꺼내는 문법 의미?",
      "`as unknown as Foo` 캐스팅을 왜 쓰나? 안전한가?",
      "제네릭 함수 `function f<T>(x: T): T` 의 T는 어떻게 추론되나?",
    ],
  },
  {
    num: 4,
    emoji: "🎨",
    title: "Tailwind CSS",
    priority: "중요",
    whyNeeded:
      "노잼선거 전체 디자인이 Tailwind 유틸리티 클래스. 다크 배경·네온 그린 톤도 클래스 조합.",
    whereInCode: [
      { path: "tailwind.config.ts", note: "색상 토큰 (paper, ink, neon) 정의" },
      { path: "app/globals.css", note: "글로벌 + CSS 변수" },
      { path: "components/Top5Teaser.tsx", note: "반응형 클래스 (sm:, md:)" },
      { path: "components/RaceTabs.tsx", note: "sticky · backdrop-blur 등" },
    ],
    resources: [
      { label: "Tailwind 공식 문서", url: "https://tailwindcss.com/docs" },
      { label: "Tailwind Play (놀이터)", url: "https://play.tailwindcss.com/" },
    ],
    checkQuestions: [
      "`sm:` `md:` 접두사 의미? 어떤 breakpoint?",
      "`tracking-tightest` 같은 커스텀 클래스는 어디 정의?",
      "Dark mode를 Tailwind에서 어떻게 지원? 노잼선거는?",
      "`@apply` 디렉티브 언제 쓰면 안 좋나?",
    ],
  },
  {
    num: 5,
    emoji: "▲",
    title: "Vercel 인프라",
    priority: "필수",
    whyNeeded:
      "노잼선거 호스팅 전체가 Vercel. Edge Runtime, Hobby 한도, 환경변수, OG 이미지 동적 생성까지.",
    whereInCode: [
      { path: "app/api/votes/route.ts", note: '`export const runtime = "edge"`' },
      { path: "app/opengraph-image.tsx", note: "동적 OG 이미지 (next/og)" },
      { path: ".env.local", note: "환경변수 (ADMIN_PASSWORD, KV_*)" },
    ],
    resources: [
      { label: "Vercel 공식 문서", url: "https://vercel.com/docs" },
      { label: "Edge Functions vs Node Functions", url: "https://vercel.com/docs/functions/runtimes/edge-runtime" },
      { label: "Hobby plan 한도", url: "https://vercel.com/docs/limits/usage" },
    ],
    checkQuestions: [
      "Edge Runtime과 Node.js Runtime 차이? 언제 어떤 거?",
      "Vercel Hobby 무료 한도는? 노잼선거 사용량 대비 여유?",
      "환경변수가 빌드 시점에 박히는 것과 런타임에 읽히는 것 차이?",
      "OG 이미지 캐시 무효화는 어떻게? (`revalidate = 3600`)",
    ],
  },
  {
    num: 6,
    emoji: "🔴",
    title: "Upstash Redis (Vercel KV)",
    priority: "중요",
    whyNeeded:
      "투표 카운터·게시판·rate limit 모두 Upstash. REST API 기반 서버리스 Redis는 일반 Redis와 패턴이 다름.",
    whereInCode: [
      { path: "lib/votes.ts", note: "Redis 클라이언트 초기화" },
      { path: "lib/board.ts", note: "ZADD · ZRANGE · INCR · EXPIRE" },
      { path: "app/api/votes/route.ts", note: "GET / POST 핸들러" },
    ],
    resources: [
      { label: "Upstash Redis 문서", url: "https://upstash.com/docs/redis" },
      { label: "Redis 데이터 구조 cheatsheet", url: "https://redis.io/docs/data-types/" },
      { label: "@upstash/ratelimit", url: "https://github.com/upstash/ratelimit-js" },
    ],
    checkQuestions: [
      "Sorted Set (ZADD/ZRANGE) 왜 게시판에 썼나?",
      "INCR + EXPIRE 조합으로 rate limit 어떻게 동작?",
      "REST 기반 Redis가 일반 Redis와 다른 점?",
      "왜 Vercel KV가 무료 50MB에서 게시판 1만 글까지 OK?",
    ],
  },
  {
    num: 7,
    emoji: "🔐",
    title: "인증·보안",
    priority: "필수",
    whyNeeded:
      "관리자 토글의 쿠키 기반 인증, rate limiting, 비번 해시·timing safe 비교, XSS 방지(escape) 등 보안 기초.",
    whereInCode: [
      { path: "lib/auth.ts", note: "isAdmin() · cookieAttrs() · checkPassword()" },
      { path: "app/api/admin/login/route.ts", note: "비번 검증 + 쿠키 설정 + rate limit" },
      { path: "components/PostContent.tsx", note: "본문 HTML escape (XSS 방지)" },
      { path: "lib/board.ts", note: "checkRateLimit()" },
    ],
    resources: [
      { label: "OWASP Cheat Sheet (인증)", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" },
      { label: "HTTP Cookies (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" },
      { label: "XSS 방어 (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss" },
    ],
    checkQuestions: [
      "쿠키의 `httpOnly` `secure` `sameSite` 각각 무엇을 막나?",
      "왜 ADMIN_PASSWORD와 ADMIN_TOKEN을 분리? (단순화 가능?)",
      "Rate limit을 IP 기반으로 하는 것의 한계?",
      "XSS 방지를 위해 사용자 입력을 어떻게 처리?",
    ],
  },
  {
    num: 8,
    emoji: "🔍",
    title: "SEO",
    priority: "중요",
    whyNeeded:
      "노잼선거가 5일 만에 구글·네이버 검색 1위 한 핵심. 메타데이터·sitemap·OG 이미지·robots.txt·canonical URL.",
    whereInCode: [
      { path: "app/layout.tsx", note: "글로벌 metadata (title template, OG, twitter)" },
      { path: "app/recap/page.tsx", note: "페이지별 metadata + canonical" },
      { path: "app/opengraph-image.tsx", note: "동적 OG 이미지" },
      { path: "app/sitemap.ts", note: "동적 sitemap.xml 생성" },
    ],
    resources: [
      { label: "Next.js Metadata API", url: "https://nextjs.org/docs/app/building-your-application/optimizing/metadata" },
      { label: "Google Search Central", url: "https://developers.google.com/search/docs" },
      { label: "OG 이미지 디버거", url: "https://www.opengraph.xyz/" },
    ],
    checkQuestions: [
      "`alternates.canonical` 왜 중요?",
      "OG 이미지 1200×630 권장 이유?",
      "Sitemap.xml과 robots.txt가 SEO에 미치는 영향?",
      "Vercel의 OG 이미지가 캐시되는 메커니즘?",
    ],
  },
  {
    num: 9,
    emoji: "📊",
    title: "데이터 처리·정렬·필터링",
    priority: "보너스",
    whyNeeded:
      "6,714명 후보 데이터를 메모리에서 정렬·집계. JavaScript Array methods 숙련도가 통계 페이지 전체 결정.",
    whereInCode: [
      { path: "lib/overallStats.ts", note: "재산·전과·나이 Top N 함수들" },
      { path: "lib/districtRank.ts", note: "구·시·군별 집계 + 랭킹" },
      { path: "lib/uncontested.ts", note: "단독후보 추출 (Map + Set)" },
      { path: "lib/searchCandidates.ts", note: "한글 자음(초성) 매칭 검색" },
    ],
    resources: [
      { label: "JavaScript Array (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" },
      { label: "한국어 자음 분리 (Stack Overflow)", url: "https://stackoverflow.com/questions/32856996/check-korean-characters" },
    ],
    checkQuestions: [
      "`map` / `filter` / `reduce` 각각 언제?",
      "한글 초성 추출 어떻게? (`0xAC00`, `588`의 의미)",
      "Sort 함수의 비교 함수 작성 시 주의점?",
      "Map과 Object 중 언제 무엇을 쓰나?",
    ],
  },
  {
    num: 10,
    emoji: "🎯",
    title: "UX·UI 패턴",
    priority: "보너스",
    whyNeeded:
      "URL hash·query 라우팅, 카드 자동 스크롤, sticky 탭, 다크모드 셀렉트 가독성 등. 작지만 사용자 경험 결정하는 디테일.",
    whereInCode: [
      { path: "components/RaceTabs.tsx", note: "?cand= 쿼리 자동 스크롤" },
      { path: "lib/candidateHref.ts", note: "buildCandidateHref 공통 헬퍼" },
      { path: "components/Marquee.tsx", note: "무한 스크롤 마키" },
      { path: "components/RegionCard.tsx", note: "모달 패턴 (모바일 대응)" },
    ],
    resources: [
      { label: "scrollIntoView (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView" },
      { label: "URLSearchParams (MDN)", url: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" },
    ],
    checkQuestions: [
      "URL `#hash` 와 `?query` 의 차이? 언제 어떤 거?",
      "Sticky positioning의 `top-0`이 동작 안 할 때 원인은?",
      "다크모드에서 native `<select>` 옵션이 흰 배경 나오는 이유? 어떻게 해결?",
      "Hydration 직전 깜빡임을 어떻게 줄이나?",
    ],
  },
];

const PRIORITY_COLOR: Record<Topic["priority"], string> = {
  필수: "bg-neon/15 text-neon border-neon/40",
  중요: "bg-paper/10 text-paper border-paper/30",
  보너스: "bg-paper/[0.05] text-paper/60 border-paper/15",
};

export default function StudyPage() {
  return (
    <article className="py-10 max-w-3xl mx-auto">
      <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
        ← 메인
      </Link>

      <header className="mt-3 mb-8">
        <div className="text-[11px] font-mono text-neon/70 mb-2">학습 가이드</div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tightest leading-tight">
          공부하기
        </h1>
        <p className="text-sm text-paper/60 mt-4 leading-relaxed">
          노잼선거 코드를 본인이 직접 설명할 수 있도록 정리한 학습 가이드. 백엔드(SpringBoot 등) 개발자가 풀스택으로 넘어가는 다리.
        </p>
        <p className="text-[11px] text-paper/40 mt-2 leading-relaxed">
          ※ 위쪽: 10개 학습 영역 (코드 위치 + 공부 자료 + 체크 질문). 아래쪽: 면접 예상 질문 25개.
        </p>
      </header>

      {/* 진행 안내 */}
      <section className="border border-paper/15 rounded-lg p-4 mb-10 bg-paper/[0.02]">
        <div className="text-[11px] font-mono text-paper/50 mb-2">추천 학습 순서</div>
        <ol className="text-sm text-paper/80 list-decimal pl-5 space-y-1">
          <li>먼저 <strong className="text-paper">필수 항목 4개</strong> (Next.js · React · Vercel · 인증)</li>
          <li>그다음 <strong className="text-paper">중요 항목 4개</strong> (TS · Tailwind · Upstash · SEO)</li>
          <li>마지막 <strong className="text-paper">보너스 2개</strong> (데이터 처리 · UX 패턴)</li>
          <li>각 항목 끝 <strong className="text-paper">체크 질문</strong>에 본인이 답할 수 있으면 다음으로</li>
        </ol>
      </section>

      {/* 10개 토픽 */}
      <section className="space-y-8 mb-10">
        {TOPICS.map((t) => (
          <article key={t.num} className="border border-paper/10 rounded-xl p-5 bg-paper/[0.02]">
            <header className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl" aria-hidden>{t.emoji}</span>
                <div className="text-[11px] font-mono text-paper/40">#{t.num}</div>
                <h2 className="text-lg sm:text-xl font-black tracking-tightest">{t.title}</h2>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${PRIORITY_COLOR[t.priority]}`}>
                {t.priority}
              </span>
            </header>

            <p className="text-sm text-paper/75 leading-relaxed mb-4">
              <strong className="text-paper">왜 필요?</strong> {t.whyNeeded}
            </p>

            <div className="mb-4">
              <div className="text-[11px] font-mono text-neon/70 mb-1.5">노잼선거 어디에</div>
              <ul className="text-xs space-y-1">
                {t.whereInCode.map((w) => (
                  <li key={w.path} className="flex items-baseline gap-2">
                    <code className="font-mono text-neon/85 shrink-0">{w.path}</code>
                    <span className="text-paper/55">— {w.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-mono text-neon/70 mb-1.5">공부 자료</div>
              <ul className="text-sm space-y-1">
                {t.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neon underline hover:no-underline"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-mono text-neon/70 mb-1.5">이해 체크 질문</div>
              <ul className="text-sm text-paper/80 list-disc pl-5 space-y-1">
                {t.checkQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {/* 면접 예상 질문 */}
      <section className="mb-10 border-t border-paper/10 pt-8">
        <div className="text-[11px] font-mono text-neon/70 mb-2">실전</div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tightest mb-3">
          면접 예상 질문 <span className="text-paper/40 text-sm font-mono">25개</span>
        </h2>
        <p className="text-sm text-paper/70 leading-relaxed mb-6">
          면접관 입장에서 이 프로젝트로 물어볼 만한 질문들. 답변을 미리 적어두고 시뮬레이션해보세요. <strong className="text-paper">⭐는 자주 받는 핵심 질문.</strong>
        </p>

        <div className="space-y-6">
          {/* A. 자기소개 */}
          <div>
            <div className="text-xs font-mono text-neon/80 mb-2">A. 자기소개 · 프로젝트 개요</div>
            <ol className="text-sm text-paper/80 list-decimal pl-5 space-y-2">
              <li>⭐ 노잼선거를 한 문장으로 설명해주세요. <span className="text-paper/50">(엘리베이터 피치 — "1분만 보면 알 수 있게 만든 시민 선거 사이트")</span></li>
              <li>⭐ 왜 이 프로젝트를 시작했어요? <span className="text-paper/50">(개인 동기 + 시민 가치 둘 다)</span></li>
              <li>혼자 만든 거예요? 팀이 몇 명?</li>
              <li>⭐ 5일 만에 만든 거 맞나요? 어떻게 가능했어요? <span className="text-paper/50">(AI 활용 솔직히 인정 + 의사결정은 본인)</span></li>
            </ol>
          </div>

          {/* B. 기술 스택 */}
          <div>
            <div className="text-xs font-mono text-neon/80 mb-2">B. 기술 스택 결정</div>
            <ol className="text-sm text-paper/80 list-decimal pl-5 space-y-2" start={5}>
              <li>⭐ 왜 Next.js 14 App Router를 선택했나요? Pages Router랑 차이는?</li>
              <li>왜 Vercel? AWS·GCP 같은 다른 옵션은 고려 안 했나요?</li>
              <li>⭐ 왜 6,714명 데이터를 정적 JSON으로 했나요? PostgreSQL·MySQL 안 쓰고?</li>
              <li>Upstash Redis와 일반 Redis 차이는? 왜 서버리스 KV?</li>
              <li>Tailwind CSS 선택 이유? styled-components·CSS Modules 비교했어요?</li>
            </ol>
          </div>

          {/* C. 아키텍처 */}
          <div>
            <div className="text-xs font-mono text-neon/80 mb-2">C. 아키텍처 결정</div>
            <ol className="text-sm text-paper/80 list-decimal pl-5 space-y-2" start={10}>
              <li>⭐ Server Component와 Client Component를 어떤 기준으로 나눴어요?</li>
              <li>전체 데이터 흐름을 설명해주세요. 사용자 클릭부터 응답까지.</li>
              <li>⭐ 관리자 인증 시스템 설계를 설명해주세요. <span className="text-paper/50">(쿠키 + 환경변수 + rate limit)</span></li>
              <li>마스킹 시스템의 트레이드오프는? 왜 클라이언트 마스킹이 아니라 서버 마스킹?</li>
              <li>Rate limiting 어떻게 구현했나요? Upstash 사용한 이유?</li>
            </ol>
          </div>

          {/* D. 문제 해결 */}
          <div>
            <div className="text-xs font-mono text-neon/80 mb-2">D. 문제 해결 (사건들)</div>
            <ol className="text-sm text-paper/80 list-decimal pl-5 space-y-2" start={15}>
              <li>⭐ 트래픽 폭증 시 어떻게 대응했나요? <span className="text-paper/50">(Vercel Edge + ISR + 모니터링)</span></li>
              <li>⭐ 어뷰징 사건이 있었다고 하던데 어떻게 발견·대응했나요? 막을 수 있었나요?</li>
              <li>D-day 카운트다운이 안 바뀌는 버그가 있었다고요? 원인은? 어떻게 해결?</li>
              <li>⭐ 선관위 데이터가 사라진 후 개인정보 보호 어떻게 처리했나요?</li>
              <li>SSR Hydration mismatch 경험 있나요? 어떻게 디버깅?</li>
            </ol>
          </div>

          {/* E. 운영·마케팅 */}
          <div>
            <div className="text-xs font-mono text-neon/80 mb-2">E. 운영 · 마케팅 · 사용자</div>
            <ol className="text-sm text-paper/80 list-decimal pl-5 space-y-2" start={20}>
              <li>⭐ 어떻게 트래픽을 모았나요? 광고 없이 3,705명?</li>
              <li>사용자 피드백을 어떻게 수집·반영했나요?</li>
              <li>SEO를 어떻게 신경 썼나요? 5일 만에 검색 1위가 가능?</li>
            </ol>
          </div>

          {/* F. AI / 메타 */}
          <div>
            <div className="text-xs font-mono text-neon/80 mb-2">F. AI 활용 · 시니어급 질문</div>
            <ol className="text-sm text-paper/80 list-decimal pl-5 space-y-2" start={23}>
              <li>⭐ AI(Claude Code 등)를 어디까지 활용했나요? 코드를 본인이 짠 게 아니라면 본인 프로젝트라고 할 수 있나요? <span className="text-paper/50">(가장 첨예한 질문. 솔직 + 의사결정 강조)</span></li>
              <li>이 프로젝트의 기술 부채는? 다시 만든다면 무엇을 바꿀 건가요?</li>
              <li>스케일링 한계는 어디? 10만 명 동시 접속이면?</li>
            </ol>
          </div>
        </div>

        {/* 답변 팁 */}
        <div className="mt-8 border border-paper/15 rounded-lg p-4 bg-paper/[0.02]">
          <div className="text-[11px] font-mono text-neon/70 mb-2">답변 작성 팁</div>
          <ul className="text-sm text-paper/75 list-disc pl-5 space-y-1.5">
            <li><strong className="text-paper">STAR 구조</strong>: Situation → Task → Action → Result. 사건들 질문(D-day 버그·어뷰징 등)은 이 구조가 잘 맞음.</li>
            <li><strong className="text-paper">트레이드오프 명시</strong>: "왜 X 선택?" → "Y와 비교했을 때 Z 이유로 X. 다만 W는 단점."</li>
            <li><strong className="text-paper">숫자 인용</strong>: "트래픽 3,705명", "5일", "6,714명", "₩2,300/월" — 구체 숫자가 신뢰감.</li>
            <li><strong className="text-paper">AI 활용 솔직히</strong>: "프론트 코드는 Claude Code 도움을 많이 받았지만, 아키텍처·데이터 모델·보안 결정·운영은 제가 직접 했습니다." 이게 정답.</li>
            <li><strong className="text-paper">모르는 거 인정</strong>: 모르면 "그 부분은 학습이 더 필요합니다, 다만 이렇게 추정합니다..." 솔직히. 면접관이 더 좋아함.</li>
          </ul>
        </div>
      </section>

      {/* 마무리 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-xl p-5 mb-10">
        <div className="text-[11px] font-mono text-neon/80 mb-2">최종 점검</div>
        <p className="text-sm text-paper/85 leading-relaxed">
          체크 질문 40개에 본인이 답할 수 있다면 — 노잼선거를 "본인 프로젝트"로 당당히 말할 수 있는 수준이에요. 모든 코드를 본인이 짠 게 아니라도, 모든 결정과 구조를 본인이 설명할 수 있다는 게 중요해요.
        </p>
        <p className="text-xs text-paper/60 mt-3">
          공부하다가 막히면 노잼선거 코드 직접 열어서 보거나, 해당 파일을 ChatGPT/Claude에 붙여넣고 "이거 왜 이렇게 짰어?" 물어보세요. AI 시대의 학습 방식.
        </p>
      </section>

      <section className="text-center border-t border-paper/10 pt-6">
        <p className="text-sm text-paper/60 leading-relaxed mb-3">
          공부하기 전에 회고나 구성도 다시 보고 싶으면
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/recap"
            className="inline-block px-4 py-2 border border-paper/20 hover:border-paper/40 text-paper/80 font-bold text-sm rounded-lg transition-colors"
          >
            회고 ←
          </Link>
          <Link
            href="/architecture"
            className="inline-block px-4 py-2 border border-paper/20 hover:border-paper/40 text-paper/80 font-bold text-sm rounded-lg transition-colors"
          >
            구성도 ←
          </Link>
        </div>
      </section>
    </article>
  );
}
