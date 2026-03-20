import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { StudyPage } from "./pages/StudyPage";
import { NotionPage } from "./pages/NotionPage";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/notion" element={<NotionPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
