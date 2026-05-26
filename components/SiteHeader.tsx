import Link from "next/link";
import { ddayLabel } from "@/lib/dday";

// 모든 페이지 상단에 깔리는 글로벌 헤더
// - 로고(홈 링크) + D-Day chip
// - 마키 띠 아래에 위치
export function SiteHeader() {
  return (
    <header className="border-b border-paper/10 bg-ink/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
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

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            className="text-xs text-paper/50 hover:text-paper/90 transition-colors"
          >
            소개
          </Link>
          <span
            className="font-mono text-[11px] bg-neon text-ink px-1.5 py-0.5 rounded-sm font-bold"
            aria-label={`선거일까지 ${ddayLabel()}`}
          >
            {ddayLabel()}
          </span>
        </div>
      </div>
    </header>
  );
}
