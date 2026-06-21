export type QuantumLearningMode = "beginner" | "normal" | "advanced";
export type QuantumSimulationId = "photoelectric" | "tunneling" | "bohr";

export interface QuantumFormulaInfo {
  expression: string;
  meaning: string;
  units: string;
}

export interface QuantumSimulationInfo {
  id: QuantumSimulationId;
  title: string;
  routeAnchor: string;
  purpose: string;
  physicsGoal: string;
  howToUse: string[];
  learningOutcomes: string[];
  beginnerExplanation: string;
  normalStudentExplanation: string;
  advancedExplanation: string;
  teacherNotes: string[];
  commonMisconceptions: string[];
  formulaList: QuantumFormulaInfo[];
  controlsDescription: string[];
  outputsDescription: string[];
  whatToObserve: string[];
  realWorldApplications: string[];
  accuracyNotes: string[];
  visualDesignGoal: string;
  keywords: string[];
}

export const quantumSimulations: QuantumSimulationInfo[] = [
  {
    id: "photoelectric",
    title: "Photoelectric Effect",
    routeAnchor: "photoelectric",
    purpose: "Show how light can eject electrons from a metal surface.",
    physicsGoal: "Teach that photon energy depends on frequency, while intensity changes emitted electron count only after emission is possible.",
    howToUse: ["Choose a metal.", "Increase frequency until emission begins.", "Change intensity.", "Compare photon energy, work function, kinetic energy, stopping potential, and current."],
    learningOutcomes: ["Use E = hf.", "Find threshold frequency.", "Relate work function to emission.", "Explain why intensity does not change maximum kinetic energy."],
    beginnerExplanation: "Light arrives in packets called photons. If one photon has enough energy, it can free one electron from the metal.",
    normalStudentExplanation: "Emission begins when photon energy exceeds the metal work function. Extra energy becomes maximum kinetic energy.",
    advancedExplanation: "This browser model uses Einstein's photoelectric equation with work functions in eV. Current is a relative classroom signal proportional to intensity only when Kmax > 0.",
    teacherNotes: ["Ask students to hold frequency fixed and change intensity.", "Then hold intensity fixed and cross threshold frequency."],
    commonMisconceptions: ["Brighter light always ejects electrons even below threshold.", "Intensity controls maximum kinetic energy."],
    formulaList: [
      { expression: "E = hf", meaning: "Photon energy equals Planck constant times frequency.", units: "E in J or eV, f in Hz" },
      { expression: "Kmax = hf - phi", meaning: "Excess photon energy becomes maximum electron kinetic energy.", units: "eV" },
      { expression: "Vs = Kmax / e", meaning: "Stopping potential numerically equals Kmax when Kmax is in eV.", units: "V" },
    ],
    controlsDescription: ["Frequency sets photon energy.", "Intensity sets photon count/current after emission.", "Metal chooses the work function."],
    outputsDescription: ["Photon energy", "Maximum kinetic energy", "Stopping potential", "Relative current"],
    whatToObserve: ["Threshold frequency", "Intensity-current relation", "Kinetic energy-frequency relation"],
    realWorldApplications: ["Photocells", "Solar cells", "Photomultipliers", "Light sensors"],
    accuracyNotes: ["Uses accepted textbook work-function presets.", "Ignores surface contamination, temperature, and detailed current-voltage curves."],
    visualDesignGoal: "Metal plate with incoming photons, emitted electrons, and stopping-potential cue.",
    keywords: ["photoelectric", "work function", "threshold frequency", "photon", "stopping potential", "current", "einstein"],
  },
  {
    id: "tunneling",
    title: "Quantum Tunneling",
    routeAnchor: "tunneling",
    purpose: "Show that a quantum particle can have nonzero transmission through a barrier.",
    physicsGoal: "Connect particle energy, barrier height, width, and mass to transmission probability.",
    howToUse: ["Set particle energy.", "Raise or lower the barrier.", "Change barrier width.", "Switch electron/proton mass and compare transmission."],
    learningOutcomes: ["Explain why classical prediction differs from quantum prediction.", "Use T approximately exp(-2 kappa L).", "Predict how width and mass affect tunneling."],
    beginnerExplanation: "A quantum particle is wave-like, so a little of its wave can leak through a barrier.",
    normalStudentExplanation: "When E < V0, transmission falls quickly as barrier width and particle mass increase.",
    advancedExplanation: "Phase 1 uses a documented WKB-style estimate for E < V0 and a bounded classroom approximation for E >= V0.",
    teacherNotes: ["Use electron/proton switch to show why tunneling is microscopic.", "Ask students to double width and compare T."],
    commonMisconceptions: ["Tunneling means the particle climbs over the barrier.", "A proton tunnels as easily as an electron."],
    formulaList: [
      { expression: "T approximately e^(-2 kappa L)", meaning: "Transmission decays exponentially through a barrier.", units: "T is dimensionless" },
      { expression: "kappa = sqrt(2m(V0 - E)) / hbar", meaning: "Decay constant inside the forbidden region.", units: "m^-1" },
      { expression: "R = 1 - T", meaning: "In this simplified two-outcome model, reflection complements transmission.", units: "dimensionless" },
    ],
    controlsDescription: ["E is particle energy.", "V0 is barrier height.", "L is barrier width.", "Mass changes the decay constant."],
    outputsDescription: ["Transmission probability", "Reflection probability", "Classical prediction", "kappa"],
    whatToObserve: ["Barrier width effect", "Energy approaching V0", "Mass effect"],
    realWorldApplications: ["Scanning tunneling microscope", "Alpha decay", "Tunnel diodes", "Nuclear fusion probability"],
    accuracyNotes: ["The E < V0 estimate is WKB-style and unit-converted.", "The E >= V0 visualization is qualitative in Phase 1."],
    visualDesignGoal: "Potential barrier, wavefunction decay, probability shading, transmitted/reflected components.",
    keywords: ["tunneling", "barrier", "wavefunction", "transmission", "reflection", "kappa", "probability"],
  },
  {
    id: "bohr",
    title: "Bohr Model / Atomic Emission",
    routeAnchor: "bohr",
    purpose: "Connect hydrogen energy-level drops with photon energy and spectral wavelength.",
    physicsGoal: "Teach quantized hydrogen levels, transition energy, emission wavelength, and spectral series.",
    howToUse: ["Choose or excite an initial level.", "Drop to a lower level.", "Read Delta E and wavelength.", "Check the spectral series and visible-line marker."],
    learningOutcomes: ["Calculate En = -13.6/n^2 eV.", "Calculate transition energy.", "Convert energy to wavelength.", "Identify Lyman, Balmer, Paschen, Brackett, and Pfund series."],
    beginnerExplanation: "Electrons in hydrogen can occupy only certain levels. Falling to a lower level emits one photon.",
    normalStudentExplanation: "The energy difference between levels sets the emitted photon wavelength.",
    advancedExplanation: "The model is hydrogen-only, nonrelativistic, and ignores fine structure, spin, selection rules, and many-electron effects.",
    teacherNotes: ["Use Balmer transitions for visible lines.", "Contrast level energy with transition energy."],
    commonMisconceptions: ["Electrons radiate continuously while orbiting in the Bohr model.", "All spectral lines are visible."],
    formulaList: [
      { expression: "En = -13.6 / n^2 eV", meaning: "Hydrogen bound-state energy.", units: "eV" },
      { expression: "Delta E = 13.6(1/nf^2 - 1/ni^2)", meaning: "Energy emitted when ni > nf.", units: "eV" },
      { expression: "lambda = hc / Delta E", meaning: "Photon wavelength from transition energy.", units: "nm" },
    ],
    controlsDescription: ["n sets the current shell.", "Excite raises n.", "Drop buttons trigger emission to lower n."],
    outputsDescription: ["Transition series", "Energy gap", "Wavelength", "Visible/UV/IR region"],
    whatToObserve: ["Balmer visible lines", "Lyman ultraviolet lines", "Wavelength grows for smaller energy gaps"],
    realWorldApplications: ["Hydrogen lamp spectra", "Astronomy spectroscopy", "Atomic clocks foundation", "Plasma diagnostics"],
    accuracyNotes: ["Uses exact constants through hc conversion but displays classroom-rounded values.", "Hydrogen-only Bohr model is not a general atomic model."],
    visualDesignGoal: "Orbit rings, transition beam, emitted photon, spectrum strip, spectral line table.",
    keywords: ["bohr", "emission", "hydrogen", "balmer", "lyman", "wavelength", "spectral lines", "energy levels"],
  },
];

export function quantumSimulationById(id: QuantumSimulationId) {
  return quantumSimulations.find((simulation) => simulation.id === id) ?? quantumSimulations[0];
}
