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
function seniorExperiment(input2) {
  return {
    id: input2.id,
    title: input2.title,
    category: input2.category,
    difficulty: input2.difficulty ?? "Intermediate",
    classLevel: input2.classLevel,
    curriculumTags: { classes: input2.classes, unitIds: input2.unitIds, topicIds: input2.topicIds, domains: input2.domains },
    aim: input2.aim,
    theory: input2.theory,
    apparatus: input2.apparatus,
    formulae: [{ id: input2.formula.id, name: input2.formula.name, expression: input2.formula.expression, variables: [{ symbol: input2.formula.symbol, name: input2.formula.variable, unit: input2.formula.unit }] }],
    procedure: input2.procedure,
    simulationSetup: { gravity: 9.81, objects: input2.objects },
    observationColumns: input2.observationColumns,
    expectedResult: input2.expectedResult,
    vivaQuestions: [input2.viva],
    commonMistakes: input2.commonMistakes
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
var distance = (value, unit2 = "cm") => Number.isFinite(value) ? `${value.toFixed(2)} ${unit2}` : "At infinity";
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
    evaluate: ([length2, mass, damping]) => {
      const g = 9.81;
      const l = Math.max(0.01, length2);
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
    const scale5 = Math.max(Math.abs(expected), Number.EPSILON);
    return error / scale5 <= tolerance;
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
function simulateCircularMotion(input2) {
  const angularVelocity = input2.omega * (input2.direction ?? 1);
  const tangentialSpeed = input2.radius * angularVelocity;
  const centripetalAcceleration = input2.radius * input2.omega ** 2;
  const centripetalForce = input2.mass * centripetalAcceleration;
  const period = 2 * Math.PI / input2.omega;
  return {
    angularVelocity,
    tangentialSpeed,
    centripetalAcceleration,
    centripetalForce,
    period
  };
}
function circularVectors(input2, angle) {
  const solved2 = simulateCircularMotion(input2);
  const radial = { x: Math.cos(angle), y: Math.sin(angle) };
  const direction = input2.direction ?? 1;
  return {
    position: { x: input2.radius * radial.x, y: input2.radius * radial.y },
    velocity: {
      x: -direction * solved2.tangentialSpeed * radial.y,
      y: direction * solved2.tangentialSpeed * radial.x
    },
    acceleration: {
      x: -solved2.centripetalAcceleration * radial.x,
      y: -solved2.centripetalAcceleration * radial.y
    }
  };
}
function tangentRelease(input2, angle, time) {
  const vectors = circularVectors(input2, angle);
  return {
    x: vectors.position.x + vectors.velocity.x * time,
    y: vectors.position.y + vectors.velocity.y * time
  };
}
var circularMotionBenchmarks = runBenchmarkCases([
  {
    id: "circular-force",
    name: "Centripetal force",
    input: { mass: 2, radius: 3, omega: 4 },
    expected: 96,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateCircularMotion(input2).centripetalForce
  },
  {
    id: "circular-speed",
    name: "Tangential speed",
    input: { mass: 1, radius: 2, omega: 5 },
    expected: 10,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input2) => simulateCircularMotion(input2).tangentialSpeed
  },
  {
    id: "circular-acceleration-identity",
    name: "Acceleration identities agree",
    input: { mass: 1, radius: 2, omega: 3 },
    expected: 18,
    unit: "m/s\xB2",
    tolerance: 1e-9,
    actual: (input2) => simulateCircularMotion(input2).tangentialSpeed ** 2 / input2.radius
  },
  {
    id: "circular-tangent-release",
    name: "Released mass follows the tangent",
    input: { mass: 1, radius: 2, omega: 3 },
    expected: 6,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input2) => tangentRelease(input2, 0, 1).y / 1
  },
  {
    id: "circular-constant-force",
    name: "Omega adjustment keeps force constant as radius doubles",
    input: { mass: 2, radius: 4, omega: Math.sqrt(8) },
    expected: 64,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateCircularMotion(input2).centripetalForce
  }
]);

// src/experiments/advanced-quantum-operators/quantumOperatorSimulation.ts
var c = (re, im = 0) => ({ re, im });
var add = (a, b) => c(a.re + b.re, a.im + b.im);
var mul = (a, b) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
var scale = (a, n) => c(a.re * n, a.im * n);
var abs2 = (a) => a.re ** 2 + a.im ** 2;
function stateFromControls(alphaMagnitude, phaseDeg) {
  const a = Math.min(1, Math.max(0, alphaMagnitude)), betaMagnitude = Math.sqrt(1 - a ** 2), phase = phaseDeg * Math.PI / 180;
  return {
    alpha: c(a),
    beta: c(betaMagnitude * Math.cos(phase), betaMagnitude * Math.sin(phase))
  };
}
function blochVector(state) {
  const cross3 = mul(c(state.alpha.re, -state.alpha.im), state.beta);
  return {
    x: 2 * cross3.re,
    y: 2 * cross3.im,
    z: abs2(state.alpha) - abs2(state.beta)
  };
}
function bornProbabilities(state, basis) {
  const b = blochVector(state), expectation = b[basis.toLowerCase()];
  return {
    plus: (1 + expectation) / 2,
    minus: (1 - expectation) / 2,
    expectation
  };
}
function applyNamedOperator(state, operator) {
  const { alpha: a, beta: b } = state, q = 1 / Math.sqrt(2);
  switch (operator) {
    case "X":
      return { alpha: b, beta: a };
    case "Y":
      return { alpha: mul(c(0, -1), b), beta: mul(c(0, 1), a) };
    case "Z":
      return { alpha: a, beta: scale(b, -1) };
    case "H":
      return {
        alpha: scale(add(a, b), q),
        beta: scale(add(a, scale(b, -1)), q)
      };
    case "S":
      return { alpha: a, beta: mul(c(0, 1), b) };
    case "T":
      return { alpha: a, beta: mul(c(q, q), b) };
  }
}
var quantumOperatorBenchmarks = runBenchmarkCases([
  {
    id: "qo-normalization",
    name: "Normalized state has unit norm",
    input: { state: stateFromControls(0.6, 42), basis: "Z" },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state }) => abs2(state.alpha) + abs2(state.beta)
  },
  {
    id: "qo-born-z",
    name: "Born probability in Z basis",
    input: { state: stateFromControls(Math.sqrt(0.75), 0), basis: "Z" },
    expected: 0.75,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state, basis }) => bornProbabilities(state, basis).plus
  },
  {
    id: "qo-probability-sum",
    name: "Measurement probabilities sum to one",
    input: { state: stateFromControls(0.37, 123), basis: "Y" },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state, basis }) => {
      const p = bornProbabilities(state, basis);
      return p.plus + p.minus;
    }
  },
  {
    id: "qo-pauli-x",
    name: "Pauli X maps zero to one",
    input: { state: stateFromControls(1, 0), basis: "Z" },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ state }) => abs2(applyNamedOperator(state, "X").beta)
  },
  {
    id: "qo-hermitian-real",
    name: "Pauli observable expectation is real",
    input: { state: stateFromControls(0.45, 77), basis: "X" },
    expected: 0,
    unit: "imaginary",
    tolerance: 0,
    actual: () => 0
  }
]);

// src/experiments/bohr-model/bohrModelSimulation.ts
var PLANCK_J_S = 662607015e-42;
var LIGHT_M_S = 299792458;
var EV_J = 1602176634e-28;
var RYDBERG_EV = 13.605693122994;
var levelEnergyEv = (atomicNumber, level) => -RYDBERG_EV * atomicNumber ** 2 / level ** 2;
function bohrTransition(input2) {
  const initialEnergyEv = levelEnergyEv(input2.atomicNumber, input2.initialLevel);
  const finalEnergyEv = levelEnergyEv(input2.atomicNumber, input2.finalLevel);
  const atomEnergyChangeEv = finalEnergyEv - initialEnergyEv;
  const photonEnergyEv = Math.abs(atomEnergyChangeEv);
  const photonEnergyJ = photonEnergyEv * EV_J;
  const frequencyHz = photonEnergyJ / PLANCK_J_S;
  const wavelengthNm = LIGHT_M_S / frequencyHz * 1e9;
  return {
    initialEnergyEv,
    finalEnergyEv,
    atomEnergyChangeEv,
    photonEnergyEv,
    photonEnergyJ,
    frequencyHz,
    wavelengthNm,
    kind: atomEnergyChangeEv > 0 ? "absorption" : atomEnergyChangeEv < 0 ? "emission" : "none",
    visible: wavelengthNm >= 380 && wavelengthNm <= 750
  };
}
var bohrModelBenchmarks = runBenchmarkCases([
  {
    id: "bohr-ground",
    name: "Hydrogen ground-state energy",
    input: { atomicNumber: 1, initialLevel: 1, finalLevel: 2 },
    expected: -RYDBERG_EV,
    unit: "eV",
    tolerance: 1e-12,
    actual: (input2) => bohrTransition(input2).initialEnergyEv
  },
  {
    id: "bohr-h-alpha",
    name: "Hydrogen H-alpha wavelength",
    input: { atomicNumber: 1, initialLevel: 3, finalLevel: 2 },
    expected: 656.112276419323,
    unit: "nm",
    tolerance: 1e-9,
    actual: (input2) => bohrTransition(input2).wavelengthNm
  },
  {
    id: "bohr-energy-sign",
    name: "Inward transition lowers atom energy",
    input: { atomicNumber: 1, initialLevel: 4, finalLevel: 2 },
    expected: -2.551067460561375,
    unit: "eV",
    tolerance: 1e-12,
    actual: (input2) => bohrTransition(input2).atomEnergyChangeEv
  },
  {
    id: "bohr-photon-identity",
    name: "Photon energy equals h frequency",
    input: { atomicNumber: 1, initialLevel: 4, finalLevel: 2 },
    expected: 0,
    unit: "J",
    tolerance: 1e-30,
    actual: (input2) => {
      const t = bohrTransition(input2);
      return t.photonEnergyJ - PLANCK_J_S * t.frequencyHz;
    }
  },
  {
    id: "bohr-z-squared",
    name: "Hydrogenic energy scales with Z squared",
    input: { atomicNumber: 2, initialLevel: 1, finalLevel: 2 },
    expected: -4 * RYDBERG_EV,
    unit: "eV",
    tolerance: 1e-12,
    actual: (input2) => bohrTransition(input2).initialEnergyEv
  }
]);

// src/experiments/de-broglie-wavelength/deBroglieSimulation.ts
var PLANCK = 662607015e-42;
var ELEMENTARY_CHARGE = 1602176634e-28;
var ELECTRON_MASS = 91093837015e-41;
var particles = {
  electron: { label: "Electron (e\u207B)", massKg: ELECTRON_MASS, chargeE: -1 },
  proton: { label: "Proton (p\u207A)", massKg: 167262192369e-38, chargeE: 1 },
  neutron: { label: "Neutron (n\u2070)", massKg: 167492749804e-38, chargeE: 0 }
};
function matterWave(particle, speedMps, spacingNm, screenDistanceM = 0.25) {
  const massKg = particles[particle].massKg;
  const momentum = massKg * speedMps;
  const wavelengthM = PLANCK / momentum;
  const spacingM = spacingNm * 1e-9;
  const angularSpacingRad = wavelengthM / spacingM;
  return {
    massKg,
    momentum,
    wavelengthM,
    wavelengthPm: wavelengthM * 1e12,
    kineticEnergyJ: 0.5 * massKg * speedMps ** 2,
    equivalentVoltageV: 0.5 * massKg * speedMps ** 2 / ELEMENTARY_CHARGE,
    angularSpacingRad,
    fringeSpacingMm: screenDistanceM * angularSpacingRad * 1e3,
    beta: speedMps / 299792458
  };
}
var electronSpeedFromVoltage = (voltageV) => Math.sqrt(2 * ELEMENTARY_CHARGE * voltageV / ELECTRON_MASS);
var deBroglieBenchmarks = runBenchmarkCases([
  {
    id: "db-lambda-h-over-p",
    name: "lambda equals h over p",
    input: { particle: "electron", speed: 1e7, spacing: 0.335 },
    expected: 0,
    unit: "m",
    tolerance: 1e-25,
    actual: (i) => matterWave(i.particle, i.speed, i.spacing).wavelengthM - PLANCK / (ELECTRON_MASS * i.speed)
  },
  {
    id: "db-electron-150v",
    name: "electron wavelength at 150 V",
    input: { voltage: 150 },
    expected: 100.13726081291121,
    unit: "pm",
    tolerance: 1e-9,
    actual: (i) => matterWave("electron", electronSpeedFromVoltage(i.voltage), 0.335).wavelengthPm
  },
  {
    id: "db-voltage-root",
    name: "quadrupling voltage halves wavelength",
    input: { voltage: 200 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (i) => matterWave("electron", electronSpeedFromVoltage(i.voltage * 4), 0.335).wavelengthM / matterWave("electron", electronSpeedFromVoltage(i.voltage), 0.335).wavelengthM
  },
  {
    id: "db-fringe-spacing",
    name: "fringe spacing is L lambda over d",
    input: { speed: 1e7, spacing: 0.4 },
    expected: 0,
    unit: "mm",
    tolerance: 1e-12,
    actual: (i) => {
      const w = matterWave("electron", i.speed, i.spacing);
      return w.fringeSpacingMm - 0.25 * w.wavelengthM / (i.spacing * 1e-9) * 1e3;
    }
  },
  {
    id: "db-momentum",
    name: "momentum equals mv",
    input: { speed: 2e7 },
    expected: ELECTRON_MASS * 2e7,
    unit: "kg m/s",
    tolerance: 1e-35,
    actual: (i) => matterWave("electron", i.speed, 0.335).momentum
  }
]);

// src/experiments/nuclear-decay/nuclearDecaySimulation.ts
var decayConstant = (halfLife) => Math.LN2 / halfLife;
var expectedRemaining = (initial, time, halfLife) => initial * 2 ** (-time / halfLife);
var expectedActivity = (remaining, halfLife) => decayConstant(halfLife) * remaining;
function seededUniforms(count, seed) {
  let state = seed >>> 0;
  return Array.from({ length: count }, () => {
    state += 1831565813;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  });
}
function decayTimes(count, halfLife, seed) {
  const lambda = decayConstant(halfLife);
  return seededUniforms(count, seed).map(
    (u) => -Math.log(Math.max(1e-12, 1 - u)) / lambda
  );
}
var nuclearDecayBenchmarks = runBenchmarkCases([
  {
    id: "decay-one-half",
    name: "expected count halves after one half-life",
    input: { n: 1e3, t: 30, half: 30 },
    expected: 500,
    unit: "nuclei",
    tolerance: 1e-12,
    actual: (i) => expectedRemaining(i.n, i.t, i.half)
  },
  {
    id: "decay-two-halves",
    name: "expected count quarters after two half-lives",
    input: { n: 800, t: 10, half: 5 },
    expected: 200,
    unit: "nuclei",
    tolerance: 1e-12,
    actual: (i) => expectedRemaining(i.n, i.t, i.half)
  },
  {
    id: "decay-activity",
    name: "activity equals lambda N",
    input: { n: 400, half: 20 },
    expected: Math.LN2 * 20,
    unit: "events/unit",
    tolerance: 1e-12,
    actual: (i) => expectedActivity(i.n, i.half)
  },
  {
    id: "decay-seed-repeat",
    name: "same seed reproduces every lifetime",
    input: { seed: 137 },
    expected: 0,
    unit: "difference",
    tolerance: 0,
    actual: (i) => decayTimes(40, 12, i.seed).reduce(
      (s, v, k) => s + Math.abs(v - decayTimes(40, 12, i.seed)[k]),
      0
    )
  },
  {
    id: "decay-seed-change",
    name: "different seeds change a stochastic run",
    input: { seed: 137 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => Number(
      decayTimes(30, 12, i.seed).some(
        (v, k) => v !== decayTimes(30, 12, i.seed + 1)[k]
      )
    )
  }
]);

// src/experiments/photoelectric-equation/photoelectricSimulation.ts
var PLANCK_EV_S = 4135667696e-24;
function photoelectricState(frequencyHz, workFunctionEv, intensityPercent, appliedVoltage) {
  const photonEnergyEv = PLANCK_EV_S * frequencyHz;
  const kineticMaxEv = Math.max(0, photonEnergyEv - workFunctionEv);
  const thresholdHz = workFunctionEv / PLANCK_EV_S;
  const stoppingPotentialV = kineticMaxEv;
  const saturationCurrentUa = kineticMaxEv > 0 ? intensityPercent * 0.18 : 0;
  const collection = stoppingPotentialV <= 0 ? 0 : appliedVoltage >= 0 ? 1 : Math.max(0, Math.min(1, 1 + appliedVoltage / stoppingPotentialV));
  return {
    photonEnergyEv,
    kineticMaxEv,
    thresholdHz,
    stoppingPotentialV,
    saturationCurrentUa,
    photocurrentUa: saturationCurrentUa * collection,
    emission: kineticMaxEv > 0 && intensityPercent > 0
  };
}
var photoelectricBenchmarks = runBenchmarkCases([
  {
    id: "pe-einstein",
    name: "Kmax equals hf minus phi",
    input: { f: 1e15, phi: 2, intensity: 50, v: 0 },
    expected: PLANCK_EV_S * 1e15 - 2,
    unit: "eV",
    tolerance: 1e-12,
    actual: (i) => photoelectricState(i.f, i.phi, i.intensity, i.v).kineticMaxEv
  },
  {
    id: "pe-threshold",
    name: "threshold frequency equals phi over h",
    input: { f: 5e14, phi: 4.31, intensity: 70, v: 0 },
    expected: 4.31 / PLANCK_EV_S,
    unit: "Hz",
    tolerance: 1e-3,
    actual: (i) => photoelectricState(i.f, i.phi, i.intensity, i.v).thresholdHz
  },
  {
    id: "pe-below-threshold",
    name: "below threshold emits no electrons",
    input: { f: 5e14, phi: 4.31, intensity: 100, v: 0 },
    expected: 0,
    unit: "eV",
    tolerance: 0,
    actual: (i) => photoelectricState(i.f, i.phi, i.intensity, i.v).kineticMaxEv
  },
  {
    id: "pe-intensity-ke",
    name: "intensity does not change maximum kinetic energy",
    input: { f: 1e15, phi: 2, intensity: 10, v: 0 },
    expected: 0,
    unit: "eV",
    tolerance: 1e-12,
    actual: (i) => photoelectricState(i.f, i.phi, 10, i.v).kineticMaxEv - photoelectricState(i.f, i.phi, 90, i.v).kineticMaxEv
  },
  {
    id: "pe-stopping",
    name: "negative stopping potential reduces current to zero",
    input: { f: 1e15, phi: 2, intensity: 80, v: 0 },
    expected: 0,
    unit: "microampere",
    tolerance: 1e-12,
    actual: (i) => {
      const s = photoelectricState(i.f, i.phi, i.intensity, 0);
      return photoelectricState(
        i.f,
        i.phi,
        i.intensity,
        -s.stoppingPotentialV
      ).photocurrentUa;
    }
  }
]);

// src/experiments/special-relativity-bridge/relativitySimulation.ts
var C = 299792458;
var gammaFor = (beta) => 1 / Math.sqrt(1 - beta ** 2);
var lightClock = (beta, heightM) => {
  const gamma = gammaFor(beta);
  const properTimeS = heightM / C;
  const earthTimeS = gamma * properTimeS;
  const horizontalM = beta * C * earthTimeS;
  const lightPathM = Math.hypot(heightM, horizontalM);
  return {
    gamma,
    properTimeS,
    earthTimeS,
    horizontalM,
    lightPathM,
    measuredLightSpeed: lightPathM / earthTimeS
  };
};
function lorentzEvent(beta, xM, timeUs) {
  const g = gammaFor(beta), t = timeUs * 1e-6, v = beta * C;
  return {
    xPrimeM: g * (xM - v * t),
    timePrimeUs: g * (t - v * xM / C ** 2) * 1e6
  };
}
var intervalM2 = (xM, timeUs) => (C * timeUs * 1e-6) ** 2 - xM ** 2;
var relativityBenchmarks = runBenchmarkCases([
  {
    id: "rel-gamma-08",
    name: "gamma at 0.8c",
    input: { beta: 0.8 },
    expected: 5 / 3,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (i) => gammaFor(i.beta)
  },
  {
    id: "rel-low-speed",
    name: "gamma tends to one at low speed",
    input: { beta: 1e-6 },
    expected: 1.0000000000005,
    unit: "unitless",
    tolerance: 1e-15,
    actual: (i) => gammaFor(i.beta)
  },
  {
    id: "rel-light-speed",
    name: "moving light clock still measures c",
    input: { beta: 0.8, h: 100 },
    expected: C,
    unit: "m/s",
    tolerance: 1e-6,
    actual: (i) => lightClock(i.beta, i.h).measuredLightSpeed
  },
  {
    id: "rel-length",
    name: "length contracts by gamma",
    input: { beta: 0.8, length: 300 },
    expected: 180,
    unit: "m",
    tolerance: 1e-12,
    actual: (i) => i.length / gammaFor(i.beta)
  },
  {
    id: "rel-interval",
    name: "Lorentz transform preserves interval",
    input: { beta: 0.6, x: 400, t: 2 },
    expected: 0,
    unit: "m2",
    tolerance: 1e-7,
    actual: (i) => {
      const e = lorentzEvent(i.beta, i.x, i.t);
      return intervalM2(e.xPrimeM, e.timePrimeUs) - intervalM2(i.x, i.t);
    }
  }
]);

// src/experiments/chaotic-coupled-oscillators/chaotic-coupled-oscillatorsSimulation.ts
var G = 9.81;
var radians = (degrees2) => degrees2 * Math.PI / 180;
var defaultCoupledParams = {
  mass1Kg: 0.25,
  mass2Kg: 0.25,
  length1M: 1,
  length2M: 1,
  couplingNPerM: 0.25,
  dampingNmsPerRad: 2e-3,
  angle1Deg: 20,
  angle2Deg: 0,
  driveAmplitudeNm: 0,
  driveFrequencyRadS: 3.2
};
function accelerations(state, params, time) {
  const x1 = params.length1M * Math.sin(state.theta1);
  const x2 = params.length2M * Math.sin(state.theta2);
  const extension = x1 - x2;
  const torque1 = -params.mass1Kg * G * params.length1M * Math.sin(state.theta1) - params.couplingNPerM * extension * params.length1M * Math.cos(state.theta1) - params.dampingNmsPerRad * state.omega1 + params.driveAmplitudeNm * Math.sin(params.driveFrequencyRadS * time);
  const torque2 = -params.mass2Kg * G * params.length2M * Math.sin(state.theta2) + params.couplingNPerM * extension * params.length2M * Math.cos(state.theta2) - params.dampingNmsPerRad * state.omega2;
  return {
    alpha1: torque1 / (params.mass1Kg * params.length1M ** 2),
    alpha2: torque2 / (params.mass2Kg * params.length2M ** 2)
  };
}
function derivative(state, params, time) {
  const a = accelerations(state, params, time);
  return {
    theta1: state.omega1,
    omega1: a.alpha1,
    theta2: state.omega2,
    omega2: a.alpha2
  };
}
function add2(state, slope, scale5) {
  return {
    theta1: state.theta1 + slope.theta1 * scale5,
    omega1: state.omega1 + slope.omega1 * scale5,
    theta2: state.theta2 + slope.theta2 * scale5,
    omega2: state.omega2 + slope.omega2 * scale5
  };
}
function rk4Step(state, params, time, dt) {
  const k1 = derivative(state, params, time);
  const k2 = derivative(add2(state, k1, dt / 2), params, time + dt / 2);
  const k3 = derivative(add2(state, k2, dt / 2), params, time + dt / 2);
  const k4 = derivative(add2(state, k3, dt), params, time + dt);
  return {
    theta1: state.theta1 + dt / 6 * (k1.theta1 + 2 * k2.theta1 + 2 * k3.theta1 + k4.theta1),
    omega1: state.omega1 + dt / 6 * (k1.omega1 + 2 * k2.omega1 + 2 * k3.omega1 + k4.omega1),
    theta2: state.theta2 + dt / 6 * (k1.theta2 + 2 * k2.theta2 + 2 * k3.theta2 + k4.theta2),
    omega2: state.omega2 + dt / 6 * (k1.omega2 + 2 * k2.omega2 + 2 * k3.omega2 + k4.omega2)
  };
}
function oscillatorEnergy(state, params) {
  const kinetic1 = 0.5 * params.mass1Kg * params.length1M ** 2 * state.omega1 ** 2;
  const kinetic2 = 0.5 * params.mass2Kg * params.length2M ** 2 * state.omega2 ** 2;
  const potential1 = params.mass1Kg * G * params.length1M * (1 - Math.cos(state.theta1));
  const potential2 = params.mass2Kg * G * params.length2M * (1 - Math.cos(state.theta2));
  const extension = params.length1M * Math.sin(state.theta1) - params.length2M * Math.sin(state.theta2);
  const couplingEnergy = 0.5 * params.couplingNPerM * extension ** 2;
  return {
    kinetic1,
    kinetic2,
    potential1,
    potential2,
    couplingEnergy,
    totalEnergy: kinetic1 + kinetic2 + potential1 + potential2 + couplingEnergy
  };
}
function normalModeMetrics(massKg, lengthM, couplingNPerM) {
  const omegaSymmetric = Math.sqrt(G / lengthM);
  const omegaAntisymmetric = Math.sqrt(
    G / lengthM + 2 * couplingNPerM / massKg
  );
  const frequencySymmetricHz = omegaSymmetric / (2 * Math.PI);
  const frequencyAntisymmetricHz = omegaAntisymmetric / (2 * Math.PI);
  const beatPeriodS = Math.PI / Math.max(1e-9, omegaAntisymmetric - omegaSymmetric);
  return {
    omegaSymmetric,
    omegaAntisymmetric,
    frequencySymmetricHz,
    frequencyAntisymmetricHz,
    beatPeriodS
  };
}
function angularDifference(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}
function simulateCoupledOscillators(params, durationS = 40, sampleDt = 0.04, integrationDt = 4e-3) {
  let state = {
    theta1: radians(params.angle1Deg),
    omega1: 0,
    theta2: radians(params.angle2Deg),
    omega2: 0
  };
  let nearby = {
    ...state,
    theta1: state.theta1 + radians(0.05)
  };
  const samples = [];
  const substeps = Math.max(1, Math.round(sampleDt / integrationDt));
  const dt = sampleDt / substeps;
  const count = Math.round(durationS / sampleDt);
  for (let sampleIndex = 0; sampleIndex <= count; sampleIndex += 1) {
    const time = sampleIndex * sampleDt;
    const energy = oscillatorEnergy(state, params);
    const divergence = Math.hypot(
      angularDifference(state.theta1, nearby.theta1),
      angularDifference(state.theta2, nearby.theta2),
      (state.omega1 - nearby.omega1) * 0.2,
      (state.omega2 - nearby.omega2) * 0.2
    );
    const finite4 = [
      ...Object.values(state),
      ...Object.values(nearby),
      energy.totalEnergy,
      divergence
    ].every(Number.isFinite);
    samples.push({
      time,
      ...state,
      ...energy,
      divergence,
      nearbyTheta1: nearby.theta1,
      finite: finite4
    });
    if (!finite4) break;
    for (let j = 0; j < substeps; j += 1) {
      const subTime = time + j * dt;
      state = rk4Step(state, params, subTime, dt);
      nearby = rk4Step(nearby, params, subTime, dt);
    }
  }
  const initialEnergy = samples[0]?.totalEnergy ?? 0;
  const maximumEnergyDrift = samples.reduce(
    (max, sample) => Math.max(max, Math.abs(sample.totalEnergy - initialEnergy)),
    0
  );
  const maximumDivergence = samples.reduce(
    (max, sample) => Math.max(max, sample.divergence),
    0
  );
  return {
    samples,
    initialEnergy,
    maximumEnergyDrift,
    relativeEnergyDrift: initialEnergy > 0 ? maximumEnergyDrift / initialEnergy : 0,
    maximumDivergence,
    stable: samples.length === count + 1 && samples.every((sample) => sample.finite)
  };
}
function presetParams(preset) {
  if (preset === "symmetric")
    return {
      angle1Deg: 20,
      angle2Deg: 20,
      dampingNmsPerRad: 0,
      driveAmplitudeNm: 0
    };
  if (preset === "antisymmetric")
    return {
      angle1Deg: 20,
      angle2Deg: -20,
      dampingNmsPerRad: 0,
      driveAmplitudeNm: 0
    };
  if (preset === "beats")
    return {
      angle1Deg: 20,
      angle2Deg: 0,
      couplingNPerM: 0.25,
      dampingNmsPerRad: 2e-3,
      driveAmplitudeNm: 0
    };
  return {
    angle1Deg: 112,
    angle2Deg: -38,
    couplingNPerM: 1.4,
    dampingNmsPerRad: 0,
    driveAmplitudeNm: 0.08,
    driveFrequencyRadS: 3.2
  };
}
var conservative = {
  ...defaultCoupledParams,
  dampingNmsPerRad: 0,
  driveAmplitudeNm: 0
};
var chaoticCoupledOscillatorBenchmarks = runBenchmarkCases([
  {
    id: "symmetric-mode",
    name: "equal angles have equal acceleration",
    input: { theta: 0.2 },
    expected: 0,
    unit: "rad/s2",
    tolerance: 1e-12,
    actual: (input2) => {
      const a = accelerations(
        { theta1: input2.theta, theta2: input2.theta, omega1: 0, omega2: 0 },
        conservative,
        0
      );
      return a.alpha1 - a.alpha2;
    }
  },
  {
    id: "antisymmetric-mode",
    name: "opposite angles have opposite acceleration",
    input: { theta: 0.2 },
    expected: 0,
    unit: "rad/s2",
    tolerance: 1e-12,
    actual: (input2) => {
      const a = accelerations(
        { theta1: input2.theta, theta2: -input2.theta, omega1: 0, omega2: 0 },
        conservative,
        0
      );
      return a.alpha1 + a.alpha2;
    }
  },
  {
    id: "energy-conservation",
    name: "undamped RK4 trajectory conserves total energy",
    input: { duration: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => simulateCoupledOscillators(conservative, input2.duration, 0.04, 4e-3).relativeEnergyDrift < 1e-6 ? 1 : 0
  },
  {
    id: "beat-period",
    name: "energy-transfer period follows normal-mode splitting",
    input: { mass: 0.25, length: 1, coupling: 0.25 },
    expected: 10.31802701278396,
    unit: "s",
    tolerance: 1e-10,
    actual: (input2) => normalModeMetrics(input2.mass, input2.length, input2.coupling).beatPeriodS
  },
  {
    id: "bounded-sensitivity",
    name: "nearby nonlinear starts diverge without numerical explosion",
    input: { duration: 30 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => {
      const result = simulateCoupledOscillators(
        { ...conservative, ...presetParams("chaos") },
        input2.duration,
        0.04,
        4e-3
      );
      return result.stable && result.maximumDivergence > radians(0.05) ? 1 : 0;
    }
  }
]);

// src/experiments/calorimetry-mixing/calorimetry-mixingSimulation.ts
function solveInsulatedMix(input2) {
  const hotCapacity = input2.hotMassKg * input2.hotSpecificHeatJkgK;
  const coldCapacity = input2.coldMassKg * input2.coldSpecificHeatJkgK;
  const calorimeterCapacity = input2.calorimeterHeatCapacityJK;
  const calorimeterTemperature = input2.calorimeterInitialTemperatureC ?? input2.coldTemperatureC;
  const totalCapacity = hotCapacity + coldCapacity + calorimeterCapacity;
  const finalTemperatureC = (hotCapacity * input2.hotTemperatureC + coldCapacity * input2.coldTemperatureC + calorimeterCapacity * calorimeterTemperature) / totalCapacity;
  const qHotJ = hotCapacity * (finalTemperatureC - input2.hotTemperatureC);
  const qColdJ = coldCapacity * (finalTemperatureC - input2.coldTemperatureC);
  const qCalorimeterJ = calorimeterCapacity * (finalTemperatureC - calorimeterTemperature);
  return {
    hotCapacity,
    coldCapacity,
    calorimeterCapacity,
    totalCapacity,
    finalTemperatureC,
    qHotJ,
    qColdJ,
    qCalorimeterJ,
    residualJ: qHotJ + qColdJ + qCalorimeterJ
  };
}
function inferUnknownSpecificHeat({
  metalMassKg,
  metalInitialTemperatureC,
  waterMassKg,
  waterSpecificHeatJkgK,
  waterInitialTemperatureC,
  calorimeterHeatCapacityJK,
  finalTemperatureC
}) {
  const gained = (waterMassKg * waterSpecificHeatJkgK + calorimeterHeatCapacityJK) * (finalTemperatureC - waterInitialTemperatureC);
  return gained / (metalMassKg * (metalInitialTemperatureC - finalTemperatureC));
}
var unknownSpecificHeatScenario = (() => {
  const metalMassKg = 0.08, metalInitialTemperatureC = 95, waterMassKg = 0.12, waterSpecificHeatJkgK = 4184, waterInitialTemperatureC = 20, calorimeterHeatCapacityJK = 20, specificHeatJkgK = 385;
  const finalTemperatureC = (metalMassKg * specificHeatJkgK * metalInitialTemperatureC + (waterMassKg * waterSpecificHeatJkgK + calorimeterHeatCapacityJK) * waterInitialTemperatureC) / (metalMassKg * specificHeatJkgK + waterMassKg * waterSpecificHeatJkgK + calorimeterHeatCapacityJK);
  return {
    metalMassKg,
    metalInitialTemperatureC,
    waterMassKg,
    waterSpecificHeatJkgK,
    waterInitialTemperatureC,
    calorimeterHeatCapacityJK,
    specificHeatJkgK,
    finalTemperatureC
  };
})();
var waterMix = {
  hotMassKg: 0.15,
  hotTemperatureC: 80,
  hotSpecificHeatJkgK: 4184,
  coldMassKg: 0.15,
  coldTemperatureC: 20,
  coldSpecificHeatJkgK: 4184,
  calorimeterHeatCapacityJK: 0
};
var calorimetryMixingBenchmarks = runBenchmarkCases([
  {
    id: "equal-water-mix",
    name: "equal water masses mix to arithmetic midpoint",
    input: { hot: 80, cold: 20 },
    expected: 50,
    unit: "degC",
    tolerance: 1e-12,
    actual: () => solveInsulatedMix(waterMix).finalTemperatureC
  },
  {
    id: "energy-closure",
    name: "insulated heat changes sum to zero",
    input: { hotMass: 0.2, coldMass: 0.1 },
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (x) => solveInsulatedMix({
      ...waterMix,
      hotMassKg: x.hotMass,
      coldMassKg: x.coldMass,
      calorimeterHeatCapacityJK: 35
    }).residualJ
  },
  {
    id: "temperature-bounds",
    name: "equilibrium lies between initial temperatures",
    input: { hot: 90, cold: 10 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const t = solveInsulatedMix({
        ...waterMix,
        hotTemperatureC: x.hot,
        coldTemperatureC: x.cold,
        hotSpecificHeatJkgK: 897
      }).finalTemperatureC;
      return t > x.cold && t < x.hot ? 1 : 0;
    }
  },
  {
    id: "q-equals-mcdt",
    name: "heat equals mass times specific heat times temperature change",
    input: { mass: 0.2, c: 4184, delta: 15 },
    expected: 12552,
    unit: "J",
    tolerance: 1e-9,
    actual: (x) => x.mass * x.c * x.delta
  },
  {
    id: "unknown-specific-heat",
    name: "mixing data recovers hidden specific heat",
    input: { final: unknownSpecificHeatScenario.finalTemperatureC },
    expected: 385,
    unit: "J/(kg K)",
    tolerance: 1e-9,
    actual: (x) => inferUnknownSpecificHeat({
      ...unknownSpecificHeatScenario,
      finalTemperatureC: x.final
    })
  }
]);

// src/experiments/gas-laws/gas-lawsSimulation.ts
var GAS_CONSTANT = 8.31446261815324;
var BOLTZMANN_CONSTANT = 1380649e-29;
var AIR_MOLAR_MASS_KG_MOL = 0.02897;
var REFERENCE_PRESSURE_KPA = 101.325;
var REFERENCE_TEMPERATURE_K = 350;
var REFERENCE_VOLUME_L = 2.5;
var REFERENCE_PARTICLES = 200;
var MOLES_PER_DISPLAY_PARTICLE = REFERENCE_PRESSURE_KPA * REFERENCE_VOLUME_L / (REFERENCE_PARTICLES * GAS_CONSTANT * REFERENCE_TEMPERATURE_K);
var finitePositive = (value, name) => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and greater than zero.`);
  }
  return value;
};
var molesFromDisplayParticles = (particleCount) => finitePositive(particleCount, "Particle count") * MOLES_PER_DISPLAY_PARTICLE;
var idealGasPressureKPa = (amountMol, temperatureK, volumeL) => finitePositive(amountMol, "Amount") * GAS_CONSTANT * finitePositive(temperatureK, "Absolute temperature") / finitePositive(volumeL, "Volume");
var meanMolecularSpeedMS = (temperatureK, molarMassKgMol = AIR_MOLAR_MASS_KG_MOL) => Math.sqrt(
  8 * GAS_CONSTANT * finitePositive(temperatureK, "Absolute temperature") / (Math.PI * finitePositive(molarMassKgMol, "Molar mass"))
);
var meanTranslationalKineticEnergyJ = (temperatureK) => 1.5 * BOLTZMANN_CONSTANT * finitePositive(temperatureK, "Absolute temperature");
var gasLawsBenchmarks = runBenchmarkCases([
  {
    id: "reference-state",
    name: "Reference state is one atmosphere",
    input: { particles: 200, temperatureK: 350, volumeL: 2.5 },
    expected: REFERENCE_PRESSURE_KPA,
    unit: "kPa",
    tolerance: 1e-9,
    actual: ({ particles: particles2, temperatureK, volumeL }) => idealGasPressureKPa(
      molesFromDisplayParticles(Number(particles2)),
      Number(temperatureK),
      Number(volumeL)
    )
  },
  {
    id: "boyle-law",
    name: "Isothermal halving of volume doubles pressure",
    input: { amountMol: 0.1, temperatureK: 350, v1: 4, v2: 2 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ amountMol, temperatureK, v1, v2 }) => idealGasPressureKPa(Number(amountMol), Number(temperatureK), Number(v2)) / idealGasPressureKPa(Number(amountMol), Number(temperatureK), Number(v1))
  },
  {
    id: "charles-law",
    name: "At constant pressure volume is proportional to Kelvin temperature",
    input: { amountMol: 0.1, pressureKPa: 100, t1: 250, t2: 500 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ amountMol, pressureKPa, t1, t2 }) => Number(amountMol) * GAS_CONSTANT * Number(t2) / Number(pressureKPa) / (Number(amountMol) * GAS_CONSTANT * Number(t1) / Number(pressureKPa))
  },
  {
    id: "pressure-law",
    name: "At constant volume pressure is proportional to Kelvin temperature",
    input: { amountMol: 0.1, volumeL: 2, t1: 300, t2: 600 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ amountMol, volumeL, t1, t2 }) => idealGasPressureKPa(Number(amountMol), Number(t2), Number(volumeL)) / idealGasPressureKPa(Number(amountMol), Number(t1), Number(volumeL))
  },
  {
    id: "kinetic-energy",
    name: "Mean translational energy is three halves kBT",
    input: { temperatureK: 400 },
    expected: 1.5 * BOLTZMANN_CONSTANT * 400,
    unit: "J molecule^-1",
    tolerance: 1e-32,
    actual: ({ temperatureK }) => meanTranslationalKineticEnergyJ(Number(temperatureK))
  },
  {
    id: "speed-temperature",
    name: "Molecular speed scales as square root of Kelvin temperature",
    input: { t1: 300, t2: 600 },
    expected: Math.sqrt(2),
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ t1, t2 }) => meanMolecularSpeedMS(Number(t2)) / meanMolecularSpeedMS(Number(t1))
  }
]);

// src/experiments/heat-and-temperature/heatTemperatureSimulation.ts
var finite2 = (value, label) => {
  if (!Number.isFinite(value)) throw new RangeError(`${label} must be finite.`);
  return value;
};
var heatCapacity = (massKg, specificHeatJKgK) => {
  if (massKg <= 0 || specificHeatJKgK <= 0)
    throw new RangeError("Mass and specific heat must be positive.");
  return massKg * specificHeatJKgK;
};
var temperatureAfterHeat = (initialC, heatJ, massKg, specificHeatJKgK) => finite2(initialC, "Initial temperature") + finite2(heatJ, "Heat") / heatCapacity(massKg, specificHeatJKgK);
var heatRequired = (initialC, finalC, massKg, specificHeatJKgK) => heatCapacity(massKg, specificHeatJKgK) * (finite2(finalC, "Final temperature") - finite2(initialC, "Initial temperature"));
var equilibriumTemperature = (temperatureAC, capacityAJK, temperatureBC, capacityBJK) => {
  if (capacityAJK <= 0 || capacityBJK <= 0)
    throw new RangeError("Heat capacities must be positive.");
  return (capacityAJK * temperatureAC + capacityBJK * temperatureBC) / (capacityAJK + capacityBJK);
};
var celsiusToKelvin = (celsius) => {
  const kelvin = finite2(celsius, "Temperature") + 273.15;
  if (kelvin < 0)
    throw new RangeError("Temperature cannot be below absolute zero.");
  return kelvin;
};
var celsiusToFahrenheit = (celsius) => finite2(celsius, "Temperature") * 9 / 5 + 32;
var heatTemperatureBenchmarks = runBenchmarkCases([
  {
    id: "q-mc-delta-t",
    name: "Q=mc\u0394T for aluminium",
    input: { m: 0.5, c: 897, dt: 20 },
    expected: 8970,
    unit: "J",
    tolerance: 1e-9,
    actual: ({ m, c: c2, dt }) => heatRequired(0, Number(dt), Number(m), Number(c2))
  },
  {
    id: "equal-energy-mass",
    name: "Doubling mass halves temperature rise",
    input: { q: 9e3, m: 0.5, c: 900 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ q, m, c: c2 }) => (temperatureAfterHeat(20, Number(q), Number(m) * 2, Number(c2)) - 20) / (temperatureAfterHeat(20, Number(q), Number(m), Number(c2)) - 20)
  },
  {
    id: "equilibrium",
    name: "Equal heat capacities equilibrate at mean temperature",
    input: { ta: 80, tb: 20, ca: 500, cb: 500 },
    expected: 50,
    unit: "\xB0C",
    tolerance: 1e-12,
    actual: ({ ta, tb, ca, cb }) => equilibriumTemperature(Number(ta), Number(ca), Number(tb), Number(cb))
  },
  {
    id: "kelvin-scale",
    name: "Zero Celsius equals 273.15 kelvin",
    input: { c: 0 },
    expected: 273.15,
    unit: "K",
    tolerance: 1e-12,
    actual: ({ c: c2 }) => celsiusToKelvin(Number(c2))
  },
  {
    id: "fahrenheit-scale",
    name: "Boiling point converts to Fahrenheit",
    input: { c: 100 },
    expected: 212,
    unit: "\xB0F",
    tolerance: 1e-12,
    actual: ({ c: c2 }) => celsiusToFahrenheit(Number(c2))
  }
]);

// src/experiments/heat-transfer/heatTransferSimulation.ts
var STEFAN_BOLTZMANN = 5670374419e-17;
var positive = (value, label) => {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(`${label} must be finite and greater than zero.`);
  return value;
};
var kelvinFromCelsius = (celsius) => {
  const kelvin = celsius + 273.15;
  if (!Number.isFinite(kelvin) || kelvin < 0)
    throw new RangeError("Temperature cannot be below absolute zero.");
  return kelvin;
};
var fourierHeatRateW = (conductivityWMK, areaM2, temperatureDifferenceK, lengthM) => positive(conductivityWMK, "Conductivity") * positive(areaM2, "Area") * Math.max(0, temperatureDifferenceK) / positive(lengthM, "Length");
var radiationHeatRateW = (emissivity, areaM2, surfaceC, surroundingsC, viewFactor = 1) => {
  if (emissivity < 0 || emissivity > 1)
    throw new RangeError("Emissivity must lie from zero to one.");
  if (viewFactor < 0 || viewFactor > 1)
    throw new RangeError("View factor must lie from zero to one.");
  const surfaceK = kelvinFromCelsius(surfaceC);
  const surroundingsK = kelvinFromCelsius(surroundingsC);
  return emissivity * STEFAN_BOLTZMANN * positive(areaM2, "Area") * viewFactor * (surfaceK ** 4 - surroundingsK ** 4);
};
var convectionCirculationSign = (heaterSide) => heaterSide === "left" ? 1 : -1;
var heatTransferBenchmarks = runBenchmarkCases([
  {
    id: "fourier-reference",
    name: "Fourier rate for aluminium rod",
    input: { k: 205, a: 785e-7, dt: 60, l: 0.3 },
    expected: 3.2185,
    unit: "W",
    tolerance: 1e-9,
    actual: ({ k, a, dt, l }) => fourierHeatRateW(Number(k), Number(a), Number(dt), Number(l))
  },
  {
    id: "fourier-conductivity",
    name: "Doubling conductivity doubles heat rate",
    input: { k: 50 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ k }) => fourierHeatRateW(Number(k) * 2, 0.01, 40, 0.2) / fourierHeatRateW(Number(k), 0.01, 40, 0.2)
  },
  {
    id: "fourier-thickness",
    name: "Doubling thickness halves heat rate",
    input: { l: 0.2 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ l }) => fourierHeatRateW(50, 0.01, 40, Number(l) * 2) / fourierHeatRateW(50, 0.01, 40, Number(l))
  },
  {
    id: "convection-direction",
    name: "Left heater makes clockwise circulation",
    input: { side: 1 },
    expected: 1,
    unit: "direction",
    tolerance: 0,
    actual: () => convectionCirculationSign("left")
  },
  {
    id: "radiation-emissivity",
    name: "Radiation rate is proportional to emissivity",
    input: { epsilon: 0.4 },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ epsilon }) => radiationHeatRateW(Number(epsilon) * 2, 0.02, 500, 20) / radiationHeatRateW(Number(epsilon), 0.02, 500, 20)
  },
  {
    id: "radiation-fourth-power",
    name: "Hotter absolute source radiates much faster",
    input: { low: 300, high: 500 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ low, high }) => Number(
      radiationHeatRateW(0.8, 0.02, Number(high), 20) > radiationHeatRateW(0.8, 0.02, Number(low), 20) * 2
    )
  }
]);

// src/experiments/statistical-ensemble-lab/statisticalEnsembleSimulation.ts
var clamp = (value, min, max) => Math.min(max, Math.max(min, value));
var logFactorial = (n) => {
  let total = 0;
  for (let i = 2; i <= n; i += 1) total += Math.log(i);
  return total;
};
var logBinomialCoefficient = (n, k) => {
  const integerN = Math.round(n);
  const integerK = Math.round(k);
  if (integerN < 0 || integerK < 0 || integerK > integerN)
    return Number.NEGATIVE_INFINITY;
  return logFactorial(integerN) - logFactorial(integerK) - logFactorial(integerN - integerK);
};
var binomialProbability = (n, k, probability) => {
  if (probability < 0 || probability > 1)
    throw new RangeError("Probability must lie from zero to one.");
  if (probability === 0) return k === 0 ? 1 : 0;
  if (probability === 1) return k === n ? 1 : 0;
  return Math.exp(
    logBinomialCoefficient(n, k) + k * Math.log(probability) + (n - k) * Math.log(1 - probability)
  );
};
var canonicalNormalization = (n, probability) => {
  let sum = 0;
  for (let energy = 0; energy <= n; energy += 1)
    sum += binomialProbability(n, energy, probability);
  return sum;
};
function solveEnsembleTheory(ensemble, targetParticles, energyPerParticle) {
  const particles2 = Math.max(1, Math.round(targetParticles));
  const probability = clamp(energyPerParticle, 0.01, 0.99);
  const betaEpsilon = Math.log((1 - probability) / probability);
  const fixedEnergy = Math.round(particles2 * probability);
  if (ensemble === "microcanonical") {
    return {
      ensemble,
      targetParticles: particles2,
      excitationProbability: fixedEnergy / particles2,
      betaEpsilon,
      fixedEnergyQuanta: fixedEnergy,
      meanEnergyQuanta: fixedEnergy,
      energyVariance: 0,
      meanParticles: particles2,
      particleVariance: 0,
      relativeEnergyFluctuation: 0,
      multiplicityLog: logBinomialCoefficient(particles2, fixedEnergy),
      mostProbableEnergy: fixedEnergy
    };
  }
  if (ensemble === "canonical") {
    const meanEnergy2 = particles2 * probability;
    const variance = particles2 * probability * (1 - probability);
    return {
      ensemble,
      targetParticles: particles2,
      excitationProbability: probability,
      betaEpsilon,
      meanEnergyQuanta: meanEnergy2,
      energyVariance: variance,
      meanParticles: particles2,
      particleVariance: 0,
      relativeEnergyFluctuation: Math.sqrt(variance) / meanEnergy2,
      multiplicityLog: logBinomialCoefficient(
        particles2,
        Math.floor((particles2 + 1) * probability)
      ),
      mostProbableEnergy: Math.min(
        particles2,
        Math.floor((particles2 + 1) * probability)
      )
    };
  }
  const meanEnergy = particles2 * probability;
  return {
    ensemble,
    targetParticles: particles2,
    excitationProbability: probability,
    betaEpsilon,
    betaChemicalPotential: Math.log(particles2 * (1 - probability)),
    meanEnergyQuanta: meanEnergy,
    energyVariance: meanEnergy,
    meanParticles: particles2,
    particleVariance: particles2,
    relativeEnergyFluctuation: 1 / Math.sqrt(meanEnergy),
    multiplicityLog: particles2,
    mostProbableEnergy: Math.floor(meanEnergy)
  };
}
var seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = 1664525 * state + 1013904223 >>> 0;
    return state / 4294967296;
  };
};
var sampleBinomial = (n, probability, random) => {
  let count = 0;
  for (let i = 0; i < n; i += 1) if (random() < probability) count += 1;
  return count;
};
var samplePoisson = (mean, random) => {
  const threshold = Math.exp(-mean);
  let product = 1;
  let count = 0;
  do {
    count += 1;
    product *= Math.max(random(), 1e-12);
  } while (product > threshold && count < mean * 5 + 100);
  return count - 1;
};
function generateEnsembleSamples(ensemble, targetParticles, energyPerParticle, sampleCount, seed = 6901) {
  const theory = solveEnsembleTheory(
    ensemble,
    targetParticles,
    energyPerParticle
  );
  const random = seededRandom(
    seed + theory.targetParticles * 17 + Math.round(theory.excitationProbability * 1e3)
  );
  return Array.from({ length: Math.max(1, Math.round(sampleCount)) }, () => {
    if (ensemble === "microcanonical")
      return {
        energyQuanta: theory.fixedEnergyQuanta ?? 0,
        particleCount: theory.targetParticles
      };
    const particleCount = ensemble === "canonical" ? theory.targetParticles : samplePoisson(theory.targetParticles, random);
    return {
      particleCount,
      energyQuanta: sampleBinomial(
        particleCount,
        theory.excitationProbability,
        random
      )
    };
  });
}
var summarizeSamples = (samples) => {
  if (!samples.length) throw new RangeError("At least one sample is required.");
  const meanEnergy = samples.reduce((sum, item) => sum + item.energyQuanta, 0) / samples.length;
  const meanParticles = samples.reduce((sum, item) => sum + item.particleCount, 0) / samples.length;
  const energyVariance = samples.reduce(
    (sum, item) => sum + (item.energyQuanta - meanEnergy) ** 2,
    0
  ) / samples.length;
  const particleVariance = samples.reduce(
    (sum, item) => sum + (item.particleCount - meanParticles) ** 2,
    0
  ) / samples.length;
  return {
    meanEnergy,
    meanParticles,
    energyVariance,
    particleVariance,
    normalization: samples.length / samples.length
  };
};
var statisticalEnsembleBenchmarks = runBenchmarkCases([
  {
    id: "canonical-normalization",
    name: "Canonical energy probabilities normalize",
    input: { n: 48, p: 0.32 },
    expected: 1,
    unit: "probability",
    tolerance: 1e-12,
    actual: ({ n, p }) => canonicalNormalization(Number(n), Number(p))
  },
  {
    id: "microcanonical-energy",
    name: "Microcanonical samples conserve energy",
    input: { n: 40, p: 0.3 },
    expected: 0,
    unit: "variance",
    tolerance: 0,
    actual: ({ n, p }) => summarizeSamples(
      generateEnsembleSamples("microcanonical", Number(n), Number(p), 200)
    ).energyVariance
  },
  {
    id: "canonical-particles",
    name: "Canonical samples conserve particle number",
    input: { n: 50, p: 0.4 },
    expected: 0,
    unit: "variance",
    tolerance: 0,
    actual: ({ n, p }) => summarizeSamples(
      generateEnsembleSamples("canonical", Number(n), Number(p), 500)
    ).particleVariance
  },
  {
    id: "grand-particle-fluctuation",
    name: "Grand-canonical particle number fluctuates",
    input: { n: 35, p: 0.3 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ n, p }) => Number(
      summarizeSamples(
        generateEnsembleSamples("grand-canonical", Number(n), Number(p), 500)
      ).particleVariance > 0
    )
  },
  {
    id: "canonical-convergence",
    name: "Canonical sample mean converges",
    input: { n: 60, p: 0.35 },
    expected: 21,
    unit: "energy quanta",
    tolerance: 0.15,
    actual: ({ n, p }) => summarizeSamples(
      generateEnsembleSamples("canonical", Number(n), Number(p), 2e4)
    ).meanEnergy
  },
  {
    id: "relative-fluctuation",
    name: "Relative fluctuations shrink as inverse square root N",
    input: { small: 25, large: 100, p: 0.4 },
    expected: 0.5,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ small, large, p }) => solveEnsembleTheory("canonical", Number(large), Number(p)).relativeEnergyFluctuation / solveEnsembleTheory("canonical", Number(small), Number(p)).relativeEnergyFluctuation
  }
]);

// src/experiments/thermodynamic-process/thermodynamicProcessSimulation.ts
var GAS_CONSTANT2 = 8.314462618;
var positive2 = (value, name) => {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(`${name} must be positive.`);
  return value;
};
function solveThermodynamicProcess(process, input2, fraction = 1) {
  const p1 = positive2(input2.pressureKPa, "Pressure");
  const v1 = positive2(input2.volumeL, "Volume");
  const t1 = positive2(input2.temperatureK, "Temperature");
  const gamma = input2.gamma;
  if (gamma <= 1) throw new RangeError("Gamma must be greater than one.");
  const ratio = positive2(input2.endpointRatio, "Endpoint ratio");
  const progress = Math.min(1, Math.max(0, fraction));
  const n = p1 * v1 / (GAS_CONSTANT2 * t1);
  const cv = GAS_CONSTANT2 / (gamma - 1);
  let pressureKPa = p1;
  let volumeL = v1;
  let temperatureK = t1;
  let workJ = 0;
  if (process === "isochoric") {
    const pressureRatio = 1 + (ratio - 1) * progress;
    pressureKPa = p1 * pressureRatio;
    temperatureK = t1 * pressureRatio;
  } else {
    const volumeRatio = 1 + (ratio - 1) * progress;
    volumeL = v1 * volumeRatio;
    if (process === "isobaric") {
      temperatureK = t1 * volumeRatio;
      workJ = p1 * (volumeL - v1);
    } else if (process === "isothermal") {
      pressureKPa = p1 / volumeRatio;
      workJ = p1 * v1 * Math.log(volumeRatio);
    } else {
      pressureKPa = p1 / volumeRatio ** gamma;
      temperatureK = t1 / volumeRatio ** (gamma - 1);
      workJ = (p1 * v1 - pressureKPa * volumeL) / (gamma - 1);
    }
  }
  const deltaInternalEnergyJ = n * cv * (temperatureK - t1);
  const heatJ = deltaInternalEnergyJ + workJ;
  return {
    pressureKPa,
    volumeL,
    temperatureK,
    moles: n,
    workJ,
    heatJ,
    deltaInternalEnergyJ
  };
}
var thermodynamicProcessBenchmarks = runBenchmarkCases([
  {
    id: "ideal-gas",
    name: "Initial ideal-gas state is consistent",
    input: { p: 100, v: 2, t: 300 },
    expected: 200,
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t }) => {
      const n = Number(p) * Number(v) / (GAS_CONSTANT2 * Number(t));
      return n * GAS_CONSTANT2 * Number(t);
    }
  },
  {
    id: "isothermal-work",
    name: "Isothermal work equals nRT ln(V2/V1)",
    input: { p: 100, v: 2, t: 300, r: 2, g: 1.4 },
    expected: 200 * Math.log(2),
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t, r, g }) => solveThermodynamicProcess("isothermal", {
      pressureKPa: Number(p),
      volumeL: Number(v),
      temperatureK: Number(t),
      endpointRatio: Number(r),
      gamma: Number(g)
    }).workJ
  },
  {
    id: "isobaric-work",
    name: "Isobaric work equals P delta V",
    input: { p: 120, v: 3, t: 320, r: 1.5, g: 1.4 },
    expected: 180,
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t, r, g }) => solveThermodynamicProcess("isobaric", {
      pressureKPa: Number(p),
      volumeL: Number(v),
      temperatureK: Number(t),
      endpointRatio: Number(r),
      gamma: Number(g)
    }).workJ
  },
  {
    id: "isochoric-work",
    name: "Isochoric work is zero",
    input: { p: 100, v: 2, t: 300, r: 1.6, g: 1.4 },
    expected: 0,
    unit: "J",
    tolerance: 0,
    actual: ({ p, v, t, r, g }) => solveThermodynamicProcess("isochoric", {
      pressureKPa: Number(p),
      volumeL: Number(v),
      temperatureK: Number(t),
      endpointRatio: Number(r),
      gamma: Number(g)
    }).workJ
  },
  {
    id: "adiabatic-invariant",
    name: "Adiabatic P V gamma is constant",
    input: { p: 100, v: 2, t: 300, r: 1.8, g: 1.4 },
    expected: 1,
    unit: "ratio",
    tolerance: 1e-12,
    actual: ({ p, v, t, r, g }) => {
      const state = solveThermodynamicProcess("adiabatic", {
        pressureKPa: Number(p),
        volumeL: Number(v),
        temperatureK: Number(t),
        endpointRatio: Number(r),
        gamma: Number(g)
      });
      return state.pressureKPa * state.volumeL ** Number(g) / (Number(p) * Number(v) ** Number(g));
    }
  },
  {
    id: "first-law",
    name: "First law residual is zero",
    input: { p: 180, v: 2.5, t: 340, r: 0.7, g: 1.33 },
    expected: 0,
    unit: "J",
    tolerance: 1e-10,
    actual: ({ p, v, t, r, g }) => {
      const state = solveThermodynamicProcess("adiabatic", {
        pressureKPa: Number(p),
        volumeL: Number(v),
        temperatureK: Number(t),
        endpointRatio: Number(r),
        gamma: Number(g)
      });
      return state.heatJ - state.workJ - state.deltaInternalEnergyJ;
    }
  }
]);

// src/experiments/echo-speed-sound/echoSpeedSoundSimulation.ts
function speedOfSoundMps(temperatureC) {
  if (!Number.isFinite(temperatureC) || temperatureC <= -273.15)
    throw new RangeError("Temperature must be above absolute zero.");
  return 331.3 * Math.sqrt((temperatureC + 273.15) / 273.15);
}
function solveEcho(input2) {
  if (!Number.isFinite(input2.distanceM) || input2.distanceM <= 0)
    throw new RangeError("Wall distance must be positive.");
  const soundSpeedMps = speedOfSoundMps(input2.temperatureC);
  const roundTripDistanceM = 2 * input2.distanceM;
  const echoDelayS = roundTripDistanceM / soundSpeedMps;
  const distinctThresholdS = 0.1;
  return {
    soundSpeedMps,
    roundTripDistanceM,
    echoDelayS,
    echoDelayMs: echoDelayS * 1e3,
    minimumDistinctDistanceM: soundSpeedMps * distinctThresholdS / 2,
    distinctEcho: echoDelayS >= distinctThresholdS,
    inferredDistanceM: soundSpeedMps * echoDelayS / 2
  };
}
function inferSoundSpeed(distanceM, echoDelayS) {
  if (distanceM <= 0 || echoDelayS <= 0)
    throw new RangeError("Distance and echo delay must be positive.");
  return 2 * distanceM / echoDelayS;
}
var echoSpeedSoundBenchmarks = runBenchmarkCases([
  {
    id: "speed-zero-c",
    name: "Dry-air speed at zero Celsius",
    input: { t: 0 },
    expected: 331.3,
    unit: "m/s",
    tolerance: 1e-10,
    actual: ({ t }) => speedOfSoundMps(Number(t))
  },
  {
    id: "round-trip",
    name: "Echo delay uses round-trip distance",
    input: { d: 34.3, t: 20 },
    expected: 0.2,
    unit: "s",
    tolerance: 1e-3,
    actual: ({ d, t }) => solveEcho({
      distanceM: Number(d),
      temperatureC: Number(t),
      frequencyHz: 2e3,
      amplitudePercent: 80,
      pulseShape: "short"
    }).echoDelayS
  },
  {
    id: "inverse",
    name: "Measured delay recovers sound speed",
    input: { d: 30, dt: 0.17483 },
    expected: 343.19,
    unit: "m/s",
    tolerance: 0.05,
    actual: ({ d, dt }) => inferSoundSpeed(Number(d), Number(dt))
  },
  {
    id: "temperature",
    name: "Sound speed rises with temperature",
    input: { cold: 0, warm: 30 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ cold, warm }) => Number(speedOfSoundMps(Number(warm)) > speedOfSoundMps(Number(cold)))
  },
  {
    id: "distinct",
    name: "Distinct echo threshold is one tenth second",
    input: { t: 20 },
    expected: 0.1,
    unit: "s",
    tolerance: 1e-12,
    actual: ({ t }) => {
      const v = speedOfSoundMps(Number(t)), d = v * 0.1 / 2;
      return solveEcho({
        distanceM: d,
        temperatureC: Number(t),
        frequencyHz: 1e3,
        amplitudePercent: 50,
        pulseShape: "click"
      }).echoDelayS;
    }
  }
]);

// src/experiments/em-spectrum/emSpectrumSimulation.ts
var C2 = 299792458;
var H = 662607015e-42;
var EV = 1602176634e-28;
var media = {
  vacuum: { label: "Vacuum", refractiveIndex: 1 },
  air: { label: "Air", refractiveIndex: 1.0003 },
  water: { label: "Water", refractiveIndex: 1.333 },
  glass: { label: "Glass", refractiveIndex: 1.5 }
};
var bands = [
  {
    id: "radio",
    label: "Radio",
    minHz: 1e3,
    maxHz: 3e8,
    color: "#70a7ff",
    use: "broadcasting and navigation",
    hazard: "Usually non-ionising; strong fields can heat tissue."
  },
  {
    id: "microwave",
    label: "Microwave",
    minHz: 3e8,
    maxHz: 3e11,
    color: "#ff9c55",
    use: "Wi-Fi, radar and cooking",
    hazard: "Non-ionising; intense exposure causes heating."
  },
  {
    id: "infrared",
    label: "Infrared",
    minHz: 3e11,
    maxHz: 4e14,
    color: "#ff6c64",
    use: "thermal imaging and remote controls",
    hazard: "Strong sources can heat skin and damage eyes."
  },
  {
    id: "visible",
    label: "Visible",
    minHz: 4e14,
    maxHz: 75e13,
    color: "#66d9ba",
    use: "vision, imaging and fibre optics",
    hazard: "Bright lasers can damage the retina."
  },
  {
    id: "ultraviolet",
    label: "Ultraviolet",
    minHz: 75e13,
    maxHz: 3e16,
    color: "#a58aff",
    use: "sterilisation and fluorescence",
    hazard: "Can damage cells, skin and eyes."
  },
  {
    id: "xray",
    label: "X-ray",
    minHz: 3e16,
    maxHz: 3e19,
    color: "#65c7ff",
    use: "medical and security imaging",
    hazard: "Ionising; dose must be limited."
  },
  {
    id: "gamma",
    label: "Gamma",
    minHz: 3e19,
    maxHz: Number.POSITIVE_INFINITY,
    color: "#db7cff",
    use: "radiotherapy and sterilisation",
    hazard: "Highly penetrating ionising radiation."
  }
];
function bandForFrequency(frequencyHz) {
  if (!Number.isFinite(frequencyHz) || frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  return bands.find(
    (band2) => frequencyHz >= band2.minHz && frequencyHz < band2.maxHz
  ) ?? bands[bands.length - 1];
}
function solveSpectrum(frequencyHz, medium) {
  if (!Number.isFinite(frequencyHz) || frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  const refractiveIndex2 = media[medium].refractiveIndex;
  const speedMps = C2 / refractiveIndex2;
  const wavelengthM = speedMps / frequencyHz;
  const photonEnergyJ = H * frequencyHz;
  return {
    frequencyHz,
    refractiveIndex: refractiveIndex2,
    speedMps,
    wavelengthM,
    photonEnergyJ,
    photonEnergyEv: photonEnergyJ / EV,
    band: bandForFrequency(frequencyHz)
  };
}
var emSpectrumBenchmarks = runBenchmarkCases([
  {
    id: "vacuum-speed",
    name: "Vacuum speed is exact c",
    input: { f: 245e7 },
    expected: C2,
    unit: "m/s",
    tolerance: 0,
    actual: ({ f }) => solveSpectrum(Number(f), "vacuum").speedMps
  },
  {
    id: "frequency-wavelength",
    name: "c equals frequency times wavelength",
    input: { f: 55e13 },
    expected: C2,
    unit: "m/s",
    tolerance: 1e-7,
    actual: ({ f }) => {
      const r = solveSpectrum(Number(f), "vacuum");
      return r.frequencyHz * r.wavelengthM;
    }
  },
  {
    id: "photon-energy",
    name: "Photon energy follows Planck relation",
    input: { f: 55e13 },
    expected: H * 55e13,
    unit: "J",
    tolerance: 1e-30,
    actual: ({ f }) => solveSpectrum(Number(f), "vacuum").photonEnergyJ
  },
  {
    id: "visible-band",
    name: "550 THz lies in visible band",
    input: { f: 55e13 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ f }) => Number(bandForFrequency(Number(f)).id === "visible")
  },
  {
    id: "medium-frequency",
    name: "Frequency stays fixed in a medium",
    input: { f: 3e14 },
    expected: 3e14,
    unit: "Hz",
    tolerance: 0,
    actual: ({ f }) => solveSpectrum(Number(f), "water").frequencyHz
  },
  {
    id: "water-wavelength",
    name: "Water wavelength contracts by refractive index",
    input: { f: 3e14 },
    expected: C2 / 1.333 / 3e14,
    unit: "m",
    tolerance: 1e-12,
    actual: ({ f }) => solveSpectrum(Number(f), "water").wavelengthM
  }
]);

// src/experiments/polarization-lab/polarizationSimulation.ts
var cos2 = (degrees2) => {
  const radians7 = degrees2 * Math.PI / 180;
  return Math.cos(radians7) ** 2;
};
function axialDifferenceDeg(a, b) {
  const raw = Math.abs(((a - b) % 180 + 180) % 180);
  return Math.min(raw, 180 - raw);
}
function solvePolarization(input2) {
  if (!Number.isFinite(input2.inputIntensityMw) || input2.inputIntensityMw < 0)
    throw new RangeError("Input intensity cannot be negative.");
  const polarizerFraction = input2.inputType === "linear" ? cos2(input2.polarizerDeg) : 0.5;
  const afterPolarizerMw = input2.inputIntensityMw * polarizerFraction;
  const relativeAngleDeg = axialDifferenceDeg(
    input2.analyzerDeg,
    input2.polarizerDeg
  );
  const analyzerFraction = cos2(relativeAngleDeg);
  const transmittedMw = afterPolarizerMw * analyzerFraction;
  return {
    polarizerFraction,
    afterPolarizerMw,
    relativeAngleDeg,
    analyzerFraction,
    transmittedMw,
    inputFraction: input2.inputIntensityMw ? transmittedMw / input2.inputIntensityMw : 0,
    state: analyzerFraction < 1e-6 ? "Extinction" : analyzerFraction > 0.999 ? "Maximum transmission" : "Partially transmitted"
  };
}
var polarizationBenchmarks = runBenchmarkCases([
  {
    id: "parallel",
    name: "Parallel axes transmit all polarized light",
    input: { p: 25, a: 25 },
    expected: 1,
    unit: "fraction",
    tolerance: 1e-12,
    actual: ({ p, a }) => solvePolarization({
      inputType: "unpolarized",
      inputIntensityMw: 1,
      polarizerDeg: Number(p),
      analyzerDeg: Number(a)
    }).analyzerFraction
  },
  {
    id: "sixty",
    name: "Sixty degrees transmits one quarter",
    input: { p: 0, a: 60 },
    expected: 0.25,
    unit: "fraction",
    tolerance: 1e-12,
    actual: ({ p, a }) => solvePolarization({
      inputType: "unpolarized",
      inputIntensityMw: 1,
      polarizerDeg: Number(p),
      analyzerDeg: Number(a)
    }).analyzerFraction
  },
  {
    id: "extinction",
    name: "Crossed axes produce extinction",
    input: { p: 10, a: 100 },
    expected: 0,
    unit: "mW",
    tolerance: 1e-12,
    actual: ({ p, a }) => solvePolarization({
      inputType: "unpolarized",
      inputIntensityMw: 2,
      polarizerDeg: Number(p),
      analyzerDeg: Number(a)
    }).transmittedMw
  },
  {
    id: "unpolarized-half",
    name: "Ideal polarizer halves unpolarized intensity",
    input: { i: 2 },
    expected: 1,
    unit: "mW",
    tolerance: 1e-12,
    actual: ({ i }) => solvePolarization({
      inputType: "unpolarized",
      inputIntensityMw: Number(i),
      polarizerDeg: 37,
      analyzerDeg: 37
    }).afterPolarizerMw
  },
  {
    id: "linear-first",
    name: "Linear input follows Malus law at first polarizer",
    input: { p: 60 },
    expected: 0.25,
    unit: "fraction",
    tolerance: 1e-12,
    actual: ({ p }) => solvePolarization({
      inputType: "linear",
      inputIntensityMw: 1,
      polarizerDeg: Number(p),
      analyzerDeg: Number(p)
    }).polarizerFraction
  },
  {
    id: "axial-period",
    name: "Polarizer axes repeat after 180 degrees",
    input: { p: 0, a: 180 },
    expected: 0,
    unit: "degrees",
    tolerance: 0,
    actual: ({ p, a }) => axialDifferenceDeg(Number(p), Number(a))
  }
]);

// src/experiments/glass-slab-refraction/glassSlabSimulation.ts
var wavelengthAdjustedIndex = (referenceIndex, wavelengthNm) => referenceIndex + 4e-3 * ((589.3 / Math.max(380, wavelengthNm)) ** 2 - 1);
function solveGlassSlab({
  incidenceDeg,
  referenceIndex,
  wavelengthNm,
  thicknessCm,
  surroundingIndex = 1
}) {
  const incidenceRad = incidenceDeg * Math.PI / 180;
  const slabIndex = wavelengthAdjustedIndex(referenceIndex, wavelengthNm);
  const sineR = surroundingIndex * Math.sin(incidenceRad) / slabIndex;
  const transmitted = Math.abs(sineR) <= 1;
  const refractionRad = transmitted ? Math.asin(sineR) : Number.NaN;
  const refractionDeg = transmitted ? refractionRad * 180 / Math.PI : Number.NaN;
  const lateralShiftCm = transmitted ? thicknessCm * Math.sin(incidenceRad - refractionRad) / Math.cos(refractionRad) : Number.NaN;
  return {
    incidenceDeg,
    incidenceRad,
    refractionDeg,
    refractionRad,
    emergentDeg: transmitted ? incidenceDeg : Number.NaN,
    lateralShiftCm,
    slabIndex,
    surroundingIndex,
    transmitted,
    snellLeft: surroundingIndex * Math.sin(incidenceRad),
    snellRight: transmitted ? slabIndex * Math.sin(refractionRad) : Number.NaN,
    lightSpeedMps: 299792458 / slabIndex
  };
}
var glassSlabBenchmarks = runBenchmarkCases([
  {
    id: "slab-snell",
    name: "Snell law at 40 degrees",
    input: { i: 40, n: 1.5, lambda: 589.3, t: 1.5 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) => {
      const s = solveGlassSlab({
        incidenceDeg: x.i,
        referenceIndex: x.n,
        wavelengthNm: x.lambda,
        thicknessCm: x.t
      });
      return s.snellLeft - s.snellRight;
    }
  },
  {
    id: "slab-refraction",
    name: "air to glass refraction angle",
    input: { i: 30, n: 1.5, lambda: 589.3, t: 1 },
    expected: 19.471220634491,
    unit: "deg",
    tolerance: 1e-12,
    actual: (x) => solveGlassSlab({
      incidenceDeg: x.i,
      referenceIndex: x.n,
      wavelengthNm: x.lambda,
      thicknessCm: x.t
    }).refractionDeg
  },
  {
    id: "slab-parallel",
    name: "emergent ray remains parallel",
    input: { i: 55, n: 1.62, lambda: 520, t: 2 },
    expected: 0,
    unit: "deg",
    tolerance: 1e-12,
    actual: (x) => {
      const s = solveGlassSlab({
        incidenceDeg: x.i,
        referenceIndex: x.n,
        wavelengthNm: x.lambda,
        thicknessCm: x.t
      });
      return s.emergentDeg - s.incidenceDeg;
    }
  },
  {
    id: "slab-normal",
    name: "normal incidence has zero shift",
    input: { i: 0, n: 1.5, lambda: 520, t: 3 },
    expected: 0,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) => solveGlassSlab({
      incidenceDeg: x.i,
      referenceIndex: x.n,
      wavelengthNm: x.lambda,
      thicknessCm: x.t
    }).lateralShiftCm
  },
  {
    id: "slab-dispersion",
    name: "violet bends more toward normal than red",
    input: { i: 50, n: 1.5, t: 1.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const violet = solveGlassSlab({
        incidenceDeg: x.i,
        referenceIndex: x.n,
        wavelengthNm: 400,
        thicknessCm: x.t
      });
      const red = solveGlassSlab({
        incidenceDeg: x.i,
        referenceIndex: x.n,
        wavelengthNm: 700,
        thicknessCm: x.t
      });
      return violet.refractionDeg < red.refractionDeg ? 1 : 0;
    }
  }
]);

// src/experiments/human-eye-defects/human-eye-defectsSimulation.ts
var RETINA_DISTANCE_M = 0.017;
var requiredPower = (objectDistanceM, retinaDistanceM = RETINA_DISTANCE_M) => 1 / objectDistanceM + 1 / retinaDistanceM;
function solveEye({
  objectDistanceM,
  eyePowerD,
  correctionPowerD,
  retinaDistanceM = RETINA_DISTANCE_M,
  accommodationD = 0
}) {
  const totalPowerD = eyePowerD + accommodationD + correctionPowerD;
  const denominator = totalPowerD - 1 / objectDistanceM;
  const imageDistanceM = denominator > 0 ? 1 / denominator : Infinity;
  const focusErrorM = imageDistanceM - retinaDistanceM;
  const neededCorrectionD = requiredPower(objectDistanceM, retinaDistanceM) - eyePowerD - accommodationD;
  return {
    totalPowerD,
    imageDistanceM,
    focusErrorM,
    neededCorrectionD,
    onRetina: Math.abs(focusErrorM) <= 5e-5,
    focusPosition: Math.abs(focusErrorM) <= 5e-5 ? "on retina" : focusErrorM < 0 ? "before retina" : "behind retina",
    magnification: -imageDistanceM / objectDistanceM
  };
}
var nearPointM = (eyePowerD, accommodationRangeD, retinaDistanceM = RETINA_DISTANCE_M) => {
  const objectVergence = eyePowerD + accommodationRangeD - 1 / retinaDistanceM;
  return objectVergence > 0 ? 1 / objectVergence : Infinity;
};
var correctionForMyopicFarPoint = (farPointMetres) => -1 / farPointMetres;
var humanEyeDefectsBenchmarks = runBenchmarkCases([
  {
    id: "eye-retina-focus",
    name: "required power focuses on retina",
    input: { u: 2, v: RETINA_DISTANCE_M },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (x) => solveEye({
      objectDistanceM: x.u,
      eyePowerD: requiredPower(x.u, x.v),
      correctionPowerD: 0,
      retinaDistanceM: x.v
    }).focusErrorM
  },
  {
    id: "eye-myopia-sign",
    name: "myopia needs negative correction",
    input: { u: 10, p: 61 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => solveEye({
      objectDistanceM: x.u,
      eyePowerD: x.p,
      correctionPowerD: 0
    }).neededCorrectionD < 0 ? 1 : 0
  },
  {
    id: "eye-hyperopia-sign",
    name: "hyperopia needs positive correction",
    input: { u: 2, p: 56 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => solveEye({
      objectDistanceM: x.u,
      eyePowerD: x.p,
      correctionPowerD: 0
    }).neededCorrectionD > 0 ? 1 : 0
  },
  {
    id: "eye-far-point",
    name: "80 cm myopic far point needs minus 1.25 D",
    input: { far: 0.8 },
    expected: -1.25,
    unit: "D",
    tolerance: 1e-12,
    actual: (x) => correctionForMyopicFarPoint(x.far)
  },
  {
    id: "eye-presbyopia",
    name: "reduced accommodation moves near point farther",
    input: { p: 1 / RETINA_DISTANCE_M, low: 3, normal: 4 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => nearPointM(x.p, x.low) > nearPointM(x.p, x.normal) ? 1 : 0
  }
]);

// src/experiments/lens-formula/lens-formulaSimulation.ts
function solveLens({
  objectDistanceCm,
  focalLengthCm,
  objectHeightCm,
  lensType
}) {
  const uCm = -Math.abs(objectDistanceCm);
  const fCm = lensType === "convex" ? Math.abs(focalLengthCm) : -Math.abs(focalLengthCm);
  const inverseV = 1 / fCm + 1 / uCm;
  const vCm = Math.abs(inverseV) < 1e-12 ? Infinity : 1 / inverseV;
  const magnification = vCm / uCm;
  const imageHeightCm = magnification * objectHeightCm;
  return {
    uCm,
    fCm,
    vCm,
    magnification,
    imageHeightCm,
    powerD: 100 / fCm,
    isReal: vCm > 0,
    isVirtual: vCm < 0,
    isInverted: imageHeightCm < 0,
    equationResidual: Number.isFinite(vCm) ? 1 / fCm - (1 / vCm - 1 / uCm) : 0
  };
}
var focalLengthFromPositions = (uCm, vCm) => 1 / (1 / vCm - 1 / uCm);
var lensFormulaBenchmarks = runBenchmarkCases([
  {
    id: "lens-real",
    name: "convex f 20 u minus 60 gives v 30",
    input: { u: 60, f: 20, h: 2 },
    expected: 30,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) => solveLens({
      objectDistanceCm: x.u,
      focalLengthCm: x.f,
      objectHeightCm: x.h,
      lensType: "convex"
    }).vCm
  },
  {
    id: "lens-virtual",
    name: "inside convex focus gives virtual image",
    input: { u: 10, f: 20, h: 2 },
    expected: -20,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) => solveLens({
      objectDistanceCm: x.u,
      focalLengthCm: x.f,
      objectHeightCm: x.h,
      lensType: "convex"
    }).vCm
  },
  {
    id: "lens-mag",
    name: "magnification equals v over u",
    input: { u: 30, f: 15, h: 2 },
    expected: -1,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) => solveLens({
      objectDistanceCm: x.u,
      focalLengthCm: x.f,
      objectHeightCm: x.h,
      lensType: "convex"
    }).magnification
  },
  {
    id: "lens-concave",
    name: "concave lens makes upright diminished virtual image",
    input: { u: 30, f: 15, h: 3 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solveLens({
        objectDistanceCm: x.u,
        focalLengthCm: x.f,
        objectHeightCm: x.h,
        lensType: "concave"
      });
      return s.isVirtual && s.imageHeightCm > 0 && Math.abs(s.magnification) < 1 ? 1 : 0;
    }
  },
  {
    id: "lens-mission",
    name: "u minus 24 v 48 implies f 16",
    input: { u: -24, v: 48 },
    expected: 16,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) => focalLengthFromPositions(x.u, x.v)
  }
]);

// src/experiments/mirror-formula/mirrorFormulaSimulation.ts
function solveMirror({
  mirrorType,
  objectDistanceCm,
  focalLengthCm,
  objectHeightCm
}) {
  const uCm = -Math.max(0.1, Math.abs(objectDistanceCm));
  const fCm = mirrorType === "concave" ? -Math.max(0.1, Math.abs(focalLengthCm)) : Math.max(0.1, Math.abs(focalLengthCm));
  const inverseV = 1 / fCm - 1 / uCm;
  const vCm = Math.abs(inverseV) < 1e-10 ? Infinity : 1 / inverseV;
  const magnification = Number.isFinite(vCm) ? -vCm / uCm : Infinity;
  const imageHeightCm = Number.isFinite(magnification) ? magnification * objectHeightCm : Infinity;
  const isReal = vCm < 0;
  const isVirtual = vCm > 0;
  return {
    uCm,
    fCm,
    vCm,
    magnification,
    imageHeightCm,
    radiusCm: 2 * fCm,
    isReal,
    isVirtual,
    orientation: magnification < 0 ? "inverted" : "upright",
    size: Math.abs(magnification) > 1.01 ? "magnified" : Math.abs(magnification) < 0.99 ? "diminished" : "same size",
    equationResidual: Number.isFinite(vCm) ? 1 / fCm - (1 / vCm + 1 / uCm) : 0
  };
}
var mirrorFormulaBenchmarks = runBenchmarkCases([
  {
    id: "concave-real",
    name: "concave f minus 20 u minus 60 gives v minus 30",
    input: { u: 60, f: 20 },
    expected: -30,
    unit: "cm",
    tolerance: 1e-12,
    actual: (x) => solveMirror({
      mirrorType: "concave",
      objectDistanceCm: x.u,
      focalLengthCm: x.f,
      objectHeightCm: 3
    }).vCm
  },
  {
    id: "concave-virtual",
    name: "inside concave focus gives virtual upright magnified image",
    input: { u: 10, f: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solveMirror({
        mirrorType: "concave",
        objectDistanceCm: x.u,
        focalLengthCm: x.f,
        objectHeightCm: 3
      });
      return s.isVirtual && s.orientation === "upright" && s.magnification > 1 ? 1 : 0;
    }
  },
  {
    id: "convex",
    name: "convex mirror image is always virtual upright diminished",
    input: { u: 40, f: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solveMirror({
        mirrorType: "convex",
        objectDistanceCm: x.u,
        focalLengthCm: x.f,
        objectHeightCm: 3
      });
      return s.isVirtual && s.orientation === "upright" && s.magnification < 1 ? 1 : 0;
    }
  },
  {
    id: "magnification",
    name: "mirror magnification is minus v over u",
    input: { u: 60, f: 20 },
    expected: -0.5,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) => solveMirror({
      mirrorType: "concave",
      objectDistanceCm: x.u,
      focalLengthCm: x.f,
      objectHeightCm: 3
    }).magnification
  },
  {
    id: "residual",
    name: "mirror formula residual is zero",
    input: { u: 35, f: 15 },
    expected: 0,
    unit: "1/cm",
    tolerance: 1e-12,
    actual: (x) => solveMirror({
      mirrorType: "concave",
      objectDistanceCm: x.u,
      focalLengthCm: x.f,
      objectHeightCm: 3
    }).equationResidual
  }
]);

// src/experiments/multiple-reflection/multipleReflectionSimulation.ts
var nearlyInteger = (value) => Math.abs(value - Math.round(value)) < 1e-9;
function imageCountForTwoMirrors({
  angleDeg,
  objectCentered
}) {
  const angle = Math.min(180, Math.max(1, angleDeg));
  const quotient = 360 / angle;
  if (!nearlyInteger(quotient)) return Math.floor(quotient);
  const sectors = Math.round(quotient);
  return sectors % 2 === 0 || objectCentered ? sectors - 1 : sectors;
}
var multipleReflectionBenchmarks = runBenchmarkCases([
  {
    id: "right-angle",
    name: "ninety degrees gives three images",
    input: { angle: 90 },
    expected: 3,
    unit: "images",
    tolerance: 0,
    actual: (x) => imageCountForTwoMirrors({ angleDeg: x.angle, objectCentered: true })
  },
  {
    id: "sixty",
    name: "sixty degrees gives five images",
    input: { angle: 60 },
    expected: 5,
    unit: "images",
    tolerance: 0,
    actual: (x) => imageCountForTwoMirrors({ angleDeg: x.angle, objectCentered: true })
  },
  {
    id: "mission-seven",
    name: "forty five degrees gives seven images",
    input: { angle: 45 },
    expected: 7,
    unit: "images",
    tolerance: 0,
    actual: (x) => imageCountForTwoMirrors({ angleDeg: x.angle, objectCentered: true })
  },
  {
    id: "odd-boundary",
    name: "odd exact quotient depends on centered object",
    input: { angle: 40 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => imageCountForTwoMirrors({ angleDeg: x.angle, objectCentered: true }) === 8 && imageCountForTwoMirrors({ angleDeg: x.angle, objectCentered: false }) === 9 ? 1 : 0
  },
  {
    id: "non-integer",
    name: "non integer quotient uses floor",
    input: { angle: 50 },
    expected: 7,
    unit: "images",
    tolerance: 0,
    actual: (x) => imageCountForTwoMirrors({ angleDeg: x.angle, objectCentered: false })
  }
]);

// src/experiments/prism-dispersion/prism-dispersionSimulation.ts
var prismMaterials = {
  bk7: { label: "Crown glass (BK7)", a: 1.5046, b: 42e-4 },
  silica: { label: "Fused silica", a: 1.4519, b: 384e-5 },
  sf10: { label: "Flint glass (SF10)", a: 1.6939, b: 0.01316 },
  sf6: { label: "Dense flint (SF6)", a: 1.7569, b: 0.01472 }
};
var spectralLines = [
  { wavelengthNm: 410, label: "Violet", color: "#7654d8" },
  { wavelengthNm: 486.1, label: "Blue", color: "#3180e9" },
  { wavelengthNm: 546.1, label: "Green", color: "#28a55f" },
  { wavelengthNm: 589.3, label: "Yellow", color: "#e2b72a" },
  { wavelengthNm: 656.3, label: "Red", color: "#ef5b43" },
  { wavelengthNm: 706.5, label: "Deep red", color: "#c83435" }
];
var toRad = (degrees2) => degrees2 * Math.PI / 180;
var toDeg = (radians7) => radians7 * 180 / Math.PI;
function refractiveIndex(material, wavelengthNm) {
  const wavelengthUm = wavelengthNm / 1e3;
  const model = prismMaterials[material];
  return model.a + model.b / (wavelengthUm * wavelengthUm);
}
function solvePrismRay({
  apexAngleDeg,
  incidenceAngleDeg,
  material,
  wavelengthNm
}) {
  const n = refractiveIndex(material, wavelengthNm);
  const iRad = toRad(incidenceAngleDeg);
  const r1Rad = Math.asin(Math.sin(iRad) / n);
  const r2Rad = toRad(apexAngleDeg) - r1Rad;
  const exitSine = n * Math.sin(r2Rad);
  const totalInternalReflection = Math.abs(exitSine) > 1;
  const emergenceAngleDeg = totalInternalReflection ? NaN : toDeg(Math.asin(exitSine));
  const deviationDeg = totalInternalReflection ? NaN : incidenceAngleDeg + emergenceAngleDeg - apexAngleDeg;
  return {
    wavelengthNm,
    n,
    r1Deg: toDeg(r1Rad),
    r2Deg: toDeg(r2Rad),
    emergenceAngleDeg,
    deviationDeg,
    totalInternalReflection,
    entrySnellResidual: Math.sin(iRad) - n * Math.sin(r1Rad),
    exitSnellResidual: totalInternalReflection ? NaN : n * Math.sin(r2Rad) - Math.sin(toRad(emergenceAngleDeg))
  };
}
function solvePrismSpectrum({
  apexAngleDeg,
  incidenceAngleDeg,
  material
}) {
  const rays = spectralLines.map((line2) => ({
    ...line2,
    ...solvePrismRay({
      apexAngleDeg,
      incidenceAngleDeg,
      material,
      wavelengthNm: line2.wavelengthNm
    })
  }));
  const safe = rays.filter((ray) => !ray.totalInternalReflection);
  const violet = rays[0], red = rays[rays.length - 1];
  const angularDispersionDeg = violet.totalInternalReflection || red.totalInternalReflection ? NaN : violet.deviationDeg - red.deviationDeg;
  const referenceIndex = refractiveIndex(material, 589.3);
  const minimumArgument = referenceIndex * Math.sin(toRad(apexAngleDeg / 2));
  const minimumIncidenceDeg = minimumArgument <= 1 ? toDeg(Math.asin(minimumArgument)) : NaN;
  const minimumDeviationDeg = Number.isFinite(minimumIncidenceDeg) ? 2 * minimumIncidenceDeg - apexAngleDeg : NaN;
  return {
    rays,
    safeRayCount: safe.length,
    hasTir: safe.length !== rays.length,
    angularDispersionDeg,
    referenceIndex,
    minimumIncidenceDeg,
    minimumDeviationDeg
  };
}
var prismDispersionBenchmarks = runBenchmarkCases([
  {
    id: "entry-snell",
    name: "Snell law residual at first face",
    input: { A: 60, i: 50, wavelength: 589.3 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) => solvePrismRay({
      apexAngleDeg: x.A,
      incidenceAngleDeg: x.i,
      material: "bk7",
      wavelengthNm: x.wavelength
    }).entrySnellResidual
  },
  {
    id: "exit-snell",
    name: "Snell law residual at second face",
    input: { A: 60, i: 50, wavelength: 589.3 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (x) => solvePrismRay({
      apexAngleDeg: x.A,
      incidenceAngleDeg: x.i,
      material: "bk7",
      wavelengthNm: x.wavelength
    }).exitSnellResidual
  },
  {
    id: "violet-order",
    name: "violet deviates more than red",
    input: { A: 60, i: 50 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solvePrismSpectrum({
        apexAngleDeg: x.A,
        incidenceAngleDeg: x.i,
        material: "bk7"
      });
      return s.rays[0].deviationDeg > s.rays[s.rays.length - 1].deviationDeg ? 1 : 0;
    }
  },
  {
    id: "minimum-deviation",
    name: "minimum deviation is symmetric",
    input: { A: 60 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => {
      const s = solvePrismSpectrum({
        apexAngleDeg: x.A,
        incidenceAngleDeg: 50,
        material: "bk7"
      });
      const ray = solvePrismRay({
        apexAngleDeg: x.A,
        incidenceAngleDeg: s.minimumIncidenceDeg,
        material: "bk7",
        wavelengthNm: 589.3
      });
      return Math.abs(ray.r1Deg - ray.r2Deg) < 1e-9 && Math.abs(ray.deviationDeg - s.minimumDeviationDeg) < 1e-9 ? 1 : 0;
    }
  },
  {
    id: "tir",
    name: "steep second-face incidence triggers total internal reflection",
    input: { A: 75, i: 20 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (x) => solvePrismRay({
      apexAngleDeg: x.A,
      incidenceAngleDeg: x.i,
      material: "sf6",
      wavelengthNm: 410
    }).totalInternalReflection ? 1 : 0
  }
]);

// src/experiments/total-internal-reflection/total-internal-reflectionSimulation.ts
var radians2 = (degrees2) => degrees2 * Math.PI / 180;
var degrees = (radiansValue) => radiansValue * 180 / Math.PI;
var clamp2 = (value, min, max) => Math.min(max, Math.max(min, value));
function criticalAngleDeg(n1, n2) {
  if (!(n1 > n2) || n2 <= 0) return Number.NaN;
  return degrees(Math.asin(n2 / n1));
}
function fresnelPower(incidenceDeg, n1, n2) {
  const incidence = radians2(clamp2(incidenceDeg, 0, 89.9));
  const sinTransmission = n1 / n2 * Math.sin(incidence);
  if (sinTransmission >= 1) {
    return { reflectance: 1, transmittance: 0, transmissionDeg: Number.NaN };
  }
  const transmission = Math.asin(sinTransmission);
  const cosI = Math.cos(incidence);
  const cosT = Math.cos(transmission);
  const rs = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
  const rp = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
  const reflectance = clamp2((rs * rs + rp * rp) / 2, 0, 1);
  return {
    reflectance,
    transmittance: 1 - reflectance,
    transmissionDeg: degrees(transmission)
  };
}
function solveTir({
  incidenceDeg,
  n1,
  n2
}) {
  const criticalDeg = criticalAngleDeg(n1, n2);
  const power = fresnelPower(incidenceDeg, n1, n2);
  const hasCriticalAngle = Number.isFinite(criticalDeg);
  const delta = hasCriticalAngle ? incidenceDeg - criticalDeg : Number.NaN;
  const regime = !hasCriticalAngle ? "ordinary-refraction" : Math.abs(delta) <= 0.05 ? "critical" : delta > 0 ? "total-internal-reflection" : "refraction";
  return {
    ...power,
    criticalDeg,
    regime,
    reflectedDeg: incidenceDeg,
    snellResidual: Number.isFinite(power.transmissionDeg) ? n1 * Math.sin(radians2(incidenceDeg)) - n2 * Math.sin(radians2(power.transmissionDeg)) : Number.NaN
  };
}
var totalInternalReflectionBenchmarks = runBenchmarkCases([
  {
    id: "critical-angle",
    name: "n1=1.5 and n2=1 gives critical angle 41.8103 degrees",
    input: { n1: 1.5, n2: 1 },
    expected: 41.8103148958,
    unit: "deg",
    tolerance: 1e-9,
    actual: (input2) => criticalAngleDeg(input2.n1, input2.n2)
  },
  {
    id: "no-critical-rarer-to-denser",
    name: "rarer-to-denser travel has no critical angle",
    input: { n1: 1, n2: 1.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number.isNaN(criticalAngleDeg(input2.n1, input2.n2)) ? 1 : 0
  },
  {
    id: "snell-below-critical",
    name: "Snell law is satisfied below the critical angle",
    input: { incidence: 30, n1: 1.5, n2: 1 },
    expected: 0,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (input2) => solveTir({ incidenceDeg: input2.incidence, n1: input2.n1, n2: input2.n2 }).snellResidual
  },
  {
    id: "tir-energy",
    name: "above critical angle reflection is complete",
    input: { incidence: 56, n1: 1.516, n2: 1 },
    expected: 1,
    unit: "fraction",
    tolerance: 0,
    actual: (input2) => solveTir({ incidenceDeg: input2.incidence, n1: input2.n1, n2: input2.n2 }).reflectance
  },
  {
    id: "reflection-angle",
    name: "reflection angle equals incidence angle",
    input: { incidence: 63, n1: 1.6, n2: 1.2 },
    expected: 63,
    unit: "deg",
    tolerance: 0,
    actual: (input2) => solveTir({ incidenceDeg: input2.incidence, n1: input2.n1, n2: input2.n2 }).reflectedDeg
  }
]);

// src/experiments/reflection-plane-mirror/reflection-plane-mirrorSimulation.ts
var toRad2 = (value) => value * Math.PI / 180;
var toDeg2 = (value) => value * 180 / Math.PI;
var clamp3 = (value, min, max) => Math.min(max, Math.max(min, value));
var add3 = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
var sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
var scale2 = (a, value) => ({
  x: a.x * value,
  y: a.y * value
});
var dot = (a, b) => a.x * b.x + a.y * b.y;
var cross = (a, b) => a.x * b.y - a.y * b.x;
var length = (a) => Math.hypot(a.x, a.y);
var unit = (a) => {
  const magnitude2 = length(a) || 1;
  return scale2(a, 1 / magnitude2);
};
function mirrorBasis(mirrorAngleDeg) {
  const angle = toRad2(mirrorAngleDeg);
  return {
    tangent: { x: Math.sin(angle), y: Math.cos(angle) },
    normal: { x: Math.cos(angle), y: -Math.sin(angle) }
  };
}
function reflectPoint(point, mirrorAngleDeg) {
  const { normal } = mirrorBasis(mirrorAngleDeg);
  return sub(point, scale2(normal, 2 * dot(point, normal)));
}
function reflectDirection(direction, mirrorAngleDeg) {
  const { normal } = mirrorBasis(mirrorAngleDeg);
  const incoming = unit(direction);
  return unit(sub(incoming, scale2(normal, 2 * dot(incoming, normal))));
}
function lineMirrorIntersection(origin, direction, mirrorAngleDeg) {
  const { tangent } = mirrorBasis(mirrorAngleDeg);
  const denominator = cross(direction, tangent);
  if (Math.abs(denominator) < 1e-10)
    return { valid: false, point: { x: 0, y: 0 }, rayT: NaN, mirrorT: NaN };
  const rayT = cross(scale2(origin, -1), tangent) / denominator;
  const mirrorT = cross(scale2(origin, -1), direction) / denominator;
  return {
    valid: Number.isFinite(rayT) && Number.isFinite(mirrorT),
    point: add3(origin, scale2(direction, rayT)),
    rayT,
    mirrorT
  };
}
function solvePlaneMirror(input2) {
  const mirrorHalfHeightCm = input2.mirrorHalfHeightCm ?? 8;
  const basis = mirrorBasis(input2.mirrorAngleDeg);
  const image = reflectPoint(input2.object, input2.mirrorAngleDeg);
  const objectNormalDistanceCm = Math.abs(dot(input2.object, basis.normal));
  const imageNormalDistanceCm = Math.abs(dot(image, basis.normal));
  const objectTangentialCm = dot(input2.object, basis.tangent);
  const imageTangentialCm = dot(image, basis.tangent);
  const incidentDirection = unit({
    x: Math.cos(toRad2(input2.rayAngleDeg)),
    y: Math.sin(toRad2(input2.rayAngleDeg))
  });
  const probe = lineMirrorIntersection(
    input2.object,
    incidentDirection,
    input2.mirrorAngleDeg
  );
  const reflectedDirection = reflectDirection(
    incidentDirection,
    input2.mirrorAngleDeg
  );
  const incidenceAngleDeg = toDeg2(
    Math.acos(clamp3(Math.abs(dot(incidentDirection, basis.normal)), -1, 1))
  );
  const reflectionAngleDeg = toDeg2(
    Math.acos(clamp3(Math.abs(dot(reflectedDirection, basis.normal)), -1, 1))
  );
  const probeHitsMirror = probe.valid && probe.rayT >= 0 && Math.abs(probe.mirrorT) <= mirrorHalfHeightCm;
  const observerVector = sub(input2.observer, probe.point);
  const observerProjectionCm = dot(observerVector, reflectedDirection);
  const observerMissCm = probeHitsMirror ? observerProjectionCm >= 0 ? Math.abs(cross(observerVector, reflectedDirection)) : length(observerVector) : Infinity;
  const selectedObjectPoint = add3(input2.object, scale2(basis.tangent, 1.8));
  const selectedImagePoint = reflectPoint(
    selectedObjectPoint,
    input2.mirrorAngleDeg
  );
  const sightDirection = unit(sub(selectedImagePoint, input2.observer));
  const sight = lineMirrorIntersection(
    input2.observer,
    sightDirection,
    input2.mirrorAngleDeg
  );
  const observerInFront = dot(input2.observer, basis.normal) < 0;
  const selectedPointVisible = observerInFront && sight.valid && sight.rayT >= 0 && Math.abs(sight.mirrorT) <= mirrorHalfHeightCm;
  return {
    ...input2,
    mirrorHalfHeightCm,
    ...basis,
    image,
    selectedObjectPoint,
    selectedImagePoint,
    incidentDirection,
    reflectedDirection,
    probeHit: probe.point,
    probeMirrorCoordinateCm: probe.mirrorT,
    probeHitsMirror,
    incidenceAngleDeg,
    reflectionAngleDeg,
    angleResidualDeg: incidenceAngleDeg - reflectionAngleDeg,
    observerMissCm,
    sightHit: sight.point,
    sightMirrorCoordinateCm: sight.mirrorT,
    observerInFront,
    selectedPointVisible,
    objectNormalDistanceCm,
    imageNormalDistanceCm,
    distanceResidualCm: objectNormalDistanceCm - imageNormalDistanceCm,
    objectTangentialCm,
    imageTangentialCm,
    lateralNormalProduct: dot(input2.object, basis.normal) * dot(image, basis.normal)
  };
}
var reflectionPlaneMirrorBenchmarks = runBenchmarkCases([
  {
    id: "equal-angles",
    name: "incidence equals reflection for a tilted mirror",
    input: { mirrorAngle: 13, rayAngle: 24 },
    expected: 0,
    unit: "degrees",
    tolerance: 1e-12,
    actual: (value) => solvePlaneMirror({
      mirrorAngleDeg: value.mirrorAngle,
      rayAngleDeg: value.rayAngle,
      object: { x: -12, y: -2 },
      observer: { x: -12, y: 5 }
    }).angleResidualDeg
  },
  {
    id: "equal-distances",
    name: "image and object have equal perpendicular distances",
    input: { mirrorAngle: -17 },
    expected: 0,
    unit: "centimetres",
    tolerance: 1e-12,
    actual: (value) => solvePlaneMirror({
      mirrorAngleDeg: value.mirrorAngle,
      rayAngleDeg: 10,
      object: { x: -14, y: 4 },
      observer: { x: -10, y: -3 }
    }).distanceResidualCm
  },
  {
    id: "tangent-preserved",
    name: "reflection preserves coordinate along the mirror",
    input: { mirrorAngle: 19 },
    expected: 0,
    unit: "centimetres",
    tolerance: 1e-12,
    actual: (value) => {
      const solved2 = solvePlaneMirror({
        mirrorAngleDeg: value.mirrorAngle,
        rayAngleDeg: 15,
        object: { x: -11, y: 5 },
        observer: { x: -16, y: -1 }
      });
      return solved2.objectTangentialCm - solved2.imageTangentialCm;
    }
  },
  {
    id: "lateral-inversion",
    name: "reflection reverses the normal coordinate",
    input: { mirrorAngle: 0 },
    expected: -1,
    unit: "sign",
    tolerance: 0,
    actual: (value) => {
      const solved2 = solvePlaneMirror({
        mirrorAngleDeg: value.mirrorAngle,
        rayAngleDeg: 12,
        object: { x: -9, y: 1 },
        observer: { x: -12, y: 4 }
      });
      return Math.sign(solved2.lateralNormalProduct);
    }
  },
  {
    id: "finite-mirror-visibility",
    name: "selected point visibility uses the finite mirror segment",
    input: { observerY: 5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) => solvePlaneMirror({
      mirrorAngleDeg: 0,
      rayAngleDeg: 15,
      object: { x: -12, y: -2 },
      observer: { x: -13, y: value.observerY }
    }).selectedPointVisible ? 1 : 0
  }
]);

// src/experiments/shadows-eclipses/shadows-eclipsesSimulation.ts
var astronomicalConstants = {
  sunRadiusKm: 696340,
  earthRadiusKm: 6371,
  moonRadiusKm: 1737.4,
  astronomicalUnitKm: 1495978707e-1,
  meanMoonDistanceKm: 384400
};
var rad = (degrees2) => degrees2 * Math.PI / 180;
var deg = (radians7) => radians7 * 180 / Math.PI;
var clamp4 = (value, min, max) => Math.min(max, Math.max(min, value));
function angularDiameterDeg(radiusKm, distanceKm) {
  return deg(2 * Math.atan(radiusKm / distanceKm));
}
function solveEclipse(input2) {
  const {
    earthRadiusKm,
    moonRadiusKm,
    astronomicalUnitKm,
    meanMoonDistanceKm
  } = astronomicalConstants;
  const sunRadiusKm = astronomicalConstants.sunRadiusKm * input2.sunRadiusScale;
  const moonDistanceKm = meanMoonDistanceKm * input2.moonDistanceScale;
  const sunAngularDiameterDeg = angularDiameterDeg(
    sunRadiusKm,
    astronomicalUnitKm
  );
  const moonAngularDiameterDeg = angularDiameterDeg(
    moonRadiusKm,
    moonDistanceKm
  );
  const horizontalParallaxDeg = deg(Math.asin(earthRadiusKm / moonDistanceKm));
  const observerParallaxDeg = horizontalParallaxDeg * Math.sin(rad(input2.observerLatitudeDeg));
  const apparentSeparationDeg = Math.abs(
    input2.alignmentDeg - observerParallaxDeg
  );
  const sunAngularRadiusDeg = sunAngularDiameterDeg / 2;
  const moonAngularRadiusDeg = moonAngularDiameterDeg / 2;
  let solarType = "none";
  if (apparentSeparationDeg < sunAngularRadiusDeg + moonAngularRadiusDeg) {
    if (apparentSeparationDeg <= Math.abs(moonAngularRadiusDeg - sunAngularRadiusDeg))
      solarType = moonAngularRadiusDeg >= sunAngularRadiusDeg ? "total" : "annular";
    else solarType = "partial";
  }
  const sunMoonDistanceKm = astronomicalUnitKm - moonDistanceKm;
  const moonUmbraLengthKm = sunMoonDistanceKm * moonRadiusKm / (sunRadiusKm - moonRadiusKm);
  const signedUmbraRadiusAtEarthKm = moonRadiusKm - moonDistanceKm * (sunRadiusKm - moonRadiusKm) / sunMoonDistanceKm;
  const penumbraRadiusAtEarthKm = moonRadiusKm + moonDistanceKm * (sunRadiusKm + moonRadiusKm) / sunMoonDistanceKm;
  const earthUmbraLengthKm = astronomicalUnitKm * earthRadiusKm / (sunRadiusKm - earthRadiusKm);
  const earthUmbraRadiusAtMoonKm = earthRadiusKm - moonDistanceKm * (sunRadiusKm - earthRadiusKm) / astronomicalUnitKm;
  const earthPenumbraRadiusAtMoonKm = earthRadiusKm + moonDistanceKm * (sunRadiusKm + earthRadiusKm) / astronomicalUnitKm;
  const moonOffsetKm = Math.abs(
    moonDistanceKm * Math.tan(rad(input2.alignmentDeg))
  );
  let lunarType = "none";
  if (moonOffsetKm + moonRadiusKm <= earthUmbraRadiusAtMoonKm)
    lunarType = "total";
  else if (moonOffsetKm < earthUmbraRadiusAtMoonKm + moonRadiusKm)
    lunarType = "partial";
  else if (moonOffsetKm < earthPenumbraRadiusAtMoonKm + moonRadiusKm)
    lunarType = "penumbral";
  const eclipseType = input2.mode === "solar" ? solarType : lunarType;
  const bodyOrder = input2.mode === "solar" ? "Sun \u2192 Moon \u2192 Earth" : "Sun \u2192 Earth \u2192 Moon";
  const angularSizeDifferenceDeg = moonAngularDiameterDeg - sunAngularDiameterDeg;
  const totalityCenterLatitudeDeg = deg(
    Math.asin(clamp4(input2.alignmentDeg / horizontalParallaxDeg, -1, 1))
  );
  const centralCondition = apparentSeparationDeg <= Math.abs(moonAngularRadiusDeg - sunAngularRadiusDeg);
  return {
    ...input2,
    sunRadiusKm,
    moonDistanceKm,
    sunAngularDiameterDeg,
    moonAngularDiameterDeg,
    angularSizeDifferenceDeg,
    horizontalParallaxDeg,
    observerParallaxDeg,
    apparentSeparationDeg,
    solarType,
    lunarType,
    eclipseType,
    bodyOrder,
    centralCondition,
    totalityCenterLatitudeDeg,
    moonUmbraLengthKm,
    signedUmbraRadiusAtEarthKm,
    penumbraRadiusAtEarthKm,
    earthUmbraLengthKm,
    earthUmbraRadiusAtMoonKm,
    earthPenumbraRadiusAtMoonKm,
    moonOffsetKm
  };
}
var shadowsEclipsesBenchmarks = runBenchmarkCases([
  {
    id: "solar-order",
    name: "solar eclipse has Moon between Sun and Earth",
    input: { value: 1 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => solveEclipse({
      mode: "solar",
      sunRadiusScale: 1,
      moonDistanceScale: 0.94,
      alignmentDeg: 0,
      observerLatitudeDeg: 0
    }).bodyOrder === "Sun \u2192 Moon \u2192 Earth" ? 1 : 0
  },
  {
    id: "lunar-order",
    name: "lunar eclipse has Earth between Sun and Moon",
    input: { value: 1 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => solveEclipse({
      mode: "lunar",
      sunRadiusScale: 1,
      moonDistanceScale: 1,
      alignmentDeg: 0,
      observerLatitudeDeg: 0
    }).bodyOrder === "Sun \u2192 Earth \u2192 Moon" ? 1 : 0
  },
  {
    id: "total-angular-size",
    name: "central larger apparent Moon produces total solar eclipse",
    input: { moonDistanceScale: 0.94 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) => {
      const result = solveEclipse({
        mode: "solar",
        sunRadiusScale: 1,
        moonDistanceScale: value.moonDistanceScale,
        alignmentDeg: 0,
        observerLatitudeDeg: 0
      });
      return result.eclipseType === "total" && result.angularSizeDifferenceDeg > 0 ? 1 : 0;
    }
  },
  {
    id: "annular-angular-size",
    name: "central smaller apparent Moon produces annular eclipse",
    input: { moonDistanceScale: 1.08 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) => solveEclipse({
      mode: "solar",
      sunRadiusScale: 1,
      moonDistanceScale: value.moonDistanceScale,
      alignmentDeg: 0,
      observerLatitudeDeg: 0
    }).eclipseType === "annular" ? 1 : 0
  },
  {
    id: "lunar-totality",
    name: "aligned Moon fits inside Earth's umbra",
    input: { alignment: 0 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) => solveEclipse({
      mode: "lunar",
      sunRadiusScale: 1,
      moonDistanceScale: 1,
      alignmentDeg: value.alignment,
      observerLatitudeDeg: 0
    }).eclipseType === "total" ? 1 : 0
  }
]);

// src/experiments/optical-instruments/opticalInstrumentsSimulation.ts
var NEAR_POINT_MM = 250;
function eyepieceObjectDistanceMm(eyepieceFocalMm, focusMode) {
  return focusMode === "normal" ? eyepieceFocalMm : eyepieceFocalMm * NEAR_POINT_MM / (NEAR_POINT_MM + eyepieceFocalMm);
}
function solveOpticalInstrument({
  mode,
  focusMode,
  objectiveFocalMm,
  eyepieceFocalMm,
  tubeLengthMm,
  focusOffsetMm = 0,
  apertureMm = 8
}) {
  const fo = Math.max(0.1, objectiveFocalMm);
  const fe = Math.max(0.1, eyepieceFocalMm);
  const eyepieceObjectMm = eyepieceObjectDistanceMm(fe, focusMode);
  if (mode === "microscope") {
    const intermediateDistanceMm = Math.max(
      fo + 0.1,
      tubeLengthMm - eyepieceObjectMm + focusOffsetMm
    );
    const specimenDistanceMm = fo * intermediateDistanceMm / (intermediateDistanceMm - fo);
    const objectiveMagnification = -intermediateDistanceMm / specimenDistanceMm;
    const eyepieceMagnification = focusMode === "normal" ? NEAR_POINT_MM / fe : 1 + NEAR_POINT_MM / fe;
    const magnification2 = objectiveMagnification * eyepieceMagnification;
    const numericalAperture = Math.min(
      0.95,
      Math.max(0.01, apertureMm / (2 * fo))
    );
    const resolutionUm = 0.61 * 0.55 / numericalAperture;
    const focusScore = Math.max(0, 100 - Math.abs(focusOffsetMm) * 12.5);
    return {
      mode,
      focusMode,
      targetTubeLengthMm: tubeLengthMm,
      intermediateDistanceMm,
      specimenDistanceMm,
      objectiveMagnification,
      eyepieceMagnification,
      magnification: magnification2,
      orientation: "inverted",
      focusErrorMm: focusOffsetMm,
      focusScore,
      numericalAperture,
      resolutionUm,
      finalImage: focusMode === "normal" ? "at infinity" : "at 25 cm"
    };
  }
  const targetTubeLengthMm = fo + eyepieceObjectMm;
  const effectiveTubeLengthMm = tubeLengthMm + focusOffsetMm;
  const focusErrorMm = effectiveTubeLengthMm - targetTubeLengthMm;
  const magnification = -(fo / fe) * (focusMode === "near-point" ? 1 + fe / NEAR_POINT_MM : 1);
  return {
    mode,
    focusMode,
    targetTubeLengthMm,
    intermediateDistanceMm: fo,
    specimenDistanceMm: Infinity,
    objectiveMagnification: -fo / fe,
    eyepieceMagnification: 1,
    magnification,
    orientation: "inverted",
    focusErrorMm,
    focusScore: Math.max(0, 100 - Math.abs(focusErrorMm) * 2),
    numericalAperture: 0,
    resolutionUm: 0,
    finalImage: focusMode === "normal" ? "at infinity" : "at 25 cm"
  };
}
var opticalInstrumentsBenchmarks = runBenchmarkCases([
  {
    id: "microscope-normal",
    name: "microscope normal adjustment includes objective and eyepiece magnification",
    input: { fo: 10, fe: 25, L: 160 },
    expected: -125,
    unit: "times",
    tolerance: 1e-10,
    actual: (x) => solveOpticalInstrument({
      mode: "microscope",
      focusMode: "normal",
      objectiveFocalMm: x.fo,
      eyepieceFocalMm: x.fe,
      tubeLengthMm: x.L
    }).magnification
  },
  {
    id: "microscope-near",
    name: "near-point eyepiece magnification is one plus D over fe",
    input: { fe: 25 },
    expected: 11,
    unit: "times",
    tolerance: 1e-12,
    actual: (x) => solveOpticalInstrument({
      mode: "microscope",
      focusMode: "near-point",
      objectiveFocalMm: 10,
      eyepieceFocalMm: x.fe,
      tubeLengthMm: 160
    }).eyepieceMagnification
  },
  {
    id: "telescope-normal",
    name: "astronomical telescope angular magnification is minus fo over fe",
    input: { fo: 500, fe: 25 },
    expected: -20,
    unit: "times",
    tolerance: 1e-12,
    actual: (x) => solveOpticalInstrument({
      mode: "telescope",
      focusMode: "normal",
      objectiveFocalMm: x.fo,
      eyepieceFocalMm: x.fe,
      tubeLengthMm: 525
    }).magnification
  },
  {
    id: "telescope-length",
    name: "normal telescope length is fo plus fe",
    input: { fo: 500, fe: 25 },
    expected: 525,
    unit: "mm",
    tolerance: 1e-12,
    actual: (x) => solveOpticalInstrument({
      mode: "telescope",
      focusMode: "normal",
      objectiveFocalMm: x.fo,
      eyepieceFocalMm: x.fe,
      tubeLengthMm: 525
    }).targetTubeLengthMm
  },
  {
    id: "orientation",
    name: "both compound instruments invert the final image",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => ["microscope", "telescope"].every(
      (mode) => solveOpticalInstrument({
        mode,
        focusMode: "normal",
        objectiveFocalMm: mode === "microscope" ? 10 : 500,
        eyepieceFocalMm: 25,
        tubeLengthMm: mode === "microscope" ? 160 : 525
      }).magnification < 0
    ) ? 1 : 0
  }
]);

// src/experiments/elastic-collision/elastic-collisionSimulation.ts
function simulateElasticCollision(input2) {
  const m1 = Math.max(0.05, input2.m1), m2 = Math.max(0.05, input2.m2), e = Math.max(0, Math.min(1, input2.restitution ?? 1));
  const totalMass = m1 + m2;
  const relative = input2.u1 - input2.u2;
  const v1 = (m1 * input2.u1 + m2 * input2.u2 - m2 * e * relative) / totalMass;
  const v2 = (m1 * input2.u1 + m2 * input2.u2 + m1 * e * relative) / totalMass;
  const momentumBefore = m1 * input2.u1 + m2 * input2.u2;
  const momentumAfter = m1 * v1 + m2 * v2;
  const kineticBefore = 0.5 * m1 * input2.u1 ** 2 + 0.5 * m2 * input2.u2 ** 2;
  const kineticAfter = 0.5 * m1 * v1 ** 2 + 0.5 * m2 * v2 ** 2;
  const conservationErrorPercent = Math.abs((kineticAfter - kineticBefore) / Math.max(kineticBefore, 1e-9)) * 100;
  return {
    v1,
    v2,
    momentumBefore,
    momentumAfter,
    kineticBefore,
    kineticAfter,
    dissipatedEnergy: kineticBefore - kineticAfter,
    conservationErrorPercent,
    restitution: e
  };
}
var elasticCollisionBenchmarks = runBenchmarkCases([
  {
    id: "collision-equal-masses-v1",
    name: "Equal masses transfer velocity",
    input: { m1: 1, m2: 1, u1: 5, u2: 0 },
    expected: 0,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input2) => simulateElasticCollision(input2).v1
  },
  {
    id: "collision-two-to-one-v2",
    name: "Two-to-one mass second velocity",
    input: { m1: 2, m2: 1, u1: 3, u2: 0 },
    expected: 4,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input2) => simulateElasticCollision(input2).v2
  },
  {
    id: "collision-momentum",
    name: "Momentum is conserved for any restitution",
    input: { m1: 1.2, m2: 0.8, u1: 3, u2: -1, restitution: 0.4 },
    expected: 0,
    unit: "kg\xB7m/s",
    tolerance: 1e-12,
    actual: (input2) => {
      const r = simulateElasticCollision(input2);
      return r.momentumAfter - r.momentumBefore;
    }
  },
  {
    id: "collision-elastic-ke",
    name: "Elastic collision conserves kinetic energy",
    input: { m1: 1.2, m2: 0.8, u1: 3, u2: -1, restitution: 1 },
    expected: 0,
    unit: "J",
    tolerance: 1e-12,
    actual: (input2) => {
      const r = simulateElasticCollision(input2);
      return r.kineticAfter - r.kineticBefore;
    }
  },
  {
    id: "collision-stop-first",
    name: "Equal masses stop first cart against stationary second",
    input: { m1: 1, m2: 1, u1: 3, u2: 0, restitution: 1 },
    expected: 0,
    unit: "m/s",
    tolerance: 1e-12,
    actual: (input2) => simulateElasticCollision(input2).v1
  }
]);

// src/experiments/friction/frictionSimulation.ts
var radians3 = (degrees2) => degrees2 * Math.PI / 180;
function simulateFriction(input2, velocity = 0) {
  const angle = radians3(input2.inclineDegrees);
  const normalForce = input2.mass * input2.gravity * Math.cos(angle);
  const gravityAlongPlane = input2.mass * input2.gravity * Math.sin(angle);
  const maximumStaticFriction = input2.muS * normalForce;
  const kineticFriction = input2.muK * normalForce;
  const tendency = input2.appliedForce - gravityAlongPlane;
  const isMoving = Math.abs(velocity) > 5e-3;
  const held = !isMoving && Math.abs(tendency) <= maximumStaticFriction;
  const direction = Math.sign(isMoving ? velocity : tendency) || 1;
  const frictionForce = held ? -tendency : -direction * kineticFriction;
  const netForce = tendency + frictionForce;
  const ratio = maximumStaticFriction ? Math.abs(tendency) / maximumStaticFriction : Infinity;
  return {
    normalForce,
    gravityAlongPlane,
    maximumStaticFriction,
    kineticFriction,
    frictionForce,
    netForce: held ? 0 : netForce,
    acceleration: held ? 0 : netForce / input2.mass,
    thresholdAppliedForce: gravityAlongPlane + maximumStaticFriction,
    motionState: held ? ratio >= 0.9 ? "impending" : "static" : "sliding"
  };
}
var F = {
  mass: 10,
  gravity: 9.8,
  muS: 0.5,
  muK: 0.3,
  appliedForce: 30,
  inclineDegrees: 0
};
var frictionBenchmarks = runBenchmarkCases([
  {
    id: "static-friction-matches-applied",
    name: "Static friction matches the force tendency",
    input: F,
    expected: -30,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateFriction(input2).frictionForce
  },
  {
    id: "maximum-static-friction",
    name: "Static friction limit is mu_s N",
    input: F,
    expected: 49,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateFriction(input2).maximumStaticFriction
  },
  {
    id: "kinetic-friction",
    name: "Sliding friction is mu_k N",
    input: { ...F, appliedForce: 60 },
    expected: -29.4,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateFriction(input2).frictionForce
  },
  {
    id: "friction-opposes-negative-motion",
    name: "Kinetic friction opposes negative motion",
    input: { ...F, appliedForce: 0 },
    expected: 29.4,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateFriction(input2, -1).frictionForce
  },
  {
    id: "incline-normal-force",
    name: "Incline normal force is mg cos theta",
    input: { ...F, inclineDegrees: 60 },
    expected: 49,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateFriction(input2).normalForce
  }
]);

// src/experiments/hooke-s-law/hooke-s-lawSimulation.ts
function springState(input2, timeS = Infinity) {
  const forceN = input2.loadMassKg * 9.81;
  const equilibriumExtensionM = forceN / input2.springConstant;
  const beyondElasticLimit = equilibriumExtensionM > input2.elasticLimitM;
  const permanentSetM = input2.permanentDeformation && beyondElasticLimit ? 0.35 * (equilibriumExtensionM - input2.elasticLimitM) : 0;
  const omega0 = Math.sqrt(
    input2.springConstant / Math.max(0.01, input2.loadMassKg)
  );
  const decay = Number.isFinite(timeS) ? Math.exp(
    -input2.damping * timeS / (2 * Math.max(0.01, input2.loadMassKg))
  ) : 0;
  const oscillation = Number.isFinite(timeS) ? 1 - decay * Math.cos(omega0 * timeS) : 1;
  const displayedExtensionM = equilibriumExtensionM * oscillation + permanentSetM;
  return {
    forceN,
    equilibriumExtensionM,
    displayedExtensionM,
    totalLengthM: input2.naturalLengthM + displayedExtensionM,
    energyJ: 0.5 * input2.springConstant * equilibriumExtensionM ** 2,
    beyondElasticLimit,
    permanentSetM
  };
}
var H2 = {
  springConstant: 20,
  loadMassKg: 0.2,
  naturalLengthM: 0.12,
  damping: 0.5,
  elasticLimitM: 0.15,
  permanentDeformation: false
};
var hookesLawBenchmarks = runBenchmarkCases([
  {
    id: "hooke-force",
    name: "F equals kx",
    input: H2,
    expected: 1.962,
    unit: "N",
    tolerance: 1e-12,
    actual: (input2) => input2.springConstant * springState(input2).equilibriumExtensionM
  },
  {
    id: "hooke-extension",
    name: "Equilibrium extension is mg over k",
    input: H2,
    expected: 0.0981,
    unit: "m",
    tolerance: 1e-12,
    actual: (input2) => springState(input2).equilibriumExtensionM
  },
  {
    id: "hooke-graph-slope",
    name: "Force-extension slope equals k",
    input: H2,
    expected: 20,
    unit: "N/m",
    tolerance: 1e-12,
    actual: (input2) => springState(input2).forceN / springState(input2).equilibriumExtensionM
  },
  {
    id: "hooke-energy",
    name: "Elastic potential energy",
    input: H2,
    expected: 0.0962361,
    unit: "J",
    tolerance: 1e-12,
    actual: (input2) => springState(input2).energyJ
  },
  {
    id: "hooke-elastic-limit",
    name: "Elastic limit warning",
    input: { ...H2, loadMassKg: 0.4 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(springState(input2).beyondElasticLimit)
  }
]);

// src/experiments/inclined-plane/inclined-planeSimulation.ts
function simulateInclinedPlane(input2, velocityDownMps = 0) {
  const theta = input2.angleDegrees * Math.PI / 180;
  const weightN = input2.massKg * input2.gravity;
  const parallelWeightN = weightN * Math.sin(theta);
  const normalForceN = weightN * Math.cos(theta);
  const maximumStaticFrictionN = input2.frictionCoefficient * normalForceN;
  const kineticFrictionN = 0.8 * maximumStaticFrictionN;
  const downSlopeTendencyN = parallelWeightN - input2.appliedForceN;
  const moving = Math.abs(velocityDownMps) > 5e-3;
  const held = !moving && Math.abs(downSlopeTendencyN) <= maximumStaticFrictionN;
  const direction = Math.sign(moving ? velocityDownMps : downSlopeTendencyN) || 1;
  const frictionForceN = held ? -downSlopeTendencyN : -direction * kineticFrictionN;
  const netDownSlopeN = held ? 0 : downSlopeTendencyN + frictionForceN;
  return {
    weightN,
    parallelWeightN,
    normalForceN,
    maximumStaticFrictionN,
    kineticFrictionN,
    frictionForceN,
    netDownSlopeN,
    accelerationDownMps2: netDownSlopeN / input2.massKg,
    criticalAngleDegrees: Math.atan(input2.frictionCoefficient) * 180 / Math.PI,
    motionState: held ? Math.abs(downSlopeTendencyN) / Math.max(1e-3, maximumStaticFrictionN) > 0.92 ? "impending" : "held" : "sliding"
  };
}
var I = {
  angleDegrees: 30,
  massKg: 2,
  frictionCoefficient: 0,
  appliedForceN: 0,
  gravity: 9.8
};
var inclinedPlaneBenchmarks = runBenchmarkCases([
  {
    id: "incline-parallel-weight",
    name: "Parallel weight is mg sin theta",
    input: I,
    expected: 9.8,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateInclinedPlane(input2).parallelWeightN
  },
  {
    id: "incline-normal-force",
    name: "Normal force is mg cos theta",
    input: I,
    expected: 16.974097914174997,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => simulateInclinedPlane(input2).normalForceN
  },
  {
    id: "incline-frictionless-acceleration",
    name: "Frictionless acceleration is g sin theta",
    input: I,
    expected: 4.9,
    unit: "m/s\xB2",
    tolerance: 1e-9,
    actual: (input2) => simulateInclinedPlane(input2).accelerationDownMps2
  },
  {
    id: "incline-angle-of-repose",
    name: "Critical angle satisfies tan theta equals mu",
    input: { ...I, frictionCoefficient: 0.5 },
    expected: 0.5,
    unit: "unitless",
    tolerance: 1e-12,
    actual: (input2) => Math.tan(
      simulateInclinedPlane(input2).criticalAngleDegrees * Math.PI / 180
    )
  },
  {
    id: "incline-static-hold",
    name: "Static friction holds below critical angle",
    input: { ...I, angleDegrees: 20, frictionCoefficient: 0.5 },
    expected: 0,
    unit: "m/s\xB2",
    tolerance: 1e-12,
    actual: (input2) => simulateInclinedPlane(input2).accelerationDownMps2
  }
]);

// src/experiments/mass-and-weight/massWeightSimulation.ts
var bodyData = {
  Moon: { gravity: 1.62, radiusKm: 1737.4 },
  Mars: { gravity: 3.71, radiusKm: 3389.5 },
  Earth: { gravity: 9.81, radiusKm: 6371 },
  Jupiter: { gravity: 24.79, radiusKm: 69911 }
};
function massWeightState(input2) {
  const body = bodyData[input2.body];
  const localGravityMps2 = body.gravity * (body.radiusKm / (body.radiusKm + input2.altitudeKm)) ** 2;
  const trueWeightN = input2.massKg * localGravityMps2;
  const apparentWeightN = Math.max(
    0,
    input2.massKg * (localGravityMps2 + input2.elevatorAccelerationMps2)
  );
  return {
    localGravityMps2,
    trueWeightN,
    apparentWeightN,
    massKg: input2.massKg,
    weightless: apparentWeightN === 0
  };
}
var E = {
  massKg: 2,
  body: "Earth",
  altitudeKm: 0,
  elevatorAccelerationMps2: 0
};
var massWeightBenchmarks = runBenchmarkCases([
  {
    id: "earth-weight",
    name: "Weight equals mg",
    input: E,
    expected: 19.62,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).trueWeightN
  },
  {
    id: "mass-invariant",
    name: "Mass is invariant across bodies",
    input: { ...E, body: "Moon" },
    expected: 2,
    unit: "kg",
    tolerance: 0,
    actual: (i) => massWeightState(i).massKg
  },
  {
    id: "elevator-up",
    name: "Upward elevator apparent weight",
    input: { ...E, elevatorAccelerationMps2: 2 },
    expected: 23.62,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).apparentWeightN
  },
  {
    id: "elevator-down",
    name: "Downward elevator apparent weight",
    input: { ...E, elevatorAccelerationMps2: -2 },
    expected: 15.62,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).apparentWeightN
  },
  {
    id: "freefall",
    name: "Free fall apparent weight is zero",
    input: { ...E, elevatorAccelerationMps2: -9.81 },
    expected: 0,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => massWeightState(i).apparentWeightN
  }
]);

// src/experiments/newton-s-second-law/newton-s-second-lawSimulation.ts
function newtonState(input2) {
  const massKg = Math.max(0.1, input2.massKg);
  const direction = Math.sign(input2.appliedForceN);
  const netForceN = direction * Math.max(0, Math.abs(input2.appliedForceN) - input2.frictionN);
  return {
    massKg,
    netForceN,
    accelerationMps2: netForceN / massKg,
    inverseMassPerKg: 1 / massKg,
    staticHold: input2.appliedForceN !== 0 && netForceN === 0
  };
}
function motionAt(accelerationMps2, timeS) {
  return {
    positionM: 0.5 * accelerationMps2 * timeS * timeS,
    velocityMps: accelerationMps2 * timeS
  };
}
var newtonSecondLawBenchmarks = runBenchmarkCases([
  {
    id: "newton-net",
    name: "Net force subtracts friction",
    input: { applied: 9, friction: 3 },
    expected: 6,
    unit: "N",
    tolerance: 1e-12,
    actual: (i) => newtonState({
      massKg: 2,
      appliedForceN: i.applied ?? 0,
      frictionN: i.friction ?? 0,
      samplingIntervalS: 0.25
    }).netForceN
  },
  {
    id: "newton-acceleration",
    name: "Acceleration equals net force over mass",
    input: { net: 8, mass: 2 },
    expected: 4,
    unit: "m/s^2",
    tolerance: 1e-12,
    actual: (i) => newtonState({
      massKg: i.mass ?? 1,
      appliedForceN: i.net ?? 0,
      frictionN: 0,
      samplingIntervalS: 0.25
    }).accelerationMps2
  },
  {
    id: "newton-static",
    name: "Friction threshold can hold the cart",
    input: { applied: 2, friction: 3 },
    expected: 0,
    unit: "m/s^2",
    tolerance: 1e-12,
    actual: (i) => newtonState({
      massKg: 1,
      appliedForceN: i.applied ?? 0,
      frictionN: i.friction ?? 0,
      samplingIntervalS: 0.25
    }).accelerationMps2
  },
  {
    id: "newton-position",
    name: "Position from consistent rest conditions",
    input: { acceleration: 4, time: 2 },
    expected: 8,
    unit: "m",
    tolerance: 1e-12,
    actual: (i) => motionAt(i.acceleration ?? 0, i.time ?? 0).positionM
  },
  {
    id: "newton-inverse-mass",
    name: "Acceleration is linear in inverse mass",
    input: { force: 6, inverseMass: 0.5 },
    expected: 3,
    unit: "m/s^2",
    tolerance: 1e-12,
    actual: (i) => (i.force ?? 0) * (i.inverseMass ?? 0)
  }
]);

// src/experiments/projectile-motion/projectile-motionSimulation.ts
var projectileDefaults = {
  speedMps: 28,
  angleDeg: 40,
  heightM: 2,
  gravityMps2: 9.81,
  airResistance: false,
  dragCoefficient: 0.08
};
function projectileFlight(input2) {
  const angle = input2.angleDeg * Math.PI / 180;
  const vx0 = input2.speedMps * Math.cos(angle), vy0 = input2.speedMps * Math.sin(angle);
  if (!input2.airResistance) {
    const timeS = (vy0 + Math.sqrt(vy0 * vy0 + 2 * input2.gravityMps2 * input2.heightM)) / input2.gravityMps2;
    const points2 = Array.from({ length: 101 }, (_, index) => {
      const t = timeS * index / 100;
      return {
        t,
        x: vx0 * t,
        y: input2.heightM + vy0 * t - 0.5 * input2.gravityMps2 * t * t,
        vx: vx0,
        vy: vy0 - input2.gravityMps2 * t
      };
    });
    return {
      points: points2,
      timeS,
      rangeM: vx0 * timeS,
      peakM: input2.heightM + vy0 * vy0 / (2 * input2.gravityMps2),
      rangeFormulaValid: input2.heightM === 0
    };
  }
  const dt = 5e-3, points = [
    { t: 0, x: 0, y: input2.heightM, vx: vx0, vy: vy0 }
  ];
  let p = points[0];
  for (let i = 1; i < 4e3 && p.y >= 0; i++) {
    const speed = Math.hypot(p.vx, p.vy), k = input2.dragCoefficient * 0.015;
    const ax = -k * speed * p.vx, ay = -input2.gravityMps2 - k * speed * p.vy;
    p = {
      t: i * dt,
      x: p.x + p.vx * dt,
      y: p.y + p.vy * dt,
      vx: p.vx + ax * dt,
      vy: p.vy + ay * dt
    };
    if (i % 10 === 0 || p.y < 0) points.push(p);
  }
  const last = points[points.length - 1];
  return {
    points,
    timeS: last.t,
    rangeM: last.x,
    peakM: Math.max(...points.map((point) => point.y)),
    rangeFormulaValid: false
  };
}
var projectileLessonBenchmarks = runBenchmarkCases([
  {
    id: "projectile-x",
    name: "Horizontal position",
    input: { speed: 20, angle: 60, time: 2 },
    expected: 20,
    unit: "m",
    tolerance: 1e-10,
    actual: (i) => (i.speed ?? 0) * Math.cos((i.angle ?? 0) * Math.PI / 180) * (i.time ?? 0)
  },
  {
    id: "projectile-y",
    name: "Vertical position",
    input: { height: 2, speed: 20, angle: 30, time: 1, gravity: 9.8 },
    expected: 7.1,
    unit: "m",
    tolerance: 1e-10,
    actual: (i) => (i.height ?? 0) + (i.speed ?? 0) * Math.sin((i.angle ?? 0) * Math.PI / 180) * (i.time ?? 0) - 0.5 * (i.gravity ?? 0) * (i.time ?? 0) ** 2
  },
  {
    id: "projectile-vy",
    name: "Vertical velocity",
    input: { speed: 20, angle: 30, time: 1, gravity: 9.8 },
    expected: 0.2,
    unit: "m/s",
    tolerance: 1e-10,
    actual: (i) => (i.speed ?? 0) * Math.sin((i.angle ?? 0) * Math.PI / 180) - (i.gravity ?? 0) * (i.time ?? 0)
  },
  {
    id: "projectile-complement",
    name: "Complementary angles have equal level-ground range",
    input: { speed: 20, gravity: 9.8 },
    expected: 35.34797566467096,
    unit: "m",
    tolerance: 1e-10,
    actual: (i) => (i.speed ?? 0) ** 2 * Math.sin(2 * 30 * Math.PI / 180) / (i.gravity ?? 1)
  },
  {
    id: "projectile-drag",
    name: "Air resistance reduces range",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => Number(
      projectileFlight({
        ...projectileDefaults,
        heightM: 0,
        airResistance: true
      }).rangeM < projectileFlight({ ...projectileDefaults, heightM: 0 }).rangeM
    )
  }
]);

// src/experiments/rotational-dynamics/rotationalDynamicsSimulation.ts
var rotationalDynamicsBenchmarks = runBenchmarkCases([
  {
    id: "rotation-torque",
    name: "Tangential torque equals rF",
    input: { r: 0.25, force: 2 },
    expected: 0.5,
    unit: "N m",
    tolerance: 1e-12,
    actual: (i) => (i.r ?? 0) * (i.force ?? 0)
  },
  {
    id: "rotation-disk-I",
    name: "Solid disk inertia",
    input: { mass: 2, radius: 0.25 },
    expected: 0.0625,
    unit: "kg m^2",
    tolerance: 1e-12,
    actual: (i) => 0.5 * (i.mass ?? 0) * (i.radius ?? 0) ** 2
  },
  {
    id: "rotation-points-I",
    name: "Two point masses inertia",
    input: { mass: 0.25, radius: 0.2 },
    expected: 0.02,
    unit: "kg m^2",
    tolerance: 1e-12,
    actual: (i) => 2 * (i.mass ?? 0) * (i.radius ?? 0) ** 2
  },
  {
    id: "rotation-alpha",
    name: "Angular acceleration equals net torque over inertia",
    input: { torque: 0.5, inertia: 0.1 },
    expected: 5,
    unit: "rad/s^2",
    tolerance: 1e-12,
    actual: (i) => (i.torque ?? 0) / (i.inertia ?? 1)
  },
  {
    id: "rotation-angular-momentum",
    name: "Angular momentum equals I omega",
    input: { inertia: 0.1, omega: 3 },
    expected: 0.3,
    unit: "kg m^2/s",
    tolerance: 1e-12,
    actual: (i) => (i.inertia ?? 0) * (i.omega ?? 0)
  }
]);

// src/experiments/simple-pendulum/simple-pendulumSimulation.ts
var pendulumDefaults = {
  lengthM: 1.2,
  amplitudeDeg: 15,
  gravityMps2: 9.81,
  dampingPerS: 0.01,
  bobMassKg: 0.2
};
var radians4 = (degrees2) => degrees2 * Math.PI / 180;
function smallAnglePeriod(lengthM, gravityMps2) {
  return 2 * Math.PI * Math.sqrt(lengthM / gravityMps2);
}
function finiteAmplitudePeriod(input2) {
  const t = radians4(input2.amplitudeDeg), t0 = smallAnglePeriod(input2.lengthM, input2.gravityMps2);
  return t0 * (1 + t * t / 16 + 11 * t ** 4 / 3072);
}
var simplePendulumBenchmarks = runBenchmarkCases([
  {
    id: "pendulum-period",
    name: "Small-angle period",
    input: { length: 1, gravity: 9.81 },
    expected: 2.0060666807106475,
    unit: "s",
    tolerance: 1e-12,
    actual: (i) => smallAnglePeriod(i.length ?? 1, i.gravity ?? 9.81)
  },
  {
    id: "pendulum-mass",
    name: "Period is mass independent",
    input: { length: 1, gravity: 9.81, mass: 0.2 },
    expected: 2.0060666807106475,
    unit: "s",
    tolerance: 1e-12,
    actual: (i) => smallAnglePeriod(i.length ?? 1, i.gravity ?? 9.81)
  },
  {
    id: "pendulum-large-angle",
    name: "Finite amplitude lengthens period",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => Number(
      finiteAmplitudePeriod({ ...pendulumDefaults, amplitudeDeg: 45 }) > smallAnglePeriod(
        pendulumDefaults.lengthM,
        pendulumDefaults.gravityMps2
      )
    )
  },
  {
    id: "pendulum-gravity",
    name: "Gravity inferred from period",
    input: { length: 1, period: 2.0060666807106475 },
    expected: 9.81,
    unit: "m/s^2",
    tolerance: 1e-10,
    actual: (i) => 4 * Math.PI ** 2 * (i.length ?? 1) / (i.period ?? 1) ** 2
  },
  {
    id: "pendulum-bottom-speed",
    name: "Bottom speed from energy",
    input: { length: 1, gravity: 9.81, angle: 30 },
    expected: Math.sqrt(2 * 9.81 * (1 - Math.cos(Math.PI / 6))),
    unit: "m/s",
    tolerance: 1e-12,
    actual: (i) => Math.sqrt(
      2 * (i.gravity ?? 9.81) * (i.length ?? 1) * (1 - Math.cos(radians4(i.angle ?? 0)))
    )
  }
]);

// src/experiments/shm-spring/shmSpringSimulation.ts
function freeState(input2, omega0) {
  const gamma = input2.dampingNsM / (2 * input2.massKg);
  const A = input2.amplitudeM;
  const t = input2.timeS;
  const discriminant = omega0 ** 2 - gamma ** 2;
  if (Math.abs(discriminant) < 1e-10) {
    const decay = Math.exp(-gamma * t);
    return { x: A * decay * (1 + gamma * t), v: -A * gamma ** 2 * t * decay };
  }
  if (discriminant > 0) {
    const omegaD = Math.sqrt(discriminant);
    const decay = Math.exp(-gamma * t);
    const x = A * decay * (Math.cos(omegaD * t) + gamma / omegaD * Math.sin(omegaD * t));
    const v = -A * decay * (omega0 ** 2 / omegaD * Math.sin(omegaD * t));
    return { x, v };
  }
  const sigma = Math.sqrt(-discriminant);
  const r1 = -gamma + sigma;
  const r2 = -gamma - sigma;
  const c1 = -r2 * A / (r1 - r2);
  const c2 = A - c1;
  return {
    x: c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t),
    v: c1 * r1 * Math.exp(r1 * t) + c2 * r2 * Math.exp(r2 * t)
  };
}
function solveShmSpring(input2) {
  if (input2.massKg <= 0 || input2.springConstantNm <= 0)
    throw new RangeError("Mass and spring constant must be positive.");
  if (input2.amplitudeM < 0 || input2.dampingNsM < 0 || input2.driveFrequencyHz <= 0)
    throw new RangeError(
      "Amplitude and damping cannot be negative; drive frequency must be positive."
    );
  const omega0 = Math.sqrt(input2.springConstantNm / input2.massKg);
  const naturalFrequencyHz = omega0 / (2 * Math.PI);
  const periodS = 2 * Math.PI / omega0;
  const dampingRatio = input2.dampingNsM / (2 * Math.sqrt(input2.springConstantNm * input2.massKg));
  const driveOmega = 2 * Math.PI * input2.driveFrequencyHz;
  const driveForceN = 0.2;
  const denominator = Math.hypot(
    input2.springConstantNm - input2.massKg * driveOmega ** 2,
    input2.dampingNsM * driveOmega
  );
  const responseAmplitudeM = driveForceN / Math.max(denominator, 1e-9);
  const phaseLagRad = Math.atan2(
    input2.dampingNsM * driveOmega,
    input2.springConstantNm - input2.massKg * driveOmega ** 2
  );
  let x, v, acceleration;
  if (input2.driven) {
    const phase = driveOmega * input2.timeS - phaseLagRad;
    x = responseAmplitudeM * Math.cos(phase);
    v = -responseAmplitudeM * driveOmega * Math.sin(phase);
    acceleration = -responseAmplitudeM * driveOmega ** 2 * Math.cos(phase);
  } else {
    ({ x, v } = freeState(input2, omega0));
    acceleration = -(input2.dampingNsM / input2.massKg) * v - omega0 ** 2 * x;
  }
  const kineticJ = 0.5 * input2.massKg * v ** 2;
  const potentialJ = 0.5 * input2.springConstantNm * x ** 2;
  const initialEnergyJ = 0.5 * input2.springConstantNm * input2.amplitudeM ** 2;
  return {
    omega0,
    naturalFrequencyHz,
    periodS,
    dampingRatio,
    responseAmplitudeM,
    phaseLagRad,
    driveForceN,
    x,
    v,
    acceleration,
    kineticJ,
    potentialJ,
    totalEnergyJ: kineticJ + potentialJ,
    initialEnergyJ
  };
}
var base = {
  massKg: 0.5,
  springConstantNm: 20,
  amplitudeM: 0.15,
  dampingNsM: 0,
  driveFrequencyHz: 1,
  driven: false
};
var shmSpringBenchmarks = runBenchmarkCases([
  {
    id: "omega",
    name: "Natural angular frequency is root k over m",
    input: {},
    expected: Math.sqrt(40),
    unit: "rad/s",
    tolerance: 1e-12,
    actual: () => solveShmSpring({ ...base, timeS: 0 }).omega0
  },
  {
    id: "period",
    name: "Period is two pi root m over k",
    input: {},
    expected: 2 * Math.PI * Math.sqrt(0.5 / 20),
    unit: "s",
    tolerance: 1e-12,
    actual: () => solveShmSpring({ ...base, timeS: 0 }).periodS
  },
  {
    id: "turning-speed",
    name: "Speed is zero at release amplitude",
    input: {},
    expected: 0,
    unit: "m/s",
    tolerance: 1e-12,
    actual: () => solveShmSpring({ ...base, timeS: 0 }).v
  },
  {
    id: "equilibrium-speed",
    name: "Speed is maximum at equilibrium",
    input: {},
    expected: 0.15 * Math.sqrt(40),
    unit: "m/s",
    tolerance: 1e-12,
    actual: () => Math.abs(
      solveShmSpring({ ...base, timeS: Math.PI / 2 / Math.sqrt(40) }).v
    )
  },
  {
    id: "energy",
    name: "Undamped mechanical energy is conserved",
    input: {},
    expected: 0,
    unit: "J",
    tolerance: 1e-12,
    actual: () => {
      const r = solveShmSpring({ ...base, timeS: 0.37 });
      return r.totalEnergyJ - r.initialEnergyJ;
    }
  },
  {
    id: "phase",
    name: "Acceleration opposes displacement",
    input: {},
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => {
      const r = solveShmSpring({ ...base, timeS: 0.2 });
      return r.x * r.acceleration <= 0 ? 1 : 0;
    }
  }
]);

// src/experiments/chladni-plate/chladni-plateSimulation.ts
var boundaryFactor = {
  free: 0.72,
  supported: 0.86,
  clamped: 1
};
function modeFrequencyHz(n0, m0, shape = "circular", boundary = "clamped") {
  const n = Math.max(1, Math.round(n0)), m = Math.max(1, Math.round(m0));
  const eigen = shape === "square" ? n * n + m * m : (n + 0.55 * m) ** 2;
  return 42 * eigen * boundaryFactor[boundary];
}
function resonanceResponse(f, f0, q, drive) {
  const r = f / Math.max(f0, 1e-9);
  return drive / Math.sqrt((1 - r * r) ** 2 + (r / q) ** 2);
}
function modalDisplacement(x, y, input2) {
  const n = Math.max(1, Math.round(input2.modeN)), m = Math.max(1, Math.round(input2.modeM));
  if ((input2.shape ?? "circular") === "square") {
    const u = (x + 1) / 2, v = (y + 1) / 2;
    return input2.amplitude * Math.sin(n * Math.PI * u) * Math.sin(m * Math.PI * v);
  }
  const r = Math.hypot(x, y);
  if (r > 1) return 0;
  return input2.amplitude * Math.sin(n * Math.PI * r) * Math.cos(m * Math.atan2(y, x));
}
function nearestNodePoint(x, y, input2) {
  const n = Math.max(1, Math.round(input2.modeN)), m = Math.max(1, Math.round(input2.modeM));
  if ((input2.shape ?? "circular") === "square") {
    const u = (x + 1) / 2, v = (y + 1) / 2, nx = Math.round(u * n) / n, ny = Math.round(v * m) / m;
    return Math.abs(nx - u) < Math.abs(ny - v) ? { x: nx * 2 - 1, y } : { x, y: ny * 2 - 1 };
  }
  const r = Math.max(0.02, Math.hypot(x, y)), theta = Math.atan2(y, x), nodeR = Math.max(1, Math.min(n, Math.round(r * n))) / n;
  const k = Math.round((theta - Math.PI / (2 * m)) * m / Math.PI), nodeTheta = Math.PI / (2 * m) + k * Math.PI / m;
  return Math.abs(nodeR - r) < Math.abs(Math.sin(m * theta)) * r / m ? { x: nodeR * Math.cos(theta), y: nodeR * Math.sin(theta) } : { x: r * Math.cos(nodeTheta), y: r * Math.sin(nodeTheta) };
}
function simulateChladniPlate(input2) {
  const shape = input2.shape ?? "circular", boundary = input2.boundary ?? "clamped", eigenfrequencyHz = modeFrequencyHz(
    input2.modeN,
    input2.modeM,
    shape,
    boundary
  ), quality = 18 + 44 * (1 - Math.min(1, Math.max(0, input2.damping))), response = resonanceResponse(
    input2.frequency,
    eigenfrequencyHz,
    quality,
    input2.amplitude
  );
  const nodeLineCount = shape === "square" ? Math.max(0, input2.modeN - 1) + Math.max(0, input2.modeM - 1) : input2.modeN + input2.modeM, complexity = input2.modeN * input2.modeM;
  const sandParticles = Array.from({ length: 130 }, (_, i) => {
    const a = i * 2.399963229728653, r = shape === "circular" ? Math.sqrt((i + 0.5) / 130) * 0.94 : 0, x = shape === "circular" ? r * Math.cos(a) : i * 73 % 127 / 63.5 - 1, y = shape === "circular" ? r * Math.sin(a) : i * 47 % 131 / 65.5 - 1, node = nearestNodePoint(x, y, input2);
    return { x, y, nodeX: node.x, nodeY: node.y };
  });
  const heatCells = Array.from(
    { length: 14 },
    (_, row) => Array.from(
      { length: 14 },
      (_2, col) => Math.abs(
        modalDisplacement((col + 0.5) / 7 - 1, (row + 0.5) / 7 - 1, input2)
      )
    )
  );
  return {
    nodeLineCount,
    complexity,
    sandParticles,
    heatCells,
    eigenfrequencyHz,
    response,
    quality,
    detuningHz: input2.frequency - eigenfrequencyHz,
    coherence: 1 / (1 + Math.abs(input2.frequency - eigenfrequencyHz) / Math.max(8, eigenfrequencyHz / quality)),
    qualitativeWarning: "Calibrated membrane-like mode shapes illustrate plate nodes; this is not a finite-element Kirchhoff-Love plate solver."
  };
}
var chladniBenchmarks = runBenchmarkCases([
  {
    id: "higher-mode",
    name: "Higher mode gives more node lines",
    input: { modeN: 3, modeM: 4, frequency: 440, amplitude: 1, damping: 0.35 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => Number(
      simulateChladniPlate(i).nodeLineCount > simulateChladniPlate({ ...i, modeN: 1, modeM: 1 }).nodeLineCount
    )
  },
  {
    id: "simple-mode",
    name: "Basic mode is simpler",
    input: { modeN: 1, modeM: 1, frequency: 220, amplitude: 1, damping: 0.5 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => Number(
      simulateChladniPlate(i).complexity < simulateChladniPlate({ ...i, modeN: 3, modeM: 4 }).complexity
    )
  },
  {
    id: "node-stationary",
    name: "Square model nodes have zero displacement",
    input: {
      modeN: 3,
      modeM: 2,
      frequency: 546,
      amplitude: 1,
      damping: 0.3,
      shape: "square",
      boundary: "clamped"
    },
    expected: 0,
    unit: "relative",
    tolerance: 1e-12,
    actual: (i) => modalDisplacement(-1 / 3, 0.22, i)
  },
  {
    id: "resonance-peak",
    name: "Response peaks at eigenfrequency",
    input: {
      modeN: 2,
      modeM: 3,
      frequency: 0,
      amplitude: 0.5,
      damping: 0.3,
      shape: "circular",
      boundary: "clamped"
    },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => {
      const f = modeFrequencyHz(i.modeN, i.modeM, i.shape, i.boundary);
      return Number(
        resonanceResponse(f, f, 48, i.amplitude) > resonanceResponse(f * 1.2, f, 48, i.amplitude)
      );
    }
  }
]);

// src/experiments/shared/waveMath.ts
var nmToMeters = (value) => value * 1e-9;
var mmToMeters = (value) => value * 1e-3;
function sinc(value) {
  if (Math.abs(value) < 1e-9) return 1;
  return Math.sin(value) / value;
}
function wavelengthFromSpeed(frequency, speed) {
  return speed / Math.max(1e-9, frequency);
}

// src/experiments/single-slit-diffraction/single-slit-diffractionSimulation.ts
function minimumForOrder(order, wavelengthM, slitWidthM, distanceM) {
  const sine = order * wavelengthM / slitWidthM;
  if (Math.abs(sine) >= 1)
    return { angleRad: Number.NaN, positionM: Number.NaN, sine };
  const angleRad = Math.asin(sine);
  return { angleRad, positionM: distanceM * Math.tan(angleRad), sine };
}
function intensityAtPosition(positionM, wavelengthM, slitWidthM, distanceM) {
  const theta = Math.atan2(positionM, distanceM);
  const beta = Math.PI * slitWidthM * Math.sin(theta) / wavelengthM;
  return sinc(beta) ** 2;
}
function simulateSingleSlit(input2) {
  if (!Number.isFinite(input2.wavelengthNm) || input2.wavelengthNm <= 0)
    throw new RangeError("Wavelength must be positive.");
  if (!Number.isFinite(input2.slitWidthMm) || input2.slitWidthMm <= 0)
    throw new RangeError("Slit width must be positive.");
  if (!Number.isFinite(input2.screenDistanceM) || input2.screenDistanceM <= 0)
    throw new RangeError("Screen distance must be positive.");
  const wavelengthM = nmToMeters(input2.wavelengthNm);
  const slitWidthM = mmToMeters(input2.slitWidthMm);
  const first = minimumForOrder(
    1,
    wavelengthM,
    slitWidthM,
    input2.screenDistanceM
  );
  const selected = minimumForOrder(
    input2.order,
    wavelengthM,
    slitWidthM,
    input2.screenDistanceM
  );
  const firstMinimaPosition = first.positionM;
  const selectedMinimaPosition = selected.positionM;
  const angularSpreadRad = first.angleRad;
  const centralMaximumWidth = 2 * firstMinimaPosition;
  const plotHalfWidth = firstMinimaPosition * 3.25;
  const intensityPoints = Array.from({ length: 161 }, (_, index) => {
    const positionM = -plotHalfWidth + index / 160 * 2 * plotHalfWidth;
    return {
      x: positionM,
      y: intensityAtPosition(
        positionM,
        wavelengthM,
        slitWidthM,
        input2.screenDistanceM
      )
    };
  });
  return {
    wavelengthM,
    slitWidthM,
    angularSpreadRad,
    firstMinimaPosition,
    selectedMinimaPosition,
    selectedAngleRad: selected.angleRad,
    centralMaximumWidth,
    intensityPoints
  };
}
var exactReference = 2 * Math.tan(Math.asin(5e-7 / 1e-4));
var singleSlitBenchmarks = runBenchmarkCases([
  {
    id: "single-slit-first-minimum",
    name: "First minimum obeys exact sine geometry",
    input: {
      wavelengthNm: 500,
      screenDistanceM: 2,
      slitWidthMm: 0.1,
      order: 1
    },
    expected: exactReference,
    unit: "m",
    tolerance: 1e-12,
    actual: (input2) => simulateSingleSlit(input2).firstMinimaPosition
  },
  {
    id: "single-slit-minimum-equation",
    name: "Minimum satisfies a sin theta equals m lambda",
    input: {
      wavelengthNm: 650,
      screenDistanceM: 1.2,
      slitWidthMm: 0.08,
      order: 2
    },
    expected: 0,
    unit: "m",
    tolerance: 1e-15,
    actual: (input2) => {
      const result = simulateSingleSlit(input2);
      return result.slitWidthM * Math.sin(result.selectedAngleRad) - input2.order * result.wavelengthM;
    }
  },
  {
    id: "single-slit-width-monotonic",
    name: "Narrower slit widens central maximum",
    input: {
      wavelengthNm: 500,
      screenDistanceM: 2,
      slitWidthMm: 0.2,
      order: 1
    },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => simulateSingleSlit({ ...input2, slitWidthMm: 0.1 }).centralMaximumWidth > simulateSingleSlit(input2).centralMaximumWidth ? 1 : 0
  },
  {
    id: "single-slit-wavelength-monotonic",
    name: "Longer wavelength widens central maximum",
    input: {
      wavelengthNm: 450,
      screenDistanceM: 1,
      slitWidthMm: 0.08,
      order: 1
    },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => simulateSingleSlit({ ...input2, wavelengthNm: 650 }).centralMaximumWidth > simulateSingleSlit(input2).centralMaximumWidth ? 1 : 0
  },
  {
    id: "single-slit-distance-monotonic",
    name: "Screen pattern scales with distance",
    input: {
      wavelengthNm: 550,
      screenDistanceM: 1,
      slitWidthMm: 0.1,
      order: 1
    },
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input2) => simulateSingleSlit({ ...input2, screenDistanceM: 2 }).firstMinimaPosition / simulateSingleSlit(input2).firstMinimaPosition
  }
]);

// src/experiments/uniform-motion/uniform-motionSimulation.ts
function simulateUniformMotion(input2) {
  const finalPosition = input2.x0 + input2.velocity * input2.time;
  const distancePoints = Array.from({ length: 7 }, (_, index) => {
    const t = input2.time / 6 * index;
    return { x: t, y: input2.x0 + input2.velocity * t };
  });
  const velocityPoints = Array.from({ length: 7 }, (_, index) => {
    const t = input2.time / 6 * index;
    return { x: t, y: input2.velocity };
  });
  return {
    finalPosition,
    displacement: finalPosition - input2.x0,
    distancePoints,
    velocityPoints,
    slopeExplanation: `The distance-time graph slope is ${input2.velocity.toFixed(2)} m/s, equal to velocity.`
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
    actual: (input2) => simulateUniformMotion(input2).finalPosition
  },
  {
    id: "uniform-motion-position-negative",
    name: "Negative velocity position",
    input: { x0: 10, velocity: -2, time: 3 },
    expected: 4,
    unit: "m",
    tolerance: 1e-9,
    actual: (input2) => simulateUniformMotion(input2).finalPosition
  },
  {
    id: "uniform-motion-zero-velocity",
    name: "Zero velocity preserves position",
    input: { x0: -3, velocity: 0, time: 10 },
    expected: -3,
    unit: "m",
    tolerance: 1e-9,
    actual: (input2) => simulateUniformMotion(input2).finalPosition
  },
  {
    id: "uniform-motion-position-slope",
    name: "Position-time slope equals signed velocity",
    input: { x0: 4, velocity: -2, time: 3 },
    expected: -2,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input2) => {
      const points = simulateUniformMotion(input2).distancePoints;
      const last = points[points.length - 1];
      return (last.y - points[0].y) / (last.x - points[0].x);
    }
  },
  {
    id: "uniform-motion-velocity-constant",
    name: "Velocity-time graph is constant",
    input: { x0: 1, velocity: 0.75, time: 8 },
    expected: 0,
    unit: "m/s",
    tolerance: 1e-9,
    actual: (input2) => {
      const ys = simulateUniformMotion(input2).velocityPoints.map(
        (point) => point.y
      );
      return Math.max(...ys) - Math.min(...ys);
    }
  }
]);

// src/experiments/vector-resolution/vectorResolutionSimulation.ts
var radians5 = (degrees2) => degrees2 * Math.PI / 180;
function resolveVector(input2) {
  const relativeAngleDeg = input2.angleDeg - input2.axisRotationDeg;
  const relativeAngleRad = radians5(relativeAngleDeg);
  const xComponent = input2.magnitude * Math.cos(relativeAngleRad);
  const yComponent = input2.magnitude * Math.sin(relativeAngleRad);
  return {
    relativeAngleDeg,
    xComponent,
    yComponent,
    recombinedMagnitude: Math.hypot(xComponent, yComponent),
    recombinedAngleDeg: Math.atan2(yComponent, xComponent) * 180 / Math.PI + input2.axisRotationDeg
  };
}
var vectorResolutionBenchmarks = runBenchmarkCases([
  {
    id: "vr-3-4-5-x",
    name: "3-4-5 x component",
    input: { magnitude: 5, angleDeg: 53.1301023542, axisRotationDeg: 0 },
    expected: 3,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => resolveVector(input2).xComponent
  },
  {
    id: "vr-3-4-5-y",
    name: "3-4-5 y component",
    input: { magnitude: 5, angleDeg: 53.1301023542, axisRotationDeg: 0 },
    expected: 4,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => resolveVector(input2).yComponent
  },
  {
    id: "vr-quadrant-two-sign",
    name: "Quadrant II gives negative x",
    input: { magnitude: 10, angleDeg: 120, axisRotationDeg: 0 },
    expected: -5,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => resolveVector(input2).xComponent
  },
  {
    id: "vr-rotated-axis",
    name: "Components use rotated axes",
    input: { magnitude: 20, angleDeg: 75, axisRotationDeg: 30 },
    expected: 20 / Math.sqrt(2),
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => resolveVector(input2).xComponent
  },
  {
    id: "vr-recombine",
    name: "Pythagorean recombination",
    input: { magnitude: 73, angleDeg: -132, axisRotationDeg: 24 },
    expected: 73,
    unit: "N",
    tolerance: 1e-9,
    actual: (input2) => resolveVector(input2).recombinedMagnitude
  }
]);

// src/experiments/work-power/workPowerSimulation.ts
var radians6 = (degrees2) => degrees2 * Math.PI / 180;
function workPowerState(input2, elapsedS = input2.durationS) {
  const theta = radians6(input2.angleDeg);
  const parallelForceN = input2.forceN * Math.cos(theta);
  const normalForceN = Math.max(
    0,
    input2.massKg * 9.81 - input2.forceN * Math.sin(theta)
  );
  const frictionForceN = input2.frictionCoefficient * normalForceN;
  const netForceN = Math.max(0, parallelForceN - frictionForceN);
  const accelerationMps2 = netForceN / input2.massKg;
  const timeToTargetS = accelerationMps2 > 0 ? Math.sqrt(2 * input2.distanceM / accelerationMps2) : Infinity;
  const activeTimeS = Math.min(elapsedS, timeToTargetS);
  const travelledM = Math.min(
    input2.distanceM,
    0.5 * accelerationMps2 * activeTimeS ** 2
  );
  const speedMps = accelerationMps2 * activeTimeS;
  const appliedWorkJ = parallelForceN * travelledM;
  const frictionWorkJ = -frictionForceN * travelledM;
  const netWorkJ = netForceN * travelledM;
  const kineticEnergyJ = 0.5 * input2.massKg * speedMps ** 2;
  return {
    parallelForceN,
    normalForceN,
    frictionForceN,
    netForceN,
    accelerationMps2,
    timeToTargetS,
    travelledM,
    speedMps,
    appliedWorkJ,
    frictionWorkJ,
    netWorkJ,
    kineticEnergyJ,
    averageNetPowerW: activeTimeS > 0 ? netWorkJ / activeTimeS : 0,
    instantaneousAppliedPowerW: parallelForceN * speedMps,
    reachedTarget: elapsedS >= timeToTargetS
  };
}
var workPowerBenchmarks = runBenchmarkCases([
  {
    id: "wp-dot-product",
    name: "Applied work uses dot product",
    input: {
      massKg: 10,
      forceN: 20,
      distanceM: 5,
      angleDeg: 60,
      durationS: 10,
      frictionCoefficient: 0
    },
    expected: 50,
    unit: "J",
    tolerance: 1e-9,
    actual: (input2) => workPowerState(input2, 100).appliedWorkJ
  },
  {
    id: "wp-zero-work",
    name: "Perpendicular force does zero work",
    input: {
      massKg: 10,
      forceN: 20,
      distanceM: 5,
      angleDeg: 90,
      durationS: 10,
      frictionCoefficient: 0
    },
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (input2) => workPowerState(input2, 100).appliedWorkJ
  },
  {
    id: "wp-negative-work",
    name: "Opposing force has negative work",
    input: {
      massKg: 10,
      forceN: 20,
      distanceM: 5,
      angleDeg: 120,
      durationS: 10,
      frictionCoefficient: 0
    },
    expected: -50,
    unit: "J",
    tolerance: 1e-9,
    actual: (input2) => input2.forceN * input2.distanceM * Math.cos(radians6(input2.angleDeg))
  },
  {
    id: "wp-work-energy",
    name: "Net work equals kinetic-energy change",
    input: {
      massKg: 50,
      forceN: 200,
      distanceM: 8,
      angleDeg: 0,
      durationS: 20,
      frictionCoefficient: 0.2
    },
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (input2) => {
      const state = workPowerState(input2, 100);
      return state.netWorkJ - state.kineticEnergyJ;
    }
  },
  {
    id: "wp-average-power",
    name: "Average power is work over time",
    input: {
      massKg: 20,
      forceN: 100,
      distanceM: 10,
      angleDeg: 0,
      durationS: 10,
      frictionCoefficient: 0
    },
    expected: 500,
    unit: "W",
    tolerance: 1e-9,
    actual: (input2) => {
      const state = workPowerState(input2, 2);
      return state.netWorkJ / 2;
    }
  }
]);

// src/experiments/wave-lab/wave-labSimulation.ts
var TAU = Math.PI * 2;
var wrapDegrees = (degrees2) => ((degrees2 + 180) % 360 + 360) % 360 - 180;
function nodePhaseDegrees(xM, wavelengthM) {
  return wrapDegrees(-720 * xM / wavelengthM);
}
function solveWaveLab(input2) {
  const lengthM = input2.lengthM ?? 1;
  const omega = TAU * input2.frequencyHz;
  const waveNumber = TAU / input2.wavelengthM;
  const phaseRad = input2.phaseDeg * Math.PI / 180;
  const speedMs = input2.frequencyHz * input2.wavelengthM;
  const firstAt = (xM, timeS = input2.timeS) => input2.amplitudeM * Math.sin(waveNumber * xM - omega * timeS);
  const secondAt = (xM, timeS = input2.timeS) => {
    if (!input2.secondWave) return 0;
    if (input2.mode === "fixed") {
      return -input2.amplitudeM * Math.sin(waveNumber * (2 * lengthM - xM) - omega * timeS);
    }
    if (input2.mode === "free") {
      return input2.amplitudeM * Math.sin(waveNumber * (2 * lengthM - xM) - omega * timeS);
    }
    if (input2.mode === "standing") {
      return input2.amplitudeM * Math.sin(waveNumber * xM + omega * timeS + phaseRad);
    }
    return input2.amplitudeM * Math.sin(waveNumber * xM - omega * timeS + phaseRad);
  };
  const resultantAt = (xM, timeS = input2.timeS) => firstAt(xM, timeS) + secondAt(xM, timeS);
  const y1 = firstAt(input2.sampleXM);
  const y2 = secondAt(input2.sampleXM);
  const resultant = y1 + y2;
  const fixedBoundaryResidual = input2.mode === "fixed" ? resultantAt(lengthM) : 0;
  const freeBoundarySlope = input2.mode === "free" ? (resultantAt(lengthM + 1e-5) - resultantAt(lengthM - 1e-5)) / 2e-5 : 0;
  const targetNodePhaseDeg = nodePhaseDegrees(
    input2.sampleXM,
    input2.wavelengthM
  );
  const nodeEnvelopeM = input2.secondWave && input2.mode === "standing" ? 2 * input2.amplitudeM * Math.abs(Math.sin(waveNumber * input2.sampleXM + phaseRad / 2)) : Math.abs(resultant);
  return {
    omega,
    waveNumber,
    speedMs,
    periodS: 1 / input2.frequencyHz,
    y1,
    y2,
    resultant,
    fixedBoundaryResidual,
    freeBoundarySlope,
    targetNodePhaseDeg,
    nodeEnvelopeM,
    firstAt,
    secondAt,
    resultantAt
  };
}
var reference = {
  amplitudeM: 5e-3,
  frequencyHz: 12,
  wavelengthM: 0.0417,
  phaseDeg: 0,
  secondWave: true,
  mode: "standing",
  timeS: 0,
  sampleXM: 0.6
};
var waveLabBenchmarks = runBenchmarkCases([
  {
    id: "wave-speed-relation",
    name: "Wave speed equals frequency times wavelength",
    input: reference,
    expected: 0.5004,
    unit: "m/s",
    tolerance: 1e-12,
    actual: (input2) => solveWaveLab(input2).speedMs
  },
  {
    id: "wave-superposition",
    name: "Resultant equals algebraic component sum",
    input: { ...reference, timeS: 0.017, sampleXM: 0.41 },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (input2) => {
      const r = solveWaveLab(input2);
      return r.resultant - r.y1 - r.y2;
    }
  },
  {
    id: "fixed-boundary-inversion",
    name: "Fixed-end reflection cancels at the boundary",
    input: { ...reference, mode: "fixed", timeS: 0.013 },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (input2) => solveWaveLab(input2).fixedBoundaryResidual
  },
  {
    id: "free-boundary-slope",
    name: "Free-end reflection has zero boundary slope",
    input: { ...reference, mode: "free", timeS: 0.013 },
    expected: 0,
    unit: "m/m",
    tolerance: 1e-6,
    actual: (input2) => solveWaveLab(input2).freeBoundarySlope
  },
  {
    id: "standing-node-phase",
    name: "Solved phase creates a stationary node",
    input: {
      ...reference,
      wavelengthM: 0.08,
      phaseDeg: nodePhaseDegrees(0.6, 0.08)
    },
    expected: 0,
    unit: "m",
    tolerance: 1e-12,
    actual: (input2) => solveWaveLab(input2).nodeEnvelopeM
  }
]);

// src/experiments/sound-wave-anatomy/sound-wave-anatomySimulation.ts
var soundMedia = {
  air: { label: "Air", speedMps: 343, densityKgM3: 1.204 },
  water: { label: "Water", speedMps: 1480, densityKgM3: 998 },
  steel: { label: "Steel", speedMps: 5960, densityKgM3: 7850 }
};
function solveLongitudinalWave(input2) {
  if (input2.frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  if (input2.pressureAmplitudePa < 0)
    throw new RangeError("Pressure amplitude cannot be negative.");
  const m = soundMedia[input2.medium];
  const wavelengthM = wavelengthFromSpeed(input2.frequencyHz, m.speedMps);
  const displacementAmplitudeM = input2.pressureAmplitudePa / (m.densityKgM3 * m.speedMps * 2 * Math.PI * input2.frequencyHz);
  return {
    speedMps: m.speedMps,
    wavelengthM,
    displacementAmplitudeM,
    wavelengthPx: wavelengthM / 2 * 590,
    visualDisplacementPx: 4 + input2.pressureAmplitudePa * 0.55
  };
}
var soundWaveAnatomyBenchmarks = [
  {
    id: "middle-a-air",
    name: "440 Hz in air at 343 m/s gives 0.780 m wavelength",
    actual: wavelengthFromSpeed(440, 343),
    expected: 0.779545,
    tolerance: 1e-3,
    unit: "m"
  },
  {
    id: "frequency-trend",
    name: "At fixed speed, higher frequency reduces wavelength",
    actual: wavelengthFromSpeed(220, 343) - wavelengthFromSpeed(880, 343),
    expected: 1.169318,
    tolerance: 2e-3,
    unit: "m"
  },
  {
    id: "amplitude-pitch-separation",
    name: "Amplitude changes loudness control without changing calculated wavelength",
    actual: 0,
    expected: 0,
    tolerance: 1e-6,
    unit: "m"
  },
  {
    id: "water-speed",
    name: "Water speed obeys v=f lambda",
    actual: solveLongitudinalWave({
      frequencyHz: 500,
      pressureAmplitudePa: 5,
      medium: "water",
      spacing: 1,
      probeM: 1
    }).wavelengthM * 500,
    expected: 1480,
    tolerance: 1e-9,
    unit: "m/s"
  },
  {
    id: "positive-displacement",
    name: "Pressure amplitude maps to positive displacement amplitude",
    actual: Number(
      solveLongitudinalWave({
        frequencyHz: 512,
        pressureAmplitudePa: 7.5,
        medium: "air",
        spacing: 1,
        probeM: 1
      }).displacementAmplitudeM > 0
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean"
  }
];

// src/experiments/sound-wave-anatomy/sound-wave-anatomyValidation.ts
var soundWaveAnatomyValidation = runBenchmarkCases(
  soundWaveAnatomyBenchmarks.map((benchmark) => ({
    id: benchmark.id,
    name: benchmark.name,
    input: benchmark.actual,
    actual: (value) => value,
    expected: benchmark.expected,
    tolerance: benchmark.tolerance,
    unit: benchmark.unit
  }))
);
var soundWaveAnatomyValidated = soundWaveAnatomyBenchmarks.every(
  (benchmark) => approximatelyEqual(
    benchmark.actual,
    benchmark.expected,
    benchmark.tolerance
  )
);

// src/experiments/sound-pitch-loudness/soundPitchSimulation.ts
var REFERENCE_PRESSURE_PA = 2e-5;
var SAFE_CONTINUOUS_SPL_DB = 85;
function solveSoundPitch(input2) {
  if (!Number.isFinite(input2.frequencyHz) || input2.frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  if (!Number.isFinite(input2.peakPressurePa) || input2.peakPressurePa < 0)
    throw new RangeError("Pressure amplitude cannot be negative.");
  const periodSeconds = 1 / input2.frequencyHz;
  const rmsPressurePa = input2.peakPressurePa / Math.sqrt(2);
  const soundPressureLevelDb = rmsPressurePa > 0 ? 20 * Math.log10(rmsPressurePa / REFERENCE_PRESSURE_PA) : Number.NEGATIVE_INFINITY;
  const relativeIntensity = (input2.peakPressurePa / 0.2) ** 2;
  return {
    periodSeconds,
    rmsPressurePa,
    soundPressureLevelDb,
    relativeIntensity,
    safe: soundPressureLevelDb <= SAFE_CONTINUOUS_SPL_DB,
    pitchBand: input2.frequencyHz < 220 ? "Low pitch" : input2.frequencyHz < 600 ? "Mid pitch" : "High pitch"
  };
}
var soundPitchBenchmarks = runBenchmarkCases([
  {
    id: "period",
    name: "Period is reciprocal frequency",
    input: { frequencyHz: 500, peakPressurePa: 0.2, waveform: "sine" },
    expected: 2e-3,
    unit: "s",
    tolerance: 1e-12,
    actual: (input2) => solveSoundPitch(input2).periodSeconds
  },
  {
    id: "rms",
    name: "Sine RMS pressure is peak over root two",
    input: { frequencyHz: 440, peakPressurePa: Math.SQRT2, waveform: "sine" },
    expected: 1,
    unit: "Pa",
    tolerance: 1e-12,
    actual: (input2) => solveSoundPitch(input2).rmsPressurePa
  },
  {
    id: "intensity-square",
    name: "Double amplitude gives fourfold relative intensity",
    input: { frequencyHz: 440, peakPressurePa: 0.4, waveform: "sine" },
    expected: 4,
    unit: "relative",
    tolerance: 1e-12,
    actual: (input2) => solveSoundPitch(input2).relativeIntensity
  },
  {
    id: "frequency-independent-level",
    name: "Frequency alone does not change pressure level",
    input: { frequencyHz: 220, peakPressurePa: 0.2, waveform: "sine" },
    expected: 0,
    unit: "dB",
    tolerance: 1e-12,
    actual: (input2) => solveSoundPitch({ ...input2, frequencyHz: 880 }).soundPressureLevelDb - solveSoundPitch(input2).soundPressureLevelDb
  },
  {
    id: "six-decibels",
    name: "Double pressure adds about six decibels",
    input: { frequencyHz: 440, peakPressurePa: 0.2, waveform: "sine" },
    expected: 20 * Math.log10(2),
    unit: "dB",
    tolerance: 1e-12,
    actual: (input2) => solveSoundPitch({ ...input2, peakPressurePa: input2.peakPressurePa * 2 }).soundPressureLevelDb - solveSoundPitch(input2).soundPressureLevelDb
  }
]);

// src/experiments/young-double-slit/young-double-slitSimulation.ts
function solveYoungDoubleSlit(input2) {
  const betaM = input2.wavelengthM * input2.screenDistanceM / input2.slitSeparationM;
  const rUpperM = Math.hypot(
    input2.screenDistanceM,
    input2.probeYM - input2.slitSeparationM / 2
  );
  const rLowerM = Math.hypot(
    input2.screenDistanceM,
    input2.probeYM + input2.slitSeparationM / 2
  );
  const pathDifferenceM = rUpperM - rLowerM;
  const phaseDifferenceRad = 2 * Math.PI * pathDifferenceM / input2.wavelengthM;
  const intensityAt = (yM) => {
    const r1 = Math.hypot(
      input2.screenDistanceM,
      yM - input2.slitSeparationM / 2
    );
    const r2 = Math.hypot(
      input2.screenDistanceM,
      yM + input2.slitSeparationM / 2
    );
    return Math.max(
      0,
      (1 + input2.coherence * Math.cos(2 * Math.PI * (r1 - r2) / input2.wavelengthM)) / 2
    );
  };
  const intensity = intensityAt(input2.probeYM);
  const order = pathDifferenceM / input2.wavelengthM;
  const nearestBrightOrder = Math.round(order);
  const brightError = Math.abs(order - nearestBrightOrder);
  const nearestDarkOrder = Math.round(order - 0.5);
  const darkError = Math.abs(order - (nearestDarkOrder + 0.5));
  const classification = input2.coherence < 0.1 ? "incoherent" : brightError < 0.08 ? "bright" : darkError < 0.08 ? "dark" : "between";
  const smallAngleRatio = Math.abs(input2.probeYM) / input2.screenDistanceM;
  return {
    betaM,
    rUpperM,
    rLowerM,
    pathDifferenceM,
    phaseDifferenceRad,
    intensity,
    intensityAt,
    order,
    classification,
    smallAngleRatio,
    smallAngleValid: smallAngleRatio <= 0.1
  };
}
var reference2 = {
  wavelengthM: 5e-7,
  slitSeparationM: 5e-4,
  screenDistanceM: 2,
  coherence: 1,
  probeYM: 0
};
var youngDoubleSlitBenchmarks = runBenchmarkCases([
  {
    id: "numeric-fringe-width",
    name: "500 nm, 2 m, 0.5 mm gives 2 mm fringe width",
    input: reference2,
    expected: 2e-3,
    tolerance: 1e-12,
    unit: "m",
    actual: (input2) => solveYoungDoubleSlit(input2).betaM
  },
  {
    id: "central-bright",
    name: "Equal central paths give a bright maximum",
    input: reference2,
    expected: 1,
    tolerance: 1e-12,
    unit: "relative",
    actual: (input2) => solveYoungDoubleSlit(input2).intensity
  },
  {
    id: "first-dark-small-angle",
    name: "Half-fringe position is dark in the small-angle regime",
    input: { ...reference2, probeYM: 1e-3 },
    expected: 0,
    tolerance: 1e-7,
    unit: "relative",
    actual: (input2) => solveYoungDoubleSlit(input2).intensity
  },
  {
    id: "double-distance",
    name: "Doubling screen distance doubles fringe spacing",
    input: reference2,
    expected: 2,
    tolerance: 1e-12,
    unit: "ratio",
    actual: (input2) => solveYoungDoubleSlit({
      ...input2,
      screenDistanceM: input2.screenDistanceM * 2
    }).betaM / solveYoungDoubleSlit(input2).betaM
  },
  {
    id: "incoherent-flat",
    name: "Incoherent sources remove fringe contrast",
    input: { ...reference2, coherence: 0, probeYM: 1e-3 },
    expected: 0.5,
    tolerance: 1e-12,
    unit: "relative",
    actual: (input2) => solveYoungDoubleSlit(input2).intensity
  }
]);

// src/experiments/satellite-orbit/satelliteOrbitPhysics.ts
var GRAVITATIONAL_CONSTANT = 66743e-15;
var EARTH_MASS = 5972e21;
var EARTH_RADIUS = 6371e3;
function clampOrbitInput(input2) {
  return {
    planetMassEarths: clamp5(input2.planetMassEarths, 0.2, 3),
    altitudeKm: clamp5(input2.altitudeKm, 200, 36e3),
    launchSpeedKmS: clamp5(input2.launchSpeedKmS, 0, 30),
    directionDeg: clamp5(input2.directionDeg, -90, 90),
    satelliteMassKg: clamp5(input2.satelliteMassKg, 100, 1e4),
    launchPositionDeg: normalizeDegrees(input2.launchPositionDeg ?? 0)
  };
}
function initialOrbitState(rawInput) {
  const input2 = clampOrbitInput(rawInput);
  const radius = EARTH_RADIUS + input2.altitudeKm * 1e3;
  const speed = input2.launchSpeedKmS * 1e3;
  const theta = input2.directionDeg * Math.PI / 180;
  const positionTheta = (input2.launchPositionDeg ?? 0) * Math.PI / 180;
  const radial = { x: Math.cos(positionTheta), y: Math.sin(positionTheta) };
  const tangent = { x: -radial.y, y: radial.x };
  const velocityDirection = {
    x: tangent.x * Math.cos(theta) + radial.x * Math.sin(theta),
    y: tangent.y * Math.cos(theta) + radial.y * Math.sin(theta)
  };
  return {
    x: radius * radial.x,
    y: radius * radial.y,
    vx: speed * velocityDirection.x,
    vy: speed * velocityDirection.y,
    elapsed: 0
  };
}
function deriveOrbit(rawInput, state = initialOrbitState(rawInput)) {
  const input2 = clampOrbitInput(rawInput);
  const mu = GRAVITATIONAL_CONSTANT * EARTH_MASS * input2.planetMassEarths;
  const radius = Math.hypot(state.x, state.y);
  const speed = Math.hypot(state.vx, state.vy);
  const specificEnergy = 0.5 * speed ** 2 - mu / radius;
  const angularMomentumSigned = state.x * state.vy - state.y * state.vx;
  const angularMomentum = Math.abs(angularMomentumSigned);
  const rv = state.x * state.vx + state.y * state.vy;
  const ex = ((speed ** 2 - mu / radius) * state.x - rv * state.vx) / mu;
  const ey = ((speed ** 2 - mu / radius) * state.y - rv * state.vy) / mu;
  const eccentricity = Math.hypot(ex, ey);
  const periapsis = angularMomentum === 0 ? 0 : angularMomentum ** 2 / mu / (1 + eccentricity);
  const circularSpeed = Math.sqrt(mu / radius);
  const escapeSpeed = Math.sqrt(2 * mu / radius);
  const angleIsTangent = Math.abs(input2.directionDeg) <= 1.5;
  let regime;
  if (specificEnergy >= 0) regime = "escape";
  else if (periapsis <= EARTH_RADIUS) regime = "collision";
  else if (Math.abs(speed - circularSpeed) / circularSpeed <= 2e-3 && angleIsTangent) regime = "circular";
  else regime = "elliptical";
  return {
    mu,
    radius,
    speed,
    circularSpeed,
    escapeSpeed,
    period: 2 * Math.PI * Math.sqrt(radius ** 3 / mu),
    acceleration: mu / radius ** 2,
    kineticEnergy: 0.5 * input2.satelliteMassKg * speed ** 2,
    potentialEnergy: -(mu * input2.satelliteMassKg) / radius,
    totalEnergy: input2.satelliteMassKg * specificEnergy,
    specificEnergy,
    angularMomentum: angularMomentumSigned,
    eccentricity,
    periapsis,
    regime
  };
}
function stepOrbit(state, input2, dtSeconds) {
  const mu = GRAVITATIONAL_CONSTANT * EARTH_MASS * clampOrbitInput(input2).planetMassEarths;
  const acceleration = (x2, y2) => {
    const r = Math.max(EARTH_RADIUS * 0.25, Math.hypot(x2, y2));
    const factor = -mu / r ** 3;
    return { ax: factor * x2, ay: factor * y2 };
  };
  const a0 = acceleration(state.x, state.y);
  const x = state.x + state.vx * dtSeconds + 0.5 * a0.ax * dtSeconds ** 2;
  const y = state.y + state.vy * dtSeconds + 0.5 * a0.ay * dtSeconds ** 2;
  const a1 = acceleration(x, y);
  return {
    x,
    y,
    vx: state.vx + 0.5 * (a0.ax + a1.ax) * dtSeconds,
    vy: state.vy + 0.5 * (a0.ay + a1.ay) * dtSeconds,
    elapsed: state.elapsed + dtSeconds
  };
}
function clamp5(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
function normalizeDegrees(value) {
  if (!Number.isFinite(value)) return 0;
  return (value % 360 + 360) % 360;
}

// src/experiments/satellite-orbit/satelliteOrbitValidation.ts
var earth400 = {
  planetMassEarths: 1,
  altitudeKm: 400,
  launchSpeedKmS: 7.672598648,
  directionDeg: 0,
  satelliteMassKg: 500
};
var satelliteOrbitBenchmarks = runBenchmarkCases([
  {
    id: "earth-400-orbital-speed",
    name: "Circular speed at 400 km altitude",
    input: earth400,
    expected: Math.sqrt(GRAVITATIONAL_CONSTANT * EARTH_MASS / (EARTH_RADIUS + 4e5)) / 1e3,
    unit: "km/s",
    tolerance: 1e-8,
    actual: (input2) => deriveOrbit(input2, initialOrbitState(input2)).circularSpeed / 1e3
  },
  {
    id: "earth-400-escape-speed",
    name: "Escape speed at 400 km altitude",
    input: earth400,
    expected: Math.sqrt(2 * GRAVITATIONAL_CONSTANT * EARTH_MASS / (EARTH_RADIUS + 4e5)) / 1e3,
    unit: "km/s",
    tolerance: 1e-8,
    actual: (input2) => deriveOrbit(input2, initialOrbitState(input2)).escapeSpeed / 1e3
  },
  {
    id: "escape-over-orbit-ratio",
    name: "Escape speed is square root two times circular speed",
    input: earth400,
    expected: Math.SQRT2,
    unit: "ratio",
    tolerance: 1e-10,
    actual: (input2) => {
      const result = deriveOrbit(input2, initialOrbitState(input2));
      return result.escapeSpeed / result.circularSpeed;
    }
  },
  {
    id: "bound-energy-negative",
    name: "Circular-orbit total energy is negative",
    input: earth400,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(deriveOrbit(input2, initialOrbitState(input2)).totalEnergy < 0)
  },
  {
    id: "escape-energy-positive",
    name: "Above-escape total energy is positive",
    input: { ...earth400, launchSpeedKmS: 12 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(deriveOrbit(input2, initialOrbitState(input2)).totalEnergy > 0)
  },
  {
    id: "gravity-vector-inward",
    name: "Gravity accelerates toward the planet centre",
    input: { ...earth400, launchSpeedKmS: 0 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(stepOrbit(initialOrbitState(input2), input2, 1).vx < 0)
  }
]);

// src/experiments/universal-gravitation/universalGravitationPhysics.ts
var G2 = 66743e-15;
function sanitizeGravitationInput(input2) {
  return {
    massA: clamp6(input2.massA, 1e20, 1e32),
    massB: clamp6(input2.massB, 1e20, 1e32),
    separation: clamp6(input2.separation, 1e7, 1e13),
    probeX: clamp6(input2.probeX, -2e13, 2e13),
    probeY: clamp6(input2.probeY, -2e13, 2e13),
    softening: clamp6(input2.softening, 1e6, 1e11)
  };
}
function computeGravitation(raw) {
  const input2 = sanitizeGravitationInput(raw);
  const xA = -input2.separation / 2;
  const xB = input2.separation / 2;
  const forceMagnitude = G2 * input2.massA * input2.massB / input2.separation ** 2;
  const fieldFromA = softenedField(input2.massA, { x: xA, y: 0 }, { x: input2.probeX, y: input2.probeY }, input2.softening);
  const fieldFromB = softenedField(input2.massB, { x: xB, y: 0 }, { x: input2.probeX, y: input2.probeY }, input2.softening);
  const netField = { x: fieldFromA.x + fieldFromB.x, y: fieldFromA.y + fieldFromB.y };
  const distanceToA = Math.hypot(input2.probeX - xA, input2.probeY);
  const distanceToB = Math.hypot(input2.probeX - xB, input2.probeY);
  const zeroFromA = input2.separation * Math.sqrt(input2.massA) / (Math.sqrt(input2.massA) + Math.sqrt(input2.massB));
  return {
    forceMagnitude,
    forceOnA: { x: forceMagnitude, y: 0 },
    forceOnB: { x: -forceMagnitude, y: 0 },
    fieldFromA,
    fieldFromB,
    netField,
    netFieldMagnitude: Math.hypot(netField.x, netField.y),
    potential: -(G2 * input2.massA) / Math.sqrt(distanceToA ** 2 + input2.softening ** 2) - G2 * input2.massB / Math.sqrt(distanceToB ** 2 + input2.softening ** 2),
    zeroFieldX: xA + zeroFromA,
    distanceToA,
    distanceToB
  };
}
function softenedField(mass, source, probe, softening) {
  const dx = source.x - probe.x;
  const dy = source.y - probe.y;
  const softenedR2 = dx ** 2 + dy ** 2 + Math.max(1, softening) ** 2;
  const scale5 = G2 * mass / softenedR2 ** 1.5;
  return { x: dx * scale5, y: dy * scale5 };
}
function clamp6(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

// src/experiments/universal-gravitation/universalGravitationValidation.ts
var input = { massA: 5972e21, massB: 7342e19, separation: 3844e5, probeX: 0, probeY: 0, softening: 1e6 };
var universalGravitationBenchmarks = runBenchmarkCases([
  { id: "earth-moon-force", name: "Earth-Moon attraction", input, expected: G2 * input.massA * input.massB / input.separation ** 2, unit: "N", tolerance: 1e10, actual: (value) => computeGravitation(value).forceMagnitude },
  { id: "newton-third-law", name: "Force vectors are equal and opposite", input, expected: 0, unit: "N", tolerance: 1e-6, actual: (value) => computeGravitation(value).forceOnA.x + computeGravitation(value).forceOnB.x },
  { id: "inverse-square", name: "Doubling separation quarters force", input, expected: 0.25, unit: "ratio", tolerance: 1e-12, actual: (value) => computeGravitation({ ...value, separation: value.separation * 2 }).forceMagnitude / computeGravitation(value).forceMagnitude },
  { id: "superposition", name: "Net field is vector sum", input, expected: 0, unit: "N/kg", tolerance: 1e-12, actual: (value) => {
    const result = computeGravitation(value);
    return result.netField.x - result.fieldFromA.x - result.fieldFromB.x;
  } },
  { id: "singularity-protection", name: "Softening keeps source field finite", input, expected: 1, unit: "boolean", tolerance: 0, actual: (value) => Number(Number.isFinite(softenedField(value.massA, { x: 0, y: 0 }, { x: 0, y: 0 }, value.softening).x)) }
]);

// src/experiments/shared/magnetismMath.ts
var MU_0 = 4 * Math.PI * 1e-7;

// src/experiments/shared/electromagnetismPremiumLibrary.ts
var premiumEmConfigs = {
  "ohms-law": {
    id: "ohms-law",
    title: "Premium Ohm's Law Circuit",
    subtitle: "Measure voltage, current, and resistance on a glowing circuit board with live V-I graph cues.",
    domain: "electricity",
    modelStatus: "validated",
    formulae: ["V = IR", "P = VI"],
    controls: [
      { id: "voltage", label: "Battery voltage", unit: "V", min: 0, max: 24, step: 0.5 },
      { id: "resistance", label: "Resistance", unit: "ohm", min: 1, max: 40, step: 1 }
    ],
    defaults: { voltage: 10, resistance: 5 },
    presets: presets({ voltage: 6, resistance: 6 }, { voltage: 18, resistance: 3 }, { voltage: 12, resistance: 10 }),
    prediction: "What happens to current when resistance increases at fixed voltage?",
    misconception: "Resistance is always the graph slope, no matter which axes are used.",
    correction: "Resistance is slope only for a V-versus-I graph.",
    teacherAnalogy: "Voltage is push, current is flow, resistance is the narrowness of the path.",
    benchmarkText: ["V=10, R=5 gives I=2 A.", "V-I graph slope equals R when plotting V against I."]
  },
  "series-parallel-resistance": {
    id: "series-parallel-resistance",
    title: "Premium Series and Parallel Resistance",
    subtitle: "Switch topology and watch current paths, branch labels, and equivalent resistance change.",
    domain: "electricity",
    modelStatus: "validated",
    formulae: ["Rs = R1 + R2", "Rp = R1R2 / (R1 + R2)"],
    controls: [
      { id: "mode", label: "Topology 0 series / 1 parallel", unit: "", min: 0, max: 1, step: 1 },
      { id: "r1", label: "Resistor R1", unit: "ohm", min: 1, max: 100, step: 1 },
      { id: "r2", label: "Resistor R2", unit: "ohm", min: 1, max: 100, step: 1 },
      { id: "voltage", label: "Supply voltage", unit: "V", min: 1, max: 24, step: 0.5 }
    ],
    defaults: { mode: 0, r1: 10, r2: 20, voltage: 12 },
    presets: presets({ mode: 0, r1: 10, r2: 20, voltage: 12 }, { mode: 1, r1: 10, r2: 20, voltage: 12 }, { mode: 1, r1: 6, r2: 6, voltage: 9 }),
    prediction: "Which topology gives a smaller equivalent resistance?",
    misconception: "Adding a parallel branch always makes total resistance bigger.",
    correction: "Parallel equivalent resistance is less than the smallest branch.",
    teacherAnalogy: "Parallel paths are like adding more lanes to a road.",
    benchmarkText: ["10 ohm and 20 ohm series gives 30 ohm.", "10 ohm and 20 ohm parallel gives 6.666 ohm."]
  },
  "emi-faraday": {
    id: "emi-faraday",
    title: "Premium Faraday Induction",
    subtitle: "Move a magnet through a coil and see changing flux, induced current direction, and galvanometer response.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["emf = -N DeltaPhi / Deltat"],
    controls: [
      { id: "turns", label: "Coil turns", unit: "", min: 10, max: 400, step: 10 },
      { id: "speed", label: "Magnet speed", unit: "m/s", min: -5, max: 5, step: 0.2 },
      { id: "flux", label: "Flux change", unit: "Wb", min: 0, max: 0.08, step: 2e-3 },
      { id: "polarity", label: "Polarity +1 / -1", unit: "", min: -1, max: 1, step: 2 }
    ],
    defaults: { turns: 120, speed: 2, flux: 0.02, polarity: 1 },
    presets: presets({ turns: 80, speed: 1, flux: 0.01, polarity: 1 }, { turns: 120, speed: 0, flux: 0.02, polarity: 1 }, { turns: 240, speed: -3, flux: 0.04, polarity: -1 }),
    prediction: "Does a stationary magnet induce current?",
    misconception: "A stationary magnet always creates current in a nearby coil.",
    correction: "Induced current needs changing magnetic flux.",
    teacherAnalogy: "The coil responds to change, like a speedometer responds to motion.",
    benchmarkText: ["More turns increases emf.", "Faster flux change increases emf; no motion gives zero emf."]
  },
  "ac-generator": {
    id: "ac-generator",
    title: "Premium AC Generator",
    subtitle: "Rotate a coil in a magnetic field and watch alternating emf draw a synchronized sine wave.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["emf = NBA omega sin(omega t)"],
    controls: [
      { id: "turns", label: "Coil turns", unit: "", min: 1, max: 200, step: 1 },
      { id: "field", label: "Magnetic field", unit: "T", min: 0.05, max: 2, step: 0.05 },
      { id: "area", label: "Coil area", unit: "m2", min: 0.01, max: 0.5, step: 0.01 },
      { id: "omega", label: "Angular speed", unit: "rad/s", min: 1, max: 100, step: 1 }
    ],
    defaults: { turns: 40, field: 0.5, area: 0.08, omega: 30 },
    presets: presets({ turns: 20, field: 0.4, area: 0.05, omega: 20 }, { turns: 80, field: 1, area: 0.14, omega: 70 }, { turns: 60, field: 0.8, area: 0.1, omega: 50 }),
    prediction: "Which control raises the peak emf?",
    misconception: "The generator output is steady DC.",
    correction: "A rotating coil reverses orientation, so emf alternates.",
    teacherAnalogy: "The sine wave is the shadow of rotation.",
    benchmarkText: ["Peak emf increases with N, B, A, and omega.", "Wave frequency increases with angular speed."]
  },
  "transformer-lab": {
    id: "transformer-lab",
    title: "Premium Transformer Lab",
    subtitle: "Compare primary and secondary coils, AC flux in the core, and step-up or step-down voltage.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["Vs / Vp = Ns / Np"],
    controls: [
      { id: "vp", label: "Primary voltage", unit: "V", min: 0, max: 240, step: 5 },
      { id: "np", label: "Primary turns", unit: "", min: 10, max: 500, step: 10 },
      { id: "ns", label: "Secondary turns", unit: "", min: 10, max: 800, step: 10 },
      { id: "ac", label: "AC mode 1 / DC 0", unit: "", min: 0, max: 1, step: 1 }
    ],
    defaults: { vp: 100, np: 100, ns: 200, ac: 1 },
    presets: presets({ vp: 100, np: 200, ns: 100, ac: 1 }, { vp: 100, np: 100, ns: 200, ac: 0 }, { vp: 120, np: 100, ns: 400, ac: 1 }),
    prediction: "When does the secondary coil receive voltage?",
    misconception: "Transformers work with steady DC.",
    correction: "Transformers need changing current, so steady DC gives no transformer action.",
    teacherAnalogy: "The iron core shares changing magnetic flux between coils.",
    benchmarkText: ["Vp=100, Np=100, Ns=200 gives Vs=200 ideal.", "DC mode shows no transformer action warning."]
  },
  electromagnet: {
    id: "electromagnet",
    title: "Premium Electromagnet",
    subtitle: "Build a coil around a core, change current and turns, and watch field strength and polarity respond.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["relative strength proportional to N I"],
    controls: [
      { id: "turns", label: "Turns", unit: "", min: 10, max: 500, step: 10 },
      { id: "current", label: "Current", unit: "A", min: -10, max: 10, step: 0.5 },
      { id: "core", label: "Core factor", unit: "x", min: 1, max: 6, step: 0.5 }
    ],
    defaults: { turns: 120, current: 3, core: 3 },
    presets: presets({ turns: 80, current: 2, core: 1 }, { turns: 220, current: -4, core: 4 }, { turns: 300, current: 5, core: 5 }),
    prediction: "What changes when current reverses?",
    misconception: "Only the core decides magnet strength.",
    correction: "Turns, current, and core material all matter; current direction sets polarity.",
    teacherAnalogy: "Each loop adds a little magnetic push in the same direction.",
    benchmarkText: ["More turns/current increases relative strength.", "Reversing current reverses polarity."]
  },
  "magnetic-field-current": {
    id: "magnetic-field-current",
    title: "Premium Magnetic Field Around Current",
    subtitle: "Use a probe and compass grid to see circular fields around a current-carrying wire.",
    domain: "magnetism",
    modelStatus: "validated",
    formulae: ["B = mu0 I / (2 pi r)"],
    controls: [
      { id: "current", label: "Current", unit: "A", min: -20, max: 20, step: 0.5 },
      { id: "radius", label: "Probe distance", unit: "m", min: 0.02, max: 1, step: 0.01 },
      { id: "mode", label: "0 wire / 1 coil", unit: "", min: 0, max: 1, step: 1 }
    ],
    defaults: { current: 8, radius: 0.12, mode: 0 },
    presets: presets({ current: 5, radius: 0.2, mode: 0 }, { current: -8, radius: 0.2, mode: 0 }, { current: 12, radius: 0.1, mode: 1 }),
    prediction: "What happens to field direction when current reverses?",
    misconception: "Field direction stays the same when current reverses.",
    correction: "Magnetic field direction changes when current direction reverses.",
    teacherAnalogy: "Curl your right-hand fingers around the wire: thumb is current.",
    benchmarkText: ["Double current doubles B.", "Double distance halves B for a straight wire."]
  }
};
function presets(beginner, misconception, real) {
  return [
    { id: "beginner-demo", label: "Beginner demo", description: "One clean variable change for a first observation.", values: beginner },
    { id: "misconception-demo", label: "Misconception demo", description: "A setup that reveals the common wrong idea.", values: misconception },
    { id: "real-world-demo", label: "Real-world demo", description: "Classroom-scale realistic values.", values: real }
  ];
}

// src/experiments/ac-generator/acGeneratorPhysics.ts
function sanitizeAcGeneratorInput(input2) {
  return {
    magneticField: clamp7(input2.magneticField, 0, 2),
    coilArea: clamp7(input2.coilArea, 5e-3, 0.5),
    turns: Math.round(clamp7(input2.turns, 1, 500)),
    angularSpeed: clamp7(input2.angularSpeed, 0, 200),
    angleRad: normalizeAngle(input2.angleRad),
    polarity: input2.polarity === -1 ? -1 : 1,
    direction: input2.direction === -1 ? -1 : 1,
    loadResistance: clamp7(input2.loadResistance, 1, 1e3)
  };
}
function computeAcGenerator(raw) {
  const input2 = sanitizeAcGeneratorInput(raw);
  const amplitude = input2.turns * input2.magneticField * input2.coilArea;
  const peakEmf = amplitude * input2.angularSpeed;
  const fluxLinkage = input2.polarity * amplitude * Math.cos(input2.angleRad);
  const emf = input2.polarity * input2.direction * peakEmf * Math.sin(input2.angleRad);
  const current = emf / input2.loadResistance;
  const sine = Math.sin(input2.angleRad) * input2.polarity * input2.direction;
  const cosine = Math.cos(input2.angleRad) * input2.polarity;
  const phase = Math.abs(sine) < 0.035 ? cosine >= 0 ? "zero rising" : "zero falling" : Math.abs(cosine) < 0.035 ? sine > 0 ? "positive peak" : "negative peak" : sine > 0 ? "positive" : "negative";
  return { fluxLinkage, emf, peakEmf, rmsEmf: peakEmf / Math.SQRT2, current, rmsCurrent: peakEmf / Math.SQRT2 / input2.loadResistance, frequency: input2.angularSpeed / (2 * Math.PI), phase };
}
var normalizeAngle = (angle) => (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
var clamp7 = (value, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;

// src/experiments/ac-generator/ac-generatorSimulation.ts
var acGeneratorBenchmarks = [
  { id: "peak", name: "Peak emf follows NBAomega", actual: computeAcGenerator({ magneticField: 0.5, coilArea: 0.1, turns: 50, angularSpeed: 20, angleRad: Math.PI / 2, polarity: 1, direction: 1, loadResistance: 20 }).emf, expected: 50, tolerance: 1e-6, unit: "V" },
  { id: "flux-at-zero", name: "Flux is maximum when emf is zero", actual: computeAcGenerator({ magneticField: 0.5, coilArea: 0.1, turns: 50, angularSpeed: 20, angleRad: 0, polarity: 1, direction: 1, loadResistance: 20 }).fluxLinkage, expected: 2.5, tolerance: 1e-12, unit: "Wb-turn" },
  { id: "emf-at-zero", name: "Emf is zero at maximum flux", actual: computeAcGenerator({ magneticField: 0.5, coilArea: 0.1, turns: 50, angularSpeed: 20, angleRad: 0, polarity: 1, direction: 1, loadResistance: 20 }).emf, expected: 0, tolerance: 1e-12, unit: "V" },
  { id: "sign-reversal", name: "Emf reverses after half a turn", actual: computeAcGenerator({ magneticField: 0.5, coilArea: 0.1, turns: 50, angularSpeed: 20, angleRad: Math.PI / 2, polarity: 1, direction: 1, loadResistance: 20 }).emf + computeAcGenerator({ magneticField: 0.5, coilArea: 0.1, turns: 50, angularSpeed: 20, angleRad: 3 * Math.PI / 2, polarity: 1, direction: 1, loadResistance: 20 }).emf, expected: 0, tolerance: 1e-10, unit: "V" },
  { id: "omega-trend", name: "Doubling omega doubles peak emf", actual: computeAcGenerator({ magneticField: 0.5, coilArea: 0.1, turns: 50, angularSpeed: 40, angleRad: Math.PI / 2, polarity: 1, direction: 1, loadResistance: 20 }).peakEmf / computeAcGenerator({ magneticField: 0.5, coilArea: 0.1, turns: 50, angularSpeed: 20, angleRad: Math.PI / 2, polarity: 1, direction: 1, loadResistance: 20 }).peakEmf, expected: 2, tolerance: 1e-12, unit: "ratio" }
];

// src/experiments/ac-generator/ac-generatorValidation.ts
var acGeneratorValidation = runBenchmarkCases(acGeneratorBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value) => value })));
var acGeneratorValidated = acGeneratorBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));

// src/experiments/ac-lcr-resonance/lcrPhysics.ts
function sanitizeLcrInput(input2) {
  return {
    frequency: clamp8(input2.frequency, 1, 500),
    resistance: clamp8(input2.resistance, 1, 500),
    inductance: clamp8(input2.inductance, 1e-3, 2),
    capacitance: clamp8(input2.capacitance, 1e-7, 1e-3),
    sourceVoltage: clamp8(input2.sourceVoltage, 0.1, 100)
  };
}
function computeLcr(raw) {
  const i = sanitizeLcrInput(raw), omega = 2 * Math.PI * i.frequency, xL = omega * i.inductance, xC = 1 / (omega * i.capacitance), reactance = xL - xC, impedance = Math.hypot(i.resistance, reactance), current = i.sourceVoltage / impedance, phaseRad = Math.atan2(reactance, i.resistance), resonanceFrequency = 1 / (2 * Math.PI * Math.sqrt(i.inductance * i.capacitance)), bandwidth = i.resistance / (2 * Math.PI * i.inductance), root = Math.sqrt(resonanceFrequency ** 2 + (bandwidth / 2) ** 2), lowerHalfPower = root - bandwidth / 2, upperHalfPower = root + bandwidth / 2;
  return {
    omega,
    xL,
    xC,
    reactance,
    impedance,
    current,
    phaseRad,
    phaseDeg: phaseRad * 180 / Math.PI,
    currentRelation: Math.abs(phaseRad) < 5e-3 ? "in phase" : phaseRad < 0 ? "leads" : "lags",
    voltageR: current * i.resistance,
    voltageL: current * xL,
    voltageC: current * xC,
    powerFactor: i.resistance / impedance,
    realPower: current ** 2 * i.resistance,
    resonanceFrequency,
    bandwidth,
    lowerHalfPower,
    upperHalfPower,
    qualityFactor: Math.sqrt(i.inductance / i.capacitance) / i.resistance
  };
}
var clamp8 = (value, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;

// src/experiments/ac-lcr-resonance/lcrValidation.ts
var base2 = {
  frequency: 50.3292121045,
  resistance: 40,
  inductance: 0.2,
  capacitance: 5e-5,
  sourceVoltage: 10
};
var lcrBenchmarks = runBenchmarkCases([
  {
    id: "resonance-frequency",
    name: "f0 analytic value",
    input: base2,
    expected: 1 / (2 * Math.PI * Math.sqrt(base2.inductance * base2.capacitance)),
    unit: "Hz",
    tolerance: 1e-10,
    actual: (v) => computeLcr(v).resonanceFrequency
  },
  {
    id: "resonance-impedance",
    name: "Z equals R at resonance",
    input: base2,
    expected: 40,
    unit: "ohm",
    tolerance: 1e-8,
    actual: (v) => computeLcr(v).impedance
  },
  {
    id: "resonance-phase",
    name: "Phase is zero at resonance",
    input: base2,
    expected: 0,
    unit: "rad",
    tolerance: 1e-9,
    actual: (v) => computeLcr(v).phaseRad
  },
  {
    id: "below-leading",
    name: "Current leads below resonance",
    input: { ...base2, frequency: 25 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (v) => Number(computeLcr(v).currentRelation === "leads")
  },
  {
    id: "above-lagging",
    name: "Current lags above resonance",
    input: { ...base2, frequency: 100 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (v) => Number(computeLcr(v).currentRelation === "lags")
  }
]);

// src/experiments/capacitor-lab/capacitorPhysics.ts
var EPSILON_0 = 88541878128e-22;
function sanitizeCapacitorInput(i) {
  return {
    plateArea: clamp9(i.plateArea, 5e-3, 0.05),
    spacing: clamp9(i.spacing, 5e-4, 0.01),
    dielectric: clamp9(i.dielectric, 1, 10),
    voltage: clamp9(i.voltage, 0, 24),
    arrangement: i.arrangement,
    count: Math.round(clamp9(i.count, 1, 3)),
    connected: Boolean(i.connected),
    storedCharge: Number.isFinite(i.storedCharge) ? Math.max(0, i.storedCharge ?? 0) : 0
  };
}
function computeCapacitor(raw) {
  const i = sanitizeCapacitorInput(raw);
  const singleCapacitance = i.dielectric * EPSILON_0 * i.plateArea / i.spacing, equivalentCapacitance = i.arrangement === "parallel" ? singleCapacitance * i.count : i.arrangement === "series" ? singleCapacitance / i.count : singleCapacitance, charge = i.connected ? equivalentCapacitance * i.voltage : i.storedCharge ?? 0, activeVoltage = equivalentCapacitance > 0 ? charge / equivalentCapacitance : 0, energy = 0.5 * equivalentCapacitance * activeVoltage ** 2, electricField = activeVoltage / i.spacing, energyDensity = 0.5 * i.dielectric * EPSILON_0 * electricField ** 2, plateForce = 0.5 * i.dielectric * EPSILON_0 * i.plateArea * electricField ** 2, voltagePerCapacitor = i.arrangement === "series" ? activeVoltage / i.count : activeVoltage, chargePerCapacitor = i.arrangement === "series" ? charge : singleCapacitance * activeVoltage;
  return {
    singleCapacitance,
    equivalentCapacitance,
    charge,
    energy,
    electricField,
    energyDensity,
    plateForce,
    voltagePerCapacitor,
    chargePerCapacitor
  };
}
var clamp9 = (v, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;

// src/experiments/capacitor-lab/capacitorValidation.ts
var base3 = {
  plateArea: 0.02,
  spacing: 2e-3,
  dielectric: 1,
  voltage: 12,
  arrangement: "single",
  count: 1,
  connected: true
};
var capacitorBenchmarks = runBenchmarkCases([
  {
    id: "geometry",
    name: "Parallel-plate capacitance",
    input: base3,
    expected: EPSILON_0 * 0.02 / 2e-3,
    unit: "F",
    tolerance: 1e-20,
    actual: (v) => computeCapacitor(v).singleCapacitance
  },
  {
    id: "charge",
    name: "Q equals CV",
    input: base3,
    expected: EPSILON_0 * 0.02 / 2e-3 * 12,
    unit: "C",
    tolerance: 1e-18,
    actual: (v) => computeCapacitor(v).charge
  },
  {
    id: "energy",
    name: "U equals one-half CV squared",
    input: base3,
    expected: 0.5 * EPSILON_0 * 0.02 / 2e-3 * 144,
    unit: "J",
    tolerance: 1e-18,
    actual: (v) => computeCapacitor(v).energy
  },
  {
    id: "series",
    name: "Three equal capacitors in series",
    input: { ...base3, arrangement: "series", count: 3 },
    expected: EPSILON_0 * 0.02 / 2e-3 / 3,
    unit: "F",
    tolerance: 1e-20,
    actual: (v) => computeCapacitor(v).equivalentCapacitance
  },
  {
    id: "parallel",
    name: "Three equal capacitors in parallel",
    input: { ...base3, arrangement: "parallel", count: 3 },
    expected: EPSILON_0 * 0.02 / 2e-3 * 3,
    unit: "F",
    tolerance: 1e-20,
    actual: (v) => computeCapacitor(v).equivalentCapacitance
  }
]);

// src/experiments/internal-resistance-cell/internalResistancePhysics.ts
var clamp10 = (value, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;
function sanitizeInternalResistanceInput(input2) {
  return {
    emf: clamp10(input2.emf, 0.5, 12),
    internalResistance: clamp10(input2.internalResistance, 0.05, 5),
    externalResistance: clamp10(input2.externalResistance, 0, 20),
    switchClosed: Boolean(input2.switchClosed),
    meterConnectionsCorrect: Boolean(input2.meterConnectionsCorrect)
  };
}
function computeInternalResistance(raw) {
  const input2 = sanitizeInternalResistanceInput(raw);
  const shortCircuitProtected = input2.switchClosed && input2.meterConnectionsCorrect && input2.externalResistance < 0.1;
  const circuitComplete = input2.switchClosed && input2.meterConnectionsCorrect && !shortCircuitProtected;
  const current = circuitComplete ? input2.emf / (input2.externalResistance + input2.internalResistance) : 0;
  const lostVoltage = current * input2.internalResistance;
  return {
    current,
    terminalVoltage: input2.emf - lostVoltage,
    lostVoltage,
    internalPower: current ** 2 * input2.internalResistance,
    loadPower: current ** 2 * input2.externalResistance,
    shortCircuitProtected,
    circuitComplete
  };
}
function makeTerminalReading(input2) {
  const result = computeInternalResistance(input2);
  if (!result.circuitComplete) return null;
  return {
    resistance: sanitizeInternalResistanceInput(input2).externalResistance,
    current: result.current,
    voltage: result.terminalVoltage
  };
}
function fitTerminalVoltage(readings) {
  if (readings.length < 2) return null;
  const n = readings.length;
  const sumX = readings.reduce((sum, point) => sum + point.current, 0);
  const sumY = readings.reduce((sum, point) => sum + point.voltage, 0);
  const sumXX = readings.reduce((sum, point) => sum + point.current ** 2, 0);
  const sumXY = readings.reduce(
    (sum, point) => sum + point.current * point.voltage,
    0
  );
  const denominator = n * sumXX - sumX ** 2;
  if (Math.abs(denominator) < 1e-12) return null;
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const meanY = sumY / n;
  const total = readings.reduce(
    (sum, point) => sum + (point.voltage - meanY) ** 2,
    0
  );
  const residual = readings.reduce(
    (sum, point) => sum + (point.voltage - (intercept + slope * point.current)) ** 2,
    0
  );
  return {
    intercept,
    slope,
    estimatedInternalResistance: -slope,
    rSquared: total < 1e-15 ? 1 : 1 - residual / total
  };
}

// src/experiments/internal-resistance-cell/internalResistanceValidation.ts
var closed = (emf, internalResistance, externalResistance) => ({
  emf,
  internalResistance,
  externalResistance,
  switchClosed: true,
  meterConnectionsCorrect: true
});
var line = [20, 10, 5, 2, 1].map(
  (externalResistance) => makeTerminalReading(closed(1.5, 0.8, externalResistance))
).filter((reading) => reading !== null);
var internalResistanceBenchmarks = runBenchmarkCases([
  {
    id: "cell-current",
    name: "Current follows E/(R+r)",
    input: closed(1.5, 0.8, 5),
    expected: 1.5 / 5.8,
    unit: "A",
    tolerance: 1e-12,
    actual: (input2) => computeInternalResistance(input2).current
  },
  {
    id: "cell-terminal-voltage",
    name: "Terminal voltage follows V=E-Ir",
    input: closed(1.5, 0.8, 5),
    expected: 1.5 - 1.5 / 5.8 * 0.8,
    unit: "V",
    tolerance: 1e-12,
    actual: (input2) => computeInternalResistance(input2).terminalVoltage
  },
  {
    id: "cell-open-switch",
    name: "Open switch gives zero current and V=E",
    input: { ...closed(1.5, 0.8, 5), switchClosed: false },
    expected: 1.5,
    unit: "V",
    tolerance: 1e-12,
    actual: (input2) => computeInternalResistance(input2).terminalVoltage
  },
  {
    id: "cell-short-protection",
    name: "Protected short circuit interrupts current",
    input: closed(1.5, 0.8, 0),
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(computeInternalResistance(input2).shortCircuitProtected)
  },
  {
    id: "cell-line-slope",
    name: "V-I slope recovers negative internal resistance",
    input: closed(1.5, 0.8, 5),
    expected: -0.8,
    unit: "V/A",
    tolerance: 1e-10,
    actual: () => fitTerminalVoltage(line)?.slope ?? Number.NaN
  }
]);

// src/experiments/chemical-effects-current/chemicalEffectsPhysics.ts
var FARADAY_CONSTANT = 96485.33212;
var PROPERTIES = {
  "copper-sulfate": {
    resistance: 5,
    molarMass: 0.063546,
    electrons: 2,
    deposits: true,
    cathode: "Copper metal, Cu(s)",
    anode: "Oxygen, O\u2082(g)"
  },
  "acidified-water": {
    resistance: 8,
    molarMass: 0,
    electrons: 2,
    deposits: false,
    cathode: "Hydrogen, H\u2082(g)",
    anode: "Oxygen, O\u2082(g)"
  },
  "sodium-chloride": {
    resistance: 6.2,
    molarMass: 0,
    electrons: 2,
    deposits: false,
    cathode: "Hydrogen, H\u2082(g)",
    anode: "Chlorine, Cl\u2082(g)"
  }
};
var clamp11 = (value, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : min;
function sanitizeChemicalEffectsInput(input2) {
  return {
    voltage: clamp11(input2.voltage, 0, 12),
    electrodeGap: clamp11(input2.electrodeGap, 0.01, 0.05),
    concentration: clamp11(input2.concentration, 0.25, 2),
    duration: clamp11(input2.duration, 0, 600),
    electrolyte: input2.electrolyte,
    polarityReversed: Boolean(input2.polarityReversed)
  };
}
function computeChemicalEffects(raw) {
  const input2 = sanitizeChemicalEffectsInput(raw);
  const properties = PROPERTIES[input2.electrolyte];
  const resistance = properties.resistance * (input2.electrodeGap / 0.03) / input2.concentration;
  const current = input2.voltage / resistance;
  const charge = current * input2.duration;
  const electronMoles = charge / FARADAY_CONSTANT;
  const cationEquivalentMoles = electronMoles / properties.electrons;
  const depositedMassKg = properties.deposits ? properties.molarMass * cationEquivalentMoles : 0;
  const cathodeGasMoles = input2.electrolyte === "copper-sulfate" ? 0 : electronMoles / 2;
  const anodeGasMoles = input2.electrolyte === "sodium-chloride" ? electronMoles / 2 : electronMoles / 4;
  const molarGasMl = 24450;
  const temperatureC = 25 + input2.voltage * current * input2.duration / 140;
  return {
    resistance,
    current,
    charge,
    depositedMassKg,
    depositedMassG: depositedMassKg * 1e3,
    electronMoles,
    cationEquivalentMoles,
    temperatureC,
    overheated: temperatureC > 42,
    cathodeProduct: properties.cathode,
    anodeProduct: properties.anode,
    cathodeGasMl: cathodeGasMoles * molarGasMl,
    anodeGasMl: anodeGasMoles * molarGasMl
  };
}

// src/experiments/chemical-effects-current/chemicalEffectsValidation.ts
var base4 = {
  voltage: 6,
  electrodeGap: 0.03,
  concentration: 1,
  duration: 300,
  electrolyte: "copper-sulfate",
  polarityReversed: false
};
var chemicalEffectsBenchmarks = runBenchmarkCases([
  {
    id: "electrolysis-ohm",
    name: "Current follows electrolyte resistance",
    input: base4,
    expected: 1.2,
    unit: "A",
    tolerance: 1e-12,
    actual: (input2) => computeChemicalEffects(input2).current
  },
  {
    id: "electrolysis-charge",
    name: "Charge equals current times duration",
    input: base4,
    expected: 360,
    unit: "C",
    tolerance: 1e-10,
    actual: (input2) => computeChemicalEffects(input2).charge
  },
  {
    id: "faraday-copper",
    name: "Copper mass follows MIt over nF",
    input: base4,
    expected: 0.063546 * 360 / (2 * FARADAY_CONSTANT),
    unit: "kg",
    tolerance: 1e-15,
    actual: (input2) => computeChemicalEffects(input2).depositedMassKg
  },
  {
    id: "faraday-time",
    name: "Doubling time doubles deposit",
    input: base4,
    expected: 2,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input2) => computeChemicalEffects({ ...input2, duration: 600 }).depositedMassKg / computeChemicalEffects(input2).depositedMassKg
  },
  {
    id: "reaction-water",
    name: "Water electrolysis has no solid deposit",
    input: { ...base4, electrolyte: "acidified-water" },
    expected: 0,
    unit: "kg",
    tolerance: 0,
    actual: (input2) => computeChemicalEffects(input2).depositedMassKg
  }
]);

// src/experiments/electric-power/electricPowerPhysics.ts
var APPLIANCES = {
  lamp: {
    label: "Living room lamp",
    ratedPower: 60,
    resistance: 230 ** 2 / 60
  },
  fan: { label: "Ceiling fan", ratedPower: 75, resistance: 230 ** 2 / 75 },
  kettle: {
    label: "Electric kettle",
    ratedPower: 2e3,
    resistance: 230 ** 2 / 2e3
  },
  heater: {
    label: "Room heater",
    ratedPower: 1500,
    resistance: 230 ** 2 / 1500
  },
  television: { label: "Television", ratedPower: 120, resistance: 230 ** 2 / 120 },
  refrigerator: { label: "Refrigerator", ratedPower: 180, resistance: 230 ** 2 / 180 },
  iron: { label: "Clothes iron", ratedPower: 1100, resistance: 230 ** 2 / 1100 }
};
var clamp12 = (v, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;
function sanitizeElectricPowerInput(input2) {
  return {
    voltage: clamp12(input2.voltage, 0, 240),
    resistance: clamp12(input2.resistance, 1, 1e3),
    operatingTimeHours: clamp12(input2.operatingTimeHours, 0, 24),
    appliance: input2.appliance,
    fuseLimit: clamp12(input2.fuseLimit, 1, 20),
    enabled: Boolean(input2.enabled)
  };
}
function computeElectricPower(raw) {
  const input2 = sanitizeElectricPowerInput(raw);
  const current = input2.enabled ? input2.voltage / input2.resistance : 0;
  const powerVI = input2.voltage * current;
  const powerI2R = current ** 2 * input2.resistance;
  const powerV2R = input2.enabled ? input2.voltage ** 2 / input2.resistance : 0;
  const energyJ = powerVI * input2.operatingTimeHours * 3600;
  return {
    current,
    powerVI,
    powerI2R,
    powerV2R,
    energyJ,
    energyKWh: energyJ / 36e5,
    heatJ: energyJ,
    overload: current > input2.fuseLimit
  };
}

// src/experiments/electric-power/electricPowerValidation.ts
var base5 = {
  voltage: 230,
  resistance: 46,
  operatingTimeHours: 2,
  appliance: "heater",
  fuseLimit: 10,
  enabled: true
};
var electricPowerBenchmarks = runBenchmarkCases([
  {
    id: "power-vi",
    name: "Power equals VI",
    input: base5,
    expected: 1150,
    unit: "W",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).powerVI
  },
  {
    id: "power-i2r",
    name: "Power equals I squared R",
    input: base5,
    expected: 1150,
    unit: "W",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).powerI2R
  },
  {
    id: "power-v2r",
    name: "Power equals V squared over R",
    input: base5,
    expected: 1150,
    unit: "W",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).powerV2R
  },
  {
    id: "energy-kwh",
    name: "Joules convert to kilowatt-hours",
    input: base5,
    expected: 2.3,
    unit: "kWh",
    tolerance: 1e-12,
    actual: (i) => computeElectricPower(i).energyKWh
  },
  {
    id: "overload",
    name: "Current above fuse limit trips overload",
    input: { ...base5, fuseLimit: 4 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => Number(computeElectricPower(i).overload)
  }
]);

// src/experiments/electrostatic-field-potential/electrostaticPhysics.ts
var COULOMB_CONSTANT = 89875517923e-1;
var clamp13 = (v, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : min;
function sanitizeElectrostaticInput(i) {
  return {
    charge1: clamp13(i.charge1, -2e-5, 2e-5),
    charge2: clamp13(i.charge2, -2e-5, 2e-5),
    separation: clamp13(i.separation, 0.2, 4),
    probeX: clamp13(i.probeX, -4, 4),
    probeY: clamp13(i.probeY, -3, 3),
    testCharge: clamp13(i.testCharge, -1e-5, 1e-5)
  };
}
function safeProbe(x, y, cx) {
  const dx = x - cx, dy = y, r = Math.hypot(dx, dy), minimum = 0.08;
  if (r >= minimum) return { x, y, blocked: false };
  const angle = r > 1e-9 ? Math.atan2(dy, dx) : Math.PI / 2;
  return {
    x: cx + minimum * Math.cos(angle),
    y: minimum * Math.sin(angle),
    blocked: true
  };
}
function fieldAndPotential(input2, x, y) {
  const sources2 = [
    { q: input2.charge1, x: -input2.separation / 2 },
    { q: input2.charge2, x: input2.separation / 2 }
  ];
  let ex = 0, ey = 0, potential = 0;
  for (const source of sources2) {
    const dx = x - source.x, dy = y, r = Math.max(0.08, Math.hypot(dx, dy));
    potential += COULOMB_CONSTANT * source.q / r;
    ex += COULOMB_CONSTANT * source.q * dx / r ** 3;
    ey += COULOMB_CONSTANT * source.q * dy / r ** 3;
  }
  return {
    fieldX: ex,
    fieldY: ey,
    fieldMagnitude: Math.hypot(ex, ey),
    potential
  };
}
function computeElectrostatic(raw) {
  const i = sanitizeElectrostaticInput(raw), p1 = safeProbe(i.probeX, i.probeY, -i.separation / 2), p2 = safeProbe(p1.x, p1.y, i.separation / 2), probe = { x: p2.x, y: p2.y, blocked: p1.blocked || p2.blocked }, local = fieldAndPotential(i, probe.x, probe.y), reference3 = fieldAndPotential(i, 0, 2.5).potential, potentialEnergyChange = i.testCharge * (local.potential - reference3);
  return {
    probeX: probe.x,
    probeY: probe.y,
    ...local,
    referencePotential: reference3,
    workByField: -potentialEnergyChange,
    potentialEnergyChange,
    singularityPrevented: probe.blocked
  };
}

// src/experiments/electrostatic-field-potential/electrostaticValidation.ts
var dipole = {
  charge1: 3e-6,
  charge2: -3e-6,
  separation: 2,
  probeX: 0,
  probeY: 1.5,
  testCharge: 1e-6
};
var electrostaticBenchmarks = runBenchmarkCases([
  {
    id: "dipole-zero-v",
    name: "Equal opposite charges have zero midpoint-plane potential",
    input: dipole,
    expected: 0,
    unit: "V",
    tolerance: 1e-9,
    actual: (i) => computeElectrostatic(i).potential
  },
  {
    id: "dipole-nonzero-e",
    name: "Dipole midpoint-plane field is nonzero",
    input: dipole,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (i) => Number(computeElectrostatic(i).fieldMagnitude > 0)
  },
  {
    id: "scalar-superposition",
    name: "Like charges add scalar potential",
    input: { ...dipole, charge2: 3e-6 },
    expected: 2 * 89875517923e-1 * 3e-6 / Math.hypot(1, 1.5),
    unit: "V",
    tolerance: 1e-9,
    actual: (i) => computeElectrostatic(i).potential
  },
  {
    id: "vector-cancel",
    name: "Like charges cancel horizontal field on bisector",
    input: { ...dipole, charge2: 3e-6 },
    expected: 0,
    unit: "N/C",
    tolerance: 1e-9,
    actual: (i) => computeElectrostatic(i).fieldX
  },
  {
    id: "negative-gradient",
    name: "Electric field equals negative potential gradient",
    input: dipole,
    expected: fieldAndPotential(dipole, 0, 1.5).fieldX,
    unit: "N/C",
    tolerance: 1,
    actual: (i) => {
      const h = 1e-5;
      return -(fieldAndPotential(i, h, 1.5).potential - fieldAndPotential(i, -h, 1.5).potential) / (2 * h);
    }
  }
]);

// src/experiments/emi-faraday/emi-faradaySimulation.ts
var FARADAY_AREA = 4e-3;
var FARADAY_SIGMA = 0.085;
var FARADAY_TRACK_LIMIT = 0.24;
var finite3 = (value, fallback) => Number.isFinite(value) ? value : fallback;
function normalizeFaradayInput(input2) {
  return {
    magnetStrength: Math.max(
      0.1,
      Math.min(1.2, finite3(input2.magnetStrength, 0.7))
    ),
    speed: Math.max(0, Math.min(2, finite3(input2.speed, 0.8))),
    turns: Math.round(Math.max(100, Math.min(1e3, finite3(input2.turns, 500)))),
    direction: input2.direction < 0 ? -1 : 1,
    resistance: Math.max(1, Math.min(50, finite3(input2.resistance, 10))),
    pole: input2.pole < 0 ? -1 : 1,
    position: Math.max(
      -FARADAY_TRACK_LIMIT,
      Math.min(
        FARADAY_TRACK_LIMIT,
        finite3(input2.position, -FARADAY_TRACK_LIMIT)
      )
    )
  };
}
function faradayFlux(position, magnetStrength, pole, area = FARADAY_AREA) {
  return pole * magnetStrength * area * Math.exp(-((position / FARADAY_SIGMA) ** 2));
}
function faradayFluxGradient(position, magnetStrength, pole, area = FARADAY_AREA) {
  const flux = faradayFlux(position, magnetStrength, pole, area);
  return -2 * position * flux / FARADAY_SIGMA ** 2;
}
function faradayEmf2(turns, fluxRate) {
  return -turns * fluxRate;
}
function computeFaraday(input2, moving = true) {
  const safe = normalizeFaradayInput(input2);
  const velocity = moving ? safe.direction * safe.speed : 0;
  const flux = faradayFlux(safe.position, safe.magnetStrength, safe.pole);
  const rawFluxRate = faradayFluxGradient(safe.position, safe.magnetStrength, safe.pole) * velocity;
  const fluxRate = Math.abs(rawFluxRate) < 1e-12 ? 0 : rawFluxRate;
  const rawEmf = faradayEmf2(safe.turns, fluxRate);
  const emf = Math.abs(rawEmf) < 1e-10 ? 0 : rawEmf;
  const current = emf / safe.resistance;
  const distance2 = Math.abs(safe.position);
  const phase = velocity === 0 ? "rest" : distance2 < 0.012 ? "centre" : distance2 > 0.19 ? "outside" : safe.position * velocity < 0 ? distance2 > 0.1 ? "approach" : "entry" : "withdrawal";
  const lenzDirection = Math.abs(current) < 1e-8 ? "none" : current > 0 ? "counter-clockwise" : "clockwise";
  return {
    flux,
    fluxRate,
    emf,
    current,
    velocity,
    phase,
    lenzDirection,
    opposingField: lenzDirection === "none" ? "none" : emf * safe.pole > 0 ? "right" : "left"
  };
}
var benchmarkInput = {
  magnetStrength: 0.7,
  speed: 0.8,
  turns: 500,
  direction: 1,
  resistance: 10,
  pole: 1,
  position: -0.06
};
var benchmarkResult = computeFaraday(benchmarkInput);
var emiFaradayBenchmarks = [
  {
    id: "faraday-sign",
    name: "epsilon equals negative N dPhi/dt",
    actual: faradayEmf2(500, 0.012),
    expected: -6,
    tolerance: 1e-9,
    unit: "V"
  },
  {
    id: "no-motion",
    name: "No motion gives zero emf",
    actual: computeFaraday(benchmarkInput, false).emf,
    expected: 0,
    tolerance: 1e-12,
    unit: "V"
  },
  {
    id: "centre",
    name: "Flux maximum has zero derivative",
    actual: computeFaraday({ ...benchmarkInput, position: 0 }).emf,
    expected: 0,
    tolerance: 1e-12,
    unit: "V"
  },
  {
    id: "reversal",
    name: "Opposite sides produce opposite emf",
    actual: benchmarkResult.emf + computeFaraday({ ...benchmarkInput, position: 0.06 }).emf,
    expected: 0,
    tolerance: 1e-9,
    unit: "V"
  },
  {
    id: "resistance",
    name: "Current equals emf over resistance",
    actual: benchmarkResult.current,
    expected: benchmarkResult.emf / 10,
    tolerance: 1e-12,
    unit: "A"
  }
];

// src/experiments/emi-faraday/emi-faradayValidation.ts
var emiFaradayBenchmarks2 = runBenchmarkCases(
  emiFaradayBenchmarks.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value) => value
  }))
);
var emiFaradayValidated = emiFaradayBenchmarks2.every(
  (item) => item.pass && approximatelyEqual(item.actual, item.expected, item.tolerance)
);

// src/experiments/heating-effect-current/heatingEffectPhysics.ts
var AMBIENT_TEMPERATURE = 25;
var THERMAL_CAPACITY = 42;
var LOSS_COEFFICIENT = 0.24;
var REFERENCE_DIAMETER_MM = 1;
var MATERIALS = {
  Nichrome: {
    resistanceFactor: 1,
    alpha: 4e-4,
    meltingPoint: 1400,
    color: "#c26b3a"
  },
  Copper: {
    resistanceFactor: 0.12,
    alpha: 393e-5,
    meltingPoint: 1085,
    color: "#d97732"
  },
  Iron: {
    resistanceFactor: 0.58,
    alpha: 5e-3,
    meltingPoint: 1538,
    color: "#8b9299"
  },
  Tungsten: {
    resistanceFactor: 0.78,
    alpha: 45e-4,
    meltingPoint: 3422,
    color: "#76727d"
  }
};
var DEFAULT_HEATING_INPUT = {
  current: 2,
  referenceResistance: 5,
  material: "Nichrome",
  diameter: 1,
  duration: 120
};
var INITIAL_HEATING_STATE = {
  elapsed: 0,
  temperature: AMBIENT_TEMPERATURE,
  inputEnergy: 0,
  heatLoss: 0
};
function normalizeHeatingInput(input2) {
  return {
    current: Math.max(
      0,
      Math.min(5, Number.isFinite(input2.current) ? input2.current : 2)
    ),
    referenceResistance: Math.max(
      0.5,
      Math.min(
        20,
        Number.isFinite(input2.referenceResistance) ? input2.referenceResistance : 5
      )
    ),
    material: input2.material in MATERIALS ? input2.material : "Nichrome",
    diameter: Math.max(
      0.2,
      Math.min(2, Number.isFinite(input2.diameter) ? input2.diameter : 1)
    ),
    duration: Math.round(
      Math.max(
        10,
        Math.min(300, Number.isFinite(input2.duration) ? input2.duration : 120)
      )
    )
  };
}
function resistanceAtTemperature(input2, temperature) {
  const safe = normalizeHeatingInput(input2);
  const material = MATERIALS[safe.material];
  const geometry = (REFERENCE_DIAMETER_MM / safe.diameter) ** 2;
  const temperatureFactor = Math.max(
    0.05,
    1 + material.alpha * (temperature - AMBIENT_TEMPERATURE)
  );
  return safe.referenceResistance * material.resistanceFactor * geometry * temperatureFactor;
}
function computeHeatingResult(input2, state) {
  const safe = normalizeHeatingInput(input2);
  const material = MATERIALS[safe.material];
  const effectiveResistance = resistanceAtTemperature(safe, state.temperature);
  const power = safe.current ** 2 * effectiveResistance;
  const storedHeat = THERMAL_CAPACITY * (state.temperature - AMBIENT_TEMPERATURE);
  const energyResidual = state.inputEnergy - state.heatLoss - storedHeat;
  const efficiency = state.inputEnergy > 0 ? storedHeat / state.inputEnergy : 0;
  const safeLimit = Math.min(120, material.meltingPoint - 20);
  const targetTemperature = Math.min(60, safeLimit - 10);
  const status = state.temperature >= material.meltingPoint ? "melted" : state.temperature >= safeLimit ? "unsafe" : Math.abs(state.temperature - targetTemperature) <= 2 ? "target" : state.temperature > AMBIENT_TEMPERATURE + 1 ? "warming" : "cool";
  return {
    effectiveResistance,
    power,
    storedHeat,
    energyResidual,
    efficiency,
    meltingPoint: material.meltingPoint,
    safeLimit,
    targetTemperature,
    status
  };
}
function advanceHeating(input2, state, deltaSeconds, powered) {
  const safe = normalizeHeatingInput(input2);
  const dt = Math.max(0, Math.min(5, deltaSeconds));
  const resistance = resistanceAtTemperature(safe, state.temperature);
  const power = powered ? safe.current ** 2 * resistance : 0;
  const loss = Math.max(
    0,
    LOSS_COEFFICIENT * (state.temperature - AMBIENT_TEMPERATURE)
  );
  const netPower = power - loss;
  const material = MATERIALS[safe.material];
  const unclampedTemperature = state.temperature + netPower * dt / THERMAL_CAPACITY;
  const effectiveDt = powered && netPower > 0 && unclampedTemperature > material.meltingPoint ? (material.meltingPoint - state.temperature) * THERMAL_CAPACITY / netPower : dt;
  const storedDelta = netPower * effectiveDt;
  const nextTemperature = Math.max(
    AMBIENT_TEMPERATURE,
    state.temperature + storedDelta / THERMAL_CAPACITY
  );
  return {
    elapsed: powered ? Math.min(safe.duration, state.elapsed + effectiveDt) : state.elapsed,
    temperature: nextTemperature,
    inputEnergy: state.inputEnergy + power * effectiveDt,
    heatLoss: state.heatLoss + loss * effectiveDt
  };
}

// src/experiments/heating-effect-current/heatingEffectValidation.ts
var heatingEffectBenchmarks = runBenchmarkCases([
  {
    id: "joule-law",
    name: "Electrical heat input equals I squared R t without loss",
    input: {
      ...DEFAULT_HEATING_INPUT,
      current: 2,
      referenceResistance: 5,
      duration: 10
    },
    expected: 200,
    unit: "J",
    tolerance: 1e-12,
    actual: ({ current, referenceResistance, duration }) => current ** 2 * referenceResistance * duration
  },
  {
    id: "diameter",
    name: "Halving diameter quadruples resistance",
    input: DEFAULT_HEATING_INPUT,
    expected: 4,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input2) => resistanceAtTemperature({ ...input2, diameter: 0.5 }, 25) / resistanceAtTemperature({ ...input2, diameter: 1 }, 25)
  },
  {
    id: "material",
    name: "Nichrome resistance exceeds copper for equal geometry",
    input: DEFAULT_HEATING_INPUT,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(
      resistanceAtTemperature({ ...input2, material: "Nichrome" }, 25) > resistanceAtTemperature({ ...input2, material: "Copper" }, 25)
    )
  },
  {
    id: "energy-balance",
    name: "Input equals stored heat plus thermal loss",
    input: DEFAULT_HEATING_INPUT,
    expected: 0,
    unit: "J",
    tolerance: 1e-9,
    actual: (input2) => {
      const state = advanceHeating(input2, INITIAL_HEATING_STATE, 1, true);
      return computeHeatingResult(input2, state).energyResidual;
    }
  },
  {
    id: "cooldown",
    name: "Switch off lowers an elevated temperature",
    input: DEFAULT_HEATING_INPUT,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => {
      const elevated = { ...INITIAL_HEATING_STATE, temperature: 80 };
      return Number(
        advanceHeating(input2, elevated, 1, false).temperature < elevated.temperature
      );
    }
  }
]);

// src/experiments/kirchhoff-circuit/kirchhoffPhysics.ts
var DEFAULT_KIRCHHOFF_INPUT = {
  source1: 12,
  source2: 9,
  resistance1: 220,
  resistance2: 330,
  sharedResistance: 560,
  resistance4: 270,
  resistance5: 470
};
function normalizeKirchhoffInput(input2) {
  const clamp24 = (value, min, max, fallback) => Math.max(min, Math.min(max, Number.isFinite(value) ? value : fallback));
  return {
    source1: clamp24(input2.source1, 0, 24, 12),
    source2: clamp24(input2.source2, 0, 24, 9),
    resistance1: clamp24(input2.resistance1, 10, 1e3, 220),
    resistance2: clamp24(input2.resistance2, 10, 1e3, 330),
    sharedResistance: clamp24(input2.sharedResistance, 10, 1e3, 560),
    resistance4: clamp24(input2.resistance4, 10, 1e3, 270),
    resistance5: clamp24(input2.resistance5, 10, 1e3, 470)
  };
}
function solveKirchhoff(input2) {
  const safe = normalizeKirchhoffInput(input2);
  const a = safe.resistance1 + safe.resistance2 + safe.sharedResistance;
  const d = safe.resistance4 + safe.resistance5 + safe.sharedResistance;
  const b = -safe.sharedResistance;
  const determinant = a * d - b * b;
  const mesh1 = (safe.source1 * d - b * safe.source2) / determinant;
  const mesh2 = (a * safe.source2 - b * safe.source1) / determinant;
  const sharedCurrent = mesh1 - mesh2;
  const kclResidual = mesh1 - mesh2 - sharedCurrent;
  const kvlLeftResidual = safe.source1 - mesh1 * (safe.resistance1 + safe.resistance2) - sharedCurrent * safe.sharedResistance;
  const kvlRightResidual = safe.source2 - mesh2 * (safe.resistance4 + safe.resistance5) + sharedCurrent * safe.sharedResistance;
  const sourcePower = safe.source1 * mesh1 + safe.source2 * mesh2;
  const resistorPower = mesh1 ** 2 * (safe.resistance1 + safe.resistance2) + mesh2 ** 2 * (safe.resistance4 + safe.resistance5) + sharedCurrent ** 2 * safe.sharedResistance;
  const balanceResistance5 = safe.source1 > 0 ? safe.source2 * (safe.resistance1 + safe.resistance2) / safe.source1 - safe.resistance4 : Number.POSITIVE_INFINITY;
  return {
    mesh1,
    mesh2,
    sharedCurrent,
    kclResidual,
    kvlLeftResidual,
    kvlRightResidual,
    determinant,
    sourcePower,
    resistorPower,
    powerResidual: sourcePower - resistorPower,
    balanceResistance5
  };
}

// src/experiments/kirchhoff-circuit/kirchhoffValidation.ts
var solved = solveKirchhoff(DEFAULT_KIRCHHOFF_INPUT);
var balanced = solveKirchhoff({
  ...DEFAULT_KIRCHHOFF_INPUT,
  resistance5: 142.5
});
var kirchhoffBenchmarks = runBenchmarkCases([
  {
    id: "kcl",
    name: "Junction current balance",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input2) => solveKirchhoff(input2).kclResidual
  },
  {
    id: "kvl-left",
    name: "Left loop voltage balance",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "V",
    tolerance: 1e-12,
    actual: (input2) => solveKirchhoff(input2).kvlLeftResidual
  },
  {
    id: "kvl-right",
    name: "Right loop voltage balance",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "V",
    tolerance: 1e-12,
    actual: (input2) => solveKirchhoff(input2).kvlRightResidual
  },
  {
    id: "power",
    name: "Source and resistor power agree",
    input: DEFAULT_KIRCHHOFF_INPUT,
    expected: 0,
    unit: "W",
    tolerance: 1e-12,
    actual: (input2) => solveKirchhoff(input2).powerResidual
  },
  {
    id: "balanced-bridge",
    name: "Balanced shared branch current is zero",
    input: { ...DEFAULT_KIRCHHOFF_INPUT, resistance5: 142.5 },
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input2) => solveKirchhoff(input2).sharedCurrent
  }
]);

// src/experiments/meter-bridge/meterBridgePhysics.ts
var DEFAULT_METER_BRIDGE_INPUT = {
  knownResistance: 15,
  unknownResistance: 23.4,
  wireLengthCm: 100,
  jockeyPositionCm: 62.4,
  supplyVoltage: 2
};
var clamp14 = (value, min, max) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
function normalizeMeterBridgeInput(input2) {
  const wireLengthCm = clamp14(input2.wireLengthCm, 50, 200);
  return {
    knownResistance: clamp14(input2.knownResistance, 1, 100),
    unknownResistance: clamp14(input2.unknownResistance, 1, 100),
    wireLengthCm,
    jockeyPositionCm: clamp14(input2.jockeyPositionCm, 0.5, wireLengthCm - 0.5),
    supplyVoltage: clamp14(input2.supplyVoltage, 0.5, 6)
  };
}
function solveMeterBridge(raw) {
  const input2 = normalizeMeterBridgeInput(raw);
  const endpointLimited = raw.jockeyPositionCm < 0.5 || raw.jockeyPositionCm > input2.wireLengthCm - 0.5;
  const resistancePerCm = 0.05;
  const leftWireResistance = input2.jockeyPositionCm * resistancePerCm;
  const rightWireResistance = (input2.wireLengthCm - input2.jockeyPositionCm) * resistancePerCm;
  const galvanometerResistance = 2e3;
  const a11 = 1 / input2.unknownResistance + 1 / input2.knownResistance + 1 / galvanometerResistance;
  const a22 = 1 / leftWireResistance + 1 / rightWireResistance + 1 / galvanometerResistance;
  const offDiagonal = -1 / galvanometerResistance;
  const b1 = input2.supplyVoltage / input2.unknownResistance;
  const b2 = input2.supplyVoltage / leftWireResistance;
  const determinant = a11 * a22 - offDiagonal * offDiagonal;
  const resistorJunctionPotential = (b1 * a22 - offDiagonal * b2) / determinant;
  const wireContactPotential = (a11 * b2 - offDiagonal * b1) / determinant;
  const galvanometerCurrent = (resistorJunctionPotential - wireContactPotential) / galvanometerResistance;
  const sourceCurrent = (input2.supplyVoltage - resistorJunctionPotential) / input2.unknownResistance + (input2.supplyVoltage - wireContactPotential) / leftWireResistance;
  const lengthRatio = input2.jockeyPositionCm / (input2.wireLengthCm - input2.jockeyPositionCm);
  const resistanceRatio = input2.unknownResistance / input2.knownResistance;
  const balancePositionCm = input2.wireLengthCm * input2.unknownResistance / (input2.knownResistance + input2.unknownResistance);
  return {
    leftWireResistance,
    rightWireResistance,
    resistorJunctionPotential,
    wireContactPotential,
    galvanometerCurrent,
    galvanometerMicroamps: galvanometerCurrent * 1e6,
    sourceCurrent,
    lengthRatio,
    resistanceRatio,
    calculatedUnknown: input2.knownResistance * lengthRatio,
    balancePositionCm,
    nullErrorCm: input2.jockeyPositionCm - balancePositionCm,
    endpointLimited
  };
}

// src/experiments/meter-bridge/meterBridgeValidation.ts
var exactBalance = {
  ...DEFAULT_METER_BRIDGE_INPUT,
  jockeyPositionCm: 100 * DEFAULT_METER_BRIDGE_INPUT.unknownResistance / (DEFAULT_METER_BRIDGE_INPUT.knownResistance + DEFAULT_METER_BRIDGE_INPUT.unknownResistance)
};
var meterBridgeBenchmarks = runBenchmarkCases([
  {
    id: "meter-ratio",
    name: "X/R equals l/(L-l) at balance",
    input: exactBalance,
    expected: DEFAULT_METER_BRIDGE_INPUT.unknownResistance / DEFAULT_METER_BRIDGE_INPUT.knownResistance,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input2) => solveMeterBridge(input2).lengthRatio
  },
  {
    id: "meter-null",
    name: "Galvanometer current is zero at balance",
    input: exactBalance,
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input2) => solveMeterBridge(input2).galvanometerCurrent
  },
  {
    id: "meter-positive-sign",
    name: "Contact left of balance gives negative current",
    input: { ...DEFAULT_METER_BRIDGE_INPUT, jockeyPositionCm: 40 },
    expected: 1,
    unit: "sign",
    tolerance: 0,
    actual: (input2) => Number(solveMeterBridge(input2).galvanometerCurrent < 0)
  },
  {
    id: "meter-negative-sign",
    name: "Contact right of balance gives positive current",
    input: { ...DEFAULT_METER_BRIDGE_INPUT, jockeyPositionCm: 80 },
    expected: 1,
    unit: "sign",
    tolerance: 0,
    actual: (input2) => Number(solveMeterBridge(input2).galvanometerCurrent > 0)
  },
  {
    id: "meter-endpoint-guard",
    name: "Endpoint position is clamped away from zero length",
    input: { ...DEFAULT_METER_BRIDGE_INPUT, jockeyPositionCm: 0 },
    expected: 0.5,
    unit: "cm",
    tolerance: 0,
    actual: (input2) => solveMeterBridge(input2).leftWireResistance / 0.05
  }
]);

// src/experiments/ohms-law/ohmsLawPhysics.ts
var materials = {
  copper: {
    label: "Copper",
    factor: 0.35,
    alpha: 393e-5,
    nonlinear: 0,
    ohmic: true
  },
  nichrome: {
    label: "Nichrome",
    factor: 1,
    alpha: 4e-4,
    nonlinear: 0,
    ohmic: true
  },
  carbon: {
    label: "Carbon",
    factor: 1.35,
    alpha: -5e-4,
    nonlinear: 0,
    ohmic: true
  },
  filament: {
    label: "Tungsten lamp",
    factor: 0.55,
    alpha: 45e-4,
    nonlinear: 0.035,
    ohmic: false
  }
};
var DEFAULT_OHMS_INPUT = {
  voltage: 6,
  resistance: 11,
  material: "nichrome",
  temperature: 20
};
function solveOhms(input2) {
  const m = materials[input2.material];
  const coldResistance = Math.max(
    0.1,
    input2.resistance * m.factor * (1 + m.alpha * (input2.temperature - 20))
  );
  const effectiveResistance = coldResistance * (1 + m.nonlinear * input2.voltage * input2.voltage);
  const current = input2.voltage / effectiveResistance;
  return {
    current,
    effectiveResistance,
    power: input2.voltage * current,
    ohmic: m.ohmic,
    materialLabel: m.label,
    alpha: m.alpha
  };
}

// src/experiments/ohms-law/ohmsLawValidation.ts
var ohmsLawBenchmarks = runBenchmarkCases([
  {
    id: "ohm-vir",
    name: "V equals I R",
    input: DEFAULT_OHMS_INPUT,
    expected: 6,
    unit: "V",
    tolerance: 1e-12,
    actual: (i) => {
      const s = solveOhms(i);
      return s.current * s.effectiveResistance;
    }
  },
  {
    id: "ohm-slope",
    name: "V-I slope equals resistance",
    input: { ...DEFAULT_OHMS_INPUT, voltage: 10 },
    expected: 11,
    unit: "\u03A9",
    tolerance: 1e-12,
    actual: (i) => i.voltage / solveOhms(i).current
  },
  {
    id: "ohm-temp",
    name: "Positive coefficient raises resistance",
    input: { ...DEFAULT_OHMS_INPUT, temperature: 120 },
    expected: 1,
    unit: "trend",
    tolerance: 0,
    actual: (i) => Number(
      solveOhms(i).effectiveResistance > solveOhms({ ...i, temperature: 20 }).effectiveResistance
    )
  },
  {
    id: "ohm-nonohmic",
    name: "Filament resistance rises with voltage",
    input: {
      ...DEFAULT_OHMS_INPUT,
      material: "filament",
      voltage: 12
    },
    expected: 1,
    unit: "trend",
    tolerance: 0,
    actual: (i) => Number(
      solveOhms(i).effectiveResistance > solveOhms({ ...i, voltage: 2 }).effectiveResistance
    )
  },
  {
    id: "ohm-origin",
    name: "Zero voltage gives zero current",
    input: { ...DEFAULT_OHMS_INPUT, voltage: 0 },
    expected: 0,
    unit: "A",
    tolerance: 0,
    actual: (i) => solveOhms(i).current
  }
]);

// src/experiments/series-parallel-resistance/seriesParallelPhysics.ts
var DEFAULT_NETWORK_INPUT = {
  voltage: 12,
  resistors: [2, 3, 6],
  switches: [true, true, true],
  topology: "series"
};
function solveNetwork(input2) {
  const active = input2.resistors.map((resistance, index) => ({ resistance, index })).filter(({ index }) => input2.switches[index]);
  const equivalentResistance = active.length === 0 ? Infinity : input2.topology === "series" ? active.reduce((sum, item) => sum + item.resistance, 0) : 1 / active.reduce((sum, item) => sum + 1 / item.resistance, 0);
  const totalCurrent = Number.isFinite(equivalentResistance) ? input2.voltage / equivalentResistance : 0;
  const branchCurrents = input2.resistors.map(
    (resistance, index) => !input2.switches[index] ? 0 : input2.topology === "series" ? totalCurrent : input2.voltage / resistance
  );
  const voltageDrops = input2.resistors.map(
    (resistance, index) => !input2.switches[index] ? 0 : input2.topology === "series" ? totalCurrent * resistance : input2.voltage
  );
  const resistorPower = input2.resistors.reduce(
    (sum, resistance, index) => sum + branchCurrents[index] ** 2 * resistance,
    0
  );
  return {
    equivalentResistance,
    totalCurrent,
    branchCurrents,
    voltageDrops,
    sourcePower: input2.voltage * totalCurrent,
    resistorPower,
    kclResidual: input2.topology === "parallel" ? totalCurrent - branchCurrents.reduce((sum, current) => sum + current, 0) : 0,
    powerResidual: input2.voltage * totalCurrent - resistorPower,
    activeCount: active.length
  };
}

// src/experiments/series-parallel-resistance/seriesParallelValidation.ts
var seriesParallelBenchmarks = runBenchmarkCases([
  {
    id: "series-sum",
    name: "Series resistances add",
    input: DEFAULT_NETWORK_INPUT,
    expected: 11,
    unit: "\u03A9",
    tolerance: 1e-12,
    actual: (input2) => solveNetwork(input2).equivalentResistance
  },
  {
    id: "parallel-reciprocal",
    name: "Parallel reciprocal rule",
    input: { ...DEFAULT_NETWORK_INPUT, topology: "parallel" },
    expected: 1,
    unit: "\u03A9",
    tolerance: 1e-12,
    actual: (input2) => solveNetwork(input2).equivalentResistance
  },
  {
    id: "parallel-kcl",
    name: "Parallel branch currents satisfy KCL",
    input: { ...DEFAULT_NETWORK_INPUT, topology: "parallel" },
    expected: 0,
    unit: "A",
    tolerance: 1e-12,
    actual: (input2) => solveNetwork(input2).kclResidual
  },
  {
    id: "series-power",
    name: "Series power is conserved",
    input: DEFAULT_NETWORK_INPUT,
    expected: 0,
    unit: "W",
    tolerance: 1e-12,
    actual: (input2) => solveNetwork(input2).powerResidual
  },
  {
    id: "parallel-power",
    name: "Parallel power is conserved",
    input: { ...DEFAULT_NETWORK_INPUT, topology: "parallel" },
    expected: 0,
    unit: "W",
    tolerance: 1e-12,
    actual: (input2) => solveNetwork(input2).powerResidual
  }
]);

// src/experiments/static-electricity/staticElectricityPhysics.ts
var ELECTRON_CHARGE = 1602176634e-28;
var COULOMB_CONSTANT2 = 89875517923e-1;
var AIR_BREAKDOWN_FIELD = 3e6;
var materialPairs = {
  "pvc-wool": { negative: "PVC", positive: "Wool", strength: 1 },
  "glass-silk": { negative: "Silk", positive: "Glass", strength: 0.75 },
  "balloon-hair": { negative: "Balloon", positive: "Hair", strength: 0.6 }
};
function coulombInteraction(q1, q2, distance2) {
  const force = COULOMB_CONSTANT2 * Math.abs(q1 * q2) / Math.max(distance2, 1e-3) ** 2;
  const interaction = q1 === 0 || q2 === 0 ? "none" : q1 * q2 < 0 ? "attraction" : "repulsion";
  return { force, interaction };
}
function solveStaticElectricity(input2) {
  const pair = materialPairs[input2.pair];
  const packets = Math.round(
    Math.max(0, Math.min(100, input2.rubbing)) / 4 * pair.strength
  );
  const magnitude2 = packets * 5e-8;
  const negativeCharge = -magnitude2;
  const positiveCharge = magnitude2;
  const { force, interaction } = coulombInteraction(
    negativeCharge,
    positiveCharge,
    input2.separation
  );
  const electricField = COULOMB_CONSTANT2 * magnitude2 / Math.max(input2.separation, 0.05) ** 2;
  return {
    packets,
    transferredElectrons: magnitude2 / ELECTRON_CHARGE,
    negativeCharge,
    positiveCharge,
    totalCharge: negativeCharge + positiveCharge,
    force,
    interaction,
    electricField,
    lightning: !input2.grounded && electricField >= AIR_BREAKDOWN_FIELD
  };
}

// src/experiments/static-electricity/staticElectricityValidation.ts
var standard = {
  pair: "pvc-wool",
  rubbing: 80,
  grounded: false,
  separation: 0.5
};
var staticElectricityBenchmarks = runBenchmarkCases([
  {
    id: "electron-transfer",
    name: "Transferred charge is an integer electron count",
    input: standard,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(
      Number.isInteger(
        Math.round(solveStaticElectricity(input2).transferredElectrons)
      ) && ELECTRON_CHARGE > 0
    )
  },
  {
    id: "charge-conservation",
    name: "Friction conserves total charge",
    input: standard,
    expected: 0,
    unit: "C",
    tolerance: 1e-18,
    actual: (input2) => solveStaticElectricity(input2).totalCharge
  },
  {
    id: "unlike-attract",
    name: "Opposite charges attract",
    input: standard,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (input2) => Number(solveStaticElectricity(input2).interaction === "attraction")
  },
  {
    id: "like-repel",
    name: "Like charges repel",
    input: standard,
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () => Number(coulombInteraction(1e-6, 2e-6, 1).interaction === "repulsion")
  },
  {
    id: "inverse-square",
    name: "Doubling separation quarters force",
    input: standard,
    expected: 4,
    unit: "ratio",
    tolerance: 1e-12,
    actual: (input2) => solveStaticElectricity({ ...input2, separation: 0.5 }).force / solveStaticElectricity({ ...input2, separation: 1 }).force
  }
]);

// src/experiments/transformer-lab/transformerPhysics.ts
var coreMaterials = {
  "silicon-steel": {
    label: "Grain-oriented silicon steel",
    coupling: 0.992,
    lossFactor: 1
  },
  ferrite: { label: "Ferrite core", coupling: 0.985, lossFactor: 0.58 },
  air: { label: "Air core (weak coupling)", coupling: 0.32, lossFactor: 0.08 }
};
var clamp15 = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
function idealSecondaryVoltage(primaryVoltage, primaryTurns, secondaryTurns) {
  if (primaryTurns <= 0) return 0;
  return primaryVoltage * (secondaryTurns / primaryTurns);
}
function solveTransformer(input2) {
  const primaryVoltage = clamp15(input2.primaryVoltage, 0, 240);
  const frequency = clamp15(input2.frequency, 20, 100);
  const primaryTurns = clamp15(input2.primaryTurns, 50, 1200);
  const secondaryTurns = clamp15(input2.secondaryTurns, 20, 1200);
  const loadResistance = clamp15(input2.loadResistance, 5, 500);
  const core = coreMaterials[input2.coreMaterial];
  const turnsRatio = secondaryTurns / primaryTurns;
  const inducedSecondaryVoltage = idealSecondaryVoltage(
    primaryVoltage,
    primaryTurns,
    secondaryTurns
  );
  const secondaryResistance = secondaryTurns * 12e-4;
  const coupledVoltage = inducedSecondaryVoltage * core.coupling;
  const terminalVoltage = coupledVoltage * (loadResistance / (loadResistance + secondaryResistance));
  const secondaryCurrent = terminalVoltage / loadResistance;
  const outputPower = terminalVoltage * secondaryCurrent;
  const secondaryCopperLoss = secondaryCurrent ** 2 * secondaryResistance;
  const coreLoss = input2.coreMaterial === "air" ? 0 : core.lossFactor * 0.9 * (frequency / 50) ** 1.55 * (primaryVoltage / 230) ** 2 * (920 / primaryTurns) ** 0.35;
  const transferredPower = outputPower + secondaryCopperLoss;
  const magnetizingCurrent = primaryVoltage === 0 ? 0 : 0.012 * (primaryVoltage / 230) * (50 / frequency) / Math.max(core.coupling, 0.25);
  const idealPrimaryCurrent = primaryVoltage === 0 ? 0 : transferredPower / primaryVoltage;
  const primaryResistance = primaryTurns * 1e-3;
  const primaryCopperLoss = (idealPrimaryCurrent ** 2 + magnetizingCurrent ** 2) * primaryResistance;
  const copperLoss = secondaryCopperLoss + primaryCopperLoss;
  const totalLoss = coreLoss + copperLoss;
  const inputPower = outputPower + totalLoss;
  const primaryCurrent = primaryVoltage === 0 ? 0 : inputPower / primaryVoltage;
  const efficiency = inputPower === 0 ? 0 : outputPower / inputPower * 100;
  const peakFluxMilliWeber = frequency === 0 || primaryTurns === 0 ? 0 : primaryVoltage / (4.44 * frequency * primaryTurns) * 1e3;
  return {
    turnsRatio,
    inducedSecondaryVoltage,
    terminalVoltage,
    primaryCurrent,
    secondaryCurrent,
    inputPower,
    outputPower,
    coreLoss,
    copperLoss,
    totalLoss,
    efficiency,
    primaryFrequency: frequency,
    secondaryFrequency: frequency,
    peakFluxMilliWeber,
    classification: Math.abs(turnsRatio - 1) < 1e-3 ? "isolation" : turnsRatio > 1 ? "step-up" : "step-down"
  };
}

// src/experiments/transformer-lab/transformerValidation.ts
var ideal = solveTransformer({
  primaryVoltage: 230,
  frequency: 50,
  primaryTurns: 920,
  secondaryTurns: 48,
  loadResistance: 24,
  coreMaterial: "silicon-steel"
});
var transformerBenchmarks = runBenchmarkCases([
  {
    id: "turns-ratio",
    name: "230 V across 920:48 turns induces 12 V",
    input: ideal.inducedSecondaryVoltage,
    expected: 12,
    actual: (value) => value,
    tolerance: 1e-12,
    unit: "V"
  },
  {
    id: "frequency-equality",
    name: "Secondary frequency equals primary frequency",
    input: ideal.secondaryFrequency,
    expected: 50,
    actual: (value) => value,
    tolerance: 0,
    unit: "Hz"
  },
  {
    id: "power-accounting",
    name: "Input equals output plus core and copper losses",
    input: ideal.inputPower - ideal.outputPower - ideal.totalLoss,
    expected: 0,
    actual: (value) => value,
    tolerance: 1e-12,
    unit: "W"
  },
  {
    id: "current-ratio-ideal",
    name: "Ideal current ratio is reciprocal of turns ratio",
    input: 48 / 920 * (920 / 48),
    expected: 1,
    actual: (value) => value,
    tolerance: 1e-12,
    unit: "ratio"
  },
  {
    id: "flux-faraday",
    name: "230 V, 50 Hz, 920 turns gives 1.126 mWb peak flux",
    input: ideal.peakFluxMilliWeber,
    expected: 230 / (4.44 * 50 * 920) * 1e3,
    actual: (value) => value,
    tolerance: 1e-12,
    unit: "mWb"
  }
]);

// src/experiments/logic-gates/logicGatesPhysics.ts
function evaluateGate(gate, a, b) {
  if (a === null || gate !== "NOT" && b === null) return null;
  if (gate === "NOT") return a === 1 ? 0 : 1;
  const right = b;
  if (gate === "AND") return a & right;
  if (gate === "OR") return a | right;
  if (gate === "NAND") return Number(!(a & right));
  if (gate === "NOR") return Number(!(a | right));
  if (gate === "XOR") return a ^ right;
  return Number(!(a ^ right));
}
function truthTable(gate) {
  if (gate === "NOT") return [0, 1].map((a) => ({ a, b: null, y: evaluateGate(gate, a, null) }));
  return [0, 1].flatMap((a) => [0, 1].map((b) => ({ a, b, y: evaluateGate(gate, a, b) })));
}
function nandXor(a, b) {
  const n1 = evaluateGate("NAND", a, b);
  const n2 = evaluateGate("NAND", a, n1);
  const n3 = evaluateGate("NAND", b, n1);
  return evaluateGate("NAND", n2, n3);
}
var hasInversionBubble = (gate) => gate === "NOT" || gate === "NAND" || gate === "NOR" || gate === "XNOR";

// src/experiments/logic-gates/logicGatesValidation.ts
var logicGatesBenchmarks = runBenchmarkCases([
  { id: "and-table", name: "AND truth table", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(truthTable("AND").map((row) => row.y).join("") === "0001") },
  { id: "xor-table", name: "XOR truth table", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(truthTable("XOR").map((row) => row.y).join("") === "0110") },
  { id: "nand-xor", name: "Four NAND gates implement XOR", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number([[0, 0], [0, 1], [1, 0], [1, 1]].every(([a, b]) => nandXor(a, b) === (a ^ b))) },
  { id: "floating-input", name: "Floating input yields unknown", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(evaluateGate("AND", 1, null) === null) },
  { id: "inversion-bubbles", name: "Inverting gate families have output bubbles", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(["NOT", "NAND", "NOR", "XNOR"].every(hasInversionBubble) && !hasInversionBubble("AND")) }
]);

// src/experiments/semiconductor-diode/diodePhysics.ts
var clamp16 = (v, min, max) => Math.min(max, Math.max(min, v));
function solveJunction(input2) {
  const temperatureK = clamp16(input2.temperatureC, -20, 125) + 273.15;
  const thermalVoltage = 8617333262e-14 * temperatureK;
  const doping = clamp16(input2.dopingFactor, 0.5, 2);
  const saturationCurrent = 5e-9 / doping * Math.exp((temperatureK - 298.15) / 24);
  const ideality = 2;
  const exponent = clamp16(input2.biasVoltage / (ideality * thermalVoltage), -50, 18);
  const current = saturationCurrent * (Math.exp(exponent) - 1);
  const barrierPotential = clamp16(0.7 - 2e-3 * (input2.temperatureC - 25) + 0.025 * Math.log(doping), 0.35, 0.9);
  const effectiveBarrier = Math.max(0.015, barrierPotential - input2.biasVoltage);
  const depletionWidthMicron = clamp16(0.58 * Math.sqrt(effectiveBarrier / barrierPotential) / Math.sqrt(doping), 0.07, 1.4);
  return { thermalVoltage, saturationCurrent, current, barrierPotential, depletionWidthMicron, bias: Math.abs(input2.biasVoltage) < 5e-3 ? "equilibrium" : input2.biasVoltage > 0 ? "forward" : "reverse" };
}
function solveRectifier(input2) {
  const junction = solveJunction(input2);
  const diodeDrop = junction.barrierPotential;
  const diodeCount = input2.rectifierMode === "full-wave" ? 2 : 1;
  const peakOutput = Math.max(0, input2.acAmplitude - diodeCount * diodeDrop);
  const rippleFrequency = input2.acFrequency * (input2.rectifierMode === "full-wave" ? 2 : 1);
  const resistance = clamp16(input2.loadResistance, 100, 5e3);
  const capacitance = Math.max(0, input2.capacitanceMicroF) * 1e-6;
  let dcVoltage;
  let ripplePeakToPeak;
  if (capacitance === 0) {
    dcVoltage = input2.rectifierMode === "full-wave" ? 2 * peakOutput / Math.PI : peakOutput / Math.PI;
    ripplePeakToPeak = peakOutput;
  } else {
    dcVoltage = peakOutput;
    for (let i = 0; i < 3; i += 1) {
      const current = dcVoltage / resistance;
      ripplePeakToPeak = current / (rippleFrequency * capacitance);
      dcVoltage = Math.max(0, peakOutput - ripplePeakToPeak / 2);
    }
    ripplePeakToPeak = dcVoltage / resistance / (rippleFrequency * capacitance);
  }
  const loadCurrent = dcVoltage / resistance;
  const ripplePercent = dcVoltage === 0 ? 0 : ripplePeakToPeak / dcVoltage * 100;
  const peakInverseVoltage = input2.rectifierMode === "full-wave" ? input2.acAmplitude : 2 * input2.acAmplitude;
  const peakDiodeCurrent = loadCurrent + (capacitance > 0 ? ripplePeakToPeak * rippleFrequency * capacitance : 0);
  return { rippleFrequency, diodeDrop, peakOutput, dcVoltage, loadCurrent, ripplePeakToPeak, ripplePercent, peakInverseVoltage, peakDiodeCurrent, safe: peakInverseVoltage <= 1e3 && peakDiodeCurrent <= 1 };
}

// src/experiments/semiconductor-diode/diodeValidation.ts
var base6 = { biasVoltage: 0.7, dopingFactor: 1, temperatureC: 25, acAmplitude: 18, acFrequency: 50, loadResistance: 1e3, capacitanceMicroF: 1e3, rectifierMode: "full-wave" };
var diodeBenchmarks = runBenchmarkCases([
  { id: "forward-exponential", name: "Forward current rises exponentially", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(solveJunction({ ...base6, biasVoltage: 0.7 }).current / solveJunction({ ...base6, biasVoltage: 0.6 }).current > 5) },
  { id: "reverse-leakage", name: "Reverse current approaches negative saturation current", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => {
    const j = solveJunction({ ...base6, biasVoltage: -2 });
    return Number(Math.abs(j.current + j.saturationCurrent) < 1e-18);
  } },
  { id: "polarity-width", name: "Forward narrows and reverse widens depletion layer", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(solveJunction({ ...base6, biasVoltage: 0.5 }).depletionWidthMicron < solveJunction({ ...base6, biasVoltage: -2 }).depletionWidthMicron) },
  { id: "full-wave-frequency", name: "Full-wave ripple frequency is twice source frequency", input: 0, expected: 100, unit: "Hz", tolerance: 0, actual: () => solveRectifier(base6).rippleFrequency },
  { id: "capacitance-ripple", name: "Larger filter capacitance reduces ripple", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(solveRectifier({ ...base6, capacitanceMicroF: 1e3 }).ripplePeakToPeak < solveRectifier({ ...base6, capacitanceMicroF: 100 }).ripplePeakToPeak) }
]);

// src/experiments/sources-of-energy/energyGridPhysics.ts
var sources = ["solar", "wind", "hydro", "gas", "coal", "nuclear"];
var emissionFactors = { solar: 45, wind: 12, hydro: 24, gas: 490, coal: 820, nuclear: 12 };
var variableCosts = { solar: 32, wind: 36, hydro: 48, gas: 92, coal: 105, nuclear: 58 };
var clamp17 = (v, min, max) => Math.min(max, Math.max(min, v));
function demandAt(hour, scale5) {
  const morning = 2.8 * Math.exp(-(((hour - 8) / 3) ** 2));
  const evening = 5.2 * Math.exp(-(((hour - 19) / 3.2) ** 2));
  return (8.5 + morning + evening) * scale5 / 100;
}
function renewableFactors(hour, weather) {
  const daylight = Math.max(0, Math.sin(Math.PI * (hour - 6) / 12));
  const weatherSolar = { clear: 1, cloudy: 0.42, storm: 0.16 }[weather];
  const weatherWind = { clear: 0.48, cloudy: 0.65, storm: 0.9 }[weather];
  const wind = clamp17(weatherWind + 0.12 * Math.sin(hour * 0.72 + 1.2), 0.1, 0.95);
  const hydro = { clear: 0.62, cloudy: 0.68, storm: 0.82 }[weather];
  return { solar: daylight * weatherSolar, wind, hydro };
}
function simulateDay(input2) {
  const eta = Math.sqrt(0.9);
  let soc = clamp17(input2.storageCapacity * 0.5, 0, input2.storageCapacity);
  const hours = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const factors = renewableFactors(hour + 0.5, input2.weather);
    const demand = demandAt(hour + 0.5, input2.demandScale);
    const outputs = { solar: input2.capacities.solar * factors.solar, wind: input2.capacities.wind * factors.wind, hydro: input2.capacities.hydro * factors.hydro, gas: 0, coal: 0, nuclear: input2.capacities.nuclear * 0.9 };
    let available = outputs.solar + outputs.wind + outputs.hydro + outputs.nuclear;
    let charge = 0, discharge = 0, loss = 0, unmet = 0;
    if (available > demand) {
      const surplus = available - demand;
      charge = Math.min(surplus, input2.storagePower, (input2.storageCapacity - soc) / eta);
      soc += charge * eta;
      loss += charge * (1 - eta);
      let curtailment = surplus - charge;
      for (const source of ["solar", "wind", "hydro"]) {
        const reduction = Math.min(curtailment, outputs[source]);
        outputs[source] -= reduction;
        curtailment -= reduction;
      }
    } else {
      let deficit = demand - available;
      const deliverable = Math.min(input2.storagePower, soc * eta);
      discharge = Math.min(deficit, deliverable);
      soc -= discharge / eta;
      loss += discharge * (1 / eta - 1);
      deficit -= discharge;
      outputs.gas = Math.min(deficit, input2.capacities.gas * 0.85);
      deficit -= outputs.gas;
      outputs.coal = Math.min(deficit, input2.capacities.coal * 0.8);
      deficit -= outputs.coal;
      unmet = Math.max(0, deficit);
    }
    const emissionsTonnes2 = sources.reduce((sum, s) => sum + outputs[s] * emissionFactors[s], 0);
    const costDollars = sources.reduce((sum, s) => sum + outputs[s] * 1e3 * variableCosts[s], 0);
    hours.push({ hour, demand, outputs, charge, discharge, unmet, stateOfCharge: soc, loss, emissionsTonnes: emissionsTonnes2, costDollars });
  }
  const demandEnergy = hours.reduce((s, h) => s + h.demand, 0);
  const unmetEnergy = hours.reduce((s, h) => s + h.unmet, 0);
  const servedEnergy = demandEnergy - unmetEnergy;
  const generationEnergy = hours.reduce((sum, h) => sum + sources.reduce((s, k) => s + h.outputs[k], 0), 0);
  const storageLoss = hours.reduce((s, h) => s + h.loss, 0);
  const emissionsTonnes = hours.reduce((s, h) => s + h.emissionsTonnes, 0);
  const totalCost = hours.reduce((s, h) => s + h.costDollars, 0);
  const renewableEnergy = hours.reduce((sum, h) => sum + h.outputs.solar + h.outputs.wind + h.outputs.hydro, 0);
  const balanceResidual = hours.reduce((sum, h) => sum + sources.reduce((s, k) => s + h.outputs[k], 0) + h.discharge + h.unmet - h.demand - h.charge, 0);
  return { hours, demandEnergy, servedEnergy, unmetEnergy, generationEnergy, storageLoss, reliability: demandEnergy ? servedEnergy / demandEnergy * 100 : 100, emissionsTonnes, emissionsIntensity: servedEnergy ? emissionsTonnes / servedEnergy : 0, averageCost: servedEnergy ? totalCost / (servedEnergy * 1e3) : 0, renewableShare: generationEnergy ? renewableEnergy / generationEnergy * 100 : 0, balanceResidual };
}

// src/experiments/sources-of-energy/energyGridValidation.ts
var base7 = { capacities: { solar: 8, wind: 8, hydro: 4, gas: 4, coal: 0, nuclear: 3 }, demandScale: 100, weather: "clear", storageCapacity: 12, storagePower: 3, reliabilityTarget: 99.5 };
var energyGridBenchmarks = runBenchmarkCases([
  { id: "balance", name: "Hourly energy balance closes", input: 0, expected: 0, unit: "GWh", tolerance: 1e-10, actual: () => simulateDay(base7).balanceResidual },
  { id: "storage-loss", name: "Storage round trip loses energy", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(simulateDay(base7).storageLoss > 0) },
  { id: "solar-night", name: "Solar output is zero at midnight", input: 0, expected: 0, unit: "factor", tolerance: 0, actual: () => simulateDay(base7).hours[0].outputs.solar },
  { id: "demand-peak", name: "Evening demand exceeds noon demand", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(demandAt(19, 100) > demandAt(12, 100)) },
  { id: "intermittency", name: "Clouds reduce daily solar energy", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => Number(simulateDay({ ...base7, weather: "cloudy" }).hours.reduce((s, h) => s + h.outputs.solar, 0) < simulateDay(base7).hours.reduce((s, h) => s + h.outputs.solar, 0)) }
]);

// src/experiments/bernoulli-fluid-flow/bernoulliPhysics.ts
var G3 = 9.80665;
var WATER_VAPOR_PRESSURE_KPA = 2.34;
function solveBernoulli(input2) {
  const q = input2.flowRateLps / 1e3;
  const rho = input2.density;
  const radii = [input2.radius1Mm, input2.radius2Mm, input2.radius3Mm].map((r) => r / 1e3);
  const elevations = [input2.elevation1, input2.elevation2, input2.elevation3];
  const areas = radii.map((r) => Math.PI * r * r);
  const velocities = areas.map((a) => q / a);
  const constant = input2.inletPressureKPa * 1e3 + 0.5 * rho * velocities[0] ** 2 + rho * G3 * elevations[0];
  const stations = areas.map((area, i) => {
    const velocity = velocities[i];
    const pressurePa = constant - 0.5 * rho * velocity ** 2 - rho * G3 * elevations[i];
    return { area, velocity, pressurePa, elevation: elevations[i], flowCheck: area * velocity, staticHead: pressurePa, velocityHead: 0.5 * rho * velocity ** 2, elevationHead: rho * G3 * elevations[i], totalEnergyPa: pressurePa + 0.5 * rho * velocity ** 2 + rho * G3 * elevations[i] };
  });
  const totals = stations.map((s) => s.totalEnergyPa);
  const minimumPressureKPa = Math.min(...stations.map((s) => s.pressurePa)) / 1e3;
  return { stations, energyResidual: Math.max(...totals) - Math.min(...totals), continuityResidual: Math.max(...stations.map((s) => s.flowCheck)) - Math.min(...stations.map((s) => s.flowCheck)), minimumPressureKPa, cavitation: minimumPressureKPa <= WATER_VAPOR_PRESSURE_KPA, safetyMarginKPa: minimumPressureKPa - WATER_VAPOR_PRESSURE_KPA };
}

// src/experiments/bernoulli-fluid-flow/bernoulliValidation.ts
var base8 = { inletPressureKPa: 140, flowRateLps: 1.2, radius1Mm: 25, radius2Mm: 12.5, radius3Mm: 25, density: 1e3, elevation1: 2, elevation2: 1.95, elevation3: 1.9 };
var bernoulliBenchmarks = runBenchmarkCases([{ id: "continuity", name: "A v is equal at all stations", input: 0, expected: 0, unit: "m3/s", tolerance: 1e-12, actual: () => solveBernoulli(base8).continuityResidual }, { id: "energy", name: "Bernoulli energy is conserved", input: 0, expected: 0, unit: "Pa", tolerance: 1e-9, actual: () => solveBernoulli(base8).energyResidual }, { id: "throat-speed", name: "Throat speed is four times wide-pipe speed", input: 0, expected: 4, unit: "ratio", tolerance: 1e-12, actual: () => {
  const r = solveBernoulli(base8);
  return r.stations[1].velocity / r.stations[0].velocity;
} }, { id: "throat-pressure", name: "Throat pressure is lower", input: 0, expected: 1, unit: "boolean", tolerance: 0, actual: () => {
  const r = solveBernoulli(base8);
  return Number(r.stations[1].pressurePa < r.stations[0].pressurePa);
} }, { id: "flow-units", name: "1.2 litres per second is 0.0012 cubic metres per second", input: 0, expected: 12e-4, unit: "m3/s", tolerance: 0, actual: () => solveBernoulli(base8).stations[0].flowCheck }]);

// src/experiments/buoyancy/buoyancySimulation.ts
var G4 = 9.80665;
var clamp18 = (value, min, max) => Math.min(max, Math.max(min, value));
function solveBuoyancy(input2) {
  const objectVolumeM3 = clamp18(input2.volumeCm3, 20, 500) * 1e-6;
  const immersionFraction = clamp18(input2.immersionFraction, 0, 1);
  const objectDensity = clamp18(input2.objectDensity, 100, 8e3);
  const fluidDensity = clamp18(input2.fluidDensity, 500, 1500);
  const displacedVolumeM3 = objectVolumeM3 * immersionFraction;
  const massKg = objectDensity * objectVolumeM3;
  const weightN = massKg * G4;
  const buoyantForceN = fluidDensity * G4 * displacedVolumeM3;
  const netForceN = buoyantForceN - weightN;
  const floatingFraction = objectDensity / fluidDensity;
  const equilibriumFraction = clamp18(floatingFraction, 0, 1);
  const balanced2 = Math.abs(netForceN) <= Math.max(2e-3, weightN * 0.015);
  const state = objectDensity > fluidDensity && immersionFraction > 0.985 ? "sinking" : balanced2 && objectDensity < fluidDensity ? "floating" : balanced2 ? "neutral" : "held";
  return { objectVolumeM3, displacedVolumeM3, displacedVolumeCm3: displacedVolumeM3 * 1e6, massKg, weightN, buoyantForceN, apparentWeightN: Math.max(0, weightN - buoyantForceN), netForceN, floatingFraction, equilibriumFraction, state };
}
var buoyancyBenchmarks = [
  { id: "float", name: "Half-density body floats half submerged", actual: solveBuoyancy({ objectDensity: 500, fluidDensity: 1e3, volumeCm3: 200, immersionFraction: 0.5 }).floatingFraction, expected: 0.5, tolerance: 1e-12, unit: "fraction" },
  { id: "force", name: "Buoyant force equals displaced fluid weight", actual: solveBuoyancy({ objectDensity: 800, fluidDensity: 1e3, volumeCm3: 200, immersionFraction: 0.5 }).buoyantForceN, expected: 1e3 * G4 * 1e-4, tolerance: 1e-12, unit: "N" },
  { id: "volume", name: "Immersion scales displaced volume", actual: solveBuoyancy({ objectDensity: 700, fluidDensity: 1e3, volumeCm3: 250, immersionFraction: 0.4 }).displacedVolumeCm3, expected: 100, tolerance: 1e-12, unit: "cm3" },
  { id: "balance", name: "Floating equilibrium balances forces", actual: solveBuoyancy({ objectDensity: 650, fluidDensity: 1e3, volumeCm3: 300, immersionFraction: 0.65 }).netForceN, expected: 0, tolerance: 1e-12, unit: "N" },
  { id: "sink", name: "Denser object requires full immersion", actual: solveBuoyancy({ objectDensity: 2700, fluidDensity: 1e3, volumeCm3: 100, immersionFraction: 1 }).equilibriumFraction, expected: 1, tolerance: 0, unit: "fraction" }
];

// src/experiments/buoyancy/buoyancyValidation.ts
var buoyancyBenchmarks2 = runBenchmarkCases(buoyancyBenchmarks.map((item) => ({ ...item, input: item.actual, actual: (value) => value })));
var buoyancyValidated = buoyancyBenchmarks.every((item) => approximatelyEqual(item.actual, item.expected, item.tolerance));

// src/experiments/density-float-sink/densityTankPhysics.ts
var G5 = 9.80665;
var clamp19 = (n, a, b) => Math.min(b, Math.max(a, n));
var layers = [{ name: "Oil", density: 850, end: 0.25 }, { name: "Water", density: 1e3, end: 0.5 }, { name: "Saltwater", density: 1025, end: 0.75 }, { name: "Dense liquid", density: 13600, end: 1 }];
function solveDensityTank(input2) {
  const massG = clamp19(input2.massG, 10, 1e3), volumeCm3 = clamp19(input2.volumeCm3, 10, 1e3), objectDensity = massG / volumeCm3 * 1e3, volumeM3 = volumeCm3 * 1e-6, depth = clamp19(input2.depthFraction, 0, 1);
  let localFluidDensity = input2.fluidDensity, layer = "Single fluid", equilibriumDepth = 0.5, state = "suspend", displacedFraction = 1;
  if (input2.layered) {
    const current = layers.find((x) => depth <= x.end) ?? layers[3];
    localFluidDensity = current.density;
    layer = current.name;
    const exact = layers.find((x) => Math.abs(x.density - objectDensity) < 1e-9);
    if (exact) {
      equilibriumDepth = exact.end - 0.125;
      state = "suspend";
      layer = exact.name;
    } else if (objectDensity < layers[0].density) {
      displacedFraction = objectDensity / layers[0].density;
      equilibriumDepth = 0.04 + 0.14 * displacedFraction;
      state = "float";
      layer = "Oil surface";
    } else {
      const lowerIndex = layers.findIndex((x) => x.density > objectDensity);
      if (lowerIndex < 0) {
        equilibriumDepth = 0.96;
        state = "sink";
        layer = "Tank bottom";
      } else {
        const upper = layers[lowerIndex - 1], lower = layers[lowerIndex];
        const lowerFraction = (objectDensity - upper.density) / (lower.density - upper.density);
        equilibriumDepth = upper.end - 0.07 + lowerFraction * 0.14;
        state = "interface";
        layer = `${upper.name} / ${lower.name}`;
      }
    }
  } else {
    const ratio = objectDensity / input2.fluidDensity;
    if (ratio < 1) {
      displacedFraction = ratio;
      equilibriumDepth = 0.08 + 0.35 * ratio;
      state = "float";
    } else if (Math.abs(ratio - 1) < 1e-9) {
      equilibriumDepth = 0.5;
      state = "suspend";
    } else {
      equilibriumDepth = 0.95;
      state = "sink";
    }
  }
  if (state === "interface" && Math.abs(depth - equilibriumDepth) < 0.04) {
    localFluidDensity = objectDensity;
  }
  const atSurface = depth < 0.2 && !input2.layered;
  const activeFraction = atSurface ? clamp19(depth / 0.2, 0, 1) * displacedFraction : 1;
  const displacedCm3 = volumeCm3 * activeFraction;
  const weightN = massG / 1e3 * G5;
  const buoyantForceN = localFluidDensity * G5 * displacedCm3 * 1e-6;
  return { objectDensity, localFluidDensity, weightN, buoyantForceN, netForceN: buoyantForceN - weightN, displacedCm3, equilibriumDepth, state, layer, orientation: input2.shape === "sphere" ? "orientation independent" : input2.shape === "cylinder" ? "horizontal, broad side stable" : "face-down stable" };
}
var densityTankCases = [
  { id: "density", name: "Density is mass divided by volume", actual: solveDensityTank({ massG: 205, volumeCm3: 200, fluidDensity: 1e3, depthFraction: 0.5, layered: true, shape: "cube" }).objectDensity, expected: 1025, tolerance: 1e-12, unit: "kg/m3" },
  { id: "neutral", name: "Saltwater neutral design balances force", actual: solveDensityTank({ massG: 205, volumeCm3: 200, fluidDensity: 1e3, depthFraction: 0.65, layered: true, shape: "cube" }).netForceN, expected: 0, tolerance: 1e-12, unit: "N" },
  { id: "oil", name: "Cork floats in oil", actual: Number(solveDensityTank({ massG: 24, volumeCm3: 100, fluidDensity: 1e3, depthFraction: 0.1, layered: true, shape: "cube" }).state === "float"), expected: 1, tolerance: 0, unit: "boolean" },
  { id: "interface", name: "Aluminum rests above dense layer", actual: Number(solveDensityTank({ massG: 270, volumeCm3: 100, fluidDensity: 1e3, depthFraction: 0.8, layered: true, shape: "cube" }).state === "interface"), expected: 1, tolerance: 0, unit: "boolean" },
  { id: "single", name: "Single fluid density controls sinking", actual: Number(solveDensityTank({ massG: 120, volumeCm3: 100, fluidDensity: 1e3, depthFraction: 0.8, layered: false, shape: "sphere" }).state === "sink"), expected: 1, tolerance: 0, unit: "boolean" }
];

// src/experiments/density-float-sink/densityTankValidation.ts
var densityTankBenchmarks = runBenchmarkCases(densityTankCases.map((x) => ({ ...x, input: x.actual, actual: (v) => v })));

// src/experiments/fluid-pressure/fluidPressurePhysics.ts
var ATMOSPHERIC_PRESSURE_KPA = 101.325;
var clamp20 = (value, min, max) => Math.min(max, Math.max(min, value));
function solveFluidPressure(input2) {
  const density = clamp20(input2.density, 500, 1500);
  const depthM = clamp20(input2.depthM, 0, 2);
  const gravity = clamp20(input2.gravity, 1.62, 24.79);
  const surfacePressurePa = clamp20(input2.surfacePressureKPa, 0, 200) * 1e3;
  const gaugePressurePa = density * gravity * depthM;
  const absolutePressurePa = surfacePressurePa + gaugePressurePa;
  const equalDepthPressuresPa = [gaugePressurePa, gaugePressurePa, gaugePressurePa];
  const fluidHeightM = 2;
  const jets = [0.4, 0.9, 1.4].map((jetDepth) => ({
    depthM: jetDepth,
    gaugePressureKPa: density * gravity * jetDepth / 1e3,
    exitSpeed: Math.sqrt(2 * gravity * jetDepth),
    rangeM: 2 * Math.sqrt(jetDepth * (fluidHeightM - jetDepth))
  }));
  return {
    gaugePressurePa,
    absolutePressurePa,
    manometerHeadM: gaugePressurePa / (density * gravity),
    equalDepthPressuresPa,
    jets,
    hatchForceN: gaugePressurePa * 0.12
  };
}
var fluidPressureCases = [
  { id: "rho-gh", name: "Water gauge pressure at two metres", actual: solveFluidPressure({ density: 1e3, depthM: 2, gravity: 9.80665, surfacePressureKPa: ATMOSPHERIC_PRESSURE_KPA, vesselShape: "cylinder" }).gaugePressurePa, expected: 19613.3, tolerance: 1e-9, unit: "Pa" },
  { id: "absolute", name: "Absolute pressure adds surface pressure", actual: solveFluidPressure({ density: 1e3, depthM: 1, gravity: 9.80665, surfacePressureKPa: 101.325, vesselShape: "narrow" }).absolutePressurePa, expected: 111131.65, tolerance: 1e-9, unit: "Pa" },
  { id: "shape", name: "Equal depth pressure is shape independent", actual: new Set(["narrow", "cylinder", "tapered"].map((vesselShape) => solveFluidPressure({ density: 1025, depthM: 0.75, gravity: 9.81, surfacePressureKPa: 101.3, vesselShape }).gaugePressurePa)).size, expected: 1, tolerance: 0, unit: "count" },
  { id: "manometer", name: "Manometer head returns probe depth", actual: solveFluidPressure({ density: 850, depthM: 1.25, gravity: 3.71, surfacePressureKPa: 101.325, vesselShape: "tapered" }).manometerHeadM, expected: 1.25, tolerance: 1e-12, unit: "m" },
  { id: "normal-force", name: "Pressure force is normal to a surface", actual: Math.abs(Math.cos(Math.PI / 2)), expected: 0, tolerance: 1e-12, unit: "dot product" }
];

// src/experiments/fluid-pressure/fluidPressureValidation.ts
var fluidPressureBenchmarks = runBenchmarkCases(fluidPressureCases.map((item) => ({ ...item, input: item.actual, actual: (value) => value })));

// src/experiments/force-and-pressure/contactPressurePhysics.ts
var MATERIAL_MODULUS = { steel: 2e11, foam: 5e6, clay: 8e5 };
var clamp21 = (n, a, b) => Math.min(b, Math.max(a, n));
function solveContactPressure(input2) {
  const forceN = clamp21(input2.appliedForceN, 0, 2e3);
  const contactAreaM2 = clamp21(input2.contactAreaM2, 5e-3, 0.16);
  const pressurePa = forceN / contactAreaM2;
  const modulus = MATERIAL_MODULUS[input2.surface];
  const strain = pressurePa / modulus;
  return { forceN, normalForceN: forceN, contactAreaM2, pressurePa, pressureKPa: pressurePa / 1e3, strain, deformationMm: strain * 0.08 * 1e3, visualDeformation: Math.min(28, strain * 2400), loadShare: forceN === 0 ? 0 : 1 };
}
var contactPressureCases = [
  { id: "definition", name: "Pressure is force divided by area", actual: solveContactPressure({ appliedForceN: 600, contactAreaM2: 0.04, orientation: "side", surface: "steel" }).pressurePa, expected: 15e3, tolerance: 1e-12, unit: "Pa" },
  { id: "area", name: "Doubling area halves pressure", actual: solveContactPressure({ appliedForceN: 600, contactAreaM2: 0.04, orientation: "side", surface: "steel" }).pressurePa / solveContactPressure({ appliedForceN: 600, contactAreaM2: 0.08, orientation: "broad", surface: "steel" }).pressurePa, expected: 2, tolerance: 1e-12, unit: "ratio" },
  { id: "normal", name: "Total normal force equals applied force", actual: solveContactPressure({ appliedForceN: 1200, contactAreaM2: 0.02, orientation: "end", surface: "foam" }).normalForceN, expected: 1200, tolerance: 0, unit: "N" },
  { id: "units", name: "Ten newtons per square metre is ten pascals", actual: solveContactPressure({ appliedForceN: 1, contactAreaM2: 0.1, orientation: "custom", surface: "steel" }).pressurePa, expected: 10, tolerance: 0, unit: "Pa" },
  { id: "material", name: "Foam deforms more than steel", actual: Number(solveContactPressure({ appliedForceN: 600, contactAreaM2: 0.04, orientation: "side", surface: "foam" }).strain > solveContactPressure({ appliedForceN: 600, contactAreaM2: 0.04, orientation: "side", surface: "steel" }).strain), expected: 1, tolerance: 0, unit: "boolean" }
];

// src/experiments/force-and-pressure/contactPressureValidation.ts
var contactPressureBenchmarks = runBenchmarkCases(contactPressureCases.map((x) => ({ ...x, input: x.actual, actual: (v) => v })));

// src/experiments/electromagnet/electromagnetSimulation.ts
var MU0 = 4 * Math.PI * 1e-7;
var CORE = { air: { muR: 1, saturation: 10 }, iron: { muR: 2e3, saturation: 1.6 }, steel: { muR: 500, saturation: 1.9 } };
var clamp22 = (n, a, b) => Math.min(b, Math.max(a, n));
function solveElectromagnet(input2) {
  const currentA = clamp22(input2.currentA, 0, 5), turns = clamp22(input2.turns, 100, 2e3), gapM = clamp22(input2.airGapMm, 0, 10) / 1e3, core = CORE[input2.core], coreLength = 0.1, idealB = MU0 * turns * currentA / (gapM + coreLength / core.muR), magnitudeB = core.saturation * Math.tanh(idealB / core.saturation), signedB = magnitudeB * input2.polarity, coilResistance = turns * 5e-3, batteryVoltage = currentA * coilResistance, powerW = currentA ** 2 * coilResistance, temperatureC = 24 + powerW * 0.5, rawForce = magnitudeB ** 2 * 1e-4 / (2 * MU0), liftForceN = rawForce * 0.1, liftedWashers = Math.min(80, Math.floor(liftForceN / (0.02 * 9.80665)));
  return { currentA, turns, idealB, magnitudeB, signedB, coilResistance, batteryVoltage, powerW, temperatureC, liftForceN, liftedWashers, northPole: input2.polarity === 1 ? "bottom" : "top", safe: temperatureC <= 70 && batteryVoltage <= 24, ampereTurns: turns * currentA };
}
var electromagnetBenchmarks = [
  { id: "air-solenoid", name: "Air core follows mu zero N I over length", actual: solveElectromagnet({ currentA: 1, turns: 1e3, core: "air", polarity: 1, airGapMm: 0, targetLoad: 1 }).idealB, expected: MU0 * 1e3 / 0.1, tolerance: 1e-12, unit: "T" },
  { id: "turns", name: "Unsaturated field increases with turns", actual: Number(solveElectromagnet({ currentA: 0.1, turns: 1e3, core: "iron", polarity: 1, airGapMm: 5, targetLoad: 1 }).magnitudeB > solveElectromagnet({ currentA: 0.1, turns: 500, core: "iron", polarity: 1, airGapMm: 5, targetLoad: 1 }).magnitudeB), expected: 1, tolerance: 0, unit: "boolean" },
  { id: "current", name: "Unsaturated field increases with current", actual: Number(solveElectromagnet({ currentA: 0.2, turns: 500, core: "steel", polarity: 1, airGapMm: 5, targetLoad: 1 }).magnitudeB > solveElectromagnet({ currentA: 0.1, turns: 500, core: "steel", polarity: 1, airGapMm: 5, targetLoad: 1 }).magnitudeB), expected: 1, tolerance: 0, unit: "boolean" },
  { id: "reverse", name: "Current reversal reverses field only", actual: solveElectromagnet({ currentA: 2, turns: 800, core: "iron", polarity: -1, airGapMm: 2, targetLoad: 20 }).signedB / solveElectromagnet({ currentA: 2, turns: 800, core: "iron", polarity: 1, airGapMm: 2, targetLoad: 20 }).signedB, expected: -1, tolerance: 1e-12, unit: "ratio" },
  { id: "gap", name: "Larger air gap weakens field", actual: Number(solveElectromagnet({ currentA: 2, turns: 800, core: "iron", polarity: 1, airGapMm: 1, targetLoad: 20 }).magnitudeB > solveElectromagnet({ currentA: 2, turns: 800, core: "iron", polarity: 1, airGapMm: 5, targetLoad: 20 }).magnitudeB), expected: 1, tolerance: 0, unit: "boolean" }
];

// src/experiments/electromagnet/electromagnetValidation.ts
var electromagnetBenchmarks2 = runBenchmarkCases(electromagnetBenchmarks.map((x) => ({ ...x, input: x.actual, actual: (v) => v })));
var electromagnetValidated = electromagnetBenchmarks2.every((x) => x.pass);

// src/experiments/lorentz-force/lorentzForceSimulation.ts
var ELEMENTARY_CHARGE2 = 1602176634e-28;
var ELECTRON_MASS2 = 91093837139e-41;
var PROTON_MASS = 167262192369e-38;
var add4 = (a, b) => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z
});
var scale3 = (a, k) => ({
  x: a.x * k,
  y: a.y * k,
  z: a.z * k
});
var cross2 = (a, b) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x
});
var magnitude = (a) => Math.hypot(a.x, a.y, a.z);
function particleConstants(species) {
  return species === "electron" ? { charge: -ELEMENTARY_CHARGE2, mass: ELECTRON_MASS2, label: "electron" } : { charge: ELEMENTARY_CHARGE2, mass: PROTON_MASS, label: "proton" };
}
function initialVelocity(speed, angleDeg) {
  const angle = Math.max(0, Math.min(180, angleDeg)) * Math.PI / 180;
  return { x: speed * Math.sin(angle), y: 0, z: speed * Math.cos(angle) };
}
function lorentzForce(charge, velocity, electric, magnetic) {
  return scale3(add4(electric, cross2(velocity, magnetic)), charge);
}
function solveLorentz(input2) {
  const speed = Math.max(1e4, Math.min(5e6, input2.speed));
  const safeInput = { ...input2, speed };
  const velocity = initialVelocity(speed, input2.velocityAngleDeg);
  const electric = { x: 0, y: input2.electricField, z: 0 };
  const magnetic = { x: 0, y: 0, z: input2.magneticField };
  const { charge, mass } = particleConstants(input2.species);
  const force = lorentzForce(charge, velocity, electric, magnetic);
  const perpendicularSpeed = Math.abs(velocity.x);
  const absB = Math.abs(input2.magneticField);
  const radius = absB > 0 && perpendicularSpeed > 0 ? mass * perpendicularSpeed / (Math.abs(charge) * absB) : Infinity;
  const period = absB > 0 ? 2 * Math.PI * mass / (Math.abs(charge) * absB) : Infinity;
  const pitch = Number.isFinite(period) ? Math.abs(velocity.z) * period : Infinity;
  const selectorSpeed = absB > 0 ? Math.abs(input2.electricField / input2.magneticField) : Infinity;
  const magneticForce = lorentzForce(
    charge,
    velocity,
    { x: 0, y: 0, z: 0 },
    magnetic
  );
  const electricForce = scale3(electric, charge);
  const selectorResidual = Math.abs(
    input2.electricField - velocity.x * input2.magneticField
  );
  const selectorPass = absB > 0 && perpendicularSpeed > 0 && selectorResidual <= Math.max(1, Math.abs(input2.electricField) * 0.01);
  let trajectory;
  if (selectorPass) trajectory = "selector-pass";
  else if (Math.abs(input2.electricField) > 1) trajectory = "crossed-field";
  else if (absB === 0 || perpendicularSpeed < speed * 1e-6)
    trajectory = "straight";
  else if (Math.abs(velocity.z) < speed * 1e-6) trajectory = "circular";
  else trajectory = "helical";
  return {
    input: safeInput,
    charge,
    mass,
    velocity,
    electric,
    magnetic,
    force,
    magneticForce,
    electricForce,
    forceMagnitude: magnitude(force),
    magneticForceMagnitude: magnitude(magneticForce),
    perpendicularSpeed,
    parallelSpeed: Math.abs(velocity.z),
    radius,
    period,
    pitch,
    selectorSpeed,
    selectorResidual,
    selectorPass,
    trajectory
  };
}
var proton = {
  species: "proton",
  speed: 2e6,
  velocityAngleDeg: 90,
  electricField: 0,
  magneticField: 0.2
};
var lorentzForceBenchmarks = [
  {
    id: "vector-law",
    name: "F equals q times E plus v cross B",
    actual: solveLorentz(proton).force.y,
    expected: -ELEMENTARY_CHARGE2 * 2e6 * 0.2,
    tolerance: 1e-25,
    unit: "N"
  },
  {
    id: "sign-reversal",
    name: "Electron reverses the transverse force",
    actual: solveLorentz({ ...proton, species: "electron" }).force.y / solveLorentz(proton).force.y,
    expected: -1,
    tolerance: 1e-12,
    unit: "ratio"
  },
  {
    id: "radius",
    name: "Circular radius is mv over absolute q B",
    actual: solveLorentz(proton).radius,
    expected: PROTON_MASS * 2e6 / (ELEMENTARY_CHARGE2 * 0.2),
    tolerance: 1e-12,
    unit: "m"
  },
  {
    id: "parallel-zero",
    name: "Parallel velocity has zero magnetic force",
    actual: solveLorentz({ ...proton, velocityAngleDeg: 0 }).magneticForceMagnitude,
    expected: 0,
    tolerance: 1e-30,
    unit: "N"
  },
  {
    id: "velocity-selector",
    name: "Crossed fields select speed E over B",
    actual: solveLorentz({ ...proton, electricField: 3e5, magneticField: 0.15 }).selectorSpeed,
    expected: 2e6,
    tolerance: 1e-9,
    unit: "m/s"
  }
];

// src/experiments/lorentz-force/lorentzForceValidation.ts
var lorentzForceBenchmarks2 = runBenchmarkCases(
  lorentzForceBenchmarks.map((test) => ({
    ...test,
    input: test.actual,
    actual: (value) => value
  }))
);
var lorentzForceValidated = lorentzForceBenchmarks2.every(
  (test) => test.pass
);

// src/experiments/magnetic-field-current/magnetic-field-currentSimulation.ts
var MU02 = 4 * Math.PI * 1e-7;
var clampDistance = (value) => Math.max(value, 5e-3);
function straightWireFieldVector(currentA, point, wire = { x: 0, y: 0 }) {
  const dx = point.x - wire.x, dy = point.y - wire.y;
  const r2 = Math.max(dx * dx + dy * dy, 5e-3 ** 2);
  const factor = MU02 * currentA / (2 * Math.PI * r2);
  return { x: -dy * factor, y: dx * factor };
}
function straightWireField2(currentA, radiusM) {
  return MU02 * Math.abs(currentA) / (2 * Math.PI * clampDistance(Math.abs(radiusM)));
}
function circularLoopAxisField(currentA, axialDistanceM, radiusM = 0.06) {
  return MU02 * currentA * radiusM ** 2 / (2 * (radiusM ** 2 + axialDistanceM ** 2) ** 1.5);
}
function finiteSolenoidAxisField(currentA, axialDistanceM, turns = 600, lengthM = 0.12, radiusM = 0.03) {
  const a = axialDistanceM + lengthM / 2, b = axialDistanceM - lengthM / 2;
  return MU02 * (turns / lengthM) * currentA / 2 * (a / Math.hypot(radiusM, a) - b / Math.hypot(radiusM, b));
}
function solveMagneticField(input2) {
  const current = Math.max(0, Math.min(5, input2.currentA)) * input2.direction;
  const point = {
    x: Math.max(-0.1, Math.min(0.1, input2.probeX)),
    y: Math.max(-0.1, Math.min(0.1, input2.probeY))
  };
  let vector = { x: 0, y: 0 }, axial = 0;
  if (input2.geometry === "wire")
    vector = straightWireFieldVector(current, point);
  if (input2.geometry === "two-wire") {
    const first = straightWireFieldVector(current, point, { x: -0.06, y: 0 });
    const second = straightWireFieldVector(
      input2.secondCurrentA * input2.direction,
      point,
      { x: 0.06, y: 0 }
    );
    vector = { x: first.x + second.x, y: first.y + second.y };
  }
  if (input2.geometry === "loop")
    axial = circularLoopAxisField(current, point.x);
  if (input2.geometry === "solenoid")
    axial = finiteSolenoidAxisField(current, point.x);
  const magnitudeT = input2.geometry === "wire" || input2.geometry === "two-wire" ? Math.hypot(vector.x, vector.y) : Math.abs(axial);
  const angleDeg = input2.geometry === "wire" || input2.geometry === "two-wire" ? (Math.atan2(vector.y, vector.x) * 180 / Math.PI + 360) % 360 : axial >= 0 ? 0 : 180;
  const radiusM = Math.hypot(point.x, point.y);
  return {
    current,
    point,
    vector,
    axial,
    magnitudeT,
    magnitudeMicroT: magnitudeT * 1e6,
    angleDeg,
    radiusM,
    directionLabel: input2.direction === 1 ? "out of board" : "into board"
  };
}
var magneticFieldCurrentBenchmarks = [
  {
    id: "wire-formula",
    name: "Long wire follows mu zero I over two pi r",
    actual: straightWireField2(3, 0.026),
    expected: MU02 * 3 / (2 * Math.PI * 0.026),
    tolerance: 1e-15,
    unit: "T"
  },
  {
    id: "double-current",
    name: "Double current doubles field",
    actual: straightWireField2(4, 0.08) / straightWireField2(2, 0.08),
    expected: 2,
    tolerance: 1e-12,
    unit: "ratio"
  },
  {
    id: "double-distance",
    name: "Double distance halves field",
    actual: straightWireField2(3, 0.1) / straightWireField2(3, 0.05),
    expected: 0.5,
    tolerance: 1e-12,
    unit: "ratio"
  },
  {
    id: "right-hand-rule",
    name: "Positive current gives counterclockwise field at positive x",
    actual: Math.sign(straightWireFieldVector(3, { x: 0.05, y: 0 }).y),
    expected: 1,
    tolerance: 0,
    unit: "direction"
  },
  {
    id: "superposition-null",
    name: "Equal two-wire fields cancel at midpoint",
    actual: solveMagneticField({
      geometry: "two-wire",
      currentA: 3,
      direction: 1,
      probeX: 0,
      probeY: 0,
      secondCurrentA: 3
    }).magnitudeT,
    expected: 0,
    tolerance: 1e-18,
    unit: "T"
  }
];

// src/experiments/magnetic-field-current/magnetic-field-currentValidation.ts
var magneticFieldCurrentBenchmarks2 = runBenchmarkCases(
  magneticFieldCurrentBenchmarks.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value) => value
  }))
);
var magneticFieldCurrentValidated = magneticFieldCurrentBenchmarks2.every((item) => item.pass);

// src/experiments/computational-physics-workflow/computationalPhysicsSimulation.ts
var rms = (values) => Math.sqrt(
  values.reduce((sum, value) => sum + value * value, 0) / values.length
);
function diffusion(input2, implicit) {
  const n = Math.max(10, Math.min(80, Math.round(input2.meshN))), dx = 1 / n, alpha = 0.1, end = 0.2;
  const steps = Math.ceil(end / input2.timeStep), dt = end / steps, lambda = alpha * dt / dx ** 2;
  let u = Array.from({ length: n + 1 }, (_, i) => Math.sin(Math.PI * i / n));
  let iterations = 0;
  const stable = implicit || lambda <= 0.5;
  for (let step = 0; step < steps; step += 1) {
    if (implicit) {
      const old = u, rhs = old.slice();
      let next = old.slice();
      for (let iteration = 0; iteration < 500; iteration += 1) {
        const candidate = next.slice();
        let delta = 0;
        for (let i = 1; i < n; i += 1) {
          candidate[i] = (rhs[i] + lambda * (next[i - 1] + next[i + 1])) / (1 + 2 * lambda);
          delta = Math.max(delta, Math.abs(candidate[i] - next[i]));
        }
        next = candidate;
        iterations += 1;
        if (delta < input2.tolerance) break;
      }
      u = next;
    } else {
      const next = u.slice();
      for (let i = 1; i < n; i += 1)
        next[i] = u[i] + lambda * (u[i - 1] - 2 * u[i] + u[i + 1]);
      u = next;
      iterations += n - 1;
      if (!stable && u.some((v) => !Number.isFinite(v) || Math.abs(v) > 1e6))
        break;
    }
  }
  const exact = u.map(
    (_, i) => Math.sin(Math.PI * i / n) * Math.exp(-alpha * Math.PI ** 2 * end)
  );
  const error = stable ? rms(u.map((value, i) => value - exact[i])) : Infinity;
  return {
    values: u,
    exact,
    error,
    stable,
    stabilityNumber: lambda,
    steps,
    iterations,
    cost: steps * n + iterations,
    label: implicit ? "Implicit diffusion" : "Explicit diffusion"
  };
}
function oscillator(input2) {
  const end = 8, steps = Math.ceil(end / input2.timeStep), dt = end / steps;
  let x = 1, v = 0, evaluations = 0;
  const deriv = (px, pv) => ({ x: pv, v: -px });
  const samples = [{ x: 0, y: x }];
  for (let step = 0; step < steps; step += 1) {
    const a = deriv(x, v), b = deriv(x + a.x * dt / 2, v + a.v * dt / 2), c2 = deriv(x + b.x * dt / 2, v + b.v * dt / 2), d = deriv(x + c2.x * dt, v + c2.v * dt);
    x += dt * (a.x + 2 * b.x + 2 * c2.x + d.x) / 6;
    v += dt * (a.v + 2 * b.v + 2 * c2.v + d.v) / 6;
    evaluations += 4;
    if (step % Math.max(1, Math.floor(steps / input2.meshN)) === 0)
      samples.push({ x: step * dt, y: x });
  }
  const error = Math.abs(x - Math.cos(end));
  return {
    values: samples.map((p) => p.y),
    exact: samples.map((p) => Math.cos(p.x)),
    error,
    stable: dt < 2,
    stabilityNumber: dt / 2,
    steps,
    iterations: evaluations,
    cost: evaluations + input2.meshN,
    label: "Oscillator RK4"
  };
}
function runWorkflow(input2) {
  const result = input2.model === "explicit-diffusion" ? diffusion(input2, false) : input2.model === "implicit-diffusion" ? diffusion(input2, true) : oscillator(input2);
  const convergence = [0.02, 0.01, 5e-3, 25e-4, 1e-3].map((timeStep) => {
    const trial = input2.model === "explicit-diffusion" ? diffusion({ ...input2, timeStep }, false) : input2.model === "implicit-diffusion" ? diffusion({ ...input2, timeStep }, true) : oscillator({ ...input2, timeStep });
    return {
      timeStep,
      error: trial.error,
      cost: trial.cost,
      stable: trial.stable
    };
  });
  const settings = `${input2.model}|N=${input2.meshN}|dt=${input2.timeStep}|tol=${input2.tolerance}|seed=${input2.seed}`;
  let hash = 2166136261;
  for (const char of settings) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return {
    ...result,
    convergence,
    accepted: result.stable && result.error <= input2.tolerance,
    settings,
    reproducibilityId: `RUN-${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0")}`
  };
}
var base9 = {
  model: "explicit-diffusion",
  meshN: 40,
  timeStep: 1e-3,
  tolerance: 1e-3,
  seed: 20240517
};
var computationalWorkflowBenchmarks = [
  {
    id: "convergence",
    name: "Smaller stable time step reduces explicit diffusion error",
    actual: Number(
      runWorkflow({ ...base9, timeStep: 1e-3 }).error < runWorkflow({ ...base9, timeStep: 0.01 }).error
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean"
  },
  {
    id: "error",
    name: "RMS error is zero for identical arrays",
    actual: rms([0, 0, 0]),
    expected: 0,
    tolerance: 0,
    unit: "m"
  },
  {
    id: "stability",
    name: "Explicit diffusion warns above lambda one half",
    actual: Number(runWorkflow({ ...base9, meshN: 80, timeStep: 0.02 }).stable),
    expected: 0,
    tolerance: 0,
    unit: "boolean"
  },
  {
    id: "reproducible",
    name: "Identical settings reproduce run identifier",
    actual: Number(
      runWorkflow(base9).reproducibilityId === runWorkflow(base9).reproducibilityId
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean"
  },
  {
    id: "reference",
    name: "Diffusion exact reference decays sine amplitude",
    actual: Math.exp(-0.1 * Math.PI ** 2 * 0.2),
    expected: 0.8208687174155399,
    tolerance: 1e-12,
    unit: "ratio"
  }
];

// src/experiments/computational-physics-workflow/computationalPhysicsValidation.ts
var computationalWorkflowBenchmarks2 = runBenchmarkCases(
  computationalWorkflowBenchmarks.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value) => value
  }))
);
var computationalWorkflowValidated = computationalWorkflowBenchmarks2.every((item) => item.pass);

// src/experiments/measurement-errors/measurementErrorsSimulation.ts
var roundStep = (value, step) => Math.round(value / step) * step;
var deviation = (seed, index) => {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * 2;
};
function roundUncertainty(value, uncertainty) {
  if (!(uncertainty > 0)) return { value, uncertainty: 0, decimals: 0 };
  const exponent = Math.floor(Math.log10(uncertainty)), leading = uncertainty / 10 ** exponent, sig = leading < 3 ? 2 : 1, roundedUncertainty = Number(uncertainty.toPrecision(sig)), decimals = Math.max(
    0,
    -Math.floor(Math.log10(roundedUncertainty)) + sig - 1
  );
  return {
    value: Number(value.toFixed(decimals)),
    uncertainty: roundedUncertainty,
    decimals
  };
}
function solveMeasurements(input2) {
  const trueMm = Math.max(1, Math.min(100, input2.trueMm)), leastCount = Math.max(0.01, Math.min(1, input2.leastCountMm)), trials = Math.max(1, Math.min(12, Math.round(input2.trials)));
  const parallaxBias = input2.instrument === "ruler" ? input2.parallax * leastCount * 0.6 : 0;
  const readings = Array.from({ length: trials }, (_, index) => {
    const noise = deviation(input2.seed, index) * leastCount * 1.2;
    const raw = roundStep(
      trueMm + input2.zeroErrorMm + parallaxBias + noise,
      leastCount
    );
    return { trial: index + 1, raw, corrected: raw - input2.zeroErrorMm };
  });
  const mean = readings.reduce((sum, reading) => sum + reading.corrected, 0) / trials;
  const sampleStd = trials > 1 ? Math.sqrt(
    readings.reduce(
      (sum, reading) => sum + (reading.corrected - mean) ** 2,
      0
    ) / (trials - 1)
  ) : 0;
  const randomUncertainty = trials > 1 ? sampleStd / Math.sqrt(trials) : 0;
  const instrumentUncertainty = leastCount / 2;
  const combinedUncertainty = Math.hypot(
    randomUncertainty,
    instrumentUncertainty
  );
  const absoluteError = Math.abs(mean - trueMm), percentageError = absoluteError / trueMm * 100;
  const area = mean ** 2, areaUncertainty = area * 2 * combinedUncertainty / mean;
  const report = roundUncertainty(mean, combinedUncertainty);
  return {
    trueMm,
    leastCount,
    trials,
    readings,
    mean,
    sampleStd,
    randomUncertainty,
    instrumentUncertainty,
    combinedUncertainty,
    absoluteError,
    percentageError,
    area,
    areaUncertainty,
    parallaxBias,
    report,
    reportText: `(${report.value.toFixed(report.decimals)} \xB1 ${report.uncertainty.toFixed(report.decimals)}) mm`
  };
}
var base10 = {
  trueMm: 24.48,
  instrument: "vernier",
  leastCountMm: 0.02,
  zeroErrorMm: 0.02,
  trials: 5,
  parallax: 0,
  seed: 31
};
var measurementErrorBenchmarks = [
  {
    id: "zero-correction",
    name: "Positive zero error is subtracted",
    actual: solveMeasurements({ ...base10, trials: 1, seed: 1 }).readings[0].raw - solveMeasurements({ ...base10, trials: 1, seed: 1 }).readings[0].corrected,
    expected: 0.02,
    tolerance: 1e-12,
    unit: "mm"
  },
  {
    id: "mean",
    name: "Mean retains unrounded corrected readings",
    actual: solveMeasurements(base10).mean,
    expected: solveMeasurements(base10).readings.reduce((s, r) => s + r.corrected, 0) / 5,
    tolerance: 1e-12,
    unit: "mm"
  },
  {
    id: "percentage",
    name: "Percentage error uses absolute error over true value",
    actual: solveMeasurements(base10).percentageError,
    expected: solveMeasurements(base10).absoluteError / base10.trueMm * 100,
    tolerance: 1e-12,
    unit: "%"
  },
  {
    id: "propagation",
    name: "Squared length doubles relative uncertainty",
    actual: solveMeasurements(base10).areaUncertainty / solveMeasurements(base10).area,
    expected: 2 * solveMeasurements(base10).combinedUncertainty / solveMeasurements(base10).mean,
    tolerance: 1e-12,
    unit: "ratio"
  },
  {
    id: "round-end",
    name: "Reported value matches uncertainty decimal place",
    actual: roundUncertainty(20.4837, 0.0271).value,
    expected: 20.484,
    tolerance: 1e-12,
    unit: "mm"
  }
];

// src/experiments/measurement-errors/measurementErrorsValidation.ts
var measurementErrorBenchmarks2 = runBenchmarkCases(
  measurementErrorBenchmarks.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value) => value
  }))
);
var measurementErrorsValidated = measurementErrorBenchmarks2.every(
  (item) => item.pass
);

// src/experiments/distance-time-graph/distanceTimeSimulation.ts
function compileJourney(segments, mode = "distance") {
  let time = 0, distance2 = 0;
  const intervals = segments.map((segment) => {
    const durationS = Math.max(0.5, Math.min(8, segment.durationS));
    const speedMps = Math.max(
      mode === "distance" ? 0 : -5,
      Math.min(5, segment.speedMps)
    );
    const interval = {
      ...segment,
      durationS,
      speedMps,
      startTimeS: time,
      endTimeS: time + durationS,
      startDistanceM: distance2,
      endDistanceM: distance2 + speedMps * durationS
    };
    time = interval.endTimeS;
    distance2 = interval.endDistanceM;
    return interval;
  });
  return {
    intervals,
    totalTimeS: time,
    finalDistanceM: distance2,
    continuous: intervals.every(
      (s, i) => i === 0 || s.startDistanceM === intervals[i - 1].endDistanceM
    )
  };
}
function sampleJourney(segments, timeS, mode = "distance") {
  const journey = compileJourney(segments, mode), t = Math.max(0, Math.min(journey.totalTimeS, timeS));
  const segment = journey.intervals.find((item) => t <= item.endTimeS) ?? journey.intervals[journey.intervals.length - 1];
  if (!segment)
    return { timeS: 0, distanceM: 0, speedMps: 0, segmentIndex: -1 };
  return {
    timeS: t,
    distanceM: segment.startDistanceM + segment.speedMps * (t - segment.startTimeS),
    speedMps: segment.speedMps,
    segmentIndex: journey.intervals.indexOf(segment)
  };
}
var distanceTimeBenchmarks = runBenchmarkCases([
  {
    id: "slope-speed",
    name: "Graph slope equals speed",
    input: (9 - 3) / (5 - 2),
    expected: 2,
    tolerance: 1e-12,
    unit: "m/s",
    actual: (x) => x
  },
  {
    id: "horizontal-rest",
    name: "Horizontal segment means rest",
    input: sampleJourney([{ id: 1, durationS: 3, speedMps: 0 }], 2).speedMps,
    expected: 0,
    tolerance: 0,
    unit: "m/s",
    actual: (x) => x
  },
  {
    id: "continuous",
    name: "Piecewise journey has no distance jumps",
    input: Number(
      compileJourney([
        { id: 1, durationS: 2, speedMps: 2 },
        { id: 2, durationS: 1, speedMps: 4 }
      ]).continuous
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean",
    actual: (x) => x
  },
  {
    id: "return",
    name: "Position mode permits return",
    input: compileJourney(
      [
        { id: 1, durationS: 2, speedMps: 3 },
        { id: 2, durationS: 2, speedMps: -3 }
      ],
      "position"
    ).finalDistanceM,
    expected: 0,
    tolerance: 1e-12,
    unit: "m",
    actual: (x) => x
  },
  {
    id: "distance-no-negative",
    name: "Distance mode rejects negative slope",
    input: compileJourney([{ id: 1, durationS: 2, speedMps: -3 }], "distance").finalDistanceM,
    expected: 0,
    tolerance: 0,
    unit: "m",
    actual: (x) => x
  }
]);

// src/experiments/distance-time-graph/distanceTimeValidation.ts
var distanceTimeValidated = distanceTimeBenchmarks.every(
  (item) => item.pass
);

// src/experiments/free-fall/freeFallSimulation.ts
function idealImpactTime(input2) {
  return (input2.initialVelocityMps + Math.sqrt(
    input2.initialVelocityMps ** 2 + 2 * input2.gravity * input2.heightM
  )) / input2.gravity;
}
function freeFallState(input2, timeS) {
  const t = Math.max(0, timeS), g = Math.max(0.1, input2.gravity);
  if (!input2.airResistance) {
    const rawY = input2.heightM + input2.initialVelocityMps * t - 0.5 * g * t * t, v2 = input2.initialVelocityMps - g * t;
    return {
      timeS: t,
      heightM: Math.max(0, rawY),
      velocityMps: rawY <= 0 ? 0 : v2,
      accelerationMps2: rawY <= 0 ? 0 : -g,
      impacted: rawY <= 0
    };
  }
  let y = input2.heightM, v = input2.initialVelocityMps, a = -g, elapsed = 0;
  const dt = 2e-3, k = 0.035;
  while (elapsed < t && y > 0) {
    const step = Math.min(dt, t - elapsed);
    a = -g - k * v * Math.abs(v);
    v += a * step;
    y += v * step;
    elapsed += step;
  }
  return {
    timeS: t,
    heightM: Math.max(0, y),
    velocityMps: y <= 0 ? 0 : v,
    accelerationMps2: y <= 0 ? 0 : a,
    impacted: y <= 0
  };
}
function impactTime(input2) {
  if (!input2.airResistance) return idealImpactTime(input2);
  let t = 0;
  while (t < 30 && !freeFallState(input2, t).impacted) t += 0.01;
  return t;
}
var freeFallBenchmarks = runBenchmarkCases([
  {
    id: "fall-position",
    name: "Ideal vertical position",
    input: freeFallState(
      {
        heightM: 100,
        initialVelocityMps: 0,
        gravity: 10,
        airResistance: false
      },
      2
    ).heightM,
    expected: 80,
    tolerance: 1e-12,
    unit: "m",
    actual: (x) => x
  },
  {
    id: "fall-velocity",
    name: "Ideal vertical velocity",
    input: freeFallState(
      {
        heightM: 100,
        initialVelocityMps: 5,
        gravity: 10,
        airResistance: false
      },
      2
    ).velocityMps,
    expected: -15,
    tolerance: 1e-12,
    unit: "m/s",
    actual: (x) => x
  },
  {
    id: "fall-acceleration",
    name: "Acceleration is gravity independent of mass",
    input: freeFallState(
      {
        heightM: 100,
        initialVelocityMps: 0,
        gravity: 9.81,
        airResistance: false
      },
      1
    ).accelerationMps2,
    expected: -9.81,
    tolerance: 1e-12,
    unit: "m/s\xB2",
    actual: (x) => x
  },
  {
    id: "fall-impact",
    name: "Impact time from quadratic root",
    input: idealImpactTime({
      heightM: 20,
      initialVelocityMps: 0,
      gravity: 10,
      airResistance: false
    }),
    expected: 2,
    tolerance: 1e-12,
    unit: "s",
    actual: (x) => x
  },
  {
    id: "fall-drag",
    name: "Air resistance delays impact",
    input: Number(
      impactTime({
        heightM: 20,
        initialVelocityMps: 0,
        gravity: 10,
        airResistance: true
      }) > 2
    ),
    expected: 1,
    tolerance: 0,
    unit: "boolean",
    actual: (x) => x
  }
]);

// src/experiments/balanced-unbalanced-forces/balancedForcesSimulation.ts
var G6 = 9.80665;
function solveForceBalance(input2, velocityMps) {
  const massKg = Math.max(1, Math.min(100, input2.massKg));
  const leftForceN = Math.max(0, Math.min(300, input2.leftForceN));
  const rightForceN = Math.max(0, Math.min(300, input2.rightForceN));
  const muK = Math.max(0, Math.min(0.5, input2.frictionCoefficient));
  const muS = Math.min(0.7, muK * 1.25);
  const appliedNetN = rightForceN - leftForceN;
  const normalN = massKg * G6;
  let frictionN = 0;
  let regime = "kinetic";
  if (Math.abs(velocityMps) > 1e-4)
    frictionN = -Math.sign(velocityMps) * muK * normalN;
  else if (Math.abs(appliedNetN) <= muS * normalN) {
    frictionN = -appliedNetN;
    regime = "static";
  } else frictionN = -Math.sign(appliedNetN) * muK * normalN;
  const netForceN = appliedNetN + frictionN;
  const accelerationMps2 = netForceN / massKg;
  return {
    massKg,
    leftForceN,
    rightForceN,
    appliedNetN,
    normalN,
    weightN: normalN,
    frictionN,
    netForceN,
    accelerationMps2,
    regime,
    balanced: Math.abs(netForceN) < 1e-9
  };
}
var balancedForcesBenchmarks = [
  {
    id: "newton",
    name: "Net force equals mass times acceleration",
    actual: solveForceBalance(
      {
        leftForceN: 20,
        rightForceN: 100,
        massKg: 20,
        frictionCoefficient: 0,
        surface: "ice"
      },
      0
    ).accelerationMps2,
    expected: 4,
    tolerance: 1e-12,
    unit: "m/s\xB2"
  },
  {
    id: "balanced-moving",
    name: "Balanced forces permit constant nonzero velocity",
    actual: solveForceBalance(
      {
        leftForceN: 100,
        rightForceN: 100,
        massKg: 40,
        frictionCoefficient: 0,
        surface: "ice"
      },
      2
    ).accelerationMps2,
    expected: 0,
    tolerance: 1e-12,
    unit: "m/s\xB2"
  },
  {
    id: "friction-direction",
    name: "Kinetic friction opposes rightward motion",
    actual: Math.sign(
      solveForceBalance(
        {
          leftForceN: 0,
          rightForceN: 0,
          massKg: 10,
          frictionCoefficient: 0.2,
          surface: "wood"
        },
        1
      ).frictionN
    ),
    expected: -1,
    tolerance: 0,
    unit: "direction"
  },
  {
    id: "static",
    name: "Static friction balances a small applied force",
    actual: solveForceBalance(
      {
        leftForceN: 10,
        rightForceN: 20,
        massKg: 20,
        frictionCoefficient: 0.2,
        surface: "wood"
      },
      0
    ).netForceN,
    expected: 0,
    tolerance: 1e-12,
    unit: "N"
  },
  {
    id: "reverse",
    name: "Force reversal reverses acceleration without friction",
    actual: solveForceBalance(
      {
        leftForceN: 90,
        rightForceN: 30,
        massKg: 30,
        frictionCoefficient: 0,
        surface: "ice"
      },
      0
    ).accelerationMps2,
    expected: -2,
    tolerance: 1e-12,
    unit: "m/s\xB2"
  }
];

// src/experiments/balanced-unbalanced-forces/balancedForcesValidation.ts
var balancedForcesBenchmarks2 = runBenchmarkCases(
  balancedForcesBenchmarks.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value) => value
  }))
);
var balancedForcesValidated = balancedForcesBenchmarks2.every(
  (item) => item.pass
);

// src/lib/experimentValidationRegistry.ts
var si = (id, label, displayUnit, siUnit = displayUnit) => ({ id, label, displayUnit, siUnit });
var energyBenchmarks = runBenchmarkCases([
  {
    id: "energy-conserved-drop",
    name: "Potential converts to kinetic",
    input: { mass: 2, g: 9.8, height: 5 },
    expected: 98,
    unit: "J",
    tolerance: 1e-12,
    actual: (input2) => input2.mass * input2.g * input2.height
  },
  {
    id: "energy-speed-check",
    name: "Speed from drop height",
    input: { mass: 1, g: 9.8, height: 5 },
    expected: Math.sqrt(98),
    unit: "m/s",
    tolerance: 1e-12,
    actual: (input2) => Math.sqrt(2 * input2.g * input2.height)
  }
]);
var experimentValidationRegistry = {
  "advanced-quantum-operators": {
    experimentId: "advanced-quantum-operators",
    formulaName: "Qubit operators and Born measurement",
    formula: "|psi|^2=1; p_plus=(1+r dot n)/2; expectation(sigma_n)=r dot n",
    status: statusForBenchmarks(quantumOperatorBenchmarks),
    assumptions: [
      "A pure two-level quantum state is modeled.",
      "Named gates and axis rotations are unitary.",
      "Pauli measurement outcomes are plus or minus one with Born probabilities."
    ],
    inputUnits: [
      si("alphaMagnitude", "Alpha magnitude", "unitless"),
      si("relativePhase", "Relative phase", "degrees"),
      si("rotationAngle", "Operator rotation", "degrees")
    ],
    outputUnits: [
      si("probabilityPlus", "Plus probability", "unitless"),
      si("probabilityMinus", "Minus probability", "unitless"),
      si("expectation", "Pauli expectation", "unitless")
    ],
    validRanges: [
      {
        id: "alphaMagnitude",
        label: "Alpha magnitude",
        min: 0,
        max: 1,
        unit: "unitless"
      },
      {
        id: "relativePhase",
        label: "Relative phase",
        min: -180,
        max: 180,
        unit: "degrees"
      },
      {
        id: "rotationAngle",
        label: "Rotation angle",
        min: 5,
        max: 180,
        unit: "degrees"
      }
    ],
    benchmarkCases: quantumOperatorBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "This lesson visualizes a single ideal qubit; histogram randomness is a seeded sequence of independent prepared copies."
    ]
  },
  "bohr-model": {
    experimentId: "bohr-model",
    formulaName: "Hydrogenic Bohr transitions",
    formula: "En=-13.6057 Z^2/n^2 eV; DeltaEatom=Ef-Ei; Ephoton=|DeltaE|=hf=hc/lambda",
    status: statusForBenchmarks(bohrModelBenchmarks),
    assumptions: [
      "A one-electron hydrogenic ion is modeled.",
      "Levels n=1 through 6 are treated as stationary Bohr energies.",
      "Photon recoil, fine structure, Lamb shift, and linewidth are omitted."
    ],
    inputUnits: [
      si("atomicNumber", "Nuclear charge", "unitless"),
      si("initialLevel", "Initial principal level", "unitless"),
      si("finalLevel", "Final principal level", "unitless")
    ],
    outputUnits: [
      si("atomEnergyChangeEv", "Atomic energy change", "eV", "J"),
      si("photonEnergyEv", "Photon energy", "eV", "J"),
      si("wavelengthNm", "Wavelength", "nm", "m"),
      si("frequencyHz", "Frequency", "Hz")
    ],
    validRanges: [
      {
        id: "atomicNumber",
        label: "Atomic number",
        min: 1,
        max: 3,
        unit: "unitless"
      },
      {
        id: "initialLevel",
        label: "Initial level",
        min: 1,
        max: 6,
        unit: "unitless"
      },
      {
        id: "finalLevel",
        label: "Final level",
        min: 1,
        max: 6,
        unit: "unitless"
      }
    ],
    benchmarkCases: bohrModelBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "Displayed wavelengths use the ideal reduced-constant Bohr model and may differ slightly from tabulated air wavelengths."
    ]
  },
  "de-broglie-wavelength": {
    experimentId: "de-broglie-wavelength",
    formulaName: "de Broglie matter wavelength",
    formula: "lambda=h/p; electron lambda=h/sqrt(2 m_e e V); Delta y approximately L lambda/d",
    status: statusForBenchmarks(deBroglieBenchmarks),
    assumptions: [
      "Momentum is nonrelativistic p=mv.",
      "Electron voltage mode neglects relativistic correction.",
      "Diffraction spacing uses the small-angle approximation."
    ],
    inputUnits: [
      si("speed", "Particle speed", "m/s"),
      si("voltage", "Accelerating voltage", "V"),
      si("spacing", "Slit or plane spacing", "nm", "m")
    ],
    outputUnits: [
      si("momentum", "Momentum", "kg m/s"),
      si("wavelength", "Wavelength", "pm", "m"),
      si("fringeSpacing", "Fringe spacing", "mm", "m")
    ],
    validRanges: [
      {
        id: "speed",
        label: "Particle speed",
        min: 1e5,
        max: 15e7,
        unit: "m/s"
      },
      {
        id: "voltage",
        label: "Accelerating voltage",
        min: 50,
        max: 5e3,
        unit: "V"
      },
      { id: "spacing", label: "Slit spacing", min: 0.2, max: 0.8, unit: "nm" }
    ],
    benchmarkCases: deBroglieBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "The classroom model is nonrelativistic; a warning appears when v exceeds 0.2c."
    ]
  },
  "nuclear-decay": {
    experimentId: "nuclear-decay",
    formulaName: "Exponential radioactive decay",
    formula: "N=N0 2^(-t/T_half)=N0 exp(-lambda t); A=lambda N; lambda=ln(2)/T_half",
    status: statusForBenchmarks(nuclearDecayBenchmarks),
    assumptions: [
      "Nuclei decay independently with a constant hazard rate.",
      "Seeded pseudorandom lifetimes make a run exactly repeatable.",
      "Activity is reported per displayed simulation-year for the finite teaching sample."
    ],
    inputUnits: [
      si("initialNuclei", "Initial nuclei", "count"),
      si("halfLife", "Half-life", "years", "s"),
      si("time", "Elapsed time", "years", "s"),
      si("seed", "Random seed", "unitless")
    ],
    outputUnits: [
      si("remaining", "Remaining nuclei", "count"),
      si("activity", "Activity", "events/year", "Bq")
    ],
    validRanges: [
      {
        id: "initialNuclei",
        label: "Initial nuclei",
        min: 100,
        max: 1e3,
        unit: "count"
      },
      { id: "halfLife", label: "Half-life", min: 0.01, max: 50, unit: "years" },
      {
        id: "seed",
        label: "Random seed",
        min: 1,
        max: 999999,
        unit: "unitless"
      }
    ],
    benchmarkCases: nuclearDecayBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "Finite seeded samples fluctuate around the exponential ensemble expectation; individual decay times are not predictable."
    ]
  },
  "photoelectric-equation": {
    experimentId: "photoelectric-equation",
    formulaName: "Einstein photoelectric equation",
    formula: "Kmax=max(0,hf-phi)=e|Vs|; f0=phi/h",
    status: statusForBenchmarks(photoelectricBenchmarks),
    assumptions: [
      "Electrons occupy an ideal metal surface with a single work function.",
      "Maximum kinetic energy is set by photon frequency, not intensity.",
      "Photocurrent scales with intensity above threshold and is stopped by the retarding potential."
    ],
    inputUnits: [
      si("frequency", "Light frequency", "Hz"),
      si("intensity", "Intensity", "%", "unitless"),
      si("workFunction", "Work function", "eV", "J"),
      si("appliedVoltage", "Applied voltage", "V")
    ],
    outputUnits: [
      si("kineticMax", "Maximum kinetic energy", "eV", "J"),
      si("stoppingPotential", "Stopping potential", "V"),
      si("photocurrent", "Photocurrent", "\xB5A", "A")
    ],
    validRanges: [
      { id: "wavelength", label: "Wavelength", min: 200, max: 800, unit: "nm" },
      {
        id: "workFunction",
        label: "Work function",
        min: 1.5,
        max: 5.5,
        unit: "eV"
      },
      { id: "intensity", label: "Intensity", min: 0, max: 100, unit: "%" },
      {
        id: "appliedVoltage",
        label: "Applied voltage",
        min: -6,
        max: 2,
        unit: "V"
      }
    ],
    benchmarkCases: photoelectricBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The current-voltage curve is an ideal teaching response; surface-energy distributions and contact potentials are omitted."
    ]
  },
  "special-relativity-bridge": {
    experimentId: "special-relativity-bridge",
    formulaName: "Lorentz transformations and light clock",
    formula: "gamma=1/sqrt(1-beta^2); Delta t=gamma Delta tau; L=L0/gamma; x'=gamma(x-vt); t'=gamma(t-vx/c^2)",
    status: statusForBenchmarks(relativityBenchmarks),
    assumptions: [
      "Frames are inertial and relative motion is one-dimensional.",
      "The light clock is ideal and its mirrors are at rest in the ship frame.",
      "Coordinates use Einstein synchronization in each frame."
    ],
    inputUnits: [
      si("relativeSpeed", "Relative speed", "fraction of c", "m/s"),
      si("eventSpacing", "Event spacing", "m"),
      si("clockHeight", "Light-clock height", "m")
    ],
    outputUnits: [
      si("gamma", "Lorentz factor", "unitless"),
      si("time", "Coordinate time", "\xB5s", "s"),
      si("length", "Contracted length", "m"),
      si("interval", "Invariant interval", "m\xB2")
    ],
    validRanges: [
      {
        id: "relativeSpeed",
        label: "Relative speed",
        min: 0,
        max: 0.99,
        unit: "fraction of c"
      },
      {
        id: "eventSpacing",
        label: "Event spacing",
        min: 100,
        max: 1e3,
        unit: "m"
      }
    ],
    benchmarkCases: relativityBenchmarks,
    tolerance: 1e-7,
    graphExpectations: [],
    warnings: [
      "The lesson compares ideal inertial frames; acceleration needed to switch frames is outside this model."
    ]
  },
  "chaotic-coupled-oscillators": {
    experimentId: "chaotic-coupled-oscillators",
    formulaName: "Nonlinear coupled pendula with geometric spring coupling",
    formula: "I_i theta_i''=-m_i g L_i sin(theta_i)-dU_c/dtheta_i-b theta_i'+tau_i(t); U_c=0.5 k(x1-x2)^2",
    status: statusForBenchmarks(chaoticCoupledOscillatorBenchmarks),
    assumptions: [
      "Each bob is a point mass on a massless rigid string with a fixed pivot.",
      "The horizontal coupling spring is ideal and its extension is x1-x2 with x_i=L_i sin(theta_i).",
      "A deterministic fixed-step fourth-order Runge-Kutta method integrates the nonlinear equations."
    ],
    inputUnits: [
      si("mass1", "Mass one", "kg"),
      si("mass2", "Mass two", "kg"),
      si("length1", "Length one", "m"),
      si("length2", "Length two", "m"),
      si("coupling", "Spring coupling", "N/m"),
      si("damping", "Angular damping", "N\xB7m\xB7s/rad"),
      si("initialAngle1", "Initial angle one", "degrees", "rad"),
      si("initialAngle2", "Initial angle two", "degrees", "rad")
    ],
    outputUnits: [
      si("angle", "Angular position", "degrees", "rad"),
      si("angularVelocity", "Angular velocity", "rad/s"),
      si("energy", "Mechanical energy", "J"),
      si("beatPeriod", "Energy-transfer period", "s"),
      si("divergence", "Nearby-state separation", "rad")
    ],
    validRanges: [
      { id: "mass", label: "Bob mass", min: 0.1, max: 0.6, unit: "kg" },
      { id: "length", label: "Pendulum length", min: 0.5, max: 1.3, unit: "m" },
      { id: "coupling", label: "Coupling", min: 0.05, max: 2, unit: "N/m" },
      {
        id: "initialAngle",
        label: "Initial angle",
        min: -140,
        max: 140,
        unit: "degrees"
      }
    ],
    benchmarkCases: chaoticCoupledOscillatorBenchmarks,
    tolerance: 1e-6,
    graphExpectations: [
      {
        id: "time-series",
        label: "Angular time series",
        xLabel: "time",
        yLabel: "angle",
        shape: "qualitative"
      },
      {
        id: "phase-portrait",
        label: "Phase portrait",
        xLabel: "angle",
        yLabel: "angular velocity",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The nearby-state divergence is a sensitivity indicator, not a converged infinite-time Lyapunov exponent."
    ]
  },
  "calorimetry-mixing": {
    experimentId: "calorimetry-mixing",
    formulaName: "Calorimetry energy balance",
    formula: "Q_i=m_i c_i (T_f-T_i); sum(Q_i)+Q_surroundings=0",
    status: statusForBenchmarks(calorimetryMixingBenchmarks),
    assumptions: [
      "Each sample is internally uniform in temperature.",
      "Specific heats are constant over the selected temperature interval.",
      "Insulated mode exchanges no heat with the surroundings; optional loss follows a lumped Newton-cooling model."
    ],
    inputUnits: [
      si("hotMass", "Hot mass", "kg"),
      si("hotTemperature", "Hot temperature", "\xB0C", "K"),
      si("coldMass", "Cold mass", "kg"),
      si("coldTemperature", "Cold temperature", "\xB0C", "K"),
      si("specificHeat", "Specific heat", "J/(kg\xB7K)"),
      si("calorimeterCapacity", "Calorimeter heat capacity", "J/K")
    ],
    outputUnits: [
      si("equilibriumTemperature", "Equilibrium temperature", "\xB0C", "K"),
      si("heat", "Heat transfer", "J"),
      si("closure", "Energy-balance residual", "J")
    ],
    validRanges: [
      { id: "mass", label: "Sample mass", min: 0.05, max: 0.5, unit: "kg" },
      {
        id: "temperature",
        label: "Sample temperature",
        min: 0,
        max: 95,
        unit: "\xB0C"
      },
      {
        id: "calorimeterCapacity",
        label: "Calorimeter heat capacity",
        min: 0,
        max: 200,
        unit: "J/K"
      }
    ],
    benchmarkCases: calorimetryMixingBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "temperature-time",
        label: "Temperature vs time",
        xLabel: "time",
        yLabel: "temperature",
        shape: "exponential"
      }
    ],
    warnings: [
      "The visual exchange curve is a lumped relaxation model; the final insulated temperature is the exact algebraic energy balance."
    ]
  },
  "gas-laws": {
    experimentId: "gas-laws",
    formulaName: "Ideal gas and kinetic theory",
    formula: "PV=nRT; <K>=3k_B T/2; v_rms=sqrt(3RT/M)",
    status: statusForBenchmarks(gasLawsBenchmarks),
    assumptions: [
      "The gas is ideal: particle volume and intermolecular forces are neglected.",
      "Temperature is absolute Kelvin temperature.",
      "Drawn particles are scaled packets representing the displayed molar amount."
    ],
    inputUnits: [
      si("temperature", "Absolute temperature", "K"),
      si("volume", "Gas volume", "L", "m\xB3"),
      si("amount", "Amount of gas", "mol")
    ],
    outputUnits: [
      si("pressure", "Pressure", "kPa", "Pa"),
      si("speed", "Molecular speed", "m/s"),
      si("energy", "Mean translational kinetic energy", "J"),
      si("work", "Work by gas", "J")
    ],
    validRanges: [
      {
        id: "temperature",
        label: "Temperature",
        min: 250,
        max: 600,
        unit: "K"
      },
      { id: "volume", label: "Volume", min: 0.75, max: 6.5, unit: "L" },
      {
        id: "particleCount",
        label: "Display particles",
        min: 100,
        max: 300,
        unit: "particles"
      }
    ],
    benchmarkCases: gasLawsBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "process-curve",
        label: "Selected thermodynamic process",
        xLabel: "volume or absolute temperature",
        yLabel: "pressure",
        shape: "qualitative"
      },
      {
        id: "maxwell-boltzmann",
        label: "Molecular speed distribution",
        xLabel: "speed",
        yLabel: "probability density",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The finite drawn particles visualize deterministic elastic wall reflections; they are scaled packets rather than individual molecules in the macroscopic sample."
    ]
  },
  "heat-and-temperature": {
    experimentId: "heat-and-temperature",
    formulaName: "Sensible heat and thermal equilibrium",
    formula: "Q=mc\u0394T; T_eq=(C_A T_A+C_B T_B)/(C_A+C_B)",
    status: statusForBenchmarks(heatTemperatureBenchmarks),
    assumptions: [
      "Each sample has a uniform temperature and constant specific heat.",
      "The thermal-contact comparison is insulated from its surroundings.",
      "Phase changes and temperature-dependent material properties are excluded."
    ],
    inputUnits: [
      si("temperature", "Temperature", "\xB0C", "K"),
      si("mass", "Mass", "kg"),
      si("specificHeat", "Specific heat capacity", "J/(kg\xB7K)"),
      si("heat", "Transferred heat", "J")
    ],
    outputUnits: [
      si("temperature", "Temperature", "\xB0C", "K"),
      si("heatCapacity", "Heat capacity", "J/K"),
      si("heat", "Transferred heat", "J")
    ],
    validRanges: [
      {
        id: "temperature",
        label: "Temperature",
        min: -10,
        max: 100,
        unit: "\xB0C"
      },
      { id: "mass", label: "Mass", min: 0.1, max: 2, unit: "kg" },
      { id: "heat", label: "Added heat", min: 1e3, max: 2e4, unit: "J" }
    ],
    benchmarkCases: heatTemperatureBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "temperature-time",
        label: "Sample temperature response",
        xLabel: "time",
        yLabel: "temperature",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Animation time is pedagogical rather than a heat-transfer-rate model; endpoints come from exact energy balance."
    ]
  },
  "heat-transfer": {
    experimentId: "heat-transfer",
    formulaName: "Conduction, convection, and thermal radiation",
    formula: "Qdot=kA\u0394T/L; Qdot=hA\u0394T; Qdot=\u03B5\u03C3AF(T_s^4-T_sur^4)",
    status: statusForBenchmarks(heatTransferBenchmarks),
    assumptions: [
      "Conduction is one-dimensional and steady through a uniform rod.",
      "The convection cell is a lumped classroom model whose circulation direction follows buoyancy.",
      "Radiating surfaces are diffuse-grey and exchange with large surroundings using absolute temperature."
    ],
    inputUnits: [
      si("temperatureDifference", "Temperature difference", "K"),
      si("conductivity", "Thermal conductivity", "W/(m\xB7K)"),
      si("heaterPower", "Fluid heater power", "W"),
      si("emissivity", "Surface emissivity", "1")
    ],
    outputUnits: [
      si("heatRate", "Heat-transfer rate", "W"),
      si("temperature", "Temperature", "\xB0C", "K"),
      si("coefficient", "Convective heat-transfer coefficient", "W/(m\xB2\xB7K)")
    ],
    validRanges: [
      {
        id: "temperatureDifference",
        label: "Temperature difference",
        min: 10,
        max: 100,
        unit: "K"
      },
      {
        id: "conductivity",
        label: "Thermal conductivity",
        min: 0.1,
        max: 401,
        unit: "W/(m\xB7K)"
      },
      {
        id: "heaterPower",
        label: "Fluid heater power",
        min: 50,
        max: 500,
        unit: "W"
      },
      { id: "emissivity", label: "Emissivity", min: 0.05, max: 1, unit: "1" }
    ],
    benchmarkCases: heatTransferBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "heat-rate-time",
        label: "Heat-transfer rate approach",
        xLabel: "time",
        yLabel: "heat rate",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Animation time illustrates mechanism and approach to steady transfer; it is not a spatial finite-difference transient solver."
    ]
  },
  "statistical-ensemble-lab": {
    experimentId: "statistical-ensemble-lab",
    formulaName: "Two-level statistical ensembles",
    formula: "P_can(q)=C(N,q)p^q(1-p)^(N-q); p=(1+exp(\u03B2\u03B5))^-1",
    status: statusForBenchmarks(statisticalEnsembleBenchmarks),
    assumptions: [
      "Particles are distinguishable, non-interacting, and occupy energy levels 0 or \u03B5.",
      "Canonical samples fix N and \u03B2 while allowing energy exchange with a large bath.",
      "Grand-canonical particle number is Poisson distributed and excitation follows independent Bernoulli sampling."
    ],
    inputUnits: [
      si("particleCount", "Target particle count", "particles"),
      si("energyFraction", "Mean excitation energy per particle", "\u03B5"),
      si("samplingDuration", "Sampling duration", "samples")
    ],
    outputUnits: [
      si("energy", "Total excitation energy", "\u03B5"),
      si("variance", "Energy variance", "\u03B5\xB2"),
      si("probability", "Normalized probability", "1")
    ],
    validRanges: [
      {
        id: "particleCount",
        label: "Particle count",
        min: 12,
        max: 120,
        unit: "particles"
      },
      {
        id: "energyFraction",
        label: "Energy per particle",
        min: 0.05,
        max: 0.95,
        unit: "\u03B5"
      },
      {
        id: "samplingDuration",
        label: "Sampling duration",
        min: 100,
        max: 5e3,
        unit: "samples"
      }
    ],
    benchmarkCases: statisticalEnsembleBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "energy-histogram",
        label: "Energy probability distribution",
        xLabel: "E/\u03B5",
        yLabel: "P(E)",
        shape: "qualitative"
      },
      {
        id: "particle-histogram",
        label: "Particle-number distribution",
        xLabel: "N",
        yLabel: "P(N)",
        shape: "qualitative"
      }
    ],
    warnings: [
      "This is a finite two-level model; it teaches ensemble constraints and convergence rather than a continuous ideal-gas density of states."
    ]
  },
  "thermodynamic-process": {
    experimentId: "thermodynamic-process",
    formulaName: "Ideal-gas thermodynamic processes",
    formula: "PV=nRT; W=integral(P dV); deltaU=Q-W; PV^gamma=constant (adiabatic)",
    status: statusForBenchmarks(thermodynamicProcessBenchmarks),
    assumptions: [
      "The gas is ideal with constant heat capacities over each quasistatic path.",
      "Work W is positive when done by the gas, so the first law is deltaU=Q-W.",
      "The adiabatic path is reversible and uses the selected heat-capacity ratio gamma."
    ],
    inputUnits: [
      si("pressure", "Initial pressure", "kPa", "Pa"),
      si("volume", "Initial volume", "L", "m^3"),
      si("temperature", "Initial temperature", "K"),
      si("gamma", "Heat-capacity ratio", "unitless")
    ],
    outputUnits: [
      si("work", "Work by gas", "J"),
      si("heat", "Heat into gas", "J"),
      si("internalEnergy", "Internal-energy change", "J")
    ],
    validRanges: [
      { id: "pressure", label: "Pressure", min: 80, max: 300, unit: "kPa" },
      { id: "volume", label: "Volume", min: 1, max: 5, unit: "L" },
      {
        id: "temperature",
        label: "Temperature",
        min: 250,
        max: 600,
        unit: "K"
      },
      { id: "gamma", label: "Heat-capacity ratio", min: 1.1, max: 1.67 }
    ],
    benchmarkCases: thermodynamicProcessBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "pv-path",
        label: "Pressure-volume path",
        xLabel: "V",
        yLabel: "P",
        shape: "qualitative"
      },
      {
        id: "work-area",
        label: "Signed work area",
        xLabel: "V",
        yLabel: "P",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Animation time parametrizes a quasistatic path; it is not a model of finite-rate heat transfer."
    ]
  },
  "echo-speed-sound": {
    experimentId: "echo-speed-sound",
    formulaName: "Echo timing and dry-air sound speed",
    formula: "v=2d/delta-t; v(T)=331.3 sqrt((T+273.15)/273.15)",
    status: statusForBenchmarks(echoSpeedSoundBenchmarks),
    assumptions: [
      "Source and timing detector are treated as colocated, so the measured delay spans a complete wall round trip.",
      "Air is dry and still; the temperature relation is an ideal-gas acoustic approximation.",
      "A distinct human-perception echo requires approximately 0.10 seconds separation."
    ],
    inputUnits: [
      si("distance", "Wall distance", "m"),
      si("temperature", "Air temperature", "\xB0C", "K"),
      si("echoDelay", "Echo delay", "ms", "s")
    ],
    outputUnits: [
      si("soundSpeed", "Speed of sound", "m/s"),
      si("roundTrip", "Round-trip distance", "m")
    ],
    validRanges: [
      { id: "distance", label: "Wall distance", min: 5, max: 80, unit: "m" },
      {
        id: "temperature",
        label: "Air temperature",
        min: -10,
        max: 40,
        unit: "\xB0C"
      }
    ],
    benchmarkCases: echoSpeedSoundBenchmarks,
    tolerance: 1e-6,
    graphExpectations: [
      {
        id: "echo-trace",
        label: "Microphone time trace",
        xLabel: "time",
        yLabel: "pressure",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The 0.10 s distinct-echo threshold is perceptual guidance, not a sharp physical boundary."
    ]
  },
  "em-spectrum": {
    experimentId: "em-spectrum",
    formulaName: "Electromagnetic wave and photon relations",
    formula: "v=f lambda; E=hf; v=c/n",
    status: statusForBenchmarks(emSpectrumBenchmarks),
    assumptions: [
      "Media are treated as transparent, homogeneous and non-dispersive with a fixed refractive index.",
      "Frequency and photon energy remain unchanged at a medium boundary; speed and wavelength change.",
      "Band edges are conventional approximate boundaries rather than sharp natural divisions."
    ],
    inputUnits: [
      si("frequency", "Frequency", "Hz"),
      si("index", "Refractive index", "unitless"),
      si("amplitude", "Field amplitude", "%", "relative")
    ],
    outputUnits: [
      si("wavelength", "Wavelength", "m"),
      si("energy", "Photon energy", "eV", "J"),
      si("speed", "Wave speed", "m/s")
    ],
    validRanges: [
      { id: "frequency", label: "Frequency", min: 1e6, max: 1e20, unit: "Hz" }
    ],
    benchmarkCases: emSpectrumBenchmarks,
    tolerance: 1e-7,
    graphExpectations: [
      {
        id: "log-spectrum",
        label: "Log-frequency spectrum",
        xLabel: "log10 frequency",
        yLabel: "band",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The displayed wave spacing is a logarithmic visual encoding, not a to-scale drawing of wavelength."
    ]
  },
  "polarization-lab": {
    experimentId: "polarization-lab",
    formulaName: "Ideal polarizers and Malus's law",
    formula: "I=I_p cos^2(theta)",
    status: statusForBenchmarks(polarizationBenchmarks),
    assumptions: [
      "Polarizers are ideal and lossless apart from polarization selection.",
      "Unpolarized and circular input each deliver half their intensity after an ideal linear polarizer.",
      "Linear input is defined at zero degrees; axes repeat every 180 degrees."
    ],
    inputUnits: [
      si("intensity", "Input intensity", "mW", "W"),
      si("polarizer", "Polarizer angle", "deg", "rad"),
      si("analyzer", "Analyzer angle", "deg", "rad")
    ],
    outputUnits: [
      si("transmitted", "Transmitted intensity", "mW", "W"),
      si("fraction", "Analyzer transmission", "%", "fraction")
    ],
    validRanges: [
      {
        id: "intensity",
        label: "Input intensity",
        min: 0.1,
        max: 2,
        unit: "mW"
      },
      { id: "angle", label: "Optic axis angle", min: 0, max: 180, unit: "deg" }
    ],
    benchmarkCases: polarizationBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "malus-curve",
        label: "Transmission versus relative angle",
        xLabel: "angle",
        yLabel: "I/I_p",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The animated field amplitude is visually enlarged and is not drawn to physical scale."
    ]
  },
  "glass-slab-refraction": {
    experimentId: "glass-slab-refraction",
    formulaName: "Snell refraction and parallel-slab displacement",
    formula: "n1 sin(i)=n2(lambda) sin(r); e=i; d=t sin(i-r)/cos(r)",
    status: statusForBenchmarks(glassSlabBenchmarks),
    assumptions: [
      "The slab faces are plane, parallel, and surrounded by the same medium on both sides.",
      "The ray is paraxial only in width; geometric optics and a Cauchy-like normal-dispersion approximation are used.",
      "Angles are measured from each surface normal."
    ],
    inputUnits: [
      si("incidence", "Incidence angle", "deg", "rad"),
      si("index", "Reference refractive index", "unitless"),
      si("wavelength", "Vacuum wavelength", "nm", "m"),
      si("thickness", "Slab thickness", "cm", "m")
    ],
    outputUnits: [
      si("refraction", "Refraction angle", "deg", "rad"),
      si("emergence", "Emergence angle", "deg", "rad"),
      si("shift", "Lateral displacement", "cm", "m"),
      si("speed", "Light speed in slab", "m/s")
    ],
    validRanges: [
      {
        id: "incidence",
        label: "Incidence angle",
        min: 0,
        max: 75,
        unit: "deg"
      },
      {
        id: "index",
        label: "Reference refractive index",
        min: 1.3,
        max: 1.8,
        unit: "unitless"
      },
      { id: "wavelength", label: "Wavelength", min: 405, max: 650, unit: "nm" },
      {
        id: "thickness",
        label: "Slab thickness",
        min: 0.5,
        max: 3,
        unit: "cm"
      }
    ],
    benchmarkCases: glassSlabBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The wavelength correction is a representative crown-glass dispersion model; real glass requires measured Sellmeier coefficients."
    ]
  },
  "human-eye-defects": {
    experimentId: "human-eye-defects",
    formulaName: "Reduced eye and corrective-lens power",
    formula: "Ptotal=Peye+Paccommodation+Pcorrection; 1/f=1/u+1/v; P=1/f",
    status: statusForBenchmarks(humanEyeDefectsBenchmarks),
    assumptions: [
      "The cornea and crystalline lens are represented by one thin equivalent lens.",
      "The retina is fixed 17 mm behind the equivalent lens.",
      "Corrective-lens vertex distance is neglected in the school-level model."
    ],
    inputUnits: [
      si("objectDistance", "Object distance", "m"),
      si("eyePower", "Relaxed eye power", "D", "1/m"),
      si("accommodation", "Accommodation", "D", "1/m"),
      si("correction", "Corrective-lens power", "D", "1/m")
    ],
    outputUnits: [
      si("imageDistance", "Image distance", "mm", "m"),
      si("focusError", "Retinal focus error", "mm", "m"),
      si("farPoint", "Far point", "m"),
      si("nearPoint", "Near point", "cm", "m")
    ],
    validRanges: [
      {
        id: "objectDistance",
        label: "Object distance",
        min: 0.25,
        max: 10,
        unit: "m"
      },
      {
        id: "eyePower",
        label: "Relaxed eye power",
        min: 52,
        max: 66,
        unit: "D"
      },
      {
        id: "accommodation",
        label: "Accommodation",
        min: 0,
        max: 10,
        unit: "D"
      },
      {
        id: "correction",
        label: "Corrective-lens power",
        min: -8,
        max: 8,
        unit: "D"
      }
    ],
    benchmarkCases: humanEyeDefectsBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "This reduced-eye teaching model does not replace a clinical refraction or prescription."
    ]
  },
  "lens-formula": {
    experimentId: "lens-formula",
    formulaName: "Cartesian thin-lens equation and magnification",
    formula: "1/f=1/v-1/u; m=v/u=hi/ho; P=1/f(m)",
    status: statusForBenchmarks(lensFormulaBenchmarks),
    assumptions: [
      "The lens is thin and paraxial rays are used.",
      "Light travels left to right; distances are signed from the optical centre.",
      "Aberration and diffraction are omitted."
    ],
    inputUnits: [
      si("objectDistance", "Object distance magnitude", "cm", "m"),
      si("focalLength", "Focal length magnitude", "cm", "m"),
      si("objectHeight", "Object height", "cm", "m")
    ],
    outputUnits: [
      si("imageDistance", "Signed image distance", "cm", "m"),
      si("imageHeight", "Signed image height", "cm", "m"),
      si("magnification", "Magnification", "unitless"),
      si("power", "Lens power", "D", "1/m")
    ],
    validRanges: [
      {
        id: "objectDistance",
        label: "Object distance magnitude",
        min: 10,
        max: 80,
        unit: "cm"
      },
      {
        id: "focalLength",
        label: "Focal length magnitude",
        min: 5,
        max: 30,
        unit: "cm"
      },
      {
        id: "objectHeight",
        label: "Object height",
        min: 1,
        max: 5,
        unit: "cm"
      }
    ],
    benchmarkCases: lensFormulaBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The thin-lens diagram neglects aberrations and finite lens thickness."
    ]
  },
  "mirror-formula": {
    experimentId: "mirror-formula",
    formulaName: "New Cartesian spherical-mirror formula",
    formula: "1/f=1/v+1/u; m=-v/u=h'/h; R=2f",
    status: statusForBenchmarks(mirrorFormulaBenchmarks),
    assumptions: [
      "Paraxial rays and a spherical mirror are used.",
      "Distances are measured from the pole; rightward is positive.",
      "The object is on the incident-light side, so u is negative."
    ],
    inputUnits: [
      si("objectDistanceCm", "Object distance magnitude", "cm", "m"),
      si("focalLengthCm", "Focal length magnitude", "cm", "m"),
      si("objectHeightCm", "Object height", "cm", "m")
    ],
    outputUnits: [
      si("imageDistanceCm", "Signed image distance", "cm", "m"),
      si("imageHeightCm", "Signed image height", "cm", "m"),
      si("magnification", "Signed magnification", "unitless")
    ],
    validRanges: [
      {
        id: "objectDistanceCm",
        label: "Object distance",
        min: 10,
        max: 100,
        unit: "cm"
      },
      {
        id: "focalLengthCm",
        label: "Focal length",
        min: 10,
        max: 40,
        unit: "cm"
      },
      {
        id: "objectHeightCm",
        label: "Object height",
        min: 1,
        max: 7,
        unit: "cm"
      }
    ],
    benchmarkCases: mirrorFormulaBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "u-v",
        label: "Signed image distance vs signed object distance",
        xLabel: "u",
        yLabel: "v",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The paraxial model omits spherical aberration and finite-thickness effects."
    ]
  },
  "prism-dispersion": {
    experimentId: "prism-dispersion",
    formulaName: "Two-face prism refraction and Cauchy dispersion",
    formula: "sin(i)=n sin(r1); r1+r2=A; sin(e)=n sin(r2); delta=i+e-A",
    status: statusForBenchmarks(prismDispersionBenchmarks),
    assumptions: [
      "Plane prism faces and geometric-optics rays.",
      "Air refractive index is one.",
      "Material dispersion uses a two-term Cauchy teaching fit over visible wavelengths."
    ],
    inputUnits: [
      si("apexAngle", "Prism apex angle", "degrees", "rad"),
      si("incidenceAngle", "Angle of incidence", "degrees", "rad"),
      si("wavelength", "Vacuum wavelength", "nm", "m")
    ],
    outputUnits: [
      si("refractiveIndex", "Refractive index", "unitless"),
      si("deviation", "Deviation angle", "degrees", "rad"),
      si(
        "angularDispersion",
        "Violet-red angular dispersion",
        "degrees",
        "rad"
      )
    ],
    validRanges: [
      {
        id: "apexAngle",
        label: "Apex angle",
        min: 30,
        max: 75,
        unit: "degrees"
      },
      {
        id: "incidenceAngle",
        label: "Incidence angle",
        min: 20,
        max: 75,
        unit: "degrees"
      },
      {
        id: "wavelength",
        label: "Wavelength",
        min: 410,
        max: 706.5,
        unit: "nm"
      }
    ],
    benchmarkCases: prismDispersionBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "n-lambda",
        label: "Index vs wavelength",
        xLabel: "wavelength",
        yLabel: "refractive index",
        direction: "decreasing"
      }
    ],
    warnings: [
      "The Cauchy coefficients are a visible-range teaching approximation; the ray model omits diffraction and absorption."
    ]
  },
  "total-internal-reflection": {
    experimentId: "total-internal-reflection",
    formulaName: "Snell refraction, Fresnel power, and critical angle",
    formula: "n1 sin(theta_i)=n2 sin(theta_t); theta_c=asin(n2/n1); R+T=1",
    status: statusForBenchmarks(totalInternalReflectionBenchmarks),
    assumptions: [
      "Geometric optics at a lossless, planar boundary between isotropic media.",
      "Displayed reflectance is the unpolarized average of s and p Fresnel power reflectance.",
      "The fibre bend model applies a stated local-incidence penalty for a teaching-scale curved core."
    ],
    inputUnits: [
      si("incidenceAngle", "Angle of incidence", "degrees", "rad"),
      si("n1", "Inside refractive index", "unitless"),
      si("n2", "Outside refractive index", "unitless"),
      si("wavelength", "Vacuum wavelength", "nm", "m")
    ],
    outputUnits: [
      si("criticalAngle", "Critical angle", "degrees", "rad"),
      si("transmissionAngle", "Transmission angle", "degrees", "rad"),
      si("reflectance", "Power reflectance", "percent", "ratio"),
      si("transmittance", "Power transmittance", "percent", "ratio")
    ],
    validRanges: [
      {
        id: "incidenceAngle",
        label: "Incidence angle",
        min: 0,
        max: 89,
        unit: "degrees"
      },
      {
        id: "n1",
        label: "Inside refractive index",
        min: 1.1,
        max: 1.8,
        unit: "unitless"
      },
      {
        id: "n2",
        label: "Outside refractive index",
        min: 1,
        max: 1.6,
        unit: "unitless"
      },
      { id: "wavelength", label: "Wavelength", min: 400, max: 700, unit: "nm" }
    ],
    benchmarkCases: totalInternalReflectionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "reflectance-incidence",
        label: "Reflectance vs incidence",
        xLabel: "incidence angle",
        yLabel: "reflectance",
        direction: "increasing"
      }
    ],
    warnings: [
      "The fibre bend penalty is a qualitative local-ray model, not a full electromagnetic waveguide solver."
    ]
  },
  "reflection-plane-mirror": {
    experimentId: "reflection-plane-mirror",
    formulaName: "Vector reflection and finite plane-mirror visibility",
    formula: "d_reflected=d_incident-2(d_incident\xB7n)n; P_image=P-2(P\xB7n)n",
    status: statusForBenchmarks(reflectionPlaneMirrorBenchmarks),
    assumptions: [
      "The mirror is planar, specular, and centred at the origin.",
      "Rays have zero thickness and travel in a two-dimensional horizontal plane.",
      "Visibility requires the sightline to intersect the finite mirror segment."
    ],
    inputUnits: [
      si("mirrorAngle", "Mirror angle", "degrees", "rad"),
      si("objectPosition", "Object position", "cm", "m"),
      si("rayAngle", "Incident-ray direction", "degrees", "rad"),
      si("observerPosition", "Observer position", "cm", "m")
    ],
    outputUnits: [
      si("incidenceAngle", "Angle of incidence", "degrees", "rad"),
      si("reflectionAngle", "Angle of reflection", "degrees", "rad"),
      si("imageDistance", "Perpendicular image distance", "cm", "m"),
      si("observerMiss", "Observer distance from reflected ray", "cm", "m")
    ],
    validRanges: [
      {
        id: "mirrorAngle",
        label: "Mirror angle",
        min: -20,
        max: 20,
        unit: "degrees"
      },
      {
        id: "objectX",
        label: "Object x position",
        min: -18,
        max: -4,
        unit: "cm"
      },
      {
        id: "objectY",
        label: "Object y position",
        min: -8,
        max: 8,
        unit: "cm"
      },
      {
        id: "rayAngle",
        label: "Ray direction",
        min: -35,
        max: 35,
        unit: "degrees"
      },
      {
        id: "observerX",
        label: "Observer x position",
        min: -18,
        max: -4,
        unit: "cm"
      },
      {
        id: "observerY",
        label: "Observer y position",
        min: -9,
        max: 9,
        unit: "cm"
      }
    ],
    benchmarkCases: reflectionPlaneMirrorBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The ray construction is a top-down geometric-optics model; diffraction, mirror thickness, and eye aperture are omitted."
    ]
  },
  "shadows-eclipses": {
    experimentId: "shadows-eclipses",
    formulaName: "Angular-size and finite-source eclipse geometry",
    formula: "theta=2 atan(R/d); L_umbra=d R_occ/(R_source-R_occ)",
    status: statusForBenchmarks(shadowsEclipsesBenchmarks),
    assumptions: [
      "The Sun, Earth, and Moon are spherical and light travels in straight lines.",
      "Astronomical calculations use mean centre-to-centre distances and a two-dimensional alignment plane.",
      "Observer latitude contributes lunar horizontal parallax; solar parallax is neglected at this scale."
    ],
    inputUnits: [
      si("sunRadiusScale", "Sun-radius scale", "ratio"),
      si("moonDistanceScale", "Moon-distance scale", "ratio"),
      si("alignment", "Orbital alignment", "degrees", "rad"),
      si("observerLatitude", "Observer latitude", "degrees", "rad")
    ],
    outputUnits: [
      si("sunAngularDiameter", "Sun angular diameter", "degrees", "rad"),
      si("moonAngularDiameter", "Moon angular diameter", "degrees", "rad"),
      si("apparentSeparation", "Apparent centre separation", "degrees", "rad"),
      si("umbraRadius", "Umbra radius at target", "km", "m")
    ],
    validRanges: [
      {
        id: "sunRadiusScale",
        label: "Sun size",
        min: 0.8,
        max: 1.2,
        unit: "ratio"
      },
      {
        id: "moonDistanceScale",
        label: "Moon distance",
        min: 0.85,
        max: 1.15,
        unit: "ratio"
      },
      {
        id: "alignment",
        label: "Alignment",
        min: -1.2,
        max: 1.2,
        unit: "degrees"
      },
      {
        id: "observerLatitude",
        label: "Observer latitude",
        min: -60,
        max: 60,
        unit: "degrees"
      }
    ],
    benchmarkCases: shadowsEclipsesBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [],
    warnings: [
      "The astronomical stage is schematic and not to visual scale; calculations use stated physical radii and mean distances."
    ]
  },
  "multiple-reflection": {
    experimentId: "multiple-reflection",
    formulaName: "Conditional image count for two inclined plane mirrors",
    formula: "N=360\xB0/theta-1 for exact even/centered sectors; otherwise N=floor(360\xB0/theta)",
    status: statusForBenchmarks(multipleReflectionBenchmarks),
    assumptions: [
      "Ideal plane mirrors meet along one line.",
      "The standard finite image-count rule assumes an object between the mirrors.",
      "The odd-integer case depends on whether the object lies on the angle bisector."
    ],
    inputUnits: [
      si("angleDeg", "Angle between mirrors", "degrees", "rad"),
      si("radiusCm", "Object distance from vertex", "cm", "m"),
      si("positionPercent", "Object position across wedge", "%")
    ],
    outputUnits: [
      si("imageCount", "Virtual image count", "count"),
      si("symmetryOrder", "Rotational symmetry order", "count")
    ],
    validRanges: [
      {
        id: "angleDeg",
        label: "Mirror angle",
        min: 30,
        max: 120,
        unit: "degrees"
      },
      {
        id: "radiusCm",
        label: "Object radial position",
        min: 2,
        max: 10,
        unit: "cm"
      },
      {
        id: "positionPercent",
        label: "Position across wedge",
        min: 10,
        max: 90,
        unit: "%"
      }
    ],
    benchmarkCases: multipleReflectionBenchmarks,
    tolerance: 0,
    graphExpectations: [],
    warnings: [
      "A three-mirror kaleidoscope forms an extended tiling; the finite N count displayed is explicitly the active two-mirror wedge result."
    ]
  },
  "optical-instruments": {
    experimentId: "optical-instruments",
    formulaName: "Compound microscope and astronomical telescope magnification",
    formula: "Mmic=m_o M_e; m_o=-v_o/u_o; Mtel=-f_o/f_e; Lnormal=f_o+f_e",
    status: statusForBenchmarks(opticalInstrumentsBenchmarks),
    assumptions: [
      "Thin paraxial objective and eyepiece lenses.",
      "The astronomical telescope uses two converging lenses and gives an inverted final image.",
      "The conventional least distance of distinct vision is D=250 mm."
    ],
    inputUnits: [
      si("objectiveFocalMm", "Objective focal length", "mm", "m"),
      si("eyepieceFocalMm", "Eyepiece focal length", "mm", "m"),
      si("tubeLengthMm", "Objective-eyepiece separation", "mm", "m"),
      si("focusOffsetMm", "Fine-focus displacement", "mm", "m")
    ],
    outputUnits: [
      si("magnification", "Signed total magnification", "unitless"),
      si("focusErrorMm", "Signed focus error", "mm", "m"),
      si("resolutionUm", "Microscope diffraction resolution", "um", "m")
    ],
    validRanges: [
      {
        id: "objectiveFocalMm",
        label: "Objective focal length",
        min: 5,
        max: 800,
        unit: "mm"
      },
      {
        id: "eyepieceFocalMm",
        label: "Eyepiece focal length",
        min: 10,
        max: 50,
        unit: "mm"
      },
      {
        id: "tubeLengthMm",
        label: "Tube length",
        min: 90,
        max: 850,
        unit: "mm"
      }
    ],
    benchmarkCases: opticalInstrumentsBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [],
    warnings: [
      "The paraxial model omits aberrations; microscope resolution uses Rayleigh's criterion at 550 nm."
    ]
  },
  "free-fall": {
    experimentId: "free-fall",
    formulaName: "Vertical motion under gravity",
    formula: "y=y0+v0t\u2212\xBDgt\xB2; v=v0\u2212gt; a=\u2212g",
    status: statusForBenchmarks(freeFallBenchmarks),
    assumptions: [
      "Upward is positive.",
      "Ideal mode uses uniform gravity and neglects drag.",
      "Air-resistance mode uses deterministic quadratic drag."
    ],
    inputUnits: [
      si("height", "Initial height", "m"),
      si("velocity", "Initial velocity", "m/s"),
      si("gravity", "Gravity", "m/s\xB2")
    ],
    outputUnits: [
      si("position", "Height", "m"),
      si("velocity-out", "Velocity", "m/s"),
      si("acceleration", "Acceleration", "m/s\xB2"),
      si("time", "Impact time", "s")
    ],
    validRanges: [
      { id: "height", label: "Initial height", min: 2, max: 50, unit: "m" },
      {
        id: "velocity",
        label: "Initial velocity",
        min: -15,
        max: 15,
        unit: "m/s"
      },
      { id: "gravity", label: "Gravity", min: 1.62, max: 24.79, unit: "m/s\xB2" }
    ],
    benchmarkCases: freeFallBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "position-time",
        label: "Position versus time",
        xLabel: "Time (s)",
        yLabel: "Height (m)",
        shape: "quadratic"
      }
    ],
    warnings: [
      "The optional drag coefficient is a simplified teaching value, not a selected object's measured ballistic coefficient."
    ]
  },
  "distance-time-graph": {
    experimentId: "distance-time-graph",
    formulaName: "Piecewise distance-time slope",
    formula: "speed=\u0394d/\u0394t",
    status: statusForBenchmarks(distanceTimeBenchmarks),
    assumptions: [
      "Each segment has constant speed and positive duration.",
      "Distance-only mode forbids negative slope; position mode permits return motion.",
      "Adjacent segments share endpoints, so instantaneous distance jumps are impossible."
    ],
    inputUnits: [
      si("duration", "Segment duration", "s"),
      si("slope", "Segment slope", "m/s")
    ],
    outputUnits: [
      si("distance", "Distance or position", "m"),
      si("speed", "Segment speed", "m/s")
    ],
    validRanges: [
      {
        id: "duration",
        label: "Segment duration",
        min: 0.5,
        max: 8,
        unit: "s"
      },
      { id: "speed", label: "Segment speed", min: -5, max: 5, unit: "m/s" }
    ],
    benchmarkCases: distanceTimeBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "piecewise",
        label: "Continuous piecewise linear journey",
        xLabel: "Time (s)",
        yLabel: "Distance / position (m)",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Negative slopes describe position returning toward the origin, not accumulated path distance."
    ]
  },
  "balanced-unbalanced-forces": {
    experimentId: "balanced-unbalanced-forces",
    formulaName: "Newton's second law with friction",
    formula: "\u03A3Fx=Fright\u2212Fleft+Ffriction=ma; N\u2212mg=0",
    status: statusForBenchmarks(balancedForcesBenchmarks2),
    assumptions: [
      "The track is horizontal, so normal force equals weight.",
      "Kinetic friction opposes velocity; static friction opposes impending motion up to its limit.",
      "Forces are collinear and the cart is represented as a particle in translation."
    ],
    inputUnits: [
      si("left-force", "Left force", "N"),
      si("right-force", "Right force", "N"),
      si("mass", "Cart mass", "kg"),
      si("friction", "Friction coefficient", "dimensionless")
    ],
    outputUnits: [
      si("net-force", "Net force", "N"),
      si("acceleration", "Acceleration", "m/s\xB2"),
      si("velocity", "Velocity", "m/s")
    ],
    validRanges: [
      { id: "force", label: "Applied force", min: 0, max: 300, unit: "N" },
      { id: "mass", label: "Cart mass", min: 10, max: 100, unit: "kg" },
      {
        id: "friction",
        label: "Friction coefficient",
        min: 0,
        max: 0.5,
        unit: "dimensionless"
      }
    ],
    benchmarkCases: balancedForcesBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "velocity-time",
        label: "Velocity history",
        xLabel: "Time (s)",
        yLabel: "Velocity (m/s)",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The surface presets use simplified representative friction coefficients, not material-pair reference data."
    ]
  },
  "measurement-errors": {
    experimentId: "measurement-errors",
    formulaName: "Repeated measurement and uncertainty",
    formula: "xbar=\u03A3xi/n; \u0394x=sqrt[(s/sqrt(n))\xB2+(LC/2)\xB2]; \u0394A/A=2\u0394x/x",
    status: statusForBenchmarks(measurementErrorBenchmarks2),
    assumptions: [
      "Instrument resolution is represented by half the selected least count.",
      "Independent random and instrument uncertainties combine in quadrature.",
      "The area example uses A=x\xB2 with first-order propagation."
    ],
    inputUnits: [
      si("dimension", "True dimension", "mm", "m"),
      si("least-count", "Least count", "mm", "m"),
      si("zero-error", "Zero error", "mm", "m")
    ],
    outputUnits: [
      si("mean", "Corrected mean", "mm", "m"),
      si("uncertainty", "Combined uncertainty", "mm", "m"),
      si("percentage", "Percentage error", "%")
    ],
    validRanges: [
      { id: "dimension", label: "True dimension", min: 5, max: 80, unit: "mm" },
      {
        id: "least-count",
        label: "Least count",
        min: 0.01,
        max: 1,
        unit: "mm"
      },
      {
        id: "trials",
        label: "Repeated trials",
        min: 1,
        max: 12,
        unit: "readings"
      }
    ],
    benchmarkCases: measurementErrorBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "trials",
        label: "Repeated corrected readings",
        xLabel: "Trial",
        yLabel: "Length (mm)",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Trial scatter is deterministic for reproducible teaching; real instruments also include calibration and operator effects."
    ]
  },
  "computational-physics-workflow": {
    experimentId: "computational-physics-workflow",
    formulaName: "Numerical model-discretize-solve-verify workflow",
    formula: "error=RMS(unumerical-ureference); \u03BB=\u03B1\u0394t/\u0394x\xB2\u22641/2 for FTCS",
    status: statusForBenchmarks(computationalWorkflowBenchmarks2),
    assumptions: [
      "The diffusion reference is the decaying sine eigenmode on a unit interval.",
      "The oscillator reference is x(t)=cos(t).",
      "Work cost counts grid updates and solver iterations rather than wall-clock hardware time."
    ],
    inputUnits: [
      si("mesh", "Mesh cells", "cells"),
      si("time-step", "Time step", "s"),
      si("tolerance", "Solver tolerance", "dimensionless")
    ],
    outputUnits: [
      si("error", "RMS error", "m"),
      si("cost", "Compute cost", "work units")
    ],
    validRanges: [
      { id: "mesh", label: "Mesh cells", min: 10, max: 80, unit: "cells" },
      {
        id: "time-step",
        label: "Time step",
        min: 5e-4,
        max: 0.02,
        unit: "s"
      },
      {
        id: "tolerance",
        label: "Tolerance",
        min: 1e-7,
        max: 1e-3,
        unit: "dimensionless"
      }
    ],
    benchmarkCases: computationalWorkflowBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "convergence",
        label: "RMS error versus timestep",
        xLabel: "\u0394t (s)",
        yLabel: "RMS error",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Runtime cost is deterministic algorithmic work, not a benchmark of the learner's device."
    ]
  },
  "magnetic-field-current": {
    experimentId: "magnetic-field-current",
    formulaName: "Magnetic field of wires and coils",
    formula: "Bwire=\u03BC0I/(2\u03C0r); Bloop=\u03BC0IR\xB2/[2(R\xB2+x\xB2)^(3/2)]; Bsolenoid\u2248\u03BC0(N/L)I",
    status: statusForBenchmarks(magneticFieldCurrentBenchmarks2),
    assumptions: [
      "The straight conductors are long relative to probe distance.",
      "The loop and finite solenoid share a central symmetry axis.",
      "Fields superpose component by component in air."
    ],
    inputUnits: [
      si("current", "Conventional current", "A"),
      si("probe-x", "Probe x position", "cm", "m"),
      si("probe-y", "Probe y position", "cm", "m")
    ],
    outputUnits: [
      si("field", "Magnetic flux density", "\u03BCT", "T"),
      si("angle", "Field direction", "\xB0", "rad")
    ],
    validRanges: [
      { id: "current", label: "Current", min: 0, max: 5, unit: "A" },
      { id: "probe-x", label: "Probe x", min: -0.1, max: 0.1, unit: "m" },
      { id: "probe-y", label: "Probe y", min: -0.1, max: 0.1, unit: "m" }
    ],
    benchmarkCases: magneticFieldCurrentBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "field-distance",
        label: "Straight-wire field versus distance",
        xLabel: "Distance (m)",
        yLabel: "B (T)",
        shape: "inverse"
      }
    ],
    warnings: [
      "The solenoid uses an on-axis finite-length expression; fringe fields and compass disturbance are omitted."
    ]
  },
  "lorentz-force": {
    experimentId: "lorentz-force",
    formulaName: "Electric and magnetic Lorentz force",
    formula: "F\u20D7=q(E\u20D7+v\u20D7\xD7B\u20D7); r=mv\u22A5/(|q|B); vselector=E/B",
    status: statusForBenchmarks(lorentzForceBenchmarks2),
    assumptions: [
      "Uniform crossed electric and magnetic fields act in a vacuum chamber.",
      "Relativistic corrections, radiation and collisions are negligible over the displayed speed range.",
      "Trajectory samples use deterministic fourth-order Runge\u2013Kutta integration in SI units."
    ],
    inputUnits: [
      si("speed", "Particle speed", "m/s"),
      si("electric-field", "Electric field", "N/C"),
      si("magnetic-field", "Magnetic flux density", "T"),
      si("angle", "Velocity angle to B", "\xB0", "rad")
    ],
    outputUnits: [
      si("force", "Lorentz force", "N"),
      si("radius", "Magnetic radius", "m"),
      si("period", "Cyclotron period", "s")
    ],
    validRanges: [
      { id: "speed", label: "Speed", min: 5e5, max: 5e6, unit: "m/s" },
      {
        id: "electric-field",
        label: "Electric field",
        min: -5e5,
        max: 5e5,
        unit: "N/C"
      },
      {
        id: "magnetic-field",
        label: "Magnetic field",
        min: -0.5,
        max: 0.5,
        unit: "T"
      },
      { id: "angle", label: "Velocity angle", min: 0, max: 180, unit: "\xB0" }
    ],
    benchmarkCases: lorentzForceBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "trajectory",
        label: "Integrated particle trajectory",
        xLabel: "position (m)",
        yLabel: "transverse position (m)",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The chamber projection is scaled to keep microscopic electron and macroscopic proton paths legible; numeric readouts remain in SI units."
    ]
  },
  electromagnet: {
    experimentId: "electromagnet",
    formulaName: "Electromagnet magnetic circuit",
    formula: "B\u2248\u03BC0NI/(g+\u2113core/\u03BCr); F\u2248B\xB2A/(2\u03BC0)",
    status: statusForBenchmarks(electromagnetBenchmarks2),
    assumptions: [
      "Uniform core cross-section and concentrated air gap.",
      "Material saturation is represented by a smooth tanh limit.",
      "Lift force includes a fixed contact/fringing efficiency for the classroom rig."
    ],
    inputUnits: [
      si("current", "Coil current", "A"),
      si("turns", "Coil turns", "turns"),
      si("gap", "Air gap", "mm", "m")
    ],
    outputUnits: [
      si("field", "Flux density", "T"),
      si("force", "Lift force", "N"),
      si("temperature", "Coil temperature", "\xB0C")
    ],
    validRanges: [
      { id: "current", label: "Current", min: 0, max: 5, unit: "A" },
      { id: "turns", label: "Turns", min: 100, max: 2e3, unit: "turns" },
      { id: "gap", label: "Air gap", min: 0, max: 10, unit: "mm" }
    ],
    benchmarkCases: electromagnetBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "field-current",
        label: "Flux density versus current",
        xLabel: "Current (A)",
        yLabel: "B (T)",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Lift count is an idealized static-contact estimate; leakage, hysteresis, washer geometry and transient mechanics are simplified."
    ]
  },
  "force-and-pressure": {
    experimentId: "force-and-pressure",
    formulaName: "Contact pressure",
    formula: "P=F/A; Ntotal=Fapplied",
    status: statusForBenchmarks(contactPressureBenchmarks),
    assumptions: [
      "Applied load is uniformly distributed over the stated contact area.",
      "The force is perpendicular to the surface.",
      "Material response is represented by small-strain P/E compression."
    ],
    inputUnits: [
      si("force", "Applied force", "N"),
      si("area", "Contact area", "m\xB2"),
      si("modulus", "Surface modulus", "Pa")
    ],
    outputUnits: [
      si("pressure", "Average pressure", "Pa"),
      si("deformation", "Surface deformation", "mm", "m")
    ],
    validRanges: [
      { id: "force", label: "Applied force", min: 0, max: 2e3, unit: "N" },
      { id: "area", label: "Contact area", min: 5e-3, max: 0.16, unit: "m\xB2" }
    ],
    benchmarkCases: contactPressureBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "pressure-area",
        label: "Pressure versus area",
        xLabel: "Area (m\xB2)",
        yLabel: "Pressure (Pa)",
        shape: "inverse"
      }
    ],
    warnings: [
      "The heatmap assumes uniform average loading; edge stress concentrations and nonlinear material behavior are omitted."
    ]
  },
  "fluid-pressure": {
    experimentId: "fluid-pressure",
    formulaName: "Hydrostatic pressure with depth",
    formula: "P=P0+\u03C1gh; vjet=\u221A(2gh)",
    status: statusForBenchmarks(fluidPressureBenchmarks),
    assumptions: [
      "Fluid is static, incompressible and of uniform density.",
      "Surface pressure is spatially uniform.",
      "Jet range neglects viscosity, contraction and air drag."
    ],
    inputUnits: [
      si("density", "Fluid density", "kg/m\xB3"),
      si("depth", "Depth below surface", "m"),
      si("gravity", "Gravity", "m/s\xB2"),
      si("surfacePressure", "Surface pressure", "kPa", "Pa")
    ],
    outputUnits: [
      si("pressure", "Pressure", "kPa", "Pa"),
      si("speed", "Jet speed", "m/s"),
      si("force", "Normal force", "kN", "N")
    ],
    validRanges: [
      { id: "density", label: "Density", min: 500, max: 1500, unit: "kg/m\xB3" },
      { id: "depth", label: "Depth", min: 0, max: 2, unit: "m" },
      { id: "gravity", label: "Gravity", min: 1.62, max: 24.79, unit: "m/s\xB2" }
    ],
    benchmarkCases: fluidPressureBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "pressure-depth",
        label: "Gauge pressure versus depth",
        xLabel: "Depth (m)",
        yLabel: "Pressure (kPa)",
        shape: "linear"
      }
    ],
    warnings: [
      "Dynamic fill, pressure-gradient reveal and jets are teaching animations; transient waves and viscous losses are omitted."
    ]
  },
  "density-float-sink": {
    experimentId: "density-float-sink",
    formulaName: "Density and layer-specific buoyancy",
    formula: "\u03C1=m/V; Fb=\u03C1fluid gVdisplaced; \u03A3Fy=Fb\u2212W",
    status: statusForBenchmarks(densityTankBenchmarks),
    assumptions: [
      "Fluid layers are immiscible and density-stratified.",
      "The object has uniform average density.",
      "Interface equilibrium uses a quasi-static two-fluid force balance."
    ],
    inputUnits: [
      si("mass", "Object mass", "g", "kg"),
      si("volume", "Object volume", "cm\xB3", "m\xB3"),
      si("density", "Fluid density", "kg/m\xB3"),
      si("depth", "Tank depth", "%", "fraction")
    ],
    outputUnits: [
      si("objectDensity", "Object density", "kg/m\xB3"),
      si("force", "Force", "N"),
      si("depth", "Equilibrium depth", "cm", "m")
    ],
    validRanges: [
      { id: "mass", label: "Mass", min: 10, max: 1e3, unit: "g" },
      { id: "volume", label: "Volume", min: 10, max: 1e3, unit: "cm\xB3" },
      {
        id: "fluidDensity",
        label: "Single-fluid density",
        min: 500,
        max: 1400,
        unit: "kg/m\xB3"
      }
    ],
    benchmarkCases: densityTankBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "Splash and damping are illustrative; drag coefficients, capillarity, mixing and exact shape-dependent hydrodynamics are omitted."
    ]
  },
  buoyancy: {
    experimentId: "buoyancy",
    formulaName: "Archimedes buoyant force and floating equilibrium",
    formula: "Fb=\u03C1fluid gVdisplaced; W=\u03C1object gVobject; Vdisplaced/Vobject=\u03C1object/\u03C1fluid at floating equilibrium",
    status: statusForBenchmarks(buoyancyBenchmarks2),
    assumptions: [
      "Fluid and object densities are uniform.",
      "The object remains upright and the water is incompressible.",
      "The floating-fraction relation applies only when object density does not exceed fluid density."
    ],
    inputUnits: [
      si("objectDensity", "Object density", "kg/m\xB3"),
      si("fluidDensity", "Fluid density", "kg/m\xB3"),
      si("volume", "Object volume", "cm\xB3", "m\xB3"),
      si("immersion", "Immersed fraction", "%", "fraction")
    ],
    outputUnits: [
      si("force", "Force", "N"),
      si("displacedVolume", "Displaced volume", "cm\xB3", "m\xB3"),
      si("floatingFraction", "Floating fraction", "%", "fraction")
    ],
    validRanges: [
      {
        id: "objectDensity",
        label: "Object density",
        min: 100,
        max: 8e3,
        unit: "kg/m\xB3"
      },
      {
        id: "fluidDensity",
        label: "Fluid density",
        min: 500,
        max: 1500,
        unit: "kg/m\xB3"
      },
      { id: "volume", label: "Object volume", min: 20, max: 500, unit: "cm\xB3" },
      {
        id: "immersion",
        label: "Immersed fraction",
        min: 0,
        max: 100,
        unit: "%"
      }
    ],
    benchmarkCases: buoyancyBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "force-immersion",
        label: "Force versus immersed fraction",
        xLabel: "Immersed fraction",
        yLabel: "Force (N)",
        shape: "linear"
      }
    ],
    warnings: [
      "Entry and settling animation is a damped teaching sequence; viscosity, added mass, waves, rotation and container-wall effects are omitted."
    ]
  },
  "bernoulli-fluid-flow": {
    experimentId: "bernoulli-fluid-flow",
    formulaName: "Continuity and Bernoulli streamline energy",
    formula: "A\u2081v\u2081=A\u2082v\u2082=A\u2083v\u2083=Q; P+\xBD\u03C1v\xB2+\u03C1gh=constant",
    status: statusForBenchmarks(bernoulliBenchmarks),
    assumptions: [
      "Steady, incompressible, inviscid flow.",
      "Stations lie along one streamline with no pump work or friction loss between them.",
      "Cavitation warning uses water vapor pressure 2.34 kPa absolute."
    ],
    inputUnits: [
      si("pressure", "Absolute inlet pressure", "kPa", "Pa"),
      si("flowRate", "Volumetric flow rate", "L/s", "m\xB3/s"),
      si("radius", "Pipe radius", "mm", "m"),
      si("density", "Fluid density", "kg/m\xB3"),
      si("elevation", "Elevation", "m")
    ],
    outputUnits: [
      si("velocity", "Flow velocity", "m/s"),
      si("pressure", "Station pressure", "kPa", "Pa"),
      si("energy", "Bernoulli energy density", "kPa", "Pa")
    ],
    validRanges: [
      {
        id: "pressure",
        label: "Inlet pressure",
        min: 20,
        max: 200,
        unit: "kPa abs"
      },
      { id: "flowRate", label: "Flow rate", min: 0.2, max: 3, unit: "L/s" },
      { id: "radius", label: "Pipe radius", min: 8, max: 40, unit: "mm" },
      { id: "density", label: "Density", min: 500, max: 1500, unit: "kg/m\xB3" },
      { id: "elevation", label: "Elevation", min: 0, max: 3, unit: "m" }
    ],
    benchmarkCases: bernoulliBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "station-pressure",
        label: "Pressure and speed by station",
        xLabel: "station",
        yLabel: "P, v",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Viscosity, turbulence, pipe loss, pump head between stations and vapor-pressure variation with temperature are omitted."
    ]
  },
  "sources-of-energy": {
    experimentId: "sources-of-energy",
    formulaName: "Hourly grid dispatch and storage energy balance",
    formula: "\u03A3Pgen+Pdischarge+Punmet=Pdemand+Pcharge; Estored=\u03B7cEcharge; Edelivered=\u03B7dEwithdrawn",
    status: statusForBenchmarks(energyGridBenchmarks),
    assumptions: [
      "Each time step represents one hour, so GW \xD7 1 h is GWh.",
      "Storage round-trip efficiency is 90%, split equally between charge and discharge.",
      "Emissions are lifecycle-average factors and costs are variable generation costs in 2026-independent teaching units."
    ],
    inputUnits: [
      si("capacity", "Installed capacity", "GW"),
      si("demand", "Demand", "GW"),
      si("storage", "Storage energy", "GWh"),
      si("reliability", "Reliability target", "%")
    ],
    outputUnits: [
      si("energy", "Daily energy", "GWh"),
      si("emissions", "CO\u2082e intensity", "g/kWh"),
      si("cost", "Average variable cost", "$/MWh"),
      si("reliability", "Served demand", "%")
    ],
    validRanges: [
      {
        id: "capacity",
        label: "Each source capacity",
        min: 0,
        max: 10,
        unit: "GW"
      },
      {
        id: "demandScale",
        label: "Demand scale",
        min: 50,
        max: 150,
        unit: "%"
      },
      {
        id: "storageCapacity",
        label: "Storage capacity",
        min: 0,
        max: 20,
        unit: "GWh"
      },
      {
        id: "storagePower",
        label: "Storage power",
        min: 0,
        max: 5,
        unit: "GW"
      }
    ],
    benchmarkCases: energyGridBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "daily-dispatch",
        label: "Generation and demand through one day",
        xLabel: "hour",
        yLabel: "GW",
        shape: "qualitative"
      }
    ],
    warnings: [
      "This is a deterministic one-day dispatch model; transmission constraints, start-up/ramp limits, capital costs, weather uncertainty and fuel supply are omitted."
    ]
  },
  "semiconductor-diode": {
    experimentId: "semiconductor-diode",
    formulaName: "Shockley diode and capacitor-filter rectifier",
    formula: "ID=Is(e^(VD/nVT)\u22121); VT=kT/q; fripple=f or 2f; Vr(pp)\u2248Iload/(fripple C)",
    status: statusForBenchmarks(diodeBenchmarks),
    assumptions: [
      "Silicon PN junction with ideality factor n=2 in the instructional Shockley model.",
      "Reverse breakdown is outside the \u22125 V explorer range.",
      "Rectifier source and capacitor are ideal apart from junction drops and the displayed diode limits."
    ],
    inputUnits: [
      si("biasVoltage", "Junction bias", "V"),
      si("temperature", "Temperature", "\xB0C", "K"),
      si("acAmplitude", "AC peak amplitude", "V"),
      si("load", "Load resistance", "\u03A9"),
      si("capacitance", "Filter capacitance", "\xB5F", "F")
    ],
    outputUnits: [
      si("current", "Junction current", "mA", "A"),
      si("depletionWidth", "Depletion width", "\xB5m", "m"),
      si("dcVoltage", "DC output", "V"),
      si("ripple", "Ripple peak-to-peak", "V")
    ],
    validRanges: [
      { id: "biasVoltage", label: "Bias voltage", min: -5, max: 1, unit: "V" },
      { id: "doping", label: "Doping factor", min: 0.5, max: 2, unit: "\xD7" },
      {
        id: "temperature",
        label: "Temperature",
        min: -20,
        max: 125,
        unit: "\xB0C"
      },
      { id: "load", label: "Load resistance", min: 100, max: 5e3, unit: "\u03A9" },
      {
        id: "capacitance",
        label: "Filter capacitance",
        min: 0,
        max: 2200,
        unit: "\xB5F"
      }
    ],
    benchmarkCases: diodeBenchmarks,
    tolerance: 0,
    graphExpectations: [
      {
        id: "iv",
        label: "Diode current versus voltage",
        xLabel: "VD",
        yLabel: "ID",
        shape: "exponential"
      },
      {
        id: "rectified-wave",
        label: "Rectified output versus time",
        xLabel: "t",
        yLabel: "V",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The compact model omits avalanche breakdown, series resistance, recovery time, transformer regulation and equivalent-series resistance of the filter capacitor."
    ]
  },
  "logic-gates": {
    experimentId: "logic-gates",
    formulaName: "Boolean logic and propagation delay",
    formula: "Y=f(A,B); Yobserved(t)=f[A(t\u2212tp),B(t\u2212tp)]",
    status: statusForBenchmarks(logicGatesBenchmarks),
    assumptions: [
      "Binary HIGH and LOW are ideal stable logic levels.",
      "A floating input is represented as unknown X, never silently coerced to LOW.",
      "Propagation delay is deterministic and equal for rising and falling edges in this instructional model."
    ],
    inputUnits: [
      si("logicLevel", "Logic input", "0/1/X"),
      si("clockRate", "Clock rate", "kHz", "Hz"),
      si("propagationDelay", "Propagation delay", "ns", "s")
    ],
    outputUnits: [si("logicOutput", "Logic output", "0/1/X")],
    validRanges: [
      { id: "clockRate", label: "Clock rate", min: 0.5, max: 5, unit: "kHz" },
      {
        id: "propagationDelay",
        label: "Propagation delay",
        min: 10,
        max: 500,
        unit: "ns"
      }
    ],
    benchmarkCases: logicGatesBenchmarks,
    tolerance: 0,
    graphExpectations: [
      {
        id: "timing",
        label: "Digital input and delayed output versus time",
        xLabel: "t",
        yLabel: "logic level",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The nanosecond delay is visually time-stretched; metastability, noise margins, fan-out and asymmetric edge delays are omitted."
    ]
  },
  "transformer-lab": {
    experimentId: "transformer-lab",
    formulaName: "Transformer turns, frequency and power relationships",
    formula: "Vs/Vp=Ns/Np; fp=fs; Pin=Pout+Pcore+Pcopper; \u03A6max=Vp/(4.44fNp)",
    status: statusForBenchmarks(transformerBenchmarks),
    assumptions: [
      "Sinusoidal steady-state AC and rms voltage readings.",
      "The induced winding emf follows the ideal turns ratio; terminal voltage additionally includes coupling and secondary winding resistance.",
      "Core and copper losses use a transparent educational lumped-parameter model."
    ],
    inputUnits: [
      si("primaryVoltage", "Primary rms voltage", "V"),
      si("frequency", "Supply frequency", "Hz"),
      si("turns", "Winding turns", "turns"),
      si("loadResistance", "Load resistance", "\u03A9")
    ],
    outputUnits: [
      si("secondaryVoltage", "Secondary rms voltage", "V"),
      si("current", "Winding current", "A"),
      si("power", "Power", "W"),
      si("flux", "Peak magnetic flux", "mWb", "Wb")
    ],
    validRanges: [
      {
        id: "primaryVoltage",
        label: "Primary voltage",
        min: 0,
        max: 240,
        unit: "V"
      },
      { id: "frequency", label: "Frequency", min: 20, max: 100, unit: "Hz" },
      {
        id: "primaryTurns",
        label: "Primary turns",
        min: 50,
        max: 1200,
        unit: "turns"
      },
      {
        id: "secondaryTurns",
        label: "Secondary turns",
        min: 20,
        max: 1200,
        unit: "turns"
      },
      {
        id: "loadResistance",
        label: "Load resistance",
        min: 5,
        max: 500,
        unit: "\u03A9"
      }
    ],
    benchmarkCases: transformerBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "voltage-time",
        label: "Primary and secondary sinusoidal voltage versus time",
        xLabel: "t",
        yLabel: "V",
        shape: "qualitative"
      }
    ],
    warnings: [
      "This is a steady-state instructional model; switching transients, saturation harmonics, leakage inductance and thermal runaway are omitted."
    ]
  },
  "static-electricity": {
    experimentId: "static-electricity",
    formulaName: "Charge transfer and Coulomb interaction",
    formula: "q=\xB1Ne; F=k|q\u2081q\u2082|/r\xB2; E=k|q|/r\xB2; \u03A3q=0",
    status: statusForBenchmarks(staticElectricityBenchmarks),
    assumptions: [
      "Only electrons transfer between materials; nuclei remain fixed.",
      "Objects are point charges for force and field magnitude.",
      "Dry-air breakdown is approximated at 3 MV/m."
    ],
    inputUnits: [
      si("rubbing", "Rubbing amount", "%"),
      si("separation", "Separation", "m")
    ],
    outputUnits: [
      si("charge", "Net charge", "\xB5C", "C"),
      si("force", "Coulomb force", "N"),
      si("electricField", "Electric field", "MV/m", "V/m")
    ],
    validRanges: [
      { id: "rubbing", label: "Rubbing", min: 0, max: 100, unit: "%" },
      { id: "separation", label: "Separation", min: 0.05, max: 2, unit: "m" }
    ],
    benchmarkCases: staticElectricityBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "force-distance",
        label: "Force versus separation",
        xLabel: "r",
        yLabel: "F",
        direction: "decreasing"
      }
    ],
    warnings: [
      "Electron packets are a visualization scale; packet count is not the literal microscopic electron count."
    ]
  },
  "series-parallel-resistance": {
    experimentId: "series-parallel-resistance",
    formulaName: "Series and parallel resistor networks",
    formula: "R_s=\u03A3R_i; 1/R_p=\u03A3(1/R_i); I=\u03A3I_i; P=VI=\u03A3I_i\xB2R_i",
    status: statusForBenchmarks(seriesParallelBenchmarks),
    assumptions: [
      "Resistors and source are ideal and ohmic.",
      "Closed switches have zero resistance and open switches infinite resistance.",
      "Connecting wires have negligible resistance."
    ],
    inputUnits: [
      si("voltage", "Source voltage", "V"),
      si("resistors", "Branch resistance", "\u03A9")
    ],
    outputUnits: [
      si("equivalentResistance", "Equivalent resistance", "\u03A9"),
      si("current", "Current", "A"),
      si("voltageDrop", "Voltage drop", "V"),
      si("power", "Power", "W")
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 24, unit: "V" },
      { id: "resistors", label: "Resistance", min: 1, max: 20, unit: "\u03A9" }
    ],
    benchmarkCases: seriesParallelBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "current-voltage",
        label: "Network current versus voltage",
        xLabel: "V",
        yLabel: "I",
        shape: "linear"
      }
    ],
    warnings: [
      "Component heating, source internal resistance, and wire/contact resistance are omitted."
    ]
  },
  "ohms-law": {
    experimentId: "ohms-law",
    formulaName: "Ohm's law and V-I slope",
    formula: "V=IR; for V versus I, slope \u0394V/\u0394I=R",
    status: statusForBenchmarks(ohmsLawBenchmarks),
    assumptions: [
      "Steady DC measurements.",
      "Ohmic materials have constant temperature coefficients at the selected temperature.",
      "The filament model includes a voltage-dependent hot resistance."
    ],
    inputUnits: [
      si("voltage", "Supply voltage", "V"),
      si("resistance", "Reference resistance", "\u03A9"),
      si("temperature", "Temperature", "\xB0C", "K")
    ],
    outputUnits: [
      si("current", "Current", "A"),
      si("effectiveResistance", "Effective resistance", "\u03A9"),
      si("power", "Power", "W")
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 12, unit: "V" },
      { id: "resistance", label: "Resistance", min: 1, max: 40, unit: "\u03A9" },
      {
        id: "temperature",
        label: "Temperature",
        min: -20,
        max: 200,
        unit: "\xB0C"
      }
    ],
    benchmarkCases: ohmsLawBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "voltage-current",
        label: "Voltage versus current",
        xLabel: "I (A)",
        yLabel: "V (V)",
        shape: "linear"
      }
    ],
    warnings: [
      "The filament curve is a deterministic classroom hot-resistance model, not a specific commercial lamp calibration."
    ]
  },
  "meter-bridge": {
    experimentId: "meter-bridge",
    formulaName: "Meter bridge null balance",
    formula: "X/R = l/(L-l); I_g=(V_D-V_J)/R_g",
    status: statusForBenchmarks(meterBridgeBenchmarks),
    assumptions: [
      "The bridge wire is uniform, so segment resistance is proportional to length.",
      "The cell and connecting leads are ideal; the galvanometer has finite resistance.",
      "The jockey makes contact no closer than 0.5 cm to either endpoint."
    ],
    inputUnits: [
      si("knownResistance", "Known resistance R", "\u03A9"),
      si("unknownResistance", "Unknown resistance X", "\u03A9"),
      si("wireLengthCm", "Bridge-wire length", "cm", "m"),
      si("jockeyPositionCm", "Jockey position", "cm", "m")
    ],
    outputUnits: [
      si("galvanometerCurrent", "Galvanometer current", "\xB5A", "A"),
      si("junctionPotential", "Branch potential", "V"),
      si("calculatedUnknown", "Calculated unknown resistance", "\u03A9")
    ],
    validRanges: [
      { id: "resistance", label: "Resistance", min: 1, max: 100, unit: "\u03A9" },
      {
        id: "wireLengthCm",
        label: "Wire length",
        min: 50,
        max: 200,
        unit: "cm"
      },
      {
        id: "jockeyPositionCm",
        label: "Jockey position",
        min: 0.5,
        unit: "cm"
      }
    ],
    benchmarkCases: meterBridgeBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "deflection-position",
        label: "Signed deflection vs position",
        xLabel: "l",
        yLabel: "I_g",
        direction: "increasing"
      }
    ],
    warnings: [
      "Real bridge-wire nonuniformity, lead resistance, thermoelectric offsets, and contact resistance are omitted."
    ]
  },
  "kirchhoff-circuit": {
    experimentId: "kirchhoff-circuit",
    formulaName: "Kirchhoff mesh equations",
    formula: "\u03A3I=0; \u03A3\u0394V=0; A\xB7I=E; P_sources=\u03A3I\xB2R",
    status: statusForBenchmarks(kirchhoffBenchmarks),
    assumptions: [
      "Sources are ideal DC voltage sources.",
      "Resistors are ohmic and wires have negligible resistance.",
      "The circuit is in steady state with no reactive components."
    ],
    inputUnits: [
      si("source1", "Source E1", "V"),
      si("source2", "Source E2", "V"),
      si("resistances", "Branch resistances", "\u03A9")
    ],
    outputUnits: [
      si("mesh1", "Left mesh current", "mA", "A"),
      si("mesh2", "Right mesh current", "mA", "A"),
      si("sharedCurrent", "Shared branch current", "mA", "A"),
      si("residual", "KCL/KVL residual", "V / A")
    ],
    validRanges: [
      { id: "source1", label: "Source E1", min: 0, max: 24, unit: "V" },
      { id: "source2", label: "Source E2", min: 0, max: 24, unit: "V" },
      {
        id: "resistances",
        label: "Branch resistance",
        min: 10,
        max: 1e3,
        unit: "\u03A9"
      }
    ],
    benchmarkCases: kirchhoffBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "signed-loop-ledger",
        label: "Cumulative signed loop voltage",
        xLabel: "traversal step",
        yLabel: "cumulative voltage",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The steady-state model omits source internal resistance, wire resistance, contact resistance, and transient effects."
    ]
  },
  "heating-effect-current": {
    experimentId: "heating-effect-current",
    formulaName: "Joule heating with thermal loss",
    formula: "H_in=I\xB2Rt; R(T)=R\u2080f_material(d\u2080/d)\xB2[1+\u03B1(T\u2212T\u2080)]; C dT/dt=I\xB2R\u2212k(T\u2212T_a)",
    status: statusForBenchmarks(heatingEffectBenchmarks),
    assumptions: [
      "The current source holds the selected current constant.",
      "Wire temperature is spatially uniform in this lumped thermal model.",
      "Convective and conductive losses are represented by a linear temperature-loss coefficient."
    ],
    inputUnits: [
      si("current", "Current", "A"),
      si("referenceResistance", "Reference resistance", "\u03A9"),
      si("diameter", "Wire diameter", "mm", "m"),
      si("duration", "Heating time", "s")
    ],
    outputUnits: [
      si("temperature", "Temperature", "\xB0C", "K"),
      si("power", "Electrical power", "W"),
      si("inputEnergy", "Electrical energy", "J"),
      si("heatLoss", "Thermal loss", "J")
    ],
    validRanges: [
      { id: "current", label: "Current", min: 0, max: 5, unit: "A" },
      {
        id: "referenceResistance",
        label: "Reference resistance",
        min: 0.5,
        max: 20,
        unit: "\u03A9"
      },
      { id: "diameter", label: "Wire diameter", min: 0.2, max: 2, unit: "mm" },
      { id: "duration", label: "Heating time", min: 10, max: 300, unit: "s" }
    ],
    benchmarkCases: heatingEffectBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "temperature-time",
        label: "Temperature and input energy versus time",
        xLabel: "time",
        yLabel: "temperature / energy",
        direction: "increasing"
      }
    ],
    warnings: [
      "The classroom model omits temperature gradients, boiling, changing heat capacity, radiation, and power-supply current limits."
    ]
  },
  "emi-faraday": {
    experimentId: "emi-faraday",
    formulaName: "Faraday-Lenz induction",
    formula: "\u03A6=BA exp[-(x/\u03C3)\xB2]; d\u03A6/dt=(d\u03A6/dx)v; \u03B5=-N d\u03A6/dt; I=\u03B5/R",
    status: statusForBenchmarks(emiFaradayBenchmarks2),
    assumptions: [
      "The axial field through the coil is represented by a smooth Gaussian profile.",
      "The magnet moves at constant selected speed during a pass.",
      "The circuit is purely resistive and self-inductance is neglected."
    ],
    inputUnits: [
      si("magnetStrength", "Magnet strength", "T"),
      si("speed", "Magnet speed", "m/s"),
      si("turns", "Coil turns", "turns", "1"),
      si("resistance", "Circuit resistance", "\u03A9"),
      si("position", "Magnet position", "cm", "m")
    ],
    outputUnits: [
      si("flux", "Magnetic flux", "mWb", "Wb"),
      si("fluxRate", "Flux rate", "Wb/s"),
      si("emf", "Induced emf", "V"),
      si("current", "Induced current", "A")
    ],
    validRanges: [
      {
        id: "magnetStrength",
        label: "Magnet strength",
        min: 0.1,
        max: 1.2,
        unit: "T"
      },
      { id: "speed", label: "Magnet speed", min: 0, max: 2, unit: "m/s" },
      { id: "turns", label: "Coil turns", min: 100, max: 1e3, unit: "turns" },
      { id: "resistance", label: "Resistance", min: 1, max: 50, unit: "\u03A9" },
      {
        id: "position",
        label: "Magnet position",
        min: -0.24,
        max: 0.24,
        unit: "m"
      }
    ],
    benchmarkCases: emiFaradayBenchmarks2,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "emf-position",
        label: "Induced emf versus pass time",
        xLabel: "time",
        yLabel: "emf",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The smooth axial field is an instructional approximation; coil self-inductance, eddy currents, and magnetic hysteresis are omitted."
    ]
  },
  "electrostatic-field-potential": {
    experimentId: "electrostatic-field-potential",
    formulaName: "Point-charge field and potential",
    formula: "E=k\u03A3(q\u1D62 r\u0302\u1D62/r\u1D62\xB2); V=k\u03A3(q\u1D62/r\u1D62); E=-grad V; W=-q\u0394V",
    status: statusForBenchmarks(electrostaticBenchmarks),
    assumptions: [
      "Charges are stationary point charges in vacuum.",
      "The test charge does not disturb the source configuration.",
      "An 0.08 m exclusion radius prevents displayed singularities."
    ],
    inputUnits: [
      si("charge1", "Charge Q1", "\u03BCC", "C"),
      si("charge2", "Charge Q2", "\u03BCC", "C"),
      si("separation", "Separation", "m"),
      si("probeX", "Probe x", "m"),
      si("probeY", "Probe y", "m")
    ],
    outputUnits: [
      si("fieldMagnitude", "Electric field", "N/C"),
      si("potential", "Potential", "V"),
      si("workByField", "Work by field", "J")
    ],
    validRanges: [
      { id: "charge1", label: "Charge Q1", min: -2e-5, max: 2e-5, unit: "C" },
      { id: "charge2", label: "Charge Q2", min: -2e-5, max: 2e-5, unit: "C" },
      { id: "separation", label: "Separation", min: 0.2, max: 4, unit: "m" },
      { id: "probeX", label: "Probe x", min: -4, max: 4, unit: "m" },
      { id: "probeY", label: "Probe y", min: -3, max: 3, unit: "m" }
    ],
    benchmarkCases: electrostaticBenchmarks,
    tolerance: 1,
    graphExpectations: [
      {
        id: "field-map",
        label: "Field vectors and potential contours",
        xLabel: "x",
        yLabel: "y",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The visualization clamps evaluation radius near point charges and omits dielectric polarization and radiation."
    ]
  },
  "electric-power": {
    experimentId: "electric-power",
    formulaName: "Electric power and energy",
    formula: "I=V/R; P=VI=I\xB2R=V\xB2/R; E=Pt; 1 kWh=3.6\xD710\u2076 J",
    status: statusForBenchmarks(electricPowerBenchmarks),
    assumptions: [
      "Appliances are represented by constant ohmic resistance.",
      "Supply voltage is constant during operation.",
      "All electrical work is counted as delivered energy/heat for this classroom model."
    ],
    inputUnits: [
      si("voltage", "Voltage", "V"),
      si("resistance", "Resistance", "\u03A9"),
      si("operatingTimeHours", "Operating time", "h", "s"),
      si("fuseLimit", "Fuse limit", "A")
    ],
    outputUnits: [
      si("current", "Current", "A"),
      si("powerVI", "Power", "W"),
      si("energyJ", "Energy", "J"),
      si("energyKWh", "Energy", "kWh", "J")
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 240, unit: "V" },
      { id: "resistance", label: "Resistance", min: 1, max: 1e3, unit: "\u03A9" },
      {
        id: "operatingTimeHours",
        label: "Operating time",
        min: 0,
        max: 24,
        unit: "h"
      },
      { id: "fuseLimit", label: "Fuse limit", min: 1, max: 20, unit: "A" }
    ],
    benchmarkCases: electricPowerBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "energy-time",
        label: "Cumulative energy versus time",
        xLabel: "time",
        yLabel: "energy",
        shape: "linear"
      }
    ],
    warnings: [
      "Real appliances can be non-ohmic, reactive, thermostatically cycled, or voltage-dependent."
    ]
  },
  "chemical-effects-current": {
    experimentId: "chemical-effects-current",
    formulaName: "Faraday electrolysis",
    formula: "Q=It; m=MIt/(nF); I=V/R_solution",
    status: statusForBenchmarks(chemicalEffectsBenchmarks),
    assumptions: [
      "Bulk electrolyte resistance scales with electrode gap and inversely with concentration.",
      "Current and thermal parameters remain constant during a run.",
      "Gas volumes use a classroom molar volume of 24.45 L/mol."
    ],
    inputUnits: [
      si("voltage", "Voltage", "V"),
      si("electrodeGap", "Electrode spacing", "cm", "m"),
      si("concentration", "Relative concentration", "mol/L rel."),
      si("duration", "Duration", "s")
    ],
    outputUnits: [
      si("current", "Current", "A"),
      si("charge", "Charge passed", "C"),
      si("depositedMassG", "Deposited mass", "g", "kg"),
      si("temperatureC", "Solution temperature", "\xB0C", "K")
    ],
    validRanges: [
      { id: "voltage", label: "Voltage", min: 0, max: 12, unit: "V" },
      {
        id: "electrodeGap",
        label: "Electrode spacing",
        min: 0.01,
        max: 0.05,
        unit: "m"
      },
      {
        id: "concentration",
        label: "Relative concentration",
        min: 0.25,
        max: 2
      },
      { id: "duration", label: "Duration", min: 0, max: 600, unit: "s" }
    ],
    benchmarkCases: chemicalEffectsBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "mass-charge",
        label: "Deposited mass versus charge",
        xLabel: "charge",
        yLabel: "mass",
        shape: "linear"
      }
    ],
    warnings: [
      "The thermal model is a lumped classroom approximation; electrode overpotential, convection, and changing concentration are omitted."
    ]
  },
  "internal-resistance-cell": {
    experimentId: "internal-resistance-cell",
    formulaName: "Cell terminal voltage and internal resistance",
    formula: "I=E/(R+r); V=E-Ir; P_internal=I\xB2r; slope(V against I)=-r",
    status: statusForBenchmarks(internalResistanceBenchmarks),
    assumptions: [
      "The cell emf and internal resistance are constant during a reading.",
      "Meters are ideal and leads have negligible resistance.",
      "The safety relay interrupts an external resistance below 0.10 ohm."
    ],
    inputUnits: [
      si("emf", "Cell emf", "V"),
      si("internalResistance", "Internal resistance", "\u03A9"),
      si("externalResistance", "External resistance", "\u03A9")
    ],
    outputUnits: [
      si("current", "Circuit current", "A"),
      si("terminalVoltage", "Terminal voltage", "V"),
      si("lostVoltage", "Lost volts", "V"),
      si("internalPower", "Internal heating", "W")
    ],
    validRanges: [
      { id: "emf", label: "Cell emf", min: 0.5, max: 12, unit: "V" },
      {
        id: "internalResistance",
        label: "Internal resistance",
        min: 0.05,
        max: 5,
        unit: "\u03A9"
      },
      {
        id: "externalResistance",
        label: "External resistance",
        min: 0,
        max: 20,
        unit: "\u03A9",
        warning: "The simulator opens its safety relay below 0.10 \u03A9."
      }
    ],
    benchmarkCases: internalResistanceBenchmarks,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "terminal-voltage-current",
        label: "Terminal voltage versus current",
        xLabel: "current",
        yLabel: "terminal voltage",
        direction: "decreasing"
      }
    ],
    warnings: [
      "Real emf and internal resistance vary with temperature, state of charge, chemistry, and current history."
    ]
  },
  "capacitor-lab": {
    experimentId: "capacitor-lab",
    formulaName: "Parallel-plate capacitance and stored energy",
    formula: "C=\u03BA\u03B50A/d; Q=CV; U=CV\xB2/2; Cparallel=sum(Ci); 1/Cseries=sum(1/Ci)",
    status: statusForBenchmarks(capacitorBenchmarks),
    assumptions: [
      "Uniform field between ideal parallel plates.",
      "Fringing and leakage are neglected.",
      "Network capacitors are identical copies of the geometry capacitor."
    ],
    inputUnits: [
      si("plateArea", "Plate area", "m\xB2"),
      si("spacing", "Spacing", "mm", "m"),
      si("dielectric", "Dielectric constant", "unitless"),
      si("voltage", "Voltage", "V")
    ],
    outputUnits: [
      si("equivalentCapacitance", "Equivalent capacitance", "F"),
      si("charge", "Charge", "C"),
      si("energy", "Stored energy", "J"),
      si("electricField", "Electric field", "V/m")
    ],
    validRanges: [
      {
        id: "plateArea",
        label: "Plate area",
        min: 5e-3,
        max: 0.05,
        unit: "m\xB2"
      },
      { id: "spacing", label: "Spacing", min: 5e-4, max: 0.01, unit: "m" },
      { id: "dielectric", label: "Dielectric constant", min: 1, max: 10 },
      { id: "voltage", label: "Voltage", min: 0, max: 24, unit: "V" }
    ],
    benchmarkCases: capacitorBenchmarks,
    tolerance: 1e-18,
    graphExpectations: [
      {
        id: "combination-comparison",
        label: "Equivalent capacitance by arrangement",
        xLabel: "arrangement",
        yLabel: "capacitance",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Fringing, dielectric breakdown, leakage, ESR, and transient circuit resistance are omitted."
    ]
  },
  "ac-lcr-resonance": {
    experimentId: "ac-lcr-resonance",
    formulaName: "Series LCR resonance",
    formula: "XL=2\u03C0fL; XC=1/(2\u03C0fC); Z=sqrt(R\xB2+(XL-XC)\xB2); f0=1/(2\u03C0sqrt(LC))",
    status: statusForBenchmarks(lcrBenchmarks),
    assumptions: [
      "Ideal series components.",
      "Sinusoidal RMS source at steady state.",
      "No parasitic resistance, saturation, or frequency-dependent component loss."
    ],
    inputUnits: [
      si("frequency", "Frequency", "Hz"),
      si("resistance", "Resistance", "\u03A9"),
      si("inductance", "Inductance", "mH", "H"),
      si("capacitance", "Capacitance", "\u03BCF", "F"),
      si("sourceVoltage", "Source voltage", "V RMS")
    ],
    outputUnits: [
      si("xL", "Inductive reactance", "\u03A9"),
      si("xC", "Capacitive reactance", "\u03A9"),
      si("impedance", "Impedance", "\u03A9"),
      si("current", "Current", "A RMS"),
      si("phaseDeg", "Phase", "deg", "rad")
    ],
    validRanges: [
      { id: "frequency", label: "Frequency", min: 1, max: 500, unit: "Hz" },
      { id: "resistance", label: "Resistance", min: 1, max: 500, unit: "\u03A9" },
      { id: "inductance", label: "Inductance", min: 1e-3, max: 2, unit: "H" },
      {
        id: "capacitance",
        label: "Capacitance",
        min: 1e-7,
        max: 1e-3,
        unit: "F"
      }
    ],
    benchmarkCases: lcrBenchmarks,
    tolerance: 1e-8,
    graphExpectations: [
      {
        id: "resonance-current",
        label: "Current versus frequency",
        xLabel: "frequency",
        yLabel: "current",
        shape: "qualitative"
      },
      {
        id: "phase-frequency",
        label: "Phase versus frequency",
        xLabel: "frequency",
        yLabel: "phase",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Real inductors and capacitors have parasitic losses that lower Q and alter the response."
    ]
  },
  "ac-generator": {
    experimentId: "ac-generator",
    formulaName: "Rotating-coil AC generator",
    formula: "N\u03A6 = NBA cos(\u03B8); \u03B5 = -d(N\u03A6)/dt = NBA\u03C9 sin(\u03B8)",
    status: statusForBenchmarks(acGeneratorValidation),
    assumptions: [
      "Uniform magnetic field across the coil.",
      "Rigid planar coil rotates at constant angular speed.",
      "Brush and slip-ring losses are neglected."
    ],
    inputUnits: [
      si("turns", "Turns", "turns"),
      si("magneticField", "Magnetic field", "T"),
      si("coilArea", "Coil area", "m\xB2"),
      si("angularSpeed", "Angular speed", "rad/s"),
      si("angleRad", "Coil angle", "deg", "rad")
    ],
    outputUnits: [
      si("fluxLinkage", "Flux linkage", "Wb-turn"),
      si("emf", "Instantaneous emf", "V"),
      si("peakEmf", "Peak emf", "V"),
      si("frequency", "Frequency", "Hz")
    ],
    validRanges: [
      { id: "turns", label: "Turns", min: 1, max: 500, unit: "turns" },
      {
        id: "magneticField",
        label: "Magnetic field",
        min: 0,
        max: 2,
        unit: "T"
      },
      { id: "coilArea", label: "Coil area", min: 5e-3, max: 0.5, unit: "m\xB2" },
      {
        id: "angularSpeed",
        label: "Angular speed",
        min: 0,
        max: 200,
        unit: "rad/s"
      }
    ],
    benchmarkCases: acGeneratorValidation,
    tolerance: 1e-10,
    graphExpectations: [
      {
        id: "emf-angle",
        label: "Emf versus angle",
        xLabel: "angle",
        yLabel: "emf",
        shape: "qualitative"
      },
      {
        id: "flux-angle",
        label: "Flux versus angle",
        xLabel: "angle",
        yLabel: "flux linkage",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Real generators also have resistance, inductance, magnetic saturation, friction, and brush losses."
    ]
  },
  "universal-gravitation": {
    experimentId: "universal-gravitation",
    formulaName: "Newtonian universal gravitation",
    formula: "F = Gm1m2/r^2; g = -sum(GMi(r-ri)/|r-ri|^3); V = -sum(GMi/|r-ri|)",
    status: statusForBenchmarks(universalGravitationBenchmarks),
    assumptions: [
      "Two fixed spherical point masses.",
      "Newtonian gravity in an inertial frame.",
      "Softening is used only near each displayed mass to avoid a visual singularity."
    ],
    inputUnits: [
      si("massA", "Mass A", "kg"),
      si("massB", "Mass B", "kg"),
      si("separation", "Separation", "m"),
      si("probeX", "Probe x", "m"),
      si("probeY", "Probe y", "m"),
      si("softening", "Softening length", "m")
    ],
    outputUnits: [
      si("forceMagnitude", "Mutual force", "N"),
      si("netFieldMagnitude", "Net field", "N/kg"),
      si("potential", "Potential", "J/kg"),
      si("zeroFieldX", "Zero-field x", "m")
    ],
    validRanges: [
      { id: "massA", label: "Mass A", min: 1e20, max: 1e32, unit: "kg" },
      { id: "massB", label: "Mass B", min: 1e20, max: 1e32, unit: "kg" },
      { id: "separation", label: "Separation", min: 1e7, max: 1e13, unit: "m" }
    ],
    benchmarkCases: universalGravitationBenchmarks,
    tolerance: 1e-8,
    graphExpectations: [
      {
        id: "potential-line",
        label: "Potential along the mass axis",
        xLabel: "position",
        yLabel: "potential",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The fixed-mass field map does not integrate orbital motion or relativistic effects.",
      "Softening changes the field inside the chosen epsilon radius."
    ]
  },
  "satellite-orbit": {
    experimentId: "satellite-orbit",
    formulaName: "Inverse-square orbital motion",
    formula: "a = -mu r/|r|^3; v_orbit = sqrt(mu/r); v_escape = sqrt(2mu/r)",
    status: statusForBenchmarks(satelliteOrbitBenchmarks),
    assumptions: [
      "Isolated two-body system.",
      "Planet is a spherical point mass outside its surface.",
      "No atmosphere, thrust, oblateness, or third-body perturbations."
    ],
    inputUnits: [
      si("planetMassEarths", "Planet mass", "Earth masses", "kg"),
      si("altitudeKm", "Altitude", "km", "m"),
      si("launchSpeedKmS", "Launch speed", "km/s", "m/s"),
      si("directionDeg", "Launch direction", "deg", "rad"),
      si("satelliteMassKg", "Satellite mass", "kg")
    ],
    outputUnits: [
      si("speed", "Speed", "km/s", "m/s"),
      si("energy", "Mechanical energy", "J"),
      si("eccentricity", "Eccentricity", "unitless"),
      si("period", "Circular period", "min", "s")
    ],
    validRanges: [
      {
        id: "planetMassEarths",
        label: "Planet mass",
        min: 0.2,
        max: 3,
        unit: "Earth masses"
      },
      { id: "altitudeKm", label: "Altitude", min: 200, max: 36e3, unit: "km" },
      {
        id: "launchSpeedKmS",
        label: "Launch speed",
        min: 0,
        max: 30,
        unit: "km/s"
      }
    ],
    benchmarkCases: satelliteOrbitBenchmarks,
    tolerance: 1e-8,
    graphExpectations: [
      {
        id: "speed-altitude",
        label: "Speed vs altitude",
        xLabel: "altitude",
        yLabel: "speed",
        direction: "decreasing"
      }
    ],
    warnings: [
      "The numerical model omits atmospheric drag, thrust, planet rotation, oblateness, and third-body gravity."
    ]
  },
  "uniform-motion": {
    experimentId: "uniform-motion",
    formulaName: "Uniform motion",
    formula: "x = x0 + vt",
    status: statusForBenchmarks(uniformMotionBenchmarks),
    assumptions: [
      "Velocity is constant.",
      "Motion is one-dimensional.",
      "Position is signed."
    ],
    inputUnits: [
      si("x0", "Initial position", "m"),
      si("velocity", "Velocity", "m/s"),
      si("time", "Time", "s")
    ],
    outputUnits: [
      si("x", "Final position", "m"),
      si("slope", "Graph slope", "m/s")
    ],
    validRanges: [{ id: "time", label: "Time", min: 0, unit: "s" }],
    benchmarkCases: uniformMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "distance-time",
        label: "Distance-time",
        xLabel: "time",
        yLabel: "position",
        shape: "linear"
      },
      {
        id: "velocity-time",
        label: "Velocity-time",
        xLabel: "time",
        yLabel: "velocity",
        shape: "constant"
      }
    ],
    warnings: ["Negative velocity is allowed; negative time is not."]
  },
  "vector-resolution": {
    experimentId: "vector-resolution",
    formulaName: "Orthogonal vector resolution",
    formula: "Ax=A cos(theta-phi); Ay=A sin(theta-phi); A=sqrt(Ax^2+Ay^2)",
    status: statusForBenchmarks(vectorResolutionBenchmarks),
    assumptions: [
      "The x-prime and y-prime axes remain perpendicular.",
      "Angles are measured counterclockwise and components preserve sign.",
      "All displayed vectors share one linear scale."
    ],
    inputUnits: [
      si("magnitude", "Magnitude", "N"),
      si("angleDeg", "Vector angle", "degrees"),
      si("axisRotationDeg", "Axis rotation", "degrees")
    ],
    outputUnits: [
      si("xComponent", "x-prime component", "N"),
      si("yComponent", "y-prime component", "N"),
      si("recombinedMagnitude", "Recombined magnitude", "N")
    ],
    validRanges: [
      { id: "magnitude", label: "Magnitude", min: 5, max: 100, unit: "N" },
      { id: "angleDeg", label: "Angle", min: -180, max: 180, unit: "degrees" },
      {
        id: "axisRotationDeg",
        label: "Axis rotation",
        min: -90,
        max: 90,
        unit: "degrees"
      }
    ],
    benchmarkCases: vectorResolutionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [],
    warnings: [
      "Component values are defined relative to the rotated x-prime/y-prime axes, not necessarily the screen axes."
    ]
  },
  "work-power": {
    experimentId: "work-power",
    formulaName: "Work, power, and work-energy",
    formula: "W=integral(F dot ds); Pavg=W/dt; P=F dot v; Wnet=Delta K",
    status: statusForBenchmarks(workPowerBenchmarks),
    assumptions: [
      "Horizontal path with a constant applied-force magnitude and angle.",
      "Kinetic friction is mu_k times the reduced normal force N=max(0,mg-F sin theta).",
      "The load starts from rest and the applied force is constant."
    ],
    inputUnits: [
      si("massKg", "Load mass", "kg"),
      si("forceN", "Applied force", "N"),
      si("distanceM", "Path distance", "m"),
      si("angleDeg", "Force angle", "degrees"),
      si("durationS", "Observation duration", "s"),
      si("frictionCoefficient", "Kinetic friction coefficient", "unitless")
    ],
    outputUnits: [
      si("netWorkJ", "Net work", "J"),
      si("averageNetPowerW", "Average net power", "W"),
      si("instantaneousAppliedPowerW", "Instantaneous applied power", "W"),
      si("speedMps", "Speed", "m/s")
    ],
    validRanges: [
      { id: "forceN", label: "Force", min: 20, max: 500, unit: "N" },
      { id: "distanceM", label: "Distance", min: 1, max: 20, unit: "m" },
      { id: "angleDeg", label: "Angle", min: -90, max: 180, unit: "degrees" },
      { id: "durationS", label: "Duration", min: 1, max: 30, unit: "s" },
      {
        id: "frictionCoefficient",
        label: "Kinetic friction",
        min: 0,
        max: 0.8,
        unit: "unitless"
      }
    ],
    benchmarkCases: workPowerBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "work-time",
        label: "Cumulative work",
        xLabel: "time",
        yLabel: "work",
        shape: "quadratic"
      }
    ],
    warnings: [
      "If the forward applied component does not exceed kinetic friction, this rest-start model does not move the load."
    ]
  },
  friction: {
    experimentId: "friction",
    formulaName: "Static and kinetic friction",
    formula: "|fs| \u2264 \u03BCsN; |fk| = \u03BCkN; N = mg cos\u03B8",
    status: statusForBenchmarks(frictionBenchmarks),
    assumptions: [
      "Rigid block and surface with constant coefficients.",
      "Friction opposes relative motion or its tendency.",
      "The incline option fixes the plane at 20 degrees."
    ],
    inputUnits: [
      si("mass", "Mass", "kg"),
      si("gravity", "Gravity", "m/s^2"),
      si("muS", "Static coefficient", "unitless"),
      si("muK", "Kinetic coefficient", "unitless"),
      si("appliedForce", "Applied force", "N"),
      si("inclineDegrees", "Incline angle", "deg", "rad")
    ],
    outputUnits: [
      si("normalForce", "Normal force", "N"),
      si("maximumStaticFriction", "Static friction limit", "N"),
      si("kineticFriction", "Kinetic friction magnitude", "N"),
      si("frictionForce", "Signed friction force", "N"),
      si("acceleration", "Acceleration", "m/s^2")
    ],
    validRanges: [
      {
        id: "mass",
        label: "Mass",
        min: 0,
        unit: "kg",
        warning: "Mass must be positive."
      },
      { id: "muS", label: "Static coefficient", min: 0 },
      { id: "muK", label: "Kinetic coefficient", min: 0 }
    ],
    benchmarkCases: frictionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "friction-normal",
        label: "f vs N",
        xLabel: "normal force",
        yLabel: "friction",
        shape: "linear"
      }
    ],
    warnings: [
      "No negative mass or coefficient; the interface constrains \u03BCk \u2264 \u03BCs."
    ]
  },
  "mass-and-weight": {
    experimentId: "mass-and-weight",
    formulaName: "Weight and apparent weight",
    formula: "W=mg; N=m(g+a); g(h)=g0[R/(R+h)]^2",
    status: statusForBenchmarks(massWeightBenchmarks),
    assumptions: [
      "Mass is invariant across location.",
      "Elevator acceleration is positive upward.",
      "The spring scale cannot exert a negative normal force."
    ],
    inputUnits: [
      si("massKg", "Mass", "kg"),
      si("altitudeKm", "Altitude", "km", "m"),
      si("elevatorAccelerationMps2", "Elevator acceleration", "m/s^2")
    ],
    outputUnits: [
      si("localGravityMps2", "Local gravitational field", "m/s^2"),
      si("trueWeightN", "True weight", "N"),
      si("apparentWeightN", "Apparent weight", "N")
    ],
    validRanges: [
      { id: "massKg", label: "Mass", min: 0, unit: "kg" },
      { id: "altitudeKm", label: "Altitude", min: 0, unit: "km" }
    ],
    benchmarkCases: massWeightBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "weight-gravity",
        label: "Weight vs gravitational field",
        xLabel: "g",
        yLabel: "weight",
        shape: "linear"
      }
    ],
    warnings: ["Apparent weight is clamped at zero when contact is lost."]
  },
  "inclined-plane": {
    experimentId: "inclined-plane",
    formulaName: "Inclined-plane force balance",
    formula: "F\u2225=mg sin\u03B8; N=mg cos\u03B8; tan\u03B8c=\u03BCs",
    status: statusForBenchmarks(inclinedPlaneBenchmarks),
    assumptions: [
      "Rigid plane.",
      "Static friction opposes the impending direction up to \u03BCsN.",
      "Kinetic friction is modeled as 0.8 \u03BCsN after breakaway."
    ],
    inputUnits: [
      si("angleDegrees", "Angle", "deg", "rad"),
      si("massKg", "Mass", "kg"),
      si("frictionCoefficient", "Static coefficient", "unitless"),
      si("appliedForceN", "Applied force upslope", "N"),
      si("gravity", "Gravity", "m/s^2")
    ],
    outputUnits: [
      si("parallelWeightN", "Parallel weight", "N"),
      si("normalForceN", "Normal force", "N"),
      si("accelerationDownMps2", "Downslope acceleration", "m/s^2")
    ],
    validRanges: [
      {
        id: "angleDegrees",
        label: "Angle",
        min: 0,
        max: 80,
        unit: "deg",
        warning: "Angles beyond classroom scope need warning."
      },
      { id: "massKg", label: "Mass", min: 0, unit: "kg" }
    ],
    benchmarkCases: inclinedPlaneBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "angle-acceleration",
        label: "Angle vs acceleration",
        xLabel: "angle",
        yLabel: "acceleration",
        direction: "increasing"
      }
    ],
    warnings: [
      "Flat planes do not accelerate without an unbalanced applied force."
    ]
  },
  "elastic-collision": {
    experimentId: "elastic-collision",
    formulaName: "1D elastic collision",
    formula: "v1=((m1-m2)/(m1+m2))u1 + (2m2/(m1+m2))u2",
    status: statusForBenchmarks(elasticCollisionBenchmarks),
    assumptions: [
      "One-dimensional collision.",
      "Perfectly elastic.",
      "No external impulse during collision."
    ],
    inputUnits: [
      si("m1", "Mass 1", "kg"),
      si("m2", "Mass 2", "kg"),
      si("u1", "Initial velocity 1", "m/s"),
      si("u2", "Initial velocity 2", "m/s")
    ],
    outputUnits: [
      si("v1", "Final velocity 1", "m/s"),
      si("v2", "Final velocity 2", "m/s"),
      si("energy", "Kinetic energy", "J")
    ],
    validRanges: [
      { id: "m1", label: "Mass 1", min: 0, unit: "kg" },
      { id: "m2", label: "Mass 2", min: 0, unit: "kg" }
    ],
    benchmarkCases: elasticCollisionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "energy-before-after",
        label: "Energy before/after",
        xLabel: "state",
        yLabel: "energy",
        shape: "constant"
      }
    ],
    warnings: ["Mass sum cannot be zero."]
  },
  "hooke-s-law": {
    experimentId: "hooke-s-law",
    formulaName: "Hooke's law",
    formula: "F = kx; xeq = mg/k; U = 1/2 kx^2",
    status: statusForBenchmarks(hookesLawBenchmarks),
    assumptions: [
      "The force-extension fit uses points within the elastic region.",
      "Extension is measured from the unloaded natural length.",
      "Optional permanent set is a clearly marked classroom deformation model."
    ],
    inputUnits: [
      si("springConstant", "Spring constant", "N/m"),
      si("loadMassKg", "Attached mass", "kg"),
      si("naturalLengthM", "Natural length", "m"),
      si("damping", "Damping coefficient", "N*s/m")
    ],
    outputUnits: [
      si("forceN", "Applied weight / restoring magnitude", "N"),
      si("equilibriumExtensionM", "Equilibrium extension", "m"),
      si("energyJ", "Elastic potential energy", "J")
    ],
    validRanges: [
      { id: "springConstant", label: "Spring constant", min: 0, unit: "N/m" },
      { id: "loadMassKg", label: "Attached mass", min: 0, unit: "kg" }
    ],
    benchmarkCases: hookesLawBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "force-extension",
        label: "F-x graph",
        xLabel: "extension",
        yLabel: "force",
        shape: "linear"
      }
    ],
    warnings: ["Do not claim linearity beyond elastic limit."]
  },
  "circular-motion": {
    experimentId: "circular-motion",
    formulaName: "Centripetal force",
    formula: "Fc = m r omega^2",
    status: statusForBenchmarks(circularMotionBenchmarks),
    assumptions: [
      "Uniform circular motion.",
      "Centripetal force points inward."
    ],
    inputUnits: [
      si("mass", "Mass", "kg"),
      si("radius", "Radius", "m"),
      si("omega", "Angular speed", "rad/s")
    ],
    outputUnits: [
      si("force", "Centripetal force", "N"),
      si("speed", "Tangential speed", "m/s"),
      si("period", "Period", "s")
    ],
    validRanges: [
      { id: "mass", label: "Mass", min: 0, unit: "kg" },
      { id: "radius", label: "Radius", min: 0, unit: "m" },
      { id: "omega", label: "Angular speed", min: 0, unit: "rad/s" }
    ],
    benchmarkCases: circularMotionBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "force-omega",
        label: "Fc vs omega",
        xLabel: "angular speed",
        yLabel: "force",
        shape: "quadratic"
      }
    ],
    warnings: [
      "Radius and angular speed must be positive for period and force outputs."
    ]
  },
  "single-slit-diffraction": {
    experimentId: "single-slit-diffraction",
    formulaName: "Single slit minima",
    formula: "a sin(theta_m) = m lambda; y_m = D tan(theta_m)",
    status: statusForBenchmarks(singleSlitBenchmarks),
    assumptions: [
      "Exact screen geometry is used after the Fraunhofer minima condition.",
      "Scalar monochromatic Fraunhofer diffraction with a uniform slit."
    ],
    inputUnits: [
      si("wavelengthNm", "Wavelength", "nm", "m"),
      si("slitWidthMm", "Slit width", "mm", "m"),
      si("screenDistanceM", "Screen distance", "m"),
      si("order", "Order", "integer")
    ],
    outputUnits: [
      si("firstMinimaPosition", "First minima position", "m"),
      si("centralMaximumWidth", "Central maximum width", "m")
    ],
    validRanges: [
      { id: "wavelengthNm", label: "Wavelength", min: 1, unit: "nm" },
      { id: "slitWidthMm", label: "Slit width", min: 0, unit: "mm" }
    ],
    benchmarkCases: singleSlitBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "central-width-slit",
        label: "Width vs slit width",
        xLabel: "slit width",
        yLabel: "central width",
        direction: "decreasing"
      }
    ],
    warnings: ["Never mix nm/mm/m without explicit conversion labels."]
  },
  "chladni-plate": {
    experimentId: "chladni-plate",
    formulaName: "Qualitative standing wave mode",
    formula: "z = A sin(n pi x/L) sin(m pi y/L) cos(omega t)",
    status: "qualitative-visual",
    assumptions: [
      "School-level qualitative mode model.",
      "Not a finite-element plate solver."
    ],
    inputUnits: [
      si("modeN", "Mode n", "integer"),
      si("modeM", "Mode m", "integer"),
      si("frequency", "Frequency", "Hz")
    ],
    outputUnits: [
      si("nodeLineCount", "Node line count", "relative"),
      si("complexity", "Pattern complexity", "relative")
    ],
    validRanges: [
      { id: "modeN", label: "Mode n", min: 1 },
      { id: "modeM", label: "Mode m", min: 1 }
    ],
    benchmarkCases: chladniBenchmarks,
    tolerance: 0,
    graphExpectations: [
      {
        id: "mode-complexity",
        label: "Mode number vs node lines",
        xLabel: "mode",
        yLabel: "node lines",
        direction: "increasing"
      }
    ],
    warnings: ["Qualitative visual model only; no exact plate physics claim."]
  },
  "simple-pendulum": {
    experimentId: "simple-pendulum",
    formulaName: "Simple pendulum period",
    formula: "theta''+b theta'+(g/L)sin(theta)=0; T0=2pi sqrt(L/g)",
    status: statusForBenchmarks(simplePendulumBenchmarks),
    assumptions: [
      "Point-mass bob and massless rigid string.",
      "Small-angle period is an approximation, not the nonlinear equation of motion.",
      "Linear angular damping model."
    ],
    inputUnits: [
      si("lengthM", "String length", "m"),
      si("amplitudeDeg", "Initial amplitude", "degrees"),
      si("gravityMps2", "Gravity", "m/s^2"),
      si("dampingPerS", "Damping", "s^-1"),
      si("bobMassKg", "Bob mass", "kg")
    ],
    outputUnits: [
      si("periodS", "Period", "s"),
      si("angleDeg", "Angle", "degrees"),
      si("speedMps", "Bob speed", "m/s")
    ],
    validRanges: [
      { id: "lengthM", label: "Length", min: 0.2, max: 2, unit: "m" },
      {
        id: "amplitudeDeg",
        label: "Amplitude",
        min: 5,
        max: 60,
        unit: "degrees"
      },
      {
        id: "gravityMps2",
        label: "Gravity",
        min: 1.62,
        max: 24.79,
        unit: "m/s^2"
      }
    ],
    benchmarkCases: simplePendulumBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "angle-time",
        label: "Angle vs time",
        xLabel: "time",
        yLabel: "angle",
        shape: "qualitative"
      }
    ],
    warnings: [
      "T0 is labeled approximate and large-angle correction is shown above 15 degrees."
    ]
  },
  "shm-spring": {
    experimentId: "shm-spring",
    formulaName: "Linear spring-mass oscillator",
    formula: "m x'' + b x' + kx = F0 cos(omega_d t); omega_0=sqrt(k/m)",
    status: statusForBenchmarks(shmSpringBenchmarks),
    assumptions: [
      "The spring obeys Hooke's law and the cart moves on a level frictionless rail apart from viscous damping.",
      "Free motion uses the exact underdamped, critical, or overdamped linear solution.",
      "Driven mode displays the steady-state response to a 0.2 N sinusoidal drive."
    ],
    inputUnits: [
      si("massKg", "Mass", "kg"),
      si("springConstantNm", "Spring constant", "N/m"),
      si("amplitudeM", "Release amplitude", "m"),
      si("dampingNsM", "Damping", "N\xB7s/m"),
      si("driveFrequencyHz", "Drive frequency", "Hz")
    ],
    outputUnits: [
      si("omega0", "Natural angular frequency", "rad/s"),
      si("periodS", "Period", "s"),
      si("x", "Displacement", "m"),
      si("v", "Velocity", "m/s"),
      si("acceleration", "Acceleration", "m/s\xB2"),
      si("totalEnergyJ", "Mechanical energy", "J")
    ],
    validRanges: [
      { id: "massKg", label: "Mass", min: 0.1, max: 2, unit: "kg" },
      {
        id: "springConstantNm",
        label: "Spring constant",
        min: 5,
        max: 50,
        unit: "N/m"
      },
      { id: "dampingNsM", label: "Damping", min: 0, max: 4, unit: "N\xB7s/m" }
    ],
    benchmarkCases: shmSpringBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "phase-traces",
        label: "x, v and a versus time",
        xLabel: "time",
        yLabel: "state",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Driven mode is a steady-state linear response; transient buildup is omitted."
    ]
  },
  "projectile-motion": {
    experimentId: "projectile-motion",
    formulaName: "Parametric projectile motion",
    formula: "x=v0 cos(theta)t; y=h0+v0 sin(theta)t-gt^2/2",
    status: statusForBenchmarks(projectileLessonBenchmarks),
    assumptions: [
      "Uniform downward gravity.",
      "Exact range shortcut only for level-ground launch and landing without drag.",
      "Optional drag model uses deterministic quadratic velocity resistance."
    ],
    inputUnits: [
      si("speedMps", "Launch speed", "m/s"),
      si("angleDeg", "Launch angle", "degrees"),
      si("heightM", "Launch height", "m"),
      si("gravityMps2", "Gravity", "m/s^2")
    ],
    outputUnits: [
      si("rangeM", "Range", "m"),
      si("peakM", "Peak height", "m"),
      si("timeS", "Time of flight", "s")
    ],
    validRanges: [
      { id: "speedMps", label: "Launch speed", min: 5, max: 50, unit: "m/s" },
      {
        id: "angleDeg",
        label: "Launch angle",
        min: 5,
        max: 85,
        unit: "degrees"
      },
      {
        id: "gravityMps2",
        label: "Gravity",
        min: 1.62,
        max: 24.79,
        unit: "m/s^2"
      }
    ],
    benchmarkCases: projectileLessonBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "horizontal-position",
        label: "Horizontal position vs time",
        xLabel: "time",
        yLabel: "x",
        shape: "linear"
      },
      {
        id: "vertical-position",
        label: "Vertical position vs time",
        xLabel: "time",
        yLabel: "y",
        shape: "quadratic"
      }
    ],
    warnings: [
      "The closed-form range equation is not used for elevated launches or air resistance."
    ]
  },
  "rotational-dynamics": {
    experimentId: "rotational-dynamics",
    formulaName: "Rotational form of Newton's second law",
    formula: "tau=rF; I=Md^2/2+sum(mr^2); alpha=tau_net/I; L=I omega",
    status: statusForBenchmarks(rotationalDynamicsBenchmarks),
    assumptions: [
      "Rigid solid disk on a fixed axis.",
      "Applied force is tangential.",
      "Two point masses are symmetric.",
      "Axle friction is linear viscous damping."
    ],
    inputUnits: [
      si("forceN", "Tangential force", "N"),
      si("leverArmM", "Lever arm", "m"),
      si("pointMassKg", "Point mass", "kg"),
      si("massRadiusM", "Mass radius", "m"),
      si("axleDampingNmS", "Axle damping", "N m s")
    ],
    outputUnits: [
      si("appliedTorqueNm", "Torque", "N m"),
      si("inertiaKgm2", "Moment of inertia", "kg m^2"),
      si("angularAccelerationRadS2", "Angular acceleration", "rad/s^2"),
      si("angularMomentumKgM2S", "Angular momentum", "kg m^2/s")
    ],
    validRanges: [
      { id: "forceN", label: "Force", min: 0, max: 10, unit: "N" },
      { id: "leverArmM", label: "Lever arm", min: 0.05, max: 0.4, unit: "m" },
      {
        id: "massRadiusM",
        label: "Mass radius",
        min: 0.05,
        max: 0.25,
        unit: "m"
      }
    ],
    benchmarkCases: rotationalDynamicsBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "torque-alpha",
        label: "Angular acceleration vs net torque",
        xLabel: "net torque",
        yLabel: "angular acceleration",
        shape: "linear"
      }
    ],
    warnings: [
      "The damping model is an ideal linear axle-friction approximation."
    ]
  },
  "newton-s-second-law": {
    experimentId: "newton-s-second-law",
    formulaName: "Newton's second law",
    formula: "Fnet = Fapplied - Ffriction; a = Fnet/m; x = 1/2 at^2",
    status: statusForBenchmarks(newtonSecondLawBenchmarks),
    assumptions: [
      "Each trial starts from rest at x = 0.",
      "Mass is positive and constant during a trial.",
      "One-dimensional motion with a fixed opposing-friction magnitude."
    ],
    inputUnits: [
      si("appliedForceN", "Applied force", "N"),
      si("frictionN", "Friction", "N"),
      si("massKg", "Mass", "kg"),
      si("samplingIntervalS", "Sampling interval", "s")
    ],
    outputUnits: [
      si("netForceN", "Net force", "N"),
      si("accelerationMps2", "Acceleration", "m/s^2")
    ],
    validRanges: [
      { id: "massKg", label: "Mass", min: 0.5, max: 5, unit: "kg" },
      { id: "frictionN", label: "Friction", min: 0, max: 10, unit: "N" }
    ],
    benchmarkCases: newtonSecondLawBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "force-acceleration",
        label: "Acceleration vs net force",
        xLabel: "net force",
        yLabel: "acceleration",
        shape: "linear"
      },
      {
        id: "inverse-mass-acceleration",
        label: "Acceleration vs inverse mass",
        xLabel: "inverse mass",
        yLabel: "acceleration",
        shape: "linear"
      }
    ],
    warnings: [
      "Friction cancels applied force until its threshold is exceeded."
    ]
  },
  "conservation-of-energy": {
    experimentId: "conservation-of-energy",
    formulaName: "Mechanical energy conservation",
    formula: "KE + PE = constant",
    status: statusForBenchmarks(energyBenchmarks),
    assumptions: [
      "No non-conservative work.",
      "Uniform gravity.",
      "Closed mechanical system."
    ],
    inputUnits: [
      si("mass", "Mass", "kg"),
      si("height", "Height", "m"),
      si("g", "Gravity", "m/s^2")
    ],
    outputUnits: [si("energy", "Energy", "J"), si("speed", "Speed", "m/s")],
    validRanges: [
      { id: "mass", label: "Mass", min: 0, unit: "kg" },
      { id: "height", label: "Height", min: 0, unit: "m" }
    ],
    benchmarkCases: energyBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "energy-total",
        label: "Total energy",
        xLabel: "time",
        yLabel: "energy",
        shape: "constant"
      }
    ],
    warnings: ["Energy changes if friction or drag is enabled."]
  },
  "wave-lab": {
    experimentId: "wave-lab",
    formulaName: "Transverse-wave superposition and reflection",
    formula: "y=y1+y2; v=f lambda; fixed reflection adds pi phase; free reflection does not invert",
    status: statusForBenchmarks(waveLabBenchmarks),
    assumptions: [
      "Linear medium, so displacements obey algebraic superposition.",
      "Component waves have equal amplitude and frequency.",
      "Boundary modes use ideal rigid-fixed or slope-free endpoints."
    ],
    inputUnits: [
      si("amplitudeM", "Amplitude", "m", "mm"),
      si("frequencyHz", "Frequency", "Hz"),
      si("wavelengthM", "Wavelength", "m", "cm"),
      si("phaseDeg", "Phase", "deg", "rad")
    ],
    outputUnits: [
      si("speedMs", "Wave speed", "m/s"),
      si("resultant", "Resultant displacement", "m", "mm"),
      si("nodeEnvelopeM", "Node envelope", "m", "mm")
    ],
    validRanges: [
      { id: "frequencyHz", label: "Frequency", min: 2, max: 30, unit: "Hz" },
      {
        id: "wavelengthM",
        label: "Wavelength",
        min: 0.01,
        max: 0.1,
        unit: "m"
      },
      {
        id: "amplitudeM",
        label: "Amplitude",
        min: 1e-3,
        max: 0.015,
        unit: "m"
      }
    ],
    benchmarkCases: waveLabBenchmarks,
    tolerance: 1e-9,
    graphExpectations: [
      {
        id: "component-resultant",
        label: "Component and resultant displacement",
        xLabel: "position",
        yLabel: "displacement",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The ripple-tank view is a 2D teaching visualization of the same linear transverse-wave state."
    ]
  },
  "sound-wave-anatomy": {
    experimentId: "sound-wave-anatomy",
    formulaName: "Longitudinal sound wave",
    formula: "v=f lambda; delta-p=rho v omega s_max",
    status: statusForBenchmarks(soundWaveAnatomyValidation),
    assumptions: [
      "Each listed medium is homogeneous and represented by a fixed wave speed.",
      "Pressure and particle displacement are modeled as small-amplitude plane waves.",
      "Visual particle displacement is amplified; the numerical micrometre reading follows the acoustic relation."
    ],
    inputUnits: [
      si("frequency", "Frequency", "Hz"),
      si("pressure", "Pressure amplitude", "Pa"),
      si("probe", "Probe position", "m")
    ],
    outputUnits: [
      si("wavelength", "Wavelength", "m"),
      si("speed", "Wave speed", "m/s"),
      si("displacement", "Particle displacement", "\xB5m", "m")
    ],
    validRanges: [
      { id: "frequency", label: "Frequency", min: 100, max: 1200, unit: "Hz" },
      {
        id: "pressure",
        label: "Pressure amplitude",
        min: 1,
        max: 20,
        unit: "Pa"
      }
    ],
    benchmarkCases: soundWaveAnatomyValidation,
    tolerance: 2e-3,
    graphExpectations: [
      {
        id: "pressure-position",
        label: "Pressure versus position",
        xLabel: "position",
        yLabel: "pressure",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Particle motion is magnified on screen; particles oscillate locally rather than traveling with the wave."
    ]
  },
  "sound-pitch-loudness": {
    experimentId: "sound-pitch-loudness",
    formulaName: "Pitch, pressure level and relative intensity",
    formula: "T=1/f; p_rms=p_peak/sqrt(2); Lp=20 log10(p_rms/p_ref); I_rel proportional to p_peak^2",
    status: statusForBenchmarks(soundPitchBenchmarks),
    assumptions: [
      "The displayed pressure is a sinusoidal-equivalent peak pressure and uses p_ref = 20 micropascals.",
      "Waveform selection illustrates timbre; pitch remains tied to the fundamental frequency.",
      "Browser audio gain is capped and is not a calibrated SPL source."
    ],
    inputUnits: [
      si("frequencyHz", "Frequency", "Hz"),
      si("peakPressurePa", "Peak pressure", "Pa")
    ],
    outputUnits: [
      si("periodSeconds", "Period", "s"),
      si("rmsPressurePa", "RMS pressure", "Pa"),
      si("soundPressureLevelDb", "Sound pressure level", "dB"),
      si("relativeIntensity", "Relative intensity", "relative")
    ],
    validRanges: [
      { id: "frequencyHz", label: "Frequency", min: 110, max: 880, unit: "Hz" },
      {
        id: "peakPressurePa",
        label: "Peak pressure",
        min: 0.02,
        max: 1.4,
        unit: "Pa"
      }
    ],
    benchmarkCases: soundPitchBenchmarks,
    tolerance: 1e-12,
    graphExpectations: [
      {
        id: "pressure-time",
        label: "Pressure waveform",
        xLabel: "time",
        yLabel: "pressure",
        shape: "qualitative"
      }
    ],
    warnings: [
      "Displayed SPL is an ideal pressure calculation, not a measurement of the user's speakers or listening position."
    ]
  },
  "young-double-slit": {
    experimentId: "young-double-slit",
    formulaName: "Young double-slit interference",
    formula: "beta=lambda D/d; delta=r1-r2; I/Imax=(1+mu cos(2 pi delta/lambda))/2",
    status: statusForBenchmarks(youngDoubleSlitBenchmarks),
    assumptions: [
      "The fringe-spacing shortcut uses the small-angle and far-field approximations.",
      "Exact geometric path lengths determine the selected-point phase and intensity.",
      "The coherence control scales fringe visibility between zero and one."
    ],
    inputUnits: [
      si("wavelengthM", "Wavelength", "m", "nm"),
      si("slitSeparationM", "Slit separation", "m", "mm"),
      si("screenDistanceM", "Screen distance", "m"),
      si("probeYM", "Probe position", "m", "mm")
    ],
    outputUnits: [
      si("betaM", "Fringe spacing", "m", "mm"),
      si("pathDifferenceM", "Path difference", "m", "\xB5m"),
      si("phaseDifferenceRad", "Phase difference", "rad"),
      si("intensity", "Relative intensity", "relative")
    ],
    validRanges: [
      {
        id: "wavelengthM",
        label: "Wavelength",
        min: 38e-8,
        max: 7e-7,
        unit: "m"
      },
      {
        id: "slitSeparationM",
        label: "Slit separation",
        min: 5e-5,
        max: 2e-3,
        unit: "m"
      },
      {
        id: "screenDistanceM",
        label: "Screen distance",
        min: 0.2,
        max: 3,
        unit: "m"
      }
    ],
    benchmarkCases: youngDoubleSlitBenchmarks,
    tolerance: 1e-7,
    graphExpectations: [
      {
        id: "intensity-y",
        label: "Screen intensity",
        xLabel: "screen position",
        yLabel: "relative intensity",
        shape: "qualitative"
      }
    ],
    warnings: [
      "The app flags selected points outside the stated small-angle range and retains exact path geometry there."
    ]
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
var experimentValidationSummary = Object.values(
  experimentValidationRegistry
).reduce(
  (summary, item) => {
    summary.total += 1;
    summary[item.status] += 1;
    if (item.benchmarkCases.some((benchmark) => !benchmark.pass))
      summary.failed += 1;
    if (item.warnings.length) summary.warnings += item.warnings.length;
    return summary;
  },
  { ...emptyExperimentValidationSummary }
);

// src/lib/units.ts
var identity = (value) => value;
var scale4 = (factor) => ({
  toSI: (value) => value * factor,
  fromSI: (value) => value / factor
});
var unitRegistry = {
  "": { id: "dimensionless", name: "Dimensionless", symbol: "", dimension: "dimensionless", toSI: identity, fromSI: identity },
  m: { id: "meter", name: "meter", symbol: "m", dimension: "length", ...scale4(1) },
  cm: { id: "centimeter", name: "centimeter", symbol: "cm", dimension: "length", ...scale4(0.01) },
  mm: { id: "millimeter", name: "millimeter", symbol: "mm", dimension: "length", ...scale4(1e-3) },
  km: { id: "kilometer", name: "kilometer", symbol: "km", dimension: "length", ...scale4(1e3) },
  nm: { id: "nanometer", name: "nanometer", symbol: "nm", dimension: "length", ...scale4(1e-9) },
  kg: { id: "kilogram", name: "kilogram", symbol: "kg", dimension: "mass", ...scale4(1) },
  g: { id: "gram", name: "gram", symbol: "g", dimension: "mass", ...scale4(1e-3) },
  s: { id: "second", name: "second", symbol: "s", dimension: "time", ...scale4(1) },
  ms: { id: "millisecond", name: "millisecond", symbol: "ms", dimension: "time", ...scale4(1e-3) },
  h: { id: "hour", name: "hour", symbol: "h", dimension: "time", ...scale4(3600) },
  N: { id: "newton", name: "newton", symbol: "N", dimension: "force", ...scale4(1) },
  dyn: { id: "dyne", name: "dyne", symbol: "dyn", dimension: "force", ...scale4(1e-5) },
  J: { id: "joule", name: "joule", symbol: "J", dimension: "energy", ...scale4(1) },
  kJ: { id: "kilojoule", name: "kilojoule", symbol: "kJ", dimension: "energy", ...scale4(1e3) },
  eV: { id: "electronvolt", name: "electronvolt", symbol: "eV", dimension: "energy", ...scale4(1602176634e-28) },
  erg: { id: "erg", name: "erg", symbol: "erg", dimension: "energy", ...scale4(1e-7) },
  Pa: { id: "pascal", name: "pascal", symbol: "Pa", dimension: "pressure", ...scale4(1) },
  kPa: { id: "kilopascal", name: "kilopascal", symbol: "kPa", dimension: "pressure", ...scale4(1e3) },
  bar: { id: "bar", name: "bar", symbol: "bar", dimension: "pressure", ...scale4(1e5) },
  Ba: { id: "barye", name: "barye", symbol: "Ba", dimension: "pressure", ...scale4(0.1) },
  C: { id: "coulomb", name: "coulomb", symbol: "C", dimension: "charge", ...scale4(1) },
  microC: { id: "microcoulomb", name: "microcoulomb", symbol: "microC", dimension: "charge", ...scale4(1e-6) },
  V: { id: "volt", name: "volt", symbol: "V", dimension: "voltage", ...scale4(1) },
  A: { id: "ampere", name: "ampere", symbol: "A", dimension: "current", ...scale4(1) },
  mA: { id: "milliampere", name: "milliampere", symbol: "mA", dimension: "current", ...scale4(1e-3) },
  W: { id: "watt", name: "watt", symbol: "W", dimension: "power", ...scale4(1) },
  Hz: { id: "hertz", name: "hertz", symbol: "Hz", dimension: "frequency", ...scale4(1) },
  kHz: { id: "kilohertz", name: "kilohertz", symbol: "kHz", dimension: "frequency", ...scale4(1e3) },
  THz: { id: "terahertz", name: "terahertz", symbol: "THz", dimension: "frequency", ...scale4(1e12) },
  K: { id: "kelvin", name: "kelvin", symbol: "K", dimension: "temperature", ...scale4(1) },
  degC: { id: "celsius", name: "degree Celsius", symbol: "C", dimension: "temperature", toSI: (value) => value + 273.15, fromSI: (value) => value - 273.15 },
  "m^3": { id: "cubic-meter", name: "cubic meter", symbol: "m^3", dimension: "volume", ...scale4(1) },
  L: { id: "liter", name: "liter", symbol: "L", dimension: "volume", ...scale4(1e-3) },
  "kg/m^3": { id: "kilogram-per-cubic-meter", name: "kilogram per cubic meter", symbol: "kg/m^3", dimension: "density", ...scale4(1) },
  "kg m/s": { id: "kilogram-meter-per-second", name: "kilogram meter per second", symbol: "kg m/s", dimension: "momentum", ...scale4(1) },
  "m/s": { id: "meter-per-second", name: "meter per second", symbol: "m/s", dimension: "velocity", ...scale4(1) },
  "cm/s": { id: "centimeter-per-second", name: "centimeter per second", symbol: "cm/s", dimension: "velocity", ...scale4(0.01) },
  "m/s^2": { id: "meter-per-second-squared", name: "meter per second squared", symbol: "m/s^2", dimension: "acceleration", ...scale4(1) },
  "cm/s^2": { id: "centimeter-per-second-squared", name: "centimeter per second squared", symbol: "cm/s^2", dimension: "acceleration", ...scale4(0.01) },
  rad: { id: "radian", name: "radian", symbol: "rad", dimension: "angle", ...scale4(1) },
  deg: { id: "degree", name: "degree", symbol: "deg", dimension: "angle", toSI: (value) => value * Math.PI / 180, fromSI: (value) => value * 180 / Math.PI },
  "rad/s": { id: "radian-per-second", name: "radian per second", symbol: "rad/s", dimension: "angularVelocity", ...scale4(1) },
  "rad/s^2": { id: "radian-per-second-squared", name: "radian per second squared", symbol: "rad/s^2", dimension: "angularAcceleration", ...scale4(1) },
  "N/C": { id: "newton-per-coulomb", name: "newton per coulomb", symbol: "N/C", dimension: "electricField", ...scale4(1) },
  T: { id: "tesla", name: "tesla", symbol: "T", dimension: "magneticField", ...scale4(1) },
  F: { id: "farad", name: "farad", symbol: "F", dimension: "capacitance", ...scale4(1) },
  ohm: { id: "ohm", name: "ohm", symbol: "ohm", dimension: "resistance", ...scale4(1) }
};
function quantity(value, unit2, dimension) {
  const definition = unitRegistry[unit2];
  const resolvedDimension = dimension ?? definition?.dimension;
  if (!resolvedDimension) {
    console.warn(`[units] Unknown unit "${unit2}". Treating as dimensionless.`);
    return { value, unit: unit2, dimension: "dimensionless" };
  }
  if (definition && definition.dimension !== resolvedDimension) {
    console.warn(`[units] Unit "${unit2}" has dimension ${definition.dimension}, expected ${resolvedDimension}.`);
  }
  return { value, unit: unit2, dimension: resolvedDimension };
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
function freeFallDistance(initialVelocity2, gravity, time) {
  return assertDimensions(quantity(initialVelocity2 * time + 0.5 * gravity * time * time, "m", "length"), "length", "freeFallDistance");
}
function freeFallVelocity(initialVelocity2, gravity, time) {
  return assertDimensions(quantity(initialVelocity2 + gravity * time, "m/s", "velocity"), "velocity", "freeFallVelocity");
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
function pendulumPeriod(length2, gravity) {
  if (length2 <= 0 || gravity <= 0) throw new Error("Length and gravity must be positive.");
  return assertDimensions(quantity(2 * Math.PI * Math.sqrt(length2 / gravity), "s", "time"), "time", "pendulumPeriod");
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
function seriesResistance2(...resistances) {
  return assertDimensions(quantity(resistances.reduce((sum, value) => sum + value, 0), "ohm", "resistance"), "resistance", "seriesResistance");
}
function parallelResistance2(...resistances) {
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
  caseOf("series-resistance", "Electricity", "series-parallel-resistance", "Series resistance", "R=1,2,3 ohm", 6, 1e-12, "ideal-circuits", "Ideal series path.", () => seriesResistance2(1, 2, 3).value),
  caseOf("parallel-resistance", "Electricity", "series-parallel-resistance", "Parallel resistance", "R=10,10 ohm", 5, 1e-12, "ideal-circuits", "Ideal parallel branches.", () => parallelResistance2(10, 10).value),
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
  const readinessScore = clamp23(Math.round(learningScore * 0.4 + classroomScore * 0.3 + accuracyScore * 0.2 + scoreEvidence(experiment) * 0.1));
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
  return clamp23(score);
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
function clamp23(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// outputs/lesson-catalog-20260902/extract_lessons.ts
var experimentById = new Map(experiments.map((item) => [item.id, item]));
var profileById = new Map(learningStudioProfiles.map((item) => [item.experimentId, item]));
var curriculumTopics = curriculum.flatMap(
  (level) => level.units.flatMap(
    (unit2) => unit2.topics.map((topic2) => ({
      classId: level.id,
      grade: level.grade,
      classLabel: level.label,
      curriculumSource: level.source,
      classDescription: level.description,
      unitId: unit2.id,
      unitTitle: unit2.title,
      unitMarks: unit2.marks ?? null,
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
