import { experiments } from "./experiments";

export interface ScientificSource {
  id: string;
  title: string;
  domain: string;
  level: "School" | "Undergraduate" | "Reference";
  note: string;
}

export const scientificSources: ScientificSource[] = [
  { id: "ncert-school-physics", title: "NCERT school physics and science sequence", domain: "School Physics", level: "School", note: "Used for class/topic alignment and school-level formula expectations." },
  { id: "constant-acceleration", title: "Constant-acceleration kinematics", domain: "Mechanics", level: "School", note: "Covers free fall, projectile components, range, time of flight, and motion graphs under uniform acceleration." },
  { id: "newtonian-mechanics", title: "Newtonian mechanics textbook model", domain: "Mechanics", level: "School", note: "Covers F = ma, Hooke law, work-energy, momentum, circular motion, and ideal rigid-body assumptions." },
  { id: "geometric-optics", title: "Geometric optics ray model", domain: "Optics", level: "School", note: "Covers reflection, refraction, Snell law, mirror formula, lens formula, magnification, and paraxial limits." },
  { id: "ideal-circuits", title: "Ideal DC circuit model", domain: "Electricity", level: "School", note: "Covers Ohm law, power, energy, series/parallel resistance, and Kirchhoff-style ideal components." },
  { id: "ideal-waves", title: "Ideal wave and oscillation model", domain: "Waves", level: "School", note: "Covers v = f lambda, period-frequency relations, small-angle pendulum, and ideal interference patterns." },
  { id: "hydrostatics", title: "Hydrostatics and buoyancy", domain: "Fluid Mechanics", level: "School", note: "Covers pressure, gauge pressure, Archimedes principle, density, and ideal incompressible fluids." },
  { id: "equilibrium-thermo", title: "Equilibrium thermodynamics model", domain: "Thermodynamics", level: "School", note: "Covers calorimetry, ideal gas relationships, temperature conversion, and quasi-static assumptions." },
  { id: "modern-physics", title: "Introductory modern physics model", domain: "Modern Physics", level: "Undergraduate", note: "Covers photoelectric equation, half-life decay, Bohr transitions, and de Broglie wavelength at textbook level." },
  { id: "physicslab-local-validation", title: "PhysicsLab local validation suite", domain: "Validation", level: "Reference", note: "Browser-project reference cases used by npm run test:physics; does not claim classroom outcome research." },
];

export interface ValidationSummary {
  generatedAt: string;
  experimentCount: number;
  sourceCount: number;
  maturityCounts: Record<string, number>;
  evidenceCounts: Record<string, number>;
  modelCounts: Record<string, number>;
  caveats: string[];
}

export function createValidationSummary(): ValidationSummary {
  return {
    generatedAt: new Date().toISOString(),
    experimentCount: experiments.length,
    sourceCount: scientificSources.length,
    maturityCounts: countBy((experiment) => experiment.maturityLevel ?? "Starter"),
    evidenceCounts: countBy((experiment) => experiment.evidenceType ?? "Exact Formula"),
    modelCounts: countBy((experiment) => experiment.modelClass ?? "Calculator"),
    caveats: [
      "Validation checks formula and dimension correctness for ideal models.",
      "Starter labs are not promoted to lab-specific validated simulations.",
      "No PhET-style student interview or classroom outcome study is claimed yet.",
      "Real measurement uncertainty and material non-idealities are included only where a lab explicitly models them.",
    ],
  };
}

function countBy(getKey: (experiment: typeof experiments[number]) => string) {
  return experiments.reduce<Record<string, number>>((acc, experiment) => {
    const key = getKey(experiment);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
