import { useState, useMemo } from "react";
import { Link2, CheckCircle2, RotateCcw } from "lucide-react";
import type { MatchPairsQuestion, LocalizedText } from "../../types/quiz";
import { QuizComplete } from "../quiz/QuizComplete";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface MatchPairsViewerProps {
  questions: MatchPairsQuestion[];
  title: LocalizedText;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function MatchPairsViewer({ questions, title }: MatchPairsViewerProps) {
  const { isDark } = useTheme();
  const { t, locale } = useI18n();
  const pairs = questions[0]?.pairs ?? [];
  const total = pairs.length;

  const shuffledDefinitions = useMemo(() => shuffleArray(pairs.map((p) => p.definicao)), [pairs]);

  const [selectedTermo, setSelectedTermo] = useState<string | null>(null);
  const [matched, setMatched] = useState<Map<string, string>>(new Map());
  const [wrongPair, setWrongPair] = useState<{ termo: string; definicao: string } | null>(null);

  const score = [...matched.entries()].filter(([termo, definicao]) => {
    return pairs.some((p) => p.termo === termo && p.definicao === definicao);
  }).length;

  const isComplete = matched.size === total;

  const handleReset = () => {
    setSelectedTermo(null);
    setMatched(new Map());
    setWrongPair(null);
  };

  if (isComplete) {
    return (
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"}`} />
        <div className="relative mx-auto max-w-3xl px-6 py-16">
          <QuizComplete score={score} total={total} onRetry={handleReset} />
        </div>
      </div>
    );
  }

  const handleTermoClick = (termo: string) => {
    if (matched.has(termo)) return;
    setSelectedTermo(selectedTermo === termo ? null : termo);
    setWrongPair(null);
  };

  const handleDefinicaoClick = (definicao: string) => {
    if (!selectedTermo) return;
    const isAlreadyMatched = [...matched.values()].includes(definicao);
    if (isAlreadyMatched) return;

    const isCorrect = pairs.some((p) => p.termo === selectedTermo && p.definicao === definicao);

    const newMatched = new Map(matched);
    newMatched.set(selectedTermo, definicao);
    setMatched(newMatched);

    if (!isCorrect) {
      setWrongPair({ termo: selectedTermo, definicao });
      setTimeout(() => {
        setMatched((prev) => {
          const next = new Map(prev);
          next.delete(selectedTermo!);
          return next;
        });
        setWrongPair(null);
      }, 800);
    }

    setSelectedTermo(null);
  };

  const getTermoStyle = (termo: string) => {
    if (wrongPair?.termo === termo) return "border-red-500/40 bg-red-500/10 ring-1 ring-red-500/20";
    if (matched.has(termo)) return "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/20 opacity-60";
    if (selectedTermo === termo) return "border-primary-500/40 bg-primary-500/10 ring-1 ring-primary-500/20";
    return isDark
      ? "border-white/6 bg-surface-raised/50 hover:border-white/12 hover:bg-surface-raised cursor-pointer"
      : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer";
  };

  const getDefinicaoStyle = (definicao: string) => {
    const isAlreadyMatched = [...matched.values()].includes(definicao);
    if (wrongPair?.definicao === definicao) return "border-red-500/40 bg-red-500/10 ring-1 ring-red-500/20";
    if (isAlreadyMatched) return "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/20 opacity-60";
    if (selectedTermo) {
      return isDark
        ? "border-white/6 bg-surface-raised/50 hover:border-primary-500/30 hover:bg-primary-500/5 cursor-pointer"
        : "border-slate-200/80 bg-white hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer";
    }
    return isDark
      ? "border-white/6 bg-surface-raised/50"
      : "border-slate-200/80 bg-white";
  };

  return (
    <div className="relative overflow-hidden">
      <div className={`absolute inset-0 ${
        isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"
      }`} />

      <div className="relative mx-auto max-w-4xl px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
              <Link2 className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
                {title[locale]}
              </h2>
              <p className={`text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {t("mp.instructions")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary-400">{score}/{total}</span>
            <button
              type="button"
              onClick={handleReset}
              className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-sm transition-all hover:shadow-md ${
                isDark
                  ? "border-white/6 bg-surface-raised text-white/44 hover:border-white/10"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-180" />
            </button>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Termos */}
          <div className="space-y-3">
            <span className={`mb-2 block text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/20" : "text-slate-300"}`}>
              {locale === "pt" ? "Termos" : "Terms"}
            </span>
            {pairs.map((pair) => (
              <button
                key={pair.termo}
                type="button"
                onClick={() => handleTermoClick(pair.termo)}
                disabled={matched.has(pair.termo)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${getTermoStyle(pair.termo)}`}
              >
                {matched.has(pair.termo) && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />}
                <span className={`text-sm font-semibold ${isDark ? "text-white/70" : "text-slate-700"}`}>
                  {pair.termo}
                </span>
              </button>
            ))}
          </div>

          {/* Definicoes (shuffled) */}
          <div className="space-y-3">
            <span className={`mb-2 block text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/20" : "text-slate-300"}`}>
              {locale === "pt" ? "Definicoes" : "Definitions"}
            </span>
            {shuffledDefinitions.map((definicao) => {
              const isAlreadyMatched = [...matched.values()].includes(definicao);
              return (
                <button
                  key={definicao}
                  type="button"
                  onClick={() => handleDefinicaoClick(definicao)}
                  disabled={isAlreadyMatched || !selectedTermo}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${getDefinicaoStyle(definicao)}`}
                >
                  {isAlreadyMatched && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />}
                  <span className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {definicao}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
