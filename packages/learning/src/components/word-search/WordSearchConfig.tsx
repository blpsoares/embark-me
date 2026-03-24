import { useState } from "react";
import { Search, Play } from "lucide-react";
import type { WordSearchDifficulty } from "../../types/quiz";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface WordSearchConfigProps {
  maxWords: number;
  onStart: (difficulty: WordSearchDifficulty, wordCount: number) => void;
}

const DIFFICULTIES: WordSearchDifficulty[] = ["easy", "normal", "hard", "very-hard"];

export function WordSearchConfig({ maxWords, onStart }: WordSearchConfigProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const [difficulty, setDifficulty] = useState<WordSearchDifficulty>("normal");
  const [wordCount, setWordCount] = useState(Math.min(maxWords, 10));

  return (
    <div className="relative overflow-hidden">
      <div className={`absolute inset-0 ${
        isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"
      }`} />

      <div className="relative mx-auto max-w-lg px-6 py-12 sm:py-16">
        <div className="animate-fade-in-up text-center">
          <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${
            isDark ? "bg-primary-500/10" : "bg-primary-50"
          }`}>
            <Search className="h-8 w-8 text-primary-400" />
          </div>

          <h2 className={`mb-2 text-2xl font-extrabold ${isDark ? "text-white/81" : "text-slate-800"}`}>
            {t("quizType.word-search")}
          </h2>
          <p className={`mb-8 text-sm ${isDark ? "text-white/44" : "text-slate-500"}`}>
            {t("ws.selectDifficulty")}
          </p>

          {/* Difficulty */}
          <div className="mb-8 grid grid-cols-2 gap-3">
            {DIFFICULTIES.map((diff) => {
              const isActive = diff === difficulty;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border-primary-500/40 bg-primary-500/10 text-primary-400 ring-1 ring-primary-500/20"
                      : isDark
                        ? "border-white/6 bg-surface-raised/50 text-white/44 hover:border-white/12"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {t(`ws.difficulty.${diff}`)}
                </button>
              );
            })}
          </div>

          {/* Word count slider */}
          <div className="mb-8">
            <label className={`mb-3 block text-sm font-semibold ${isDark ? "text-white/60" : "text-slate-600"}`}>
              {t("ws.wordCount")}: <span className="text-primary-400">{wordCount}</span>
            </label>
            <input
              type="range"
              min={3}
              max={maxWords}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className={`mt-1 flex justify-between text-xs ${isDark ? "text-white/20" : "text-slate-300"}`}>
              <span>3</span>
              <span>{maxWords}</span>
            </div>
          </div>

          {/* Start button */}
          <button
            type="button"
            onClick={() => onStart(difficulty, wordCount)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <Play className="h-4 w-4" />
            {t("ws.start")}
          </button>
        </div>
      </div>
    </div>
  );
}
