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
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <GraduationCap className="h-4 w-4" />
            <span>Study Challenges</span>
          </div>
          <p className="text-xs text-slate-300">
            Built with Embark &mdash; Learn smarter, not harder
          </p>
        </div>
      </footer>
    </div>
  );
}
