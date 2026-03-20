import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import type { MultipleChoiceQuestion, LocalizedText } from "../../types/quiz";
import { useQuizSession } from "../../hooks/useQuizSession";
import { QuizShell } from "../quiz/QuizShell";
import { QuizComplete } from "../quiz/QuizComplete";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface MultipleChoiceViewerProps {
  questions: MultipleChoiceQuestion[];
  title: LocalizedText;
}

export function MultipleChoiceViewer({ questions, title }: MultipleChoiceViewerProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const session = useQuizSession(questions.length);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const question = questions[session.currentIndex];
  if (!question) return null;

  if (session.isComplete) {
    return (
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"}`} />
        <div className="relative mx-auto max-w-3xl px-6 py-16">
          <QuizComplete score={session.score} total={session.total} onRetry={() => { session.reset(); setSelected(null); setRevealed(false); }} />
        </div>
      </div>
    );
  }

  const alreadyAnswered = session.hasAnswered(session.currentIndex);
  const previousAnswer = session.getAnswer(session.currentIndex) as string | undefined;

  const handleSelect = (opcao: string) => {
    if (alreadyAnswered) return;
    setSelected(opcao);
  };

  const handleConfirm = () => {
    if (!selected || alreadyAnswered) return;
    const isCorrect = selected.toUpperCase() === question.resposta.toUpperCase();
    session.answer(session.currentIndex, selected, isCorrect);
    setRevealed(true);
  };

  const handleNext = () => {
    session.next();
    setSelected(null);
    setRevealed(false);
  };

  const handlePrev = () => {
    session.prev();
    setSelected(null);
    setRevealed(false);
  };

  const activeSelection = alreadyAnswered ? previousAnswer : selected;
  const isRevealed = alreadyAnswered || revealed;

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

      {/* Options */}
      <div className="mb-8 space-y-3">
        {question.opcoes.map((opcao) => {
          const isThis = activeSelection?.toUpperCase() === opcao.opcao.toUpperCase();
          const isCorrect = opcao.opcao.toUpperCase() === question.resposta.toUpperCase();
          let optionStyle = "";

          if (isRevealed) {
            if (isCorrect) {
              optionStyle = "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/20";
            } else if (isThis && !isCorrect) {
              optionStyle = "border-red-500/40 bg-red-500/10 ring-1 ring-red-500/20";
            } else {
              optionStyle = isDark ? "border-white/4 bg-white/2 opacity-50" : "border-slate-100 bg-slate-50/50 opacity-50";
            }
          } else if (isThis) {
            optionStyle = "border-primary-500/40 bg-primary-500/10 ring-1 ring-primary-500/20";
          } else {
            optionStyle = isDark
              ? "border-white/6 bg-surface-raised/50 hover:border-white/12 hover:bg-surface-raised"
              : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50";
          }

          return (
            <button
              key={opcao.opcao}
              type="button"
              onClick={() => handleSelect(opcao.opcao)}
              disabled={alreadyAnswered}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${optionStyle} ${
                !alreadyAnswered ? "cursor-pointer active:scale-[0.99]" : "cursor-default"
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                isRevealed && isCorrect
                  ? "bg-green-500/20 text-green-400"
                  : isRevealed && isThis && !isCorrect
                    ? "bg-red-500/20 text-red-400"
                    : isThis
                      ? "bg-primary-500/20 text-primary-400"
                      : isDark ? "bg-white/5 text-white/30" : "bg-slate-100 text-slate-400"
              }`}>
                {opcao.opcao}
              </span>
              <span className={`text-sm font-medium ${isDark ? "text-white/70" : "text-slate-700"}`}>
                {opcao.descricao}
              </span>
              {isRevealed && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-green-400" />}
              {isRevealed && isThis && !isCorrect && <XCircle className="ml-auto h-5 w-5 shrink-0 text-red-400" />}
            </button>
          );
        })}
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
            onClick={handleConfirm}
            disabled={!selected}
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
