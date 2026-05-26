"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    Kakao?: any;
  }
}

const APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY ?? "";

/**
 * 카카오 SDK 로딩 + 초기화.
 * layout.tsx 안에 한 번만 포함하면 됨.
 * .env.local 에 NEXT_PUBLIC_KAKAO_APP_KEY 가 있어야 작동.
 */
export function KakaoScript() {
  useEffect(() => {
    if (!APP_KEY) return;
    if (typeof window === "undefined") return;
    const tryInit = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(APP_KEY);
        } catch {
          // already inited or not ready
        }
      }
    };
    // 스크립트 로드 직후엔 onLoad 이벤트로 init하지만,
    // 다른 페이지 이동 시에도 다시 시도
    tryInit();
  }, []);

  if (!APP_KEY) return null;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(APP_KEY);
          } catch {
            /* noop */
          }
        }
      }}
    />
  );
}
