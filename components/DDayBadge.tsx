"use client";

import { useEffect, useState } from "react";
import { ddayLabel } from "@/lib/dday";

interface Props {
  className?: string;
}

// D-Day 라벨을 클라이언트 시간 기준으로 계산해서 출력.
// 서버 컴포넌트에서 ddayLabel()을 직접 호출하면 빌드 시점에 박혀버려
// 배포 후 자동으로 안 바뀌는 문제 방지.
export function DDayBadge({ className }: Props) {
  // SSR 첫 렌더는 빌드 시점 값으로 시작 (빈 값보다 깜빡임 적음).
  // 마운트 후 useEffect에서 즉시 실제 클라이언트 시간으로 교체.
  const [label, setLabel] = useState<string>(() => ddayLabel());

  useEffect(() => {
    setLabel(ddayLabel());
    // 1분마다 재계산 — 자정 넘어가면 D-X 자동 감소.
    const id = setInterval(() => setLabel(ddayLabel()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={className}
      aria-label={`선거일까지 ${label}`}
      suppressHydrationWarning
    >
      {label}
    </span>
  );
}
