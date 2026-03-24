import { useEffect, useState } from "react";
import { useParams, useLocation, Navigate, Link } from "react-router-dom";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useI18n } from "../contexts/I18nContext";
import { useQuizManifest } from "../hooks/useQuizManifest";
import { fetchQuizData } from "../utils/quizLoader";
import type { QuizDataFile, MultipleChoiceQuestion, TrueFalseQuestion, FillBlankQuestion, MatchPairsQuestion, WordSearchQuestion, CrosswordQuestion, LocalizedText } from "../types/quiz";
import type { Flashcard } from "../types/flashcard";
import { FlashcardViewer } from "../components/flashcard/FlashcardViewer";
import { MultipleChoiceViewer } from "../components/multiple-choice/MultipleChoiceViewer";
import { TrueFalseViewer } from "../components/true-false/TrueFalseViewer";
import { FillBlankViewer } from "../components/fill-blank/FillBlankViewer";
import { MatchPairsViewer } from "../components/match-pairs/MatchPairsViewer";
import { WordSearchViewer } from "../components/word-search/WordSearchViewer";
import { CrosswordViewer } from "../components/crossword/CrosswordViewer";

interface CustomState {
  quizData?: QuizDataFile;
}

export function QuizSessionPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const { isDark } = useTheme();
  const { locale } = useI18n();
  const { quizzes, isLoading: manifestLoading } = useQuizManifest();
  const [quizData, setQuizData] = useState<QuizDataFile | null>(null);
  const [title, setTitle] = useState<LocalizedText>({ pt: "", en: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (quizId === "custom") {
      const state = location.state as CustomState | null;
      if (state?.quizData) {
        setQuizData(state.quizData);
        setTitle({ pt: "Quiz Personalizado", en: "Custom Quiz" });
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      return;
    }

    const entry = quizzes.find((q) => q.id === quizId);
    if (!entry) {
      // Wait for manifest to finish loading before giving up
      if (!manifestLoading) setIsLoading(false);
      return;
    }

    setTitle(entry.title);

    async function load() {
      try {
        const data = await fetchQuizData(entry!.file);
        setQuizData(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setLoadError(message);
        console.error("[QuizSessionPage] failed to load quiz:", quizId, "file:", entry!.file, err);
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [quizId, quizzes, location.state]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className={`h-8 w-8 animate-spin ${isDark ? "text-white/20" : "text-slate-300"}`} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6">
        <div className={`w-full max-w-md rounded-2xl border p-8 text-center ${
          isDark ? "border-red-500/20 bg-red-500/5" : "border-red-200 bg-red-50"
        }`}>
          <AlertTriangle className={`mx-auto mb-4 h-10 w-10 ${isDark ? "text-red-400" : "text-red-500"}`} />
          <h2 className={`mb-2 text-lg font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
            {locale === "pt" ? "Erro ao carregar quiz" : "Failed to load quiz"}
          </h2>
          <p className={`mb-1 text-sm font-mono ${isDark ? "text-red-300/70" : "text-red-600"}`}>
            {loadError}
          </p>
          <p className={`mb-6 text-xs ${isDark ? "text-white/25" : "text-slate-400"}`}>
            ID: {quizId}
          </p>
          <Link
            to="/study"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {locale === "pt" ? "Voltar" : "Back to study"}
          </Link>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return <Navigate to="/study" replace />;
  }

  const handleReset = () => setResetKey((k) => k + 1);

  switch (quizData.type) {
    case "flashcard": {
      const cards: Flashcard[] = (quizData.questions as Array<{ pergunta: string; resposta: string }>).map((q) => ({
        id: crypto.randomUUID(),
        pergunta: q.pergunta,
        resposta: q.resposta,
      }));
      return <FlashcardViewer key={resetKey} cards={cards} onReset={handleReset} />;
    }
    case "multiple-choice":
      return <MultipleChoiceViewer key={resetKey} questions={quizData.questions as MultipleChoiceQuestion[]} title={title} />;
    case "true-false":
      return <TrueFalseViewer key={resetKey} questions={quizData.questions as TrueFalseQuestion[]} title={title} />;
    case "fill-blank":
      return <FillBlankViewer key={resetKey} questions={quizData.questions as FillBlankQuestion[]} title={title} />;
    case "match-pairs":
      return <MatchPairsViewer key={resetKey} questions={quizData.questions as MatchPairsQuestion[]} title={title} />;
    case "word-search":
      return <WordSearchViewer key={resetKey} questions={quizData.questions as WordSearchQuestion[]} title={title} quizId={quizId ?? "unknown"} />;
    case "crossword":
      return <CrosswordViewer key={resetKey} questions={quizData.questions as CrosswordQuestion[]} title={title} quizId={quizId ?? "unknown"} />;
    default:
      return <Navigate to="/study" replace />;
  }
}

