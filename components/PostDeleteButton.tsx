"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PostDeleteButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{4}$/.test(password)) {
      setError("비밀번호 4자리");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "삭제 실패");
        return;
      }
      router.push("/board");
      router.refresh();
    } catch {
      setError("네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 text-xs text-paper/50 hover:text-neon font-mono"
      >
        🗑 본인 글 삭제
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 border border-paper/15 rounded-md p-2 max-w-xs"
    >
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
        placeholder="비번 4자리"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        autoFocus
        className="flex-1 bg-ink border border-paper/15 focus:border-neon/60 focus:outline-none rounded-sm px-2 py-1 text-xs font-mono"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-2 py-1 text-xs font-bold rounded-sm bg-neon/20 text-neon hover:bg-neon/30 disabled:opacity-50"
      >
        삭제
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setPassword("");
          setError(null);
        }}
        className="px-2 py-1 text-xs text-paper/50 hover:text-paper"
      >
        ✕
      </button>
      {error && (
        <div className="text-[10px] text-neon font-mono ml-2">{error}</div>
      )}
    </form>
  );
}
