import type { Metadata } from "next";
import { Cardo, Pinyon_Script } from "next/font/google";
// 한글 본문: Pretendard (npm 패키지로 번들 → 오프라인 전시에서도 동작)
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

// 영문 폰트는 빌드 시 내려받아 함께 배포됩니다 (CDN 없이 동작, HANDOFF §6-1).
const cardo = Cardo({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-cardo",
});

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});

export const metadata: Metadata = {
  title: "Chalná Parts of Us",
  description: "향수 브랜드 Chalná의 첫 컬렉션 Parts of Us — 고전 문학 다섯 편을 다섯 가지 향으로.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${cardo.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
