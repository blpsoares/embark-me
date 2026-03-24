import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Upload } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useI18n } from "../contexts/I18nContext";
import { useQuizManifest } from "../hooks/useQuizManifest";
import { QuizGrid } from "../components/quiz/QuizGrid";
import { QuizTabMenu } from "../components/quiz/QuizTabMenu";
import { DropZone } from "../components/upload/DropZone";
import type { Flashcard } from "../types/flashcard";

const ALL = "__all__";

function SkeletonCard({ isDark }: { isDark: boolean }) {
  return (
    <div className={`flex flex-col rounded-2xl border p-5 ${
      isDark ? "border-white/6 bg-surface-raised/50" : "border-slate-200/60 bg-white"
    }`}>
      <div className="mb-4 flex items-start justify-between">
        <div className={`skeleton h-11 w-11 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
        <div className={`skeleton h-6 w-20 rounded-full ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
      </div>
      <div className={`skeleton mb-2 h-5 w-3/4 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
      <div className={`skeleton mb-4 h-4 w-full rounded-lg ${isDark ? "bg-white/4" : "bg-slate-50"}`} />
      <div className="mt-auto flex justify-between">
        <div className={`skeleton h-4 w-16 rounded-md ${isDark ? "bg-white/4" : "bg-slate-50"}`} />
        <div className={`skeleton h-4 w-4 rounded-md ${isDark ? "bg-white/4" : "bg-slate-50"}`} />
      </div>
    </div>
  );
}

function LoadingGrid({ isDark }: { isDark: boolean }) {
  return (
    <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <SkeletonCard key={i} isDark={isDark} />
      ))}
    </div>
  );
}

export function StudyPage() {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { quizzes, isLoading } = useQuizManifest();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [activeType, setActiveType] = useState(ALL);
  const [activeTheme, setActiveTheme] = useState(ALL);

  const typeTabs = useMemo(() => {
    const types = [...new Set(quizzes.map((q) => q.type))].sort();
    return [ALL, ...types];
  }, [quizzes]);

  const quizzesByType = useMemo(
    () => activeType === ALL ? quizzes : quizzes.filter((q) => q.type === activeType),
    [quizzes, activeType],
  );

  const themeTabs = useMemo(() => {
    const themes = new Set<string>();
    for (const q of quizzesByType) {
      for (const tag of q.tags) {
        themes.add(tag);
      }
    }
    return [ALL, ...[...themes].sort()];
  }, [quizzesByType]);

  const filteredQuizzes = useMemo(
    () => activeTheme === ALL ? quizzesByType : quizzesByType.filter((q) => q.tags.includes(activeTheme)),
    [quizzesByType, activeTheme],
  );

  const handleTypeChange = (tab: string) => {
    setActiveType(tab);
    setActiveTheme(ALL);
  };

  const handleCustomCards = (cards: Flashcard[]) => {
    navigate("/study/custom", { state: { quizData: { type: "flashcard", questions: cards } } });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-b from-primary-950/20 to-transparent"
            : "bg-gradient-to-b from-primary-50/50 to-transparent"
        }`} />

        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pt-16">
          {/* Header */}
          <div className="animate-fade-in-up mb-10 text-center">
            <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${
              isDark
                ? "border-primary-500/15 bg-primary-500/8 text-primary-300"
                : "border-primary-200/60 bg-white text-primary-600"
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
              {t("study.badge")}
            </div>
            <h1 className={`mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
              isDark ? "text-white/81" : "text-slate-900"
            }`}>
              {t("study.title")}
            </h1>
            <p className={`mx-auto max-w-lg text-base leading-relaxed ${
              isDark ? "text-white/44" : "text-slate-500"
            }`}>
              {t("study.subtitle")}
            </p>
          </div>

          {/* Quiz Tabs + Grid */}
          {isLoading ? (
            <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
              <LoadingGrid isDark={isDark} />
            </div>
          ) : (
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              {/* Type tabs */}
              {typeTabs.length > 2 && (
                <QuizTabMenu
                  tabs={typeTabs}
                  activeTab={activeType}
                  onTabChange={handleTypeChange}
                  getLabel={(tab) => tab === ALL ? t("study.allTypes") : t(`quizType.${tab}`)}
                />
              )}

              {/* Theme filter pills */}
              {themeTabs.length > 2 && (
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {themeTabs.map((theme) => {
                    const isActive = theme === activeTheme;
                    const label = theme === ALL
                      ? t("study.allThemes")
                      : t(`tag.${theme}`) === `tag.${theme}` ? theme : t(`tag.${theme}`);
                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setActiveTheme(theme)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? isDark
                              ? "bg-white/10 text-white/70 shadow-sm"
                              : "bg-slate-800 text-white shadow-sm"
                            : isDark
                              ? "text-white/25 hover:bg-white/5 hover:text-white/40"
                              : "text-slate-400 hover:bg-slate-100 hover:text-slate-500"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              <QuizGrid quizzes={filteredQuizzes} />
            </div>
          )}

          {/* Upload custom quiz */}
          <div className="animate-fade-in-up mt-10" style={{ animationDelay: "300ms" }}>
            {!showUpload ? (
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className={`mx-auto flex items-center gap-3 rounded-2xl border-2 border-dashed px-8 py-5 transition-all duration-300 ${
                  isDark
                    ? "border-white/8 text-white/30 hover:border-primary-500/30 hover:bg-surface-raised/50 hover:text-white/50"
                    : "border-slate-200 text-slate-400 hover:border-primary-300 hover:bg-primary-50/30 hover:text-slate-600"
                }`}
              >
                <Upload className="h-5 w-5" />
                <div className="text-left">
                  <span className="block text-sm font-semibold">{t("study.uploadCard.title")}</span>
                  <span className="block text-xs opacity-60">{t("study.uploadCard.desc")}</span>
                </div>
              </button>
            ) : (
              <div className="animate-scale-in mx-auto max-w-xl">
                <DropZone onCardsLoaded={handleCustomCards} cardCount={0} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
