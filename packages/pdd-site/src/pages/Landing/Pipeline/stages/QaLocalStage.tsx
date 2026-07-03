import StageSection from "../StageSection";
import Terminal from "../Terminal";

export default function QaLocalStage() {
  return (
    <StageSection
      stageId="qa-local"
      tag="05 · human gate #1"
      title="/audit-qa local"
      description="QA on localhost, before the PR. This approval is a blocking precondition for /audit-pr."
      why="A human — not the AI — decides whether the fix actually looks right before any PR gets opened."
    >
      <Terminal command="pdd audit-qa 007 local">
        <div className="text-zinc-300 reveal reveal-d1">☑ checkout renders the correct total</div>
        <div className="text-zinc-300 reveal reveal-d2">☑ no visual regression</div>
        <div className="text-accent reveal reveal-d3">✓ qa-local: approved</div>
      </Terminal>
    </StageSection>
  );
}
