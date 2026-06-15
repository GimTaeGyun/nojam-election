import Link from "next/link";

export const metadata = {
  title: "5일 만에 만든 시민 사이트, 3,705명의 회고 — 노잼선거",
  description:
    "노잼선거 회고. 5일 동안 1인이 만든 시민 정보 사이트가 누적 3,705명·페이지뷰 16,291회를 받기까지. 왜 만들었나, 어떻게 마케팅했나, 무엇을 배웠나.",
  keywords: [
    "노잼선거 회고",
    "1인 개발",
    "시민 사이트",
    "5일 개발",
    "Next.js 인디 프로젝트",
    "디시 마케팅",
    "Claude Code",
    "선거 정보 사이트",
  ],
  openGraph: {
    title: "5일 만에 만든 시민 사이트, 3,705명의 회고 — 노잼선거",
    description: "1인이 5일 만에 만든 시민 사이트, D-day까지의 일대기.",
    type: "article",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "5일 만에 만든 노잼선거 — 3,705명의 회고",
    description: "1인 시민 사이트의 짧은 일생.",
  },
  alternates: { canonical: "https://nojam.kr/recap" },
};

// 정적 페이지로 캐시되어도 OK — 시민이 읽는 회고
export const dynamic = "force-dynamic";

// 작은 캡션
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-mono text-paper/40 mt-1.5 text-center leading-relaxed">
      {children}
    </p>
  );
}

// 이미지 + 캡션 블록
function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="block w-full rounded-lg border border-paper/10 mx-auto"
        loading="lazy"
      />
      <Caption>{caption}</Caption>
    </figure>
  );
}

// 두 장 나란히 (네이버 + 구글)
function FigurePair({
  left,
  right,
}: {
  left: { src: string; alt: string; caption: string };
  right: { src: string; alt: string; caption: string };
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={left.src}
          alt={left.alt}
          className="block w-full rounded-lg border border-paper/10"
          loading="lazy"
        />
        <Caption>{left.caption}</Caption>
      </figure>
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={right.src}
          alt={right.alt}
          className="block w-full rounded-lg border border-paper/10"
          loading="lazy"
        />
        <Caption>{right.caption}</Caption>
      </figure>
    </div>
  );
}

export default function RecapPage() {
  return (
    <article className="py-10 max-w-2xl mx-auto prose-invert">
      <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
        ← 메인
      </Link>

      <header className="mt-3 mb-10">
        <div className="text-[11px] font-mono text-neon/70 mb-2">회고</div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tightest leading-tight">
          5일 만에 만든 시민 사이트, <span className="text-neon">3,705명</span>의 회고
        </h1>
        <p className="text-sm text-paper/60 mt-4 leading-relaxed">
          D-7부터 D-day까지, 노잼선거의 짧은 일생을 정리합니다.
        </p>
        <p className="text-[11px] font-mono text-paper/40 mt-2">2026.06.04</p>
      </header>

      <Section title="왜 시작했나">
        <p>
          매번 지방선거 때마다 같은 풍경이었다. 내 동네에 누가 나오는지, 어떤 사람인지도 모른 채 정당만 보고 찍는 선거. 솔직히 시의원·구의원이 뭐 하는 사람인지도 잘 모르겠고, 공약은 어렵고, 용어도 낯설다.
        </p>
        <p>
          그래서 만들었다. <strong>"최소한의 정보라도 알고 가자"</strong>는 취지로.
        </p>
        <p>
          문제는 선거 정보가 노잼이라는 점. 데이터는 있어도 유권자가 안 본다. 그래서 화면과 디자인을 좀 꾸며서 이목을 끌면, 그래도 1분은 보고 가지 않을까 싶었다. 사이트 이름이 <strong>노잼선거</strong>인 이유다 — 노잼인 거 알지만, 노잼이라고 인정하고 들어가자.
        </p>
      </Section>

      <Section title="5일">
        <p>D-7쯤 시작. 5월 27일~6월 2일.</p>
        <ul>
          <li>
            <strong>데이터</strong>: 중앙선관위 후보자정보 엑셀 16개 시·도 × 5종(시·도지사·교육감·구청장·시·도의원·구·시·군의원) = 약 80개 엑셀 파일을 일일이 받아서 파싱. 총 <strong>6,714명</strong> 후보 정보를 JSON으로 정리.
          </li>
          <li>
            <strong>디자인</strong>: 다크 배경 + 네온 그린 = "정치 사이트 같지 않은 정치 사이트"
          </li>
          <li>
            <strong>톤</strong>: B급, 자조, "그래도 1분만"
          </li>
          <li>
            <strong>스택</strong>: Next.js 14 (App Router) · TypeScript · Tailwind · Vercel + Upstash Redis
          </li>
          <li>
            <strong>AI 활용</strong>: 프론트엔드는 거의 Claude Code가 만들었다. 디시 한 댓글에서 "백엔드랑 프엔 한 번에 너가 하는 거냐?" 물은 사람한테 솔직히 답했다 — "난 백엔드 개발자인데 프론트는 그냥 클로드 코드가 다 해주더라.."
          </li>
        </ul>
      </Section>

      <Section title="만든 페이지들">
        <p>
          메인(카운트다운 + 내 동네 선택), 16개 시·도 지역 페이지(5종 선거직 탭), 통계 페이지(재산·전과·정당별), Top 5 컬렉션(최고 부자·최저·전과·베테랑·최연소·최고령), 무투표 당선("이미 당선된 자들이 있다? 표 안 받고 당선된 112명"), 노잼/유잼 투표 위젯, 비회원 게시판.
        </p>
      </Section>

      <Section title="마케팅 — 진심을 담아 딱 한 번만">
        <p>GPT한테 정치 관련 커뮤니티 추천받았다. 디시인사이드, MLB파크, 보배드림 등.</p>
        <p>
          몇 군데는 광고성 글이라고 단 몇 분 만에 차단 먹었다. 다행히 디시는 게시판별로 관리해서 차단 안 한 갤러리에서는 통했다. 반응도 좋았다.
        </p>
        <p>
          <strong>가장 큰 교훈</strong>: 100개 게시판 도배보다, 한 게시판에서 베스트 또는 상위권 가는 게 훨씬 가치 있다. 베스트는 못 갔지만 상위권에 머문 한 글에서 유입이 가장 많이 왔고, 시간 지나도 들어왔다. 다음엔 광고성이라도 그 커뮤니티 사람들에게 한정된 진심을 담아 딱 한 번만 올려야겠다. <strong>여러 번 올리면 사람들이 다 안다</strong>. 한 번 올리고 반응 없어도 참고 나중에 한 번 더.
        </p>
        <p>
          기자 약 30명에게 메일을 보냈다. <strong>1명만 답이 왔다</strong>. 제목이 너무 광고처럼 적혔나 싶다.
        </p>
        <Figure
          src="/recap/dc1.png"
          alt="디시 댓글 1 — 9개 댓글, 진심 답변"
          caption="디시 첫 글의 댓글들. 도배가 아니라 한 번에 진심 담는 게 답이었다."
        />
      </Section>

      <Section title="결과 (D-day 기준)">
        <ul>
          <li>
            누적 visitor: <strong className="text-neon">3,705명</strong>
          </li>
          <li>
            페이지뷰: <strong className="text-neon">16,291</strong>
          </li>
          <li>Bounce Rate: 25% — 진성 유저가 둘러봤다는 신호</li>
          <li>D-day 직전 폭증, 6/3에 거의 1,000명/일</li>
        </ul>
        <Figure
          src="/recap/analytics.png"
          alt="Vercel Analytics — 누적 3,705명 visitor"
          caption="Vercel Analytics 최종 수치. May 31부터 폭증, D-day 가까이 거의 1K/일."
        />
        <p>
          1인이 5일 만에 만든 무광고·신생 도메인 시민 사이트의 결과 치고는, 본인은 만족한다.
        </p>
        <p>
          그리고 의외의 보너스 — 신생 도메인인데 <strong>5일 만에 구글·네이버 양쪽에서 "노잼선거" 검색 메인 노출</strong>됐다. 한국어 키워드 + 사이트 의도 명확 + 빠른 사이트맵 등록의 조합 덕분인 듯. SEO 자산은 사이트 닫혀도 한동안 살아남으니, 회고도 도메인도 유지할 가치가 더 커졌다.
        </p>
        <FigurePair
          left={{
            src: "/recap/naver.png",
            alt: "네이버 검색 결과 — 노잼선거 메인 노출",
            caption: "네이버: 노잼선거 검색 시 nojam.kr 1위.",
          }}
          right={{
            src: "/recap/google.png",
            alt: "구글 검색 결과 — 노잼선거 메인 노출",
            caption: "구글도 동일하게 nojam.kr 1위.",
          }}
        />
      </Section>

      <Section title="댓글 몇 개">
        <p>가장 가까운 사람한테 받은 칭찬:</p>
        <Figure
          src="/recap/kakao.png"
          alt="카톡 — 취지가 정말 좋네요"
          caption='"취지가 정말 좋네요" "넘 깔롱하게 잘만드신거같아요"'
        />
        <p>디시에선:</p>
        <blockquote className="border-l-2 border-neon/40 pl-4 my-4 text-paper/85">
          "잘만들었네ㅋㅋ" "보기 쉽고 재밌다! 친구들한테도 공유함" "와 잘 만들었다" "훌륭한 개발자로구나"
        </blockquote>
        <p>가장 마음에 박힌 건 이거:</p>
        <blockquote className="border-l-2 border-neon/40 pl-4 my-4 text-paper/85">
          <p>"선관위에서 저런 정보도 제공하구나"</p>
          <p>
            — "응 근데 후보자 6천명 엑셀 자료를 일일이 받아야해 불편하게 되어있어서 내가 프로그래밍 한거고 선관위에서 좀 쉽게 제공하면 좋겠다. 그래야 유권자가 좋은 판단을 하지."
          </p>
        </blockquote>
        <p>그리고 빚 -175억 후보 발견한 사람:</p>
        <blockquote className="border-l-2 border-neon/40 pl-4 my-4 text-paper/85">
          "임현철은 대체 어쩌다가 빚이 이렇게 많은거임...?"
        </blockquote>
        <Figure
          src="/recap/dc2.png"
          alt='디시 댓글 2 — "-175억은 뭐냐 ㅋㅋㅋㅋ"'
          caption="진심 담아 한 글 → 12개 댓글, 사용자 의견까지 받음."
        />
      </Section>

      <Section title="사건들">
        <h3 className="text-base font-bold text-paper/85 mt-6">1. 노잼/유잼 어뷰징 (D-1)</h3>
        <p>
          원래 노잼 30 / 유잼 300이었는데 갑자기 노잼이 2,000표로 폭증. 누가 콘솔에서 한 줄짜리 스크립트 돌렸다. localStorage 체크 하나만 있고 백엔드 방어 없어서 가능했다.
        </p>
        <p>
          디시 댓글에 "노잼이 왜이렇게 많냐"는 글이 올라왔길래 답했다 — "원래 10:90 이었는데 어떤 한 놈이 장난친 거 같다. 일부러 안 막아놨는데 ㅋㅋㅋ 정성이 가득하다."
        </p>
        <Figure
          src="/recap/dc3.png"
          alt="디시 댓글 3 — 노잼 어뷰징 답변"
          caption="어뷰징 사건도 사이트 톤으로 받아쳤다."
        />

        <h3 className="text-base font-bold text-paper/85 mt-6">2. D-3 안 바뀜 버그</h3>
        <p>
          헤더의 D-day 배지가 SSR 빌드 시점에 박혀서 며칠 D-3 그대로 보였다. 클라이언트 컴포넌트로 분리하고 매분 갱신하도록 수정.
        </p>

        <h3 className="text-base font-bold text-paper/85 mt-6">3. 선관위 데이터 사라짐 (선거 후)</h3>
        <p>
          선거 끝나니 중앙선관위가 후보자 정보 페이지를 내렸다. 사이트의 "선관위 공식 자료" 라벨 검증이 불가능해졌고, 낙선자 6,453명의 개인정보 노출이 회색지대가 됐다. 그래서 <strong>데모/관리자 모드 토글</strong>을 만들었다. 공개는 마스킹된 데모 데이터(후보 #1, 정당-α, "10~50억 구간"), 관리자 로그인 시 원본 데이터. 데이터는 보존하면서 노출은 안전하게.
        </p>
      </Section>

      <Section title="비슷한 시민 사이트들">
        <ul>
          <li>
            <strong>
              <a
                href="https://cleanvote.kr"
                target="_blank"
                rel="noreferrer"
                className="text-neon underline"
              >
                후보검증소
              </a>
            </strong>{" "}
            (cleanvote.kr) — 더 정교한 시스템. 전과 PDF를 OCR로 분해해서 보여주고, 재산은 부동산·증권 등 항목별 분석. 노잼선거보다 압도적으로 깊다.
          </li>
          <li>
            <strong>모두의선거</strong> — 또 다른 시민 도구.
          </li>
        </ul>
        <p>
          좋은 사이트들이 많다. 노잼선거의 차별점은 <strong>디자인과 접근성, 그리고 시한부 정체성</strong>이었다. 깊이보다 톤으로 승부한 셈.
        </p>
      </Section>

      <Section title="비용">
        <ul>
          <li>도메인 (nojam.kr, 가비아): 약 28,000원/년</li>
          <li>Vercel Hobby: 무료</li>
          <li>Upstash Redis: 무료</li>
          <li>
            <strong>총 연간 28,000원 = 월 2,300원</strong>
          </li>
        </ul>
        <p>도메인은 유지. 4년 후 다음 지선에 인프라 재사용, 그리고 회고 자산 영구 보존.</p>
      </Section>

      <Section title="솔직한 한계">
        <p>
          한 달 전에 시작했다면 결과가 더 컸을 수도 있다. D-7부터 D-day는 너무 짧았다. 다음에는 D-30부터 시작할 것.
        </p>
        <p>
          그리고 솔직히 인정한다 — <strong>누군가 문제를 제기하면 문제가 될 수 있는 사이트</strong>라는 걸. 후보 6,714명의 신고 자료를 동의 없이 수집·재배포했다. 선관위 공개 정보라곤 하지만, 선거 끝나면 낙선자 6,453명은 다시 일반 시민이다. 그들의 재산·전과·주소가 한 사이트에 정리돼 있는 것 자체가 회색지대다. 그래서 데모/관리자 토글을 급하게 만들었지만, 처음부터 설계됐어야 한다.
        </p>
        <p>
          마지막으로 AI 시대에 와서 더 절감한 게 있다 — <strong>프로그래밍보다 데이터가 중요하다</strong>. 사이트 코드는 Claude Code가 5일 만에 다 만들어줬다. 노잼선거의 진짜 가치는 그 코드가 아니라 <strong>6,714명의 데이터를 어떤 톤으로 보여줬는가</strong>다. 그리고 한 발 더 뒤로 가면 — 그 데이터마저 <strong>남의 데이터</strong>다. 정확히는 시민이 신고한 데이터이고, 선관위가 모은 데이터다. 5일짜리 사이트를 만든 사람의 공로는 사실 적다. 데이터 모은 사람들이 진짜 일을 했다.
        </p>
      </Section>

      <Section title="배운 점">
        <ol>
          <li>
            <strong>B급 톤이 통한다</strong>. 진지한 정치 사이트보다 자조가 진입 장벽을 낮춘다.
          </li>
          <li>
            <strong>마케팅은 도배보다 진심</strong>. 한 글에 진심 담는 게 100개 도배보다 효과적. 100개 게시판 도배보다 한 글의 상위권 진입이 영향력 크다.
          </li>
          <li>
            <strong>AI 활용 솔직히 인정</strong>. 백엔드 개발자가 프론트 사이트 5일 만에 만들 수 있는 시대. 그게 좋은 일인지는 아직 모르겠다.
          </li>
          <li>
            <strong>선거법·개인정보 보호 — 선거 후가 진짜</strong>. 만들 때는 공개지만 끝나면 보호 의무. 토글 시스템 처음부터 설계할 것.
          </li>
          <li>
            <strong>SEO는 빠르다</strong>. 한국어 키워드 + 의도 명확이면 신생 도메인도 5일이면 검색 1위 가능.
          </li>
        </ol>
      </Section>

      <Section title="마무리">
        <p>
          5일짜리 사이트가 3,705명에게 1분의 정보를 줬다. 누가 더 잘 찍었는지는 모른다. 다만 "다들 정당만 보고 찍잖아"라는 답답함은 본인 마음에서 살짝 풀렸다.
        </p>
        <p>읽어주셔서 감사합니다.</p>
        <p className="text-xs text-paper/40 mt-6">— 노잼선거 운영자</p>
      </Section>

      <section className="mt-16 pt-6 border-t border-paper/10 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="text-xs text-paper/50 hover:text-neon font-mono">
          ← 메인으로
        </Link>
        <Link href="/board" className="text-xs text-paper/50 hover:text-neon font-mono">
          게시판에 한 마디 →
        </Link>
      </section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl sm:text-2xl font-black tracking-tightest mb-4 border-b border-paper/10 pb-2">
        {title}
      </h2>
      <div className="text-sm sm:text-base text-paper/85 leading-relaxed space-y-3 [&_strong]:text-paper [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2">
        {children}
      </div>
    </section>
  );
}
