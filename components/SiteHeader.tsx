import Link from "next/link";
import { HeaderVoteMini, HeaderVoteMiniMobile } from "./HeaderVoteMini";
import { DDayBadge } from "./DDayBadge";
import { isAdmin } from "@/lib/auth";

// 모든 페이지 상단에 깔리는 글로벌 헤더
// - 로고(홈 링크) + 가운데 미니 투표 카운터 + 우측 메뉴 + D-Day
// - 마키 띠 아래에 위치
export function SiteHeader() {
  const admin = isAdmin();
  return (
    <>
    {admin && (
      <Link
        href="/admin"
        className="block w-full bg-neon text-ink text-center text-[11px] font-mono font-bold py-1 hover:bg-neon/90 transition-colors"
        aria-label="관리자 모드 — 클릭 시 로그아웃 가능"
      >
        👁 관리자 모드 — 원본 데이터 표시 중 (탭하여 로그아웃)
      </Link>
    )}
    <header className="border-b border-paper/10 bg-ink/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0"
          aria-label="노잼선거 홈으로"
        >
          <span
            className="inline-block w-2 h-2 rounded-full bg-neon group-hover:scale-125 transition-transform"
            aria-hidden
          />
          <span className="font-black tracking-tightest text-base group-hover:text-neon transition-colors">
            노잼선거
          </span>
        </Link>

        {/* 가운데 미니 투표 카운터 */}
        <div className="flex-1 flex items-center justify-center">
          <HeaderVoteMini />
          <HeaderVoteMiniMobile />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/recap"
            className="text-xs text-paper/60 hover:text-neon transition-colors font-semibold"
          >
            회고
          </Link>
          <Link
            href="/board"
            className="text-xs text-paper/60 hover:text-neon transition-colors font-semibold"
          >
            게시판
          </Link>
          <Link
            href="/stats/wealth"
            className="hidden sm:inline text-xs text-paper/60 hover:text-neon transition-colors font-semibold"
          >
            재산 순위
          </Link>
          <Link
            href="/about"
            className="hidden sm:inline text-xs text-paper/50 hover:text-paper/90 transition-colors"
          >
            소개
          </Link>
          <DDayBadge className="font-mono text-[11px] bg-neon text-ink px-1.5 py-0.5 rounded-sm font-bold" />
        </div>
      </div>
    </header>
    </>
  );
}
