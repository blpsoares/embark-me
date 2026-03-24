import type { WordSearchDifficulty } from "../types/quiz";

export interface PlacedWord {
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: Direction;
}

export interface WordSearchGrid {
  grid: string[][];
  placedWords: PlacedWord[];
  size: number;
}

type Direction = [number, number];

const DIRECTIONS_EASY: Direction[] = [
  [0, 1],   // horizontal right
  [1, 0],   // vertical down
];

const DIRECTIONS_NORMAL: Direction[] = [
  ...DIRECTIONS_EASY,
  [1, 1],   // diagonal down-right
];

const DIRECTIONS_HARD: Direction[] = [
  ...DIRECTIONS_NORMAL,
  [0, -1],  // horizontal left
  [-1, 0],  // vertical up
  [-1, -1], // diagonal up-left
];

const DIRECTIONS_VERY_HARD: Direction[] = [
  ...DIRECTIONS_HARD,
  [1, -1],  // diagonal down-left
  [-1, 1],  // diagonal up-right
];

const DIFFICULTY_CONFIG: Record<WordSearchDifficulty, { size: number; directions: Direction[] }> = {
  easy: { size: 12, directions: DIRECTIONS_EASY },
  normal: { size: 15, directions: DIRECTIONS_NORMAL },
  hard: { size: 18, directions: DIRECTIONS_HARD },
  "very-hard": { size: 22, directions: DIRECTIONS_VERY_HARD },
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function shuffleWithRng<T>(array: T[], rng: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

function canPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
  size: number,
): boolean {
  const [dr, dc] = direction;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    const cell = grid[r]![c]!;
    if (cell !== "" && cell !== word[i]) return false;
  }
  return true;
}

function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
): void {
  const [dr, dc] = direction;
  for (let i = 0; i < word.length; i++) {
    grid[row + dr * i]![col + dc * i] = word[i]!;
  }
}

export function generateWordSearchGrid(
  words: { word: string; clue: string }[],
  difficulty: WordSearchDifficulty,
  seed: number,
): WordSearchGrid {
  const config = DIFFICULTY_CONFIG[difficulty];
  const size = config.size;
  const rng = seededRandom(seed);

  const grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
  const placedWords: PlacedWord[] = [];

  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);

  for (const { word, clue } of sortedWords) {
    const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, "");
    if (cleanWord.length === 0 || cleanWord.length > size) continue;

    const dirs = shuffleWithRng(config.directions, rng);
    let placed = false;

    for (const dir of dirs) {
      const positions: [number, number][] = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          positions.push([r, c]);
        }
      }
      const shuffledPositions = shuffleWithRng(positions, rng);

      for (const [r, c] of shuffledPositions) {
        if (canPlace(grid, cleanWord, r, c, dir, size)) {
          placeWord(grid, cleanWord, r, c, dir);
          placedWords.push({
            word: cleanWord,
            clue,
            startRow: r,
            startCol: c,
            direction: dir,
          });
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r]![c] === "") {
        grid[r]![c] = alphabet[Math.floor(rng() * alphabet.length)]!;
      }
    }
  }

  return { grid, placedWords, size };
}

export function getWordCells(placed: PlacedWord): [number, number][] {
  const cells: [number, number][] = [];
  const [dr, dc] = placed.direction;
  for (let i = 0; i < placed.word.length; i++) {
    cells.push([placed.startRow + dr * i, placed.startCol + dc * i]);
  }
  return cells;
}
