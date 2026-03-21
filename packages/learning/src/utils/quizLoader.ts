import type { QuizManifest, QuizDataFile } from "../types/quiz";

const API_URL = (import.meta.env.VITE_QUIZ_API_URL as string) || "";

export async function fetchManifest(): Promise<QuizManifest> {
  const response = await fetch(`${API_URL}/api/quizzes`);
  if (!response.ok) throw new Error("Failed to load quizzes from API");
  return response.json() as Promise<QuizManifest>;
}

export async function fetchQuizData(fileRef: string): Promise<QuizDataFile> {
  const id = fileRef.startsWith("notion:") ? fileRef.slice("notion:".length) : fileRef;
  const response = await fetch(`${API_URL}/api/quizzes/${id}`);
  if (!response.ok) throw new Error(`Failed to load quiz: ${id}`);
  return response.json() as Promise<QuizDataFile>;
}
