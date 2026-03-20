import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X, Sparkles, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, toggleLocale } = useI18n();

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/study", label: t("nav.study") },
    { to: "/notion", label: t("nav.resources") },
    { to: "/planing", label: t("nav.planning") },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? `glass border-b shadow-lg ${isDark ? "border-white/5 shadow-black/20" : "border-primary-100/50 shadow-primary-500/5"}`
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 text-lg font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25 transition-transform duration-300 group-hover:scale-110">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-gradient text-xl tracking-tight">
            {t("header.brand")}
          </span>
          <Sparkles className="h-3.5 w-3.5 text-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `bg-primary-500/10 text-primary-700 ${isDark ? "text-primary-300" : ""}`
                      : `${isDark ? "text-slate-400 hover:bg-white/5 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"}`
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

          {/* Divider */}
          <div className={`mx-2 h-5 w-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
              isDark
                ? "text-yellow-400 hover:bg-white/10"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLocale}
            className={`flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition-all duration-200 ${
              isDark
                ? "text-slate-400 hover:bg-white/10 hover:text-slate-200"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
            aria-label="Toggle language"
          >
            <Languages className="h-3.5 w-3.5" />
            {locale.toUpperCase()}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              isDark ? "text-yellow-400" : "text-slate-400"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleLocale}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ${
              isDark ? "text-slate-400" : "text-slate-400"
            }`}
            aria-label="Toggle language"
          >
            {locale.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              isDark ? "text-slate-400 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100/80"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className={`animate-fade-in border-t px-4 pb-3 pt-2 backdrop-blur-lg md:hidden ${
          isDark ? "border-white/5 bg-slate-900/95" : "border-slate-100 bg-white/95"
        }`}>
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
                    : isDark ? "text-slate-400 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isActive && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
