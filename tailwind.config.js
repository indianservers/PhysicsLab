/** @type {import('tailwindcss').Config} */
const tokenColor = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // ─── Color Tokens ───────────────────────────────────────────────
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
          purple: tokenColor("--color-quantum-500"),
        },
      },

      // ─── Fluid Font Sizes ────────────────────────────────────────────
      fontSize: {
        xs:   ["var(--font-size-xs)",   { lineHeight: "1.45" }],
        sm:   ["var(--font-size-sm)",   { lineHeight: "1.5" }],
        base: ["var(--font-size-base)", { lineHeight: "var(--line-body)" }],
        lg:   ["var(--font-size-lg)",   { lineHeight: "1.45" }],
        xl:   ["var(--font-size-xl)",   { lineHeight: "var(--line-heading)" }],
        "2xl":["var(--font-size-2xl)", { lineHeight: "var(--line-heading)" }],
        "3xl":["var(--font-size-3xl)", { lineHeight: "var(--line-heading)" }],
        "4xl":["var(--font-size-4xl)", { lineHeight: "var(--line-tight)" }],
        "5xl":["var(--font-size-5xl)", { lineHeight: "var(--line-tight)" }],
        "6xl":["var(--font-size-6xl)", { lineHeight: "var(--line-tight)" }],
        "7xl":["var(--font-size-7xl)", { lineHeight: "var(--line-tight)" }],
      },

      // ─── Font Families ───────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },

      // ─── Letter Spacing ──────────────────────────────────────────────
      letterSpacing: {
        tightest: "-0.04em",
        tighter:  "-0.03em",
        tight:    "-0.02em",
        snug:     "-0.01em",
        normal:   "0em",
        wide:     "0.04em",
        wider:    "0.08em",
        widest:   "0.16em",
        display:  "0.22em",
      },

      // ─── 6-Level Elevation Shadow System ────────────────────────────
      boxShadow: {
        // Existing
        inset:          "var(--shadow-inset)",
        float:          "var(--shadow-float)",
        glow:           "var(--shadow-glow)",
        "glow-quantum": "var(--shadow-glow-quantum)",
        "glow-warning": "var(--shadow-glow-warning)",
        // New elevation tiers
        "elev-0": "none",
        "elev-1": "var(--shadow-elev-1)",
        "elev-2": "var(--shadow-elev-2)",
        "elev-3": "var(--shadow-elev-3)",
        "elev-4": "var(--shadow-elev-4)",
        "elev-5": "var(--shadow-elev-5)",
        // Colored accent shadows
        "glow-science": "var(--shadow-glow-science)",
        "glow-error":   "var(--shadow-glow-error)",
        "glow-success": "var(--shadow-glow-success)",
        // Press / inset depth
        "pressed":  "var(--shadow-pressed)",
        // Glass specular
        "glass":    "var(--shadow-glass)",
      },

      // ─── Spring Physics Easing Curves ────────────────────────────────
      transitionTimingFunction: {
        // Existing eases
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        linear:  "linear",
        in:      "cubic-bezier(0.4, 0, 1, 1)",
        out:     "cubic-bezier(0, 0, 0.2, 1)",
        "in-out":"cubic-bezier(0.4, 0, 0.2, 1)",
        // Spring family — use these everywhere
        "spring-soft":   "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "spring-medium": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "spring-stiff":  "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "spring-snap":   "cubic-bezier(0.22, 1, 0.36, 1)",
        // Deceleration (exits, reveals)
        "decel":         "cubic-bezier(0.0, 0.0, 0.2, 1)",
        // Acceleration (entrances)
        "accel":         "cubic-bezier(0.4, 0.0, 1, 1)",
      },

      // ─── Transition Durations ────────────────────────────────────────
      transitionDuration: {
        0:   "0ms",
        50:  "50ms",
        80:  "80ms",
        120: "120ms",
        160: "160ms",
        200: "200ms",
        240: "240ms",
        280: "280ms",
        350: "350ms",
        400: "400ms",
        500: "500ms",
        600: "600ms",
        700: "700ms",
        1000:"1000ms",
      },

      // ─── Backdrop Blur ───────────────────────────────────────────────
      backdropBlur: {
        xs:  "2px",
        sm:  "4px",
        md:  "8px",
        lg:  "12px",
        xl:  "20px",
        "2xl": "32px",
        "3xl": "48px",
      },

      // ─── Custom Animations ───────────────────────────────────────────
      keyframes: {
        // Mesh gradient drift
        "mesh-drift-1": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "33%":       { transform: "translate(8%, -6%) scale(1.08)" },
          "66%":       { transform: "translate(-5%, 9%) scale(0.96)" },
        },
        "mesh-drift-2": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "33%":       { transform: "translate(-10%, 7%) scale(1.06)" },
          "66%":       { transform: "translate(6%, -8%) scale(1.04)" },
        },
        "mesh-drift-3": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "50%":       { transform: "translate(5%, 5%) scale(1.1)" },
        },
        // Radial theme reveal
        "theme-reveal": {
          from: { clipPath: "circle(0% at var(--reveal-x, 50%) var(--reveal-y, 50%))" },
          to:   { clipPath: "circle(150% at var(--reveal-x, 50%) var(--reveal-y, 50%))" },
        },
        // Glass shimmer
        "glass-sheen": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        // Micro: button press
        "btn-press": {
          "0%":   { transform: "scale(1)" },
          "40%":  { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" },
        },
        // Number count-up shimmer
        "count-shimmer": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Ambient pulse (for glowing elements)
        "ambient-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%":       { opacity: "1",   transform: "scale(1.04)" },
        },
        // Skeleton wave
        "skeleton-wave": {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        // Stagger fade-up
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Cinematic sheen (existing, kept)
        "cinematic-sheen": {
          "0%, 100%": { opacity: "0.78", transform: "translateX(0%)" },
          "50%":       { opacity: "1",    transform: "translateX(2%)" },
        },
        // Existing animations (kept)
        "lab-dash": {
          "0%":   { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        "lab-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%":       { transform: "scale(1.08)", opacity: "0.85" },
        },
        "lab-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-6px)" },
        },
        "lab-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 6px currentColor)" },
          "50%":       { filter: "drop-shadow(0 0 16px currentColor)" },
        },
        "count-pop": {
          "0%":  { transform: "scale(0.88)", opacity: "0" },
          "60%": { transform: "scale(1.06)" },
          "100%":{ transform: "scale(1)",    opacity: "1" },
        },
        "skeleton-shimmer": {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },

      animation: {
        "mesh-drift-1":   "mesh-drift-1 18s ease-in-out infinite alternate",
        "mesh-drift-2":   "mesh-drift-2 22s ease-in-out infinite alternate",
        "mesh-drift-3":   "mesh-drift-3 14s ease-in-out infinite alternate",
        "theme-reveal":   "theme-reveal 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "glass-sheen":    "glass-sheen 2.4s linear infinite",
        "btn-press":      "btn-press 160ms ease-spring-snap",
        "count-shimmer":  "count-shimmer 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "ambient-pulse":  "ambient-pulse 3s ease-in-out infinite",
        "skeleton-wave":  "skeleton-wave 1.5s ease-in-out infinite",
        "fade-up":        "fade-up 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "cinematic-sheen":"cinematic-sheen 8s ease-in-out infinite",
        "lab-dash":       "lab-dash 1.2s ease-in-out infinite",
        "lab-pulse":      "lab-pulse 2s ease-in-out infinite",
        "lab-float":      "lab-float 2.8s ease-in-out infinite",
        "lab-glow":       "lab-glow 2s ease-in-out infinite",
        "count-pop":      "count-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "skeleton-shimmer":"skeleton-shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
