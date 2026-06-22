import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-paper/10 py-10 text-xs text-paper/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-paper/70">
            <span className="text-neon">●</span> 노잼선거 · NOJAM ELECTION
          </div>
          <div className="mt-1">
            본 사이트는 비당파적 정보 제공 목적의 시민 프로젝트입니다.
          </div>
          <div className="mt-1 opacity-60">
            데이터 출처: 중앙선거관리위원회 (info.nec.go.kr) · 공공데이터포털
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Link href="/stats/wealth" className="hover:text-neon">재산 순위</Link>
          <Link href="/stats/parties" className="hover:text-neon">전과 신고</Link>
          <Link href="/stats/mayors" className="hover:text-neon">구청장 통계</Link>
          <Link href="/stats/councilors" className="hover:text-neon">시·도의원 통계</Link>
          <Link href="/stats/local-councilors" className="hover:text-neon">구·시·군의원 통계</Link>
          <Link href="/stats/top5" className="hover:text-neon">전국 Top 5</Link>
          <Link href="/about" className="hover:text-neon">소개</Link>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdjGx_x7QkvQvM2-GWZ7M8KrqFCRS-Crp6CAfmNav-MhWJp7g/viewform"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neon"
          >
            문의·정정
          </a>
          <Link href="/privacy" className="hover:text-neon">개인정보처리방침</Link>
          <Link href="/architecture" className="hover:text-neon">구성도</Link>
          <a href="https://info.nec.go.kr" target="_blank" rel="noreferrer" className="hover:text-neon">선관위</a>
          <Link
            href="/admin"
            className="opacity-30 hover:opacity-100 hover:text-neon"
            aria-label="관리자"
          >
            ·
          </Link>
        </div>
      </div>
    </footer>
  );
}
