import { useState, useCallback, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { Search, RotateCcw, Info, Trophy, Sparkles, Minus, Plus } from "lucide-react";
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

type SelectionStyle = "pill" | "square";

interface PillGeometry {
  cx: number;
  cy: number;
  width: number;
  height: number;
  angle: number;
}

// Word color palette for found words
const WORD_COLORS = [
  "bg-primary-500/30", "bg-accent-400/30", "bg-green-500/30", "bg-blue-500/30",
  "bg-pink-500/30", "bg-yellow-500/30", "bg-purple-500/30", "bg-orange-500/30",
  "bg-teal-500/30", "bg-red-500/30", "bg-indigo-500/30", "bg-cyan-500/30",
] as const;

function computePill(
  gridEl: HTMLElement,
  r1: number, c1: number,
  r2: number, c2: number,
): PillGeometry | null {
  const el1 = gridEl.querySelector(`[data-cell="${r1},${c1}"]`) as HTMLElement | null;
  const el2 = gridEl.querySelector(`[data-cell="${r2},${c2}"]`) as HTMLElement | null;
  if (!el1 || !el2) return null;

  const gridRect = gridEl.getBoundingClientRect();
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const x1 = rect1.left + rect1.width / 2 - gridRect.left;
  const y1 = rect1.top + rect1.height / 2 - gridRect.top;
  const x2 = rect2.left + rect2.width / 2 - gridRect.left;
  const y2 = rect2.top + rect2.height / 2 - gridRect.top;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const cellSize = rect1.width;

  return {
    cx: (x1 + x2) / 2,
    cy: (y1 + y2) / 2,
    width: dist + cellSize * 0.9,
    height: cellSize * 0.82,
    angle,
  };
}

function getCellPx(gridSize: number, boost: number): number {
  const base = gridSize >= 19 ? 30 : gridSize >= 16 ? 36 : 44;
  const scale = [0.75, 1.0, 1.35][boost] ?? 1.0;
  return Math.round(base * scale);
}

function loadCellSizeBoost(): number {
  if (typeof window === "undefined") return 1;
  const saved = localStorage.getItem("ws-cell-size");
  const parsed = Number(saved);
  return saved !== null && parsed >= 0 && parsed <= 2 ? parsed : 1;
}

function loadSelectionStyle(): SelectionStyle {
  if (typeof window === "undefined") return "pill";
  const saved = localStorage.getItem("ws-selection-style");
  return saved === "square" ? "square" : "pill";
}

export function WordSearchViewer({ questions, title, quizId }: WordSearchViewerProps) {
  const { isDark } = useTheme();
  const { t, locale } = useI18n();
  const words = questions[0]?.words ?? [];

  const game = useWordSearchGame(quizId, words);

  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [endCell, setEndCell] = useState<[number, number] | null>(null);
  const [lastFoundWord, setLastFoundWord] = useState<string | null>(null);
  const [flashCells, setFlashCells] = useState<Set<string>>(new Set());

  // Display controls
  const [cellSizeBoost, setCellSizeBoost] = useState<number>(loadCellSizeBoost);
  const [selectionStyle, setSelectionStyle] = useState<SelectionStyle>(loadSelectionStyle);

  // Pill overlays
  const gridRef = useRef<HTMLDivElement>(null);
  const [activePill, setActivePill] = useState<PillGeometry | null>(null);
  const [foundPills, setFoundPills] = useState<Map<string, { geom: PillGeometry; color: string }>>(new Map());
  const [flashPill, setFlashPill] = useState<PillGeometry | null>(null);

  // Persist display preferences
  useEffect(() => {
    localStorage.setItem("ws-cell-size", String(cellSizeBoost));
  }, [cellSizeBoost]);

  useEffect(() => {
    localStorage.setItem("ws-selection-style", selectionStyle);
  }, [selectionStyle]);

  const foundCells = useMemo(() => game.getFoundCells(), [game.getFoundCells]);

  // Build word→color map (stable per quiz)
  const wordColorMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!game.gridData) return map;
    game.gridData.placedWords.forEach((pw, i) => {
      map.set(pw.word, WORD_COLORS[i % WORD_COLORS.length]!);
    });
    return map;
  }, [game.gridData]);

  // Flash per-cell animation (square mode)
  useEffect(() => {
    if (!lastFoundWord || !game.gridData) return;
    const placed = game.gridData.placedWords.find((p) => p.word === lastFoundWord);
    if (!placed) return;
    const cells = getWordCells(placed);
    setFlashCells(new Set(cells.map(([r, c]) => `${r},${c}`)));
    const timer = setTimeout(() => setFlashCells(new Set()), 600);
    return () => clearTimeout(timer);
  }, [lastFoundWord, game.gridData]);

  // Flash pill (pill mode)
  useEffect(() => {
    if (!lastFoundWord || !game.gridData || !gridRef.current || selectionStyle !== "pill") {
      setFlashPill(null);
      return;
    }
    const placed = game.gridData.placedWords.find((p) => p.word === lastFoundWord);
    if (!placed) return;
    const [dr, dc] = placed.direction;
    const endRow = placed.startRow + dr * (placed.word.length - 1);
    const endCol = placed.startCol + dc * (placed.word.length - 1);
    const geom = computePill(gridRef.current, placed.startRow, placed.startCol, endRow, endCol);
    if (geom) setFlashPill(geom);
    const timer = setTimeout(() => setFlashPill(null), 600);
    return () => clearTimeout(timer);
  }, [lastFoundWord, game.gridData, selectionStyle]);

  // Recompute found word pills whenever words are found, grid changes, or size/style changes
  const foundWordsKey = useMemo(
    () => [...game.foundWords].sort().join(","),
    [game.foundWords],
  );

  useLayoutEffect(() => {
    if (selectionStyle !== "pill" || !gridRef.current || !game.gridData) {
      setFoundPills(new Map());
      return;
    }
    const gridEl = gridRef.current;
    const newPills = new Map<string, { geom: PillGeometry; color: string }>();
    for (const pw of game.gridData.placedWords) {
      if (!game.isWordFound(pw.word)) continue;
      const [dr, dc] = pw.direction;
      const endRow = pw.startRow + dr * (pw.word.length - 1);
      const endCol = pw.startCol + dc * (pw.word.length - 1);
      const geom = computePill(gridEl, pw.startRow, pw.startCol, endRow, endCol);
      if (geom) {
        newPills.set(pw.word, { geom, color: wordColorMap.get(pw.word) ?? "bg-green-500/30" });
      }
    }
    setFoundPills(newPills);
  }, [foundWordsKey, game.gridData, selectionStyle, cellSizeBoost, wordColorMap, game.isWordFound]);

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

  const updateActivePill = useCallback((
    start: [number, number],
    end: [number, number],
  ) => {
    if (selectionStyle !== "pill" || !gridRef.current) {
      setActivePill(null);
      return;
    }
    const geom = computePill(gridRef.current, start[0], start[1], end[0], end[1]);
    setActivePill(geom);
  }, [selectionStyle]);

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    setSelecting(true);
    setStartCell([row, col]);
    setEndCell([row, col]);
    setSelectedCells(new Set([`${row},${col}`]));
    updateActivePill([row, col], [row, col]);
  }, [updateActivePill]);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (!selecting || !startCell) return;
    const cells = getCellsInLine(startCell, [row, col]);
    setSelectedCells(new Set(cells.map(([r, c]) => `${r},${c}`)));
    setEndCell([row, col]);
    updateActivePill(startCell, [row, col]);
  }, [selecting, startCell, getCellsInLine, updateActivePill]);

  const handleMouseUp = useCallback(() => {
    if (!selecting || !startCell || !game.gridData) {
      setSelecting(false);
      setSelectedCells(new Set());
      setStartCell(null);
      setEndCell(null);
      setActivePill(null);
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
    setEndCell(null);
    setActivePill(null);
  }, [selecting, startCell, selectedCells, game]);

  // Touch support
  const handleTouchStart = useCallback((row: number, col: number) => {
    setSelecting(true);
    setStartCell([row, col]);
    setEndCell([row, col]);
    setSelectedCells(new Set([`${row},${col}`]));
    updateActivePill([row, col], [row, col]);
  }, [updateActivePill]);

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
    setEndCell([r, c]);
    updateActivePill(startCell, [r, c]);
  }, [selecting, startCell, getCellsInLine, updateActivePill]);

  if (!game.started) {
    return <WordSearchConfig maxWords={words.length} onStart={game.startGame} />;
  }

  if (!game.gridData) return null;

  const { grid, placedWords, size } = game.gridData;
  const cellPx = getCellPx(size, cellSizeBoost);
  const progressPercent = (game.foundWords.size / placedWords.length) * 100;

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

  // Square mode: per-cell styling (original behavior)
  const getCellSquareStyle = (row: number, col: number): string => {
    const key = `${row},${col}`;
    if (flashCells.has(key)) return "bg-green-400/40 ring-2 ring-green-400/60 scale-110";
    const foundWord = foundCells.get(key);
    if (foundWord) return wordColorMap.get(foundWord) ?? "bg-green-500/20";
    if (selectedCells.has(key)) return "bg-primary-500/25 ring-2 ring-primary-400/40 scale-105";
    return "";
  };

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
        <div className="mb-4">
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

        {/* Display controls toolbar */}
        <div className="mb-4 flex items-center gap-2">
          {/* Font / cell size */}
          <div className={`flex items-center gap-0.5 rounded-lg border px-1 py-1 ${
            isDark ? "border-white/8 bg-surface-raised" : "border-slate-200 bg-white"
          }`}>
            <button
              type="button"
              onClick={() => setCellSizeBoost((s) => Math.max(0, s - 1))}
              disabled={cellSizeBoost === 0}
              title={t("ws.fontDecrease")}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors disabled:opacity-30 ${
                isDark ? "text-white/50 hover:bg-white/5 hover:text-white/80" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className={`px-1 text-[10px] font-bold uppercase tracking-wide ${
              isDark ? "text-white/30" : "text-slate-400"
            }`}>
              A
            </span>
            <button
              type="button"
              onClick={() => setCellSizeBoost((s) => Math.min(2, s + 1))}
              disabled={cellSizeBoost === 2}
              title={t("ws.fontIncrease")}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors disabled:opacity-30 ${
                isDark ? "text-white/50 hover:bg-white/5 hover:text-white/80" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Selection style */}
          <div className={`flex items-center gap-0.5 rounded-lg border p-0.5 ${
            isDark ? "border-white/8 bg-surface-raised" : "border-slate-200 bg-white"
          }`}>
            <button
              type="button"
              onClick={() => setSelectionStyle("pill")}
              title={t("ws.style.pill")}
              className={`flex h-7 items-center justify-center rounded-md px-2.5 text-[10px] font-bold tracking-wide transition-all ${
                selectionStyle === "pill"
                  ? isDark ? "bg-primary-500/20 text-primary-400" : "bg-primary-50 text-primary-600"
                  : isDark ? "text-white/25 hover:text-white/50" : "text-slate-300 hover:text-slate-500"
              }`}
            >
              ⬭
            </button>
            <button
              type="button"
              onClick={() => setSelectionStyle("square")}
              title={t("ws.style.square")}
              className={`flex h-7 items-center justify-center rounded-md px-2.5 text-[10px] font-bold tracking-wide transition-all ${
                selectionStyle === "square"
                  ? isDark ? "bg-primary-500/20 text-primary-400" : "bg-primary-50 text-primary-600"
                  : isDark ? "text-white/25 hover:text-white/50" : "text-slate-300 hover:text-slate-500"
              }`}
            >
              ⬜
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Grid */}
          <div
            className="shrink-0 select-none touch-none overflow-x-auto pb-2"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {/* Relative wrapper for pill overlays */}
            <div className="relative inline-block" ref={gridRef}>
              <div
                className="grid gap-px rounded-xl border p-1 sm:p-2"
                style={{
                  gridTemplateColumns: `repeat(${size}, ${cellPx}px)`,
                  borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                }}
              >
                {grid.map((row, ri) =>
                  row.map((letter, ci) => {
                    const key = `${ri},${ci}`;
                    const isFlashingCell = flashCells.has(key);

                    // In pill mode, cells have no selection background (pills handle it)
                    // In square mode, use existing per-cell styling
                    const squareStyle = selectionStyle === "square" ? getCellSquareStyle(ri, ci) : "";

                    return (
                      <div
                        key={key}
                        data-cell={key}
                        onMouseDown={() => handleCellMouseDown(ri, ci)}
                        onMouseEnter={() => handleCellMouseEnter(ri, ci)}
                        onTouchStart={() => handleTouchStart(ri, ci)}
                        className={`relative flex cursor-pointer items-center justify-center rounded-md font-mono font-bold transition-all duration-150 ${
                          squareStyle || (isDark ? "hover:bg-white/5" : "hover:bg-slate-50")
                        } ${isDark ? "text-white/70" : "text-slate-700"} ${
                          isFlashingCell && selectionStyle === "square" ? "animate-pulse" : ""
                        }`}
                        style={{ width: cellPx, height: cellPx, fontSize: Math.round(cellPx * 0.45) }}
                      >
                        <span className="relative z-10">{letter}</span>
                      </div>
                    );
                  }),
                )}
              </div>

              {/* Pill overlays (pill mode only) */}
              {selectionStyle === "pill" && (
                <>
                  {/* Found word pills */}
                  {[...foundPills.entries()].map(([word, { geom, color }]) => {
                    const isFlash = lastFoundWord === word && flashPill !== null;
                    return (
                      <div
                        key={word}
                        className={`pointer-events-none absolute rounded-full transition-all duration-200 ${
                          isFlash ? "animate-pulse bg-green-400/50 ring-2 ring-green-400/60" : color
                        }`}
                        style={{
                          left: geom.cx,
                          top: geom.cy,
                          width: geom.width,
                          height: geom.height,
                          transform: `translate(-50%, -50%) rotate(${geom.angle}deg)`,
                        }}
                      />
                    );
                  })}

                  {/* Active selection pill (while dragging) */}
                  {activePill && selecting && (
                    <div
                      className="pointer-events-none absolute rounded-full bg-primary-500/30 ring-2 ring-primary-400/50"
                      style={{
                        left: activePill.cx,
                        top: activePill.cy,
                        width: activePill.width,
                        height: activePill.height,
                        transform: `translate(-50%, -50%) rotate(${activePill.angle}deg)`,
                      }}
                    />
                  )}
                </>
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
                const justFound = lastFoundWord === pw.word && found;
                return (
                  <div
                    key={pw.word}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                      justFound
                        ? "border-green-500/40 bg-green-500/10 ring-1 ring-green-500/20"
                        : found
                          ? "border-green-500/20 bg-green-500/5"
                          : isDark
                            ? "border-white/6 bg-surface-raised/50"
                            : "border-slate-200/80 bg-white"
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
                      <span className={`block text-sm font-medium ${
                        found
                          ? isDark ? "text-white/40" : "text-slate-400"
                          : isDark ? "text-white/60" : "text-slate-600"
                      }`}>
                        {pw.clue}
                      </span>
                      <span className={`mt-0.5 block text-sm font-bold font-mono ${
                        found ? "text-green-400 line-through" : isDark ? "text-white/80" : "text-slate-800"
                      }`}>
                        {pw.word}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
