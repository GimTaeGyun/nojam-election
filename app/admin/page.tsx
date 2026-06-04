import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { AdminLoginForm, AdminLogoutButton } from "@/components/AdminAuth";

export const metadata = {
  title: "관리자 — 노잼선거",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const admin = isAdmin();

  return (
    <article className="py-12 max-w-md">
      <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
        ← 메인
      </Link>

      <h1 className="text-2xl sm:text-3xl font-black tracking-tightest mt-3">
        관리자
      </h1>
      <p className="text-xs text-paper/50 mt-2 leading-relaxed">
        선거 종료 후 후보 정보는 데모(마스킹) 모드로 노출됩니다. 관리자 로그인 시 원본 데이터 표시.
      </p>

      <div className="mt-8">
        {admin ? (
          <div className="border border-neon/40 bg-neon/[0.04] rounded-lg p-4">
            <div className="text-xs font-mono text-neon/80 mb-1">현재 상태</div>
            <div className="text-lg font-black tracking-tightest">
              👁 관리자 모드 활성
            </div>
            <div className="text-xs text-paper/60 mt-2 leading-relaxed">
              모든 페이지에서 원본 데이터가 표시됩니다. 다른 사람과 화면 공유 시 주의.
            </div>
            <div className="mt-4">
              <AdminLogoutButton />
            </div>
          </div>
        ) : (
          <div className="border border-paper/15 rounded-lg p-4">
            <div className="text-xs font-mono text-paper/60 mb-1">현재 상태</div>
            <div className="text-lg font-black tracking-tightest">
              데모 모드
            </div>
            <div className="text-xs text-paper/60 mt-2 leading-relaxed">
              비밀번호를 입력하면 원본 데이터 모드로 전환됩니다.
            </div>
            <div className="mt-4">
              <AdminLoginForm />
            </div>
          </div>
        )}
      </div>

      <div className="text-[11px] text-paper/40 mt-8 leading-relaxed">
        ※ 비밀번호 무차별 대입 방지: IP당 5분에 5회 시도까지.
        쿠키 유효기간 7일.
      </div>
    </article>
  );
}
