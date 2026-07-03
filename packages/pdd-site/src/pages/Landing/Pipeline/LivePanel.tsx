import type { PipelineStage } from "./stages";

interface LivePanelProps {
  stage: PipelineStage | null;
  visible: boolean;
}

const TIER_COLOR: Record<PipelineStage["tier"], string> = {
  "tier-0": "text-red-400 border-red-400/40",
  "tier-1": "text-amber-400 border-amber-400/40",
  "tier-2": "text-orange-400 border-orange-400/40",
  "tier-3": "text-accent border-accent-soft",
};

export default function LivePanel({ stage, visible }: LivePanelProps) {
  return (
    <div
      className={`hidden lg:block fixed top-[90px] right-6 z-50 w-[340px] bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-lg p-4 font-mono text-[11.5px] shadow-2xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="text-accent font-bold text-xs">PDD Board — Parity-Driven Development</div>
      <div className="text-zinc-500 my-1.5 text-[11px]">
        <span className="text-zinc-200 bg-zinc-800 px-1 rounded-sm">
          {stage?.panel === "flow" ? "Flow" : "Overview"}
        </span>{" "}
        | Worktrees | Findings | Active | Coverage
      </div>
      <div className="text-zinc-800 mb-2">────────────────────────────</div>

      {stage?.panel === "overview" && (
        <div className="space-y-1 text-zinc-500">
          <div>
            Coverage <span className="text-accent">{stage.coverage}%</span>
          </div>
          <div>
            Active <span className="text-accent">● {stage.command}</span>
          </div>
        </div>
      )}

      {stage?.panel === "flow" && (
        <div className="text-zinc-200">
          <span className="tracking-widest">
            <span className="text-accent">{"●".repeat(stage.dots)}</span>
            <span className="text-zinc-700">{"○".repeat(8 - stage.dots)}</span>
          </span>{" "}
          007 → {stage.status}
          <div className={`mt-2 inline-block px-1.5 border rounded ${TIER_COLOR[stage.tier]}`}>
            {stage.tier}
          </div>
          <span className="text-zinc-500"> · coverage {stage.coverage}%</span>
        </div>
      )}
    </div>
  );
}
