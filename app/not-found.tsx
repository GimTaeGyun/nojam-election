import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <div className="font-mono text-neon">404</div>
      <h1 className="text-4xl font-black tracking-tightest mt-3">
        없는 지역이에요
      </h1>
      <p className="text-paper/60 mt-3">
        주소 확인하시거나 메인에서 다시 골라주세요.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 border border-neon/40 text-neon px-4 py-2 rounded-md hover:bg-neon/10"
      >
        메인으로 →
      </Link>
    </section>
  );
}
