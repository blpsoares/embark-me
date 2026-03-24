import { useState, useCallback, useEffect, useMemo } from "react";
import type { CrosswordClue, CrosswordDifficulty } from "../types/quiz";
import { generateCrosswordLayout, getEntryCells, type CrosswordLayout, type CrosswordEntry } from "../utils/crosswordGenerator";

interface CrosswordProgress {
  difficulty: CrosswordDifficulty;
  filledCells: Record<string, string>;
  revealedWords: string[];
  hintedCells: string[];
}

function getStorageKey(quizId: string): string {
  return `cw-progress-${quizId}`;
}

function loadProgress(quizId: string): CrosswordProgress | null {
  try {
    const raw = localStorage.getItem(getStorageKey(quizId));
    if (!raw) return null;
    return JSON.parse(raw) as CrosswordProgress;
  } catch {
    return null;
  }
}

function saveProgress(quizId: string, progress: CrosswordProgress): void {
  localStorage.setItem(getStorageKey(quizId), JSON.stringify(progress));
}

export function useCrosswordGame(
  quizId: string,
  allClues: CrosswordClue[],
  initialDifficulty?: CrosswordDifficulty,
) {
  const saved = useMemo(() => loadProgress(quizId), [quizId]);

  const [difficulty, setDifficulty] = useState<CrosswordDifficulty>(
    saved?.difficulty ?? initialDifficulty ?? "normal",
  );
  const [filledCells, setFilledCells] = useState<Map<string, string>>(
    new Map(Object.entries(saved?.filledCells ?? {})),
  );
  const [revealedWords, setRevealedWords] = useState<Set<string>>(
    new Set(saved?.revealedWords ?? []),
  );
  const [hintedCells, setHintedCells] = useState<Set<string>>(
    new Set(saved?.hintedCells ?? []),
  );
  const [started, setStarted] = useState(saved !== null);
  const [activeEntry, setActiveEntry] = useState<CrosswordEntry | null>(null);
  const [activeClueDropdown, setActiveClueDropdown] = useState<number | null>(null);

  const layout: CrosswordLayout | null = useMemo(() => {
    if (!started) return null;
    return generateCrosswordLayout(allClues, difficulty);
  }, [started, allClues, difficulty]);

  // Save progress
  useEffect(() => {
    if (!started) return;
    saveProgress(quizId, {
      difficulty,
      filledCells: Object.fromEntries(filledCells),
      revealedWords: [...revealedWords],
      hintedCells: [...hintedCells],
    });
  }, [started, quizId, difficulty, filledCells, revealedWords, hintedCells]);

  const setCellValue = useCallback((row: number, col: number, value: string) => {
    setFilledCells((prev) => {
      const next = new Map(prev);
      const key = `${row},${col}`;
      if (value === "") {
        next.delete(key);
      } else {
        next.set(key, value.toUpperCase());
      }
      return next;
    });
  }, []);

  const getCellValue = useCallback((row: number, col: number): string => {
    return filledCells.get(`${row},${col}`) ?? "";
  }, [filledCells]);

  const revealWord = useCallback((entry: CrosswordEntry) => {
    setRevealedWords((prev) => {
      const next = new Set(prev);
      next.add(`${entry.number}-${entry.direction}`);
      return next;
    });
    const cells = getEntryCells(entry);
    setFilledCells((prev) => {
      const next = new Map(prev);
      for (let i = 0; i < cells.length; i++) {
        const [r, c] = cells[i]!;
        next.set(`${r},${c}`, entry.word[i]!);
      }
      return next;
    });
    setActiveClueDropdown(null);
  }, []);

  const giveHint = useCallback((entry: CrosswordEntry) => {
    const cells = getEntryCells(entry);
    const emptyIndices: number[] = [];
    for (let i = 0; i < cells.length; i++) {
      const [r, c] = cells[i]!;
      const key = `${r},${c}`;
      const current = filledCells.get(key);
      if (!current || current !== entry.word[i]) {
        emptyIndices.push(i);
      }
    }
    if (emptyIndices.length === 0) return;

    const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]!;
    const [r, c] = cells[randomIdx]!;
    const key = `${r},${c}`;

    setFilledCells((prev) => {
      const next = new Map(prev);
      next.set(key, entry.word[randomIdx]!);
      return next;
    });
    setHintedCells((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setActiveClueDropdown(null);
  }, [filledCells]);

  const isCellCorrect = useCallback((row: number, col: number): boolean | null => {
    const value = filledCells.get(`${row},${col}`);
    if (!value || !layout) return null;
    // Find entry containing this cell
    for (const entry of layout.entries) {
      const cells = getEntryCells(entry);
      for (let i = 0; i < cells.length; i++) {
        const [r, c] = cells[i]!;
        if (r === row && c === col) {
          return value === entry.word[i];
        }
      }
    }
    return null;
  }, [filledCells, layout]);

  const isCellHinted = useCallback((row: number, col: number): boolean => {
    return hintedCells.has(`${row},${col}`);
  }, [hintedCells]);

  const isWordRevealed = useCallback((entry: CrosswordEntry): boolean => {
    return revealedWords.has(`${entry.number}-${entry.direction}`);
  }, [revealedWords]);

  const isWordComplete = useCallback((entry: CrosswordEntry): boolean => {
    const cells = getEntryCells(entry);
    for (let i = 0; i < cells.length; i++) {
      const [r, c] = cells[i]!;
      const value = filledCells.get(`${r},${c}`);
      if (value !== entry.word[i]) return false;
    }
    return true;
  }, [filledCells]);

  const startGame = useCallback((diff: CrosswordDifficulty) => {
    setDifficulty(diff);
    setFilledCells(new Map());
    setRevealedWords(new Set());
    setHintedCells(new Set());
    setStarted(true);
    setActiveEntry(null);
    setActiveClueDropdown(null);
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(getStorageKey(quizId));
    setStarted(false);
    setFilledCells(new Map());
    setRevealedWords(new Set());
    setHintedCells(new Set());
    setActiveEntry(null);
    setActiveClueDropdown(null);
  }, [quizId]);

  const completedCount = useMemo(() => {
    if (!layout) return 0;
    return layout.entries.filter((e) => isWordComplete(e)).length;
  }, [layout, isWordComplete]);

  const isComplete = layout !== null && completedCount === layout.entries.length;

  return {
    difficulty,
    started,
    layout,
    activeEntry,
    activeClueDropdown,
    filledCells,
    isComplete,
    completedCount,
    setCellValue,
    getCellValue,
    revealWord,
    giveHint,
    isCellCorrect,
    isCellHinted,
    isWordRevealed,
    isWordComplete,
    setActiveEntry,
    setActiveClueDropdown,
    startGame,
    resetGame,
  };
}
