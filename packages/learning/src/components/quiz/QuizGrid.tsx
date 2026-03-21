import { QuizCard } from "./QuizCard";
import type { QuizManifestEntry } from "../../types/quiz";

interface QuizGridProps {
  quizzes: QuizManifestEntry[];
}

export function QuizGrid({ quizzes }: QuizGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}
