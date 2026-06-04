import { NextResponse } from "next/server";
import { adminCookieAttrs, checkPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/board";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // 무차별 대입 방지: IP당 5분에 5회
    const rl = await checkRateLimit({ ip, windowSec: 300, max: 5, scope: "admin-login" });
    if (!rl.ok) {
      return NextResponse.json({ error: "너무 자주 시도하셨어요. 5분 후 다시" }, { status: 429 });
    }

    const body = (await req.json()) as { password?: string };
    const password = (body.password ?? "").trim();
    if (!password || password.length < 8 || password.length > 16) {
      return NextResponse.json({ error: "비밀번호 형식 오류" }, { status: 400 });
    }

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "비밀번호 불일치" }, { status: 401 });
    }

    const cookie = adminCookieAttrs();
    if (!cookie.value) {
      return NextResponse.json({ error: "ADMIN_TOKEN 미설정" }, { status: 500 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookie);
    return res;
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
