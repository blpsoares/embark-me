import StageSection from "../StageSection";
import Terminal from "../Terminal";

export default function NewStage() {
  return (
    <StageSection
      stageId="new"
      tag="01 · open a finding"
      title="/audit-new"
      description="You describe a suspicious behavior. PDD opens finding #007, computes an initial confidence tier, and adds a coverage-map entry."
      why="It forces an observable fact, not a vague complaint — 'shows 3 items, should show 5' is accepted, 'it's broken' is rejected."
    >
      <Terminal command='pdd audit-new "checkout total diverges from legacy"'>
        <div className="text-zinc-500 reveal reveal-d1">→ finding #007 created</div>
        <div className="text-zinc-500 reveal reveal-d2">
          → confidence: <span className="text-red-400">tier-0</span> (textual)
        </div>
        <div className="text-zinc-500 reveal reveal-d3">→ coverage: checkout:total → finding-open</div>
      </Terminal>
    </StageSection>
  );
}
