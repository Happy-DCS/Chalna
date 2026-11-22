import Gnb from "@/components/Gnb";
import type { ViewId } from "@/lib/route";

export default function Contact({ active, view }: { active: boolean; view: ViewId | null }) {
  return (
    <section id="contact" className={active ? "view on" : "view"} aria-label="연락처">
      <Gnb view={view} />
      <div className="ct-wrap">
        <div className="ct-left">
          <p className="ct-eye">Contact</p>
          <h2 className="ct-name">Silver Eun Cho</h2>
          <p className="ct-ko">조은 · Designer</p>
        </div>
        <ul className="ct-list">
          <li>
            <span className="k">Email</span>
            <a className="v" href="mailto:joeun3683@naver.com">
              joeun3683@naver.com
            </a>
          </li>
          <li>
            <span className="k">Instagram</span>
            <a className="v" href="https://www.instagram.com/silvereuncho/" target="_blank" rel="noopener">
              @silvereuncho
            </a>
          </li>
          <li>
            <span className="k">Portfolio</span>
            <a className="v" href="https://silver-portfolio-alpha.vercel.app/" target="_blank" rel="noopener">
              silver-portfolio-alpha.vercel.app
            </a>
          </li>
          <li>
            <span className="k">Project</span>
            <span className="v">2026 Graduation Project · Literature × Scent Brand</span>
          </li>
        </ul>
      </div>
      <p className="ct-foot">
        <span>© 2026 Chalná</span>
        <span>Literature × Scent</span>
      </p>
    </section>
  );
}
