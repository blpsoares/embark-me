import { NotionEmbed } from "../components/notion/NotionEmbed";
import { BookMarked } from "lucide-react";

const NOTION_URL = "https://blpsoares.notion.site/learning";

export function NotionPage() {
  return (
    <NotionEmbed
      url={NOTION_URL}
      title="Recursos de Estudo"
      description="Material de estudo curado no Notion"
      icon={BookMarked}
    />
  );
}
