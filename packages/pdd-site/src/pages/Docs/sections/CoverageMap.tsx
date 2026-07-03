import CodeBlock from "../CodeBlock";

export default function CoverageMap() {
  return (
    <section id="coverage-map" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">The coverage map</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-4">
        <code>.audit/coverage.md</code> is a machine-readable table — the single view of how much
        of the legacy behavior is already verified, and at what confidence. Status is one of{" "}
        <code>not-started</code> · <code>finding-open</code> · <code>resolved</code> ·{" "}
        <code>verified</code>. Parity coverage % = verified / total.
      </p>
      <CodeBlock>
        {`| Behavior / Area          | Reference case | Status        | Tier   | Finding |\n|--------------------------|----------------|---------------|--------|---------|\n| checkout: total          | order #123     | verified      | tier-3 | 007     |\n| login: lock after 3 fails| test user      | finding-open  | tier-1 | 012     |\n| export CSV               | —              | not-started   | —      | —       |`}
      </CodeBlock>
    </section>
  );
}
