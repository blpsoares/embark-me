import { useState, useCallback, useEffect, useMemo } from "react";
import type { WordSearchWord, WordSearchDifficulty } from "../types/quiz";
import { generateWordSearchGrid, getWordCells, type WordSearchGrid, type PlacedWord } from "../utils/wordSearchGenerator";

interface WordSearchProgress {
  difficulty: WordSearchDifficulty;
  wordCount: number;
  foundWords: string[];
  seed: number;
}

function getStorageKey(quizId: string): string {
  return `ws-progress-${quizId}`;
}

function loadProgress(quizId: string): WordSearchProgress | null {
  try {
    const raw = localStorage.getItem(getStorageKey(quizId));
    if (!raw) return null;
    return JSON.parse(raw) as WordSearchProgress;
  } catch {
    return null;
  }
}

function saveProgress(quizId: string, progress: WordSearchProgress): void {
  localStorage.setItem(getStorageKey(quizId), JSON.stringify(progress));
}

export function useWordSearchGame(
  quizId: string,
  allWords: WordSearchWord[],
  initialDifficulty?: WordSearchDifficulty,
  initialWordCount?: number,
) {
  const saved = useMemo(() => loadProgress(quizId), [quizId]);

  const [difficulty, setDifficulty] = useState<WordSearchDifficulty>(
    saved?.difficulty ?? initialDifficulty ?? "normal",
  );
  const [wordCount, setWordCount] = useState(
    saved?.wordCount ?? initialWordCount ?? Math.min(allWords.length, 10),
  );
  const [seed, setSeed] = useState(saved?.seed ?? Math.floor(Math.random() * 1000000));
  const [foundWords, setFoundWords] = useState<Set<string>>(
    new Set(saved?.foundWords ?? []),
  );
  const [started, setStarted] = useState(saved !== null);
  const [revealedWord, setRevealedWord] = useState<string | null>(null);

  const selectedWords = useMemo(() => allWords.slice(0, wordCount), [allWords, wordCount]);

  const gridData: WordSearchGrid | null = useMemo(() => {
    if (!started) return null;
    return generateWordSearchGrid(selectedWords, difficulty, seed);
  }, [started, selectedWords, difficulty, seed]);

  // Save progress on changes
  useEffect(() => {
    if (!started) return;
    saveProgress(quizId, {
      difficulty,
      wordCount,
      foundWords: [...foundWords],
      seed,
    });
  }, [started, quizId, difficulty, wordCount, foundWords, seed]);

  const markFound = useCallback((word: string) => {
    setFoundWords((prev) => {
      const next = new Set(prev);
      next.add(word);
      return next;
    });
  }, []);

  const isWordFound = useCallback((word: string) => foundWords.has(word), [foundWords]);

  const startGame = useCallback((diff: WordSearchDifficulty, count: number) => {
    const newSeed = Math.floor(Math.random() * 1000000);
    setDifficulty(diff);
    setWordCount(count);
    setSeed(newSeed);
    setFoundWords(new Set());
    setStarted(true);
    setRevealedWord(null);
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(getStorageKey(quizId));
    setStarted(false);
    setFoundWords(new Set());
    setRevealedWord(null);
  }, [quizId]);

  const revealWord = useCallback((word: string) => {
    setRevealedWord((prev) => (prev === word ? null : word));
  }, []);

  const getRevealedCells = useCallback((): Set<string> => {
    if (!revealedWord || !gridData) return new Set();
    const placed = gridData.placedWords.find((p) => p.word === revealedWord);
    if (!placed) return new Set();
    const cells = getWordCells(placed);
    return new Set(cells.map(([r, c]) => `${r},${c}`));
  }, [revealedWord, gridData]);

  const getFoundCells = useCallback((): Map<string, string> => {
    if (!gridData) return new Map();
    const cells = new Map<string, string>();
    for (const placed of gridData.placedWords) {
      if (foundWords.has(placed.word)) {
        const wordCells = getWordCells(placed);
        for (const [r, c] of wordCells) {
          cells.set(`${r},${c}`, placed.word);
        }
      }
    }
    return cells;
  }, [gridData, foundWords]);

  const isComplete = gridData !== null && foundWords.size === gridData.placedWords.length;

  return {
    difficulty,
    wordCount,
    seed,
    started,
    gridData,
    foundWords,
    revealedWord,
    isComplete,
    selectedWords,
    allWordsCount: allWords.length,
    markFound,
    isWordFound,
    startGame,
    resetGame,
    revealWord,
    getRevealedCells,
    getFoundCells,
  };
}
