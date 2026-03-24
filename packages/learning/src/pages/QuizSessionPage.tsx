import { useEffect, useState } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
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
  const { quizzes } = useQuizManifest();
  const [quizData, setQuizData] = useState<QuizDataFile | null>(null);
  const [title, setTitle] = useState<LocalizedText>({ pt: "", en: "" });
  const [isLoading, setIsLoading] = useState(true);
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
      if (quizzes.length > 0) setIsLoading(false);
      return;
    }

    setTitle(entry.title);

    async function load() {
      try {
        const data = await fetchQuizData(entry!.file);
        setQuizData(data);
      } catch {
        // fail silently, will show redirect
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
