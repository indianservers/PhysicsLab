import { practicals } from "../practicals/model";
export interface ReferenceLab { title: string; route: string }

// Dedicated pages corresponding to the six reference images in each studio folder.
export const referenceLabsByStudio: Record<string, ReferenceLab[]> = {
  "measurement": [
    {
      "title": "Meter Scale",
      "route": "/measurement/meter-scale"
    },
    {
      "title": "Vernier Caliper",
      "route": "/measurement/vernier-caliper"
    },
    {
      "title": "Micrometer",
      "route": "/measurement/micrometer"
    },
    {
      "title": "Spherometer",
      "route": "/measurement/spherometer"
    },
    {
      "title": "Mass & Time",
      "route": "/measurement/mass-time"
    },
    {
      "title": "Uncertainty",
      "route": "/measurement/uncertainty"
    }
  ],
  "mechanics": [
    {
      "title": "Free Body Diagrams",
      "route": "/mechanics/free-body-diagrams"
    },
    {
      "title": "Inclined Plane",
      "route": "/mechanics/inclined-plane"
    },
    {
      "title": "Pulley Systems",
      "route": "/mechanics/pulley-systems"
    },
    {
      "title": "Torque Levers",
      "route": "/mechanics/torque-levers"
    },
    {
      "title": "Equilibrium COM",
      "route": "/mechanics/equilibrium-com"
    },
    {
      "title": "Momentum Collisions",
      "route": "/mechanics/momentum-collisions"
    }
  ],
  "motion-kinematics": [
    {
      "title": "Position Time",
      "route": "/motion/position-time"
    },
    {
      "title": "Velocity Time",
      "route": "/motion/velocity-time"
    },
    {
      "title": "Acceleration Time",
      "route": "/motion/acceleration-time"
    },
    {
      "title": "Projectile Motion",
      "route": "/motion/projectile-motion"
    },
    {
      "title": "Relative Motion",
      "route": "/motion/relative-motion"
    },
    {
      "title": "Circular Motion",
      "route": "/motion/circular-motion"
    }
  ],
  "force-newton": [
    {
      "title": "First Law / Inertia",
      "route": "/motion/first-law-inertia"
    },
    {
      "title": "Second Law / F = ma",
      "route": "/motion/second-law-fma"
    },
    {
      "title": "Third Law / Pairs",
      "route": "/motion/third-law-pairs"
    },
    {
      "title": "Friction",
      "route": "/motion/friction"
    },
    {
      "title": "Tension Normal",
      "route": "/motion/tension-normal"
    },
    {
      "title": "Multi Force Challenge",
      "route": "/motion/multi-force-challenge"
    }
  ],
  "work-energy-power": [
    {
      "title": "Work",
      "route": "/motion/work"
    },
    {
      "title": "Kinetic Energy",
      "route": "/motion/kinetic-energy"
    },
    {
      "title": "Potential Energy",
      "route": "/motion/potential-energy"
    },
    {
      "title": "Energy Conservation",
      "route": "/motion/conservation-energy"
    },
    {
      "title": "Power",
      "route": "/motion/power"
    },
    {
      "title": "Efficiency",
      "route": "/motion/efficiency"
    }
  ],
  "gravitation": [
    {
      "title": "Universal Gravitation",
      "route": "/motion/universal-gravity"
    },
    {
      "title": "Gravitational Field",
      "route": "/motion/gravitational-field"
    },
    {
      "title": "Gravitational Potential",
      "route": "/motion/gravitational-potential"
    },
    {
      "title": "Orbits",
      "route": "/motion/orbits"
    },
    {
      "title": "Escape Velocity",
      "route": "/motion/escape-velocity"
    },
    {
      "title": "Kepler’s Laws",
      "route": "/motion/keplers-laws"
    }
  ],
  "oscillations": [
    {
      "title": "Spring SHM",
      "route": "/motion/spring-shm"
    },
    {
      "title": "Pendulum",
      "route": "/motion/pendulum"
    },
    {
      "title": "Energy Exchange",
      "route": "/motion/energy-exchange"
    },
    {
      "title": "Damping",
      "route": "/motion/damping"
    },
    {
      "title": "Resonance",
      "route": "/motion/resonance"
    },
    {
      "title": "Coupled Oscillators",
      "route": "/motion/coupled-oscillators"
    }
  ],
  "waves-sound": [
    {
      "title": "Wave Properties",
      "route": "/motion/wave-properties"
    },
    {
      "title": "Superposition",
      "route": "/motion/superposition"
    },
    {
      "title": "Interference",
      "route": "/motion/interference"
    },
    {
      "title": "Standing Waves",
      "route": "/motion/standing-waves"
    },
    {
      "title": "Sound Spectrum",
      "route": "/motion/sound-spectrum"
    },
    {
      "title": "Doppler Effect",
      "route": "/motion/doppler-effect"
    }
  ],
  "optics": [
    { title: "Optical Elements", route: "/optics/optical-elements" },
    {
      "title": "Reflection",
      "route": "/optics/reflection"
    },
    {
      "title": "Refraction",
      "route": "/optics/refraction"
    },
    {
      "title": "Lenses",
      "route": "/optics/lenses"
    },
    {
      "title": "Mirrors",
      "route": "/optics/mirrors"
    },
    {
      "title": "Interference",
      "route": "/optics/interference"
    },
    {
      "title": "Diffraction",
      "route": "/optics/diffraction"
    }
  ],
  "electricity": [
    {
      "title": "Coulomb Force",
      "route": "/electricity/coulomb-force"
    },
    {
      "title": "Electric Field",
      "route": "/electricity/electric-field"
    },
    {
      "title": "Electric Potential",
      "route": "/electricity/electric-potential"
    },
    {
      "title": "Current",
      "route": "/electricity/current"
    },
    {
      "title": "Circuits",
      "route": "/electricity/circuits"
    },
    {
      "title": "Capacitors",
      "route": "/electricity/capacitors"
    }
  ],
  "magnetism": [
    {
      "title": "Field Lines",
      "route": "/magnetism/field-lines"
    },
    {
      "title": "Lorentz Force",
      "route": "/magnetism/lorentz-force"
    },
    {
      "title": "Current Wire",
      "route": "/magnetism/current-wire"
    },
    {
      "title": "Solenoids",
      "route": "/magnetism/solenoids"
    },
    {
      "title": "Induction",
      "route": "/magnetism/induction"
    },
    {
      "title": "Electromagnets",
      "route": "/magnetism/electromagnets"
    }
  ],
  "electronics": [
    {
      "title": "Semiconductors",
      "route": "/electronics/semiconductors"
    },
    {
      "title": "Diodes",
      "route": "/electronics/diodes"
    },
    {
      "title": "Transistors",
      "route": "/electronics/transistors"
    },
    {
      "title": "Amplifiers",
      "route": "/electronics/amplifiers"
    },
    {
      "title": "Logic Gates",
      "route": "/electronics/logic-gates"
    },
    {
      "title": "Sensors",
      "route": "/electronics/sensors"
    }
  ],
  "thermodynamics": [
    {
      "title": "Temperature",
      "route": "/thermodynamics/temperature"
    },
    {
      "title": "Heat Transfer",
      "route": "/thermodynamics/heat-transfer"
    },
    {
      "title": "Gas Laws",
      "route": "/thermodynamics/gas-laws"
    },
    {
      "title": "First Law",
      "route": "/thermodynamics/first-law"
    },
    {
      "title": "Entropy",
      "route": "/thermodynamics/entropy"
    },
    {
      "title": "Heat Engines",
      "route": "/thermodynamics/heat-engines"
    }
  ],
  "fluid-mechanics": [
    {
      "title": "Density Pressure",
      "route": "/fluid-mechanics/density-pressure"
    },
    {
      "title": "Hydrostatics",
      "route": "/fluid-mechanics/hydrostatics"
    },
    {
      "title": "Buoyancy",
      "route": "/fluid-mechanics/buoyancy"
    },
    {
      "title": "Continuity",
      "route": "/fluid-mechanics/continuity"
    },
    {
      "title": "Bernoulli",
      "route": "/fluid-mechanics/bernoulli"
    },
    {
      "title": "Viscosity",
      "route": "/fluid-mechanics/viscosity"
    }
  ],
  "modern-physics": [
    {
      "title": "Quantum Ideas",
      "route": "/modern-physics/quantum-ideas"
    },
    {
      "title": "Photoelectric Effect",
      "route": "/modern-physics/photoelectric-effect"
    },
    {
      "title": "Matter Waves",
      "route": "/modern-physics/matter-waves"
    },
    {
      "title": "Atomic Spectra",
      "route": "/modern-physics/atomic-spectra"
    },
    {
      "title": "Nuclear Structure",
      "route": "/modern-physics/nuclear-structure"
    },
    {
      "title": "Radioactivity",
      "route": "/modern-physics/radioactivity"
    }
  ],
  "astronomy-astrophysics": [
    {
      "title": "Solar System Orbits",
      "route": "/astrophysics/solar-system"
    },
    {
      "title": "Stellar Life",
      "route": "/astrophysics/stellar-life"
    },
    {
      "title": "Spectroscopy",
      "route": "/astrophysics/spectroscopy"
    },
    {
      "title": "Galaxies",
      "route": "/astrophysics/galaxies"
    },
    {
      "title": "Cosmology",
      "route": "/astrophysics/cosmology"
    },
    {
      "title": "Exoplanets",
      "route": "/astrophysics/exoplanets"
    }
  ]
};

// Practical collection supplements the subject concept labs.
for (const lab of practicals) referenceLabsByStudio[lab.studio].push({title:lab.title,route:`/practicals/${lab.id}`});
referenceLabsByStudio["motion-kinematics"].push({title:"Filter Papers Falling in Air",route:"/practicals/papers"});

