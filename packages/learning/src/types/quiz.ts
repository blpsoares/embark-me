export type QuizType = "flashcard" | "multiple-choice" | "true-false" | "fill-blank" | "match-pairs" | "word-search" | "crossword";

export type WordSearchDifficulty = "easy" | "normal" | "hard" | "very-hard";
export type CrosswordDifficulty = "easy" | "normal" | "hard" | "very-hard";

export interface LocalizedText {
  pt: string;
  en: string;
}

// ── Manifest ──

export interface QuizManifestEntry {
  id: string;
  type: QuizType;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  tags: string[];
  file: string;
  questionCount: number;
}

export interface QuizManifest {
  quizzes: QuizManifestEntry[];
}

// ── Question types ──

export interface FlashcardQuestion {
  pergunta: string;
  resposta: string;
}

export interface MultipleChoiceOption {
  opcao: string;
  descricao: string;
}

export interface MultipleChoiceQuestion {
  pergunta: string;
  resposta: string;
  opcoes: MultipleChoiceOption[];
}

export interface TrueFalseQuestion {
  pergunta: string;
  resposta: boolean;
  explicacao?: string;
}

export interface FillBlankQuestion {
  pergunta: string;
  resposta: string;
  alternativas?: string[];
}

export interface MatchPair {
  termo: string;
  definicao: string;
}

export interface MatchPairsQuestion {
  pairs: MatchPair[];
}

export interface WordSearchWord {
  word: string;
  clue: string;
}

export interface WordSearchQuestion {
  words: WordSearchWord[];
}

export interface CrosswordClue {
  word: string;
  clue: string;
}

export interface CrosswordQuestion {
  clues: CrosswordClue[];
}

// ── Quiz data files ──

export type QuizQuestion =
  | FlashcardQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchPairsQuestion
  | WordSearchQuestion
  | CrosswordQuestion;

export interface QuizDataFile {
  type: QuizType;
  questions: QuizQuestion[];
}

// ── Session state ──

export interface QuizSessionState {
  currentIndex: number;
  answers: Map<number, string | boolean>;
  isComplete: boolean;
}
