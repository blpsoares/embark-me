import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Theme = "dark-notion" | "dark-vibrant" | "light-clean" | "light-soft";

export interface ThemeOption {
  id: Theme;
  label: string;
  isDark: boolean;
  preview: {
    bg: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    border: string;
    purple: string;
    yellow: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "dark-notion",
    label: "Dark Notion",
    isDark: true,
    preview: {
      bg: "#191919",
      surface: "#202020",
      surfaceHover: "#2A2A2A",
      text: "#E6E6E6",
      textSecondary: "#A0A0A0",
      border: "#2F2F2F",
      purple: "#8B5CF6",
      yellow: "#FACC15",
    },
  },
  {
    id: "dark-vibrant",
    label: "Dark Vibrant",
    isDark: true,
    preview: {
      bg: "#0F0F14",
      surface: "#18181F",
      surfaceHover: "#22222B",
      text: "#F5F5F7",
      textSecondary: "#B3B3C2",
      border: "#2A2A35",
      purple: "#A78BFA",
      yellow: "#FFD60A",
    },
  },
  {
    id: "light-clean",
    label: "Light Clean",
    isDark: false,
    preview: {
      bg: "#FFFFFF",
      surface: "#F7F7FB",
      surfaceHover: "#EEEEF5",
      text: "#1A1A1A",
      textSecondary: "#55556B",
      border: "#E4E4EF",
      purple: "#6D28D9",
      yellow: "#F59E0B",
    },
  },
  {
    id: "light-soft",
    label: "Light Soft",
    isDark: false,
    preview: {
      bg: "#FDFDFE",
      surface: "#F4F4FA",
      surfaceHover: "#EAEAF3",
      text: "#111827",
      textSecondary: "#4B5563",
      border: "#E5E7EB",
      purple: "#7C3AED",
      yellow: "#EAB308",
    },
  },
];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light-clean";
  const saved = localStorage.getItem("theme");
  if (saved && THEME_OPTIONS.some((t) => t.id === saved)) return saved as Theme;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark-notion";
  return "light-clean";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const isDark = THEME_OPTIONS.find((t) => t.id === theme)?.isDark ?? false;

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    for (const option of THEME_OPTIONS) {
      root.classList.remove(option.id);
    }
    // Apply current theme class
    root.classList.add(theme);
    // Manage Tailwind dark class
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, isDark]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem("theme", next);
    setThemeState(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
