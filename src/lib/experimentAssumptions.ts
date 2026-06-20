import { ExperimentDefinition, ExperimentMaturityLevel, ModelEvidenceType, SimulationModelClass } from "../types";

export interface ExperimentScientificTrust {
  assumptions: string[];
  limitations: string[];
  validRanges: string[];
  failureConditions: string[];
  modelClass: SimulationModelClass;
  trustLevel: number;
  confidenceReason: string;
  evidenceType: ModelEvidenceType;
  maturityLevel: ExperimentMaturityLevel;
  sourceRefs: string[];
  validationStatus: string;
}

const defaults: ExperimentScientificTrust = {
  assumptions: ["SI units are used unless a control explicitly says otherwise.", "Textbook calculator outputs are exact for the stated ideal assumptions."],
  limitations: ["Real instrument uncertainty, losses, and non-ideal material behavior may be omitted in simplified labs."],
  validRanges: ["Use finite positive physical inputs.", "Stay inside the slider ranges shown by the lab."],
  failureConditions: ["Invalid, singular, negative, or zero-denominator inputs make the result untrusted."],
  modelClass: "Calculator",
  trustLevel: 100,
  confidenceReason: "Formula result is computed directly from a standard textbook equation and is 100% reliable inside the stated ideal assumptions and valid input range.",
  evidenceType: "Exact Formula",
  maturityLevel: "Validated",
  sourceRefs: ["ncert-school-physics", "physicslab-local-validation"],
  validationStatus: "Formula smoke-tested against analytic reference values; classroom outcome research is not claimed.",
};

const domainTrust: Record<string, Partial<ExperimentScientificTrust>> = {
  Mechanics: {
    assumptions: ["Rigid bodies are approximated as point masses or simple shapes.", "Gravity is uniform over the workspace.", "Canvas coordinates are converted to SI only where stated."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Mechanics outputs use closed-form textbook equations or validated one-dimensional relationships, so numeric values are exact inside the displayed assumptions.",
    sourceRefs: ["constant-acceleration", "newtonian-mechanics"],
  },
  "Fluid Mechanics": {
    assumptions: ["Fluids are incompressible unless stated.", "Buoyancy uses Archimedes' principle.", "Viscous and turbulent losses are simplified."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Fluid outputs use standard hydrostatics and Archimedes-law formulas and are exact for ideal incompressible-fluid assumptions.",
    sourceRefs: ["hydrostatics"],
  },
  Thermodynamics: {
    assumptions: ["Systems are treated as equilibrium or quasi-equilibrium states.", "Specific heat and material properties are constant over the selected range."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Thermal outputs use standard equilibrium formula calculators and are exact for the stated ideal material assumptions.",
    sourceRefs: ["equilibrium-thermo"],
  },
  Electricity: {
    assumptions: ["Components are ideal unless explicitly modeled.", "Ohmic relationships assume constant temperature."],
    limitations: ["Circuit visuals are not SPICE-grade simulation.", "Ideal meters and switches can create invalid circuits if connected unrealistically."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Electrical outputs are computed from ideal textbook circuit formulas and are 100% reliable for the stated ideal component assumptions.",
    sourceRefs: ["ideal-circuits"],
  },
  Magnetism: {
    assumptions: ["Fields use ideal wire, coil, or uniform-field approximations.", "Direction rules are educational diagrams."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Magnetic formula outputs use idealized textbook field relationships; field-line drawings remain illustrative while displayed numeric formulas are exact within assumptions.",
    evidenceType: "Educational Approximation",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-circuits", "newtonian-mechanics"],
  },
  Optics: {
    assumptions: ["Rays are geometric optics rays.", "Angles are measured from the normal.", "Paraxial approximations may apply."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Optics outputs use standard ray-optics equations and are exact for paraxial or geometric-optics assumptions shown in the lab.",
    sourceRefs: ["geometric-optics"],
  },
  Waves: {
    assumptions: ["Wave media are idealized.", "Interference visuals are qualitative unless a formula output is shown."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Wave and oscillation formula outputs use standard textbook relationships and are exact for ideal media and small-angle assumptions where stated.",
    evidenceType: "Educational Approximation",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-waves"],
  },
  "Modern Physics": {
    assumptions: ["Formula outputs use simplified textbook models.", "Quantum visuals are conceptual unless explicitly numeric."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Modern-physics formula outputs use standard textbook models and constants; conceptual animations are separate from the numeric result.",
    sourceRefs: ["modern-physics", "physicslab-local-validation"],
  },
  Quantum: {
    assumptions: ["Visuals are conceptual representations of quantum quantities.", "Probabilities require normalized models before quantitative interpretation."],
    modelClass: "Visualization",
    trustLevel: 88,
    confidenceReason: "Quantum visuals are educational metaphors unless a normalized calculator is present; numeric formula outputs remain bounded by the stated assumptions.",
    evidenceType: "Visual Model",
    maturityLevel: "Starter",
    sourceRefs: ["modern-physics"],
    validationStatus: "Visual model only unless an explicit numeric formula is displayed.",
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
    evidenceType: "Exact Formula",
    maturityLevel: "Flagship",
    sourceRefs: ["constant-acceleration", "physicslab-local-validation"],
    validationStatus: "Validated against analytic range and trajectory calculations in the local physics test suite.",
  },
  "free-fall": {
    assumptions: ["No air resistance.", "Constant gravitational acceleration.", "Mass does not affect ideal free fall."],
    modelClass: "Validated Simulation",
    trustLevel: 100,
    confidenceReason: "Free-fall values are computed from the exact constant-acceleration equations for uniform gravity and no air resistance.",
    maturityLevel: "Flagship",
    sourceRefs: ["constant-acceleration", "physicslab-local-validation"],
    validationStatus: "Validated against analytic free-fall distance and velocity calculations.",
  },
  "newton-s-second-law": {
    assumptions: ["Net force is one-dimensional.", "Mass is positive and constant."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Newton's second law is evaluated directly as F = ma or a = F/m for finite positive mass.",
    maturityLevel: "Flagship",
    sourceRefs: ["newtonian-mechanics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with force, mass, friction, and graph-guided measurement plan.",
  },
  "conservation-of-energy": {
    assumptions: ["Mechanical energy is tracked between gravitational potential energy and kinetic energy.", "Losses are represented as a single fractional energy loss."],
    limitations: ["Rotational kinetic energy, track friction profile, and air resistance are not separately modeled."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Energy outputs are evaluated directly from mgh, 1/2mv^2, and an explicit loss fraction inside the displayed range.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["newtonian-mechanics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with prediction prompt, measurement plan, and graph presets.",
  },
  "simple-pendulum": {
    assumptions: ["Small-angle oscillations.", "Mass does not affect the ideal period.", "Gravity is fixed at 9.81 m/s^2 in the calculator."],
    limitations: ["Large-angle corrections, pivot friction, string mass, and air drag are outside the model."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Pendulum period is computed directly from the standard small-angle equation T = 2pi sqrt(L/g).",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-waves", "newtonian-mechanics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for small-angle oscillation measurements.",
  },
  "ohms-law": {
    assumptions: ["Material is ohmic.", "Temperature is constant.", "Resistance is positive."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Ohm's law is evaluated directly for ideal ohmic components with positive resistance.",
    maturityLevel: "Flagship",
    sourceRefs: ["ideal-circuits", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with V-I graph plan and internal-resistance extension.",
  },
  "buoyancy": {
    assumptions: ["Buoyant force equals weight of displaced fluid.", "Fluid density is uniform.", "Object volume is fully available for displacement."],
    limitations: ["Shape stability, surface tension, viscosity, and fluid motion are not modeled."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Buoyant force, object weight, and submerged fraction are calculated from Archimedes' principle for ideal static fluids.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["hydrostatics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for density comparison and Archimedes-law measurements.",
  },
  "gas-laws": {
    assumptions: ["Gas follows the ideal gas equation.", "Temperature is absolute temperature in kelvin.", "The gas amount is fixed unless the moles slider is changed."],
    limitations: ["High-pressure, low-temperature, and non-ideal gas effects are outside the model."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Pressure and PV/T are computed directly from PV = nRT for finite positive inputs.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["equilibrium-thermo", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for Boyle, Charles, and ideal-gas comparisons.",
  },
  "young-double-slit": {
    assumptions: ["Light is coherent.", "Small-angle approximation is valid.", "Slit separation is much larger than wavelength."],
    limitations: ["Single-slit envelope, finite slit width, alignment error, and intensity falloff are not fully modeled."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Fringe width is computed directly from beta = lambda D / d for ideal double-slit interference.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-waves", "geometric-optics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for wave-optics fringe measurement.",
  },
  "kirchhoff-circuit": {
    limitations: ["Only simple ideal circuits are trustworthy.", "Singular or contradictory ideal sources must be rejected."],
    failureConditions: ["Shorted ideal voltage source", "Open circuit with no return path", "Singular matrix"],
    modelClass: "Calculator",
    trustLevel: 96,
    confidenceReason: "Kirchhoff calculations are reliable for well-posed ideal circuits; the score is lower than 100 only because invalid ideal-source topologies must be rejected.",
    evidenceType: "Educational Approximation",
    maturityLevel: "Validated",
  },
  "wave-lab": {
    modelClass: "Visualization",
    trustLevel: 86,
    confidenceReason: "Wave motion is a visual teaching model; use the displayed textbook formulas for exact numeric work.",
    evidenceType: "Visual Model",
    maturityLevel: "Starter",
    validationStatus: "Visual teaching model; numeric wave relations are formula-based.",
  },
  "photoelectric-equation": {
    assumptions: ["Photon energy and work function are expressed in eV.", "Stopping potential reports maximum kinetic energy per electron charge."],
    limitations: ["Photocurrent is qualitative unless a current model is explicitly provided."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Photoelectric energy and stopping-potential values are calculated directly from Einstein's photoelectric equation for the stated ideal assumptions.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["modern-physics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with threshold, stopping-potential, and intensity misconception checks.",
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
    evidenceType: override.evidenceType ?? domain.evidenceType ?? defaults.evidenceType,
    maturityLevel: override.maturityLevel ?? domain.maturityLevel ?? defaults.maturityLevel,
    sourceRefs: [...new Set([...(defaults.sourceRefs), ...(domain.sourceRefs ?? []), ...(override.sourceRefs ?? [])])],
    validationStatus: override.validationStatus ?? domain.validationStatus ?? defaults.validationStatus,
  };
}

export function withScientificTrust<T extends ExperimentDefinition>(experiment: T): T {
  const trust = scientificTrustForExperiment(experiment);
  const isStarterTemplate = experiment.theory.toLowerCase().includes("starter experiment uses the common lab workspace");
  if (!isStarterTemplate) return { ...experiment, ...trust };
  return {
    ...experiment,
    ...trust,
    modelClass: "Concept",
    trustLevel: Math.min(trust.trustLevel, 74),
    evidenceType: "Sandbox Only",
    maturityLevel: "Starter",
    sourceRefs: [...new Set([...trust.sourceRefs, "PhysicsLab starter experiment template"])],
    validationStatus: "Starter workspace; requires lab-specific model promotion before classroom-ready use.",
    confidenceReason: "This is a starter workspace entry. Use it for guided exploration, but do not treat its generic setup as a validated lab-specific simulation yet.",
  };
}
