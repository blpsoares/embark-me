import { ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff } from "lucide-react";

interface DeckControlsProps {
  progress: string;
  isFlipped: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFlip: () => void;
  onShuffle: () => void;
}

export function DeckControls({
  progress,
  isFlipped,
  onPrev,
  onNext,
  onFlip,
  onShuffle,
}: DeckControlsProps) {
  return (
    <div className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-xl bg-white p-3 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
          aria-label="Previous card"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onFlip}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md"
        >
          {isFlipped ? (
            <>
              <EyeOff className="h-4 w-4" />
              Ocultar Resposta
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Ver Resposta
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-white p-3 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
          aria-label="Next card"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500">{progress}</span>
        <button
          type="button"
          onClick={onShuffle}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Embaralhar
        </button>
      </div>
    </div>
  );
}
