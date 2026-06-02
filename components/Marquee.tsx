"use client";

// 상단에 흐르는 노란 띠 — B급 위트 / 핵심 메시지 노출
import { useEffect, useState } from "react";
import { ddayLabel } from "@/lib/dday";

const COPY_BITS = [
  "정치 노잼인 거 아는데",
  "그래도 1분만",
  "내 동네 후보 누군지는 알고 찍자",
  "정당 보고만 찍지 말기",
  "팩트만 깔끔하게",
  "이거 보고도 안 가면 어쩔 수 없고",
];

export function Marquee() {
  // SSR에선 빈 값. mount 후 클라이언트 시간으로 채움.
  const [dday, setDday] = useState<string>("");
  useEffect(() => {
    setDday(ddayLabel());
    const id = setInterval(() => setDday(ddayLabel()), 60_000);
    return () => clearInterval(id);
  }, []);

  const items = [...COPY_BITS, ...COPY_BITS];
  return (
    <div className="bg-neon text-ink overflow-hidden border-b border-ink/10 select-none">
      <div className="marquee-track flex gap-10 whitespace-nowrap py-2 text-sm font-semibold tracking-tight">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className="font-mono text-xs px-2 py-0.5 bg-ink text-neon rounded-sm"
              suppressHydrationWarning
            >
              {dday || "D-—"}
            </span>
            <span>{t}</span>
            <span className="opacity-40">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
