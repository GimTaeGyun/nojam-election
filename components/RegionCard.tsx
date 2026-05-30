"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDistrictsByRegion } from "@/lib/mayors";

interface Props {
  code: string;
  shortName: string;
  vibe?: string;
}

export function RegionCard({ code, shortName, vibe }: Props) {
  const districts = getDistrictsByRegion(code);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const goToBasic = () => {
    setOpen(false);
    router.push(`/${code}`);
  };

  const goToDistrict = (d: string) => {
    setOpen(false);
    router.push(`/${code}?district=${encodeURIComponent(d)}#mayor`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card-hover group border border-paper/10 rounded-lg p-4 hover:bg-paper/[0.03] text-left w-full"
      >
        <div className="text-xs text-paper/40 font-mono">{code.toUpperCase()}</div>
        <div className="text-xl font-black tracking-tight mt-1">{shortName}</div>
        <div className="text-[11px] text-paper/50 mt-1 line-clamp-1">{vibe}</div>
        <div className="mt-3 text-[11px] text-neon/70 group-hover:text-neon">
          후보 보러가기 →
        </div>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${shortName} 후보 보기 옵션`}
          className="fixed inset-0 bg-ink/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-ink border border-neon/30 rounded-xl p-5 max-w-sm w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-baseline mb-4 gap-3">
              <h3 className="text-xl font-black tracking-tightest">
                {shortName}{" "}
                <span className="text-paper/40 text-xs font-normal">어디 가실래요?</span>
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-paper/50 hover:text-neon text-xl leading-none shrink-0"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 1) 시·도지사 + 교육감 */}
            <button
              type="button"
              onClick={goToBasic}
              className="w-full border border-neon/40 bg-neon/[0.04] hover:bg-neon/[0.08] rounded-lg px-4 py-3 mb-4 text-left transition-colors"
            >
              <div className="text-sm font-bold text-neon">시·도지사 + 교육감 →</div>
              <div className="text-[11px] text-paper/50 mt-0.5">광역 후보 한 번에 보기</div>
            </button>

            {/* 2) 구청장 선거구 */}
            {districts.length > 0 && (
              <div>
                <div className="text-[11px] font-mono text-paper/60 mb-2 px-1">
                  또는 구청장 선거구 ({districts.length}개)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {districts.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => goToDistrict(d)}
                      className="border border-paper/10 hover:border-neon/40 hover:bg-neon/[0.04] rounded-md px-2 py-2 text-[11px] text-paper/85 hover:text-neon transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
