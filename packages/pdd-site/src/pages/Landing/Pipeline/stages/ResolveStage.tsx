import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function ResolveStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="resolve"
      tag={t.pipeline.resolve.tag}
      title="/audit-resolve"
      description={t.pipeline.resolve.description}
      why={t.pipeline.resolve.why}
    >
      <Terminal command="pdd audit-resolve 007">
        <div className="text-accent reveal reveal-d1">✓ branch audit/007 created</div>
        <div className="text-accent reveal reveal-d2">✓ tests/audit/007_checkout.test.ts</div>
        <div className="text-zinc-500 reveal reveal-d3">→ waiting for human commit</div>
      </Terminal>
    </StageSection>
  );
}
