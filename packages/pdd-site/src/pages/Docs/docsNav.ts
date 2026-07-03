export interface DocsNavItem {
  id: string;
  label: string;
}

export interface DocsNavGroup {
  label: string;
  items: DocsNavItem[];
}

export const DOCS_NAV_GROUPS: DocsNavGroup[] = [
  {
    label: "Get started",
    items: [
      { id: "installation", label: "Installation" },
      { id: "updating", label: "Updating" },
    ],
  },
  {
    label: "Concepts",
    items: [
      { id: "principles", label: "Principles" },
      { id: "confidence-tiers", label: "Confidence tiers" },
    ],
  },
  {
    label: "Reference",
    items: [
      { id: "skills", label: "Skills" },
      { id: "coverage-map", label: "Coverage map" },
      { id: "audit-dir", label: ".audit/ structure" },
    ],
  },
];

export const DOCS_NAV: DocsNavItem[] = DOCS_NAV_GROUPS.flatMap((group) => group.items);
