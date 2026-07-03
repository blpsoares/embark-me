const TIERS: Array<{ tier: string; evidence: string; label: string; color: string }> = [
  { tier: "tier-0", evidence: "textual description only", label: "low", color: "text-red-400" },
  { tier: "tier-1", evidence: "paired screenshots (reference vs new)", label: "medium", color: "text-yellow-400" },
  { tier: "tier-2", evidence: "automated data-to-data diff (/audit-compare)", label: "high", color: "text-fuchsia-400" },
  { tier: "tier-3", evidence: "tier-2 plus a passing characterization test", label: "max", color: "text-emerald-400" },
];

export default function ConfidenceTiers() {
  return (
    <section id="confidence-tiers" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">Confidence tiers</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-4">
        Every finding carries a confidence tier describing the quality of its evidence.
        <code>/audit-resolve</code> refuses to close a finding below the configured minimum
        (default tier-1, tier-2 recommended).
      </p>
      <div className="divide-y divide-accent-soft border-y border-accent-soft font-mono text-[13px]">
        {TIERS.map((t) => (
          <div key={t.tier} className="py-2.5 flex flex-col sm:flex-row gap-1.5 sm:gap-4">
            <span className={`sm:w-16 ${t.color}`}>{t.tier}</span>
            <span className="flex-1 text-[#8fb3cc]">{t.evidence}</span>
            <span className={t.color}>{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
