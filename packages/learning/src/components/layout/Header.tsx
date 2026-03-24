import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap, Menu, X, Moon, Sun, Languages, ChevronDown,
  Home, BookOpen, Calendar, Brain, Languages as LanguagesIcon,
  GraduationCap as GradCap, Code, Database, Server, Wind,
  Sparkles, FileText, MessageCircle, Cloud,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import { useRoutes } from "../../hooks/useRoutes";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { t, locale, toggleLocale } = useI18n();
  const { routes, groups } = useRoutes();

  const topLevelRoutes = routes.filter((r) => r.type === "internal" || r.id === "study-manager");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const iconBtnClass = `flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "border-b border-white/6 bg-surface/90 shadow-lg shadow-black/20 backdrop-blur-xl"
            : "border-b border-primary-100/40 bg-white/80 shadow-lg shadow-primary-500/5 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 text-lg font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/30">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-gradient text-lg tracking-tight">
            {t("header.brand")}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          <nav className="flex items-center gap-0.5">
            {/* Top-level routes */}
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

            {/* Group dropdowns */}
            {groups.map((group) => (
              <DropdownMenu
                key={group.id}
                group={group}
                isDark={isDark}
                locale={locale}
              />
            ))}
          </nav>

          {/* Divider */}
          <div className={`mx-2 h-5 w-px ${isDark ? "bg-white/6" : "bg-slate-200"}`} />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`${iconBtnClass} h-8 w-8 ${
              isDark
                ? "text-accent-400 hover:bg-white/5"
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

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className={`${iconBtnClass} h-9 w-9 ${isDark ? "text-accent-400" : "text-slate-400"}`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleLocale}
            className={`${iconBtnClass} h-9 w-9 text-xs font-bold ${isDark ? "text-white/44" : "text-slate-400"}`}
            aria-label="Toggle language"
          >
            {locale.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${iconBtnClass} h-9 w-9 ${
              isDark ? "text-white/44 hover:bg-white/5" : "text-slate-500 hover:bg-slate-100/80"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — staggered animation */}
      {menuOpen && (
        <nav className={`animate-slide-down border-t px-4 pb-4 pt-2 backdrop-blur-xl md:hidden ${
          isDark ? "border-white/6 bg-surface/95" : "border-slate-100 bg-white/95"
        }`}>
          <div className="stagger-children">
            {/* Top-level routes */}
            {topLevelRoutes.map((route) => {
              const isActive = location.pathname === route.path;
              const Icon = getIcon(route.icon);
              return (
                <Link
                  key={route.id}
                  to={route.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-500/10 text-primary-400"
                      : isDark ? "text-white/44 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4 opacity-60" />
                  {route.label[locale]}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400" />
                  )}
                </Link>
              );
            })}

            {/* Groups as expandable sections */}
            {groups.map((group) => (
              <MobileGroupSection key={group.id} group={group} isDark={isDark} locale={locale} />
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function MobileGroupSection({ group, isDark, locale }: {
  group: RouteGroup;
  isDark: boolean;
  locale: "pt" | "en";
}) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const isGroupActive = group.routes.some((r) => location.pathname === r.path);
  const GroupIcon = getIcon(group.icon);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
          isGroupActive
            ? "bg-primary-500/10 text-primary-400"
            : isDark ? "text-white/44 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center gap-3">
          <GroupIcon className="h-4 w-4 opacity-60" />
          {group.label[locale]}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className={`ml-4 animate-slide-down border-l pl-4 ${isDark ? "border-white/6" : "border-slate-100"}`}>
          <div className="stagger-children">
            {group.routes.map((route) => {
              const RouteIcon = getIcon(route.icon);
              const isActive = location.pathname === route.path;
              return (
                <Link
                  key={route.id}
                  to={route.path}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "text-primary-400"
                      : isDark ? "text-white/44 hover:text-white/70" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <RouteIcon className="h-3.5 w-3.5 opacity-50" />
                  {route.label[locale]}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
