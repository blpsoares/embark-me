import { NotionEmbed } from "../components/notion/NotionEmbed";
import { CalendarDays } from "lucide-react";

const PLANING_URL = "https://blpsoares.notion.site/ebd//32985fc8f2ca81d9ac43f5bcb544620f";

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
