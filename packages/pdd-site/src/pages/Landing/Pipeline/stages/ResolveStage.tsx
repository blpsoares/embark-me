import StageSection from "../StageSection";
import Terminal from "../Terminal";

export default function ResolveStage() {
  return (
    <StageSection
      stageId="resolve"
      tag="03 · fix it"
      title="/audit-resolve"
      description="Fix plus a mandatory characterization test. Creates branch audit/007. Does not commit on its own."
      why="The test pins the reference behavior permanently — it fails if anyone ever regresses this fix later."
    >
      <Terminal command="pdd audit-resolve 007">
        <div className="text-accent reveal reveal-d1">✓ branch audit/007 created</div>
        <div className="text-accent reveal reveal-d2">✓ tests/audit/007_checkout.test.ts</div>
        <div className="text-zinc-500 reveal reveal-d3">→ waiting for human commit</div>
      </Terminal>
    </StageSection>
  );
}
