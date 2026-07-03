import { useEffect, useState } from "react";
import { useI18n } from "../../i18n";
import { PIPELINE_STAGES } from "./Pipeline/stages";

const TYPE_SPEED_MS = 45;
const HOLD_MS = 1400;
const ERASE_SPEED_MS = 20;

function useTypingCommand() {
  const [text, setText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(PIPELINE_STAGES[0]?.command ?? "");
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)));

    async function run() {
      let i = 0;
      while (!cancelled) {
        const stage = PIPELINE_STAGES[i % PIPELINE_STAGES.length];
        const full = `pdd ${stage?.command ?? ""}`;
        for (let c = 1; c <= full.length; c++) {
          if (cancelled) return;
          setText(full.slice(0, c));
          await wait(TYPE_SPEED_MS);
        }
        await wait(HOLD_MS);
        for (let c = full.length; c >= 0; c--) {
          if (cancelled) return;
          setText(full.slice(0, c));
          await wait(ERASE_SPEED_MS);
        }
        i++;
      }
    }

    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return text;
}

export default function Hero() {
  const { t } = useI18n();
  const typed = useTypingCommand();

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-accent-soft rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-soft opacity-40 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="text-[13px] uppercase tracking-[.4em] text-accent font-semibold mb-6">
          {t.hero.eyebrow}
        </div>
        <h1 className="text-[clamp(3rem,7vw,6.5rem)] font-bold text-zinc-50 tracking-tight leading-[0.98] mb-8">
          {t.hero.headline}
        </h1>

        <div className="mx-auto max-w-lg bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-xl px-5 py-4 mb-10 text-left shadow-2xl">
          <div className="flex gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>
          <div className="font-mono text-[15px] text-zinc-200 min-h-[1.5em]">
            <span className="text-accent">$</span> {typed}
            <span className="inline-block w-2 h-4 ml-0.5 bg-accent align-middle animate-pulse" />
          </div>
        </div>

        <a
          href="#pipeline"
          className="relative inline-block bg-accent text-black font-semibold text-base px-7 py-3.5 rounded-lg shadow-[0_0_40px_-6px_#34d399] hover:shadow-[0_0_56px_-6px_#34d399] transition-shadow"
        >
          {t.hero.cta} ↓
        </a>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 text-xs font-mono">
        <span>scroll</span>
        <span className="animate-bounce">↓</span>
      </div>
    </section>
  );
}
