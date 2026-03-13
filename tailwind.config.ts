import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#ffffff",
        paper: "#2A323C",
        "paper-dark": "#333D47",
        rust: "#7EFF00", // neon green
        "rust-light": "#9CFF33",
        "rust-dim": "#5EBF00",
        slate: "#94A3B8",
        "slate-light": "#64748B",
        cream: "#1E2328", // dark slate background
        brand: {
          50: '#f2ffe5',
          100: '#e0ffc2',
          200: '#c5ff94',
          300: '#a1ff5c',
          400: '#7eff00',
          500: '#67db00',
          600: '#50af00',
          700: '#3d8500',
          800: '#316805',
          900: '#2a5708',
          950: '#133100',
        }
      },
      fontFamily: {
        display: ["'Inter'", "sans-serif"],
        body: ["'Outfit'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.3s ease-out",
        "spin-slow": "spin 2s linear infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        slideUp: {
          from: { transform: "translateY(16px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
