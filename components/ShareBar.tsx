"use client";

import { useState } from "react";

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

  return (
    <div className="flex items-center gap-2 text-xs">
      <button
        onClick={onNative}
        className="border border-neon/40 text-neon px-3 py-2 rounded-md hover:bg-neon/10 font-semibold"
      >
        친구한테 보내기 ↗
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
