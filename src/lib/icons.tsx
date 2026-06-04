import { ReactNode, SVGProps } from "react";
import { ExperimentDefinition } from "../types";

export type PhysicsIconName =
  | "atom"
  | "battery"
  | "book"
  | "calculator"
  | "chart"
  | "check"
  | "clipboard"
  | "compass"
  | "download"
  | "drop"
  | "eye"
  | "field"
  | "flame"
  | "flask"
  | "folder"
  | "gauge"
  | "magnet"
  | "menu"
  | "moon"
  | "orbit"
  | "pendulum"
  | "play"
  | "prism"
  | "printer"
  | "rocket"
  | "ruler"
  | "save"
  | "search"
  | "settings"
  | "spark"
  | "spring"
  | "step"
  | "sun"
  | "teacher"
  | "thermometer"
  | "upload"
  | "volume"
  | "wave";

const iconPaths: Record<PhysicsIconName, ReactNode> = {
  atom: <><circle cx="12" cy="12" r="2.1" /><ellipse cx="12" cy="12" rx="9" ry="3.7" /><ellipse cx="12" cy="12" rx="9" ry="3.7" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.7" transform="rotate(120 12 12)" /></>,
  battery: <><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 10v4" /><path d="M7 10v4M10 12h4" /></>,
  book: <><path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3-3z" /><path d="M19 5v15H8a3 3 0 0 0-3 3V4" /></>,
  calculator: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0" /></>,
  chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="M7 15l3-4 3 2 4-7" /></>,
  check: <path d="M5 13l4 4L19 7" />,
  clipboard: <><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5a3 3 0 0 1 6 0M9 9h6M8 13h8M8 17h5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z" /></>,
  download: <><path d="M12 3v11" /><path d="M8 10l4 4 4-4" /><path d="M5 20h14" /></>,
  drop: <path d="M12 3C9 7 6 10.5 6 14a6 6 0 0 0 12 0c0-3.5-3-7-6-11z" />,
  eye: <><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" /><circle cx="12" cy="12" r="2.5" /></>,
  field: <><path d="M4 7c5-4 11-4 16 0M4 12c5-4 11-4 16 0M4 17c5-4 11-4 16 0" /><path d="M17 5l3 2-3 2M17 10l3 2-3 2M17 15l3 2-3 2" /></>,
  flame: <path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-2 5-2 5S10 7 9 3C7 7 5 10 5 15a7 7 0 0 0 7 7z" />,
  flask: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" /><path d="M8 15h8" /></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 10h18" /></>,
  gauge: <><path d="M4 15a8 8 0 1 1 16 0" /><path d="M12 15l4-5" /><path d="M6 19h12" /></>,
  magnet: <><path d="M6 4v7a6 6 0 0 0 12 0V4h-4v7a2 2 0 0 1-4 0V4z" /><path d="M6 8h4M14 8h4" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  moon: <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />,
  orbit: <><circle cx="12" cy="12" r="2" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-25 12 12)" /><circle cx="19" cy="8" r="1.5" /></>,
  pendulum: <><path d="M12 3v3" /><path d="M12 6l5 11" /><circle cx="17" cy="17" r="3" /><path d="M7 6h10" /></>,
  play: <path d="M8 5v14l11-7z" />,
  prism: <><path d="M12 4L21 20H3z" /><path d="M2 12h8M14 12l8-4M14 14l8 4" /></>,
  printer: <><path d="M7 8V4h10v4" /><rect x="5" y="12" width="14" height="8" rx="1.5" /><path d="M7 16h10M6 8h12a3 3 0 0 1 3 3v5h-2M5 16H3v-5a3 3 0 0 1 3-3" /></>,
  rocket: <><path d="M12 3c4 2 6 6 6 11l-4 4H10l-4-4c0-5 2-9 6-11z" /><path d="M9 18l-2 3M15 18l2 3" /><circle cx="12" cy="10" r="2" /></>,
  ruler: <><path d="M4 16L16 4l4 4L8 20z" /><path d="M8 16l-2-2M11 13l-2-2M14 10l-2-2" /></>,
  save: <><path d="M5 4h12l2 2v14H5z" /><path d="M8 4v6h8V4" /><path d="M8 20v-6h8v6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  spark: <path d="M13 2L5 13h6l-1 9 8-12h-6z" />,
  spring: <path d="M4 12c2-6 4 6 6 0s4 6 6 0 4 6 6 0" />,
  step: <><path d="M6 5v14" /><path d="M10 6l8 6-8 6z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  teacher: <><path d="M4 5h16v11H4z" /><path d="M8 20h8M12 16v4" /><circle cx="8" cy="10" r="1" /><path d="M11 10h5" /></>,
  thermometer: <><path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z" /><path d="M12 9v7" /></>,
  upload: <><path d="M12 21V10" /><path d="M8 14l4-4 4 4" /><path d="M5 4h14" /></>,
  volume: <><path d="M4 10v4h4l5 4V6l-5 4z" /><path d="M16 9c1 1 1 5 0 6M19 7c2 3 2 7 0 10" /></>,
  wave: <path d="M3 13c3-6 6 6 9 0s6 6 9 0" />,
};

export function PhysicsIcon({ name, className = "h-5 w-5", ...props }: { name: PhysicsIconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {iconPaths[name]}
    </svg>
  );
}

export function iconForExperiment(experiment: ExperimentDefinition): PhysicsIconName {
  const id = experiment.id;
  if (id.includes("projectile") || id.includes("free-fall") || id.includes("orbit")) return id.includes("orbit") ? "orbit" : "rocket";
  if (id.includes("pendulum")) return "pendulum";
  if (id.includes("spring") || id.includes("hooke") || id.includes("shm")) return "spring";
  if (id.includes("wave") || id.includes("sound") || id.includes("echo") || id.includes("slit") || id.includes("polarization")) return "wave";
  if (id.includes("mirror") || id.includes("lens") || id.includes("prism") || id.includes("refraction") || id.includes("eye") || id.includes("shadow") || id.includes("optical")) return id.includes("prism") ? "prism" : "eye";
  if (id.includes("ohm") || id.includes("circuit") || id.includes("current") || id.includes("capacitor") || id.includes("diode") || id.includes("power") || id.includes("bridge") || id.includes("transformer") || id.includes("generator") || id.includes("logic")) return "battery";
  if (id.includes("magnet") || id.includes("lorentz") || id.includes("emi") || id.includes("electromagnet")) return "magnet";
  if (id.includes("heat") || id.includes("gas") || id.includes("thermo")) return id.includes("gas") ? "flask" : "thermometer";
  if (id.includes("fluid") || id.includes("buoy") || id.includes("bernoulli") || id.includes("pressure")) return "drop";
  if (id.includes("photoelectric") || id.includes("nuclear") || id.includes("bohr") || id.includes("broglie")) return "atom";
  if (id.includes("sources-of-energy")) return "flame";
  if (id.includes("measurement") || id.includes("error")) return "ruler";
  if (id.includes("field") || id.includes("charge") || id.includes("static")) return "field";
  if (id.includes("force") || id.includes("work") || id.includes("energy") || id.includes("collision")) return "gauge";
  return iconForCategory(experiment.category);
}

export function iconForCategory(category: string): PhysicsIconName {
  if (category.includes("Optics")) return "prism";
  if (category.includes("Electric")) return "battery";
  if (category.includes("Magnet")) return "magnet";
  if (category.includes("Wave")) return "wave";
  if (category.includes("Thermo") || category.includes("Thermal")) return "thermometer";
  if (category.includes("Fluid")) return "drop";
  if (category.includes("Modern")) return "atom";
  if (category.includes("Measurement")) return "ruler";
  if (category.includes("Astronomy")) return "orbit";
  if (category.includes("Electronics")) return "spark";
  if (category.includes("Energy")) return "flame";
  return "gauge";
}

export function iconForTool(tool: string): PhysicsIconName {
  const lower = tool.toLowerCase();
  if (lower.includes("battery") || lower.includes("resistor") || lower.includes("voltmeter") || lower.includes("ammeter") || lower.includes("circuit")) return "battery";
  if (lower.includes("mirror") || lower.includes("lens") || lower.includes("ray") || lower.includes("prism") || lower.includes("screen") || lower.includes("eye")) return "prism";
  if (lower.includes("wave") || lower.includes("sound") || lower.includes("audio") || lower.includes("frequency")) return "wave";
  if (lower.includes("magnet") || lower.includes("coil") || lower.includes("compass")) return "magnet";
  if (lower.includes("thermo") || lower.includes("heat") || lower.includes("temperature")) return "thermometer";
  if (lower.includes("fluid") || lower.includes("pressure") || lower.includes("water")) return "drop";
  if (lower.includes("graph") || lower.includes("plot")) return "chart";
  if (lower.includes("ruler") || lower.includes("protractor") || lower.includes("measure")) return "ruler";
  if (lower.includes("charge") || lower.includes("field")) return "field";
  if (lower.includes("quiz") || lower.includes("assessment")) return "check";
  if (lower.includes("teacher") || lower.includes("assignment")) return "teacher";
  if (lower.includes("notebook") || lower.includes("record")) return "clipboard";
  return "calculator";
}
