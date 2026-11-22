"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { WORKS } from "@/data/works";
import { go, workHash } from "@/lib/route";

interface Props {
  active: boolean;
  /** 보여줄 작품 인덱스 (0~4). 다른 화면으로 나가도 마지막 작품을 유지해 페이드아웃이 자연스럽습니다. */
  work: number;
  visit: number;
}

const N = WORKS.length;
const prevWork = (i: number) => (i + N - 1) % N;
const nextWork = (i: number) => (i + 1) % N;

/** 작품 상세: 왼쪽 사진 갤러리, 오른쪽 명대사 → The Story → Scent Notes (넘치면 오른쪽만 스크롤) */
export default function Detail({ active, work, visit }: Props) {
  const w = WORKS[work];
  const [slide, setSlide] = useState(0);
  const [entered, setEntered] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 작품이 바뀌거나 다시 들어올 때: 갤러리 첫 장, 텍스트 맨 위, 등장 애니메이션 재생
  const [resetFor, setResetFor] = useState({ work, visit });
  if (resetFor.work !== work || resetFor.visit !== visit) {
    setResetFor({ work, visit });
    setSlide(0);
    setEntered(false);
  }
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(raf);
  }, [work, visit]);

  // ←/→ 이전·다음 작품, Esc 컬렉션으로
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(workHash(nextWork(work)));
      if (e.key === "ArrowLeft") go(workHash(prevWork(work)));
      if (e.key === "Escape") go("collection");
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [active, work]);

  const count = w.gallery.length;
  const showSlide = (n: number) => setSlide((n + count) % count);

  const cls = ["view", active && "on", entered && "in"].filter(Boolean).join(" ");

  return (
    <section id="detail" className={cls} style={{ "--tint": w.tint } as CSSProperties} aria-label="향 상세">
      <div className="paper-tex" />
      <div className="glow" />

      {/* 본문은 2560×1440 틀 그대로 가운데 (PC에서 화면이 넓거나 높아도 배치 유지) */}
      <div className="design-frame">
        <figure className="dd-card anim">
          <img className="lace-t" src="/assets/lace-top.webp" alt="" />
          <div className="dd-photo" role="img" aria-label={`${w.ko} 사진 ${slide + 1} / ${count}`}>
            {w.gallery.map((src, k) => (
              <div
                key={src}
                className={k === slide ? "sl on" : "sl"}
                style={{ backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
            ))}
          </div>
          <button className="dd-arr prev" aria-label="이전 사진" onClick={() => showSlide(slide - 1)} />
          <button className="dd-arr next" aria-label="다음 사진" onClick={() => showSlide(slide + 1)} />
          <div className="dd-count">
            {slide + 1} / {count}
          </div>
          <img className="lace-b" src="/assets/lace-bottom.webp" alt="" />
        </figure>

        <article className="dd-text anim">
          <p className="dd-eye">
            Parts of Us<b>No{work + 1}.</b>
          </p>
          <img className={w.liftTitle ? "dd-title lift" : "dd-title"} src={w.title} alt={w.en} />
          <p className="dd-name">
            <span className="ko">{w.ko}</span>
            <span className="by">
              {w.author}, {w.year}
            </span>
          </p>
          <div className="dd-rule" />
          <div className="dd-body" ref={bodyRef}>
            <blockquote className="dd-quote">
              <p className="q">“{w.quote}”</p>
              <p className="t">{w.quoteKo}</p>
            </blockquote>
            <section className="dd-sec">
              <p className="dd-lbl">The Story</p>
              <p className="dd-theme">{w.sub}</p>
              <p className="dd-story">{w.story}</p>
            </section>
            <section className="dd-sec">
              <p className="dd-lbl">Scent Notes</p>
              <ul className="dd-notes">
                {(["Top", "Middle", "Base"] as const).map((label, k) => (
                  <li key={label}>
                    <b>{label}</b>
                    <span>{w.notes[k].join("  ·  ")}</span>
                  </li>
                ))}
              </ul>
              <p className="dd-story" id="ddDesc">
                {w.scentStory}
              </p>
            </section>
          </div>
        </article>

        <button className="dd-back" onClick={() => go("collection")}>
          <span>컬렉션으로 돌아가기</span>
        </button>

        <div className="dd-nav">
          <button onClick={() => go(workHash(prevWork(work)))}>Previous</button>
          <div className="dd-dots">
            {WORKS.map((other, k) => (
              <button
                key={other.en}
                aria-label={other.ko}
                className={k === work ? "act" : undefined}
                onClick={() => go(workHash(k))}
              />
            ))}
          </div>
          <button onClick={() => go(workHash(nextWork(work)))}>Next</button>
        </div>
      </div>
    </section>
  );
}
