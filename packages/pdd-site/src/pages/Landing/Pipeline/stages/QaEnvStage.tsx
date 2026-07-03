import StageSection from "../StageSection";
import Terminal from "../Terminal";

export default function QaEnvStage() {
  return (
    <StageSection
      stageId="qa-env"
      tag="07 · human gate #2"
      title="/audit-qa staging"
      description="QA on the already-deployed environment, after the PR. Records qa-<env> per environment."
      why="Localhost QA and a real staging deploy can disagree — this catches whatever only shows up once it's live."
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
