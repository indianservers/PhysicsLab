"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// outputs/page-catalog-20261017/extract.ts
var import_node_fs = __toESM(require("node:fs"), 1);

// src/lib/clientDemos.ts
var clientDemos = [
  { rank: 1, title: "Pro Lab Mission Program", path: "/pro-lab", icon: "rocket", category: "Flagship", duration: "4 min", accent: "amber", pitch: "A professional operations suite with six advanced scientific missions, procedures, anomalies, telemetry, and post-mission reporting.", show: ["Open the mission directory", "Enter launch operations", "Inject and resolve an anomaly"] },
  { rank: 2, title: "Build & Launch a Rocket", path: "/pro-lab/launch-vehicle", icon: "rocket", category: "Flagship", duration: "7 min", accent: "cyan", pitch: "Learners integrate the vehicle, load propellants, complete authentic go/no-go checks, and fly a virtual ascent.", show: ["Drag components into stack order", "Explain the purpose of each step", "Complete countdown and launch"] },
  { rank: 3, title: "Rocket Parts & Systems", path: "/rocket-lab/parts", icon: "settings", category: "Flagship", duration: "6 min", accent: "cyan", pitch: "A 225-component aerospace museum and engineering library with cutaway location, functional flows, inspection, and Build Lab integration.", show: ["Search IMU or turbopump", "Open engineering tabs", "Add a compatible part to the build"] },
  { rank: 4, title: "Scale of the Universe", path: "/physics/scale-of-universe", icon: "ruler", category: "Immersive Science", duration: "4 min", accent: "violet", pitch: "A powers-of-ten journey from subatomic scales to the observable universe with comparisons, guided journeys, and classroom controls.", show: ["Zoom across orders of magnitude", "Compare familiar objects", "Run a guided journey"] },
  { rank: 5, title: "String Theory 3D", path: "/string-theory", icon: "wave", category: "Immersive Science", duration: "3 min", accent: "violet", pitch: "Interactive theoretical-physics visuals connect vibrating modes, extra dimensions, and quantum-gravity concepts without overselling certainty.", show: ["Change vibration mode", "Inspect extra dimensions", "Open evidence boundaries"] },
  { rank: 6, title: "Particle Physics Explorer", path: "/particle-physics", icon: "atom", category: "Immersive Science", duration: "4 min", accent: "violet", pitch: "A visual Standard Model explorer covering quarks, leptons, force carriers, the Higgs field, and key interactions.", show: ["Open the Standard Model", "Inspect a particle family", "Compare interaction roles"] },
  { rank: 7, title: "Quantum Laboratory", path: "/quantum", icon: "atom", category: "Interactive Lab", duration: "4 min", accent: "violet", pitch: "Advanced experiments combine visual models, equations, adjustable parameters, and scientific interpretation.", show: ["Select a quantum experiment", "Change a parameter", "Connect graph and model"] },
  { rank: 8, title: "Earth Atmosphere Explorer", path: "/atmosphere", icon: "orbit", category: "Immersive Science", duration: "3 min", accent: "green", pitch: "An interactive vertical journey through atmospheric layers, phenomena, vehicles, and physical conditions.", show: ["Move between layers", "Compare temperature and altitude", "Inspect aurora and orbital regions"] },
  { rank: 9, title: "Astrophysics Observatory", path: "/astrophysics?concept=black-hole-lensing", icon: "orbit", category: "Immersive Science", duration: "4 min", accent: "violet", pitch: "Client-ready space science modules cover black-hole lensing, stellar evolution, galaxies, and the cosmic timeline.", show: ["Open black-hole lensing", "Change the observing model", "Visit the galaxy atlas"] },
  { rank: 10, title: "100+ Physics Innovations", path: "/physics-innovations", icon: "spark", category: "Education Platform", duration: "3 min", accent: "amber", pitch: "A searchable discovery timeline links major ideas, instruments, inventions, and their real-world impact.", show: ["Search laser or transistor", "Filter the timeline", "Open a milestone story"] },
  { rank: 11, title: "Chladni Plate", path: "/experiments/chladni-plate", icon: "wave", category: "Interactive Lab", duration: "3 min", accent: "cyan", pitch: "A memorable standing-wave demonstration where changing resonance produces increasingly complex nodal patterns.", show: ["Enable the visual model", "Sweep frequency", "Explain why particles collect at nodes"] },
  { rank: 12, title: "Single-Slit Diffraction", path: "/experiments/single-slit-diffraction", icon: "prism", category: "Interactive Lab", duration: "3 min", accent: "cyan", pitch: "Live optics visualization connects slit width and wavelength to diffraction geometry, graphs, formulas, and observations.", show: ["Change slit width", "Measure central maximum", "Compare model and equation"] },
  { rank: 13, title: "Video Motion Analysis", path: "/video", icon: "eye", category: "Interactive Lab", duration: "4 min", accent: "green", pitch: "Turn recorded motion into calibrated measurements, tracked positions, and evidence-ready analysis.", show: ["Load a sample", "Set scale and track motion", "Review the generated graph"] },
  { rank: 14, title: "Knowledge Graph", path: "/graph", icon: "orbit", category: "Education Platform", duration: "3 min", accent: "green", pitch: "A connected map shows how concepts, experiments, formulas, and curriculum outcomes reinforce one another.", show: ["Select a concept node", "Trace related experiments", "Open a linked learning asset"] },
  { rank: 15, title: "Teacher Insights & Deployment", path: "/insights-center", icon: "teacher", category: "Education Platform", duration: "5 min", accent: "green", pitch: "Close the presentation with assignments, readiness analytics, intervention signals, accessibility, and release-quality evidence.", show: ["Review class readiness", "Open an intervention", "Show validation and accessibility gates"] }
];

// src/lib/curriculum.ts
var topic = (id, title, domain, outcomes, tools, experimentIds = [], stage = experimentIds.length ? "experiment" : "concept") => ({ id, title, domain, outcomes, tools, experimentIds, stage });
var curriculum = [
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
          topic("c6-magnets", "Magnets", "Magnetism", ["Compare poles, attraction, repulsion, and compass direction."], ["Bar magnet", "Compass"], ["magnetic-field-current"])
        ]
      }
    ]
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
          topic("c7-heat-transfer", "Transfer of Heat", "Thermodynamics", ["Compare conduction, convection, and radiation.", "Predict heat flow direction."], ["Conduction bar", "Convection cell", "Radiation lamp"], ["heat-transfer"])
        ]
      },
      {
        id: "c7-motion-time",
        title: "Motion and Time",
        topics: [
          topic("c7-speed", "Speed, Distance, and Time", "Mechanics", ["Calculate speed from distance and time.", "Compare uniform and non-uniform motion."], ["Stopwatch", "Ruler", "Motion graph"], ["uniform-motion"]),
          topic("c7-distance-time", "Distance-Time Graphs", "Mechanics", ["Interpret a distance-time graph.", "Relate slope to speed."], ["Graph plotter", "Motion sensor"], ["uniform-motion"])
        ]
      },
      {
        id: "c7-current-effects",
        title: "Electric Current and Its Effects",
        topics: [
          topic("c7-heating-effect", "Heating Effect of Current", "Electricity", ["Explain why wires and bulbs heat up.", "Relate current to heating."], ["Battery", "Bulb", "Switch", "Wire"], ["heating-effect-current"]),
          topic("c7-magnetic-effect", "Magnetic Effect and Electromagnet", "Magnetism", ["Show current can produce magnetism.", "Build a simple electromagnet model."], ["Battery", "Coil", "Compass", "Iron core"], ["electromagnet"])
        ]
      },
      {
        id: "c7-light",
        title: "Light",
        topics: [
          topic("c7-reflection", "Reflection by Mirrors", "Optics", ["Trace incident and reflected rays.", "Compare images in plane and spherical mirrors.", "Explain straight-line travel of light with shadows."], ["Light ray", "Plane mirror", "Concave mirror", "Shadow screen"], ["reflection-plane-mirror", "shadows-eclipses"]),
          topic("c7-lenses", "Images by Lenses", "Optics", ["Observe how lenses bend light.", "Describe image size and orientation."], ["Light ray", "Convex lens"], ["lens-formula"])
        ]
      }
    ]
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
          topic("c8-pressure", "Pressure in Solids and Fluids", "Fluid Mechanics", ["Relate pressure to force and area.", "Compare pressure at different depths."], ["Fluid region", "Pressure gauge"], ["force-and-pressure", "fluid-pressure"])
        ]
      },
      {
        id: "c8-friction-sound-light",
        title: "Friction, Sound, and Light",
        topics: [
          topic("c8-friction", "Friction", "Mechanics", ["Compare static, sliding, and rolling friction.", "Explain useful and harmful friction."], ["Block", "Ramp", "Surface control"], ["friction", "inclined-plane"]),
          topic("c8-sound", "Sound", "Waves", ["Connect vibration to sound.", "Compare pitch, loudness, frequency, and amplitude."], ["Wave source", "Audio oscillator", "Graph plotter"], ["wave-lab", "chladni-plate"]),
          topic("c8-light", "Light and Multiple Reflection", "Optics", ["Trace reflection paths.", "Explore mirrors, lenses, and dispersion.", "Predict images from two plane mirrors."], ["Light ray", "Mirrors", "Prism", "Kaleidoscope"], ["reflection-plane-mirror", "multiple-reflection", "prism-dispersion"])
        ]
      },
      {
        id: "c8-electric-natural",
        title: "Electricity and Natural Phenomena",
        topics: [
          topic("c8-chemical-current", "Chemical Effects of Current", "Electricity", ["Classify conducting liquids.", "Model electroplating and electrolysis."], ["Battery", "Electrodes", "Solution beaker"], ["chemical-effects-current"]),
          topic("c8-static-lightning", "Static Electricity and Lightning", "Electricity", ["Explain charging by rubbing and transfer.", "Connect earthing to safety."], ["Charge", "Electric field region"], ["static-electricity"])
        ]
      }
    ]
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
          topic("c9-pendulum-intro", "Pendulum and Periodic Motion", "Oscillations", ["Observe how period depends on length, not mass.", "Connect periodic motion to time-keeping."], ["Pendulum", "Stopwatch"], ["simple-pendulum"])
        ]
      }
    ]
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
          topic("c10-human-eye", "Human Eye and Defects", "Optics", ["Model myopia, hypermetropia, and correction.", "Relate lens power to correction."], ["Eye model", "Corrective lens"], ["human-eye-defects"])
        ]
      },
      {
        id: "c10-effects-current",
        title: "Effects of Current",
        marks: 13,
        topics: [
          topic("c10-ohms-law", "Ohm's Law and V-I Graph", "Electricity", ["Manipulate voltage, current, and resistance.", "Plot V-I graph and determine resistance."], ["Battery", "Resistor", "Ammeter", "Voltmeter"], ["ohms-law"]),
          topic("c10-series-parallel", "Series and Parallel Resistance", "Electricity", ["Build series and parallel circuits.", "Calculate equivalent resistance."], ["Battery", "Resistors", "Wire", "Switch"], ["series-parallel-resistance"]),
          topic("c10-electric-power", "Heating Effect and Electric Power", "Electricity", ["Use P = VI and H = I^2Rt.", "Connect power rating to daily appliances."], ["Bulb", "Power meter", "Circuit solver"], ["heating-effect-current", "electric-power"]),
          topic("c10-magnetism", "Magnetic Effects of Current", "Magnetism", ["Visualize field around wire, coil, and solenoid.", "Apply Fleming's left-hand rule."], ["Bar magnet", "Coil", "Field lines"], ["magnetic-field-current", "electromagnet"])
        ]
      },
      {
        id: "c10-energy-sources",
        title: "Sources of Energy",
        marks: 5,
        topics: [
          topic("c10-sources-energy", "Conventional and Renewable Energy Sources", "Energy", ["Compare output, efficiency, cost, and environmental impact.", "Choose suitable energy sources for daily situations."], ["Energy dashboard", "Efficiency slider", "Impact meter"], ["sources-of-energy"])
        ]
      }
    ]
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
          topic("c11-plane-motion", "Motion in a Plane", "Mechanics", ["Resolve vectors.", "Model projectile and circular motion."], ["Vector arrows", "Projectile launcher"], ["projectile-motion", "circular-motion", "vector-resolution"])
        ]
      },
      {
        id: "c11-mechanics-core",
        title: "Laws, Energy, Rotation, and Gravitation",
        marks: 17,
        topics: [
          topic("c11-laws-motion", "Laws of Motion", "Mechanics", ["Apply Newton's laws with friction and circular motion.", "Use impulse and momentum conservation."], ["Cart", "Force sensor"], ["newton-s-second-law", "friction", "elastic-collision"]),
          topic("c11-energy-collisions", "Work, Energy, Power, and Collisions", "Mechanics", ["Apply work-energy theorem.", "Compare elastic and inelastic collisions."], ["Ramp", "Collision carts"], ["conservation-of-energy", "elastic-collision"]),
          topic("c11-rotation", "Rotational Motion", "Mechanics", ["Relate torque, angular momentum, and moment of inertia.", "Compare linear and rotational motion."], ["Disc", "Rod", "Wheel"], ["rotational-dynamics"]),
          topic("c11-gravitation", "Gravitation", "Astronomy", ["Use Kepler's laws.", "Compare orbital speed, escape speed, and satellite energy."], ["Planet orbit visualizer"], ["satellite-orbit"])
        ]
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
          topic("c11-resonance", "Resonance and Forced Oscillations", "Oscillations", ["Explain resonance and damping.", "Identify natural frequency.", "Model forced oscillations and energy transfer."], ["Pendulum", "Wave source", "Audio oscillator"], ["chladni-plate", "shm-spring"])
        ]
      }
    ]
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
          topic("c12-emi-ac", "EMI and Alternating Current", "Electricity", ["Apply Faraday and Lenz laws.", "Explore AC, LCR resonance, transformer, and generator."], ["Coil", "Magnet", "AC source", "Phasor graph"], ["emi-faraday", "ac-generator", "transformer-lab", "ac-lcr-resonance"])
        ]
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
          topic("c12-semiconductors", "Semiconductor Electronics", "Electronics", ["Identify diode behavior.", "Build rectifier and simple logic circuits."], ["Diode", "Resistor", "AC source", "Logic gates"], ["semiconductor-diode", "logic-gates"])
        ]
      }
    ]
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
          topic("ug-optics-waves", "Optics and Waves", "Waves", ["Compare interference, diffraction, polarization, and wave packets."], ["Slits", "Polarizer", "Spectrum"], ["young-double-slit", "single-slit-diffraction", "polarization-lab"])
        ]
      }
    ]
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
          topic("pg-plasma-astrophysics", "Plasma and Astrophysics", "Astronomy", ["Link charged fluids, stars, compact objects, and cosmology."], ["Orbit view", "Spectrum"], ["satellite-orbit", "em-spectrum"])
        ]
      }
    ]
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
          topic("phd-biophysics-complexity", "Biophysics and Complex Systems", "Mechanics", ["Use physics tools on nonlinear, living, and networked systems."], ["Chaos view", "Phase graph"], ["simple-pendulum", "gas-laws"])
        ]
      }
    ]
  }
];
var classOptions = curriculum.map((item) => ({ id: item.id, grade: item.grade, label: item.label }));
var domainSlugs = {
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
  Oscillations: "oscillations"
};
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function allCurriculumTopics() {
  return curriculum.flatMap(
    (klass) => klass.units.flatMap(
      (unit) => unit.topics.map((item) => ({
        ...item,
        classId: klass.id,
        classLabel: klass.label,
        grade: klass.grade,
        unitId: unit.id,
        unitTitle: unit.title
      }))
    )
  );
}
var band = (id, label, grades, focus, topicIds, experimentIds, status = experimentIds.length ? "partial" : "upcoming") => ({ id, label, grades, focus, topicIds, experimentIds, status });
var syllabusFrameworks = [
  {
    id: "ap-state",
    label: "AP State",
    source: "AP SCERT school science / physical science and senior-secondary physics pathway",
    note: "Mapped as AP State Class 6-10 physics strands plus 11-12 intermediate physics bridge.",
    bands: [
      band("ap-6-7", "Classes 6-7", [6, 7], ["motion", "heat", "light", "circuits", "magnets"], ["c6-motion-measurement", "c6-light-shadows", "c6-simple-circuits", "c7-heat-temperature", "c7-current-effects"], ["uniform-motion", "reflection-plane-mirror", "ohms-law", "heat-and-temperature", "electromagnet"]),
      band("ap-8", "Class 8", [8], ["force", "pressure", "friction", "sound", "light"], ["c8-force-effects", "c8-pressure", "c8-friction", "c8-sound", "c8-light"], ["newton-s-second-law", "force-and-pressure", "friction", "sound-pitch-loudness", "multiple-reflection"]),
      band("ap-9-10", "Classes 9-10", [9, 10], ["motion", "gravitation", "work-energy", "optics", "electricity", "magnetism"], ["c9-motion", "c9-gravitation", "c9-work-energy", "c10-mirrors", "c10-ohms-law", "c10-magnetism"], ["free-fall", "mass-and-weight", "conservation-of-energy", "mirror-formula", "ohms-law", "magnetic-field-current"]),
      band("ap-11-12", "Classes 11-12", [11, 12], ["mechanics", "thermal", "waves", "electromagnetism", "optics", "modern"], ["c11-plane-motion", "c11-thermal", "c11-oscillations-waves", "c12-emi-ac", "c12-ray-optics", "c12-dual-atoms"], ["projectile-motion", "gas-laws", "wave-lab", "emi-faraday", "lens-formula", "bohr-model"])
    ]
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
      band("cbse-12", "Class 12", [12], ["electrostatics", "current", "magnetism", "AC", "optics", "modern", "semiconductors"], ["c12-electrostatics", "c12-current", "c12-magnetic-effects", "c12-emi-ac", "c12-wave-optics", "c12-dual-atoms", "c12-semiconductors"], ["capacitor-lab", "meter-bridge", "lorentz-force", "ac-lcr-resonance", "young-double-slit", "photoelectric-equation", "logic-gates"])
    ]
  },
  {
    id: "telangana-state",
    label: "Telangana State",
    source: "Telangana SCERT school science and physical-science textbook pathway",
    note: "Official chapter, activity, and practical mapping is planned. Related app content remains partial until item-level equivalence is reviewed.",
    bands: [
      band("ts-6-8", "Classes 6-8", [6, 7, 8], ["measurement", "motion", "force", "heat", "light", "sound", "electricity"], [], [], "upcoming"),
      band("ts-9-10", "Classes 9-10", [9, 10], ["mechanics", "thermal physics", "waves", "optics", "electricity", "magnetism"], [], [], "upcoming"),
      band("ts-11-12", "Intermediate", [11, 12], ["mechanics", "properties of matter", "thermodynamics", "waves", "electromagnetism", "optics", "modern physics"], [], [], "upcoming")
    ]
  },
  {
    id: "kerala-state",
    label: "Kerala State",
    source: "Kerala SCERT Curriculum 2024 and revised Physics textbooks",
    note: "Dedicated Physics chapter and activity mapping for Standards IX-X is upcoming; present simulations are related content, not completed equivalence.",
    bands: [
      band("kerala-6-8", "Classes 6-8", [6, 7, 8], ["measurement", "forces", "energy", "heat", "light", "sound", "electricity"], [], [], "upcoming"),
      band("kerala-9-10", "Physics IX-X", [9, 10], ["mechanics", "energy", "waves", "optics", "electricity", "magnetism", "electronics"], [], [], "upcoming"),
      band("kerala-11-12", "Higher Secondary", [11, 12], ["mechanics", "matter", "thermal physics", "waves", "fields", "optics", "modern physics"], [], [], "upcoming")
    ]
  },
  {
    id: "tamil-nadu-state",
    label: "Tamil Nadu",
    source: "Tamil Nadu state science and Physics textbook pathway",
    note: "Textbook-year, chapter, learning-outcome, and prescribed-practical records are upcoming.",
    bands: [
      band("tn-6-8", "Classes 6-8", [6, 7, 8], ["measurement", "motion", "heat", "light", "sound", "electricity", "space"], [], [], "upcoming"),
      band("tn-9-10", "Classes 9-10", [9, 10], ["mechanics", "fluids", "thermal physics", "optics", "electricity", "magnetism"], [], [], "upcoming"),
      band("tn-11-12", "Higher Secondary", [11, 12], ["mechanics", "properties of matter", "heat", "waves", "electromagnetism", "optics", "atomic and nuclear physics", "electronics"], [], [], "upcoming")
    ]
  },
  {
    id: "karnataka-state",
    label: "Karnataka",
    source: "Karnataka state science and PUC Physics pathway",
    note: "Official state-textbook and PUC theory/practical extraction is upcoming; no coverage claim is made yet.",
    bands: [
      band("ka-6-8", "Classes 6-8", [6, 7, 8], ["motion", "force", "heat", "light", "sound", "electricity"], [], [], "upcoming"),
      band("ka-9-10", "Classes 9-10", [9, 10], ["mechanics", "energy", "waves", "optics", "electricity", "magnetism"], [], [], "upcoming"),
      band("ka-11-12", "PUC Physics", [11, 12], ["mechanics", "matter", "thermodynamics", "oscillations", "electromagnetism", "optics", "modern physics", "electronics"], [], [], "upcoming")
    ]
  },
  {
    id: "maharashtra-state",
    label: "Maharashtra",
    source: "Maharashtra Balbharati science and Physics XI-XII pathway",
    note: "Balbharati sequencing, activities, and practical equivalence are upcoming and remain separate from generic CBSE mappings.",
    bands: [
      band("mh-6-8", "Classes 6-8", [6, 7, 8], ["measurement", "motion", "force", "energy", "light", "sound", "electricity"], [], [], "upcoming"),
      band("mh-9-10", "Classes 9-10", [9, 10], ["mechanics", "heat", "waves", "optics", "electricity", "magnetism", "space"], [], [], "upcoming"),
      band("mh-11-12", "Physics XI-XII", [11, 12], ["mathematical methods", "mechanics", "fluids", "thermal physics", "waves", "electromagnetism", "optics", "modern physics", "electronics"], [], [], "upcoming")
    ]
  },
  {
    id: "cambridge",
    label: "Cambridge",
    source: "Cambridge Lower Secondary Science, IGCSE Physics 0625, and AS/A Level bridge",
    note: "IGCSE itself is normally 9-10; this lane shows the 6-12 Cambridge physics pathway.",
    bands: [
      band("cambridge-6-8", "Lower Secondary", [6, 7, 8], ["forces", "energy", "light", "sound", "electricity", "space"], ["c6-light-shadows", "c7-speed", "c8-force-effects", "c8-sound", "c8-static-lightning"], ["reflection-plane-mirror", "uniform-motion", "newton-s-second-law", "sound-pitch-loudness", "static-electricity"]),
      band("cambridge-igcse", "IGCSE 0625", [9, 10], ["motion forces energy", "thermal", "waves", "electricity magnetism", "nuclear", "space"], ["c9-motion", "c9-work-energy", "c11-thermal", "c12-wave-optics", "c12-current", "c12-dual-atoms", "c11-gravitation"], ["free-fall", "conservation-of-energy", "heat-transfer", "single-slit-diffraction", "ohms-law", "nuclear-decay", "satellite-orbit"]),
      band("cambridge-as-a", "AS/A Level Bridge", [11, 12], ["mechanics", "materials", "fields", "waves", "quantum", "nuclear"], ["c11-laws-motion", "c11-solids-fluids", "c12-electrostatics", "c12-ray-optics", "c12-dual-atoms"], ["elastic-collision", "hooke-s-law", "electrostatic-field-potential", "total-internal-reflection", "de-broglie-wavelength"])
    ]
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
      band("ib-dp-hl", "DP HL Extensions", [12], ["rotational motion", "induction", "quantum", "relativity bridge"], ["c11-rotation", "c12-emi-ac", "c12-dual-atoms", "c12-relativity-bridge"], ["rotational-dynamics", "transformer-lab", "photoelectric-equation", "special-relativity-bridge"])
    ]
  }
];

// src/lib/objectRegistry.ts
var sharedRigidProperties = [
  { key: "mass", label: "Mass", unit: "kg", type: "number", min: 0.01, step: 0.1 },
  { key: "x", label: "Position X", unit: "m", type: "number", step: 0.1 },
  { key: "y", label: "Position Y", unit: "m", type: "number", step: 0.1 },
  { key: "vx", label: "Velocity X", unit: "m/s", type: "number", step: 0.1 },
  { key: "vy", label: "Velocity Y", unit: "m/s", type: "number", step: 0.1 },
  { key: "friction", label: "Friction", type: "number", min: 0, max: 1, step: 0.01 },
  { key: "restitution", label: "Restitution", type: "number", min: 0, max: 1, step: 0.01 },
  { key: "airDrag", label: "Air drag", type: "number", min: 0, max: 2, step: 0.01 },
  { key: "torque", label: "Torque", unit: "N m", type: "number", step: 0.1 },
  { key: "locked", label: "Lock", type: "boolean" }
];
var objectRegistry = [
  {
    id: "ball",
    name: "Ball",
    category: "Mechanics",
    icon: "BALL",
    defaultProperties: { radius: 24, mass: 1, friction: 0.02, restitution: 0.82, color: "#38bdf8" },
    editableProperties: [{ key: "radius", label: "Radius", unit: "cm", type: "number", min: 8, step: 1 }, ...sharedRigidProperties],
    renderType: "canvas",
    simulationType: "rigid-body"
  },
  {
    id: "block",
    name: "Block",
    category: "Mechanics",
    icon: "BOX",
    defaultProperties: { width: 58, height: 42, mass: 2, friction: 0.18, restitution: 0.25, color: "#34d399" },
    editableProperties: [
      { key: "width", label: "Width", unit: "cm", type: "number", min: 10, step: 1 },
      { key: "height", label: "Height", unit: "cm", type: "number", min: 10, step: 1 },
      ...sharedRigidProperties
    ],
    renderType: "canvas",
    simulationType: "rigid-body"
  },
  {
    id: "floor",
    name: "Floor",
    category: "Boundaries",
    icon: "FLR",
    defaultProperties: { width: 760, height: 28, mass: 0, friction: 0.35, restitution: 0.35, isStatic: true, color: "#64748b" },
    editableProperties: [
      { key: "width", label: "Width", unit: "cm", type: "number", min: 50, step: 10 },
      { key: "friction", label: "Friction", type: "number", min: 0, max: 1, step: 0.01 },
      { key: "restitution", label: "Restitution", type: "number", min: 0, max: 1, step: 0.01 }
    ],
    renderType: "canvas",
    simulationType: "rigid-body"
  },
  {
    id: "wall",
    name: "Wall",
    category: "Boundaries",
    icon: "WAL",
    defaultProperties: { width: 26, height: 420, mass: 0, friction: 0.3, restitution: 0.35, isStatic: true, color: "#94a3b8" },
    editableProperties: [
      { key: "height", label: "Height", unit: "cm", type: "number", min: 60, step: 10 },
      { key: "friction", label: "Friction", type: "number", min: 0, max: 1, step: 0.01 }
    ],
    renderType: "canvas",
    simulationType: "rigid-body"
  },
  {
    id: "ramp",
    name: "Ramp",
    category: "Mechanics",
    icon: "RMP",
    defaultProperties: { width: 220, height: 32, angle: -0.42, mass: 0, friction: 0.22, restitution: 0.28, isStatic: true, color: "#fbbf24" },
    editableProperties: [
      { key: "angle", label: "Angle", unit: "rad", type: "number", min: -1.2, max: 1.2, step: 0.01 },
      { key: "friction", label: "Friction", type: "number", min: 0, max: 1, step: 0.01 }
    ],
    renderType: "canvas",
    simulationType: "rigid-body"
  },
  {
    id: "spring",
    name: "Spring",
    category: "Constraints",
    icon: "SPR",
    defaultProperties: { width: 130, height: 22, mass: 0.2, springConstant: 24, friction: 0.04, restitution: 0.2, color: "#a78bfa" },
    editableProperties: [
      { key: "springConstant", label: "Spring Constant", unit: "N/m", type: "number", min: 0, step: 1 },
      { key: "damping", label: "Damping", type: "number", min: 0, max: 1, step: 0.01 },
      ...sharedRigidProperties
    ],
    renderType: "canvas",
    simulationType: "rigid-body"
  },
  {
    id: "pendulum",
    name: "Pendulum",
    category: "Oscillations",
    icon: "PEN",
    defaultProperties: { radius: 18, mass: 1, length: 160, pivotX: 420, pivotY: 90, friction: 0.01, restitution: 0.2, color: "#fb923c" },
    editableProperties: [
      { key: "length", label: "Length", unit: "cm", type: "number", min: 40, step: 5 },
      { key: "damping", label: "Damping", type: "number", min: 0, max: 1, step: 0.01 },
      ...sharedRigidProperties
    ],
    renderType: "canvas",
    simulationType: "rigid-body"
  },
  ...makePlaceholderObjects()
];
function makePlaceholderObjects() {
  const entries = [
    { id: "rope", name: "Rope", category: "Constraints", icon: "ROP", simulationType: "rigid-body", defaults: { width: 150, height: 8, mass: 0.2, color: "#cbd5e1" } },
    { id: "pulley", name: "Pulley", category: "Simple Machines", icon: "PUL", simulationType: "rigid-body", defaults: { radius: 28, mass: 1, isStatic: true, motorSpeed: 0, color: "#94a3b8" }, editable: [{ key: "motorSpeed", label: "Motor speed", unit: "rad/s", type: "number", step: 0.1 }, ...sharedRigidProperties] },
    { id: "cart", name: "Cart", category: "Mechanics", icon: "CAR", simulationType: "rigid-body", defaults: { width: 76, height: 36, mass: 2, color: "#60a5fa" } },
    { id: "wheel", name: "Wheel", category: "Rotational", icon: "WHL", simulationType: "rigid-body", defaults: { radius: 30, mass: 1.5, restitution: 0.5, color: "#f97316" } },
    { id: "disc", name: "Disc", category: "Rotational", icon: "DSC", simulationType: "rigid-body", defaults: { radius: 32, mass: 2, color: "#facc15" } },
    { id: "rod", name: "Rod", category: "Rotational", icon: "ROD", simulationType: "rigid-body", defaults: { width: 140, height: 14, mass: 1, color: "#a3e635" } },
    { id: "force-arrow", name: "Force Arrow", category: "Vectors", icon: "FRC", simulationType: "field", defaults: { width: 90, height: 12, isStatic: true, color: "#f43f5e" } },
    { id: "velocity-arrow", name: "Velocity Arrow", category: "Vectors", icon: "VEL", simulationType: "field", defaults: { width: 90, height: 12, isStatic: true, color: "#38bdf8" } },
    { id: "acceleration-arrow", name: "Acceleration Arrow", category: "Vectors", icon: "ACC", simulationType: "field", defaults: { width: 90, height: 12, isStatic: true, color: "#fb923c" } },
    { id: "stopwatch", name: "Stopwatch", category: "Instruments", icon: "TIM", simulationType: "field", defaults: { width: 54, height: 54, isStatic: true, color: "#e2e8f0" } },
    { id: "ruler", name: "Ruler", category: "Instruments", icon: "RUL", simulationType: "field", defaults: { width: 180, height: 18, isStatic: true, color: "#fde68a" } },
    { id: "protractor", name: "Protractor", category: "Instruments", icon: "ANG", simulationType: "field", defaults: { width: 92, height: 46, isStatic: true, color: "#f9a8d4" } },
    { id: "graph-plotter", name: "Graph Plotter", category: "Instruments", icon: "GRF", simulationType: "field", defaults: { width: 68, height: 52, isStatic: true, color: "#22d3ee" } },
    { id: "motion-sensor", name: "Motion Sensor", category: "Instruments", icon: "MOT", simulationType: "field", defaults: { width: 62, height: 34, isStatic: true, color: "#818cf8" } },
    { id: "force-sensor", name: "Force Sensor", category: "Instruments", icon: "SEN", simulationType: "field", defaults: { width: 62, height: 34, isStatic: true, color: "#fb7185" } },
    { id: "light-ray", name: "Light Ray", category: "Optics", icon: "RAY", simulationType: "optics", defaults: { width: 160, height: 6, wavelength: 540, intensity: 1, isStatic: true, color: "#fef08a" }, editable: [{ key: "wavelength", label: "Wavelength", unit: "nm", type: "number", min: 380, max: 700, step: 1 }, { key: "intensity", label: "Intensity", type: "number", min: 0, max: 1, step: 0.01 }, ...sharedRigidProperties] },
    { id: "plane-mirror", name: "Plane Mirror", category: "Optics", icon: "MIR", simulationType: "optics", defaults: { width: 18, height: 150, reflectivity: 0.9, isStatic: true, color: "#93c5fd" }, editable: [{ key: "reflectivity", label: "Reflectivity", type: "number", min: 0, max: 1, step: 0.01 }, { key: "angle", label: "Angle", unit: "rad", type: "number", step: 0.01 }, ...sharedRigidProperties] },
    { id: "convex-lens", name: "Convex Lens", category: "Optics", icon: "LEN", simulationType: "optics", defaults: { width: 36, height: 150, focalLength: 160, refractiveIndex: 1.5, material: "glass", isStatic: true, color: "#67e8f9" }, editable: [{ key: "focalLength", label: "Focal length", unit: "m", type: "number", step: 5 }, { key: "material", label: "Material", type: "select" }, { key: "angle", label: "Angle", unit: "rad", type: "number", step: 0.01 }, ...sharedRigidProperties] },
    { id: "concave-mirror", name: "Concave Mirror", category: "Optics", icon: "CMR", simulationType: "optics", defaults: { width: 22, height: 150, focalLength: 130, reflectivity: 0.92, isStatic: true, color: "#bfdbfe" }, editable: [{ key: "focalLength", label: "Focal length", unit: "m", type: "number", step: 5 }, { key: "reflectivity", label: "Reflectivity", type: "number", min: 0, max: 1, step: 0.01 }, { key: "angle", label: "Angle", unit: "rad", type: "number", step: 0.01 }, ...sharedRigidProperties] },
    { id: "prism", name: "Prism", category: "Optics", icon: "PRI", simulationType: "optics", defaults: { width: 86, height: 74, refractiveIndex: 1.5, isStatic: true, color: "#c4b5fd" }, editable: [{ key: "refractiveIndex", label: "Refractive index", type: "number", min: 1, step: 0.01 }, { key: "angle", label: "Angle", unit: "rad", type: "number", step: 0.01 }, ...sharedRigidProperties] },
    { id: "wave-source", name: "Wave Source", category: "Waves", icon: "SRC", simulationType: "wave", defaults: { radius: 18, frequency: 2, amplitude: 1, phase: 0, isStatic: true, color: "#38bdf8" }, editable: [{ key: "frequency", label: "Frequency", unit: "Hz", type: "number", min: 0.1, step: 0.1 }, { key: "amplitude", label: "Amplitude", type: "number", min: 0, step: 0.1 }, { key: "phase", label: "Phase", unit: "rad", type: "number", step: 0.1 }, ...sharedRigidProperties] },
    { id: "wave-barrier", name: "Wave Barrier", category: "Waves", icon: "BAR", simulationType: "wave", defaults: { width: 14, height: 220, gapWidth: 24, isStatic: true, color: "#94a3b8" }, editable: [{ key: "gapWidth", label: "Gap width", type: "number", min: 0, step: 1 }, ...sharedRigidProperties] },
    { id: "fluid-region", name: "Fluid Region", category: "Fluid Mechanics", icon: "FLD", simulationType: "fluid", defaults: { width: 360, height: 190, density: 1e3, viscosity: 1e-3, isStatic: true, color: "rgba(56,189,248,0.28)" }, editable: [{ key: "density", label: "Density", unit: "kg/m3", type: "number", min: 0, step: 10 }, { key: "viscosity", label: "Viscosity", unit: "Pa s", type: "number", min: 0, step: 1e-3 }, ...sharedRigidProperties] },
    { id: "chladni-plate", name: "Chladni Plate", category: "Waves", icon: "CHL", simulationType: "wave", defaults: { width: 260, height: 180, frequency: 440, amplitude: 0.5, isStatic: true, color: "#334155" }, editable: [{ key: "frequency", label: "Frequency", unit: "Hz", type: "number", min: 80, max: 1600, step: 1 }, { key: "amplitude", label: "Amplitude", type: "number", min: 0, max: 1, step: 0.01 }, ...sharedRigidProperties] },
    { id: "charge", name: "Charge", category: "Electricity", icon: "Q", simulationType: "field", defaults: { radius: 22, mass: 0.1, charge: 1, isStatic: true, color: "#22d3ee" } },
    { id: "electric-field-region", name: "Electric Field Region", category: "Electricity", icon: "E", simulationType: "field", defaults: { width: 180, height: 110, isStatic: true, color: "#06b6d4" } },
    { id: "bar-magnet", name: "Bar Magnet", category: "Magnetism", icon: "MAG", simulationType: "field", defaults: { width: 130, height: 34, isStatic: true, color: "#d946ef" } },
    { id: "thermometer", name: "Thermometer", category: "Thermal", icon: "TMP", simulationType: "thermal", defaults: { width: 26, height: 120, temperature: 298, isStatic: true, color: "#ef4444" } },
    { id: "gas-container", name: "Gas Container", category: "Thermodynamics", icon: "GAS", simulationType: "thermal", defaults: { width: 150, height: 110, pressure: 101325, temperature: 300, isStatic: true, color: "#f97316" } },
    { id: "battery", name: "Battery", category: "Circuits", icon: "BAT", simulationType: "circuit", defaults: { width: 70, height: 38, emf: 9, internalResistance: 0.2, isStatic: true, color: "#22d3ee" }, editable: [{ key: "emf", label: "EMF", unit: "V", type: "number", min: 0, step: 0.1 }, { key: "internalResistance", label: "Internal R", unit: "ohm", type: "number", min: 0, step: 0.1 }, { key: "x", label: "Position X", unit: "m", type: "number", step: 0.1 }, { key: "y", label: "Position Y", unit: "m", type: "number", step: 0.1 }] },
    { id: "resistor", name: "Resistor", category: "Circuits", icon: "RES", simulationType: "circuit", defaults: { width: 74, height: 28, resistance: 10, isStatic: true, color: "#facc15" }, editable: [{ key: "resistance", label: "Resistance", unit: "ohm", type: "number", min: 0.01, step: 0.1 }, { key: "x", label: "Position X", unit: "m", type: "number", step: 0.1 }, { key: "y", label: "Position Y", unit: "m", type: "number", step: 0.1 }] },
    { id: "bulb", name: "Bulb", category: "Circuits", icon: "BLB", simulationType: "circuit", defaults: { radius: 24, resistance: 12, brightness: 0, isStatic: true, color: "#fde68a" }, editable: [{ key: "resistance", label: "Resistance", unit: "ohm", type: "number", min: 0.01, step: 0.1 }, { key: "x", label: "Position X", unit: "m", type: "number", step: 0.1 }, { key: "y", label: "Position Y", unit: "m", type: "number", step: 0.1 }] },
    { id: "switch", name: "Switch", category: "Circuits", icon: "SW", simulationType: "circuit", defaults: { width: 64, height: 30, closed: false, isStatic: true, color: "#94a3b8" }, editable: [{ key: "closed", label: "Closed", type: "boolean" }, { key: "x", label: "Position X", unit: "m", type: "number", step: 0.1 }, { key: "y", label: "Position Y", unit: "m", type: "number", step: 0.1 }] },
    { id: "ammeter", name: "Ammeter", category: "Circuits", icon: "A", simulationType: "circuit", defaults: { radius: 22, current: 0, isStatic: true, color: "#67e8f9" }, editable: [{ key: "x", label: "Position X", unit: "m", type: "number", step: 0.1 }, { key: "y", label: "Position Y", unit: "m", type: "number", step: 0.1 }] },
    { id: "voltmeter", name: "Voltmeter", category: "Circuits", icon: "V", simulationType: "circuit", defaults: { radius: 22, voltageDiff: 0, isStatic: true, color: "#a78bfa" }, editable: [{ key: "x", label: "Position X", unit: "m", type: "number", step: 0.1 }, { key: "y", label: "Position Y", unit: "m", type: "number", step: 0.1 }] },
    { id: "wire", name: "Wire", category: "Circuits", icon: "WR", simulationType: "circuit", defaults: { width: 1, height: 1, current: 0, isStatic: true, color: "#22c55e" }, editable: [] },
    { id: "double-pendulum", name: "Double Pendulum", category: "Oscillations", icon: "DP", simulationType: "numerical", defaults: { width: 1, height: 1, isStatic: true, pivotX: 420, pivotY: 110, length1: 120, length2: 120, mass1: 1, mass2: 1, angle1: 1.2, angle2: 1.95, omega1: 0, omega2: 0, damping: 2e-3, color: "#fb923c" }, editable: [{ key: "pivotX", label: "Pivot X", type: "number", step: 1 }, { key: "pivotY", label: "Pivot Y", type: "number", step: 1 }, { key: "length1", label: "Length 1", unit: "m", type: "number", min: 20, step: 5 }, { key: "length2", label: "Length 2", unit: "m", type: "number", min: 20, step: 5 }, { key: "mass1", label: "Mass 1", unit: "kg", type: "number", min: 0.1, step: 0.1 }, { key: "mass2", label: "Mass 2", unit: "kg", type: "number", min: 0.1, step: 0.1 }, { key: "angle1", label: "Angle 1", unit: "rad", type: "number", step: 1e-3 }, { key: "angle2", label: "Angle 2", unit: "rad", type: "number", step: 1e-3 }, { key: "damping", label: "Damping", type: "number", min: 0, max: 0.1, step: 1e-3 }] }
  ];
  return entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    category: entry.category,
    icon: entry.icon,
    defaultProperties: {
      width: 56,
      height: 36,
      mass: 1,
      friction: 0.08,
      restitution: 0.35,
      ...entry.defaults
    },
    editableProperties: entry.editable ?? sharedRigidProperties,
    renderType: "canvas",
    simulationType: entry.simulationType
  }));
}
function createObject(kind, x = 300, y = 160) {
  const def = objectRegistry.find((item) => item.id === kind);
  if (!def) throw new Error(`Unknown physics object: ${kind}`);
  const defaults2 = def.defaultProperties;
  return {
    id: crypto.randomUUID(),
    kind,
    name: def.name,
    x,
    y,
    angle: Number(defaults2.angle ?? 0),
    width: Number(defaults2.width ?? 48),
    height: Number(defaults2.height ?? 48),
    radius: Number(defaults2.radius ?? 22),
    mass: Number(defaults2.mass ?? 1),
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    friction: Number(defaults2.friction ?? 0.1),
    restitution: Number(defaults2.restitution ?? 0.4),
    isStatic: Boolean(defaults2.isStatic ?? false),
    locked: Boolean(defaults2.locked ?? false),
    color: String(defaults2.color ?? "#38bdf8"),
    charge: Number(defaults2.charge ?? 0),
    temperature: Number(defaults2.temperature ?? 293.15),
    density: Number(defaults2.density ?? 1e3),
    material: String(defaults2.material ?? "default"),
    springConstant: Number(defaults2.springConstant ?? 0),
    damping: Number(defaults2.damping ?? 0.02),
    airDrag: Number(defaults2.airDrag ?? 0.05),
    motorSpeed: Number(defaults2.motorSpeed ?? 0),
    motorTorque: Number(defaults2.motorTorque ?? 0),
    torque: Number(defaults2.torque ?? 0),
    length: Number(defaults2.length ?? 120),
    pivotX: Number(defaults2.pivotX ?? x),
    pivotY: Number(defaults2.pivotY ?? y - 120),
    focalLength: Number(defaults2.focalLength ?? 120),
    refractiveIndex: Number(defaults2.refractiveIndex ?? 1.5),
    reflectivity: Number(defaults2.reflectivity ?? 0.9),
    wavelength: Number(defaults2.wavelength ?? 540),
    intensity: Number(defaults2.intensity ?? 1),
    viscosity: Number(defaults2.viscosity ?? 1e-3),
    frequency: Number(defaults2.frequency ?? 1),
    amplitude: Number(defaults2.amplitude ?? 1),
    phase: Number(defaults2.phase ?? 0),
    gapWidth: Number(defaults2.gapWidth ?? 20),
    length1: Number(defaults2.length1 ?? 120),
    length2: Number(defaults2.length2 ?? 120),
    mass1: Number(defaults2.mass1 ?? 1),
    mass2: Number(defaults2.mass2 ?? 1),
    angle1: Number(defaults2.angle1 ?? 0),
    angle2: Number(defaults2.angle2 ?? 0),
    omega1: Number(defaults2.omega1 ?? 0),
    omega2: Number(defaults2.omega2 ?? 0),
    emf: Number(defaults2.emf ?? 0),
    internalResistance: Number(defaults2.internalResistance ?? 0),
    resistance: Number(defaults2.resistance ?? 1),
    brightness: Number(defaults2.brightness ?? 0),
    closed: Boolean(defaults2.closed ?? false),
    current: Number(defaults2.current ?? 0),
    voltage: Number(defaults2.voltage ?? 0),
    voltageDiff: Number(defaults2.voltageDiff ?? 0),
    trail: []
  };
}

// src/lib/experimentAssumptions.ts
var defaults = {
  assumptions: ["SI units are used unless a control explicitly says otherwise.", "Textbook calculator outputs are exact for the stated ideal assumptions."],
  limitations: ["Real instrument uncertainty, losses, and non-ideal material behavior may be omitted in simplified labs."],
  validRanges: ["Use finite positive physical inputs.", "Stay inside the slider ranges shown by the lab."],
  failureConditions: ["Invalid, singular, negative, or zero-denominator inputs make the result untrusted."],
  modelClass: "Calculator",
  trustLevel: 100,
  confidenceReason: "Formula result is computed directly from a standard textbook equation and is 100% reliable inside the stated ideal assumptions and valid input range.",
  evidenceType: "Exact Formula",
  maturityLevel: "Validated",
  sourceRefs: ["ncert-school-physics", "physicslab-local-validation"],
  validationStatus: "Formula smoke-tested against analytic reference values; classroom outcome research is not claimed."
};
var domainTrust = {
  Mechanics: {
    assumptions: ["Rigid bodies are approximated as point masses or simple shapes.", "Gravity is uniform over the workspace.", "Canvas coordinates are converted to SI only where stated."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Mechanics outputs use closed-form textbook equations or validated one-dimensional relationships, so numeric values are exact inside the displayed assumptions.",
    sourceRefs: ["constant-acceleration", "newtonian-mechanics"]
  },
  "Fluid Mechanics": {
    assumptions: ["Fluids are incompressible unless stated.", "Buoyancy uses Archimedes' principle.", "Viscous and turbulent losses are simplified."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Fluid outputs use standard hydrostatics and Archimedes-law formulas and are exact for ideal incompressible-fluid assumptions.",
    sourceRefs: ["hydrostatics"]
  },
  Thermodynamics: {
    assumptions: ["Systems are treated as equilibrium or quasi-equilibrium states.", "Specific heat and material properties are constant over the selected range."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Thermal outputs use standard equilibrium formula calculators and are exact for the stated ideal material assumptions.",
    sourceRefs: ["equilibrium-thermo"]
  },
  Electricity: {
    assumptions: ["Components are ideal unless explicitly modeled.", "Ohmic relationships assume constant temperature."],
    limitations: ["Circuit visuals are not SPICE-grade simulation.", "Ideal meters and switches can create invalid circuits if connected unrealistically."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Electrical outputs are computed from ideal textbook circuit formulas and are 100% reliable for the stated ideal component assumptions.",
    sourceRefs: ["ideal-circuits"]
  },
  Magnetism: {
    assumptions: ["Fields use ideal wire, coil, or uniform-field approximations.", "Direction rules are educational diagrams."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Magnetic formula outputs use idealized textbook field relationships; field-line drawings remain illustrative while displayed numeric formulas are exact within assumptions.",
    evidenceType: "Educational Approximation",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-circuits", "newtonian-mechanics"]
  },
  Optics: {
    assumptions: ["Rays are geometric optics rays.", "Angles are measured from the normal.", "Paraxial approximations may apply."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Optics outputs use standard ray-optics equations and are exact for paraxial or geometric-optics assumptions shown in the lab.",
    sourceRefs: ["geometric-optics"]
  },
  Waves: {
    assumptions: ["Wave media are idealized.", "Interference visuals are qualitative unless a formula output is shown."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Wave and oscillation formula outputs use standard textbook relationships and are exact for ideal media and small-angle assumptions where stated.",
    evidenceType: "Educational Approximation",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-waves"]
  },
  "Modern Physics": {
    assumptions: ["Formula outputs use simplified textbook models.", "Quantum visuals are conceptual unless explicitly numeric."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Modern-physics formula outputs use standard textbook models and constants; conceptual animations are separate from the numeric result.",
    sourceRefs: ["modern-physics", "physicslab-local-validation"]
  },
  Quantum: {
    assumptions: ["Visuals are conceptual representations of quantum quantities.", "Probabilities require normalized models before quantitative interpretation."],
    modelClass: "Visualization",
    trustLevel: 88,
    confidenceReason: "Quantum visuals are educational metaphors unless a normalized calculator is present; numeric formula outputs remain bounded by the stated assumptions.",
    evidenceType: "Visual Model",
    maturityLevel: "Starter",
    sourceRefs: ["modern-physics"],
    validationStatus: "Visual model only unless an explicit numeric formula is displayed."
  }
};
var idOverrides = {
  "projectile-motion": {
    assumptions: ["No air resistance unless the control explicitly enables it.", "Gravity is constant.", "Earth is treated as flat over the trajectory."],
    limitations: ["Not valid for hypersonic speeds or long-range ballistic trajectories."],
    failureConditions: ["Hypersonic speeds", "Long-range paths where curvature matters", "Non-finite launch inputs"],
    modelClass: "Validated Simulation",
    trustLevel: 100,
    confidenceReason: "Uses standard constant-acceleration equations validated against analytic projectile motion, with no air resistance unless explicitly stated.",
    evidenceType: "Exact Formula",
    maturityLevel: "Flagship",
    sourceRefs: ["constant-acceleration", "physicslab-local-validation"],
    validationStatus: "Validated against analytic range and trajectory calculations in the local physics test suite."
  },
  "free-fall": {
    assumptions: ["No air resistance.", "Constant gravitational acceleration.", "Mass does not affect ideal free fall."],
    modelClass: "Validated Simulation",
    trustLevel: 100,
    confidenceReason: "Free-fall values are computed from the exact constant-acceleration equations for uniform gravity and no air resistance.",
    maturityLevel: "Flagship",
    sourceRefs: ["constant-acceleration", "physicslab-local-validation"],
    validationStatus: "Validated against analytic free-fall distance and velocity calculations."
  },
  "newton-s-second-law": {
    assumptions: ["Net force is one-dimensional.", "Mass is positive and constant."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Newton's second law is evaluated directly as F = ma or a = F/m for finite positive mass.",
    maturityLevel: "Flagship",
    sourceRefs: ["newtonian-mechanics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with force, mass, friction, and graph-guided measurement plan."
  },
  "conservation-of-energy": {
    assumptions: ["Mechanical energy is tracked between gravitational potential energy and kinetic energy.", "Losses are represented as a single fractional energy loss."],
    limitations: ["Rotational kinetic energy, track friction profile, and air resistance are not separately modeled."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Energy outputs are evaluated directly from mgh, 1/2mv^2, and an explicit loss fraction inside the displayed range.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["newtonian-mechanics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with prediction prompt, measurement plan, and graph presets."
  },
  "simple-pendulum": {
    assumptions: ["Small-angle oscillations.", "Mass does not affect the ideal period.", "Gravity is fixed at 9.81 m/s^2 in the calculator."],
    limitations: ["Large-angle corrections, pivot friction, string mass, and air drag are outside the model."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Pendulum period is computed directly from the standard small-angle equation T = 2pi sqrt(L/g).",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-waves", "newtonian-mechanics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for small-angle oscillation measurements."
  },
  "ohms-law": {
    assumptions: ["Material is ohmic.", "Temperature is constant.", "Resistance is positive."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Ohm's law is evaluated directly for ideal ohmic components with positive resistance.",
    maturityLevel: "Flagship",
    sourceRefs: ["ideal-circuits", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with V-I graph plan and internal-resistance extension."
  },
  "buoyancy": {
    assumptions: ["Buoyant force equals weight of displaced fluid.", "Fluid density is uniform.", "Object volume is fully available for displacement."],
    limitations: ["Shape stability, surface tension, viscosity, and fluid motion are not modeled."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Buoyant force, object weight, and submerged fraction are calculated from Archimedes' principle for ideal static fluids.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["hydrostatics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for density comparison and Archimedes-law measurements."
  },
  "gas-laws": {
    assumptions: ["Gas follows the ideal gas equation.", "Temperature is absolute temperature in kelvin.", "The gas amount is fixed unless the moles slider is changed."],
    limitations: ["High-pressure, low-temperature, and non-ideal gas effects are outside the model."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Pressure and PV/T are computed directly from PV = nRT for finite positive inputs.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["equilibrium-thermo", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for Boyle, Charles, and ideal-gas comparisons."
  },
  "young-double-slit": {
    assumptions: ["Light is coherent.", "Small-angle approximation is valid.", "Slit separation is much larger than wavelength."],
    limitations: ["Single-slit envelope, finite slit width, alignment error, and intensity falloff are not fully modeled."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Fringe width is computed directly from beta = lambda D / d for ideal double-slit interference.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["ideal-waves", "geometric-optics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model for wave-optics fringe measurement."
  },
  "kirchhoff-circuit": {
    limitations: ["Only simple ideal circuits are trustworthy.", "Singular or contradictory ideal sources must be rejected."],
    failureConditions: ["Shorted ideal voltage source", "Open circuit with no return path", "Singular matrix"],
    modelClass: "Calculator",
    trustLevel: 96,
    confidenceReason: "Kirchhoff calculations are reliable for well-posed ideal circuits; the score is lower than 100 only because invalid ideal-source topologies must be rejected.",
    evidenceType: "Educational Approximation",
    maturityLevel: "Validated"
  },
  "wave-lab": {
    modelClass: "Visualization",
    trustLevel: 86,
    confidenceReason: "Wave motion is a visual teaching model; use the displayed textbook formulas for exact numeric work.",
    evidenceType: "Visual Model",
    maturityLevel: "Starter",
    validationStatus: "Visual teaching model; numeric wave relations are formula-based."
  },
  "photoelectric-equation": {
    assumptions: ["Photon energy and work function are expressed in eV.", "Stopping potential reports maximum kinetic energy per electron charge."],
    limitations: ["Photocurrent is qualitative unless a current model is explicitly provided."],
    modelClass: "Calculator",
    trustLevel: 100,
    confidenceReason: "Photoelectric energy and stopping-potential values are calculated directly from Einstein's photoelectric equation for the stated ideal assumptions.",
    maturityLevel: "Classroom Ready",
    sourceRefs: ["modern-physics", "physicslab-local-validation"],
    validationStatus: "Promoted to flagship lab model with threshold, stopping-potential, and intensity misconception checks."
  }
};
function scientificTrustForExperiment(experiment) {
  const domain = domainTrust[experiment.category] ?? {};
  const override = idOverrides[experiment.id] ?? {};
  return {
    ...defaults,
    ...domain,
    ...override,
    assumptions: [.../* @__PURE__ */ new Set([...defaults.assumptions, ...domain.assumptions ?? [], ...override.assumptions ?? []])],
    limitations: [.../* @__PURE__ */ new Set([...defaults.limitations, ...domain.limitations ?? [], ...override.limitations ?? []])],
    validRanges: [.../* @__PURE__ */ new Set([...defaults.validRanges, ...domain.validRanges ?? [], ...override.validRanges ?? []])],
    failureConditions: [.../* @__PURE__ */ new Set([...defaults.failureConditions, ...domain.failureConditions ?? [], ...override.failureConditions ?? []])],
    trustLevel: Math.max(0, Math.min(100, override.trustLevel ?? domain.trustLevel ?? defaults.trustLevel)),
    confidenceReason: override.confidenceReason ?? domain.confidenceReason ?? defaults.confidenceReason,
    evidenceType: override.evidenceType ?? domain.evidenceType ?? defaults.evidenceType,
    maturityLevel: override.maturityLevel ?? domain.maturityLevel ?? defaults.maturityLevel,
    sourceRefs: [.../* @__PURE__ */ new Set([...defaults.sourceRefs, ...domain.sourceRefs ?? [], ...override.sourceRefs ?? []])],
    validationStatus: override.validationStatus ?? domain.validationStatus ?? defaults.validationStatus
  };
}
function withScientificTrust(experiment) {
  const trust = scientificTrustForExperiment(experiment);
  const isStarterTemplate = experiment.theory.toLowerCase().includes("starter experiment uses the common lab workspace");
  if (!isStarterTemplate) return { ...experiment, ...trust };
  return {
    ...experiment,
    ...trust,
    modelClass: "Concept",
    trustLevel: Math.min(trust.trustLevel, 74),
    evidenceType: "Sandbox Only",
    maturityLevel: "Starter",
    sourceRefs: [.../* @__PURE__ */ new Set([...trust.sourceRefs, "PhysicsLab starter experiment template"])],
    validationStatus: "Starter workspace; requires lab-specific model promotion before classroom-ready use.",
    confidenceReason: "This is a starter workspace entry. Use it for guided exploration, but do not treat its generic setup as a validated lab-specific simulation yet."
  };
}

// src/lib/experiments.ts
var formulaByTitle = {
  "Uniform Motion": [{ id: "uniform-motion-formula", name: "Uniform motion", expression: "x = x_0 + vt", variables: [{ symbol: "x", name: "Position", unit: "m" }, { symbol: "v", name: "Velocity", unit: "m/s" }, { symbol: "t", name: "Time", unit: "s" }] }],
  "Newton's Second Law": [{ id: "newton-2-formula", name: "Newton's second law", expression: "F = ma", variables: [{ symbol: "F", name: "Force", unit: "N" }, { symbol: "m", name: "Mass", unit: "kg" }, { symbol: "a", name: "Acceleration", unit: "m/s^2" }] }],
  Friction: [{ id: "friction-formula", name: "Kinetic friction", expression: "f = \\mu N", variables: [{ symbol: "mu", name: "Coefficient of friction", unit: "" }, { symbol: "N", name: "Normal force", unit: "N" }] }],
  "Inclined Plane": [{ id: "incline-formula", name: "Incline acceleration", expression: "a = g(\\sin\\theta - \\mu\\cos\\theta)", variables: [{ symbol: "theta", name: "Incline angle", unit: "degree" }, { symbol: "mu", name: "Friction coefficient", unit: "" }] }],
  "Elastic Collision": [{ id: "collision-formula", name: "Momentum conservation", expression: "m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2", variables: [{ symbol: "m", name: "Mass", unit: "kg" }, { symbol: "u", name: "Initial velocity", unit: "m/s" }, { symbol: "v", name: "Final velocity", unit: "m/s" }] }],
  "Conservation of Energy": [{ id: "energy-formula", name: "Mechanical energy", expression: "E = \\frac{1}{2}mv^2 + mgh", variables: [{ symbol: "E", name: "Energy", unit: "J" }, { symbol: "h", name: "Height", unit: "m" }] }],
  "Hooke's Law": [{ id: "hooke-formula", name: "Hooke's law", expression: "F = -kx", variables: [{ symbol: "k", name: "Spring constant", unit: "N/m" }, { symbol: "x", name: "Extension", unit: "m" }] }],
  "Simple Pendulum": [{ id: "pendulum-formula", name: "Small-angle period", expression: "T = 2\\pi\\sqrt{\\frac{L}{g}}", variables: [{ symbol: "T", name: "Period", unit: "s" }, { symbol: "L", name: "Length", unit: "m" }] }],
  "Circular Motion": [{ id: "circular-formula", name: "Centripetal force", expression: "F_c = mr\\omega^2", variables: [{ symbol: "r", name: "Radius", unit: "m" }, { symbol: "omega", name: "Angular speed", unit: "rad/s" }] }]
};
var curriculumTagByTitle = {
  "Projectile Motion": { classes: [11], unitIds: ["c11-measurement-kinematics"], topicIds: ["c11-plane-motion"], domains: ["Mechanics"] },
  "Wave Lab": { classes: [8, 9, 11, 12], unitIds: ["c8-friction-sound-light", "c9-motion-force-work", "c11-matter-thermal-waves", "c12-optics-modern"], topicIds: ["c8-sound", "c9-sound", "c11-oscillations-waves", "c12-wave-optics"], domains: ["Waves"] },
  "Single Slit Diffraction": { classes: [12], unitIds: ["c12-optics-modern"], topicIds: ["c12-wave-optics"], domains: ["Waves", "Optics"] },
  "Buoyancy": { classes: [9, 11], unitIds: ["c9-motion-force-work", "c11-matter-thermal-waves"], topicIds: ["c9-floatation", "c11-solids-fluids"], domains: ["Fluid Mechanics"] },
  "Chladni Plate": { classes: [8, 11], unitIds: ["c8-friction-sound-light", "c11-matter-thermal-waves"], topicIds: ["c8-sound", "c11-oscillations-waves"], domains: ["Waves"] },
  "Uniform Motion": { classes: [7, 9, 11], unitIds: ["c7-motion-time", "c9-motion-force-work", "c11-measurement-kinematics"], topicIds: ["c7-speed", "c7-distance-time", "c9-motion", "c11-straight-line"], domains: ["Mechanics"] },
  "Newton's Second Law": { classes: [8, 9, 11], unitIds: ["c8-force-pressure", "c9-motion-force-work", "c11-mechanics-core"], topicIds: ["c8-force-effects", "c9-newton-laws", "c11-laws-motion"], domains: ["Mechanics"] },
  Friction: { classes: [8, 11], unitIds: ["c8-friction-sound-light", "c11-mechanics-core"], topicIds: ["c8-friction", "c11-laws-motion"], domains: ["Mechanics"] },
  "Inclined Plane": { classes: [8, 9, 11], unitIds: ["c8-friction-sound-light", "c9-motion-force-work", "c11-mechanics-core"], topicIds: ["c8-friction", "c9-work-energy", "c11-laws-motion"], domains: ["Mechanics"] },
  "Elastic Collision": { classes: [9, 11], unitIds: ["c9-motion-force-work", "c11-mechanics-core"], topicIds: ["c9-newton-laws", "c11-energy-collisions"], domains: ["Mechanics"] },
  "Conservation of Energy": { classes: [9, 11], unitIds: ["c9-motion-force-work", "c11-mechanics-core"], topicIds: ["c9-work-energy", "c11-energy-collisions"], domains: ["Mechanics"] },
  "Hooke's Law": { classes: [11], unitIds: ["c11-matter-thermal-waves"], topicIds: ["c11-solids-fluids"], domains: ["Mechanics"] },
  "Simple Pendulum": { classes: [11], unitIds: ["c11-matter-thermal-waves"], topicIds: ["c11-oscillations-waves"], domains: ["Waves", "Mechanics"] },
  "Circular Motion": { classes: [9, 11], unitIds: ["c9-motion-force-work", "c11-measurement-kinematics"], topicIds: ["c9-motion", "c11-plane-motion"], domains: ["Mechanics"] }
};
var phase2SchoolExperiments = [
  {
    id: "heat-and-temperature",
    title: "Heat and Temperature",
    category: "Thermodynamics",
    difficulty: "Beginner",
    classLevel: "Class 7",
    curriculumTags: { classes: [7], unitIds: ["c7-heat"], topicIds: ["c7-heat-temperature"], domains: ["Thermodynamics"] },
    aim: "Compare temperature scales and estimate heat needed to change the temperature of a body.",
    theory: "Temperature measures hotness, while heat is energy transferred because of a temperature difference.",
    apparatus: ["Thermometer", "Water sample", "Heat source", "Temperature scale"],
    formulae: [{ id: "temp-conversion", name: "Temperature conversion", expression: "K = T_C + 273.15", variables: [{ symbol: "K", name: "Kelvin temperature", unit: "K" }] }],
    procedure: ["Set a Celsius temperature.", "Compare Kelvin and Fahrenheit readings.", "Change mass and material heat capacity.", "Estimate heat needed for a 10 degree rise."],
    simulationSetup: { gravity: 9.81, objects: [createObject("thermometer", 360, 260), createObject("gas-container", 520, 290)] },
    observationColumns: ["Trial", "Temperature", "Kelvin", "Mass", "Heat for 10 C rise"],
    expectedResult: "Kelvin rises one-to-one with Celsius, and heat needed increases with mass and specific heat.",
    vivaQuestions: [{ prompt: "Is heat the same as temperature?", answer: "No. Heat is energy transfer; temperature measures thermal state." }],
    commonMistakes: ["Calling heat and temperature the same thing", "Forgetting to add 273.15 for Kelvin"]
  },
  {
    id: "heat-transfer",
    title: "Heat Transfer",
    category: "Thermodynamics",
    difficulty: "Beginner",
    classLevel: "Class 7 / Class 11 foundation",
    curriculumTags: { classes: [7, 11], unitIds: ["c7-heat", "c11-matter-thermal-waves"], topicIds: ["c7-heat-transfer", "c11-thermal"], domains: ["Thermodynamics"] },
    aim: "Visualize conduction and estimate heat flow through materials of different thickness.",
    theory: "Conduction transfers heat faster through high-conductivity, large-area, thin materials.",
    apparatus: ["Conduction bar", "Thermometer", "Heat source", "Insulator sample"],
    formulae: [{ id: "conduction", name: "Conduction rate", expression: "H = \\frac{kA\\Delta T}{L}", variables: [{ symbol: "k", name: "Thermal conductivity", unit: "W/m C" }] }],
    procedure: ["Choose a material conductivity.", "Adjust area and thickness.", "Keep temperature difference fixed.", "Compare heat rate and heat transferred in 60 seconds."],
    simulationSetup: { gravity: 9.81, objects: [createObject("thermometer", 300, 260), createObject("rod", 480, 300)] },
    observationColumns: ["Material", "Area", "Thickness", "Heat rate", "Heat in 60 s"],
    expectedResult: "Heat rate increases with conductivity and area, and decreases with thickness.",
    vivaQuestions: [{ prompt: "Why do metal spoons feel colder than wooden spoons?", answer: "Metal conducts heat away from the hand faster." }],
    commonMistakes: ["Ignoring thickness", "Mixing heat rate in watts with heat energy in joules"]
  },
  {
    id: "heating-effect-current",
    title: "Heating Effect of Current",
    category: "Electricity",
    difficulty: "Beginner",
    classLevel: "Class 7 / Class 10",
    curriculumTags: { classes: [7, 10], unitIds: ["c7-current-effects", "c10-effects-current"], topicIds: ["c7-heating-effect", "c10-electric-power"], domains: ["Electricity"] },
    aim: "Explore how current, resistance, and time affect Joule heating.",
    theory: "Electrical heating follows H = I^2Rt, so current has the strongest effect.",
    apparatus: ["Battery", "Resistor", "Bulb", "Switch", "Ammeter"],
    formulae: [{ id: "joule-heating", name: "Joule heating", expression: "H = I^2Rt", variables: [{ symbol: "I", name: "Current", unit: "A" }, { symbol: "R", name: "Resistance", unit: "ohm" }] }],
    procedure: ["Set current and resistance.", "Choose time interval.", "Compare power and total heat.", "Relate high heating to bulb brightness or fuse melting."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 260, 280), createObject("switch", 390, 280), createObject("bulb", 520, 280), createObject("resistor", 650, 280)] },
    observationColumns: ["Trial", "Current", "Resistance", "Time", "Heat"],
    expectedResult: "Doubling current makes heating four times larger for the same resistance and time.",
    vivaQuestions: [{ prompt: "Why is current squared in Joule heating?", answer: "Power in a resistor is I^2R." }],
    commonMistakes: ["Treating current and resistance as having equal effect", "Forgetting time when comparing energy"]
  },
  {
    id: "electromagnet",
    title: "Electromagnet",
    category: "Magnetism",
    difficulty: "Beginner",
    classLevel: "Class 7 / Class 10",
    curriculumTags: { classes: [7, 10], unitIds: ["c7-current-effects", "c10-effects-current"], topicIds: ["c7-magnetic-effect", "c10-magnetism"], domains: ["Magnetism", "Electricity"] },
    aim: "Build a current-controlled magnet and compare the effect of turns, current, and core material.",
    theory: "A coil carrying current produces a magnetic field; an iron core concentrates the field.",
    apparatus: ["Battery", "Coil", "Iron core", "Switch", "Compass"],
    formulae: [{ id: "coil-field", name: "Relative coil strength", expression: "B \\propto NI", variables: [{ symbol: "N", name: "Turns", unit: "" }, { symbol: "I", name: "Current", unit: "A" }] }],
    procedure: ["Increase current.", "Increase number of turns.", "Change core factor.", "Reverse current and note polarity change."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 280, 300), createObject("bar-magnet", 520, 300), createObject("switch", 400, 300)] },
    observationColumns: ["Turns", "Current", "Core", "Relative field", "Polarity"],
    expectedResult: "More turns, more current, and a stronger core produce a stronger electromagnet.",
    vivaQuestions: [{ prompt: "How can the poles of an electromagnet be reversed?", answer: "Reverse the direction of current." }],
    commonMistakes: ["Thinking a core alone makes an electromagnet", "Ignoring current direction"]
  },
  {
    id: "reflection-plane-mirror",
    title: "Reflection by Plane Mirror",
    category: "Optics",
    difficulty: "Beginner",
    classLevel: "Class 7 / Class 8",
    curriculumTags: { classes: [7, 8], unitIds: ["c7-light", "c8-friction-sound-light"], topicIds: ["c7-reflection", "c8-light"], domains: ["Optics"] },
    aim: "Trace incident and reflected rays and verify the law of reflection.",
    theory: "The angle of incidence equals the angle of reflection, measured from the normal.",
    apparatus: ["Light ray", "Plane mirror", "Protractor", "Screen"],
    formulae: [{ id: "reflection-law", name: "Law of reflection", expression: "i = r", variables: [{ symbol: "i", name: "Incidence angle", unit: "degree" }] }],
    procedure: ["Set an incidence angle.", "Observe the reflected ray.", "Change mirror tilt.", "Record object and image distances."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 260, 300), createObject("plane-mirror", 520, 300), createObject("protractor", 420, 420)] },
    observationColumns: ["Trial", "Incidence angle", "Reflection angle", "Object distance", "Image distance"],
    expectedResult: "For a plane mirror, incidence angle equals reflection angle and image distance equals object distance.",
    vivaQuestions: [{ prompt: "From where are angles measured in reflection?", answer: "From the normal to the mirror." }],
    commonMistakes: ["Measuring from the mirror surface instead of normal", "Confusing image distance with total ray path"]
  },
  {
    id: "force-and-pressure",
    title: "Force and Pressure",
    category: "Fluid Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 8",
    curriculumTags: { classes: [8], unitIds: ["c8-force-pressure"], topicIds: ["c8-pressure", "c8-force-effects"], domains: ["Fluid Mechanics", "Mechanics"] },
    aim: "Compare pressure from force over area and pressure due to liquid depth.",
    theory: "Pressure is force per unit area; liquid pressure also increases with depth.",
    apparatus: ["Block", "Fluid region", "Pressure gauge", "Ruler"],
    formulae: [{ id: "pressure", name: "Pressure", expression: "P = \\frac{F}{A}", variables: [{ symbol: "F", name: "Force", unit: "N" }, { symbol: "A", name: "Area", unit: "m^2" }] }],
    procedure: ["Set a force.", "Change contact area.", "Change depth in water.", "Compare solid and liquid pressure values."],
    simulationSetup: { gravity: 9.81, objects: [createObject("block", 340, 250), createObject("fluid-region", 540, 390)] },
    observationColumns: ["Trial", "Force", "Area", "Depth", "Pressure"],
    expectedResult: "Pressure increases with force and depth, and decreases with larger area.",
    vivaQuestions: [{ prompt: "Why do sharp knives cut better?", answer: "They apply the same force over a smaller area, producing greater pressure." }],
    commonMistakes: ["Confusing force with pressure", "Forgetting area is in square metres"]
  },
  {
    id: "fluid-pressure",
    title: "Fluid Pressure with Depth",
    category: "Fluid Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 11",
    curriculumTags: { classes: [8, 11], unitIds: ["c8-force-pressure", "c11-matter-thermal-waves"], topicIds: ["c8-pressure", "c11-solids-fluids"], domains: ["Fluid Mechanics"] },
    aim: "Observe how liquid pressure changes with density and depth.",
    theory: "Gauge pressure in a liquid is rho gh, so it grows linearly with depth.",
    apparatus: ["Fluid tank", "Depth marker", "Pressure gauge"],
    formulae: [{ id: "hydrostatic", name: "Hydrostatic pressure", expression: "P = P_0 + \\rho gh", variables: [{ symbol: "\\rho", name: "Density", unit: "kg/m^3" }] }],
    procedure: ["Choose fluid density.", "Move the pressure sensor deeper.", "Compare gauge and absolute pressure.", "Repeat for another fluid."],
    simulationSetup: { gravity: 9.81, objects: [createObject("fluid-region", 480, 380), createObject("motion-sensor", 480, 240)] },
    observationColumns: ["Fluid", "Density", "Depth", "Gauge pressure", "Absolute pressure"],
    expectedResult: "Pressure rises linearly as the sensor moves deeper.",
    vivaQuestions: [{ prompt: "Does container shape change pressure at a fixed depth?", answer: "No, pressure at a depth depends on density, gravity, and depth." }],
    commonMistakes: ["Using centimetres directly in SI formula", "Forgetting atmospheric pressure in absolute pressure"]
  },
  {
    id: "sound-pitch-loudness",
    title: "Sound Pitch and Loudness",
    category: "Waves",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 9",
    curriculumTags: { classes: [8, 9], unitIds: ["c8-friction-sound-light", "c9-motion-force-work"], topicIds: ["c8-sound", "c9-sound"], domains: ["Waves"] },
    aim: "Relate frequency to pitch, amplitude to loudness, and wavelength to wave speed.",
    theory: "Pitch depends on frequency, loudness depends on amplitude and intensity, and wavelength equals speed divided by frequency.",
    apparatus: ["Wave source", "Audio oscillator", "Graph plotter"],
    formulae: [{ id: "wave-speed", name: "Wave relation", expression: "v = f\\lambda", variables: [{ symbol: "f", name: "Frequency", unit: "Hz" }, { symbol: "\\lambda", name: "Wavelength", unit: "m" }] }],
    procedure: ["Change frequency and listen for pitch.", "Change amplitude and compare intensity.", "Move the detector farther away.", "Record wavelength."],
    simulationSetup: { gravity: 9.81, objects: [createObject("wave-source", 360, 300), createObject("graph-plotter", 620, 300)] },
    observationColumns: ["Frequency", "Amplitude", "Distance", "Wavelength", "Relative intensity"],
    expectedResult: "Higher frequency gives higher pitch; higher amplitude gives louder sound.",
    vivaQuestions: [{ prompt: "What physical quantity controls pitch?", answer: "Frequency." }],
    commonMistakes: ["Calling amplitude pitch", "Forgetting sound intensity drops with distance"]
  },
  {
    id: "static-electricity",
    title: "Static Electricity and Lightning",
    category: "Electricity",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 12 foundation",
    curriculumTags: { classes: [8, 12], unitIds: ["c8-electric-natural", "c12-electricity-magnetism"], topicIds: ["c8-static-lightning", "c12-electrostatics"], domains: ["Electricity"] },
    aim: "Explore attraction, repulsion, and the distance dependence of electric force.",
    theory: "Like charges repel, unlike charges attract, and electric force follows an inverse-square relation.",
    apparatus: ["Charges", "Electric field region", "Ruler"],
    formulae: [{ id: "coulomb", name: "Coulomb's law", expression: "F = k\\frac{q_1q_2}{r^2}", variables: [{ symbol: "q", name: "Charge", unit: "C" }] }],
    procedure: ["Choose two charges.", "Change their separation.", "Observe attraction or repulsion.", "Connect charge build-up to lightning safety."],
    simulationSetup: { gravity: 9.81, objects: [createObject("charge", 360, 300), { ...createObject("charge", 560, 300), charge: -1 }, createObject("electric-field-region", 460, 300)] },
    observationColumns: ["Charge 1", "Charge 2", "Distance", "Force", "Interaction"],
    expectedResult: "Like charges repel, unlike charges attract, and force reduces rapidly with distance.",
    vivaQuestions: [{ prompt: "Why is earthing used during lightning?", answer: "It gives charge a safe path to ground." }],
    commonMistakes: ["Forgetting charge signs", "Thinking distance changes force linearly"]
  },
  {
    id: "chemical-effects-current",
    title: "Chemical Effects of Current",
    category: "Electricity",
    difficulty: "Beginner",
    classLevel: "Class 8",
    curriculumTags: { classes: [8], unitIds: ["c8-electric-natural"], topicIds: ["c8-chemical-current"], domains: ["Electricity"] },
    aim: "Model electrolysis/electroplating as charge passing through a conducting solution.",
    theory: "Conducting liquids allow current through ions; deposited material depends on current and time.",
    apparatus: ["Battery", "Electrodes", "Conducting liquid", "Switch"],
    formulae: [{ id: "charge", name: "Charge passed", expression: "Q = It", variables: [{ symbol: "I", name: "Current", unit: "A" }, { symbol: "t", name: "Time", unit: "s" }] }],
    procedure: ["Set current.", "Set time.", "Change electrochemical factor.", "Compare relative deposited mass."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 320, 300), createObject("switch", 450, 300), createObject("fluid-region", 600, 360)] },
    observationColumns: ["Current", "Time", "Charge", "Relative deposit"],
    expectedResult: "More current and longer time produce more deposited material.",
    vivaQuestions: [{ prompt: "What carries current in conducting liquids?", answer: "Ions." }],
    commonMistakes: ["Assuming all liquids conduct equally", "Ignoring time when comparing deposited mass"]
  },
  {
    id: "free-fall",
    title: "Free Fall",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 9 / Class 11",
    curriculumTags: { classes: [9, 11], unitIds: ["c9-motion-force-work", "c11-measurement-kinematics"], topicIds: ["c9-gravitation", "c11-straight-line"], domains: ["Mechanics"] },
    aim: "Study motion under gravity and calculate impact speed and time of fall.",
    theory: "For ideal free fall, acceleration is constant and equal to g downward.",
    apparatus: ["Ball", "Stopwatch", "Height scale", "Motion sensor"],
    formulae: [{ id: "free-fall", name: "Free fall", expression: "v^2 = u^2 + 2gh", variables: [{ symbol: "h", name: "Height", unit: "m" }] }],
    procedure: ["Set drop height.", "Choose initial speed.", "Change g.", "Compare time and impact speed."],
    simulationSetup: { gravity: 9.81, objects: [createObject("ball", 360, 120), createObject("floor", 460, 560), createObject("stopwatch", 620, 220)] },
    observationColumns: ["Height", "Initial speed", "g", "Time", "Impact speed"],
    expectedResult: "For rest drops, fall time varies with square root of height.",
    vivaQuestions: [{ prompt: "Does mass affect ideal free-fall acceleration?", answer: "No, all objects accelerate at g when air resistance is ignored." }],
    commonMistakes: ["Using negative height", "Confusing g with speed"]
  },
  {
    id: "mass-and-weight",
    title: "Mass and Weight",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 9",
    curriculumTags: { classes: [9], unitIds: ["c9-motion-force-work"], topicIds: ["c9-gravitation"], domains: ["Mechanics"] },
    aim: "Compare mass and weight across different gravitational fields.",
    theory: "Mass is amount of matter; weight is gravitational force W = mg.",
    apparatus: ["Spring balance", "Mass", "Gravity selector"],
    formulae: [{ id: "weight", name: "Weight", expression: "W = mg", variables: [{ symbol: "m", name: "Mass", unit: "kg" }] }],
    procedure: ["Set mass.", "Change gravity.", "Observe weight.", "Compare balance and spring readings."],
    simulationSetup: { gravity: 9.81, objects: [createObject("block", 380, 240), createObject("spring", 500, 220)] },
    observationColumns: ["Mass", "g", "Weight", "Spring stretch"],
    expectedResult: "Mass remains constant but weight changes when g changes.",
    vivaQuestions: [{ prompt: "What is the SI unit of weight?", answer: "Newton." }],
    commonMistakes: ["Writing weight in kilograms", "Thinking mass changes on the Moon"]
  },
  {
    id: "work-power",
    title: "Work and Power",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 9 / Class 11",
    curriculumTags: { classes: [9, 11], unitIds: ["c9-motion-force-work", "c11-mechanics-core"], topicIds: ["c9-work-energy", "c11-energy-collisions"], domains: ["Mechanics"] },
    aim: "Calculate work done and power for a force moving an object through a displacement.",
    theory: "Work is energy transferred by force through displacement; power is work done per unit time.",
    apparatus: ["Block", "Force arrow", "Ruler", "Stopwatch"],
    formulae: [{ id: "work-power", name: "Work and power", expression: "W = Fs,\\quad P = \\frac{W}{t}", variables: [{ symbol: "F", name: "Force", unit: "N" }] }],
    procedure: ["Set force.", "Set displacement.", "Set time.", "Compare work and power."],
    simulationSetup: { gravity: 9.81, objects: [createObject("block", 360, 260), createObject("force-arrow", 500, 260), createObject("ruler", 460, 420)] },
    observationColumns: ["Force", "Displacement", "Time", "Work", "Power"],
    expectedResult: "The same work done in less time gives greater power.",
    vivaQuestions: [{ prompt: "When is work zero?", answer: "When displacement in the force direction is zero." }],
    commonMistakes: ["Using time in work formula", "Forgetting power depends on time"]
  },
  {
    id: "echo-speed-sound",
    title: "Echo and Speed of Sound",
    category: "Waves",
    difficulty: "Intermediate",
    classLevel: "Class 9",
    curriculumTags: { classes: [9], unitIds: ["c9-motion-force-work"], topicIds: ["c9-sound"], domains: ["Waves"] },
    aim: "Use echo timing to estimate distance or sound speed.",
    theory: "An echo is reflected sound; the measured time is for the sound to travel to the reflector and back.",
    apparatus: ["Sound source", "Wall", "Stopwatch", "Temperature control"],
    formulae: [{ id: "echo", name: "Echo distance", expression: "d = \\frac{vt}{2}", variables: [{ symbol: "v", name: "Sound speed", unit: "m/s" }] }],
    procedure: ["Set echo time.", "Change air temperature.", "Calculate measured distance.", "Compare with a known reflector distance."],
    simulationSetup: { gravity: 9.81, objects: [createObject("wave-source", 260, 300), createObject("wall", 700, 300), createObject("stopwatch", 480, 420)] },
    observationColumns: ["Echo time", "Temperature", "Speed", "Distance"],
    expectedResult: "Distance to the reflector is half the sound travel distance.",
    vivaQuestions: [{ prompt: "Why divide by 2 in echo calculations?", answer: "The sound travels to the wall and back." }],
    commonMistakes: ["Forgetting round trip distance", "Using 330 m/s for every temperature without checking"]
  },
  {
    id: "mirror-formula",
    title: "Mirror Formula",
    category: "Optics",
    difficulty: "Intermediate",
    classLevel: "Class 10",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-natural-phenomena", "c12-optics-modern"], topicIds: ["c10-mirrors", "c12-ray-optics"], domains: ["Optics"] },
    aim: "Use the mirror formula to calculate image distance and magnification for a concave mirror.",
    theory: "For spherical mirrors, object distance, image distance, and focal length are related by 1/f = 1/v + 1/u.",
    apparatus: ["Concave mirror", "Object", "Screen", "Ruler"],
    formulae: [{ id: "mirror", name: "Mirror formula", expression: "\\frac{1}{f}=\\frac{1}{v}+\\frac{1}{u}", variables: [{ symbol: "f", name: "Focal length", unit: "cm" }] }],
    procedure: ["Set focal length.", "Move object.", "Observe image distance.", "Calculate magnification and image height."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 230, 300), createObject("concave-mirror", 620, 300), createObject("ruler", 430, 450)] },
    observationColumns: ["Focal length", "Object distance", "Image distance", "Magnification"],
    expectedResult: "Image position changes sharply when object distance approaches focal length.",
    vivaQuestions: [{ prompt: "What happens when the object is at focus?", answer: "Reflected rays emerge parallel and image forms at infinity ideally." }],
    commonMistakes: ["Ignoring Cartesian sign convention", "Mixing cm and m"]
  },
  {
    id: "lens-formula",
    title: "Lens Formula",
    category: "Optics",
    difficulty: "Intermediate",
    classLevel: "Class 10 / Class 12",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-natural-phenomena", "c12-optics-modern"], topicIds: ["c10-lenses", "c12-ray-optics"], domains: ["Optics"] },
    aim: "Calculate image distance and magnification for a convex lens.",
    theory: "For a thin lens, focal length, object distance, and image distance follow 1/f = 1/v - 1/u.",
    apparatus: ["Convex lens", "Object", "Screen", "Ruler"],
    formulae: [{ id: "lens", name: "Lens formula", expression: "\\frac{1}{f}=\\frac{1}{v}-\\frac{1}{u}", variables: [{ symbol: "f", name: "Focal length", unit: "cm" }] }],
    procedure: ["Set focal length.", "Move object.", "Track image type.", "Record magnification."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 220, 300), createObject("convex-lens", 500, 300), createObject("ruler", 430, 450)] },
    observationColumns: ["Focal length", "Object distance", "Image distance", "Image type"],
    expectedResult: "Object outside focus gives real image; object inside focus gives virtual image.",
    vivaQuestions: [{ prompt: "What is lens power?", answer: "Power is reciprocal of focal length in metres." }],
    commonMistakes: ["Using centimetres when calculating power", "Ignoring sign convention"]
  },
  {
    id: "glass-slab-refraction",
    title: "Glass Slab Refraction",
    category: "Optics",
    difficulty: "Intermediate",
    classLevel: "Class 10",
    curriculumTags: { classes: [10], unitIds: ["c10-natural-phenomena"], topicIds: ["c10-glass-prism"], domains: ["Optics"] },
    aim: "Trace refraction through a rectangular glass slab and calculate refraction angle.",
    theory: "A ray bends towards the normal on entering glass and away from the normal on leaving, emerging parallel with lateral shift.",
    apparatus: ["Light ray", "Glass slab", "Protractor", "Screen"],
    formulae: [{ id: "snell", name: "Snell's law", expression: "\\frac{\\sin i}{\\sin r}=n", variables: [{ symbol: "n", name: "Refractive index", unit: "" }] }],
    procedure: ["Set incidence angle.", "Set refractive index.", "Change slab thickness.", "Observe refracted angle and emergent ray."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 220, 300), createObject("prism", 520, 300), createObject("protractor", 420, 420)] },
    observationColumns: ["Incidence angle", "Refractive index", "Thickness", "Refraction angle"],
    expectedResult: "The emergent ray is parallel to the incident ray but laterally shifted.",
    vivaQuestions: [{ prompt: "Why does light bend in glass?", answer: "Its speed changes when entering a medium of different refractive index." }],
    commonMistakes: ["Measuring angle from surface instead of normal", "Expecting emergent ray to keep bending away"]
  },
  {
    id: "prism-dispersion",
    title: "Prism Dispersion",
    category: "Optics",
    difficulty: "Intermediate",
    classLevel: "Class 10 / Class 12",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-natural-phenomena", "c12-optics-modern"], topicIds: ["c10-glass-prism", "c12-ray-optics"], domains: ["Optics"] },
    aim: "Trace incident, refracted, and emergent rays through a prism, then compare deviation, minimum deviation, and colour dispersion.",
    theory: "A prism refracts light at two faces. Since refractive index is slightly larger for shorter wavelengths, violet bends more than red and white light spreads into VIBGYOR.",
    apparatus: ["White light ray", "Glass prism", "Protractor", "Normal markers", "Screen", "Colour spectrum scale"],
    formulae: [
      { id: "prism-deviation", name: "Approximate deviation", expression: "\\delta \\approx (n-1)A", variables: [{ symbol: "A", name: "Prism angle", unit: "degree" }, { symbol: "n", name: "Refractive index", unit: "" }] },
      { id: "minimum-deviation", name: "Minimum deviation", expression: "n=\\frac{\\sin((A+D_m)/2)}{\\sin(A/2)}", variables: [{ symbol: "D_m", name: "Minimum deviation", unit: "degree" }] },
      { id: "snell-prism", name: "Snell at prism faces", expression: "\\sin i=n\\sin r_1,\\ r_1+r_2=A,\\ n\\sin r_2=\\sin e", variables: [{ symbol: "i", name: "Incidence angle", unit: "degree" }, { symbol: "e", name: "Emergence angle", unit: "degree" }] }
    ],
    procedure: ["Mark the normal at the first prism face.", "Trace the incident ray and first refracted ray.", "Trace the second refraction and emergent ray.", "Compare red and violet deviation on the screen.", "Switch materials and identify the widest spectrum."],
    simulationSetup: { gravity: 9.81, objects: [{ ...createObject("light-ray", 220, 300), wavelength: 0 }, createObject("prism", 500, 300)] },
    observationColumns: ["Prism angle A", "Material / n", "i", "r1", "r2", "e", "Deviation", "Violet-red spread"],
    expectedResult: "Larger prism angle and stronger dispersion create a wider visible spectrum.",
    vivaQuestions: [
      { prompt: "Which colour deviates more in normal glass?", answer: "Violet deviates more than red because glass has a slightly larger refractive index for shorter wavelengths." },
      { prompt: "Why does white light split in a prism?", answer: "Each wavelength travels with a different speed in glass, so each colour refracts by a different amount." },
      { prompt: "What is minimum deviation?", answer: "It is the least deviation produced by the prism, occurring when the ray path is symmetric inside the prism." },
      { prompt: "How are prism angles measured?", answer: "Incidence, refraction, emergence, and critical angles are measured from the normal." }
    ],
    commonMistakes: ["Measuring angles from the prism surface instead of the normal", "Thinking all colours refract equally", "Reversing red and violet order", "Confusing deviation with dispersion", "Using the minimum-deviation formula when the path is not symmetric"]
  },
  {
    id: "ohms-law",
    title: "Ohm's Law V-I Graph",
    category: "Electricity",
    difficulty: "Beginner",
    classLevel: "Class 10 / Class 12",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-effects-current", "c12-electricity-magnetism"], topicIds: ["c10-ohms-law", "c12-current"], domains: ["Electricity"] },
    aim: "Plot voltage against current and determine resistance from the graph slope.",
    theory: "For an ohmic conductor at constant temperature, V is directly proportional to I.",
    apparatus: ["Battery", "Resistor", "Ammeter", "Voltmeter", "Switch"],
    formulae: [{ id: "ohm", name: "Ohm's law", expression: "V = IR", variables: [{ symbol: "V", name: "Voltage", unit: "V" }, { symbol: "I", name: "Current", unit: "A" }] }],
    procedure: ["Set current.", "Choose resistance.", "Record voltage.", "Use V-I slope as resistance."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 260, 300), createObject("resistor", 410, 300), createObject("ammeter", 540, 300), createObject("voltmeter", 660, 300)] },
    observationColumns: ["Current", "Resistance", "Voltage", "Graph slope"],
    expectedResult: "The V-I graph is a straight line through origin for an ohmic conductor.",
    vivaQuestions: [{ prompt: "What does slope of V-I graph represent?", answer: "Resistance." }],
    commonMistakes: ["Plotting I on the wrong axis without adjusting slope meaning", "Changing temperature during readings"]
  },
  {
    id: "series-parallel-resistance",
    title: "Series and Parallel Resistance",
    category: "Electricity",
    difficulty: "Intermediate",
    classLevel: "Class 10 / Class 12",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-effects-current", "c12-electricity-magnetism"], topicIds: ["c10-series-parallel", "c12-current"], domains: ["Electricity"] },
    aim: "Compare equivalent resistance and current in series and parallel circuits.",
    theory: "Series resistances add; parallel conductances add.",
    apparatus: ["Battery", "Resistors", "Ammeter", "Voltmeter", "Wires"],
    formulae: [{ id: "equivalent-resistance", name: "Equivalent resistance", expression: "R_s=R_1+R_2,\\quad R_p=\\frac{R_1R_2}{R_1+R_2}", variables: [{ symbol: "R", name: "Resistance", unit: "ohm" }] }],
    procedure: ["Set two resistances.", "Set supply voltage.", "Compare series current.", "Compare parallel equivalent resistance and current."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 240, 300), createObject("resistor", 390, 260), createObject("resistor", 530, 260), createObject("ammeter", 670, 300)] },
    observationColumns: ["R1", "R2", "Voltage", "Series current", "Parallel current"],
    expectedResult: "Parallel equivalent resistance is less than each individual branch resistance.",
    vivaQuestions: [{ prompt: "Why are home appliances connected in parallel?", answer: "Each gets full voltage and works independently." }],
    commonMistakes: ["Adding parallel resistances directly", "Confusing current distribution with voltage distribution"]
  },
  {
    id: "electric-power",
    title: "Electric Power and Energy",
    category: "Electricity",
    difficulty: "Beginner",
    classLevel: "Class 10",
    curriculumTags: { classes: [10], unitIds: ["c10-effects-current"], topicIds: ["c10-electric-power"], domains: ["Electricity"] },
    aim: "Connect circuit power to electrical energy consumed over time.",
    theory: "Power is the rate of electrical energy use; P = VI and energy equals power times time.",
    apparatus: ["Battery", "Bulb", "Ammeter", "Voltmeter", "Energy meter"],
    formulae: [{ id: "power", name: "Electric power", expression: "P = VI", variables: [{ symbol: "P", name: "Power", unit: "W" }] }],
    procedure: ["Set voltage and current.", "Choose time in hours.", "Calculate power and kWh.", "Relate to appliance ratings."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 260, 300), createObject("bulb", 440, 300), createObject("ammeter", 570, 300), createObject("voltmeter", 690, 300)] },
    observationColumns: ["Voltage", "Current", "Power", "Time", "Energy"],
    expectedResult: "Energy consumed increases with both power rating and usage time.",
    vivaQuestions: [{ prompt: "What is one commercial unit of electrical energy?", answer: "One kilowatt-hour." }],
    commonMistakes: ["Using watts directly as kWh", "Forgetting to convert W to kW"]
  },
  {
    id: "magnetic-field-current",
    title: "Magnetic Field Around Current",
    category: "Magnetism",
    difficulty: "Intermediate",
    classLevel: "Class 10 / Class 12",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-effects-current", "c12-electricity-magnetism"], topicIds: ["c10-magnetism", "c12-magnetic-effects"], domains: ["Magnetism"] },
    aim: "Visualize magnetic field strength around a wire and coil as current changes.",
    theory: "A current-carrying conductor produces circular magnetic field lines; field strength increases with current.",
    apparatus: ["Current wire", "Compass", "Battery", "Coil"],
    formulae: [{ id: "wire-field", name: "Straight wire field", expression: "B = \\frac{\\mu_0 I}{2\\pi r}", variables: [{ symbol: "I", name: "Current", unit: "A" }] }],
    procedure: ["Set current.", "Move compass away from wire.", "Increase coil turns.", "Use right-hand thumb rule to predict field direction."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 260, 300), createObject("bar-magnet", 520, 300), createObject("wire", 440, 300)] },
    observationColumns: ["Current", "Distance", "Turns", "Field", "Direction rule"],
    expectedResult: "Field increases with current and coil turns, and decreases with distance.",
    vivaQuestions: [{ prompt: "State the right-hand thumb rule.", answer: "Thumb points current direction; curled fingers show magnetic field direction." }],
    commonMistakes: ["Reversing field direction", "Ignoring distance from wire"]
  }
];
function seniorExperiment(input) {
  return {
    id: input.id,
    title: input.title,
    category: input.category,
    difficulty: input.difficulty ?? "Intermediate",
    classLevel: input.classLevel,
    curriculumTags: { classes: input.classes, unitIds: input.unitIds, topicIds: input.topicIds, domains: input.domains },
    aim: input.aim,
    theory: input.theory,
    apparatus: input.apparatus,
    formulae: [{ id: input.formula.id, name: input.formula.name, expression: input.formula.expression, variables: [{ symbol: input.formula.symbol, name: input.formula.variable, unit: input.formula.unit }] }],
    procedure: input.procedure,
    simulationSetup: { gravity: 9.81, objects: input.objects },
    observationColumns: input.observationColumns,
    expectedResult: input.expectedResult,
    vivaQuestions: [input.viva],
    commonMistakes: input.commonMistakes
  };
}
var phase3SeniorExperiments = [
  seniorExperiment({
    id: "measurement-errors",
    title: "Measurement, Error, and Significant Figures",
    category: "Measurement",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-measurement-kinematics"],
    topicIds: ["c11-units-errors"],
    domains: ["Measurement"],
    aim: "Estimate absolute, relative, and percentage error from repeated measurements.",
    theory: "Reliable physics measurements include uncertainty, least count, and significant figures.",
    apparatus: ["Vernier caliper", "Screw gauge", "Error table"],
    formula: { id: "percentage-error", name: "Percentage error", expression: "\\%\\ error = \\frac{\\Delta x}{x}\\times 100", symbol: "\\Delta x", variable: "Absolute error", unit: "unit of x" },
    procedure: ["Set a measured value.", "Set absolute error.", "Choose repeated readings.", "Compare percentage error and rounded reporting."],
    objects: [createObject("ruler", 360, 300), createObject("graph-plotter", 560, 300)],
    observationColumns: ["Reading", "Mean", "Absolute error", "Percentage error", "Report"],
    expectedResult: "Smaller least count and repeated readings reduce uncertainty in the final reported value.",
    viva: { prompt: "Why do we write uncertainty with a measurement?", answer: "It shows the reliability and possible range of the measured value." },
    commonMistakes: ["Reporting too many digits", "Confusing absolute and percentage error"],
    difficulty: "Beginner"
  }),
  seniorExperiment({
    id: "vector-resolution",
    title: "Vector Resolution",
    category: "Mechanics",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-measurement-kinematics"],
    topicIds: ["c11-plane-motion"],
    domains: ["Mechanics"],
    aim: "Resolve a vector into rectangular components and reconstruct its magnitude.",
    theory: "Any two-dimensional vector can be written as Ax i + Ay j using sine and cosine.",
    apparatus: ["Vector arrows", "Protractor", "Graph grid"],
    formula: { id: "vector-components", name: "Vector components", expression: "A_x=A\\cos\\theta,\\quad A_y=A\\sin\\theta", symbol: "A", variable: "Vector magnitude", unit: "unit" },
    procedure: ["Set vector magnitude.", "Set angle.", "Read components.", "Recombine components to verify the original vector."],
    objects: [createObject("force-arrow", 440, 300), createObject("protractor", 440, 410), createObject("graph-plotter", 620, 300)],
    observationColumns: ["Magnitude", "Angle", "x-component", "y-component", "Reconstructed magnitude"],
    expectedResult: "The component square sum equals the original magnitude squared.",
    viva: { prompt: "Which component uses cosine when angle is measured from x-axis?", answer: "The x-component." },
    commonMistakes: ["Swapping sine and cosine", "Using degrees as radians"]
  }),
  seniorExperiment({
    id: "rotational-dynamics",
    title: "Rotational Dynamics",
    category: "Mechanics",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-mechanics-core"],
    topicIds: ["c11-rotation"],
    domains: ["Mechanics"],
    aim: "Relate torque, moment of inertia, and angular acceleration for rotating bodies.",
    theory: "Rotational motion follows tau = I alpha, the angular analogue of F = ma.",
    apparatus: ["Disc", "Rod", "Wheel", "Torque arm"],
    formula: { id: "torque", name: "Rotational equation", expression: "\\tau = I\\alpha", symbol: "\\tau", variable: "Torque", unit: "N m" },
    procedure: ["Choose moment of inertia.", "Apply torque.", "Observe angular acceleration.", "Compare angular speed after a fixed time."],
    objects: [createObject("disc", 420, 300), createObject("rod", 560, 300), createObject("force-arrow", 650, 300)],
    observationColumns: ["Torque", "Moment of inertia", "Angular acceleration", "Angular speed"],
    expectedResult: "For the same torque, larger moment of inertia gives smaller angular acceleration.",
    viva: { prompt: "What is the rotational analogue of mass?", answer: "Moment of inertia." },
    commonMistakes: ["Using linear acceleration instead of angular acceleration", "Ignoring radius distribution"]
  }),
  seniorExperiment({
    id: "satellite-orbit",
    title: "Satellite Orbit and Escape Speed",
    category: "Astronomy",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-mechanics-core"],
    topicIds: ["c11-gravitation"],
    domains: ["Astronomy", "Mechanics"],
    aim: "Compare orbital speed, escape speed, and orbital period around a planet.",
    theory: "Gravity supplies centripetal force for circular orbit; escape speed is sqrt(2) times orbital speed at the same radius.",
    apparatus: ["Planet", "Satellite", "Orbit visualizer"],
    formula: { id: "orbital-speed", name: "Orbital speed", expression: "v_o=\\sqrt{\\frac{GM}{r}}", symbol: "r", variable: "Orbital radius", unit: "m" },
    procedure: ["Set planet mass factor.", "Set orbital radius.", "Compare orbital and escape speeds.", "Estimate orbital period."],
    objects: [createObject("ball", 420, 300), createObject("wheel", 560, 300), createObject("velocity-arrow", 640, 260)],
    observationColumns: ["Mass factor", "Radius", "Orbital speed", "Escape speed", "Period"],
    expectedResult: "Escape speed is greater than circular orbital speed at the same orbital radius.",
    viva: { prompt: "What provides centripetal force for a satellite?", answer: "Gravitational force." },
    commonMistakes: ["Using surface radius when altitude is specified", "Confusing orbital and escape speed"]
  }),
  seniorExperiment({
    id: "bernoulli-fluid-flow",
    title: "Bernoulli Fluid Flow",
    category: "Fluid Mechanics",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-matter-thermal-waves"],
    topicIds: ["c11-solids-fluids"],
    domains: ["Fluid Mechanics"],
    aim: "Explore pressure-speed-height tradeoffs in streamline fluid flow.",
    theory: "For ideal flow, pressure energy, kinetic energy per volume, and gravitational potential per volume remain conserved along a streamline.",
    apparatus: ["Flow tube", "Pressure sensors", "Fluid region"],
    formula: { id: "bernoulli", name: "Bernoulli equation", expression: "P+\\frac{1}{2}\\rho v^2+\\rho gh=constant", symbol: "v", variable: "Flow speed", unit: "m/s" },
    procedure: ["Set density.", "Increase speed.", "Raise outlet height.", "Observe pressure change."],
    objects: [createObject("fluid-region", 440, 360), createObject("motion-sensor", 360, 240), createObject("graph-plotter", 620, 300)],
    observationColumns: ["Density", "Speed", "Height", "Dynamic pressure", "Available pressure"],
    expectedResult: "Higher flow speed or height leaves less static pressure in the same streamline.",
    viva: { prompt: "Why does pressure drop in a narrow fast-flowing section?", answer: "Kinetic energy per volume increases, so static pressure decreases." },
    commonMistakes: ["Applying Bernoulli across turbulent losses", "Ignoring density units"]
  }),
  seniorExperiment({
    id: "gas-laws",
    title: "Gas Laws and Kinetic Theory",
    category: "Thermodynamics",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-matter-thermal-waves"],
    topicIds: ["c11-thermal", "c11-kinetic-theory"],
    domains: ["Thermodynamics"],
    aim: "Use the ideal gas law to connect pressure, volume, temperature, and amount of gas.",
    theory: "Ideal gas pressure comes from molecular collisions and follows PV = nRT.",
    apparatus: ["Gas container", "Thermometer", "PV graph"],
    formula: { id: "ideal-gas-law", name: "Ideal gas law", expression: "PV=nRT", symbol: "P", variable: "Pressure", unit: "Pa" },
    procedure: ["Set moles.", "Change temperature.", "Change volume.", "Record pressure and PV/T trend."],
    objects: [createObject("gas-container", 430, 300), createObject("thermometer", 600, 270), createObject("graph-plotter", 690, 320)],
    observationColumns: ["Moles", "Temperature", "Volume", "Pressure", "PV/T"],
    expectedResult: "At fixed n, pressure rises with temperature and falls as volume increases.",
    viva: { prompt: "What does absolute zero mean in kinetic theory?", answer: "It is the ideal limit where molecular translational kinetic energy tends to minimum." },
    commonMistakes: ["Using Celsius in PV = nRT", "Forgetting volume must be in cubic metres"]
  }),
  seniorExperiment({
    id: "thermodynamic-process",
    title: "Thermodynamic Processes",
    category: "Thermodynamics",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-matter-thermal-waves"],
    topicIds: ["c11-thermal"],
    domains: ["Thermodynamics"],
    aim: "Compare isothermal, isobaric, and isochoric process work and heat trends.",
    theory: "Work done by a gas is the area under the PV curve, with different constraints for different processes.",
    apparatus: ["Gas container", "Piston", "PV graph"],
    formula: { id: "gas-work", name: "Gas work", expression: "W=P\\Delta V", symbol: "W", variable: "Work", unit: "J" },
    procedure: ["Set pressure.", "Set volume change.", "Choose process factor.", "Compare work and energy trend."],
    objects: [createObject("gas-container", 430, 300), createObject("graph-plotter", 650, 300)],
    observationColumns: ["Pressure", "Delta volume", "Process", "Work", "Heat trend"],
    expectedResult: "Isochoric work is zero, while isobaric work equals pressure times volume change.",
    viva: { prompt: "What does area under a PV curve represent?", answer: "Work done by the gas." },
    commonMistakes: ["Using gauge pressure inconsistently", "Forgetting no volume change means zero work"]
  }),
  seniorExperiment({
    id: "shm-spring",
    title: "Spring-Mass SHM",
    category: "Waves",
    classLevel: "Class 11",
    classes: [11],
    unitIds: ["c11-matter-thermal-waves"],
    topicIds: ["c11-oscillations-waves"],
    domains: ["Waves", "Mechanics"],
    aim: "Study simple harmonic motion of a spring-mass oscillator.",
    theory: "For small oscillations, angular frequency is sqrt(k/m), independent of amplitude.",
    apparatus: ["Spring", "Mass", "Timer", "Graph plotter"],
    formula: { id: "spring-period", name: "Spring period", expression: "T=2\\pi\\sqrt{\\frac{m}{k}}", symbol: "T", variable: "Period", unit: "s" },
    procedure: ["Set spring constant.", "Set mass.", "Set amplitude.", "Compare period and maximum speed."],
    objects: [createObject("spring", 420, 300), createObject("block", 560, 300), createObject("graph-plotter", 680, 300)],
    observationColumns: ["k", "Mass", "Amplitude", "Period", "Max speed"],
    expectedResult: "Increasing mass increases period; increasing spring constant decreases period.",
    viva: { prompt: "Does amplitude affect ideal SHM period?", answer: "No, not for ideal small oscillations." },
    commonMistakes: ["Using k/m instead of m/k in period", "Confusing angular frequency with frequency"]
  }),
  seniorExperiment({
    id: "electrostatic-field-potential",
    title: "Electrostatic Field and Potential",
    category: "Electricity",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-electricity-magnetism"],
    topicIds: ["c12-electrostatics"],
    domains: ["Electricity"],
    aim: "Compare electric field and potential around point charges.",
    theory: "Electric field is force per unit charge, while potential is work per unit charge.",
    apparatus: ["Point charges", "Electric field region", "Probe"],
    formula: { id: "electric-field", name: "Point charge field", expression: "E=\\frac{kq}{r^2}", symbol: "E", variable: "Electric field", unit: "N/C" },
    procedure: ["Set charge.", "Move probe distance.", "Compare field and potential.", "Switch charge sign."],
    objects: [createObject("charge", 400, 300), createObject("electric-field-region", 530, 300), createObject("motion-sensor", 650, 300)],
    observationColumns: ["Charge", "Distance", "Electric field", "Potential", "Sign"],
    expectedResult: "Field follows inverse square with distance; potential follows inverse distance.",
    viva: { prompt: "Is electric potential a scalar or vector?", answer: "Scalar." },
    commonMistakes: ["Treating potential as a vector", "Forgetting sign of charge"]
  }),
  seniorExperiment({
    id: "capacitor-lab",
    title: "Capacitor Energy and Combination",
    category: "Electricity",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-electricity-magnetism"],
    topicIds: ["c12-electrostatics"],
    domains: ["Electricity"],
    aim: "Calculate charge and stored energy for a capacitor and compare combinations.",
    theory: "A capacitor stores charge with Q = CV and energy U = 1/2 CV^2.",
    apparatus: ["Battery", "Capacitor plates", "Voltmeter"],
    formula: { id: "capacitor-energy", name: "Capacitor energy", expression: "U=\\frac{1}{2}CV^2", symbol: "C", variable: "Capacitance", unit: "F" },
    procedure: ["Set capacitance.", "Set voltage.", "Adjust second capacitance.", "Compare charge, energy, and equivalents."],
    objects: [createObject("battery", 320, 300), createObject("voltmeter", 500, 300), createObject("electric-field-region", 640, 300)],
    observationColumns: ["C1", "Voltage", "Charge", "Energy", "Equivalent C"],
    expectedResult: "Energy grows with the square of voltage.",
    viva: { prompt: "What happens to energy if voltage doubles?", answer: "Energy becomes four times larger for the same capacitance." },
    commonMistakes: ["Forgetting microfarad conversion", "Using U = CV instead of 1/2 CV^2"]
  }),
  seniorExperiment({
    id: "kirchhoff-circuit",
    title: "Kirchhoff Circuit Rules",
    category: "Electricity",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-electricity-magnetism"],
    topicIds: ["c12-current"],
    domains: ["Electricity"],
    aim: "Use junction and loop rules to analyse a two-resistor network.",
    theory: "Charge conservation gives junction rule, and energy conservation gives loop rule.",
    apparatus: ["Battery", "Resistors", "Ammeter", "Voltmeter"],
    formula: { id: "kirchhoff", name: "Loop rule", expression: "\\sum V = 0", symbol: "V", variable: "Potential difference", unit: "V" },
    procedure: ["Set supply voltage.", "Set two resistances.", "Estimate branch currents.", "Check voltage drops."],
    objects: [createObject("battery", 250, 300), createObject("resistor", 410, 260), createObject("resistor", 410, 360), createObject("ammeter", 580, 300)],
    observationColumns: ["Voltage", "R1", "R2", "Branch currents", "Loop check"],
    expectedResult: "At a junction, incoming current equals outgoing current.",
    viva: { prompt: "What physical principle underlies Kirchhoff's current rule?", answer: "Conservation of charge." },
    commonMistakes: ["Mixing sign convention in loops", "Adding branch currents incorrectly"]
  }),
  seniorExperiment({
    id: "lorentz-force",
    title: "Lorentz Force on Moving Charge",
    category: "Magnetism",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-electricity-magnetism"],
    topicIds: ["c12-magnetic-effects"],
    domains: ["Magnetism"],
    aim: "Calculate magnetic force and circular radius for a moving charged particle.",
    theory: "A charge moving perpendicular to a magnetic field experiences force qvB and follows circular motion.",
    apparatus: ["Charge", "Magnetic field", "Velocity arrow"],
    formula: { id: "lorentz", name: "Magnetic force", expression: "F=qvB", symbol: "F", variable: "Force", unit: "N" },
    procedure: ["Set charge.", "Set speed.", "Set magnetic field.", "Compare force and path radius."],
    objects: [createObject("charge", 420, 300), createObject("bar-magnet", 560, 300), createObject("velocity-arrow", 420, 230)],
    observationColumns: ["Charge", "Speed", "B", "Force", "Radius"],
    expectedResult: "Force increases linearly with charge, speed, and magnetic field strength.",
    viva: { prompt: "When is magnetic force on a moving charge zero?", answer: "When velocity is parallel to magnetic field or charge/speed is zero." },
    commonMistakes: ["Ignoring angle between velocity and field", "Confusing electric and magnetic force"]
  }),
  seniorExperiment({
    id: "emi-faraday",
    title: "Faraday Induction",
    category: "Electricity",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-electricity-magnetism"],
    topicIds: ["c12-emi-ac"],
    domains: ["Electricity", "Magnetism"],
    aim: "Explore induced emf from changing magnetic flux.",
    theory: "Faraday's law says induced emf equals the negative rate of change of magnetic flux linkage.",
    apparatus: ["Coil", "Bar magnet", "Galvanometer"],
    formula: { id: "faraday", name: "Faraday's law", expression: "\\mathcal{E}=-N\\frac{\\Delta\\Phi}{\\Delta t}", symbol: "\\mathcal{E}", variable: "Induced emf", unit: "V" },
    procedure: ["Set coil turns.", "Change flux.", "Change time interval.", "Observe induced emf and Lenz direction."],
    objects: [createObject("bar-magnet", 360, 300), createObject("wire", 500, 300), createObject("voltmeter", 650, 300)],
    observationColumns: ["Turns", "Flux change", "Time", "Induced emf", "Direction"],
    expectedResult: "Faster flux change and more turns produce larger induced emf.",
    viva: { prompt: "What does the negative sign in Faraday's law represent?", answer: "Lenz's law: induced effect opposes the change producing it." },
    commonMistakes: ["Using flux instead of change in flux", "Ignoring time interval"]
  }),
  seniorExperiment({
    id: "ac-lcr-resonance",
    title: "AC LCR Resonance",
    category: "Electricity",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-electricity-magnetism"],
    topicIds: ["c12-emi-ac"],
    domains: ["Electricity"],
    aim: "Compare reactance, impedance, current, and resonance in a series LCR circuit.",
    theory: "At resonance, inductive and capacitive reactances cancel and current is maximum.",
    apparatus: ["AC source", "Resistor", "Inductor", "Capacitor", "Ammeter"],
    formula: { id: "impedance", name: "Series LCR impedance", expression: "Z=\\sqrt{R^2+(X_L-X_C)^2}", symbol: "Z", variable: "Impedance", unit: "ohm" },
    procedure: ["Set resistance.", "Set frequency.", "Set capacitance.", "Observe reactance, impedance, and current."],
    objects: [createObject("battery", 250, 300), createObject("resistor", 390, 300), createObject("ammeter", 530, 300), createObject("graph-plotter", 680, 300)],
    observationColumns: ["R", "Frequency", "Capacitance", "Reactance gap", "Impedance", "Current"],
    expectedResult: "Current peaks when inductive and capacitive reactances are equal.",
    viva: { prompt: "What is the power factor at ideal series resonance?", answer: "One." },
    commonMistakes: ["Adding reactances directly without sign", "Confusing impedance and resistance"]
  }),
  seniorExperiment({
    id: "em-spectrum",
    title: "Electromagnetic Spectrum",
    category: "Waves",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-optics-modern"],
    topicIds: ["c12-em-waves"],
    domains: ["Waves"],
    aim: "Relate wavelength, frequency, energy, and common EM spectrum bands.",
    theory: "All electromagnetic waves travel at c in vacuum and satisfy c = f lambda.",
    apparatus: ["Spectrum viewer", "Frequency slider", "Wavelength scale"],
    formula: { id: "em-wave", name: "EM wave relation", expression: "c=f\\lambda", symbol: "f", variable: "Frequency", unit: "Hz" },
    procedure: ["Set frequency.", "Observe wavelength.", "Compare photon energy.", "Identify spectrum band."],
    objects: [createObject("light-ray", 340, 300), createObject("graph-plotter", 560, 300)],
    observationColumns: ["Frequency", "Wavelength", "Photon energy", "Band"],
    expectedResult: "Higher frequency means shorter wavelength and higher photon energy.",
    viva: { prompt: "Which has higher frequency: infrared or ultraviolet?", answer: "Ultraviolet." },
    commonMistakes: ["Thinking all EM waves need a medium", "Reversing wavelength-frequency relation"]
  }),
  seniorExperiment({
    id: "young-double-slit",
    title: "Young's Double Slit",
    category: "Waves",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-optics-modern"],
    topicIds: ["c12-wave-optics"],
    domains: ["Waves", "Optics"],
    aim: "Measure fringe width in a two-slit interference pattern.",
    theory: "Coherent light from two slits creates bright and dark fringes with beta = lambda D / d.",
    apparatus: ["Coherent source", "Double slit", "Screen"],
    formula: { id: "fringe-width", name: "Fringe width", expression: "\\beta=\\frac{\\lambda D}{d}", symbol: "\\beta", variable: "Fringe width", unit: "m" },
    procedure: ["Set wavelength.", "Set screen distance.", "Set slit separation.", "Record fringe width."],
    objects: [createObject("wave-source", 250, 300), createObject("wave-barrier", 430, 300), createObject("graph-plotter", 650, 300)],
    observationColumns: ["Wavelength", "Screen distance", "Slit separation", "Fringe width"],
    expectedResult: "Fringe width increases with wavelength and screen distance, and decreases with slit separation.",
    viva: { prompt: "What is needed for stable interference?", answer: "Coherent sources with fixed phase difference." },
    commonMistakes: ["Using nm directly as metres", "Confusing slit width with slit separation"]
  }),
  seniorExperiment({
    id: "photoelectric-equation",
    title: "Photoelectric Equation",
    category: "Modern Physics",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-optics-modern"],
    topicIds: ["c12-dual-atoms"],
    domains: ["Modern Physics"],
    aim: "Use Einstein's photoelectric equation to compare photon energy, work function, and stopping potential.",
    theory: "Electron kinetic energy equals photon energy minus metal work function when frequency exceeds threshold.",
    apparatus: ["Photoelectric tube", "Light source", "Retarding voltage"],
    formula: { id: "photoelectric", name: "Einstein equation", expression: "K_{max}=hf-\\phi", symbol: "K_{max}", variable: "Maximum kinetic energy", unit: "eV" },
    procedure: ["Set photon energy.", "Set work function.", "Set intensity.", "Observe emission and stopping potential."],
    objects: [createObject("light-ray", 300, 300), createObject("voltmeter", 560, 300), createObject("graph-plotter", 700, 300)],
    observationColumns: ["Photon energy", "Work function", "Kmax", "Stopping potential"],
    expectedResult: "Intensity changes photocurrent, while frequency controls maximum kinetic energy.",
    viva: { prompt: "What determines stopping potential?", answer: "Maximum kinetic energy of emitted electrons." },
    commonMistakes: ["Thinking intensity increases Kmax", "Forgetting threshold frequency"]
  }),
  seniorExperiment({
    id: "nuclear-decay",
    title: "Nuclear Decay and Half-Life",
    category: "Modern Physics",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-optics-modern"],
    topicIds: ["c12-dual-atoms"],
    domains: ["Modern Physics"],
    aim: "Model exponential radioactive decay and remaining nuclei after multiple half-lives.",
    theory: "Radioactive nuclei decay randomly, but large samples follow N = N0(1/2)^(t/T).",
    apparatus: ["Nuclear sample", "Counter", "Decay graph"],
    formula: { id: "half-life", name: "Half-life law", expression: "N=N_0\\left(\\frac{1}{2}\\right)^{t/T}", symbol: "T", variable: "Half-life", unit: "s" },
    procedure: ["Set initial nuclei.", "Set half-life.", "Advance time.", "Compare remaining fraction and activity."],
    objects: [createObject("graph-plotter", 460, 300), createObject("stopwatch", 640, 300)],
    observationColumns: ["Initial nuclei", "Half-life", "Elapsed time", "Remaining", "Activity fraction"],
    expectedResult: "After each half-life, half the remaining undecayed nuclei are left.",
    viva: { prompt: "Does half-life depend on initial amount?", answer: "No." },
    commonMistakes: ["Subtracting a fixed number each half-life", "Confusing mean life and half-life"]
  }),
  seniorExperiment({
    id: "semiconductor-diode",
    title: "Semiconductor Diode and Rectifier",
    category: "Electronics",
    classLevel: "Class 12",
    classes: [12],
    unitIds: ["c12-optics-modern"],
    topicIds: ["c12-semiconductors"],
    domains: ["Electronics"],
    aim: "Compare forward and reverse bias diode current and estimate rectified output.",
    theory: "A p-n junction conducts strongly after cut-in voltage in forward bias and blocks most reverse current.",
    apparatus: ["Diode", "Resistor", "AC source", "Voltmeter"],
    formula: { id: "diode-rectifier", name: "Half-wave output", expression: "V_{out}\\approx V_{in}-V_D", symbol: "V_D", variable: "Diode drop", unit: "V" },
    procedure: ["Set input voltage.", "Set diode drop.", "Set load resistance.", "Compare forward current and blocked reverse half-cycle."],
    objects: [createObject("battery", 260, 300), createObject("resistor", 430, 300), createObject("voltmeter", 590, 300), createObject("graph-plotter", 720, 300)],
    observationColumns: ["Input voltage", "Diode drop", "Load", "Forward current", "Rectified output"],
    expectedResult: "Forward current flows only when input exceeds diode drop; reverse half-cycle is blocked in half-wave rectification.",
    viva: { prompt: "What is cut-in voltage?", answer: "The approximate forward voltage beyond which diode current rises rapidly." },
    commonMistakes: ["Assuming an ideal zero-drop diode always", "Ignoring load resistance"]
  })
];
var gapFillSchoolExperiments = [
  {
    id: "shadows-eclipses",
    title: "Shadows and Eclipses",
    category: "Optics",
    difficulty: "Beginner",
    classLevel: "Class 7 / Class 8",
    curriculumTags: { classes: [7, 8], unitIds: ["c7-light", "c8-friction-sound-light"], topicIds: ["c7-reflection", "c8-light"], domains: ["Optics"] },
    aim: "Show rectilinear propagation of light using shadows, umbra, penumbra, and eclipses.",
    theory: "Light travels in straight lines. Extended sources produce umbra and penumbra regions behind an opaque object.",
    apparatus: ["Light source", "Opaque ball", "Screen", "Distance scale"],
    formulae: [{ id: "shadow-size", name: "Similar-triangle shadow", expression: "\\frac{D_s}{D_o}\\approx\\frac{L_s}{L_o}", variables: [{ symbol: "D_s", name: "Shadow diameter", unit: "cm" }, { symbol: "L_s", name: "Screen distance", unit: "cm" }] }],
    procedure: ["Adjust source size.", "Move the object from the screen.", "Watch umbra and penumbra change.", "Relate the setup to solar and lunar eclipses."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 230, 260), createObject("ball", 410, 260), createObject("wall", 650, 260)] },
    observationColumns: ["Source size", "Object distance", "Screen distance", "Umbra", "Penumbra"],
    expectedResult: "A smaller source gives a sharper shadow; an extended source creates penumbra around the umbra.",
    vivaQuestions: [{ prompt: "Why does a shadow form?", answer: "An opaque object blocks light that travels in straight lines." }],
    commonMistakes: ["Calling every dark region umbra", "Forgetting source size affects penumbra"]
  },
  {
    id: "multiple-reflection",
    title: "Multiple Reflection and Kaleidoscope",
    category: "Optics",
    difficulty: "Beginner",
    classLevel: "Class 8",
    curriculumTags: { classes: [8], unitIds: ["c8-friction-sound-light"], topicIds: ["c8-light"], domains: ["Optics"] },
    aim: "Predict number of images formed by two plane mirrors at different angles.",
    theory: "Two mirrors form repeated images. For many school cases, image count is approximately 360/theta - 1 when 360/theta is an integer.",
    apparatus: ["Two plane mirrors", "Protractor", "Object pin", "Kaleidoscope viewer"],
    formulae: [{ id: "mirror-images", name: "Number of images", expression: "n=\\frac{360}{\\theta}-1", variables: [{ symbol: "\\theta", name: "Mirror angle", unit: "degree" }] }],
    procedure: ["Set mirror angle.", "Place the object between mirrors.", "Count images.", "Compare with the formula and kaleidoscope symmetry."],
    simulationSetup: { gravity: 9.81, objects: [createObject("plane-mirror", 360, 260), createObject("plane-mirror", 500, 260), createObject("protractor", 430, 420)] },
    observationColumns: ["Mirror angle", "360/angle", "Predicted images", "Observed pattern"],
    expectedResult: "Smaller mirror angle produces more repeated images.",
    vivaQuestions: [{ prompt: "Why does a kaleidoscope show many patterns?", answer: "Multiple reflections occur between inclined plane mirrors." }],
    commonMistakes: ["Using radians instead of degrees", "Applying the integer formula to every non-integer angle without adjustment"]
  },
  {
    id: "sound-wave-anatomy",
    title: "Longitudinal Sound Wave",
    category: "Waves",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 9",
    curriculumTags: { classes: [8, 9], unitIds: ["c8-friction-sound-light", "c9-motion-force-work"], topicIds: ["c8-sound", "c9-sound"], domains: ["Waves"] },
    aim: "Visualize compressions, rarefactions, wavelength, frequency, amplitude, and speed of sound.",
    theory: "Sound in air is a longitudinal pressure wave. Particles oscillate back and forth while energy travels through the medium.",
    apparatus: ["Slinky", "Tuning fork", "Microphone", "Oscilloscope"],
    formulae: [{ id: "sound-speed", name: "Wave speed", expression: "v=f\\lambda", variables: [{ symbol: "f", name: "Frequency", unit: "Hz" }, { symbol: "\\lambda", name: "Wavelength", unit: "m" }] }],
    procedure: ["Change frequency.", "Change amplitude.", "Compare wavelength for fixed sound speed.", "Identify compression and rarefaction zones."],
    simulationSetup: { gravity: 9.81, objects: [createObject("wave-source", 260, 300), createObject("graph-plotter", 580, 300)] },
    observationColumns: ["Frequency", "Amplitude", "Wavelength", "Particle motion", "Wave speed"],
    expectedResult: "For fixed sound speed, higher frequency gives shorter wavelength.",
    vivaQuestions: [{ prompt: "Do air particles travel with the sound from source to listener?", answer: "No. They oscillate about their mean positions." }],
    commonMistakes: ["Drawing sound in air as a transverse wave only", "Confusing particle motion with wave travel direction"]
  },
  {
    id: "human-eye-defects",
    title: "Human Eye and Vision Defects",
    category: "Optics",
    difficulty: "Beginner",
    classLevel: "Class 10",
    curriculumTags: { classes: [10], unitIds: ["c10-natural-phenomena"], topicIds: ["c10-human-eye"], domains: ["Optics"] },
    aim: "Model image formation on the retina and correction of myopia and hypermetropia.",
    theory: "The cornea and eye lens converge incoming light so a sharp image forms on the retina. In myopia, distant-object rays focus before the retina and a concave lens spreads them before they enter the eye. In hypermetropia, nearby-object rays would focus behind the retina and a convex lens adds convergence.",
    apparatus: ["Realistic cutaway eye model", "Retina screen", "Concave corrective lens", "Convex corrective lens", "Ray overlay"],
    formulae: [{ id: "lens-power", name: "Lens power", expression: "P=\\frac{1}{f}", variables: [{ symbol: "P", name: "Power", unit: "dioptre" }, { symbol: "f", name: "Focal length", unit: "m" }] }],
    procedure: ["Choose normal vision, myopia, or hypermetropia.", "Set the eye focus point and retina position.", "Observe whether the uncorrected focus falls before, on, or behind the retina.", "Add the correct concave or convex lens and check that the corrected ray bundle lands on the retina."],
    simulationSetup: { gravity: 9.81, objects: [createObject("convex-lens", 380, 260), createObject("wall", 610, 260), createObject("light-ray", 180, 260)] },
    observationColumns: ["Defect", "Far point/near point", "Correction lens", "Image position"],
    expectedResult: "Myopia is corrected by a concave lens; hypermetropia is corrected by a convex lens. A clear image forms when the corrected ray focus lies on the retina.",
    vivaQuestions: [{ prompt: "Which lens corrects myopia?", answer: "A concave or diverging lens." }, { prompt: "Where does an uncorrected myopic eye focus distant rays?", answer: "In front of the retina." }],
    commonMistakes: ["Mixing myopia and hypermetropia", "Forgetting focal length in metres for dioptres"]
  },
  {
    id: "sources-of-energy",
    title: "Sources of Energy Comparator",
    category: "Energy",
    difficulty: "Beginner",
    classLevel: "Class 10",
    curriculumTags: { classes: [10], unitIds: ["c10-energy-sources"], topicIds: ["c10-sources-energy"], domains: ["Energy"] },
    aim: "Compare renewable and conventional energy sources using power output, efficiency, cost, and environmental score.",
    theory: "A good energy source is available, economical, efficient, easy to store/transport, and has low environmental impact.",
    apparatus: ["Energy dashboard", "Efficiency meter", "Impact meter", "Load bulb"],
    formulae: [{ id: "useful-energy", name: "Useful energy", expression: "E_{useful}=\\eta E_{input}", variables: [{ symbol: "\\eta", name: "Efficiency", unit: "" }] }],
    procedure: ["Select source mix.", "Set input energy.", "Change efficiency.", "Compare useful output and impact score."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 300, 300), createObject("bulb", 520, 300), createObject("graph-plotter", 680, 300)] },
    observationColumns: ["Source", "Input energy", "Efficiency", "Useful output", "Impact score"],
    expectedResult: "Higher efficiency increases useful output, while fossil-fuel-heavy mixes raise impact score.",
    vivaQuestions: [{ prompt: "What makes a source renewable?", answer: "It is replenished naturally on a human timescale." }],
    commonMistakes: ["Comparing only power and ignoring environmental cost", "Treating efficiency as energy itself"]
  },
  {
    id: "meter-bridge",
    title: "Meter Bridge",
    category: "Electricity",
    difficulty: "Intermediate",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-electricity-magnetism"], topicIds: ["c12-current"], domains: ["Electricity"] },
    aim: "Find an unknown resistance using the balanced Wheatstone bridge relation.",
    theory: "At balance, no current flows through the galvanometer and R/X = l/(100-l).",
    apparatus: ["Meter bridge", "Known resistor", "Unknown resistor", "Galvanometer", "Jockey"],
    formulae: [{ id: "meter-bridge", name: "Balance relation", expression: "\\frac{R}{X}=\\frac{l}{100-l}", variables: [{ symbol: "l", name: "Balance length", unit: "cm" }] }],
    procedure: ["Set known resistance.", "Move the jockey to balance length.", "Calculate unknown resistance.", "Reverse gaps to reduce error."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 240, 300), createObject("resistor", 410, 300), createObject("ammeter", 570, 300), createObject("ruler", 460, 420)] },
    observationColumns: ["Known R", "Balance length", "Unknown X", "Reversed balance"],
    expectedResult: "Unknown resistance follows X = R(100-l)/l.",
    vivaQuestions: [{ prompt: "Why is the null point preferred near the middle?", answer: "It reduces percentage error in length measurement." }],
    commonMistakes: ["Using l/(100-l) for X/R instead of R/X", "Forgetting balance length is in centimetres on the bridge wire"]
  },
  {
    id: "internal-resistance-cell",
    title: "Cell Internal Resistance",
    category: "Electricity",
    difficulty: "Intermediate",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-electricity-magnetism"], topicIds: ["c12-current"], domains: ["Electricity"] },
    aim: "Compare emf, terminal voltage, current, and internal resistance of a cell.",
    theory: "A real cell has internal resistance, so terminal voltage falls as current increases: V = E - Ir.",
    apparatus: ["Cell", "Rheostat", "Voltmeter", "Ammeter", "Switch"],
    formulae: [{ id: "terminal-voltage", name: "Terminal voltage", expression: "V=E-Ir", variables: [{ symbol: "E", name: "EMF", unit: "V" }, { symbol: "r", name: "Internal resistance", unit: "ohm" }] }],
    procedure: ["Set emf.", "Change external resistance.", "Observe current and terminal voltage.", "Estimate internal resistance from voltage drop."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 250, 300), createObject("resistor", 430, 300), createObject("voltmeter", 590, 300), createObject("ammeter", 690, 300)] },
    observationColumns: ["EMF", "External R", "Current", "Terminal V", "Internal r"],
    expectedResult: "Terminal voltage decreases when load current increases.",
    vivaQuestions: [{ prompt: "When is terminal voltage equal to emf?", answer: "When no current is drawn, ideally in open circuit." }],
    commonMistakes: ["Treating emf and terminal voltage as always equal", "Ignoring the cell's internal resistance"]
  },
  {
    id: "ac-generator",
    title: "AC Generator",
    category: "Electricity",
    difficulty: "Intermediate",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-electricity-magnetism"], topicIds: ["c12-emi-ac"], domains: ["Electricity", "Magnetism"] },
    aim: "Visualize sinusoidal emf generated by rotating a coil in a magnetic field.",
    theory: "Changing magnetic flux through a rotating coil induces emf. For uniform rotation, emf varies sinusoidally.",
    apparatus: ["Rotating coil", "Bar magnets", "Slip rings", "AC graph"],
    formulae: [{ id: "generator-emf", name: "AC generator emf", expression: "\\mathcal{E}=NBA\\omega\\sin\\omega t", variables: [{ symbol: "N", name: "Turns", unit: "" }, { symbol: "\\omega", name: "Angular speed", unit: "rad/s" }] }],
    procedure: ["Set coil turns.", "Set magnetic field.", "Change rotation speed.", "Observe AC waveform amplitude and frequency."],
    simulationSetup: { gravity: 9.81, objects: [createObject("bar-magnet", 300, 300), createObject("wire", 470, 300), createObject("graph-plotter", 650, 300)] },
    observationColumns: ["Turns", "Magnetic field", "Angular speed", "Peak emf", "Frequency"],
    expectedResult: "Peak emf increases with turns, field, area, and angular speed.",
    vivaQuestions: [{ prompt: "Why is generator output alternating?", answer: "The flux linkage changes sign every half rotation." }],
    commonMistakes: ["Thinking faster rotation changes only amplitude", "Ignoring coil turns"]
  },
  {
    id: "transformer-lab",
    title: "Transformer Lab",
    category: "Electricity",
    difficulty: "Intermediate",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-electricity-magnetism"], topicIds: ["c12-emi-ac"], domains: ["Electricity", "Magnetism"] },
    aim: "Compare primary and secondary voltages, current, and efficiency in a transformer.",
    theory: "An ideal transformer follows Vs/Vp = Ns/Np. Practical transformers lose some energy as heat and magnetic leakage.",
    apparatus: ["AC source", "Primary coil", "Secondary coil", "Iron core", "Load"],
    formulae: [{ id: "transformer-ratio", name: "Transformer equation", expression: "\\frac{V_s}{V_p}=\\frac{N_s}{N_p}", variables: [{ symbol: "N", name: "Number of turns", unit: "" }] }],
    procedure: ["Set primary voltage.", "Change primary and secondary turns.", "Set efficiency.", "Classify step-up or step-down transformer."],
    simulationSetup: { gravity: 9.81, objects: [createObject("battery", 250, 300), createObject("wire", 420, 300), createObject("bulb", 610, 300)] },
    observationColumns: ["Vp", "Np", "Ns", "Vs", "Efficiency"],
    expectedResult: "More secondary turns than primary turns steps voltage up.",
    vivaQuestions: [{ prompt: "Why does a transformer need AC?", answer: "Changing current is needed to create changing magnetic flux." }],
    commonMistakes: ["Applying transformer equation to DC", "Forgetting current changes opposite to voltage in an ideal transformer"]
  },
  {
    id: "total-internal-reflection",
    title: "Total Internal Reflection",
    category: "Optics",
    difficulty: "Intermediate",
    classLevel: "Class 12 / Class 10 enrichment",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-natural-phenomena", "c12-optics-modern"], topicIds: ["c10-glass-prism", "c12-ray-optics"], domains: ["Optics"] },
    aim: "Find critical angle and show when light reflects completely inside a denser medium.",
    theory: "Total internal reflection occurs when light travels from denser to rarer medium and incidence angle exceeds the critical angle.",
    apparatus: ["Glass block", "Ray source", "Protractor", "Screen"],
    formulae: [{ id: "critical-angle", name: "Critical angle", expression: "\\sin C=\\frac{n_2}{n_1}", variables: [{ symbol: "C", name: "Critical angle", unit: "degree" }] }],
    procedure: ["Set refractive indices.", "Increase incidence angle.", "Observe refraction at critical angle.", "Identify TIR beyond it."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 260, 300), createObject("prism", 460, 300), createObject("protractor", 580, 410)] },
    observationColumns: ["n1", "n2", "Critical angle", "Incidence angle", "Result"],
    expectedResult: "For glass to air, angles greater than the critical angle produce total internal reflection.",
    vivaQuestions: [{ prompt: "Name one use of total internal reflection.", answer: "Optical fibre communication." }],
    commonMistakes: ["Expecting TIR from rarer to denser medium", "Using degrees directly inside sine without conversion in calculations"]
  },
  {
    id: "optical-instruments",
    title: "Microscope and Telescope",
    category: "Optics",
    difficulty: "Advanced",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-optics-modern"], topicIds: ["c12-ray-optics"], domains: ["Optics"] },
    aim: "Compare magnification of a compound microscope and an astronomical telescope.",
    theory: "Optical instruments use objective and eyepiece lenses to form enlarged images at comfortable viewing positions.",
    apparatus: ["Objective lens", "Eyepiece", "Object", "Image screen"],
    formulae: [{ id: "telescope-magnification", name: "Telescope magnification", expression: "M=\\frac{f_o}{f_e}", variables: [{ symbol: "f_o", name: "Objective focal length", unit: "cm" }, { symbol: "f_e", name: "Eyepiece focal length", unit: "cm" }] }],
    procedure: ["Choose microscope or telescope mode.", "Set objective focal length.", "Set eyepiece focal length.", "Compare magnification and tube length."],
    simulationSetup: { gravity: 9.81, objects: [createObject("convex-lens", 330, 300), createObject("convex-lens", 520, 300), createObject("light-ray", 180, 300)] },
    observationColumns: ["Mode", "Objective f", "Eyepiece f", "Magnification", "Tube length"],
    expectedResult: "Shorter eyepiece focal length increases angular magnification.",
    vivaQuestions: [{ prompt: "Which lens usually has larger aperture in a telescope?", answer: "The objective lens." }],
    commonMistakes: ["Mixing microscope and telescope formulae", "Ignoring sign and final-image convention"]
  },
  {
    id: "polarization-lab",
    title: "Polarization Lab",
    category: "Waves",
    difficulty: "Intermediate",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-optics-modern"], topicIds: ["c12-wave-optics"], domains: ["Waves", "Optics"] },
    aim: "Use two polarizers to verify Malus' law for transmitted light intensity.",
    theory: "Plane polarized light passing through an analyzer has intensity I = I0 cos^2(theta).",
    apparatus: ["Light source", "Polarizer", "Analyzer", "Intensity meter"],
    formulae: [{ id: "malus-law", name: "Malus' law", expression: "I=I_0\\cos^2\\theta", variables: [{ symbol: "\\theta", name: "Analyzer angle", unit: "degree" }] }],
    procedure: ["Set initial intensity.", "Rotate analyzer angle.", "Measure transmitted intensity.", "Find extinction near 90 degrees."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 240, 300), createObject("wave-barrier", 420, 300), createObject("graph-plotter", 650, 300)] },
    observationColumns: ["Initial intensity", "Analyzer angle", "Transmitted intensity", "Percent"],
    expectedResult: "Intensity is maximum at 0 degrees and near zero at 90 degrees.",
    vivaQuestions: [{ prompt: "What does polarization prove about light waves?", answer: "Light is transverse." }],
    commonMistakes: ["Using cos theta instead of cos squared theta", "Applying Malus' law to unpolarized light without the first polarizer loss"]
  },
  {
    id: "de-broglie-wavelength",
    title: "de Broglie Wavelength",
    category: "Modern Physics",
    difficulty: "Intermediate",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-optics-modern"], topicIds: ["c12-dual-atoms"], domains: ["Modern Physics"] },
    aim: "Connect particle momentum and accelerating voltage to matter-wave wavelength.",
    theory: "Moving particles have wavelength lambda = h/p. For electrons accelerated through voltage V, wavelength decreases as voltage increases.",
    apparatus: ["Electron source", "Accelerating plates", "Diffraction screen"],
    formulae: [{ id: "de-broglie", name: "Matter wavelength", expression: "\\lambda=\\frac{h}{p}", variables: [{ symbol: "p", name: "Momentum", unit: "kg m/s" }] }],
    procedure: ["Set electron accelerating voltage.", "Observe wavelength.", "Compare diffraction spread.", "Double voltage and note wavelength change."],
    simulationSetup: { gravity: 9.81, objects: [createObject("charge", 260, 300), createObject("voltmeter", 430, 300), createObject("graph-plotter", 650, 300)] },
    observationColumns: ["Voltage", "Momentum", "Wavelength", "Diffraction trend"],
    expectedResult: "Higher accelerating voltage gives shorter de Broglie wavelength.",
    vivaQuestions: [{ prompt: "Why is electron diffraction evidence for matter waves?", answer: "Particles produce wave-like interference and diffraction patterns." }],
    commonMistakes: ["Using mass instead of momentum", "Forgetting electron wavelength is very small"]
  },
  {
    id: "bohr-model",
    title: "Bohr Atom Transitions",
    category: "Modern Physics",
    difficulty: "Intermediate",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-optics-modern"], topicIds: ["c12-dual-atoms"], domains: ["Modern Physics"] },
    aim: "Visualize hydrogen energy levels, spectral lines, and photon emission/absorption.",
    theory: "Hydrogen energy levels follow En = -13.6/n^2 eV. A photon is emitted or absorbed when the electron changes levels.",
    apparatus: ["Hydrogen atom model", "Energy level chart", "Spectrum viewer"],
    formulae: [{ id: "bohr-energy", name: "Hydrogen energy level", expression: "E_n=-\\frac{13.6}{n^2}\\ eV", variables: [{ symbol: "n", name: "Principal quantum number", unit: "" }] }],
    procedure: ["Select initial level.", "Select final level.", "Observe photon energy.", "Identify whether emission or absorption occurs."],
    simulationSetup: { gravity: 9.81, objects: [createObject("charge", 380, 300), createObject("graph-plotter", 620, 300)] },
    observationColumns: ["Initial n", "Final n", "Photon energy", "Process", "Series"],
    expectedResult: "Transitions to lower levels emit photons; larger energy gaps produce higher-frequency light.",
    vivaQuestions: [{ prompt: "What is the ground-state energy of hydrogen in Bohr model?", answer: "-13.6 eV." }],
    commonMistakes: ["Using positive energy for bound levels", "Confusing n with orbit radius only"]
  },
  {
    id: "logic-gates",
    title: "Logic Gates",
    category: "Electronics",
    difficulty: "Beginner",
    classLevel: "Class 12",
    curriculumTags: { classes: [12], unitIds: ["c12-optics-modern"], topicIds: ["c12-semiconductors"], domains: ["Electronics"] },
    aim: "Build truth tables for NOT, AND, OR, NAND, and NOR gates.",
    theory: "Logic gates convert binary inputs into binary outputs and form the building blocks of digital electronics.",
    apparatus: ["Switch inputs", "Logic gate", "LED output", "Truth table"],
    formulae: [{ id: "and-gate", name: "AND gate", expression: "Y=A\\cdot B", variables: [{ symbol: "A,B", name: "Binary inputs", unit: "0 or 1" }] }],
    procedure: ["Choose gate type.", "Toggle input A.", "Toggle input B.", "Record output and complete the truth table."],
    simulationSetup: { gravity: 9.81, objects: [createObject("switch", 280, 300), createObject("switch", 420, 300), createObject("bulb", 600, 300)] },
    observationColumns: ["Gate", "Input A", "Input B", "Output"],
    expectedResult: "Each gate follows its standard truth table; NAND and NOR invert AND and OR outputs.",
    vivaQuestions: [{ prompt: "Which gate output is 1 only when both inputs are 1?", answer: "AND gate." }],
    commonMistakes: ["Mixing OR with exclusive OR", "Forgetting NAND is inverted AND"]
  }
];
var syllabusSpineGapExperiments = [
  {
    id: "distance-time-graph",
    title: "Distance-Time Graph Builder",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 7 / Class 9",
    curriculumTags: { classes: [7, 9, 11], unitIds: ["c7-motion-time", "c9-motion-force-work", "c11-measurement-kinematics"], topicIds: ["c7-distance-time", "c7-speed", "c9-motion", "c11-straight-line"], domains: ["Mechanics"] },
    aim: "Build a distance-time graph and connect slope with speed.",
    theory: "On a distance-time graph, slope equals speed. A steeper straight line means faster uniform motion, while a horizontal line means rest.",
    apparatus: ["Motion track", "Timer", "Distance-time graph", "Slope ruler"],
    formulae: [{ id: "dt-slope", name: "Graph speed", expression: "v=\\frac{\\Delta s}{\\Delta t}", variables: [{ symbol: "v", name: "Speed", unit: "m/s" }, { symbol: "s", name: "Distance", unit: "m" }, { symbol: "t", name: "Time", unit: "s" }] }],
    procedure: ["Set speed.", "Set elapsed time.", "Observe the graph line.", "Double speed and compare slope.", "Set speed to zero and observe rest."],
    simulationSetup: { gravity: 9.81, objects: [createObject("cart", 220, 320), createObject("graph-plotter", 600, 300), createObject("ruler", 420, 420)] },
    observationColumns: ["Speed", "Time", "Distance", "Graph slope", "Motion type"],
    expectedResult: "Distance increases linearly for uniform motion, and graph slope equals speed.",
    vivaQuestions: [{ prompt: "What does a horizontal distance-time graph mean?", answer: "The object is at rest because distance is not changing with time." }],
    commonMistakes: ["Reading graph height as speed", "Forgetting slope is change in distance divided by change in time"]
  },
  {
    id: "balanced-unbalanced-forces",
    title: "Balanced and Unbalanced Forces",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 9",
    curriculumTags: { classes: [8, 9, 11], unitIds: ["c8-force-pressure", "c9-motion-force-work", "c11-mechanics-core"], topicIds: ["c8-force-effects", "c9-newton-laws", "c11-laws-motion"], domains: ["Mechanics"] },
    aim: "Compare left and right forces and predict whether an object stays still, moves steadily, or accelerates.",
    theory: "Balanced forces give zero net force and no change in velocity. Unbalanced forces cause acceleration in the direction of net force.",
    apparatus: ["Tug cart", "Force arrows", "Mass block", "Motion trail"],
    formulae: [{ id: "net-force", name: "Net force and acceleration", expression: "F_{net}=F_R-F_L,\\quad a=\\frac{F_{net}}{m}", variables: [{ symbol: "F", name: "Force", unit: "N" }, { symbol: "m", name: "Mass", unit: "kg" }] }],
    procedure: ["Set left pull.", "Set right pull.", "Change cart mass.", "Observe net force and acceleration.", "Make forces equal and check the motion state."],
    simulationSetup: { gravity: 9.81, objects: [createObject("block", 420, 300), createObject("force-arrow", 300, 300), createObject("force-arrow", 540, 300)] },
    observationColumns: ["Left force", "Right force", "Net force", "Mass", "Acceleration"],
    expectedResult: "Equal opposite forces produce zero acceleration; unequal forces accelerate the object toward the larger force.",
    vivaQuestions: [{ prompt: "Can a moving object have balanced forces?", answer: "Yes. It can keep moving with constant velocity when net force is zero." }],
    commonMistakes: ["Thinking balanced forces mean no motion", "Ignoring direction when adding forces"]
  },
  {
    id: "universal-gravitation",
    title: "Universal Gravitation Field Map",
    category: "Astronomy",
    difficulty: "Intermediate",
    classLevel: "Class 9 / Class 11",
    curriculumTags: { classes: [9, 11], unitIds: ["c9-motion-force-work", "c11-mechanics-core"], topicIds: ["c9-gravitation", "c11-gravitation"], domains: ["Mechanics", "Astronomy"] },
    aim: "Visualize how gravitational force changes with mass and distance.",
    theory: "Every mass attracts every other mass. The force is proportional to both masses and inversely proportional to the square of the distance.",
    apparatus: ["Planet mass", "Test mass", "Distance scale", "Field map"],
    formulae: [{ id: "newton-gravitation", name: "Universal gravitation", expression: "F=G\\frac{m_1m_2}{r^2}", variables: [{ symbol: "G", name: "Gravitational constant", unit: "N m^2/kg^2" }, { symbol: "r", name: "Separation", unit: "m" }] }],
    procedure: ["Set central mass.", "Set test mass.", "Change distance.", "Observe force arrow and field intensity.", "Double distance and compare force drop."],
    simulationSetup: { gravity: 9.81, objects: [{ ...createObject("ball", 380, 300), name: "Central mass", radius: 42, mass: 8, color: "#38bdf8" }, createObject("ball", 570, 300), createObject("ruler", 460, 420)] },
    observationColumns: ["Mass 1", "Mass 2", "Distance", "Force", "Field trend"],
    expectedResult: "Doubling distance reduces gravitational force to one-fourth, if masses are unchanged.",
    vivaQuestions: [{ prompt: "Why is gravity called universal?", answer: "It acts between every pair of masses in the universe." }],
    commonMistakes: ["Thinking only planets have gravity", "Forgetting the inverse-square distance relation"]
  },
  {
    id: "density-float-sink",
    title: "Density Float-or-Sink Tank",
    category: "Fluid Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 9 / Class 11",
    curriculumTags: { classes: [8, 9, 11], unitIds: ["c8-force-pressure", "c9-motion-force-work", "c11-matter-thermal-waves"], topicIds: ["c8-pressure", "c9-floatation", "c11-solids-fluids"], domains: ["Fluid Mechanics"] },
    aim: "Predict whether an object floats or sinks by comparing object density with liquid density.",
    theory: "An object floats if its average density is less than the fluid density, and sinks if it is greater.",
    apparatus: ["Fluid tank", "Test block", "Density slider", "Submerged fraction meter"],
    formulae: [{ id: "float-density", name: "Floating fraction", expression: "\\frac{V_{sub}}{V}=\\frac{\\rho_{object}}{\\rho_{fluid}}", variables: [{ symbol: "\\rho", name: "Density", unit: "kg/m^3" }] }],
    procedure: ["Set fluid density.", "Set object density.", "Change object volume.", "Observe submerged fraction.", "Identify float, neutral, or sink."],
    simulationSetup: { gravity: 9.81, objects: [createObject("fluid-region", 460, 390), createObject("block", 460, 230), createObject("motion-sensor", 640, 250)] },
    observationColumns: ["Fluid density", "Object density", "Volume", "Submerged fraction", "State"],
    expectedResult: "Objects less dense than the fluid float partially submerged; denser objects sink.",
    vivaQuestions: [{ prompt: "Why can a large ship float even though steel is dense?", answer: "Its average density including air-filled volume is less than water." }],
    commonMistakes: ["Comparing mass alone instead of density", "Forgetting submerged fraction cannot exceed 100 percent"]
  },
  {
    id: "calorimetry-mixing",
    title: "Calorimetry Mixing Lab",
    category: "Thermodynamics",
    difficulty: "Intermediate",
    classLevel: "Class 11 / Class 7 enrichment",
    curriculumTags: { classes: [7, 11], unitIds: ["c7-heat", "c11-matter-thermal-waves"], topicIds: ["c7-heat-temperature", "c11-thermal"], domains: ["Thermodynamics"] },
    aim: "Mix hot and cold water samples and predict the final equilibrium temperature.",
    theory: "In an insulated mixture, heat lost by the hot body is approximately equal to heat gained by the cold body.",
    apparatus: ["Calorimeter", "Hot water", "Cold water", "Thermometer"],
    formulae: [{ id: "mixing-temperature", name: "Heat balance", expression: "m_hc(T_h-T_f)=m_cc(T_f-T_c)", variables: [{ symbol: "T_f", name: "Final temperature", unit: "C" }] }],
    procedure: ["Set hot mass and temperature.", "Set cold mass and temperature.", "Mix the samples.", "Compare final temperature with heat balance prediction.", "Change one mass at a time."],
    simulationSetup: { gravity: 9.81, objects: [createObject("thermometer", 360, 260), createObject("gas-container", 540, 320)] },
    observationColumns: ["Hot mass", "Hot temp", "Cold mass", "Cold temp", "Final temp"],
    expectedResult: "The final temperature lies between the hot and cold initial temperatures and shifts toward the larger heat capacity sample.",
    vivaQuestions: [{ prompt: "Why should the calorimeter be insulated?", answer: "To reduce heat exchange with the surroundings." }],
    commonMistakes: ["Averaging temperatures without considering mass", "Forgetting heat lost equals heat gained only in an insulated setup"]
  }
];
var advancedCompletionExperiments = [
  {
    id: "special-relativity-bridge",
    title: "Special Relativity Bridge",
    category: "Modern Physics",
    difficulty: "Advanced",
    classLevel: "Class 12 / IB HL bridge",
    curriculumTags: { classes: [12, 14], unitIds: ["c12-optics-modern", "pg-advanced"], topicIds: ["c12-relativity-bridge", "pg-advanced-quantum"], domains: ["Modern Physics"] },
    aim: "Explore time dilation, length contraction, and relativistic energy using a light-clock and spacetime graph.",
    theory: "At speeds close to light speed, observers can disagree on measured time and length while the spacetime interval remains consistent.",
    apparatus: ["Light clock", "Velocity slider", "Spacetime graph", "Energy readout"],
    formulae: [{ id: "lorentz-factor", name: "Lorentz factor", expression: "\\gamma=\\frac{1}{\\sqrt{1-v^2/c^2}}", variables: [{ symbol: "v", name: "Relative speed", unit: "m/s" }, { symbol: "c", name: "Speed of light", unit: "m/s" }] }],
    procedure: ["Set speed as a fraction of light speed.", "Watch the light-clock path stretch.", "Compare proper time with measured time.", "Increase speed and note the energy growth."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 300, 280), createObject("graph-plotter", 620, 300), createObject("stopwatch", 430, 230)] },
    observationColumns: ["Speed fraction", "Gamma", "Proper time", "Measured time", "Energy trend"],
    expectedResult: "As speed approaches light speed, gamma rises, measured time dilates, and energy demand grows sharply.",
    vivaQuestions: [{ prompt: "What stays invariant in special relativity?", answer: "The spacetime interval stays invariant between inertial frames." }],
    commonMistakes: ["Using everyday speed intuition near light speed", "Treating gamma as linear in speed", "Forgetting that c is the same for inertial observers"]
  },
  {
    id: "chaotic-coupled-oscillators",
    title: "Chaotic and Coupled Oscillators",
    category: "Oscillations",
    difficulty: "Advanced",
    classLevel: "Class 11 / Undergraduate bridge",
    curriculumTags: { classes: [11, 13], unitIds: ["c11-matter-thermal-waves", "ug-core"], topicIds: ["c11-chaos-pendulum", "ug-classical-mechanics"], domains: ["Oscillations", "Mechanics"] },
    aim: "Compare a simple oscillator with a double-pendulum style coupled oscillator and identify the start of chaotic motion.",
    theory: "Coupled nonlinear oscillators can become sensitive to initial conditions, so tiny angle changes can grow into visibly different phase paths.",
    apparatus: ["Double pendulum", "Phase plot", "Angle sliders", "Energy tracker"],
    formulae: [{ id: "chaos-sensitivity", name: "Sensitivity indicator", expression: "\\Delta(t)\\approx\\Delta_0e^{\\lambda t}", variables: [{ symbol: "\\lambda", name: "Lyapunov-style growth rate", unit: "s^-1" }] }],
    procedure: ["Set two starting angles close together.", "Run the oscillator and observe the phase trail.", "Increase coupling or starting angle.", "Compare regular, beating, and chaotic-looking paths."],
    simulationSetup: { gravity: 9.81, objects: [createObject("double-pendulum", 420, 130), createObject("graph-plotter", 650, 300)] },
    observationColumns: ["Angle 1", "Angle 2", "Coupling", "Phase spread", "Motion type"],
    expectedResult: "Small angles stay regular for longer, while larger coupled motion separates quickly and produces complex phase paths.",
    vivaQuestions: [{ prompt: "What is sensitive dependence on initial conditions?", answer: "Tiny differences in starting state can grow into very different later motion." }],
    commonMistakes: ["Calling every complex path random", "Changing damping and angle together", "Expecting exact periodic return in chaotic motion"]
  },
  {
    id: "advanced-quantum-operators",
    title: "Advanced Quantum Operators",
    category: "Modern Physics",
    difficulty: "Advanced",
    classLevel: "Postgraduate",
    curriculumTags: { classes: [14], unitIds: ["pg-advanced"], topicIds: ["pg-advanced-quantum"], domains: ["Modern Physics"] },
    aim: "Visualize state vectors, operator action, measurement projection, and tunneling or scattering probability as one compact model.",
    theory: "Operators transform quantum states and observables return allowed values through eigenstates and probabilities.",
    apparatus: ["State vector", "Operator dial", "Potential barrier", "Probability readout"],
    formulae: [{ id: "operator-eigen", name: "Eigenvalue equation", expression: "\\hat A\\psi=a\\psi", variables: [{ symbol: "\\psi", name: "State function", unit: "" }, { symbol: "a", name: "Measured eigenvalue", unit: "" }] }],
    procedure: ["Choose an operator view.", "Rotate or transform the state.", "Change barrier strength.", "Compare projection probability and transmission."],
    simulationSetup: { gravity: 9.81, objects: [createObject("charge", 320, 300), createObject("wave-source", 500, 300), createObject("graph-plotter", 660, 300)] },
    observationColumns: ["Operator", "State angle", "Barrier", "Projection", "Transmission"],
    expectedResult: "Aligned states give high projection probability; stronger barriers reduce transmission except for tunneling tails.",
    vivaQuestions: [{ prompt: "Why are eigenstates special in measurement?", answer: "They return a definite observable value for the corresponding operator." }],
    commonMistakes: ["Treating the wavefunction as a classical path", "Forgetting probability normalization", "Reading operator action as a physical push"]
  },
  {
    id: "statistical-ensemble-lab",
    title: "Statistical Ensemble Lab",
    category: "Thermodynamics",
    difficulty: "Advanced",
    classLevel: "Postgraduate",
    curriculumTags: { classes: [14], unitIds: ["pg-advanced"], topicIds: ["pg-statistical-field"], domains: ["Thermodynamics"] },
    aim: "Compare microstates, ensemble averages, phase tendency, and transport response without long derivations.",
    theory: "Statistical mechanics connects many microscopic configurations to macroscopic quantities such as temperature, pressure, entropy, and fluctuations.",
    apparatus: ["Particle ensemble", "Temperature dial", "Phase map", "Distribution graph"],
    formulae: [{ id: "boltzmann-weight", name: "Boltzmann weight", expression: "P(E)\\propto e^{-E/kT}", variables: [{ symbol: "E", name: "Energy", unit: "J" }, { symbol: "T", name: "Temperature", unit: "K" }] }],
    procedure: ["Set particle count and temperature.", "Watch the distribution broaden or narrow.", "Change interaction strength.", "Compare average energy, fluctuation, and phase tendency."],
    simulationSetup: { gravity: 9.81, objects: [createObject("gas-container", 390, 320), createObject("thermometer", 250, 260), createObject("graph-plotter", 630, 300)] },
    observationColumns: ["Temperature", "Particles", "Interaction", "Average energy", "Fluctuation"],
    expectedResult: "Higher temperature broadens the energy distribution and increases average kinetic energy and fluctuations.",
    vivaQuestions: [{ prompt: "What does an ensemble average represent?", answer: "It is the mean value over many possible microscopic states consistent with the chosen constraints." }],
    commonMistakes: ["Confusing one particle path with the ensemble average", "Ignoring fluctuations near phase changes", "Using Celsius directly in Boltzmann factors"]
  },
  {
    id: "computational-physics-workflow",
    title: "Computational Physics Workflow",
    category: "Measurement",
    difficulty: "Advanced",
    classLevel: "PhD",
    curriculumTags: { classes: [15], unitIds: ["phd-research-lanes"], topicIds: ["phd-computation"], domains: ["Measurement"] },
    aim: "Build a small reproducible physics workflow: choose a model, step size, uncertainty, graph, and verification rule.",
    theory: "Computational physics depends on model assumptions, numerical stability, convergence checks, and uncertainty reporting as much as raw output.",
    apparatus: ["Solver", "Graph plotter", "Notebook", "Error meter"],
    formulae: [{ id: "relative-error", name: "Relative error", expression: "\\epsilon=\\left|\\frac{x_{num}-x_{ref}}{x_{ref}}\\right|", variables: [{ symbol: "x_{num}", name: "Numerical result", unit: "" }, { symbol: "x_{ref}", name: "Reference result", unit: "" }] }],
    procedure: ["Pick a model and initial step size.", "Run the numerical result.", "Halve the step size and compare convergence.", "Record assumptions, error, and a reproducibility note."],
    simulationSetup: { gravity: 9.81, objects: [createObject("graph-plotter", 500, 300), createObject("ruler", 260, 410), createObject("stopwatch", 320, 250)] },
    observationColumns: ["Model", "Step size", "Result", "Reference", "Relative error"],
    expectedResult: "A stable workflow shows error shrinking with smaller step size and keeps enough metadata to reproduce the result.",
    vivaQuestions: [{ prompt: "Why is convergence checking important?", answer: "It shows whether the numerical result is controlled by the physics model rather than by the chosen step size." }],
    commonMistakes: ["Reporting many digits without uncertainty", "Changing model and step size at the same time", "Skipping assumptions in the notebook"]
  }
];
var expansionExperiments = [
  {
    id: "balancing-act",
    title: "Balancing Act",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 11",
    curriculumTags: { classes: [8, 11], unitIds: ["c11-mechanics-core"], topicIds: ["c11-rotational-motion"], domains: ["Mechanics"] },
    aim: "Balance a beam by changing mass and lever-arm distance, then explain rotational equilibrium.",
    theory: "A rigid body is in rotational equilibrium when clockwise and anticlockwise torques cancel.",
    apparatus: ["Beam", "Pivot", "Masses", "Distance scale"],
    formulae: [{ id: "moment-balance", name: "Moment of force", expression: "\\tau=rF=rmg", variables: [{ symbol: "r", name: "Perpendicular lever arm", unit: "m" }, { symbol: "F", name: "Force", unit: "N" }] }],
    procedure: ["Predict which side falls.", "Change one mass or distance.", "Find the balance point.", "Record two different balanced arrangements."],
    simulationSetup: { gravity: 9.81, objects: [createObject("rod", 460, 300), createObject("block", 260, 220), createObject("block", 650, 220)] },
    observationColumns: ["Left mass", "Left distance", "Right mass", "Balance distance", "Outcome"],
    expectedResult: "The beam balances when opposing moments are equal.",
    vivaQuestions: [{ prompt: "Can unequal masses balance?", answer: "Yes, if their lever arms make the opposing torques equal." }],
    commonMistakes: ["Comparing masses without distances", "Measuring from the beam end instead of the pivot"]
  },
  {
    id: "blackbody-spectrum",
    title: "Blackbody Spectrum",
    category: "Thermodynamics",
    difficulty: "Intermediate",
    classLevel: "Class 11 / Undergraduate",
    curriculumTags: { classes: [11, 13], unitIds: ["c11-matter-thermal-waves", "ug-core"], topicIds: ["c11-thermal", "ug-modern-physics"], domains: ["Thermodynamics", "Modern Physics"] },
    aim: "Relate an ideal emitter's temperature to its spectral peak and total radiant power.",
    theory: "An ideal blackbody has a continuous thermal spectrum whose peak moves to shorter wavelength as temperature rises.",
    apparatus: ["Ideal radiator", "Spectrometer", "Temperature control", "Power meter"],
    formulae: [{ id: "wiens-law", name: "Wien displacement law", expression: "\\lambda_{max}T=2.898\\times10^{-3}\\,mK", variables: [{ symbol: "T", name: "Absolute temperature", unit: "K" }] }],
    procedure: ["Set a temperature.", "Locate the peak wavelength.", "Double temperature where possible.", "Compare radiated power."],
    simulationSetup: { gravity: 9.81, objects: [createObject("thermometer", 280, 280), createObject("graph-plotter", 540, 300)] },
    observationColumns: ["Temperature", "Peak wavelength", "Exitance", "Colour trend"],
    expectedResult: "Higher temperature shifts the peak shorter and increases power strongly.",
    vivaQuestions: [{ prompt: "Why must temperature be in kelvin?", answer: "Thermal-radiation laws use absolute temperature." }],
    commonMistakes: ["Using Celsius in T to the fourth", "Treating perceived colour as a single emitted wavelength"]
  },
  {
    id: "build-a-nucleus",
    title: "Build a Nucleus",
    category: "Modern Physics",
    difficulty: "Intermediate",
    classLevel: "Class 12 / Undergraduate",
    curriculumTags: { classes: [12, 13], unitIds: ["c12-optics-modern", "ug-core"], topicIds: ["c12-nuclei", "ug-modern-physics"], domains: ["Modern Physics"] },
    aim: "Construct nuclei from protons and neutrons and compare mass number, neutron ratio, and binding-energy trends.",
    theory: "Nuclear stability reflects a competition between short-range nuclear attraction, proton repulsion, asymmetry, and pairing effects.",
    apparatus: ["Protons", "Neutrons", "Nuclide readout", "Binding estimator"],
    formulae: [{ id: "mass-number", name: "Mass number", expression: "A=Z+N", variables: [{ symbol: "Z", name: "Proton number", unit: "" }, { symbol: "N", name: "Neutron number", unit: "" }] }],
    procedure: ["Choose proton number.", "Add or remove neutrons.", "Compare N/Z with the stability band.", "Inspect binding energy per nucleon."],
    simulationSetup: { gravity: 9.81, objects: [createObject("charge", 400, 280)] },
    observationColumns: ["Z", "N", "A", "N/Z", "Binding estimate"],
    expectedResult: "Light stable nuclei tend toward N approximately Z, while heavier stable nuclei require more neutrons.",
    vivaQuestions: [{ prompt: "What identifies an element?", answer: "Its proton number Z." }],
    commonMistakes: ["Confusing mass number with atomic mass", "Treating the semi-empirical estimate as an exact isotope table"]
  },
  {
    id: "color-vision",
    title: "Color Vision",
    category: "Optics",
    difficulty: "Beginner",
    classLevel: "Class 8 / Class 12",
    curriculumTags: { classes: [8, 12], unitIds: ["c8-friction-sound-light", "c12-optics-modern"], topicIds: ["c8-light", "c12-ray-optics"], domains: ["Optics"] },
    aim: "Mix red, green, and blue light and connect additive colour to cone responses.",
    theory: "Human colour vision compares overlapping responses from three cone classes; displays stimulate them with additive RGB light.",
    apparatus: ["Red source", "Green source", "Blue source", "Projection screen"],
    formulae: [],
    procedure: ["Predict the mixture.", "Raise one channel at a time.", "Create white and secondary colours.", "Compare brightness with hue."],
    simulationSetup: { gravity: 9.81, objects: [createObject("light-ray", 300, 250)] },
    observationColumns: ["Red", "Green", "Blue", "Perceived colour", "Luminance"],
    expectedResult: "Equal strong RGB signals appear white; pairwise mixtures form cyan, magenta, and yellow.",
    vivaQuestions: [{ prompt: "Why is light mixing additive?", answer: "Each source adds photons and cone stimulation." }],
    commonMistakes: ["Applying paint-mixing rules to light", "Assuming wavelength maps one-to-one to every perceived colour"]
  },
  {
    id: "fourier-making-waves",
    title: "Fourier: Making Waves",
    category: "Waves",
    difficulty: "Intermediate",
    classLevel: "Class 11 / Undergraduate",
    curriculumTags: { classes: [11, 13], unitIds: ["c11-matter-thermal-waves", "ug-core"], topicIds: ["c11-oscillations-waves", "ug-mathematical-physics"], domains: ["Waves"] },
    aim: "Synthesize a waveform from harmonics and identify its component frequencies.",
    theory: "Periodic signals can be represented as sums of sine and cosine components at integer multiples of a fundamental frequency.",
    apparatus: ["Oscillators", "Harmonic mixer", "Waveform display", "Spectrum readout"],
    formulae: [{ id: "fourier-series", name: "Harmonic sum", expression: "y(t)=\\sum_n A_n\\sin(n\\omega_0t+\\phi_n)", variables: [{ symbol: "A_n", name: "Harmonic amplitude", unit: "" }] }],
    procedure: ["Start with the fundamental.", "Add the second harmonic.", "Add the third harmonic.", "Relate waveform features to the spectrum."],
    simulationSetup: { gravity: 9.81, objects: [createObject("wave-source", 300, 280), createObject("graph-plotter", 580, 300)] },
    observationColumns: ["A1", "A2", "A3", "RMS amplitude", "Waveform"],
    expectedResult: "Harmonics reshape the signal through linear superposition.",
    vivaQuestions: [{ prompt: "Does adding harmonics change the fundamental frequency?", answer: "No; it changes the waveform while the fundamental remains." }],
    commonMistakes: ["Adding intensities instead of signed displacements", "Confusing harmonic number with amplitude"]
  },
  {
    id: "resistance-in-a-wire",
    title: "Resistance in a Wire",
    category: "Electricity",
    difficulty: "Beginner",
    classLevel: "Class 10 / Class 12",
    curriculumTags: { classes: [10, 12], unitIds: ["c10-electricity", "c12-electrostatics-current"], topicIds: ["c10-resistance", "c12-current-electricity"], domains: ["Electricity"] },
    aim: "Investigate how resistivity, wire length, and cross-sectional area determine resistance.",
    theory: "For a uniform ohmic wire at fixed temperature, resistance is proportional to length and inversely proportional to area.",
    apparatus: ["Test wire", "Length scale", "Diameter gauge", "Ohmmeter"],
    formulae: [{ id: "wire-resistance", name: "Resistivity relation", expression: "R=\\rho L/A", variables: [{ symbol: "rho", name: "Resistivity", unit: "ohm m" }, { symbol: "L", name: "Length", unit: "m" }, { symbol: "A", name: "Area", unit: "m^2" }] }],
    procedure: ["Set resistivity.", "Double wire length.", "Double cross-sectional area.", "Compare resistance and current."],
    simulationSetup: { gravity: 9.81, objects: [createObject("wire", 420, 280), createObject("voltmeter", 650, 300)] },
    observationColumns: ["Resistivity", "Length", "Area", "Resistance", "Current"],
    expectedResult: "Resistance increases linearly with length and decreases inversely with area.",
    vivaQuestions: [{ prompt: "Why does a thicker wire have lower resistance?", answer: "It provides a larger cross-section for charge transport." }],
    commonMistakes: ["Using square millimetres as square metres", "Changing temperature while treating resistivity as fixed"]
  },
  {
    id: "rutherford-scattering",
    title: "Rutherford Scattering",
    category: "Modern Physics",
    difficulty: "Advanced",
    classLevel: "Class 12 / Undergraduate",
    curriculumTags: { classes: [12, 13], unitIds: ["c12-optics-modern", "ug-core"], topicIds: ["c12-atoms", "ug-modern-physics"], domains: ["Modern Physics"] },
    aim: "Scatter alpha particles from a nucleus and connect rare large deflections to concentrated positive charge.",
    theory: "Coulomb repulsion bends alpha-particle trajectories; small impact parameters produce the largest scattering angles.",
    apparatus: ["Alpha source", "Thin target", "Detector", "Impact-parameter control"],
    formulae: [{ id: "rutherford-angle", name: "Coulomb scattering angle", expression: "\\theta=2\\tan^{-1}(kZ_1Z_2e^2/2Eb)", variables: [{ symbol: "E", name: "Kinetic energy", unit: "MeV" }, { symbol: "b", name: "Impact parameter", unit: "fm" }] }],
    procedure: ["Set target charge.", "Launch at a large impact parameter.", "Move closer to the nucleus.", "Increase energy and compare deflection."],
    simulationSetup: { gravity: 0, objects: [createObject("charge", 460, 300), createObject("graph-plotter", 680, 300)] },
    observationColumns: ["Energy", "Impact parameter", "Z", "Angle", "Outcome"],
    expectedResult: "Deflection rises with nuclear charge and falls with energy and impact parameter.",
    vivaQuestions: [{ prompt: "What did rare backscattering show?", answer: "Positive charge and most atomic mass occupy a very small nucleus." }],
    commonMistakes: ["Drawing collisions with a nucleus of atomic size", "Including gravity in the particle path"]
  },
  {
    id: "states-of-matter",
    title: "States of Matter",
    category: "Thermodynamics",
    difficulty: "Beginner",
    classLevel: "Class 6 / Class 11",
    curriculumTags: { classes: [6, 9, 11], unitIds: ["c11-matter-thermal-waves"], topicIds: ["c11-thermal"], domains: ["Thermodynamics"] },
    aim: "Connect particle motion and attraction to solid, liquid, and gas behaviour.",
    theory: "A phase reflects the competition between thermal motion, intermolecular attraction, and pressure.",
    apparatus: ["Particle chamber", "Heater", "Pressure control", "Thermometer"],
    formulae: [{ id: "thermal-energy", name: "Thermal energy scale", expression: "E\\sim k_BT", variables: [{ symbol: "T", name: "Absolute temperature", unit: "K" }] }],
    procedure: ["Begin in Basic mode with temperature only.", "Heat through each modeled phase.", "Change pressure.", "Increase attraction and compare transition points."],
    simulationSetup: { gravity: 9.81, objects: [createObject("gas-container", 440, 300), createObject("thermometer", 250, 260)] },
    observationColumns: ["Temperature", "Pressure", "Attraction", "Phase", "Particle pattern"],
    expectedResult: "Heating generally drives solid to liquid to gas, while pressure and stronger attraction favour condensed phases.",
    vivaQuestions: [{ prompt: "Do particles stop moving in a solid?", answer: "No; they vibrate about relatively fixed positions." }],
    commonMistakes: ["Treating the model transition temperatures as a specific real substance", "Drawing gas particles larger than solid particles"]
  },
  {
    id: "atomic-interactions",
    title: "Atomic Interactions",
    category: "Modern Physics",
    difficulty: "Intermediate",
    classLevel: "Class 11 / Undergraduate",
    curriculumTags: { classes: [11, 13], unitIds: ["c11-matter-thermal-waves", "ug-core"], topicIds: ["c11-properties-matter", "ug-modern-physics"], domains: ["Modern Physics", "Thermodynamics"] },
    aim: "Explore attractive and repulsive forces between neutral atoms using a Lennard-Jones model.",
    theory: "Longer-range dispersion attraction and steep short-range electron-cloud repulsion create an equilibrium separation.",
    apparatus: ["Atom pair", "Separation control", "Force meter", "Potential graph"],
    formulae: [{ id: "lennard-jones", name: "Lennard-Jones potential", expression: "U(r)=4\\epsilon[(\\sigma/r)^{12}-(\\sigma/r)^6]", variables: [{ symbol: "r", name: "Separation", unit: "angstrom" }] }],
    procedure: ["Begin far apart.", "Reduce separation.", "Locate minimum potential.", "Move closer and observe repulsion."],
    simulationSetup: { gravity: 0, objects: [createObject("charge", 320, 300), createObject("charge", 580, 300)] },
    observationColumns: ["Distance", "Atomic size", "Well depth", "Potential", "Force"],
    expectedResult: "The force is attractive beyond equilibrium and strongly repulsive inside it.",
    vivaQuestions: [{ prompt: "Why is the force steeply repulsive at short range?", answer: "Overlapping electron clouds are energetically unfavorable, represented here by a steep model term." }],
    commonMistakes: ["Interpreting the atoms as permanently charged", "Using the model at nuclear distances"]
  },
  {
    id: "diffusion",
    title: "Diffusion",
    category: "Thermodynamics",
    difficulty: "Beginner",
    classLevel: "Class 9 / Undergraduate",
    curriculumTags: { classes: [9, 11, 13], unitIds: ["c11-matter-thermal-waves", "ug-core"], topicIds: ["c11-kinetic-theory", "ug-statistical-physics"], domains: ["Thermodynamics"] },
    aim: "Observe random particle motion producing a predictable ensemble spread.",
    theory: "Unbiased microscopic steps produce macroscopic diffusion, whose one-dimensional RMS displacement grows as the square root of time.",
    apparatus: ["Particle chamber", "Clock", "Temperature control", "Spread ruler"],
    formulae: [{ id: "diffusion-rms", name: "RMS diffusion distance", expression: "x_{rms}=\\sqrt{2Dt}", variables: [{ symbol: "D", name: "Diffusion coefficient", unit: "m^2/s" }, { symbol: "t", name: "Time", unit: "s" }] }],
    procedure: ["Start with a compact cloud.", "Advance time.", "Raise temperature.", "Compare light and heavy particles."],
    simulationSetup: { gravity: 0, objects: [createObject("gas-container", 430, 300), createObject("stopwatch", 230, 250)] },
    observationColumns: ["Time", "Temperature", "Mass", "D", "RMS spread"],
    expectedResult: "The cloud spreads with square root of time and more rapidly for the modeled hotter, lighter particles.",
    vivaQuestions: [{ prompt: "Does diffusion require a preferred direction?", answer: "No; random motion spreads a concentration gradient without directed individual paths." }],
    commonMistakes: ["Expecting RMS distance to grow linearly with time", "Confusing individual motion with ensemble-average behaviour"]
  },
  {
    id: "greenhouse-effect",
    title: "Greenhouse Effect",
    category: "Thermodynamics",
    difficulty: "Intermediate",
    classLevel: "Class 9 / Class 11",
    curriculumTags: { classes: [9, 11], unitIds: ["c11-matter-thermal-waves"], topicIds: ["c11-thermal-radiation"], domains: ["Thermodynamics"] },
    aim: "Use a planetary energy-balance model to separate albedo from infrared absorption.",
    theory: "A planet warms until absorbed solar power balances outgoing infrared power; an infrared-absorbing layer changes the level from which energy escapes.",
    apparatus: ["Star", "Planet", "Atmospheric layer", "Radiation meters"],
    formulae: [{ id: "planet-balance", name: "One-layer balance", expression: "T=[S(1-\\alpha)/(4\\sigma(1-\\epsilon/2))]^{1/4}", variables: [{ symbol: "alpha", name: "Albedo", unit: "" }, { symbol: "epsilon", name: "Infrared absorption", unit: "" }] }],
    procedure: ["Set solar flux.", "Change albedo only.", "Change infrared absorption only.", "Compare equilibrium temperatures."],
    simulationSetup: { gravity: 9.81, objects: [createObject("thermometer", 520, 300), createObject("light-ray", 270, 230)] },
    observationColumns: ["Solar flux", "Albedo", "IR absorption", "Absorbed flux", "Temperature"],
    expectedResult: "More reflection cools the model planet; stronger infrared absorption warms its surface in the one-layer model.",
    vivaQuestions: [{ prompt: "Do greenhouse gases mainly block visible sunlight?", answer: "No; the central effect is selective absorption and emission of infrared radiation." }],
    commonMistakes: ["Calling the greenhouse effect the same as ozone depletion", "Treating the one-layer result as a full climate forecast"]
  },
  {
    id: "molecules-and-light",
    title: "Molecules and Light",
    category: "Modern Physics",
    difficulty: "Intermediate",
    classLevel: "Class 11 / Undergraduate",
    curriculumTags: { classes: [11, 12, 13], unitIds: ["c12-optics-modern", "ug-core"], topicIds: ["c12-dual-nature", "ug-spectroscopy"], domains: ["Modern Physics", "Optics"] },
    aim: "Tune photon wavelength through a molecular transition and measure selective absorption.",
    theory: "Molecules exchange photons at allowed rotational, vibrational, or electronic energy differences, producing characteristic spectra.",
    apparatus: ["Tunable source", "Molecular sample", "Detector", "Spectrum display"],
    formulae: [{ id: "photon-energy", name: "Photon energy", expression: "E=hc/\\lambda", variables: [{ symbol: "lambda", name: "Wavelength", unit: "m" }] }],
    procedure: ["Set the transition wavelength.", "Sweep the source wavelength.", "Locate maximum absorption.", "Change intensity and distinguish peak position from strength."],
    simulationSetup: { gravity: 0, objects: [createObject("light-ray", 260, 280), createObject("graph-plotter", 620, 300)] },
    observationColumns: ["Wavelength", "Photon energy", "Transition", "Intensity", "Absorbed"],
    expectedResult: "Absorption peaks when photon energy matches the modeled molecular transition.",
    vivaQuestions: [{ prompt: "Does brighter light shift an ideal transition wavelength?", answer: "No; it changes event rate, while the energy spacing sets the wavelength." }],
    commonMistakes: ["Assuming all wavelengths are absorbed equally", "Confusing intensity with photon energy"]
  }
];
var experimentCatalog = [
  {
    id: "projectile-motion",
    title: "Projectile Motion",
    category: "Mechanics",
    difficulty: "Beginner",
    classLevel: "Class 11 / Intro Engineering",
    curriculumTags: curriculumTagByTitle["Projectile Motion"],
    aim: "Study how initial speed, launch angle, and gravity affect projectile range and height; use mass to discuss why the ideal model ignores air resistance.",
    theory: "Projectile motion separates into constant horizontal velocity and uniformly accelerated vertical motion.",
    apparatus: ["Launcher", "Ball", "Grid", "Stopwatch", "Graph plotter"],
    formulae: [
      {
        id: "range",
        name: "Range",
        expression: "R = \\frac{u^2\\sin(2\\theta)}{g}",
        variables: [
          { symbol: "u", name: "Initial speed", unit: "m/s" },
          { symbol: "theta", name: "Launch angle", unit: "degree" },
          { symbol: "g", name: "Acceleration due to gravity", unit: "m/s^2" }
        ]
      },
      {
        id: "height",
        name: "Maximum height",
        expression: "H = \\frac{u^2\\sin^2(\\theta)}{2g}",
        variables: [
          { symbol: "H", name: "Maximum height", unit: "m" },
          { symbol: "g", name: "Acceleration due to gravity", unit: "m/s^2" }
        ]
      }
    ],
    procedure: [
      "Set the launch speed and angle.",
      "Run the simulation and observe the parabolic trajectory.",
      "Record range, maximum height, and time of flight.",
      "Compare measured values with the displayed formula results."
    ],
    simulationSetup: {
      gravity: 9.81,
      objects: [createObject("ball", 90, 430), createObject("floor", 460, 560)]
    },
    observationColumns: ["Trial", "Speed", "Angle", "Range", "Maximum height", "Time of flight"],
    expectedResult: "For ideal projectile motion, range is maximum near 45 degrees when launch and landing heights match.",
    vivaQuestions: [
      { prompt: "Why does mass not affect ideal projectile range?", answer: "Gravity gives all masses the same acceleration when air resistance is ignored." },
      { prompt: "What launch angle gives maximum range on level ground?", answer: "45 degrees." }
    ],
    commonMistakes: ["Mixing degrees and radians", "Forgetting that vertical acceleration is downward", "Comparing air-resistance and ideal values directly"]
  },
  {
    id: "wave-lab",
    title: "Wave Lab",
    category: "Waves",
    difficulty: "Intermediate",
    classLevel: "High school / undergraduate foundation",
    curriculumTags: curriculumTagByTitle["Wave Lab"],
    aim: "Observe interference from two coherent point wave sources.",
    theory: "Two in-phase sources generate constructive and destructive interference where path differences align or oppose phase.",
    apparatus: ["Wave sources", "Wave heatmap", "Canvas"],
    formulae: [],
    procedure: ["Run the simulation.", "Observe nodal and antinodal bands.", "Adjust source frequency or phase."],
    simulationSetup: {
      gravity: 9.81,
      objects: [
        { ...createObject("wave-source", 330, 300), frequency: 2, amplitude: 1 },
        { ...createObject("wave-source", 430, 300), frequency: 2, amplitude: 1 }
      ]
    },
    observationColumns: ["Trial", "Frequency", "Source spacing", "Pattern"],
    expectedResult: "Stable interference bands form between two coherent sources.",
    vivaQuestions: [{ prompt: "What creates a node?", answer: "Destructive interference from waves arriving out of phase." }],
    commonMistakes: ["Using different frequencies for coherent sources"]
  },
  {
    id: "single-slit-diffraction",
    title: "Single Slit Diffraction",
    category: "Waves",
    difficulty: "Intermediate",
    classLevel: "High school / undergraduate foundation",
    curriculumTags: curriculumTagByTitle["Single Slit Diffraction"],
    aim: "Observe diffraction through a single slit.",
    theory: "A barrier with a narrow opening spreads an incoming wavefront into a diffraction pattern.",
    apparatus: ["Wave source", "Barrier", "Slit"],
    formulae: [],
    procedure: ["Run the simulation.", "Watch waves pass through the slit.", "Change gap width and compare spreading."],
    simulationSetup: {
      gravity: 9.81,
      objects: [
        { ...createObject("wave-source", 180, 300), frequency: 2, amplitude: 1 },
        { ...createObject("wave-barrier", 420, 300), width: 16, height: 300, gapPositions: [128], gapWidth: 22 }
      ]
    },
    observationColumns: ["Trial", "Gap width", "Diffraction spread"],
    expectedResult: "Narrower slits create wider spreading behind the barrier.",
    vivaQuestions: [{ prompt: "Why does the wave spread after the slit?", answer: "Each point in the slit acts like a secondary wave source." }],
    commonMistakes: ["Making the slit too wide to show visible diffraction"]
  },
  {
    id: "buoyancy",
    title: "Buoyancy",
    category: "Fluid Mechanics",
    difficulty: "Beginner",
    classLevel: "High school / undergraduate foundation",
    curriculumTags: curriculumTagByTitle.Buoyancy,
    aim: "Compare floating and sinking using Archimedes' principle.",
    theory: "An immersed object experiences an upward force equal to the weight of displaced fluid.",
    apparatus: ["Fluid region", "Wood block", "Steel block"],
    formulae: [],
    procedure: ["Run the simulation.", "Watch the wood block float and the steel block sink.", "Change density and viscosity."],
    simulationSetup: {
      gravity: 9.81,
      objects: [
        createObject("floor", 460, 560),
        { ...createObject("fluid-region", 460, 405), width: 520, height: 250, density: 1e3, viscosity: 1e-3 },
        { ...createObject("block", 370, 210), name: "Wood block", density: 500, mass: 1.2, color: "#a3e635" },
        { ...createObject("block", 520, 210), name: "Steel block", density: 7800, mass: 4, color: "#94a3b8" }
      ]
    },
    observationColumns: ["Object", "Density", "Submerged fraction", "Motion"],
    expectedResult: "Wood tends to float in water, while steel sinks.",
    vivaQuestions: [{ prompt: "When does an object float?", answer: "When buoyant force can balance its weight before full submersion." }],
    commonMistakes: ["Confusing mass with density"]
  },
  {
    id: "chladni-plate",
    title: "Chladni Plate",
    category: "Waves",
    difficulty: "Advanced",
    classLevel: "High school / undergraduate enrichment",
    curriculumTags: curriculumTagByTitle["Chladni Plate"],
    aim: "Visualize standing-wave nodal patterns on a vibrating plate.",
    theory: "Sand gathers along nodes where the plate has minimal vibration.",
    apparatus: ["Chladni plate", "Audio oscillator"],
    formulae: [],
    procedure: ["Enable sound.", "Run the demo.", "Adjust plate frequency to see different nodal patterns."],
    simulationSetup: { gravity: 9.81, objects: [{ ...createObject("chladni-plate", 460, 300), frequency: 440 }] },
    observationColumns: ["Mode", "Frequency", "Pattern"],
    expectedResult: "Higher resonant frequencies produce more complex nodal patterns.",
    vivaQuestions: [{ prompt: "Where does sand collect?", answer: "At nodal lines with low vibration amplitude." }],
    commonMistakes: ["Expecting moving particles instead of node pattern formation"]
  },
  ...phase2SchoolExperiments,
  ...phase3SeniorExperiments,
  ...gapFillSchoolExperiments,
  ...syllabusSpineGapExperiments,
  ...advancedCompletionExperiments,
  ...expansionExperiments,
  ...[
    "Uniform Motion",
    "Newton's Second Law",
    "Friction",
    "Inclined Plane",
    "Elastic Collision",
    "Conservation of Energy",
    "Hooke's Law",
    "Simple Pendulum",
    "Circular Motion"
  ].map((title, index) => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, ""),
    title,
    category: "Mechanics",
    difficulty: index < 3 ? "Beginner" : "Intermediate",
    classLevel: "High school / undergraduate foundation",
    curriculumTags: curriculumTagByTitle[title],
    aim: `Explore ${title.toLowerCase()} with editable variables and live measurements.`,
    theory: "This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.",
    apparatus: ["Physics canvas", "Graph plotter", "Data logger", "Measurement probe"],
    formulae: formulaByTitle[title] ?? [],
    procedure: ["Load the setup.", "Adjust variables in the properties panel.", "Run the simulation.", "Record graph and observation values."],
    simulationSetup: { gravity: 9.81, objects: [createObject("ball", 180, 180), createObject("floor", 460, 560)] },
    observationColumns: ["Trial", "Variable", "Measured value", "Expected value", "Error %"],
    expectedResult: "Measured behavior should follow the standard SI-unit physics model for the chosen topic.",
    vivaQuestions: [{ prompt: `Name one key variable in ${title}.`, answer: "Answers depend on the selected setup and changed controls." }],
    commonMistakes: ["Using inconsistent units", "Running too large a time step", "Ignoring friction or restitution settings"]
  }))
];
var experiments = experimentCatalog.map(withScientificTrust);

// src/lib/concepts.ts
function buildConceptCards() {
  return allCurriculumTopics().map((topic2) => {
    const mappedExperiments = topic2.experimentIds.map((id) => experiments.find((experiment) => experiment.id === id)).filter(Boolean);
    return {
      id: topic2.id,
      title: topic2.title,
      domain: topic2.domain,
      classLabel: topic2.classLabel,
      grade: topic2.grade,
      unitTitle: topic2.unitTitle,
      summary: makeSummary(topic2.title, topic2.domain, topic2.outcomes, mappedExperiments),
      outcomes: topic2.outcomes,
      tools: topic2.tools,
      experimentIds: topic2.experimentIds,
      topicPath: `/topics/${domainSlugs[topic2.domain] ?? slugify(topic2.domain)}`,
      depth: depthForGrade(topic2.grade),
      essentials: makeEssentials(topic2.domain, topic2.title),
      misconception: mappedExperiments[0]?.commonMistakes[0] ?? misconceptionForDomain(topic2.domain),
      practicePrompt: makePracticePrompt(topic2.title, topic2.domain, mappedExperiments)
    };
  });
}
function depthForGrade(grade) {
  if (grade <= 8) return "foundation";
  if (grade <= 12) return "board";
  if (grade <= 14) return "advanced";
  return "research";
}
function makeSummary(title, domain, outcomes, mappedExperiments) {
  const action = outcomes[0] ?? `Build the main ${domain.toLowerCase()} relationship.`;
  const lab = mappedExperiments[0] ? ` Try it in ${mappedExperiments[0].title}.` : " A lab will be added in the interactive build phase.";
  return `${action}${lab}`;
}
function makeEssentials(domain, title) {
  const shared = ["One changing variable", "Clear units", "Graph the pattern"];
  if (domain.includes("Optics")) return ["Ray direction", "Normal line", "Image position"];
  if (domain.includes("Electric")) return ["Voltage", "Current", "Resistance or field"];
  if (domain.includes("Magnet")) return ["Field direction", "Current direction", "Force direction"];
  if (domain.includes("Wave")) return ["Amplitude", "Frequency", "Wavelength"];
  if (domain.includes("Thermo")) return ["Temperature", "Heat flow", "Material property"];
  if (domain.includes("Fluid")) return ["Pressure", "Density", "Depth or area"];
  if (domain.includes("Modern")) return ["Energy packet", "Transition", "Probability"];
  if (title.includes("Motion") || domain.includes("Mechanics")) return ["Position", "Velocity", "Force or energy"];
  return shared;
}
function misconceptionForDomain(domain) {
  if (domain.includes("Optics")) return "Measuring ray angles from the surface instead of the normal.";
  if (domain.includes("Electric")) return "Treating voltage, current, and energy as the same quantity.";
  if (domain.includes("Wave")) return "Mixing up amplitude, frequency, and speed.";
  if (domain.includes("Thermo")) return "Calling heat and temperature the same thing.";
  if (domain.includes("Fluid")) return "Confusing force with pressure.";
  return "Changing multiple variables at once and then trusting the pattern.";
}
function makePracticePrompt(title, domain, mappedExperiments) {
  const lab = mappedExperiments[0]?.title ?? title;
  return `Predict one trend in ${lab}, then verify it with a slider or quiz question from ${domain}.`;
}

// src/lib/physicsModules.ts
var physicsModuleGroups = [
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
      moduleLink("concepts", "Concept Explorer", "Concept explanations linked to labs, visuals, and key ideas.", "/concepts", "spark", ["concept", "explain", "learn"])
    ]
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
      moduleLink("gravitation", "Gravity & Orbits", "Universal gravitation, orbital motion, escape speed, and satellites.", "/experiments/satellite-orbit", "orbit", ["gravity", "orbit", "satellite"]),
      moduleLink("sandbox", "Mechanics Sandbox", "Build free-form experiments with objects, forces, springs, and tracks.", "/sandbox", "spark", ["sandbox", "simulation", "force"])
    ]
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
      moduleLink("video-analysis", "Video Motion Analysis", "Measure motion from video and compare with graph predictions.", "/video", "eye", ["video", "tracking", "motion"])
    ]
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
      moduleLink("magnetic-labs", "Magnetic Field Labs", "Explore magnetic field, induction, and force visualizations.", "/experiments?category=Magnetism", "field", ["magnetic field", "emi", "motor"])
    ]
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
      moduleLink("fluid-labs", "Fluid Labs", "Open buoyancy, pressure, and flow simulations.", "/experiments?category=Fluids", "drop", ["fluid lab", "hydrostatic", "flow"])
    ]
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
      moduleLink("particle-tools", "Particle Concept Pages", "Open interactive pages for every particle physics concept.", "/particle-physics/higgs-field", "spark", ["higgs", "qft", "interactive"], "quantum")
    ]
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
      moduleLink("innovations", "Physics Inventions", "Explore 100+ physics inventions, discoveries, and technologies.", "/physics-innovations", "spark", ["inventions", "discoveries", "laser"], "warning")
    ]
  },
  {
    id: "learning-tools",
    title: "Learning, Trust & Teaching",
    summary: "Roadmaps, quizzes, teacher tools, validation, accessibility, and PhET-level improvement work.",
    icon: "teacher",
    modules: [
      moduleLink("roadmap", "Student Roadmap", "Class-wise launch paths into labs and mastery practice.", "/roadmap", "compass", ["roadmap", "class", "mastery"]),
      moduleLink("quiz", "Quiz Practice", "Practice conceptual and numerical physics questions.", "/quiz?view=practice", "check", ["quiz", "practice", "assessment"]),
      moduleLink("teacher", "Teacher Tools", "Assignments, snapshots, classroom reports, and evidence review.", "/teacher", "teacher", ["teacher", "assignment", "classroom"]),
      moduleLink("trust", "Scientific Trust", "Accuracy checks, validation status, sources, and model assumptions.", "/trust", "check", ["trust", "accuracy", "source"], "warning"),
      moduleLink("simulation-depth", "Simulation Depth", "2D/3D polish, accuracy, probes, replay, and launch tracking.", "/simulation-depth", "eye", ["phet", "simulation", "depth"]),
      moduleLink("excellence", "Excellence Benchmark", "Compare against top teaching tools and plan improvements.", "/excellence-benchmark", "gauge", ["benchmark", "phet", "quality"], "warning")
    ]
  }
];
var allPhysicsModules = physicsModuleGroups.flatMap(
  (group) => group.modules.map((module2) => ({ ...module2, groupId: group.id, groupTitle: group.title }))
);
var physicsModuleStats = {
  groups: physicsModuleGroups.length,
  modules: allPhysicsModules.length
};
function moduleLink(id, title, description, path, icon, keywords, accent) {
  return { id, title, description, path, icon, keywords, accent };
}

// src/lib/conceptExperiences.ts
var conceptExperiences = [
  { id: "measurement", title: "Measurement", shortTitle: "Measurement", domain: "Foundations", icon: "ruler", visual: "measure", summary: "Turn a physical quantity into a defensible number using a calibrated instrument, unit, resolution, and uncertainty.", principle: "Every reading combines a best estimate with instrument resolution and experimental uncertainty.", formula: "reported value = measured value \xB1 uncertainty", controls: [{ key: "value", label: "Object length", unit: "mm", min: 12, max: 92, step: 0.1, value: 48.6 }, { key: "resolution", label: "Instrument resolution", unit: "mm", min: 0.1, max: 5, step: 0.1, value: 0.5 }], examples: [{ title: "Vernier caliper", detail: "Measures small diameters and depths more precisely than a ruler." }, { title: "GPS timing", detail: "Position depends on precisely measured signal travel times." }], applications: [{ title: "Manufacturing tolerance", detail: "Parts fit only when dimensions and uncertainty remain within tolerance." }, { title: "Medical dosage", detail: "Mass and volume measurements control safe medicine preparation." }], observe: ["Resolution limits the reported precision.", "Repeated readings reveal random variation.", "Units make the number physically meaningful."], path: "/topics/measurement" },
  { id: "mechanics", title: "Mechanics", shortTitle: "Mechanics", domain: "Mechanics", icon: "gauge", visual: "mechanics", summary: "Study how forces change motion and how energy and momentum move through physical systems.", principle: "The net external force determines acceleration, while constraints define the permitted motion.", formula: "\u03A3F = ma", controls: [{ key: "force", label: "Applied force", unit: "N", min: -20, max: 40, step: 1, value: 18 }, { key: "mass", label: "Mass", unit: "kg", min: 1, max: 12, step: 0.5, value: 4 }], examples: [{ title: "Elevator motion", detail: "Cable tension and weight determine upward or downward acceleration." }, { title: "Vehicle braking", detail: "Tyre-road friction changes momentum over a stopping distance." }], applications: [{ title: "Structural engineering", detail: "Load paths and equilibrium determine safe beams, bridges, and frames." }, { title: "Robotics", detail: "Actuator forces are selected from mass, acceleration, and joint constraints." }], observe: ["Balanced forces produce zero acceleration.", "More mass produces less acceleration for the same force.", "Friction opposes relative surface motion."], path: "/topics/mechanics" },
  { id: "motion-kinematics", title: "Motion and Kinematics", shortTitle: "Motion", domain: "Mechanics", icon: "rocket", visual: "motion", summary: "Describe position, velocity, and acceleration without first asking what force caused the motion.", principle: "Velocity is the rate of change of position; acceleration is the rate of change of velocity.", formula: "x = x\u2080 + v\u2080t + \xBDat\xB2", controls: [{ key: "speed", label: "Launch speed", unit: "m/s", min: 5, max: 45, step: 1, value: 24 }, { key: "angle", label: "Launch angle", unit: "\xB0", min: 10, max: 80, step: 1, value: 42 }], examples: [{ title: "Football trajectory", detail: "Launch speed and angle determine flight time, height, and range." }, { title: "Train timetable", detail: "Position-time data reveals average and instantaneous speed." }], applications: [{ title: "Road safety", detail: "Reaction time and deceleration determine stopping distance." }, { title: "Sports analytics", detail: "Tracked coordinates quantify speed, acceleration, and technique." }], observe: ["Horizontal velocity is constant when drag is neglected.", "Vertical acceleration remains approximately 9.81 m/s\xB2 downward.", "A 45\xB0 launch maximizes ideal range on level ground."], path: "/topics/mechanics" },
  { id: "force-newton", title: "Force and Newton\u2019s Laws", shortTitle: "Newton\u2019s Laws", domain: "Mechanics", icon: "gauge", visual: "newton", summary: "Connect interactions to changes in motion using inertia, net force, and action\u2013reaction pairs.", principle: "Forces are interactions; only the vector sum of forces on one body controls its acceleration.", formula: "a = Fnet / m", controls: [{ key: "force", label: "Net force", unit: "N", min: -30, max: 50, step: 1, value: 20 }, { key: "mass", label: "Object mass", unit: "kg", min: 1, max: 15, step: 0.5, value: 5 }], examples: [{ title: "Bus passenger", detail: "Inertia makes a standing passenger continue moving when the bus brakes." }, { title: "Swimming", detail: "The swimmer pushes water backward; water pushes the swimmer forward." }], applications: [{ title: "Crash protection", detail: "Airbags extend stopping time and reduce average force on occupants." }, { title: "Spacecraft control", detail: "Thruster impulse changes velocity in the absence of atmospheric drag." }], observe: ["Action and reaction act on different bodies.", "Zero net force can mean rest or constant velocity.", "Acceleration points in the direction of net force."], path: "/topics/mechanics" },
  { id: "work-energy-power", title: "Work, Energy and Power", shortTitle: "Energy", domain: "Mechanics", icon: "flame", visual: "energy", summary: "Track how forces transfer energy, how energy changes form, and how quickly useful work is done.", principle: "In an isolated system total energy is conserved even while kinetic, potential, thermal, and elastic stores change.", formula: "P = W/t,  \u0394K = Wnet", controls: [{ key: "height", label: "Starting height", unit: "m", min: 1, max: 18, step: 0.5, value: 10 }, { key: "mass", label: "Vehicle mass", unit: "kg", min: 1, max: 10, step: 0.5, value: 3 }], examples: [{ title: "Roller coaster", detail: "Gravitational potential energy becomes kinetic energy on descent." }, { title: "Electric kettle", detail: "Power specifies how quickly electrical energy heats water." }], applications: [{ title: "Regenerative braking", detail: "Vehicle kinetic energy is converted back into stored electrical energy." }, { title: "Renewable generation", detail: "Turbines transform fluid energy into mechanical and electrical power." }], observe: ["Potential energy scales with mass and height.", "Power measures rate, not total energy.", "Dissipation transfers organized energy into thermal energy."], path: "/topics/energy" },
  { id: "gravitation", title: "Gravitation", shortTitle: "Gravity", domain: "Mechanics", icon: "orbit", visual: "gravity", summary: "Explore universal attraction, free fall, orbital motion, and the geometry of gravitational fields.", principle: "Any two masses attract; an orbit is continuous free fall around a curved path.", formula: "F = GMm/r\xB2", controls: [{ key: "speed", label: "Orbital speed", unit: "km/s", min: 4, max: 10, step: 0.1, value: 7.7 }, { key: "radius", label: "Orbital radius", unit: "km", min: 6700, max: 16e3, step: 100, value: 6800 }], examples: [{ title: "Low Earth orbit", detail: "A spacecraft falls around Earth fast enough to keep missing the surface." }, { title: "Ocean tides", detail: "Differences in lunar gravity across Earth produce tidal effects." }], applications: [{ title: "Satellite navigation", detail: "Orbital mechanics and relativistic timing support global positioning." }, { title: "Space missions", detail: "Transfer orbits reduce the propulsion required to move between worlds." }], observe: ["Gravity weakens with the square of distance.", "Circular-orbit speed decreases at greater radius.", "Astronauts feel weightless while still under strong gravity."], path: "/topics/mechanics" },
  { id: "oscillations", title: "Oscillations", shortTitle: "Oscillations", domain: "Waves", icon: "pendulum", visual: "oscillation", summary: "Investigate repeating motion, restoring forces, resonance, damping, amplitude, phase, and frequency.", principle: "A stable oscillator has a restoring influence directed toward equilibrium.", formula: "T = 2\u03C0\u221A(m/k)", controls: [{ key: "frequency", label: "Driving frequency", unit: "Hz", min: 0.2, max: 3, step: 0.05, value: 1.1 }, { key: "damping", label: "Damping", unit: "%", min: 0, max: 30, step: 1, value: 5 }], examples: [{ title: "Playground swing", detail: "Timed pushes near the natural frequency produce resonance." }, { title: "Car suspension", detail: "Springs store energy while dampers reduce repeated bouncing." }], applications: [{ title: "Earthquake engineering", detail: "Buildings use damping and tuned masses to control resonance." }, { title: "Timekeeping", detail: "Quartz oscillators provide stable periodic signals for clocks." }], observe: ["Resonance occurs near the natural frequency.", "Damping removes energy and reduces amplitude.", "Period and frequency are reciprocals."], path: "/topics/oscillations" },
  { id: "waves-sound", title: "Waves and Sound", shortTitle: "Waves", domain: "Waves", icon: "wave", visual: "wave", summary: "See disturbances carry energy and information through space or matter without transporting the medium overall.", principle: "Wave speed is set by the medium; frequency is set by the source and wavelength adjusts accordingly.", formula: "v = f\u03BB", controls: [{ key: "frequency", label: "Frequency", unit: "Hz", min: 1, max: 12, step: 0.2, value: 4 }, { key: "amplitude", label: "Amplitude", unit: "cm", min: 0.2, max: 3, step: 0.1, value: 1.4 }], examples: [{ title: "Musical instruments", detail: "Standing-wave modes select the notes supported by strings and air columns." }, { title: "Doppler shift", detail: "Relative motion changes the observed sound frequency of a siren." }], applications: [{ title: "Ultrasound imaging", detail: "Reflected high-frequency sound maps internal tissue boundaries." }, { title: "Noise control", detail: "Absorption and destructive interference reduce unwanted sound." }], observe: ["Particles oscillate locally while the wave travels.", "Greater amplitude carries more energy.", "Interference follows superposition."], path: "/topics/waves" },
  { id: "optics", title: "Optics", shortTitle: "Optics", domain: "Optics", icon: "prism", visual: "optics", summary: "Trace how light reflects, refracts, diffracts, interferes, and forms images.", principle: "Light changes direction when its propagation speed changes at an interface.", formula: "n\u2081 sin\u03B8\u2081 = n\u2082 sin\u03B8\u2082", controls: [{ key: "angle", label: "Incident angle", unit: "\xB0", min: 5, max: 75, step: 1, value: 38 }, { key: "index", label: "Refractive index", unit: "", min: 1.1, max: 2, step: 0.01, value: 1.5 }], examples: [{ title: "Eyeglasses", detail: "Curved lenses redirect rays to focus images on the retina." }, { title: "Rainbow", detail: "Refraction, dispersion, and internal reflection separate colours in droplets." }], applications: [{ title: "Fibre-optic communication", detail: "Total internal reflection guides light through long transparent fibres." }, { title: "Microscopy", detail: "Lens systems magnify small structures and manage resolution." }], observe: ["The frequency remains unchanged across the boundary.", "Light bends toward the normal in a slower medium.", "Image position follows ray geometry."], path: "/topics/optics" },
  { id: "electricity", title: "Electricity", shortTitle: "Electricity", domain: "Electricity", icon: "battery", visual: "electricity", summary: "Connect charge, electric fields, potential difference, current, resistance, and power in working circuits.", principle: "A potential difference supplies energy per unit charge; current measures charge flow rate.", formula: "V = IR", controls: [{ key: "voltage", label: "Battery voltage", unit: "V", min: 1, max: 24, step: 0.5, value: 9 }, { key: "resistance", label: "Resistance", unit: "\u03A9", min: 2, max: 30, step: 1, value: 10 }], examples: [{ title: "Phone charging", detail: "A power converter regulates voltage and current delivered to the battery." }, { title: "House wiring", detail: "Parallel branches let appliances receive the same supply voltage." }], applications: [{ title: "Power transmission", detail: "High voltage reduces current and resistive loss for a given power." }, { title: "Electric vehicles", detail: "Power electronics control energy flow between battery and motor." }], observe: ["Current increases with voltage for an ohmic resistor.", "Resistance limits current and converts electrical energy to heat.", "Charge is conserved at circuit junctions."], path: "/topics/electricity" },
  { id: "magnetism", title: "Magnetism", shortTitle: "Magnetism", domain: "Magnetism", icon: "magnet", visual: "magnetism", summary: "Visualize magnetic fields from currents and magnets, forces on moving charge, and electromagnetic induction.", principle: "Moving charges create magnetic fields and experience forces perpendicular to their motion and the field.", formula: "F = qvB sin\u03B8", controls: [{ key: "current", label: "Coil current", unit: "A", min: -5, max: 5, step: 0.1, value: 2.5 }, { key: "turns", label: "Coil turns", unit: "", min: 5, max: 50, step: 1, value: 24 }], examples: [{ title: "Compass", detail: "A magnetic needle aligns with Earth\u2019s local magnetic field." }, { title: "Induction cooker", detail: "Changing magnetic fields drive currents that heat a metal pan." }], applications: [{ title: "Electric motors", detail: "Magnetic force converts electrical input into controlled rotation." }, { title: "MRI", detail: "Strong fields and radio signals reveal spatial information about tissue." }], observe: ["Field direction reverses when current reverses.", "A stationary charge feels no magnetic force.", "Changing magnetic flux induces an emf."], path: "/topics/magnetism" },
  { id: "electronics", title: "Electronics", shortTitle: "Electronics", domain: "Electronics", icon: "spark", visual: "electronics", summary: "Use semiconductor devices to switch, amplify, sense, compute, and communicate with electrical signals.", principle: "Small input signals control larger currents through semiconductor junctions and field effects.", formula: "Vout = gain \xD7 Vin", controls: [{ key: "input", label: "Input signal", unit: "V", min: 0, max: 5, step: 0.05, value: 1.2 }, { key: "gain", label: "Amplifier gain", unit: "\xD7", min: 1, max: 10, step: 0.5, value: 4 }], examples: [{ title: "Automatic night light", detail: "A light sensor and transistor switch a lamp when illumination falls." }, { title: "Audio amplifier", detail: "A small microphone signal controls power delivered to a loudspeaker." }], applications: [{ title: "Computing", detail: "Billions of transistor switches implement logic and memory." }, { title: "Medical sensors", detail: "Signal conditioning extracts small biological measurements from noise." }], observe: ["Outputs are limited by the power-supply rails.", "Digital signals use voltage ranges to encode states.", "Feedback controls gain, stability, and bandwidth."], path: "/topics/electronics" },
  { id: "thermodynamics", title: "Thermodynamics", shortTitle: "Thermodynamics", domain: "Thermodynamics", icon: "thermometer", visual: "thermal", summary: "Follow energy transfer as heat and work while particles, temperature, pressure, and entropy change.", principle: "Energy is conserved, but real processes spread energy and increase total entropy.", formula: "\u0394U = Q \u2212 W", controls: [{ key: "temperature", label: "Temperature", unit: "K", min: 150, max: 600, step: 5, value: 300 }, { key: "volume", label: "Gas volume", unit: "L", min: 1, max: 6, step: 0.1, value: 3 }], examples: [{ title: "Pressure cooker", detail: "Higher pressure raises water\u2019s boiling temperature and speeds cooking." }, { title: "Refrigerator", detail: "External work moves thermal energy from a cold interior to a warm room." }], applications: [{ title: "Heat engines", detail: "Temperature differences allow part of thermal energy to become work." }, { title: "Building efficiency", detail: "Insulation reduces unwanted heat transfer through walls and roofs." }], observe: ["Temperature tracks average microscopic kinetic energy.", "Compression raises pressure and often temperature.", "No heat engine converts all input heat into work."], path: "/topics/thermodynamics" },
  { id: "fluid-mechanics", title: "Fluid Mechanics", shortTitle: "Fluids", domain: "Fluid Mechanics", icon: "drop", visual: "fluid", summary: "Explore pressure, buoyancy, continuity, viscosity, and energy in liquids and gases.", principle: "Mass is conserved along a flow, while pressure and speed exchange energy under ideal conditions.", formula: "A\u2081v\u2081 = A\u2082v\u2082", controls: [{ key: "flow", label: "Volume flow", unit: "L/s", min: 1, max: 12, step: 0.2, value: 5 }, { key: "narrowing", label: "Outlet diameter", unit: "cm", min: 1.5, max: 6, step: 0.1, value: 3 }], examples: [{ title: "Garden hose nozzle", detail: "A smaller outlet produces a faster jet for the same volume flow." }, { title: "Ship flotation", detail: "Displaced water provides an upward buoyant force equal to its weight." }], applications: [{ title: "Aircraft aerodynamics", detail: "Pressure, momentum change, and circulation determine aerodynamic forces." }, { title: "Blood flow", detail: "Pressure gradients and vessel resistance govern circulation." }], observe: ["Pressure increases with depth in a static fluid.", "Narrow flow sections have greater speed.", "Viscosity dissipates mechanical energy."], path: "/topics/fluid-mechanics" },
  { id: "modern-physics", title: "Modern Physics", shortTitle: "Modern Physics", domain: "Modern Physics", icon: "atom", visual: "modern", summary: "Connect quantum behaviour, atomic structure, relativity, nuclear processes, and the limits of classical models.", principle: "Energy and matter show quantized and wave-like behaviour at microscopic scales.", formula: "E = hf", controls: [{ key: "frequency", label: "Light frequency", unit: "THz", min: 300, max: 1e3, step: 10, value: 650 }, { key: "work", label: "Work function", unit: "eV", min: 1.5, max: 5, step: 0.1, value: 2.3 }], examples: [{ title: "Photoelectric effect", detail: "Electrons leave a material only when individual photons exceed a threshold energy." }, { title: "Atomic spectra", detail: "Discrete colours reveal transitions between quantized energy levels." }], applications: [{ title: "Solar cells", detail: "Photons create mobile charge carriers in semiconductor junctions." }, { title: "Nuclear medicine", detail: "Controlled radioactive tracers and detectors support imaging and treatment." }], observe: ["Higher frequency means greater photon energy.", "Brightness changes photon number, not energy per photon.", "Classical intuition has a limited microscopic range."], path: "/topics/modern-physics" },
  { id: "astronomy-astrophysics", title: "Astronomy and Astrophysics", shortTitle: "Astrophysics", domain: "Space Science", icon: "orbit", visual: "astronomy", summary: "Use light, gravity, motion, and nuclear physics to investigate planets, stars, galaxies, and the evolving universe.", principle: "Almost everything known about distant objects is inferred from radiation, motion, and gravitational effects.", formula: "v = H\u2080d", controls: [{ key: "distance", label: "Galaxy distance", unit: "Mpc", min: 1, max: 500, step: 5, value: 120 }, { key: "mass", label: "Lens mass", unit: "10\xB9\xB9 M\u2609", min: 0.2, max: 8, step: 0.1, value: 2 }], examples: [{ title: "Exoplanet transit", detail: "A small periodic dip in starlight can reveal a planet\u2019s size and orbit." }, { title: "Stellar spectrum", detail: "Absorption lines identify composition, temperature, and radial motion." }], applications: [{ title: "Satellite forecasting", detail: "Space-weather observations help protect communication and power systems." }, { title: "Cosmology", detail: "Redshift and distance measurements constrain cosmic expansion history." }], observe: ["Look-back time increases with distance.", "Gravity can bend light and magnify background objects.", "Spectra carry chemical and motion information."], path: "/astrophysics" }
];
var conceptExperienceById = new Map(conceptExperiences.map((item) => [item.id, item]));

// src/lib/appDirectory.ts
var platform = [
  ["home", "Home", "Product home and launch point.", "/", "Core", "atom"],
  ["syllabus", "Syllabus", "Curriculum structure and topic coverage.", "/syllabus", "Learning", "book"],
  ["formulas", "Formula Bank", "Searchable equations and variables.", "/formulas", "Reference", "book"],
  ["revision", "Formula Revision Grid", "Categorized revision cards.", "/formulas/revision-grid", "Reference", "calculator"],
  ["dictionary", "Visual Dictionary", "Searchable physics definitions.", "/dictionary", "Reference", "clipboard"],
  ["solver", "Solver Bank", "Unit-aware worked problems.", "/solver", "Practice", "calculator"],
  ["quiz", "Quiz", "Conceptual and numerical assessment.", "/quiz?view=practice", "Practice", "check"],
  ["graphs", "Graph Studio", "Interactive physics plots.", "/graphs", "Analysis", "chart"],
  ["video", "Video Analysis", "Calibrated motion tracking.", "/video", "Analysis", "eye"],
  ["knowledge", "Knowledge Graph", "Connected concepts, labs, and formulas.", "/graph", "Learning", "orbit"],
  ["scale", "Scale of Universe", "Powers-of-ten visual explorer.", "/physics/scale-of-universe", "Immersive", "ruler"],
  ["innovation", "Physics Innovations", "Discoveries and invention timeline.", "/physics-innovations", "Immersive", "spark"],
  ["atmosphere", "Earth Atmosphere", "Interactive atmospheric layers.", "/atmosphere", "Immersive", "orbit"],
  ["astrophysics", "AstroPhysics", "Black holes, galaxies, and cosmology.", "/astrophysics", "Immersive", "orbit"],
  ["particle", "Particle Physics", "Standard Model and particle concepts.", "/particle-physics", "Immersive", "atom"],
  ["string", "String Theory", "3D theoretical-physics concepts.", "/string-theory", "Immersive", "wave"],
  ["quantum", "Quantum Lab", "Interactive modern-physics laboratory.", "/quantum", "Immersive", "atom"],
  ["sandbox", "Open Sandbox", "Free-form physics workspace.", "/sandbox", "Laboratory", "spark"],
  ["guided", "Guided Lab", "Structured physics workspace.", "/lab", "Laboratory", "compass"],
  ["projects", "Projects", "Saved learner work.", "/projects", "Workspace", "folder"],
  ["comparison", "Platform Comparison", "Product benchmark and positioning.", "/comparison?view=benchmark", "Governance", "chart"],
  ["settings", "Settings", "Application preferences.", "/settings", "Workspace", "settings"],
  ["backup", "Backup & Restore", "Local project backup tools.", "/backup", "Workspace", "download"],
  ["help", "Help Center", "Usage guidance and shortcuts.", "/help", "Support", "book"],
  ["privacy", "Privacy", "Privacy information.", "/privacy", "Support", "clipboard"],
  ["terms", "Terms", "Terms of use.", "/terms", "Support", "clipboard"]
].map(([id, title, description, path, group, icon]) => ({ id, title, description, path, group, icon, keywords: [title, description, group] }));
var teaching = [
  ["teacher", "Teacher Workspace", "Assignments, evidence, and snapshots.", "/teacher", "Teaching", "teacher"],
  ["lms", "LMS Configuration", "Learning-platform integration settings.", "/lms-config", "Teaching", "settings"],
  ["studio", "Learning Studio", "Guided lesson and misconception design.", "/learning-studio", "Learning Design", "teacher"],
  ["roadmap", "Mastery Roadmap", "Adaptive class-wise learning paths.", "/roadmap", "Learning Design", "compass"],
  ["deployment", "Classroom Deployment", "Assignment rollout and evidence.", "/classroom-deployment", "Operations", "upload"],
  ["insights", "Insights Center", "Readiness and intervention analytics.", "/insights-center", "Operations", "chart"],
  ["quality", "Quality Audit", "Simulation-quality baseline.", "/quality-audit", "Trust & Quality", "chart"],
  ["accuracy", "Accuracy Center", "Validated benchmark evidence.", "/accuracy-center", "Trust & Quality", "check"],
  ["depth", "Simulation Depth", "Visualization and interaction depth.", "/simulation-depth", "Trust & Quality", "eye"],
  ["accessibility", "Accessibility Center", "Inclusive experience audit.", "/accessibility-center", "Trust & Quality", "settings"],
  ["release", "Release Governance", "Scientific review and publishing gate.", "/release-governance", "Trust & Quality", "check"],
  ["excellence", "Excellence Benchmark", "Product quality command board.", "/excellence-benchmark", "Trust & Quality", "gauge"],
  ["trust", "Scientific Trust", "Sources, assumptions, and model status.", "/trust", "Trust & Quality", "check"]
].map(([id, title, description, path, group, icon]) => ({ id, title, description, path, group, icon, keywords: [title, description, group] }));
var appDirectoryEntries = [
  ...allPhysicsModules.map((module2) => ({ id: `module-${module2.id}`, title: module2.title, description: module2.description, path: module2.path, section: "Modules", group: module2.groupTitle, icon: module2.icon, keywords: module2.keywords, badge: "MODULE" })),
  ...buildConceptCards().map((concept) => ({ id: `concept-${concept.id}`, title: concept.title, description: concept.summary, path: `/concepts?concept=${concept.id}`, section: "Concepts", group: concept.domain, icon: "spark", keywords: [concept.classLabel, concept.unitTitle, ...concept.outcomes, ...concept.essentials], badge: concept.classLabel })),
  ...conceptExperiences.map((concept) => ({ id: `live-concept-${concept.id}`, title: `Live ${concept.title}`, description: concept.summary, path: `/concept-studio/${concept.id}`, section: "Concepts", group: "Interactive Concept Studio", icon: concept.icon, keywords: [concept.principle, concept.formula, ...concept.observe, ...concept.examples.map((item) => item.title), ...concept.applications.map((item) => item.title)], badge: "LIVE" })),
  ...experiments.map((experiment) => ({ id: `experiment-${experiment.id}`, title: experiment.title, description: experiment.aim, path: `/experiments/${experiment.id}`, section: "Experiments", group: experiment.category, icon: "flask", keywords: [experiment.difficulty, experiment.classLevel ?? "", experiment.theory], badge: experiment.difficulty })),
  ...[
    ["pro-program", "Pro Lab Mission Program", "Six professional scientific operations programs.", "/pro-lab", "Mission Control", "rocket"],
    ["rocket-build", "Build & Launch Rocket", "Integrate, verify, fuel, and launch a virtual vehicle.", "/pro-lab/launch-vehicle", "Rocket Program", "rocket"],
    ["rocket-parts", "Rocket Parts & Systems", "Search and inspect 225 launch-vehicle components.", "/rocket-lab/parts", "Rocket Program", "settings"],
    ["mission-planner", "Mission Planner", "Configure mission objectives and launch criteria.", "/pro-lab/launch-vehicle#mission", "Rocket Program", "clipboard"],
    ["launch-ascent", "Launch & Ascent", "Countdown, liftoff, ascent, and mission outcomes.", "/pro-lab/launch-vehicle#launch", "Rocket Program", "rocket"]
  ].map(([id, title, description, path, group, icon]) => ({ id, title, description, path, section: "Pro Lab", group, icon, keywords: [title, description, group], badge: "PRO" })),
  ...clientDemos.map((demo) => ({ id: `demo-${demo.rank}`, title: demo.title, description: demo.pitch, path: demo.path, section: "Client Demos", group: demo.category, icon: demo.icon, keywords: demo.show, badge: `#${demo.rank}` })),
  ...teaching.map((entry) => ({ ...entry, section: "Teaching" })),
  ...platform.map((entry) => ({ ...entry, section: "Platform" }))
];
var directorySections = ["Modules", "Concepts", "Experiments", "Pro Lab", "Client Demos", "Teaching", "Platform"];
var directoryCounts = Object.fromEntries(directorySections.map((section) => [section, appDirectoryEntries.filter((entry) => entry.section === section).length]));

// src/lib/conceptStudioHomes.ts
var C = (title, detail, icon) => ({ title, detail, icon });
var A = (title, detail, action) => ({ title, detail, action });
var studioHomes = [
  { id: "measurement", name: "Measurement Studio", eyebrow: "PRECISION BEGINS WITH THE RIGHT INSTRUMENT", tagline: "Measure \xB7 Analyse \xB7 Reduce uncertainty \xB7 Discover", icon: "ruler", accent: "#38d8ff", asset: "/assets/concept-studio/measurement-hero.png", startRoute: "/experiments/measurement-errors", variant: "bench", liveTitle: "Instrument resolution", liveValue: "\xB1 0.05 mm", concepts: [C("Length", "Metre rule, Vernier caliper, micrometer and spherometer.", "ruler"), C("Mass", "Electronic balance and mass standards.", "gauge"), C("Time", "Stopwatch, oscillations and time measurement.", "pendulum"), C("Uncertainty", "Estimate, propagate and report uncertainty.", "chart"), C("Significant Figures", "Meaningful digits, rounding and calculations.", "calculator"), C("Instrument Errors", "Zero error, least count and calibration.", "compass")], activities: [A("Featured Instruments", "Explore tools used in real measurements.", "Explore instruments"), A("Choose an Instrument", "Select the best tool for a thin metal sheet.", "Check answer"), A("Accuracy Progress", "Continue focused measurement practice.", "Continue learning")] },
  { id: "mechanics", name: "Mechanics Studio", eyebrow: "EXPLORE \xB7 BUILD \xB7 MEASURE \xB7 UNDERSTAND", tagline: "Build systems. Reveal the forces.", icon: "gauge", accent: "#ffb83e", asset: "/assets/concept-studio/mechanics-hero.png", startRoute: "/experiments/inclined-plane", variant: "bench", liveTitle: "Net force", liveValue: "12.4 N", concepts: [C("Force Systems", "Vectors, components and resultants.", "field"), C("Friction", "Static, kinetic and real-world surfaces.", "gauge"), C("Torque", "Moments and rotational effects.", "settings"), C("Equilibrium", "Stable systems satisfy \u03A3F = 0 and \u03A3\u03C4 = 0.", "check"), C("Momentum", "Conservation, impulse and collisions.", "rocket"), C("Machines", "Levers, pulleys, gears and mechanical advantage.", "settings")], activities: [A("Build Your System", "Assemble components, set parameters and test ideas.", "Start studio"), A("Free-Body Diagram Challenge", "Draw the correct forces for a block on an incline.", "Check answer"), A("Featured Machine", "Explore a compound pulley hoist.", "Explore machine")] },
  { id: "motion-kinematics", name: "Motion & Kinematics", eyebrow: "MOTION TRACK \xB7 CONSTANT ACCELERATION", tagline: "See motion frame by frame.", icon: "rocket", accent: "#30d7ff", asset: "/assets/concept-studio/motion-kinematics-hero.png", startRoute: "/experiments/uniform-motion", variant: "track", liveTitle: "Instant velocity", liveValue: "4.80 m/s", concepts: [C("Position", "Position, displacement and origin.", "compass"), C("Velocity", "Average and instantaneous velocity.", "rocket"), C("Acceleration", "Constant and variable acceleration.", "chart"), C("Projectiles", "Range, height and flight time.", "orbit"), C("Relative Motion", "Motion depends on the reference frame.", "eye"), C("Circular Motion", "Constant speed with changing direction.", "orbit")], activities: [A("Choose a Track Scenario", "Compare level, inclined and friction tracks.", "Choose track"), A("Graph Prediction Challenge", "Predict the velocity graph before the run.", "Check graph"), A("Motion Recorder", "Capture motion, generate graphs and measure.", "Open recorder")] },
  { id: "force-newton", name: "Force & Newton\u2019s Laws", eyebrow: "AIR TRACK \xB7 REAL PHYSICS", tagline: "Change a force. Predict the motion.", icon: "gauge", accent: "#ff5d75", asset: "/assets/concept-studio/force-newton-hero.png", startRoute: "/experiments/newton-s-second-law", variant: "track", liveTitle: "Acceleration", liveValue: "2.40 m/s\xB2", concepts: [C("Inertia", "Resists changes in motion.", "rocket"), C("F = ma", "Net force, mass and acceleration.", "calculator"), C("Action\u2013Reaction", "Equal and opposite forces on different objects.", "field"), C("Friction", "Opposes relative motion.", "gauge"), C("Tension", "Pulls along a string or cable.", "settings"), C("Normal Force", "Perpendicular to the surface.", "field")], activities: [A("Select a Newton\u2019s Law", "Explore inertia, F = ma and action\u2013reaction.", "Select law"), A("Force Vector Sandbox", "Set forces on both carts and predict motion.", "Update vectors"), A("Misconception Challenge", "Test whether a heavier cart pushes harder.", "Check answer")] },
  { id: "work-energy-power", name: "Work, Energy & Power", eyebrow: "ENERGY IN MOTION", tagline: "Track where energy goes.", icon: "flame", accent: "#7cf173", asset: "/assets/experiments/conservation-of-energy/energy-track.png", startRoute: "/experiments/conservation-of-energy", variant: "field", liveTitle: "Total mechanical energy", liveValue: "48.2 J", concepts: [C("Work", "Measure energy transferred by a force.", "gauge"), C("Kinetic Energy", "Connect speed and moving energy.", "rocket"), C("Potential Energy", "Store energy through position.", "orbit"), C("Conservation", "Account for every energy transfer.", "check"), C("Power", "Compare how quickly work is done.", "spark"), C("Efficiency", "Track useful output and dissipation.", "chart")], activities: [A("Energy-System Builder", "Shape a track and watch every energy reservoir.", "Design system"), A("Conservation Challenge", "Find the missing energy store in three systems.", "Balance energy"), A("Continue Learning", "Compare equal work completed over different times.", "Continue")] },
  { id: "gravitation", name: "Gravitation Studio", eyebrow: "EARTH\u2013MOON SYSTEM \xB7 ORBITAL LAB", tagline: "Shape an orbit with gravity.", icon: "orbit", accent: "#55a8ff", asset: "/assets/experiments/satellite-orbit/sprites/earth.png", startRoute: "/experiments/satellite-orbit", variant: "space", liveTitle: "Orbital speed", liveValue: "7.67 km/s", concepts: [C("Universal Gravitation", "Every pair of masses attracts.", "orbit"), C("Gravitational Field", "Map force per unit mass.", "field"), C("Orbits", "Continuous free fall around a body.", "moon"), C("Satellites", "Use speed and altitude to shape a path.", "rocket"), C("Escape Velocity", "Find the speed needed to leave gravity.", "rocket"), C("Kepler\u2019s Laws", "Connect orbital period, shape and radius.", "chart")], activities: [A("Orbit Designer", "Set altitude, inclination and eccentricity.", "Update orbit"), A("Mission Presets", "Try communications, observation and lunar transfer.", "Choose mission"), A("Trajectory Prediction", "Predict orbit, impact or escape.", "Start studio")] },
  { id: "oscillations", name: "Oscillations Studio", eyebrow: "MOTION \xB7 PATTERN \xB7 UNDERSTANDING", tagline: "Tune rhythm, resonance and phase.", icon: "pendulum", accent: "#ba7cff", asset: "/assets/experiments/simple-pendulum/pendulum-stand.png", startRoute: "/experiments/simple-pendulum", variant: "bench", liveTitle: "Natural frequency", liveValue: "1.24 Hz", concepts: [C("Simple Harmonic Motion", "Periodic motion with restoring force.", "wave"), C("Pendulums", "Gravitational oscillators.", "pendulum"), C("Springs", "Elastic restoring force.", "spring"), C("Damping", "Energy dissipation.", "wave"), C("Resonance", "Driven systems and large response.", "spark"), C("Coupled Oscillators", "Normal modes and energy transfer.", "pendulum")], activities: [A("Oscillator Selector", "Compare mass\u2013spring, pendulum and coupled systems.", "Select system"), A("Resonance Challenge", "Find the driving frequency with largest amplitude.", "Try a frequency"), A("Phase Portrait", "Relate displacement and velocity in one view.", "Tune frequency")] },
  { id: "waves-sound", name: "Waves & Sound Studio", eyebrow: "DIFFERENT SOURCES \xB7 SAME PHYSICS", tagline: "Watch energy travel without matter.", icon: "wave", accent: "#27e6cd", asset: "/assets/experiments/wave-lab/ripple-tank.png", startRoute: "/experiments/wave-lab", variant: "field", liveTitle: "Wave speed", liveValue: "2.40 m/s", concepts: [C("Wave Properties", "Amplitude, wavelength, frequency and speed.", "wave"), C("Superposition", "Combine waves and add their effects.", "field"), C("Interference", "Constructive and destructive patterns.", "spark"), C("Standing Waves", "Nodes, antinodes and resonance.", "wave"), C("Sound", "From vibrations to what you hear.", "volume"), C("Doppler Effect", "Motion changes observed frequency.", "rocket")], activities: [A("Wave Builder", "Create a wave and change its properties.", "Play wave"), A("Frequency Lab", "Adjust frequency and explore wavelength.", "Open lab"), A("Interference Challenge", "Place sources to match a target pattern.", "Start challenge")] },
  { id: "optics", name: "Optics Studio", eyebrow: "LASER \xB7 MIRROR \xB7 APERTURE \xB7 LENS \xB7 PRISM", tagline: "Build light paths you can see.", icon: "prism", accent: "#ffcf55", asset: "/assets/experiments/glass-slab-refraction/optical-bench.png", startRoute: "/experiments/glass-slab-refraction", variant: "bench", liveTitle: "Wavelength", liveValue: "450 nm", concepts: [C("Reflection", "Trace reflected rays from mirrors.", "eye"), C("Refraction", "Bend light across boundaries.", "prism"), C("Lenses", "Construct real and virtual images.", "eye"), C("Mirrors", "Predict image position with rays.", "eye"), C("Interference", "Build bright and dark fringes.", "wave"), C("Diffraction", "Spread light through small openings.", "wave")], activities: [A("Predict the Rays", "Place components, predict the path, then check.", "Try activity"), A("Build Your Own", "Add optical components to the bench.", "Open builder"), A("Spectrum Explorer", "Investigate how different elements spread light.", "Explore spectrum")] },
  { id: "electricity", name: "Electricity Studio", eyebrow: "CHARGE FLOW VISUALIZATION \xB7 REAL COMPONENTS", tagline: "Build circuits. See charge move.", icon: "battery", accent: "#ffe355", asset: "/assets/experiments/kirchhoff-circuit/breadboard.png", startRoute: "/experiments/kirchhoff-circuit", variant: "bench", liveTitle: "Circuit current", liveValue: "0.32 A", concepts: [C("Charge", "Positive and negative charge in motion.", "spark"), C("Electric Field", "Forces distributed through space.", "field"), C("Potential", "Energy transferred per unit charge.", "battery"), C("Current", "Rate of charge flow.", "gauge"), C("Resistance", "Opposition to current.", "settings"), C("Circuits", "Complete electrical systems.", "battery")], activities: [A("Circuit Builder", "Drag components, connect them and explore.", "Build circuit"), A("Live Meters", "Measure voltage, current, resistance and power.", "Take readings"), A("Find the Fault", "Repair the circuit so the lamp turns on.", "Check solution")] },
  { id: "magnetism", name: "Magnetism Studio", eyebrow: "MAGNETIC FIELD VISUALIZER", tagline: "Reveal invisible fields.", icon: "magnet", accent: "#ff668c", asset: "/assets/experiments/magnetic-field-current/field-mapping-bench.png", startRoute: "/experiments/magnetic-field-current", variant: "field", liveTitle: "Field strength", liveValue: "3.6 mT", concepts: [C("Magnetic Fields", "Map direction with compass probes.", "field"), C("Force on Charge", "Predict charged-particle paths.", "spark"), C("Current & Field", "Connect current direction and field.", "gauge"), C("Solenoids", "Create a controlled field with a coil.", "magnet"), C("Induction", "Generate emf by changing flux.", "spark"), C("Electromagnets", "Tune turns, current and core.", "magnet")], activities: [A("Trace the Particle Path", "Predict a charged particle\u2019s trajectory.", "Start activity"), A("Induction Lab", "Change magnetic flux and observe induced current.", "Start activity"), A("Magnet Configuration", "Compare bar magnets, loops and solenoids.", "Choose setup")] },
  { id: "electronics", name: "Electronics Studio", eyebrow: "6 TOPICS \xB7 28 PROJECTS \xB7 INTERACTIVE LAB", tagline: "Turn signals into working systems.", icon: "spark", accent: "#54e8ff", asset: "/assets/experiments/logic-gates/gate-modules.png", startRoute: "/experiments/logic-gates", variant: "bench", liveTitle: "Output signal", liveValue: "3.30 V", concepts: [C("Semiconductors", "Materials engineered into devices.", "atom"), C("Diodes", "Control current direction.", "spark"), C("Transistors", "Switch and amplify signals.", "settings"), C("Amplifiers", "Make small signals useful.", "volume"), C("Logic Gates", "Build decisions with digital logic.", "check"), C("Sensors", "Connect circuits to the real world.", "gauge")], activities: [A("Featured Project", "Build an adjustable LED driver.", "Open project"), A("Waveform Preview", "Compare analog and digital signals.", "Open scope"), A("Debug Challenge", "Find why the LED does not turn on.", "Start challenge")] },
  { id: "thermodynamics", name: "Thermodynamics Studio", eyebrow: "HEAT \xB7 WORK \xB7 MOLECULAR MOTION", tagline: "Follow heat, work and molecular motion.", icon: "thermometer", accent: "#ff8b57", asset: "/assets/experiments/gas-laws/gas-laws-apparatus.png", startRoute: "/experiments/gas-laws", variant: "matter", liveTitle: "Gas pressure", liveValue: "2.4 bar", concepts: [C("Temperature", "Thermal equilibrium and measurement.", "thermometer"), C("Heat Transfer", "Conduction, convection and radiation.", "flame"), C("Gas Laws", "Pressure\u2013volume\u2013temperature relationships.", "gauge"), C("First Law", "Energy balance in thermal systems.", "calculator"), C("Entropy", "Disorder and spontaneity.", "atom"), C("Heat Engines", "Cycles and efficiency.", "settings")], activities: [A("Build a Heat Engine", "Set conditions, run a cycle and analyze efficiency.", "Start studio"), A("Process Path Explorer", "Compare isothermal and adiabatic changes.", "Choose process"), A("Efficiency Challenge", "Find the highest possible efficiency.", "Check answer")] },
  { id: "fluid-mechanics", name: "Fluid Mechanics Studio", eyebrow: "FLOW IN ACTION \xB7 VENTURI \xB7 HYDRAULICS", tagline: "See pressure become motion.", icon: "drop", accent: "#42d9f5", asset: "/assets/experiments/bernoulli-fluid-flow/venturi-bench.png", startRoute: "/experiments/bernoulli-fluid-flow", variant: "field", liveTitle: "Throat pressure", liveValue: "18.2 kPa", concepts: [C("Density", "Mass per unit volume.", "drop"), C("Pressure", "Force per unit area.", "gauge"), C("Buoyancy", "Upward force from displaced fluid.", "drop"), C("Continuity", "Conservation of flow.", "wave"), C("Bernoulli", "Exchange pressure and speed.", "chart"), C("Viscosity", "Internal resistance to flow.", "drop")], activities: [A("Build a Flow System", "Create and customize a pipe system.", "Open builder"), A("Visualize Streamlines", "Reveal velocity, pressure and flow patterns.", "Open visualizer"), A("Predict Pressure", "Estimate pressure at any point.", "Predict")] },
  { id: "modern-physics", name: "Modern Physics Studio", eyebrow: "FROM QUANTA TO THE COSMOS", tagline: "Enter the quantum and nuclear world.", icon: "atom", accent: "#b981ff", asset: "/assets/experiments/photoelectric-equation/photoelectric-tube.png", startRoute: "/experiments/photoelectric-equation", variant: "matter", liveTitle: "Detector counts", liveValue: "4827 cpm", concepts: [C("Quantum Ideas", "Light, matter and probability.", "wave"), C("Photoelectric Effect", "Light ejects electrons.", "spark"), C("Matter Waves", "Particles behave as waves.", "wave"), C("Atomic Models", "Quantized structure of the atom.", "atom"), C("Nuclei", "Protons, neutrons and nuclear forces.", "flame"), C("Radioactivity", "Unstable nuclei and decay.", "chart")], activities: [A("Featured Experiments", "Vary light frequency and measure stopping potential.", "Run experiment"), A("Quantum Timeline", "Connect six discoveries to new models.", "Explore timeline"), A("Detector Panel", "Separate signal, background and uncertainty.", "Analyze counts")] },
  { id: "astronomy-astrophysics", name: "Astronomy & Astrophysics", eyebrow: "OBSERVATION TARGET \xB7 M31 ANDROMEDA", tagline: "Explore the universe through light and gravity.", icon: "orbit", accent: "#7ea4ff", asset: "/assets/concept-studio/astronomy-observatory-hero.png", startRoute: "/astrophysics", variant: "space", liveTitle: "Target distance", liveValue: "2.54 Mly", concepts: [C("Solar System", "Planets, moons and small bodies.", "sun"), C("Stars", "Birth, life and death.", "spark"), C("Spectra", "Read light, composition and motion.", "prism"), C("Galaxies", "Structure, evolution and mergers.", "orbit"), C("Cosmology", "Origin, expansion and dark universe.", "rocket"), C("Exoplanets", "Worlds, detection and habitability.", "moon")], activities: [A("Exoplanet Transit Explorer", "Analyze real light curves and planet properties.", "Launch"), A("Continue Learning", "Resume stellar evolution and spectral classification.", "Continue"), A("Cosmic-Scale Journey", "Travel from Earth to the observable universe.", "Begin journey")] }
];
var targetHeroAssets = {
  measurement: "/assets/concept-studio/measurement-hero.png",
  mechanics: "/assets/concept-studio/mechanics-hero.png",
  "motion-kinematics": "/assets/concept-studio/motion-kinematics-hero.png",
  "force-newton": "/assets/concept-studio/force-newton-hero.png",
  "work-energy-power": "/assets/concept-studio/work-energy-power-hero.png",
  gravitation: "/assets/concept-studio/gravitation-hero.png",
  oscillations: "/assets/concept-studio/oscillations-hero.png",
  "waves-sound": "/assets/concept-studio/waves-sound-hero.png",
  optics: "/assets/concept-studio/optics-hero.png",
  electricity: "/assets/concept-studio/electricity-hero.png",
  magnetism: "/assets/concept-studio/magnetism-hero.png",
  electronics: "/assets/concept-studio/electronics-hero.png",
  thermodynamics: "/assets/concept-studio/thermodynamics-hero.png",
  "fluid-mechanics": "/assets/concept-studio/fluid-mechanics-hero.png",
  "modern-physics": "/assets/concept-studio/modern-physics-hero.png",
  "astronomy-astrophysics": "/assets/concept-studio/astronomy-observatory-hero.png"
};
studioHomes.forEach((studio) => {
  studio.asset = targetHeroAssets[studio.id] ?? studio.asset;
});
var studioHomeById = new Map(studioHomes.map((studio) => [studio.id, studio]));

// src/lib/particlePhysics.ts
var particlePhysicsConcepts = [
  {
    id: "standard-model",
    title: "Standard Model",
    category: "Framework",
    visual: "standard-model",
    summary: "The organizing map of known elementary particles and their non-gravity interactions.",
    explanation: "The Standard Model groups matter particles into quarks and leptons, and explains electromagnetic, weak, and strong interactions using force-carrying bosons. It is extremely successful, but it does not include gravity, dark matter, or a complete explanation of neutrino masses.",
    keyIdeas: ["quarks", "leptons", "gauge bosons", "Higgs sector"],
    misconception: "It is not a model of atoms only; it is a quantum field theory of elementary particles.",
    classroomPrompt: "Ask students to classify a proton, electron, photon, and Higgs boson on the same map."
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
    classroomPrompt: "Compare a vibrating string mode with a field excitation, then discuss what the analogy misses."
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
    classroomPrompt: "Ask why the photon is massless while W and Z bosons are massive."
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
    classroomPrompt: "Have learners explain why a short-lived particle can still be detected."
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
    classroomPrompt: "Build proton and neutron charge totals from up and down quark charges."
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
    classroomPrompt: "Sort electron, photon, proton, and neutrino by which forces affect them."
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
    classroomPrompt: "Contrast electric charge with color charge using what the force carrier can carry."
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
    classroomPrompt: "Match each interaction with its carrier and one everyday or lab-scale effect."
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
    classroomPrompt: "Use solar neutrinos to discuss why missing particles can reveal new physics."
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
    classroomPrompt: "Ask learners to predict what must be conserved in electron-positron annihilation."
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
    classroomPrompt: "Use a pencil balanced on its tip as an analogy, then name where the analogy fails."
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
    classroomPrompt: "Explain why collider events show particle jets rather than free quarks."
  }
];
var particlePhysicsCategories = Array.from(new Set(particlePhysicsConcepts.map((concept) => concept.category))).sort();
var particlePhysicsStats = {
  concepts: particlePhysicsConcepts.length,
  categories: particlePhysicsCategories.length,
  misconceptionChecks: particlePhysicsConcepts.length,
  prompts: particlePhysicsConcepts.length
};

// src/data/rocketParts/catalog.generated.ts
var rocketPartSeed = [
  {
    "number": 1,
    "name": "Payload Fairing",
    "purpose": "Protects the spacecraft or payload from aerodynamic pressure, heating, weather, contamination, and acoustic loads during atmospheric ascent.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 2,
    "name": "Fairing Half or Fairing Shell",
    "purpose": "One side of the separable aerodynamic enclosure surrounding the payload.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 3,
    "name": "Fairing Separation Joint",
    "purpose": "Releases the fairing sections after the vehicle reaches a suitable altitude.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 4,
    "name": "Payload",
    "purpose": "The satellite, spacecraft, scientific instrument, cargo, crew vehicle, or technology demonstrator carried by the rocket.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 5,
    "name": "Payload Adapter",
    "purpose": "Mechanically connects the payload to the launch vehicle.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 6,
    "name": "Payload Attach Fitting",
    "purpose": "Transfers structural loads between the payload and launch vehicle.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 7,
    "name": "Payload Separation System",
    "purpose": "Releases and deploys the payload after orbital or mission conditions are achieved.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 8,
    "name": "Payload Deployment Mechanism",
    "purpose": "Uses springs, actuators, clamps, or other devices to move the payload safely away from the stage.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 9,
    "name": "Payload Electrical Interface",
    "purpose": "Provides power, monitoring, commands, and data connections before deployment.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 10,
    "name": "Payload Environmental-Control Interface",
    "purpose": "Supports conditioned air, purge gas, temperature control, or contamination control before launch.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 11,
    "name": "Spacecraft Adapter",
    "purpose": "Provides the structural and electrical transition between the upper stage and spacecraft.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 12,
    "name": "Secondary Payload Dispenser",
    "purpose": "Carries and deploys smaller secondary satellites.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 13,
    "name": "CubeSat Deployer",
    "purpose": "Safely contains and ejects CubeSats after reaching the required deployment condition.",
    "notes": "",
    "system": "Payload System"
  },
  {
    "number": 14,
    "name": "Launch Escape or Abort System",
    "purpose": "Rapidly separates the crew module from a failing launch vehicle during an emergency.",
    "notes": "Configuration-dependent, crewed missions only.",
    "system": "Payload System"
  },
  {
    "number": 15,
    "name": "Crew Module Interface",
    "purpose": "Connects a crewed spacecraft to the launch vehicle and carries structural, electrical, communication, and environmental interfaces.",
    "notes": "Configuration-dependent.",
    "system": "Payload System"
  },
  {
    "number": 16,
    "name": "Nose Cone",
    "purpose": "Provides a low-drag aerodynamic forward shape on rockets without a conventional payload fairing.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 17,
    "name": "Forward Skirt",
    "purpose": "Supports upper vehicle interfaces and transfers loads into the tank or stage structure.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 18,
    "name": "Airframe or Rocket Body",
    "purpose": "Forms the primary external structure and carries aerodynamic and inertial loads.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 19,
    "name": "Cylindrical Barrel Section",
    "purpose": "Forms the main load-bearing cylindrical shell of a stage.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 20,
    "name": "Structural Ring Frame",
    "purpose": "Reinforces the airframe and prevents local shell deformation.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 21,
    "name": "Stringer",
    "purpose": "Provides longitudinal reinforcement to thin airframe shells.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 22,
    "name": "Bulkhead",
    "purpose": "Separates compartments and transfers structural or pressure loads.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 23,
    "name": "Tank Dome",
    "purpose": "Closes the end of a propellant tank while efficiently carrying pressure loads.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 24,
    "name": "Common Bulkhead",
    "purpose": "Separates fuel and oxidizer tanks while reducing stage mass and length.",
    "notes": "Configuration-dependent.",
    "system": "Structural System"
  },
  {
    "number": 25,
    "name": "Intertank",
    "purpose": "Structural section between major propellant tanks that can carry equipment and transfer loads.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 26,
    "name": "Equipment Bay",
    "purpose": "Houses avionics, batteries, computers, communication equipment, and environmental-control hardware.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 27,
    "name": "Thrust Structure",
    "purpose": "Transfers engine thrust into the rocket airframe.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 28,
    "name": "Engine Section",
    "purpose": "Houses engines, plumbing, actuators, structural mounts, and thermal protection.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 29,
    "name": "Aft Skirt",
    "purpose": "Supports engines, fins, hold-down interfaces, and lower-stage equipment.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 30,
    "name": "Interstage",
    "purpose": "Connects two stages and encloses stage-separation hardware or upper-stage engines.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 31,
    "name": "Stage Adapter",
    "purpose": "Connects stages or vehicle elements of different diameters or structural interfaces.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 32,
    "name": "Access Panel",
    "purpose": "Allows technicians to inspect and service internal equipment.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 33,
    "name": "Service Door",
    "purpose": "Provides controlled access to internal systems during integration and testing.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 34,
    "name": "Cable Tunnel",
    "purpose": "Routes electrical harnesses or fluid lines along the vehicle.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 35,
    "name": "External Systems Tunnel",
    "purpose": "Protects plumbing, wiring, and instrumentation routed outside the primary tanks.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 36,
    "name": "Lifting Lug",
    "purpose": "Provides certified attachment points for lifting and handling operations.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 37,
    "name": "Transportation Support Interface",
    "purpose": "Connects the stage to transport and ground-handling equipment.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 38,
    "name": "Hold-Down Fitting",
    "purpose": "Secures the rocket to the launch platform before release.",
    "notes": "",
    "system": "Structural System"
  },
  {
    "number": 39,
    "name": "Launch Lug or Rail Guide",
    "purpose": "Guides the rocket along the launch rail during the initial motion.",
    "notes": "Used mainly on smaller rockets.",
    "system": "Structural System"
  },
  {
    "number": 40,
    "name": "Fixed Fin",
    "purpose": "Provides passive aerodynamic stability during atmospheric flight.",
    "notes": "",
    "system": "Aerodynamic Control"
  },
  {
    "number": 41,
    "name": "Movable Fin",
    "purpose": "Changes aerodynamic forces to help control vehicle attitude.",
    "notes": "",
    "system": "Aerodynamic Control"
  },
  {
    "number": 42,
    "name": "Grid Fin",
    "purpose": "Produces controllable aerodynamic forces while remaining compact when folded.",
    "notes": "Configuration-dependent and commonly associated with guided descent or recovery.",
    "system": "Aerodynamic Control"
  },
  {
    "number": 43,
    "name": "Fin Root",
    "purpose": "Transfers fin loads into the airframe.",
    "notes": "",
    "system": "Aerodynamic Control"
  },
  {
    "number": 44,
    "name": "Fin Actuator",
    "purpose": "Rotates a movable fin according to flight-control commands.",
    "notes": "",
    "system": "Aerodynamic Control"
  },
  {
    "number": 45,
    "name": "Canard",
    "purpose": "Provides aerodynamic control from a forward position on the vehicle.",
    "notes": "Configuration-dependent.",
    "system": "Aerodynamic Control"
  },
  {
    "number": 46,
    "name": "Aerodynamic Strake",
    "purpose": "Modifies airflow and can improve stability or local aerodynamic performance.",
    "notes": "",
    "system": "Aerodynamic Control"
  },
  {
    "number": 47,
    "name": "Boat Tail",
    "purpose": "Smooths the aerodynamic transition between the body and smaller engine-base region.",
    "notes": "",
    "system": "Aerodynamic Control"
  },
  {
    "number": 48,
    "name": "Base Heat Shield",
    "purpose": "Protects the rear structure from engine plume radiation and aerodynamic heating.",
    "notes": "",
    "system": "Aerodynamic Control"
  },
  {
    "number": 49,
    "name": "Rocket Engine",
    "purpose": "Produces thrust by accelerating exhaust mass at high velocity.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 50,
    "name": "Combustion Chamber",
    "purpose": "Contains high-pressure combustion and converts propellant chemical energy into hot gas.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 51,
    "name": "Injector",
    "purpose": "Meters, atomizes, and mixes fuel and oxidizer inside the combustion chamber.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 52,
    "name": "Injector Face",
    "purpose": "Contains the injector elements through which propellants enter the chamber.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 53,
    "name": "Igniter",
    "purpose": "Initiates combustion during engine startup.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 54,
    "name": "Nozzle",
    "purpose": "Expands and accelerates combustion gases to produce thrust efficiently.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 55,
    "name": "Nozzle Throat",
    "purpose": "Restricts flow to establish choked conditions and control chamber mass flow.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 56,
    "name": "Nozzle Exit",
    "purpose": "Releases expanded exhaust gases from the engine.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 57,
    "name": "Nozzle Extension",
    "purpose": "Increases expansion ratio and vacuum efficiency.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 58,
    "name": "Regeneratively Cooled Chamber",
    "purpose": "Circulates propellant through cooling channels before injection to protect the chamber and recover heat.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 59,
    "name": "Cooling Channels",
    "purpose": "Remove heat from the chamber and nozzle walls.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 60,
    "name": "Engine Mount",
    "purpose": "Mechanically attaches the engine to the thrust structure.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 61,
    "name": "Gimbal Assembly",
    "purpose": "Allows the engine to pivot and redirect thrust for vehicle control.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 62,
    "name": "Thrust Vector Control Actuator",
    "purpose": "Moves the gimballed engine or nozzle in response to guidance commands.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 63,
    "name": "Turbopump",
    "purpose": "Raises propellant pressure and supplies high mass flow to the combustion chamber.",
    "notes": "Liquid engines only.",
    "system": "Propulsion System"
  },
  {
    "number": 64,
    "name": "Fuel Pump",
    "purpose": "Pressurizes and moves fuel toward the engine.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 65,
    "name": "Oxidizer Pump",
    "purpose": "Pressurizes and moves oxidizer toward the engine.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 66,
    "name": "Turbine",
    "purpose": "Converts working-fluid energy into mechanical power for the pumps.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 67,
    "name": "Turbopump Shaft",
    "purpose": "Transfers turbine rotation to the propellant pumps.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 68,
    "name": "Gas Generator",
    "purpose": "Produces hot gas to power the turbine.",
    "notes": "Cycle-dependent.",
    "system": "Propulsion System"
  },
  {
    "number": 69,
    "name": "Preburner",
    "purpose": "Partially burns propellant to drive turbomachinery before the flow reaches the main chamber.",
    "notes": "Cycle-dependent.",
    "system": "Propulsion System"
  },
  {
    "number": 70,
    "name": "Main Fuel Valve",
    "purpose": "Controls fuel flow into the engine.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 71,
    "name": "Main Oxidizer Valve",
    "purpose": "Controls oxidizer flow into the engine.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 72,
    "name": "Engine Controller",
    "purpose": "Executes startup, throttling, mixture-ratio control, monitoring, and shutdown logic.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 73,
    "name": "Engine Sensors",
    "purpose": "Measure pressures, temperatures, vibration, speed, valve state, and other health parameters.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 74,
    "name": "Engine Purge System",
    "purpose": "Uses an inert gas to remove hazardous mixtures or contaminants from engine cavities and lines.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 75,
    "name": "Solid Rocket Motor Case",
    "purpose": "Contains the solid propellant and combustion pressure.",
    "notes": "Solid propulsion only.",
    "system": "Propulsion System"
  },
  {
    "number": 76,
    "name": "Solid Propellant Grain",
    "purpose": "Provides the fuel and oxidizer mixture in a shaped solid charge.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 77,
    "name": "Grain Port",
    "purpose": "Defines the internal burning surface and influences the thrust-time profile.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 78,
    "name": "Solid Motor Igniter",
    "purpose": "Initiates combustion across the required propellant surface.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 79,
    "name": "Solid Motor Nozzle",
    "purpose": "Expands and accelerates combustion gases from the motor.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 80,
    "name": "Solid Motor Insulation",
    "purpose": "Protects the motor case from hot combustion gases.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 81,
    "name": "Hybrid Fuel Grain",
    "purpose": "Supplies solid fuel while a separately stored oxidizer flows through the grain port.",
    "notes": "Hybrid propulsion only.",
    "system": "Propulsion System"
  },
  {
    "number": 82,
    "name": "Hybrid Oxidizer Injector",
    "purpose": "Introduces oxidizer into the hybrid motor combustion region.",
    "notes": "",
    "system": "Propulsion System"
  },
  {
    "number": 83,
    "name": "Fuel Tank",
    "purpose": "Stores the engine fuel under required thermal and pressure conditions.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 84,
    "name": "Oxidizer Tank",
    "purpose": "Stores the oxidizing agent required for combustion.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 85,
    "name": "Cryogenic Tank",
    "purpose": "Stores very-low-temperature liquid propellants with insulation and pressure-management provisions.",
    "notes": "Configuration-dependent.",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 86,
    "name": "Tank Liner",
    "purpose": "Provides fluid containment or compatibility within a composite or multi-material tank.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 87,
    "name": "Tank Insulation",
    "purpose": "Reduces heat transfer, propellant boil-off, and external condensation or icing.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 88,
    "name": "Ullage Volume",
    "purpose": "Provides gas space above the liquid propellant for expansion and pressure management.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 89,
    "name": "Propellant Acquisition Device",
    "purpose": "Helps ensure usable liquid reaches the outlet under low-gravity or acceleration conditions.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 90,
    "name": "Anti-Vortex Device",
    "purpose": "Reduces vortex formation and gas ingestion near a tank outlet.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 91,
    "name": "Baffle",
    "purpose": "Reduces propellant slosh and associated changes in vehicle dynamics.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 92,
    "name": "Fuel Feed Line",
    "purpose": "Carries fuel from the tank to the propulsion system.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 93,
    "name": "Oxidizer Feed Line",
    "purpose": "Carries oxidizer from the tank to the propulsion system.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 94,
    "name": "Flexible Feed-Line Joint",
    "purpose": "Allows controlled movement caused by thermal contraction, vibration, or engine gimbaling.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 95,
    "name": "Propellant Isolation Valve",
    "purpose": "Isolates tanks or downstream systems during servicing, aborts, or shutdown.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 96,
    "name": "Check Valve",
    "purpose": "Prevents reverse flow.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 97,
    "name": "Pressure Regulator",
    "purpose": "Reduces and controls gas or fluid pressure.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 98,
    "name": "Relief Valve",
    "purpose": "Protects tanks and lines from excessive pressure.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 99,
    "name": "Burst Disk",
    "purpose": "Provides a one-time pressure-relief path at a designed threshold.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 100,
    "name": "Fill and Drain Valve",
    "purpose": "Supports propellant loading, unloading, and servicing.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 101,
    "name": "Vent Valve",
    "purpose": "Releases gas to control tank pressure.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 102,
    "name": "Tank Vent",
    "purpose": "Routes vented gas safely away from the vehicle.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 103,
    "name": "Pressurant Tank",
    "purpose": "Stores high-pressure gas used to maintain propellant-tank pressure.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 104,
    "name": "Helium Storage Vessel",
    "purpose": "Stores helium used for tank pressurization, purging, or pneumatic operation.",
    "notes": "Configuration-dependent.",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 105,
    "name": "Pressurization Line",
    "purpose": "Carries pressurant gas to a propellant tank.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 106,
    "name": "Autogenous Pressurization Heat Exchanger",
    "purpose": "Converts propellant into warm gas for tank pressurization.",
    "notes": "Configuration-dependent.",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 107,
    "name": "Propellant-Level Sensor",
    "purpose": "Measures or estimates remaining propellant.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 108,
    "name": "Tank Pressure Sensor",
    "purpose": "Monitors internal tank pressure.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 109,
    "name": "Temperature Sensor",
    "purpose": "Measures propellant, line, tank, or engine temperature.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 110,
    "name": "Slosh Sensor",
    "purpose": "Measures propellant movement within a tank.",
    "notes": "Advanced or experimental configuration.",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 111,
    "name": "Propellant Distribution Manifold",
    "purpose": "Distributes propellant or pressurant flow among multiple paths.",
    "notes": "",
    "system": "Propellant Storage & Feed"
  },
  {
    "number": 112,
    "name": "Flight Computer",
    "purpose": "Executes guidance, navigation, control, sequencing, monitoring, and mission logic.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 113,
    "name": "Redundant Flight Computer",
    "purpose": "Provides fault tolerance if the primary computing channel fails.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 114,
    "name": "Avionics Bay",
    "purpose": "Houses protected electronic equipment and associated interfaces.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 115,
    "name": "Data Bus",
    "purpose": "Transfers commands, measurements, and status information among avionics units.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 116,
    "name": "Wiring Harness",
    "purpose": "Routes electrical power, commands, and sensor signals.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 117,
    "name": "Connector",
    "purpose": "Provides removable electrical or data interfaces.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 118,
    "name": "Signal-Conditioning Unit",
    "purpose": "Filters, scales, isolates, or converts sensor signals before processing.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 119,
    "name": "Data Acquisition Unit",
    "purpose": "Collects and digitizes measurements from sensors.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 120,
    "name": "Remote Input/Output Unit",
    "purpose": "Connects distributed sensors and actuators to the main avionics system.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 121,
    "name": "Mission Sequencer",
    "purpose": "Triggers events such as engine ignition, release, staging, fairing separation, and payload deployment.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 122,
    "name": "Time Base",
    "purpose": "Provides synchronized mission timing for onboard events and telemetry.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 123,
    "name": "Health-Monitoring Computer",
    "purpose": "Detects abnormal conditions using sensor and subsystem data.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 124,
    "name": "Flight Software",
    "purpose": "Implements onboard control, sequencing, fault management, and mission logic.",
    "notes": "",
    "system": "Avionics"
  },
  {
    "number": 125,
    "name": "Inertial Measurement Unit",
    "purpose": "Measures angular motion and linear acceleration.",
    "abbreviation": "IMU",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 126,
    "name": "Gyroscope",
    "purpose": "Measures rotational motion or angular rate.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 127,
    "name": "Accelerometer",
    "purpose": "Measures specific force along one or more axes.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 128,
    "name": "Inertial Navigation System",
    "purpose": "Estimates position, velocity, and attitude using inertial measurements.",
    "abbreviation": "INS",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 129,
    "name": "GNSS or GPS Receiver",
    "purpose": "Provides satellite-based position, velocity, and timing when available.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 130,
    "name": "Navigation Computer",
    "purpose": "Combines measurements to estimate the vehicle state.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 131,
    "name": "Guidance Computer",
    "purpose": "Determines the desired trajectory and steering commands.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 132,
    "name": "Flight-Control Computer",
    "purpose": "Converts guidance commands into actuator commands while maintaining stability.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 133,
    "name": "Attitude-Control System",
    "purpose": "Controls vehicle orientation.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 134,
    "name": "Reaction-Control Thruster",
    "purpose": "Produces small forces or torques for attitude control outside dense atmosphere.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 135,
    "name": "Reaction-Control Propellant Tank",
    "purpose": "Stores propellant used by attitude-control thrusters.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 136,
    "name": "Star Tracker",
    "purpose": "Determines spacecraft orientation by observing star patterns.",
    "notes": "Mission-dependent.",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 137,
    "name": "Sun Sensor",
    "purpose": "Determines the direction of the Sun for attitude knowledge or safe-mode control.",
    "notes": "Mission-dependent.",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 138,
    "name": "Magnetometer",
    "purpose": "Measures the local magnetic field to support attitude determination.",
    "notes": "Mission-dependent.",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 139,
    "name": "Radar Altimeter",
    "purpose": "Measures altitude above a surface using radar.",
    "notes": "Configuration-dependent.",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 140,
    "name": "Control Allocation Module",
    "purpose": "Distributes control commands among engines, fins, or thrusters.",
    "notes": "",
    "system": "Guidance, Navigation & Control"
  },
  {
    "number": 141,
    "name": "Main Battery",
    "purpose": "Supplies electrical power to avionics, actuators, valves, sensors, and communication systems.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 142,
    "name": "Backup Battery",
    "purpose": "Provides emergency or redundant power.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 143,
    "name": "Battery Management System",
    "purpose": "Monitors battery voltage, current, temperature, and state of charge.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 144,
    "name": "Power Distribution Unit",
    "purpose": "Routes and protects electrical power circuits.",
    "abbreviation": "PDU",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 145,
    "name": "DC-DC Converter",
    "purpose": "Converts one direct-current voltage level into another.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 146,
    "name": "Inverter",
    "purpose": "Converts direct current to alternating current.",
    "notes": "Configuration-dependent.",
    "system": "Electrical Power"
  },
  {
    "number": 147,
    "name": "Circuit Protection Device",
    "purpose": "Protects wiring and equipment from excessive current or faults.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 148,
    "name": "Ground Power Connector",
    "purpose": "Supplies external power before launch.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 149,
    "name": "Umbilical Electrical Connector",
    "purpose": "Carries ground power, commands, and data until launch release.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 150,
    "name": "Pyrotechnic Initiator Circuit",
    "purpose": "Delivers controlled electrical energy to approved separation or deployment devices.",
    "notes": "",
    "system": "Electrical Power"
  },
  {
    "number": 151,
    "name": "Telemetry Transmitter",
    "purpose": "Sends vehicle measurements and status information to ground stations.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 152,
    "name": "Telemetry Encoder",
    "purpose": "Formats measurements into the required transmission data stream.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 153,
    "name": "Radio-Frequency Amplifier",
    "purpose": "Increases signal power before transmission.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 154,
    "name": "Telemetry Antenna",
    "purpose": "Radiates telemetry signals toward receiving stations.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 155,
    "name": "Command Receiver",
    "purpose": "Receives authorized ground commands.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 156,
    "name": "Tracking Transponder",
    "purpose": "Supports ground-based vehicle tracking and range operations.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 157,
    "name": "GPS Antenna",
    "purpose": "Receives satellite-navigation signals.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 158,
    "name": "Communication Antenna",
    "purpose": "Supports command, telemetry, tracking, or payload communications.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 159,
    "name": "Onboard Data Recorder",
    "purpose": "Stores flight data for later recovery and analysis.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 160,
    "name": "Camera System",
    "purpose": "Records internal or external mission events.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 161,
    "name": "Video Transmitter",
    "purpose": "Sends live onboard video to the ground.",
    "notes": "",
    "system": "Communications & Telemetry"
  },
  {
    "number": 162,
    "name": "Flight Termination System",
    "purpose": "Provides an independent safety capability for preventing an errant launch vehicle from threatening protected areas.",
    "abbreviation": "FTS",
    "notes": "Do not provide procedural instructions for constructing or activating destructive hardware.",
    "system": "Flight Safety"
  },
  {
    "number": 163,
    "name": "Autonomous Flight Safety System",
    "purpose": "Evaluates flight data and approved safety rules onboard to support range-safety decisions.",
    "abbreviation": "AFSS",
    "notes": "",
    "system": "Flight Safety"
  },
  {
    "number": 164,
    "name": "Flight-Safety Computer",
    "purpose": "Processes independent navigation and vehicle-health information for safety monitoring.",
    "notes": "",
    "system": "Flight Safety"
  },
  {
    "number": 165,
    "name": "Independent Tracking Receiver",
    "purpose": "Supplies flight-safety position or tracking information.",
    "notes": "",
    "system": "Flight Safety"
  },
  {
    "number": 166,
    "name": "FTS Antenna",
    "purpose": "Receives authorized range-safety commands where a command-based system is used.",
    "notes": "",
    "system": "Flight Safety"
  },
  {
    "number": 167,
    "name": "Safe-and-Arm Device",
    "purpose": "Prevents inadvertent activation until the approved flight state.",
    "notes": "",
    "system": "Flight Safety"
  },
  {
    "number": 168,
    "name": "Range-Safety Battery",
    "purpose": "Supplies isolated power to the flight-safety system.",
    "notes": "",
    "system": "Flight Safety"
  },
  {
    "number": 169,
    "name": "Range Tracking Beacon",
    "purpose": "Helps range systems identify and track the vehicle.",
    "notes": "",
    "system": "Flight Safety"
  },
  {
    "number": 170,
    "name": "Destruct-System Hardware",
    "purpose": "Represents controlled flight-termination hardware used in some launch vehicles.",
    "notes": "Display only at high-level conceptual level. Do not show construction diagrams, material quantities, activation sequences, or detailed implementation instructions.",
    "system": "Flight Safety"
  },
  {
    "number": 171,
    "name": "Stage-Separation Plane",
    "purpose": "Defines the structural interface where two vehicle stages separate.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 172,
    "name": "Separation Ring",
    "purpose": "Joins two stages and transfers flight loads before separation.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 173,
    "name": "Separation Bolt",
    "purpose": "Holds structures together until a commanded release.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 174,
    "name": "Frangible Joint",
    "purpose": "Provides a controlled structural separation line.",
    "notes": "Configuration-dependent.",
    "system": "Stage Separation"
  },
  {
    "number": 175,
    "name": "Clamp Band",
    "purpose": "Secures a payload or stage interface until release.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 176,
    "name": "Pneumatic Separation System",
    "purpose": "Uses stored gas pressure to release or push vehicle elements apart.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 177,
    "name": "Spring Ejector",
    "purpose": "Provides controlled separation velocity.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 178,
    "name": "Separation Motor",
    "purpose": "Produces a short impulse to move stages apart.",
    "notes": "Configuration-dependent.",
    "system": "Stage Separation"
  },
  {
    "number": 179,
    "name": "Ullage Motor",
    "purpose": "Provides acceleration to settle propellant before an upper-stage engine start.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 180,
    "name": "Retro Motor",
    "purpose": "Produces thrust that helps move a spent stage away.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 181,
    "name": "Pyrotechnic Initiator",
    "purpose": "Triggers an approved separation or deployment device.",
    "notes": "Keep the explanation high-level and non-constructional.",
    "system": "Stage Separation"
  },
  {
    "number": 182,
    "name": "Separation Sensor",
    "purpose": "Confirms that separation has occurred.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 183,
    "name": "Deployment Switch",
    "purpose": "Confirms movement or release of a deployable component.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 184,
    "name": "Interstage Vent",
    "purpose": "Prevents damaging pressure accumulation inside an interstage.",
    "notes": "",
    "system": "Stage Separation"
  },
  {
    "number": 185,
    "name": "Thermal Protection System",
    "purpose": "Protects structures and equipment from aerodynamic, radiant, conductive, or plume heating.",
    "abbreviation": "TPS",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 186,
    "name": "External Foam Insulation",
    "purpose": "Reduces heat transfer into cryogenic propellants.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 187,
    "name": "Thermal Blanket",
    "purpose": "Limits heat exchange between equipment and its environment.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 188,
    "name": "Heat Shield",
    "purpose": "Protects sensitive structures from high thermal loads.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 189,
    "name": "Engine Heat Shield",
    "purpose": "Protects nearby equipment from engine-generated heat.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 190,
    "name": "Fire Barrier",
    "purpose": "Limits the spread of heat, flame, or hot gases between compartments.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 191,
    "name": "Purge Line",
    "purpose": "Supplies clean or inert gas to protected spaces.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 192,
    "name": "Environmental-Control Duct",
    "purpose": "Delivers conditioned air or gas before launch.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 193,
    "name": "Moisture Barrier",
    "purpose": "Protects hardware from condensation or environmental exposure.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 194,
    "name": "Acoustic Protection",
    "purpose": "Reduces damaging acoustic energy reaching sensitive payloads or equipment.",
    "notes": "",
    "system": "Thermal Protection"
  },
  {
    "number": 195,
    "name": "Recovery Computer",
    "purpose": "Determines and commands recovery-event timing.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 196,
    "name": "Drogue Parachute",
    "purpose": "Stabilizes and slows the descending vehicle before main-parachute deployment.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 197,
    "name": "Main Parachute",
    "purpose": "Provides the principal reduction in descent velocity.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 198,
    "name": "Pilot Chute",
    "purpose": "Extracts or initiates deployment of a larger parachute.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 199,
    "name": "Parachute Canopy",
    "purpose": "Produces aerodynamic drag during descent.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 200,
    "name": "Suspension Lines",
    "purpose": "Transfer parachute loads to the vehicle.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 201,
    "name": "Parachute Mortar",
    "purpose": "Deploys a parachute package in applicable recovery systems.",
    "notes": "Display only conceptually. Do not provide energetic-device construction instructions.",
    "system": "Recovery System"
  },
  {
    "number": 202,
    "name": "Parachute Compartment",
    "purpose": "Stores and protects the packed recovery system.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 203,
    "name": "Deployment Bag",
    "purpose": "Controls the order and rate of parachute deployment.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 204,
    "name": "Reefing System",
    "purpose": "Temporarily limits parachute opening to reduce deployment loads.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 205,
    "name": "Landing Leg",
    "purpose": "Supports the vehicle during vertical landing.",
    "notes": "Reusable configuration only.",
    "system": "Recovery System"
  },
  {
    "number": 206,
    "name": "Landing-Leg Actuator",
    "purpose": "Deploys and locks a landing leg.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 207,
    "name": "Crushable Landing Structure",
    "purpose": "Absorbs impact energy during landing.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 208,
    "name": "Flotation Device",
    "purpose": "Keeps recovered hardware afloat.",
    "notes": "Water-recovery configuration.",
    "system": "Recovery System"
  },
  {
    "number": 209,
    "name": "Recovery Beacon",
    "purpose": "Helps recovery teams locate returned hardware.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 210,
    "name": "Recovery GPS Unit",
    "purpose": "Reports the location of recovered hardware.",
    "notes": "",
    "system": "Recovery System"
  },
  {
    "number": 211,
    "name": "Launch Mount",
    "purpose": "Supports the rocket before liftoff.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 212,
    "name": "Launch Platform",
    "purpose": "Carries the vehicle and associated ground-service equipment.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 213,
    "name": "Hold-Down Clamp",
    "purpose": "Restrains the rocket until approved release.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 214,
    "name": "Tail-Service Mast",
    "purpose": "Routes propellants, gases, power, and data to the lower vehicle.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 215,
    "name": "Umbilical",
    "purpose": "Connects the vehicle to ground power, communications, fluids, or environmental services.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 216,
    "name": "Umbilical Disconnect",
    "purpose": "Releases ground connections during the launch sequence.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 217,
    "name": "Quick-Disconnect Coupling",
    "purpose": "Allows a service line to disconnect rapidly while limiting leakage.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 218,
    "name": "Propellant Fill Connection",
    "purpose": "Connects ground propellant-loading equipment to the vehicle.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 219,
    "name": "Drain Connection",
    "purpose": "Supports controlled removal of vehicle fluids.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 220,
    "name": "Ground Purge Connection",
    "purpose": "Supplies purge gas from ground equipment.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 221,
    "name": "Strongback or Transporter-Erector",
    "purpose": "Supports, transports, raises, or stabilizes the vehicle.",
    "notes": "Configuration-dependent.",
    "system": "Ground Interface"
  },
  {
    "number": 222,
    "name": "Launch Rail",
    "purpose": "Guides the rocket during the earliest portion of flight.",
    "notes": "Small-rocket configuration.",
    "system": "Ground Interface"
  },
  {
    "number": 223,
    "name": "Flame Deflector",
    "purpose": "Redirects engine exhaust away from the vehicle and launch structure.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 224,
    "name": "Water-Suppression Interface",
    "purpose": "Supports water systems used to manage acoustic energy and heat at the pad.",
    "notes": "",
    "system": "Ground Interface"
  },
  {
    "number": 225,
    "name": "Lightning Protection Interface",
    "purpose": "Helps protect the vehicle and pad systems from lightning hazards.",
    "notes": "",
    "system": "Ground Interface"
  }
];

// src/data/rocketParts/index.ts
var slugify2 = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
var systemFolder = {
  "Payload System": "payload",
  "Structural System": "structures",
  "Aerodynamic Control": "aero-control",
  "Propulsion System": "propulsion",
  "Propellant Storage & Feed": "propellant-feed",
  Avionics: "avionics",
  "Guidance, Navigation & Control": "gnc",
  "Electrical Power": "electrical",
  "Communications & Telemetry": "telemetry",
  "Flight Safety": "flight-safety",
  "Stage Separation": "staging",
  "Thermal Protection": "thermal",
  "Recovery System": "recovery",
  "Ground Interface": "ground-interface"
};
var knownImage = {
  "payload-fairing": "/pro-lab/vehicle-cutaway.png",
  "rocket-engine": "/pro-lab/powered-ascent.png",
  "fuel-tank": "/pro-lab/propellant-loading.png",
  "flight-computer": "/pro-lab/avionics-checkout.png",
  "launch-platform": "/pro-lab/launch-pad.png"
};
var externalWords = /fairing|nose cone|airframe|fin|canard|strake|boat tail|antenna|heat shield|foam|blanket|parachute|landing leg|beacon|camera|launch rail|flame deflector|strongback|lightning/i;
var interfaceWords = /adapter|fitting|joint|mount|interface|connector|disconnect|coupling|connection|umbilical|separation plane|hold-down/i;
var deployWords = /separation|deployment|deploy|parachute|landing leg|grid fin|fairing|abort|ejector/i;
var advancedWords = /turbopump|preburner|autogenous|flight termination|destruct|star tracker|inertial navigation|control allocation|frangible|pyrotechnic|reefing/i;
var buildWords = /payload|adapter|airframe|tank|engine$|rocket engine|nozzle$|flight computer|imu|battery|power distribution|telemetry transmitter|antenna|fin$|parachute|recovery computer|stage adapter|separation ring/i;
var stageFor = (system, name) => {
  if (/payload|fairing|crew|spacecraft|cube/i.test(name) || system === "Payload System") return ["Payload section", "Upper stage"];
  if (system === "Ground Interface") return ["Launch complex"];
  if (system === "Recovery System") return ["Recovery module", "Reusable stage"];
  if (/engine|aft|thrust|nozzle|feed|pump|propellant|tank/i.test(name)) return ["Core stage", "Engine section"];
  if (system === "Stage Separation") return ["Interstage", "Upper stage"];
  return ["Core stage", "Equipment bay"];
};
var ioFor = (name, system) => {
  if (/sensor|imu|gyroscope|accelerometer|receiver|camera/i.test(name)) return [["Physical measurement", "Electrical power"], ["Conditioned measurement data"]];
  if (/computer|controller|sequencer|software/i.test(name)) return [["Sensor data", "Mission commands", "Electrical power"], ["Control commands", "Health status"]];
  if (/tank|vessel/i.test(name)) return [["Servicing flow", "Pressurant"], ["Stored working fluid", "Pressure telemetry"]];
  if (/valve|line|manifold|pump|injector/i.test(name)) return [["Upstream fluid", "Command or shaft work"], ["Conditioned downstream flow", "Health telemetry"]];
  if (/engine|chamber|motor|nozzle/i.test(name)) return [["Propellant flow", "Ignition and control commands"], ["Thrust", "Thermal and pressure telemetry"]];
  if (system === "Electrical Power") return [["Stored or ground electrical energy"], ["Protected regulated power"]];
  if (system === "Communications & Telemetry") return [["Flight data", "Electrical power"], ["Encoded radio-frequency signal"]];
  return [["Mechanical loads", "Commands or services as configured"], ["Transferred load", "Component status"]];
};
var connectionsByName = {
  "Fuel Tank": ["Fuel Feed Line", "Propellant Isolation Valve"],
  "Oxidizer Tank": ["Oxidizer Feed Line", "Propellant Isolation Valve"],
  "Fuel Feed Line": ["Fuel Tank", "Fuel Pump"],
  "Fuel Pump": ["Fuel Feed Line", "Injector"],
  "Oxidizer Feed Line": ["Oxidizer Tank", "Oxidizer Pump"],
  "Oxidizer Pump": ["Oxidizer Feed Line", "Injector"],
  Injector: ["Fuel Pump", "Oxidizer Pump", "Combustion Chamber"],
  "Combustion Chamber": ["Injector", "Nozzle"],
  "Inertial Measurement Unit": ["Navigation Computer"],
  "GNSS or GPS Receiver": ["Navigation Computer"],
  "Navigation Computer": ["Inertial Measurement Unit", "GNSS or GPS Receiver", "Guidance Computer"],
  "Guidance Computer": ["Navigation Computer", "Flight-Control Computer"],
  "Flight-Control Computer": ["Guidance Computer", "Thrust Vector Control Actuator"],
  "Thrust Vector Control Actuator": ["Flight-Control Computer", "Gimbal Assembly"],
  "Main Battery": ["Power Distribution Unit"],
  "Power Distribution Unit": ["Main Battery", "Flight Computer"],
  "Flight Computer": ["Power Distribution Unit", "Data Bus", "Telemetry Transmitter"],
  "Data Acquisition Unit": ["Signal-Conditioning Unit", "Telemetry Encoder"],
  "Telemetry Encoder": ["Data Acquisition Unit", "Telemetry Transmitter"],
  "Telemetry Transmitter": ["Telemetry Encoder", "Telemetry Antenna"]
};
var idByName = new Map(rocketPartSeed.map((seed) => [seed.name, slugify2(seed.name)]));
var rocketParts = rocketPartSeed.map((seed) => {
  const id = slugify2(seed.name);
  const folder = systemFolder[seed.system];
  const [inputs, outputs] = ioFor(seed.name, seed.system);
  const image = knownImage[id] ?? `/assets/rocket-parts/${folder}/${id}-external.webp`;
  const notes = "notes" in seed ? seed.notes : "";
  const configDependent = /configuration|mission-dependent|only|smaller|advanced|experimental|reusable/i.test(notes);
  const difficulty = advancedWords.test(seed.name) ? "advanced" : seed.number % 4 === 0 ? "intermediate" : "beginner";
  const position = interfaceWords.test(seed.name) ? "interface" : externalWords.test(seed.name) ? "external" : "internal";
  const status = knownImage[id] ? "available" : configDependent ? "configuration-dependent" : difficulty === "advanced" ? "advanced" : "image-pending";
  return {
    id,
    catalogNumber: seed.number,
    name: seed.name,
    shortName: seed.name.replace(/ or .+$/i, ""),
    alternativeNames: seed.name.includes(" or ") ? seed.name.split(/ or /i).slice(1) : [],
    abbreviation: "abbreviation" in seed ? seed.abbreviation : void 0,
    system: seed.system,
    subsystem: seed.system.replace(/ System$/, ""),
    stageLocation: stageFor(seed.system, seed.name),
    position,
    purpose: seed.purpose,
    howItWorks: `${seed.name} receives ${inputs.join(" and ").toLowerCase()}, performs its ${seed.system.toLowerCase()} function, and provides ${outputs.join(" and ").toLowerCase()}. It is active only during the mission phases and vehicle configurations that require this function.`,
    inputs,
    outputs,
    connectedParts: (connectionsByName[seed.name] ?? []).map((name) => idByName.get(name)).filter((value) => Boolean(value)),
    keyParameters: [
      { label: "Installed mass", value: `${Math.max(0.2, seed.number * 3.17 % 180).toFixed(1)}`, unit: "kg", configurationDependent: true },
      { label: "Qualification state", value: "Training baseline" },
      { label: "Interface standard", value: `LV-${String(seed.number % 8 + 1).padStart(2, "0")}`, configurationDependent: true }
    ],
    materials: position === "external" ? ["Aerospace aluminium", "Composite laminate", "Protective coating"] : ["Aerospace aluminium", "Stainless steel", "Qualified polymers"],
    failureEffects: [{ symptom: "Out-of-family telemetry or inspection finding", consequence: `Degraded ${seed.system.toLowerCase()} function; mission impact depends on redundancy and phase.`, detection: "Pre-flight inspection, built-in test, or flight telemetry", mitigation: "Hold the applicable commit criterion and use approved redundancy or maintenance disposition." }],
    inspectionPoints: ["Mounting and fastener witness marks", "Connector, line, or interface condition", "Foreign-object and surface-damage inspection", "Recorded functional test status"],
    difficulty,
    buildLabCompatible: buildWords.test(seed.name),
    image,
    cutawayImage: `/assets/rocket-parts/${folder}/${id}-cutaway.webp`,
    installedImage: `/assets/rocket-parts/${folder}/${id}-installed.webp`,
    thumbnail: `/assets/rocket-parts/${folder}/${id}-thumbnail.webp`,
    imageAlt: `Technical inspection view of the ${seed.name.toLowerCase()} used in a modern educational launch vehicle.`,
    imagePrompt: `Create a highly realistic aerospace engineering product visualization of a ${seed.name}. The component belongs to the ${seed.system} of a modern educational orbital launch vehicle. Professional laboratory, photorealistic materials, accurate interfaces, cool studio lighting, dark navy grid background, no people, logos, watermark, weapon styling, or launch plume. Visually communicate: ${seed.purpose}`,
    hotspotCoordinates: [{ id: `${id}-interface`, x: 31 + seed.number % 29, y: 24 + seed.number % 47, label: "Primary interface", description: "Inspect the load, fluid, electrical, or data interface appropriate to this component." }],
    status,
    notes,
    propulsionType: seed.system === "Propulsion System" ? /Solid/.test(seed.name) ? "solid" : /Hybrid/.test(seed.name) ? "hybrid" : "liquid" : "all",
    configuration: /crew/i.test(seed.name + notes) ? "crewed" : "both",
    deployable: deployWords.test(seed.name),
    learningOrder: seed.number
  };
});
var rocketPartById = new Map(rocketParts.map((part) => [part.id, part]));
var rocketSystems = ["Complete Rocket", ...Object.keys(systemFolder)];
var systemCounts = Object.fromEntries(rocketSystems.map((system) => [system, system === "Complete Rocket" ? rocketParts.length : rocketParts.filter((part) => part.system === system).length]));
var flowDefinitions = [
  { id: "propulsion", label: "Propulsion flow", partNames: ["Fuel Tank", "Propellant Isolation Valve", "Fuel Feed Line", "Fuel Pump", "Injector", "Combustion Chamber", "Nozzle"] },
  { id: "guidance", label: "Guidance & control", partNames: ["Inertial Measurement Unit", "GNSS or GPS Receiver", "Navigation Computer", "Guidance Computer", "Flight-Control Computer", "Thrust Vector Control Actuator", "Gimbal Assembly"] },
  { id: "electrical", label: "Electrical power", partNames: ["Main Battery", "Power Distribution Unit", "Flight Computer", "Wiring Harness"] },
  { id: "telemetry", label: "Telemetry chain", partNames: ["Engine Sensors", "Signal-Conditioning Unit", "Data Acquisition Unit", "Telemetry Encoder", "Telemetry Transmitter", "Telemetry Antenna"] }
].map((flow) => ({ ...flow, partIds: flow.partNames.map((name) => idByName.get(name)).filter((id) => Boolean(id)) }));

// outputs/page-catalog-20261017/extract.ts
var app = import_node_fs.default.readFileSync("src/App.tsx", "utf8");
var routes = [...app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{([^\n]+)/g)].map((m) => ({ path: m[1], element: m[2] }));
var topics = JSON.parse("[" + app.match(/const topics = \[([\s\S]*?)\];/)[1].replace(/,\s*$/, "") + "]");
var pretty = (s) => s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
var rows = /* @__PURE__ */ new Map();
function add(path, title, topic2, type, description, source, notes = "") {
  if (!rows.has(path)) rows.set(path, { path, title, topic: topic2, type, description, source, notes, url: "https://physics.aimersociety.com" + path });
}
var valid = (p) => routes.some((r) => new RegExp("^" + r.path.replace(/:[^/]+/g, "[^/]+") + "$").test(p.split(/[?#]/)[0])) || p.startsWith("/topics/");
for (const e of appDirectoryEntries) {
  if (!valid(e.path)) continue;
  if (e.path.startsWith("/concept-studio/") && !studioHomes.some((s) => e.path === "/concept-studio/" + s.id)) continue;
  add(e.path, e.title, e.group, e.path.includes("?") || e.path.includes("#") ? "Linked view" : e.section, e.description, "src/lib/appDirectory.ts");
}
for (const r of routes.filter((r2) => !r2.path.includes(":"))) {
  const found = appDirectoryEntries.find((e) => e.path === r.path);
  if (found) continue;
  const comp = [...r.element.matchAll(/<([A-Z]\w+)/g)].map((m) => m[1]).find((x) => !["Suspense", "RouteErrorBoundary", "Navigate"].includes(x));
  const imp = comp && app.match(new RegExp("(?:import \\{ " + comp + " \\} from|const " + comp + ' = lazy\\(\\(\\) => import\\()\\s*"([^"]+)"'));
  const source = imp ? "src/" + imp[1].replace(/^\.\//, "") + ".tsx" : "src/App.tsx";
  const text = import_node_fs.default.existsSync(source) ? import_node_fs.default.readFileSync(source, "utf8") : "";
  const title = text.match(/document.title\s*=\s*["']([^"']+)["']/)?.[1]?.split(" \xB7 ")[0] || text.match(/<h1[^>]*>([^<{]+)<\/h1>/)?.[1] || r.element.match(/title="([^"]+)"/)?.[1] || pretty(r.path.split("/").pop() || "Home");
  const desc = text.match(/(?:description|subtitle|summary):\s*"([^"]{25,})"/)?.[1] || text.match(/<p[^>]*>\s*([^<{\n]{30,})\s*<\/p>/)?.[1] || `Explore ${title.toLowerCase()} through its interactive page.`;
  add(r.path, title, pretty(r.path.split("/")[1] || "Home"), "Page", desc, source, r.path === "/topics" ? "Redirects to /topics/mechanics" : "");
}
for (const t of topics) add("/topics/" + t, pretty(t), pretty(t), "Topic hub", `Browse ${pretty(t).toLowerCase()} concepts and related experiments.`, "src/App.tsx");
for (const s of studioHomes) add("/concept-studio/" + s.id, s.name, s.name, "Concept studio", s.tagline + " " + s.concepts.map((c) => c.title + ": " + c.detail).join(" "), "src/lib/conceptStudioHomes.ts");
for (const c of particlePhysicsConcepts) add("/particle-physics/" + c.id, c.title, "Particle Physics / " + c.category, "Particle concept", c.summary, "src/lib/particlePhysics.ts");
for (const p of rocketParts) add("/rocket-lab/parts/" + p.id, p.name, p.system + " / " + p.subsystem, "Rocket component", p.purpose, "src/data/rocketParts/index.ts");
var result = [...rows.values()].sort((a, b) => a.type.localeCompare(b.type) || a.topic.localeCompare(b.topic) || a.title.localeCompare(b.title));
import_node_fs.default.writeFileSync("outputs/page-catalog-20261017/pages.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify({ pages: result.length, types: result.reduce((o, r) => (o[r.type] = (o[r.type] || 0) + 1, o), {}), dynamicRoutes: routes.filter((r) => r.path.includes(":")).map((r) => r.path) }));
