import { useRef } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
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
    <div className="mx-auto w-full max-w-lg">
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
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all md:p-12 ${
          isDragging
            ? "border-primary-400 bg-primary-50"
            : "border-slate-300 bg-white hover:border-primary-300 hover:bg-slate-50"
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

        <div className="mb-4 inline-flex rounded-xl bg-primary-100 p-4">
          <Upload className="h-8 w-8 text-primary-500" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          {isDragging ? "Solte o arquivo aqui" : "Arraste seu arquivo aqui"}
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          ou clique para selecionar &bull; JSON ou CSV
        </p>
        <p className="text-xs text-slate-400">
          CSV: coluna A = pergunta, coluna B = resposta
          <br />
          JSON: array de {"{"} pergunta, resposta {"}"}
        </p>
      </div>

      {fileName && !error && cardCount > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-accent-400/10 p-4">
          <FileText className="h-5 w-5 text-accent-600" />
          <div>
            <p className="text-sm font-medium text-slate-800">{fileName}</p>
            <p className="text-xs text-slate-500">
              {cardCount} {cardCount === 1 ? "card carregado" : "cards carregados"}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
