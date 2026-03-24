import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Code, Cloud, Server, Sparkles, Database, Wind, FileText, MessageCircle, Search, Grid3X3 } from "lucide-react";
import type { QuizManifestEntry, QuizType } from "../../types/quiz";
import type { Locale } from "../../contexts/I18nContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  brain: Brain,
  code: Code,
  cloud: Cloud,
  server: Server,
  sparkles: Sparkles,
  database: Database,
  wind: Wind,
  "file-text": FileText,
  "message-circle": MessageCircle,
  search: Search,
  "grid-3x3": Grid3X3,
};

const typeBadgeColors: Record<QuizType, { badge: string; icon: string; glow: string }> = {
  flashcard: {
    badge: "bg-primary-500/10 text-primary-400 ring-primary-500/20",
    icon: "bg-primary-500/10 group-hover:bg-primary-500/15",
    glow: "group-hover:shadow-primary-500/10",
  },
  "multiple-choice": {
    badge: "bg-accent-400/10 text-accent-500 ring-accent-400/20",
    icon: "bg-accent-400/10 group-hover:bg-accent-400/15",
    glow: "group-hover:shadow-accent-400/10",
  },
  "true-false": {
    badge: "bg-green-500/10 text-green-400 ring-green-500/20",
    icon: "bg-green-500/10 group-hover:bg-green-500/15",
    glow: "group-hover:shadow-green-500/10",
  },
  "fill-blank": {
    badge: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    icon: "bg-blue-500/10 group-hover:bg-blue-500/15",
    glow: "group-hover:shadow-blue-500/10",
  },
  "match-pairs": {
    badge: "bg-pink-500/10 text-pink-400 ring-pink-500/20",
    icon: "bg-pink-500/10 group-hover:bg-pink-500/15",
    glow: "group-hover:shadow-pink-500/10",
  },
  "word-search": {
    badge: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    icon: "bg-amber-500/10 group-hover:bg-amber-500/15",
    glow: "group-hover:shadow-amber-500/10",
  },
  crossword: {
    badge: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
    icon: "bg-violet-500/10 group-hover:bg-violet-500/15",
    glow: "group-hover:shadow-violet-500/10",
  },
};

interface QuizCardProps {
  quiz: QuizManifestEntry;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const { isDark } = useTheme();
  const { t, locale } = useI18n();
  const Icon = iconMap[quiz.icon] ?? BookOpen;
  const colors = typeBadgeColors[quiz.type];

  return (
    <Link
      to={`/study/${quiz.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${colors.glow} ${
        isDark
          ? "border-white/6 bg-surface-raised/80 hover:border-white/15"
          : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-slate-200/60"
      }`}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${colors.icon}`}>
          <Icon className="h-5 w-5 text-primary-400 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${colors.badge}`}>
          {t(`quizType.${quiz.type}`)}
        </span>
      </div>

      <h3 className={`mb-1.5 text-base font-bold transition-colors duration-200 ${
        isDark ? "text-white/81 group-hover:text-white" : "text-slate-800 group-hover:text-slate-900"
      }`}>
        {quiz.title[locale]}
      </h3>
      <p className={`mb-4 line-clamp-2 text-xs leading-relaxed ${isDark ? "text-white/30" : "text-slate-400"}`}>
        {quiz.description[locale]}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? "text-white/25" : "text-slate-300"}`}>
          <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-bold ${
            isDark ? "bg-white/5" : "bg-slate-100"
          }`}>
            {quiz.questionCount}
          </span>
          {t("study.questions")}
        </span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300 group-hover:translate-x-0.5 ${
          isDark ? "group-hover:bg-white/5" : "group-hover:bg-slate-50"
        }`}>
          <ArrowRight className={`h-3.5 w-3.5 transition-all duration-300 ${
            isDark ? "text-white/15 group-hover:text-primary-400" : "text-slate-200 group-hover:text-primary-500"
          }`} />
        </div>
      </div>
    </Link>
  );
}
