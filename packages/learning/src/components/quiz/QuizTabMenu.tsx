import { useTheme } from "../../contexts/ThemeContext";

interface QuizTabMenuProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  getLabel: (tab: string) => string;
}

export function QuizTabMenu({ tabs, activeTab, onTabChange, getLabel }: QuizTabMenuProps) {
  const { isDark } = useTheme();

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isActive
                ? isDark
                  ? "bg-primary-500/20 text-primary-300 ring-1 ring-primary-500/30"
                  : "bg-primary-100 text-primary-700 ring-1 ring-primary-200"
                : isDark
                  ? "text-white/40 hover:bg-white/5 hover:text-white/60"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
          >
            {getLabel(tab)}
          </button>
        );
      })}
    </div>
  );
}
