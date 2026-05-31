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
          topic("c7-reflection", "Reflection by Mirrors", "Optics", ["Trace incident and reflected rays.", "Compare images in plane and spherical mirrors."], ["Light ray", "Plane mirror", "Concave mirror"], ["reflection-plane-mirror"]),
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
          topic("c8-light", "Light and Multiple Reflection", "Optics", ["Trace reflection paths.", "Explore mirrors, lenses, and dispersion."], ["Light ray", "Mirrors", "Prism"], ["reflection-plane-mirror", "prism-dispersion"]),
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
          topic("c9-sound", "Sound", "Waves", ["Visualize longitudinal waves.", "Explain echo, ultrasound, and speed of sound."], ["Wave source", "Slinky", "Audio analyzer"], ["wave-lab", "sound-pitch-loudness", "echo-speed-sound"]),
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
          topic("c10-human-eye", "Human Eye and Defects", "Optics", ["Model myopia, hypermetropia, and correction.", "Relate lens power to correction."], ["Eye model", "Corrective lens"]),
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
          topic("c11-solids-fluids", "Solids and Fluids", "Fluid Mechanics", ["Model elasticity, viscosity, Bernoulli flow, and surface tension.", "Predict fluid pressure and lift."], ["Fluid region", "Spring", "Flow tube"], ["buoyancy", "hooke-s-law", "fluid-pressure", "bernoulli-fluid-flow"]),
          topic("c11-thermal", "Thermal Properties and Thermodynamics", "Thermodynamics", ["Explore expansion, calorimetry, heat transfer, and thermodynamic processes.", "Use PV diagrams."], ["Thermometer", "Gas container", "PV graph"], ["heat-transfer", "gas-laws", "thermodynamic-process"]),
          topic("c11-kinetic-theory", "Kinetic Theory", "Thermodynamics", ["Relate molecular motion to pressure and temperature.", "Visualize ideal gas assumptions."], ["Gas container", "Particle view"], ["gas-laws"]),
          topic("c11-oscillations-waves", "Oscillations and Waves", "Waves", ["Explore SHM, resonance, standing waves, and sound speed.", "Use frequency, wavelength, and phase."], ["Pendulum", "Spring", "Wave source"], ["simple-pendulum", "shm-spring", "wave-lab", "chladni-plate"]),
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
          topic("c12-current", "Current Electricity", "Electricity", ["Use Ohm's law, drift velocity, Kirchhoff rules, and bridge circuits.", "Analyse cell internal resistance."], ["Circuit solver", "Meter bridge", "Potentiometer"], ["ohms-law", "series-parallel-resistance", "kirchhoff-circuit"]),
          topic("c12-magnetic-effects", "Moving Charges and Magnetism", "Magnetism", ["Visualize Lorentz force and field due to currents.", "Model galvanometer conversion."], ["Bar magnet", "Current loop", "Galvanometer"], ["magnetic-field-current", "lorentz-force"]),
          topic("c12-emi-ac", "EMI and Alternating Current", "Electricity", ["Apply Faraday and Lenz laws.", "Explore AC, LCR resonance, transformer, and generator."], ["Coil", "Magnet", "AC source", "Phasor graph"], ["emi-faraday", "ac-lcr-resonance"]),
        ],
      },
      {
        id: "c12-optics-modern",
        title: "Optics and Modern Physics",
        marks: 30,
        topics: [
          topic("c12-em-waves", "Electromagnetic Waves", "Waves", ["Connect displacement current to EM waves.", "Classify EM spectrum and uses."], ["Spectrum viewer"], ["em-spectrum"]),
          topic("c12-ray-optics", "Ray Optics and Instruments", "Optics", ["Model TIR, lenses, microscopes, and telescopes.", "Use ray diagrams quantitatively."], ["Light ray", "Lens", "Mirror", "Prism"], ["mirror-formula", "lens-formula", "glass-slab-refraction", "prism-dispersion"]),
          topic("c12-wave-optics", "Wave Optics", "Waves", ["Explore interference, diffraction, and polarization.", "Measure fringe width."], ["Wave source", "Slits", "Screen"], ["single-slit-diffraction", "wave-lab", "young-double-slit"]),
          topic("c12-dual-atoms", "Dual Nature, Atoms, and Nuclei", "Modern Physics", ["Use photoelectric equation and de Broglie wavelength.", "Model Bohr transitions and nuclear change."], ["Photoelectric sim", "Bohr sim", "Nuclear chart"], ["photoelectric-equation", "nuclear-decay"]),
          topic("c12-semiconductors", "Semiconductor Electronics", "Electronics", ["Identify diode behavior.", "Build rectifier and simple logic circuits."], ["Diode", "Resistor", "AC source", "Logic gates"], ["semiconductor-diode"]),
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
