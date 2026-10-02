# Experiment Visualization Specificity Audit

Scope: all exported experiments in `src/lib/experiments.ts`. This audits whether the current student-facing 2D and 3D visual panes are experiment-specific or still using shared/generic fallback visuals.

Summary: 80 experiments audited; 53 need visualization-specific changes; 38 need 2D work; 38 need 3D work.

| # | Experiment | Domain | 2D pane audit | 3D pane audit | Modification needed | Recommended experiment-specific fix |
|---:|---|---|---|---|---|---|
| 1 | `projectile-motion` Projectile Motion | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 2 | `wave-lab` Wave Lab | Waves | Generic/shared fallback | Fallback generic | Modify both | Custom wave tank/string controls instead of broad wave fallback. |
| 3 | `single-slit-diffraction` Single Slit Diffraction | Waves | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 4 | `buoyancy` Buoyancy | Fluid Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 5 | `chladni-plate` Chladni Plate | Waves | Generic/shared fallback | Fallback generic | Modify both | Nodal sand-pattern plate with frequency/mode switching. |
| 6 | `heat-and-temperature` Heat and Temperature | Thermodynamics | Generic/shared fallback | Specific config | Modify 2D | Thermometer/liquid-particle heating scene with scale conversion. |
| 7 | `heat-transfer` Heat Transfer | Thermodynamics | Generic/shared fallback | Specific config | Modify 2D | Conduction/convection/radiation comparison bench. |
| 8 | `heating-effect-current` Heating Effect of Current | Electricity | Generic/shared fallback | Specific config | Modify 2D | Joule heating wire, resistor glow, heat-vs-current graph. |
| 9 | `electromagnet` Electromagnet | Magnetism | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 10 | `reflection-plane-mirror` Reflection by Plane Mirror | Optics | Specific/relevant | Fallback generic | Modify 3D | Plane mirror object-image ray scene plus explicit 3D mirror setup. |
| 11 | `force-and-pressure` Force and Pressure | Fluid Mechanics | Generic/shared fallback | Specific config | Modify 2D | Force-over-area press with pressure gauge. |
| 12 | `fluid-pressure` Fluid Pressure with Depth | Fluid Mechanics | Generic/shared fallback | Specific config | Modify 2D | Depth tank with manometer and pressure gradient. |
| 13 | `sound-pitch-loudness` Sound Pitch and Loudness | Waves | Specific/relevant | Fallback generic | Modify 3D | Add vibrating source and waveform/amplitude 3D scene. |
| 14 | `static-electricity` Static Electricity and Lightning | Electricity | Specific/relevant | Fallback generic | Modify 3D | Add 3D charge transfer/field spark model. |
| 15 | `chemical-effects-current` Chemical Effects of Current | Electricity | Generic/shared fallback | Fallback generic | Modify both | Electrolysis cell with electrodes, ions, bubbles, deposited mass. |
| 16 | `free-fall` Free Fall | Mechanics | Generic/shared fallback | Fallback generic | Modify both | Drop tower with timer gates and g-fit plot. |
| 17 | `mass-and-weight` Mass and Weight | Mechanics | Generic/shared fallback | Fallback generic | Modify both | Balance vs spring scale across planets. |
| 18 | `work-power` Work and Power | Mechanics | Specific/relevant | Fallback generic | Modify 3D | Add explicit 3D ramp/lift power scene matching work-rate sliders. |
| 19 | `echo-speed-sound` Echo and Speed of Sound | Waves | Generic/shared fallback | Fallback generic | Modify both | Cliff/sonar echo timeline with pulse return distance. |
| 20 | `mirror-formula` Mirror Formula | Optics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 21 | `lens-formula` Lens Formula | Optics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 22 | `glass-slab-refraction` Glass Slab Refraction | Optics | Specific/relevant | Fallback generic | Modify 3D | Add 3D slab thickness/lateral-shift scene. |
| 23 | `prism-dispersion` Prism Dispersion | Optics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 24 | `ohms-law` Ohm's Law V-I Graph | Electricity | Generic/shared fallback | Specific config | Modify 2D | Circuit board plus V-I graph with live slope/resistance. |
| 25 | `series-parallel-resistance` Series and Parallel Resistance | Electricity | Generic/shared fallback | Specific config | Modify 2D | Switchable resistor network with current splits. |
| 26 | `electric-power` Electric Power and Energy | Electricity | Generic/shared fallback | Specific config | Modify 2D | Appliance/resistor power meter with energy accumulation. |
| 27 | `magnetic-field-current` Magnetic Field Around Current | Magnetism | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 28 | `measurement-errors` Measurement, Error, and Significant Figures | Measurement | Generic/shared fallback | Fallback generic | Modify both | Vernier/caliper or repeated-measurement bench with mean, uncertainty, and significant-figure display. |
| 29 | `vector-resolution` Vector Resolution | Mechanics | Specific/relevant | Fallback generic | Modify 3D | Add 3D vector decomposition axes. |
| 30 | `rotational-dynamics` Rotational Dynamics | Mechanics | Generic/shared fallback | Fallback generic | Modify both | Torque wheel with angular acceleration and moment of inertia. |
| 31 | `satellite-orbit` Satellite Orbit and Escape Speed | Astronomy | Generic/shared fallback | Fallback generic | Modify both | Orbital trajectory with velocity vector and escape threshold. |
| 32 | `bernoulli-fluid-flow` Bernoulli Fluid Flow | Fluid Mechanics | Specific/relevant | Fallback generic | Modify 3D | Add 3D venturi tube with pressure/velocity gauges. |
| 33 | `gas-laws` Gas Laws and Kinetic Theory | Thermodynamics | Generic/shared fallback | Specific config | Modify 2D | Piston and particle box with P-V-T graph tied to sliders. |
| 34 | `thermodynamic-process` Thermodynamic Processes | Thermodynamics | Generic/shared fallback | Fallback generic | Modify both | P-V diagram with piston path for isothermal, adiabatic, isobaric, and isochoric processes. |
| 35 | `shm-spring` Spring-Mass SHM | Waves | Specific/relevant | Fallback generic | Modify 3D | Add 3D spring-mass oscillator geometry. |
| 36 | `electrostatic-field-potential` Electrostatic Field and Potential | Electricity | Specific/relevant | Fallback generic | Modify 3D | Add 3D potential surface/field line scene. |
| 37 | `capacitor-lab` Capacitor Energy and Combination | Electricity | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 38 | `kirchhoff-circuit` Kirchhoff Circuit Rules | Electricity | Specific/relevant | Fallback generic | Modify 3D | Add explicit 3D breadboard/loop-current view. |
| 39 | `lorentz-force` Lorentz Force on Moving Charge | Magnetism | Specific/relevant | Fallback generic | Modify 3D | Add explicit 3D charge in magnetic field with force vector. |
| 40 | `emi-faraday` Faraday Induction | Electricity | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 41 | `ac-lcr-resonance` AC LCR Resonance | Electricity | Specific/relevant | Fallback generic | Modify 3D | Add 3D LCR circuit with phasor/resonance response. |
| 42 | `em-spectrum` Electromagnetic Spectrum | Waves | Specific/relevant | Fallback generic | Modify 3D | Add spectrum wall/wavelength scale 3D visualization. |
| 43 | `young-double-slit` Young's Double Slit | Waves | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 44 | `photoelectric-equation` Photoelectric Equation | Modern Physics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 45 | `nuclear-decay` Nuclear Decay and Half-Life | Modern Physics | Generic/shared fallback | Fallback generic | Modify both | Decay nuclei population, half-life curve, stochastic events. |
| 46 | `semiconductor-diode` Semiconductor Diode and Rectifier | Electronics | Generic/shared fallback | Fallback generic | Modify both | PN junction/rectifier with I-V curve and ripple. |
| 47 | `shadows-eclipses` Shadows and Eclipses | Optics | Generic/shared fallback | Fallback generic | Modify both | Sun-object-screen/eclipse geometry scene. |
| 48 | `multiple-reflection` Multiple Reflection and Kaleidoscope | Optics | Generic/shared fallback | Fallback generic | Modify both | Two-mirror kaleidoscope with ray paths and image count. |
| 49 | `sound-wave-anatomy` Longitudinal Sound Wave | Waves | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 50 | `human-eye-defects` Human Eye and Vision Defects | Optics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 51 | `sources-of-energy` Sources of Energy Comparator | Energy | Generic/shared fallback | Fallback generic | Modify both | Energy source comparison dashboard with output/limits tradeoffs. |
| 52 | `meter-bridge` Meter Bridge | Electricity | Generic/shared fallback | Fallback generic | Modify both | Meter bridge wire, jockey, balance point, unknown resistance. |
| 53 | `internal-resistance-cell` Cell Internal Resistance | Electricity | Generic/shared fallback | Fallback generic | Modify both | Cell terminal-voltage experiment with load variation. |
| 54 | `ac-generator` AC Generator | Electricity | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 55 | `transformer-lab` Transformer Lab | Electricity | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 56 | `total-internal-reflection` Total Internal Reflection | Optics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 57 | `optical-instruments` Microscope and Telescope | Optics | Specific/relevant | Fallback generic | Modify 3D | Add telescope/microscope 3D ray-tube geometry. |
| 58 | `polarization-lab` Polarization Lab | Waves | Specific/relevant | Fallback generic | Modify 3D | Add 3D polarizer/analyzer planes and Malus law intensity. |
| 59 | `de-broglie-wavelength` de Broglie Wavelength | Modern Physics | Generic/shared fallback | Specific config | Modify 2D | Electron beam/wavelength relation with momentum scale. |
| 60 | `bohr-model` Bohr Atom Transitions | Modern Physics | Generic/shared fallback | Specific config | Modify 2D | Bohr energy-level diagram with photon emission/absorption line spectrum. |
| 61 | `logic-gates` Logic Gates | Electronics | Generic/shared fallback | Specific config | Modify 2D | Actual AND/OR/NOT/NAND gate symbols with live truth table. |
| 62 | `distance-time-graph` Distance-Time Graph Builder | Mechanics | Generic/shared fallback | Specific config | Modify 2D | Cart-track scene with linked distance-time graph construction. |
| 63 | `balanced-unbalanced-forces` Balanced and Unbalanced Forces | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 64 | `universal-gravitation` Universal Gravitation Field Map | Astronomy | Generic/shared fallback | Specific config | Modify 2D | Planet/test-mass field map with inverse-square force vectors. |
| 65 | `density-float-sink` Density Float-or-Sink Tank | Fluid Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 66 | `calorimetry-mixing` Calorimetry Mixing Lab | Thermodynamics | Generic/shared fallback | Specific config | Modify 2D | Mixing cups, heat exchange arrows, final temperature balance. |
| 67 | `special-relativity-bridge` Special Relativity Bridge | Modern Physics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 68 | `chaotic-coupled-oscillators` Chaotic and Coupled Oscillators | Oscillations | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 69 | `advanced-quantum-operators` Advanced Quantum Operators | Modern Physics | Generic/shared fallback | Fallback generic | Modify both | State vector/operator matrix visual with expectation measurement. |
| 70 | `statistical-ensemble-lab` Statistical Ensemble Lab | Thermodynamics | Generic/shared fallback | Fallback generic | Modify both | Particle ensemble histogram and distribution evolution. |
| 71 | `computational-physics-workflow` Computational Physics Workflow | Measurement | Generic/shared fallback | Fallback generic | Modify both | Numerical solver workflow with convergence/error plot. |
| 72 | `uniform-motion` Uniform Motion | Mechanics | Generic/shared fallback | Fallback generic | Modify both | Dedicated ticker/track with position-time markers and constant-slope graph. |
| 73 | `newton-s-second-law` Newton's Second Law | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 74 | `friction` Friction | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 75 | `inclined-plane` Inclined Plane | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 76 | `elastic-collision` Elastic Collision | Mechanics | Generic/shared fallback | Fallback generic | Modify both | Two-cart collision table with before/after momentum and kinetic energy bars. |
| 77 | `conservation-of-energy` Conservation of Energy | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 78 | `hooke-s-law` Hooke's Law | Mechanics | Generic/shared fallback | Fallback generic | Modify both | Spring extension rig with force-extension graph and elastic-limit warning. |
| 79 | `simple-pendulum` Simple Pendulum | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
| 80 | `circular-motion` Circular Motion | Mechanics | Specific/relevant | Specific config | No immediate change | Keep; later QA can refine visual fidelity. |
