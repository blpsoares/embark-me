import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { GraduationCap } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";

export function Layout() {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <div className={`flex min-h-screen flex-col transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-surface text-slate-900"
    }`}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className={`border-t py-8 backdrop-blur-sm ${
        isDark ? "border-white/5 bg-slate-900/60" : "border-slate-100 bg-white/60"
      }`}>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6">
          <div className={`flex items-center gap-2 text-xs ${isDark ? "text-slate-600" : "text-slate-300"}`}>
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Bryan &mdash; {t("footer.label")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
