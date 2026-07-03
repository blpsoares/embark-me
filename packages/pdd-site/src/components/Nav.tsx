import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import LangToggle from "./LangToggle";

export default function Nav() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
      <div className="max-w-4xl mx-auto rounded-3xl sm:rounded-full border border-zinc-800 bg-[#0a1b2e]/70 backdrop-blur-xl shadow-lg shadow-black/30 overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-5 py-2.5">
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
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="sm:hidden flex flex-col gap-1 p-1.5 -mr-1"
            >
              <span className={`block w-4 h-px bg-zinc-300 transition-transform ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block w-4 h-px bg-zinc-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-px bg-zinc-300 transition-transform ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col gap-1 px-5 pb-4 pt-1 border-t border-white/10 text-[14px] font-medium text-zinc-300">
            <a href="/#problem" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              Why
            </a>
            <a href="/#pipeline" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              Pipeline
            </a>
            <Link to="/docs" onClick={() => setMenuOpen(false)} className="py-2 hover:text-accent transition-colors">
              {t.nav.docs}
            </Link>
            <a
              href="https://github.com/blpsoares/parity-driven-development"
              onClick={() => setMenuOpen(false)}
              className="py-2 hover:text-accent transition-colors"
            >
              {t.nav.github}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
