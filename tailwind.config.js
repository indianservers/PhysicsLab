/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lab: {
          ink: "#08111f",
          panel: "rgba(12, 23, 40, 0.78)",
          line: "rgba(148, 163, 184, 0.22)",
          cyan: "#22d3ee",
          blue: "#38bdf8",
          orange: "#fb923c",
          red: "#f43f5e",
          green: "#34d399",
          purple: "#a78bfa"
        }
      },
      boxShadow: {
        glow: "0 0 26px rgba(34, 211, 238, 0.18)"
      }
    },
  },
  plugins: [],
};
