import { Suspense, lazy } from "react";
import StageSection from "../StageSection";

const CompareScene3D = lazy(() => import("../../../../components/CompareScene3D"));

export default function CompareStage() {
  return (
    <StageSection
      tag="04 · objective proof"
      title="/audit-compare"
      description="Golden-master harness: runs the same operation on both systems and produces an objective data-to-data diff."
    >
      <Suspense fallback={<div className="h-[190px]" />}>
        <CompareScene3D />
      </Suspense>
      <div className="text-center font-mono text-[11px] text-zinc-500 -mt-2">
        legacy vs new → converging → <span className="text-accent">match</span>
      </div>
    </StageSection>
  );
}
