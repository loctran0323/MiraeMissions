import type { Config } from "tailwindcss";

// Mirae Asset Securities design system — corporate financial aesthetic.
// Deep graphite/navy ink, the signature Mirae orange as a disciplined accent,
// clean white + light-grey surfaces, restrained type, sharp structured layout.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signature Mirae Asset orange
        mirae: {
          DEFAULT: "#EB6608",
          50: "#FEF4EA",
          100: "#FCE3CC",
          200: "#F8C394",
          300: "#F4A05B",
          400: "#F08230",
          500: "#EB6608",
          600: "#D25A06",
          700: "#AA4809",
          800: "#85390E",
          900: "#6C300F",
        },
        // Cool graphite/navy ink scale for text + dark sections
        ink: {
          DEFAULT: "#12161F",
          50: "#F5F6F8",
          100: "#E9EBF0",
          200: "#D4D8E0",
          300: "#AEB4C2",
          400: "#828A9C",
          500: "#5C6478",
          600: "#414959",
          700: "#2C3340",
          800: "#1B212C",
          900: "#12161F",
          950: "#0B0E14",
        },
        line: "#E6E8EE",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.625rem",
        xl: "0.875rem",
      },
      maxWidth: {
        site: "1240px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,21,29,0.04), 0 6px 20px -12px rgba(17,21,29,0.18)",
        lift: "0 8px 28px -12px rgba(17,21,29,0.22)",
        header: "0 1px 0 rgba(17,21,29,0.06)",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
