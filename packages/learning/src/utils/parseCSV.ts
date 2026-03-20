import Papa from "papaparse";
import type { Flashcard } from "../types/flashcard";

function isHeaderRow(row: string[] | undefined): boolean {
  if (!row || row.length < 2) return false;
  const first = row[0]?.toLowerCase().trim() ?? "";
  const second = row[1]?.toLowerCase().trim() ?? "";
  return (
    (first === "pergunta" && second === "resposta") ||
    (first === "question" && second === "answer")
  );
}

export function parseCSV(content: string): Flashcard[] {
  const result = Papa.parse<string[]>(content, {
    skipEmptyLines: true,
  });

  const rows = result.data;
  if (rows.length === 0) return [];

  const startIndex = isHeaderRow(rows[0]) ? 1 : 0;

  return rows.slice(startIndex)
    .map((row) => ({
      id: crypto.randomUUID(),
      pergunta: row[0]?.trim() ?? "",
      resposta: row[1]?.trim() ?? "",
    }))
    .filter((card) => card.pergunta !== "" && card.resposta !== "");
}
