import type { QuizManifest, QuizDataFile } from "../types/quiz";

const BASE_PATH = "/quizzes";

export async function fetchManifest(): Promise<QuizManifest> {
  const response = await fetch(`${BASE_PATH}/manifest.json`);
  if (!response.ok) throw new Error("Failed to load quiz manifest");
  return response.json() as Promise<QuizManifest>;
}

export async function fetchQuizData(fileName: string): Promise<QuizDataFile> {
  const response = await fetch(`${BASE_PATH}/${fileName}`);
  if (!response.ok) throw new Error(`Failed to load quiz: ${fileName}`);
  return response.json() as Promise<QuizDataFile>;
}
