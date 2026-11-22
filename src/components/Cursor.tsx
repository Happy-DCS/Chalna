"use client";

import { useEffect, useRef } from "react";

/** 레이스 화살표 커스텀 커서. 화살표 끝이 실제 클릭 지점입니다. (터치 기기에서는 CSS로 숨김) */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    addEventListener("mousemove", onMove);
    return () => removeEventListener("mousemove", onMove);
  }, []);

  return <div id="cursor" ref={ref} aria-hidden="true" />;
}
