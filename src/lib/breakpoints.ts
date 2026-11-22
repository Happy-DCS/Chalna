import { useSyncExternalStore } from "react";

/**
 * 반응형 브레이크 포인트 (뷰포트 너비 기준, CSS px)
 *
 *   Mobile   0 ~ 767      휴대폰 (세로·가로)
 *   Tablet   768 ~ 1279   iPad 세로(768~834) · 가로(1024~1194)
 *   PC       1280 ~       노트북·데스크톱 (디자이너 시안 기준 화면)
 *
 * CSS에서는 <html data-device="mobile|tablet|pc"> 속성으로 분기합니다.
 *   html[data-device="tablet"] .menu { ... }
 * 미디어 쿼리가 꼭 필요하면 아래 MEDIA 값과 같은 숫자를 쓰세요.
 */
export type Device = "mobile" | "tablet" | "pc";

export const BREAKPOINTS = {
  /** 이 너비부터 Tablet */
  tablet: 768,
  /** 이 너비부터 PC */
  pc: 1280,
} as const;

export const MEDIA: Record<Device, string> = {
  mobile: `(max-width: ${BREAKPOINTS.tablet - 0.02}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.pc - 0.02}px)`,
  pc: `(min-width: ${BREAKPOINTS.pc}px)`,
};

export function deviceFor(width: number): Device {
  if (width >= BREAKPOINTS.pc) return "pc";
  if (width >= BREAKPOINTS.tablet) return "tablet";
  return "mobile";
}

function subscribe(onChange: () => void) {
  const queries = Object.values(MEDIA).map((q) => matchMedia(q));
  queries.forEach((mq) => mq.addEventListener("change", onChange));
  return () => queries.forEach((mq) => mq.removeEventListener("change", onChange));
}

/** 현재 기기 구분. 서버 렌더 중에는 알 수 없으므로 null. */
export function useDevice(): Device | null {
  return useSyncExternalStore(
    subscribe,
    () => deviceFor(innerWidth),
    () => null,
  );
}
