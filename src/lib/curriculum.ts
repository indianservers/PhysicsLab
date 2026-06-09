export type LearningStage = "concept" | "visualization" | "experiment" | "assessment";

export interface CurriculumTopic {
  id: string;
  title: string;
  domain: string;
  outcomes: string[];
  tools: string[];
  experimentIds: string[];
  stage: LearningStage;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  marks?: number;
  topics: CurriculumTopic[];
}

export interface CurriculumClass {
  id: string;
  grade: number;
  label: string;
  source: string;
  description: string;
  units: CurriculumUnit[];
}

export interface SyllabusFrameworkBand {
  id: string;
  label: string;
  grades: number[];
  focus: string[];
  topicIds: string[];
  experimentIds: string[];
  status: "covered" | "partial" | "needs-lab";
}

export interface SyllabusFramework {
  id: string;
  label: string;
  source: string;
  note: string;
  bands: SyllabusFrameworkBand[];
}

const topic = (
  id: string,
  title: string,
  domain: string,
  outcomes: string[],
  tools: string[],
  experimentIds: string[] = [],
  stage: LearningStage = experimentIds.length ? "experiment" : "concept"
): CurriculumTopic => ({ id, title, domain, outcomes, tools, experimentIds, stage });

export const curriculum: CurriculumClass[] = [
  {
    id: "class-6",
    grade: 6,
    label: "Class 6",
    source: "Middle-school science bridge",
    description: "Observation-first physics vocabulary before formal formulas.",
    units: [
      {
        id: "c6-light-motion-electricity",
        title: "Light, Motion, Electricity",
        topics: [
          topic("c6-light-shadows", "Light, Shadows, and Reflection", "Optics", ["Identify sources, shadows, and simple reflection."], ["Light ray", "Shadow screen"], ["shadows-eclipses", "reflection-plane-mirror"]),
          topic("c6-motion-measurement", "Motion and Measurement", "Measurement", ["Measure length and time, then compare slow and fast motion."], ["Ruler", "Stopwatch"], ["measurement-errors", "uniform-motion"]),
          topic("c6-simple-circuits", "Simple Electric Circuits", "Electricity", ["Build a closed circuit and explain why a bulb glows."], ["Battery", "Bulb", "Switch"], ["ohms-law"]),
          topic("c6-magnets", "Magnets", "Magnetism", ["Compare poles, attraction, repulsion, and compass direction."], ["Bar magnet", "Compass"], ["magnetic-field-current"]),
        ],
      },
    ],
  },
  {
    id: "class-7",
    grade: 7,
    label: "Class 7",
    source: "NCERT Science middle-stage physics topics",
    description: "Concrete, observation-led physics: heat, motion, current effects, and light.",
    units: [
      {
        id: "c7-heat",
        title: "Heat",
        topics: [
          topic("c7-heat-temperature", "Heat and Temperature", "Thermodynamics", ["Distinguish heat from temperature.", "Read thermometers and compare hot/cold bodies."], ["Thermometer", "Temperature slider", "Particle view"], ["heat-and-temperature"]),
          topic("c7-heat-transfer", "Transfer of Heat", "Thermodynamics", ["Compare conduction, convection, and radiation.", "Predict heat flow direction."], ["Conduction bar", "Convection cell", "Radiation lamp"], ["heat-transfer"]),
        ],
      },
      {
        id: "c7-motion-time",
        title: "Motion and Time",
        topics: [
          topic("c7-speed", "Speed, Distance, and Time", "Mechanics", ["Calculate speed from distance and time.", "Compare uniform and non-uniform motion."], ["Stopwatch", "Ruler", "Motion graph"], ["uniform-motion"]),
          topic("c7-distance-time", "Distance-Time Graphs", "Mechanics", ["Interpret a distance-time graph.", "Relate slope to speed."], ["Graph plotter", "Motion sensor"], ["uniform-motion"]),
        ],
      },
      {
        id: "c7-current-effects",
        title: "Electric Current and Its Effects",
        topics: [
          topic("c7-heating-effect", "Heating Effect of Current", "Electricity", ["Explain why wires and bulbs heat up.", "Relate current to heating."], ["Battery", "Bulb", "Switch", "Wire"], ["heating-effect-current"]),
          topic("c7-magnetic-effect", "Magnetic Effect and Electromagnet", "Magnetism", ["Show current can produce magnetism.", "Build a simple electromagnet model."], ["Battery", "Coil", "Compass", "Iron core"], ["electromagnet"]),
        ],
      },
      {
        id: "c7-light",
        title: "Light",
        topics: [
          topic("c7-reflection", "Reflection by Mirrors", "Optics", ["Trace incident and reflected rays.", "Compare images in plane and spherical mirrors.", "Explain straight-line travel of light with shadows."], ["Light ray", "Plane mirror", "Concave mirror", "Shadow screen"], ["reflection-plane-mirror", "shadows-eclipses"]),
          topic("c7-lenses", "Images by Lenses", "Optics", ["Observe how lenses bend light.", "Describe image size and orientation."], ["Light ray", "Convex lens"], ["lens-formula"]),
        ],
      },
    ],
  },
  {
    id: "class-8",
    grade: 8,
    label: "Class 8",
    source: "NCERT Science middle-stage physics topics",
    description: "Hands-on foundations for force, pressure, friction, sound, electricity, natural phenomena, and light.",
    units: [
      {
        id: "c8-force-pressure",
        title: "Force and Pressure",
        topics: [
          topic("c8-force-effects", "Effects of Force", "Mechanics", ["Identify push/pull interactions.", "Predict changes in speed, direction, and shape."], ["Force arrow", "Block", "Motion sensor"], ["newton-s-second-law", "force-and-pressure"]),
          topic("c8-pressure", "Pressure in Solids and Fluids", "Fluid Mechanics", ["Relate pressure to force and area.", "Compare pressure at different depths."], ["Fluid region", "Pressure gauge"], ["force-and-pressure", "fluid-pressure"]),
        ],
      },
      {
        id: "c8-friction-sound-light",
        title: "Friction, Sound, and Light",
        topics: [
          topic("c8-friction", "Friction", "Mechanics", ["Compare static, sliding, and rolling friction.", "Explain useful and harmful friction."], ["Block", "Ramp", "Surface control"], ["friction", "inclined-plane"]),
          topic("c8-sound", "Sound", "Waves", ["Connect vibration to sound.", "Compare pitch, loudness, frequency, and amplitude."], ["Wave source", "Audio oscillator", "Graph plotter"], ["wave-lab", "chladni-plate"]),
          topic("c8-light", "Light and Multiple Reflection", "Optics", ["Trace reflection paths.", "Explore mirrors, lenses, and dispersion.", "Predict images from two plane mirrors."], ["Light ray", "Mirrors", "Prism", "Kaleidoscope"], ["reflection-plane-mirror", "multiple-reflection", "prism-dispersion"]),
        ],
      },
      {
        id: "c8-electric-natural",
        title: "Electricity and Natural Phenomena",
        topics: [
          topic("c8-chemical-current", "Chemical Effects of Current", "Electricity", ["Classify conducting liquids.", "Model electroplating and electrolysis."], ["Battery", "Electrodes", "Solution beaker"], ["chemical-effects-current"]),
          topic("c8-static-lightning", "Static Electricity and Lightning", "Electricity", ["Explain charging by rubbing and transfer.", "Connect earthing to safety."], ["Charge", "Electric field region"], ["static-electricity"]),
        ],
      },
    ],
  },
  {
    id: "class-9",
    grade: 9,
    label: "Class 9",
    source: "CBSE Science 086 / Standard Science 2026-27",
    description: "Graph-rich mechanics, gravitation, work-energy, and sound for secondary science.",
    units: [
      {
        id: "c9-motion-force-work",
        title: "Motion, Force, and Work",
        marks: 27,
        topics: [
          topic("c9-motion", "Motion in One Dimension", "Mechanics", ["Analyse displacement, velocity, and acceleration.", "Use distance-time and velocity-time graphs."], ["Motion sensor", "Graph plotter"], ["uniform-motion"]),
          topic("c9-newton-laws", "Force and Newton's Laws", "Mechanics", ["Explain inertia and momentum.", "Apply F = ma to everyday situations."], ["Cart", "Force sensor", "Force arrow"], ["newton-s-second-law", "elastic-collision"]),
          topic("c9-gravitation", "Gravitation and Free Fall", "Mechanics", ["Compare mass and weight.", "Model free fall under gravity."], ["Ball", "Gravity control", "Stopwatch"], ["free-fall", "mass-and-weight"]),
          topic("c9-floatation", "Floatation and Buoyancy", "Fluid Mechanics", ["Apply Archimedes' principle.", "Relate density to floating and sinking."], ["Fluid region", "Blocks", "Spring balance"], ["buoyancy"]),
          topic("c9-work-energy", "Work, Energy, and Power", "Mechanics", ["Calculate work, kinetic energy, potential energy, and power.", "Explain conservation of energy."], ["Ramp", "Graph plotter", "Energy readout"], ["conservation-of-energy", "inclined-plane", "work-power"]),
          topic("c9-sound", "Sound", "Waves", ["Visualize longitudinal waves.", "Explain echo, ultrasound, and speed of sound."], ["Wave source", "Slinky", "Audio analyzer"], ["wave-lab", "sound-wave-anatomy", "sound-pitch-loudness", "echo-speed-sound"]),
          topic("c9-pendulum-intro", "Pendulum and Periodic Motion", "Oscillations", ["Observe how period depends on length, not mass.", "Connect periodic motion to time-keeping."], ["Pendulum", "Stopwatch"], ["simple-pendulum"]),
        ],
      },
    ],
  },
  {
    id: "class-10",
    grade: 10,
    label: "Class 10",
    source: "CBSE Science 086 2026-27",
    description: "Board-practical physics: optics, electricity, magnetic effects, and applications.",
    units: [
      {
        id: "c10-natural-phenomena",
        title: "Natural Phenomena",
        marks: 12,
        topics: [
          topic("c10-mirrors", "Reflection by Spherical Mirrors", "Optics", ["Construct ray diagrams.", "Use mirror formula and magnification."], ["Light ray", "Concave mirror", "Object screen"], ["mirror-formula"]),
          topic("c10-lenses", "Refraction by Lenses", "Optics", ["Compare convex and concave lens images.", "Use lens formula and power."], ["Convex lens", "Screen", "Ray diagram"], ["lens-formula"]),
          topic("c10-glass-prism", "Glass Slab and Prism", "Optics", ["Trace refraction through glass slab.", "Show dispersion through a prism."], ["Glass slab", "Prism", "Protractor"], ["glass-slab-refraction", "prism-dispersion"]),
          topic("c10-human-eye", "Human Eye and Defects", "Optics", ["Model myopia, hypermetropia, and correction.", "Relate lens power to correction."], ["Eye model", "Corrective lens"], ["human-eye-defects"]),
        ],
      },
      {
        id: "c10-effects-current",
        title: "Effects of Current",
        marks: 13,
        topics: [
          topic("c10-ohms-law", "Ohm's Law and V-I Graph", "Electricity", ["Manipulate voltage, current, and resistance.", "Plot V-I graph and determine resistance."], ["Battery", "Resistor", "Ammeter", "Voltmeter"], ["ohms-law"]),
          topic("c10-series-parallel", "Series and Parallel Resistance", "Electricity", ["Build series and parallel circuits.", "Calculate equivalent resistance."], ["Battery", "Resistors", "Wire", "Switch"], ["series-parallel-resistance"]),
          topic("c10-electric-power", "Heating Effect and Electric Power", "Electricity", ["Use P = VI and H = I^2Rt.", "Connect power rating to daily appliances."], ["Bulb", "Power meter", "Circuit solver"], ["heating-effect-current", "electric-power"]),
          topic("c10-magnetism", "Magnetic Effects of Current", "Magnetism", ["Visualize field around wire, coil, and solenoid.", "Apply Fleming's left-hand rule."], ["Bar magnet", "Coil", "Field lines"], ["magnetic-field-current", "electromagnet"]),
        ],
      },
      {
        id: "c10-energy-sources",
        title: "Sources of Energy",
        marks: 5,
        topics: [
          topic("c10-sources-energy", "Conventional and Renewable Energy Sources", "Energy", ["Compare output, efficiency, cost, and environmental impact.", "Choose suitable energy sources for daily situations."], ["Energy dashboard", "Efficiency slider", "Impact meter"], ["sources-of-energy"]),
        ],
      },
    ],
  },
  {
    id: "class-11",
    grade: 11,
    label: "Class 11",
    source: "CBSE Physics 042 2026-27",
    description: "Senior-secondary mechanics, matter, heat, thermodynamics, oscillations, and waves.",
    units: [
      {
        id: "c11-measurement-kinematics",
        title: "Measurement and Kinematics",
        marks: 23,
        topics: [
          topic("c11-units-errors", "Units, Dimensions, and Errors", "Measurement", ["Use SI units and dimensions.", "Estimate uncertainty and significant figures."], ["Vernier", "Screw gauge", "Error table"], ["measurement-errors"]),
          topic("c11-straight-line", "Motion in a Straight Line", "Mechanics", ["Connect calculus and graphs to motion.", "Solve uniformly accelerated motion."], ["Graph plotter", "Motion sensor"], ["uniform-motion", "free-fall"]),
          topic("c11-plane-motion", "Motion in a Plane", "Mechanics", ["Resolve vectors.", "Model projectile and circular motion."], ["Vector arrows", "Projectile launcher"], ["projectile-motion", "circular-motion", "vector-resolution"]),
        ],
      },
      {
        id: "c11-mechanics-core",
        title: "Laws, Energy, Rotation, and Gravitation",
        marks: 17,
        topics: [
          topic("c11-laws-motion", "Laws of Motion", "Mechanics", ["Apply Newton's laws with friction and circular motion.", "Use impulse and momentum conservation."], ["Cart", "Force sensor"], ["newton-s-second-law", "friction", "elastic-collision"]),
          topic("c11-energy-collisions", "Work, Energy, Power, and Collisions", "Mechanics", ["Apply work-energy theorem.", "Compare elastic and inelastic collisions."], ["Ramp", "Collision carts"], ["conservation-of-energy", "elastic-collision"]),
          topic("c11-rotation", "Rotational Motion", "Mechanics", ["Relate torque, angular momentum, and moment of inertia.", "Compare linear and rotational motion."], ["Disc", "Rod", "Wheel"], ["rotational-dynamics"]),
          topic("c11-gravitation", "Gravitation", "Astronomy", ["Use Kepler's laws.", "Compare orbital speed, escape speed, and satellite energy."], ["Planet orbit visualizer"], ["satellite-orbit"]),
        ],
      },
      {
        id: "c11-matter-thermal-waves",
        title: "Matter, Thermal Physics, Oscillations, and Waves",
        marks: 30,
        topics: [
          topic("c11-chaos-pendulum", "Chaotic and Coupled Oscillators", "Oscillations", ["Show sensitive dependence on initial conditions in a double pendulum.", "Contrast regular and chaotic motion."], ["Double pendulum", "Phase plot"], ["chaotic-coupled-oscillators"]),
          topic("c11-solids-fluids", "Solids and Fluids", "Fluid Mechanics", ["Model elasticity, viscosity, Bernoulli flow, and surface tension.", "Predict fluid pressure and lift."], ["Fluid region", "Spring", "Flow tube"], ["buoyancy", "hooke-s-law", "fluid-pressure", "bernoulli-fluid-flow"]),
          topic("c11-thermal", "Thermal Properties and Thermodynamics", "Thermodynamics", ["Explore expansion, calorimetry, heat transfer, and thermodynamic processes.", "Use PV diagrams."], ["Thermometer", "Gas container", "PV graph"], ["heat-transfer", "gas-laws", "thermodynamic-process"]),
          topic("c11-kinetic-theory", "Kinetic Theory", "Thermodynamics", ["Relate molecular motion to pressure and temperature.", "Visualize ideal gas assumptions."], ["Gas container", "Particle view"], ["gas-laws"]),
          topic("c11-oscillations-waves", "Oscillations and Waves", "Waves", ["Explore SHM, resonance, standing waves, and sound speed.", "Use frequency, wavelength, and phase."], ["Pendulum", "Spring", "Wave source"], ["simple-pendulum", "shm-spring", "wave-lab", "chladni-plate"]),
          topic("c11-shm-pendulum", "Simple Harmonic Motion - Pendulum and Spring", "Oscillations", ["Describe SHM with period, frequency, and amplitude.", "Compare pendulum and spring-mass oscillators."], ["Pendulum", "Spring", "Stopwatch", "Graph plotter"], ["simple-pendulum", "shm-spring"]),
          topic("c11-resonance", "Resonance and Forced Oscillations", "Oscillations", ["Explain resonance and damping.", "Identify natural frequency.", "Model forced oscillations and energy transfer."], ["Pendulum", "Wave source", "Audio oscillator"], ["chladni-plate", "shm-spring"]),
        ],
      },
    ],
  },
  {
    id: "class-12",
    grade: 12,
    label: "Class 12",
    source: "CBSE Physics 042 2026-27",
    description: "Electricity, magnetism, optics, modern physics, nuclei, and semiconductor electronics.",
    units: [
      {
        id: "c12-electricity-magnetism",
        title: "Electricity and Magnetism",
        marks: 33,
        topics: [
          topic("c12-electrostatics", "Electric Charges, Fields, Potential, and Capacitance", "Electricity", ["Visualize electric fields and equipotentials.", "Compare capacitors in series and parallel."], ["Charge", "Electric field region", "Capacitor"], ["static-electricity", "electrostatic-field-potential", "capacitor-lab"]),
          topic("c12-current", "Current Electricity", "Electricity", ["Use Ohm's law, drift velocity, Kirchhoff rules, and bridge circuits.", "Analyse cell internal resistance."], ["Circuit solver", "Meter bridge", "Potentiometer"], ["ohms-law", "series-parallel-resistance", "kirchhoff-circuit", "meter-bridge", "internal-resistance-cell"]),
          topic("c12-magnetic-effects", "Moving Charges and Magnetism", "Magnetism", ["Visualize Lorentz force and field due to currents.", "Model galvanometer conversion."], ["Bar magnet", "Current loop", "Galvanometer"], ["magnetic-field-current", "lorentz-force"]),
          topic("c12-emi-ac", "EMI and Alternating Current", "Electricity", ["Apply Faraday and Lenz laws.", "Explore AC, LCR resonance, transformer, and generator."], ["Coil", "Magnet", "AC source", "Phasor graph"], ["emi-faraday", "ac-generator", "transformer-lab", "ac-lcr-resonance"]),
        ],
      },
      {
        id: "c12-optics-modern",
        title: "Optics and Modern Physics",
        marks: 30,
        topics: [
          topic("c12-em-waves", "Electromagnetic Waves", "Waves", ["Connect displacement current to EM waves.", "Classify EM spectrum and uses."], ["Spectrum viewer"], ["em-spectrum"]),
          topic("c12-ray-optics", "Ray Optics and Instruments", "Optics", ["Model TIR, lenses, microscopes, and telescopes.", "Use ray diagrams quantitatively."], ["Light ray", "Lens", "Mirror", "Prism"], ["mirror-formula", "lens-formula", "glass-slab-refraction", "total-internal-reflection", "optical-instruments", "prism-dispersion"]),
          topic("c12-wave-optics", "Wave Optics", "Waves", ["Explore interference, diffraction, and polarization.", "Measure fringe width."], ["Wave source", "Slits", "Screen", "Polarizers"], ["single-slit-diffraction", "wave-lab", "young-double-slit", "polarization-lab"]),
          topic("c12-dual-atoms", "Dual Nature, Atoms, and Nuclei", "Modern Physics", ["Use photoelectric equation and de Broglie wavelength.", "Model Bohr transitions and nuclear change."], ["Photoelectric sim", "Bohr sim", "Nuclear chart"], ["photoelectric-equation", "de-broglie-wavelength", "bohr-model", "nuclear-decay"]),
          topic("c12-relativity-bridge", "Special Relativity Bridge", "Modern Physics", ["Compare proper time, measured time, and relativistic energy at high speed.", "Use spacetime diagrams to reason about simultaneity."], ["Light clock", "Spacetime graph", "Velocity slider"], ["special-relativity-bridge"]),
          topic("c12-semiconductors", "Semiconductor Electronics", "Electronics", ["Identify diode behavior.", "Build rectifier and simple logic circuits."], ["Diode", "Resistor", "AC source", "Logic gates"], ["semiconductor-diode", "logic-gates"]),
        ],
      },
    ],
  },
  {
    id: "class-13",
    grade: 13,
    label: "Undergraduate",
    source: "BSc / engineering physics bridge",
    description: "Core college physics as compact modules with room for deeper simulations.",
    units: [
      {
        id: "ug-core",
        title: "Core Physics",
        topics: [
          topic("ug-classical-mechanics", "Analytical Mechanics", "Mechanics", ["Model Lagrangian ideas, constraints, oscillations, and central forces."], ["Phase plot", "Pendulum", "Orbit"], ["simple-pendulum", "satellite-orbit", "rotational-dynamics"]),
          topic("ug-electrodynamics", "Electrodynamics", "Electricity", ["Connect fields, potentials, induction, waves, and circuits."], ["Field map", "Coil", "AC source"], ["electrostatic-field-potential", "emi-faraday", "ac-lcr-resonance"]),
          topic("ug-quantum", "Quantum Mechanics", "Modern Physics", ["Explore wave-particle duality, wells, tunneling, and atomic spectra."], ["Wave packet", "Barrier", "Bohr model"], ["photoelectric-equation", "de-broglie-wavelength", "bohr-model"]),
          topic("ug-stat-thermal", "Statistical and Thermal Physics", "Thermodynamics", ["Connect microscopic states to temperature, pressure, entropy, and heat flow."], ["Gas particles", "PV graph"], ["gas-laws", "thermodynamic-process", "heat-transfer"]),
          topic("ug-optics-waves", "Optics and Waves", "Waves", ["Compare interference, diffraction, polarization, and wave packets."], ["Slits", "Polarizer", "Spectrum"], ["young-double-slit", "single-slit-diffraction", "polarization-lab"]),
        ],
      },
    ],
  },
  {
    id: "class-14",
    grade: 14,
    label: "Postgraduate",
    source: "MSc physics overview",
    description: "Graduate topics grouped for targeted expansion without overloading the app.",
    units: [
      {
        id: "pg-advanced",
        title: "Advanced Physics",
        topics: [
          topic("pg-advanced-quantum", "Advanced Quantum Mechanics", "Modern Physics", ["Cover operators, spin, perturbation, scattering, and identical particles."], ["Operator lab", "Spin view", "Scattering plot"], ["advanced-quantum-operators"]),
          topic("pg-statistical-field", "Statistical Mechanics", "Thermodynamics", ["Compare ensembles, phase transitions, and transport."], ["Ensemble view", "Phase map"], ["statistical-ensemble-lab"]),
          topic("pg-condensed-matter", "Condensed Matter", "Electronics", ["Model bands, lattices, phonons, and semiconductors."], ["Band diagram", "Lattice model"], ["semiconductor-diode", "logic-gates"]),
          topic("pg-nuclear-particle", "Nuclear and Particle Physics", "Modern Physics", ["Explore decay, scattering, detectors, and conservation laws."], ["Decay chart", "Detector view"], ["nuclear-decay"]),
          topic("pg-plasma-astrophysics", "Plasma and Astrophysics", "Astronomy", ["Link charged fluids, stars, compact objects, and cosmology."], ["Orbit view", "Spectrum"], ["satellite-orbit", "em-spectrum"]),
        ],
      },
    ],
  },
  {
    id: "class-15",
    grade: 15,
    label: "PhD",
    source: "Research-level physics map",
    description: "Research directions shown as lightweight lanes, not textbook chapters.",
    units: [
      {
        id: "phd-research-lanes",
        title: "Research Lanes",
        topics: [
          topic("phd-computation", "Computational Physics", "Measurement", ["Run numerical models, uncertainty checks, and reproducible workflows."], ["Solver", "Graph plotter", "Notebook"], ["computational-physics-workflow"]),
          topic("phd-quantum-info", "Quantum Information", "Modern Physics", ["Explore qubits, gates, entanglement, and measurement."], ["Bloch sphere", "Logic gates"], ["logic-gates", "bohr-model"]),
          topic("phd-materials-devices", "Materials and Devices", "Electronics", ["Connect nanoscale structure to transport and device behavior."], ["Band model", "Device lab"], ["semiconductor-diode"]),
          topic("phd-high-energy", "High Energy and Cosmology", "Astronomy", ["Track symmetry, detectors, spacetime, and early-universe models."], ["Detector view", "Orbit view"], ["nuclear-decay", "satellite-orbit"]),
          topic("phd-biophysics-complexity", "Biophysics and Complex Systems", "Mechanics", ["Use physics tools on nonlinear, living, and networked systems."], ["Chaos view", "Phase graph"], ["simple-pendulum", "gas-laws"]),
        ],
      },
    ],
  },
];

export const classOptions = curriculum.map((item) => ({ id: item.id, grade: item.grade, label: item.label }));

export const domainSlugs: Record<string, string> = {
  Mechanics: "mechanics",
  Waves: "waves",
  Optics: "optics",
  Electricity: "electricity",
  Magnetism: "magnetism",
  Thermodynamics: "thermodynamics",
  "Fluid Mechanics": "fluid-mechanics",
  "Modern Physics": "modern-physics",
  Measurement: "measurement",
  Astronomy: "astronomy",
  Electronics: "electronics",
  Energy: "energy",
  Oscillations: "oscillations",
};

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function allCurriculumTopics() {
  return curriculum.flatMap((klass) =>
    klass.units.flatMap((unit) =>
      unit.topics.map((item) => ({
        ...item,
        classId: klass.id,
        classLabel: klass.label,
        grade: klass.grade,
        unitId: unit.id,
        unitTitle: unit.title,
      }))
    )
  );
}

export function findTopicsByDomainSlug(slug: string) {
  return allCurriculumTopics().filter((item) => domainSlugs[item.domain] === slug || slugify(item.domain) === slug);
}

export function findClassById(id: string) {
  return curriculum.find((item) => item.id === id);
}

export function curriculumCoverageStats() {
  const topics = allCurriculumTopics();
  const interactive = topics.filter((item) => item.experimentIds.length > 0 || item.stage !== "concept").length;
  return {
    classes: curriculum.length,
    units: curriculum.reduce((sum, item) => sum + item.units.length, 0),
    topics: topics.length,
    interactive,
  };
}

const band = (
  id: string,
  label: string,
  grades: number[],
  focus: string[],
  topicIds: string[],
  experimentIds: string[],
  status: SyllabusFrameworkBand["status"] = experimentIds.length ? "covered" : "needs-lab"
): SyllabusFrameworkBand => ({ id, label, grades, focus, topicIds, experimentIds, status });

export const syllabusFrameworks: SyllabusFramework[] = [
  {
    id: "ap-state",
    label: "AP State",
    source: "AP SCERT school science / physical science and senior-secondary physics pathway",
    note: "Mapped as AP State Class 6-10 physics strands plus 11-12 intermediate physics bridge.",
    bands: [
      band("ap-6-7", "Classes 6-7", [6, 7], ["motion", "heat", "light", "circuits", "magnets"], ["c6-motion-measurement", "c6-light-shadows", "c6-simple-circuits", "c7-heat-temperature", "c7-current-effects"], ["uniform-motion", "reflection-plane-mirror", "ohms-law", "heat-and-temperature", "electromagnet"]),
      band("ap-8", "Class 8", [8], ["force", "pressure", "friction", "sound", "light"], ["c8-force-effects", "c8-pressure", "c8-friction", "c8-sound", "c8-light"], ["newton-s-second-law", "force-and-pressure", "friction", "sound-pitch-loudness", "multiple-reflection"]),
      band("ap-9-10", "Classes 9-10", [9, 10], ["motion", "gravitation", "work-energy", "optics", "electricity", "magnetism"], ["c9-motion", "c9-gravitation", "c9-work-energy", "c10-mirrors", "c10-ohms-law", "c10-magnetism"], ["free-fall", "mass-and-weight", "conservation-of-energy", "mirror-formula", "ohms-law", "magnetic-field-current"]),
      band("ap-11-12", "Classes 11-12", [11, 12], ["mechanics", "thermal", "waves", "electromagnetism", "optics", "modern"], ["c11-plane-motion", "c11-thermal", "c11-oscillations-waves", "c12-emi-ac", "c12-ray-optics", "c12-dual-atoms"], ["projectile-motion", "gas-laws", "wave-lab", "emi-faraday", "lens-formula", "bohr-model"]),
    ],
  },
  {
    id: "cbse",
    label: "CBSE",
    source: "CBSE/NCERT middle science, Science 086, and Physics 042",
    note: "Mapped to CBSE Class 6-8 science foundations, IX-X Science, and XI-XII Physics.",
    bands: [
      band("cbse-6-8", "Classes 6-8", [6, 7, 8], ["measurement", "motion", "heat", "light", "sound", "current effects"], ["c6-motion-measurement", "c7-speed", "c7-heat-transfer", "c8-sound", "c8-light", "c8-chemical-current"], ["measurement-errors", "uniform-motion", "heat-transfer", "sound-pitch-loudness", "prism-dispersion", "chemical-effects-current"]),
      band("cbse-9-10", "Classes 9-10", [9, 10], ["motion", "forces", "gravitation", "work", "sound", "optics", "electricity"], ["c9-motion", "c9-newton-laws", "c9-gravitation", "c9-work-energy", "c9-sound", "c10-lenses", "c10-series-parallel"], ["uniform-motion", "newton-s-second-law", "free-fall", "work-power", "sound-wave-anatomy", "lens-formula", "series-parallel-resistance"]),
      band("cbse-11", "Class 11", [11], ["measurement", "kinematics", "laws", "rotation", "thermal", "waves"], ["c11-units-errors", "c11-plane-motion", "c11-laws-motion", "c11-rotation", "c11-thermal", "c11-oscillations-waves"], ["measurement-errors", "projectile-motion", "friction", "rotational-dynamics", "thermodynamic-process", "wave-lab"]),
      band("cbse-12", "Class 12", [12], ["electrostatics", "current", "magnetism", "AC", "optics", "modern", "semiconductors"], ["c12-electrostatics", "c12-current", "c12-magnetic-effects", "c12-emi-ac", "c12-wave-optics", "c12-dual-atoms", "c12-semiconductors"], ["capacitor-lab", "meter-bridge", "lorentz-force", "ac-lcr-resonance", "young-double-slit", "photoelectric-equation", "logic-gates"]),
    ],
  },
  {
    id: "cambridge",
    label: "Cambridge",
    source: "Cambridge Lower Secondary Science, IGCSE Physics 0625, and AS/A Level bridge",
    note: "IGCSE itself is normally 9-10; this lane shows the 6-12 Cambridge physics pathway.",
    bands: [
      band("cambridge-6-8", "Lower Secondary", [6, 7, 8], ["forces", "energy", "light", "sound", "electricity", "space"], ["c6-light-shadows", "c7-speed", "c8-force-effects", "c8-sound", "c8-static-lightning"], ["reflection-plane-mirror", "uniform-motion", "newton-s-second-law", "sound-pitch-loudness", "static-electricity"]),
      band("cambridge-igcse", "IGCSE 0625", [9, 10], ["motion forces energy", "thermal", "waves", "electricity magnetism", "nuclear", "space"], ["c9-motion", "c9-work-energy", "c11-thermal", "c12-wave-optics", "c12-current", "c12-dual-atoms", "c11-gravitation"], ["free-fall", "conservation-of-energy", "heat-transfer", "single-slit-diffraction", "ohms-law", "nuclear-decay", "satellite-orbit"]),
      band("cambridge-as-a", "AS/A Level Bridge", [11, 12], ["mechanics", "materials", "fields", "waves", "quantum", "nuclear"], ["c11-laws-motion", "c11-solids-fluids", "c12-electrostatics", "c12-ray-optics", "c12-dual-atoms"], ["elastic-collision", "hooke-s-law", "electrostatic-field-potential", "total-internal-reflection", "de-broglie-wavelength"]),
    ],
  },
  {
    id: "ib",
    label: "IB",
    source: "IB MYP Sciences and DP Physics first assessment 2025",
    note: "Mapped as MYP 1-5 for Classes 6-10 and DP Physics SL/HL for Classes 11-12.",
    bands: [
      band("ib-myp-1-3", "MYP 1-3", [6, 7, 8], ["systems", "models", "energy", "waves", "forces"], ["c6-motion-measurement", "c7-heat-temperature", "c8-force-effects", "c8-sound", "c8-light"], ["uniform-motion", "heat-and-temperature", "force-and-pressure", "wave-lab", "reflection-plane-mirror"]),
      band("ib-myp-4-5", "MYP 4-5", [9, 10], ["mechanics", "energy", "fields", "electric circuits", "optics"], ["c9-newton-laws", "c9-work-energy", "c10-ohms-law", "c10-magnetism", "c10-lenses"], ["newton-s-second-law", "conservation-of-energy", "ohms-law", "electromagnet", "lens-formula"]),
      band("ib-dp", "DP Physics", [11, 12], ["space time motion", "particulate matter", "wave behaviour", "fields", "nuclear quantum"], ["c11-plane-motion", "c11-thermal", "c12-wave-optics", "c12-electrostatics", "c12-dual-atoms"], ["projectile-motion", "gas-laws", "young-double-slit", "capacitor-lab", "bohr-model"]),
      band("ib-dp-hl", "DP HL Extensions", [12], ["rotational motion", "induction", "quantum", "relativity bridge"], ["c11-rotation", "c12-emi-ac", "c12-dual-atoms", "c12-relativity-bridge"], ["rotational-dynamics", "transformer-lab", "photoelectric-equation", "special-relativity-bridge"]),
    ],
  },
];

export function syllabusFrameworkCoverage() {
  return syllabusFrameworks.map((framework) => {
    const bands = framework.bands.map((item) => ({
      ...item,
      mappedCount: item.experimentIds.length,
      gapCount: item.status === "covered" ? 0 : Math.max(1, item.focus.length - item.experimentIds.length),
    }));
    return {
      ...framework,
      bands,
      mappedCount: bands.reduce((sum, item) => sum + item.mappedCount, 0),
      gapCount: bands.reduce((sum, item) => sum + item.gapCount, 0),
    };
  });
}
