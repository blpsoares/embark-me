import { useState } from "react";
import { DropZone } from "../components/upload/DropZone";
import { FlashcardViewer } from "../components/flashcard/FlashcardViewer";
import type { Flashcard } from "../types/flashcard";
import { BookOpen, Sparkles } from "lucide-react";

export function StudyPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);

  const handleReset = () => setCards([]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {cards.length === 0 ? (
        <div className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,oklch(0.55_0.22_265_/_0.04),transparent_50%)]" />

          <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-12 sm:pt-20">
            {/* Header */}
            <div className="animate-fade-in-up mb-12 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200/60 bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Modo de Estudo
              </div>
              <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                <BookOpen className="mr-2 inline-block h-8 w-8 text-primary-500" />
                Comece a Estudar
              </h1>
              <p className="mx-auto max-w-md text-base leading-relaxed text-slate-500">
                Importe um arquivo com suas perguntas e respostas para gerar
                flashcards interativos com animacoes 3D.
              </p>
            </div>

            {/* Upload area */}
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <DropZone onCardsLoaded={setCards} cardCount={cards.length} />
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-scale-in">
          <FlashcardViewer cards={cards} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
