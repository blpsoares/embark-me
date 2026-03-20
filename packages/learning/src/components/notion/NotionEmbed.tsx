import { ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface NotionEmbedProps {
  url: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function NotionEmbed({ url, title, description, icon: Icon }: NotionEmbedProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`glass border-b px-6 py-4 ${isDark ? "border-white/5" : "border-slate-100"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10">
              <Icon className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{title}</h2>
              <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{description}</p>
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold shadow-sm transition-all hover:shadow-md ${
              isDark
                ? "border-slate-700 bg-slate-800 text-slate-400 hover:border-primary-500/30 hover:text-primary-400"
                : "border-slate-200 bg-white text-slate-500 hover:border-primary-200 hover:text-primary-500"
            }`}
          >
            {t("notion.open")}
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
