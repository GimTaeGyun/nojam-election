import React from "react";

// 본문 텍스트를 안전하게 렌더링.
// - HTML 태그는 모두 escape (텍스트로 표시)
// - https URL 자동 감지:
//   - 이미지 확장자(.jpg/.jpeg/.png/.webp/.gif): <img>로 렌더
//   - 그 외: <a target="_blank" rel="noreferrer nofollow">로 렌더
// - 줄바꿈은 그대로 (white-space: pre-wrap)

const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g;
const IMG_EXT = /\.(jpg|jpeg|png|webp|gif)(\?[^\s]*)?$/i;
const ALLOWED_IMG_HOSTS_HINT = ""; // 일단 모든 https 허용 — 너무 좁히면 사용자 불편

interface Props {
  text: string;
}

interface Token {
  type: "text" | "url";
  value: string;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(URL_REGEX)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, idx) });
    }
    tokens.push({ type: "url", value: match[0] });
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }
  return tokens;
}

export function PostContent({ text }: Props) {
  const tokens = tokenize(text);
  return (
    <div
      className="text-sm sm:text-base text-paper/90 leading-relaxed"
      style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
    >
      {tokens.map((t, i) => {
        if (t.type === "text") return <React.Fragment key={i}>{t.value}</React.Fragment>;
        // https만 허용
        if (!t.value.startsWith("https://")) {
          return <React.Fragment key={i}>{t.value}</React.Fragment>;
        }
        if (IMG_EXT.test(t.value)) {
          return (
            <span key={i} className="block my-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.value}
                alt="첨부 이미지"
                className="max-w-full max-h-[500px] rounded-lg border border-paper/10"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <span className="block text-[10px] text-paper/40 font-mono mt-1 truncate">{t.value}</span>
            </span>
          );
        }
        return (
          <a
            key={i}
            href={t.value}
            target="_blank"
            rel="noreferrer nofollow"
            className="text-neon underline break-all"
          >
            {t.value}
          </a>
        );
      })}
    </div>
  );
}
