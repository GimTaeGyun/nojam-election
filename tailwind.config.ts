import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#fafafa",
        // 시그니처 네온 (B급 위트 포인트)
        neon: "#d4ff00",
        // 정당 컬러 (공식 컬러 기준)
        party: {
          democratic: "#152484",
          ppp: "#E61E2B",
          progressive: "#FFCD00",
          rebuilding: "#FF7920",
          green: "#7BBA3C",
          indep: "#6B7280",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
