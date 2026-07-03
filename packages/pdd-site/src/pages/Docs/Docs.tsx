import { useState } from "react";
import DocsSidebar from "./DocsSidebar";
import { DOCS_NAV_GROUPS } from "./docsNav";
import Installation from "./sections/Installation";
import Skills from "./sections/Skills";
import ConfidenceTiers from "./sections/ConfidenceTiers";
import CoverageMap from "./sections/CoverageMap";
import AuditDirStructure from "./sections/AuditDirStructure";
import Principles from "./sections/Principles";
import Updating from "./sections/Updating";

export default function Docs() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 lg:pt-28 pb-20">
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden flex items-center gap-2 font-mono text-[13px] text-[#8fb3cc] border border-accent-soft px-3 py-2 mb-6"
      >
        <span>☰</span> Menu
      </button>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-[#0a1b2e] border-r border-accent-soft h-full overflow-y-auto p-6">
            <button
              onClick={() => setDrawerOpen(false)}
              className="font-mono text-[13px] text-[#8fb3cc] mb-6"
              aria-label="Close menu"
            >
              ✕ Close
            </button>
            <DocsSidebar groups={DOCS_NAV_GROUPS} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex gap-12">
        <div className="hidden lg:block sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
          <DocsSidebar groups={DOCS_NAV_GROUPS} />
        </div>
        <div className="flex-1 min-w-0 space-y-16">
          <Installation />
          <Skills />
          <ConfidenceTiers />
          <CoverageMap />
          <AuditDirStructure />
          <Principles />
          <Updating />
        </div>
      </div>
    </div>
  );
}
