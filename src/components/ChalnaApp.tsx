"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Cursor from "./Cursor";
import Collection from "./views/Collection";
import Contact from "./views/Contact";
import Detail from "./views/Detail";
import Intro from "./views/Intro";
import Story from "./views/Story";
import { useDevice } from "@/lib/breakpoints";
import { parseHash, VIEW_BG, type Route } from "@/lib/route";

/** 디자인 기준 스테이지 크기. 모든 CSS 수치는 이 크기 기준 px입니다. */
const STAGE_W = 2560;
const STAGE_H = 1440;
/** 입력이 없으면 첫 화면(봉투)으로 돌아가는 시간 — 전시 키오스크용 */
const IDLE_MS = 60_000;
const IDLE_EVENTS = ["mousemove", "mousedown", "wheel", "keydown", "touchstart", "touchmove"] as const;

interface Nav {
  route: Route;
  /** 라우팅이 일어날 때마다 1씩 증가. 같은 화면으로 다시 들어와도 각 화면이 초기화할 수 있게 합니다. */
  visit: number;
}

export default function ChalnaApp() {
  const stageRef = useRef<HTMLDivElement>(null);
  // 서버 렌더에서는 해시를 알 수 없으므로, 마운트 후 첫 라우팅 전까지는 어느 화면도 켜지 않습니다.
  const [nav, setNav] = useState<Nav | null>(null);
  const [lastWork, setLastWork] = useState(0);
  const device = useDevice();

  // CSS 분기용: <html data-device="mobile|tablet|pc">
  useEffect(() => {
    if (device) document.documentElement.dataset.device = device;
  }, [device]);

  // 2560×1440 스테이지를 화면에 맞춰 통째로 확대·축소
  useLayoutEffect(() => {
    const fit = () => {
      const s = Math.min(innerWidth / STAGE_W, innerHeight / STAGE_H);
      if (stageRef.current) stageRef.current.style.transform = `translate(-50%,-50%) scale(${s})`;
    };
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  // 해시 라우팅
  useEffect(() => {
    const route = () => {
      const r = parseHash(location.hash);
      if (r.view === "detail") setLastWork(r.work);
      setNav((prev) => ({ route: r, visit: (prev?.visit ?? 0) + 1 }));
    };
    route();
    addEventListener("hashchange", route);

    // 1분 동안 입력이 없으면 첫 화면으로 (replaceState는 hashchange를 일으키지 않으므로 직접 route)
    let idleT = 0;
    const goHome = () => {
      history.replaceState(null, "", "#intro");
      route();
    };
    const resetIdle = () => {
      clearTimeout(idleT);
      idleT = window.setTimeout(goHome, IDLE_MS);
    };
    IDLE_EVENTS.forEach((ev) => addEventListener(ev, resetIdle, { passive: true }));
    resetIdle();

    return () => {
      removeEventListener("hashchange", route);
      IDLE_EVENTS.forEach((ev) => removeEventListener(ev, resetIdle));
      clearTimeout(idleT);
    };
  }, []);

  const view = nav?.route.view ?? null;
  const visit = nav?.visit ?? 0;

  // 스테이지 바깥 여백 색을 화면에 맞춤
  useEffect(() => {
    const bg = view ? VIEW_BG[view] : "#0b0a09";
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
  }, [view]);

  return (
    <>
      <div id="viewport">
        <div id="stage" ref={stageRef}>
          <Intro active={view === "intro"} visit={visit} />
          <Collection active={view === "main"} visit={visit} view={view} />
          <Detail active={view === "detail"} work={lastWork} visit={visit} />
          <Story active={view === "story"} visit={visit} view={view} />
          <Contact active={view === "contact"} view={view} />
        </div>
      </div>
      <Cursor />
    </>
  );
}
