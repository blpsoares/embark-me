# PDD marketing/docs site — design

## Summary

Build a new package, `packages/pdd-site`, in the embark-me monorepo: a marketing + documentation
site for [Parity-Driven Development (PDD)](https://github.com/blpsoares/parity-driven-development),
a Claude Code plugin/framework for auditing behavioral parity between a legacy system and its
refactor/rewrite/port. The site must explain the PDD concept clearly and make the audit cycle feel
tangible through a scroll-driven simulation, not just prose: one one-time setup section
(`audit-bootstrap`) followed by the 8-stage per-finding cycle (new → investigate → resolve →
compare → qa-local → pr → qa-env → merge).

## Goals

- Explain what PDD is and why it exists (the "does the new system still behave like the old one?"
  problem) clearly enough for a first-time visitor to get it in under a minute.
- Make the audit cycle visceral: each pipeline stage gets its own scroll section with a real visual
  simulation of what happens at that stage (not static screenshots).
- Provide a full, navigable documentation page mirroring the GitHub README's depth, for visitors
  who want to actually install and use PDD.
- Ship something that looks premium/current — this is a portfolio-grade piece, not a quick README
  mirror.

## Non-goals

- No blog, no changelog page (link to GitHub's CHANGELOG instead), no auth/accounts, no analytics
  dashboard.
- No CMS — content is hardcoded in the site's source, updated via PRs like the rest of the
  monorepo.
- No full i18n framework/library — only two locales (EN/PT) via a lightweight dictionary.

## Location & stack

- New package: `packages/pdd-site`, `@embark/pdd-site`, deployed via Cloudflare Pages through the
  existing Embark automation (`.embark.jsonc` with `deploy: "cloudflare-pages"`, its own
  subdomain).
- Stack mirrors `packages/portifolio` (the only precedent in this monorepo for a rich animated
  frontend): React 19 + Vite + TypeScript (strict) + Tailwind + Framer Motion.
- `@react-three/fiber` (+ `three`) for the one 3D moment (the `/audit-compare` convergence scene),
  lazy-loaded so it doesn't weigh down the initial bundle.
- Client-side routing kept minimal: two routes, `/` (landing) and `/docs` (documentation). A
  lightweight router (e.g. `wouter`) is enough — no need for a full framework router.
- Bun for all scripts/installs/tests, per repo convention. Tests follow the repo's 77% coverage
  bar wherever the package has non-trivial logic (the i18n dictionary lookup, scroll-progress
  calculation helpers, etc.) — purely presentational components are exempt, consistent with how
  `portifolio` is treated today.

## Content structure

### Landing page (`/`)

1. **Hero** — eyebrow "Parity-Driven Development", a strong one-line value headline, install CTA
   above the fold. No static gif in the hero — the live scroll experience below is the proof, so
   the hero stays clean and fast.
2. **Problem framing** — one short section stating the problem PDD solves ("does the new system
   still behave like the old one?" as a gut feeling vs. tracked evidence) before the pipeline
   starts, so the simulation that follows has context.
3. **The pipeline (scrollytelling)** — one section per stage:
   - `audit-bootstrap` — a real-question form (see "Bootstrap simulation" below).
   - `audit-new` — a finding card assembling itself (id, area, confidence tier badge appearing).
   - `audit-investigate` — a code viewer scanning to the buggy line with a root-cause annotation.
   - `audit-resolve` — a diff (before/after) plus a "characterization test created" confirmation.
   - `audit-compare` — the 3D convergence scene (see "3D moment" below).
   - `audit-qa local` — a checklist ticking off, ending in an "approved" stamp.
   - `audit-pr` — a PR dossier card assembling, gated by a visible "human: y" confirmation before
     it proceeds.
   - `audit-qa staging/prod` — environment badges lighting up in sequence, confidence reaching
     tier-3.
   - `merge` — the coverage bar animating up, a "merged by human" stamp.

   Every stage section carries the same fidelity bar validated during brainstorming (real
   simulation, not terminal-text placeholder) — see "Visual mechanics" below for the shared
   scaffolding (stage bar, vertical rail, live panel).
4. **Coverage close** — the final coverage map state, repeated install CTA, links to `/docs` and
   GitHub.

### Docs page (`/docs`)

Sidebar-navigated, structured 1:1 with the GitHub README's depth:

- Installation (every harness: Claude Code plugin, Codex, Cursor, Copilot, Gemini, universal
  `install.sh`, `pdd init`).
- The 8 skills in detail (`audit-bootstrap`, `audit-new`, `audit-investigate`, `audit-resolve`,
  `audit-compare`, `audit-qa`, `audit-pr`, `audit-status`) — what each does, gates, and outputs.
- Confidence tiers (tier-0 → tier-3) with the same table as the README.
- The coverage map format and lifecycle (`not-started` → `finding-open` → `resolved` →
  `verified`).
- The `.audit/` directory structure.
- The 8 founding principles and the "inviolable rule" (AI never commits; human-gated push/merge).
- Updating (per-harness update commands).

## Visual design system

- Palette: black/near-black background, grays, ice-white foreground. **Accent: emerald green
  (`#34d399`)** — chosen because it's the literal color the real `pdd` CLI already uses for
  success/live states (confirmed by extracting frames from the project's own demo gif and running
  `pdd board` live), and it doubles as the tier-3/"verified" color from the confidence-tier table.
- Typography: a modern sans for copy/headings, JetBrains Mono for anything representing
  code/terminal/CLI output.
- Polish: subtle grain texture and radial glow on featured cards/hero, restrained — not overused
  across every section.
- The floating "pdd — live" panel (see below) visually mirrors the real `pdd board` TUI: same
  title, tab bar (Overview/Flow/...), thin rule style, dot-based per-finding progress
  (`●●●○○○○ → resolved`) — this is a deliberate replica, not a generic terminal mockup.

## Visual mechanics (scrollytelling)

Three synchronized elements track scroll position through the pipeline zone only (hidden outside
it — the zone spans all 9 sections, bootstrap included):

1. **Sticky stage bar** — thin bar docked just below the main nav, listing all 9 sections
   horizontally; the active one is lit, completed ones dim to a "done" state.
2. **Vertical rail** — a line running down the left edge of the pipeline zone with one dot per
   section; a glowing fill tracks scroll progress, connecting the dots as the visitor advances.
3. **Floating live panel ("pdd — live")** — fixed top-right, replicating the real CLI dashboard.
   During the `audit-bootstrap` section it shows the CLI's **Overview**-style stats (coverage,
   confidence distribution, active command). From `audit-new` onward — once there's an actual
   finding to track — it switches to the CLI's **Flow**-style view: a per-finding dot progress row
   (`●●●○○○○ → resolved`) that advances as the visitor scrolls through the cycle, alongside the
   confidence tier badge (color escalates as tier rises) and coverage %. It reads as if a real
   agent were executing the cycle live.

All three fade in/out based on whether the scroll position is inside the pipeline zone, computed
via viewport-center vs. section bounding boxes (no IntersectionObserver flicker at section
boundaries — validated in the prototype with a single scroll handler driving all three).

### Bootstrap simulation

The `audit-bootstrap` stage does not use the terminal-diff style of other stages. Instead it
simulates the actual interview UX: a multiple-choice question form (visually modeled on the
question-form pattern Claude Code itself uses to ask the user things), populated with **real
questions pulled from `skills/audit-bootstrap/SKILL.md`** in the PDD repo (e.g. reference-system
type, confidence-tier minimum with the real tier-0..tier-3 options, QA environment chain). An
option gets picked, then visually "flies" into a live-updating `BOOTSTRAP.md` file preview as a
structured `key: value` line — dramatizing the "answers get absorbed into project context" idea.
This mechanic (question → pick → fly-to-file) is the reference fidelity bar for how much
"life" each pipeline section should have; the final build should reach or exceed this for all 9
stages, with meaningfully better visual polish than the throwaway prototype (real typography,
smoother easing, less placeholder-looking cards).

### 3D moment (`audit-compare`)

The only WebGL/three.js moment on the site, deliberately scoped to one section because it maps
to a real concept rather than being decorative: two abstract wireframe shapes — one red
("legacy"), one green ("new") — start visually diverged and animate into perfect overlapping
alignment as the golden-master diff resolves to a match, with the shape's color settling to the
accent green. Rendered via `@react-three/fiber`, lazy-loaded so it only loads when this section
nears the viewport.

## i18n

English is the base/default language (matches the GitHub repo, which is deliberately
English-first "because PDD is meant to be shared"). A PT/EN toggle lives in the nav. Strings are
extracted into a plain dictionary object (`en.ts` / `pt.ts`) keyed by a flat id scheme, loaded via
a small context/hook — no i18n library, given only two locales and no pluralization complexity
beyond what a switch handles.

## Accessibility & performance

- `prefers-reduced-motion: reduce` disables scroll-driven animation, the beam/fly-to-file
  effects, and the 3D scene's motion; content still renders (statically) in its "settled" state.
- Mobile: the fixed "pdd — live" panel and sticky stage bar do not fit a narrow viewport as
  designed. On small screens they collapse to a simpler inline indicator (e.g. a compact dot
  strip under the section heading) rather than a floating panel; pipeline sections stack normally
  without fixed positioning fighting for space.
- The 3D scene is the only heavy dependency; it must not block first paint or affect Lighthouse
  scores for the hero/above-the-fold content.

## Testing

Per repo convention (mandatory tests, 77% coverage floor) applied to the package's non-visual
logic:
- Scroll-progress / active-stage calculation helper (pure function: given scroll position and
  section bounds, return active index + progress fraction).
- i18n dictionary lookup helper (missing-key fallback behavior).
- Any data-shape helpers driving the docs sidebar/content mapping.

Purely presentational components (the stage simulations, the 3D scene) are not unit-tested,
consistent with how `portifolio` is currently treated in this repo — visual correctness is
verified by running the dev server and looking at it, not asserted in Bun tests.

## Open items deferred to implementation planning

- Exact copy/headline wording for the hero and each stage (draft during implementation, not
  locked in this spec).
- Exact Tailwind design tokens (spacing scale, font sizes) — implementation detail, follows the
  palette/typography direction above.
- Whether `wouter` or another minimal router is used — implementation detail, either is fine.
