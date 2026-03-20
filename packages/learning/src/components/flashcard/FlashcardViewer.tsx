import { useEffect } from "react";
import { FlashcardCard } from "./FlashcardCard";
import { DeckControls } from "./DeckControls";
import { useFlashcardDeck } from "../../hooks/useFlashcardDeck";
import type { Flashcard } from "../../types/flashcard";
import { RotateCcw } from "lucide-react";

interface FlashcardViewerProps {
  cards: Flashcard[];
  onReset: () => void;
}

export function FlashcardViewer({ cards, onReset }: FlashcardViewerProps) {
  const { currentCard, progress, deck, loadCards, flip, next, prev, shuffle } =
    useFlashcardDeck();

  useEffect(() => {
    loadCards(cards);
  }, [cards, loadCards]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        flip();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, flip]);

  if (!currentCard) return null;

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Seus Flashcards</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Novo arquivo
        </button>
      </div>

      <FlashcardCard
        card={currentCard}
        isFlipped={deck.isFlipped}
        onFlip={flip}
      />

      <DeckControls
        progress={progress}
        isFlipped={deck.isFlipped}
        onPrev={prev}
        onNext={next}
        onFlip={flip}
        onShuffle={shuffle}
      />

      <p className="mt-6 text-center text-xs text-slate-400">
        Use as setas do teclado para navegar e espaco para virar o card
      </p>
    </div>
  );
}
