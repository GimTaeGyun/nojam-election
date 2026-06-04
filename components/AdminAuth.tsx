"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8 || password.length > 16) {
      setError("비밀번호 8~16자리");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "로그인 실패");
        return;
      }
      router.refresh();
    } catch {
      setError("네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value.slice(0, 16))}
        placeholder="비밀번호 8~16자리"
        autoFocus
        className="w-full bg-ink border border-paper/15 focus:border-neon/60 focus:outline-none rounded-md px-3 py-2 text-sm font-mono tabular-nums"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 text-sm font-bold rounded-md bg-neon text-ink hover:bg-neon/90 disabled:opacity-50 transition-colors"
      >
        {submitting ? "확인 중…" : "관리자 모드 진입"}
      </button>
      {error && <div className="text-xs text-neon font-mono">⚠ {error}</div>}
    </form>
  );
}

export function AdminLogoutButton() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const logout = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      onClick={logout}
      disabled={submitting}
      className="px-4 py-2 text-xs font-bold rounded-md border border-paper/20 text-paper/80 hover:bg-paper/[0.05] disabled:opacity-50 transition-colors"
    >
      {submitting ? "처리 중…" : "🔒 로그아웃 (데모 모드 복귀)"}
    </button>
  );
}
