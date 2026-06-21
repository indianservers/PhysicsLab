export interface StringTheoryConcept {
  id: string;
  title: string;
  summary: string;
  explanation: string;
  interactiveCue: string;
  status: "Core idea" | "Bridge idea" | "Open question";
}

export const stringTheoryConcepts: StringTheoryConcept[] = [
  {
    id: "vibrating-strings",
    title: "Vibrating strings",
    summary: "Different vibration modes can be interpreted as different particle properties.",
    explanation: "String theory replaces point particles with tiny one-dimensional objects. The way a string vibrates determines quantities such as mass, charge, and spin in the model.",
    interactiveCue: "Change vibration mode and amplitude to see one string produce different patterns.",
    status: "Core idea",
  },
  {
    id: "quantum-gravity",
    title: "Quantum gravity bridge",
    summary: "The theory attempts to combine quantum physics with gravity.",
    explanation: "Ordinary quantum field theory works well for particle interactions, while general relativity explains gravity and spacetime. String theory is attractive because one vibration mode behaves like a graviton in the mathematics.",
    interactiveCue: "Compare particle-like vibration with the curved spacetime sheet.",
    status: "Bridge idea",
  },
  {
    id: "extra-dimensions",
    title: "Extra dimensions",
    summary: "Some versions require more dimensions than ordinary 3D space plus time.",
    explanation: "The additional dimensions are modeled as curled or compact dimensions too small to detect directly with current experiments.",
    interactiveCue: "Raise the dimension count to reveal curled loops in the 3D view.",
    status: "Core idea",
  },
  {
    id: "unification",
    title: "Unification",
    summary: "A possible framework where forces and matter arise from one deeper object.",
    explanation: "The goal is not simply to add another particle, but to describe matter particles, force carriers, and gravity as aspects of the same underlying string framework.",
    interactiveCue: "Watch one vibrating string feed particle markers and spacetime curvature together.",
    status: "Bridge idea",
  },
  {
    id: "experimental-status",
    title: "Experimental status",
    summary: "String theory is mathematically rich but still lacks direct experimental confirmation.",
    explanation: "The predicted string scale may be far beyond present collider energies, so tests are difficult. It remains theoretical and should be taught with that scientific caution.",
    interactiveCue: "Use the energy slider as a reminder that higher-energy evidence is required.",
    status: "Open question",
  },
];

export const stringTheoryStats = {
  concepts: stringTheoryConcepts.length,
  bridgeIdeas: stringTheoryConcepts.filter((item) => item.status === "Bridge idea").length,
  openQuestions: stringTheoryConcepts.filter((item) => item.status === "Open question").length,
};
