import Link from "next/link";
import { BoardClient } from "@/components/BoardClient";

export const metadata = {
  title: "게시판 — 노잼선거",
  description: "선거·후보·사이트 의견 자유 게시판. 비당파 시민 공간.",
  alternates: { canonical: "https://nojam.kr/board" },
};

// 동적 페이지 — 매 요청 시 최신 글 목록 로드.
export const dynamic = "force-dynamic";

export default function BoardPage() {
  return (
    <article className="py-10">
      <header className="mb-8">
        <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
          ← 메인
        </Link>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tightest mt-3">
          게시판
        </h1>
        <p className="text-sm text-paper/60 mt-2 leading-relaxed">
          사이트·선거에 대한 의견·후기·버그 신고를 남겨주세요. 비회원 자유 작성, 닉네임과 4자리 비밀번호로 본인 글 삭제 가능.
        </p>
        <p className="text-[11px] text-paper/40 mt-2 leading-relaxed">
          ※ 후보·정당에 대한 비방, 개인 사생활 침해, 광고·도배는 운영자 판단으로 삭제됩니다. 본문에 <code className="font-mono">https://...</code> 이미지 URL 붙이면 자동으로 보여요.
        </p>
      </header>

      <BoardClient />
    </article>
  );
}
