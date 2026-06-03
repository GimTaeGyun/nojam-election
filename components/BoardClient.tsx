"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PostPublic {
  id: number;
  title: string;
  content: string;
  nickname: string;
  ipMasked: string;
  createdAt: number;
}

const PAGE_SIZE = 20;

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  const date = new Date(ts);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function BoardClient() {
  const [posts, setPosts] = useState<PostPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [writeOpen, setWriteOpen] = useState(false);

  const loadPage = (newOffset: number) => {
    setLoading(true);
    fetch(`/api/posts?offset=${newOffset}&limit=${PAGE_SIZE}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.posts)) setPosts(d.posts);
        if (typeof d.total === "number") setTotal(d.total);
        setOffset(newOffset);
      })
      .catch(() => void 0)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPage(0);
  }, []);

  const lastPage = Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
  const currentPage = Math.floor(offset / PAGE_SIZE);

  return (
    <div>
      {/* 작성 폼 토글 */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="text-[11px] font-mono text-paper/40">
          총 {total.toLocaleString()}개
        </div>
        <button
          onClick={() => setWriteOpen((v) => !v)}
          className="px-3 py-1.5 text-xs font-bold rounded-md border border-neon/40 text-neon hover:bg-neon/[0.06] transition-colors"
        >
          {writeOpen ? "✕ 닫기" : "✍ 새 글"}
        </button>
      </div>

      {writeOpen && (
        <WriteForm
          onPosted={() => {
            setWriteOpen(false);
            loadPage(0);
          }}
        />
      )}

      {/* 목록 */}
      {loading && posts.length === 0 ? (
        <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/40 text-sm">
          불러오는 중…
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-paper/10 rounded-lg p-8 text-center text-paper/50 text-sm">
          아직 글이 없어요. 첫 글을 남겨주세요.
        </div>
      ) : (
        <ul className="border border-paper/10 rounded-xl divide-y divide-paper/5 overflow-hidden">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/board/${p.id}`}
                className="flex items-baseline gap-3 px-4 py-3 hover:bg-paper/[0.03] transition-colors"
              >
                <span className="font-mono text-xs text-paper/40 tabular-nums w-10 shrink-0">
                  #{p.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.title}</div>
                  <div className="text-[11px] font-mono text-paper/45 truncate mt-0.5">
                    {p.nickname} · {p.ipMasked} · {timeAgo(p.createdAt)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* 페이징 */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 gap-2">
          <button
            onClick={() => loadPage(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0 || loading}
            className="px-3 py-1.5 text-xs border border-paper/15 rounded-md text-paper/70 disabled:opacity-30 hover:bg-paper/[0.03]"
          >
            ← 이전
          </button>
          <span className="text-[11px] font-mono text-paper/40 tabular-nums">
            {currentPage + 1} / {lastPage + 1}
          </span>
          <button
            onClick={() => loadPage(offset + PAGE_SIZE)}
            disabled={currentPage >= lastPage || loading}
            className="px-3 py-1.5 text-xs border border-paper/15 rounded-md text-paper/70 disabled:opacity-30 hover:bg-paper/[0.03]"
          >
            다음 →
          </button>
        </div>
      )}
    </div>
  );
}

function WriteForm({ onPosted }: { onPosted: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("제목과 본문을 입력하세요");
      return;
    }
    if (!/^\d{4}$/.test(password)) {
      setError("비밀번호는 숫자 4자리");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, nickname, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "등록 실패");
        return;
      }
      setTitle("");
      setContent("");
      setNickname("");
      setPassword("");
      onPosted();
    } catch {
      setError("네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="border border-neon/30 rounded-xl p-4 mb-6 bg-paper/[0.02] space-y-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        maxLength={100}
        className="w-full bg-ink border border-paper/15 focus:border-neon/60 focus:outline-none rounded-md px-3 py-2 text-sm"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="본문 — 이미지는 https://...jpg / .png / .webp 형식 URL을 본문에 붙이면 자동 표시됩니다"
        maxLength={5000}
        rows={6}
        className="w-full bg-ink border border-paper/15 focus:border-neon/60 focus:outline-none rounded-md px-3 py-2 text-sm font-mono leading-relaxed"
      />
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (없으면 익명)"
          maxLength={20}
          className="flex-1 min-w-[150px] bg-ink border border-paper/15 focus:border-neon/60 focus:outline-none rounded-md px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
          placeholder="비번 4자리"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          className="w-28 bg-ink border border-paper/15 focus:border-neon/60 focus:outline-none rounded-md px-3 py-2 text-sm font-mono tabular-nums"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-bold rounded-md bg-neon text-ink hover:bg-neon/90 disabled:opacity-50 transition-colors"
        >
          {submitting ? "등록 중…" : "등록"}
        </button>
      </div>
      {error && (
        <div className="text-xs text-neon font-mono">⚠ {error}</div>
      )}
      <div className="text-[10px] text-paper/40 leading-relaxed">
        ※ 비밀번호는 본인 글 삭제용입니다. 분실 시 운영자 문의.
      </div>
    </form>
  );
}
