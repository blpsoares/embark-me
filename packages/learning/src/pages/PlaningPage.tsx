import { NotionEmbed } from "../components/notion/NotionEmbed";
import { CalendarDays } from "lucide-react";

const PLANING_URL = "https://blpsoares.notion.site/planing";

export function PlaningPage() {
  return (
    <NotionEmbed
      url={PLANING_URL}
      title="Planejamento de Estudos"
      description="Acompanhamento de progresso e metas"
      icon={CalendarDays}
    />
  );
}
