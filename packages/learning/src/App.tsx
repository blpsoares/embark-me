import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { StudyPage } from "./pages/StudyPage";
import { QuizSessionPage } from "./pages/QuizSessionPage";
import { TopicsPage } from "./pages/TopicsPage";
import { NotionRoutePage } from "./pages/NotionRoutePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/study/:quizId" element={<QuizSessionPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/notion/:routeId" element={<NotionRoutePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
