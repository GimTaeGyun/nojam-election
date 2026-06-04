import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Marquee } from "@/components/Marquee";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { VoteWidget } from "@/components/VoteWidget";
import { KakaoScript } from "@/components/KakaoScript";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_NAME = "노잼선거";
const SITE_TITLE = "노잼선거 — 2026 지방선거 후보 재산·전과·납세 한눈에";
const SITE_DESC =
  "2026년 6월 3일 제9회 지방선거, 우리 동네 시·도지사·교육감 후보의 재산·전과·납세·학력·경력을 1분 안에 한눈에 비교. 중앙선관위 공식 자료 기반 시민 정보 사이트.";
const SITE_URL = "https://nojam.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "노잼선거",
    "2026 지방선거",
    "6월 3일 지방선거",
    "제9회 전국동시지방선거",
    "후보자 정보",
    "후보 재산",
    "후보 전과",
    "후보자 전과 조회",
    "후보 전과기록",
    "시도지사 후보",
    "시도지사 후보 비교",
    "교육감 후보",
    "서울시장 후보",
    "부산시장 후보",
    "경기도지사 후보",
    "정당별 전과",
    "선관위 후보자정보",
    "후보자 명부",
  ],
  authors: [{ name: "노잼선거" }],
  category: "politics",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

// SiteHeader가 관리자 쿠키 따라 배지 표시하므로 정적 캐시 금지.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans">
        <Marquee />
        <SiteHeader />
        <main className="max-w-5xl mx-auto px-5 sm:px-8">
          {children}
          <VoteWidget />
          <Footer />
        </main>
        <Analytics />
        <SpeedInsights />
        <KakaoScript />
      </body>
    </html>
  );
}
