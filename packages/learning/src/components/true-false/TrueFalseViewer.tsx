import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X, Info } from "lucide-react";
import type { TrueFalseQuestion, LocalizedText } from "../../types/quiz";
import { useQuizSession } from "../../hooks/useQuizSession";
import { QuizShell } from "../quiz/QuizShell";
import { QuizComplete } from "../quiz/QuizComplete";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface TrueFalseViewerProps {
  questions: TrueFalseQuestion[];
  title: LocalizedText;
}

export function TrueFalseViewer({ questions, title }: TrueFalseViewerProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const session = useQuizSession(questions.length);
  const [revealed, setRevealed] = useState(false);

  const question = questions[session.currentIndex];
  if (!question) return null;

  if (session.isComplete) {
    return (
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"}`} />
        <div className="relative mx-auto max-w-3xl px-6 py-16">
          <QuizComplete score={session.score} total={session.total} onRetry={() => { session.reset(); setRevealed(false); }} />
        </div>
      </div>
    );
  }

  const alreadyAnswered = session.hasAnswered(session.currentIndex);
  const previousAnswer = session.getAnswer(session.currentIndex) as boolean | undefined;
  const isRevealed = alreadyAnswered || revealed;

  const handleAnswer = (value: boolean) => {
    if (alreadyAnswered) return;
    const isCorrect = value === question.resposta;
    session.answer(session.currentIndex, value, isCorrect);
    setRevealed(true);
  };

  const handleNext = () => {
    session.next();
    setRevealed(false);
  };

  const handlePrev = () => {
    session.prev();
    setRevealed(false);
  };

  const getBtnStyle = (value: boolean) => {
    if (!isRevealed) {
      return isDark
        ? "border-white/6 bg-surface-raised/50 hover:border-white/12 hover:bg-surface-raised"
        : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50";
    }
    const isCorrectAnswer = question.resposta === value;
    const wasSelected = previousAnswer === value;
    if (isCorrectAnswer) return "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/20";
    if (wasSelected && !isCorrectAnswer) return "border-red-500/40 bg-red-500/10 ring-1 ring-red-500/20";
    return isDark ? "border-white/4 bg-white/2 opacity-50" : "border-slate-100 bg-slate-50/50 opacity-50";
  };

  return (
    <QuizShell
      title={title}
      currentIndex={session.currentIndex}
      total={session.total}
      score={session.score}
      answeredCount={session.answers.size}
    >
      {/* Question */}
      <div className={`mb-8 rounded-2xl border p-6 sm:p-8 ${
        isDark ? "border-white/6 bg-surface-raised/80" : "border-slate-200/80 bg-white"
      }`}>
        <p className={`text-center text-lg font-semibold leading-relaxed sm:text-xl ${
          isDark ? "text-white/81" : "text-slate-800"
        }`}>
          {question.pergunta}
        </p>
      </div>

      {/* True/False buttons */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={alreadyAnswered}
          className={`flex items-center justify-center gap-3 rounded-xl border p-5 text-base font-bold transition-all active:scale-[0.98] ${getBtnStyle(true)} ${
            !alreadyAnswered ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <Check className="h-5 w-5 text-green-400" />
          <span className={isDark ? "text-white/70" : "text-slate-700"}>{t("tf.true")}</span>
        </button>
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={alreadyAnswered}
          className={`flex items-center justify-center gap-3 rounded-xl border p-5 text-base font-bold transition-all active:scale-[0.98] ${getBtnStyle(false)} ${
            !alreadyAnswered ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <X className="h-5 w-5 text-red-400" />
          <span className={isDark ? "text-white/70" : "text-slate-700"}>{t("tf.false")}</span>
        </button>
      </div>

      {/* Explanation */}
      {isRevealed && question.explicacao && (
        <div className={`animate-fade-in-up mb-8 flex items-start gap-3 rounded-xl border p-4 ${
          isDark ? "border-blue-500/20 bg-blue-500/5" : "border-blue-200 bg-blue-50/80"
        }`}>
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
          <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-600"}`}>
            {question.explicacao}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={session.currentIndex === 0}
          className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-all active:scale-95 disabled:opacity-30 ${
            isDark
              ? "border-white/6 bg-surface-raised text-white/44 hover:border-white/10"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {isRevealed && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            {t("quiz.next")}
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={session.currentIndex >= session.total - 1}
          className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-all active:scale-95 disabled:opacity-30 ${
            isDark
              ? "border-white/6 bg-surface-raised text-white/44 hover:border-white/10"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </QuizShell>
  );
}
