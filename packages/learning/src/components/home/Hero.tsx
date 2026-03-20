import { Link } from "react-router-dom";
import { BookOpen, CalendarDays, ArrowRight, Zap } from "lucide-react";
import { useTypewriter } from "../../hooks/useTypewriter";
import { useI18n } from "../../contexts/I18nContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useRoutes } from "../../hooks/useRoutes";
import type { LucideIcon } from "lucide-react";

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "greeting.morning";
  if (hour >= 12 && hour < 18) return "greeting.afternoon";
  if (hour >= 18) return "greeting.evening";
  return "greeting.night";
}

interface QuickAction {
  to: string;
  icon: LucideIcon;
  labelKey: string;
  descKey: string;
}

const quickActions: QuickAction[] = [
  {
    to: "/study",
    icon: BookOpen,
    labelKey: "hero.action.study",
    descKey: "hero.action.study.desc",
  },
  {
    to: "/notion/study-manager",
    icon: CalendarDays,
    labelKey: "hero.action.planning",
    descKey: "hero.action.planning.desc",
  },
];

export function Hero() {
  const { t, locale } = useI18n();
  const { isDark } = useTheme();
  const { groups } = useRoutes();

  const phrases = Array.from({ length: 8 }, (_, i) => t(`hero.phrase.${i + 1}`));
  const { text } = useTypewriter(phrases);
  const greeting = t(getGreetingKey());

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark
          ? "bg-gradient-to-br from-primary-950 via-surface to-surface"
          : "bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800"
      }`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.21_285_/_0.25),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/20 to-transparent" />

      {/* Floating orbs */}
      <div className="animate-float absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary-500/8 blur-3xl" />
      <div className="animate-float absolute bottom-[10%] right-[15%] h-80 w-80 rounded-full bg-accent-400/6 blur-3xl" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        {/* Greeting */}
        <div className="animate-fade-in-up mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
              Bryan
            </span>
          </h1>
        </div>

        {/* Typewriter */}
        <div className="animate-fade-in-up mb-12 min-h-[2rem] sm:min-h-[2.5rem]" style={{ animationDelay: "150ms" }}>
          <p className="typewriter-cursor text-lg text-primary-200/50 sm:text-xl lg:text-2xl">
            {text}
          </p>
        </div>

        {/* Quick actions */}
        <div className="animate-fade-in-up mb-10 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-5 py-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/8"
            >
              <action.icon className="h-4.5 w-4.5 text-primary-300/70" />
              <div>
                <span className="text-sm font-semibold text-white">{t(action.labelKey)}</span>
                <span className="ml-2 text-xs text-white/30">{t(action.descKey)}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white/40" />
            </Link>
          ))}
        </div>

        {/* Quick links to groups */}
        <div className="animate-fade-in-up flex flex-wrap gap-2" style={{ animationDelay: "450ms" }}>
          {groups.map((group) => (
            <Link
              key={group.id}
              to={group.routes[0]?.path ?? "/"}
              className="group flex items-center gap-1.5 rounded-lg border border-white/6 px-3 py-1.5 text-xs font-medium text-white/30 transition-all hover:border-white/12 hover:text-white/50"
            >
              <Zap className="h-3 w-3" />
              {group.label[locale]}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
