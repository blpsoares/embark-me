import StageSection from "../StageSection";

export default function ResolveStage() {
  return (
    <StageSection
      tag="03 · fix it"
      title="/audit-resolve"
      description="Fix plus a mandatory characterization test. Creates branch audit/007. Does not commit on its own."
    >
      <div className="font-mono text-[12px] space-y-1.5">
        <div className="text-red-400 bg-red-400/10 rounded px-2 py-1 reveal reveal-d1">
          − return round(round(sum) * tax)
        </div>
        <div className="text-accent bg-accent-soft rounded px-2 py-1 reveal reveal-d2">
          + return round(sum * tax)
        </div>
      </div>
      <div className="mt-4 text-zinc-500 font-mono text-[12px] reveal reveal-d3">
        <span className="text-accent">✓</span> tests/audit/007_checkout.test.ts
      </div>
    </StageSection>
  );
}
