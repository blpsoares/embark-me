import StageSection from "../StageSection";
import Terminal from "../Terminal";

export default function PrStage() {
  return (
    <StageSection
      tag="06 · evidence dossier"
      title="/audit-pr"
      description="Assembles the PR as an evidence dossier. Only pushes and opens the PR after an explicit human 'yes' in the same session."
    >
      <Terminal command="pdd audit-pr 007">
        <div className="text-zinc-500 reveal reveal-d1">→ dossier ready: symptom → cause → fix → diff → qa</div>
        <div className="text-orange-400 reveal reveal-d2">? confirm push + gh pr create? (y/n)</div>
        <div className="text-accent reveal reveal-d3">✓ human: y</div>
      </Terminal>
    </StageSection>
  );
}
