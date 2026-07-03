export default function Updating() {
  return (
    <section id="updating" className="scroll-mt-24">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Updating</h2>
      <div className="divide-y divide-zinc-900 border-y border-zinc-900 font-mono text-[13px]">
        <div className="py-2.5 flex gap-4">
          <span className="w-40 text-zinc-500">Claude Code plugin</span>
          <span className="text-zinc-300">claude plugin update pdd@parity-driven-development</span>
        </div>
        <div className="py-2.5 flex gap-4">
          <span className="w-40 text-zinc-500">install.sh / git clone</span>
          <span className="text-zinc-300">pdd update</span>
        </div>
        <div className="py-2.5 flex gap-4">
          <span className="w-40 text-zinc-500">npx (Node)</span>
          <span className="text-zinc-300">npx parity-driven-development@latest init</span>
        </div>
        <div className="py-2.5 flex gap-4">
          <span className="w-40 text-zinc-500">Codex/Cursor/Copilot/Gemini</span>
          <span className="text-zinc-300">re-run install.sh &lt;harness&gt; (or pdd update)</span>
        </div>
      </div>
    </section>
  );
}
