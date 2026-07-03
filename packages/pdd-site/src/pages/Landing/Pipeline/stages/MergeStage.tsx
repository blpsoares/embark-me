import StageSection from "../StageSection";
import Terminal from "../Terminal";

export default function MergeStage() {
  return (
    <StageSection
      stageId="merge"
      tag="08 · 100% human"
      title="merge"
      description="The AI never authors commits. Merge is done only by a human — and that's when coverage truly becomes verified."
      why="Coverage only becomes 'verified' once target-env QA is approved AND the PR is merged — never from local resolution alone."
    >
      <Terminal command="git merge audit/007">
        <div className="reveal reveal-d1 pt-1">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-zinc-500 to-accent w-[68%]" />
          </div>
          <div className="mt-2 text-zinc-500">parity coverage: 62% → 68%</div>
        </div>
        <div className="text-accent reveal reveal-d2">✓ checkout: total → verified · tier-3 · #007</div>
      </Terminal>
    </StageSection>
  );
}
