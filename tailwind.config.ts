import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0D12",
          soft: "#161A21",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          dim: "#F6F7F9",
        },
        accent: {
          DEFAULT: "#1546E0",
          hover: "#0F35B8",
          soft: "#E8EDFD",
        },
        muted: "#5B6472",
        line: "#E4E7EC",
        "line-dark": "#252A33",
        surface: {
          dark: "#0E1116",
          "dark-card": "#161A21",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            a: { color: "#1546E0" },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
