import { useState, useCallback, useMemo, useEffect } from "react";
import { Search, RotateCcw, Info, Trophy, Sparkles } from "lucide-react";
import type { WordSearchQuestion, LocalizedText } from "../../types/quiz";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import { useWordSearchGame } from "../../hooks/useWordSearchGame";
import { getWordCells } from "../../utils/wordSearchGenerator";
import { WordSearchConfig } from "./WordSearchConfig";

interface WordSearchViewerProps {
  questions: WordSearchQuestion[];
  title: LocalizedText;
  quizId: string;
}

export function WordSearchViewer({ questions, title, quizId }: WordSearchViewerProps) {
  const { isDark } = useTheme();
  const { t, locale } = useI18n();
  const words = questions[0]?.words ?? [];

  const game = useWordSearchGame(quizId, words);

  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [lastFoundWord, setLastFoundWord] = useState<string | null>(null);
  const [flashCells, setFlashCells] = useState<Set<string>>(new Set());

  const foundCells = useMemo(() => game.getFoundCells(), [game.getFoundCells]);
  const revealedCells = useMemo(() => game.getRevealedCells(), [game.getRevealedCells]);

  // Flash animation when word is found
  useEffect(() => {
    if (!lastFoundWord || !game.gridData) return;
    const placed = game.gridData.placedWords.find((p) => p.word === lastFoundWord);
    if (!placed) return;
    const cells = getWordCells(placed);
    setFlashCells(new Set(cells.map(([r, c]) => `${r},${c}`)));
    const timer = setTimeout(() => setFlashCells(new Set()), 600);
    return () => clearTimeout(timer);
  }, [lastFoundWord, game.gridData]);

  const getCellsInLine = useCallback((
    start: [number, number],
    end: [number, number],
  ): [number, number][] => {
    const [r1, c1] = start;
    const [r2, c2] = end;
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);

    const diffR = Math.abs(r2 - r1);
    const diffC = Math.abs(c2 - c1);
    if (diffR !== 0 && diffC !== 0 && diffR !== diffC) return [start];

    const steps = Math.max(diffR, diffC);
    const cells: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push([r1 + dr * i, c1 + dc * i]);
    }
    return cells;
  }, []);

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    setSelecting(true);
    setStartCell([row, col]);
    setSelectedCells(new Set([`${row},${col}`]));
  }, []);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (!selecting || !startCell) return;
    const cells = getCellsInLine(startCell, [row, col]);
    setSelectedCells(new Set(cells.map(([r, c]) => `${r},${c}`)));
  }, [selecting, startCell, getCellsInLine]);

  const handleMouseUp = useCallback(() => {
    if (!selecting || !startCell || !game.gridData) {
      setSelecting(false);
      setSelectedCells(new Set());
      setStartCell(null);
      return;
    }

    const selectedStr = [...selectedCells].sort().join("|");

    for (const placed of game.gridData.placedWords) {
      if (game.isWordFound(placed.word)) continue;
      const wordCellStrs = getWordCells(placed).map(([r, c]) => `${r},${c}`).sort().join("|");
      if (selectedStr === wordCellStrs) {
        game.markFound(placed.word);
        setLastFoundWord(placed.word);
        break;
      }
    }

    setSelecting(false);
    setSelectedCells(new Set());
    setStartCell(null);
  }, [selecting, startCell, selectedCells, game]);

  // Touch support
  const handleTouchStart = useCallback((row: number, col: number) => {
    setSelecting(true);
    setStartCell([row, col]);
    setSelectedCells(new Set([`${row},${col}`]));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!selecting || !startCell) return;
    const touch = e.touches[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const cellKey = el.getAttribute("data-cell");
    if (!cellKey) return;
    const [r, c] = cellKey.split(",").map(Number) as [number, number];
    const cells = getCellsInLine(startCell, [r, c]);
    setSelectedCells(new Set(cells.map(([cr, cc]) => `${cr},${cc}`)));
  }, [selecting, startCell, getCellsInLine]);

  if (!game.started) {
    return <WordSearchConfig maxWords={words.length} onStart={game.startGame} />;
  }

  if (!game.gridData) return null;

  const { grid, placedWords, size } = game.gridData;
  const progressPercent = (game.foundWords.size / placedWords.length) * 100;

  // Color palette for found words
  const wordColors = [
    "bg-primary-500/25", "bg-accent-400/25", "bg-green-500/25", "bg-blue-500/25",
    "bg-pink-500/25", "bg-yellow-500/25", "bg-purple-500/25", "bg-orange-500/25",
    "bg-teal-500/25", "bg-red-500/25", "bg-indigo-500/25", "bg-cyan-500/25",
  ];

  const wordColorMap = new Map<string, string>();
  let colorIdx = 0;
  for (const pw of placedWords) {
    wordColorMap.set(pw.word, wordColors[colorIdx % wordColors.length]!);
    colorIdx++;
  }

  const getCellStyle = (row: number, col: number): string => {
    const key = `${row},${col}`;

    if (flashCells.has(key)) {
      return "bg-green-400/40 ring-2 ring-green-400/60 scale-110";
    }

    if (revealedCells.has(key)) {
      return "bg-amber-500/30 ring-1 ring-amber-500/40";
    }

    const foundWord = foundCells.get(key);
    if (foundWord) {
      return wordColorMap.get(foundWord) ?? "bg-green-500/20";
    }

    if (selectedCells.has(key)) {
      return "bg-primary-500/25 ring-2 ring-primary-400/40 scale-105";
    }

    return "";
  };

  if (game.isComplete) {
    return (
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"}`} />
        <div className="relative mx-auto max-w-3xl px-6 py-16">
          <div className="animate-scale-in mx-auto max-w-md text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10">
              <Trophy className="h-10 w-10 text-green-400" />
            </div>
            <h2 className={`mb-2 text-2xl font-extrabold ${isDark ? "text-white/81" : "text-slate-800"}`}>
              {t("quiz.complete.title")}
            </h2>
            <p className="mb-2 text-lg font-bold text-green-400">100%</p>
            <p className={`mb-8 text-sm ${isDark ? "text-white/44" : "text-slate-500"}`}>
              {t("ws.allFound")}
            </p>
            <button
              type="button"
              onClick={game.resetGame}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <RotateCcw className="h-4 w-4" />
              {t("quiz.complete.retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className={`absolute inset-0 ${
        isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"
      }`} />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
              <Search className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
                {title[locale]}
              </h2>
              <p className={`text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {game.foundWords.size}/{placedWords.length} {t("ws.found")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              isDark ? "bg-white/5 text-white/40" : "bg-slate-100 text-slate-500"
            }`}>
              {t(`ws.difficulty.${game.difficulty}`)}
            </span>
            <button
              type="button"
              onClick={game.resetGame}
              className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-sm transition-all hover:shadow-md ${
                isDark
                  ? "border-white/6 bg-surface-raised text-white/44 hover:border-white/10"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-180" />
              {t("ws.reset")}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className={`h-1.5 w-full overflow-hidden rounded-full ${isDark ? "bg-white/6" : "bg-slate-100"}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-green-400 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className={`text-[10px] font-medium ${isDark ? "text-white/20" : "text-slate-300"}`}>
              {Math.round(progressPercent)}%
            </span>
            {game.foundWords.size > 0 && game.foundWords.size < placedWords.length && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-primary-400">
                <Sparkles className="h-3 w-3" />
                {placedWords.length - game.foundWords.size} {t("ws.remaining")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Grid - much larger cells */}
          <div
            className="shrink-0 select-none overflow-x-auto"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            <div
              className="inline-grid gap-px rounded-xl border p-2"
              style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              }}
            >
              {grid.map((row, ri) =>
                row.map((letter, ci) => {
                  const key = `${ri},${ci}`;
                  const style = getCellStyle(ri, ci);
                  const isFlashing = flashCells.has(key);

                  return (
                    <div
                      key={key}
                      data-cell={key}
                      onMouseDown={() => handleCellMouseDown(ri, ci)}
                      onMouseEnter={() => handleCellMouseEnter(ri, ci)}
                      onTouchStart={() => handleTouchStart(ri, ci)}
                      className={`flex cursor-pointer items-center justify-center rounded-md font-mono font-bold transition-all duration-150
                        ${size <= 12
                          ? "h-10 w-10 text-base sm:h-11 sm:w-11 sm:text-lg"
                          : size <= 15
                            ? "h-9 w-9 text-sm sm:h-10 sm:w-10 sm:text-base"
                            : size <= 18
                              ? "h-8 w-8 text-xs sm:h-9 sm:w-9 sm:text-sm"
                              : "h-7 w-7 text-[11px] sm:h-8 sm:w-8 sm:text-xs"
                        }
                        ${style || (isDark ? "hover:bg-white/5" : "hover:bg-slate-50")}
                        ${isDark ? "text-white/70" : "text-slate-700"}
                        ${isFlashing ? "animate-pulse" : ""}
                      `}
                    >
                      {letter}
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Word list */}
          <div className="flex-1 min-w-0">
            {/* Info message */}
            <div className={`mb-4 flex items-start gap-2 rounded-xl border px-3 py-2.5 ${
              isDark ? "border-amber-500/15 bg-amber-500/5" : "border-amber-200 bg-amber-50"
            }`}>
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span className={`text-xs ${isDark ? "text-amber-300/70" : "text-amber-700"}`}>
                {t("ws.hint.info")}
              </span>
            </div>

            <div className="space-y-2">
              {placedWords.map((pw) => {
                const found = game.isWordFound(pw.word);
                const isRevealed = game.revealedWord === pw.word;
                const justFound = lastFoundWord === pw.word && found;
                return (
                  <button
                    key={pw.word}
                    type="button"
                    onClick={() => game.revealWord(pw.word)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                      justFound
                        ? "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/20"
                        : found
                          ? "border-green-500/20 bg-green-500/5"
                          : isRevealed
                            ? "border-amber-500/30 bg-amber-500/10"
                            : isDark
                              ? "border-white/6 bg-surface-raised/50 hover:border-white/12"
                              : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      found
                        ? "bg-green-500/20"
                        : isDark ? "bg-white/5" : "bg-slate-100"
                    }`}>
                      {found ? (
                        <span className="text-sm font-bold text-green-400">&#10003;</span>
                      ) : (
                        <span className={`text-[10px] font-bold ${isDark ? "text-white/20" : "text-slate-300"}`}>
                          {pw.word.length}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`block text-sm font-semibold truncate ${
                        found
                          ? "text-green-400 line-through"
                          : isDark ? "text-white/60" : "text-slate-600"
                      }`}>
                        {pw.clue}
                      </span>
                      {(found || isRevealed) && (
                        <span className={`mt-0.5 block text-xs font-mono ${
                          found ? "text-green-400/60" : "text-amber-400/70"
                        }`}>
                          {pw.word}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
