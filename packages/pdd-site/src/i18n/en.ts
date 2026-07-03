const en = {
  nav: {
    docs: "Docs",
    install: "Install",
    github: "GitHub",
    why: "Why",
  },
  hero: {
    eyebrow: "Parity-Driven Development",
    headline: "Prove your migration didn't break anything.",
    cta: "See the pipeline",
  },
  problem: {
    title: "\"Does the new system still behave like the old one?\"",
    body: "That question usually gets answered with a gut feeling. PDD turns it into objective, tracked evidence — every behavior of the reference system becomes a finding you can investigate, fix, prove, and gate through QA before it ever reaches main.",
  },
  pipeline: {
    bootstrap: {
      tag: "00 · one-time setup",
      description:
        "A structured interview captures the operational context every other command relies on — reference system, QA environments, confidence thresholds. Every answer is absorbed into BOOTSTRAP.md.",
      why: "Runs once per project. Nothing else works without it — every other /audit-* command reads this file before doing anything.",
    },
    new: {
      tag: "01 · open a finding",
      description:
        "You describe a suspicious behavior. PDD opens finding #007, computes an initial confidence tier, and adds a coverage-map entry.",
      why: "It forces an observable fact, not a vague complaint — 'shows 3 items, should show 5' is accepted, 'it's broken' is rejected.",
    },
    investigate: {
      tag: "02 · root cause",
      description: "Read-only investigation of the reference system. Nothing is changed — only understood.",
      why: "Separating 'understand' from 'fix' stops a rushed patch from papering over the real cause.",
    },
    resolve: {
      tag: "03 · fix it",
      description: "Fix plus a mandatory characterization test. Creates branch audit/007. Does not commit on its own.",
      why: "The test pins the reference behavior permanently — it fails if anyone ever regresses this fix later.",
    },
    compare: {
      tag: "04 · objective proof",
      description: "Golden-master harness: runs the same operation on both systems and produces an objective data-to-data diff.",
      why: "This is tier-2 evidence — a machine-checked diff, not a screenshot someone eyeballed and approved.",
    },
    "qa-local": {
      tag: "05 · human gate #1",
      description: "QA on localhost, before the PR. This approval is a blocking precondition for /audit-pr.",
      why: "A human — not the AI — decides whether the fix actually looks right before any PR gets opened.",
    },
    pr: {
      tag: "06 · evidence dossier",
      description: "Assembles the PR as an evidence dossier. Only pushes and opens the PR after an explicit human 'yes' in the same session.",
      why: "The inviolable rule: the AI never authors commits, and push only happens after an explicit human 'yes'.",
    },
    "qa-env": {
      tag: "07 · human gate #2",
      description: "QA on the already-deployed environment, after the PR. Records qa-<env> per environment.",
      why: "Localhost QA and a real staging deploy can disagree — this catches whatever only shows up once it's live.",
    },
    merge: {
      tag: "08 · 100% human",
      description: "The AI never authors commits. Merge is done only by a human — and that's when coverage truly becomes verified.",
      why: "Coverage only becomes 'verified' once target-env QA is approved AND the PR is merged — never from local resolution alone.",
    },
  },
  legacyVsNew: {
    title: "Same behavior. Nothing else the same.",
    body: "PDD doesn't care that the code, the language, or the screen changed completely — only that the checkout total still comes out to 129.90.",
    legacyLabel: "Legacy · Java",
    newLabel: "New · TypeScript",
  },
  principles: {
    title: "Eight principles, one method.",
    body: "PDD isn't a vibe — every command exists to enforce one of these.",
    items: [
      "Forced discipline / gates",
      "State externalized in files — .audit/ is the source of truth, not the model's context",
      "Small composable commands",
      "Objective evidence over opinion",
      "A human at the gate of every irreversible action",
      "Fast observable feedback",
      "Idempotent state-aware commands",
      "Progressive disclosure — the cycle teaches itself",
    ],
  },
  tiers: {
    title: "Evidence has a grade.",
    body: "Every finding carries a confidence tier describing the quality of its proof — and PDD refuses to close a finding below the tier your project requires.",
    rows: [
      { tier: "tier-0", evidence: "textual description only", label: "low" },
      { tier: "tier-1", evidence: "paired screenshots (reference vs new)", label: "medium" },
      { tier: "tier-2", evidence: "automated data-to-data diff", label: "high" },
      { tier: "tier-3", evidence: "tier-2 plus a passing characterization test", label: "max" },
    ],
  },
  coverageClose: {
    title: "Parity coverage, tracked to the last percent.",
    cta: "Install PDD",
  },
  footer: {
    tagline: "A framework for reliable legacy refactor, rewrite, and port — with tracked behavioral parity.",
    rights: "All rights reserved.",
    siteLabel: "Site",
    connectLabel: "Connect",
  },
};

export default en;
