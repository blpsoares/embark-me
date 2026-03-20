import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { GraduationCap } from "lucide-react";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-100 bg-white/60 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Bryan &mdash; Meus Estudos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
