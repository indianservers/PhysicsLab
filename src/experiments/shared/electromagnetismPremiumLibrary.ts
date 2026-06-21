import type { PhysicsVisualDomain } from "./domainVisualContracts";
import type { ValidationClaimStatus } from "./validation";
import { electricPower, faradayEmf, generatorPeakEmf, ohmCurrent, overloadState, parallelResistance, seriesResistance, transformerSecondaryVoltage } from "./electricityMath";
import { fieldPolarity, inductionDirection, relativeElectromagnetStrength, straightWireField } from "./magnetismMath";

export type PremiumEmId = "ohms-law" | "series-parallel-resistance" | "emi-faraday" | "ac-generator" | "transformer-lab" | "electromagnet" | "magnetic-field-current";

export interface EmControl {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface EmPreset {
  id: string;
  label: string;
  description: string;
  values: Record<string, number>;
}

export interface PremiumEmConfig {
  id: PremiumEmId;
  title: string;
  subtitle: string;
  domain: PhysicsVisualDomain;
  modelStatus: ValidationClaimStatus;
  formulae: string[];
  controls: EmControl[];
  defaults: Record<string, number>;
  presets: EmPreset[];
  prediction: string;
  misconception: string;
  correction: string;
  teacherAnalogy: string;
  benchmarkText: string[];
}

export interface PremiumEmResult {
  outputs: { label: string; value: string; unit?: string }[];
  cause: string;
  effect: string;
  because: string;
  glow: number;
  strength: number;
  warning: string;
  graphLabel: string;
  raw: Record<string, number | string>;
}

export const premiumEmConfigs: Record<PremiumEmId, PremiumEmConfig> = {
  "ohms-law": {
    id: "ohms-law",
    title: "Premium Ohm's Law Circuit",
    subtitle: "Measure voltage, current, and resistance on a glowing circuit board with live V-I graph cues.",
    domain: "electricity",
    modelStatus: "validated",
    formulae: ["V = IR", "P = VI"],
    controls: [
      { id: "voltage", label: "Battery voltage", unit: "V", min: 0, max: 24, step: 0.5 },
      { id: "resistance", label: "Resistance", unit: "ohm", min: 1, max: 40, step: 1 },
    ],
    defaults: { voltage: 10, resistance: 5 },
    presets: presets({ voltage: 6, resistance: 6 }, { voltage: 18, resistance: 3 }, { voltage: 12, resistance: 10 }),
    prediction: "What happens to current when resistance increases at fixed voltage?",
    misconception: "Resistance is always the graph slope, no matter which axes are used.",
    correction: "Resistance is slope only for a V-versus-I graph.",
    teacherAnalogy: "Voltage is push, current is flow, resistance is the narrowness of the path.",
    benchmarkText: ["V=10, R=5 gives I=2 A.", "V-I graph slope equals R when plotting V against I."],
  },
  "series-parallel-resistance": {
    id: "series-parallel-resistance",
    title: "Premium Series and Parallel Resistance",
    subtitle: "Switch topology and watch current paths, branch labels, and equivalent resistance change.",
    domain: "electricity",
    modelStatus: "validated",
    formulae: ["Rs = R1 + R2", "Rp = R1R2 / (R1 + R2)"],
    controls: [
      { id: "mode", label: "Topology 0 series / 1 parallel", unit: "", min: 0, max: 1, step: 1 },
      { id: "r1", label: "Resistor R1", unit: "ohm", min: 1, max: 100, step: 1 },
      { id: "r2", label: "Resistor R2", unit: "ohm", min: 1, max: 100, step: 1 },
      { id: "voltage", label: "Supply voltage", unit: "V", min: 1, max: 24, step: 0.5 },
    ],
    defaults: { mode: 0, r1: 10, r2: 20, voltage: 12 },
    presets: presets({ mode: 0, r1: 10, r2: 20, voltage: 12 }, { mode: 1, r1: 10, r2: 20, voltage: 12 }, { mode: 1, r1: 6, r2: 6, voltage: 9 }),
    prediction: "Which topology gives a smaller equivalent resistance?",
    misconception: "Adding a parallel branch always makes total resistance bigger.",
    correction: "Parallel equivalent resistance is less than the smallest branch.",
    teacherAnalogy: "Parallel paths are like adding more lanes to a road.",
    benchmarkText: ["10 ohm and 20 ohm series gives 30 ohm.", "10 ohm and 20 ohm parallel gives 6.666 ohm."],
  },
  "emi-faraday": {
    id: "emi-faraday",
    title: "Premium Faraday Induction",
    subtitle: "Move a magnet through a coil and see changing flux, induced current direction, and galvanometer response.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["emf = -N DeltaPhi / Deltat"],
    controls: [
      { id: "turns", label: "Coil turns", unit: "", min: 10, max: 400, step: 10 },
      { id: "speed", label: "Magnet speed", unit: "m/s", min: -5, max: 5, step: 0.2 },
      { id: "flux", label: "Flux change", unit: "Wb", min: 0, max: 0.08, step: 0.002 },
      { id: "polarity", label: "Polarity +1 / -1", unit: "", min: -1, max: 1, step: 2 },
    ],
    defaults: { turns: 120, speed: 2, flux: 0.02, polarity: 1 },
    presets: presets({ turns: 80, speed: 1, flux: 0.01, polarity: 1 }, { turns: 120, speed: 0, flux: 0.02, polarity: 1 }, { turns: 240, speed: -3, flux: 0.04, polarity: -1 }),
    prediction: "Does a stationary magnet induce current?",
    misconception: "A stationary magnet always creates current in a nearby coil.",
    correction: "Induced current needs changing magnetic flux.",
    teacherAnalogy: "The coil responds to change, like a speedometer responds to motion.",
    benchmarkText: ["More turns increases emf.", "Faster flux change increases emf; no motion gives zero emf."],
  },
  "ac-generator": {
    id: "ac-generator",
    title: "Premium AC Generator",
    subtitle: "Rotate a coil in a magnetic field and watch alternating emf draw a synchronized sine wave.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["emf = NBA omega sin(omega t)"],
    controls: [
      { id: "turns", label: "Coil turns", unit: "", min: 1, max: 200, step: 1 },
      { id: "field", label: "Magnetic field", unit: "T", min: 0.05, max: 2, step: 0.05 },
      { id: "area", label: "Coil area", unit: "m2", min: 0.01, max: 0.5, step: 0.01 },
      { id: "omega", label: "Angular speed", unit: "rad/s", min: 1, max: 100, step: 1 },
    ],
    defaults: { turns: 40, field: 0.5, area: 0.08, omega: 30 },
    presets: presets({ turns: 20, field: 0.4, area: 0.05, omega: 20 }, { turns: 80, field: 1, area: 0.14, omega: 70 }, { turns: 60, field: 0.8, area: 0.1, omega: 50 }),
    prediction: "Which control raises the peak emf?",
    misconception: "The generator output is steady DC.",
    correction: "A rotating coil reverses orientation, so emf alternates.",
    teacherAnalogy: "The sine wave is the shadow of rotation.",
    benchmarkText: ["Peak emf increases with N, B, A, and omega.", "Wave frequency increases with angular speed."],
  },
  "transformer-lab": {
    id: "transformer-lab",
    title: "Premium Transformer Lab",
    subtitle: "Compare primary and secondary coils, AC flux in the core, and step-up or step-down voltage.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["Vs / Vp = Ns / Np"],
    controls: [
      { id: "vp", label: "Primary voltage", unit: "V", min: 0, max: 240, step: 5 },
      { id: "np", label: "Primary turns", unit: "", min: 10, max: 500, step: 10 },
      { id: "ns", label: "Secondary turns", unit: "", min: 10, max: 800, step: 10 },
      { id: "ac", label: "AC mode 1 / DC 0", unit: "", min: 0, max: 1, step: 1 },
    ],
    defaults: { vp: 100, np: 100, ns: 200, ac: 1 },
    presets: presets({ vp: 100, np: 200, ns: 100, ac: 1 }, { vp: 100, np: 100, ns: 200, ac: 0 }, { vp: 120, np: 100, ns: 400, ac: 1 }),
    prediction: "When does the secondary coil receive voltage?",
    misconception: "Transformers work with steady DC.",
    correction: "Transformers need changing current, so steady DC gives no transformer action.",
    teacherAnalogy: "The iron core shares changing magnetic flux between coils.",
    benchmarkText: ["Vp=100, Np=100, Ns=200 gives Vs=200 ideal.", "DC mode shows no transformer action warning."],
  },
  electromagnet: {
    id: "electromagnet",
    title: "Premium Electromagnet",
    subtitle: "Build a coil around a core, change current and turns, and watch field strength and polarity respond.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["relative strength proportional to N I"],
    controls: [
      { id: "turns", label: "Turns", unit: "", min: 10, max: 500, step: 10 },
      { id: "current", label: "Current", unit: "A", min: -10, max: 10, step: 0.5 },
      { id: "core", label: "Core factor", unit: "x", min: 1, max: 6, step: 0.5 },
    ],
    defaults: { turns: 120, current: 3, core: 3 },
    presets: presets({ turns: 80, current: 2, core: 1 }, { turns: 220, current: -4, core: 4 }, { turns: 300, current: 5, core: 5 }),
    prediction: "What changes when current reverses?",
    misconception: "Only the core decides magnet strength.",
    correction: "Turns, current, and core material all matter; current direction sets polarity.",
    teacherAnalogy: "Each loop adds a little magnetic push in the same direction.",
    benchmarkText: ["More turns/current increases relative strength.", "Reversing current reverses polarity."],
  },
  "magnetic-field-current": {
    id: "magnetic-field-current",
    title: "Premium Magnetic Field Around Current",
    subtitle: "Use a probe and compass grid to see circular fields around a current-carrying wire.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["B = mu0 I / (2 pi r)"],
    controls: [
      { id: "current", label: "Current", unit: "A", min: -20, max: 20, step: 0.5 },
      { id: "radius", label: "Probe distance", unit: "m", min: 0.02, max: 1, step: 0.01 },
      { id: "mode", label: "0 wire / 1 coil", unit: "", min: 0, max: 1, step: 1 },
    ],
    defaults: { current: 8, radius: 0.12, mode: 0 },
    presets: presets({ current: 5, radius: 0.2, mode: 0 }, { current: -8, radius: 0.2, mode: 0 }, { current: 12, radius: 0.1, mode: 1 }),
    prediction: "What happens to field direction when current reverses?",
    misconception: "Field direction stays the same when current reverses.",
    correction: "Magnetic field direction changes when current direction reverses.",
    teacherAnalogy: "Curl your right-hand fingers around the wire: thumb is current.",
    benchmarkText: ["Double current doubles B.", "Double distance halves B for a straight wire."],
  },
};

function presets(beginner: Record<string, number>, misconception: Record<string, number>, real: Record<string, number>): EmPreset[] {
  return [
    { id: "beginner-demo", label: "Beginner demo", description: "One clean variable change for a first observation.", values: beginner },
    { id: "misconception-demo", label: "Misconception demo", description: "A setup that reveals the common wrong idea.", values: misconception },
    { id: "real-world-demo", label: "Real-world demo", description: "Classroom-scale realistic values.", values: real },
  ];
}

export function computePremiumEm(id: PremiumEmId, values: Record<string, number>): PremiumEmResult {
  if (id === "ohms-law") {
    const current = ohmCurrent(values.voltage, values.resistance);
    const power = electricPower(values.voltage, current);
    return emResult([["Voltage", values.voltage, "V"], ["Current", current, "A"], ["Resistance", values.resistance, "ohm"], ["Power", power, "W"]], "Increase voltage", "Charges move faster and resistor glows more", "Current follows I = V/R.", Math.abs(current) / 6, power / 30, overloadState(power, 30), "V-I line slope = R", { current, power });
  }
  if (id === "series-parallel-resistance") {
    const isParallel = values.mode >= 0.5;
    const req = isParallel ? parallelResistance([values.r1, values.r2]) : seriesResistance([values.r1, values.r2]);
    const current = ohmCurrent(values.voltage, req);
    return emResult([["Equivalent R", req, "ohm"], ["Total current", current, "A"], ["R1", values.r1, "ohm"], ["R2", values.r2, "ohm"]], "Switch circuit topology", isParallel ? "Branch current splits and equivalent resistance drops" : "Current has one path and resistance adds", "Series adds obstacles; parallel adds paths.", Math.abs(current) / 4, 1 / Math.max(1, req / 20), "safe", "equivalent resistance meter", { req, current, topology: isParallel ? "parallel" : "series" });
  }
  if (id === "emi-faraday") {
    const emf = Math.abs(values.speed) < 0.001 ? 0 : faradayEmf(values.turns, values.flux * values.polarity, Math.max(0.1, 1 / Math.max(0.1, Math.abs(values.speed))));
    const direction = inductionDirection(values.speed, values.polarity);
    return emResult([["Induced emf", emf, "V"], ["Turns", values.turns, ""], ["Speed", values.speed, "m/s"], ["Direction", 0, direction]], "Move the magnet", "Galvanometer deflects only when flux changes", "Faraday induction depends on rate of flux change.", Math.abs(emf) / 12, Math.abs(emf) / 10, Math.abs(values.speed) < 0.001 ? "no flux change" : "safe", "galvanometer needle", { emf, direction });
  }
  if (id === "ac-generator") {
    const peak = generatorPeakEmf(values.turns, values.field, values.area, values.omega);
    return emResult([["Peak emf", peak, "V"], ["Turns", values.turns, ""], ["Field", values.field, "T"], ["Omega", values.omega, "rad/s"]], "Spin the coil faster", "Sine wave grows and cycles faster", "Peak emf is proportional to N, B, A, and omega.", peak / 120, peak / 100, overloadState(peak, 120), "sine emf output", { peak });
  }
  if (id === "transformer-lab") {
    const active = values.ac >= 0.5;
    const vs = active ? transformerSecondaryVoltage(values.vp, values.np, values.ns) : 0;
    return emResult([["Secondary V", vs, "V"], ["Primary turns", values.np, ""], ["Secondary turns", values.ns, ""], ["Mode", 0, active ? "AC active" : "DC no action"]], "Change turns ratio", active ? "Secondary voltage follows Ns/Np" : "No changing flux, no secondary voltage", "Ideal transformer voltage follows turns ratio only for changing current.", Math.abs(vs) / 240, Math.abs(vs) / 220, active ? "safe" : "DC warning", "voltage ratio bars", { vs, active: active ? 1 : 0 });
  }
  if (id === "electromagnet") {
    const strength = relativeElectromagnetStrength(values.turns, values.current, values.core);
    const polarity = fieldPolarity(values.current);
    return emResult([["Relative strength", Math.abs(strength), "arb"], ["Turns", values.turns, ""], ["Current", values.current, "A"], ["North pole", 0, polarity.north]], "Increase turns or current", "Field lines become denser", "Each loop adds to the magnetic field; current direction sets polarity.", Math.abs(values.current) / 8, Math.abs(strength) / 6000, "school-level relative model", "field strength meter", { strength, polarity: polarity.north });
  }
  const field = straightWireField(values.current, values.radius);
  const polarity = fieldPolarity(values.current);
  return emResult([["Magnetic field", field * 1e6, "uT"], ["Current", values.current, "A"], ["Distance", values.radius, "m"], ["Direction", 0, polarity.direction]], "Change current or probe distance", "Field density and compass direction respond", "For a straight wire, B is proportional to I and inversely proportional to r.", Math.abs(values.current) / 12, Math.abs(field) / 0.00002, "school-level wire model", "B versus radius", { field, direction: polarity.direction });
}

function emResult(outputs: [string, number, string][], cause: string, effect: string, because: string, glow: number, strength: number, warning: string, graphLabel: string, raw: Record<string, number | string>): PremiumEmResult {
  return {
    outputs: outputs.map(([label, value, unit]) => ({ label, value: Number.isFinite(value) ? value.toFixed(Math.abs(value) >= 100 ? 1 : 3) : "0", unit })),
    cause,
    effect,
    because,
    glow: Math.max(0.08, Math.min(1, glow)),
    strength: Math.max(0.08, Math.min(1, strength)),
    warning,
    graphLabel,
    raw,
  };
}
