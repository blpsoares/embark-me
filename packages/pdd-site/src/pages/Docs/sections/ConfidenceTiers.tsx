const TIERS: Array<{ tier: string; evidence: string; label: string; color: string }> = [
  { tier: "tier-0", evidence: "textual description only", label: "low", color: "text-red-400" },
  { tier: "tier-1", evidence: "paired screenshots (reference vs new)", label: "medium", color: "text-amber-400" },
  { tier: "tier-2", evidence: "automated data-to-data diff (/audit-compare)", label: "high", color: "text-orange-400" },
  { tier: "tier-3", evidence: "tier-2 plus a passing characterization test", label: "max", color: "text-accent" },
];

export default function ConfidenceTiers() {
  return (
    <section id="confidence-tiers" className="scroll-mt-24">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Confidence tiers</h2>
      <p className="text-zinc-400 text-[15px] leading-relaxed mb-4">
        Every finding carries a confidence tier describing the quality of its evidence.
        <code>/audit-resolve</code> refuses to close a finding below the configured minimum
        (default tier-1, tier-2 recommended).
      </p>
      <div className="divide-y divide-zinc-900 border-y border-zinc-900 font-mono text-[13px]">
        {TIERS.map((t) => (
          <div key={t.tier} className="py-2.5 flex gap-4">
            <span className={`w-16 ${t.color}`}>{t.tier}</span>
            <span className="flex-1 text-zinc-400">{t.evidence}</span>
            <span className={t.color}>{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
