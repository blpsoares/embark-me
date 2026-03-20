import { useCallback, useState } from "react";
import type { DeckState, Flashcard } from "../types/flashcard";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function useFlashcardDeck() {
  const [deck, setDeck] = useState<DeckState>({
    cards: [],
    currentIndex: 0,
    isFlipped: false,
  });

  const loadCards = useCallback((cards: Flashcard[]) => {
    setDeck({ cards, currentIndex: 0, isFlipped: false });
  }, []);

  const flip = useCallback(() => {
    setDeck((prev) => ({ ...prev, isFlipped: !prev.isFlipped }));
  }, []);

  const next = useCallback(() => {
    setDeck((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.cards.length,
      isFlipped: false,
    }));
  }, []);

  const prev = useCallback(() => {
    setDeck((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.cards.length) % prev.cards.length,
      isFlipped: false,
    }));
  }, []);

  const shuffle = useCallback(() => {
    setDeck((prev) => ({
      ...prev,
      cards: shuffleArray(prev.cards),
      currentIndex: 0,
      isFlipped: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setDeck({ cards: [], currentIndex: 0, isFlipped: false });
  }, []);

  const currentCard = deck.cards[deck.currentIndex] ?? null;
  const progress = deck.cards.length > 0
    ? `${deck.currentIndex + 1} / ${deck.cards.length}`
    : "";

  return {
    deck,
    currentCard,
    progress,
    loadCards,
    flip,
    next,
    prev,
    shuffle,
    reset,
  };
}
