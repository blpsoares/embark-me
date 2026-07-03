import type { ReactNode } from "react";

interface StageSectionProps {
  tag: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function StageSection({ tag, title, description, children }: StageSectionProps) {
  return (
    <section className="stage relative min-h-[92vh] flex items-center gap-14 px-6 py-16 max-w-[1100px] mx-auto">
      <span className="rail-dot absolute left-[27px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-zinc-700 z-[2]" />
      <div className="stage-copy flex-1">
        <div className="text-[11px] uppercase tracking-[.2em] text-zinc-500 font-mono">{tag}</div>
        <h2 className="text-3xl font-bold mt-2 mb-3 text-zinc-50 tracking-tight">{title}</h2>
        <p className="text-zinc-400 text-[15px] leading-relaxed max-w-[400px]">{description}</p>
      </div>
      <div className="sim flex-1 max-w-[480px] bg-zinc-950 border border-zinc-800 rounded-xl p-6 min-h-[240px] shadow-2xl relative overflow-hidden">
        {children}
      </div>
    </section>
  );
}
