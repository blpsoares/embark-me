import type { CrosswordDifficulty } from "../types/quiz";

export interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack: boolean;
}

export interface CrosswordEntry {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
  number: number;
}

export interface CrosswordLayout {
  grid: CrosswordCell[][];
  entries: CrosswordEntry[];
  rows: number;
  cols: number;
}

const DIFFICULTY_WORD_COUNT: Record<CrosswordDifficulty, { min: number; max: number }> = {
  easy: { min: 5, max: 8 },
  normal: { min: 8, max: 12 },
  hard: { min: 12, max: 16 },
  "very-hard": { min: 16, max: 20 },
};

interface PlacementCandidate {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
  intersections: number;
}

function findIntersections(
  placed: { word: string; row: number; col: number; direction: "across" | "down" }[],
  word: string,
  occupiedCells: Map<string, string>,
  gridBounds: { minR: number; maxR: number; minC: number; maxC: number },
): PlacementCandidate[] {
  const candidates: PlacementCandidate[] = [];

  for (const existing of placed) {
    for (let ei = 0; ei < existing.word.length; ei++) {
      for (let wi = 0; wi < word.length; wi++) {
        if (existing.word[ei] !== word[wi]) continue;

        let row: number;
        let col: number;
        let direction: "across" | "down";

        if (existing.direction === "across") {
          direction = "down";
          row = existing.row - wi;
          col = existing.col + ei;
        } else {
          direction = "across";
          row = existing.row + ei;
          col = existing.col - wi;
        }

        if (canPlaceWord(word, row, col, direction, occupiedCells, gridBounds)) {
          const intersections = countIntersections(word, row, col, direction, occupiedCells);
          candidates.push({ word, clue: "", row, col, direction, intersections });
        }
      }
    }
  }

  return candidates;
}

function canPlaceWord(
  word: string,
  row: number,
  col: number,
  direction: "across" | "down",
  occupiedCells: Map<string, string>,
  _gridBounds: { minR: number; maxR: number; minC: number; maxC: number },
): boolean {
  const dr = direction === "down" ? 1 : 0;
  const dc = direction === "across" ? 1 : 0;

  // Check cell before word start
  const beforeR = row - dr;
  const beforeC = col - dc;
  if (occupiedCells.has(`${beforeR},${beforeC}`)) return false;

  // Check cell after word end
  const afterR = row + dr * word.length;
  const afterC = col + dc * word.length;
  if (occupiedCells.has(`${afterR},${afterC}`)) return false;

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const key = `${r},${c}`;
    const existing = occupiedCells.get(key);

    if (existing !== undefined) {
      if (existing !== word[i]) return false;
    } else {
      // Check adjacent cells perpendicular to direction
      if (direction === "across") {
        if (occupiedCells.has(`${r - 1},${c}`) || occupiedCells.has(`${r + 1},${c}`)) {
          return false;
        }
      } else {
        if (occupiedCells.has(`${r},${c - 1}`) || occupiedCells.has(`${r},${c + 1}`)) {
          return false;
        }
      }
    }
  }

  return true;
}

function countIntersections(
  word: string,
  row: number,
  col: number,
  direction: "across" | "down",
  occupiedCells: Map<string, string>,
): number {
  const dr = direction === "down" ? 1 : 0;
  const dc = direction === "across" ? 1 : 0;
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    const key = `${row + dr * i},${col + dc * i}`;
    if (occupiedCells.has(key)) count++;
  }

  return count;
}

export function generateCrosswordLayout(
  words: { word: string; clue: string }[],
  difficulty: CrosswordDifficulty,
): CrosswordLayout {
  const config = DIFFICULTY_WORD_COUNT[difficulty];
  const maxWords = Math.min(words.length, config.max);

  const cleanWords = words
    .map((w) => ({
      word: w.word.toUpperCase().replace(/[^A-Z]/g, ""),
      clue: w.clue,
    }))
    .filter((w) => w.word.length >= 2)
    .sort((a, b) => b.word.length - a.word.length);

  if (cleanWords.length === 0) {
    return { grid: [], entries: [], rows: 0, cols: 0 };
  }

  const placedEntries: { word: string; clue: string; row: number; col: number; direction: "across" | "down" }[] = [];
  const occupiedCells = new Map<string, string>();
  const gridBounds = { minR: 0, maxR: 0, minC: 0, maxC: 0 };

  // Place first word horizontally at origin
  const first = cleanWords[0]!;
  placedEntries.push({ word: first.word, clue: first.clue, row: 0, col: 0, direction: "across" });
  for (let i = 0; i < first.word.length; i++) {
    occupiedCells.set(`0,${i}`, first.word[i]!);
  }
  gridBounds.maxC = first.word.length - 1;

  // Try to place remaining words
  for (let wi = 1; wi < cleanWords.length && placedEntries.length < maxWords; wi++) {
    const entry = cleanWords[wi]!;
    const candidates = findIntersections(placedEntries, entry.word, occupiedCells, gridBounds);

    if (candidates.length === 0) continue;

    // Pick candidate with most intersections
    candidates.sort((a, b) => b.intersections - a.intersections);
    const best = candidates[0]!;

    const dr = best.direction === "down" ? 1 : 0;
    const dc = best.direction === "across" ? 1 : 0;

    for (let i = 0; i < entry.word.length; i++) {
      const r = best.row + dr * i;
      const c = best.col + dc * i;
      occupiedCells.set(`${r},${c}`, entry.word[i]!);
      gridBounds.minR = Math.min(gridBounds.minR, r);
      gridBounds.maxR = Math.max(gridBounds.maxR, r);
      gridBounds.minC = Math.min(gridBounds.minC, c);
      gridBounds.maxC = Math.max(gridBounds.maxC, c);
    }

    placedEntries.push({
      word: entry.word,
      clue: entry.clue,
      row: best.row,
      col: best.col,
      direction: best.direction,
    });
  }

  // Normalize coordinates to start at 0
  const offsetR = -gridBounds.minR;
  const offsetC = -gridBounds.minC;
  const rows = gridBounds.maxR - gridBounds.minR + 1;
  const cols = gridBounds.maxC - gridBounds.minC + 1;

  // Build grid
  const grid: CrosswordCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ letter: "", number: undefined, isBlack: true })),
  );

  const normalizedEntries = placedEntries.map((e) => ({
    ...e,
    row: e.row + offsetR,
    col: e.col + offsetC,
  }));

  // Fill grid cells
  for (const entry of normalizedEntries) {
    const dr = entry.direction === "down" ? 1 : 0;
    const dc = entry.direction === "across" ? 1 : 0;
    for (let i = 0; i < entry.word.length; i++) {
      const r = entry.row + dr * i;
      const c = entry.col + dc * i;
      const cell = grid[r]![c]!;
      cell.letter = entry.word[i]!;
      cell.isBlack = false;
    }
  }

  // Assign numbers
  let num = 1;
  const numberMap = new Map<string, number>();

  // Collect all starting positions that need numbers
  const startsNeedingNumbers = new Set<string>();
  for (const entry of normalizedEntries) {
    startsNeedingNumbers.add(`${entry.row},${entry.col}`);
  }

  // Assign numbers row by row, left to right
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (startsNeedingNumbers.has(key)) {
        numberMap.set(key, num);
        grid[r]![c]!.number = num;
        num++;
      }
    }
  }

  const entries: CrosswordEntry[] = normalizedEntries.map((e) => ({
    word: e.word,
    clue: e.clue,
    row: e.row,
    col: e.col,
    direction: e.direction,
    number: numberMap.get(`${e.row},${e.col}`) ?? 0,
  }));

  return { grid, entries, rows, cols };
}

export function getEntryCells(entry: CrosswordEntry): [number, number][] {
  const cells: [number, number][] = [];
  const dr = entry.direction === "down" ? 1 : 0;
  const dc = entry.direction === "across" ? 1 : 0;
  for (let i = 0; i < entry.word.length; i++) {
    cells.push([entry.row + dr * i, entry.col + dc * i]);
  }
  return cells;
}
