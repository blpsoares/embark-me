import { describe, it, expect } from "bun:test";
import { generateCrosswordLayout, getEntryCells } from "../utils/crosswordGenerator";
import type { CrosswordDifficulty } from "../types/quiz";

const sampleClues = [
  { word: "JAVASCRIPT", clue: "Popular programming language" },
  { word: "ARRAY", clue: "Ordered data structure" },
  { word: "VARIABLE", clue: "Named storage for values" },
  { word: "FUNCTION", clue: "Reusable block of code" },
  { word: "PROMISE", clue: "Async operation wrapper" },
  { word: "SCOPE", clue: "Variable visibility context" },
  { word: "CLASS", clue: "OOP blueprint" },
  { word: "MAP", clue: "Key-value collection" },
  { word: "SET", clue: "Unique values" },
  { word: "TYPE", clue: "Data classification" },
  { word: "LOOP", clue: "Repetitive execution" },
  { word: "EVENT", clue: "User interaction signal" },
];

describe("generateCrosswordLayout", () => {
  it("should generate a layout with entries", () => {
    const layout = generateCrosswordLayout(sampleClues, "normal");
    expect(layout.entries.length).toBeGreaterThan(0);
    expect(layout.rows).toBeGreaterThan(0);
    expect(layout.cols).toBeGreaterThan(0);
  });

  it("should place first word horizontally", () => {
    const layout = generateCrosswordLayout(sampleClues, "easy");
    expect(layout.entries.length).toBeGreaterThan(0);
    expect(layout.entries[0]!.direction).toBe("across");
  });

  it("should have correct letters in grid cells", () => {
    const layout = generateCrosswordLayout(sampleClues, "normal");
    for (const entry of layout.entries) {
      const cells = getEntryCells(entry);
      for (let i = 0; i < cells.length; i++) {
        const [r, c] = cells[i]!;
        expect(layout.grid[r]![c]!.letter).toBe(entry.word[i]!);
      }
    }
  });

  it("should assign sequential numbers", () => {
    const layout = generateCrosswordLayout(sampleClues, "normal");
    const numbers = layout.entries
      .map((e) => e.number)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);
    // Numbers should start at 1
    expect(numbers[0]).toBe(1);
  });

  it("should have both across and down entries for sufficient words", () => {
    const layout = generateCrosswordLayout(sampleClues, "normal");
    const hasAcross = layout.entries.some((e) => e.direction === "across");
    const hasDown = layout.entries.some((e) => e.direction === "down");
    expect(hasAcross).toBe(true);
    expect(hasDown).toBe(true);
  });

  it("should respect difficulty word count limits", () => {
    const difficulties: { diff: CrosswordDifficulty; max: number }[] = [
      { diff: "easy", max: 8 },
      { diff: "normal", max: 12 },
      { diff: "hard", max: 16 },
      { diff: "very-hard", max: 20 },
    ];

    for (const { diff, max } of difficulties) {
      const layout = generateCrosswordLayout(sampleClues, diff);
      expect(layout.entries.length).toBeLessThanOrEqual(max);
    }
  });

  it("should handle empty clue list", () => {
    const layout = generateCrosswordLayout([], "easy");
    expect(layout.entries.length).toBe(0);
    expect(layout.rows).toBe(0);
    expect(layout.cols).toBe(0);
  });

  it("should handle single word", () => {
    const layout = generateCrosswordLayout([{ word: "TEST", clue: "A test" }], "easy");
    expect(layout.entries.length).toBe(1);
    expect(layout.entries[0]!.word).toBe("TEST");
  });

  it("should not have black cells where words are placed", () => {
    const layout = generateCrosswordLayout(sampleClues, "normal");
    for (const entry of layout.entries) {
      const cells = getEntryCells(entry);
      for (const [r, c] of cells) {
        expect(layout.grid[r]![c]!.isBlack).toBe(false);
      }
    }
  });

  it("should have intersecting words share the same cell", () => {
    const layout = generateCrosswordLayout(sampleClues, "normal");
    // Build cell map
    const cellMap = new Map<string, string[]>();
    for (const entry of layout.entries) {
      const cells = getEntryCells(entry);
      for (let i = 0; i < cells.length; i++) {
        const key = `${cells[i]![0]},${cells[i]![1]}`;
        const existing = cellMap.get(key) ?? [];
        existing.push(entry.word[i]!);
        cellMap.set(key, existing);
      }
    }
    // Where multiple words share a cell, the letters must match
    for (const [_key, letters] of cellMap) {
      if (letters.length > 1) {
        const unique = new Set(letters);
        expect(unique.size).toBe(1);
      }
    }
  });
});

describe("getEntryCells", () => {
  it("should return correct cells for across entry", () => {
    const entry = { word: "TEST", clue: "", row: 0, col: 0, direction: "across" as const, number: 1 };
    const cells = getEntryCells(entry);
    expect(cells).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
  });

  it("should return correct cells for down entry", () => {
    const entry = { word: "AB", clue: "", row: 1, col: 2, direction: "down" as const, number: 1 };
    const cells = getEntryCells(entry);
    expect(cells).toEqual([[1, 2], [2, 2]]);
  });
});
