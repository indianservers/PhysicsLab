export type ParticleVisual =
  | "standard-model"
  | "qft"
  | "higgs-field"
  | "higgs-boson"
  | "quarks"
  | "leptons"
  | "gluons"
  | "gauge-bosons"
  | "neutrinos"
  | "antimatter"
  | "symmetry-breaking"
  | "confinement";

export interface ParticlePhysicsConcept {
  id: string;
  title: string;
  category: "Matter" | "Forces" | "Fields" | "Mass" | "Framework" | "Phenomena";
  visual: ParticleVisual;
  summary: string;
  explanation: string;
  equation?: string;
  keyIdeas: string[];
  misconception: string;
  classroomPrompt: string;
}

export interface ParticleExperimentControl {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ParticleConceptLab {
  knowledgeQuestion: string;
  explorerFocus: string;
  experimentTitle: string;
  experimentPrompt: string;
  evidence: string[];
  controls: ParticleExperimentControl[];
}

export const particlePhysicsConcepts: ParticlePhysicsConcept[] = [
  {
    id: "standard-model",
    title: "Standard Model",
    category: "Framework",
    visual: "standard-model",
    summary: "The organizing map of known elementary particles and their non-gravity interactions.",
    explanation: "The Standard Model groups matter particles into quarks and leptons, and explains electromagnetic, weak, and strong interactions using force-carrying bosons. It is extremely successful, but it does not include gravity, dark matter, or a complete explanation of neutrino masses.",
    keyIdeas: ["quarks", "leptons", "gauge bosons", "Higgs sector"],
    misconception: "It is not a model of atoms only; it is a quantum field theory of elementary particles.",
    classroomPrompt: "Ask students to classify a proton, electron, photon, and Higgs boson on the same map.",
  },
  {
    id: "quantum-field-theory",
    title: "Quantum Field Theory",
    category: "Fields",
    visual: "qft",
    summary: "Particles are treated as quantized excitations of fields spread through space.",
    explanation: "In modern particle physics, the electron, photon, quark, Higgs, and gluon are not tiny solid beads. Each is a detectable excitation of an underlying field. Interactions happen when fields exchange energy, momentum, charge, and quantum numbers.",
    equation: "E^2 = p^2 c^2 + m^2 c^4",
    keyIdeas: ["fields", "quanta", "creation", "annihilation"],
    misconception: "A field is not just a drawing of arrows; it is the physical object whose excitations appear as particles.",
    classroomPrompt: "Compare a vibrating string mode with a field excitation, then discuss what the analogy misses.",
  },
  {
    id: "higgs-field",
    title: "Higgs Field",
    category: "Mass",
    visual: "higgs-field",
    summary: "A field with a nonzero value in empty space that helps give mass to W, Z, and fermions.",
    explanation: "Particles interact with the Higgs field with different strengths. That interaction is connected to their rest mass. The Higgs mechanism also lets the weak force carriers W and Z become massive while preserving the mathematical consistency of the electroweak theory.",
    keyIdeas: ["mass generation", "electroweak theory", "vacuum value"],
    misconception: "The Higgs field does not give all mass; much of proton and neutron mass comes from strong-interaction energy.",
    classroomPrompt: "Ask why the photon is massless while W and Z bosons are massive.",
  },
  {
    id: "higgs-boson",
    title: "Higgs Boson",
    category: "Mass",
    visual: "higgs-boson",
    summary: "The measurable quantum ripple of the Higgs field, discovered at CERN in 2012.",
    explanation: "The Higgs boson is evidence that the Higgs field exists. It is unstable and decays quickly into other particles, so detectors infer it from decay products and statistical peaks in collision data.",
    equation: "m_H ~= 125 GeV/c^2",
    keyIdeas: ["field excitation", "decay products", "LHC evidence"],
    misconception: "It is not the particle inside matter that directly 'contains mass'.",
    classroomPrompt: "Have learners explain why a short-lived particle can still be detected.",
  },
  {
    id: "quarks",
    title: "Quarks",
    category: "Matter",
    visual: "quarks",
    summary: "Elementary matter particles that combine into hadrons such as protons and neutrons.",
    explanation: "Quarks come in six flavors: up, down, charm, strange, top, and bottom. They carry electric charge and color charge, so they take part in electromagnetic, weak, and strong interactions. Isolated quarks are not observed at ordinary energies because of confinement.",
    keyIdeas: ["six flavors", "hadrons", "fractional charge", "color charge"],
    misconception: "A proton is not three static balls; it is a dynamic bound state with quarks, gluons, and sea particles.",
    classroomPrompt: "Build proton and neutron charge totals from up and down quark charges.",
  },
  {
    id: "leptons",
    title: "Leptons",
    category: "Matter",
    visual: "leptons",
    summary: "Elementary matter particles that do not feel the strong force.",
    explanation: "The electron, muon, tau, and their neutrinos are leptons. Charged leptons interact electromagnetically and weakly, while neutrinos interact mainly through the weak force and gravity, making them difficult to detect.",
    keyIdeas: ["electron", "muon", "tau", "neutrinos"],
    misconception: "Leptons are not all light; the tau is much heavier than an electron.",
    classroomPrompt: "Sort electron, photon, proton, and neutrino by which forces affect them.",
  },
  {
    id: "gluons-color-charge",
    title: "Gluons and Color Charge",
    category: "Forces",
    visual: "gluons",
    summary: "Gluons carry the strong force between color-charged quarks.",
    explanation: "Color charge is the strong-force charge, not a visible color. Gluons themselves carry color charge, so they can interact with other gluons. This self-interaction is a key reason the strong force behaves unlike electricity.",
    keyIdeas: ["strong interaction", "color charge", "gluon self-interaction"],
    misconception: "Color charge does not mean red, green, and blue light inside particles.",
    classroomPrompt: "Contrast electric charge with color charge using what the force carrier can carry.",
  },
  {
    id: "gauge-bosons",
    title: "Gauge Bosons",
    category: "Forces",
    visual: "gauge-bosons",
    summary: "Force carriers that mediate electromagnetic, weak, and strong interactions.",
    explanation: "Photons carry electromagnetic interaction, W and Z bosons carry weak interaction, and gluons carry strong interaction. Their properties follow from symmetries of the Standard Model fields.",
    keyIdeas: ["photon", "W and Z", "gluon", "symmetry"],
    misconception: "A force carrier is not a tiny message ball in a classical sense; it is a quantum exchange described by field interactions.",
    classroomPrompt: "Match each interaction with its carrier and one everyday or lab-scale effect.",
  },
  {
    id: "neutrino-oscillation",
    title: "Neutrino Oscillation",
    category: "Phenomena",
    visual: "neutrinos",
    summary: "Neutrinos can change flavor as they travel, proving they have mass.",
    explanation: "A neutrino produced with one flavor can later be detected as another because flavor states and mass states are mixed. This discovery showed the original minimal Standard Model was incomplete.",
    keyIdeas: ["flavor change", "mass states", "mixing angle"],
    misconception: "Neutrinos are not massless in real measurements, even though the simplest early model treated them that way.",
    classroomPrompt: "Use solar neutrinos to discuss why missing particles can reveal new physics.",
  },
  {
    id: "antimatter",
    title: "Antimatter",
    category: "Matter",
    visual: "antimatter",
    summary: "Matter partners with opposite charge and related quantum numbers.",
    explanation: "Every known matter particle has an antiparticle. When a particle meets its antiparticle, they can annihilate into energy and other particles, while energy can also create particle-antiparticle pairs if conservation laws allow it.",
    equation: "E = mc^2",
    keyIdeas: ["antiparticles", "annihilation", "pair production"],
    misconception: "Antimatter is not anti-gravity matter; antiparticles still have positive mass-energy.",
    classroomPrompt: "Ask learners to predict what must be conserved in electron-positron annihilation.",
  },
  {
    id: "symmetry-breaking",
    title: "Symmetry Breaking",
    category: "Fields",
    visual: "symmetry-breaking",
    summary: "A system can obey symmetric laws while settling into a less symmetric state.",
    explanation: "Spontaneous symmetry breaking is central to the Higgs mechanism. The underlying equations can have a symmetry, but the lowest-energy field arrangement picks a direction in field space, changing the particles and forces we observe.",
    keyIdeas: ["vacuum state", "electroweak breaking", "massive W/Z"],
    misconception: "Breaking symmetry does not mean the laws become wrong; it means the realized state has less visible symmetry.",
    classroomPrompt: "Use a pencil balanced on its tip as an analogy, then name where the analogy fails.",
  },
  {
    id: "confinement",
    title: "Quark Confinement",
    category: "Phenomena",
    visual: "confinement",
    summary: "Quarks and gluons are bound inside color-neutral hadrons at ordinary energies.",
    explanation: "Trying to separate quarks stretches the strong field. Instead of isolating a quark, enough energy can create new quark-antiquark pairs, producing jets of hadrons in high-energy collisions.",
    keyIdeas: ["hadrons", "jets", "color neutral", "strong field"],
    misconception: "Confinement is not because quarks are glued with ordinary material; it follows from quantum chromodynamics.",
    classroomPrompt: "Explain why collider events show particle jets rather than free quarks.",
  },
];

export const particlePhysicsCategories = Array.from(new Set(particlePhysicsConcepts.map((concept) => concept.category))).sort();

export const particlePhysicsStats = {
  concepts: particlePhysicsConcepts.length,
  categories: particlePhysicsCategories.length,
  misconceptionChecks: particlePhysicsConcepts.length,
  prompts: particlePhysicsConcepts.length,
};

export const particleConceptLabs: Record<string, ParticleConceptLab> = {
  "standard-model": {
    knowledgeQuestion: "How does the Standard Model separate matter particles, force carriers, and the Higgs sector?",
    explorerFocus: "Change how many generations are shown and watch the particle families scale without changing the force-carrier families.",
    experimentTitle: "Particle family counter",
    experimentPrompt: "Use the controls to build the Standard Model table from first principles.",
    evidence: ["Each generation adds two quark flavors, one charged lepton, and one neutrino.", "Gauge boson families do not multiply by generation.", "The Higgs boson is a scalar sector, not a fourth matter generation."],
    controls: [
      { id: "generations", label: "Generations", unit: "", min: 1, max: 3, step: 1, defaultValue: 3 },
      { id: "includeHiggs", label: "Include Higgs", unit: "0/1", min: 0, max: 1, step: 1, defaultValue: 1 },
    ],
  },
  "quantum-field-theory": {
    knowledgeQuestion: "Why is a detected particle better described as a field excitation than a tiny bead?",
    explorerFocus: "Tune rest mass and momentum to see how relativistic energy and speed follow the field excitation relation.",
    experimentTitle: "Relativistic energy explorer",
    experimentPrompt: "Compare mass-dominated and momentum-dominated particles using E^2 = p^2c^2 + m^2c^4.",
    evidence: ["For p = 0, total energy equals rest energy.", "For p much larger than m, beta approaches 1.", "Massless particles follow E = pc."],
    controls: [
      { id: "mass", label: "Rest mass", unit: "GeV/c^2", min: 0, max: 5, step: 0.05, defaultValue: 0.511 },
      { id: "momentum", label: "Momentum", unit: "GeV/c", min: 0, max: 10, step: 0.1, defaultValue: 2 },
    ],
  },
  "higgs-field": {
    knowledgeQuestion: "How can empty space have a field value that changes particle masses?",
    explorerFocus: "Vary coupling to the Higgs field and estimate the rest mass from m = yv/sqrt(2).",
    experimentTitle: "Higgs coupling mass lab",
    experimentPrompt: "Treat the Higgs vacuum value as 246 GeV and compare weak versus strong coupling.",
    evidence: ["The same vacuum value can produce very different masses.", "A zero coupling gives no Higgs-generated rest mass.", "Most proton mass is not from this direct coupling."],
    controls: [
      { id: "coupling", label: "Yukawa coupling y", unit: "", min: 0, max: 1.1, step: 0.01, defaultValue: 0.01 },
      { id: "vev", label: "Higgs vacuum value", unit: "GeV", min: 200, max: 300, step: 1, defaultValue: 246 },
    ],
  },
  "higgs-boson": {
    knowledgeQuestion: "How can a short-lived Higgs boson be inferred from detector data?",
    explorerFocus: "Adjust event count and detector resolution to see why statistical peaks matter.",
    experimentTitle: "Invariant-mass bump hunt",
    experimentPrompt: "Model the 125 GeV Higgs as a signal peak sitting inside background events.",
    evidence: ["More events improve statistical confidence roughly as sqrt(N).", "Better mass resolution narrows the search window.", "Discovery requires a repeatable excess over background."],
    controls: [
      { id: "events", label: "Candidate events", unit: "", min: 20, max: 2000, step: 20, defaultValue: 400 },
      { id: "resolution", label: "Mass resolution", unit: "GeV", min: 0.5, max: 8, step: 0.1, defaultValue: 2 },
      { id: "background", label: "Background level", unit: "%", min: 10, max: 95, step: 1, defaultValue: 55 },
    ],
  },
  quarks: {
    knowledgeQuestion: "How do fractional quark charges build integer proton and neutron charges?",
    explorerFocus: "Combine up and down quarks and read charge, baryon number, and hadron type.",
    experimentTitle: "Build a hadron",
    experimentPrompt: "Create charge-neutral or charged hadrons by choosing quark counts.",
    evidence: ["Up quark charge is +2/3 e.", "Down quark charge is -1/3 e.", "Three quarks form a baryon with baryon number 1."],
    controls: [
      { id: "up", label: "Up quarks", unit: "", min: 0, max: 3, step: 1, defaultValue: 2 },
      { id: "down", label: "Down quarks", unit: "", min: 0, max: 3, step: 1, defaultValue: 1 },
    ],
  },
  leptons: {
    knowledgeQuestion: "What separates charged leptons from neutrinos in the way they interact?",
    explorerFocus: "Compare charged-lepton tracks with neutrino-like weak interaction probabilities.",
    experimentTitle: "Lepton interaction contrast",
    experimentPrompt: "Raise energy and detector thickness to estimate how hard neutrinos are to catch.",
    evidence: ["Charged leptons leave electromagnetic tracks.", "Neutrinos mainly interact weakly.", "Detection probability rises with energy and detector size but remains tiny."],
    controls: [
      { id: "energy", label: "Lepton energy", unit: "GeV", min: 0.1, max: 50, step: 0.1, defaultValue: 5 },
      { id: "thickness", label: "Detector thickness", unit: "m", min: 1, max: 1000, step: 1, defaultValue: 100 },
    ],
  },
  "gluons-color-charge": {
    knowledgeQuestion: "Why does the strong force behave differently from electromagnetism?",
    explorerFocus: "Stretch the color field and watch stored energy rise until pair creation becomes plausible.",
    experimentTitle: "Color flux tube",
    experimentPrompt: "Model confinement with an approximate string tension of about 1 GeV/fm.",
    evidence: ["Gluons carry color charge, so they self-interact.", "The color field does not simply fade like electricity.", "Large separation energy can become new hadrons."],
    controls: [
      { id: "separation", label: "Quark separation", unit: "fm", min: 0.1, max: 3, step: 0.05, defaultValue: 1 },
      { id: "tension", label: "String tension", unit: "GeV/fm", min: 0.6, max: 1.4, step: 0.05, defaultValue: 1 },
    ],
  },
  "gauge-bosons": {
    knowledgeQuestion: "How does mediator mass affect force range?",
    explorerFocus: "Change mediator mass to compare photon-like long range with W/Z-like short range.",
    experimentTitle: "Force range estimator",
    experimentPrompt: "Use range about hbar c / mc^2 with hbar c = 0.197 GeV fm.",
    evidence: ["Massless photon exchange gives electromagnetic long range.", "Massive W and Z exchange is short range.", "Gluons are massless but confinement changes the observed strong-force range."],
    controls: [
      { id: "mediatorMass", label: "Mediator mass", unit: "GeV/c^2", min: 0.001, max: 100, step: 0.1, defaultValue: 80.4 },
      { id: "coupling", label: "Relative coupling", unit: "", min: 0.1, max: 2, step: 0.05, defaultValue: 1 },
    ],
  },
  "neutrino-oscillation": {
    knowledgeQuestion: "How can a neutrino born as one flavor be detected as another?",
    explorerFocus: "Tune baseline, energy, and mixing angle to see oscillation probability change.",
    experimentTitle: "Neutrino flavor oscillation",
    experimentPrompt: "Use P = sin^2(2theta) sin^2(1.27 Delta m^2 L/E) for a two-flavor model.",
    evidence: ["Flavor states are mixtures of mass states.", "Probability depends on L/E.", "Oscillation proves neutrinos are not all massless."],
    controls: [
      { id: "baseline", label: "Baseline L", unit: "km", min: 1, max: 1300, step: 1, defaultValue: 295 },
      { id: "energy", label: "Energy E", unit: "GeV", min: 0.1, max: 10, step: 0.1, defaultValue: 0.6 },
      { id: "theta", label: "Mixing angle", unit: "deg", min: 1, max: 45, step: 1, defaultValue: 33 },
      { id: "deltaM", label: "Delta m^2", unit: "10^-3 eV^2", min: 0.1, max: 5, step: 0.1, defaultValue: 2.5 },
    ],
  },
  antimatter: {
    knowledgeQuestion: "What must be conserved when matter and antimatter annihilate?",
    explorerFocus: "Set equal matter and antimatter masses and calculate available annihilation energy.",
    experimentTitle: "Annihilation energy balance",
    experimentPrompt: "Use E = 2mc^2 when equal masses of matter and antimatter annihilate.",
    evidence: ["Charge, energy, momentum, and quantum numbers must be conserved.", "Antimatter has positive mass-energy.", "Pair production reverses the idea when enough energy is available."],
    controls: [
      { id: "mass", label: "Antimatter mass", unit: "microgram", min: 0.001, max: 10, step: 0.001, defaultValue: 1 },
      { id: "efficiency", label: "Captured energy", unit: "%", min: 1, max: 100, step: 1, defaultValue: 35 },
    ],
  },
  "symmetry-breaking": {
    knowledgeQuestion: "How can symmetric laws produce an asymmetric observed state?",
    explorerFocus: "Lower the temperature parameter and watch the order parameter settle away from zero.",
    experimentTitle: "Mexican-hat field model",
    experimentPrompt: "Explore a simplified order parameter that appears below a critical temperature.",
    evidence: ["Above the critical point the symmetric state is favored.", "Below it the field chooses one equivalent direction.", "The laws can stay symmetric while the state is not."],
    controls: [
      { id: "temperature", label: "Temperature / critical", unit: "", min: 0, max: 1.5, step: 0.01, defaultValue: 0.6 },
      { id: "lambda", label: "Potential stiffness", unit: "", min: 0.1, max: 3, step: 0.05, defaultValue: 1 },
    ],
  },
  confinement: {
    knowledgeQuestion: "Why do collider events show jets instead of isolated quarks?",
    explorerFocus: "Pull quarks apart and compare stored field energy with pair-creation thresholds.",
    experimentTitle: "Jet formation predictor",
    experimentPrompt: "Use color-field energy to estimate when new quark pairs can form.",
    evidence: ["Separation stores energy in the color field.", "Enough energy creates new quark-antiquark pairs.", "Detector signatures become hadron jets, not free quarks."],
    controls: [
      { id: "separation", label: "Attempted separation", unit: "fm", min: 0.1, max: 5, step: 0.05, defaultValue: 1.5 },
      { id: "threshold", label: "Pair threshold", unit: "GeV", min: 0.3, max: 2, step: 0.05, defaultValue: 0.7 },
    ],
  },
};
