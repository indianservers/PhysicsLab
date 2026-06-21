import type { PhysicsVisualDomain } from "./domainVisualContracts";

export interface PremiumVisualTheme {
  domain: PhysicsVisualDomain;
  label: string;
  accent: string;
  accent2: string;
  warning: string;
  surface: string;
  grid: string;
  glow: string;
}

export const premiumVisualThemes: Record<PhysicsVisualDomain, PremiumVisualTheme> = {
  mechanics: {
    domain: "mechanics",
    label: "Mechanics cinematic",
    accent: "#22d3ee",
    accent2: "#facc15",
    warning: "#fb7185",
    surface: "#061826",
    grid: "rgba(34, 211, 238, 0.18)",
    glow: "rgba(34, 211, 238, 0.34)",
  },
  waves: {
    domain: "waves",
    label: "Wave tank",
    accent: "#60a5fa",
    accent2: "#c084fc",
    warning: "#f472b6",
    surface: "#07112f",
    grid: "rgba(96, 165, 250, 0.18)",
    glow: "rgba(192, 132, 252, 0.34)",
  },
  electricity: {
    domain: "electricity",
    label: "Circuit board",
    accent: "#facc15",
    accent2: "#34d399",
    warning: "#fb7185",
    surface: "#081a14",
    grid: "rgba(250, 204, 21, 0.18)",
    glow: "rgba(250, 204, 21, 0.32)",
  },
  magnetism: {
    domain: "magnetism",
    label: "Field lab",
    accent: "#38bdf8",
    accent2: "#f43f5e",
    warning: "#f97316",
    surface: "#071522",
    grid: "rgba(56, 189, 248, 0.16)",
    glow: "rgba(244, 63, 94, 0.28)",
  },
  optics: {
    domain: "optics",
    label: "Ray bench",
    accent: "#fef08a",
    accent2: "#38bdf8",
    warning: "#fb7185",
    surface: "#101522",
    grid: "rgba(254, 240, 138, 0.16)",
    glow: "rgba(254, 240, 138, 0.28)",
  },
  fluids: {
    domain: "fluids",
    label: "Fluid tank",
    accent: "#22d3ee",
    accent2: "#2dd4bf",
    warning: "#f97316",
    surface: "#061c22",
    grid: "rgba(45, 212, 191, 0.16)",
    glow: "rgba(34, 211, 238, 0.28)",
  },
  thermodynamics: {
    domain: "thermodynamics",
    label: "Thermal chamber",
    accent: "#fb923c",
    accent2: "#facc15",
    warning: "#ef4444",
    surface: "#211108",
    grid: "rgba(251, 146, 60, 0.16)",
    glow: "rgba(251, 146, 60, 0.3)",
  },
};

export function themeForDomain(domain: PhysicsVisualDomain) {
  return premiumVisualThemes[domain];
}
