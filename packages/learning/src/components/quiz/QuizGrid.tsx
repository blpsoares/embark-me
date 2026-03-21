import { useMemo } from "react";
import { QuizCard } from "./QuizCard";
import { useTheme } from "../../contexts/ThemeContext";
import { useI18n } from "../../contexts/I18nContext";
import type { QuizManifestEntry } from "../../types/quiz";

interface QuizGridProps {
  quizzes: QuizManifestEntry[];
}

export function QuizGrid({ quizzes }: QuizGridProps) {
  const { isDark } = useTheme();
  const { t } = useI18n();

  const grouped = useMemo(() => {
    const map = new Map<string, QuizManifestEntry[]>();

    for (const quiz of quizzes) {
      const theme = quiz.tags[0] ?? "general";
      const list = map.get(theme);
      if (list) {
        list.push(quiz);
      } else {
        map.set(theme, [quiz]);
      }
    }

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [quizzes]);

  if (grouped.length <= 1) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map(([theme, themeQuizzes]) => (
        <div key={theme}>
          <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${
            isDark ? "text-white/30" : "text-slate-400"
          }`}>
            {t(`tag.${theme}`) === `tag.${theme}` ? theme : t(`tag.${theme}`)}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themeQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
