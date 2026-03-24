import { Link } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useI18n } from "../contexts/I18nContext";

export function NotFoundPage() {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="animate-fade-in-up flex flex-col items-center text-center">
        <img
          src="/og-image.png"
          alt="404"
          className={`mb-6 h-48 w-48 select-none object-contain ${isDark ? "invert" : ""}`}
          draggable={false}
        />

        <p className={`mb-2 text-lg font-bold ${isDark ? "text-white/60" : "text-slate-600"}`}>
          {t("notFound.title")}
        </p>
        <p className={`mb-8 max-w-sm text-sm leading-relaxed ${isDark ? "text-white/30" : "text-slate-400"}`}>
          {t("notFound.description")}
        </p>

        <div className="flex gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-lg"
          >
            <Home className="h-4 w-4" />
            {t("notFound.home")}
          </Link>
          <Link
            to="/study"
            className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
              isDark
                ? "border-white/10 text-white/60 hover:border-white/20 hover:bg-white/5"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t("notFound.study")}
          </Link>
        </div>
      </div>
    </div>
  );
}
