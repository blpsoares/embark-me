import CodeBlock from "../CodeBlock";

export default function Installation() {
  return (
    <section id="installation" className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold text-[#f2f8fc] mb-4">Installation</h2>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mb-4">
        PDD ships as a single-plugin marketplace. Install it per-project — its whole job is to
        track the parity of <em>one</em> migration against <em>one</em> reference system, and it
        stores that state in the project's <code>.audit/</code> directory.
      </p>
      <CodeBlock>
        {`/plugin marketplace add blpsoares/parity-driven-development\nclaude plugin install pdd@parity-driven-development --scope project`}
      </CodeBlock>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mt-4 mb-2">
        For Codex, Cursor, Copilot, or Gemini CLI, use the universal installer — or the
        interactive picker via <code>npx</code>:
      </p>
      <CodeBlock>
        {`curl -fsSL https://raw.githubusercontent.com/blpsoares/parity-driven-development/main/install.sh | bash -s -- <codex|cursor|copilot|gemini|all>\n\n# or, for any agent:\nnpx parity-driven-development init`}
      </CodeBlock>
      <p className="text-[#8fb3cc] text-[15px] leading-relaxed mt-4">
        The PDD <em>method</em> itself needs nothing — the commands are markdown. Only the
        optional <code>pdd</code> live dashboard needs a runtime, and it now runs on{" "}
        <strong className="text-[#dbeaf5]">Node ≥ 18 (via npx) or Bun</strong> — it is no longer Bun-only.
      </p>
      <div className="mt-5 border-l-2 border-accent pl-4">
        <p className="text-[#dbeaf5] text-[14px]">
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
