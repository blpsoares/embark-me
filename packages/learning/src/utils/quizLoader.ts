import type { QuizManifest, QuizDataFile } from "../types/quiz";

const API_URL = (import.meta.env.VITE_QUIZ_API_URL as string) || "";

// ── In-memory cache ──

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let manifestCache: CacheEntry<QuizManifest> | null = null;
const quizCache = new Map<string, CacheEntry<QuizDataFile>>();

function isFresh<T>(entry: CacheEntry<T> | null | undefined): entry is CacheEntry<T> {
  return entry !== null && entry !== undefined && Date.now() - entry.timestamp < CACHE_TTL;
}

// ── API calls ──

function buildUrl(path: string, noCache = false): string {
  const url = `${API_URL}${path}`;
  return noCache ? `${url}?nocache=true` : url;
}

export async function fetchManifest(noCache = false): Promise<QuizManifest> {
  if (!noCache && isFresh(manifestCache)) {
    return manifestCache.data;
  }

  const response = await fetch(buildUrl("/api/quizzes", noCache));
  if (!response.ok) throw new Error("Failed to load quizzes from API");
  const data = await response.json() as QuizManifest;

  manifestCache = { data, timestamp: Date.now() };
  return data;
}

export async function fetchQuizData(fileRef: string, noCache = false): Promise<QuizDataFile> {
  const id = fileRef.startsWith("notion:") ? fileRef.slice("notion:".length) : fileRef;

  if (!noCache) {
    const cached = quizCache.get(id);
    if (isFresh(cached)) {
      return cached.data;
    }
  }

  const response = await fetch(buildUrl(`/api/quizzes/${id}`, noCache));
  if (!response.ok) throw new Error(`Failed to load quiz: ${id}`);
  const data = await response.json() as QuizDataFile;

  quizCache.set(id, { data, timestamp: Date.now() });
  return data;
}

export function invalidateManifestCache(): void {
  manifestCache = null;
}

export function invalidateQuizCache(id?: string): void {
  if (id) {
    quizCache.delete(id);
  } else {
    quizCache.clear();
  }
}
