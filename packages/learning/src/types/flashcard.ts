export interface Flashcard {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface DeckState {
  cards: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
}
