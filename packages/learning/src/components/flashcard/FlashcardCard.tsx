import type { Flashcard } from "../../types/flashcard";
import { HelpCircle, Lightbulb } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardCard({ card, isFlipped, onFlip }: FlashcardCardProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();

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
        <div className={`backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl border p-8 shadow-xl sm:p-10 ${
          isDark
            ? "border-white/6 bg-surface-raised shadow-black/20"
            : "border-slate-200/80 bg-white shadow-slate-200/40"
        }`}>
          <div className="absolute left-6 right-6 top-0 h-0.5 rounded-b-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400" />
          <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
            isDark ? "bg-primary-500/10" : "bg-primary-50"
          }`}>
            <HelpCircle className="h-5 w-5 text-primary-400" />
          </div>
          <span className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-400">
            {t("card.question")}
          </span>
          <p className={`text-center text-lg font-semibold leading-relaxed sm:text-xl md:text-2xl ${
            isDark ? "text-white/81" : "text-slate-800"
          }`}>
            {card.pergunta}
          </p>
          <span className={`mt-auto pt-6 text-xs font-medium ${isDark ? "text-white/20" : "text-slate-300"}`}>
            {t("card.flipHint")}
          </span>
        </div>

        {/* Back - Answer */}
        <div className={`backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 shadow-xl sm:p-10 ${
          isDark
            ? "border-accent-500/15 bg-surface-raised shadow-black/20"
            : "border-accent-300/30 bg-white shadow-accent-200/20"
        }`}>
          <div className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-br from-accent-500/5 via-transparent to-primary-500/5"
              : "bg-gradient-to-br from-accent-400/5 via-transparent to-primary-400/5"
          }`} />
          <div className="absolute left-6 right-6 top-0 h-0.5 rounded-b-full bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400" />

          <div className="relative flex flex-col items-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/10">
              <Lightbulb className="h-5 w-5 text-accent-500" />
            </div>
            <span className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
              {t("card.answer")}
            </span>
            <p className={`text-center text-lg font-semibold leading-relaxed sm:text-xl md:text-2xl ${
              isDark ? "text-white/81" : "text-slate-800"
            }`}>
              {card.resposta}
            </p>
            <span className={`mt-auto pt-6 text-xs font-medium ${isDark ? "text-white/20" : "text-slate-300"}`}>
              {t("card.backHint")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
