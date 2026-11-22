"use client";

import { useState, type CSSProperties } from "react";
import Gnb from "@/components/Gnb";
import { WORKS } from "@/data/works";
import { go, workHash, type ViewId } from "@/lib/route";

/** 핫스팟은 병 박스보다 사방으로 이만큼 큼 */
const HOT_PAD = 30;
/** 원형 마스크 반지름 = 병 박스 긴 변의 절반 + 이 값 */
const MASK_PAD = 180;

interface Props {
  active: boolean;
  visit: number;
  view: ViewId | null;
}

/** 컬렉션 메인(키비주얼). 병 위에 호버하면 나머지 영역이 크림색으로 덮이고 작품 정보가 뜹니다. */
export default function Collection({ active, visit, view }: Props) {
  /** 현재 호버/포커스된 작품 (-1 = 없음) */
  const [focused, setFocused] = useState(-1);
  /** 마지막으로 보인 작품. 호버가 풀려도 마스크가 그 자리에서 사라지도록 유지합니다. */
  const [shown, setShown] = useState(0);

  // 라우팅이 일어날 때마다 호버 상태 초기화
  const [resetFor, setResetFor] = useState(visit);
  if (resetFor !== visit) {
    setResetFor(visit);
    setFocused(-1);
  }

  const focusOn = (i: number) => {
    setFocused(i);
    if (i >= 0) setShown(i);
  };

  const w = WORKS[shown];
  const [x, y, bw, bh] = w.box;
  const maskVars = {
    "--fx": `${x + bw / 2}px`,
    "--fy": `${y + bh / 2}px`,
    "--fr": `${Math.max(bw, bh) / 2 + MASK_PAD}px`,
  } as CSSProperties;

  const cls = ["view", active && "on", focused >= 0 && "focusing"].filter(Boolean).join(" ");

  return (
    <section id="main" className={cls} style={maskVars} aria-label="컬렉션 화보">
      <Gnb view={view} />
      {/* 사진과 핫스팟·덮개는 같은 2560×1440 좌표계여야 하므로 .kv-fit 레이어 두 장을 같은 배율로 화면에 꽉 채움 */}
      <div className="kv">
        <div className="kv-fit">
          <img src="/assets/main.jpg" alt="컬렉션 5종 화보" />
        </div>
      </div>
      <div className="kv-fit kv-ui">
        <div className="dim" />
        <div onMouseLeave={() => focusOn(-1)}>
          {WORKS.map((work, i) => {
            const [bx, by, bwi, bhi] = work.box;
            return (
              <button
                key={work.en}
                className="hot"
                aria-label={`${work.ko} 상세 보기`}
                style={{
                  left: bx - HOT_PAD,
                  top: by - HOT_PAD,
                  width: bwi + HOT_PAD * 2,
                  height: bhi + HOT_PAD * 2,
                }}
                onMouseEnter={() => focusOn(i)}
                onFocus={() => focusOn(i)}
                onClick={() => go(workHash(i))}
              />
            );
          })}
        </div>
      </div>
      <div className="info" aria-live="polite">
        <img className="t" src={w.title} alt={w.en} />
        <div className="e">{w.ko}</div>
        <div className="m">
          {w.author}, {w.year}
        </div>
      </div>

      <div className="main-copy">
        <h1>Parts of Us</h1>
        <p>서로 다른 이야기, 그 안에서 마주한 우리</p>
      </div>

      <div className="index-list" onMouseLeave={() => focusOn(-1)}>
        {WORKS.map((work, i) => (
          <button
            key={work.en}
            className={focused === i ? "act" : undefined}
            onMouseEnter={() => focusOn(i)}
            onFocus={() => focusOn(i)}
            onClick={() => go(workHash(i))}
          >
            <span className="t">{work.en}</span>
            <span className="n">No{i + 1}.</span>
          </button>
        ))}
      </div>
    </section>
  );
}
