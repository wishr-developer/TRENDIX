import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: "#FBFBFB", // 非常に薄いウォームグレー/アイボリー
        surface: "#FFFFFF", // 純白（カード/浮上）
        border: "#E5E5E5", // 柔らかいボーダー
        // プライマリ（信頼）- 深いネイビーブルー
        'trust': {
          DEFAULT: '#1a3455', // 深いネイビーブルー（伝統的なエレガンス）
          light: '#E8F0F5', // 薄いネイビー
          dark: '#1a3455', // 深いネイビー
        },
        // アクセント - 真鍮ゴールド
        'accent': {
          DEFAULT: '#B8860B', // 真鍮ゴールド（控えめな高級感）
          light: '#F5E6D3', // 薄いゴールド
          dark: '#8B6914', // 濃いゴールド
        },
        // 行動喚起カラー（控えめな赤）
        'cta': {
          DEFAULT: '#D9534F', // 控えめな赤
          orange: '#D9534F', // 控えめな赤
          light: '#F5E6E5', // 薄い赤
        },
        primary: "#1a3455", // 深いネイビーブルー
        danger: "#D9534F",  // 控えめな赤
        'price-drop': '#D9534F', // 値下がり（控えめな赤）
        'price-up': '#1a3455', // 値上がり（ネイビー）
        'sale': '#D9534F', // セール強調色（控えめな赤）
        'sale-bg': '#F5E6E5', // セール背景色（薄い赤）
        // AI Deal Score用メタリック配色
        'score-metallic': {
          gold: '#B8860B', // 真鍮ゴールド
          silver: '#C0C0C0', // 銀色
          bronze: '#CD7F32', // 銅色
          blue: '#1a3455', // ネイビーブルー
        },
        text: {
          main: "#1a3455", // ネイビー（ほぼ黒の代わり）
          muted: "#6b7280", // グレー
        },
        // Deal Score用グラデーション
        score: {
          s: {
            from: "#1a3455", // ネイビー
            to: "#B8860B", // ゴールド
          },
          a: {
            from: "#1a3455", // ネイビー
            to: "#4A90E2", // 青
          },
        }
      },
      boxShadow: {
        'soft': '0 2px 20px -5px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      screens: {
        'xs': '475px',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
