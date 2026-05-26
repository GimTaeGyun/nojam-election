"use client";

import { useEffect, useState } from "react";

const ELECTION = new Date(2026, 5, 3, 0, 0, 0).getTime(); // 2026-06-03 00:00:00

function compute() {
  const now = Date.now();
  let diff = ELECTION - now;
  const isPast = diff < 0;
  if (isPast) diff = -diff;
  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds, isPast };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  // SSR/CSR hydration mismatch 막기 위해 mount 후 실제 시간 사용
  const [time, setTime] = useState<ReturnType<typeof compute> | null>(null);

  useEffect(() => {
    setTime(compute());
    const id = setInterval(() => setTime(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    // 첫 렌더 — 빈 자리 차지만
    return (
      <div className="font-mono text-neon/30 text-2xl sm:text-3xl font-black tracking-tight tabular-nums">
        --일 --:--:--
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2 sm:gap-3 font-mono text-neon font-black tabular-nums">
      <span className="text-3xl sm:text-4xl">
        {time.isPast ? "+" : ""}
        {time.days}
      </span>
      <span className="text-base text-paper/60">일</span>
      <span className="text-3xl sm:text-4xl">{pad(time.hours)}</span>
      <span className="text-base text-paper/60">:</span>
      <span className="text-3xl sm:text-4xl">{pad(time.minutes)}</span>
      <span className="text-base text-paper/60">:</span>
      <span className="text-3xl sm:text-4xl animate-pulse">{pad(time.seconds)}</span>
    </div>
  );
}
