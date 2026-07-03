import StageSection from "../StageSection";

export default function InvestigateStage() {
  return (
    <StageSection
      tag="02 · root cause"
      title="/audit-investigate"
      description="Read-only investigation of the reference system. Nothing is changed — only understood."
    >
      <div className="font-mono text-[12px] text-zinc-500 leading-loose">
        <div className="reveal reveal-d1">function calcTotal(cart) {"{"}</div>
        <div className="reveal reveal-d2 text-amber-400 bg-amber-400/10 px-2 rounded">
          {"  "}return round(round(sum) * tax)
        </div>
        <div className="reveal reveal-d1">{"}"}</div>
      </div>
      <div className="mt-4 text-accent font-mono text-[12px] reveal reveal-d3">
        ↳ rounding applied twice
      </div>
    </StageSection>
  );
}
