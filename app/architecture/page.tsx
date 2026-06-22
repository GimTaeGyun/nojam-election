import Link from "next/link";

export const metadata = {
  title: "노잼선거 아키텍처 — 사이트 구성도",
  description:
    "노잼선거의 4-레이어 구성: 시민 → nojam.kr/Vercel → Next.js 페이지 → 데이터·API·Redis. 5일 만에 만든 시민 사이트의 기술 스택과 인프라.",
  keywords: [
    "노잼선거 아키텍처",
    "Next.js 14 App Router",
    "Vercel Hobby",
    "Upstash Redis",
    "사이드 프로젝트 구성",
    "1인 개발",
  ],
  openGraph: {
    title: "노잼선거 아키텍처",
    description: "5일 만에 만든 시민 사이트의 4-레이어 구성도.",
    type: "article",
    locale: "ko_KR",
  },
  alternates: { canonical: "https://nojam.kr/architecture" },
};

export const dynamic = "force-dynamic";

export default function ArchitecturePage() {
  return (
    <article className="py-10 max-w-3xl mx-auto">
      <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
        ← 메인
      </Link>

      <header className="mt-3 mb-8">
        <div className="text-[11px] font-mono text-neon/70 mb-2">아키텍처</div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tightest leading-tight">
          노잼선거 <span className="text-neon">구성도</span>
        </h1>
        <p className="text-sm text-paper/60 mt-4 leading-relaxed">
          5일 만에 만든 시민 사이트의 4-레이어 구성. 시민 → 도메인 → Next.js → 데이터·API·Redis.
        </p>
      </header>

      {/* 다이어그램 */}
      <section className="mb-10 border border-paper/15 rounded-xl p-2 sm:p-4 bg-paper/[0.02] overflow-x-auto">
        <svg
          viewBox="0 0 760 720"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          className="w-full h-auto"
          style={{ minWidth: 560 }}
        >
          <title>노잼선거 아키텍처 구성도</title>
          <desc>
            노잼선거 사이트의 4-레이어 구성: 시민(상단) → nojam.kr 도메인/Vercel → Next.js 페이지들 → 데이터·API·Redis(하단). 외부 연동 서비스도 표시.
          </desc>

          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#d4ff00" opacity="0.6" />
            </marker>
          </defs>

          {/* L1: 사용자 */}
          <g>
            <rect x="290" y="20" width="180" height="44" rx="6" fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="0.5" />
            <text x="380" y="42" textAnchor="middle" fontSize="13" fill="#fafafa" opacity="0.9">시민 (누적 3,705명)</text>
            <text x="380" y="56" textAnchor="middle" fontSize="10" fill="#fafafa" opacity="0.4">디시·카톡·검색 유입</text>
          </g>
          <line x1="380" y1="66" x2="380" y2="90" stroke="#d4ff00" strokeWidth="1" opacity="0.5" markerEnd="url(#arch-arrow)" />

          {/* L2: 도메인 */}
          <g>
            <rect x="190" y="96" width="380" height="50" rx="6" fill="rgba(212,255,0,0.04)" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
            <text x="380" y="118" textAnchor="middle" fontSize="12" fontWeight="500" fill="#d4ff00">nojam.kr · Vercel Edge</text>
            <text x="380" y="134" textAnchor="middle" fontSize="10" fill="#fafafa" opacity="0.5">가비아 도메인 · Hobby 플랜 · 월 ₩2,300</text>
          </g>
          <line x1="380" y1="148" x2="380" y2="170" stroke="#d4ff00" strokeWidth="1" opacity="0.5" markerEnd="url(#arch-arrow)" />

          {/* L3: Next.js */}
          <g>
            <rect x="60" y="176" width="640" height="200" rx="8" fill="rgba(250,250,250,0.02)" stroke="rgba(250,250,250,0.15)" strokeWidth="0.5" />
            <text x="80" y="198" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.75">Next.js 14 · TypeScript · Tailwind</text>
            <text x="80" y="212" fontSize="9" fill="#fafafa" opacity="0.4" fontFamily="monospace">App Router · Server + Client Components</text>

            {/* Row 1 */}
            <g>
              <rect x="80" y="228" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
              <text x="150" y="246" textAnchor="middle" fontSize="11" fontWeight="500" fill="#d4ff00">메인</text>
              <text x="150" y="260" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/</text>
              <text x="150" y="276" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">DDay · Top5 · 내동네</text>
            </g>
            <g>
              <rect x="230" y="228" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
              <text x="300" y="246" textAnchor="middle" fontSize="11" fontWeight="500" fill="#d4ff00">지역 (16개)</text>
              <text x="300" y="260" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/[region]</text>
              <text x="300" y="276" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">5종 선거직 탭</text>
            </g>
            <g>
              <rect x="380" y="228" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
              <text x="450" y="246" textAnchor="middle" fontSize="11" fontWeight="500" fill="#d4ff00">통계 (7개)</text>
              <text x="450" y="260" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/stats/*</text>
              <text x="450" y="276" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">Top5·재산·전과·동네별</text>
            </g>
            <g>
              <rect x="530" y="228" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
              <text x="600" y="246" textAnchor="middle" fontSize="11" fontWeight="500" fill="#d4ff00">무투표 당선</text>
              <text x="600" y="260" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/stats/uncontested</text>
              <text x="600" y="276" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">112명 명단</text>
            </g>

            {/* Row 2 */}
            <g>
              <rect x="80" y="296" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(250,250,250,0.2)" strokeWidth="0.5" />
              <text x="150" y="314" textAnchor="middle" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.85">게시판</text>
              <text x="150" y="328" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/board</text>
              <text x="150" y="344" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">비회원 디시 스타일</text>
            </g>
            <g>
              <rect x="230" y="296" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(250,250,250,0.2)" strokeWidth="0.5" />
              <text x="300" y="314" textAnchor="middle" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.85">회고</text>
              <text x="300" y="328" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/recap</text>
              <text x="300" y="344" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">선거도 재밌을 수 있나?</text>
            </g>
            <g>
              <rect x="380" y="296" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(250,250,250,0.2)" strokeWidth="0.5" />
              <text x="450" y="314" textAnchor="middle" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.85">관리자</text>
              <text x="450" y="328" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/admin</text>
              <text x="450" y="344" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">데모/원본 토글</text>
            </g>
            <g>
              <rect x="530" y="296" width="140" height="60" rx="4" fill="#0a0a0a" stroke="rgba(250,250,250,0.2)" strokeWidth="0.5" />
              <text x="600" y="314" textAnchor="middle" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.85">소개·개인정보</text>
              <text x="600" y="328" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">/about · /privacy</text>
              <text x="600" y="344" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.45">시민 정보·중립성</text>
            </g>
          </g>

          {/* 연결선 */}
          <line x1="200" y1="376" x2="200" y2="410" stroke="#d4ff00" strokeWidth="1" opacity="0.4" markerEnd="url(#arch-arrow)" />
          <line x1="450" y1="376" x2="450" y2="410" stroke="#d4ff00" strokeWidth="1" opacity="0.4" markerEnd="url(#arch-arrow)" />
          <line x1="660" y1="376" x2="660" y2="410" stroke="#d4ff00" strokeWidth="1" opacity="0.4" markerEnd="url(#arch-arrow)" />

          {/* L4: 데이터 */}
          <g>
            <rect x="60" y="416" width="280" height="120" rx="6" fill="rgba(250,250,250,0.02)" stroke="rgba(250,250,250,0.15)" strokeWidth="0.5" />
            <text x="76" y="436" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.85">정적 데이터 (JSON)</text>
            <text x="76" y="450" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.4">data/*.json · 빌드에 박힘</text>
            <text x="76" y="472" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• 시·도지사 54</text>
            <text x="76" y="488" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• 교육감 58</text>
            <text x="76" y="504" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• 구청장 570</text>
            <text x="200" y="472" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• 시·도의원 1,645</text>
            <text x="200" y="488" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• 구·시·군의원 4,387</text>
            <text x="200" y="508" fontSize="11" fontFamily="monospace" fontWeight="500" fill="#d4ff00">= 6,714명</text>
          </g>

          {/* API */}
          <g>
            <rect x="360" y="416" width="180" height="120" rx="6" fill="rgba(250,250,250,0.02)" stroke="rgba(250,250,250,0.15)" strokeWidth="0.5" />
            <text x="376" y="436" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.85">API Routes</text>
            <text x="376" y="450" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.4">Edge runtime</text>
            <text x="376" y="470" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.7">/api/votes</text>
            <text x="376" y="484" fontSize="8" fill="#fafafa" opacity="0.45">노잼/유잼 카운터</text>
            <text x="376" y="502" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.7">/api/posts</text>
            <text x="376" y="516" fontSize="8" fill="#fafafa" opacity="0.45">게시판 (CRUD)</text>
            <text x="376" y="532" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.4">/api/admin/login</text>
          </g>

          {/* Redis */}
          <g>
            <rect x="560" y="416" width="140" height="120" rx="6" fill="rgba(212,255,0,0.04)" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
            <text x="630" y="436" textAnchor="middle" fontSize="11" fontWeight="500" fill="#d4ff00">Upstash Redis</text>
            <text x="630" y="450" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.4">Vercel KV</text>
            <text x="576" y="472" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• 투표 카운터</text>
            <text x="576" y="490" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• 게시판 글</text>
            <text x="576" y="508" fontSize="10" fontFamily="monospace" fill="#fafafa" opacity="0.7">• Rate limit</text>
            <text x="576" y="526" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.45">무료 50MB</text>
          </g>
          <line x1="540" y1="476" x2="560" y2="476" stroke="#d4ff00" strokeWidth="1" opacity="0.5" />

          {/* 외부 */}
          <g>
            <rect x="60" y="556" width="640" height="86" rx="6" fill="#0a0a0a" stroke="rgba(250,250,250,0.1)" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x="76" y="576" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.7">외부 연동 · 분석 · 마케팅</text>
            <text x="76" y="598" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">Kakao Share SDK</text>
            <text x="76" y="612" fontSize="8" fill="#fafafa" opacity="0.4">카톡 공유</text>
            <text x="220" y="598" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">Google Search Console</text>
            <text x="220" y="612" fontSize="8" fill="#fafafa" opacity="0.4">SEO · 인덱싱</text>
            <text x="380" y="598" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">네이버 서치어드바이저</text>
            <text x="380" y="612" fontSize="8" fill="#fafafa" opacity="0.4">SEO · 인덱싱</text>
            <text x="540" y="598" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.55">Vercel Analytics</text>
            <text x="540" y="612" fontSize="8" fill="#fafafa" opacity="0.4">방문자·페이지뷰</text>
            <text x="76" y="630" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.4">선관위 (info.nec.go.kr) — 원본 엑셀 80개 · 선거 후 비공개</text>
          </g>
        </svg>
      </section>

      {/* 레이어별 설명 */}
      <section className="space-y-6 mb-10">
        <div>
          <div className="text-[11px] font-mono text-neon/70 mb-1">L1</div>
          <h2 className="text-lg font-black tracking-tightest mb-2">시민</h2>
          <p className="text-sm text-paper/75 leading-relaxed">
            누적 3,705명, 페이지뷰 16,291회 (D-day 기준). 디시인사이드·카톡 단톡방·구글/네이버 검색으로 유입. Bounce Rate 25% — 진성 유저 중심.
          </p>
        </div>

        <div>
          <div className="text-[11px] font-mono text-neon/70 mb-1">L2</div>
          <h2 className="text-lg font-black tracking-tightest mb-2">도메인 · 호스팅</h2>
          <p className="text-sm text-paper/75 leading-relaxed">
            <strong className="text-paper">nojam.kr</strong> (가비아 .kr 도메인, 연 ₩28,000). <strong className="text-paper">Vercel Hobby</strong> 플랜 (무료 — 100GB 대역폭/월 한도, 노잼선거는 ~3GB 사용). Edge에서 동적 렌더링.
          </p>
        </div>

        <div>
          <div className="text-[11px] font-mono text-neon/70 mb-1">L3</div>
          <h2 className="text-lg font-black tracking-tightest mb-2">Next.js 14 앱</h2>
          <p className="text-sm text-paper/75 leading-relaxed">
            App Router 기반. TypeScript + Tailwind CSS. 서버 컴포넌트 위주, 인터랙티브한 부분만 클라이언트(<code className="text-paper/60 text-xs font-mono">"use client"</code>). 페이지 8개 카테고리:
          </p>
          <ul className="text-sm text-paper/75 leading-relaxed mt-2 list-disc pl-5 space-y-1">
            <li><strong className="text-paper">메인</strong> — 카운트다운, Top 5, 내 동네 선택</li>
            <li><strong className="text-paper">지역 (16개)</strong> — 5종 선거직 탭, 후보 카드, 동네 순위 카드</li>
            <li><strong className="text-paper">통계 (7개)</strong> — Top 5, 재산, 정당별 전과, 구청장·시·도의원·구·시·군의원, 무투표 당선</li>
            <li><strong className="text-paper">게시판</strong> — 비회원 글쓰기 + 본인 글 삭제</li>
            <li><strong className="text-paper">관리자</strong> — 데모/원본 토글 (쿠키 기반 인증)</li>
            <li><strong className="text-paper">회고</strong> — 시민 사이트의 짧은 일생 정리</li>
            <li><strong className="text-paper">소개·개인정보</strong> — 사이트 정체성·중립성·정보 처리 방침</li>
          </ul>
        </div>

        <div>
          <div className="text-[11px] font-mono text-neon/70 mb-1">L4</div>
          <h2 className="text-lg font-black tracking-tightest mb-2">데이터 · API · Redis</h2>
          <p className="text-sm text-paper/75 leading-relaxed">
            <strong className="text-paper">정적 데이터</strong>는 빌드 시점 JSON 파일 (선거 끝나면 더 안 바뀜). <strong className="text-paper">API Routes</strong>는 동적 데이터용 (투표·게시판·인증, Edge runtime). <strong className="text-paper">Upstash Redis (Vercel KV)</strong>는 카운터·게시글·rate limit 저장 — 무료 50MB 한도 안.
          </p>
        </div>
      </section>

      {/* 데이터 수집 파이프라인 */}
      <section className="mb-10 border-t border-paper/10 pt-8">
        <div className="text-[11px] font-mono text-neon/70 mb-1">데이터 수집 파이프라인</div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tightest mb-2">
          nojam-crawler <span className="text-paper/40 text-sm font-mono">(별도 Python 프로젝트)</span>
        </h2>
        <p className="text-sm text-paper/75 leading-relaxed mb-5">
          6,714명 후보 데이터는 노잼선거 본 사이트가 아니라 <strong className="text-paper">nojam-crawler</strong>라는 별도 Python 프로젝트에서 수집했다. 선관위(info.nec.go.kr)에서 5종 선거직별로 크롤링 → 엑셀 다운로드 → JSON 변환 → 노잼선거 <code className="text-paper/70 text-xs font-mono">data/*.json</code>으로 복사.
        </p>

        {/* 작은 흐름 다이어그램 */}
        <div className="border border-paper/15 rounded-lg p-4 bg-paper/[0.02] mb-5 overflow-x-auto">
          <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" style={{ minWidth: 560 }} role="img">
            <title>nojam-crawler 데이터 수집 흐름</title>
            <desc>선관위 → Playwright 브라우저 자동화 → Python 크롤러 (5종) → JSON 파일 → 노잼선거 data/ 폴더</desc>

            <defs>
              <marker id="crawl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#d4ff00" opacity="0.6" />
              </marker>
            </defs>

            {/* 선관위 */}
            <g>
              <rect x="20" y="80" width="130" height="60" rx="6" fill="#0a0a0a" stroke="rgba(250,250,250,0.25)" strokeWidth="0.5" />
              <text x="85" y="100" textAnchor="middle" fontSize="11" fontWeight="500" fill="#fafafa" opacity="0.85">중앙선관위</text>
              <text x="85" y="116" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.5">info.nec.go.kr</text>
              <text x="85" y="130" textAnchor="middle" fontSize="8" fill="#fafafa" opacity="0.4">선거 후 비공개</text>
            </g>

            {/* 화살표 1 */}
            <line x1="155" y1="110" x2="195" y2="110" stroke="#d4ff00" strokeWidth="1" opacity="0.5" markerEnd="url(#crawl-arrow)" />
            <text x="175" y="100" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#fafafa" opacity="0.5">Playwright</text>

            {/* 크롤러 */}
            <g>
              <rect x="200" y="40" width="280" height="140" rx="6" fill="rgba(212,255,0,0.04)" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
              <text x="216" y="58" fontSize="11" fontWeight="500" fill="#d4ff00">nojam-crawler · Python</text>
              <text x="216" y="72" fontSize="8" fontFamily="monospace" fill="#fafafa" opacity="0.45">5종 선거직별 크롤러 분리</text>

              <text x="216" y="92" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.7">• nec_candidate_crawler.py</text>
              <text x="232" y="104" fontSize="8" fill="#fafafa" opacity="0.45">시·도지사, 교육감, 구청장</text>

              <text x="216" y="120" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.7">• nec_crawler_sido_uiwon.py</text>
              <text x="232" y="132" fontSize="8" fill="#fafafa" opacity="0.45">시·도의원</text>

              <text x="216" y="148" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.7">• nec_crawler_gusigun_uiwon.py</text>
              <text x="232" y="160" fontSize="8" fill="#fafafa" opacity="0.45">구·시·군의원</text>
            </g>

            {/* 화살표 2 */}
            <line x1="485" y1="110" x2="525" y2="110" stroke="#d4ff00" strokeWidth="1" opacity="0.5" markerEnd="url(#crawl-arrow)" />
            <text x="505" y="100" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#fafafa" opacity="0.5">JSON 변환</text>

            {/* 노잼선거 데이터 폴더 */}
            <g>
              <rect x="530" y="60" width="170" height="100" rx="6" fill="#0a0a0a" stroke="rgba(212,255,0,0.4)" strokeWidth="0.5" />
              <text x="615" y="82" textAnchor="middle" fontSize="11" fontWeight="500" fill="#d4ff00">노잼선거 data/</text>
              <text x="615" y="96" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.5">5개 JSON 파일</text>
              <text x="615" y="118" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.65">governors</text>
              <text x="615" y="132" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.65">mayors · councilors</text>
              <text x="615" y="146" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#fafafa" opacity="0.65">supers · local</text>
            </g>
          </svg>
        </div>

        <ul className="text-sm text-paper/75 leading-relaxed list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-paper">왜 Playwright?</strong> 선관위가 일반 HTTP 요청을 차단해서 (가드 로직 있음). 실제 브라우저 자동화로 우회.
          </li>
          <li>
            <strong className="text-paper">왜 크롤러 4개로 분리?</strong> 선거직마다 페이지 구조·파라미터가 달라서. 시·도의원·구·시·군의원은 선거구 단위가 복잡해서 별도 처리.
          </li>
          <li>
            <strong className="text-paper">코드 라인 수</strong>: 약 917 LOC. <code className="text-paper/60 text-xs font-mono">nec_candidate_crawler.py</code> 274 + <code className="text-paper/60 text-xs font-mono">nec_crawler_playwright.py</code> 206 + 의원 크롤러 2개 × 188.
          </li>
          <li>
            <strong className="text-paper">실행 흐름</strong>: 시·도 코드 조회 → 선거구 코드 조회 → 후보자 표 HTML 파싱 → 엑셀 다운로드 → JSON 변환.
          </li>
          <li>
            <strong className="text-paper">유지보수 부담</strong>: 선관위 페이지 구조 바뀌면 깨짐. 다행히 4년 단위라 다음 지선에 한 번만 점검.
          </li>
        </ul>

        <p className="text-[11px] text-paper/40 mt-4 leading-relaxed">
          ※ 크롤러 자체는 노잼선거 본 사이트에 포함되지 않고 별도 리포지토리로 관리. 본 사이트는 크롤러가 만든 JSON을 정적으로 import 할 뿐.
        </p>
      </section>

      {/* 비용 요약 */}
      <section className="border border-neon/40 bg-neon/[0.04] rounded-xl p-5 mb-10">
        <div className="text-[11px] font-mono text-neon/80 mb-2">총 운영 비용</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <div className="text-xs text-paper/50">도메인</div>
            <div className="font-mono text-sm">₩28,000/년</div>
          </div>
          <div>
            <div className="text-xs text-paper/50">Vercel</div>
            <div className="font-mono text-sm">무료</div>
          </div>
          <div>
            <div className="text-xs text-paper/50">Upstash</div>
            <div className="font-mono text-sm">무료</div>
          </div>
          <div>
            <div className="text-xs text-neon">월 환산</div>
            <div className="font-mono text-sm text-neon font-bold">₩2,300</div>
          </div>
        </div>
      </section>

      {/* 회고 + 공부하기 */}
      <section className="text-center border-t border-paper/10 pt-6">
        <p className="text-sm text-paper/60 leading-relaxed mb-4">
          이 구성도를 본인 프로젝트로 설명할 수 있게 공부하려면 →{" "}
          <Link href="/study" className="text-neon underline">공부하기 가이드</Link>
        </p>
        <p className="text-sm text-paper/60 leading-relaxed mb-3">
          기술 도식 너머의 5일짜리 이야기가 궁금하면
        </p>
        <Link
          href="/recap"
          className="inline-block px-4 py-2 border border-neon/40 hover:border-neon bg-neon/[0.04] hover:bg-neon/[0.08] text-neon font-bold text-sm rounded-lg transition-colors"
        >
          → 회고 읽기
        </Link>
      </section>
    </article>
  );
}
