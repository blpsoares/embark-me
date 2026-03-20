import { ExternalLink } from "lucide-react";

const NOTION_URL = "https://blpsoares.notion.site/learning?pvs=74";

export function NotionEmbed() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-700">Recursos de Estudo</h2>
        <a
          href={NOTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
        >
          Abrir no Notion
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <iframe
        src={NOTION_URL}
        className="w-full flex-1 border-0"
        title="Study Resources - Notion"
        allow="fullscreen"
        loading="lazy"
        style={{ minHeight: "calc(100vh - 8rem)" }}
      />
    </div>
  );
}
