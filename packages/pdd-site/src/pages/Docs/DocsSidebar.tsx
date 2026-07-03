import type { DocsNavItem } from "./docsNav";

interface DocsSidebarProps {
  items: DocsNavItem[];
}

export default function DocsSidebar({ items }: DocsSidebarProps) {
  return (
    <nav className="w-48 shrink-0 sticky top-20 self-start text-sm space-y-2 font-mono">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className="block text-zinc-500 hover:text-accent">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
