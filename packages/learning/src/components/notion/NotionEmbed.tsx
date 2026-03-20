import { ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NotionEmbedProps {
  url: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function NotionEmbed({ url, title, description, icon: Icon }: NotionEmbedProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="glass border-b border-slate-100 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10">
              <Icon className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">{title}</h2>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm transition-all hover:border-primary-200 hover:text-primary-500 hover:shadow-md"
          >
            Abrir no Notion
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Iframe */}
      <iframe
        src={url}
        className="notion-frame flex-1"
        title={title}
        allow="fullscreen"
        loading="lazy"
      />
    </div>
  );
}
