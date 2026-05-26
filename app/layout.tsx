import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Marquee } from "@/components/Marquee";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_NAME = "노잼선거";
const SITE_DESC =
  "정치 노잼인 거 아는데, 5분만. 2026 지방선거 우리 동네 후보 팩트 정리.";
const SITE_URL = "https://nojam-election.vercel.app"; // 커스텀 도메인 사면 변경

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · 정치 노잼인 거 아는데, 5분만`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "노잼선거",
    "2026 지방선거",
    "6월 3일 선거",
    "시도지사 후보",
    "교육감 후보",
    "후보 비교",
    "선관위",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 정치 노잼인 거 아는데, 5분만`,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — 정치 노잼인 거 아는데, 5분만`,
    description: SITE_DESC,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans">
        <Marquee />
        <main className="max-w-5xl mx-auto px-5 sm:px-8">
          {children}
          <Footer />
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
