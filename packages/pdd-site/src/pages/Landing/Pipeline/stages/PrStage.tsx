import StageSection from "../StageSection";

export default function PrStage() {
  return (
    <StageSection
      tag="06 · evidence dossier"
      title="/audit-pr"
      description="Assembles the PR as an evidence dossier. Only pushes and opens the PR after an explicit human 'yes' in the same session."
    >
      <div className="font-mono text-[12px] bg-zinc-900 rounded-md p-3 text-zinc-300 reveal reveal-d1">
        fix(checkout): total rounding parity #007
        <div className="text-zinc-600 text-[11px] mt-1.5">📎 diff · 📎 screenshots · 📎 test</div>
      </div>
      <div className="mt-4 font-mono text-[12.5px] text-zinc-400 reveal reveal-d2">
        confirm push + gh pr create? human: <span className="text-accent font-bold">y</span>
      </div>
    </StageSection>
  );
}
