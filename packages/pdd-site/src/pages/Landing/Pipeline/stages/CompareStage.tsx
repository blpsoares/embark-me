import { Suspense, lazy } from "react";
import StageSection from "../StageSection";
import Terminal from "../Terminal";

const CompareScene3D = lazy(() => import("../../../../components/CompareScene3D"));

export default function CompareStage() {
  return (
    <StageSection
      tag="04 · objective proof"
      title="/audit-compare"
      description="Golden-master harness: runs the same operation on both systems and produces an objective data-to-data diff."
    >
      <Terminal command="pdd audit-compare 007">
        <Suspense fallback={<div className="h-[160px]" />}>
          <CompareScene3D />
        </Suspense>
        <div className="text-red-400 reveal reveal-d1">− legacy: total = 129.90</div>
        <div className="text-accent reveal reveal-d2">+ new: total = 129.90</div>
        <div className="text-zinc-500 reveal reveal-d3">
          → <span className="text-orange-400">tier-2</span> · automated diff ✓
        </div>
      </Terminal>
    </StageSection>
  );
}
