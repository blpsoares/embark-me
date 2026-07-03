import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { t } = useI18n();

  return (
    <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-6 py-3.5 flex items-center justify-between text-sm text-zinc-300">
      <Link to="/" className="text-accent font-bold">
        ▲ pdd
      </Link>
      <div className="flex items-center gap-5">
        <Link to="/docs">{t.nav.docs}</Link>
        <a href="https://github.com/blpsoares/parity-driven-development">{t.nav.github}</a>
        <LangToggle />
      </div>
    </nav>
  );
}
