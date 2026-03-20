import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "pt" | "en";

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  toggleLocale: () => void;
}

const translations: Record<Locale, Record<string, string>> = {
  pt: {
    // Header
    "header.brand": "Meus Estudos",

    // Hero
    "greeting.morning": "Bom dia",
    "greeting.afternoon": "Boa tarde",
    "greeting.evening": "Boa noite",
    "greeting.night": "Boa madrugada",
    "hero.phrase.1": "O que vamos estudar hoje?",
    "hero.phrase.2": "Pronto pra mais um desafio?",
    "hero.phrase.3": "Bora dominar mais um assunto?",
    "hero.phrase.4": "Qual o proximo topico?",
    "hero.phrase.5": "Mais um dia de evolucao!",
    "hero.phrase.6": "Vamos conquistar mais conhecimento?",
    "hero.phrase.7": "Foco total nos estudos!",
    "hero.phrase.8": "Cada dia mais perto do objetivo.",
    "hero.action.study": "Estudar",
    "hero.action.study.desc": "Flashcards interativos",
    "hero.action.planning": "Planejamento",
    "hero.action.planning.desc": "Progresso e metas",

    // Study page
    "study.badge": "Modo de Estudo",
    "study.title": "Comece a Estudar",
    "study.subtitle": "Importe um arquivo com suas perguntas e respostas para gerar flashcards interativos com animacoes 3D.",

    // Flashcard viewer
    "viewer.title": "Seus Flashcards",
    "viewer.cards": "cards no deck",
    "viewer.newFile": "Novo arquivo",
    "viewer.progress": "Progresso",
    "viewer.hintNav": "Navegar",
    "viewer.hintFlip": "Virar",

    // Flashcard card
    "card.question": "Pergunta",
    "card.answer": "Resposta",
    "card.flipHint": "Clique ou pressione espaco para revelar",
    "card.backHint": "Clique para voltar a pergunta",

    // Deck controls
    "controls.showAnswer": "Ver Resposta",
    "controls.hideAnswer": "Ocultar Resposta",
    "controls.shuffle": "Embaralhar deck",

    // Drop zone
    "drop.title": "Arraste seu arquivo aqui",
    "drop.titleDragging": "Solte o arquivo aqui",
    "drop.subtitle": "ou clique para selecionar",
    "drop.csvHint": "Coluna A = pergunta",
    "drop.csvHint2": "Coluna B = resposta",
    "drop.jsonHint": "Array de objetos com",
    "drop.jsonHint2": "{ pergunta, resposta }",
    "drop.loaded": "card carregado",
    "drop.loadedPlural": "cards carregados",

    // Notion
    "notion.open": "Abrir no Notion",

    // Footer
    "footer.label": "Meus Estudos",
  },
  en: {
    // Header
    "header.brand": "My Studies",

    // Hero
    "greeting.morning": "Good morning",
    "greeting.afternoon": "Good afternoon",
    "greeting.evening": "Good evening",
    "greeting.night": "Late night vibes",
    "hero.phrase.1": "What are we studying today?",
    "hero.phrase.2": "Ready for another challenge?",
    "hero.phrase.3": "Let's master another topic?",
    "hero.phrase.4": "What's the next subject?",
    "hero.phrase.5": "Another day of growth!",
    "hero.phrase.6": "Let's conquer more knowledge?",
    "hero.phrase.7": "Full focus on studying!",
    "hero.phrase.8": "One step closer to the goal.",
    "hero.action.study": "Study",
    "hero.action.study.desc": "Interactive flashcards",
    "hero.action.planning": "Planning",
    "hero.action.planning.desc": "Progress & goals",

    // Study page
    "study.badge": "Study Mode",
    "study.title": "Start Studying",
    "study.subtitle": "Import a file with your questions and answers to generate interactive flashcards with 3D animations.",

    // Flashcard viewer
    "viewer.title": "Your Flashcards",
    "viewer.cards": "cards in deck",
    "viewer.newFile": "New file",
    "viewer.progress": "Progress",
    "viewer.hintNav": "Navigate",
    "viewer.hintFlip": "Flip",

    // Flashcard card
    "card.question": "Question",
    "card.answer": "Answer",
    "card.flipHint": "Click or press space to reveal",
    "card.backHint": "Click to go back to question",

    // Deck controls
    "controls.showAnswer": "Show Answer",
    "controls.hideAnswer": "Hide Answer",
    "controls.shuffle": "Shuffle deck",

    // Drop zone
    "drop.title": "Drag your file here",
    "drop.titleDragging": "Drop the file here",
    "drop.subtitle": "or click to select",
    "drop.csvHint": "Column A = question",
    "drop.csvHint2": "Column B = answer",
    "drop.jsonHint": "Array of objects with",
    "drop.jsonHint2": "{ pergunta, resposta }",
    "drop.loaded": "card loaded",
    "drop.loadedPlural": "cards loaded",

    // Notion
    "notion.open": "Open in Notion",

    // Footer
    "footer.label": "My Studies",
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  const saved = localStorage.getItem("locale");
  if (saved === "pt" || saved === "en") return saved;
  return "pt";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  const t = useCallback(
    (key: string): string => translations[locale][key] ?? key,
    [locale],
  );

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "pt" ? "en" : "pt";
      localStorage.setItem("locale", next);
      return next;
    });
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
