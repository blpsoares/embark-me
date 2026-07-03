import StageSection from "../StageSection";
import Terminal from "../Terminal";
import { useI18n } from "../../../../i18n";

export default function QaEnvStage() {
  const { t } = useI18n();
  return (
    <StageSection
      stageId="qa-env"
      tag={t.pipeline["qa-env"].tag}
      title="/audit-qa staging"
      description={t.pipeline["qa-env"].description}
      why={t.pipeline["qa-env"].why}
    >
      <Terminal command="pdd audit-qa 007 staging">
        <div className="text-accent reveal reveal-d1">✓ qa-staging: approved</div>
        <div className="text-zinc-500 reveal reveal-d2">
          → coverage: checkout:total → <span className="text-accent">tier-3</span>
        </div>
      </Terminal>
    </StageSection>
  );
}
