import { describe, it, expect } from "bun:test";
import { parseCSV } from "../utils/parseCSV";

describe("parseCSV", () => {
  it("should parse basic CSV with two columns", () => {
    const csv = "O que e TypeScript?,Uma linguagem tipada\nO que e Bun?,Um runtime JavaScript";
    const cards = parseCSV(csv);

    expect(cards).toHaveLength(2);
    expect(cards[0]?.pergunta).toBe("O que e TypeScript?");
    expect(cards[0]?.resposta).toBe("Uma linguagem tipada");
    expect(cards[1]?.pergunta).toBe("O que e Bun?");
    expect(cards[1]?.resposta).toBe("Um runtime JavaScript");
  });

  it("should skip header row with 'pergunta' and 'resposta'", () => {
    const csv = "pergunta,resposta\nQ1,A1\nQ2,A2";
    const cards = parseCSV(csv);

    expect(cards).toHaveLength(2);
    expect(cards[0]?.pergunta).toBe("Q1");
  });

  it("should skip header row with 'question' and 'answer'", () => {
    const csv = "question,answer\nQ1,A1";
    const cards = parseCSV(csv);

    expect(cards).toHaveLength(1);
    expect(cards[0]?.pergunta).toBe("Q1");
  });

  it("should filter out rows with empty values", () => {
    const csv = "Q1,A1\n,A2\nQ3,";
    const cards = parseCSV(csv);

    expect(cards).toHaveLength(1);
    expect(cards[0]?.pergunta).toBe("Q1");
  });

  it("should trim whitespace from values", () => {
    const csv = "  Q1  ,  A1  ";
    const cards = parseCSV(csv);

    expect(cards[0]?.pergunta).toBe("Q1");
    expect(cards[0]?.resposta).toBe("A1");
  });

  it("should return empty array for empty input", () => {
    expect(parseCSV("")).toHaveLength(0);
  });

  it("should generate unique IDs for each card", () => {
    const csv = "Q1,A1\nQ2,A2";
    const cards = parseCSV(csv);

    expect(cards[0]?.id).toBeDefined();
    expect(cards[1]?.id).toBeDefined();
    expect(cards[0]?.id).not.toBe(cards[1]?.id);
  });
});
