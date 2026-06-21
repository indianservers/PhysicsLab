import type { ValidationClaimStatus } from "./validation";
import { chladniNodeScore, detectorAmplitude, singleSlitCentralWidth, singleSlitFirstMinimum, waveSpeed, wavelengthFromSpeed, youngFringeWidth } from "./waveMath";

export type PremiumWaveId = "chladni-plate" | "single-slit-diffraction" | "wave-lab" | "young-double-slit" | "sound-wave-anatomy";

export interface WaveControl {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface WavePreset {
  id: string;
  label: string;
  description: string;
  values: Record<string, number>;
}

export interface PremiumWaveConfig {
  id: PremiumWaveId;
  title: string;
  subtitle: string;
  modelStatus: ValidationClaimStatus;
  formulae: string[];
  controls: WaveControl[];
  defaults: Record<string, number>;
  presets: WavePreset[];
  prediction: string;
  misconception: string;
  correction: string;
  observation: string;
  teacherAnalogy: string;
  benchmarkText: string[];
}

export interface PremiumWaveResult {
  outputs: { label: string; value: string; unit?: string }[];
  amplitude: number;
  wavelength: number;
  frequency: number;
  graphLabel: string;
  cause: string;
  effect: string;
  because: string;
}

export const premiumWaveConfigs: Record<PremiumWaveId, PremiumWaveConfig> = {
  "chladni-plate": {
    id: "chladni-plate",
    title: "Premium Chladni Plate Lab",
    subtitle: "Watch sand settle into nodal lines on a vibrating plate. This is a school-level qualitative standing-wave model.",
    modelStatus: "qualitative-visual",
    formulae: ["z(x,y,t) = A sin(n pi x/L) sin(m pi y/L) cos(omega t)"],
    controls: [
      { id: "n", label: "Mode n", unit: "", min: 1, max: 8, step: 1 },
      { id: "m", label: "Mode m", unit: "", min: 1, max: 8, step: 1 },
      { id: "frequency", label: "Frequency", unit: "Hz", min: 50, max: 900, step: 10 },
      { id: "amplitude", label: "Amplitude", unit: "", min: 0.2, max: 2, step: 0.1 },
    ],
    defaults: { n: 2, m: 3, frequency: 240, amplitude: 1 },
    presets: presets({ n: 1, m: 1, frequency: 120, amplitude: 0.8 }, { n: 6, m: 7, frequency: 720, amplitude: 1.4 }, { n: 3, m: 4, frequency: 440, amplitude: 1 }),
    prediction: "Where will sand collect when the vibration pattern appears?",
    misconception: "Sand collects where the plate vibrates most.",
    correction: "Sand collects near nodes where vibration is minimum.",
    observation: "Sand collects where vibration is minimum.",
    teacherAnalogy: "Like dust gathering in the quiet places of a shaking floor.",
    benchmarkText: ["Higher n/m values generate more nodal regions.", "n=1,m=1 is simpler than n=3,m=4."],
  },
  "single-slit-diffraction": {
    id: "single-slit-diffraction",
    title: "Premium Single Slit Diffraction Lab",
    subtitle: "Narrow the slit and watch the central maximum widen while minima rulers update.",
    modelStatus: "validated",
    formulae: ["a sin theta = m lambda", "y_m ~= m lambda D / a"],
    controls: [
      { id: "wavelength", label: "Wavelength", unit: "nm", min: 380, max: 700, step: 5 },
      { id: "slitWidth", label: "Slit width", unit: "mm", min: 0.03, max: 0.4, step: 0.01 },
      { id: "distance", label: "Screen distance", unit: "m", min: 0.5, max: 4, step: 0.1 },
    ],
    defaults: { wavelength: 500, slitWidth: 0.1, distance: 2 },
    presets: presets({ wavelength: 500, slitWidth: 0.25, distance: 1.5 }, { wavelength: 500, slitWidth: 0.04, distance: 2 }, { wavelength: 650, slitWidth: 0.1, distance: 3 }),
    prediction: "What happens to the central bright band when the slit narrows?",
    misconception: "A narrower slit makes a narrower beam.",
    correction: "A narrower slit creates a wider diffraction spread.",
    observation: "Narrower slit creates wider diffraction.",
    teacherAnalogy: "The slit behaves like a new wave source when it becomes comparable to wavelength.",
    benchmarkText: ["lambda=500 nm, D=2 m, a=0.1 mm gives y1 ~= 0.01 m.", "Increasing slit width reduces central width."],
  },
  "wave-lab": {
    id: "wave-lab",
    title: "Premium Two-Source Wave Lab",
    subtitle: "Move the detector through constructive and destructive interference from coherent point sources.",
    modelStatus: "validated",
    formulae: ["v = f lambda", "constructive: Delta r = m lambda", "destructive: Delta r = (m + 1/2) lambda"],
    controls: [
      { id: "frequency", label: "Frequency", unit: "Hz", min: 1, max: 20, step: 0.5 },
      { id: "speed", label: "Wave speed", unit: "m/s", min: 5, max: 80, step: 1 },
      { id: "sourceSpacing", label: "Source spacing", unit: "m", min: 0, max: 8, step: 0.1 },
      { id: "phase", label: "Phase difference", unit: "rad", min: 0, max: 6.28, step: 0.1 },
    ],
    defaults: { frequency: 8, speed: 32, sourceSpacing: 4, phase: 0 },
    presets: presets({ frequency: 5, speed: 30, sourceSpacing: 2, phase: 0 }, { frequency: 14, speed: 30, sourceSpacing: 4, phase: 3.14 }, { frequency: 8, speed: 32, sourceSpacing: 0, phase: 0 }),
    prediction: "Where will the detector read a large amplitude?",
    misconception: "Two waves always make the motion bigger everywhere.",
    correction: "Waves can reinforce or cancel depending on path difference and phase.",
    observation: "Bright lines are constructive regions; dark lines are destructive regions.",
    teacherAnalogy: "Bright line / dark line is like loud and quiet zones in a room.",
    benchmarkText: ["At fixed speed, higher frequency means shorter wavelength.", "Same position/same phase sources combine as stronger single source."],
  },
  "young-double-slit": {
    id: "young-double-slit",
    title: "Premium Young's Double Slit Lab",
    subtitle: "A coherent beam crosses two slits and creates measured bright/dark fringes on a screen.",
    modelStatus: "validated",
    formulae: ["beta = lambda D / d"],
    controls: [
      { id: "wavelength", label: "Wavelength", unit: "nm", min: 380, max: 700, step: 5 },
      { id: "distance", label: "Screen distance", unit: "m", min: 0.5, max: 4, step: 0.1 },
      { id: "separation", label: "Slit separation", unit: "mm", min: 0.1, max: 1.5, step: 0.05 },
    ],
    defaults: { wavelength: 560, distance: 1, separation: 0.25 },
    presets: presets({ wavelength: 450, distance: 1, separation: 0.4 }, { wavelength: 650, distance: 2.5, separation: 0.15 }, { wavelength: 560, distance: 2, separation: 0.3 }),
    prediction: "Which control spreads the fringes farther apart?",
    misconception: "Bigger slit separation makes bigger fringe spacing.",
    correction: "Fringe width decreases when slit separation increases.",
    observation: "Larger wavelength creates wider fringes.",
    teacherAnalogy: "The screen is a ruler for phase difference.",
    benchmarkText: ["500 nm, D=2 m, d=0.5 mm gives beta ~= 0.002 m.", "beta increases with wavelength and distance, and decreases with slit separation."],
  },
  "sound-wave-anatomy": {
    id: "sound-wave-anatomy",
    title: "Premium Longitudinal Sound Wave Lab",
    subtitle: "See air particles oscillate locally while compression bands carry sound energy forward.",
    modelStatus: "validated",
    formulae: ["v = f lambda"],
    controls: [
      { id: "frequency", label: "Frequency", unit: "Hz", min: 100, max: 1200, step: 10 },
      { id: "amplitude", label: "Amplitude", unit: "", min: 0.2, max: 2, step: 0.1 },
      { id: "speed", label: "Medium speed", unit: "m/s", min: 150, max: 1500, step: 10 },
    ],
    defaults: { frequency: 440, amplitude: 1, speed: 343 },
    presets: presets({ frequency: 220, amplitude: 0.7, speed: 343 }, { frequency: 880, amplitude: 1.8, speed: 343 }, { frequency: 440, amplitude: 1, speed: 1480 }),
    prediction: "Does a louder sound change pitch?",
    misconception: "Sound particles travel all the way from source to ear.",
    correction: "Sound particles oscillate locally; the disturbance travels.",
    observation: "Amplitude changes loudness, not pitch.",
    teacherAnalogy: "A line of students nudging back and forth can pass a push along without walking across the room.",
    benchmarkText: ["440 Hz in air at 343 m/s gives lambda ~= 0.780 m.", "At fixed speed, higher frequency reduces wavelength; amplitude changes loudness, not pitch."],
  },
};

function presets(beginner: Record<string, number>, misconception: Record<string, number>, real: Record<string, number>): WavePreset[] {
  return [
    { id: "beginner-demo", label: "Beginner demo", description: "One clean variable change for a first observation.", values: beginner },
    { id: "misconception-demo", label: "Misconception demo", description: "A setup that reveals the common wrong idea.", values: misconception },
    { id: "real-world-demo", label: "Real-world demo", description: "Classroom-scale realistic values.", values: real },
  ];
}

export function computePremiumWave(id: PremiumWaveId, values: Record<string, number>): PremiumWaveResult {
  if (id === "chladni-plate") {
    const score = chladniNodeScore(values.n, values.m);
    return waveResult([["Mode score", score, "nodes"], ["Frequency", values.frequency, "Hz"], ["Amplitude", values.amplitude, ""], ["Model", 0, "qualitative"]], values.amplitude, 900 / values.frequency, values.frequency, "node intensity", "Increase mode number", "More nodal regions", "The sine mode product creates extra node lines.");
  }
  if (id === "single-slit-diffraction") {
    const y1 = singleSlitFirstMinimum(values.wavelength, values.distance, values.slitWidth);
    const width = singleSlitCentralWidth(values.wavelength, values.distance, values.slitWidth);
    return waveResult([["First minimum", y1, "m"], ["Central width", width, "m"], ["Wavelength", values.wavelength, "nm"], ["Slit width", values.slitWidth, "mm"]], width * 60, Math.max(16, 220 * values.slitWidth), values.wavelength, "screen intensity", "Narrow the slit", "Diffraction spread grows", "y is proportional to wavelength and distance, and inversely proportional to slit width.");
  }
  if (id === "wave-lab") {
    const lambda = wavelengthFromSpeed(values.frequency, values.speed);
    const amp = detectorAmplitude(values.sourceSpacing / 2, lambda, values.phase);
    return waveResult([["Wavelength", lambda, "m"], ["Detector amplitude", amp, ""], ["Speed", values.speed, "m/s"], ["Phase", values.phase, "rad"]], amp, lambda * 18, values.frequency, "detector amplitude", "Change path difference", "Detector amplitude changes", "Constructive and destructive conditions depend on path difference.");
  }
  if (id === "young-double-slit") {
    const beta = youngFringeWidth(values.wavelength, values.distance, values.separation);
    return waveResult([["Fringe width", beta, "m"], ["Wavelength", values.wavelength, "nm"], ["Screen distance", values.distance, "m"], ["Separation", values.separation, "mm"]], beta * 900, Math.max(16, 110 * values.separation), values.wavelength, "fringe brightness", "Increase wavelength", "Fringes spread apart", "beta = lambda D / d.");
  }
  const lambda = wavelengthFromSpeed(values.frequency, values.speed);
  const speed = waveSpeed(values.frequency, lambda);
  return waveResult([["Wavelength", lambda, "m"], ["Speed", speed, "m/s"], ["Frequency", values.frequency, "Hz"], ["Amplitude", values.amplitude, ""]], values.amplitude, Math.max(18, lambda * 90), values.frequency, "pressure graph", "Increase frequency", "Wavelength gets shorter", "For fixed speed, v = f lambda.");
}

function waveResult(outputs: [string, number, string][], amplitude: number, wavelength: number, frequency: number, graphLabel: string, cause: string, effect: string, because: string): PremiumWaveResult {
  return {
    outputs: outputs.map(([label, value, unit]) => ({ label, value: Number.isFinite(value) ? value.toFixed(Math.abs(value) >= 100 ? 1 : 3) : "qualitative", unit })),
    amplitude,
    wavelength,
    frequency,
    graphLabel,
    cause,
    effect,
    because,
  };
}
