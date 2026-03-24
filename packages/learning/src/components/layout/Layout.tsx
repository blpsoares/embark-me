import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

export function Layout() {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${
      isDark ? "bg-surface text-white/81" : "bg-surface text-slate-900"
    }`}>
      <Header />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className={`border-t py-6 ${
        isDark ? "border-white/6 bg-surface-dim/60" : "border-slate-100 bg-white/60"
      }`}>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6">
          <div className={`flex items-center gap-2 text-xs ${isDark ? "text-white/20" : "text-slate-300"}`}>
            <img
              src="/og-image.png"
              alt=""
              className={`h-5 w-5 object-contain ${isDark ? "invert opacity-30" : "opacity-40"}`}
              draggable={false}
            />
            <span>Bryan &mdash; {t("footer.label")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
