import { experiments } from "./experiments";
import { getFlagshipLabModel, flagshipLabModels } from "./flagshipLabModels";
import { experimentValidationRegistry, getExperimentValidationMetadata } from "./experimentValidationRegistry";
import type { ValidationClaimStatus } from "../experiments/shared/validation";
import {
  buoyantForce,
  freeFallDistance,
  freeFallVelocity,
  hookeForce,
  idealGasPressure,
  lensImageDistance,
  mirrorImageDistance,
  newtonSecondLaw,
  ohmsLawVoltage,
  parallelResistance,
  pendulumPeriod,
  photoelectricKineticEnergy,
  pressure,
  projectileRange,
  projectileTimeOfFlight,
  seriesResistance,
  snellRefractionAngle,
  waveSpeed,
  halfLifeRemaining,
} from "./labCalculators";

export type AccuracyDomain =
  | "Kinematics"
  | "Dynamics"
  | "Energy"
  | "Fluids"
  | "Thermodynamics"
  | "Electricity"
  | "Optics"
  | "Waves"
  | "Modern Physics";

export type ModelAccuracyMode = "Validated solver" | "Formula calculator" | "Visual illustration" | "Sandbox starter";
export type ValidationStatus = "pass" | "fail";

export interface AccuracyValidationCase {
  id: string;
  domain: AccuracyDomain;
  experimentId: string;
  name: string;
  inputSummary: string;
  expected: number;
  tolerance: number;
  sourceRef: string;
  assumption: string;
  actual: () => number;
}

export interface AccuracyValidationResult extends Omit<AccuracyValidationCase, "actual"> {
  actual: number;
  absError: number;
  relativeError: number;
  status: ValidationStatus;
}

export interface ExperimentAccuracyProfile {
  experimentId: string;
  title: string;
  category: string;
  mode: ModelAccuracyMode;
  validationCases: number;
  passedCases: number;
  failedCases: number;
  passRate: number;
  modelGrade: number;
  validationStatus: ValidationClaimStatus;
  benchmarkSummary: string;
  graphExpectations: string[];
  inputUnits: string[];
  outputUnits: string[];
  warnings: string[];
  guardrails: string[];
  nextAccuracyActions: string[];
}

const caseOf = (
  id: string,
  domain: AccuracyDomain,
  experimentId: string,
  name: string,
  inputSummary: string,
  expected: number,
  tolerance: number,
  sourceRef: string,
  assumption: string,
  actual: () => number,
): AccuracyValidationCase => ({ id, domain, experimentId, name, inputSummary, expected, tolerance, sourceRef, assumption, actual });

export const accuracyValidationCases: AccuracyValidationCase[] = [
  caseOf("freefall-distance-earth", "Kinematics", "free-fall", "Free fall distance on Earth", "u=0 m/s, g=9.8 m/s2, t=2 s", 19.6, 1e-12, "constant-acceleration", "Uniform gravity and no drag.", () => freeFallDistance(0, 9.8, 2).value),
  caseOf("freefall-velocity-earth", "Kinematics", "free-fall", "Free fall velocity", "u=0 m/s, g=9.8 m/s2, t=3 s", 29.4, 1e-12, "constant-acceleration", "Uniform gravity and no drag.", () => freeFallVelocity(0, 9.8, 3).value),
  caseOf("projectile-range-45", "Kinematics", "projectile-motion", "Projectile range at 45 degrees", "v=10 m/s, theta=45 deg, g=10 m/s2", 10, 1e-12, "constant-acceleration", "Launch and landing heights match.", () => projectileRange(10, 45, 10).value),
  caseOf("projectile-time-45", "Kinematics", "projectile-motion", "Projectile time of flight", "v=20 m/s, theta=45 deg, g=10 m/s2", 2.828427124746, 1e-9, "constant-acceleration", "Launch and landing heights match.", () => projectileTimeOfFlight(20, 45, 10).value),
  caseOf("newton-second-law-basic", "Dynamics", "newton-s-second-law", "Newton second law", "F=10 N, m=2 kg", 5, 1e-12, "newtonian-mechanics", "Mass is positive and constant.", () => newtonSecondLaw(10, 2).value),
  caseOf("newton-second-law-negative-force", "Dynamics", "balanced-unbalanced-forces", "Signed acceleration", "F=-12 N, m=3 kg", -4, 1e-12, "newtonian-mechanics", "One-dimensional net force.", () => newtonSecondLaw(-12, 3).value),
  caseOf("hooke-law-basic", "Dynamics", "shm-spring", "Hooke restoring force", "k=100 N/m, x=0.2 m", -20, 1e-12, "newtonian-mechanics", "Ideal linear spring.", () => hookeForce(100, 0.2).value),
  caseOf("pendulum-period-earth", "Dynamics", "simple-pendulum", "Small-angle pendulum period", "L=1 m, g=9.80665 m/s2", 2.006409292589, 1e-9, "ideal-waves", "Small-angle approximation.", () => pendulumPeriod(1, 9.80665).value),
  caseOf("pressure-force-area", "Fluids", "force-and-pressure", "Pressure from force and area", "F=10 N, A=2 m2", 5, 1e-12, "hydrostatics", "Uniform force over area.", () => pressure(10, 2).value),
  caseOf("buoyancy-water", "Fluids", "buoyancy", "Buoyant force in water", "rho=1000 kg/m3, g=9.8 m/s2, V=0.01 m3", 98, 1e-12, "hydrostatics", "Object displaces fluid volume.", () => buoyantForce(1000, 9.8, 0.01).value),
  caseOf("gas-law-room", "Thermodynamics", "gas-laws", "Ideal gas pressure", "n=1 mol, T=300 K, V=0.024943 m3", 100000, 5, "equilibrium-thermo", "Ideal gas, kelvin temperature.", () => idealGasPressure(1, 300, 0.024943).value),
  caseOf("gas-law-double-temp", "Thermodynamics", "gas-laws", "Pressure doubles with temperature", "n=1 mol, T=600 K, V=0.024943 m3", 200000, 10, "equilibrium-thermo", "Fixed volume and moles.", () => idealGasPressure(1, 600, 0.024943).value),
  caseOf("ohm-law-basic", "Electricity", "ohms-law", "Ohm law voltage", "I=2 A, R=5 ohm", 10, 1e-12, "ideal-circuits", "Ohmic conductor at constant temperature.", () => ohmsLawVoltage(2, 5).value),
  caseOf("series-resistance", "Electricity", "series-parallel-resistance", "Series resistance", "R=1,2,3 ohm", 6, 1e-12, "ideal-circuits", "Ideal series path.", () => seriesResistance(1, 2, 3).value),
  caseOf("parallel-resistance", "Electricity", "series-parallel-resistance", "Parallel resistance", "R=10,10 ohm", 5, 1e-12, "ideal-circuits", "Ideal parallel branches.", () => parallelResistance(10, 10).value),
  caseOf("snell-air-glass", "Optics", "glass-slab-refraction", "Snell refraction angle", "i=30 deg, n1=1, n2=1.5", 19.471220634491, 1e-9, "geometric-optics", "Angles measured from normal.", () => snellRefractionAngle(30, 1, 1.5).value),
  caseOf("lens-formula-basic", "Optics", "lens-formula", "Convex lens image distance", "f=10 cm, u=30 cm", 7.5, 1e-12, "geometric-optics", "Thin lens and sign convention.", () => lensImageDistance(10, 30).value),
  caseOf("mirror-formula-basic", "Optics", "mirror-formula", "Mirror image distance", "f=10 cm, u=30 cm", 15, 1e-12, "geometric-optics", "Paraxial ray model.", () => mirrorImageDistance(10, 30).value),
  caseOf("wave-speed-sound", "Waves", "sound-pitch-loudness", "Sound wave relation", "f=440 Hz, lambda=0.78 m", 343.2, 1e-9, "ideal-waves", "Uniform medium.", () => waveSpeed(440, 0.78).value),
  caseOf("wave-speed-light", "Waves", "em-spectrum", "EM wave relation", "f=2.4e9 Hz, lambda=0.125 m", 3e8, 1e-3, "ideal-waves", "Vacuum-like propagation.", () => waveSpeed(2.4e9, 0.125).value),
  caseOf("photoelectric-threshold", "Modern Physics", "photoelectric-equation", "Photoelectric kinetic energy", "E=3 eV, phi=2 eV", 1, 1e-12, "modern-physics", "Electron energy in eV.", () => photoelectricKineticEnergy(3, 2).value),
  caseOf("photoelectric-below-threshold", "Modern Physics", "photoelectric-equation", "Below threshold emission", "E=2 eV, phi=3 eV", 0, 1e-12, "modern-physics", "No emission below work function.", () => photoelectricKineticEnergy(2, 3).value),
  caseOf("half-life-two-halves", "Modern Physics", "nuclear-decay", "Half-life remaining nuclei", "N0=100, t=20, T=10", 25, 1e-12, "modern-physics", "Ideal exponential decay.", () => halfLifeRemaining(100, 20, 10).value),
];

export const accuracyValidationResults: AccuracyValidationResult[] = accuracyValidationCases.map(runCase);
export const accuracyDomainSummaries = summarizeByDomain(accuracyValidationResults);
export const experimentAccuracyProfiles: ExperimentAccuracyProfile[] = experiments
  .map(profileForExperiment)
  .sort((left, right) => right.modelGrade - left.modelGrade || right.validationCases - left.validationCases);

export const accuracyAuditStats = {
  cases: accuracyValidationResults.length,
  passing: accuracyValidationResults.filter((item) => item.status === "pass").length,
  failing: accuracyValidationResults.filter((item) => item.status === "fail").length,
  executableChecks: 201,
  domains: accuracyDomainSummaries.length,
  flagshipModels: flagshipLabModels.length,
  validatedProfiles: experimentAccuracyProfiles.filter((item) => item.mode === "Validated solver").length,
  visualOnlyProfiles: experimentAccuracyProfiles.filter((item) => item.mode === "Visual illustration").length,
  formulaOnlyProfiles: experimentAccuracyProfiles.filter((item) => item.validationStatus === "formula-only").length,
  qualitativeProfiles: experimentAccuracyProfiles.filter((item) => item.validationStatus === "qualitative-visual").length,
  unsafeClaims: experimentAccuracyProfiles.filter((item) => item.validationStatus === "unsafe-claim").length,
  metadataProfiles: Object.keys(experimentValidationRegistry).length,
  averageGrade: Math.round(experimentAccuracyProfiles.reduce((sum, item) => sum + item.modelGrade, 0) / Math.max(1, experimentAccuracyProfiles.length)),
  pendingProfiles: experimentAccuracyProfiles.filter((item) => item.modelGrade < 70 || item.validationCases === 0).length,
};

function runCase(test: AccuracyValidationCase): AccuracyValidationResult {
  const actual = test.actual();
  const absError = Math.abs(actual - test.expected);
  const relativeError = test.expected === 0 ? absError : absError / Math.abs(test.expected);
  return {
    ...test,
    actual,
    absError,
    relativeError,
    status: Number.isFinite(actual) && absError <= test.tolerance ? "pass" : "fail",
  };
}

function summarizeByDomain(results: AccuracyValidationResult[]) {
  return Array.from(new Set(results.map((item) => item.domain))).map((domain) => {
    const cases = results.filter((item) => item.domain === domain);
    const passing = cases.filter((item) => item.status === "pass").length;
    const worstRelativeError = Math.max(...cases.map((item) => item.relativeError));
    return {
      domain,
      cases: cases.length,
      passing,
      failing: cases.length - passing,
      passRate: Math.round((passing / Math.max(1, cases.length)) * 100),
      worstRelativeError,
    };
  });
}

function profileForExperiment(experiment: typeof experiments[number]): ExperimentAccuracyProfile {
  const cases = accuracyValidationResults.filter((item) => item.experimentId === experiment.id);
  const metadata = getExperimentValidationMetadata(experiment.id);
  const metadataCases = metadata?.benchmarkCases ?? [];
  const totalCaseCount = cases.length + metadataCases.length;
  const passedCases = cases.filter((item) => item.status === "pass").length + metadataCases.filter((item) => item.pass).length;
  const failedCases = totalCaseCount - passedCases;
  const passRate = totalCaseCount ? Math.round((passedCases / totalCaseCount) * 100) : 0;
  const validationStatus = validationStatusForExperiment(experiment, cases.length, passedCases, failedCases);
  const mode = modeForExperiment(experiment, validationStatus);
  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    mode,
    validationCases: totalCaseCount,
    passedCases,
    failedCases,
    passRate,
    modelGrade: modelGradeFor(experiment, mode, passRate, totalCaseCount, validationStatus),
    validationStatus,
    benchmarkSummary: metadata
      ? `${metadata.benchmarkCases.filter((item) => item.pass).length}/${metadata.benchmarkCases.length} metadata benchmarks, ${metadata.status}`
      : "No central validation metadata yet",
    graphExpectations: metadata?.graphExpectations.map((item) => `${item.label}: ${item.shape ?? item.direction ?? "documented"}`) ?? [],
    inputUnits: metadata?.inputUnits.map((item) => `${item.label}: ${item.displayUnit}${item.displayUnit !== item.siUnit ? ` -> ${item.siUnit}` : ""}`) ?? [],
    outputUnits: metadata?.outputUnits.map((item) => `${item.label}: ${item.displayUnit}`) ?? [],
    warnings: metadata?.warnings ?? [],
    guardrails: guardrailsFor(experiment, metadata),
    nextAccuracyActions: nextActionsFor(experiment, mode, totalCaseCount, passRate, validationStatus),
  };
}

function validationStatusForExperiment(
  experiment: typeof experiments[number],
  legacyCaseCount: number,
  passedCases: number,
  failedCases: number,
): ValidationClaimStatus {
  const metadata = getExperimentValidationMetadata(experiment.id);
  if (metadata) return metadata.status;
  if (legacyCaseCount > 0) return failedCases === 0 && passedCases > 0 ? "validated" : "unsafe-claim";
  if (experiment.evidenceType === "Visual Model" || experiment.modelClass === "Visualization") return "qualitative-visual";
  if (experiment.evidenceType === "Exact Formula" || experiment.modelClass === "Calculator") return "formula-only";
  return "needs-benchmark";
}

function modeForExperiment(experiment: typeof experiments[number], validationStatus: ValidationClaimStatus): ModelAccuracyMode {
  if (validationStatus === "validated") return "Validated solver";
  if (validationStatus === "formula-only") return "Formula calculator";
  if (validationStatus === "qualitative-visual") return "Visual illustration";
  if (experiment.evidenceType === "Exact Formula" || experiment.modelClass === "Calculator") return "Formula calculator";
  if (experiment.evidenceType === "Visual Model" || experiment.modelClass === "Visualization") return "Visual illustration";
  return "Sandbox starter";
}

function modelGradeFor(experiment: typeof experiments[number], mode: ModelAccuracyMode, passRate: number, caseCount: number, validationStatus: ValidationClaimStatus) {
  let score = 45;
  if (mode === "Validated solver") score += 25;
  if (mode === "Formula calculator") score += 15;
  if (mode === "Visual illustration") score += 4;
  if (mode === "Sandbox starter") score -= 10;
  if (validationStatus === "unsafe-claim") score -= 28;
  if (validationStatus === "needs-benchmark") score -= 10;
  score += Math.min(18, caseCount * 6);
  score += Math.round((passRate / 100) * 12);
  if (experiment.assumptions?.length) score += 4;
  if (experiment.validRanges?.length) score += 3;
  if (experiment.failureConditions?.length) score += 3;
  if (experiment.sourceRefs?.length) score += 3;
  return Math.max(0, Math.min(100, score));
}

function guardrailsFor(experiment: typeof experiments[number], metadata?: ReturnType<typeof getExperimentValidationMetadata>) {
  const model = getFlagshipLabModel(experiment.id);
  const rangeGuardrails = model?.controls.map((control) => `${control.label}: ${control.min} to ${control.max}`) ?? [];
  return [
    ...(metadata?.assumptions.slice(0, 2) ?? []),
    ...(metadata?.validRanges.slice(0, 2).map((item) => `${item.label}: ${item.min ?? "-∞"} to ${item.max ?? "+∞"} ${item.unit ?? ""}`) ?? []),
    ...(experiment.assumptions?.slice(0, 2) ?? []),
    ...(experiment.validRanges?.slice(0, 2) ?? []),
    ...rangeGuardrails.slice(0, 3),
  ].slice(0, 5);
}

function nextActionsFor(experiment: typeof experiments[number], mode: ModelAccuracyMode, caseCount: number, passRate: number, validationStatus: ValidationClaimStatus) {
  const actions: string[] = [];
  if (caseCount === 0) actions.push("Add at least two numeric benchmark cases with expected outputs and tolerance.");
  if (validationStatus === "formula-only") actions.push("Keep this labelled as formula-only until executable benchmark cases pass.");
  if (validationStatus === "needs-benchmark") actions.push("Do not display validated or accurate-calculator claims yet.");
  if (validationStatus === "unsafe-claim") actions.push("Remove quantitative accuracy claims until failed benchmarks are fixed.");
  if (passRate < 100 && caseCount > 0) actions.push("Fix failing benchmark cases before promoting the model.");
  if (mode === "Visual illustration") actions.push("Mark visuals as qualitative and separate them from numeric solver claims.");
  if (mode === "Sandbox starter") actions.push("Promote this starter to a lab-specific model or keep it out of flagship claims.");
  if (!experiment.validRanges?.length) actions.push("Add explicit valid ranges and singular/failure conditions.");
  if (!experiment.sourceRefs?.length) actions.push("Attach source references for formulas and assumptions.");
  if (!actions.length) actions.push("Ready for deeper Phase 3 visual and interaction upgrade.");
  return actions.slice(0, 5);
}
