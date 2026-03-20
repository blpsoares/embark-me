import type { QuizManifest, QuizDataFile } from "../types/quiz";

const STATIC_PATH = "/quizzes";
const API_URL = import.meta.env.VITE_QUIZ_API_URL as string | undefined;

async function fetchNotionManifest(): Promise<QuizManifest> {
  if (!API_URL) throw new Error("No API URL configured");
  const response = await fetch(`${API_URL}/api/quizzes`);
  if (!response.ok) throw new Error("Failed to load quizzes from API");
  return response.json() as Promise<QuizManifest>;
}

async function fetchStaticManifest(): Promise<QuizManifest> {
  const response = await fetch(`${STATIC_PATH}/manifest.json`);
  if (!response.ok) throw new Error("Failed to load quiz manifest");
  return response.json() as Promise<QuizManifest>;
}

export async function fetchManifest(): Promise<QuizManifest> {
  const results = await Promise.allSettled([
    fetchNotionManifest(),
    fetchStaticManifest(),
  ]);

  const notionQuizzes = results[0]?.status === "fulfilled" ? results[0].value.quizzes : [];
  const staticQuizzes = results[1]?.status === "fulfilled" ? results[1].value.quizzes : [];

  const quizzes = [...notionQuizzes, ...staticQuizzes];

  if (quizzes.length === 0 && results.every((r) => r.status === "rejected")) {
    throw new Error("Failed to load quizzes from any source");
  }

  return { quizzes };
}

export async function fetchQuizData(fileRef: string): Promise<QuizDataFile> {
  if (fileRef.startsWith("notion:")) {
    if (!API_URL) throw new Error("No API URL configured");
    const id = fileRef.slice("notion:".length);
    const response = await fetch(`${API_URL}/api/quizzes/${id}`);
    if (!response.ok) throw new Error(`Failed to load quiz: ${id}`);
    return response.json() as Promise<QuizDataFile>;
  }

  const response = await fetch(`${STATIC_PATH}/${fileRef}`);
  if (!response.ok) throw new Error(`Failed to load quiz: ${fileRef}`);
  return response.json() as Promise<QuizDataFile>;
}
