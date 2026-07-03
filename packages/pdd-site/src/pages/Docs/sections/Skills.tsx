const SKILLS: Array<{ name: string; description: string }> = [
  { name: "/audit-bootstrap", description: "One-time interview. Captures adapters, QA environments, confidence thresholds, seeds the coverage map." },
  { name: "/audit-new <desc>", description: "Opens finding NNN, computes an initial confidence tier, adds a coverage entry." },
  { name: "/audit-investigate NNN", description: "Read-only root-cause investigation of the reference behavior." },
  { name: "/audit-resolve NNN", description: "Fix + mandatory characterization test + evidence block. Creates branch audit/NNN, does not commit." },
  { name: "/audit-compare NNN", description: "Golden-master harness — runs the same operation on both systems and emits an objective diff (tier-2 evidence)." },
  { name: "/audit-qa NNN <env>", description: "Multi-phase QA. local runs before the PR (unblocks /audit-pr); dev/staging/prod run after, per environment." },
  { name: "/audit-pr NNN", description: "Assembles the PR as an evidence dossier. Pushes and opens the PR only after an explicit human 'yes'." },
  { name: "/audit-status", description: "In-chat panel: parity-coverage %, confidence distribution, active tasks, suggested next actions." },
];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">Skills</h2>
      <div className="divide-y divide-accent-soft border-y border-accent-soft">
        {SKILLS.map((skill) => (
          <div key={skill.name} className="py-3">
            <div className="font-mono text-accent text-sm">{skill.name}</div>
            <div className="text-[#8fb3cc] text-[14px] mt-1">{skill.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
