export interface FlagshipLabControl {
  label: string;
  min: number;
  max: number;
  step: number;
}

export interface FlagshipLabOutput {
  label: string;
  value: string;
}

export interface FlagshipGraphPreset {
  xLabel: string;
  yLabel: string;
  reason: string;
}

export interface FlagshipLabResult {
  description: string;
  controls: FlagshipLabControl[];
  formula: string;
  outputs: FlagshipLabOutput[];
  modelVersion: string;
  predictionPrompt: string;
  measurementPlan: string[];
  graphPresets: FlagshipGraphPreset[];
  uncertaintyNote: string;
}

export interface FlagshipLabModel {
  id: string;
  title: string;
  modelVersion: string;
  maturityTarget: "Validated" | "Classroom Ready" | "Flagship";
  defaultValues: [number, number, number];
  controls: FlagshipLabControl[];
  predictionPrompt: string;
  measurementPlan: string[];
  graphPresets: FlagshipGraphPreset[];
  uncertaintyNote: string;
  evaluate: (values: [number, number, number]) => Omit<FlagshipLabResult, "modelVersion" | "predictionPrompt" | "measurementPlan" | "graphPresets" | "uncertaintyNote">;
}

const controls = (one: FlagshipLabControl, two: FlagshipLabControl, three: FlagshipLabControl): FlagshipLabControl[] => [one, two, three];
const finite = (value: number, digits = 2) => (Number.isFinite(value) ? value.toFixed(digits) : "Very large");
const distance = (value: number, unit = "cm") => (Number.isFinite(value) ? `${value.toFixed(2)} ${unit}` : "At infinity");
const nearZero = (value: number) => Math.abs(value) < 1e-9;

const freeFallControls = controls(
  { label: "Height (m)", min: 1, max: 500, step: 1 },
  { label: "Initial downward speed (m/s)", min: 0, max: 50, step: 1 },
  { label: "g (m/s2)", min: 1, max: 20, step: 0.1 },
);

const ohmsLawControls = controls(
  { label: "Current (A)", min: 0, max: 5, step: 0.1 },
  { label: "Resistance (ohm)", min: 1, max: 100, step: 1 },
  { label: "Internal resistance (ohm)", min: 0, max: 10, step: 0.1 },
);

const lensFormulaControls = controls(
  { label: "Focal length (cm)", min: 5, max: 50, step: 1 },
  { label: "Object distance (cm)", min: 5, max: 120, step: 1 },
  { label: "Object height (cm)", min: 1, max: 20, step: 0.5 },
);

const soundPitchControls = controls(
  { label: "Frequency (Hz)", min: 20, max: 2000, step: 10 },
  { label: "Amplitude", min: 0.1, max: 2, step: 0.1 },
  { label: "Distance (m)", min: 1, max: 50, step: 1 },
);

const newtonSecondLawControls = controls(
  { label: "Applied force (N)", min: 0, max: 200, step: 1 },
  { label: "Mass (kg)", min: 0.1, max: 50, step: 0.1 },
  { label: "Friction force (N)", min: 0, max: 80, step: 1 },
);

const energyControls = controls(
  { label: "Mass (kg)", min: 0.1, max: 50, step: 0.1 },
  { label: "Height (m)", min: 0, max: 100, step: 0.5 },
  { label: "Loss fraction", min: 0, max: 0.9, step: 0.01 },
);

const pendulumControls = controls(
  { label: "Length (m)", min: 0.1, max: 5, step: 0.05 },
  { label: "Mass (kg)", min: 0.05, max: 5, step: 0.05 },
  { label: "Damping", min: 0, max: 0.5, step: 0.01 },
);

const buoyancyControls = controls(
  { label: "Fluid density (kg/m3)", min: 500, max: 1400, step: 10 },
  { label: "Object volume (L)", min: 0.1, max: 30, step: 0.1 },
  { label: "Object density (kg/m3)", min: 100, max: 3000, step: 10 },
);

const gasLawControls = controls(
  { label: "Moles", min: 0.1, max: 10, step: 0.1 },
  { label: "Temperature (K)", min: 100, max: 800, step: 10 },
  { label: "Volume (m3)", min: 0.1, max: 10, step: 0.1 },
);

const youngDoubleSlitControls = controls(
  { label: "Wavelength (nm)", min: 380, max: 700, step: 1 },
  { label: "Screen distance (m)", min: 0.1, max: 5, step: 0.1 },
  { label: "Slit separation (mm)", min: 0.01, max: 2, step: 0.01 },
);

const photoelectricControls = controls(
  { label: "Photon energy (eV)", min: 0.5, max: 10, step: 0.1 },
  { label: "Work function (eV)", min: 0.5, max: 6, step: 0.1 },
  { label: "Intensity", min: 0, max: 1, step: 0.01 },
);

export const flagshipLabModels: FlagshipLabModel[] = [
  {
    id: "free-fall",
    title: "Free Fall",
    modelVersion: "flagship-kinematics-1.0",
    maturityTarget: "Flagship",
    defaultValues: [80, 0, 9.81],
    controls: freeFallControls,
    predictionPrompt: "Before running it, predict whether doubling height doubles impact speed or changes it by a smaller factor.",
    measurementPlan: [
      "Keep initial speed and g fixed, then record fall time for five heights.",
      "Plot impact speed against square root of height to test the energy-style relationship.",
      "Repeat one trial with a different g to separate gravity from mass effects.",
    ],
    graphPresets: [
      { xLabel: "Height (m)", yLabel: "Fall time", reason: "Shows the square-root timing trend." },
      { xLabel: "Height (m)", yLabel: "Impact speed", reason: "Tests v^2 = u^2 + 2gh." },
      { xLabel: "g (m/s2)", yLabel: "Acceleration", reason: "Checks that acceleration follows the chosen field." },
    ],
    uncertaintyNote: "Ideal model ignores drag and object size; classroom measurements should report timing uncertainty separately.",
    evaluate: ([height, initialSpeed, gravity]) => {
      const h = Math.max(0, height);
      const u = Math.max(0, initialSpeed);
      const g = Math.max(0.01, gravity);
      const impactSpeed = Math.sqrt(u * u + 2 * g * h);
      const fallTime = (impactSpeed - u) / g;
      return {
        description: "Objects in ideal free fall accelerate downward at g, independent of mass.",
        controls: freeFallControls,
        formula: "v^2 = u^2 + 2gh, h = ut + 1/2gt^2",
        outputs: [
          { label: "Impact speed", value: `${impactSpeed.toFixed(2)} m/s` },
          { label: "Fall time", value: `${fallTime.toFixed(2)} s` },
          { label: "Acceleration", value: `${g.toFixed(2)} m/s^2` },
          { label: "Mass effect", value: "No ideal effect" },
        ],
      };
    },
  },
  {
    id: "ohms-law",
    title: "Ohm's Law",
    modelVersion: "flagship-electricity-1.0",
    maturityTarget: "Flagship",
    defaultValues: [0.8, 12, 0],
    controls: ohmsLawControls,
    predictionPrompt: "Predict the slope of the V-I graph before changing current. What should happen if resistance doubles?",
    measurementPlan: [
      "Hold resistance fixed and collect voltage for at least six current values.",
      "Use the V-I graph slope as the measured resistance.",
      "Add internal resistance only after the ideal straight-line pattern is clear.",
    ],
    graphPresets: [
      { xLabel: "Current (A)", yLabel: "Voltage across resistor", reason: "Primary Ohm's law straight-line test." },
      { xLabel: "Resistance (ohm)", yLabel: "Voltage across resistor", reason: "Shows proportionality at fixed current." },
      { xLabel: "Internal resistance (ohm)", yLabel: "Supply voltage needed", reason: "Separates load voltage from source demand." },
    ],
    uncertaintyNote: "Assumes an ohmic conductor at constant temperature; heating can bend real V-I data.",
    evaluate: ([current, resistance, internalResistance]) => {
      const i = Math.max(0, current);
      const r = Math.max(1e-9, resistance);
      const internal = Math.max(0, internalResistance);
      return {
        description: "For an ohmic conductor, voltage is directly proportional to current and the V-I graph is a straight line.",
        controls: ohmsLawControls,
        formula: "V = IR, terminal V = I(R + r)",
        outputs: [
          { label: "Voltage across resistor", value: `${(i * r).toFixed(2)} V` },
          { label: "Supply voltage needed", value: `${(i * (r + internal)).toFixed(2)} V` },
          { label: "Graph slope", value: `${r.toFixed(2)} ohm` },
          { label: "Linearity check", value: internal > 0 ? "Source has internal drop" : "Ideal straight line" },
        ],
      };
    },
  },
  {
    id: "lens-formula",
    title: "Lens Formula",
    modelVersion: "flagship-optics-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [15, 45, 4],
    controls: lensFormulaControls,
    predictionPrompt: "Predict where the image will move as the object approaches the focal point.",
    measurementPlan: [
      "Keep focal length fixed and move the object through outside 2F, at 2F, between F and 2F, and inside F.",
      "Record image distance, image type, and magnification sign for each case.",
      "Compare the ray case with the numerical sign convention before writing the conclusion.",
    ],
    graphPresets: [
      { xLabel: "Object distance (cm)", yLabel: "Image distance", reason: "Shows the asymptote near the focal point." },
      { xLabel: "Object distance (cm)", yLabel: "Magnification", reason: "Highlights enlarged and reduced image regions." },
      { xLabel: "Focal length (cm)", yLabel: "Power", reason: "Connects lens power to focal length." },
    ],
    uncertaintyNote: "Uses a thin convex lens and Cartesian sign convention; thick lenses and aberrations are outside this model.",
    evaluate: ([focalLength, objectDistance, objectHeight]) => {
      const f = Math.max(1, focalLength);
      const u = -Math.max(1, objectDistance);
      const denominator = 1 / f + 1 / u;
      const v = nearZero(denominator) ? Number.POSITIVE_INFINITY : 1 / denominator;
      const magnification = Number.isFinite(v) ? v / u : Number.POSITIVE_INFINITY;
      const imageHeight = Number.isFinite(magnification) ? magnification * objectHeight : Number.POSITIVE_INFINITY;
      const objectCase = objectDistance < f ? "Inside focus: virtual/erect" : Math.abs(objectDistance - f) < 1 ? "At focus: image at infinity" : Math.abs(objectDistance - 2 * f) < 2 ? "At 2F: same size" : objectDistance > 2 * f ? "Beyond 2F: smaller real" : "Between F and 2F: enlarged real";
      return {
        description: "Convex lens image position depends strongly on whether the object is outside or inside the focal length.",
        controls: lensFormulaControls,
        formula: "1/f = 1/v - 1/u, m = v/u",
        outputs: [
          { label: "Image distance", value: distance(v) },
          { label: "Magnification", value: finite(magnification) },
          { label: "Image height", value: Number.isFinite(imageHeight) ? `${imageHeight.toFixed(2)} cm` : "Very large" },
          { label: "Image type", value: Number.isFinite(v) ? (v > 0 ? "Real" : "Virtual") : "At infinity" },
          { label: "Ray case", value: objectCase },
          { label: "Power", value: `${(100 / f).toFixed(2)} D` },
        ],
      };
    },
  },
  {
    id: "sound-pitch-loudness",
    title: "Sound Pitch and Loudness",
    modelVersion: "flagship-waves-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [440, 1, 10],
    controls: soundPitchControls,
    predictionPrompt: "Predict which slider changes pitch and which slider changes loudness before moving either one.",
    measurementPlan: [
      "Keep amplitude and distance fixed while sweeping frequency across low, middle, and high values.",
      "Then keep frequency fixed and compare relative intensity for three amplitudes.",
      "Finally move the listener distance to show inverse-square spreading.",
    ],
    graphPresets: [
      { xLabel: "Frequency (Hz)", yLabel: "Wavelength in air", reason: "Tests v = f lambda at fixed sound speed." },
      { xLabel: "Amplitude", yLabel: "Relative intensity", reason: "Shows intensity rising with amplitude squared." },
      { xLabel: "Distance (m)", yLabel: "Relative intensity", reason: "Shows spreading loss with distance squared." },
    ],
    uncertaintyNote: "Uses room-temperature sound speed and relative intensity; real loudness perception is not linear.",
    evaluate: ([frequency, amplitude, distanceValue]) => {
      const f = Math.max(1, frequency);
      const amp = Math.max(0, amplitude);
      const r = Math.max(0.1, distanceValue);
      return {
        description: "Frequency controls pitch while amplitude and distance control relative intensity.",
        controls: soundPitchControls,
        formula: "lambda = v/f, relative intensity proportional to A^2/r^2",
        outputs: [
          { label: "Wavelength in air", value: `${(343 / f).toFixed(3)} m` },
          { label: "Relative intensity", value: `${((amp * amp) / (r * r)).toFixed(4)}` },
          { label: "Pitch", value: f > 500 ? "High" : f < 200 ? "Low" : "Medium" },
          { label: "Loudness trend", value: amp > 1.3 ? "Louder source" : "Moderate/quiet source" },
        ],
      };
    },
  },
  {
    id: "newton-s-second-law",
    title: "Newton's Second Law",
    modelVersion: "flagship-mechanics-1.0",
    maturityTarget: "Flagship",
    defaultValues: [60, 10, 5],
    controls: newtonSecondLawControls,
    predictionPrompt: "Predict how acceleration changes if the same net force is applied to twice the mass.",
    measurementPlan: [
      "Keep mass fixed and collect acceleration for several applied forces.",
      "Repeat with friction added so students distinguish applied force from net force.",
      "Keep net force fixed and vary mass to show inverse proportionality.",
    ],
    graphPresets: [
      { xLabel: "Applied force (N)", yLabel: "Acceleration", reason: "Shows the straight-line force-acceleration relationship." },
      { xLabel: "Mass (kg)", yLabel: "Acceleration", reason: "Shows inverse dependence at fixed net force." },
      { xLabel: "Friction force (N)", yLabel: "Net force", reason: "Makes force balance visible before calculating acceleration." },
    ],
    uncertaintyNote: "Assumes one-dimensional motion and constant mass; real carts need friction and sensor uncertainty recorded.",
    evaluate: ([force, mass, friction]) => {
      const m = Math.max(0.1, mass);
      const netForce = force - Math.max(0, friction);
      const acceleration = netForce / m;
      return {
        description: "Acceleration is directly proportional to net force and inversely proportional to mass.",
        controls: newtonSecondLawControls,
        formula: "Fnet = F - f, a = Fnet / m",
        outputs: [
          { label: "Net force", value: `${netForce.toFixed(2)} N` },
          { label: "Acceleration", value: `${acceleration.toFixed(2)} m/s^2` },
          { label: "Velocity after 2 s", value: `${(acceleration * 2).toFixed(2)} m/s` },
          { label: "Motion state", value: Math.abs(netForce) < 0.01 ? "Balanced" : netForce > 0 ? "Speeds up forward" : "Accelerates backward" },
        ],
      };
    },
  },
  {
    id: "conservation-of-energy",
    title: "Conservation of Energy",
    modelVersion: "flagship-energy-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [10, 20, 0.15],
    controls: energyControls,
    predictionPrompt: "Predict whether mass changes the final speed when height and loss fraction stay fixed.",
    measurementPlan: [
      "Hold mass fixed and record potential energy and bottom speed for several heights.",
      "Change mass at the same height to separate total energy from speed.",
      "Increase loss fraction and compare remaining mechanical energy.",
    ],
    graphPresets: [
      { xLabel: "Height (m)", yLabel: "Potential energy", reason: "Shows mgh as a linear height relationship." },
      { xLabel: "Height (m)", yLabel: "Speed at bottom", reason: "Shows speed growing with square root of height." },
      { xLabel: "Loss fraction", yLabel: "Remaining energy", reason: "Makes non-ideal energy loss explicit." },
    ],
    uncertaintyNote: "Treats losses as a single fraction; real tracks need separate friction, rotation, and sound/heat losses.",
    evaluate: ([mass, height, loss]) => {
      const g = 9.81;
      const m = Math.max(0.1, mass);
      const h = Math.max(0, height);
      const lossFraction = Math.max(0, Math.min(0.9, loss));
      const potential = m * g * h;
      const remaining = potential * (1 - lossFraction);
      return {
        description: "Potential energy becomes kinetic energy when non-mechanical losses are small.",
        controls: energyControls,
        formula: "mgh = 1/2 mv^2, Eremaining = mgh(1 - loss)",
        outputs: [
          { label: "Potential energy", value: `${potential.toFixed(2)} J` },
          { label: "Remaining energy", value: `${remaining.toFixed(2)} J` },
          { label: "Speed at bottom", value: `${Math.sqrt((2 * remaining) / m).toFixed(2)} m/s` },
          { label: "Energy lost", value: `${(potential - remaining).toFixed(2)} J` },
        ],
      };
    },
  },
  {
    id: "simple-pendulum",
    title: "Simple Pendulum",
    modelVersion: "flagship-oscillation-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [1, 0.2, 0.03],
    controls: pendulumControls,
    predictionPrompt: "Predict which slider changes the period most: length, mass, or damping.",
    measurementPlan: [
      "Measure period for several lengths while keeping amplitude small.",
      "Change mass at fixed length to test the mass-independence claim.",
      "Use damping only after the ideal period trend is clear.",
    ],
    graphPresets: [
      { xLabel: "Length (m)", yLabel: "Period", reason: "Shows T proportional to square root of length." },
      { xLabel: "Mass (kg)", yLabel: "Period", reason: "Checks that ideal period is independent of bob mass." },
      { xLabel: "Damping", yLabel: "Quality trend", reason: "Separates visible decay from period calculation." },
    ],
    uncertaintyNote: "Small-angle formula only; large amplitudes and pivot friction shift real measurements.",
    evaluate: ([length, mass, damping]) => {
      const g = 9.81;
      const l = Math.max(0.01, length);
      const period = 2 * Math.PI * Math.sqrt(l / g);
      return {
        description: "For small angles, pendulum period depends on length and gravity, not mass.",
        controls: pendulumControls,
        formula: "T = 2pi sqrt(L/g)",
        outputs: [
          { label: "Period", value: `${period.toFixed(3)} s` },
          { label: "Frequency", value: `${(1 / period).toFixed(3)} Hz` },
          { label: "Mass effect", value: `${Math.max(0.05, mass).toFixed(2)} kg changes energy, not ideal period` },
          { label: "Quality trend", value: damping > 0.2 ? "Strong damping" : "Light damping" },
        ],
      };
    },
  },
  {
    id: "buoyancy",
    title: "Buoyancy",
    modelVersion: "flagship-fluids-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [1000, 2, 700],
    controls: buoyancyControls,
    predictionPrompt: "Predict whether the object floats before looking at the calculated submerged fraction.",
    measurementPlan: [
      "Keep object volume fixed and compare object density with fluid density.",
      "Record buoyant force and object weight for floating and sinking cases.",
      "Use submerged fraction to connect the formula with the visible waterline.",
    ],
    graphPresets: [
      { xLabel: "Object density (kg/m3)", yLabel: "Submerged fraction", reason: "Shows the density-ratio rule for floating objects." },
      { xLabel: "Object volume (L)", yLabel: "Maximum buoyant force", reason: "Shows displaced volume setting the force scale." },
      { xLabel: "Fluid density (kg/m3)", yLabel: "Maximum buoyant force", reason: "Tests Archimedes' principle directly." },
    ],
    uncertaintyNote: "Assumes fully displaced volume is available and ignores surface tension, fluid motion, and shape stability.",
    evaluate: ([fluidDensity, volumeLitres, objectDensity]) => {
      const g = 9.81;
      const rhoFluid = Math.max(1, fluidDensity);
      const volumeM3 = Math.max(0, volumeLitres) / 1000;
      const rhoObject = Math.max(1, objectDensity);
      const objectMass = rhoObject * volumeM3;
      const objectWeight = objectMass * g;
      const maxBuoyant = rhoFluid * g * volumeM3;
      const fraction = Math.min(1, rhoObject / rhoFluid);
      return {
        description: "Buoyant force equals the weight of displaced fluid, so density comparison predicts float or sink.",
        controls: buoyancyControls,
        formula: "Fb = rho_fluid g Vdisplaced, W = rho_object g V",
        outputs: [
          { label: "Maximum buoyant force", value: `${maxBuoyant.toFixed(2)} N` },
          { label: "Object weight", value: `${objectWeight.toFixed(2)} N` },
          { label: "Submerged fraction", value: `${(fraction * 100).toFixed(1)} %` },
          { label: "State", value: objectWeight <= maxBuoyant ? "Floats" : "Sinks" },
        ],
      };
    },
  },
  {
    id: "gas-laws",
    title: "Gas Laws",
    modelVersion: "flagship-thermo-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [1, 300, 1],
    controls: gasLawControls,
    predictionPrompt: "Predict what happens to pressure if temperature doubles while volume and moles stay fixed.",
    measurementPlan: [
      "Hold moles and volume fixed while varying absolute temperature.",
      "Hold temperature fixed and vary volume to show inverse pressure behavior.",
      "Record PV/T to verify it stays constant for fixed amount of gas.",
    ],
    graphPresets: [
      { xLabel: "Temperature (K)", yLabel: "Pressure", reason: "Shows direct proportionality at fixed volume." },
      { xLabel: "Volume (m3)", yLabel: "Pressure", reason: "Shows Boyle-law inverse behavior." },
      { xLabel: "Moles", yLabel: "PV/T", reason: "Connects the constant to nR." },
    ],
    uncertaintyNote: "Ideal gas model assumes low-density gas and absolute temperature in kelvin.",
    evaluate: ([moles, temperature, volume]) => {
      const n = Math.max(0.001, moles);
      const t = Math.max(0.001, temperature);
      const v = Math.max(0.001, volume);
      const pressurePa = (n * 8.314462618 * t) / v;
      return {
        description: "The ideal gas model connects pressure, volume, amount of gas, and absolute temperature.",
        controls: gasLawControls,
        formula: "PV = nRT",
        outputs: [
          { label: "Pressure", value: `${(pressurePa / 1000).toFixed(2)} kPa` },
          { label: "PV/T", value: `${((pressurePa * v) / t).toFixed(3)} J/K` },
          { label: "nR check", value: `${(n * 8.314462618).toFixed(3)} J/K` },
          { label: "Molecular trend", value: t > 400 ? "Faster particles" : "Slower particles" },
        ],
      };
    },
  },
  {
    id: "young-double-slit",
    title: "Young Double Slit",
    modelVersion: "flagship-wave-optics-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [560, 1, 0.25],
    controls: youngDoubleSlitControls,
    predictionPrompt: "Predict whether increasing slit separation makes fringes wider or narrower.",
    measurementPlan: [
      "Keep slit separation fixed and vary wavelength across red, green, and violet values.",
      "Keep wavelength fixed and vary screen distance.",
      "Change slit separation last to show why close slits produce wider fringes.",
    ],
    graphPresets: [
      { xLabel: "Wavelength (nm)", yLabel: "Fringe width", reason: "Shows wider fringes for longer wavelength." },
      { xLabel: "Screen distance (m)", yLabel: "Fringe width", reason: "Shows direct proportionality with screen distance." },
      { xLabel: "Slit separation (mm)", yLabel: "Fringe width", reason: "Shows inverse dependence on slit separation." },
    ],
    uncertaintyNote: "Uses small-angle coherent-light approximation; real fringes need slit width and alignment uncertainty.",
    evaluate: ([wavelengthNm, screenDistance, slitMm]) => {
      const wavelength = Math.max(1, wavelengthNm) * 1e-9;
      const distanceM = Math.max(0.001, screenDistance);
      const slit = Math.max(0.001, slitMm) * 1e-3;
      const betaMm = (wavelength * distanceM / slit) * 1000;
      return {
        description: "Double-slit interference creates evenly spaced bright fringes for small angles.",
        controls: youngDoubleSlitControls,
        formula: "beta = lambda D / d",
        outputs: [
          { label: "Fringe width", value: `${betaMm.toFixed(3)} mm` },
          { label: "5-fringe span", value: `${(5 * betaMm).toFixed(3)} mm` },
          { label: "Path condition", value: "Bright when path difference = m lambda" },
          { label: "Pattern trend", value: slitMm < 0.2 ? "Wide fringes" : "Narrower fringes" },
        ],
      };
    },
  },
  {
    id: "photoelectric-equation",
    title: "Photoelectric Equation",
    modelVersion: "flagship-modern-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [4, 2.5, 0.8],
    controls: photoelectricControls,
    predictionPrompt: "Predict whether increasing intensity can eject electrons when photon energy is below the work function.",
    measurementPlan: [
      "Keep work function fixed and vary photon energy below and above threshold.",
      "Record stopping potential only when emission occurs.",
      "Change intensity after threshold to separate electron count from maximum kinetic energy.",
    ],
    graphPresets: [
      { xLabel: "Photon energy (eV)", yLabel: "Kmax", reason: "Shows the threshold and linear kinetic-energy region." },
      { xLabel: "Work function (eV)", yLabel: "Stopping potential", reason: "Shows how material choice shifts the threshold." },
      { xLabel: "Intensity", yLabel: "Emission?", reason: "Keeps the intensity misconception visible." },
    ],
    uncertaintyNote: "Reports maximum kinetic energy in eV and ideal stopping potential; photocurrent is qualitative.",
    evaluate: ([photonEnergy, workFunction, intensity]) => {
      const energy = Math.max(0, photonEnergy);
      const work = Math.max(0, workFunction);
      const kmax = Math.max(0, energy - work);
      const emits = energy > work && intensity > 0;
      return {
        description: "Einstein's photoelectric equation compares photon energy with material work function.",
        controls: photoelectricControls,
        formula: "Kmax = hf - phi, stopping potential = Kmax/e",
        outputs: [
          { label: "Kmax", value: `${kmax.toFixed(2)} eV` },
          { label: "Stopping potential", value: `${kmax.toFixed(2)} V` },
          { label: "Emission?", value: emits ? "Yes" : "No" },
          { label: "Photocurrent trend", value: emits ? `${Math.round(intensity * 100)} % relative` : "No emission" },
        ],
      };
    },
  },
];

const flagshipLabModelsById = Object.fromEntries(flagshipLabModels.map((model) => [model.id, model])) as Record<string, FlagshipLabModel>;

export const flagshipLabModelIds = flagshipLabModels.map((model) => model.id);

export function getFlagshipLabModel(id: string) {
  return flagshipLabModelsById[id];
}

export function getFlagshipDefaultValues(id: string): [number, number, number] | undefined {
  return getFlagshipLabModel(id)?.defaultValues;
}

export function evaluateFlagshipLab(id: string, values: [number, number, number]): FlagshipLabResult | undefined {
  const model = getFlagshipLabModel(id);
  if (!model) return undefined;
  return {
    ...model.evaluate(values),
    modelVersion: model.modelVersion,
    predictionPrompt: model.predictionPrompt,
    measurementPlan: model.measurementPlan,
    graphPresets: model.graphPresets,
    uncertaintyNote: model.uncertaintyNote,
  };
}
