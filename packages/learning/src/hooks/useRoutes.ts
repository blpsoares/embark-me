import { useMemo } from "react";
import type { RoutesConfig, AppRoute } from "../types/routes";
import routesData from "../../routes.jsonc";

const config = routesData as unknown as RoutesConfig;

export function useRoutes() {
  const allNotionRoutes = useMemo(() => {
    const fromRoot = config.routes.filter((r) => r.type === "notion");
    const fromGroups = config.groups.flatMap((g) => g.routes);
    return [...fromRoot, ...fromGroups];
  }, []);

  const findRouteByPath = (path: string): AppRoute | undefined => {
    const rootMatch = config.routes.find((r) => r.path === path);
    if (rootMatch) return rootMatch;
    for (const group of config.groups) {
      const match = group.routes.find((r) => r.path === path);
      if (match) return match;
    }
    return undefined;
  };

  const findRouteByNotionId = (notionId: string): AppRoute | undefined => {
    return allNotionRoutes.find((r) => r.notionId === notionId);
  };

  return {
    config,
    routes: config.routes,
    groups: config.groups,
    allNotionRoutes,
    findRouteByPath,
    findRouteByNotionId,
  };
}
