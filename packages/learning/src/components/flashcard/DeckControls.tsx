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
  isFlipped,
  onPrev,
  onNext,
  onFlip,
  onShuffle,
}: DeckControlsProps) {
  return (
    <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-5">
      {/* Main controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 hover:shadow-md active:scale-95"
          aria-label="Previous card"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onFlip}
          className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98]"
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
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 hover:shadow-md active:scale-95"
          aria-label="Next card"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Shuffle */}
      <button
        type="button"
        onClick={onShuffle}
        className="group inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-400 backdrop-blur-sm transition-all hover:border-primary-200 hover:bg-primary-50/50 hover:text-primary-500"
      >
        <Shuffle className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
        Embaralhar deck
      </button>
    </div>
  );
}
