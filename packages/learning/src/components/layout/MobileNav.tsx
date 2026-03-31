import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, BookOpen, Calendar, Brain, ChevronDown,
  Languages as LanguagesIcon, GraduationCap as GradCap,
  Code, Database, Server, Wind, Sparkles, FileText,
  MessageCircle, Cloud, MoreHorizontal, X, LayoutGrid,
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
  "layout-grid": LayoutGrid,
};

function getIcon(name: string) {
  return iconMap[name] ?? BookOpen;
}

// Routes that appear directly in the bottom bar
const PINNED_ROUTE_IDS = ["home", "study", "topics", "study-manager"];

function GroupDrawerSection({ group, isDark, locale, onNavigate }: {
  group: RouteGroup;
  isDark: boolean;
  locale: "pt" | "en";
  onNavigate: () => void;
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
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
          isGroupActive
            ? "bg-primary-500/10 text-primary-400"
            : isDark ? "text-white/60 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center gap-3">
          <GroupIcon className="h-4 w-4 opacity-60" />
          {group.label[locale]}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className={`ml-4 border-l pl-3 ${isDark ? "border-white/8" : "border-slate-100"}`}>
          {group.routes.map((route) => {
            const RouteIcon = getIcon(route.icon);
            const isActive = location.pathname === route.path;
            return (
              <Link
                key={route.id}
                to={route.path}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "text-primary-400"
                    : isDark ? "text-white/44 hover:text-white/70" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <RouteIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
                <span className="truncate">{route.label[locale]}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();
  const { locale } = useI18n();
  const { routes, groups } = useRoutes();

  // Close drawer on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = moreOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [moreOpen]);

  const pinnedRoutes = routes.filter((r) => PINNED_ROUTE_IDS.includes(r.id));

  const navItems = pinnedRoutes.map((route) => {
    const Icon = getIcon(route.icon);
    const isActive = location.pathname === route.path;
    return { route, Icon, isActive };
  });

  const isMoreActive = !navItems.some((n) => n.isActive);

  return (
    <>
      {/* Bottom navigation bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 flex items-center border-t md:hidden ${
          isDark
            ? "border-white/8 bg-surface/95 backdrop-blur-xl"
            : "border-slate-200/70 bg-white/95 backdrop-blur-xl"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map(({ route, Icon, isActive }) => (
          <Link
            key={route.id}
            to={route.path}
            className="flex flex-1 flex-col items-center gap-1 px-2 py-3 transition-colors"
            onClick={() => setMoreOpen(false)}
          >
            <Icon
              className={`h-5 w-5 transition-colors ${
                isActive
                  ? "text-primary-400"
                  : isDark ? "text-white/30" : "text-slate-400"
              }`}
            />
            <span
              className={`text-[10px] font-medium leading-none transition-colors ${
                isActive
                  ? "text-primary-400"
                  : isDark ? "text-white/25" : "text-slate-400"
              }`}
            >
              {route.label[locale]}
            </span>
            {isActive && (
              <span className="absolute bottom-0 h-0.5 w-8 rounded-t-full bg-primary-400" />
            )}
          </Link>
        ))}

        {/* More button */}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 px-2 py-3 transition-colors"
        >
          <MoreHorizontal
            className={`h-5 w-5 transition-colors ${
              isMoreActive && moreOpen
                ? "text-primary-400"
                : isDark ? "text-white/30" : "text-slate-400"
            }`}
          />
          <span
            className={`text-[10px] font-medium leading-none transition-colors ${
              isMoreActive && moreOpen
                ? "text-primary-400"
                : isDark ? "text-white/25" : "text-slate-400"
            }`}
          >
            {locale === "pt" ? "Mais" : "More"}
          </span>
        </button>
      </nav>

      {/* More drawer — slides up from bottom */}
      {moreOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50 md:hidden"
            style={{ background: "oklch(0 0 0 / 0.45)", backdropFilter: "blur(2px)" }}
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-50 max-h-[80dvh] overflow-y-auto rounded-t-2xl border-t md:hidden animate-slide-in-up ${
              isDark
                ? "border-white/8 bg-surface-raised"
                : "border-slate-200 bg-white"
            }`}
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className={`h-1 w-10 rounded-full ${isDark ? "bg-white/15" : "bg-slate-200"}`} />
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between border-b px-4 pb-3 pt-2 ${
              isDark ? "border-white/6" : "border-slate-100"
            }`}>
              <span className={`text-sm font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
                {locale === "pt" ? "Navegação" : "Navigation"}
              </span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                  isDark ? "text-white/30 hover:bg-white/8 hover:text-white/60" : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Groups */}
            <div className="p-2">
              {groups.map((group) => (
                <GroupDrawerSection
                  key={group.id}
                  group={group}
                  isDark={isDark}
                  locale={locale}
                  onNavigate={() => setMoreOpen(false)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
