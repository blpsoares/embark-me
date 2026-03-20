import type { Flashcard } from "../../types/flashcard";
import { HelpCircle, Lightbulb } from "lucide-react";

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardCard({ card, isFlipped, onFlip }: FlashcardCardProps) {
  return (
    <div className="perspective-1000 mx-auto w-full max-w-xl">
      <div
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onFlip();
        }}
        role="button"
        tabIndex={0}
        className={`card-flip preserve-3d relative h-72 w-full cursor-pointer sm:h-80 md:h-96 ${
          isFlipped ? "flipped" : ""
        }`}
      >
        {/* Front - Question */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/40 sm:p-10">
          {/* Top accent line */}
          <div className="absolute left-6 right-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400" />

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
            <HelpCircle className="h-5 w-5 text-primary-400" />
          </div>
          <span className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-400">
            Pergunta
          </span>
          <p className="text-center text-lg font-semibold leading-relaxed text-slate-800 sm:text-xl md:text-2xl">
            {card.pergunta}
          </p>
          <span className="mt-auto pt-6 text-xs font-medium text-slate-300">
            Clique ou pressione espaco para revelar
          </span>
        </div>

        {/* Back - Answer */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-accent-300/30 bg-white p-8 shadow-xl shadow-accent-200/20 sm:p-10">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 via-transparent to-primary-400/5" />
          {/* Top accent line */}
          <div className="absolute left-6 right-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400" />

          <div className="relative flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/10">
              <Lightbulb className="h-5 w-5 text-accent-500" />
            </div>
            <span className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
              Resposta
            </span>
            <p className="text-center text-lg font-semibold leading-relaxed text-slate-800 sm:text-xl md:text-2xl">
              {card.resposta}
            </p>
            <span className="mt-auto pt-6 text-xs font-medium text-slate-300">
              Clique para voltar a pergunta
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
