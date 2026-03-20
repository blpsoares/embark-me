import type { Flashcard } from "../types/flashcard";

interface RawCard {
  pergunta?: unknown;
  resposta?: unknown;
}

export function parseJSON(content: string): Flashcard[] {
  const data: unknown = JSON.parse(content);

  if (!Array.isArray(data)) {
    throw new Error("JSON must be an array of objects with 'pergunta' and 'resposta'");
  }

  return (data as RawCard[])
    .map((item) => ({
      id: crypto.randomUUID(),
      pergunta: String(item.pergunta ?? "").trim(),
      resposta: String(item.resposta ?? "").trim(),
    }))
    .filter((card) => card.pergunta !== "" && card.resposta !== "");
}
