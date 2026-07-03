export interface DocsNavItem {
  id: string;
  label: string;
}

export const DOCS_NAV: DocsNavItem[] = [
  { id: "installation", label: "Installation" },
  { id: "skills", label: "Skills" },
  { id: "confidence-tiers", label: "Confidence tiers" },
  { id: "coverage-map", label: "Coverage map" },
  { id: "audit-dir", label: ".audit/ structure" },
  { id: "principles", label: "Principles" },
  { id: "updating", label: "Updating" },
];
