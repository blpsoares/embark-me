import { useEffect } from "react";
import { FlashcardCard } from "./FlashcardCard";
import { DeckControls } from "./DeckControls";
import { useFlashcardDeck } from "../../hooks/useFlashcardDeck";
import type { Flashcard } from "../../types/flashcard";
import { RotateCcw, Layers } from "lucide-react";

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

  const currentIdx = deck.currentIndex + 1;
  const total = deck.cards.length;
  const progressPercent = (currentIdx / total) * 100;

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,oklch(0.63_0.2_165_/_0.04),transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl px-6 py-8 sm:py-12">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
              <Layers className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Seus Flashcards</h2>
              <p className="text-xs text-slate-400">{total} cards no deck</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-700 hover:shadow-md"
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-180" />
            Novo arquivo
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Progresso</span>
            <span className="text-xs font-bold text-primary-500">{progress}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <FlashcardCard
          card={currentCard}
          isFlipped={deck.isFlipped}
          onFlip={flip}
        />

        {/* Controls */}
        <DeckControls
          progress={progress}
          isFlipped={deck.isFlipped}
          onPrev={prev}
          onNext={next}
          onFlip={flip}
          onShuffle={shuffle}
        />

        {/* Keyboard hint */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {[
            { keys: ["<", ">"], label: "Navegar" },
            { keys: ["Espaco"], label: "Virar" },
          ].map((hint) => (
            <div key={hint.label} className="flex items-center gap-2">
              <div className="flex gap-1">
                {hint.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1.5 text-[10px] font-semibold text-slate-400"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-[10px] font-medium text-slate-300">{hint.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
