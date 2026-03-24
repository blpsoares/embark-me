import type { QuizManifest, QuizDataFile } from "../types/quiz";

const API_URL = (import.meta.env.VITE_QUIZ_API_URL as string) || "";

function buildUrl(path: string, noCache = false): string {
  const url = `${API_URL}${path}`;
  return noCache ? `${url}?nocache=true` : url;
}

export async function fetchManifest(noCache = false): Promise<QuizManifest> {
  const response = await fetch(buildUrl("/api/quizzes", noCache));
  if (!response.ok) throw new Error("Failed to load quizzes from API");
  return response.json() as Promise<QuizManifest>;
}

export async function fetchQuizData(fileRef: string, noCache = false): Promise<QuizDataFile> {
  const id = fileRef.startsWith("notion:") ? fileRef.slice("notion:".length) : fileRef;
  const response = await fetch(buildUrl(`/api/quizzes/${id}`, noCache));
  if (!response.ok) throw new Error(`Failed to load quiz: ${id}`);
  return response.json() as Promise<QuizDataFile>;
}
