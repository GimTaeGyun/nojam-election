import { NextResponse } from "next/server";
import { getPost, deletePost } from "@/lib/board";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id) || id < 1) {
      return NextResponse.json({ error: "invalid id" }, { status: 400 });
    }
    const post = await getPost(id);
    if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id) || id < 1) {
      return NextResponse.json({ error: "invalid id" }, { status: 400 });
    }
    const body = (await req.json().catch(() => ({}))) as {
      password?: string;
      adminToken?: string;
    };
    const ok = await deletePost({
      id,
      password: body.password,
      adminToken: body.adminToken,
    });
    if (!ok) {
      return NextResponse.json({ error: "비밀번호 불일치" }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
