import { NextResponse } from "next/server";
import { getCounts, incrementVote, type VoteKind } from "@/lib/votes";

// Edge runtime — 가볍고 빠름
export const runtime = "edge";

// 캐싱 방지 — 실시간 카운트가 보여야 함
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counts = await getCounts();
    return NextResponse.json(counts);
  } catch (err) {
    return NextResponse.json(
      { error: "failed to read votes", fun: 0, nojam: 0 },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { vote?: string };
    const v = body.vote;
    if (v !== "fun" && v !== "nojam") {
      return NextResponse.json({ error: "invalid vote" }, { status: 400 });
    }
    const counts = await incrementVote(v as VoteKind);
    return NextResponse.json(counts);
  } catch (err) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
