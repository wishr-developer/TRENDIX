import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        background: "#09090b", // Zinc-950
        surface: "#18181b", // Zinc-900
        surfaceHighlight: "#27272a", // Zinc-800
        border: "#27272a", // Zinc-800 (境界線)
        primary: "#3b82f6", // Blue-500
        text: {
          main: "#fafafa", // Zinc-50
          muted: "#a1a1aa", // Zinc-400
          dim: "#52525b", // Zinc-600
        },
      },
    },
  },
  plugins: [],
};
export default config;
