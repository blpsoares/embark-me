import type { PipelineStage } from "./stages";

interface LivePanelProps {
  stage: PipelineStage | null;
  visible: boolean;
}

const TIER_COLOR: Record<PipelineStage["tier"], string> = {
  "tier-0": "text-red-400",
  "tier-1": "text-yellow-400",
  "tier-2": "text-fuchsia-400",
  "tier-3": "text-accent",
};

const TABS = ["Overview", "Flow", "Worktrees", "Findings", "Active", "Coverage", "Legend"];

function coverageBar(pct: number) {
  const width = 20;
  const filled = Math.round((pct / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

export default function LivePanel({ stage, visible }: LivePanelProps) {
  const dots = stage?.dots ?? 0;
  const tierCounts = { "tier-0": 0, "tier-1": 0, "tier-2": 0, "tier-3": 0 };
  if (stage) tierCounts[stage.tier] += 1;
  const findingOpen = stage && stage.status !== "verified" && stage.id !== "bootstrap" ? 1 : 0;
  const findingDone = stage?.status === "verified" ? 1 : 0;

  return (
    <div
      className={`hidden lg:block fixed top-[90px] right-6 z-50 w-[420px] bg-[#12121a]/95 backdrop-blur-md border border-zinc-800 rounded-md p-4 font-mono text-[11.5px] leading-[1.7] shadow-2xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="text-zinc-100 font-bold">
        PDD Board <span className="text-zinc-500">—</span> Parity-Driven Development
      </div>
      <div className="flex flex-wrap gap-x-2 mt-1.5 text-zinc-500">
        {TABS.map((tabName, i) => (
          <span key={tabName} className={i === 0 ? "text-zinc-100 bg-zinc-700/50 px-1 rounded-sm" : ""}>
            {tabName}
          </span>
        ))}
      </div>
      <div className="text-zinc-600 mt-1">
        ↑/↓ move · →/enter expand · Tab switch · click on · m to select/copy · q quit{"  "}
        <span className="text-accent">● live</span>
      </div>
      <div className="text-zinc-800 my-2 select-none">{"─".repeat(52)}</div>

      <div>
        <span className="text-zinc-300 font-semibold">Coverage</span>{" "}
        <span className="text-accent">{coverageBar(stage?.coverage ?? 0)}</span>{" "}
        <span className="text-zinc-100 font-semibold">{stage?.coverage ?? 0}%</span>
      </div>
      <div>
        <span className="text-zinc-300 font-semibold">Confidence</span>{" "}
        <span className="text-red-400">t0:{tierCounts["tier-0"]}</span>{" "}
        <span className="text-yellow-400">t1:{tierCounts["tier-1"]}</span>{" "}
        <span className="text-fuchsia-400">t2:{tierCounts["tier-2"]}</span>{" "}
        <span className="text-accent">t3:{tierCounts["tier-3"]}</span>
      </div>
      <div>
        <span className="text-zinc-300 font-semibold">Findings</span>{" "}
        <span className="text-red-400">open:{findingOpen}</span>{" "}
        <span className="text-zinc-400">done:{findingDone}</span>
      </div>

      <div className="mt-3">
        <div className="text-zinc-300 font-semibold">▾ Flow (pipeline per finding)</div>
        <div className="pl-2 text-zinc-400">
          ▸ 007 checkout: total rounding parity{"  "}
          <span className="tracking-widest">
            <span className="text-accent">{"●".repeat(dots)}</span>
            <span className="text-zinc-700">{"○".repeat(8 - dots)}</span>
          </span>{" "}
          → <span className={TIER_COLOR[stage?.tier ?? "tier-0"]}>{stage?.status ?? "—"}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-zinc-300 font-semibold">▾ Active now (1)</div>
        <div className="pl-2 text-zinc-400">
          <span className="text-accent">●</span> {stage?.command ?? "—"} [root] 2s @you
        </div>
      </div>
    </div>
  );
}
