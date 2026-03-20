import { useCallback, useState, type DragEvent } from "react";
import { parseFileContent, readFile } from "../utils/fileHandler";
import type { Flashcard } from "../types/flashcard";

interface UseFileUploadResult {
  isDragging: boolean;
  error: string | null;
  fileName: string | null;
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: (e: DragEvent) => void;
  handleDrop: (e: DragEvent) => void;
  handleFileSelect: (file: File) => void;
}

export function useFileUpload(
  onCardsLoaded: (cards: Flashcard[]) => void,
): UseFileUploadResult {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setFileName(file.name);

      try {
        const content = await readFile(file);
        const result = parseFileContent(file.name, content);

        if (result.error) {
          setError(result.error);
          return;
        }

        onCardsLoaded(result.cards);
      } catch {
        setError("Failed to read file");
      }
    },
    [onCardsLoaded],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        void processFile(file);
      }
    },
    [processFile],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      void processFile(file);
    },
    [processFile],
  );

  return {
    isDragging,
    error,
    fileName,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
  };
}
