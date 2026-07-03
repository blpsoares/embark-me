export default function Installation() {
  return (
    <section id="installation" className="scroll-mt-24">
      <h2 className="text-2xl font-semibold text-zinc-100 mb-4">Installation</h2>
      <p className="text-zinc-400 text-[15px] leading-relaxed mb-4">
        PDD ships as a single-plugin marketplace. Install it per-project — its whole job is to
        track the parity of <em>one</em> migration against <em>one</em> reference system, and it
        stores that state in the project's <code>.audit/</code> directory.
      </p>
      <pre className="bg-zinc-950 border border-zinc-800 rounded-md p-4 font-mono text-[12.5px] text-zinc-300 overflow-x-auto">
        {`/plugin marketplace add blpsoares/parity-driven-development\nclaude plugin install pdd@parity-driven-development --scope project`}
      </pre>
      <p className="text-zinc-400 text-[15px] leading-relaxed mt-4 mb-2">
        For Codex, Cursor, Copilot, or Gemini CLI, use the universal installer — or the
        interactive picker via <code>npx</code>:
      </p>
      <pre className="bg-zinc-950 border border-zinc-800 rounded-md p-4 font-mono text-[12.5px] text-zinc-300 overflow-x-auto">
        {`curl -fsSL https://raw.githubusercontent.com/blpsoares/parity-driven-development/main/install.sh | bash -s -- <codex|cursor|copilot|gemini|all>\n\n# or, for any agent:\nnpx parity-driven-development init`}
      </pre>
      <p className="text-zinc-400 text-[15px] leading-relaxed mt-4">
        The PDD <em>method</em> itself needs nothing — the commands are markdown. Only the
        optional <code>pdd</code> live dashboard needs a runtime, and it now runs on{" "}
        <strong>Node ≥ 18 (via npx) or Bun</strong> — it is no longer Bun-only.
      </p>
      <div className="mt-5 border-l-2 border-accent pl-4">
        <p className="text-zinc-300 text-[14px]">
          New to PDD?{" "}
          <a
            href="https://github.com/blpsoares/parity-driven-development/blob/main/QUICKSTART.md"
            className="text-accent"
          >
            QUICKSTART.md
          </a>{" "}
          walks through the whole cycle in 5 minutes, with a real worked example — the framework
          validated on itself, migrating a backend from Bun to Node.js end to end.
        </p>
      </div>
    </section>
  );
}
