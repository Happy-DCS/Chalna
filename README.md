# Chalna

충남대학교 디자인창의학과 시각·제품디자인전공 졸업작품

향수 브랜드 **Chalná**의 첫 컬렉션 **Parts of Us** 프로모션 사이트입니다. 디자이너 시안(바닐라 HTML)을 Next.js로 옮겼습니다. 디자인 결정과 검수 항목은 [docs/HANDOFF.md](docs/HANDOFF.md)에 있습니다.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## 구조

```
src/
├── app/
│   ├── layout.tsx        폰트(Cardo, Pinyon Script, Pretendard) — 모두 빌드에 포함, CDN 없음
│   ├── page.tsx
│   └── globals.css       시안의 CSS 그대로 (2560×1440 기준 px)
├── components/
│   ├── ChalnaApp.tsx     스테이지 스케일링, 해시 라우팅, 1분 대기 후 첫 화면 복귀
│   ├── Cursor.tsx, Gnb.tsx, Logo.tsx
│   └── views/            Intro · Collection · Detail · Story · Contact
├── data/works.ts         작품 5종 데이터 (텍스트, 향 노트, 병 좌표, 갤러리 순서)
└── lib/                  route.ts(해시 ↔ 화면), reveal.ts(스크롤 등장 효과)
public/
├── assets/               이미지 (시안의 src/assets 그대로 + logo-mask.png)
└── fonts/                명조 서브셋 (「컬렉션으로돌아가기보」 글자만)
```

- 화면은 `#intro`(기본) · `#collection` · `#work-1`~`#work-5` · `#story` · `#contact` 해시로 전환됩니다. 다섯 화면은 모두 마운트된 채로 겹쳐 있다가 서로 페이드됩니다.
- 버튼 문구(「컬렉션 보기」, 「컬렉션으로 돌아가기」)를 바꾸면 `public/fonts`의 명조 서브셋도 다시 만들어야 합니다.

## 남은 일 (HANDOFF §6)

- [ ] 새 `main.jpg`에 맞춰 `src/data/works.ts`의 `box` 좌표 다시 재기
- [ ] 노인과 바다 병 라벨 오타("ERNESTI") — 디자이너에게 사진 재요청
- [ ] `story-found.jpg` 고화질 원본으로 교체
