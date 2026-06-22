import type { PhysicsVisualDomain } from "./domainVisualContracts";
import type { ValidationClaimStatus } from "./validation";
import { buoyantForce, bernoulliPressure, continuitySpeed, floatingFraction, objectWeight } from "./fluidMath";
import { criticalAngleDeg, lensPower, mirrorReflectionAngle, planeMirrorImageDistance, prismDeviation, thinLensImageDistance, thinLensMagnification } from "./opticsMath";
import { idealGasPressure, particleSpeedScale } from "./thermoMath";

export type PremiumOftId = "reflection-plane-mirror" | "lens-formula" | "prism-dispersion" | "total-internal-reflection" | "human-eye-defects" | "buoyancy" | "bernoulli-fluid-flow" | "gas-laws";

export interface OftControl { id: string; label: string; unit: string; min: number; max: number; step: number }
export interface OftPreset { id: string; label: string; description: string; values: Record<string, number> }
export interface PremiumOftConfig {
  id: PremiumOftId;
  title: string;
  subtitle: string;
  domain: PhysicsVisualDomain;
  modelStatus: ValidationClaimStatus;
  formulae: string[];
  controls: OftControl[];
  defaults: Record<string, number>;
  presets: OftPreset[];
  prediction: string;
  misconception: string;
  correction: string;
  teacherAnalogy: string;
  benchmarkText: string[];
}
export interface PremiumOftResult {
  outputs: { label: string; value: string; unit?: string }[];
  cause: string;
  effect: string;
  because: string;
  warning: string;
  strength: number;
  raw: Record<string, number | string>;
}

const presets = (beginner: Record<string, number>, misconception: Record<string, number>, real: Record<string, number>): OftPreset[] => [
  { id: "beginner-demo", label: "Beginner demo", description: "One obvious variable change for first observation.", values: beginner },
  { id: "misconception-demo", label: "Misconception demo", description: "Setup that exposes the common wrong idea.", values: misconception },
  { id: "real-world-demo", label: "Real-world demo", description: "Classroom-scale realistic values.", values: real },
];

export const premiumOftConfigs: Record<PremiumOftId, PremiumOftConfig> = {
  "reflection-plane-mirror": {
    id: "reflection-plane-mirror", title: "Premium Plane Mirror Reflection", subtitle: "Measure incidence from the normal and watch the reflected ray mirror it exactly.", domain: "optics", modelStatus: "validated", formulae: ["i = r"],
    controls: [{ id: "angle", label: "Incident angle from normal", unit: "deg", min: 0, max: 75, step: 1 }, { id: "distance", label: "Object distance", unit: "cm", min: 5, max: 80, step: 1 }],
    defaults: { angle: 30, distance: 30 }, presets: presets({ angle: 20, distance: 25 }, { angle: 60, distance: 35 }, { angle: 35, distance: 45 }),
    prediction: "Where is the reflected ray measured from?", misconception: "Angles are measured from the mirror surface.", correction: "Angles are measured from the normal line.", teacherAnalogy: "The normal is the referee line for both rays.", benchmarkText: ["Incidence 30 deg gives reflection 30 deg.", "Image distance equals object distance."],
  },
  "lens-formula": {
    id: "lens-formula", title: "Premium Lens Formula Ray Bench", subtitle: "Drag object distance and focal length to form real or virtual images with sign convention visible.", domain: "optics", modelStatus: "validated", formulae: ["1/f = 1/v + 1/u (classroom magnitude form)"],
    controls: [{ id: "objectDistance", label: "Object distance", unit: "cm", min: 5, max: 120, step: 1 }, { id: "focalLength", label: "Focal length", unit: "cm", min: 5, max: 60, step: 1 }],
    defaults: { objectDistance: 40, focalLength: 15 }, presets: presets({ objectDistance: 50, focalLength: 15 }, { objectDistance: 12, focalLength: 20 }, { objectDistance: 80, focalLength: 20 }),
    prediction: "What happens when the object moves inside the focal length?", misconception: "A convex lens always forms a real image.", correction: "Inside focal length gives a virtual upright image.", teacherAnalogy: "Focal length is the lens's turning strength.", benchmarkText: ["Existing thin-lens benchmark preserved.", "Inside focal length gives virtual image."],
  },
  "prism-dispersion": {
    id: "prism-dispersion", title: "Premium Prism Dispersion", subtitle: "Split a white beam into labeled red-through-violet rays and compare deviation.", domain: "optics", modelStatus: "formula-only", formulae: ["deviation approx (n - 1) A"],
    controls: [{ id: "angle", label: "Prism angle", unit: "deg", min: 20, max: 70, step: 1 }, { id: "index", label: "Refractive index", unit: "", min: 1.3, max: 1.8, step: 0.01 }, { id: "dispersion", label: "Dispersion strength", unit: "", min: 0, max: 1, step: 0.05 }],
    defaults: { angle: 45, index: 1.5, dispersion: 0.5 }, presets: presets({ angle: 35, index: 1.45, dispersion: 0.3 }, { angle: 65, index: 1.7, dispersion: 1 }, { angle: 50, index: 1.52, dispersion: 0.6 }),
    prediction: "Which color bends more in dispersion mode?", misconception: "All colors bend equally.", correction: "Violet bends more than red in normal dispersion.", teacherAnalogy: "The prism is a color sorting ramp.", benchmarkText: ["Larger index/prism angle increases deviation.", "Violet bends more than red when dispersion is enabled."],
  },
  "total-internal-reflection": {
    id: "total-internal-reflection", title: "Premium Total Internal Reflection", subtitle: "Cross the critical angle and watch the refracted ray disappear into reflected-only behavior.", domain: "optics", modelStatus: "validated", formulae: ["sin C = n2 / n1"],
    controls: [{ id: "n1", label: "Denser medium n1", unit: "", min: 1, max: 2, step: 0.01 }, { id: "n2", label: "Rarer medium n2", unit: "", min: 1, max: 1.8, step: 0.01 }, { id: "angle", label: "Incidence angle", unit: "deg", min: 0, max: 85, step: 1 }],
    defaults: { n1: 1.5, n2: 1, angle: 50 }, presets: presets({ n1: 1.5, n2: 1, angle: 30 }, { n1: 1, n2: 1.5, angle: 60 }, { n1: 1.5, n2: 1, angle: 55 }),
    prediction: "Can TIR happen from rarer to denser medium?", misconception: "TIR can happen from rarer to denser medium.", correction: "TIR needs light going from denser to rarer medium.", teacherAnalogy: "Past critical angle, the boundary acts like a perfect mirror.", benchmarkText: ["n1=1.5,n2=1 gives C approx 41.8 deg.", "TIR only from denser to rarer medium."],
  },
  "human-eye-defects": {
    id: "human-eye-defects", title: "Premium Human Eye Defects", subtitle: "See focus before, on, or behind the retina and apply the opposite corrective lens.", domain: "optics", modelStatus: "qualitative-visual", formulae: ["P = 1/f"],
    controls: [{ id: "defect", label: "0 normal / 1 myopia / 2 hypermetropia", unit: "", min: 0, max: 2, step: 1 }, { id: "correction", label: "Correction lens power", unit: "D", min: -6, max: 6, step: 0.5 }],
    defaults: { defect: 1, correction: -2 }, presets: presets({ defect: 0, correction: 0 }, { defect: 1, correction: 2 }, { defect: 2, correction: 2 }),
    prediction: "Which correction helps myopia?", misconception: "Myopia and hypermetropia use the same correction.", correction: "Myopia uses diverging lens; hypermetropia uses converging lens.", teacherAnalogy: "Correction moves the focus back onto the retina.", benchmarkText: ["Myopia correction should be diverging.", "Hypermetropia correction should be converging."],
  },
  buoyancy: {
    id: "buoyancy", title: "Premium Buoyancy Tank", subtitle: "Change densities and volume to see floating fraction, displaced water, upthrust, and weight.", domain: "fluids", modelStatus: "validated", formulae: ["Fb = rho fluid g V displaced"],
    controls: [{ id: "objectDensity", label: "Object density", unit: "kg/m3", min: 100, max: 2000, step: 10 }, { id: "fluidDensity", label: "Fluid density", unit: "kg/m3", min: 500, max: 1400, step: 10 }, { id: "volume", label: "Object volume", unit: "m3", min: 0.01, max: 0.2, step: 0.01 }],
    defaults: { objectDensity: 700, fluidDensity: 1000, volume: 0.05 }, presets: presets({ objectDensity: 600, fluidDensity: 1000, volume: 0.04 }, { objectDensity: 1200, fluidDensity: 1000, volume: 0.04 }, { objectDensity: 920, fluidDensity: 1025, volume: 0.08 }),
    prediction: "Does floating depend on mass alone?", misconception: "Floating depends on mass alone.", correction: "Floating depends on density compared with the fluid.", teacherAnalogy: "The object floats when displaced water can balance its weight.", benchmarkText: ["Less dense object floats; denser object sinks.", "Buoyant force equals displaced fluid weight."],
  },
  "bernoulli-fluid-flow": {
    id: "bernoulli-fluid-flow", title: "Premium Bernoulli Flow", subtitle: "Watch streamlines speed up in a narrow throat while static pressure drops.", domain: "fluids", modelStatus: "formula-only", formulae: ["P + 1/2 rho v^2 + rho g h = constant"],
    controls: [{ id: "wideArea", label: "Wide area", unit: "m2", min: 0.2, max: 2, step: 0.05 }, { id: "narrowArea", label: "Narrow area", unit: "m2", min: 0.05, max: 1, step: 0.05 }, { id: "flowRate", label: "Flow rate", unit: "m3/s", min: 0.1, max: 3, step: 0.1 }],
    defaults: { wideArea: 1.2, narrowArea: 0.4, flowRate: 1 }, presets: presets({ wideArea: 1.2, narrowArea: 0.8, flowRate: 0.8 }, { wideArea: 1.2, narrowArea: 0.2, flowRate: 1.4 }, { wideArea: 1.5, narrowArea: 0.45, flowRate: 1.2 }),
    prediction: "Where is static pressure lower?", misconception: "Faster ideal flow means higher static pressure.", correction: "Faster ideal flow often means lower static pressure.", teacherAnalogy: "Energy shifts between pressure and motion.", benchmarkText: ["Narrow section has higher speed.", "Narrow section has lower static pressure in ideal flow."],
  },
  "gas-laws": {
    id: "gas-laws", title: "Premium Gas Laws and Kinetic Theory", subtitle: "Control Kelvin temperature, volume, and moles while particles and pressure gauge respond.", domain: "thermodynamics", modelStatus: "validated", formulae: ["PV = nRT"],
    controls: [{ id: "temperature", label: "Temperature", unit: "K", min: 150, max: 700, step: 10 }, { id: "volume", label: "Volume", unit: "m3", min: 0.4, max: 3, step: 0.1 }, { id: "moles", label: "Amount", unit: "mol", min: 0.2, max: 3, step: 0.1 }],
    defaults: { temperature: 300, volume: 1, moles: 1 }, presets: presets({ temperature: 300, volume: 1.5, moles: 1 }, { temperature: 298, volume: 1, moles: 1 }, { temperature: 500, volume: 0.8, moles: 1.2 }),
    prediction: "Why must temperature be in Kelvin?", misconception: "Use Celsius directly in ideal gas law.", correction: "Use Kelvin, not Celsius, in PV = nRT.", teacherAnalogy: "Pressure is particle collisions per wall area.", benchmarkText: ["At fixed n,V pressure rises with temperature.", "At fixed n,T pressure falls with volume."],
  },
};

export function computePremiumOft(id: PremiumOftId, values: Record<string, number>): PremiumOftResult {
  if (id === "reflection-plane-mirror") {
    const reflected = mirrorReflectionAngle(values.angle);
    const image = planeMirrorImageDistance(values.distance);
    return result([["Incidence", values.angle, "deg"], ["Reflection", reflected, "deg"], ["Image distance", image, "cm"]], "Change incident angle", "Reflected ray mirrors the incidence angle", "Plane mirrors obey i = r measured from the normal.", "validated", values.angle / 75, { reflected, image });
  }
  if (id === "lens-formula") {
    const v = thinLensImageDistance(values.focalLength, values.objectDistance);
    const m = thinLensMagnification(v, values.objectDistance);
    const virtual = !Number.isFinite(v) || values.objectDistance < values.focalLength;
    return result([["Image distance", v, "cm"], ["Magnification", m, ""], ["Image type", 0, virtual ? "virtual" : "real"]], "Move object near focal length", virtual ? "Image becomes virtual/upright" : "Real image forms on screen", "Thin lens model links focal length, object distance, and image distance.", virtual ? "virtual image region" : "validated", Math.min(1, Math.abs(m) / 4), { v, m, virtual: virtual ? 1 : 0 });
  }
  if (id === "prism-dispersion") {
    const dev = prismDeviation(values.angle, values.index);
    const violet = dev * (1 + values.dispersion * 0.18);
    const red = dev * (1 - values.dispersion * 0.1);
    return result([["Mean deviation", dev, "deg"], ["Red deviation", red, "deg"], ["Violet deviation", violet, "deg"]], "Increase index or prism angle", "Spectrum deviation increases", "Prism approximation uses deviation proportional to (n-1)A.", "school-level prism approximation", Math.min(1, dev / 40), { dev, red, violet });
  }
  if (id === "total-internal-reflection") {
    const critical = criticalAngleDeg(values.n1, values.n2);
    const tir = Number.isFinite(critical) && values.angle > critical;
    return result([["Critical angle", critical, "deg"], ["Incidence", values.angle, "deg"], ["State", 0, tir ? "TIR" : "refracts"]], "Increase incidence angle", tir ? "Refracted ray disappears" : "Ray refracts across boundary", "TIR requires denser-to-rarer travel beyond critical angle.", Number.isFinite(critical) ? "validated" : "not denser-to-rarer", tir ? 1 : 0.45, { critical, tir: tir ? 1 : 0 });
  }
  if (id === "human-eye-defects") {
    const defect = values.defect === 1 ? "myopia" : values.defect === 2 ? "hypermetropia" : "normal";
    const correct = (defect === "myopia" && values.correction < 0) || (defect === "hypermetropia" && values.correction > 0) || defect === "normal";
    return result([["Defect", 0, defect], ["Lens power", values.correction, "D"], ["Correction", 0, correct ? "right type" : "wrong type"]], "Choose defect and correction", correct ? "Focus moves toward retina" : "Focus moves the wrong way", "Myopia and hypermetropia need opposite correction lens signs.", "qualitative correction model", Math.min(1, Math.abs(values.correction) / 6), { correct: correct ? 1 : 0, defect });
  }
  if (id === "buoyancy") {
    const fraction = floatingFraction(values.objectDensity, values.fluidDensity);
    const displaced = values.volume * fraction;
    const fb = buoyantForce(values.fluidDensity, 9.8, displaced);
    const weight = objectWeight(values.objectDensity, 9.8, values.volume);
    const floats = values.objectDensity <= values.fluidDensity;
    return result([["Buoyant force", fb, "N"], ["Weight", weight, "N"], ["Submerged", fraction * 100, "%"], ["State", 0, floats ? "floats" : "sinks"]], "Change density", floats ? "Object floats higher/lower" : "Object sinks", "Floating depends on density and displaced fluid weight.", "validated", fraction, { fb, weight, fraction });
  }
  if (id === "bernoulli-fluid-flow") {
    const vWide = continuitySpeed(values.flowRate, values.wideArea);
    const vNarrow = continuitySpeed(values.flowRate, values.narrowArea);
    const pWide = bernoulliPressure(120000, 1000, vWide);
    const pNarrow = bernoulliPressure(120000, 1000, vNarrow);
    return result([["Wide speed", vWide, "m/s"], ["Narrow speed", vNarrow, "m/s"], ["Wide pressure", pWide, "Pa"], ["Narrow pressure", pNarrow, "Pa"]], "Narrow the pipe", "Flow speeds up and pressure drops", "Ideal Bernoulli trades static pressure for kinetic energy.", "school-level ideal-flow model", Math.min(1, vNarrow / 10), { vWide, vNarrow, pWide, pNarrow });
  }
  const pressure = idealGasPressure(values.moles, values.temperature, values.volume);
  return result([["Pressure", pressure, "Pa"], ["Temperature", values.temperature, "K"], ["Volume", values.volume, "m3"], ["Speed scale", particleSpeedScale(values.temperature), "x"]], "Change Kelvin temperature or volume", "Pressure gauge changes with collision rate", "PV = nRT needs absolute Kelvin temperature.", "validated", Math.min(1, pressure / 20000), { pressure, speed: particleSpeedScale(values.temperature) });
}

function result(outputs: [string, number, string][], cause: string, effect: string, because: string, warning: string, strength: number, raw: Record<string, number | string>): PremiumOftResult {
  return {
    outputs: outputs.map(([label, value, unit]) => ({ label, value: Number.isFinite(value) ? value.toFixed(Math.abs(value) >= 100 ? 0 : 2) : "infinity", unit })),
    cause,
    effect,
    because,
    warning,
    strength: Math.max(0.08, Math.min(1, strength)),
    raw,
  };
}
