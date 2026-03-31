import { Link } from "react-router-dom";
import {
  BookOpen, Brain, GraduationCap, Code, Database, Server, Wind,
  Sparkles, FileText, MessageCircle, Cloud, Languages as LanguagesIcon,
  ArrowRight, LayoutGrid,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useI18n } from "../contexts/I18nContext";
import { useRoutes } from "../hooks/useRoutes";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  code: Code,
  database: Database,
  server: Server,
  wind: Wind,
  sparkles: Sparkles,
  "file-text": FileText,
  "message-circle": MessageCircle,
  cloud: Cloud,
  languages: LanguagesIcon,
  "layout-grid": LayoutGrid,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? BookOpen;
}

export function TopicsPage() {
  const { isDark } = useTheme();
  const { t, locale } = useI18n();
  const { groups } = useRoutes();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-b from-primary-950/20 to-transparent"
            : "bg-gradient-to-b from-primary-50/50 to-transparent"
        }`} />

        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pt-16">
          {/* Header */}
          <div className="animate-fade-in-up mb-10 text-center">
            <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${
              isDark
                ? "border-primary-500/15 bg-primary-500/8 text-primary-300"
                : "border-primary-200/60 bg-white text-primary-600"
            }`}>
              <LayoutGrid className="h-3.5 w-3.5" />
              {locale === "pt" ? "Tópicos de Estudo" : "Study Topics"}
            </div>
            <h1 className={`mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
              isDark ? "text-white/81" : "text-slate-900"
            }`}>
              {locale === "pt" ? "Todos os Tópicos" : "All Topics"}
            </h1>
            <p className={`mx-auto max-w-lg text-base leading-relaxed ${
              isDark ? "text-white/44" : "text-slate-500"
            }`}>
              {locale === "pt"
                ? "Explore todos os conteúdos de estudo organizados por área"
                : "Explore all study content organized by area"}
            </p>
          </div>

          {/* Groups grid */}
          <div className="stagger-children grid gap-6 sm:grid-cols-2">
            {groups.map((group) => {
              const GroupIcon = getIcon(group.icon);
              return (
                <div
                  key={group.id}
                  className={`rounded-2xl border p-6 ${
                    isDark
                      ? "border-white/6 bg-surface-raised/80"
                      : "border-slate-200/80 bg-white shadow-sm shadow-slate-100"
                  }`}
                >
                  {/* Group header */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isDark ? "bg-primary-500/10" : "bg-primary-50"
                    }`}>
                      <GroupIcon className="h-4.5 w-4.5 text-primary-400" />
                    </div>
                    <h2 className={`text-base font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
                      {group.label[locale]}
                    </h2>
                  </div>

                  {/* Routes list */}
                  <div className="space-y-1">
                    {group.routes.map((route) => {
                      const RouteIcon = getIcon(route.icon);
                      return (
                        <Link
                          key={route.id}
                          to={route.path}
                          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                            isDark
                              ? "text-white/50 hover:bg-white/5 hover:text-white/81"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <RouteIcon className={`h-3.5 w-3.5 shrink-0 ${
                            isDark ? "text-white/25" : "text-slate-300"
                          }`} />
                          <span className="flex-1 truncate">{route.label[locale]}</span>
                          <ArrowRight className={`h-3 w-3 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 ${
                            isDark ? "text-primary-400" : "text-primary-500"
                          }`} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
