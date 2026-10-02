// outputs/lesson-catalog-20260902/extract_lessons.ts
import fs from "node:fs";

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
var band = (id, label, grades, focus, topicIds, experimentIds, status = experimentIds.length ? "covered" : "needs-lab") => ({ id, label, grades, focus, topicIds, experimentIds, status });
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

// src/lib/simulationQuality.ts
var flagshipVisualIds = /* @__PURE__ */ new Set([
  "projectile-motion",
  "distance-time-graph",
  "universal-gravitation",
  "calorimetry-mixing",
  "emi-faraday",
  "ac-generator",
  "transformer-lab",
  "lens-formula",
  "prism-dispersion",
  "young-double-slit",
  "photoelectric-equation",
  "bohr-model",
  "shadows-eclipses"
]);
var coreCategories = /* @__PURE__ */ new Set([
  "Mechanics",
  "Optics",
  "Electricity",
  "Magnetism",
  "Thermodynamics",
  "Waves",
  "Fluid Mechanics",
  "Modern Physics"
]);
var qualityWeights = {
  accuracy: 0.3,
  visuals: 0.2,
  interaction: 0.15,
  learning: 0.15,
  classroom: 0.1,
  accessibility: 0.1
};
var simulationQualityScores = experiments.map(scoreExperiment).sort((left, right) => right.priority - left.priority || left.overall - right.overall);
var qualityAuditStats = makeAuditStats(simulationQualityScores);
var qualityTopPriorities = simulationQualityScores.slice(0, 25);
var qualityGaps = makeQualityGaps(simulationQualityScores);
function scoreExperiment(experiment) {
  const dimensions = {
    accuracy: scoreAccuracy(experiment),
    visuals: scoreVisuals(experiment),
    interaction: scoreInteraction(experiment),
    learning: scoreLearning(experiment),
    classroom: scoreClassroom(experiment),
    accessibility: scoreAccessibility(experiment)
  };
  const overall = Math.round(
    Object.entries(dimensions).reduce(
      (sum, [dimension, score]) => sum + score * qualityWeights[dimension],
      0
    )
  );
  const risks = risksFor(experiment, dimensions, overall);
  const riskLevel = riskLevelFor(risks, overall);
  const priority = priorityFor(experiment, overall, risks);
  return {
    id: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    difficulty: experiment.difficulty,
    modelClass: experiment.modelClass ?? "Concept",
    evidenceType: experiment.evidenceType ?? "Educational Approximation",
    maturityLevel: experiment.maturityLevel ?? "Starter",
    trustLevel: experiment.trustLevel ?? 55,
    dimensions,
    overall,
    riskLevel,
    readinessTier: readinessTierFor(overall, riskLevel),
    priority,
    strengths: strengthsFor(experiment, dimensions),
    risks,
    nextActions: nextActionsFor(experiment, dimensions, risks)
  };
}
function scoreAccuracy(experiment) {
  let score = experiment.trustLevel ?? 55;
  if (experiment.evidenceType === "Exact Formula") score += 10;
  if (experiment.evidenceType === "Visual Model") score -= 8;
  if (experiment.evidenceType === "Sandbox Only") score -= 16;
  if (experiment.modelClass === "Validated Simulation") score += 10;
  if (experiment.modelClass === "Research Prototype") score += 6;
  if (experiment.formulae.length > 0) score += 6;
  if (experiment.assumptions?.length) score += 5;
  if (experiment.validRanges?.length) score += 4;
  if (experiment.failureConditions?.length) score += 4;
  if (experiment.sourceRefs?.length) score += 3;
  return clampScore(score);
}
function scoreVisuals(experiment) {
  let score = 48;
  if (flagshipVisualIds.has(experiment.id)) score += 24;
  if (experiment.simulationSetup.objects.length >= 3) score += 8;
  if (experiment.apparatus.length >= 3) score += 5;
  if (experiment.modelClass === "Visualization" || experiment.modelClass === "Dynamic Simulation") score += 7;
  if (experiment.maturityLevel === "Flagship") score += 10;
  if (experiment.category === "Optics" || experiment.category === "Waves" || experiment.category === "Electricity") score += 4;
  return clampScore(score);
}
function scoreInteraction(experiment) {
  let score = 44;
  if (experiment.procedure.length >= 4) score += 10;
  if (experiment.observationColumns.length >= 4) score += 10;
  if (experiment.simulationSetup.objects.length >= 3) score += 8;
  if (experiment.vivaQuestions.length >= 1) score += 4;
  if (experiment.commonMistakes.length >= 2) score += 4;
  if (experiment.difficulty !== "Beginner") score += 3;
  if (flagshipVisualIds.has(experiment.id)) score += 8;
  return clampScore(score);
}
function scoreLearning(experiment) {
  let score = 42;
  if (experiment.aim.length > 50) score += 6;
  if (experiment.theory.length > 50) score += 6;
  if (experiment.expectedResult.length > 40) score += 6;
  if (experiment.formulae.length > 0) score += 8;
  if (experiment.vivaQuestions.length >= 1) score += 6;
  if (experiment.commonMistakes.length >= 2) score += 8;
  if (experiment.curriculumTags) score += 7;
  if (experiment.assumptions?.length) score += 4;
  return clampScore(score);
}
function scoreClassroom(experiment) {
  let score = 40;
  if (experiment.curriculumTags?.classes.length) score += 12;
  if (experiment.curriculumTags?.unitIds.length) score += 8;
  if (experiment.observationColumns.length >= 4) score += 8;
  if (experiment.procedure.length >= 4) score += 8;
  if (experiment.maturityLevel === "Classroom Ready" || experiment.maturityLevel === "Flagship") score += 12;
  if (experiment.classLevel.toLowerCase().includes("class")) score += 4;
  return clampScore(score);
}
function scoreAccessibility(experiment) {
  let score = 54;
  if (experiment.observationColumns.length >= 4) score += 6;
  if (experiment.formulae.length > 0) score += 5;
  if (experiment.commonMistakes.length > 0) score += 5;
  if (experiment.apparatus.length >= 3) score += 4;
  if (experiment.validRanges?.length) score += 4;
  if (experiment.category === "Optics" || experiment.category === "Waves") score -= 4;
  if (flagshipVisualIds.has(experiment.id)) score += 4;
  return clampScore(score);
}
function risksFor(experiment, dimensions, overall) {
  const risks = [];
  if (dimensions.accuracy < 70) risks.push("Accuracy needs validation against known examples or textbook benchmarks.");
  if (dimensions.visuals < 70) risks.push("Visual depth is below flagship standard.");
  if (dimensions.interaction < 65) risks.push("Interaction depth is too slider-only or observation-light.");
  if (dimensions.learning < 70) risks.push("Learning scaffolding needs stronger misconceptions, prompts, or formula links.");
  if (dimensions.classroom < 70) risks.push("Classroom workflow is not yet teacher-ready.");
  if (dimensions.accessibility < 65) risks.push("Accessibility support needs keyboard, narration, or non-color cues.");
  if (experiment.evidenceType === "Sandbox Only") risks.push("Sandbox-only evidence must be separated from validated numeric claims.");
  if (!experiment.formulae.length) risks.push("No explicit formula is attached to this experiment.");
  if (!experiment.sourceRefs?.length) risks.push("No source reference is attached yet.");
  if (overall < 60) risks.push("Overall score is below acceptable Phase 1 baseline.");
  return [...new Set(risks)];
}
function strengthsFor(experiment, dimensions) {
  const strengths = [];
  if (dimensions.accuracy >= 80) strengths.push("Strong accuracy metadata and model trust.");
  if (dimensions.visuals >= 80) strengths.push("Strong visual candidate for flagship treatment.");
  if (dimensions.learning >= 80) strengths.push("Good explanatory and learning support.");
  if (dimensions.classroom >= 80) strengths.push("Good classroom-readiness foundation.");
  if (experiment.curriculumTags) strengths.push("Mapped to syllabus and class flow.");
  if (experiment.formulae.length > 0) strengths.push("Has formula support.");
  return strengths.length ? strengths.slice(0, 4) : ["Useful concept seed, but needs Phase 2-4 strengthening."];
}
function nextActionsFor(experiment, dimensions, risks) {
  const actions = [];
  if (dimensions.accuracy < 75) actions.push("Add numeric validation cases, tolerances, and source-backed assumptions.");
  if (dimensions.visuals < 75) actions.push("Upgrade to the 2D/3D visual pane pattern with vectors, labels, and measurement overlays.");
  if (dimensions.interaction < 70) actions.push("Add drag/probe/compare or replay interaction beyond sliders.");
  if (dimensions.learning < 75) actions.push("Add Predict, Explore, Measure, Explain, Apply prompts.");
  if (dimensions.classroom < 75) actions.push("Add teacher workflow: locked variables, worksheet prompts, and answer checks.");
  if (dimensions.accessibility < 70) actions.push("Add keyboard controls, text state descriptions, and non-color cues.");
  if (!experiment.formulae.length) actions.push("Attach the core formula or mark the visual as qualitative only.");
  if (!experiment.sourceRefs?.length) actions.push("Attach at least one trusted source/reference note.");
  if (!actions.length && risks.length) actions.push("Run manual expert review and classroom usability test.");
  return actions.slice(0, 5);
}
function riskLevelFor(risks, overall) {
  if (overall < 55 || risks.length >= 7) return "Critical";
  if (overall < 68 || risks.length >= 5) return "High";
  if (overall < 78 || risks.length >= 3) return "Medium";
  return "Low";
}
function readinessTierFor(overall, riskLevel) {
  if (overall >= 86 && (riskLevel === "Low" || riskLevel === "Medium")) return "Flagship candidate";
  if (overall >= 76 && riskLevel !== "Critical") return "Classroom ready";
  if (overall >= 60) return "Needs upgrade";
  return "Critical rebuild";
}
function priorityFor(experiment, overall, risks) {
  let priority = 100 - overall;
  if (coreCategories.has(experiment.category)) priority += 10;
  if (experiment.curriculumTags?.classes.some((grade) => grade >= 8 && grade <= 12)) priority += 8;
  if (flagshipVisualIds.has(experiment.id)) priority += 8;
  if (risks.some((risk) => risk.includes("Accuracy"))) priority += 10;
  if (risks.some((risk) => risk.includes("Visual"))) priority += 6;
  return Math.max(0, Math.min(100, Math.round(priority)));
}
function makeAuditStats(scores) {
  const average = (dimension) => Math.round(scores.reduce((sum, item) => sum + (dimension ? item.dimensions[dimension] : item.overall), 0) / Math.max(1, scores.length));
  return {
    total: scores.length,
    overall: average(),
    accuracy: average("accuracy"),
    visuals: average("visuals"),
    interaction: average("interaction"),
    learning: average("learning"),
    classroom: average("classroom"),
    accessibility: average("accessibility"),
    flagshipCandidates: scores.filter((item) => item.readinessTier === "Flagship candidate").length,
    highRisk: scores.filter((item) => item.riskLevel === "High" || item.riskLevel === "Critical").length,
    critical: scores.filter((item) => item.riskLevel === "Critical").length
  };
}
function makeQualityGaps(scores) {
  return [
    gap("accuracy-validation", "Accuracy validation gaps", "High", scores.filter((item) => item.dimensions.accuracy < 70).length, "Add textbook benchmark cases and unit tests."),
    gap("visual-depth", "Visual depth below flagship", "High", scores.filter((item) => item.dimensions.visuals < 70).length, "Upgrade visuals with separated 2D/3D panes, overlays, and labels."),
    gap("interaction-depth", "Interaction depth gaps", "Medium", scores.filter((item) => item.dimensions.interaction < 65).length, "Add probes, drag interactions, replay, and compare tools."),
    gap("learning-flow", "Learning scaffold gaps", "Medium", scores.filter((item) => item.dimensions.learning < 70).length, "Add Predict, Explore, Measure, Explain, Apply flow."),
    gap("teacher-readiness", "Teacher workflow gaps", "Medium", scores.filter((item) => item.dimensions.classroom < 70).length, "Add worksheet prompts, locked setups, and classroom summaries."),
    gap("accessibility", "Accessibility gaps", "High", scores.filter((item) => item.dimensions.accessibility < 65).length, "Add keyboard, narration, contrast, and non-color encodings.")
  ].sort((left, right) => right.count - left.count);
}
function gap(id, label, severity, count, action) {
  return { id, label, severity, count, action };
}
function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

// src/lib/flagshipLabModels.ts
var controls = (one, two, three) => [one, two, three];
var finite = (value, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : "Very large";
var distance = (value, unit = "cm") => Number.isFinite(value) ? `${value.toFixed(2)} ${unit}` : "At infinity";
var nearZero = (value) => Math.abs(value) < 1e-9;
var freeFallControls = controls(
  { label: "Height (m)", min: 1, max: 500, step: 1 },
  { label: "Initial downward speed (m/s)", min: 0, max: 50, step: 1 },
  { label: "g (m/s2)", min: 1, max: 20, step: 0.1 }
);
var ohmsLawControls = controls(
  { label: "Current (A)", min: 0, max: 5, step: 0.1 },
  { label: "Resistance (ohm)", min: 1, max: 100, step: 1 },
  { label: "Internal resistance (ohm)", min: 0, max: 10, step: 0.1 }
);
var lensFormulaControls = controls(
  { label: "Focal length (cm)", min: 5, max: 50, step: 1 },
  { label: "Object distance (cm)", min: 5, max: 120, step: 1 },
  { label: "Object height (cm)", min: 1, max: 20, step: 0.5 }
);
var soundPitchControls = controls(
  { label: "Frequency (Hz)", min: 20, max: 2e3, step: 10 },
  { label: "Amplitude", min: 0.1, max: 2, step: 0.1 },
  { label: "Distance (m)", min: 1, max: 50, step: 1 }
);
var newtonSecondLawControls = controls(
  { label: "Applied force (N)", min: 0, max: 200, step: 1 },
  { label: "Mass (kg)", min: 0.1, max: 50, step: 0.1 },
  { label: "Friction force (N)", min: 0, max: 80, step: 1 }
);
var energyControls = controls(
  { label: "Mass (kg)", min: 0.1, max: 50, step: 0.1 },
  { label: "Height (m)", min: 0, max: 100, step: 0.5 },
  { label: "Loss fraction", min: 0, max: 0.9, step: 0.01 }
);
var pendulumControls = controls(
  { label: "Length (m)", min: 0.1, max: 5, step: 0.05 },
  { label: "Mass (kg)", min: 0.05, max: 5, step: 0.05 },
  { label: "Damping", min: 0, max: 0.5, step: 0.01 }
);
var buoyancyControls = controls(
  { label: "Fluid density (kg/m3)", min: 500, max: 1400, step: 10 },
  { label: "Object volume (L)", min: 0.1, max: 30, step: 0.1 },
  { label: "Object density (kg/m3)", min: 100, max: 3e3, step: 10 }
);
var gasLawControls = controls(
  { label: "Moles", min: 0.1, max: 10, step: 0.1 },
  { label: "Temperature (K)", min: 100, max: 800, step: 10 },
  { label: "Volume (m3)", min: 0.1, max: 10, step: 0.1 }
);
var youngDoubleSlitControls = controls(
  { label: "Wavelength (nm)", min: 380, max: 700, step: 1 },
  { label: "Screen distance (m)", min: 0.1, max: 5, step: 0.1 },
  { label: "Slit separation (mm)", min: 0.01, max: 2, step: 0.01 }
);
var photoelectricControls = controls(
  { label: "Photon energy (eV)", min: 0.5, max: 10, step: 0.1 },
  { label: "Work function (eV)", min: 0.5, max: 6, step: 0.1 },
  { label: "Intensity", min: 0, max: 1, step: 0.01 }
);
var flagshipLabModels = [
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
      "Repeat one trial with a different g to separate gravity from mass effects."
    ],
    graphPresets: [
      { xLabel: "Height (m)", yLabel: "Fall time", reason: "Shows the square-root timing trend." },
      { xLabel: "Height (m)", yLabel: "Impact speed", reason: "Tests v^2 = u^2 + 2gh." },
      { xLabel: "g (m/s2)", yLabel: "Acceleration", reason: "Checks that acceleration follows the chosen field." }
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
          { label: "Mass effect", value: "No ideal effect" }
        ]
      };
    }
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
      "Add internal resistance only after the ideal straight-line pattern is clear."
    ],
    graphPresets: [
      { xLabel: "Current (A)", yLabel: "Voltage across resistor", reason: "Primary Ohm's law straight-line test." },
      { xLabel: "Resistance (ohm)", yLabel: "Voltage across resistor", reason: "Shows proportionality at fixed current." },
      { xLabel: "Internal resistance (ohm)", yLabel: "Supply voltage needed", reason: "Separates load voltage from source demand." }
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
          { label: "Linearity check", value: internal > 0 ? "Source has internal drop" : "Ideal straight line" }
        ]
      };
    }
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
      "Compare the ray case with the numerical sign convention before writing the conclusion."
    ],
    graphPresets: [
      { xLabel: "Object distance (cm)", yLabel: "Image distance", reason: "Shows the asymptote near the focal point." },
      { xLabel: "Object distance (cm)", yLabel: "Magnification", reason: "Highlights enlarged and reduced image regions." },
      { xLabel: "Focal length (cm)", yLabel: "Power", reason: "Connects lens power to focal length." }
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
          { label: "Image type", value: Number.isFinite(v) ? v > 0 ? "Real" : "Virtual" : "At infinity" },
          { label: "Ray case", value: objectCase },
          { label: "Power", value: `${(100 / f).toFixed(2)} D` }
        ]
      };
    }
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
      "Finally move the listener distance to show inverse-square spreading."
    ],
    graphPresets: [
      { xLabel: "Frequency (Hz)", yLabel: "Wavelength in air", reason: "Tests v = f lambda at fixed sound speed." },
      { xLabel: "Amplitude", yLabel: "Relative intensity", reason: "Shows intensity rising with amplitude squared." },
      { xLabel: "Distance (m)", yLabel: "Relative intensity", reason: "Shows spreading loss with distance squared." }
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
          { label: "Relative intensity", value: `${(amp * amp / (r * r)).toFixed(4)}` },
          { label: "Pitch", value: f > 500 ? "High" : f < 200 ? "Low" : "Medium" },
          { label: "Loudness trend", value: amp > 1.3 ? "Louder source" : "Moderate/quiet source" }
        ]
      };
    }
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
      "Keep net force fixed and vary mass to show inverse proportionality."
    ],
    graphPresets: [
      { xLabel: "Applied force (N)", yLabel: "Acceleration", reason: "Shows the straight-line force-acceleration relationship." },
      { xLabel: "Mass (kg)", yLabel: "Acceleration", reason: "Shows inverse dependence at fixed net force." },
      { xLabel: "Friction force (N)", yLabel: "Net force", reason: "Makes force balance visible before calculating acceleration." }
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
          { label: "Motion state", value: Math.abs(netForce) < 0.01 ? "Balanced" : netForce > 0 ? "Speeds up forward" : "Accelerates backward" }
        ]
      };
    }
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
      "Increase loss fraction and compare remaining mechanical energy."
    ],
    graphPresets: [
      { xLabel: "Height (m)", yLabel: "Potential energy", reason: "Shows mgh as a linear height relationship." },
      { xLabel: "Height (m)", yLabel: "Speed at bottom", reason: "Shows speed growing with square root of height." },
      { xLabel: "Loss fraction", yLabel: "Remaining energy", reason: "Makes non-ideal energy loss explicit." }
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
          { label: "Speed at bottom", value: `${Math.sqrt(2 * remaining / m).toFixed(2)} m/s` },
          { label: "Energy lost", value: `${(potential - remaining).toFixed(2)} J` }
        ]
      };
    }
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
      "Use damping only after the ideal period trend is clear."
    ],
    graphPresets: [
      { xLabel: "Length (m)", yLabel: "Period", reason: "Shows T proportional to square root of length." },
      { xLabel: "Mass (kg)", yLabel: "Period", reason: "Checks that ideal period is independent of bob mass." },
      { xLabel: "Damping", yLabel: "Quality trend", reason: "Separates visible decay from period calculation." }
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
          { label: "Quality trend", value: damping > 0.2 ? "Strong damping" : "Light damping" }
        ]
      };
    }
  },
  {
    id: "buoyancy",
    title: "Buoyancy",
    modelVersion: "flagship-fluids-1.0",
    maturityTarget: "Classroom Ready",
    defaultValues: [1e3, 2, 700],
    controls: buoyancyControls,
    predictionPrompt: "Predict whether the object floats before looking at the calculated submerged fraction.",
    measurementPlan: [
      "Keep object volume fixed and compare object density with fluid density.",
      "Record buoyant force and object weight for floating and sinking cases.",
      "Use submerged fraction to connect the formula with the visible waterline."
    ],
    graphPresets: [
      { xLabel: "Object density (kg/m3)", yLabel: "Submerged fraction", reason: "Shows the density-ratio rule for floating objects." },
      { xLabel: "Object volume (L)", yLabel: "Maximum buoyant force", reason: "Shows displaced volume setting the force scale." },
      { xLabel: "Fluid density (kg/m3)", yLabel: "Maximum buoyant force", reason: "Tests Archimedes' principle directly." }
    ],
    uncertaintyNote: "Assumes fully displaced volume is available and ignores surface tension, fluid motion, and shape stability.",
    evaluate: ([fluidDensity, volumeLitres, objectDensity]) => {
      const g = 9.81;
      const rhoFluid = Math.max(1, fluidDensity);
      const volumeM3 = Math.max(0, volumeLitres) / 1e3;
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
          { label: "State", value: objectWeight <= maxBuoyant ? "Floats" : "Sinks" }
        ]
      };
    }
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
      "Record PV/T to verify it stays constant for fixed amount of gas."
    ],
    graphPresets: [
      { xLabel: "Temperature (K)", yLabel: "Pressure", reason: "Shows direct proportionality at fixed volume." },
      { xLabel: "Volume (m3)", yLabel: "Pressure", reason: "Shows Boyle-law inverse behavior." },
      { xLabel: "Moles", yLabel: "PV/T", reason: "Connects the constant to nR." }
    ],
    uncertaintyNote: "Ideal gas model assumes low-density gas and absolute temperature in kelvin.",
    evaluate: ([moles, temperature, volume]) => {
      const n = Math.max(1e-3, moles);
      const t = Math.max(1e-3, temperature);
      const v = Math.max(1e-3, volume);
      const pressurePa = n * 8.314462618 * t / v;
      return {
        description: "The ideal gas model connects pressure, volume, amount of gas, and absolute temperature.",
        controls: gasLawControls,
        formula: "PV = nRT",
        outputs: [
          { label: "Pressure", value: `${(pressurePa / 1e3).toFixed(2)} kPa` },
          { label: "PV/T", value: `${(pressurePa * v / t).toFixed(3)} J/K` },
          { label: "nR check", value: `${(n * 8.314462618).toFixed(3)} J/K` },
          { label: "Molecular trend", value: t > 400 ? "Faster particles" : "Slower particles" }
        ]
      };
    }
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
      "Change slit separation last to show why close slits produce wider fringes."
    ],
    graphPresets: [
      { xLabel: "Wavelength (nm)", yLabel: "Fringe width", reason: "Shows wider fringes for longer wavelength." },
      { xLabel: "Screen distance (m)", yLabel: "Fringe width", reason: "Shows direct proportionality with screen distance." },
      { xLabel: "Slit separation (mm)", yLabel: "Fringe width", reason: "Shows inverse dependence on slit separation." }
    ],
    uncertaintyNote: "Uses small-angle coherent-light approximation; real fringes need slit width and alignment uncertainty.",
    evaluate: ([wavelengthNm, screenDistance, slitMm]) => {
      const wavelength = Math.max(1, wavelengthNm) * 1e-9;
      const distanceM = Math.max(1e-3, screenDistance);
      const slit = Math.max(1e-3, slitMm) * 1e-3;
      const betaMm = wavelength * distanceM / slit * 1e3;
      return {
        description: "Double-slit interference creates evenly spaced bright fringes for small angles.",
        controls: youngDoubleSlitControls,
        formula: "beta = lambda D / d",
        outputs: [
          { label: "Fringe width", value: `${betaMm.toFixed(3)} mm` },
          { label: "5-fringe span", value: `${(5 * betaMm).toFixed(3)} mm` },
          { label: "Path condition", value: "Bright when path difference = m lambda" },
          { label: "Pattern trend", value: slitMm < 0.2 ? "Wide fringes" : "Narrower fringes" }
        ]
      };
    }
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
      "Change intensity after threshold to separate electron count from maximum kinetic energy."
    ],
    graphPresets: [
      { xLabel: "Photon energy (eV)", yLabel: "Kmax", reason: "Shows the threshold and linear kinetic-energy region." },
      { xLabel: "Work function (eV)", yLabel: "Stopping potential", reason: "Shows how material choice shifts the threshold." },
      { xLabel: "Intensity", yLabel: "Emission?", reason: "Keeps the intensity misconception visible." }
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
          { label: "Photocurrent trend", value: emits ? `${Math.round(intensity * 100)} % relative` : "No emission" }
        ]
      };
    }
  }
];
var flagshipLabModelsById = Object.fromEntries(flagshipLabModels.map((model) => [model.id, model]));
var flagshipLabModelIds = flagshipLabModels.map((model) => model.id);
function getFlagshipLabModel(id) {
  return flagshipLabModelsById[id];
}

// src/experiments/shared/validation.ts
function approximatelyEqual(actual, expected, tolerance, toleranceMode = "absolute") {
  if (!Number.isFinite(actual) || !Number.isFinite(expected) || tolerance < 0) {
    return false;
  }
  const error = Math.abs(actual - expected);
  if (toleranceMode === "relative") {
    const scale2 = Math.max(Math.abs(expected), Number.EPSILON);
    return error / scale2 <= tolerance;
  }
  return error <= tolerance;
}
function runBenchmarkCases(cases) {
  return cases.map((benchmark) => {
    const toleranceMode = benchmark.toleranceMode ?? "absolute";
    const actual = benchmark.actual(benchmark.input);
    const error = Math.abs(actual - benchmark.expected);
    return {
      id: benchmark.id,
      name: benchmark.name,
      input: benchmark.input,
      expected: benchmark.expected,
      unit: benchmark.unit,
      tolerance: benchmark.tolerance,
      toleranceMode,
      source: benchmark.source,
      assumptions: benchmark.assumptions,
      actual,
      error,
      pass: approximatelyEqual(actual, benchmark.expected, benchmark.tolerance, toleranceMode)
    };
  });
}
function statusForBenchmarks(results, qualitative = false) {
  if (qualitative) return "qualitative-visual";
  if (results.length === 0) return "needs-benchmark";
  return results.every((result) => result.pass) ? "validated" : "unsafe-claim";
}

// src/experiments/circular-motion/circular-motionSimulation.ts
function simulateCircularMotion(input) {
  const tangentialSpeed = input.radius * input.omega;
  const centripetalAcceleration = input.radius * input.omega ** 2;
  const centripetalForce = input.mass * centripetalAcceleration;
  const period = 2 * Math.PI / input.omega;
  return { tangentialSpeed, centripetalAcceleration, centripetalForce, period };
}
var circularMotionBenchmarks = runBenchmarkCases([
  {
    id: "circular-force",
    name: "Centripetal force",
    input: { mass: 2, radius: 3, omega: 4 },
    expected: 96,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateCircularMotion(input).centripetalForce
  },
  {
    id: "circular-speed",
    name: "Tangential speed",
    input: { mass: 1, radius: 2, omega: 5 },
    expected: 10,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input) => simulateCircularMotion(input).tangentialSpeed
  }
]);

// src/experiments/elastic-collision/elastic-collisionSimulation.ts
function simulateElasticCollision(input) {
  const totalMass = input.m1 + input.m2;
  const v1 = (input.m1 - input.m2) / totalMass * input.u1 + 2 * input.m2 / totalMass * input.u2;
  const v2 = 2 * input.m1 / totalMass * input.u1 + (input.m2 - input.m1) / totalMass * input.u2;
  const momentumBefore = input.m1 * input.u1 + input.m2 * input.u2;
  const momentumAfter = input.m1 * v1 + input.m2 * v2;
  const kineticBefore = 0.5 * input.m1 * input.u1 ** 2 + 0.5 * input.m2 * input.u2 ** 2;
  const kineticAfter = 0.5 * input.m1 * v1 ** 2 + 0.5 * input.m2 * v2 ** 2;
  const conservationErrorPercent = Math.abs((kineticAfter - kineticBefore) / Math.max(kineticBefore, 1e-9)) * 100;
  return { v1, v2, momentumBefore, momentumAfter, kineticBefore, kineticAfter, conservationErrorPercent };
}
var elasticCollisionBenchmarks = runBenchmarkCases([
  {
    id: "collision-equal-masses-v1",
    name: "Equal masses transfer velocity",
    input: { m1: 1, m2: 1, u1: 5, u2: 0 },
    expected: 0,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input) => simulateElasticCollision(input).v1
  },
  {
    id: "collision-two-to-one-v2",
    name: "Two-to-one mass second velocity",
    input: { m1: 2, m2: 1, u1: 3, u2: 0 },
    expected: 4,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input) => simulateElasticCollision(input).v2
  }
]);

// src/experiments/friction/frictionSimulation.ts
function simulateFriction(input) {
  const normalForce = input.mass * input.gravity;
  const frictionForce = input.mu * normalForce;
  const opposingFriction = Math.min(Math.abs(input.appliedForce), frictionForce) * Math.sign(input.appliedForce || 1);
  const netForce = input.appliedForce - opposingFriction;
  const acceleration = Math.abs(input.appliedForce) <= frictionForce ? 0 : netForce / input.mass;
  const motionState = Math.abs(input.appliedForce) <= frictionForce ? "stuck" : Math.abs(acceleration) < 0.05 ? "sliding" : "accelerating";
  return { normalForce, frictionForce, netForce, acceleration, motionState };
}
var frictionBenchmarks = runBenchmarkCases([
  {
    id: "friction-mu-normal",
    name: "Friction from coefficient and normal",
    input: { mass: 100 / 9.8, gravity: 9.8, mu: 0.3, appliedForce: 60 },
    expected: 30,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).frictionForce
  },
  {
    id: "friction-mass-gravity",
    name: "Friction from mass and gravity",
    input: { mass: 10, gravity: 9.8, mu: 0.5, appliedForce: 80 },
    expected: 49,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateFriction(input).frictionForce
  }
]);

// src/experiments/hooke-s-law/hooke-s-lawSimulation.ts
function simulateHookesLaw(input) {
  const restoringForce = -input.k * input.x;
  const forceMagnitude = Math.abs(restoringForce);
  const energyStored = 0.5 * input.k * input.x ** 2;
  const direction = input.x > 0 ? "toward equilibrium" : input.x < 0 ? "away from compression" : "balanced";
  const points = Array.from({ length: 9 }, (_, index) => {
    const x = -0.4 + index * 0.1;
    return { x, y: -input.k * x };
  });
  return { restoringForce, forceMagnitude, energyStored, direction, points };
}
var hookesLawBenchmarks = runBenchmarkCases([
  {
    id: "hooke-force",
    name: "Restoring force magnitude",
    input: { k: 100, x: 0.2, mass: 1 },
    expected: 20,
    unit: "N",
    tolerance: 1e-9,
    actual: (input) => simulateHookesLaw(input).forceMagnitude
  },
  {
    id: "hooke-energy",
    name: "Elastic potential energy",
    input: { k: 50, x: 0.1, mass: 1 },
    expected: 0.25,
    unit: "J",
    tolerance: 1e-9,
    actual: (input) => simulateHookesLaw(input).energyStored
  }
]);

// src/experiments/inclined-plane/inclined-planeSimulation.ts
var toRad = (degrees) => degrees * Math.PI / 180;
function simulateInclinedPlane(input) {
  const theta = toRad(input.angle);
  const parallelWeight = input.mass * input.gravity * Math.sin(theta);
  const normalForce = input.mass * input.gravity * Math.cos(theta);
  const friction = Math.min(input.mu * normalForce, Math.max(0, parallelWeight));
  const netForce = Math.max(0, parallelWeight - friction);
  const acceleration = netForce / input.mass;
  return { parallelWeight, normalForce, friction, netForce, acceleration };
}
var inclinedPlaneBenchmarks = runBenchmarkCases([
  {
    id: "incline-thirty-no-friction",
    name: "30 degree frictionless acceleration",
    input: { angle: 30, mass: 2, mu: 0, gravity: 9.8 },
    expected: 4.9,
    unit: "m/s\xB2",
    tolerance: 1e-9,
    actual: (input) => simulateInclinedPlane(input).acceleration
  },
  {
    id: "incline-flat-no-false-acceleration",
    name: "Flat plane does not accelerate down plane",
    input: { angle: 0, mass: 2, mu: 0.2, gravity: 9.8 },
    expected: 0,
    unit: "m/s\xB2",
    tolerance: 1e-9,
    actual: (input) => simulateInclinedPlane(input).acceleration
  }
]);

// src/experiments/chladni-plate/chladni-plateSimulation.ts
function simulateChladniPlate(input) {
  const nodeLineCount = Math.max(0, input.modeN - 1) + Math.max(0, input.modeM - 1);
  const complexity = input.modeN * input.modeM;
  const sandParticles = Array.from({ length: 80 }, (_, index) => {
    const band2 = index % Math.max(1, nodeLineCount + 1);
    const x = 48 + index * 37 % 420;
    const y = 52 + (band2 + 1) / Math.max(2, nodeLineCount + 2) * 210 + Math.sin(index) * 5 * (1 - input.damping);
    return { x, y };
  });
  const heatCells = Array.from({ length: 10 }, (_, row) => Array.from({ length: 10 }, (_2, col) => {
    const x = (col + 0.5) / 10;
    const y = (row + 0.5) / 10;
    return Math.abs(Math.sin(input.modeN * Math.PI * x) * Math.sin(input.modeM * Math.PI * y)) * input.amplitude;
  }));
  return { nodeLineCount, complexity, sandParticles, heatCells, qualitativeWarning: "This is a school-level qualitative Chladni model, not a full finite-element plate solver." };
}
var chladniBenchmarks = runBenchmarkCases([
  {
    id: "chladni-higher-mode-more-lines",
    name: "Higher mode gives more node lines",
    input: { modeN: 3, modeM: 4, frequency: 440, amplitude: 1, damping: 0.35 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateChladniPlate(input).nodeLineCount > simulateChladniPlate({ ...input, modeN: 1, modeM: 1 }).nodeLineCount ? 1 : 0
  },
  {
    id: "chladni-simple-mode",
    name: "1,1 simpler than 3,4",
    input: { modeN: 1, modeM: 1, frequency: 220, amplitude: 1, damping: 0.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateChladniPlate(input).complexity < simulateChladniPlate({ ...input, modeN: 3, modeM: 4 }).complexity ? 1 : 0
  }
]);

// src/experiments/shared/waveMath.ts
var nmToMeters = (value) => value * 1e-9;
var mmToMeters = (value) => value * 1e-3;
var degreesToRadians = (value) => value * Math.PI / 180;
function sinc(value) {
  if (Math.abs(value) < 1e-9) return 1;
  return Math.sin(value) / value;
}
function distance2(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

// src/experiments/single-slit-diffraction/single-slit-diffractionSimulation.ts
function simulateSingleSlit(input) {
  const wavelengthM = nmToMeters(input.wavelengthNm);
  const slitWidthM = mmToMeters(input.slitWidthMm);
  const ratio = Math.min(0.999, wavelengthM / slitWidthM);
  const firstMinimaPosition = wavelengthM * input.screenDistanceM / slitWidthM;
  const selectedMinimaPosition = input.order * firstMinimaPosition;
  const angularSpreadRad = Math.asin(ratio);
  const centralMaximumWidth = 2 * firstMinimaPosition;
  const intensityPoints = Array.from({ length: 61 }, (_, index) => {
    const y = -3 * centralMaximumWidth + index / 60 * 6 * centralMaximumWidth;
    const beta = Math.PI * slitWidthM * y / Math.max(1e-12, wavelengthM * input.screenDistanceM);
    return { x: y, y: sinc(beta) ** 2 };
  });
  return { wavelengthM, slitWidthM, angularSpreadRad, firstMinimaPosition, selectedMinimaPosition, centralMaximumWidth, intensityPoints };
}
var singleSlitBenchmarks = runBenchmarkCases([
  {
    id: "single-slit-first-minimum",
    name: "First minimum position",
    input: { wavelengthNm: 500, screenDistanceM: 2, slitWidthMm: 0.1, order: 1 },
    expected: 0.01,
    unit: "m",
    tolerance: 1e-12,
    actual: (input) => simulateSingleSlit(input).firstMinimaPosition
  },
  {
    id: "single-slit-width-monotonic",
    name: "Wider slit narrows central maximum",
    input: { wavelengthNm: 500, screenDistanceM: 2, slitWidthMm: 0.2, order: 1 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateSingleSlit(input).centralMaximumWidth < simulateSingleSlit({ ...input, slitWidthMm: 0.1 }).centralMaximumWidth ? 1 : 0
  }
]);

// src/experiments/uniform-motion/uniform-motionSimulation.ts
function simulateUniformMotion(input) {
  const finalPosition = input.x0 + input.velocity * input.time;
  const distancePoints = Array.from({ length: 7 }, (_, index) => {
    const t = input.time / 6 * index;
    return { x: t, y: input.x0 + input.velocity * t };
  });
  const velocityPoints = Array.from({ length: 7 }, (_, index) => {
    const t = input.time / 6 * index;
    return { x: t, y: input.velocity };
  });
  return {
    finalPosition,
    displacement: finalPosition - input.x0,
    distancePoints,
    velocityPoints,
    slopeExplanation: `The distance-time graph slope is ${input.velocity.toFixed(2)} m/s, equal to velocity.`
  };
}
var uniformMotionBenchmarks = runBenchmarkCases([
  {
    id: "uniform-motion-position-positive",
    name: "Positive velocity position",
    input: { x0: 0, velocity: 5, time: 4 },
    expected: 20,
    unit: "m",
    tolerance: 1e-9,
    actual: (input) => simulateUniformMotion(input).finalPosition
  },
  {
    id: "uniform-motion-position-negative",
    name: "Negative velocity position",
    input: { x0: 10, velocity: -2, time: 3 },
    expected: 4,
    unit: "m",
    tolerance: 1e-9,
    actual: (input) => simulateUniformMotion(input).finalPosition
  }
]);

// src/experiments/wave-lab/wave-labSimulation.ts
function simulateWaveLab(input) {
  const wavelength = input.speed / input.frequency;
  const sourceA = { x: -input.sourceSeparation / 2, y: 0 };
  const sourceB = { x: input.sourceSeparation / 2, y: 0 };
  const r1 = distance2(sourceA.x, sourceA.y, input.probeX, input.probeY);
  const r2 = distance2(sourceB.x, sourceB.y, input.probeX, input.probeY);
  const pathDifference = r2 - r1;
  const phaseAtProbe = 2 * Math.PI * pathDifference / wavelength + degreesToRadians(input.phaseDeg);
  const detectorAmplitude = Math.sqrt(Math.max(0, 2 + 2 * Math.cos(phaseAtProbe)));
  const patternType = Math.abs(Math.cos(phaseAtProbe)) > 0.85 ? "constructive" : Math.abs(Math.cos(phaseAtProbe)) < 0.2 ? "destructive" : "partial";
  const graphPoints = Array.from({ length: 32 }, (_, index) => {
    const t = index / 31;
    return { x: t, y: detectorAmplitude * Math.sin(2 * Math.PI * t) };
  });
  return { wavelength, sourceA, sourceB, pathDifference, phaseAtProbe, detectorAmplitude, patternType, graphPoints };
}
var waveLabBenchmarks = runBenchmarkCases([
  {
    id: "wave-frequency-wavelength",
    name: "Frequency increase lowers wavelength at fixed speed",
    input: { frequency: 10, speed: 20, sourceSeparation: 4, phaseDeg: 0, probeX: 2, probeY: 5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input) => simulateWaveLab({ ...input, frequency: 20 }).wavelength < simulateWaveLab(input).wavelength ? 1 : 0
  },
  {
    id: "wave-zero-separation-single-source",
    name: "Zero separation same phase acts like stronger single source",
    input: { frequency: 10, speed: 20, sourceSeparation: 0, phaseDeg: 0, probeX: 2, probeY: 5 },
    expected: 2,
    unit: "relative amplitude",
    tolerance: 1e-9,
    actual: (input) => simulateWaveLab(input).detectorAmplitude
  }
]);

// src/lib/experimentValidationRegistry.ts
var si = (id, label, displayUnit, siUnit = displayUnit) => ({ id, label, displayUnit, siUnit });
var newtonBenchmarks = runBenchmarkCases([
  { id: "newton-fma-basic", name: "F=ma", input: { force: 10, mass: 2 }, expected: 5, unit: "m/s^2", tolerance: 1e-12, actual: (input) => input.force / input.mass },
  { id: "newton-negative-force", name: "Signed acceleration", input: { force: -12, mass: 3 }, expected: -4, unit: "m/s^2", tolerance: 1e-12, actual: (input) => input.force / input.mass }
]);
var energyBenchmarks = runBenchmarkCases([
  { id: "energy-conserved-drop", name: "Potential converts to kinetic", input: { mass: 2, g: 9.8, height: 5 }, expected: 98, unit: "J", tolerance: 1e-12, actual: (input) => input.mass * input.g * input.height },
  { id: "energy-speed-check", name: "Speed from drop height", input: { mass: 1, g: 9.8, height: 5 }, expected: Math.sqrt(98), unit: "m/s", tolerance: 1e-12, actual: (input) => Math.sqrt(2 * input.g * input.height) }
]);
var experimentValidationRegistry = {
  "uniform-motion": {
    experimentId: "uniform-motion",
    formulaName: "Uniform motion",
    formula: "x = x0 + vt",
    status: statusForBenchmarks(uniformMotionBenchmarks),
    assumptions: ["Velocity is constant.", "Motion is one-dimensional.", "Position is signed."],
    inputUnits: [si("x0", "Initial position", "m"), si("velocity", "Velocity", "m/s"), si("time", "Time", "s")],
    outputUnits: [si("x", "Final position", "m"), si("slope", "Graph slope", "m/s")],
    validRanges: [{ id: "time", label: "Time", min: 0, unit: "s" }],
    benchmarkCases: uniformMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "distance-time", label: "Distance-time", xLabel: "time", yLabel: "position", shape: "linear" }, { id: "velocity-time", label: "Velocity-time", xLabel: "time", yLabel: "velocity", shape: "constant" }],
    warnings: ["Negative velocity is allowed; negative time is not."]
  },
  friction: {
    experimentId: "friction",
    formulaName: "Kinetic friction",
    formula: "f = mu N, N = mg",
    status: statusForBenchmarks(frictionBenchmarks),
    assumptions: ["Flat surface.", "Friction opposes motion.", "Classroom static/kinetic threshold approximation."],
    inputUnits: [si("mass", "Mass", "kg"), si("gravity", "Gravity", "m/s^2"), si("mu", "Coefficient", "unitless"), si("appliedForce", "Applied force", "N")],
    outputUnits: [si("normalForce", "Normal force", "N"), si("frictionForce", "Friction force", "N"), si("acceleration", "Acceleration", "m/s^2")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg", warning: "Mass must be positive." }, { id: "mu", label: "Coefficient", min: 0 }],
    benchmarkCases: frictionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "friction-normal", label: "f vs N", xLabel: "normal force", yLabel: "friction", shape: "linear" }],
    warnings: ["No negative mass; no negative coefficient."]
  },
  "inclined-plane": {
    experimentId: "inclined-plane",
    formulaName: "Incline acceleration",
    formula: "a = max(0, g(sin(theta) - mu cos(theta)))",
    status: statusForBenchmarks(inclinedPlaneBenchmarks),
    assumptions: ["Rigid plane.", "Friction acts up plane.", "Acceleration is clamped when friction holds the block."],
    inputUnits: [si("angle", "Angle", "deg", "rad"), si("mass", "Mass", "kg"), si("mu", "Coefficient", "unitless"), si("gravity", "Gravity", "m/s^2")],
    outputUnits: [si("parallelWeight", "Parallel weight", "N"), si("normalForce", "Normal force", "N"), si("acceleration", "Acceleration", "m/s^2")],
    validRanges: [{ id: "angle", label: "Angle", min: 0, max: 80, unit: "deg", warning: "Angles beyond classroom scope need warning." }, { id: "mass", label: "Mass", min: 0, unit: "kg" }],
    benchmarkCases: inclinedPlaneBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "angle-acceleration", label: "Angle vs acceleration", xLabel: "angle", yLabel: "acceleration", direction: "increasing" }],
    warnings: ["Flat plane must not accelerate down plane."]
  },
  "elastic-collision": {
    experimentId: "elastic-collision",
    formulaName: "1D elastic collision",
    formula: "v1=((m1-m2)/(m1+m2))u1 + (2m2/(m1+m2))u2",
    status: statusForBenchmarks(elasticCollisionBenchmarks),
    assumptions: ["One-dimensional collision.", "Perfectly elastic.", "No external impulse during collision."],
    inputUnits: [si("m1", "Mass 1", "kg"), si("m2", "Mass 2", "kg"), si("u1", "Initial velocity 1", "m/s"), si("u2", "Initial velocity 2", "m/s")],
    outputUnits: [si("v1", "Final velocity 1", "m/s"), si("v2", "Final velocity 2", "m/s"), si("energy", "Kinetic energy", "J")],
    validRanges: [{ id: "m1", label: "Mass 1", min: 0, unit: "kg" }, { id: "m2", label: "Mass 2", min: 0, unit: "kg" }],
    benchmarkCases: elasticCollisionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "energy-before-after", label: "Energy before/after", xLabel: "state", yLabel: "energy", shape: "constant" }],
    warnings: ["Mass sum cannot be zero."]
  },
  "hooke-s-law": {
    experimentId: "hooke-s-law",
    formulaName: "Hooke's law",
    formula: "F = -kx, U = 1/2 kx^2",
    status: statusForBenchmarks(hookesLawBenchmarks),
    assumptions: ["Spring remains elastic.", "Extension measured from equilibrium."],
    inputUnits: [si("k", "Spring constant", "N/m"), si("x", "Extension", "m"), si("mass", "Attached mass", "kg")],
    outputUnits: [si("force", "Restoring force", "N"), si("energy", "Elastic potential energy", "J")],
    validRanges: [{ id: "k", label: "Spring constant", min: 0, unit: "N/m" }],
    benchmarkCases: hookesLawBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "force-extension", label: "F-x graph", xLabel: "extension", yLabel: "force", shape: "linear" }],
    warnings: ["Do not claim linearity beyond elastic limit."]
  },
  "circular-motion": {
    experimentId: "circular-motion",
    formulaName: "Centripetal force",
    formula: "Fc = m r omega^2",
    status: statusForBenchmarks(circularMotionBenchmarks),
    assumptions: ["Uniform circular motion.", "Centripetal force points inward."],
    inputUnits: [si("mass", "Mass", "kg"), si("radius", "Radius", "m"), si("omega", "Angular speed", "rad/s")],
    outputUnits: [si("force", "Centripetal force", "N"), si("speed", "Tangential speed", "m/s"), si("period", "Period", "s")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg" }, { id: "radius", label: "Radius", min: 0, unit: "m" }, { id: "omega", label: "Angular speed", min: 0, unit: "rad/s" }],
    benchmarkCases: circularMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "force-omega", label: "Fc vs omega", xLabel: "angular speed", yLabel: "force", shape: "quadratic" }],
    warnings: ["Radius and angular speed must be positive for period and force outputs."]
  },
  "single-slit-diffraction": {
    experimentId: "single-slit-diffraction",
    formulaName: "Single slit minima",
    formula: "a sin(theta) = m lambda; y_m approx m lambda D / a",
    status: statusForBenchmarks(singleSlitBenchmarks),
    assumptions: ["Small-angle approximation for screen position.", "Classroom Fraunhofer scalar model."],
    inputUnits: [si("wavelengthNm", "Wavelength", "nm", "m"), si("slitWidthMm", "Slit width", "mm", "m"), si("screenDistanceM", "Screen distance", "m"), si("order", "Order", "integer")],
    outputUnits: [si("firstMinimaPosition", "First minima position", "m"), si("centralMaximumWidth", "Central maximum width", "m")],
    validRanges: [{ id: "wavelengthNm", label: "Wavelength", min: 1, unit: "nm" }, { id: "slitWidthMm", label: "Slit width", min: 0, unit: "mm" }],
    benchmarkCases: singleSlitBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [{ id: "central-width-slit", label: "Width vs slit width", xLabel: "slit width", yLabel: "central width", direction: "decreasing" }],
    warnings: ["Never mix nm/mm/m without explicit conversion labels."]
  },
  "chladni-plate": {
    experimentId: "chladni-plate",
    formulaName: "Qualitative standing wave mode",
    formula: "z = A sin(n pi x/L) sin(m pi y/L) cos(omega t)",
    status: "qualitative-visual",
    assumptions: ["School-level qualitative mode model.", "Not a finite-element plate solver."],
    inputUnits: [si("modeN", "Mode n", "integer"), si("modeM", "Mode m", "integer"), si("frequency", "Frequency", "Hz")],
    outputUnits: [si("nodeLineCount", "Node line count", "relative"), si("complexity", "Pattern complexity", "relative")],
    validRanges: [{ id: "modeN", label: "Mode n", min: 1 }, { id: "modeM", label: "Mode m", min: 1 }],
    benchmarkCases: chladniBenchmarks,
    tolerance: 0,
    graphExpectations: [{ id: "mode-complexity", label: "Mode number vs node lines", xLabel: "mode", yLabel: "node lines", direction: "increasing" }],
    warnings: ["Qualitative visual model only; no exact plate physics claim."]
  },
  "newton-s-second-law": {
    experimentId: "newton-s-second-law",
    formulaName: "Newton's second law",
    formula: "F = ma",
    status: statusForBenchmarks(newtonBenchmarks),
    assumptions: ["Net force is known.", "Mass is positive and constant.", "One-dimensional model."],
    inputUnits: [si("force", "Net force", "N"), si("mass", "Mass", "kg")],
    outputUnits: [si("acceleration", "Acceleration", "m/s^2")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg" }],
    benchmarkCases: newtonBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [{ id: "force-acceleration", label: "Force vs acceleration", xLabel: "force", yLabel: "acceleration", shape: "linear" }],
    warnings: ["Mass cannot be zero."]
  },
  "conservation-of-energy": {
    experimentId: "conservation-of-energy",
    formulaName: "Mechanical energy conservation",
    formula: "KE + PE = constant",
    status: statusForBenchmarks(energyBenchmarks),
    assumptions: ["No non-conservative work.", "Uniform gravity.", "Closed mechanical system."],
    inputUnits: [si("mass", "Mass", "kg"), si("height", "Height", "m"), si("g", "Gravity", "m/s^2")],
    outputUnits: [si("energy", "Energy", "J"), si("speed", "Speed", "m/s")],
    validRanges: [{ id: "mass", label: "Mass", min: 0, unit: "kg" }, { id: "height", label: "Height", min: 0, unit: "m" }],
    benchmarkCases: energyBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "energy-total", label: "Total energy", xLabel: "time", yLabel: "energy", shape: "constant" }],
    warnings: ["Energy changes if friction or drag is enabled."]
  },
  "wave-lab": {
    experimentId: "wave-lab",
    formulaName: "Wave relation and interference",
    formula: "v = f lambda; constructive delta r = m lambda; destructive delta r = (m+1/2) lambda",
    status: statusForBenchmarks(waveLabBenchmarks),
    assumptions: ["Two coherent point sources.", "Relative classroom amplitude model."],
    inputUnits: [si("frequency", "Frequency", "Hz"), si("speed", "Speed", "m/s"), si("sourceSeparation", "Separation", "m"), si("phaseDeg", "Phase", "deg", "rad")],
    outputUnits: [si("wavelength", "Wavelength", "m"), si("pathDifference", "Path difference", "m"), si("detectorAmplitude", "Detector amplitude", "relative")],
    validRanges: [{ id: "frequency", label: "Frequency", min: 0, unit: "Hz" }, { id: "speed", label: "Speed", min: 0, unit: "m/s" }],
    benchmarkCases: waveLabBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [{ id: "frequency-wavelength", label: "Frequency vs wavelength", xLabel: "frequency", yLabel: "wavelength", direction: "decreasing" }],
    warnings: ["Frequency and speed must be positive."]
  }
};
function getExperimentValidationMetadata(experimentId) {
  return experimentValidationRegistry[experimentId];
}
var emptyExperimentValidationSummary = {
  total: 0,
  validated: 0,
  "formula-only": 0,
  "qualitative-visual": 0,
  "needs-benchmark": 0,
  "unsafe-claim": 0,
  failed: 0,
  warnings: 0
};
var experimentValidationSummary = Object.values(experimentValidationRegistry).reduce(
  (summary, item) => {
    summary.total += 1;
    summary[item.status] += 1;
    if (item.benchmarkCases.some((benchmark) => !benchmark.pass)) summary.failed += 1;
    if (item.warnings.length) summary.warnings += item.warnings.length;
    return summary;
  },
  { ...emptyExperimentValidationSummary }
);

// src/lib/units.ts
var identity = (value) => value;
var scale = (factor) => ({
  toSI: (value) => value * factor,
  fromSI: (value) => value / factor
});
var unitRegistry = {
  "": { id: "dimensionless", name: "Dimensionless", symbol: "", dimension: "dimensionless", toSI: identity, fromSI: identity },
  m: { id: "meter", name: "meter", symbol: "m", dimension: "length", ...scale(1) },
  cm: { id: "centimeter", name: "centimeter", symbol: "cm", dimension: "length", ...scale(0.01) },
  mm: { id: "millimeter", name: "millimeter", symbol: "mm", dimension: "length", ...scale(1e-3) },
  km: { id: "kilometer", name: "kilometer", symbol: "km", dimension: "length", ...scale(1e3) },
  nm: { id: "nanometer", name: "nanometer", symbol: "nm", dimension: "length", ...scale(1e-9) },
  kg: { id: "kilogram", name: "kilogram", symbol: "kg", dimension: "mass", ...scale(1) },
  g: { id: "gram", name: "gram", symbol: "g", dimension: "mass", ...scale(1e-3) },
  s: { id: "second", name: "second", symbol: "s", dimension: "time", ...scale(1) },
  ms: { id: "millisecond", name: "millisecond", symbol: "ms", dimension: "time", ...scale(1e-3) },
  h: { id: "hour", name: "hour", symbol: "h", dimension: "time", ...scale(3600) },
  N: { id: "newton", name: "newton", symbol: "N", dimension: "force", ...scale(1) },
  dyn: { id: "dyne", name: "dyne", symbol: "dyn", dimension: "force", ...scale(1e-5) },
  J: { id: "joule", name: "joule", symbol: "J", dimension: "energy", ...scale(1) },
  kJ: { id: "kilojoule", name: "kilojoule", symbol: "kJ", dimension: "energy", ...scale(1e3) },
  eV: { id: "electronvolt", name: "electronvolt", symbol: "eV", dimension: "energy", ...scale(1602176634e-28) },
  erg: { id: "erg", name: "erg", symbol: "erg", dimension: "energy", ...scale(1e-7) },
  Pa: { id: "pascal", name: "pascal", symbol: "Pa", dimension: "pressure", ...scale(1) },
  kPa: { id: "kilopascal", name: "kilopascal", symbol: "kPa", dimension: "pressure", ...scale(1e3) },
  bar: { id: "bar", name: "bar", symbol: "bar", dimension: "pressure", ...scale(1e5) },
  Ba: { id: "barye", name: "barye", symbol: "Ba", dimension: "pressure", ...scale(0.1) },
  C: { id: "coulomb", name: "coulomb", symbol: "C", dimension: "charge", ...scale(1) },
  microC: { id: "microcoulomb", name: "microcoulomb", symbol: "microC", dimension: "charge", ...scale(1e-6) },
  V: { id: "volt", name: "volt", symbol: "V", dimension: "voltage", ...scale(1) },
  A: { id: "ampere", name: "ampere", symbol: "A", dimension: "current", ...scale(1) },
  mA: { id: "milliampere", name: "milliampere", symbol: "mA", dimension: "current", ...scale(1e-3) },
  W: { id: "watt", name: "watt", symbol: "W", dimension: "power", ...scale(1) },
  Hz: { id: "hertz", name: "hertz", symbol: "Hz", dimension: "frequency", ...scale(1) },
  kHz: { id: "kilohertz", name: "kilohertz", symbol: "kHz", dimension: "frequency", ...scale(1e3) },
  THz: { id: "terahertz", name: "terahertz", symbol: "THz", dimension: "frequency", ...scale(1e12) },
  K: { id: "kelvin", name: "kelvin", symbol: "K", dimension: "temperature", ...scale(1) },
  degC: { id: "celsius", name: "degree Celsius", symbol: "C", dimension: "temperature", toSI: (value) => value + 273.15, fromSI: (value) => value - 273.15 },
  "m^3": { id: "cubic-meter", name: "cubic meter", symbol: "m^3", dimension: "volume", ...scale(1) },
  L: { id: "liter", name: "liter", symbol: "L", dimension: "volume", ...scale(1e-3) },
  "kg/m^3": { id: "kilogram-per-cubic-meter", name: "kilogram per cubic meter", symbol: "kg/m^3", dimension: "density", ...scale(1) },
  "kg m/s": { id: "kilogram-meter-per-second", name: "kilogram meter per second", symbol: "kg m/s", dimension: "momentum", ...scale(1) },
  "m/s": { id: "meter-per-second", name: "meter per second", symbol: "m/s", dimension: "velocity", ...scale(1) },
  "cm/s": { id: "centimeter-per-second", name: "centimeter per second", symbol: "cm/s", dimension: "velocity", ...scale(0.01) },
  "m/s^2": { id: "meter-per-second-squared", name: "meter per second squared", symbol: "m/s^2", dimension: "acceleration", ...scale(1) },
  "cm/s^2": { id: "centimeter-per-second-squared", name: "centimeter per second squared", symbol: "cm/s^2", dimension: "acceleration", ...scale(0.01) },
  rad: { id: "radian", name: "radian", symbol: "rad", dimension: "angle", ...scale(1) },
  deg: { id: "degree", name: "degree", symbol: "deg", dimension: "angle", toSI: (value) => value * Math.PI / 180, fromSI: (value) => value * 180 / Math.PI },
  "rad/s": { id: "radian-per-second", name: "radian per second", symbol: "rad/s", dimension: "angularVelocity", ...scale(1) },
  "rad/s^2": { id: "radian-per-second-squared", name: "radian per second squared", symbol: "rad/s^2", dimension: "angularAcceleration", ...scale(1) },
  "N/C": { id: "newton-per-coulomb", name: "newton per coulomb", symbol: "N/C", dimension: "electricField", ...scale(1) },
  T: { id: "tesla", name: "tesla", symbol: "T", dimension: "magneticField", ...scale(1) },
  F: { id: "farad", name: "farad", symbol: "F", dimension: "capacitance", ...scale(1) },
  ohm: { id: "ohm", name: "ohm", symbol: "ohm", dimension: "resistance", ...scale(1) }
};
function quantity(value, unit, dimension) {
  const definition = unitRegistry[unit];
  const resolvedDimension = dimension ?? definition?.dimension;
  if (!resolvedDimension) {
    console.warn(`[units] Unknown unit "${unit}". Treating as dimensionless.`);
    return { value, unit, dimension: "dimensionless" };
  }
  if (definition && definition.dimension !== resolvedDimension) {
    console.warn(`[units] Unit "${unit}" has dimension ${definition.dimension}, expected ${resolvedDimension}.`);
  }
  return { value, unit, dimension: resolvedDimension };
}
function validateDimensions(result, expected, context = "calculation") {
  if (result.dimension !== expected) {
    const message = `[dimension] ${context} returned ${result.dimension}; expected ${expected}.`;
    console.warn(message);
    return message;
  }
  return "";
}
function assertDimensions(result, expected, context = "calculation") {
  const warning = validateDimensions(result, expected, context);
  if (warning) throw new Error(warning);
  return result;
}

// src/lib/labCalculators/kinematics.ts
function freeFallDistance(initialVelocity, gravity, time) {
  return assertDimensions(quantity(initialVelocity * time + 0.5 * gravity * time * time, "m", "length"), "length", "freeFallDistance");
}
function freeFallVelocity(initialVelocity, gravity, time) {
  return assertDimensions(quantity(initialVelocity + gravity * time, "m/s", "velocity"), "velocity", "freeFallVelocity");
}
function projectileRange(speed, angleDegrees, gravity) {
  const theta = angleDegrees * Math.PI / 180;
  return assertDimensions(quantity(speed * speed * Math.sin(2 * theta) / gravity, "m", "length"), "length", "projectileRange");
}
function projectileTimeOfFlight(speed, angleDegrees, gravity) {
  const theta = angleDegrees * Math.PI / 180;
  return assertDimensions(quantity(2 * speed * Math.sin(theta) / gravity, "s", "time"), "time", "projectileTimeOfFlight");
}

// src/lib/labCalculators/dynamics.ts
function newtonSecondLaw(force, mass) {
  if (mass <= 0) throw new Error("Mass must be positive.");
  return assertDimensions(quantity(force / mass, "m/s^2", "acceleration"), "acceleration", "newtonSecondLaw");
}
function hookeForce(springConstant, extension) {
  return assertDimensions(quantity(-springConstant * extension, "N", "force"), "force", "hookeForce");
}
function pendulumPeriod(length, gravity) {
  if (length <= 0 || gravity <= 0) throw new Error("Length and gravity must be positive.");
  return assertDimensions(quantity(2 * Math.PI * Math.sqrt(length / gravity), "s", "time"), "time", "pendulumPeriod");
}

// src/lib/labCalculators/fluids.ts
function pressure(force, area) {
  if (area <= 0) throw new Error("Area must be positive.");
  return assertDimensions(quantity(force / area, "Pa", "pressure"), "pressure", "pressure");
}
function buoyantForce(fluidDensity, gravity, displacedVolume) {
  return assertDimensions(quantity(fluidDensity * gravity * displacedVolume, "N", "force"), "force", "buoyantForce");
}

// src/lib/physicsConstants.ts
var codata2022 = "CODATA 2022 / SI exact where defined";
var physicsConstants = {
  c: { symbol: "c", name: "speed of light in vacuum", value: 299792458, unit: "m/s", reference: "SI exact" },
  h: { symbol: "h", name: "Planck constant", value: 662607015e-42, unit: "J s", reference: "SI exact" },
  hbar: { symbol: "hbar", name: "reduced Planck constant", value: 1054571817e-43, unit: "J s", reference: codata2022 },
  e: { symbol: "e", name: "elementary charge", value: 1602176634e-28, unit: "C", reference: "SI exact" },
  G: { symbol: "G", name: "Newtonian gravitational constant", value: 66743e-15, unit: "m^3 kg^-1 s^-2", reference: codata2022 },
  g: { symbol: "g", name: "standard gravity", value: 9.80665, unit: "m/s^2", reference: "NIST standard gravity" },
  k: { symbol: "k", name: "Boltzmann constant", value: 1380649e-29, unit: "J/K", reference: "SI exact" },
  R: { symbol: "R", name: "molar gas constant", value: 8.31446261815324, unit: "J mol^-1 K^-1", reference: "Derived from exact constants" },
  NA: { symbol: "N_A", name: "Avogadro constant", value: 602214076e15, unit: "mol^-1", reference: "SI exact" },
  epsilon0: { symbol: "epsilon_0", name: "vacuum permittivity", value: 88541878128e-22, unit: "F/m", reference: codata2022 },
  mu0: { symbol: "mu_0", name: "vacuum permeability", value: 125663706212e-17, unit: "N/A^2", reference: codata2022 },
  sigma: { symbol: "sigma", name: "Stefan-Boltzmann constant", value: 5670374419e-17, unit: "W m^-2 K^-4", reference: "SI exact derived" },
  electronMass: { symbol: "m_e", name: "electron mass", value: 91093837139e-41, unit: "kg", reference: codata2022 },
  protonMass: { symbol: "m_p", name: "proton mass", value: 167262192595e-38, unit: "kg", reference: codata2022 },
  neutronMass: { symbol: "m_n", name: "neutron mass", value: 167492750056e-38, unit: "kg", reference: codata2022 }
};

// src/lib/labCalculators/thermodynamics.ts
function idealGasPressure(moles, temperatureKelvin, volume) {
  if (volume <= 0 || temperatureKelvin < 0) throw new Error("Volume must be positive and temperature must be absolute.");
  return assertDimensions(quantity(moles * physicsConstants.R.value * temperatureKelvin / volume, "Pa", "pressure"), "pressure", "idealGasPressure");
}

// src/lib/labCalculators/electricity.ts
function ohmsLawVoltage(current, resistance) {
  return assertDimensions(quantity(current * resistance, "V", "voltage"), "voltage", "ohmsLawVoltage");
}
function seriesResistance(...resistances) {
  return assertDimensions(quantity(resistances.reduce((sum, value) => sum + value, 0), "ohm", "resistance"), "resistance", "seriesResistance");
}
function parallelResistance(...resistances) {
  if (resistances.some((value) => value <= 0)) throw new Error("Parallel resistances must be positive.");
  return assertDimensions(quantity(1 / resistances.reduce((sum, value) => sum + 1 / value, 0), "ohm", "resistance"), "resistance", "parallelResistance");
}

// src/lib/labCalculators/optics.ts
function snellRefractionAngle(incidentAngleDegrees, n1, n2) {
  const argument = n1 * Math.sin(incidentAngleDegrees * Math.PI / 180) / n2;
  if (Math.abs(argument) > 1) throw new Error("Total internal reflection; no refracted ray.");
  return assertDimensions(quantity(Math.asin(argument) * 180 / Math.PI, "deg", "angle"), "angle", "snellRefractionAngle");
}
function mirrorImageDistance(focalLength, objectDistance) {
  const denominator = 1 / focalLength - 1 / objectDistance;
  if (denominator === 0) throw new Error("Image at infinity.");
  return assertDimensions(quantity(1 / denominator, "m", "length"), "length", "mirrorImageDistance");
}
function lensImageDistance(focalLength, objectDistance) {
  const denominator = 1 / focalLength + 1 / objectDistance;
  if (denominator === 0) throw new Error("Image at infinity.");
  return assertDimensions(quantity(1 / denominator, "m", "length"), "length", "lensImageDistance");
}

// src/lib/labCalculators/waves.ts
function waveSpeed(frequency, wavelength) {
  return assertDimensions(quantity(frequency * wavelength, "m/s", "velocity"), "velocity", "waveSpeed");
}

// src/lib/labCalculators/modernPhysics.ts
function photoelectricKineticEnergy(photonEnergyEv, workFunctionEv) {
  return assertDimensions(quantity(Math.max(0, photonEnergyEv - workFunctionEv), "eV", "energy"), "energy", "photoelectricKineticEnergy");
}
function halfLifeRemaining(initialCount, elapsedTime, halfLife) {
  if (halfLife <= 0) throw new Error("Half-life must be positive.");
  return quantity(initialCount * 0.5 ** (elapsedTime / halfLife), "", "dimensionless");
}

// src/lib/accuracyValidation.ts
var caseOf = (id, domain, experimentId, name, inputSummary, expected, tolerance, sourceRef, assumption, actual) => ({ id, domain, experimentId, name, inputSummary, expected, tolerance, sourceRef, assumption, actual });
var accuracyValidationCases = [
  caseOf("freefall-distance-earth", "Kinematics", "free-fall", "Free fall distance on Earth", "u=0 m/s, g=9.8 m/s2, t=2 s", 19.6, 1e-12, "constant-acceleration", "Uniform gravity and no drag.", () => freeFallDistance(0, 9.8, 2).value),
  caseOf("freefall-velocity-earth", "Kinematics", "free-fall", "Free fall velocity", "u=0 m/s, g=9.8 m/s2, t=3 s", 29.4, 1e-12, "constant-acceleration", "Uniform gravity and no drag.", () => freeFallVelocity(0, 9.8, 3).value),
  caseOf("projectile-range-45", "Kinematics", "projectile-motion", "Projectile range at 45 degrees", "v=10 m/s, theta=45 deg, g=10 m/s2", 10, 1e-12, "constant-acceleration", "Launch and landing heights match.", () => projectileRange(10, 45, 10).value),
  caseOf("projectile-time-45", "Kinematics", "projectile-motion", "Projectile time of flight", "v=20 m/s, theta=45 deg, g=10 m/s2", 2.828427124746, 1e-9, "constant-acceleration", "Launch and landing heights match.", () => projectileTimeOfFlight(20, 45, 10).value),
  caseOf("newton-second-law-basic", "Dynamics", "newton-s-second-law", "Newton second law", "F=10 N, m=2 kg", 5, 1e-12, "newtonian-mechanics", "Mass is positive and constant.", () => newtonSecondLaw(10, 2).value),
  caseOf("newton-second-law-negative-force", "Dynamics", "balanced-unbalanced-forces", "Signed acceleration", "F=-12 N, m=3 kg", -4, 1e-12, "newtonian-mechanics", "One-dimensional net force.", () => newtonSecondLaw(-12, 3).value),
  caseOf("hooke-law-basic", "Dynamics", "shm-spring", "Hooke restoring force", "k=100 N/m, x=0.2 m", -20, 1e-12, "newtonian-mechanics", "Ideal linear spring.", () => hookeForce(100, 0.2).value),
  caseOf("pendulum-period-earth", "Dynamics", "simple-pendulum", "Small-angle pendulum period", "L=1 m, g=9.80665 m/s2", 2.006409292589, 1e-9, "ideal-waves", "Small-angle approximation.", () => pendulumPeriod(1, 9.80665).value),
  caseOf("pressure-force-area", "Fluids", "force-and-pressure", "Pressure from force and area", "F=10 N, A=2 m2", 5, 1e-12, "hydrostatics", "Uniform force over area.", () => pressure(10, 2).value),
  caseOf("buoyancy-water", "Fluids", "buoyancy", "Buoyant force in water", "rho=1000 kg/m3, g=9.8 m/s2, V=0.01 m3", 98, 1e-12, "hydrostatics", "Object displaces fluid volume.", () => buoyantForce(1e3, 9.8, 0.01).value),
  caseOf("gas-law-room", "Thermodynamics", "gas-laws", "Ideal gas pressure", "n=1 mol, T=300 K, V=0.024943 m3", 1e5, 5, "equilibrium-thermo", "Ideal gas, kelvin temperature.", () => idealGasPressure(1, 300, 0.024943).value),
  caseOf("gas-law-double-temp", "Thermodynamics", "gas-laws", "Pressure doubles with temperature", "n=1 mol, T=600 K, V=0.024943 m3", 2e5, 10, "equilibrium-thermo", "Fixed volume and moles.", () => idealGasPressure(1, 600, 0.024943).value),
  caseOf("ohm-law-basic", "Electricity", "ohms-law", "Ohm law voltage", "I=2 A, R=5 ohm", 10, 1e-12, "ideal-circuits", "Ohmic conductor at constant temperature.", () => ohmsLawVoltage(2, 5).value),
  caseOf("series-resistance", "Electricity", "series-parallel-resistance", "Series resistance", "R=1,2,3 ohm", 6, 1e-12, "ideal-circuits", "Ideal series path.", () => seriesResistance(1, 2, 3).value),
  caseOf("parallel-resistance", "Electricity", "series-parallel-resistance", "Parallel resistance", "R=10,10 ohm", 5, 1e-12, "ideal-circuits", "Ideal parallel branches.", () => parallelResistance(10, 10).value),
  caseOf("snell-air-glass", "Optics", "glass-slab-refraction", "Snell refraction angle", "i=30 deg, n1=1, n2=1.5", 19.471220634491, 1e-9, "geometric-optics", "Angles measured from normal.", () => snellRefractionAngle(30, 1, 1.5).value),
  caseOf("lens-formula-basic", "Optics", "lens-formula", "Convex lens image distance", "f=10 cm, u=30 cm", 7.5, 1e-12, "geometric-optics", "Thin lens and sign convention.", () => lensImageDistance(10, 30).value),
  caseOf("mirror-formula-basic", "Optics", "mirror-formula", "Mirror image distance", "f=10 cm, u=30 cm", 15, 1e-12, "geometric-optics", "Paraxial ray model.", () => mirrorImageDistance(10, 30).value),
  caseOf("wave-speed-sound", "Waves", "sound-pitch-loudness", "Sound wave relation", "f=440 Hz, lambda=0.78 m", 343.2, 1e-9, "ideal-waves", "Uniform medium.", () => waveSpeed(440, 0.78).value),
  caseOf("wave-speed-light", "Waves", "em-spectrum", "EM wave relation", "f=2.4e9 Hz, lambda=0.125 m", 3e8, 1e-3, "ideal-waves", "Vacuum-like propagation.", () => waveSpeed(24e8, 0.125).value),
  caseOf("photoelectric-threshold", "Modern Physics", "photoelectric-equation", "Photoelectric kinetic energy", "E=3 eV, phi=2 eV", 1, 1e-12, "modern-physics", "Electron energy in eV.", () => photoelectricKineticEnergy(3, 2).value),
  caseOf("photoelectric-below-threshold", "Modern Physics", "photoelectric-equation", "Below threshold emission", "E=2 eV, phi=3 eV", 0, 1e-12, "modern-physics", "No emission below work function.", () => photoelectricKineticEnergy(2, 3).value),
  caseOf("half-life-two-halves", "Modern Physics", "nuclear-decay", "Half-life remaining nuclei", "N0=100, t=20, T=10", 25, 1e-12, "modern-physics", "Ideal exponential decay.", () => halfLifeRemaining(100, 20, 10).value)
];
var accuracyValidationResults = accuracyValidationCases.map(runCase);
var accuracyDomainSummaries = summarizeByDomain(accuracyValidationResults);
var experimentAccuracyProfiles = experiments.map(profileForExperiment).sort((left, right) => right.modelGrade - left.modelGrade || right.validationCases - left.validationCases);
var accuracyAuditStats = {
  cases: accuracyValidationResults.length,
  passing: accuracyValidationResults.filter((item) => item.status === "pass").length,
  failing: accuracyValidationResults.filter((item) => item.status === "fail").length,
  executableChecks: 201,
  domains: accuracyDomainSummaries.length,
  flagshipModels: flagshipLabModels.length,
  validatedProfiles: experimentAccuracyProfiles.filter((item) => item.mode === "Validated solver").length,
  visualOnlyProfiles: experimentAccuracyProfiles.filter((item) => item.mode === "Visual illustration").length,
  formulaOnlyProfiles: experimentAccuracyProfiles.filter((item) => item.validationStatus === "formula-only").length,
  qualitativeProfiles: experimentAccuracyProfiles.filter((item) => item.validationStatus === "qualitative-visual").length,
  unsafeClaims: experimentAccuracyProfiles.filter((item) => item.validationStatus === "unsafe-claim").length,
  metadataProfiles: Object.keys(experimentValidationRegistry).length,
  averageGrade: Math.round(experimentAccuracyProfiles.reduce((sum, item) => sum + item.modelGrade, 0) / Math.max(1, experimentAccuracyProfiles.length)),
  pendingProfiles: experimentAccuracyProfiles.filter((item) => item.modelGrade < 70 || item.validationCases === 0).length
};
function runCase(test) {
  const actual = test.actual();
  const absError = Math.abs(actual - test.expected);
  const relativeError = test.expected === 0 ? absError : absError / Math.abs(test.expected);
  return {
    ...test,
    actual,
    absError,
    relativeError,
    status: Number.isFinite(actual) && absError <= test.tolerance ? "pass" : "fail"
  };
}
function summarizeByDomain(results) {
  return Array.from(new Set(results.map((item) => item.domain))).map((domain) => {
    const cases = results.filter((item) => item.domain === domain);
    const passing = cases.filter((item) => item.status === "pass").length;
    const worstRelativeError = Math.max(...cases.map((item) => item.relativeError));
    return {
      domain,
      cases: cases.length,
      passing,
      failing: cases.length - passing,
      passRate: Math.round(passing / Math.max(1, cases.length) * 100),
      worstRelativeError
    };
  });
}
function profileForExperiment(experiment) {
  const cases = accuracyValidationResults.filter((item) => item.experimentId === experiment.id);
  const metadata = getExperimentValidationMetadata(experiment.id);
  const metadataCases = metadata?.benchmarkCases ?? [];
  const totalCaseCount = cases.length + metadataCases.length;
  const passedCases = cases.filter((item) => item.status === "pass").length + metadataCases.filter((item) => item.pass).length;
  const failedCases = totalCaseCount - passedCases;
  const passRate = totalCaseCount ? Math.round(passedCases / totalCaseCount * 100) : 0;
  const validationStatus = validationStatusForExperiment(experiment, cases.length, passedCases, failedCases);
  const mode = modeForExperiment(experiment, validationStatus);
  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    mode,
    validationCases: totalCaseCount,
    passedCases,
    failedCases,
    passRate,
    modelGrade: modelGradeFor(experiment, mode, passRate, totalCaseCount, validationStatus),
    validationStatus,
    benchmarkSummary: metadata ? `${metadata.benchmarkCases.filter((item) => item.pass).length}/${metadata.benchmarkCases.length} metadata benchmarks, ${metadata.status}` : "No central validation metadata yet",
    graphExpectations: metadata?.graphExpectations.map((item) => `${item.label}: ${item.shape ?? item.direction ?? "documented"}`) ?? [],
    inputUnits: metadata?.inputUnits.map((item) => `${item.label}: ${item.displayUnit}${item.displayUnit !== item.siUnit ? ` -> ${item.siUnit}` : ""}`) ?? [],
    outputUnits: metadata?.outputUnits.map((item) => `${item.label}: ${item.displayUnit}`) ?? [],
    warnings: metadata?.warnings ?? [],
    guardrails: guardrailsFor(experiment, metadata),
    nextAccuracyActions: nextActionsFor2(experiment, mode, totalCaseCount, passRate, validationStatus)
  };
}
function validationStatusForExperiment(experiment, legacyCaseCount, passedCases, failedCases) {
  const metadata = getExperimentValidationMetadata(experiment.id);
  if (metadata) return metadata.status;
  if (legacyCaseCount > 0) return failedCases === 0 && passedCases > 0 ? "validated" : "unsafe-claim";
  if (experiment.evidenceType === "Visual Model" || experiment.modelClass === "Visualization") return "qualitative-visual";
  if (experiment.evidenceType === "Exact Formula" || experiment.modelClass === "Calculator") return "formula-only";
  return "needs-benchmark";
}
function modeForExperiment(experiment, validationStatus) {
  if (validationStatus === "validated") return "Validated solver";
  if (validationStatus === "formula-only") return "Formula calculator";
  if (validationStatus === "qualitative-visual") return "Visual illustration";
  if (experiment.evidenceType === "Exact Formula" || experiment.modelClass === "Calculator") return "Formula calculator";
  if (experiment.evidenceType === "Visual Model" || experiment.modelClass === "Visualization") return "Visual illustration";
  return "Sandbox starter";
}
function modelGradeFor(experiment, mode, passRate, caseCount, validationStatus) {
  let score = 45;
  if (mode === "Validated solver") score += 25;
  if (mode === "Formula calculator") score += 15;
  if (mode === "Visual illustration") score += 4;
  if (mode === "Sandbox starter") score -= 10;
  if (validationStatus === "unsafe-claim") score -= 28;
  if (validationStatus === "needs-benchmark") score -= 10;
  score += Math.min(18, caseCount * 6);
  score += Math.round(passRate / 100 * 12);
  if (experiment.assumptions?.length) score += 4;
  if (experiment.validRanges?.length) score += 3;
  if (experiment.failureConditions?.length) score += 3;
  if (experiment.sourceRefs?.length) score += 3;
  return Math.max(0, Math.min(100, score));
}
function guardrailsFor(experiment, metadata) {
  const model = getFlagshipLabModel(experiment.id);
  const rangeGuardrails = model?.controls.map((control) => `${control.label}: ${control.min} to ${control.max}`) ?? [];
  return [
    ...metadata?.assumptions.slice(0, 2) ?? [],
    ...metadata?.validRanges.slice(0, 2).map((item) => `${item.label}: ${item.min ?? "-\u221E"} to ${item.max ?? "+\u221E"} ${item.unit ?? ""}`) ?? [],
    ...experiment.assumptions?.slice(0, 2) ?? [],
    ...experiment.validRanges?.slice(0, 2) ?? [],
    ...rangeGuardrails.slice(0, 3)
  ].slice(0, 5);
}
function nextActionsFor2(experiment, mode, caseCount, passRate, validationStatus) {
  const actions = [];
  if (caseCount === 0) actions.push("Add at least two numeric benchmark cases with expected outputs and tolerance.");
  if (validationStatus === "formula-only") actions.push("Keep this labelled as formula-only until executable benchmark cases pass.");
  if (validationStatus === "needs-benchmark") actions.push("Do not display validated or accurate-calculator claims yet.");
  if (validationStatus === "unsafe-claim") actions.push("Remove quantitative accuracy claims until failed benchmarks are fixed.");
  if (passRate < 100 && caseCount > 0) actions.push("Fix failing benchmark cases before promoting the model.");
  if (mode === "Visual illustration") actions.push("Mark visuals as qualitative and separate them from numeric solver claims.");
  if (mode === "Sandbox starter") actions.push("Promote this starter to a lab-specific model or keep it out of flagship claims.");
  if (!experiment.validRanges?.length) actions.push("Add explicit valid ranges and singular/failure conditions.");
  if (!experiment.sourceRefs?.length) actions.push("Attach source references for formulas and assumptions.");
  if (!actions.length) actions.push("Ready for deeper Phase 3 visual and interaction upgrade.");
  return actions.slice(0, 5);
}

// src/lib/learningStudio.ts
var learningStudioProfiles = experiments.map(makeLearningProfile).sort((left, right) => right.readinessScore - left.readinessScore || left.title.localeCompare(right.title));
var learningStudioStats = makeLearningStats(learningStudioProfiles);
var phase3LessonPacks = makeLessonPacks(learningStudioProfiles);
function makeLearningProfile(experiment) {
  const quality = simulationQualityScores.find((item) => item.id === experiment.id);
  const accuracy = experimentAccuracyProfiles.find((item) => item.experimentId === experiment.id);
  const learningScore = quality?.dimensions.learning ?? 55;
  const classroomScore = quality?.dimensions.classroom ?? 55;
  const accuracyScore = accuracy?.modelGrade ?? quality?.dimensions.accuracy ?? 55;
  const readinessScore = clamp(Math.round(learningScore * 0.4 + classroomScore * 0.3 + accuracyScore * 0.2 + scoreEvidence(experiment) * 0.1));
  const misconception = firstUseful(experiment.commonMistakes, misconceptionFor(experiment));
  const firstFormula = experiment.formulae[0]?.expression;
  const primaryObservation = experiment.observationColumns[1] ?? "measured value";
  return {
    experimentId: experiment.id,
    title: experiment.title,
    category: experiment.category,
    classLevel: experiment.classLevel,
    difficulty: experiment.difficulty,
    learningScore,
    classroomScore,
    accuracyScore,
    readinessScore,
    priority: priorityFor2(experiment, learningScore, classroomScore),
    misconception,
    repairPrompt: repairPromptFor(experiment, misconception),
    lessonQuestion: `How can we use ${experiment.title.toLowerCase()} to predict ${primaryObservation.toLowerCase()} before reading the answer?`,
    successEvidence: `A strong learner can write a prediction, collect ${primaryObservation.toLowerCase()} data, explain the trend, and apply it to a new case.`,
    flow: makeFlow(experiment, firstFormula),
    teacherChecks: makeTeacherChecks(experiment, accuracyScore),
    studentOutputs: makeStudentOutputs(experiment)
  };
}
function makeFlow(experiment, formula) {
  const control = experiment.observationColumns[1] ?? experiment.apparatus[0] ?? "input";
  const output = experiment.observationColumns[experiment.observationColumns.length - 1] ?? "result";
  return [
    {
      stage: "Hook",
      studentAction: `Name a real situation where ${experiment.title.toLowerCase()} matters.`,
      teacherMove: `Show the apparatus list and ask which part changes the result most.`,
      evidence: "One everyday example with a reason."
    },
    {
      stage: "Predict",
      studentAction: `Predict how ${output.toLowerCase()} changes when ${control.toLowerCase()} changes.`,
      teacherMove: "Ask for a written prediction before sliders or visuals move.",
      evidence: "Prediction includes increase, decrease, or no-change language."
    },
    {
      stage: "Explore",
      studentAction: "Change one variable at a time and keep the others fixed.",
      teacherMove: "Pause after the first visible change and ask what stayed controlled.",
      evidence: "At least two controlled trials."
    },
    {
      stage: "Measure",
      studentAction: `Record ${experiment.observationColumns.slice(0, 4).join(", ")} with units.`,
      teacherMove: "Check units and ask students to circle the independent variable.",
      evidence: "A table with units and one repeated trial."
    },
    {
      stage: "Explain",
      studentAction: formula ? `Connect the pattern to ${formula}.` : "Connect the pattern to the stated theory.",
      teacherMove: "Ask students to explain the cause before giving the final rule.",
      evidence: "One sentence linking cause, equation, and observation."
    },
    {
      stage: "Apply",
      studentAction: "Solve a changed setup or explain a real-world transfer case.",
      teacherMove: "Change the context, not just the numbers.",
      evidence: "Correct transfer answer plus one limitation."
    }
  ];
}
function makeTeacherChecks(experiment, accuracyScore) {
  const checks = [
    "Prediction is written before simulation changes.",
    "Only one input changes per trial.",
    "Observation table includes units.",
    "Conclusion mentions the original aim."
  ];
  if (experiment.commonMistakes.length) checks.push(`Misconception check: ${experiment.commonMistakes[0]}`);
  if (accuracyScore < 70) checks.push("Do not present numeric output as validated beyond the stated range.");
  return checks.slice(0, 6);
}
function makeStudentOutputs(experiment) {
  return [
    "Prediction sentence",
    `${experiment.observationColumns.slice(0, 4).join(" / ")} table`,
    "Pattern explanation",
    "Formula or theory link",
    "One transfer example"
  ];
}
function scoreEvidence(experiment) {
  let score = 45;
  if (experiment.vivaQuestions.length) score += 12;
  if (experiment.commonMistakes.length >= 2) score += 12;
  if (experiment.observationColumns.length >= 4) score += 12;
  if (experiment.curriculumTags?.classes.length) score += 10;
  if (experiment.formulae.length) score += 9;
  return clamp(score);
}
function priorityFor2(experiment, learningScore, classroomScore) {
  if (learningScore < 68) return "Concept clarity";
  if (experiment.commonMistakes.length >= 2) return "Misconception repair";
  if (experiment.observationColumns.length >= 4) return "Measurement skill";
  if (classroomScore < 72) return "Teacher workflow";
  return "Transfer practice";
}
function misconceptionFor(experiment) {
  const category = experiment.category.toLowerCase();
  if (category.includes("optics")) return "Confusing the visible ray picture with the actual measured angle or image distance.";
  if (category.includes("electric")) return "Thinking current is used up instead of conserved through a simple circuit path.";
  if (category.includes("magnet")) return "Treating field direction and force direction as the same thing.";
  if (category.includes("wave")) return "Mixing amplitude, frequency, speed, and wavelength as if they were the same property.";
  if (category.includes("thermo")) return "Treating heat and temperature as identical quantities.";
  if (category.includes("fluid")) return "Confusing force, pressure, density, and depth effects.";
  if (category.includes("modern")) return "Expecting classical intuition to work without checking the quantum rule.";
  return "Changing more than one variable and then claiming a cause-effect conclusion.";
}
function repairPromptFor(experiment, misconception) {
  return `A student says: "${misconception}" Ask them to use ${experiment.title.toLowerCase()} data to prove, repair, or limit that claim.`;
}
function makeLearningStats(profiles) {
  const avg = (selector) => Math.round(profiles.reduce((sum, profile) => sum + selector(profile), 0) / Math.max(1, profiles.length));
  return {
    profiles: profiles.length,
    averageReadiness: avg((profile) => profile.readinessScore),
    readyLessons: profiles.filter((profile) => profile.readinessScore >= 78).length,
    misconceptionRepairs: profiles.filter((profile) => profile.misconception.length > 0).length,
    teacherReady: profiles.filter((profile) => profile.classroomScore >= 76).length,
    transferPrompts: profiles.length
  };
}
function makeLessonPacks(profiles) {
  return Object.entries(
    profiles.reduce((groups, profile) => {
      groups[profile.category] = [...groups[profile.category] ?? [], profile];
      return groups;
    }, {})
  ).map(([category, items]) => ({
    category,
    count: items.length,
    averageReadiness: Math.round(items.reduce((sum, item) => sum + item.readinessScore, 0) / items.length),
    strongest: [...items].sort((left, right) => right.readinessScore - left.readinessScore).slice(0, 3),
    focus: focusForCategory(category)
  })).sort((left, right) => right.averageReadiness - left.averageReadiness || left.category.localeCompare(right.category));
}
function focusForCategory(category) {
  if (category.includes("Optics")) return "Ray tracing, image prediction, and angle measurement.";
  if (category.includes("Electric")) return "Circuit reasoning, proportionality, and safe measurement.";
  if (category.includes("Magnet")) return "Field direction, induction, and cause-effect sequencing.";
  if (category.includes("Wave")) return "Graph reading, frequency-wavelength links, and interference language.";
  if (category.includes("Thermo")) return "Heat, temperature, energy flow, and equilibrium reasoning.";
  if (category.includes("Fluid")) return "Pressure-depth-density comparisons with units.";
  if (category.includes("Modern")) return "Model limits, evidence, and quantum rule application.";
  return "Prediction, controlled variables, and transfer explanation.";
}
function firstUseful(values, fallback) {
  return values.find((value) => value.trim().length > 0) ?? fallback;
}
function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// outputs/lesson-catalog-20260902/extract_lessons.ts
var experimentById = new Map(experiments.map((item) => [item.id, item]));
var profileById = new Map(learningStudioProfiles.map((item) => [item.experimentId, item]));
var curriculumTopics = curriculum.flatMap(
  (level) => level.units.flatMap(
    (unit) => unit.topics.map((topic2) => ({
      classId: level.id,
      grade: level.grade,
      classLabel: level.label,
      curriculumSource: level.source,
      classDescription: level.description,
      unitId: unit.id,
      unitTitle: unit.title,
      unitMarks: unit.marks ?? null,
      topicId: topic2.id,
      topicTitle: topic2.title,
      domain: topic2.domain,
      stage: topic2.stage,
      outcomes: topic2.outcomes,
      tools: topic2.tools,
      experimentIds: topic2.experimentIds
    }))
  )
);
var lessonMappings = curriculumTopics.flatMap(
  (topic2) => topic2.experimentIds.length ? topic2.experimentIds.map((experimentId) => {
    const lesson = experimentById.get(experimentId);
    const profile = profileById.get(experimentId);
    return {
      ...topic2,
      lessonId: experimentId,
      lessonTitle: lesson?.title ?? "Unresolved experiment",
      lessonCategory: lesson?.category ?? "Unresolved",
      difficulty: lesson?.difficulty ?? "",
      classLevel: lesson?.classLevel ?? "",
      aim: lesson?.aim ?? "",
      theory: lesson?.theory ?? "",
      formulae: lesson?.formulae.map((formula) => `${formula.name}: ${formula.expression}`) ?? [],
      apparatus: lesson?.apparatus ?? [],
      procedure: lesson?.procedure ?? [],
      observationColumns: lesson?.observationColumns ?? [],
      expectedResult: lesson?.expectedResult ?? "",
      readinessScore: profile?.readinessScore ?? null,
      priority: profile?.priority ?? "",
      lessonQuestion: profile?.lessonQuestion ?? "",
      misconception: profile?.misconception ?? "",
      successEvidence: profile?.successEvidence ?? ""
    };
  }) : [{
    ...topic2,
    lessonId: "",
    lessonTitle: "No mapped interactive lesson",
    lessonCategory: topic2.domain,
    difficulty: "",
    classLevel: topic2.classLabel,
    aim: "",
    theory: "",
    formulae: [],
    apparatus: [],
    procedure: [],
    observationColumns: [],
    expectedResult: "",
    readinessScore: null,
    priority: "",
    lessonQuestion: "",
    misconception: "",
    successEvidence: ""
  }]
);
var lessonProfiles = experiments.map((lesson) => {
  const profile = profileById.get(lesson.id);
  const mappedTopics = curriculumTopics.filter((topic2) => topic2.experimentIds.includes(lesson.id));
  return {
    lessonId: lesson.id,
    title: lesson.title,
    category: lesson.category,
    classLevel: lesson.classLevel,
    difficulty: lesson.difficulty,
    mappedClasses: [...new Set(mappedTopics.map((item) => item.classLabel))],
    mappedUnits: [...new Set(mappedTopics.map((item) => item.unitTitle))],
    mappedTopics: [...new Set(mappedTopics.map((item) => item.topicTitle))],
    curriculumDomains: lesson.curriculumTags?.domains ?? [],
    aim: lesson.aim,
    theory: lesson.theory,
    apparatus: lesson.apparatus,
    formulae: lesson.formulae.map((formula) => `${formula.name}: ${formula.expression}`),
    procedure: lesson.procedure,
    observationColumns: lesson.observationColumns,
    expectedResult: lesson.expectedResult,
    commonMistakes: lesson.commonMistakes,
    vivaCount: lesson.vivaQuestions.length,
    readinessScore: profile?.readinessScore ?? null,
    learningScore: profile?.learningScore ?? null,
    classroomScore: profile?.classroomScore ?? null,
    accuracyScore: profile?.accuracyScore ?? null,
    priority: profile?.priority ?? "",
    lessonQuestion: profile?.lessonQuestion ?? "",
    successEvidence: profile?.successEvidence ?? "",
    teacherChecks: profile?.teacherChecks ?? [],
    studentOutputs: profile?.studentOutputs ?? []
  };
});
fs.writeFileSync(
  new URL("./lesson_data.json", import.meta.url),
  JSON.stringify({ curriculumTopics, lessonMappings, lessonProfiles }, null, 2)
);
console.log(JSON.stringify({
  curriculumLevels: curriculum.length,
  curriculumTopics: curriculumTopics.length,
  lessonMappings: lessonMappings.length,
  lessons: lessonProfiles.length,
  unmappedLessons: lessonProfiles.filter((item) => item.mappedTopics.length === 0).length,
  unresolvedMappings: lessonMappings.filter((item) => item.lessonId && item.lessonTitle === "Unresolved experiment").length
}));
