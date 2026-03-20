import { NotionEmbed } from "../components/notion/NotionEmbed";
import { CalendarDays } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

const PLANING_URL = "https://blpsoares.notion.site/ebd//32985fc8f2ca81d9ac43f5bcb544620f";

export function PlaningPage() {
  const { t } = useI18n();

  return (
    <NotionEmbed
      url={PLANING_URL}
      title={t("notion.planning.title")}
      description={t("notion.planning.desc")}
      icon={CalendarDays}
    />
  );
}
