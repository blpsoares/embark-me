import StageSection from "../StageSection";

export default function MergeStage() {
  return (
    <StageSection
      tag="08 · 100% human"
      title="merge"
      description="The AI never authors commits. Merge is done only by a human — and that's when coverage truly becomes verified."
    >
      <div className="reveal reveal-d1">
        <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-zinc-500 to-accent w-[68%]" />
        </div>
        <div className="mt-2.5 font-mono text-[12px] text-zinc-500">parity coverage: 62% → 68%</div>
      </div>
      <div className="mt-4 font-mono text-[12px] text-accent reveal reveal-d2">✓ merged by human</div>
    </StageSection>
  );
}
