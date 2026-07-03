import StageSection from "../StageSection";

export default function QaEnvStage() {
  return (
    <StageSection
      tag="07 · human gate #2"
      title="/audit-qa staging"
      description="QA on the already-deployed environment, after the PR. Records qa-<env> per environment."
    >
      <div className="flex gap-2.5 font-mono text-[11.5px]">
        <span className="bg-accent-soft text-accent rounded-md px-2.5 py-1 reveal reveal-d1">dev ✓</span>
        <span className="bg-accent-soft text-accent rounded-md px-2.5 py-1 reveal reveal-d2">staging ✓</span>
      </div>
      <div className="mt-4 font-mono text-[12px] text-zinc-500 reveal reveal-d3">
        confidence → <span className="text-accent font-bold">tier-3</span>
      </div>
    </StageSection>
  );
}
