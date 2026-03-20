import { NotionEmbed } from "../components/notion/NotionEmbed";
import { BookMarked } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

const NOTION_URL = "https://blpsoares.notion.site/ebd//32985fc8f2ca80c08edbdb747c774c86";

export function NotionPage() {
  const { t } = useI18n();

  return (
    <NotionEmbed
      url={NOTION_URL}
      title={t("notion.resources.title")}
      description={t("notion.resources.desc")}
      icon={BookMarked}
    />
  );
}
