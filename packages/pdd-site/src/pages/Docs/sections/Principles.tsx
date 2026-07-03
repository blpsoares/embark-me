const PRINCIPLES: string[] = [
  "Forced discipline / gates",
  "State externalized in files (.audit/ is the source of truth, not the model's context)",
  "Small composable commands",
  "Objective evidence over opinion",
  "A human at the gate of every irreversible action",
  "Fast observable feedback",
  "Idempotent state-aware commands",
  "Progressive disclosure (the cycle teaches itself)",
];

export default function Principles() {
  return (
    <section id="principles" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">Principles</h2>
      <ul className="space-y-2 text-[#8fb3cc] text-[15px] list-disc list-inside">
        {PRINCIPLES.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="text-accent font-mono text-[13px] mt-6 border-l-2 border-accent pl-3">
        Inviolable rule: the AI never authors commits. push / gh pr create happen only after an
        explicit human "yes" in the same session. Merge is 100% human and only after QA approves.
      </p>
    </section>
  );
}
