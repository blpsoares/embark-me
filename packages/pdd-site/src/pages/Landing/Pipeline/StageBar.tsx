import { PIPELINE_STAGES } from "./stages";

interface StageBarProps {
  activeIndex: number;
  visible: boolean;
}

export default function StageBar({ activeIndex, visible }: StageBarProps) {
  return (
    <div
      className={`hidden md:flex sticky top-[49px] z-30 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-6 py-2.5 items-center gap-4 text-[11px] font-mono overflow-x-auto transition-all duration-300 pointer-events-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {PIPELINE_STAGES.map((stage, i) => (
        <span
          key={stage.id}
          className={`flex items-center gap-1.5 whitespace-nowrap ${
            i === activeIndex ? "text-accent" : i < activeIndex ? "text-zinc-500" : "text-zinc-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              i === activeIndex ? "bg-accent shadow-[0_0_8px_2px_rgba(52,211,153,.5)]" : i < activeIndex ? "bg-zinc-500" : "bg-zinc-700"
            }`}
          />
          {stage.id}
        </span>
      ))}
    </div>
  );
}
