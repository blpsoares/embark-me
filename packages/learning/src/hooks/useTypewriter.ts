import { useState, useEffect, useCallback } from "react";

type Phase = "typing" | "pausing" | "deleting";

interface UseTypewriterOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
}

export function useTypewriter(
  phrases: string[],
  options: UseTypewriterOptions = {},
) {
  const { typingSpeed = 55, deletingSpeed = 35, pauseMs = 2200 } = options;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  const currentPhrase = phrases[phraseIndex] ?? "";

  const advancePhrase = useCallback(() => {
    setPhraseIndex((prev) => (prev + 1) % phrases.length);
  }, [phrases.length]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deletingSpeed);
      } else {
        advancePhrase();
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, currentPhrase, typingSpeed, deletingSpeed, pauseMs, advancePhrase]);

  return { text, isTyping: phase === "typing" };
}
