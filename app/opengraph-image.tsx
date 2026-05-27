import { ImageResponse } from "next/og";
import { ddayLabel } from "@/lib/dday";

export const runtime = "edge";
export const alt = "노잼선거 — 정치 노잼인 거 아는데, 5분만";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: "#d4ff00",
              color: "#0a0a0a",
              padding: "4px 10px",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            NOJAM
          </div>
          <div style={{ color: "#d4ff00", fontSize: 22, fontFamily: "monospace" }}>
            {ddayLabel()} · 2026.06.03
          </div>
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>
            정치 <span style={{ color: "#d4ff00" }}>노잼</span>인 거
          </span>
          <span>아는데,</span>
          <span>
            그래도 <span style={{ color: "#d4ff00" }}>5분</span>만.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "rgba(250,250,250,0.6)",
          }}
        >
          <span>
            우리 동네 시·도지사 + 교육감 후보 · 팩트만 깔끔하게
          </span>
          <span style={{ color: "#d4ff00", fontFamily: "monospace" }}>
            nojam.kr
          </span>
        </div>
      </div>
    ),
    size,
  );
}
