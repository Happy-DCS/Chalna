"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import Gnb from "@/components/Gnb";
import Logo from "@/components/Logo";
import { WORKS } from "@/data/works";
import { jumpToTop, resetReveal, revealIn } from "@/lib/reveal";
import type { ViewId } from "@/lib/route";

/** 한 번 넘긴 뒤 다음 입력을 받기까지 잠그는 시간 */
const PAGE_LOCK_MS = 950;
/** 휠 누적량이 이 값을 넘으면 한 페이지 넘김 */
const WHEEL_STEP = 25;
/** 터치 스와이프 최소 거리 */
const SWIPE_MIN = 40;

/** 03 The Archive 부채: [작품 인덱스, 회전, x, y]. 각 작품 갤러리의 마지막 장(일러스트)을 씁니다. */
const FAN: [number, string, string, string][] = [
  [4, "-14deg", "-250px", "50px"],
  [1, "-7deg", "-125px", "14px"],
  [3, "7deg", "125px", "14px"],
  [2, "14deg", "250px", "50px"],
  [0, "0deg", "0px", "0px"],
];
const illust = (i: number) => WORKS[i].gallery[WORKS[i].gallery.length - 1];

interface Props {
  active: boolean;
  visit: number;
  view: ViewId | null;
}

/** 브랜드 스토리 6페이지. 휠·키보드·터치로 한 번에 한 화면씩 넘깁니다. */
export default function Story({ active, visit, view }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  const onScroll = useCallback(() => {
    const sc = scrollRef.current;
    if (!sc) return;
    const max = sc.scrollHeight - sc.clientHeight;
    if (barRef.current) barRef.current.style.height = `${max > 0 ? (sc.scrollTop / max) * 100 : 0}%`;
    revealIn(sc, 0.88);
  }, []);

  // 들어올 때마다 첫 페이지부터
  useEffect(() => {
    const sc = scrollRef.current;
    if (!active || !sc) return;
    jumpToTop(sc);
    resetReveal(sc);
    onScroll();
  }, [active, visit, onScroll]);

  // 페이지 넘김 (wheel/touchmove 는 preventDefault 가 필요해서 passive:false 로 직접 등록)
  useEffect(() => {
    const sc = scrollRef.current;
    if (!active || !sc) return;

    let lock = false;
    let acc = 0;
    let touchY: number | null = null;
    let unlockT = 0;

    const pageCount = () => sc.querySelectorAll(".s-sec").length;
    const curPage = () => Math.round(sc.scrollTop / sc.clientHeight);
    const turn = (d: 1 | -1) => {
      const n = Math.max(0, Math.min(pageCount() - 1, curPage() + d));
      if (n === curPage()) return;
      lock = true;
      sc.scrollTo({ top: n * sc.clientHeight, behavior: "smooth" });
      unlockT = window.setTimeout(() => {
        lock = false;
        acc = 0;
      }, PAGE_LOCK_MS);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (lock) return;
      acc += e.deltaY;
      if (Math.abs(acc) > WHEEL_STEP) {
        turn(acc > 0 ? 1 : -1);
        acc = 0;
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => e.preventDefault();
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY === null || lock) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > SWIPE_MIN) turn(dy > 0 ? 1 : -1);
      touchY = null;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        if (!lock) turn(1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        if (!lock) turn(-1);
      }
    };

    sc.addEventListener("wheel", onWheel, { passive: false });
    sc.addEventListener("touchstart", onTouchStart, { passive: true });
    sc.addEventListener("touchmove", onTouchMove, { passive: false });
    sc.addEventListener("touchend", onTouchEnd);
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(unlockT);
      sc.removeEventListener("wheel", onWheel);
      sc.removeEventListener("touchstart", onTouchStart);
      sc.removeEventListener("touchmove", onTouchMove);
      sc.removeEventListener("touchend", onTouchEnd);
      removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <section id="story" className={active ? "view on" : "view"} aria-label="브랜드 스토리">
      <Gnb view={view} />
      <div className="s-bar">
        <i ref={barRef} />
      </div>
      <div className="s-scroll" ref={scrollRef} onScroll={onScroll}>
        <section className="s-sec st-hero st-hero2">
          <div className="st-kv st-kv2" />
          <div className="st-shade2" />
          <div className="txt">
            <p className="st-eye rv">Brand Story</p>
            <h2 className="st-h rv d1">
              읽은 이야기가
              <br />
              <em>삶의 태도</em>로 이어지도록
            </h2>
            <p className="st-script rv d2">Let the story you read become the way you live.</p>
            <p className="st-p rv d3">
              Chalná는 독자가 문학을 통해 발견한 가치를 삶에서 간직할 수 있도록 돕는 향 브랜드입니다.
            </p>
          </div>
          <div className="st-cue">
            Scroll
            <i />
          </div>
        </section>

        <section className="s-sec st-begin st-why">
          <div className="st-glow" />
          <div className="txt">
            <p className="st-eye rv">
              <span className="st-num">01</span>What we found
            </p>
            <h3 className="st-h rv d1">
              책을 덮는 순간,
              <br />
              이야기는 빠르게 옅어집니다
            </h3>
            <p className="st-p rv d2">
              문학은 삶을 흔들지만, 일상은 그 흔들림을 빠르게 덮어버립니다.
              <br />
              작품에서 얻은 질문과 다짐을 다시 떠올릴 계기는 삶 속에 없고,
              <br />
              문학 굿즈는 작품을 기념할 뿐 독자가 발견한 의미를 이어가게 하지는 않습니다.
            </p>
            <p className="st-claim rv d3">
              문제는 독서의 부족이 아니라,
              <br />
              <em>독서 경험의 소실</em>입니다.
            </p>
          </div>
          <figure className="st-card rv d2">
            <div className="st-img" style={{ backgroundImage: 'url("/assets/story-found.jpg")' }} />
          </figure>
        </section>

        <section className="s-sec st-begin st-why st-sol">
          <figure className="st-card rv d2">
            <div className="st-img" style={{ backgroundImage: 'url("/assets/story-answer.jpg")' }} />
          </figure>
          <div className="txt">
            <p className="st-eye rv">
              <span className="st-num">02</span>How we answer
            </p>
            <h3 className="st-h rv d1">
              이야기가 남긴 울림을,
              <br />
              향으로 기억합니다
            </h3>
            <p className="st-p rv d2">
              향은 기억과 가장 가까운 감각입니다. Chalná는 한 편의 문학을 하나의 향으로 옮깁니다.
              <br />
              작품을 깊이 읽고, Top · Middle · Base를 따라 이야기의 흐름이 펼쳐지도록 직접 조향합니다.
            </p>
            <p className="st-claim rv d3">
              설명이 아니라 향으로,
              <br />책 밖의 하루에서 <em>이야기를 다시 만납니다.</em>
            </p>
          </div>
        </section>

        <section className="s-sec st-arch">
          <div className="st-fan rv">
            {FAN.map(([wi, r, x, y]) => (
              <div key={wi} className="c" style={{ "--r": r, "--x": x, "--y": y } as CSSProperties}>
                <div className="st-img" style={{ backgroundImage: `url("${illust(wi)}")` }} />
              </div>
            ))}
          </div>
          <div className="txt">
            <p className="st-eye rv">
              <span className="st-num">03</span>The Archive
            </p>
            <h3 className="st-h rv d1">
              한 권의 책처럼,
              <br />
              책장에 간직합니다
            </h3>
            <p className="st-p rv d2">
              향은 책의 형태를 닮은 아카이브 패키지에 담깁니다. 나에게 쓰는 편지와 질문 카드, 포스터를 함께 넣어 책장에
              꽂아 두면, 언제든 다시 꺼내 그때의 질문과 다짐을 기억할 수 있습니다.
            </p>
            <ul className="rv d3">
              <li>
                <span>책 형태의 개별 아카이브 패키지</span>
                <i>Book-shaped Case</i>
              </li>
              <li>
                <span>나에게 쓰는 편지지</span>
                <i>Letter</i>
              </li>
              <li>
                <span>작품을 그린 포스터</span>
                <i>Poster</i>
              </li>
              <li>
                <span>각 소설을 관통하는 질문 카드</span>
                <i>Question Card</i>
              </li>
            </ul>
          </div>
        </section>

        <section className="s-sec st-end">
          <p className="st-eye rv">
            <span className="st-num">04</span>What we pursue
          </p>
          <h3 className="st-h st-next rv d1">책과 함께 살아가는 사람들을 위해</h3>
          <p className="st-p st-nextp rv d2">
            우리는 책을 읽는 사람보다, 읽은 책과 함께 살아가는 사람을 생각합니다.
            <br />
            한 권의 이야기가 남긴 질문을 오래 품고, 그 안에서 얻은 다짐을 하루의 선택으로 옮기는 사람들입니다.
          </p>
          <p className="st-p st-nextp rv d2">
            Chalná는 앞으로도 책이 건네는 가치와 도전, 그리고 그 다짐과 함께 살아가는 사람들을 위해 나아가겠습니다.
            <br />
            해석은 건네되 정답은 정하지 않고, 각자가 발견한 의미가 오래 머물 수 있도록.
          </p>
          <div className="st-promise rv d3">
            <div>
              <p className="w">Lasting</p>
              <p className="k">빠르게 옅어지는 감동이 아니라, 오래 머무는 울림으로</p>
            </div>
            <div>
              <p className="w">Remembered</p>
              <p className="k">잊히는 문장이 아니라, 향으로 다시 떠오르는 기억으로</p>
            </div>
            <div>
              <p className="w">Lived</p>
              <p className="k">소장하는 책이 아니라, 함께 살아가는 이야기로</p>
            </div>
          </div>
        </section>

        <section className="s-sec st-end st-fin">
          <div className="mark rv">
            <Logo />
          </div>
          <p className="st-line rv d1">읽은 이야기가 삶의 태도로 이어지도록</p>
          <a href="#collection" className="st-cta rv d2">
            <span>컬렉션 보기</span>
          </a>
          <div className="st-foot">
            <span>© 2026 Chalná</span>
            <span>Literature × Scent</span>
          </div>
        </section>
      </div>
    </section>
  );
}
