import { IS_SAMPLE_DATA } from "@/data/candidates";

export function Disclaimer() {
  if (!IS_SAMPLE_DATA) return null;
  return (
    <div className="border border-neon/40 bg-neon/[0.06] text-neon/90 text-xs px-3 py-2 rounded-md">
      <strong className="font-semibold">⚠︎ 시연용 샘플 데이터</strong>
      <span className="opacity-80">
        {" "}
        — 현재 표시되는 후보 정보는 UI 데모용 가상 데이터입니다. 실제 후보 정보는 후보 등록 마감 이후
        <a className="underline ml-1" href="https://info.nec.go.kr" target="_blank" rel="noreferrer">
          중앙선관위 공식 자료
        </a>
        로 교체됩니다.
      </span>
    </div>
  );
}
