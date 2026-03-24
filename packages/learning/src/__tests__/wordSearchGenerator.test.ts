import { describe, it, expect } from "bun:test";
import { generateWordSearchGrid, getWordCells } from "../utils/wordSearchGenerator";
import type { WordSearchDifficulty } from "../types/quiz";

const sampleWords = [
  { word: "CLOSURE", clue: "Function that captures scope" },
  { word: "PROMISE", clue: "Async operation wrapper" },
  { word: "ARRAY", clue: "Ordered data structure" },
  { word: "MAP", clue: "Key-value collection" },
  { word: "SET", clue: "Unique values collection" },
];

describe("generateWordSearchGrid", () => {
  it("should generate a grid with correct size for each difficulty", () => {
    const difficulties: { diff: WordSearchDifficulty; expectedSize: number }[] = [
      { diff: "easy", expectedSize: 12 },
      { diff: "normal", expectedSize: 15 },
      { diff: "hard", expectedSize: 18 },
      { diff: "very-hard", expectedSize: 22 },
    ];

    for (const { diff, expectedSize } of difficulties) {
      const result = generateWordSearchGrid(sampleWords, diff, 42);
      expect(result.size).toBe(expectedSize);
      expect(result.grid.length).toBe(expectedSize);
      expect(result.grid[0]!.length).toBe(expectedSize);
    }
  });

  it("should place words in the grid", () => {
    const result = generateWordSearchGrid(sampleWords, "easy", 42);
    expect(result.placedWords.length).toBeGreaterThan(0);
    expect(result.placedWords.length).toBeLessThanOrEqual(sampleWords.length);
  });

  it("should fill all cells with letters", () => {
    const result = generateWordSearchGrid(sampleWords, "normal", 42);
    for (const row of result.grid) {
      for (const cell of row) {
        expect(cell).toMatch(/^[A-Z]$/);
      }
    }
  });

  it("should produce deterministic output with same seed", () => {
    const result1 = generateWordSearchGrid(sampleWords, "normal", 123);
    const result2 = generateWordSearchGrid(sampleWords, "normal", 123);
    expect(result1.grid).toEqual(result2.grid);
    expect(result1.placedWords.length).toBe(result2.placedWords.length);
  });

  it("should produce different output with different seeds", () => {
    const result1 = generateWordSearchGrid(sampleWords, "normal", 100);
    const result2 = generateWordSearchGrid(sampleWords, "normal", 200);
    // Grids should differ (extremely unlikely to be the same)
    const flat1 = result1.grid.flat().join("");
    const flat2 = result2.grid.flat().join("");
    expect(flat1).not.toBe(flat2);
  });

  it("should place words with correct letters in grid", () => {
    const result = generateWordSearchGrid(sampleWords, "easy", 42);
    for (const placed of result.placedWords) {
      const cells = getWordCells(placed);
      const extracted = cells.map(([r, c]) => result.grid[r]![c]!).join("");
      expect(extracted).toBe(placed.word);
    }
  });

  it("should handle empty word list", () => {
    const result = generateWordSearchGrid([], "easy", 42);
    expect(result.placedWords.length).toBe(0);
    expect(result.grid.length).toBe(12);
  });

  it("should skip words that are too long for the grid", () => {
    const longWords = [
      { word: "ABCDEFGHIJKLMNOP", clue: "16 chars - too long for easy grid" },
      { word: "CAT", clue: "Short word" },
    ];
    const result = generateWordSearchGrid(longWords, "easy", 42);
    // 16-char word exceeds grid size 12, should be skipped
    const placedWordNames = result.placedWords.map((p) => p.word);
    expect(placedWordNames).not.toContain("ABCDEFGHIJKLMNOP");
    expect(placedWordNames).toContain("CAT");
  });
});

describe("getWordCells", () => {
  it("should return correct cells for horizontal word", () => {
    const placed = { word: "TEST", clue: "", startRow: 2, startCol: 3, direction: [0, 1] as [number, number] };
    const cells = getWordCells(placed);
    expect(cells).toEqual([
      [2, 3], [2, 4], [2, 5], [2, 6],
    ]);
  });

  it("should return correct cells for vertical word", () => {
    const placed = { word: "HI", clue: "", startRow: 1, startCol: 5, direction: [1, 0] as [number, number] };
    const cells = getWordCells(placed);
    expect(cells).toEqual([
      [1, 5], [2, 5],
    ]);
  });

  it("should return correct cells for diagonal word", () => {
    const placed = { word: "AB", clue: "", startRow: 0, startCol: 0, direction: [1, 1] as [number, number] };
    const cells = getWordCells(placed);
    expect(cells).toEqual([
      [0, 0], [1, 1],
    ]);
  });
});
