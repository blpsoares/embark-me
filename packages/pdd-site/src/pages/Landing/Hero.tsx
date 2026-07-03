import { useEffect, useState } from "react";
import { useI18n } from "../../i18n";
import { PIPELINE_STAGES } from "./Pipeline/stages";

const TYPE_SPEED_MS = 45;

function useTypingCommand() {
  const [text, setText] = useState("");
  const full = `pdd ${PIPELINE_STAGES[0]?.command ?? ""}`;

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(full);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let c = 1; c <= full.length; c++) {
      timers.push(
        setTimeout(() => {
          if (!cancelled) setText(full.slice(0, c));
        }, c * TYPE_SPEED_MS),
      );
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return text;
}

export default function Hero() {
  const { t } = useI18n();
  const typed = useTypingCommand();

  return (
    <section className="grid-bg relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <span className="crosshair" style={{ top: 26, left: 26 }} />
      <span className="crosshair" style={{ top: 26, right: 26 }} />
      <span className="crosshair" style={{ bottom: 26, left: 26 }} />
      <span className="crosshair" style={{ bottom: 26, right: 26 }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-accent-soft rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl flex flex-col items-center">
        <div className="font-mono text-[9.5px] sm:text-[11.5px] uppercase tracking-[.12em] sm:tracking-[.22em] text-accent border border-accent-soft px-3 sm:px-4 py-1.5 mb-8 max-w-full">
          DWG NO. PDD-001 · {t.hero.eyebrow}
        </div>
        <h1 className="font-display text-[clamp(3rem,7vw,6.5rem)] font-bold text-[#f2f8fc] tracking-tight leading-[0.98] mb-8">
          {t.hero.headline}
        </h1>

        <svg viewBox="0 0 340 130" className="w-[280px] sm:w-[340px] h-auto mb-10 opacity-90">
          <rect x="20" y="20" width="90" height="90" fill="none" stroke="#5f89a8" strokeWidth="1" strokeDasharray="4 3" />
          <rect x="230" y="20" width="90" height="90" fill="none" stroke="#5eb8ff" strokeWidth="1.5" />
          <line x1="112" y1="65" x2="228" y2="65" stroke="#5eb8ff" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="170" cy="65" r="3" fill="#5eb8ff" />
          <text x="20" y="14" className="font-mono" fontSize="10" fill="#6fa5c7" letterSpacing=".05em">
            LEGACY
          </text>
          <text x="230" y="14" className="font-mono" fontSize="10" fill="#5eb8ff" letterSpacing=".05em">
            NEW
          </text>
          <text x="140" y="58" className="font-mono" fontSize="10" fill="#5eb8ff" letterSpacing=".05em">
            Δ 0.00
          </text>
        </svg>

        <div className="mx-auto w-full max-w-lg bg-[#0d2438]/90 backdrop-blur-sm border border-accent-soft px-5 py-4 mb-10 text-left shadow-2xl">
          <div className="font-mono text-[13px] sm:text-[15px] text-[#dbeaf5] min-h-[1.5em] break-words">
            <span className="text-accent">$</span> {typed}
            <span className="inline-block w-2 h-4 ml-0.5 bg-accent align-middle animate-pulse" />
          </div>
        </div>

        <a
          href="#pipeline"
          className="relative inline-block bg-accent text-[#06131f] font-mono font-semibold text-sm px-7 py-3.5 shadow-[0_0_40px_-6px_#5eb8ff] hover:shadow-[0_0_56px_-6px_#5eb8ff] transition-shadow"
        >
          {t.hero.cta} ↓
        </a>
      </div>

      <div className="hidden md:grid absolute bottom-6 right-6 border border-accent-soft font-mono text-[10px] text-[#6fa5c7]" style={{ gridTemplateColumns: "auto auto" }}>
        <div className="px-2.5 py-1 border-r border-b border-accent-soft">DRAWN</div>
        <div className="px-2.5 py-1 border-b border-accent-soft text-[#dbeaf5]">pdd-agent</div>
        <div className="px-2.5 py-1 border-r border-accent-soft">STATUS</div>
        <div className="px-2.5 py-1 text-[#dbeaf5]">VERIFIED</div>
      </div>
    </section>
  );
}
