import { useEffect } from "react";
import { FlashcardCard } from "./FlashcardCard";
import { DeckControls } from "./DeckControls";
import { useFlashcardDeck } from "../../hooks/useFlashcardDeck";
import type { Flashcard } from "../../types/flashcard";
import { RotateCcw, Layers } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface FlashcardViewerProps {
  cards: Flashcard[];
  onReset: () => void;
}

export function FlashcardViewer({ cards, onReset }: FlashcardViewerProps) {
  const { currentCard, progress, deck, loadCards, flip, next, prev, shuffle } =
    useFlashcardDeck();
  const { isDark } = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    loadCards(cards);
  }, [cards, loadCards]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        flip();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, flip]);

  if (!currentCard) return null;

  const currentIdx = deck.currentIndex + 1;
  const total = deck.cards.length;
  const progressPercent = (currentIdx / total) * 100;

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark
          ? "bg-gradient-to-b from-primary-950/15 to-transparent"
          : "bg-gradient-to-b from-primary-50/40 to-transparent"
      }`} />

      <div className="relative mx-auto max-w-3xl px-6 py-8 sm:py-12">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
              <Layers className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
                {t("viewer.title")}
              </h2>
              <p className={`text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {total} {t("viewer.cards")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-sm transition-all hover:shadow-md ${
              isDark
                ? "border-white/6 bg-surface-raised text-white/44 hover:border-white/10 hover:text-white/60"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-180" />
            {t("viewer.newFile")}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? "text-white/30" : "text-slate-400"}`}>
              {t("viewer.progress")}
            </span>
            <span className="text-xs font-bold text-primary-400">{progress}</span>
          </div>
          <div className={`h-1 w-full overflow-hidden rounded-full ${isDark ? "bg-white/6" : "bg-slate-100"}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <FlashcardCard card={currentCard} isFlipped={deck.isFlipped} onFlip={flip} />

        {/* Controls */}
        <DeckControls
          progress={progress}
          isFlipped={deck.isFlipped}
          onPrev={prev}
          onNext={next}
          onFlip={flip}
          onShuffle={shuffle}
        />

        {/* Keyboard hints */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {[
            { keys: ["<", ">"], label: t("viewer.hintNav") },
            { keys: ["Space"], label: t("viewer.hintFlip") },
          ].map((hint) => (
            <div key={hint.label} className="flex items-center gap-2">
              <div className="flex gap-1">
                {hint.keys.map((key) => (
                  <kbd
                    key={key}
                    className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border px-1.5 text-[10px] font-semibold ${
                      isDark
                        ? "border-white/6 bg-surface-raised text-white/30"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className={`text-[10px] font-medium ${isDark ? "text-white/20" : "text-slate-300"}`}>
                {hint.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
