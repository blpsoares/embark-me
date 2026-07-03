import StageSection from "../StageSection";

export default function QaLocalStage() {
  return (
    <StageSection
      tag="05 · human gate #1"
      title="/audit-qa local"
      description="QA on localhost, before the PR. This approval is a blocking precondition for /audit-pr."
    >
      <div className="font-mono text-[12.5px] space-y-2 text-zinc-300">
        <div className="reveal reveal-d1">☑ checkout renders the correct total</div>
        <div className="reveal reveal-d2">☑ no visual regression</div>
        <div className="inline-block mt-3 border border-accent-soft text-accent rounded-md px-3 py-1 -rotate-2 reveal reveal-d3">
          qa-local: approved
        </div>
      </div>
    </StageSection>
  );
}
