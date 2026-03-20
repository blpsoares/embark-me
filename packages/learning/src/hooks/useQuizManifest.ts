import { useEffect, useState } from "react";
import type { QuizManifestEntry } from "../types/quiz";
import { fetchManifest } from "../utils/quizLoader";

interface UseQuizManifestResult {
  quizzes: QuizManifestEntry[];
  isLoading: boolean;
  error: string | null;
}

export function useQuizManifest(): UseQuizManifestResult {
  const [quizzes, setQuizzes] = useState<QuizManifestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const manifest = await fetchManifest();
        if (!cancelled) {
          setQuizzes(manifest.quizzes);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load quizzes");
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  return { quizzes, isLoading, error };
}
