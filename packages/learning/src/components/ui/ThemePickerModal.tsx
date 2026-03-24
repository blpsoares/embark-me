import { useEffect, useRef } from "react";
import { X, Check } from "lucide-react";
import { useTheme, THEME_OPTIONS, type ThemeOption } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface ThemePickerModalProps {
  onClose: () => void;
}

function ThemePreviewCard({ option, isSelected, onSelect }: {
  option: ThemeOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const p = option.preview;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative w-full rounded-xl transition-all duration-200 focus:outline-none"
    >
      {/* Preview card */}
      <div
        className="overflow-hidden rounded-xl transition-transform duration-200 group-hover:scale-[1.01]"
        style={{ background: p.bg, border: `1px solid ${p.border}` }}
      >
        {/* Mini header */}
        <div
          className="flex items-center gap-1.5 border-b px-3 py-2"
          style={{ borderColor: p.border, background: p.surface }}
        >
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: "#FF5F57" }} />
            <span className="h-2 w-2 rounded-full" style={{ background: "#FEBC2E" }} />
            <span className="h-2 w-2 rounded-full" style={{ background: "#28C840" }} />
          </div>
          <div className="mx-auto h-1.5 w-16 rounded-full" style={{ background: p.border }} />
        </div>

        {/* Mini content */}
        <div className="space-y-2 p-3">
          {/* Nav-like row */}
          <div className="flex gap-1.5">
            {[p.purple, p.border, p.border].map((color, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ background: color, width: i === 0 ? "28px" : "20px" }} />
            ))}
          </div>

          {/* Title block */}
          <div className="space-y-1 pt-1">
            <div className="h-2 w-3/4 rounded-full" style={{ background: p.text }} />
            <div className="h-1.5 w-1/2 rounded-full" style={{ background: p.textSecondary, opacity: 0.7 }} />
          </div>

          {/* Card */}
          <div
            className="rounded-lg p-2 space-y-1.5"
            style={{ background: p.surface, border: `1px solid ${p.border}` }}
          >
            <div className="h-1.5 w-full rounded-full" style={{ background: p.textSecondary, opacity: 0.5 }} />
            <div className="h-1.5 w-4/5 rounded-full" style={{ background: p.textSecondary, opacity: 0.5 }} />
            <div className="flex gap-1.5 pt-0.5">
              <div className="h-2 w-8 rounded-full" style={{ background: p.purple }} />
              <div className="h-2 w-6 rounded-full" style={{ background: p.yellow, opacity: 0.8 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        className="mt-2 flex items-center justify-between px-1"
      >
        <span
          className="text-sm font-medium"
          style={{ color: isSelected ? p.purple : undefined }}
        >
          {option.label}
        </span>
        {isSelected && (
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full"
            style={{ background: p.purple }}
          >
            <Check className="h-2.5 w-2.5 text-white" />
          </span>
        )}
      </div>
    </button>
  );
}

export function ThemePickerModal({ onClose }: ThemePickerModalProps) {
  const { theme, setTheme, isDark } = useTheme();
  const { locale } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  const title = locale === "pt" ? "Aparência" : "Appearance";
  const subtitle = locale === "pt"
    ? "Escolha como o site deve aparecer para você"
    : "Choose how the site looks to you";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        ref={panelRef}
        className={`animate-scale-in w-full max-w-lg rounded-2xl border shadow-2xl ${
          isDark
            ? "border-white/10 bg-surface-raised shadow-black/60"
            : "border-slate-200/80 bg-white shadow-slate-300/40"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-5 py-4 ${
          isDark ? "border-white/8" : "border-slate-100"
        }`}>
          <div>
            <h2 className={`text-base font-semibold ${isDark ? "text-white/90" : "text-slate-900"}`}>
              {title}
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isDark ? "text-white/40 hover:bg-white/8 hover:text-white/70" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Theme grid */}
        <div className="grid grid-cols-2 gap-4 p-5">
          {THEME_OPTIONS.map((option) => (
            <ThemePreviewCard
              key={option.id}
              option={option}
              isSelected={theme === option.id}
              onSelect={() => {
                setTheme(option.id);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
