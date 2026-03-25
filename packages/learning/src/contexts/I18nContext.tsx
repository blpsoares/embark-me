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
    "hero.action.study": "Teste seu conhecimento",
    "hero.action.study.desc": "Flashcards interativos",
    "hero.action.planning": "Planejamento",
    "hero.action.planning.desc": "Progresso e metas",

    // Study page
    "study.badge": "Quizzes",
    "study.title": "Teste seu Conhecimento",
    "study.subtitle": "Escolha um quiz para comecar ou importe seu proprio arquivo de perguntas.",
    "study.questions": "perguntas",
    "study.uploadCard.title": "Quiz Personalizado",
    "study.uploadCard.desc": "Importe seu proprio arquivo CSV ou JSON",

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

    // Quiz types
    "study.allTypes": "Todos",
    "study.allThemes": "Todos",
    "quizType.flashcard": "Flashcard",
    "quizType.multiple-choice": "Multipla Escolha",
    "quizType.true-false": "Verdadeiro ou Falso",
    "quizType.fill-blank": "Preencher Lacuna",
    "quizType.match-pairs": "Conectar Pares",

    // Quiz tags / themes
    "tag.general": "Geral",
    "tag.javascript": "JavaScript",
    "tag.frontend": "Frontend",
    "tag.tech": "Tecnologia",
    "tag.geral": "Geral",
    "tag.git": "Git",
    "tag.devops": "DevOps",
    "tag.http": "HTTP",
    "tag.web": "Web",
    "tag.react": "React",
    "tag.aws": "AWS",

    // Quiz session
    "quiz.score": "Pontuacao",
    "quiz.check": "Verificar",
    "quiz.next": "Proxima",
    "quiz.complete.title": "Quiz Completo!",
    "quiz.complete.score": "Voce acertou {score} de {total}",
    "quiz.complete.retry": "Tentar Novamente",
    "quiz.complete.back": "Voltar aos Quizzes",
    "quiz.grade.excellent": "Excelente!",
    "quiz.grade.good": "Muito Bem!",
    "quiz.grade.ok": "Bom Trabalho",
    "quiz.grade.retry": "Continue Praticando",

    // Empty states
    "study.empty": "Nenhum quiz encontrado para este filtro.",

    // True/False
    "tf.true": "Verdadeiro",
    "tf.false": "Falso",

    // Fill blank
    "fb.placeholder": "Digite sua resposta...",
    "fb.correct": "Correto!",
    "fb.incorrect": "Incorreto. Resposta:",

    // Match pairs
    "mp.instructions": "Conecte os termos com suas definicoes",

    // Word Search
    "quizType.word-search": "Caca-Palavras",
    "ws.selectDifficulty": "Escolha a dificuldade",
    "ws.wordCount": "Quantidade de palavras",
    "ws.start": "Comecar",
    "ws.reset": "Resetar",
    "ws.found": "encontradas",
    "ws.allFound": "Todas as palavras encontradas!",
    "ws.remaining": "restantes",
    "ws.hint.info": "Clique na palavra desejada para visualizar a resposta no caca-palavras",
    "ws.fontDecrease": "Diminuir tamanho",
    "ws.fontIncrease": "Aumentar tamanho",
    "ws.style.pill": "Selecao cilindro",
    "ws.style.square": "Selecao quadrada",
    "ws.difficulty.easy": "Facil",
    "ws.difficulty.normal": "Normal",
    "ws.difficulty.hard": "Dificil",
    "ws.difficulty.very-hard": "Muito Dificil",

    // Crossword
    "quizType.crossword": "Palavras Cruzadas",
    "cw.selectDifficulty": "Escolha a dificuldade",
    "cw.across": "Horizontal",
    "cw.down": "Vertical",
    "cw.completed": "completas",
    "cw.allComplete": "Todas as palavras completas!",
    "cw.seeAnswer": "Ver resposta",
    "cw.hintLetter": "Dica (letra)",
    "cw.hint.info": "Clique na cruzada desejada para visualizar a resposta",

    // Notion
    "notion.open": "Abrir no Notion",

    // Home
    "home.stat.quizzes": "Quizzes",
    "home.stat.questions": "Perguntas",
    "home.stat.types": "Tipos",
    "home.featured.title": "Quizzes em Destaque",
    "home.featured.viewAll": "Ver todos",
    "home.categories.title": "Categorias",

    // 404
    "notFound.title": "Pagina nao encontrada",
    "notFound.description": "A pagina que voce esta procurando nao existe ou foi movida para outro lugar.",
    "notFound.home": "Inicio",
    "notFound.study": "Estudar",

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
    "hero.action.study": "Test your knowledge",
    "hero.action.study.desc": "Interactive flashcards",
    "hero.action.planning": "Planning",
    "hero.action.planning.desc": "Progress & goals",

    // Study page
    "study.badge": "Quizzes",
    "study.title": "Test your Knowledge",
    "study.subtitle": "Choose a quiz to get started or import your own question file.",
    "study.questions": "questions",
    "study.uploadCard.title": "Custom Quiz",
    "study.uploadCard.desc": "Import your own CSV or JSON file",

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

    // Quiz types
    "study.allTypes": "All",
    "study.allThemes": "All",
    "quizType.flashcard": "Flashcard",
    "quizType.multiple-choice": "Multiple Choice",
    "quizType.true-false": "True or False",
    "quizType.fill-blank": "Fill in the Blank",
    "quizType.match-pairs": "Match Pairs",

    // Quiz tags / themes
    "tag.general": "General",
    "tag.javascript": "JavaScript",
    "tag.frontend": "Frontend",
    "tag.tech": "Technology",
    "tag.geral": "General",
    "tag.git": "Git",
    "tag.devops": "DevOps",
    "tag.http": "HTTP",
    "tag.web": "Web",
    "tag.react": "React",
    "tag.aws": "AWS",

    // Quiz session
    "quiz.score": "Score",
    "quiz.check": "Check",
    "quiz.next": "Next",
    "quiz.complete.title": "Quiz Complete!",
    "quiz.complete.score": "You got {score} of {total}",
    "quiz.complete.retry": "Try Again",
    "quiz.complete.back": "Back to Quizzes",
    "quiz.grade.excellent": "Excellent!",
    "quiz.grade.good": "Great Job!",
    "quiz.grade.ok": "Good Work",
    "quiz.grade.retry": "Keep Practicing",

    // Empty states
    "study.empty": "No quizzes found for this filter.",

    // True/False
    "tf.true": "True",
    "tf.false": "False",

    // Fill blank
    "fb.placeholder": "Type your answer...",
    "fb.correct": "Correct!",
    "fb.incorrect": "Incorrect. Answer:",

    // Match pairs
    "mp.instructions": "Connect terms with their definitions",

    // Word Search
    "quizType.word-search": "Word Search",
    "ws.selectDifficulty": "Choose difficulty",
    "ws.wordCount": "Number of words",
    "ws.start": "Start",
    "ws.reset": "Reset",
    "ws.found": "found",
    "ws.allFound": "All words found!",
    "ws.remaining": "remaining",
    "ws.hint.info": "Click on the desired word to see the answer in the word search",
    "ws.fontDecrease": "Decrease size",
    "ws.fontIncrease": "Increase size",
    "ws.style.pill": "Pill selection",
    "ws.style.square": "Square selection",
    "ws.difficulty.easy": "Easy",
    "ws.difficulty.normal": "Normal",
    "ws.difficulty.hard": "Hard",
    "ws.difficulty.very-hard": "Very Hard",

    // Crossword
    "quizType.crossword": "Crossword",
    "cw.selectDifficulty": "Choose difficulty",
    "cw.across": "Across",
    "cw.down": "Down",
    "cw.completed": "completed",
    "cw.allComplete": "All words completed!",
    "cw.seeAnswer": "See answer",
    "cw.hintLetter": "Hint (letter)",
    "cw.hint.info": "Click on the desired clue to see the answer",

    // Notion
    "notion.open": "Open in Notion",

    // Home
    "home.stat.quizzes": "Quizzes",
    "home.stat.questions": "Questions",
    "home.stat.types": "Types",
    "home.featured.title": "Featured Quizzes",
    "home.featured.viewAll": "View all",
    "home.categories.title": "Categories",

    // 404
    "notFound.title": "Page not found",
    "notFound.description": "The page you're looking for doesn't exist or has been moved somewhere else.",
    "notFound.home": "Home",
    "notFound.study": "Study",

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
