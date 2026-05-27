import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 — 노잼선거",
  description:
    "노잼선거는 어떠한 개인정보도 직접 수집하지 않습니다. 사용 중인 외부 서비스와 처리 방침을 투명하게 안내합니다.",
  alternates: { canonical: "https://nojam.kr/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl py-10">
      <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
        ← 메인
      </Link>

      <h1 className="text-3xl sm:text-4xl font-black tracking-tightest mt-4">
        개인정보 <span className="text-neon">처리방침</span>
      </h1>
      <p className="text-xs text-paper/50 mt-2 font-mono">
        시행일: 2026.05.26
      </p>

      <section className="mt-8 space-y-5 text-sm text-paper/80 leading-relaxed">
        <p>
          노잼선거(이하 "본 사이트")는 시민 자발 프로젝트로 운영되며,
          이용자의 개인정보 보호를 매우 중요하게 생각합니다.
          본 처리방침은 본 사이트가 어떤 정보를 수집·이용하는지,
          어떤 외부 서비스를 사용하는지 투명하게 안내합니다.
        </p>

        <h2 className="text-xl font-black tracking-tightest text-paper pt-4">
          1. 수집하는 개인정보 — 없음
        </h2>
        <p>
          본 사이트는 회원가입·로그인 기능이 없으며, 이용자로부터 어떠한
          개인정보(이름·전화번호·이메일·주소·생년월일 등)도 직접 수집하지
          않습니다.
        </p>

        <h2 className="text-xl font-black tracking-tightest text-paper pt-4">
          2. 사용 중인 외부 서비스
        </h2>
        <p>본 사이트는 아래 외부 서비스를 사용하며, 이는 각 서비스 제공자의 정책에 따라 일부 비식별 정보가 처리될 수 있습니다.</p>
        <ul className="space-y-2 list-none">
          <li>
            <strong className="text-paper/90">Vercel Web Analytics</strong>
            <br />
            <span className="text-paper/60">
              방문자 수·페이지뷰·접속 국가·디바이스 종류 등 익명 집계 데이터.
              개별 이용자를 식별하지 않으며 쿠키를 사용하지 않습니다.
              <a className="text-neon underline ml-1" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel 개인정보처리방침 →</a>
            </span>
          </li>
          <li>
            <strong className="text-paper/90">Kakao JavaScript SDK (공유 기능)</strong>
            <br />
            <span className="text-paper/60">
              이용자가 "카톡 공유" 버튼을 누르는 경우에 한해 카카오에 공유 요청이 전송됩니다.
              본 사이트는 이용자의 카카오 계정 정보에 접근하지 않습니다.
              <a className="text-neon underline ml-1" href="https://www.kakao.com/policy/privacy" target="_blank" rel="noreferrer">카카오 개인정보처리방침 →</a>
            </span>
          </li>
          <li>
            <strong className="text-paper/90">Vercel (호스팅)</strong>
            <br />
            <span className="text-paper/60">
              호스팅 과정에서 표준 웹 서버 액세스 로그(IP·접속시각·요청 URL 등)가 일시적으로 생성될 수 있습니다.
              본 사이트 운영자는 이 로그를 직접 보관·이용하지 않습니다.
            </span>
          </li>
        </ul>

        <h2 className="text-xl font-black tracking-tightest text-paper pt-4">
          3. 후보자 정보의 출처와 처리
        </h2>
        <p>
          본 사이트에 표시되는 후보자 정보(이름·정당·학력·경력·재산·전과·납세·병역 등)는
          중앙선거관리위원회 선거통계시스템(<a href="https://info.nec.go.kr" target="_blank" rel="noreferrer" className="text-neon underline">info.nec.go.kr</a>)
          이 공개한 후보자 명부 자료를 그대로 인용한 것입니다.
        </p>
        <p>
          본 사이트는 후보자에 대한 평가·점수·등급화를 일체 수행하지 않으며,
          모든 후보를 동일한 양식·동일한 분량으로 표시합니다.
          후보자 표시 순서는 선관위가 부여한 기호 순입니다.
        </p>

        <h2 className="text-xl font-black tracking-tightest text-paper pt-4">
          4. 쿠키 사용
        </h2>
        <p>
          본 사이트는 자체적으로 쿠키를 사용하지 않습니다.
          다만 위 2항의 외부 서비스(Kakao SDK)가 자체 정책에 따라 쿠키를 사용할 수 있으며,
          이는 이용자의 브라우저 설정에서 차단 가능합니다.
        </p>

        <h2 className="text-xl font-black tracking-tightest text-paper pt-4">
          5. 정정·삭제 요청
        </h2>
        <p>
          후보자 정보에 오류가 있거나 정정이 필요한 부분이 있을 경우,{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdjGx_x7QkvQvM2-GWZ7M8KrqFCRS-Crp6CAfmNav-MhWJp7g/viewform"
            target="_blank"
            rel="noreferrer"
            className="text-neon underline"
          >
            문의 폼
          </a>
          으로 보내주시면 선관위 공개 자료 기준으로 신속히 검토합니다.
        </p>

        <h2 className="text-xl font-black tracking-tightest text-paper pt-4">
          6. 중립성 선언
        </h2>
        <p>
          본 사이트는 특정 정당·후보를 지지하거나 반대하지 않습니다.
          어떠한 정치 단체·기업·기관으로부터의 후원·광고도 받지 않으며,
          비영리·비상업적 시민 정보 제공 목적으로 운영됩니다.
        </p>

        <h2 className="text-xl font-black tracking-tightest text-paper pt-4">
          7. 처리방침 변경
        </h2>
        <p>
          본 처리방침이 변경되는 경우, 변경 내용과 시행일을 본 페이지에 사전 공지합니다.
        </p>
      </section>
    </article>
  );
}
