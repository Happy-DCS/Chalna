/**
 * 스크롤 컨테이너 안의 .rv 요소 중 화면 아래 기준선(ratio)을 넘은 것에 .seen 을 붙입니다.
 * .rv/.seen 은 원본 시안의 등장 애니메이션 클래스입니다. React가 className을 다시 쓰지 않는
 * 정적 요소에만 쓰므로 classList를 직접 다룹니다.
 */
export function revealIn(scroller: HTMLElement, ratio: number) {
  const line = scroller.scrollTop + scroller.clientHeight * ratio;
  scroller.querySelectorAll<HTMLElement>(".rv:not(.seen)").forEach((el) => {
    let top = 0;
    let n: HTMLElement | null = el;
    while (n && n !== scroller) {
      top += n.offsetTop;
      n = n.offsetParent as HTMLElement | null;
    }
    if (top < line) el.classList.add("seen");
  });
}

export function resetReveal(scroller: HTMLElement) {
  scroller.querySelectorAll(".rv.seen").forEach((el) => el.classList.remove("seen"));
}

/** smooth 스크롤 설정과 상관없이 즉시 맨 위로 */
export function jumpToTop(scroller: HTMLElement) {
  scroller.style.scrollBehavior = "auto";
  scroller.scrollTop = 0;
  scroller.style.scrollBehavior = "";
}
