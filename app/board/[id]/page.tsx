import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/board";
import { PostContent } from "@/components/PostContent";
import { PostDeleteButton } from "@/components/PostDeleteButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return { title: "게시판 — 노잼선거" };
  const post = await getPost(id);
  if (!post) return { title: "글을 찾을 수 없음 — 노잼선거" };
  return {
    title: `${post.title} — 노잼선거 게시판`,
    description: post.content.slice(0, 100),
    alternates: { canonical: `https://nojam.kr/board/${id}` },
  };
}

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id < 1) notFound();
  const post = await getPost(id);
  if (!post) notFound();

  const date = new Date(post.createdAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <article className="py-10">
      <Link href="/board" className="text-xs text-paper/40 hover:text-neon font-mono">
        ← 게시판
      </Link>

      <header className="mt-3 mb-6 border-b border-paper/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tightest break-words">
          {post.title}
        </h1>
        <div className="text-[11px] font-mono text-paper/50 mt-2 flex flex-wrap gap-x-3 gap-y-1">
          <span>#{post.id}</span>
          <span>{post.nickname || "익명"}</span>
          <span>{post.ipMasked}</span>
          <span>{dateStr}</span>
        </div>
      </header>

      <section className="mb-8">
        <PostContent text={post.content} />
      </section>

      <PostDeleteButton postId={post.id} />

      <div className="mt-12 pt-4 border-t border-paper/10 text-xs text-paper/40 leading-relaxed">
        <p>
          이 글이 부적절하다면{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdjGx_x7QkvQvM2-GWZ7M8KrqFCRS-Crp6CAfmNav-MhWJp7g/viewform"
            target="_blank"
            rel="noreferrer"
            className="text-neon underline"
          >
            문의 폼
          </a>
          으로 신고해주세요.
        </p>
      </div>
    </article>
  );
}
