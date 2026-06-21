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
