import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Layers } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import { QuizProgress } from "./QuizProgress";
import type { LocalizedText } from "../../types/quiz";

interface QuizShellProps {
  title: LocalizedText;
  currentIndex: number;
  total: number;
  score: number;
  answeredCount: number;
  children: ReactNode;
}

export function QuizShell({ title, currentIndex, total, score, answeredCount, children }: QuizShellProps) {
  const { isDark } = useTheme();
  const { locale } = useI18n();

  return (
    <div className="relative overflow-hidden">
      <div className={`absolute inset-0 ${
        isDark
          ? "bg-gradient-to-b from-primary-950/15 to-transparent"
          : "bg-gradient-to-b from-primary-50/40 to-transparent"
      }`} />

      <div className="relative mx-auto max-w-3xl px-6 py-8 sm:py-12">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
              <Layers className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
                {title[locale]}
              </h2>
              <p className={`text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {total} {locale === "pt" ? "perguntas" : "questions"}
              </p>
            </div>
          </div>
          <Link
            to="/study"
            className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-sm transition-all hover:shadow-md ${
              isDark
                ? "border-white/6 bg-surface-raised text-white/44 hover:border-white/10 hover:text-white/60"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {locale === "pt" ? "Voltar" : "Back"}
          </Link>
        </div>

        <QuizProgress
          current={currentIndex}
          total={total}
          score={score}
          answeredCount={answeredCount}
        />

        {children}
      </div>
    </div>
  );
}
