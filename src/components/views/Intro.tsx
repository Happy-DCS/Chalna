"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { go } from "@/lib/route";
import { jumpToTop, resetReveal, revealIn } from "@/lib/reveal";

/**
 * 봉투가 열리는 단계.
 * 0 닫힘 → 1 덮개 열림(open) → 2 덮개가 뒤로(flap-back) → 3 편지지 올라옴(lift) → 4 스크롤 편지(reading)
 */
type Phase = 0 | 1 | 2 | 3 | 4;
const PHASE_AT: [Phase, number][] = [
  [2, 480],
  [3, 900],
  [4, 2300],
];

interface Props {
  active: boolean;
  /** 이 화면으로 들어올 때마다 바뀌는 값. 바뀌면 봉투를 닫힌 상태로 되돌립니다. */
  visit: number;
}

export default function Intro({ active, visit }: Props) {
  const [phase, setPhase] = useState<Phase>(0);
  const readerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const handedOff = useRef(false);

  // 첫 화면 진입(1분 대기 복귀 포함) 시 봉투를 닫힌 상태로
  const [resetFor, setResetFor] = useState(visit);
  if (active && resetFor !== visit) {
    setResetFor(visit);
    setPhase(0);
  }
  useEffect(() => {
    if (!active) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    handedOff.current = false;
    const reader = readerRef.current;
    if (reader) {
      jumpToTop(reader);
      resetReveal(reader);
    }
  }, [active, visit]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const openLetter = useCallback(() => {
    if (phase !== 0) return;
    setPhase(1);
    timers.current = PHASE_AT.map(([p, ms]) => window.setTimeout(() => setPhase(p), ms));
  }, [phase]);

  const onReadScroll = useCallback(() => {
    const reader = readerRef.current;
    if (!reader) return;
    revealIn(reader, 0.9);
    // 편지 끝의 메인 미리보기까지 다 내려오면 컬렉션으로 이어짐
    const max = reader.scrollHeight - reader.clientHeight;
    if (phase === 4 && max > 0 && reader.scrollTop >= max - 4 && !handedOff.current) {
      handedOff.current = true;
      go("collection");
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 4) onReadScroll();
  }, [phase, onReadScroll]);

  const introCls = ["view", active && "on", phase >= 1 && "opening", phase >= 4 && "reading"]
    .filter(Boolean)
    .join(" ");
  const envCls = ["envelope", phase >= 1 && "open", phase >= 2 && "flap-back", phase >= 3 && "lift"]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="intro" className={introCls} aria-label="레이스 엽서">
      <div className="paper-tex" />
      <div className="fold" />
      <div className="env-stage">
        <div
          className={envCls}
          role="button"
          tabIndex={0}
          aria-label="엽서 열기"
          onClick={openLetter}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLetter();
            }
          }}
        >
          <img className="env-back" src="/assets/envelope-back.webp" alt="" />
          <div className="env-top">
            <img src="/assets/envelope-back.webp" alt="" />
          </div>
          <div className="env-letter">
            <div className="b">Chalná’s First Collection</div>
            <div className="k">Parts of Us</div>
            <div className="t">A Story Awaits You.</div>
            <div className="s">Some stories stay with us long after the final page.</div>
          </div>
          <img className="env-front" src="/assets/envelope-front.webp" alt="" />
          <div className="env-flap">
            <img src="/assets/envelope-flap.webp" alt="" />
          </div>
          <div className="pearl">
            <img src="/assets/pearl.webp" alt="" />
          </div>
        </div>
        <div className="lt-cap">
          <p className="en">A letter, before the scent.</p>
          <p className="ko">엽서를 눌러 열어보세요</p>
        </div>
      </div>

      <div className="reader" ref={readerRef} onScroll={onReadScroll}>
        <article className="paper">
          <img className="lace-top" src="/assets/lace-top.webp" alt="" />
          <div className="p-body">
            <p className="dear rv">Dear reader,</p>
            <p className="rv">
              우리는 저마다 다른 이야기를 살아갑니다. 때로는 자신을 찾아 헤매고, 무언가를 끝까지 지키려 애쓰며, 누군가를
              이해하는 법을 배웁니다.
            </p>
            <p className="rv">서로 다른 시대와 인물을 담은 다섯 편의 문학은 우리에게 삶의 다양한 가치를 이야기합니다.</p>
            <p className="rv">
              자기 발견과 성장, 인내와 존엄, 편견을 넘어선 이해, 욕망 속에서도 잃지 말아야 할 인간성, 그리고 기다림 속에서
              마주하는 현재.
            </p>
            <p className="rv">이 이야기들은 낯선 누군가의 삶을 비추는 동시에, 우리 자신의 모습을 돌아보게 합니다.</p>
            <p className="rv">
              <b>PARTS OF US</b>는 다섯 편의 고전문학에서 발견한 가치를 다섯 가지 향으로 기억하는 컬렉션입니다.
            </p>
            <p className="rv">
              책의 마지막 페이지를 덮은 뒤에도, 그 안에서 발견한 가치들이 우리 안에 오래도록 머물러 삶의 일부가 되기를
              바랍니다.
            </p>
          </div>
          <div className="p-q rv">
            <p className="en">
              What do we discover in stories,
              <br />
              and what stays with us?
            </p>
            <p className="ko">
              우리는 이야기 속에서 무엇을 발견하고,
              <br />
              무엇을 마음에 남길까요?
            </p>
          </div>
          <div className="p-sign rv">
            <p className="w">with love,</p>
            <Logo />
          </div>
          <img className="lace-bot" src="/assets/lace-bottom.webp" alt="" />
        </article>
        <div className="to-col">
          <p className="en">Scroll to the collection</p>
          <p className="ko">컬렉션 보기</p>
          <i />
        </div>
        {/* 메인 화보 미리보기. 위쪽은 .veil 이 인트로 배경으로 흐릿하게 녹여 경계선이 보이지 않게 합니다. */}
        <div className="to-kv">
          <img src="/assets/main.jpg" alt="" />
          <div className="veil" />
        </div>
      </div>
    </section>
  );
}
