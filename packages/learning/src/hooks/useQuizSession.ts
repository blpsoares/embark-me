import { useCallback, useState } from "react";

interface QuizSessionState {
  currentIndex: number;
  answers: Map<number, string | boolean>;
  score: number;
  total: number;
  isComplete: boolean;
}

export function useQuizSession(totalQuestions: number) {
  const [state, setState] = useState<QuizSessionState>({
    currentIndex: 0,
    answers: new Map(),
    score: 0,
    total: totalQuestions,
    isComplete: false,
  });

  const answer = useCallback((index: number, value: string | boolean, isCorrect: boolean) => {
    setState((prev) => {
      if (prev.answers.has(index)) return prev;
      const answers = new Map(prev.answers);
      answers.set(index, value);
      const score = prev.score + (isCorrect ? 1 : 0);
      const isComplete = answers.size === prev.total;
      return { ...prev, answers, score, isComplete };
    });
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= prev.total - 1) return prev;
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const prev = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev;
      return { ...prev, currentIndex: prev.currentIndex - 1 };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      answers: new Map(),
      score: 0,
      total: totalQuestions,
      isComplete: false,
    });
  }, [totalQuestions]);

  const hasAnswered = useCallback((index: number) => {
    return state.answers.has(index);
  }, [state.answers]);

  const getAnswer = useCallback((index: number) => {
    return state.answers.get(index);
  }, [state.answers]);

  return {
    ...state,
    answer,
    next,
    prev,
    reset,
    hasAnswered,
    getAnswer,
  };
}
