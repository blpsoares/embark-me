import { describe, it, expect } from "bun:test";
import { parseJSON } from "../utils/parseJSON";

describe("parseJSON", () => {
  it("should parse valid JSON array", () => {
    const json = JSON.stringify([
      { pergunta: "Q1", resposta: "A1" },
      { pergunta: "Q2", resposta: "A2" },
    ]);
    const cards = parseJSON(json);

    expect(cards).toHaveLength(2);
    expect(cards[0]?.pergunta).toBe("Q1");
    expect(cards[0]?.resposta).toBe("A1");
  });

  it("should throw for non-array JSON", () => {
    expect(() => parseJSON('{"pergunta": "Q1"}')).toThrow("JSON must be an array");
  });

  it("should filter out items with empty pergunta or resposta", () => {
    const json = JSON.stringify([
      { pergunta: "Q1", resposta: "A1" },
      { pergunta: "", resposta: "A2" },
      { pergunta: "Q3", resposta: "" },
    ]);
    const cards = parseJSON(json);

    expect(cards).toHaveLength(1);
    expect(cards[0]?.pergunta).toBe("Q1");
  });

  it("should trim whitespace from values", () => {
    const json = JSON.stringify([{ pergunta: "  Q1  ", resposta: "  A1  " }]);
    const cards = parseJSON(json);

    expect(cards[0]?.pergunta).toBe("Q1");
    expect(cards[0]?.resposta).toBe("A1");
  });

  it("should handle missing fields gracefully", () => {
    const json = JSON.stringify([{ pergunta: "Q1" }, { resposta: "A2" }]);
    const cards = parseJSON(json);

    expect(cards).toHaveLength(0);
  });

  it("should throw for invalid JSON", () => {
    expect(() => parseJSON("not json")).toThrow();
  });

  it("should generate unique IDs", () => {
    const json = JSON.stringify([
      { pergunta: "Q1", resposta: "A1" },
      { pergunta: "Q2", resposta: "A2" },
    ]);
    const cards = parseJSON(json);

    expect(cards[0]?.id).not.toBe(cards[1]?.id);
  });

  it("should return empty array for empty array input", () => {
    expect(parseJSON("[]")).toHaveLength(0);
  });
});
