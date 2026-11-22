import { WORKS } from "@/data/works";

/** 화면 섹션 id (원본 시안의 .view id와 동일) */
export type ViewId = "intro" | "main" | "detail" | "story" | "contact";

export type Route =
  | { view: "intro" | "main" | "story" | "contact" }
  | { view: "detail"; work: number };

/** location.hash → 화면. #work-N 이 아니거나 알 수 없는 해시는 첫 화면(intro). */
export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, "");
  const m = h.match(/^work-(\d)$/);
  if (m) {
    const i = Number(m[1]) - 1;
    if (WORKS[i]) return { view: "detail", work: i };
  }
  if (h === "collection") return { view: "main" };
  if (h === "story") return { view: "story" };
  if (h === "contact") return { view: "contact" };
  return { view: "intro" };
}

export const workHash = (i: number) => `work-${i + 1}`;

export function go(hash: string) {
  location.hash = hash;
}

/** 화면별 html/body 배경색 (스테이지 바깥 여백 색) */
export const VIEW_BG: Record<ViewId, string> = {
  intro: "#0f0a05",
  main: "#dcd8d2",
  detail: "#0f0a05",
  story: "#15120f",
  contact: "#0f0a05",
};
