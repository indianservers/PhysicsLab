/** @type {import('tailwindcss').Config} */
const tokenColor = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          50: tokenColor("--color-space-50"),
          100: tokenColor("--color-space-100"),
          200: tokenColor("--color-space-200"),
          300: tokenColor("--color-space-300"),
          400: tokenColor("--color-space-400"),
          500: tokenColor("--color-space-500"),
          600: tokenColor("--color-space-600"),
          700: tokenColor("--color-space-700"),
          800: tokenColor("--color-space-800"),
          900: tokenColor("--color-space-900"),
        },
        science: {
          50: tokenColor("--color-science-50"),
          100: tokenColor("--color-science-100"),
          200: tokenColor("--color-science-200"),
          300: tokenColor("--color-science-300"),
          400: tokenColor("--color-science-400"),
          500: tokenColor("--color-science-500"),
          600: tokenColor("--color-science-600"),
          700: tokenColor("--color-science-700"),
          800: tokenColor("--color-science-800"),
          900: tokenColor("--color-science-900"),
        },
        quantum: {
          50: tokenColor("--color-quantum-50"),
          100: tokenColor("--color-quantum-100"),
          200: tokenColor("--color-quantum-200"),
          300: tokenColor("--color-quantum-300"),
          400: tokenColor("--color-quantum-400"),
          500: tokenColor("--color-quantum-500"),
          600: tokenColor("--color-quantum-600"),
          700: tokenColor("--color-quantum-700"),
          800: tokenColor("--color-quantum-800"),
          900: tokenColor("--color-quantum-900"),
        },
        warning: {
          50: tokenColor("--color-warning-50"),
          100: tokenColor("--color-warning-100"),
          200: tokenColor("--color-warning-200"),
          300: tokenColor("--color-warning-300"),
          400: tokenColor("--color-warning-400"),
          500: tokenColor("--color-warning-500"),
          600: tokenColor("--color-warning-600"),
          700: tokenColor("--color-warning-700"),
          800: tokenColor("--color-warning-800"),
          900: tokenColor("--color-warning-900"),
        },
        lab: {
          ink: tokenColor("--color-space-900"),
          panel: "var(--surface-panel)",
          line: "var(--line-soft)",
          cyan: tokenColor("--color-science-500"),
          blue: tokenColor("--color-science-400"),
          orange: tokenColor("--color-warning-500"),
          red: "#f43f5e",
          green: "#34d399",
          purple: tokenColor("--color-quantum-500")
        }
      },
      fontSize: {
        xs: ["var(--font-size-xs)", { lineHeight: "1.45" }],
        sm: ["var(--font-size-sm)", { lineHeight: "1.5" }],
        base: ["var(--font-size-base)", { lineHeight: "var(--line-body)" }],
        lg: ["var(--font-size-lg)", { lineHeight: "1.45" }],
        xl: ["var(--font-size-xl)", { lineHeight: "var(--line-heading)" }],
        "2xl": ["var(--font-size-2xl)", { lineHeight: "var(--line-heading)" }],
        "3xl": ["var(--font-size-3xl)", { lineHeight: "var(--line-heading)" }],
        "4xl": ["var(--font-size-4xl)", { lineHeight: "var(--line-tight)" }],
        "5xl": ["var(--font-size-5xl)", { lineHeight: "var(--line-tight)" }],
        "6xl": ["var(--font-size-6xl)", { lineHeight: "var(--line-tight)" }],
        "7xl": ["var(--font-size-7xl)", { lineHeight: "var(--line-tight)" }],
      },
      boxShadow: {
        inset: "var(--shadow-inset)",
        float: "var(--shadow-float)",
        glow: "var(--shadow-glow)",
        "glow-quantum": "var(--shadow-glow-quantum)",
        "glow-warning": "var(--shadow-glow-warning)",
      }
    },
  },
  plugins: [],
};
