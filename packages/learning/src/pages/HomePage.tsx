import { Link } from "react-router-dom";
import {
  BookOpen, CalendarDays, ArrowRight, Zap, Trophy,
  Brain,
} from "lucide-react";
import { useTypewriter } from "../hooks/useTypewriter";
import { useI18n } from "../contexts/I18nContext";
import { useTheme } from "../contexts/ThemeContext";
import { useRoutes } from "../hooks/useRoutes";
import { useQuizManifest } from "../hooks/useQuizManifest";
import type { LucideIcon } from "lucide-react";
import type { QuizManifestEntry } from "../types/quiz";

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

function MiniQuizCard({ quiz, locale, isDark }: {
  quiz: QuizManifestEntry;
  locale: "pt" | "en";
  isDark: boolean;
}) {
  return (
    <Link
      to={`/study/${quiz.id}`}
      className={`group flex items-center gap-3.5 rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isDark
          ? "border-white/6 bg-surface-raised/60 hover:border-white/12"
          : "border-slate-200/60 bg-white hover:border-slate-300 hover:shadow-slate-200/50"
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
        isDark ? "bg-primary-500/10" : "bg-primary-50"
      }`}>
        <Brain className="h-5 w-5 text-primary-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
          {quiz.title[locale]}
        </p>
        <p className={`text-xs ${isDark ? "text-white/25" : "text-slate-400"}`}>
          {quiz.questionCount > 0 ? `${quiz.questionCount} ` : ""}{quiz.questionCount > 0 ? (locale === "pt" ? "perguntas" : "questions") : quiz.type}
        </p>
      </div>
      <ArrowRight className={`h-3.5 w-3.5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5 ${
        isDark ? "text-white/10 group-hover:text-primary-400" : "text-slate-200 group-hover:text-primary-500"
      }`} />
    </Link>
  );
}

export function HomePage() {
  const { t, locale } = useI18n();
  const { isDark } = useTheme();
  const { groups } = useRoutes();
  const { quizzes } = useQuizManifest();

  const phrases = Array.from({ length: 8 }, (_, i) => t(`hero.phrase.${i + 1}`));
  const { text } = useTypewriter(phrases);
  const greeting = t(getGreetingKey());

  const featuredQuizzes = quizzes.slice(0, 4);

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-br from-primary-950 via-surface to-surface"
            : "bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800"
        }`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.21_285_/_0.25),transparent)]" />

        {/* Floating orbs */}
        <div className="animate-float absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary-500/8 blur-3xl" />
        <div className="animate-float absolute bottom-[10%] right-[15%] h-80 w-80 rounded-full bg-accent-400/6 blur-3xl" style={{ animationDelay: "2s" }} />
        <div className="animate-float absolute right-[30%] top-[10%] h-40 w-40 rounded-full bg-primary-400/5 blur-2xl" style={{ animationDelay: "4s" }} />

        <div className="relative mx-auto max-w-5xl px-6 py-14 sm:py-20 lg:py-24">
          <div className="animate-fade-in-up mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
                Bryan
              </span>
            </h1>
          </div>

          <div className="animate-fade-in-up mb-10 min-h-[2rem] sm:min-h-[2.5rem]" style={{ animationDelay: "150ms" }}>
            <p className="typewriter-cursor text-lg text-primary-200/50 sm:text-xl lg:text-2xl">
              {text}
            </p>
          </div>

          {/* Quick actions */}
          <div className="animate-fade-in-up flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-white/8 bg-white/5 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/10 hover:shadow-lg hover:shadow-primary-500/5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 transition-all duration-500 group-hover:from-primary-500/5 group-hover:to-transparent" />
                <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 transition-colors duration-300 group-hover:bg-white/12">
                  <action.icon className="h-4.5 w-4.5 text-primary-300/80 transition-colors group-hover:text-primary-200" />
                </div>
                <div className="relative">
                  <span className="block text-sm font-semibold text-white">{t(action.labelKey)}</span>
                  <span className="block text-xs text-white/30">{t(action.descKey)}</span>
                </div>
                <ArrowRight className="relative h-3.5 w-3.5 text-white/15 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white/40" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured quizzes ── */}
      {featuredQuizzes.length > 0 && (
        <section className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className={`h-5 w-5 ${isDark ? "text-accent-400/70" : "text-accent-500"}`} />
              <h2 className={`text-lg font-bold ${isDark ? "text-white/70" : "text-slate-800"}`}>
                {t("home.featured.title")}
              </h2>
            </div>
            <Link
              to="/study"
              className="group flex items-center gap-1 text-xs font-semibold text-primary-400 transition-colors hover:text-primary-300"
            >
              {t("home.featured.viewAll")}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {featuredQuizzes.map((quiz) => (
              <MiniQuizCard key={quiz.id} quiz={quiz} locale={locale} isDark={isDark} />
            ))}
          </div>
        </section>
      )}

      {/* ── Categories ── */}
      {groups.length > 0 && (
        <section className={`border-t ${isDark ? "border-white/4" : "border-slate-100"}`}>
          <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
            <h2 className={`mb-6 text-lg font-bold ${isDark ? "text-white/70" : "text-slate-800"}`}>
              {t("home.categories.title")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  to={group.routes[0]?.path ?? "/"}
                  className={`group flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    isDark
                      ? "border-white/6 text-white/40 hover:border-white/12 hover:bg-white/5 hover:text-white/60"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5 transition-colors group-hover:text-primary-400" />
                  {group.label[locale]}
                  <ArrowRight className={`h-3 w-3 transition-all duration-200 group-hover:translate-x-0.5 ${
                    isDark ? "text-white/10" : "text-slate-200"
                  }`} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
