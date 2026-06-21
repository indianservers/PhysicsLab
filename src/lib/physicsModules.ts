import { PhysicsIconName } from "./icons";

export type PhysicsModuleAccent = "science" | "quantum" | "warning";

export interface PhysicsModuleLink {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: PhysicsIconName;
  accent?: PhysicsModuleAccent;
  keywords: string[];
}

export interface PhysicsModuleGroup {
  id: string;
  title: string;
  summary: string;
  icon: PhysicsIconName;
  accent?: PhysicsModuleAccent;
  modules: PhysicsModuleLink[];
}

export const physicsModuleGroups: PhysicsModuleGroup[] = [
  {
    id: "foundations",
    title: "Foundations",
    summary: "Measurements, units, vectors, math graphs, formulas, and vocabulary.",
    icon: "ruler",
    modules: [
      moduleLink("measurement", "Measurement & Units", "SI units, errors, dimensions, significant figures, and calibrated readings.", "/topics/measurement", "ruler", ["units", "dimension", "accuracy", "error"]),
      moduleLink("formulas", "Formula Explorer", "Search and browse physics formulas with explanations and examples.", "/formulas", "book", ["formula", "equation", "revision", "derivation"], "warning"),
      moduleLink("dictionary", "Visual Dictionary", "Illustrated physics terms with topic filters and alphabetical lookup.", "/dictionary", "clipboard", ["dictionary", "terms", "definitions", "visual"]),
      moduleLink("graphs", "Graph Studio", "Plot accurate physics graph presets and explore variables interactively.", "/graphs", "chart", ["graph", "plot", "preset", "data"]),
      moduleLink("solver", "Physics Solver", "Step through quantitative problems and unit-aware solutions.", "/solver", "calculator", ["solver", "problem", "calculation"]),
      moduleLink("concepts", "Concept Explorer", "Concept explanations linked to labs, visuals, and key ideas.", "/concepts", "spark", ["concept", "explain", "learn"]),
    ],
  },
  {
    id: "mechanics",
    title: "Mechanics",
    summary: "Motion, force, energy, momentum, gravitation, rotation, and oscillations.",
    icon: "rocket",
    modules: [
      moduleLink("mechanics", "Mechanics", "Forces, Newton's laws, free body diagrams, work, and energy.", "/topics/mechanics", "gauge", ["force", "newton", "work", "energy"]),
      moduleLink("kinematics-lab", "Kinematics Labs", "Launch motion, projectile, and free-fall experiments.", "/experiments?category=Mechanics", "rocket", ["kinematics", "projectile", "free fall"]),
      moduleLink("energy", "Work, Energy & Power", "Energy transfer, power, potential energy, and conservation.", "/topics/energy", "flame", ["work", "energy", "power", "conservation"], "warning"),
      moduleLink("oscillations", "Oscillations", "SHM, pendulum motion, springs, resonance, and phase.", "/topics/oscillations", "pendulum", ["shm", "pendulum", "spring", "resonance"]),
      moduleLink("gravitation", "Gravity & Orbits", "Universal gravitation, orbital motion, escape speed, and satellites.", "/experiments/orbital-motion", "orbit", ["gravity", "orbit", "satellite"]),
      moduleLink("sandbox", "Mechanics Sandbox", "Build free-form experiments with objects, forces, springs, and tracks.", "/sandbox", "spark", ["sandbox", "simulation", "force"]),
    ],
  },
  {
    id: "waves-optics",
    title: "Waves & Optics",
    summary: "Sound, light, reflection, refraction, interference, lenses, and images.",
    icon: "wave",
    modules: [
      moduleLink("waves", "Waves", "Wave speed, frequency, wavelength, sound, standing waves, and beats.", "/topics/waves", "wave", ["sound", "frequency", "wavelength"]),
      moduleLink("optics", "Ray & Wave Optics", "Reflection, refraction, prisms, lenses, interference, and diffraction.", "/topics/optics", "prism", ["light", "lens", "mirror", "refraction"]),
      moduleLink("light-shadows", "Light, Shadows & Reflection", "Open the Class 6 light and shadows interactive lab.", "/experiments/shadows-eclipses", "eye", ["shadow", "eclipse", "light", "reflection"]),
      moduleLink("atmosphere-optics", "Atmosphere Optics", "Explore layers, aurora, meteors, satellites, and sky phenomena.", "/atmosphere", "orbit", ["atmosphere", "aurora", "meteor"], "quantum"),
      moduleLink("video-analysis", "Video Motion Analysis", "Measure motion from video and compare with graph predictions.", "/video", "eye", ["video", "tracking", "motion"]),
    ],
  },
  {
    id: "electricity-magnetism",
    title: "Electricity & Magnetism",
    summary: "Charge, circuits, fields, magnetism, induction, AC, and electronics.",
    icon: "magnet",
    modules: [
      moduleLink("electricity", "Electricity", "Current, voltage, resistance, power, circuits, and Ohm's law.", "/topics/electricity", "battery", ["current", "voltage", "resistance", "ohm"]),
      moduleLink("magnetism", "Magnetism", "Magnetic fields, force on charges, coils, motors, and induction.", "/topics/magnetism", "magnet", ["field", "lorentz", "induction"]),
      moduleLink("electronics", "Electronics", "Semiconductors, logic gates, sensors, signals, and devices.", "/topics/electronics", "spark", ["semiconductor", "logic", "diode", "transistor"]),
      moduleLink("electric-labs", "Circuit Labs", "Launch circuit, Ohm's law, capacitor, and AC experiments.", "/experiments?category=Electricity", "flask", ["circuit", "lab", "capacitor"]),
      moduleLink("magnetic-labs", "Magnetic Field Labs", "Explore magnetic field, induction, and force visualizations.", "/experiments?category=Magnetism", "field", ["magnetic field", "emi", "motor"]),
    ],
  },
  {
    id: "thermal-fluids",
    title: "Thermal & Fluids",
    summary: "Heat, temperature, gas laws, entropy, pressure, buoyancy, and flow.",
    icon: "thermometer",
    modules: [
      moduleLink("thermodynamics", "Thermodynamics", "Heat, temperature, ideal gases, entropy, engines, and energy flow.", "/topics/thermodynamics", "thermometer", ["heat", "entropy", "gas", "temperature"]),
      moduleLink("fluids", "Fluid Mechanics", "Pressure, buoyancy, Bernoulli flow, density, and viscosity.", "/topics/fluid-mechanics", "drop", ["fluid", "pressure", "buoyancy", "bernoulli"]),
      moduleLink("thermal-labs", "Thermal Labs", "Launch heat, gas law, and thermodynamics experiments.", "/experiments?category=Thermodynamics", "flask", ["thermal", "heat", "gas"]),
      moduleLink("fluid-labs", "Fluid Labs", "Open buoyancy, pressure, and flow simulations.", "/experiments?category=Fluids", "drop", ["fluid lab", "hydrostatic", "flow"]),
    ],
  },
  {
    id: "modern-physics",
    title: "Modern & Quantum",
    summary: "Atoms, quantum mechanics, nuclear physics, relativity, particles, and strings.",
    icon: "atom",
    accent: "quantum",
    modules: [
      moduleLink("modern", "Modern Physics", "Photoelectric effect, de Broglie waves, Bohr atom, and nuclear physics.", "/topics/modern-physics", "atom", ["photoelectric", "bohr", "nuclear"], "quantum"),
      moduleLink("quantum", "Quantum Lab", "Interactive Bohr, tunneling, and photoelectric explorations.", "/quantum", "atom", ["quantum", "tunneling", "photoelectric"], "quantum"),
      moduleLink("particle", "Particle Physics", "Standard Model, quarks, leptons, bosons, Higgs field, and QFT.", "/particle-physics", "atom", ["particle", "quark", "higgs", "standard model"], "quantum"),
      moduleLink("string", "String Theory", "Vibrating strings, extra dimensions, quantum gravity, and unification.", "/string-theory", "wave", ["string theory", "extra dimensions", "graviton"], "quantum"),
      moduleLink("relativity", "Relativity & Spacetime", "Mass-energy, curved spacetime, GPS correction, and relativistic effects.", "/dictionary?q=relativity", "orbit", ["relativity", "spacetime", "einstein"], "quantum"),
      moduleLink("particle-tools", "Particle Concept Pages", "Open interactive pages for every particle physics concept.", "/particle-physics/higgs-field", "spark", ["higgs", "qft", "interactive"], "quantum"),
    ],
  },
  {
    id: "space-earth",
    title: "Space & Earth Physics",
    summary: "Astrophysics, astronomy, atmosphere, satellites, cosmology, and Earth systems.",
    icon: "orbit",
    accent: "quantum",
    modules: [
      moduleLink("astronomy", "Astronomy", "Planets, stars, telescopes, sky observation, and orbital ideas.", "/topics/astronomy", "orbit", ["astronomy", "stars", "planet"], "quantum"),
      moduleLink("scale-universe", "Scale of Universe", "Zoom from particles to galaxies using powers of ten.", "/physics/scale-of-universe", "ruler", ["scale", "powers of ten", "universe", "size", "meters"], "quantum"),
      moduleLink("astrophysics", "AstroPhysics", "Black holes, galaxies, stellar physics, cosmology, and dark matter.", "/astrophysics", "orbit", ["astrophysics", "black hole", "galaxy"], "quantum"),
      moduleLink("atmosphere", "Earth Atmosphere", "Troposphere to exosphere with realistic layer interactions.", "/atmosphere", "rocket", ["atmosphere", "satellite", "aurora"], "quantum"),
      moduleLink("innovations", "Physics Inventions", "Explore 100+ physics inventions, discoveries, and technologies.", "/physics-innovations", "spark", ["inventions", "discoveries", "laser"], "warning"),
    ],
  },
  {
    id: "learning-tools",
    title: "Learning, Trust & Teaching",
    summary: "Roadmaps, quizzes, teacher tools, validation, accessibility, and PhET-level improvement work.",
    icon: "teacher",
    modules: [
      moduleLink("roadmap", "Student Roadmap", "Class-wise launch paths into labs and mastery practice.", "/roadmap", "compass", ["roadmap", "class", "mastery"]),
      moduleLink("quiz", "Quiz Practice", "Practice conceptual and numerical physics questions.", "/quiz", "check", ["quiz", "practice", "assessment"]),
      moduleLink("teacher", "Teacher Tools", "Assignments, snapshots, classroom reports, and evidence review.", "/teacher", "teacher", ["teacher", "assignment", "classroom"]),
      moduleLink("trust", "Scientific Trust", "Accuracy checks, validation status, sources, and model assumptions.", "/trust", "check", ["trust", "accuracy", "source"], "warning"),
      moduleLink("simulation-depth", "Simulation Depth", "2D/3D polish, accuracy, probes, replay, and launch tracking.", "/simulation-depth", "eye", ["phet", "simulation", "depth"]),
      moduleLink("excellence", "Excellence Benchmark", "Compare against top teaching tools and plan improvements.", "/excellence-benchmark", "gauge", ["benchmark", "phet", "quality"], "warning"),
    ],
  },
];

export const allPhysicsModules = physicsModuleGroups.flatMap((group) =>
  group.modules.map((module) => ({ ...module, groupId: group.id, groupTitle: group.title })),
);

export const physicsModuleStats = {
  groups: physicsModuleGroups.length,
  modules: allPhysicsModules.length,
};

function moduleLink(
  id: string,
  title: string,
  description: string,
  path: string,
  icon: PhysicsIconName,
  keywords: string[],
  accent?: PhysicsModuleAccent,
): PhysicsModuleLink {
  return { id, title, description, path, icon, keywords, accent };
}
