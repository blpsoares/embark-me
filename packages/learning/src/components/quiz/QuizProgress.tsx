import { CheckCircle2, XCircle } from "lucide-react";
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
  const errors = answeredCount - score;

  return (
    <div className="mb-8">
      <div className="mb-2.5 flex items-center justify-between">
        {/* Left: question counter */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold tabular-nums ${isDark ? "text-white/60" : "text-slate-600"}`}>
            {current + 1}
          </span>
          <span className={`text-xs ${isDark ? "text-white/20" : "text-slate-300"}`}>/ {total}</span>
        </div>

        {/* Right: score pills */}
        {answeredCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-green-500/10 px-2 py-1">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              <span className="text-xs font-bold tabular-nums text-green-400">{score}</span>
            </div>
            <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${
              errors > 0 ? "bg-red-500/10" : isDark ? "bg-white/4" : "bg-slate-50"
            }`}>
              <XCircle className={`h-3 w-3 ${errors > 0 ? "text-red-400" : isDark ? "text-white/15" : "text-slate-200"}`} />
              <span className={`text-xs font-bold tabular-nums ${
                errors > 0 ? "text-red-400" : isDark ? "text-white/15" : "text-slate-200"
              }`}>{errors}</span>
            </div>
          </div>
        )}
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
