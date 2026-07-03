import DocsSidebar from "./DocsSidebar";
import { DOCS_NAV } from "./docsNav";
import Installation from "./sections/Installation";
import Skills from "./sections/Skills";
import ConfidenceTiers from "./sections/ConfidenceTiers";
import CoverageMap from "./sections/CoverageMap";
import AuditDirStructure from "./sections/AuditDirStructure";
import Principles from "./sections/Principles";
import Updating from "./sections/Updating";

export default function Docs() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-12 flex gap-12">
      <DocsSidebar items={DOCS_NAV} />
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
  );
}
