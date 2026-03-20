import type { Flashcard } from "../../types/flashcard";

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardCard({ card, isFlipped, onFlip }: FlashcardCardProps) {
  return (
    <div className="perspective-1000 mx-auto w-full max-w-lg">
      <div
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onFlip();
        }}
        role="button"
        tabIndex={0}
        className={`card-flip preserve-3d relative h-64 w-full cursor-pointer md:h-80 ${
          isFlipped ? "flipped" : ""
        }`}
      >
        {/* Front - Question */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <span className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-500">
            Pergunta
          </span>
          <p className="text-center text-lg font-medium leading-relaxed text-slate-800 md:text-xl">
            {card.pergunta}
          </p>
          <span className="mt-6 text-xs text-slate-400">
            Clique para ver a resposta
          </span>
        </div>

        {/* Back - Answer */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-accent-400/30 bg-gradient-to-br from-accent-400/5 to-primary-100/30 p-8 shadow-lg">
          <span className="mb-4 text-xs font-bold uppercase tracking-wider text-accent-600">
            Resposta
          </span>
          <p className="text-center text-lg font-medium leading-relaxed text-slate-800 md:text-xl">
            {card.resposta}
          </p>
          <span className="mt-6 text-xs text-slate-400">
            Clique para voltar a pergunta
          </span>
        </div>
      </div>
    </div>
  );
}
