import type { ReactNode } from "react";

interface StageSectionProps {
  tag: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function StageSection({ tag, title, description, children }: StageSectionProps) {
  return (
    <section className="stage relative flex items-center gap-16 px-6 md:px-10 py-20 md:py-28 max-w-[1240px] mx-auto">
      <span className="rail-dot absolute left-[27px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-zinc-700 z-[2]" />

      <div className="stage-copy flex-1">
        <div className="text-[12px] uppercase tracking-[.25em] text-zinc-500 font-mono mb-4">{tag}</div>
        <h2 className="text-[clamp(2.25rem,4vw,3.5rem)] font-bold mb-5 text-zinc-50 tracking-tight leading-[1.05]">
          {title}
        </h2>
        <p className="text-zinc-400 text-[17px] leading-relaxed max-w-[440px]">{description}</p>
      </div>

      <div className="sim flex-1 max-w-[560px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden p-6 md:p-7">
        {children}
      </div>
    </section>
  );
}
