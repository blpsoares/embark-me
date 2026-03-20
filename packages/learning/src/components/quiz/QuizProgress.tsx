import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
  answeredCount: number;
}

export function QuizProgress({ current, total, score, answeredCount }: QuizProgressProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const progressPercent = ((current + 1) / total) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-xs font-semibold ${isDark ? "text-white/30" : "text-slate-400"}`}>
          {current + 1} / {total}
        </span>
        <span className="text-xs font-bold text-primary-400">
          {t("quiz.score")}: {score}/{answeredCount}
        </span>
      </div>
      <div className={`h-1 w-full overflow-hidden rounded-full ${isDark ? "bg-white/6" : "bg-slate-100"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
