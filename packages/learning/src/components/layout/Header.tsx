import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Palette, Languages, ChevronDown,
  Home, BookOpen, Calendar, Brain, Languages as LanguagesIcon,
  GraduationCap as GradCap, Code, Database, Server, Wind,
  Sparkles, FileText, MessageCircle, Cloud,
  Target, Flame, LayoutGrid,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import { useRoutes } from "../../hooks/useRoutes";
import { useQuizManifest } from "../../hooks/useQuizManifest";
import { ThemePickerModal } from "../ui/ThemePickerModal";
import type { RouteGroup } from "../../types/routes";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  "book-open": BookOpen,
  calendar: Calendar,
  brain: Brain,
  languages: LanguagesIcon,
  "graduation-cap": GradCap,
  code: Code,
  database: Database,
  server: Server,
  wind: Wind,
  sparkles: Sparkles,
  "file-text": FileText,
  "message-circle": MessageCircle,
  cloud: Cloud,
  "layout-grid": LayoutGrid,
};

function getIcon(name: string) {
  return iconMap[name] ?? BookOpen;
}

function DropdownMenu({ group, isDark, locale, onNavigate }: {
  group: RouteGroup;
  isDark: boolean;
  locale: "pt" | "en";
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isGroupActive = group.routes.some((r) => location.pathname === r.path);
  const GroupIcon = getIcon(group.icon);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          isGroupActive
            ? "bg-primary-500/10 text-primary-400"
            : isDark
              ? "text-white/44 hover:bg-white/5 hover:text-white/70"
              : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"
        }`}
      >
        <GroupIcon className="h-3.5 w-3.5" />
        {group.label[locale]}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className={`absolute left-0 top-full z-50 mt-1.5 min-w-[220px] rounded-xl border p-1.5 shadow-xl animate-scale-in ${
          isDark
            ? "border-white/8 bg-surface-raised shadow-black/40"
            : "border-slate-200/80 bg-white shadow-slate-200/40"
        }`}>
          <div className="stagger-children">
            {group.routes.map((route) => {
              const RouteIcon = getIcon(route.icon);
              const isActive = location.pathname === route.path;
              return (
                <Link
                  key={route.id}
                  to={route.path}
                  onClick={() => { setOpen(false); onNavigate?.(); }}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-primary-500/10 text-primary-400"
                      : isDark
                        ? "text-white/60 hover:bg-white/5 hover:text-white/81"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <RouteIcon className="h-4 w-4 shrink-0 opacity-60" />
                  <span className="truncate">{route.label[locale]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();
  const { t, locale, toggleLocale } = useI18n();
  const { routes, groups } = useRoutes();
  const { quizzes } = useQuizManifest();

  const topLevelRoutes = routes.filter((r) => r.type === "internal" || r.id === "study-manager");

  const isHome = location.pathname === "/";
  const totalQuestions = quizzes.reduce((sum, q) => sum + q.questionCount, 0);
  const quizTypes = new Set(quizzes.map((q) => q.type)).size;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const iconBtnClass = "flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95";

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-300 ease-out ${
          isDark
            ? "bg-surface/95 backdrop-blur-xl"
            : "bg-white/90 backdrop-blur-xl"
        } ${
          scrolled
            ? isDark
              ? "border-b border-white/6 shadow-lg shadow-black/20"
              : "border-b border-slate-200/50 shadow-sm shadow-slate-200/30"
            : "border-b border-transparent"
        }`}
      >
        {/* Main nav row */}
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 ease-out ${
          scrolled ? "py-2" : "py-3.5"
        }`}>
          {/* Spacer — no logo */}
          <div className="hidden md:block" />

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            <nav className="flex items-center gap-0.5">
              {topLevelRoutes.map((route) => {
                const isActive = location.pathname === route.path;
                const Icon = getIcon(route.icon);
                return (
                  <Link
                    key={route.id}
                    to={route.path}
                    className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-500/10 text-primary-400"
                        : isDark
                          ? "text-white/44 hover:bg-white/5 hover:text-white/70"
                          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {route.label[locale]}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary-400" />
                    )}
                  </Link>
                );
              })}

              {groups.map((group) => (
                <DropdownMenu
                  key={group.id}
                  group={group}
                  isDark={isDark}
                  locale={locale}
                />
              ))}
            </nav>

            <div className={`mx-2 h-5 w-px ${isDark ? "bg-white/6" : "bg-slate-200"}`} />

            <button
              type="button"
              onClick={() => setThemeModalOpen(true)}
              className={`${iconBtnClass} h-8 w-8 ${
                isDark
                  ? "text-accent-400 hover:bg-white/5"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
              aria-label="Change theme"
            >
              <Palette className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={toggleLocale}
              className={`${iconBtnClass} h-8 gap-1 px-2 text-xs font-bold ${
                isDark
                  ? "text-white/44 hover:bg-white/5 hover:text-white/70"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
              aria-label="Toggle language"
            >
              <Languages className="h-3.5 w-3.5" />
              {locale.toUpperCase()}
            </button>
          </div>

          {/* Mobile controls — minimal (nav is in bottom bar) */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setThemeModalOpen(true)}
              className={`${iconBtnClass} h-9 w-9 ${isDark ? "text-accent-400" : "text-slate-400"}`}
              aria-label="Change theme"
            >
              <Palette className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleLocale}
              className={`${iconBtnClass} h-8 gap-1 px-2 text-xs font-bold ${
                isDark ? "text-white/44 hover:bg-white/5" : "text-slate-400 hover:bg-slate-100"
              }`}
              aria-label="Toggle language"
            >
              <Languages className="h-3.5 w-3.5" />
              {locale.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Sub-bar — stats (home page only, when quizzes loaded) */}
        {isHome && quizzes.length > 0 && (
          <div className={`border-t transition-all duration-300 ${
            isDark ? "border-white/4 bg-surface-dim/30" : "border-slate-100/60 bg-slate-50/40"
          }`}>
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-6 py-2 sm:gap-10">
              {[
                { icon: BookOpen, value: quizzes.length, labelKey: "home.stat.quizzes" },
                { icon: Target, value: totalQuestions, labelKey: "home.stat.questions" },
                { icon: Flame, value: quizTypes, labelKey: "home.stat.types" },
              ].map((stat) => (
                <div key={stat.labelKey} className="flex items-center gap-2">
                  <stat.icon className={`h-3.5 w-3.5 ${isDark ? "text-primary-400/50" : "text-primary-500/50"}`} />
                  <span className={`text-sm font-bold tabular-nums ${isDark ? "text-white/50" : "text-slate-600"}`}>
                    {stat.value}
                  </span>
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${
                    isDark ? "text-white/15" : "text-slate-300"
                  }`}>
                    {t(stat.labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </header>

      {themeModalOpen && (
        <ThemePickerModal onClose={() => setThemeModalOpen(false)} />
      )}
    </>
  );
}

