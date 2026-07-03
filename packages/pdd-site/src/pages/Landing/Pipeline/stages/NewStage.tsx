import StageSection from "../StageSection";

export default function NewStage() {
  return (
    <StageSection
      tag="01 · open a finding"
      title="/audit-new"
      description="You describe a suspicious behavior. PDD opens finding #007, computes an initial confidence tier, and adds a coverage-map entry."
    >
      <div className="font-mono text-[12.5px] space-y-2">
        <div className="flex justify-between border-b border-zinc-900 pb-2 reveal reveal-d1">
          <span className="text-zinc-500">id</span>
          <span className="text-zinc-100">#007</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-2 reveal reveal-d2">
          <span className="text-zinc-500">area</span>
          <span className="text-zinc-100">checkout:total</span>
        </div>
        <div className="flex justify-between pb-2 reveal reveal-d3">
          <span className="text-zinc-500">confidence</span>
          <span className="text-red-400 border border-red-400/40 rounded px-1.5">tier-0 · low</span>
        </div>
      </div>
    </StageSection>
  );
}
