import { useState } from "react";
import { DropZone } from "../components/upload/DropZone";
import { FlashcardViewer } from "../components/flashcard/FlashcardViewer";
import type { Flashcard } from "../types/flashcard";
import { BookOpen, Sparkles } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useI18n } from "../contexts/I18nContext";

export function StudyPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const { isDark } = useTheme();
  const { t } = useI18n();

  const handleReset = () => setCards([]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {cards.length === 0 ? (
        <div className="relative overflow-hidden">
          {/* Background */}
          <div className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-b from-primary-950/20 to-transparent"
              : "bg-gradient-to-b from-primary-50/50 to-transparent"
          }`} />

          <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-12 sm:pt-20">
            {/* Header */}
            <div className="animate-fade-in-up mb-12 text-center">
              <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${
                isDark
                  ? "border-primary-500/15 bg-primary-500/8 text-primary-300"
                  : "border-primary-200/60 bg-white text-primary-600"
              }`}>
                <Sparkles className="h-3.5 w-3.5" />
                {t("study.badge")}
              </div>
              <h1 className={`mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
                isDark ? "text-white/81" : "text-slate-900"
              }`}>
                <BookOpen className="mr-2 inline-block h-8 w-8 text-primary-500" />
                {t("study.title")}
              </h1>
              <p className={`mx-auto max-w-md text-base leading-relaxed ${
                isDark ? "text-white/44" : "text-slate-500"
              }`}>
                {t("study.subtitle")}
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
