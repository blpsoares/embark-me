export default function AuditDirStructure() {
  return (
    <section id="audit-dir" className="scroll-mt-24">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Generated .audit/ structure</h2>
      <p className="text-zinc-400 text-[15px] leading-relaxed mb-4">
        PDD keeps all state in the project under <code>.audit/</code> — it survives across
        sessions and devs.
      </p>
      <pre className="bg-zinc-950 border border-zinc-800 rounded-md p-4 font-mono text-[12px] text-zinc-300 overflow-x-auto">
        {`.audit/\n├── BOOTSTRAP.md            reference/new adapters, preview mode, coverage baseline, thresholds\n├── board.md               tasks and cross-finding state\n├── coverage.md            the parity coverage map\n├── findings/NNN-<slug>/\n│   ├── README.md          finding frontmatter\n│   ├── investigation.md   root cause\n│   ├── resolution.md      fix + evidence block + PR URL\n│   └── refs/              parity diff, screenshots\n└── resolved/NNN-<slug>/   findings that shipped`}
      </pre>
    </section>
  );
}
