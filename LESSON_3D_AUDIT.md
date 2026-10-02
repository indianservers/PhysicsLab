# Full lesson 3D audit

Checked 763 routes and 96 in-page studio concepts.
0 route failures. 42 experiment 3D tabs are Upcoming.

This audit checks route coverage, rendering, Upcoming notices, and absence of removed generic 3D canvases. It is not a numerical validation of every retained physics model.

## Coverage

- Astrophysics concept: 38
- Client Demos: 4
- Concept studio: 16
- Curriculum concept: 74
- Experiment: 92
- Experiment 3D tab: 92
- Modules: 7
- Particle concept: 12
- Particle query route: 12
- Platform: 26
- Pro Lab: 2
- Rocket component lesson: 225
- Standalone route: 104
- String theory lesson: 32
- Teaching: 13
- Topic page: 14

## Retired preview findings

- free-fall: The 3D ball follows a two-point path at constant speed; gravity and initial speed do not control its motion.
- friction: The 3D cart oscillates independently of force and friction, and its parameter order differs from the lesson controls.
- balanced-unbalanced-forces: Unbalanced force drives a decorative sine oscillation instead of acceleration.
- work-power: The load reuses the decorative cart oscillation instead of the selected displacement and duration.
- uniform-motion: The shared cart update overwrites the position with a sine oscillation even at zero speed.
- elastic-collision: Both carts reuse force-balance oscillations; no collision or velocity exchange is animated.
- conservation-of-energy: The ball repeatedly slides up and down using a sine wave rather than an energy-based trajectory.
- simple-pendulum: The animation uses a fixed frequency independent of pendulum length.
- buoyancy: The 3D renderer reads fluid density and object volume as object density and fluid density.
- circular-motion: The orbit adds an unrelated vertical wobble and keeps moving at zero angular velocity.
- rotational-dynamics: The flywheel uses constant spin and ignores lever radius in its motion rather than showing angular acceleration.
- satellite-orbit: The satellite stays on a circle at every speed, including the claimed escape condition.
- distance-time-graph: The 3D cart moves along a minimum-length path even at zero speed and is not synchronized with its graph.
- fluid-pressure: Generic buoyancy tank reused as a pressure-depth lesson.
- force-and-pressure: Generic buoyancy tank reused as a force/contact-area lesson.
- heat-and-temperature: Generic particles use unrelated parameter mappings and do not distinguish heat from temperature.
- heat-transfer: Generic particle chamber does not represent conduction, convection, or radiation.
- gas-laws: Generic thermal renderer expects temperature, mass, volume while lesson supplies moles, temperature, volume.
- ohms-law: Generic voltage-driven circuit receives current as its first parameter.
- series-parallel-resistance: Generic single-loop circuit does not render the selected series/parallel topology.
- electric-power: Generic current animation does not model the selected appliance or power output.
- heating-effect-current: Generic circuit glow follows current instead of Joule heating.
- capacitor-lab: Generic resistor-and-bulb circuit has no capacitor plates or charging model.
- magnetic-field-current: Solenoid scene reused for the current-carrying wire lesson.
- mirror-formula: Transmitting lens bench reused for reflecting mirrors.
- total-internal-reflection: Dispersive prism scene reused for the critical-angle reflection lesson.
- young-double-slit: Generic ring waves ignore the wavelength, screen distance, and slit separation controls.
- single-slit-diffraction: Two-source interference animation reused for a single slit.
- sound-wave-anatomy: Two-source interference animation reused for longitudinal sound.
- de-broglie-wavelength: Generic interference rings reused for a matter-wave lesson; the separate dedicated matter-wave apparatus remains.
- special-relativity-bridge: Distance-time cart animation reused for special relativity.

## 3D source inventory

Includes active renderers, unused implementations, and commented legacy scenes. Shared educational 2D/SVG views and decorative home-page graphics are outside the retired 3D simulation list.

- src/components/AstroThreeScene.tsx
- src/components/ComScene.tsx
- src/components/ConceptStudioThreeScene.tsx
- src/components/ConceptThreeScene.tsx
- src/components/Experiment3DAnimation.tsx
- src/components/StringTheoryNetworkThreeScene.tsx
- src/components/StringTheoryThreeScene.tsx
- src/components/WebGLHero.tsx
- src/experiments/ac-generator/AcGeneratorLab.tsx
- src/experiments/ac-generator/GeneratorThreeScene.tsx
- src/experiments/ac-lcr-resonance/LcrResonanceLab.tsx
- src/experiments/capacitor-lab/CapacitorLab.tsx
- src/experiments/chaotic-coupled-oscillators/PhysicalOscillatorLab.tsx
- src/experiments/chemical-effects-current/ChemicalEffectsLab.tsx
- src/experiments/de-broglie-wavelength/MatterWaveScene.tsx
- src/experiments/electric-power/ElectricPowerLab.tsx
- src/experiments/electrostatic-field-potential/ElectrostaticFieldLab.tsx
- src/experiments/expansion-labs/AtomicInteractionsLab.tsx
- src/experiments/internal-resistance-cell/InternalResistanceLab.tsx
- src/experiments/newton-s-second-law/NewtonTrackScene.tsx
- src/experiments/universal-gravitation/UniversalGravitationLab.tsx

## Every route

| Route | Group | Rendered 3D canvases | Upcoming notices | Result |
|---|---|---:|---:|---|
| /astrophysics?concept=accretion-disks | Astrophysics concept | 1 | 0 | PASS |
| /astrophysics?concept=big-bang | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=black-holes | Astrophysics concept | 1 | 0 | PASS |
| /astrophysics?concept=cosmic-microwave-background | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=cosmic-rays | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=cosmic-web | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=dark-energy | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=dark-matter | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=distance-ladder | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=escape-speed | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=exoplanets | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=galaxy-structure | Astrophysics concept | 1 | 0 | PASS |
| /astrophysics?concept=gamma-ray-bursts | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=general-relativity | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=gravitational-lensing | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=gravitational-waves | Astrophysics concept | 1 | 0 | PASS |
| /astrophysics?concept=gravity-orbits | Astrophysics concept | 1 | 0 | PASS |
| /astrophysics?concept=hubble-law | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=kepler-laws | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=main-sequence | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=milky-way | Astrophysics concept | 1 | 0 | PASS |
| /astrophysics?concept=neutron-stars | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=nucleosynthesis | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=parallax | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=planetary-atmospheres | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=pulsars | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=quasars | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=radio-astronomy | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=redshift | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=solar-system | Astrophysics concept | 1 | 0 | PASS |
| /astrophysics?concept=space-telescopes | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=spectroscopy | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=stellar-evolution | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=stellar-luminosity | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=supernovae | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=tidal-forces | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=transit-method | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=white-dwarfs | Astrophysics concept | 0 | 1 | PASS |
| /astrophysics?concept=black-hole-lensing | Client Demos | 1 | 0 | PASS |
| /pro-lab | Client Demos | 0 | 0 | PASS |
| /pro-lab/launch-vehicle | Client Demos | 0 | 0 | PASS |
| /rocket-lab/parts | Client Demos | 0 | 0 | PASS |
| /concept-studio/astronomy-astrophysics | Concept studio | 0 | 1 | PASS |
| /concept-studio/electricity | Concept studio | 0 | 1 | PASS |
| /concept-studio/electronics | Concept studio | 0 | 1 | PASS |
| /concept-studio/fluid-mechanics | Concept studio | 0 | 1 | PASS |
| /concept-studio/force-newton | Concept studio | 0 | 1 | PASS |
| /concept-studio/gravitation | Concept studio | 0 | 1 | PASS |
| /concept-studio/magnetism | Concept studio | 0 | 1 | PASS |
| /concept-studio/measurement | Concept studio | 0 | 1 | PASS |
| /concept-studio/mechanics | Concept studio | 0 | 1 | PASS |
| /concept-studio/modern-physics | Concept studio | 0 | 1 | PASS |
| /concept-studio/motion-kinematics | Concept studio | 0 | 1 | PASS |
| /concept-studio/optics | Concept studio | 0 | 1 | PASS |
| /concept-studio/oscillations | Concept studio | 0 | 1 | PASS |
| /concept-studio/thermodynamics | Concept studio | 0 | 1 | PASS |
| /concept-studio/waves-sound | Concept studio | 0 | 1 | PASS |
| /concept-studio/work-energy-power | Concept studio | 0 | 1 | PASS |
| /concepts?concept=c10-electric-power | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-glass-prism | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-human-eye | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-lenses | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-magnetism | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-mirrors | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-ohms-law | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-series-parallel | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c10-sources-energy | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-chaos-pendulum | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-energy-collisions | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-gravitation | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-kinetic-theory | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-laws-motion | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-oscillations-waves | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-plane-motion | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-resonance | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-rotation | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-shm-pendulum | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-solids-fluids | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-straight-line | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-thermal | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c11-units-errors | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-current | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-dual-atoms | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-electrostatics | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-em-waves | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-emi-ac | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-magnetic-effects | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-ray-optics | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-relativity-bridge | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-semiconductors | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c12-wave-optics | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c6-light-shadows | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c6-magnets | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c6-motion-measurement | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c6-simple-circuits | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-distance-time | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-heat-temperature | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-heat-transfer | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-heating-effect | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-lenses | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-magnetic-effect | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-reflection | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c7-speed | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c8-chemical-current | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c8-force-effects | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c8-friction | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c8-light | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c8-pressure | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c8-sound | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c8-static-lightning | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c9-floatation | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c9-gravitation | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c9-motion | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c9-newton-laws | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c9-pendulum-intro | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c9-sound | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=c9-work-energy | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=pg-advanced-quantum | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=pg-condensed-matter | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=pg-nuclear-particle | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=pg-plasma-astrophysics | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=pg-statistical-field | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=phd-biophysics-complexity | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=phd-computation | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=phd-high-energy | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=phd-materials-devices | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=phd-quantum-info | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=ug-classical-mechanics | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=ug-electrodynamics | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=ug-optics-waves | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=ug-quantum | Curriculum concept | 0 | 0 | PASS |
| /concepts?concept=ug-stat-thermal | Curriculum concept | 0 | 0 | PASS |
| /experiments/ac-generator | Experiment | 1 | 0 | PASS |
| /experiments/ac-lcr-resonance | Experiment | 0 | 0 | PASS |
| /experiments/advanced-quantum-operators | Experiment | 1 | 0 | PASS |
| /experiments/atomic-interactions | Experiment | 1 | 0 | PASS |
| /experiments/balanced-unbalanced-forces | Experiment | 0 | 0 | PASS |
| /experiments/balancing-act | Experiment | 0 | 0 | PASS |
| /experiments/bernoulli-fluid-flow | Experiment | 1 | 0 | PASS |
| /experiments/blackbody-spectrum | Experiment | 0 | 0 | PASS |
| /experiments/bohr-model | Experiment | 1 | 0 | PASS |
| /experiments/build-a-nucleus | Experiment | 0 | 0 | PASS |
| /experiments/buoyancy | Experiment | 0 | 0 | PASS |
| /experiments/calorimetry-mixing | Experiment | 1 | 0 | PASS |
| /experiments/capacitor-lab | Experiment | 0 | 0 | PASS |
| /experiments/chaotic-coupled-oscillators | Experiment | 1 | 0 | PASS |
| /experiments/chemical-effects-current | Experiment | 1 | 0 | PASS |
| /experiments/chladni-plate | Experiment | 1 | 0 | PASS |
| /experiments/circular-motion | Experiment | 0 | 0 | PASS |
| /experiments/color-vision | Experiment | 0 | 0 | PASS |
| /experiments/computational-physics-workflow | Experiment | 1 | 0 | PASS |
| /experiments/conservation-of-energy | Experiment | 0 | 0 | PASS |
| /experiments/de-broglie-wavelength | Experiment | 1 | 0 | PASS |
| /experiments/density-float-sink | Experiment | 1 | 0 | PASS |
| /experiments/diffusion | Experiment | 0 | 0 | PASS |
| /experiments/distance-time-graph | Experiment | 0 | 0 | PASS |
| /experiments/echo-speed-sound | Experiment | 1 | 0 | PASS |
| /experiments/elastic-collision | Experiment | 0 | 0 | PASS |
| /experiments/electric-power | Experiment | 0 | 0 | PASS |
| /experiments/electromagnet | Experiment | 1 | 0 | PASS |
| /experiments/electrostatic-field-potential | Experiment | 0 | 0 | PASS |
| /experiments/em-spectrum | Experiment | 1 | 0 | PASS |
| /experiments/emi-faraday | Experiment | 1 | 0 | PASS |
| /experiments/fluid-pressure | Experiment | 0 | 0 | PASS |
| /experiments/force-and-pressure | Experiment | 0 | 0 | PASS |
| /experiments/fourier-making-waves | Experiment | 0 | 0 | PASS |
| /experiments/free-fall | Experiment | 0 | 0 | PASS |
| /experiments/friction | Experiment | 0 | 0 | PASS |
| /experiments/gas-laws | Experiment | 0 | 0 | PASS |
| /experiments/glass-slab-refraction | Experiment | 1 | 0 | PASS |
| /experiments/greenhouse-effect | Experiment | 0 | 0 | PASS |
| /experiments/heat-and-temperature | Experiment | 0 | 0 | PASS |
| /experiments/heat-transfer | Experiment | 0 | 0 | PASS |
| /experiments/heating-effect-current | Experiment | 0 | 0 | PASS |
| /experiments/hooke-s-law | Experiment | 1 | 0 | PASS |
| /experiments/human-eye-defects | Experiment | 1 | 0 | PASS |
| /experiments/inclined-plane | Experiment | 1 | 0 | PASS |
| /experiments/internal-resistance-cell | Experiment | 1 | 0 | PASS |
| /experiments/kirchhoff-circuit | Experiment | 1 | 0 | PASS |
| /experiments/lens-formula | Experiment | 1 | 0 | PASS |
| /experiments/logic-gates | Experiment | 1 | 0 | PASS |
| /experiments/lorentz-force | Experiment | 1 | 0 | PASS |
| /experiments/magnetic-field-current | Experiment | 0 | 0 | PASS |
| /experiments/mass-and-weight | Experiment | 1 | 0 | PASS |
| /experiments/measurement-errors | Experiment | 1 | 0 | PASS |
| /experiments/meter-bridge | Experiment | 1 | 0 | PASS |
| /experiments/mirror-formula | Experiment | 0 | 0 | PASS |
| /experiments/molecules-and-light | Experiment | 0 | 0 | PASS |
| /experiments/multiple-reflection | Experiment | 1 | 0 | PASS |
| /experiments/newton-s-second-law | Experiment | 0 | 0 | PASS |
| /experiments/nuclear-decay | Experiment | 1 | 0 | PASS |
| /experiments/ohms-law | Experiment | 0 | 0 | PASS |
| /experiments/optical-instruments | Experiment | 1 | 0 | PASS |
| /experiments/photoelectric-equation | Experiment | 1 | 0 | PASS |
| /experiments/polarization-lab | Experiment | 1 | 0 | PASS |
| /experiments/prism-dispersion | Experiment | 1 | 0 | PASS |
| /experiments/projectile-motion | Experiment | 1 | 0 | PASS |
| /experiments/reflection-plane-mirror | Experiment | 1 | 0 | PASS |
| /experiments/resistance-in-a-wire | Experiment | 0 | 0 | PASS |
| /experiments/rotational-dynamics | Experiment | 0 | 0 | PASS |
| /experiments/rutherford-scattering | Experiment | 0 | 0 | PASS |
| /experiments/satellite-orbit | Experiment | 0 | 0 | PASS |
| /experiments/semiconductor-diode | Experiment | 1 | 0 | PASS |
| /experiments/series-parallel-resistance | Experiment | 0 | 0 | PASS |
| /experiments/shadows-eclipses | Experiment | 0 | 0 | PASS |
| /experiments/shm-spring | Experiment | 1 | 0 | PASS |
| /experiments/simple-pendulum | Experiment | 0 | 0 | PASS |
| /experiments/single-slit-diffraction | Experiment | 0 | 0 | PASS |
| /experiments/sound-pitch-loudness | Experiment | 1 | 0 | PASS |
| /experiments/sound-wave-anatomy | Experiment | 0 | 0 | PASS |
| /experiments/sources-of-energy | Experiment | 1 | 0 | PASS |
| /experiments/special-relativity-bridge | Experiment | 0 | 0 | PASS |
| /experiments/states-of-matter | Experiment | 0 | 0 | PASS |
| /experiments/static-electricity | Experiment | 1 | 0 | PASS |
| /experiments/statistical-ensemble-lab | Experiment | 1 | 0 | PASS |
| /experiments/thermodynamic-process | Experiment | 1 | 0 | PASS |
| /experiments/total-internal-reflection | Experiment | 0 | 0 | PASS |
| /experiments/transformer-lab | Experiment | 1 | 0 | PASS |
| /experiments/uniform-motion | Experiment | 0 | 0 | PASS |
| /experiments/universal-gravitation | Experiment | 0 | 0 | PASS |
| /experiments/vector-resolution | Experiment | 1 | 0 | PASS |
| /experiments/wave-lab | Experiment | 1 | 0 | PASS |
| /experiments/work-power | Experiment | 0 | 0 | PASS |
| /experiments/young-double-slit | Experiment | 0 | 0 | PASS |
| /experiments/ac-generator#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/ac-lcr-resonance#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/advanced-quantum-operators#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/atomic-interactions#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/balanced-unbalanced-forces#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/balancing-act#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/bernoulli-fluid-flow#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/blackbody-spectrum#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/bohr-model#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/build-a-nucleus#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/buoyancy#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/calorimetry-mixing#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/capacitor-lab#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/chaotic-coupled-oscillators#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/chemical-effects-current#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/chladni-plate#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/circular-motion#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/color-vision#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/computational-physics-workflow#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/conservation-of-energy#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/de-broglie-wavelength#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/density-float-sink#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/diffusion#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/distance-time-graph#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/echo-speed-sound#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/elastic-collision#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/electric-power#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/electromagnet#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/electrostatic-field-potential#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/em-spectrum#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/emi-faraday#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/fluid-pressure#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/force-and-pressure#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/fourier-making-waves#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/free-fall#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/friction#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/gas-laws#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/glass-slab-refraction#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/greenhouse-effect#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/heat-and-temperature#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/heat-transfer#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/heating-effect-current#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/hooke-s-law#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/human-eye-defects#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/inclined-plane#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/internal-resistance-cell#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/kirchhoff-circuit#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/lens-formula#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/logic-gates#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/lorentz-force#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/magnetic-field-current#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/mass-and-weight#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/measurement-errors#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/meter-bridge#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/mirror-formula#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/molecules-and-light#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/multiple-reflection#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/newton-s-second-law#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/nuclear-decay#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/ohms-law#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/optical-instruments#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/photoelectric-equation#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/polarization-lab#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/prism-dispersion#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/projectile-motion#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/reflection-plane-mirror#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/resistance-in-a-wire#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/rotational-dynamics#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/rutherford-scattering#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/satellite-orbit#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/semiconductor-diode#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/series-parallel-resistance#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/shadows-eclipses#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/shm-spring#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/simple-pendulum#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/single-slit-diffraction#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/sound-pitch-loudness#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/sound-wave-anatomy#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/sources-of-energy#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/special-relativity-bridge#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/states-of-matter#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/static-electricity#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/statistical-ensemble-lab#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/thermodynamic-process#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/total-internal-reflection#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/transformer-lab#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/uniform-motion#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/universal-gravitation#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/vector-resolution#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/wave-lab#three-d | Experiment 3D tab | 1 | 0 | PASS |
| /experiments/work-power#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /experiments/young-double-slit#three-d | Experiment 3D tab | 0 | 1 | PASS |
| /concepts | Modules | 0 | 0 | PASS |
| /dictionary?q=relativity | Modules | 0 | 0 | PASS |
| /experiments?category=Electricity | Modules | 0 | 0 | PASS |
| /experiments?category=Fluids | Modules | 0 | 0 | PASS |
| /experiments?category=Magnetism | Modules | 0 | 0 | PASS |
| /experiments?category=Mechanics | Modules | 0 | 0 | PASS |
| /experiments?category=Thermodynamics | Modules | 0 | 0 | PASS |
| /particle-physics/antimatter | Particle concept | 0 | 1 | PASS |
| /particle-physics/confinement | Particle concept | 0 | 1 | PASS |
| /particle-physics/gauge-bosons | Particle concept | 0 | 1 | PASS |
| /particle-physics/gluons-color-charge | Particle concept | 0 | 1 | PASS |
| /particle-physics/higgs-boson | Particle concept | 0 | 1 | PASS |
| /particle-physics/higgs-field | Particle concept | 0 | 1 | PASS |
| /particle-physics/leptons | Particle concept | 0 | 1 | PASS |
| /particle-physics/neutrino-oscillation | Particle concept | 0 | 1 | PASS |
| /particle-physics/quantum-field-theory | Particle concept | 0 | 1 | PASS |
| /particle-physics/quarks | Particle concept | 0 | 1 | PASS |
| /particle-physics/standard-model | Particle concept | 0 | 1 | PASS |
| /particle-physics/symmetry-breaking | Particle concept | 0 | 1 | PASS |
| /particle-physics?concept=antimatter | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=confinement | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=gauge-bosons | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=gluons-color-charge | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=higgs-boson | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=higgs-field | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=leptons | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=neutrino-oscillation | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=quantum-field-theory | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=quarks | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=standard-model | Particle query route | 0 | 1 | PASS |
| /particle-physics?concept=symmetry-breaking | Particle query route | 0 | 1 | PASS |
| / | Platform | 0 | 0 | PASS |
| /astrophysics | Platform | 1 | 0 | PASS |
| /atmosphere | Platform | 0 | 0 | PASS |
| /backup | Platform | 0 | 0 | PASS |
| /comparison?view=benchmark | Platform | 0 | 0 | PASS |
| /dictionary | Platform | 0 | 0 | PASS |
| /formulas | Platform | 0 | 0 | PASS |
| /formulas/revision-grid | Platform | 0 | 0 | PASS |
| /graph | Platform | 0 | 0 | PASS |
| /graphs | Platform | 0 | 0 | PASS |
| /help | Platform | 0 | 0 | PASS |
| /lab | Platform | 0 | 0 | PASS |
| /particle-physics | Platform | 0 | 1 | PASS |
| /physics-innovations | Platform | 0 | 0 | PASS |
| /physics/scale-of-universe | Platform | 0 | 0 | PASS |
| /privacy | Platform | 0 | 0 | PASS |
| /projects | Platform | 0 | 0 | PASS |
| /quantum | Platform | 0 | 0 | PASS |
| /quiz?view=practice | Platform | 0 | 0 | PASS |
| /sandbox | Platform | 0 | 0 | PASS |
| /settings | Platform | 0 | 0 | PASS |
| /solver | Platform | 0 | 0 | PASS |
| /string-theory | Platform | 1 | 0 | PASS |
| /syllabus | Platform | 0 | 0 | PASS |
| /terms | Platform | 0 | 0 | PASS |
| /video | Platform | 0 | 0 | PASS |
| /pro-lab/launch-vehicle#launch | Pro Lab | 0 | 0 | PASS |
| /pro-lab/launch-vehicle#mission | Pro Lab | 0 | 0 | PASS |
| /rocket-lab/parts/accelerometer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/access-panel | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/acoustic-protection | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/aerodynamic-strake | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/aft-skirt | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/airframe-or-rocket-body | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/anti-vortex-device | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/attitude-control-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/autogenous-pressurization-heat-exchanger | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/autonomous-flight-safety-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/avionics-bay | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/backup-battery | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/baffle | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/base-heat-shield | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/battery-management-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/boat-tail | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/bulkhead | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/burst-disk | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/cable-tunnel | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/camera-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/canard | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/check-valve | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/circuit-protection-device | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/clamp-band | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/combustion-chamber | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/command-receiver | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/common-bulkhead | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/communication-antenna | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/connector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/control-allocation-module | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/cooling-channels | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/crew-module-interface | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/crushable-landing-structure | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/cryogenic-tank | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/cubesat-deployer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/cylindrical-barrel-section | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/data-acquisition-unit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/data-bus | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/dc-dc-converter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/deployment-bag | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/deployment-switch | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/destruct-system-hardware | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/drain-connection | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/drogue-parachute | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/engine-controller | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/engine-heat-shield | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/engine-mount | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/engine-purge-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/engine-section | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/engine-sensors | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/environmental-control-duct | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/equipment-bay | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/external-foam-insulation | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/external-systems-tunnel | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fairing-half-or-fairing-shell | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fairing-separation-joint | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fill-and-drain-valve | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fin-actuator | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fin-root | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fire-barrier | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fixed-fin | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flame-deflector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flexible-feed-line-joint | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flight-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flight-control-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flight-safety-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flight-software | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flight-termination-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/flotation-device | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/forward-skirt | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/frangible-joint | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fts-antenna | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fuel-feed-line | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fuel-pump | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/fuel-tank | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/gas-generator | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/gimbal-assembly | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/gnss-or-gps-receiver | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/gps-antenna | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/grain-port | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/grid-fin | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/ground-power-connector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/ground-purge-connection | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/guidance-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/gyroscope | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/health-monitoring-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/heat-shield | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/helium-storage-vessel | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/hold-down-clamp | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/hold-down-fitting | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/hybrid-fuel-grain | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/hybrid-oxidizer-injector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/igniter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/independent-tracking-receiver | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/inertial-measurement-unit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/inertial-navigation-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/injector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/injector-face | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/interstage | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/interstage-vent | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/intertank | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/inverter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/landing-leg | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/landing-leg-actuator | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/launch-escape-or-abort-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/launch-lug-or-rail-guide | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/launch-mount | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/launch-platform | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/launch-rail | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/lifting-lug | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/lightning-protection-interface | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/magnetometer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/main-battery | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/main-fuel-valve | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/main-oxidizer-valve | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/main-parachute | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/mission-sequencer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/moisture-barrier | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/movable-fin | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/navigation-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/nose-cone | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/nozzle | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/nozzle-exit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/nozzle-extension | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/nozzle-throat | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/onboard-data-recorder | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/oxidizer-feed-line | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/oxidizer-pump | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/oxidizer-tank | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/parachute-canopy | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/parachute-compartment | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/parachute-mortar | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload-adapter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload-attach-fitting | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload-deployment-mechanism | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload-electrical-interface | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload-environmental-control-interface | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload-fairing | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/payload-separation-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/pilot-chute | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/pneumatic-separation-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/power-distribution-unit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/preburner | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/pressurant-tank | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/pressure-regulator | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/pressurization-line | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/propellant-acquisition-device | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/propellant-distribution-manifold | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/propellant-fill-connection | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/propellant-isolation-valve | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/propellant-level-sensor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/purge-line | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/pyrotechnic-initiator | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/pyrotechnic-initiator-circuit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/quick-disconnect-coupling | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/radar-altimeter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/radio-frequency-amplifier | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/range-safety-battery | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/range-tracking-beacon | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/reaction-control-propellant-tank | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/reaction-control-thruster | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/recovery-beacon | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/recovery-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/recovery-gps-unit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/redundant-flight-computer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/reefing-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/regeneratively-cooled-chamber | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/relief-valve | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/remote-input-output-unit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/retro-motor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/rocket-engine | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/safe-and-arm-device | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/secondary-payload-dispenser | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/separation-bolt | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/separation-motor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/separation-ring | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/separation-sensor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/service-door | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/signal-conditioning-unit | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/slosh-sensor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/solid-motor-igniter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/solid-motor-insulation | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/solid-motor-nozzle | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/solid-propellant-grain | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/solid-rocket-motor-case | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/spacecraft-adapter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/spring-ejector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/stage-adapter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/stage-separation-plane | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/star-tracker | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/stringer | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/strongback-or-transporter-erector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/structural-ring-frame | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/sun-sensor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/suspension-lines | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/tail-service-mast | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/tank-dome | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/tank-insulation | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/tank-liner | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/tank-pressure-sensor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/tank-vent | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/telemetry-antenna | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/telemetry-encoder | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/telemetry-transmitter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/temperature-sensor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/thermal-blanket | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/thermal-protection-system | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/thrust-structure | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/thrust-vector-control-actuator | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/time-base | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/tracking-transponder | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/transportation-support-interface | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/turbine | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/turbopump | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/turbopump-shaft | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/ullage-motor | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/ullage-volume | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/umbilical | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/umbilical-disconnect | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/umbilical-electrical-connector | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/vent-valve | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/video-transmitter | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/water-suppression-interface | Rocket component lesson | 0 | 0 | PASS |
| /rocket-lab/parts/wiring-harness | Rocket component lesson | 0 | 0 | PASS |
| /all-modules | Standalone route | 0 | 0 | PASS |
| /astrophysics/cosmology | Standalone route | 0 | 0 | PASS |
| /astrophysics/exoplanets | Standalone route | 0 | 0 | PASS |
| /astrophysics/galaxies | Standalone route | 0 | 0 | PASS |
| /astrophysics/solar-system | Standalone route | 0 | 0 | PASS |
| /astrophysics/spectroscopy | Standalone route | 0 | 0 | PASS |
| /astrophysics/stellar-life | Standalone route | 0 | 0 | PASS |
| /client-demos | Standalone route | 0 | 0 | PASS |
| /comparison | Standalone route | 0 | 0 | PASS |
| /concept-studio | Standalone route | 0 | 0 | PASS |
| /electricity/capacitors | Standalone route | 0 | 0 | PASS |
| /electricity/circuits | Standalone route | 0 | 0 | PASS |
| /electricity/coulomb-force | Standalone route | 0 | 0 | PASS |
| /electricity/current | Standalone route | 0 | 0 | PASS |
| /electricity/electric-field | Standalone route | 0 | 0 | PASS |
| /electricity/electric-potential | Standalone route | 0 | 0 | PASS |
| /electronics/amplifiers | Standalone route | 0 | 0 | PASS |
| /electronics/diodes | Standalone route | 0 | 0 | PASS |
| /electronics/logic-gates | Standalone route | 0 | 0 | PASS |
| /electronics/semiconductors | Standalone route | 0 | 0 | PASS |
| /electronics/sensors | Standalone route | 0 | 0 | PASS |
| /electronics/transistors | Standalone route | 0 | 0 | PASS |
| /experiments | Standalone route | 0 | 0 | PASS |
| /fluid-mechanics/bernoulli | Standalone route | 0 | 0 | PASS |
| /fluid-mechanics/buoyancy | Standalone route | 0 | 0 | PASS |
| /fluid-mechanics/continuity | Standalone route | 0 | 0 | PASS |
| /fluid-mechanics/density-pressure | Standalone route | 0 | 0 | PASS |
| /fluid-mechanics/hydrostatics | Standalone route | 0 | 0 | PASS |
| /fluid-mechanics/viscosity | Standalone route | 0 | 0 | PASS |
| /magnetism/current-wire | Standalone route | 0 | 0 | PASS |
| /magnetism/electromagnets | Standalone route | 0 | 0 | PASS |
| /magnetism/field-lines | Standalone route | 0 | 0 | PASS |
| /magnetism/induction | Standalone route | 0 | 0 | PASS |
| /magnetism/lorentz-force | Standalone route | 0 | 0 | PASS |
| /magnetism/solenoids | Standalone route | 0 | 0 | PASS |
| /measurement/mass-time | Standalone route | 0 | 0 | PASS |
| /measurement/meter-scale | Standalone route | 0 | 0 | PASS |
| /measurement/micrometer | Standalone route | 0 | 0 | PASS |
| /measurement/spherometer | Standalone route | 0 | 0 | PASS |
| /measurement/uncertainty | Standalone route | 0 | 0 | PASS |
| /measurement/vernier-caliper | Standalone route | 0 | 0 | PASS |
| /mechanics/equilibrium-com | Standalone route | 1 | 0 | PASS |
| /mechanics/free-body-diagrams | Standalone route | 0 | 0 | PASS |
| /mechanics/inclined-plane | Standalone route | 0 | 0 | PASS |
| /mechanics/momentum-collisions | Standalone route | 0 | 0 | PASS |
| /mechanics/pulley-systems | Standalone route | 0 | 0 | PASS |
| /mechanics/torque-levers | Standalone route | 0 | 0 | PASS |
| /modern-physics/atomic-spectra | Standalone route | 0 | 0 | PASS |
| /modern-physics/matter-waves | Standalone route | 0 | 0 | PASS |
| /modern-physics/nuclear-structure | Standalone route | 0 | 0 | PASS |
| /modern-physics/photoelectric-effect | Standalone route | 0 | 0 | PASS |
| /modern-physics/quantum-ideas | Standalone route | 0 | 0 | PASS |
| /modern-physics/radioactivity | Standalone route | 0 | 0 | PASS |
| /modules | Standalone route | 0 | 0 | PASS |
| /motion/acceleration-time | Standalone route | 0 | 0 | PASS |
| /motion/circular-motion | Standalone route | 0 | 0 | PASS |
| /motion/conservation-energy | Standalone route | 0 | 0 | PASS |
| /motion/coupled-oscillators | Standalone route | 0 | 0 | PASS |
| /motion/damping | Standalone route | 0 | 0 | PASS |
| /motion/doppler-effect | Standalone route | 0 | 0 | PASS |
| /motion/efficiency | Standalone route | 0 | 0 | PASS |
| /motion/energy-exchange | Standalone route | 0 | 0 | PASS |
| /motion/escape-velocity | Standalone route | 0 | 0 | PASS |
| /motion/first-law-inertia | Standalone route | 0 | 0 | PASS |
| /motion/friction | Standalone route | 0 | 0 | PASS |
| /motion/gravitational-field | Standalone route | 0 | 0 | PASS |
| /motion/gravitational-potential | Standalone route | 0 | 0 | PASS |
| /motion/interference | Standalone route | 0 | 0 | PASS |
| /motion/keplers-laws | Standalone route | 0 | 0 | PASS |
| /motion/kinetic-energy | Standalone route | 0 | 0 | PASS |
| /motion/multi-force-challenge | Standalone route | 0 | 0 | PASS |
| /motion/orbits | Standalone route | 0 | 0 | PASS |
| /motion/pendulum | Standalone route | 0 | 0 | PASS |
| /motion/position-time | Standalone route | 0 | 0 | PASS |
| /motion/potential-energy | Standalone route | 0 | 0 | PASS |
| /motion/power | Standalone route | 0 | 0 | PASS |
| /motion/projectile-motion | Standalone route | 0 | 0 | PASS |
| /motion/relative-motion | Standalone route | 0 | 0 | PASS |
| /motion/resonance | Standalone route | 0 | 0 | PASS |
| /motion/second-law-fma | Standalone route | 1 | 0 | PASS |
| /motion/sound-spectrum | Standalone route | 0 | 0 | PASS |
| /motion/spring-shm | Standalone route | 0 | 0 | PASS |
| /motion/standing-waves | Standalone route | 0 | 0 | PASS |
| /motion/superposition | Standalone route | 0 | 0 | PASS |
| /motion/tension-normal | Standalone route | 0 | 0 | PASS |
| /motion/third-law-pairs | Standalone route | 0 | 0 | PASS |
| /motion/universal-gravity | Standalone route | 0 | 0 | PASS |
| /motion/velocity-time | Standalone route | 0 | 0 | PASS |
| /motion/wave-properties | Standalone route | 0 | 0 | PASS |
| /motion/work | Standalone route | 0 | 0 | PASS |
| /optics/diffraction | Standalone route | 0 | 0 | PASS |
| /optics/interference | Standalone route | 0 | 0 | PASS |
| /optics/lenses | Standalone route | 0 | 0 | PASS |
| /optics/mirrors | Standalone route | 0 | 0 | PASS |
| /optics/reflection | Standalone route | 0 | 0 | PASS |
| /optics/refraction | Standalone route | 0 | 0 | PASS |
| /quiz | Standalone route | 0 | 0 | PASS |
| /thermodynamics/entropy | Standalone route | 0 | 0 | PASS |
| /thermodynamics/first-law | Standalone route | 0 | 0 | PASS |
| /thermodynamics/gas-laws | Standalone route | 0 | 0 | PASS |
| /thermodynamics/heat-engines | Standalone route | 0 | 0 | PASS |
| /thermodynamics/heat-transfer | Standalone route | 0 | 0 | PASS |
| /thermodynamics/temperature | Standalone route | 0 | 0 | PASS |
| /topics | Standalone route | 0 | 0 | PASS |
| /string-theory?concept=ads-cft | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=black-hole-microstates | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=bosonic-string | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=brane-worlds | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=calabi-yau-space | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=compactification | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=cosmic-superstrings | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=d-branes | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=early-universe | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=emergent-geometry | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=five-string-theories | String theory lesson | 1 | 0 | PASS |
| /string-theory?concept=graviton | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=hawking-information | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=holographic-principle | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=kaluza-klein-modes | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=m-theory | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=mirror-symmetry | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=open-closed-strings | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=particle-spectrum | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=planck-scale | String theory lesson | 1 | 0 | PASS |
| /string-theory?concept=points-vs-strings | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=s-duality | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=splitting-joining | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=string-landscape | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=string-quantization | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=strings-to-membranes | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=superstrings | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=supersymmetry | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=t-duality | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=vibration-modes | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=why-ten-dimensions | String theory lesson | 0 | 0 | PASS |
| /string-theory?concept=worldsheet | String theory lesson | 0 | 0 | PASS |
| /accessibility-center | Teaching | 0 | 0 | PASS |
| /accuracy-center | Teaching | 0 | 0 | PASS |
| /classroom-deployment | Teaching | 0 | 0 | PASS |
| /excellence-benchmark | Teaching | 0 | 0 | PASS |
| /insights-center | Teaching | 0 | 0 | PASS |
| /learning-studio | Teaching | 0 | 0 | PASS |
| /lms-config | Teaching | 0 | 0 | PASS |
| /quality-audit | Teaching | 0 | 0 | PASS |
| /release-governance | Teaching | 0 | 0 | PASS |
| /roadmap | Teaching | 0 | 0 | PASS |
| /simulation-depth | Teaching | 0 | 0 | PASS |
| /teacher | Teaching | 0 | 0 | PASS |
| /trust | Teaching | 0 | 0 | PASS |
| /topics/astronomy | Topic page | 0 | 0 | PASS |
| /topics/astrophysics | Topic page | 0 | 0 | PASS |
| /topics/electricity | Topic page | 0 | 0 | PASS |
| /topics/electronics | Topic page | 0 | 0 | PASS |
| /topics/energy | Topic page | 0 | 0 | PASS |
| /topics/fluid-mechanics | Topic page | 0 | 0 | PASS |
| /topics/magnetism | Topic page | 0 | 0 | PASS |
| /topics/measurement | Topic page | 0 | 0 | PASS |
| /topics/mechanics | Topic page | 0 | 0 | PASS |
| /topics/modern-physics | Topic page | 0 | 0 | PASS |
| /topics/optics | Topic page | 0 | 0 | PASS |
| /topics/oscillations | Topic page | 0 | 0 | PASS |
| /topics/thermodynamics | Topic page | 0 | 0 | PASS |
| /topics/waves | Topic page | 0 | 0 | PASS |

## In-page studio lessons

- /concept-studio/astronomy-astrophysics: Solar System, Stars, Spectra, Galaxies, Cosmology, Exoplanets
- /concept-studio/electricity: Charge, Electric Field, Potential, Current, Resistance, Circuits
- /concept-studio/electronics: Semiconductors, Diodes, Transistors, Amplifiers, Logic Gates, Sensors
- /concept-studio/fluid-mechanics: Density, Pressure, Buoyancy, Continuity, Bernoulli, Viscosity
- /concept-studio/force-newton: Inertia, F = ma, Action–Reaction, Friction, Tension, Normal Force
- /concept-studio/gravitation: Universal Gravitation, Gravitational Field, Orbits, Satellites, Escape Velocity, Kepler’s Laws
- /concept-studio/magnetism: Magnetic Fields, Force on Charge, Current & Field, Solenoids, Induction, Electromagnets
- /concept-studio/measurement: Length, Mass, Time, Uncertainty, Significant Figures, Instrument Errors
- /concept-studio/mechanics: Force Systems, Friction, Torque, Equilibrium, Momentum, Machines
- /concept-studio/modern-physics: Quantum Ideas, Photoelectric Effect, Matter Waves, Atomic Models, Nuclei, Radioactivity
- /concept-studio/motion-kinematics: Position, Velocity, Acceleration, Projectiles, Relative Motion, Circular Motion
- /concept-studio/optics: Reflection, Refraction, Lenses, Mirrors, Interference, Diffraction
- /concept-studio/oscillations: Simple Harmonic Motion, Pendulums, Springs, Damping, Resonance, Coupled Oscillators
- /concept-studio/thermodynamics: Temperature, Heat Transfer, Gas Laws, First Law, Entropy, Heat Engines
- /concept-studio/waves-sound: Wave Properties, Superposition, Interference, Standing Waves, Sound, Doppler Effect
- /concept-studio/work-energy-power: Work, Kinetic Energy, Potential Energy, Conservation, Power, Efficiency

## Additional validation for this change

- Production build: PASS.
- Experiment visualization registry: PASS, all 92 experiments covered.
- Git whitespace check: PASS.
- The legacy application-directory test still fails two toolbar-markup assertions. Both expected markup strings are also absent from the unchanged HEAD version of Toolbar.tsx; these failures predate this change.
