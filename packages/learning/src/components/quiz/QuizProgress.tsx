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
  const scorePercent = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${isDark ? "text-white/60" : "text-slate-600"}`}>
            {current + 1}
          </span>
          <span className={`text-xs ${isDark ? "text-white/20" : "text-slate-300"}`}>/</span>
          <span className={`text-xs ${isDark ? "text-white/20" : "text-slate-300"}`}>{total}</span>
        </div>
        <div className="flex items-center gap-3">
          {answeredCount > 0 && (
            <span className={`flex items-center gap-1.5 text-xs font-medium ${
              scorePercent >= 70 ? "text-green-400" : scorePercent >= 50 ? "text-accent-400" : "text-red-400"
            }`}>
              <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-bold ${
                scorePercent >= 70 ? "bg-green-500/10" : scorePercent >= 50 ? "bg-accent-400/10" : "bg-red-500/10"
              }`}>
                {scorePercent}%
              </span>
            </span>
          )}
          <span className="text-xs font-bold text-primary-400">
            {t("quiz.score")}: {score}/{answeredCount}
          </span>
        </div>
      </div>
      <div className={`h-1.5 w-full overflow-hidden rounded-full ${isDark ? "bg-white/6" : "bg-slate-100"}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
