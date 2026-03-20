export interface RouteLabel {
  pt: string;
  en: string;
}

export interface AppRoute {
  id: string;
  path: string;
  label: RouteLabel;
  type: "internal" | "notion";
  notionId?: string;
  icon: string;
}

export interface RouteGroup {
  id: string;
  label: RouteLabel;
  icon: string;
  routes: AppRoute[];
}

export interface RoutesConfig {
  routes: AppRoute[];
  groups: RouteGroup[];
}
