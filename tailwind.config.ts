import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mirae Asset brand system
        navy: {
          DEFAULT: "#0E1726",
          50: "#F3F5F8",
          100: "#E2E7EF",
          200: "#C3CCDB",
          300: "#9AA9C0",
          400: "#6B7E9C",
          500: "#475A78",
          600: "#314259",
          700: "#22304380",
          800: "#16223A",
          900: "#0E1726",
          950: "#080F1A",
        },
        mirae: {
          // Refined Mirae Asset orange
          DEFAULT: "#F26C1E",
          50: "#FEF4EC",
          100: "#FDE6D3",
          200: "#FBCBA3",
          300: "#F8A968",
          400: "#F58A3C",
          500: "#F26C1E",
          600: "#DB5410",
          700: "#B23F0F",
          800: "#8C3313",
          900: "#722C13",
        },
        sand: {
          DEFAULT: "#FAF7F2",
          100: "#FBF8F3",
          200: "#F3EDE3",
        },
        ink: "#14171F",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(14,23,38,0.04), 0 8px 24px -12px rgba(14,23,38,0.12)",
        lift: "0 4px 12px -4px rgba(14,23,38,0.10), 0 24px 48px -24px rgba(14,23,38,0.22)",
        glow: "0 8px 32px -8px rgba(242,108,30,0.45)",
      },
      backgroundImage: {
        "navy-gradient":
          "linear-gradient(135deg, #0E1726 0%, #16223A 55%, #1d2f4d 100%)",
        "mirae-gradient":
          "linear-gradient(135deg, #F58A3C 0%, #F26C1E 50%, #DB5410 100%)",
        "hero-glow":
          "radial-gradient(120% 120% at 0% 0%, rgba(242,108,30,0.12) 0%, rgba(242,108,30,0) 45%), radial-gradient(120% 120% at 100% 0%, rgba(29,47,77,0.10) 0%, rgba(29,47,77,0) 50%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
