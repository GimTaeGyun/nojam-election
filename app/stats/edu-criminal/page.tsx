import { redirect } from "next/navigation";

// 옛 URL — 통합 페이지로 redirect (탭은 hash로 전환되니 서버에선 base만)
export default function EduCriminalRedirect() {
  redirect("/stats/parties");
}
