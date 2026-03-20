import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface QuizCompleteProps {
  score: number;
  total: number;
  onRetry: () => void;
}

export function QuizComplete({ score, total, onRetry }: QuizCompleteProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const percentage = Math.round((score / total) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { color: "text-green-400", bg: "bg-green-500/10" };
    if (percentage >= 70) return { color: "text-accent-400", bg: "bg-accent-400/10" };
    if (percentage >= 50) return { color: "text-blue-400", bg: "bg-blue-500/10" };
    return { color: "text-red-400", bg: "bg-red-500/10" };
  };

  const grade = getGrade();

  return (
    <div className="animate-scale-in mx-auto max-w-md text-center">
      <div className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl ${grade.bg}`}>
        <Trophy className={`h-10 w-10 ${grade.color}`} />
      </div>

      <h2 className={`mb-2 text-2xl font-extrabold ${isDark ? "text-white/81" : "text-slate-800"}`}>
        {t("quiz.complete.title")}
      </h2>

      <p className={`mb-2 text-lg font-bold ${grade.color}`}>
        {percentage}%
      </p>

      <p className={`mb-8 text-sm ${isDark ? "text-white/44" : "text-slate-500"}`}>
        {t("quiz.complete.score").replace("{score}", String(score)).replace("{total}", String(total))}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          {t("quiz.complete.retry")}
        </button>
        <Link
          to="/study"
          className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all ${
            isDark
              ? "border-white/6 bg-surface-raised text-white/44 hover:text-white/60"
              : "border-slate-200 bg-white text-slate-500 hover:text-slate-700"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("quiz.complete.back")}
        </Link>
      </div>
    </div>
  );
}
