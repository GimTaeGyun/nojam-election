import { cookies } from "next/headers";

// 관리자 인증 — 쿠키 기반.
// 환경변수 ADMIN_PASSWORD (영숫자 8~16자리)로 검증.
// 쿠키 nojam_admin 값이 ADMIN_TOKEN과 같으면 관리자.
// ADMIN_TOKEN도 환경변수 (긴 시크릿 문자열).

export const COOKIE_NAME = "nojam_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일

/** 서버 컴포넌트에서 호출 — 현재 요청이 관리자인지 */
export function isAdmin(): boolean {
  try {
    const c = cookies().get(COOKIE_NAME);
    if (!c?.value) return false;
    const token = process.env.ADMIN_TOKEN;
    if (!token) return false;
    return c.value === token;
  } catch {
    return false;
  }
}

/** API route에서 쿠키 설정 헬퍼 */
export function adminCookieAttrs() {
  return {
    name: COOKIE_NAME,
    value: process.env.ADMIN_TOKEN ?? "",
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

/** 환경변수 비번 일치 확인 */
export function checkPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // 길이 다르면 즉시 false (timing-safe 비교는 Node 환경이 아니라 생략)
  if (input.length !== password.length) return false;
  return input === password;
}
