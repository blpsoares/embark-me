import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import type { FillBlankQuestion, LocalizedText } from "../../types/quiz";
import { useQuizSession } from "../../hooks/useQuizSession";
import { QuizShell } from "../quiz/QuizShell";
import { QuizComplete } from "../quiz/QuizComplete";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface FillBlankViewerProps {
  questions: FillBlankQuestion[];
  title: LocalizedText;
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

export function FillBlankViewer({ questions, title }: FillBlankViewerProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const session = useQuizSession(questions.length);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);

  const question = questions[session.currentIndex];
  if (!question) return null;

  if (session.isComplete) {
    return (
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"}`} />
        <div className="relative mx-auto max-w-3xl px-6 py-16">
          <QuizComplete score={session.score} total={session.total} onRetry={() => { session.reset(); setInput(""); setRevealed(false); }} />
        </div>
      </div>
    );
  }

  const alreadyAnswered = session.hasAnswered(session.currentIndex);
  const isRevealed = alreadyAnswered || revealed;

  const handleCheck = () => {
    if (!input.trim() || alreadyAnswered) return;
    const allAcceptable = [question.resposta, ...(question.alternativas ?? [])];
    const isCorrect = allAcceptable.some((a) => normalize(a) === normalize(input));
    session.answer(session.currentIndex, input, isCorrect);
    setLastCorrect(isCorrect);
    setRevealed(true);
  };

  const handleNext = () => {
    session.next();
    setInput("");
    setRevealed(false);
  };

  const handlePrev = () => {
    session.prev();
    setInput("");
    setRevealed(false);
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

      {/* Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={alreadyAnswered ? String(session.getAnswer(session.currentIndex) ?? "") : input}
            onChange={(e) => !alreadyAnswered && setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            disabled={alreadyAnswered}
            placeholder={t("fb.placeholder")}
            className={`w-full rounded-xl border px-5 py-4 text-base font-medium outline-none transition-all ${
              isRevealed
                ? lastCorrect || (alreadyAnswered && session.getAnswer(session.currentIndex) !== undefined)
                  ? "border-green-500/40 bg-green-500/5"
                  : "border-red-500/40 bg-red-500/5"
                : isDark
                  ? "border-white/6 bg-surface-raised text-white/81 placeholder-white/20 focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20"
                  : "border-slate-200 bg-white text-slate-800 placeholder-slate-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-400/20"
            }`}
          />
          {isRevealed && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {lastCorrect ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
          )}
        </div>

        {isRevealed && !lastCorrect && (
          <p className={`animate-fade-in mt-3 text-sm ${isDark ? "text-white/44" : "text-slate-500"}`}>
            {t("fb.incorrect")} <span className="font-bold text-green-400">{question.resposta}</span>
          </p>
        )}
        {isRevealed && lastCorrect && (
          <p className="animate-fade-in mt-3 text-sm font-semibold text-green-400">
            {t("fb.correct")}
          </p>
        )}
      </div>

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

        {!isRevealed ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!input.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-40"
          >
            {t("quiz.check")}
          </button>
        ) : (
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
