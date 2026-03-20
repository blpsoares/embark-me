import { useRef } from "react";
import { Upload, FileText, AlertCircle, FileJson, FileSpreadsheet } from "lucide-react";
import { useFileUpload } from "../../hooks/useFileUpload";
import type { Flashcard } from "../../types/flashcard";

interface DropZoneProps {
  onCardsLoaded: (cards: Flashcard[]) => void;
  cardCount: number;
}

export function DropZone({ onCardsLoaded, cardCount }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isDragging,
    error,
    fileName,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  } = useFileUpload(onCardsLoaded);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        className={`group cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 sm:p-14 ${
          isDragging
            ? "border-primary-400 bg-primary-50/80 shadow-lg shadow-primary-200/30"
            : "border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-lg hover:shadow-slate-200/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,.csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />

        {/* Icon */}
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
            isDragging
              ? "scale-110 bg-primary-500 shadow-lg shadow-primary-500/30"
              : "bg-gradient-to-br from-primary-100 to-primary-200/60 group-hover:scale-105 group-hover:shadow-md"
          }`}
        >
          <Upload
            className={`h-7 w-7 transition-colors ${
              isDragging ? "text-white" : "text-primary-500"
            }`}
          />
        </div>

        <h3 className="mb-2 text-xl font-bold text-slate-800">
          {isDragging ? "Solte o arquivo aqui" : "Arraste seu arquivo aqui"}
        </h3>
        <p className="mb-6 text-sm text-slate-400">
          ou clique para selecionar
        </p>

        {/* Format badges */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-100">
            <FileJson className="h-3.5 w-3.5 text-amber-400" />
            JSON
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-slate-100">
            <FileSpreadsheet className="h-3.5 w-3.5 text-green-400" />
            CSV
          </div>
        </div>
      </div>

      {/* Format hints */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-green-400" />
            <span className="text-xs font-bold text-slate-600">CSV</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Coluna A = pergunta
            <br />
            Coluna B = resposta
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <FileJson className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-600">JSON</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Array de objetos com
            <br />
            {"{"} pergunta, resposta {"}"}
          </p>
        </div>
      </div>

      {/* Success state */}
      {fileName && !error && cardCount > 0 && (
        <div className="animate-slide-in-right mt-5 flex items-center gap-3 rounded-2xl border border-accent-200/50 bg-accent-400/5 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/15">
            <FileText className="h-5 w-5 text-accent-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{fileName}</p>
            <p className="text-xs text-slate-400">
              {cardCount} {cardCount === 1 ? "card carregado" : "cards carregados"}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="animate-slide-in-right mt-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
