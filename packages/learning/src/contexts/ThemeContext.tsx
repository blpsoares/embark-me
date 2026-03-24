import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Theme = "dark-soft" | "dark-vibrant" | "light-clean" | "light-soft";

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
    id: "dark-soft",
    label: "Dark Soft",
    isDark: true,
    preview: {
      bg: "#252628",       /* oklch(0.175 0.005 264) neutral cool gray */
      surface: "#2D2E31",  /* oklch(0.218 0.005 264) */
      surfaceHover: "#363739",
      text: "#EAEAEC",
      textSecondary: "#8E8E96",
      border: "#3C3D41",
      purple: "#8B5CF6",
      yellow: "#FACC15",
    },
  },
  {
    id: "dark-vibrant",
    label: "Dark Vibrant",
    isDark: true,
    preview: {
      bg: "#0B0812",       /* oklch(0.105 0.022 272) deep purple-dark */
      surface: "#16102A",  /* oklch(0.16 0.030 275) vivid elevated */
      surfaceHover: "#1E1835",
      text: "#F0EEFF",
      textSecondary: "#A89FD4",
      border: "#231C3E",
      purple: "#A78BFA",
      yellow: "#FFD60A",
    },
  },
  {
    id: "light-clean",
    label: "Light Clean",
    isDark: false,
    preview: {
      bg: "#F8F8FB",       /* oklch(0.99 0.002 250) cool near-white */
      surface: "#FFFFFF",
      surfaceHover: "#F2F2F6",
      text: "#111218",
      textSecondary: "#52526A",
      border: "#E2E2EC",
      purple: "#6D28D9",
      yellow: "#F59E0B",
    },
  },
  {
    id: "light-soft",
    label: "Light Soft",
    isDark: false,
    preview: {
      bg: "#F5EDD8",       /* oklch(0.972 0.022 76) warm cream */
      surface: "#FBF5E8",  /* oklch(0.985 0.014 79) warm white */
      surfaceHover: "#EFE4CC",
      text: "#2A1F0A",
      textSecondary: "#7A6245",
      border: "#DFD0B0",
      purple: "#7C3AED",
      yellow: "#D97706",
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
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark-soft";
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
