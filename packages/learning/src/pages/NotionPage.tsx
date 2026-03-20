import { NotionEmbed } from "../components/notion/NotionEmbed";
import { BookMarked } from "lucide-react";

const NOTION_URL = "https://blpsoares.notion.site/ebd//32985fc8f2ca80c08edbdb747c774c86";

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
