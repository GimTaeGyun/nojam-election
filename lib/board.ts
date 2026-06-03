import { redis } from "./votes";

// 게시판 — Upstash Redis 기반.
// 인증: 닉네임 + 4자리 비번 (디시 스타일).
// 본문 이미지: 외부 URL 자동 감지해서 클라이언트에서 렌더. 직접 업로드 없음.

const KEY_COUNTER = "board:counter";
const KEY_LIST = "board:list";
const keyPost = (id: number) => `board:post:${id}`;

export interface Post {
  id: number;
  title: string;
  content: string;
  nickname: string;
  passwordHash: string; // 4자리 비번의 해시
  ipMasked: string;
  createdAt: number;
}

export interface PostPublic {
  id: number;
  title: string;
  content: string;
  nickname: string;
  ipMasked: string;
  createdAt: number;
}

function toPublic(p: Post): PostPublic {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    nickname: p.nickname,
    ipMasked: p.ipMasked,
    createdAt: p.createdAt,
  };
}

// 간단 해시 (4자리 비번이라 강력한 해시 X). 같은 비번이면 같은 해시.
// Web Crypto API SHA-256 사용.
export async function hashPassword(pw: string): Promise<string> {
  const buf = new TextEncoder().encode(`nojam-board-salt:${pw}`);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// IP 주소를 적당히 가리기. "1.2.3.4" → "1.2.*.*"
export function maskIp(ip: string): string {
  if (!ip) return "anon";
  // IPv6면 앞 2 hextet만 남김
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return `${parts[0]}:${parts[1] || ""}:*`;
  }
  const parts = ip.split(".");
  if (parts.length !== 4) return "anon";
  return `${parts[0]}.${parts[1]}.*.*`;
}

export async function createPost(input: {
  title: string;
  content: string;
  nickname: string;
  password: string;
  ip: string;
}): Promise<PostPublic> {
  if (!redis) throw new Error("redis not configured");
  const id = await redis.incr(KEY_COUNTER);
  const passwordHash = await hashPassword(input.password);
  const post: Post = {
    id,
    title: input.title.slice(0, 100),
    content: input.content.slice(0, 5000),
    nickname: input.nickname.slice(0, 20) || "익명",
    passwordHash,
    ipMasked: maskIp(input.ip),
    createdAt: Date.now(),
  };
  await redis.set(keyPost(id), JSON.stringify(post));
  await redis.zadd(KEY_LIST, { score: post.createdAt, member: String(id) });
  return toPublic(post);
}

export async function listPosts(opts: {
  offset?: number;
  limit?: number;
}): Promise<{ posts: PostPublic[]; total: number }> {
  if (!redis) return { posts: [], total: 0 };
  const offset = opts.offset ?? 0;
  const limit = opts.limit ?? 20;
  // sorted set에서 최신순 — score 내림차순
  const ids = (await redis.zrange<string[]>(KEY_LIST, offset, offset + limit - 1, {
    rev: true,
  })) as string[];
  const total = (await redis.zcard(KEY_LIST)) as number;
  if (ids.length === 0) return { posts: [], total };
  // 일괄 조회
  const raws = await redis.mget<string[]>(...ids.map((id) => keyPost(Number(id))));
  const posts: PostPublic[] = [];
  for (const raw of raws) {
    if (!raw) continue;
    try {
      // Upstash가 자동 JSON.parse 해줄 수 있음
      const p: Post = typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as Post);
      posts.push(toPublic(p));
    } catch {
      // skip malformed
    }
  }
  return { posts, total };
}

export async function getPost(id: number): Promise<PostPublic | null> {
  if (!redis) return null;
  const raw = await redis.get(keyPost(id));
  if (!raw) return null;
  try {
    const p: Post = typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as Post);
    return toPublic(p);
  } catch {
    return null;
  }
}

/**
 * 글 삭제 — 비번 일치 또는 admin token 일치 시 성공.
 * @returns true if deleted, false if 인증 실패 / 글 없음
 */
export async function deletePost(input: {
  id: number;
  password?: string;
  adminToken?: string;
}): Promise<boolean> {
  if (!redis) return false;
  const raw = await redis.get(keyPost(input.id));
  if (!raw) return false;
  let p: Post;
  try {
    p = typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as Post);
  } catch {
    return false;
  }
  const isAdmin = !!input.adminToken && input.adminToken === process.env.BOARD_ADMIN_TOKEN;
  let ok = isAdmin;
  if (!ok && input.password) {
    const pwHash = await hashPassword(input.password);
    ok = pwHash === p.passwordHash;
  }
  if (!ok) return false;
  await redis.del(keyPost(input.id));
  await redis.zrem(KEY_LIST, String(input.id));
  return true;
}

/** 간단한 IP 기반 rate limit. 키 만료 후 재허용. */
export async function checkRateLimit(input: {
  ip: string;
  windowSec: number;
  max: number;
  scope: string;
}): Promise<{ ok: boolean; remaining: number }> {
  if (!redis) return { ok: true, remaining: input.max };
  const key = `board:rl:${input.scope}:${input.ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, input.windowSec);
  }
  const remaining = Math.max(0, input.max - count);
  return { ok: count <= input.max, remaining };
}
