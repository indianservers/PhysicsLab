import { ExperimentDefinition, SimulationModelClass } from "../types";

export interface ExperimentScientificTrust {
  assumptions: string[];
  limitations: string[];
  validRanges: string[];
  failureConditions: string[];
  modelClass: SimulationModelClass;
  trustLevel: number;
  confidenceReason: string;
}

const defaults: ExperimentScientificTrust = {
  assumptions: ["SI units are used unless a control explicitly says otherwise.", "Textbook calculator outputs are exact for the stated ideal assumptions."],
  limitations: ["Real instrument uncertainty, losses, and non-ideal material behavior may be omitted in simplified labs."],
  validRanges: ["Use finite positive physical inputs.", "Stay inside the slider ranges shown by the lab."],
  failureConditions: ["Invalid, singular, negative, or zero-denominator inputs make the result untrusted."],
  modelClass: "Calculator",
  trustLevel: 100,
  confidenceReason: "Formula result is computed directly from a standard textbook equation and is 100% reliable inside the stated ideal assumptions and valid input range.",
};

const domainTrust: Record<string, Partial<ExperimentScientificTrust>> = {
  Mechanics: {
    assumptions: ["Rigid bodies are approximated as point masses or simple shapes.", "Gravity is uniform over the workspace.", "Canvas coordinates are converted to SI only where stated."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Mechanics outputs use closed-form textbook equations or validated one-dimensional relationships, so numeric values are exact inside the displayed assumptions.",
  },
  "Fluid Mechanics": {
    assumptions: ["Fluids are incompressible unless stated.", "Buoyancy uses Archimedes' principle.", "Viscous and turbulent losses are simplified."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Fluid outputs use standard hydrostatics and Archimedes-law formulas and are exact for ideal incompressible-fluid assumptions.",
  },
  Thermodynamics: {
    assumptions: ["Systems are treated as equilibrium or quasi-equilibrium states.", "Specific heat and material properties are constant over the selected range."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Thermal outputs use standard equilibrium formula calculators and are exact for the stated ideal material assumptions.",
  },
  Electricity: {
    assumptions: ["Components are ideal unless explicitly modeled.", "Ohmic relationships assume constant temperature."],
    limitations: ["Circuit visuals are not SPICE-grade simulation.", "Ideal meters and switches can create invalid circuits if connected unrealistically."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Electrical outputs are computed from ideal textbook circuit formulas and are 100% reliable for the stated ideal component assumptions.",
  },
  Magnetism: {
    assumptions: ["Fields use ideal wire, coil, or uniform-field approximations.", "Direction rules are educational diagrams."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Magnetic formula outputs use idealized textbook field relationships; field-line drawings remain illustrative while displayed numeric formulas are exact within assumptions.",
  },
  Optics: {
    assumptions: ["Rays are geometric optics rays.", "Angles are measured from the normal.", "Paraxial approximations may apply."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Optics outputs use standard ray-optics equations and are exact for paraxial or geometric-optics assumptions shown in the lab.",
  },
  Waves: {
    assumptions: ["Wave media are idealized.", "Interference visuals are qualitative unless a formula output is shown."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Wave and oscillation formula outputs use standard textbook relationships and are exact for ideal media and small-angle assumptions where stated.",
  },
  "Modern Physics": {
    assumptions: ["Formula outputs use simplified textbook models.", "Quantum visuals are conceptual unless explicitly numeric."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Modern-physics formula outputs use standard textbook models and constants; conceptual animations are separate from the numeric result.",
  },
  Quantum: {
    assumptions: ["Visuals are conceptual representations of quantum quantities.", "Probabilities require normalized models before quantitative interpretation."],
    modelClass: "Visualization",
    trustLevel: 88,
    confidenceReason: "Quantum visuals are educational metaphors unless a normalized calculator is present; numeric formula outputs remain bounded by the stated assumptions.",
  },
};

const idOverrides: Record<string, Partial<ExperimentScientificTrust>> = {
  "projectile-motion": {
    assumptions: ["No air resistance unless the control explicitly enables it.", "Gravity is constant.", "Earth is treated as flat over the trajectory."],
    limitations: ["Not valid for hypersonic speeds or long-range ballistic trajectories."],
    failureConditions: ["Hypersonic speeds", "Long-range paths where curvature matters", "Non-finite launch inputs"],
    modelClass: "Validated Simulation",
    trustLevel: 100,
    confidenceReason: "Uses standard constant-acceleration equations validated against analytic projectile motion, with no air resistance unless explicitly stated.",
  },
  "free-fall": {
    assumptions: ["No air resistance.", "Constant gravitational acceleration.", "Mass does not affect ideal free fall."],
    modelClass: "Validated Simulation",
    trustLevel: 100,
    confidenceReason: "Free-fall values are computed from the exact constant-acceleration equations for uniform gravity and no air resistance.",
  },
  "newton-s-second-law": {
    assumptions: ["Net force is one-dimensional.", "Mass is positive and constant."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Newton's second law is evaluated directly as F = ma or a = F/m for finite positive mass.",
  },
  "ohms-law": {
    assumptions: ["Material is ohmic.", "Temperature is constant.", "Resistance is positive."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Ohm's law is evaluated directly for ideal ohmic components with positive resistance.",
  },
  "kirchhoff-circuit": {
    limitations: ["Only simple ideal circuits are trustworthy.", "Singular or contradictory ideal sources must be rejected."],
    failureConditions: ["Shorted ideal voltage source", "Open circuit with no return path", "Singular matrix"],
    modelClass: "Calculator",
    trustLevel: 96,
    confidenceReason: "Kirchhoff calculations are reliable for well-posed ideal circuits; the score is lower than 100 only because invalid ideal-source topologies must be rejected.",
  },
  "wave-lab": {
    modelClass: "Visualization",
    trustLevel: 86,
    confidenceReason: "Wave motion is a visual teaching model; use the displayed textbook formulas for exact numeric work.",
  },
  "photoelectric-equation": {
    assumptions: ["Photon energy and work function are expressed in eV.", "Stopping potential reports maximum kinetic energy per electron charge."],
    limitations: ["Photocurrent is qualitative unless a current model is explicitly provided."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Photoelectric energy and stopping-potential values are calculated directly from Einstein's photoelectric equation for the stated ideal assumptions.",
  },
};

export function scientificTrustForExperiment(experiment: Pick<ExperimentDefinition, "id" | "category" | "difficulty">): ExperimentScientificTrust {
  const domain = domainTrust[experiment.category] ?? {};
  const override = idOverrides[experiment.id] ?? {};
  return {
    ...defaults,
    ...domain,
    ...override,
    assumptions: [...new Set([...(defaults.assumptions), ...(domain.assumptions ?? []), ...(override.assumptions ?? [])])],
    limitations: [...new Set([...(defaults.limitations), ...(domain.limitations ?? []), ...(override.limitations ?? [])])],
    validRanges: [...new Set([...(defaults.validRanges), ...(domain.validRanges ?? []), ...(override.validRanges ?? [])])],
    failureConditions: [...new Set([...(defaults.failureConditions), ...(domain.failureConditions ?? []), ...(override.failureConditions ?? [])])],
    trustLevel: Math.max(0, Math.min(100, override.trustLevel ?? domain.trustLevel ?? defaults.trustLevel)),
    confidenceReason: override.confidenceReason ?? domain.confidenceReason ?? defaults.confidenceReason,
  };
}

export function withScientificTrust<T extends ExperimentDefinition>(experiment: T): T {
  return { ...experiment, ...scientificTrustForExperiment(experiment) };
}
