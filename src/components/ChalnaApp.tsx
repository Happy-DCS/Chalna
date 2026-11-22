"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Cursor from "./Cursor";
import Collection from "./views/Collection";
import Contact from "./views/Contact";
import Detail from "./views/Detail";
import Intro from "./views/Intro";
import Story from "./views/Story";
import { deviceFor, useDevice } from "@/lib/breakpoints";
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
  // PC: 화면 비율이 16:9가 아니면 남는 방향으로 스테이지를 늘려 여백 없이 채움.
  //     (본문은 가운데 2560×1440 틀에 그대로 두고 배경만 늘어난 영역까지 채움 — globals.css "PC 반응형")
  // Tablet·Mobile: 아직 전용 디자인 전이라 기존처럼 비율 유지 축소
  useLayoutEffect(() => {
    const fit = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const s = Math.min(innerWidth / STAGE_W, innerHeight / STAGE_H);
      const fluid = deviceFor(innerWidth) === "pc";
      // +2: 축소 시 반올림으로 가장자리에 1px 틈이 생기지 않도록 살짝 넘치게
      const w = fluid ? innerWidth / s + 2 : STAGE_W;
      const h = fluid ? innerHeight / s + 2 : STAGE_H;
      stage.style.width = `${w}px`;
      stage.style.height = `${h}px`;
      stage.style.setProperty("--stage-w", `${w}px`);
      stage.style.setProperty("--stage-h", `${h}px`);
      // 2560×1440 사진 레이어를 늘어난 스테이지에 꽉 채우는 배율 (object-fit: cover 와 같은 계산)
      stage.style.setProperty("--cover", String(Math.max(w / STAGE_W, h / STAGE_H)));
      stage.style.transform = `translate(-50%,-50%) scale(${s})`;
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
