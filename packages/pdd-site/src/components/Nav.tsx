import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { t } = useI18n();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 rounded-full border border-zinc-800 bg-black/60 backdrop-blur-xl px-5 py-2.5 shadow-lg shadow-black/40">
        <Link to="/" className="text-accent font-bold font-mono text-sm shrink-0">
          ▲ pdd
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-[13px] font-medium text-zinc-300">
          <a href="/#problem" className="hover:text-accent transition-colors">
            Why
          </a>
          <a href="/#pipeline" className="hover:text-accent transition-colors">
            Pipeline
          </a>
          <Link to="/docs" className="hover:text-accent transition-colors">
            {t.nav.docs}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/blpsoares/parity-driven-development"
            className="hidden sm:inline-block text-[13px] font-medium text-zinc-300 hover:text-accent transition-colors"
          >
            {t.nav.github}
          </a>
          <div className="w-px h-5 bg-zinc-800 hidden sm:block" />
          <div className="rounded-full bg-zinc-900 px-2.5 py-1">
            <LangToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
