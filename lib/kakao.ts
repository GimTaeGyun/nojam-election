/**
 * 카카오톡 공유 헬퍼.
 * KakaoScript 가 layout.tsx 에 마운트돼 있어야 작동.
 */

export interface KakaoShareInput {
  title: string;
  description?: string;
  imageUrl?: string;
  url: string;
}

export function isKakaoReady(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.Kakao && window.Kakao.isInitialized?.());
}

export function shareToKakao(input: KakaoShareInput): boolean {
  if (!isKakaoReady()) {
    return false;
  }
  try {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: input.title,
        description: input.description ?? "정치 노잼인 거 아는데, 5분만.",
        imageUrl: input.imageUrl ?? "https://nojam.kr/opengraph-image",
        link: {
          mobileWebUrl: input.url,
          webUrl: input.url,
        },
      },
      buttons: [
        {
          title: "노잼선거 보러가기",
          link: {
            mobileWebUrl: input.url,
            webUrl: input.url,
          },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}
