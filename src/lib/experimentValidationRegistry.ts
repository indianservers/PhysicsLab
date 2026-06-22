import { circularMotionBenchmarks } from "../experiments/circular-motion/circular-motionSimulation";
import { elasticCollisionBenchmarks } from "../experiments/elastic-collision/elastic-collisionSimulation";
import { frictionBenchmarks } from "../experiments/friction/frictionSimulation";
import { hookesLawBenchmarks } from "../experiments/hooke-s-law/hooke-s-lawSimulation";
import { inclinedPlaneBenchmarks } from "../experiments/inclined-plane/inclined-planeSimulation";
import { chladniBenchmarks } from "../experiments/chladni-plate/chladni-plateSimulation";
import { singleSlitBenchmarks } from "../experiments/single-slit-diffraction/single-slit-diffractionSimulation";
import { uniformMotionBenchmarks } from "../experiments/uniform-motion/uniform-motionSimulation";
import { runBenchmarkCases, statusForBenchmarks, type ExperimentValidationMetadata, type ValidationClaimStatus } from "../experiments/shared/validation";
import { waveLabBenchmarks } from "../experiments/wave-lab/wave-labSimulation";

const si = (id: string, label: string, displayUnit: string, siUnit = displayUnit) => ({ id, label, displayUnit, siUnit });

const newtonBenchmarks = runBenchmarkCases([
  { id: "newton-fma-basic", name: "F=ma", input: { force: 10, mass: 2 }, expected: 5, unit: "m/s^2", tolerance: 1e-12, actual: (input) => input.force / input.mass },
  { id: "newton-negative-force", name: "Signed acceleration", input: { force: -12, mass: 3 }, expected: -4, unit: "m/s^2", tolerance: 1e-12, actual: (input) => input.force / input.mass },
]);

const energyBenchmarks = runBenchmarkCases([
  { id: "energy-conserved-drop", name: "Potential converts to kinetic", input: { mass: 2, g: 9.8, height: 5 }, expected: 98, unit: "J", tolerance: 1e-12, actual: (input) => input.mass * input.g * input.height },
  { id: "energy-speed-check", name: "Speed from drop height", input: { mass: 1, g: 9.8, height: 5 }, expected: Math.sqrt(98), unit: "m/s", tolerance: 1e-12, actual: (input) => Math.sqrt(2 * input.g * input.height) },
]);

export const experimentValidationRegistry: Record<string, ExperimentValidationMetadata> = {
  "uniform-motion": {
    experimentId: "uniform-motion",
    formulaName: "Uniform motion",
    formula: "x = x0 + vt",
    status: statusForBenchmarks(uniformMotionBenchmarks),
    assumptions: ["Velocity is constant.", "Motion is one-dimensional.", "Position is signed."],
    inputUnits: [si("x0", "Initial position", "m"), si("velocity", "Velocity", "m/s"), si("time", "Time", "s")],
    outputUnits: [si("x", "Final position", "m"), si("slope", "Graph slope", "m/s")],
    validRanges: [{ id: "time", label: "Time", min: 0, unit: "s" }],
    benchmarkCases: uniformMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "distance-time", label: "Distance-time", xLabel: "time", yLabel: "position", shape: "linear" }, { id: "velocity-time", label: "Velocity-time", xLabel: "time", yLabel: "velocity", shape: "constant" }],
    warnings: ["Negative velocity is allowed; negative time is not."],
  },
  friction: {
    experimentId: "friction",
    formulaName: "Kinetic friction",
    formula: "f = mu N, N = mg",
    status: statusForBenchmarks(frictionBenchmarks),
    assumptions: ["Flat surface.", "Friction opposes motion.", "Classroom static/kinetic threshold approximation."],
    inputUnits: [si("mass", "Mass", "kg"), si("gravity", "Gravity", "m/s^2"), si("mu", "Coefficient", "unitless"), si("appliedForce", "Applied force", "N")],
    outputUnits: [si("normalForce", "Normal force", "N"), si("frictionForce", "Friction force", "N"), si("acceleration", "Acceleration", "m/s^2")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg", warning: "Mass must be positive." }, { id: "mu", label: "Coefficient", min: 0 }],
    benchmarkCases: frictionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "friction-normal", label: "f vs N", xLabel: "normal force", yLabel: "friction", shape: "linear" }],
    warnings: ["No negative mass; no negative coefficient."],
  },
  "inclined-plane": {
    experimentId: "inclined-plane",
    formulaName: "Incline acceleration",
    formula: "a = max(0, g(sin(theta) - mu cos(theta)))",
    status: statusForBenchmarks(inclinedPlaneBenchmarks),
    assumptions: ["Rigid plane.", "Friction acts up plane.", "Acceleration is clamped when friction holds the block."],
    inputUnits: [si("angle", "Angle", "deg", "rad"), si("mass", "Mass", "kg"), si("mu", "Coefficient", "unitless"), si("gravity", "Gravity", "m/s^2")],
    outputUnits: [si("parallelWeight", "Parallel weight", "N"), si("normalForce", "Normal force", "N"), si("acceleration", "Acceleration", "m/s^2")],
    validRanges: [{ id: "angle", label: "Angle", min: 0, max: 80, unit: "deg", warning: "Angles beyond classroom scope need warning." }, { id: "mass", label: "Mass", min: 0, unit: "kg" }],
    benchmarkCases: inclinedPlaneBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "angle-acceleration", label: "Angle vs acceleration", xLabel: "angle", yLabel: "acceleration", direction: "increasing" }],
    warnings: ["Flat plane must not accelerate down plane."],
  },
  "elastic-collision": {
    experimentId: "elastic-collision",
    formulaName: "1D elastic collision",
    formula: "v1=((m1-m2)/(m1+m2))u1 + (2m2/(m1+m2))u2",
    status: statusForBenchmarks(elasticCollisionBenchmarks),
    assumptions: ["One-dimensional collision.", "Perfectly elastic.", "No external impulse during collision."],
    inputUnits: [si("m1", "Mass 1", "kg"), si("m2", "Mass 2", "kg"), si("u1", "Initial velocity 1", "m/s"), si("u2", "Initial velocity 2", "m/s")],
    outputUnits: [si("v1", "Final velocity 1", "m/s"), si("v2", "Final velocity 2", "m/s"), si("energy", "Kinetic energy", "J")],
    validRanges: [{ id: "m1", label: "Mass 1", min: 0, unit: "kg" }, { id: "m2", label: "Mass 2", min: 0, unit: "kg" }],
    benchmarkCases: elasticCollisionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "energy-before-after", label: "Energy before/after", xLabel: "state", yLabel: "energy", shape: "constant" }],
    warnings: ["Mass sum cannot be zero."],
  },
  "hooke-s-law": {
    experimentId: "hooke-s-law",
    formulaName: "Hooke's law",
    formula: "F = -kx, U = 1/2 kx^2",
    status: statusForBenchmarks(hookesLawBenchmarks),
    assumptions: ["Spring remains elastic.", "Extension measured from equilibrium."],
    inputUnits: [si("k", "Spring constant", "N/m"), si("x", "Extension", "m"), si("mass", "Attached mass", "kg")],
    outputUnits: [si("force", "Restoring force", "N"), si("energy", "Elastic potential energy", "J")],
    validRanges: [{ id: "k", label: "Spring constant", min: 0, unit: "N/m" }],
    benchmarkCases: hookesLawBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "force-extension", label: "F-x graph", xLabel: "extension", yLabel: "force", shape: "linear" }],
    warnings: ["Do not claim linearity beyond elastic limit."],
  },
  "circular-motion": {
    experimentId: "circular-motion",
    formulaName: "Centripetal force",
    formula: "Fc = m r omega^2",
    status: statusForBenchmarks(circularMotionBenchmarks),
    assumptions: ["Uniform circular motion.", "Centripetal force points inward."],
    inputUnits: [si("mass", "Mass", "kg"), si("radius", "Radius", "m"), si("omega", "Angular speed", "rad/s")],
    outputUnits: [si("force", "Centripetal force", "N"), si("speed", "Tangential speed", "m/s"), si("period", "Period", "s")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg" }, { id: "radius", label: "Radius", min: 0, unit: "m" }, { id: "omega", label: "Angular speed", min: 0, unit: "rad/s" }],
    benchmarkCases: circularMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "force-omega", label: "Fc vs omega", xLabel: "angular speed", yLabel: "force", shape: "quadratic" }],
    warnings: ["Radius and angular speed must be positive for period and force outputs."],
  },
  "single-slit-diffraction": {
    experimentId: "single-slit-diffraction",
    formulaName: "Single slit minima",
    formula: "a sin(theta) = m lambda; y_m approx m lambda D / a",
    status: statusForBenchmarks(singleSlitBenchmarks),
    assumptions: ["Small-angle approximation for screen position.", "Classroom Fraunhofer scalar model."],
    inputUnits: [si("wavelengthNm", "Wavelength", "nm", "m"), si("slitWidthMm", "Slit width", "mm", "m"), si("screenDistanceM", "Screen distance", "m"), si("order", "Order", "integer")],
    outputUnits: [si("firstMinimaPosition", "First minima position", "m"), si("centralMaximumWidth", "Central maximum width", "m")],
    validRanges: [{ id: "wavelengthNm", label: "Wavelength", min: 1, unit: "nm" }, { id: "slitWidthMm", label: "Slit width", min: 0, unit: "mm" }],
    benchmarkCases: singleSlitBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [{ id: "central-width-slit", label: "Width vs slit width", xLabel: "slit width", yLabel: "central width", direction: "decreasing" }],
    warnings: ["Never mix nm/mm/m without explicit conversion labels."],
  },
  "chladni-plate": {
    experimentId: "chladni-plate",
    formulaName: "Qualitative standing wave mode",
    formula: "z = A sin(n pi x/L) sin(m pi y/L) cos(omega t)",
    status: "qualitative-visual",
    assumptions: ["School-level qualitative mode model.", "Not a finite-element plate solver."],
    inputUnits: [si("modeN", "Mode n", "integer"), si("modeM", "Mode m", "integer"), si("frequency", "Frequency", "Hz")],
    outputUnits: [si("nodeLineCount", "Node line count", "relative"), si("complexity", "Pattern complexity", "relative")],
    validRanges: [{ id: "modeN", label: "Mode n", min: 1 }, { id: "modeM", label: "Mode m", min: 1 }],
    benchmarkCases: chladniBenchmarks,
    tolerance: 0,
    graphExpectations: [{ id: "mode-complexity", label: "Mode number vs node lines", xLabel: "mode", yLabel: "node lines", direction: "increasing" }],
    warnings: ["Qualitative visual model only; no exact plate physics claim."],
  },
  "newton-s-second-law": {
    experimentId: "newton-s-second-law",
    formulaName: "Newton's second law",
    formula: "F = ma",
    status: statusForBenchmarks(newtonBenchmarks),
    assumptions: ["Net force is known.", "Mass is positive and constant.", "One-dimensional model."],
    inputUnits: [si("force", "Net force", "N"), si("mass", "Mass", "kg")],
    outputUnits: [si("acceleration", "Acceleration", "m/s^2")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg" }],
    benchmarkCases: newtonBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [{ id: "force-acceleration", label: "Force vs acceleration", xLabel: "force", yLabel: "acceleration", shape: "linear" }],
    warnings: ["Mass cannot be zero."],
  },
  "conservation-of-energy": {
    experimentId: "conservation-of-energy",
    formulaName: "Mechanical energy conservation",
    formula: "KE + PE = constant",
    status: statusForBenchmarks(energyBenchmarks),
    assumptions: ["No non-conservative work.", "Uniform gravity.", "Closed mechanical system."],
    inputUnits: [si("mass", "Mass", "kg"), si("height", "Height", "m"), si("g", "Gravity", "m/s^2")],
    outputUnits: [si("energy", "Energy", "J"), si("speed", "Speed", "m/s")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg" }, { id: "height", label: "Height", min: 0, unit: "m" }],
    benchmarkCases: energyBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "energy-total", label: "Total energy", xLabel: "time", yLabel: "energy", shape: "constant" }],
    warnings: ["Energy changes if friction or drag is enabled."],
  },
  "wave-lab": {
    experimentId: "wave-lab",
    formulaName: "Wave relation and interference",
    formula: "v = f lambda; constructive delta r = m lambda; destructive delta r = (m+1/2) lambda",
    status: statusForBenchmarks(waveLabBenchmarks),
    assumptions: ["Two coherent point sources.", "Relative classroom amplitude model."],
    inputUnits: [si("frequency", "Frequency", "Hz"), si("speed", "Speed", "m/s"), si("sourceSeparation", "Separation", "m"), si("phaseDeg", "Phase", "deg", "rad")],
    outputUnits: [si("wavelength", "Wavelength", "m"), si("pathDifference", "Path difference", "m"), si("detectorAmplitude", "Detector amplitude", "relative")],
    validRanges: [{ id: "frequency", label: "Frequency", min: 0, unit: "Hz" }, { id: "speed", label: "Speed", min: 0, unit: "m/s" }],
    benchmarkCases: waveLabBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "frequency-wavelength", label: "Frequency vs wavelength", xLabel: "frequency", yLabel: "wavelength", direction: "decreasing" }],
    warnings: ["Frequency and speed must be positive."],
  },
};

export function getExperimentValidationMetadata(experimentId: string) {
  return experimentValidationRegistry[experimentId];
}

export function validationStatusForExperiment(experimentId: string) {
  return getExperimentValidationMetadata(experimentId)?.status ?? "needs-benchmark";
}

type ExperimentValidationSummary = Record<ValidationClaimStatus, number> & {
  total: number;
  failed: number;
  warnings: number;
};

const emptyExperimentValidationSummary: ExperimentValidationSummary = {
  total: 0,
  validated: 0,
  "formula-only": 0,
  "qualitative-visual": 0,
  "needs-benchmark": 0,
  "unsafe-claim": 0,
  failed: 0,
  warnings: 0,
};

export const experimentValidationSummary = Object.values(experimentValidationRegistry).reduce<ExperimentValidationSummary>(
  (summary, item) => {
    summary.total += 1;
    summary[item.status] += 1;
    if (item.benchmarkCases.some((benchmark) => !benchmark.pass)) summary.failed += 1;
    if (item.warnings.length) summary.warnings += item.warnings.length;
    return summary;
  },
  { ...emptyExperimentValidationSummary },
);
