import { useState } from "react";
import type { DocsNavGroup } from "./docsNav";

interface DocsSidebarProps {
  groups: DocsNavGroup[];
  onNavigate?: () => void;
}

export default function DocsSidebar({ groups, onNavigate }: DocsSidebarProps) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(q)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav className="w-full lg:w-56 shrink-0 text-sm font-mono">
      <div className="relative mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs…"
          className="w-full bg-[#0d2438] border border-accent-soft text-[#dbeaf5] placeholder:text-[#4a7690] text-[13px] px-3 py-2 focus:outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-6">
        {filtered.map((group) => (
          <div key={group.label}>
            <div className="text-[10.5px] uppercase tracking-[.15em] text-[#4a7690] mb-2">{group.label}</div>
            <div className="space-y-1.5 border-l border-accent-soft pl-3">
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={onNavigate}
                  className="block text-[#8fb3cc] hover:text-accent transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-[#4a7690] text-[13px]">No results for "{query}"</div>}
      </div>
    </nav>
  );
}
