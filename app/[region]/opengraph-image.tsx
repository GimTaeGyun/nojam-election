import { ImageResponse } from "next/og";
import { getRegion } from "@/data/candidates";
import { ddayLabel } from "@/lib/dday";

export const runtime = "edge";
// D-Day가 매일 바뀌므로 1시간 단위로 OG 이미지 재생성.
export const revalidate = 3600;
export const alt = "노잼선거 — 우리 동네 후보 보기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { region: string } }) {
  const r = getRegion(params.region);
  const name = r?.name ?? "내 지역";
  const govCount = r?.races.find((x) => x.type === "광역단체장")?.candidates.length ?? 0;
  const eduCount = r?.races.find((x) => x.type === "교육감")?.candidates.length ?? 0;

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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: "#d4ff00",
              color: "#0a0a0a",
              padding: "4px 10px",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            노잼선거
          </div>
          <div style={{ color: "#d4ff00", fontSize: 20, fontFamily: "monospace" }}>
            {ddayLabel()} · 6.3 (수)
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 28, color: "rgba(250,250,250,0.6)" }}>
            우리 동네 후보 보기
          </div>
          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
            }}
          >
            {name}
            <span style={{ color: "#d4ff00" }}>.</span>
          </div>
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
            시·도지사 {govCount}명 · 교육감 {eduCount}명 · 30초 룰
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
