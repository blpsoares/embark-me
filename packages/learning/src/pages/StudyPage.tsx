import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Upload, Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useI18n } from "../contexts/I18nContext";
import { useQuizManifest } from "../hooks/useQuizManifest";
import { QuizGrid } from "../components/quiz/QuizGrid";
import { QuizTabMenu } from "../components/quiz/QuizTabMenu";
import { DropZone } from "../components/upload/DropZone";
import type { Flashcard } from "../types/flashcard";

const ALL_TYPES_TAB = "__all__";

export function StudyPage() {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { quizzes, isLoading } = useQuizManifest();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [activeType, setActiveType] = useState(ALL_TYPES_TAB);

  const typeTabs = useMemo(() => {
    const types = [...new Set(quizzes.map((q) => q.type))].sort();
    return [ALL_TYPES_TAB, ...types];
  }, [quizzes]);

  const filteredQuizzes = useMemo(
    () => activeType === ALL_TYPES_TAB ? quizzes : quizzes.filter((q) => q.type === activeType),
    [quizzes, activeType],
  );

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
            <div className="flex items-center justify-center py-20">
              <Loader2 className={`h-8 w-8 animate-spin ${isDark ? "text-white/20" : "text-slate-300"}`} />
            </div>
          ) : (
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              {typeTabs.length > 2 && (
                <QuizTabMenu
                  tabs={typeTabs}
                  activeTab={activeType}
                  onTabChange={setActiveType}
                  getLabel={(tab) => tab === ALL_TYPES_TAB ? t("study.allTypes") : t(`quizType.${tab}`)}
                />
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
              <div className="mx-auto max-w-xl">
                <DropZone onCardsLoaded={handleCustomCards} cardCount={0} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
