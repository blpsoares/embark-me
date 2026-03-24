import { QuizCard } from "./QuizCard";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import { SearchX } from "lucide-react";
import type { QuizManifestEntry } from "../../types/quiz";

interface QuizGridProps {
  quizzes: QuizManifestEntry[];
}

export function QuizGrid({ quizzes }: QuizGridProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();

  if (quizzes.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-16">
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
          isDark ? "bg-white/5" : "bg-slate-100"
        }`}>
          <SearchX className={`h-6 w-6 ${isDark ? "text-white/20" : "text-slate-300"}`} />
        </div>
        <p className={`text-sm font-medium ${isDark ? "text-white/30" : "text-slate-400"}`}>
          {t("study.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}
