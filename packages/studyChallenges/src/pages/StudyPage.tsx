import { useState } from "react";
import { DropZone } from "../components/upload/DropZone";
import { FlashcardViewer } from "../components/flashcard/FlashcardViewer";
import type { Flashcard } from "../types/flashcard";

export function StudyPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);

  const handleReset = () => setCards([]);

  return (
    <div className="px-4 py-8 md:py-12">
      {cards.length === 0 ? (
        <div>
          <h1 className="mb-2 text-center text-2xl font-bold text-slate-800 md:text-3xl">
            Comece a Estudar
          </h1>
          <p className="mx-auto mb-8 max-w-md text-center text-slate-500">
            Importe um arquivo com suas perguntas e respostas para gerar flashcards.
          </p>
          <DropZone onCardsLoaded={setCards} cardCount={cards.length} />
        </div>
      ) : (
        <FlashcardViewer cards={cards} onReset={handleReset} />
      )}
    </div>
  );
}
