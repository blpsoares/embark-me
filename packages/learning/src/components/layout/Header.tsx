import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/study", label: "Estudar" },
  { to: "/notion", label: "Recursos" },
  { to: "/planing", label: "Planejamento" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-primary-100/50 shadow-lg shadow-primary-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-lg font-bold"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25 transition-transform duration-300 group-hover:scale-110">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-gradient text-xl tracking-tight">
            Study Challenges
          </span>
          <Sparkles className="h-3.5 w-3.5 text-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-500/10 text-primary-700"
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100/80 hover:text-slate-800 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="animate-fade-in border-t border-slate-100 bg-white/95 px-4 pb-3 pt-2 backdrop-blur-lg md:hidden">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-500/10 text-primary-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-primary-500" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
