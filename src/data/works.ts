/**
 * Parts of Us 작품 데이터 (원본 시안의 WORKS 배열).
 * 기획 단계 필드(scent, theme, kw, obj, objEn, flw, flwEn)는 화면에서 쓰지 않아 제거했습니다.
 * 오브제·꽃 정보는 표시하지 않기로 확정된 사항입니다 (docs/HANDOFF.md §5).
 */

/** 메인 키비주얼(2560×1440) 안에서 병의 위치 [x, y, w, h] (px) */
export type Box = readonly [x: number, y: number, w: number, h: number];

export interface Work {
  ko: string;
  en: string;
  author: string;
  year: string;
  /** 작품별 대표색 (상세 --tint) */
  tint: string;
  box: Box;
  quote: string;
  quoteKo: string;
  /** The Story 소제목 */
  sub: string;
  story: string;
  /** [Top, Middle, Base] */
  notes: readonly [readonly string[], readonly string[], readonly string[]];
  scentStory: string;
  /** 작품명 레터링 이미지 (Figma 제작) */
  title: string;
  /** 어두운 레터링이라 상세 화면에서 밝기 보정이 필요한지 (.lift) */
  liftTitle: boolean;
  /**
   * 상세 갤러리 순서: 트레이 위 향수(0N-1) → 향수 단독컷(0N-3) → 모델 컷 → 일러스트(0N-2).
   * 브랜드 스토리 03의 부채가 마지막 장(일러스트)을 가져다 쓰므로 일러스트는 항상 마지막에 둡니다.
   */
  gallery: readonly string[];
}

const detail = (n: number, order: readonly number[]) =>
  order.map((k) => `/assets/detail/0${n}-${k}.jpg`);

// ⚠️ box 좌표는 이전 main.jpg 기준입니다. 새 은쟁반 사진에 맞춰 다시 재야 합니다 (HANDOFF §6-2).
export const WORKS: readonly Work[] = [
  {
    ko: "데미안",
    en: "Demian",
    author: "Hermann Hesse",
    year: "1919",
    tint: "#4b3f72",
    box: [550, 500, 390, 550],
    quote: "Wer geboren werden will, muss eine Welt zerstören",
    quoteKo: "태어나려는 자는 하나의 세계를 깨뜨려야 한다",
    sub: "익숙한 세계 너머의 자기 발견",
    story:
      "《데미안》의 싱클레어는 익숙한 세계의 경계를 넘어 진정한 자신을 찾아가는 여정을 시작합니다. 선과 악, 빛과 어둠 사이에서 방황하며 타인의 기준이 아닌 자신만의 삶을 선택하는 법을 배워갑니다.",
    notes: [
      ["Eucalyptus", "Lemon", "Green Leaves"],
      ["Iris", "Violet", "Ylang Ylang", "Jasmine"],
      ["Musk", "Cinnamon"],
    ],
    scentStory:
      "은은한 꽃향과 맑고 싱그러운 향기가 부드럽게 피어나고, 따뜻한 머스크가 잔잔한 여운을 남깁니다. CHALNÁ는 이 향을 통해 익숙한 세계를 깨고 자신만의 길을 찾아가는 용기와 자기 발견의 순간을 오래도록 기억하고자 했습니다.",
    title: "/assets/title-01.png",
    liftTitle: false,
    gallery: detail(1, [1, 3, 4, 5, 2]),
  },
  {
    ko: "노인과 바다",
    en: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    year: "1952",
    tint: "#2f5a6e",
    box: [960, 224, 350, 556],
    quote: "A man can be destroyed but not defeated",
    quoteKo: "인간은 파괴될 수는 있어도 패배하지 않는다",
    sub: "고난 속에서 지키는 존엄",
    story:
      "《노인과 바다》의 산티아고는 거대한 바다 위에서 자신의 한계와 마주합니다. 오랜 사투 끝에 얻은 것을 잃지만, 끝까지 포기하지 않는 태도로 결과보다 중요한 인간의 의지와 존엄을 보여줍니다.",
    notes: [
      ["Bergamot", "Cassis Leaf"],
      ["Pink Berries", "Jasmine", "Birch"],
      ["Musk", "Oakmoss", "Vanilla"],
    ],
    scentStory:
      "산뜻한 과일 향으로 시작해 이끼와 머스크의 깊고 묵직한 잔향이 퍼집니다. CHALNÁ는 이 향에 결과가 뜻대로 되지 않더라도 끝까지 자신의 신념을 지켜내는 의지와 존엄을 담아, 흔들리는 순간에도 그 가치를 기억할 수 있도록 했습니다.",
    title: "/assets/title-02.png",
    liftTitle: true,
    gallery: detail(2, [1, 3, 4, 5, 2]),
  },
  {
    ko: "오만과 편견",
    en: "Pride and Prejudice",
    author: "Jane Austen",
    year: "1813",
    tint: "#a5545e",
    box: [1444, 200, 392, 550],
    quote: "Till this moment, I never knew myself",
    quoteKo: "이 순간까지 나는 나 자신을 알지 못했다",
    sub: "편견 너머로 깊어지는 이해",
    story:
      "《오만과 편견》의 엘리자베스와 다아시는 서로에 대한 첫인상과 오해 속에서 엇갈립니다. 그러나 각자의 오만과 편견을 마주하고 자신의 판단을 돌아보며, 서로를 있는 그대로 이해하는 법을 배워갑니다.",
    notes: [
      ["Orange", "Geranium"],
      ["Damask Rose", "Jasmine", "Peony"],
      ["Sandalwood", "Vetiver", "Amber", "Musk"],
    ],
    scentStory:
      "풍성한 장미 향에 따뜻한 나무 향이 부드럽게 어우러져 깊고 포근한 여운을 남깁니다. CHALNÁ는 이 향을 통해 성급한 판단을 내려놓고 상대를 진심으로 이해하려는 마음과 성숙한 사랑의 가치를 기억하고자 했습니다.",
    title: "/assets/title-03.png",
    liftTitle: false,
    gallery: detail(3, [1, 3, 4, 5, 6, 7, 8, 2]),
  },
  {
    ko: "향수",
    en: "Perfume",
    author: "Patrick Süskind",
    year: "1985",
    tint: "#b08d56",
    box: [1080, 750, 550, 460],
    quote: "Wer die Gerüche beherrschte, der beherrschte die Herzen der Menschen",
    quoteKo: "향기를 지배하는 자는 사람들의 마음을 지배한다",
    sub: "매혹 끝에 마주하는 인간성",
    story:
      "《향수》의 그르누이는 세상의 모든 향을 구별하는 특별한 후각을 지녔지만, 정작 타인과 진정한 관계를 맺지 못합니다. 완벽한 향으로 사람들의 마음을 사로잡으려 하지만, 그가 얻은 매혹은 진정한 사랑과 인간적인 관계를 대신하지 못합니다.",
    notes: [
      ["Bergamot", "Ylang Ylang"],
      ["Clove", "Cardamom", "Cinnamon"],
      ["White Woods", "Sandalwood"],
    ],
    scentStory:
      "강렬한 향신료와 짙은 나무 향이 매혹적으로 퍼지며 어둡고 깊은 잔향을 남깁니다. CHALNÁ는 이 향을 통해 타인을 매혹시키는 힘보다 중요한 것은 진정한 사랑과 인간성이라는 역설적인 메시지를 오래도록 기억하고자 했습니다.",
    title: "/assets/title-04.png",
    liftTitle: false,
    gallery: detail(4, [1, 3, 4, 5, 6, 2]),
  },
  {
    ko: "고도를 기다리며",
    en: "Waiting for Godot",
    author: "Samuel Beckett",
    year: "1952",
    tint: "#5f5a4e",
    box: [1720, 540, 460, 540],
    quote: "What are we doing here, that is the question",
    quoteKo: "우리는 여기서 무엇을 하고 있는가, 그것이 문제다",
    sub: "기다림 속에서 발견하는 오늘",
    story:
      "《고도를 기다리며》의 두 인물은 끝내 나타나지 않는 고도를 기다리며 같은 자리에 머무릅니다. 반복되는 대화와 끝없는 기다림은 아직 오지 않은 무언가를 기대하며 정작 지금 이 순간을 지나치고 있지는 않은지 돌아보게 합니다.",
    notes: [
      ["Bergamot", "Coriander", "Clove Leaf"],
      ["Soft Floral", "Sandalwood"],
      ["Resins Accord", "Cedarwood", "Patchouli"],
    ],
    scentStory:
      "차분한 나무 향과 은은한 꽃향이 고요하게 퍼지며 오래 머무는 잔향을 남깁니다. CHALNÁ는 이 향에 불확실한 미래를 기다리는 동안에도 잊지 말아야 할 현재의 소중함을 담아, 오늘이라는 순간을 다시 기억할 수 있도록 했습니다.",
    title: "/assets/title-05.png",
    liftTitle: true,
    gallery: detail(5, [1, 3, 4, 5, 6, 2]),
  },
];
