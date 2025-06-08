import { create } from "zustand";

const THEME_KEY = "streamify-theme";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem(THEME_KEY) || "light",
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));