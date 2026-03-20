import type { Flashcard } from "../types/flashcard";
import { parseCSV } from "./parseCSV";
import { parseJSON } from "./parseJSON";

export interface ParseResult {
  cards: Flashcard[];
  error: string | null;
}

export function parseFileContent(fileName: string, content: string): ParseResult {
  try {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
      const cards = parseCSV(content);
      if (cards.length === 0) {
        return { cards: [], error: "No valid cards found in CSV. Expected columns: pergunta, resposta" };
      }
      return { cards, error: null };
    }

    if (extension === "json") {
      const cards = parseJSON(content);
      if (cards.length === 0) {
        return { cards: [], error: "No valid cards found in JSON. Expected array of { pergunta, resposta }" };
      }
      return { cards, error: null };
    }

    return { cards: [], error: "Unsupported file type. Please upload a .json or .csv file." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse file";
    return { cards: [], error: message };
  }
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
