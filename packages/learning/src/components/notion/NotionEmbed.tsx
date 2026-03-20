import { ExternalLink } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

interface NotionEmbedProps {
  url: string;
  title: string;
  notionId: string;
}

export function NotionEmbed({ url, title, notionId }: NotionEmbedProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();

  const notionDirectUrl = `https://www.notion.so/${notionId}`;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`border-b px-6 py-3 backdrop-blur-md ${
        isDark
          ? "border-white/6 bg-surface-dim/80"
          : "border-primary-100/40 bg-white/80"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h2 className={`text-sm font-semibold ${isDark ? "text-white/81" : "text-slate-800"}`}>
            {title}
          </h2>
          <a
            href={notionDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${
              isDark
                ? "border-white/6 bg-surface-raised text-white/44 hover:border-primary-500/30 hover:text-primary-300"
                : "border-slate-200 bg-white text-slate-500 hover:border-primary-200 hover:text-primary-500"
            }`}
          >
            {t("notion.open")}
            <ExternalLink className="h-3 w-3" />
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
