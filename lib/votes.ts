import { Redis } from "@upstash/redis";

/**
 * Upstash Redis 클라이언트.
 * Vercel KV / Upstash Redis 모두 동일 API.
 *
 * 환경변수: KV_REST_API_URL, KV_REST_API_TOKEN
 *  - Vercel KV 생성 시 자동 주입 (Vercel 환경에서)
 *  - 로컬: .env.local 에 두 값 복사 필요
 *
 * Upstash 직접 통합인 경우 환경변수가 UPSTASH_REDIS_REST_URL 형태일 수 있음 — 그건 자동 검사.
 */
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

export const redis = url && token
  ? new Redis({ url, token })
  : null;

export const VOTE_KEYS = {
  fun: "vote:fun",
  nojam: "vote:nojam",
} as const;

export type VoteKind = "fun" | "nojam";

export interface VoteCounts {
  fun: number;
  nojam: number;
}

export async function getCounts(): Promise<VoteCounts> {
  if (!redis) return { fun: 0, nojam: 0 };
  const [fun, nojam] = await redis.mget<[number | null, number | null]>(
    VOTE_KEYS.fun,
    VOTE_KEYS.nojam,
  );
  return { fun: Number(fun) || 0, nojam: Number(nojam) || 0 };
}

export async function incrementVote(kind: VoteKind): Promise<VoteCounts> {
  if (!redis) {
    return { fun: 0, nojam: 0 };
  }
  await redis.incr(VOTE_KEYS[kind]);
  return getCounts();
}
