import { describe, it, expect } from "bun:test";
import { parseFileContent } from "../utils/fileHandler";

describe("parseFileContent", () => {
  it("should parse CSV files", () => {
    const result = parseFileContent("test.csv", "Q1,A1\nQ2,A2");
    expect(result.error).toBeNull();
    expect(result.cards).toHaveLength(2);
  });

  it("should parse JSON files", () => {
    const json = JSON.stringify([{ pergunta: "Q1", resposta: "A1" }]);
    const result = parseFileContent("test.json", json);
    expect(result.error).toBeNull();
    expect(result.cards).toHaveLength(1);
  });

  it("should return error for unsupported file types", () => {
    const result = parseFileContent("test.txt", "content");
    expect(result.error).toBe("Unsupported file type. Please upload a .json or .csv file.");
    expect(result.cards).toHaveLength(0);
  });

  it("should return error for empty CSV", () => {
    const result = parseFileContent("test.csv", "");
    expect(result.error).not.toBeNull();
  });

  it("should return error for invalid JSON", () => {
    const result = parseFileContent("test.json", "not json");
    expect(result.error).not.toBeNull();
  });

  it("should return error for CSV with no valid rows", () => {
    const result = parseFileContent("test.csv", ",\n,");
    expect(result.error).not.toBeNull();
  });

  it("should handle file extensions case-insensitively", () => {
    const result = parseFileContent("test.CSV", "Q1,A1");
    expect(result.error).toBeNull();
    expect(result.cards).toHaveLength(1);
  });
});
