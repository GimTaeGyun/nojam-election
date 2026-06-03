import { NextResponse } from "next/server";
import { createPost, listPosts, checkRateLimit } from "@/lib/board";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "0.0.0.0";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const result = await listPosts({ offset, limit });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "failed to list", posts: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: string;
      content?: string;
      nickname?: string;
      password?: string;
    };
    // 검증
    const title = (body.title ?? "").trim();
    const content = (body.content ?? "").trim();
    const nickname = (body.nickname ?? "").trim();
    const password = (body.password ?? "").trim();

    if (!title || title.length > 100) {
      return NextResponse.json({ error: "제목은 1~100자" }, { status: 400 });
    }
    if (!content || content.length > 5000) {
      return NextResponse.json({ error: "본문은 1~5000자" }, { status: 400 });
    }
    if (nickname.length > 20) {
      return NextResponse.json({ error: "닉네임은 20자 이내" }, { status: 400 });
    }
    if (!/^\d{4}$/.test(password)) {
      return NextResponse.json({ error: "비밀번호는 숫자 4자리" }, { status: 400 });
    }

    const ip = getClientIp(req);

    // Rate limit: IP당 5분에 3글까지
    const rl = await checkRateLimit({ ip, windowSec: 300, max: 3, scope: "write" });
    if (!rl.ok) {
      return NextResponse.json({ error: "잠깐, 너무 자주 쓰셨어요. 5분 후에" }, { status: 429 });
    }

    const post = await createPost({ title, content, nickname, password, ip });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: "failed to create" }, { status: 500 });
  }
}
