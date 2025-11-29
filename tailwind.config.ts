import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617", // Slate-950
        surface: "rgba(255, 255, 255, 0.03)", 
        primary: "#00f3ff", // Neon Cyan
        secondary: "#bd00ff", // Neon Purple
        text: { main: "#f0f0f0", muted: "#94a3b8" }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 243, 255, 0.3), 0 0 20px rgba(0, 243, 255, 0.1)',
      }
    },
  },
  plugins: [],
};
export default config;
