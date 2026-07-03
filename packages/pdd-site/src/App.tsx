import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./i18n";
import Nav from "./components/Nav";

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<div id="landing-placeholder" />} />
          <Route path="/docs" element={<div id="docs-placeholder" />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}
