import { useMemo } from "react";
import { Trophy, RotateCcw, ArrowLeft, Star, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface QuizCompleteProps {
  score: number;
  total: number;
  onRetry: () => void;
}

const confettiColors = [
  "bg-primary-400", "bg-accent-400", "bg-green-400", "bg-blue-400",
  "bg-pink-400", "bg-amber-400", "bg-violet-400", "bg-cyan-400",
];

export function QuizComplete({ score, total, onRetry }: QuizCompleteProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const percentage = Math.round((score / total) * 100);

  const grade = useMemo(() => {
    if (percentage >= 90) return { color: "text-green-400", bg: "bg-green-500/10", ring: "ring-green-500/20", icon: Star, label: "quiz.grade.excellent" };
    if (percentage >= 70) return { color: "text-accent-400", bg: "bg-accent-400/10", ring: "ring-accent-400/20", icon: Trophy, label: "quiz.grade.good" };
    if (percentage >= 50) return { color: "text-blue-400", bg: "bg-blue-500/10", ring: "ring-blue-500/20", icon: TrendingUp, label: "quiz.grade.ok" };
    return { color: "text-red-400", bg: "bg-red-500/10", ring: "ring-red-500/20", icon: Target, label: "quiz.grade.retry" };
  }, [percentage]);

  const GradeIcon = grade.icon;

  const confettiPieces = useMemo(() => {
    if (percentage < 70) return [];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 0.8}s`,
      color: confettiColors[i % confettiColors.length]!,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
  }, [percentage]);

  return (
    <div className="relative">
      {/* Confetti */}
      {confettiPieces.map((p) => (
        <div
          key={p.id}
          className={`confetti-particle ${p.color}`}
          style={{
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            rotate: `${p.rotation}deg`,
            borderRadius: p.id % 3 === 0 ? "50%" : "2px",
          }}
        />
      ))}

      <div className="animate-bounce-in mx-auto max-w-md text-center">
        {/* Icon */}
        <div className={`relative mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl ${grade.bg} ring-1 ${grade.ring}`}>
          <GradeIcon className={`h-11 w-11 ${grade.color}`} />
          {percentage >= 90 && (
            <div className="animate-glow-ring absolute inset-0 rounded-3xl" />
          )}
        </div>

        <h2 className={`mb-1 text-2xl font-extrabold ${isDark ? "text-white/81" : "text-slate-800"}`}>
          {t("quiz.complete.title")}
        </h2>

        {/* Score display */}
        <div className="animate-count-up mb-2" style={{ animationDelay: "200ms" }}>
          <span className={`text-5xl font-black tabular-nums ${grade.color}`}>
            {percentage}
          </span>
          <span className={`text-xl font-bold ${isDark ? "text-white/20" : "text-slate-300"}`}>%</span>
        </div>

        <p className={`mb-8 text-sm ${isDark ? "text-white/44" : "text-slate-500"}`}>
          {t("quiz.complete.score").replace("{score}", String(score)).replace("{total}", String(total))}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:brightness-110 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            {t("quiz.complete.retry")}
          </button>
          <Link
            to="/study"
            className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:shadow-sm ${
              isDark
                ? "border-white/6 bg-surface-raised text-white/44 hover:border-white/12 hover:text-white/60"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("quiz.complete.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
