import { useParams, Navigate } from "react-router-dom";
import { NotionEmbed } from "../components/notion/NotionEmbed";
import { useRoutes } from "../hooks/useRoutes";
import { useI18n } from "../contexts/I18nContext";

export function NotionRoutePage() {
  const { routeId } = useParams<{ routeId: string }>();
  const { allNotionRoutes } = useRoutes();
  const { locale } = useI18n();

  const route = allNotionRoutes.find(
    (r) => r.path === `/notion/${routeId}`,
  );

  if (!route?.notionId) return <Navigate to="/" replace />;

  const embedUrl = `https://blpsoares.notion.site/ebd//${route.notionId}`;

  return (
    <NotionEmbed
      url={embedUrl}
      title={route.label[locale]}
      notionId={route.notionId}
    />
  );
}
