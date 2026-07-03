export default function Updating() {
  return (
    <section id="updating" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">Updating</h2>
      <div className="divide-y divide-accent-soft border-y border-accent-soft font-mono text-[13px]">
        <div className="py-2.5 flex flex-col sm:flex-row gap-1 sm:gap-4">
          <span className="sm:w-48 shrink-0 text-[#6fa5c7]">Claude Code plugin</span>
          <span className="text-[#dbeaf5] break-all">claude plugin update pdd@parity-driven-development</span>
        </div>
        <div className="py-2.5 flex flex-col sm:flex-row gap-1 sm:gap-4">
          <span className="sm:w-48 shrink-0 text-[#6fa5c7]">install.sh / git clone</span>
          <span className="text-[#dbeaf5]">pdd update</span>
        </div>
        <div className="py-2.5 flex flex-col sm:flex-row gap-1 sm:gap-4">
          <span className="sm:w-48 shrink-0 text-[#6fa5c7]">npx (Node)</span>
          <span className="text-[#dbeaf5] break-all">npx parity-driven-development@latest init</span>
        </div>
        <div className="py-2.5 flex flex-col sm:flex-row gap-1 sm:gap-4">
          <span className="sm:w-48 shrink-0 text-[#6fa5c7]">Codex/Cursor/Copilot/Gemini</span>
          <span className="text-[#dbeaf5]">re-run install.sh &lt;harness&gt; (or pdd update)</span>
        </div>
      </div>
    </section>
  );
}
