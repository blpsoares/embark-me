import StageSection from "../StageSection";
import Terminal from "../Terminal";

export default function InvestigateStage() {
  return (
    <StageSection
      tag="02 · root cause"
      title="/audit-investigate"
      description="Read-only investigation of the reference system. Nothing is changed — only understood."
    >
      <Terminal command="pdd audit-investigate 007">
        <div className="text-zinc-500 reveal reveal-d1">→ reading legacy/checkout/totals.rb...</div>
        <div className="text-amber-400 reveal reveal-d2">→ cause: rounding applied twice</div>
        <div className="text-accent reveal reveal-d3">✓ investigation.md saved</div>
      </Terminal>
    </StageSection>
  );
}
