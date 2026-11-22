import type { ViewId } from "@/lib/route";
import Logo from "./Logo";

const MENU = [
  { nav: "collection", label: "Collection" },
  { nav: "story", label: "Brand Story" },
  { nav: "contact", label: "Contact" },
] as const;

/** 상단 메뉴. 상세 화면(detail)에서는 Collection이 활성 상태. */
export default function Gnb({ view }: { view: ViewId | null }) {
  const isCur = (nav: string) =>
    (nav === "collection" && (view === "main" || view === "detail")) || nav === view;

  return (
    <header className="gnb">
      <a href="#collection" className="brand">
        <Logo />
      </a>
      <nav className="menu">
        {MENU.map((m) => (
          <a key={m.nav} href={`#${m.nav}`} className={isCur(m.nav) ? "cur" : undefined}>
            {m.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
