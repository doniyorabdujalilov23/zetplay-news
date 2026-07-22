"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Tungi rejimga o'tish" : "Kunduzgi rejimga o'tish"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition hover:border-accent hover:text-accent dark:border-line-dark dark:text-paper"
    >
      {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
