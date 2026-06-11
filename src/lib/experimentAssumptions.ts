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
  assumptions: ["SI units are used unless a control explicitly says otherwise.", "Displayed animations are educational unless the model is marked as validated."],
  limitations: ["Air resistance, losses, and real instrument uncertainty may be omitted in simplified labs."],
  validRanges: ["Use finite positive physical inputs.", "Stay inside the slider ranges shown by the lab."],
  failureConditions: ["Invalid, singular, negative, or zero-denominator inputs make the result untrusted."],
  modelClass: "Calculator",
  trustLevel: 62,
  confidenceReason: "Textbook formula calculator with educational visualization; assumptions must be checked before quantitative use.",
};

const domainTrust: Record<string, Partial<ExperimentScientificTrust>> = {
  Mechanics: {
    assumptions: ["Rigid bodies are approximated as point masses or simple shapes.", "Gravity is uniform over the workspace.", "Canvas coordinates are converted to SI only where stated."],
    modelClass: "Dynamic Simulation",
    trustLevel: 70,
    confidenceReason: "Mechanics quantities are produced by the live Matter.js model plus explicit SI conversion adapters.",
  },
  "Fluid Mechanics": {
    assumptions: ["Fluids are incompressible unless stated.", "Buoyancy uses Archimedes' principle.", "Viscous and turbulent losses are simplified."],
    modelClass: "Calculator",
    trustLevel: 64,
  },
  Thermodynamics: {
    assumptions: ["Systems are treated as equilibrium or quasi-equilibrium states.", "Specific heat and material properties are constant over the selected range."],
    modelClass: "Calculator",
    trustLevel: 60,
  },
  Electricity: {
    assumptions: ["Components are ideal unless explicitly modeled.", "Ohmic relationships assume constant temperature."],
    limitations: ["Circuit visuals are not SPICE-grade simulation.", "Ideal meters and switches can create invalid circuits if connected unrealistically."],
    modelClass: "Calculator",
    trustLevel: 58,
  },
  Magnetism: {
    assumptions: ["Fields use ideal wire, coil, or uniform-field approximations.", "Direction rules are educational diagrams."],
    modelClass: "Visualization",
    trustLevel: 54,
  },
  Optics: {
    assumptions: ["Rays are geometric optics rays.", "Angles are measured from the normal.", "Paraxial approximations may apply."],
    modelClass: "Visualization",
    trustLevel: 58,
  },
  Waves: {
    assumptions: ["Wave media are idealized.", "Interference visuals are qualitative unless a formula output is shown."],
    modelClass: "Visualization",
    trustLevel: 55,
  },
  "Modern Physics": {
    assumptions: ["Formula outputs use simplified textbook models.", "Quantum visuals are conceptual unless explicitly numeric."],
    modelClass: "Concept",
    trustLevel: 52,
  },
  Quantum: {
    assumptions: ["Visuals are conceptual representations of quantum quantities.", "Probabilities require normalized models before quantitative interpretation."],
    modelClass: "Research Prototype",
    trustLevel: 42,
  },
};

const idOverrides: Record<string, Partial<ExperimentScientificTrust>> = {
  "projectile-motion": {
    assumptions: ["No air resistance unless the control explicitly enables it.", "Gravity is constant.", "Earth is treated as flat over the trajectory."],
    limitations: ["Not valid for hypersonic speeds or long-range ballistic trajectories."],
    failureConditions: ["Hypersonic speeds", "Long-range paths where curvature matters", "Non-finite launch inputs"],
    modelClass: "Validated Simulation",
    trustLevel: 82,
    confidenceReason: "Uses standard constant-acceleration equations and can be validated against analytic projectile motion.",
  },
  "free-fall": {
    assumptions: ["No air resistance.", "Constant gravitational acceleration.", "Mass does not affect ideal free fall."],
    modelClass: "Validated Simulation",
    trustLevel: 84,
  },
  "newton-s-second-law": {
    assumptions: ["Net force is one-dimensional.", "Mass is positive and constant."],
    modelClass: "Calculator",
    trustLevel: 78,
  },
  "ohms-law": {
    assumptions: ["Material is ohmic.", "Temperature is constant.", "Resistance is positive."],
    modelClass: "Calculator",
    trustLevel: 80,
  },
  "kirchhoff-circuit": {
    limitations: ["Only simple ideal circuits are trustworthy.", "Singular or contradictory ideal sources must be rejected."],
    failureConditions: ["Shorted ideal voltage source", "Open circuit with no return path", "Singular matrix"],
    modelClass: "Research Prototype",
    trustLevel: 45,
  },
  "wave-lab": {
    modelClass: "Visualization",
    trustLevel: 50,
    confidenceReason: "Wave engine is useful visually, but grid units and boundary errors are not yet validated as a quantitative solver.",
  },
  "photoelectric-equation": {
    assumptions: ["Photon energy and work function are expressed in eV.", "Stopping potential reports maximum kinetic energy per electron charge."],
    limitations: ["Photocurrent is qualitative unless a current model is explicitly provided."],
    modelClass: "Calculator",
    trustLevel: 76,
  },
};

export function scientificTrustForExperiment(experiment: Pick<ExperimentDefinition, "id" | "category" | "difficulty">): ExperimentScientificTrust {
  const domain = domainTrust[experiment.category] ?? {};
  const override = idOverrides[experiment.id] ?? {};
  const difficultyPenalty = experiment.difficulty === "Advanced" ? -5 : experiment.difficulty === "Intermediate" ? -2 : 0;
  return {
    ...defaults,
    ...domain,
    ...override,
    assumptions: [...new Set([...(defaults.assumptions), ...(domain.assumptions ?? []), ...(override.assumptions ?? [])])],
    limitations: [...new Set([...(defaults.limitations), ...(domain.limitations ?? []), ...(override.limitations ?? [])])],
    validRanges: [...new Set([...(defaults.validRanges), ...(domain.validRanges ?? []), ...(override.validRanges ?? [])])],
    failureConditions: [...new Set([...(defaults.failureConditions), ...(domain.failureConditions ?? []), ...(override.failureConditions ?? [])])],
    trustLevel: Math.max(0, Math.min(100, (override.trustLevel ?? domain.trustLevel ?? defaults.trustLevel) + difficultyPenalty)),
    confidenceReason: override.confidenceReason ?? domain.confidenceReason ?? defaults.confidenceReason,
  };
}

export function withScientificTrust<T extends ExperimentDefinition>(experiment: T): T {
  return { ...experiment, ...scientificTrustForExperiment(experiment) };
}
