// "왜 노잼선거?" 섹션 - 사이트 정체성 설명
export function WhyNojam() {
  const points = [
    {
      k: "01",
      t: "당명만 보고 찍는 거 그만",
      d: "지방선거 1번이 다 같은 1번이 아닙니다. 후보 한 명 한 명이 4년을 결정해요.",
    },
    {
      k: "02",
      t: "팩트만, 깔끔하게",
      d: "선관위 공개자료(공약·전과·재산·납세)만 정리합니다. 의견·해석 없음.",
    },
    {
      k: "03",
      t: "30초 룰",
      d: "후보 1명당 30초면 파악 끝. 길게 안 읽혀도 핵심은 들어와야 한다는 원칙.",
    },
    {
      k: "04",
      t: "친구한테 보낼 만한 카드",
      d: "후보 비교 카드를 캡쳐 한 장이면 카톡·인스타에 그대로 공유 가능.",
    },
  ];

  return (
    <section className="py-12 border-t border-paper/10">
      <h2 className="text-2xl sm:text-3xl font-black tracking-tightest mb-8">
        왜 <span className="text-neon">노잼선거?</span>
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {points.map((p) => (
          <div key={p.k} className="border border-paper/10 rounded-lg p-5">
            <div className="font-mono text-xs text-neon/60">{p.k}</div>
            <div className="text-lg font-bold tracking-tight mt-1">{p.t}</div>
            <p className="text-sm text-paper/60 mt-2 leading-relaxed">{p.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
