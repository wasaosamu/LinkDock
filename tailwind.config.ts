import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "JetBrains Mono",
          "monospace",
        ],
      },
      colors: {
        cyber: {
          bg: "#0a0f1d",
          panel: "#0f172a",
          line: "#1e293b",
          cyan: "#22d3ee",
          purple: "#a855f7",
          magenta: "#ec4899",
        },
      },
      boxShadow: {
        neon: "0 0 12px rgba(34,211,238,0.55), 0 0 32px rgba(34,211,238,0.18)",
        "neon-purple":
          "0 0 12px rgba(168,85,247,0.55), 0 0 32px rgba(168,85,247,0.18)",
        "neon-soft": "0 0 18px rgba(34,211,238,0.25)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
        scan: "linear-gradient(180deg, transparent, rgba(34,211,238,0.04) 50%, transparent)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-3px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%) skewX(-12deg)" },
          "100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
        flicker: {
          "0%, 18%, 22%, 25%, 53%, 57%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.6" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.6s ease-in-out infinite",
        floatY: "floatY 4s ease-in-out infinite",
        scanline: "scanline 4s linear infinite",
        gradientShift: "gradientShift 6s ease-in-out infinite",
        shimmer: "shimmer 1.1s ease-out",
        flicker: "flicker 3s linear infinite",
        ticker: "ticker 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
