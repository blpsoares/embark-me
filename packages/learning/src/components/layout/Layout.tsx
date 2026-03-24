import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
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
      <main className="flex flex-1 flex-col pb-16 md:pb-0">
        <Outlet />
      </main>
      <footer className={`border-t py-6 mb-16 md:mb-0 ${
        isDark ? "border-white/6 bg-surface-dim/60" : "border-slate-100 bg-surface-raised/60"
      }`}>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6">
          <div className={`text-xs ${isDark ? "text-white/20" : "text-slate-300"}`}>
            <span>Bryan &mdash; {t("footer.label")}</span>
          </div>
        </div>
      </footer>
      <MobileNav />
    </div>
  );
}
