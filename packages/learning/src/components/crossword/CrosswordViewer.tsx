import { useRef, useEffect, useCallback, useState } from "react";
import { Grid3X3, RotateCcw, Trophy, Eye, Lightbulb, Info, Sparkles, Minus, Plus, Square, Circle } from "lucide-react";
import type { CrosswordQuestion, LocalizedText } from "../../types/quiz";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import { useCrosswordGame } from "../../hooks/useCrosswordGame";
import { getEntryCells, type CrosswordEntry } from "../../utils/crosswordGenerator";
import { CrosswordConfig } from "./CrosswordConfig";

interface CrosswordViewerProps {
  questions: CrosswordQuestion[];
  title: LocalizedText;
  quizId: string;
}

type SelectionStyle = "square" | "circle";

const CELL_SIZES = [32, 36, 44] as const;
const INPUT_FONT_SIZES = [16, 16, 20] as const; // Always >= 16px to prevent iOS zoom
const NUMBER_FONT_SIZES = [7, 9, 11] as const;

function loadCellSize(): number {
  if (typeof window === "undefined") return 1;
  const saved = localStorage.getItem("cw-cell-size");
  const parsed = Number(saved);
  return saved !== null && parsed >= 0 && parsed <= 2 ? parsed : 1;
}

function loadSelectionStyle(): SelectionStyle {
  if (typeof window === "undefined") return "circle";
  const saved = localStorage.getItem("cw-selection-style");
  return saved === "square" ? "square" : "circle";
}

export function CrosswordViewer({ questions, title, quizId }: CrosswordViewerProps) {
  const { isDark } = useTheme();
  const { t, locale } = useI18n();
  const clues = questions[0]?.clues ?? [];

  const game = useCrosswordGame(quizId, clues);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lastCompletedWord, setLastCompletedWord] = useState<string | null>(null);
  const [flashCells, setFlashCells] = useState<Set<string>>(new Set());

  // Display controls
  const [cellSize, setCellSize] = useState<number>(loadCellSize);
  const [selectionStyle, setSelectionStyle] = useState<SelectionStyle>(loadSelectionStyle);
  const [focusedCell, setFocusedCell] = useState<string | null>(null);

  const cellPx = CELL_SIZES[cellSize] ?? 36;
  const inputFontPx = INPUT_FONT_SIZES[cellSize] ?? 16;
  const numberFontPx = NUMBER_FONT_SIZES[cellSize] ?? 9;

  // Persist display preferences
  useEffect(() => {
    localStorage.setItem("cw-cell-size", String(cellSize));
  }, [cellSize]);

  useEffect(() => {
    localStorage.setItem("cw-selection-style", selectionStyle);
  }, [selectionStyle]);

  // Flash animation for completed word
  useEffect(() => {
    if (!lastCompletedWord || !game.layout) return;
    const entry = game.layout.entries.find(
      (e) => `${e.number}-${e.direction}` === lastCompletedWord,
    );
    if (!entry) return;
    const cells = getEntryCells(entry);
    setFlashCells(new Set(cells.map(([r, c]) => `${r},${c}`)));
    const timer = setTimeout(() => {
      setFlashCells(new Set());
      setLastCompletedWord(null);
    }, 800);
    return () => clearTimeout(timer);
  }, [lastCompletedWord, game.layout]);

  // Check for newly completed words
  const prevCompletedRef = useRef(game.completedCount);
  useEffect(() => {
    if (game.completedCount > prevCompletedRef.current && game.layout) {
      for (const entry of game.layout.entries) {
        const key = `${entry.number}-${entry.direction}`;
        if (game.isWordComplete(entry) && key !== lastCompletedWord) {
          setLastCompletedWord(key);
          break;
        }
      }
    }
    prevCompletedRef.current = game.completedCount;
  }, [game.completedCount, game.layout, game.isWordComplete, lastCompletedWord]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        game.setActiveClueDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [game.setActiveClueDropdown]);

  // Track whether focus came from typing (programmatic) vs user click
  const programmaticFocusRef = useRef(false);

  const focusCell = useCallback((row: number, col: number) => {
    programmaticFocusRef.current = true;
    const input = inputRefs.current.get(`${row},${col}`);
    input?.focus();
  }, []);

  const handleCellInput = useCallback((row: number, col: number, value: string) => {
    if (!game.activeEntry) return;
    const letter = value.toUpperCase().replace(/[^A-Z]/g, "");
    if (!letter) return;

    game.setCellValue(row, col, letter[0]!);

    const dr = game.activeEntry.direction === "down" ? 1 : 0;
    const dc = game.activeEntry.direction === "across" ? 1 : 0;
    focusCell(row + dr, col + dc);
  }, [game, focusCell]);

  const handleCellKeyDown = useCallback((row: number, col: number, e: React.KeyboardEvent) => {
    if (!game.activeEntry) return;

    const dr = game.activeEntry.direction === "down" ? 1 : 0;
    const dc = game.activeEntry.direction === "across" ? 1 : 0;

    if (e.key === "Backspace") {
      e.preventDefault();
      const current = game.getCellValue(row, col);
      if (current) {
        game.setCellValue(row, col, "");
      } else {
        game.setCellValue(row - dr, col - dc, "");
        focusCell(row - dr, col - dc);
      }
    } else if (e.key === "ArrowRight") {
      focusCell(row, col + 1);
    } else if (e.key === "ArrowLeft") {
      focusCell(row, col - 1);
    } else if (e.key === "ArrowDown") {
      focusCell(row + 1, col);
    } else if (e.key === "ArrowUp") {
      focusCell(row - 1, col);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (game.layout) {
        const idx = game.layout.entries.findIndex((en) => en === game.activeEntry);
        const next = game.layout.entries[(idx + 1) % game.layout.entries.length];
        if (next) {
          game.setActiveEntry(next);
          focusCell(next.row, next.col);
        }
      }
    }
  }, [game, focusCell]);

  // Only called on actual mouse click — toggles direction at intersections
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!game.layout) return;

    const matching = game.layout.entries.filter((entry) => {
      const cells = getEntryCells(entry);
      return cells.some(([r, c]) => r === row && c === col);
    });

    if (matching.length === 0) return;

    if (game.activeEntry && matching.length > 1) {
      const current = game.activeEntry;
      const other = matching.find((e) => e.direction !== current.direction);
      if (other) {
        game.setActiveEntry(other);
        return;
      }
    }

    game.setActiveEntry(matching[0]!);
  }, [game]);

  // Called on focus — keeps current direction when focus is programmatic
  const handleCellFocus = useCallback((row: number, col: number) => {
    setFocusedCell(`${row},${col}`);
    if (programmaticFocusRef.current) {
      programmaticFocusRef.current = false;
      return;
    }
    handleCellClick(row, col);
  }, [handleCellClick]);

  const handleCellBlur = useCallback(() => {
    setFocusedCell(null);
  }, []);

  const handleClueClick = useCallback((entry: CrosswordEntry) => {
    game.setActiveEntry(entry);
    focusCell(entry.row, entry.col);
  }, [game, focusCell]);

  const handleClueDropdownToggle = useCallback((entryNumber: number) => {
    game.setActiveClueDropdown(
      game.activeClueDropdown === entryNumber ? null : entryNumber,
    );
  }, [game]);

  if (!game.started) {
    return <CrosswordConfig onStart={game.startGame} />;
  }

  if (!game.layout || game.layout.entries.length === 0) return null;

  if (game.isComplete) {
    return (
      <div className="relative">
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
              {t("cw.allComplete")}
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

  const { grid, entries, rows, cols } = game.layout;
  const progressPercent = (game.completedCount / entries.length) * 100;

  const activeCells = new Set<string>();
  if (game.activeEntry) {
    for (const [r, c] of getEntryCells(game.activeEntry)) {
      activeCells.add(`${r},${c}`);
    }
  }

  const acrossEntries = entries.filter((e) => e.direction === "across").sort((a, b) => a.number - b.number);
  const downEntries = entries.filter((e) => e.direction === "down").sort((a, b) => a.number - b.number);

  return (
    <div className="relative">
      <div className={`absolute inset-0 pointer-events-none ${
        isDark ? "bg-gradient-to-b from-primary-950/15 to-transparent" : "bg-gradient-to-b from-primary-50/40 to-transparent"
      }`} />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
              <Grid3X3 className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDark ? "text-white/81" : "text-slate-800"}`}>
                {title[locale]}
              </h2>
              <p className={`text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {game.completedCount}/{entries.length} {t("cw.completed")}
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
            {game.completedCount > 0 && game.completedCount < entries.length && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-primary-400">
                <Sparkles className="h-3 w-3" />
                {entries.length - game.completedCount} {t("ws.remaining")}
              </span>
            )}
          </div>
        </div>

        {/* Display controls toolbar */}
        <div className="mb-4 flex items-center gap-2">
          {/* Font size control */}
          <div className={`flex items-center gap-0.5 rounded-lg border px-1 py-1 ${
            isDark ? "border-white/8 bg-surface-raised" : "border-slate-200 bg-white"
          }`}>
            <button
              type="button"
              onClick={() => setCellSize((s) => Math.max(0, s - 1))}
              disabled={cellSize === 0}
              title={t("cw.fontDecrease")}
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
              onClick={() => setCellSize((s) => Math.min(2, s + 1))}
              disabled={cellSize === 2}
              title={t("cw.fontIncrease")}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors disabled:opacity-30 ${
                isDark ? "text-white/50 hover:bg-white/5 hover:text-white/80" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Selection style control */}
          <div className={`flex items-center gap-0.5 rounded-lg border p-0.5 ${
            isDark ? "border-white/8 bg-surface-raised" : "border-slate-200 bg-white"
          }`}>
            <button
              type="button"
              onClick={() => setSelectionStyle("circle")}
              title={t("cw.style.circle")}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                selectionStyle === "circle"
                  ? isDark ? "bg-primary-500/20 text-primary-400" : "bg-primary-50 text-primary-600"
                  : isDark ? "text-white/25 hover:text-white/50" : "text-slate-300 hover:text-slate-500"
              }`}
            >
              <Circle className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSelectionStyle("square")}
              title={t("cw.style.square")}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                selectionStyle === "square"
                  ? isDark ? "bg-primary-500/20 text-primary-400" : "bg-primary-50 text-primary-600"
                  : isDark ? "text-white/25 hover:text-white/50" : "text-slate-300 hover:text-slate-500"
              }`}
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Info message */}
        <div className={`mb-6 flex items-start gap-2 rounded-xl border px-3 py-2.5 ${
          isDark ? "border-amber-500/15 bg-amber-500/5" : "border-amber-200 bg-amber-50"
        }`}>
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <span className={`text-xs ${isDark ? "text-amber-300/70" : "text-amber-700"}`}>
            {t("cw.hint.info")}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {/* Grid */}
          <div className="shrink-0 overflow-x-auto pb-2">
            <div
              className="inline-grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${cols}, ${cellPx}px)` }}
            >
              {Array.from({ length: rows }, (_, ri) =>
                Array.from({ length: cols }, (_, ci) => {
                  const cell = grid[ri]![ci]!;
                  const key = `${ri},${ci}`;

                  if (cell.isBlack) {
                    return <div key={key} style={{ width: cellPx, height: cellPx }} />;
                  }

                  const isActive = activeCells.has(key);
                  const isFocused = focusedCell === key;
                  const value = game.getCellValue(ri, ci);
                  const correctState = value ? game.isCellCorrect(ri, ci) : null;
                  const isHinted = game.isCellHinted(ri, ci);
                  const isRevealed = game.activeEntry ? game.isWordRevealed(game.activeEntry) : false;
                  const isFlashing = flashCells.has(key);

                  // Square mode: change cell border/background (existing behavior)
                  // Circle mode: cell stays neutral, inner circle shows highlight
                  let cellBg: string;
                  let circleClass: string | null = null;

                  if (selectionStyle === "circle") {
                    cellBg = isDark ? "bg-surface-raised border-white/10" : "bg-white border-slate-300";

                    if (isFlashing) {
                      circleClass = "bg-green-400/50";
                    } else if (isActive) {
                      if (isFocused) {
                        circleClass = isDark ? "bg-primary-500/40" : "bg-primary-200/80";
                      } else {
                        circleClass = isDark ? "bg-primary-500/15" : "bg-primary-100/70";
                      }
                    }
                    if (correctState === true && value && !isFlashing) {
                      circleClass = isDark ? "bg-green-500/25" : "bg-green-100";
                    }
                    if (isHinted && !isFlashing) {
                      circleClass = isDark ? "bg-amber-500/25" : "bg-amber-100";
                    }
                    if (isRevealed && isActive && !isFlashing) {
                      circleClass = isDark ? "bg-blue-500/25" : "bg-blue-100";
                    }
                  } else {
                    // Square mode (original behavior)
                    cellBg = isDark ? "bg-surface-raised border-white/10" : "bg-white border-slate-300";
                    if (isFlashing) {
                      cellBg = "bg-green-400/30 border-green-400/60 ring-1 ring-green-400/40";
                    } else if (isActive) {
                      cellBg = isDark ? "bg-primary-500/10 border-primary-500/30" : "bg-primary-50 border-primary-400";
                    }
                    if (correctState === true && value && !isFlashing) {
                      cellBg = isDark ? "bg-green-500/10 border-green-500/30" : "bg-green-50 border-green-400";
                    }
                    if (isHinted && !isFlashing) {
                      cellBg = isDark ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-400";
                    }
                    if (isRevealed && isActive && !isFlashing) {
                      cellBg = isDark ? "bg-blue-500/10 border-blue-500/30" : "bg-blue-50 border-blue-400";
                    }
                  }

                  return (
                    <div
                      key={key}
                      className={`relative border transition-all duration-200 ${cellBg} ${isFlashing ? "animate-pulse" : ""}`}
                      style={{ width: cellPx, height: cellPx }}
                      onClick={() => handleCellClick(ri, ci)}
                    >
                      {/* Circle highlight overlay */}
                      {circleClass && (
                        <div
                          className={`absolute inset-1 rounded-full transition-all duration-200 ${circleClass}`}
                        />
                      )}
                      {cell.number && (
                        <span
                          className={`absolute left-0.5 top-0 z-10 font-bold leading-tight ${
                            isDark ? "text-white/40" : "text-slate-400"
                          }`}
                          style={{ fontSize: numberFontPx }}
                        >
                          {cell.number}
                        </span>
                      )}
                      <input
                        ref={(el) => {
                          if (el) inputRefs.current.set(key, el);
                          else inputRefs.current.delete(key);
                        }}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleCellInput(ri, ci, e.target.value)}
                        onKeyDown={(e) => handleCellKeyDown(ri, ci, e)}
                        onFocus={() => handleCellFocus(ri, ci)}
                        onBlur={handleCellBlur}
                        className={`absolute inset-0 z-10 w-full bg-transparent text-center font-mono font-bold uppercase caret-primary-500 outline-none ${
                          isDark ? "text-white/80" : "text-slate-800"
                        }`}
                        style={{ fontSize: inputFontPx }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                      />
                    </div>
                  );
                }),
              )}
            </div>
          </div>

          {/* Clue lists */}
          <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row">
            {/* Across */}
            <div className="flex-1">
              <h3 className={`mb-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {t("cw.across")}
              </h3>
              <div className="space-y-1.5">
                {acrossEntries.map((entry) => (
                  <ClueItem
                    key={`a-${entry.number}`}
                    entry={entry}
                    isActive={game.activeEntry === entry}
                    isComplete={game.isWordComplete(entry)}
                    isRevealed={game.isWordRevealed(entry)}
                    isDark={isDark}
                    showDropdown={game.activeClueDropdown === entry.number && game.activeEntry?.direction === entry.direction}
                    dropdownRef={dropdownRef}
                    onClick={() => handleClueClick(entry)}
                    onDropdownToggle={() => {
                      game.setActiveEntry(entry);
                      handleClueDropdownToggle(entry.number);
                    }}
                    onReveal={() => game.revealWord(entry)}
                    onHint={() => game.giveHint(entry)}
                    t={t}
                  />
                ))}
              </div>
            </div>

            {/* Down */}
            <div className="flex-1">
              <h3 className={`mb-3 text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {t("cw.down")}
              </h3>
              <div className="space-y-1.5">
                {downEntries.map((entry) => (
                  <ClueItem
                    key={`d-${entry.number}`}
                    entry={entry}
                    isActive={game.activeEntry === entry}
                    isComplete={game.isWordComplete(entry)}
                    isRevealed={game.isWordRevealed(entry)}
                    isDark={isDark}
                    showDropdown={game.activeClueDropdown === entry.number && game.activeEntry?.direction === entry.direction}
                    dropdownRef={dropdownRef}
                    onClick={() => handleClueClick(entry)}
                    onDropdownToggle={() => {
                      game.setActiveEntry(entry);
                      handleClueDropdownToggle(entry.number);
                    }}
                    onReveal={() => game.revealWord(entry)}
                    onHint={() => game.giveHint(entry)}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Clue item with dropdown ──

interface ClueItemProps {
  entry: CrosswordEntry;
  isActive: boolean;
  isComplete: boolean;
  isRevealed: boolean;
  isDark: boolean;
  showDropdown: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
  onDropdownToggle: () => void;
  onReveal: () => void;
  onHint: () => void;
  t: (key: string) => string;
}

function ClueItem({
  entry,
  isActive,
  isComplete,
  isRevealed,
  isDark,
  showDropdown,
  dropdownRef,
  onClick,
  onDropdownToggle,
  onReveal,
  onHint,
  t,
}: ClueItemProps) {
  return (
    <div className="relative">
      <div
        className={`flex items-start gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
          isComplete
            ? "bg-green-500/5 ring-1 ring-green-500/10"
            : isActive
              ? isDark ? "bg-primary-500/10 ring-1 ring-primary-500/20" : "bg-primary-50 ring-1 ring-primary-200"
              : ""
        }`}
      >
        <button
          type="button"
          onClick={onDropdownToggle}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold transition-all duration-200 ${
            isComplete
              ? "bg-green-500/20 text-green-400"
              : isRevealed
                ? "bg-blue-500/20 text-blue-400"
                : isDark
                  ? "bg-white/10 text-white/50 hover:bg-white/15"
                  : "bg-slate-200 text-slate-500 hover:bg-slate-300"
          }`}
        >
          {isComplete ? "\u2713" : entry.number}
        </button>
        <button
          type="button"
          onClick={onClick}
          className={`flex-1 text-left text-xs leading-relaxed transition-all duration-200 ${
            isComplete
              ? "text-green-400 line-through"
              : isDark ? "text-white/50" : "text-slate-600"
          }`}
        >
          {entry.clue}
          {isComplete && (
            <span className="ml-2 inline-block text-[10px] font-mono text-green-400/60 no-underline">
              {entry.word}
            </span>
          )}
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 top-full z-10 mt-1 w-48 rounded-xl border p-1 shadow-xl ${
            isDark ? "border-white/10 bg-surface-raised" : "border-slate-200 bg-white"
          }`}
        >
          <button
            type="button"
            onClick={onReveal}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              isDark ? "text-white/60 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            {t("cw.seeAnswer")}
          </button>
          <button
            type="button"
            onClick={onHint}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              isDark ? "text-white/60 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            {t("cw.hintLetter")}
          </button>
        </div>
      )}
    </div>
  );
}
