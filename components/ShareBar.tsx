"use client";

import { useState } from "react";
import { isKakaoReady, shareToKakao } from "@/lib/kakao";

export function ShareBar({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false);
  const target =
    url ?? (typeof window !== "undefined" ? window.location.href : "");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n${target}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  };

  const onKakao = () => {
    const ok = shareToKakao({ title, url: target });
    if (!ok) {
      // SDK 미로드 시 일반 공유로 폴백
      onNative();
    }
  };

  const onNative = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "노잼선거", text: title, url: target });
      } catch {
        /* user cancelled */
      }
    } else {
      onCopy();
    }
  };

  const hasKakao = typeof window !== "undefined" && isKakaoReady();

  return (
    <div className="flex items-center gap-2 text-xs flex-wrap">
      <button
        onClick={onKakao}
        className="flex items-center gap-1.5 bg-[#FEE500] text-[#3C1E1E] px-3 py-2 rounded-md hover:opacity-90 font-bold transition-opacity"
        aria-label="카카오톡으로 공유"
      >
        <KakaoIcon />
        카톡 공유
      </button>
      <button
        onClick={onNative}
        className="border border-neon/40 text-neon px-3 py-2 rounded-md hover:bg-neon/10 font-semibold"
      >
        친구한테 ↗
      </button>
      <button
        onClick={onCopy}
        className="border border-paper/15 text-paper/70 px-3 py-2 rounded-md hover:border-paper/40"
      >
        {copied ? "복사됨 ✓" : "링크 복사"}
      </button>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M128 36C71.6 36 26 71.5 26 115.4c0 28 18.6 52.5 46.7 66.7-1.2 4.3-7.6 26.4-8.7 30.7-1.3 5.4 2 5.3 4.2 3.9 1.7-1.1 27.3-18.5 38.4-26 7 1 14.3 1.5 21.4 1.5 56.4 0 102-35.5 102-79.4S184.4 36 128 36z"
      />
    </svg>
  );
}
