import Link from "next/link";

export const metadata = {
  title: "노잼선거 소개 — 어떻게 만들었나, 어떤 자료를 쓰나",
  description:
    "노잼선거는 시민이 만든 비당파적 선거 정보 사이트입니다. 중앙선거관리위원회 공개 자료를 기반으로 2026 지방선거 후보 정보를 정리합니다.",
  alternates: { canonical: "https://nojam.kr/about" },
};

export default function AboutPage() {
  return (
    <article className="prose-invert max-w-2xl py-10">
      <Link href="/" className="text-xs text-paper/40 hover:text-neon font-mono">
        ← 메인
      </Link>

      <h1 className="text-4xl sm:text-5xl font-black tracking-tightest mt-4">
        노잼선거가 <span className="text-neon">뭐임?</span>
      </h1>

      <p className="mt-6 text-paper/80 leading-relaxed">
        2026년 6월 3일은 제9회 전국동시지방선거일입니다. 시·도지사, 시·군·구청장,
        지방의회 의원, 교육감을 한 번에 뽑습니다. 그런데 솔직히 누가 누군지 몰라요. 우리 동네
        시장이 누군지, 교육감이 뭘 하는 사람인지조차 모르고 정당만 보고 찍는 경우가 많습니다.
      </p>

      <h2 className="text-2xl font-black tracking-tightest mt-10">어떻게 만들었나요</h2>
      <ul className="mt-4 space-y-2 text-paper/80 text-sm">
        <li>· 후보 정보는 <a className="underline text-neon" href="https://info.nec.go.kr" target="_blank" rel="noreferrer">중앙선거관리위원회 선거통계시스템</a>의 후보자 명부 공개 자료(엑셀)를 그대로 인용합니다.</li>
        <li>· 학력·경력·재산·납세·병역·전과는 후보 본인이 선관위에 제출한 신고 자료입니다.</li>
        <li>· 공약은 <a className="underline text-neon" href="https://policy.nec.go.kr" target="_blank" rel="noreferrer">정책·공약마당</a>에서 별도 수집 중이며 곧 추가됩니다.</li>
        <li>· 의견·해석·점수화는 하지 않습니다. 팩트만 정리합니다.</li>
        <li>· 광주광역시 + 전라남도가 "전남광주통합특별시"로 통합되어 광역 16개로 표기됩니다.</li>
        <li>· 데이터 추출일: 2026-05-26 (선거일 D-8 기준)</li>
      </ul>

      <h2 className="text-2xl font-black tracking-tightest mt-10">사이트에 담은 / 담지 않은 선거</h2>
      <p className="mt-3 text-paper/80 leading-relaxed text-sm">
        2026 제9회 전국동시지방선거의 <strong className="text-paper">5개 선거직 6,714명</strong> 후보를 다룹니다 —
        시·도지사, 교육감, 구청장·시장·군수, 시·도의원, 구·시·군의원.
      </p>
      <p className="mt-3 text-paper/60 leading-relaxed text-sm">
        다음 선거는 본 사이트에 <strong className="text-paper/80">포함되지 않습니다</strong>:
      </p>
      <ul className="mt-2 space-y-2 text-paper/75 text-sm">
        <li>· <strong className="text-paper/90">광역의원 비례대표 · 기초의원 비례대표</strong> — 정당투표로 뽑는 선거라 후보가 아닌 정당이 단위입니다.</li>
        <li>· <strong className="text-paper/90">국회의원 재·보궐선거</strong> — 일부 지역에서 지방선거와 같이 치러지지만 별개 선거입니다.</li>
      </ul>

      <h2 className="text-2xl font-black tracking-tightest mt-10">왜 '노잼'?</h2>
      <p className="mt-3 text-paper/80 leading-relaxed">
        솔직히 정치 컨텐츠 노잼인 거 인정. 다른 사이트들이 "투표는 민주주의의 꽃!"이라고
        외칠 때 우리는 그냥 "1분만 보고 가요"라고 말합니다. 그게 통할 거라 믿어서요.
      </p>

      <h2 className="text-2xl font-black tracking-tightest mt-10">중립성</h2>
      <p className="mt-3 text-paper/80 leading-relaxed">
        본 사이트는 특정 정당·후보를 지지하거나 반대하지 않습니다. 모든 후보를 같은 양식,
        같은 분량으로 표기합니다. 후보 순서는 선관위가 부여한 기호 순입니다.
      </p>

      <h2 className="text-2xl font-black tracking-tightest mt-10">오류 신고·정정·문의</h2>
      <p className="mt-3 text-paper/80 leading-relaxed">
        후보 정보 오류, 사이트 버그, 기능 제안 등은{" "}
        <a
          className="underline text-neon"
          href="https://docs.google.com/forms/d/e/1FAIpQLSdjGx_x7QkvQvM2-GWZ7M8KrqFCRS-Crp6CAfmNav-MhWJp7g/viewform"
          target="_blank"
          rel="noreferrer"
        >
          문의 폼
        </a>
        으로 보내주세요. 선관위 공개 자료 기준으로 빠르게 검토합니다.
      </p>
    </article>
  );
}
