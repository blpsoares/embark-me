import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Code, Cloud, Server, Sparkles, Database, Wind, FileText, MessageCircle } from "lucide-react";
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
};

const typeBadgeColors: Record<QuizType, string> = {
  flashcard: "bg-primary-500/10 text-primary-400 ring-primary-500/20",
  "multiple-choice": "bg-accent-400/10 text-accent-500 ring-accent-400/20",
  "true-false": "bg-green-500/10 text-green-400 ring-green-500/20",
  "fill-blank": "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  "match-pairs": "bg-pink-500/10 text-pink-400 ring-pink-500/20",
};

interface QuizCardProps {
  quiz: QuizManifestEntry;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const { isDark } = useTheme();
  const { t, locale } = useI18n();
  const Icon = iconMap[quiz.icon] ?? BookOpen;
  const badgeColor = typeBadgeColors[quiz.type];

  return (
    <Link
      to={`/study/${quiz.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isDark
          ? "border-white/6 bg-surface-raised/80 hover:border-white/12 hover:shadow-black/30"
          : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-slate-200/50"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          isDark ? "bg-primary-500/10" : "bg-primary-50"
        }`}>
          <Icon className="h-5 w-5 text-primary-400" />
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${badgeColor}`}>
          {t(`quizType.${quiz.type}`)}
        </span>
      </div>

      <h3 className={`mb-1.5 text-base font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
        {quiz.title[locale]}
      </h3>
      <p className={`mb-4 text-xs leading-relaxed ${isDark ? "text-white/30" : "text-slate-400"}`}>
        {quiz.description[locale]}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className={`text-xs font-medium ${isDark ? "text-white/20" : "text-slate-300"}`}>
          {quiz.questionCount} {t("study.questions")}
        </span>
        <ArrowRight className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
          isDark ? "text-white/20 group-hover:text-primary-400" : "text-slate-300 group-hover:text-primary-500"
        }`} />
      </div>
    </Link>
  );
}
