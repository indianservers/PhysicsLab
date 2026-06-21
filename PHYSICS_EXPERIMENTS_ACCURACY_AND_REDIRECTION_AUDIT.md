# Physics Experiments Accuracy and Redesign Audit

Generated from the current PhysicsLab source on 2026-06-21. Scope: physics experiments, simulations, visualizations, experiment detail route, shared engines, quality/depth/accessibility/accuracy metadata, and related pages.

## 1. Executive Summary

- Total experiments/simulations reviewed: 80.
- Categories reviewed: Astronomy (2), Electricity (15), Electronics (2), Energy (1), Fluid Mechanics (5), Magnetism (3), Measurement (2), Mechanics (17), Modern Physics (6), Optics (10), Oscillations (1), Thermodynamics (6), Waves (10).
- Overall quality status: the app has broad coverage, strong metadata, teacher/coach/report panels, and some validated solvers, but most experiments still depend on shared generic visualization logic.
- Major accuracy risks: only 18 experiments have Good executable-validation status by this audit classification; 0 need major accuracy verification or solver separation. Many formulas are present as metadata but are not backed by benchmark cases.
- Major UI/UX problems: the shared GenericExperiment layout gives many labs the same visual rhythm; controls are often three generic numeric sliders rather than concept-specific apparatus controls; mobile can be crowded because guide, 2D, 3D, graph, report, coach, and notebook surfaces compete for attention.
- Repeated visualization problem: 0 experiments read as generic placeholders and 5 read as too similar. Mechanics-like scenes, grid backgrounds, generic object cards, and reused Three.js fallback scenes reduce concept identity.
- Recommendation: keep shared shells, graph panels, report export, and teacher mode, but move high-priority experiments into experiment-specific folders with dedicated JS/TS engines, CSS, data, and validation cases.
- High-priority fixes: Circular Motion; Elastic Collision; Friction; Hooke's Law; Inclined Plane; Uniform Motion; Chladni Plate; Single Slit Diffraction; Conservation of Energy; Newton's Second Law.
- Validation metadata: 23/23 direct benchmark cases pass; 165 local physics checks are tracked by the test runner.

## 2. Experiment Inventory Table

| No. | Experiment / Simulation | Route / Location | Concept | Current Purpose | Accuracy Status | UI Status | Visual Uniqueness | Priority |
|---:|---|---|---|---|---|---|---|---|
| 1 | Projectile Motion | /experiments/projectile-motion | Mechanics | Study how initial speed, launch angle, and gravity affect projectile range and height; use mass to discuss why the ideal model ignores air resistance. | Good | Good | Unique | Low |
| 2 | Wave Lab | /experiments/wave-lab | Waves | Observe interference from two coherent point wave sources. | Needs Minor Fix | Needs Improvement | Too Similar | Medium |
| 3 | Single Slit Diffraction | /experiments/single-slit-diffraction | Waves | Observe diffraction through a single slit. | Needs Minor Fix | Poor | Partly Similar | High |
| 4 | Buoyancy | /experiments/buoyancy | Fluid Mechanics | Compare floating and sinking using Archimedes' principle. | Good | Needs Improvement | Unique | Medium |
| 5 | Chladni Plate | /experiments/chladni-plate | Waves | Visualize standing-wave nodal patterns on a vibrating plate. | Needs Minor Fix | Poor | Partly Similar | High |
| 6 | Heat and Temperature | /experiments/heat-and-temperature | Thermodynamics | Compare temperature scales and estimate heat needed to change the temperature of a body. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 7 | Heat Transfer | /experiments/heat-transfer | Thermodynamics | Visualize conduction and estimate heat flow through materials of different thickness. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 8 | Heating Effect of Current | /experiments/heating-effect-current | Electricity | Explore how current, resistance, and time affect Joule heating. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 9 | Electromagnet | /experiments/electromagnet | Magnetism | Build a current-controlled magnet and compare the effect of turns, current, and core material. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 10 | Reflection by Plane Mirror | /experiments/reflection-plane-mirror | Optics | Trace incident and reflected rays and verify the law of reflection. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 11 | Force and Pressure | /experiments/force-and-pressure | Fluid Mechanics | Compare pressure from force over area and pressure due to liquid depth. | Good | Needs Improvement | Partly Similar | Low |
| 12 | Fluid Pressure with Depth | /experiments/fluid-pressure | Fluid Mechanics | Observe how liquid pressure changes with density and depth. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 13 | Sound Pitch and Loudness | /experiments/sound-pitch-loudness | Waves | Relate frequency to pitch, amplitude to loudness, and wavelength to wave speed. | Good | Needs Improvement | Unique | Low |
| 14 | Static Electricity and Lightning | /experiments/static-electricity | Electricity | Explore attraction, repulsion, and the distance dependence of electric force. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 15 | Chemical Effects of Current | /experiments/chemical-effects-current | Electricity | Model electrolysis/electroplating as charge passing through a conducting solution. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 16 | Free Fall | /experiments/free-fall | Mechanics | Study motion under gravity and calculate impact speed and time of fall. | Good | Needs Improvement | Unique | Low |
| 17 | Mass and Weight | /experiments/mass-and-weight | Mechanics | Compare mass and weight across different gravitational fields. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 18 | Work and Power | /experiments/work-power | Mechanics | Calculate work done and power for a force moving an object through a displacement. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 19 | Echo and Speed of Sound | /experiments/echo-speed-sound | Waves | Use echo timing to estimate distance or sound speed. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 20 | Mirror Formula | /experiments/mirror-formula | Optics | Use the mirror formula to calculate image distance and magnification for a concave mirror. | Good | Needs Improvement | Partly Similar | Low |
| 21 | Lens Formula | /experiments/lens-formula | Optics | Calculate image distance and magnification for a convex lens. | Good | Good | Unique | Low |
| 22 | Glass Slab Refraction | /experiments/glass-slab-refraction | Optics | Trace refraction through a rectangular glass slab and calculate refraction angle. | Good | Needs Improvement | Partly Similar | Low |
| 23 | Prism Dispersion | /experiments/prism-dispersion | Optics | Trace incident, refracted, and emergent rays through a prism, then compare deviation, minimum deviation, and colour dispersion. | Needs Minor Fix | Good | Unique | Low |
| 24 | Ohm's Law V-I Graph | /experiments/ohms-law | Electricity | Plot voltage against current and determine resistance from the graph slope. | Good | Needs Improvement | Unique | Low |
| 25 | Series and Parallel Resistance | /experiments/series-parallel-resistance | Electricity | Compare equivalent resistance and current in series and parallel circuits. | Good | Needs Improvement | Partly Similar | Low |
| 26 | Electric Power and Energy | /experiments/electric-power | Electricity | Connect circuit power to electrical energy consumed over time. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 27 | Magnetic Field Around Current | /experiments/magnetic-field-current | Magnetism | Visualize magnetic field strength around a wire and coil as current changes. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 28 | Measurement, Error, and Significant Figures | /experiments/measurement-errors | Measurement | Estimate absolute, relative, and percentage error from repeated measurements. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 29 | Vector Resolution | /experiments/vector-resolution | Mechanics | Resolve a vector into rectangular components and reconstruct its magnitude. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 30 | Rotational Dynamics | /experiments/rotational-dynamics | Mechanics | Relate torque, moment of inertia, and angular acceleration for rotating bodies. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 31 | Satellite Orbit and Escape Speed | /experiments/satellite-orbit | Astronomy | Compare orbital speed, escape speed, and orbital period around a planet. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 32 | Bernoulli Fluid Flow | /experiments/bernoulli-fluid-flow | Fluid Mechanics | Explore pressure-speed-height tradeoffs in streamline fluid flow. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 33 | Gas Laws and Kinetic Theory | /experiments/gas-laws | Thermodynamics | Use the ideal gas law to connect pressure, volume, temperature, and amount of gas. | Good | Needs Improvement | Unique | Low |
| 34 | Thermodynamic Processes | /experiments/thermodynamic-process | Thermodynamics | Compare isothermal, isobaric, and isochoric process work and heat trends. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 35 | Spring-Mass SHM | /experiments/shm-spring | Waves | Study simple harmonic motion of a spring-mass oscillator. | Good | Needs Improvement | Partly Similar | Low |
| 36 | Electrostatic Field and Potential | /experiments/electrostatic-field-potential | Electricity | Compare electric field and potential around point charges. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 37 | Capacitor Energy and Combination | /experiments/capacitor-lab | Electricity | Calculate charge and stored energy for a capacitor and compare combinations. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 38 | Kirchhoff Circuit Rules | /experiments/kirchhoff-circuit | Electricity | Use junction and loop rules to analyse a two-resistor network. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 39 | Lorentz Force on Moving Charge | /experiments/lorentz-force | Magnetism | Calculate magnetic force and circular radius for a moving charged particle. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 40 | Faraday Induction | /experiments/emi-faraday | Electricity | Explore induced emf from changing magnetic flux. | Needs Minor Fix | Good | Unique | Low |
| 41 | AC LCR Resonance | /experiments/ac-lcr-resonance | Electricity | Compare reactance, impedance, current, and resonance in a series LCR circuit. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 42 | Electromagnetic Spectrum | /experiments/em-spectrum | Waves | Relate wavelength, frequency, energy, and common EM spectrum bands. | Good | Needs Improvement | Partly Similar | Low |
| 43 | Young's Double Slit | /experiments/young-double-slit | Waves | Measure fringe width in a two-slit interference pattern. | Needs Minor Fix | Good | Unique | Low |
| 44 | Photoelectric Equation | /experiments/photoelectric-equation | Modern Physics | Use Einstein's photoelectric equation to compare photon energy, work function, and stopping potential. | Good | Good | Unique | Low |
| 45 | Nuclear Decay and Half-Life | /experiments/nuclear-decay | Modern Physics | Model exponential radioactive decay and remaining nuclei after multiple half-lives. | Good | Needs Improvement | Partly Similar | Low |
| 46 | Semiconductor Diode and Rectifier | /experiments/semiconductor-diode | Electronics | Compare forward and reverse bias diode current and estimate rectified output. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 47 | Shadows and Eclipses | /experiments/shadows-eclipses | Optics | Show rectilinear propagation of light using shadows, umbra, penumbra, and eclipses. | Needs Minor Fix | Good | Unique | Low |
| 48 | Multiple Reflection and Kaleidoscope | /experiments/multiple-reflection | Optics | Predict number of images formed by two plane mirrors at different angles. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 49 | Longitudinal Sound Wave | /experiments/sound-wave-anatomy | Waves | Visualize compressions, rarefactions, wavelength, frequency, amplitude, and speed of sound. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 50 | Human Eye and Vision Defects | /experiments/human-eye-defects | Optics | Model image formation on the retina and correction of myopia and hypermetropia. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 51 | Sources of Energy Comparator | /experiments/sources-of-energy | Energy | Compare renewable and conventional energy sources using power output, efficiency, cost, and environmental score. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 52 | Meter Bridge | /experiments/meter-bridge | Electricity | Find an unknown resistance using the balanced Wheatstone bridge relation. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 53 | Cell Internal Resistance | /experiments/internal-resistance-cell | Electricity | Compare emf, terminal voltage, current, and internal resistance of a cell. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 54 | AC Generator | /experiments/ac-generator | Electricity | Visualize sinusoidal emf generated by rotating a coil in a magnetic field. | Needs Minor Fix | Good | Unique | Low |
| 55 | Transformer Lab | /experiments/transformer-lab | Electricity | Compare primary and secondary voltages, current, and efficiency in a transformer. | Needs Minor Fix | Good | Unique | Low |
| 56 | Total Internal Reflection | /experiments/total-internal-reflection | Optics | Find critical angle and show when light reflects completely inside a denser medium. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 57 | Microscope and Telescope | /experiments/optical-instruments | Optics | Compare magnification of a compound microscope and an astronomical telescope. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 58 | Polarization Lab | /experiments/polarization-lab | Waves | Use two polarizers to verify Malus' law for transmitted light intensity. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 59 | de Broglie Wavelength | /experiments/de-broglie-wavelength | Modern Physics | Connect particle momentum and accelerating voltage to matter-wave wavelength. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 60 | Bohr Atom Transitions | /experiments/bohr-model | Modern Physics | Visualize hydrogen energy levels, spectral lines, and photon emission/absorption. | Needs Minor Fix | Good | Partly Similar | Low |
| 61 | Logic Gates | /experiments/logic-gates | Electronics | Build truth tables for NOT, AND, OR, NAND, and NOR gates. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 62 | Distance-Time Graph Builder | /experiments/distance-time-graph | Mechanics | Build a distance-time graph and connect slope with speed. | Needs Minor Fix | Good | Unique | Low |
| 63 | Balanced and Unbalanced Forces | /experiments/balanced-unbalanced-forces | Mechanics | Compare left and right forces and predict whether an object stays still, moves steadily, or accelerates. | Good | Needs Improvement | Partly Similar | Low |
| 64 | Universal Gravitation Field Map | /experiments/universal-gravitation | Astronomy | Visualize how gravitational force changes with mass and distance. | Needs Minor Fix | Good | Unique | Low |
| 65 | Density Float-or-Sink Tank | /experiments/density-float-sink | Fluid Mechanics | Predict whether an object floats or sinks by comparing object density with liquid density. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 66 | Calorimetry Mixing Lab | /experiments/calorimetry-mixing | Thermodynamics | Mix hot and cold water samples and predict the final equilibrium temperature. | Needs Minor Fix | Good | Partly Similar | Low |
| 67 | Special Relativity Bridge | /experiments/special-relativity-bridge | Modern Physics | Explore time dilation, length contraction, and relativistic energy using a light-clock and spacetime graph. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 68 | Chaotic and Coupled Oscillators | /experiments/chaotic-coupled-oscillators | Oscillations | Compare a simple oscillator with a double-pendulum style coupled oscillator and identify the start of chaotic motion. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 69 | Advanced Quantum Operators | /experiments/advanced-quantum-operators | Modern Physics | Visualize state vectors, operator action, measurement projection, and tunneling or scattering probability as one compact model. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 70 | Statistical Ensemble Lab | /experiments/statistical-ensemble-lab | Thermodynamics | Compare microstates, ensemble averages, phase tendency, and transport response without long derivations. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 71 | Computational Physics Workflow | /experiments/computational-physics-workflow | Measurement | Build a small reproducible physics workflow: choose a model, step size, uncertainty, graph, and verification rule. | Needs Minor Fix | Needs Improvement | Partly Similar | Low |
| 72 | Uniform Motion | /experiments/uniform-motion | Mechanics | Explore uniform motion with editable variables and live measurements. | Needs Minor Fix | Needs Improvement | Partly Similar | Critical |
| 73 | Newton's Second Law | /experiments/newton-s-second-law | Mechanics | Explore newton's second law with editable variables and live measurements. | Good | Needs Improvement | Unique | Medium |
| 74 | Friction | /experiments/friction | Mechanics | Explore friction with editable variables and live measurements. | Needs Minor Fix | Needs Improvement | Too Similar | Critical |
| 75 | Inclined Plane | /experiments/inclined-plane | Mechanics | Explore inclined plane with editable variables and live measurements. | Needs Minor Fix | Needs Improvement | Too Similar | Critical |
| 76 | Elastic Collision | /experiments/elastic-collision | Mechanics | Explore elastic collision with editable variables and live measurements. | Needs Minor Fix | Needs Improvement | Too Similar | Critical |
| 77 | Conservation of Energy | /experiments/conservation-of-energy | Mechanics | Explore conservation of energy with editable variables and live measurements. | Needs Minor Fix | Needs Improvement | Unique | Medium |
| 78 | Hooke's Law | /experiments/hooke-s-law | Mechanics | Explore hooke's law with editable variables and live measurements. | Needs Minor Fix | Needs Improvement | Too Similar | Critical |
| 79 | Simple Pendulum | /experiments/simple-pendulum | Mechanics | Explore simple pendulum with editable variables and live measurements. | Good | Needs Improvement | Unique | Medium |
| 80 | Circular Motion | /experiments/circular-motion | Mechanics | Explore circular motion with editable variables and live measurements. | Needs Minor Fix | Needs Improvement | Partly Similar | Critical |

## 3. Detailed Experiment Review

### 1. Projectile Motion

#### A. Current Purpose
Study how initial speed, launch angle, and gravity affect projectile range and height; use mass to discuss why the ideal model ignores air resistance.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Projectile motion separates into constant horizontal velocity and uniformly accelerated vertical motion.
- Student should identify key variables from: Range: R = \frac{u^2\sin(2\theta)}{g}; Maximum height: H = \frac{u^2\sin^2(\theta)}{2g}.
- Student should record observations using: Trial, Speed, Angle, Range, Maximum height, Time of flight.
- Student should avoid: Mixing degrees and radians; Forgetting that vertical acceleration is downward; Comparing air-resistance and ideal values directly.

#### D. Current Implementation Summary
- Route/page: /experiments/projectile-motion.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/ProjectileExperiment.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: SVG trajectory + Recharts + optional Three.js 3D.
- Controls available: Initial speed, launch angle, gravity, mass, air resistance, target result editor.
- Formulae: Range: R = \frac{u^2\sin(2\theta)}{g}; Maximum height: H = \frac{u^2\sin^2(\theta)}{2g}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 2 validation case(s), 100% pass, grade 100.
- Risk note: Has 2 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 87, interaction 80, learning 93, classroom 92, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
For ideal projectile motion, range is maximum near 45 degrees when launch and landing heights match.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/projectile-motion/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/projectile-motion/projectile-motionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 2. Wave Lab

#### A. Current Purpose
Observe interference from two coherent point wave sources.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Two in-phase sources generate constructive and destructive interference where path differences align or oppose phase.
- Student should identify key variables from: No explicit formula in definition; visual model needs documented formula link.
- Student should record observations using: Trial, Frequency, Source spacing, Pattern.
- Student should avoid: Using different frequencies for coherent sources.

#### D. Current Implementation Summary
- Route/page: /experiments/wave-lab.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Shared three-value sliders from GenericExperiment.
- Formulae: No explicit formula in definition; visual model needs documented formula link.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Visual illustration, 0 validation case(s), 0% pass, grade 62.
- Risk note: No explicit formula benchmark in the definition; accuracy cannot be claimed beyond qualitative visualization.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 94, visuals 64, interaction 61, learning 77, classroom 68, accessibility 69.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Stable interference bands form between two coherent sources.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/wave-lab/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/wave-lab/wave-labSimulation.ts
- src/experiments/wave-lab/wave-lab.css
- src/experiments/wave-lab/wave-labData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Medium. Depth tier: Guided visual. Missing layers: Measurement probes, Replay checkpoints, Non-color cues.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 3. Single Slit Diffraction

#### A. Current Purpose
Observe diffraction through a single slit.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A barrier with a narrow opening spreads an incoming wavefront into a diffraction pattern.
- Student should identify key variables from: No explicit formula in definition; visual model needs documented formula link.
- Student should record observations using: Trial, Gap width, Diffraction spread.
- Student should avoid: Making the slit too wide to show visible diffraction.

#### D. Current Implementation Summary
- Route/page: /experiments/single-slit-diffraction.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Shared three-value sliders from GenericExperiment.
- Formulae: No explicit formula in definition; visual model needs documented formula link.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: No explicit formula benchmark in the definition; accuracy cannot be claimed beyond qualitative visualization.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Poor.
- Quality dimensions: accuracy 100, visuals 57, interaction 51, learning 71, classroom 72, accessibility 63.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Narrower slits create wider spreading behind the barrier.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/single-slit-diffraction/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/single-slit-diffraction/single-slit-diffractionSimulation.ts
- src/experiments/single-slit-diffraction/single-slit-diffraction.css
- src/experiments/single-slit-diffraction/single-slit-diffractionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
High. Depth tier: Needs depth pass. Missing layers: Measurement probes, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 4. Buoyancy

#### A. Current Purpose
Compare floating and sinking using Archimedes' principle.

#### B. Correct Physics Goal
Teach fluid mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: An immersed object experiences an upward force equal to the weight of displaced fluid.
- Student should identify key variables from: No explicit formula in definition; visual model needs documented formula link.
- Student should record observations using: Object, Density, Submerged fraction, Motion.
- Student should avoid: Confusing mass with density.

#### D. Current Implementation Summary
- Route/page: /experiments/buoyancy.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Fluid density (kg/m3) (500-1400); Object volume (L) (0.1-30); Object density (kg/m3) (100-3000).
- Formulae: No explicit formula in definition; visual model needs documented formula link.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce fluid mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 66, learning 77, classroom 80, accessibility 73.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Wood tends to float in water, while steel sinks.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/buoyancy/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/buoyancy/buoyancy.css
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer.

#### O. Priority
Medium. Depth tier: Guided visual. Missing layers: Vectors, Measurement probes, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Fluid Mechanics.

### 5. Chladni Plate

#### A. Current Purpose
Visualize standing-wave nodal patterns on a vibrating plate.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Sand gathers along nodes where the plate has minimal vibration.
- Student should identify key variables from: No explicit formula in definition; visual model needs documented formula link.
- Student should record observations using: Mode, Frequency, Pattern.
- Student should avoid: Expecting moving particles instead of node pattern formation.

#### D. Current Implementation Summary
- Route/page: /experiments/chladni-plate.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Shared three-value sliders from GenericExperiment.
- Formulae: No explicit formula in definition; visual model needs documented formula link.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: No explicit formula benchmark in the definition; accuracy cannot be claimed beyond qualitative visualization.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Poor.
- Quality dimensions: accuracy 100, visuals 52, interaction 51, learning 77, classroom 72, accessibility 59.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Higher resonant frequencies produce more complex nodal patterns.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/chladni-plate/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/chladni-plate/chladni-plateSimulation.ts
- src/experiments/chladni-plate/chladni-plate.css
- src/experiments/chladni-plate/chladni-plateData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
High. Depth tier: Needs depth pass. Missing layers: Measurement probes, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 6. Heat and Temperature

#### A. Current Purpose
Compare temperature scales and estimate heat needed to change the temperature of a body.

#### B. Correct Physics Goal
Teach thermodynamics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Temperature measures hotness, while heat is energy transferred because of a temperature difference.
- Student should identify key variables from: Temperature conversion: K = T_C + 273.15.
- Student should record observations using: Trial, Temperature, Kelvin, Mass, Heat for 10 C rise.
- Student should avoid: Calling heat and temperature the same thing; Forgetting to add 273.15 for Kelvin.

#### D. Current Implementation Summary
- Route/page: /experiments/heat-and-temperature.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Kelvin temperature (K).
- Formulae: Temperature conversion: K = T_C + 273.15.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce thermodynamics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 72, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Kelvin rises one-to-one with Celsius, and heat needed increases with mass and specific heat.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/heat-and-temperature/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/heat-and-temperature/heat-and-temperatureSimulation.ts
- src/experiments/heat-and-temperature/heat-and-temperature.css
- src/experiments/heat-and-temperature/heat-and-temperatureData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Thermodynamics.

### 7. Heat Transfer

#### A. Current Purpose
Visualize conduction and estimate heat flow through materials of different thickness.

#### B. Correct Physics Goal
Teach thermodynamics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Conduction transfers heat faster through high-conductivity, large-area, thin materials.
- Student should identify key variables from: Conduction rate: H = \frac{kA\Delta T}{L}.
- Student should record observations using: Material, Area, Thickness, Heat rate, Heat in 60 s.
- Student should avoid: Ignoring thickness; Mixing heat rate in watts with heat energy in joules.

#### D. Current Implementation Summary
- Route/page: /experiments/heat-transfer.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Thermal conductivity (W/m C).
- Formulae: Conduction rate: H = \frac{kA\Delta T}{L}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce thermodynamics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 72, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Heat rate increases with conductivity and area, and decreases with thickness.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/heat-transfer/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/heat-transfer/heat-transferSimulation.ts
- src/experiments/heat-transfer/heat-transfer.css
- src/experiments/heat-transfer/heat-transferData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Thermodynamics.

### 8. Heating Effect of Current

#### A. Current Purpose
Explore how current, resistance, and time affect Joule heating.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Electrical heating follows H = I^2Rt, so current has the strongest effect.
- Student should identify key variables from: Joule heating: H = I^2Rt.
- Student should record observations using: Trial, Current, Resistance, Time, Heat.
- Student should avoid: Treating current and resistance as having equal effect; Forgetting time when comparing energy.

#### D. Current Implementation Summary
- Route/page: /experiments/heating-effect-current.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Current (A); Resistance (ohm).
- Formulae: Joule heating: H = I^2Rt.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Doubling current makes heating four times larger for the same resistance and time.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/heating-effect-current/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/heating-effect-current/heating-effect-currentSimulation.ts
- src/experiments/heating-effect-current/heating-effect-current.css
- src/experiments/heating-effect-current/heating-effect-currentData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 9. Electromagnet

#### A. Current Purpose
Build a current-controlled magnet and compare the effect of turns, current, and core material.

#### B. Correct Physics Goal
Teach magnetism through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A coil carrying current produces a magnetic field; an iron core concentrates the field.
- Student should identify key variables from: Relative coil strength: B \propto NI.
- Student should record observations using: Turns, Current, Core, Relative field, Polarity.
- Student should avoid: Thinking a core alone makes an electromagnet; Ignoring current direction.

#### D. Current Implementation Summary
- Route/page: /experiments/electromagnet.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Turns; Current (A).
- Formulae: Relative coil strength: B \propto NI.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce magnetism with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 80, learning 93, classroom 92, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use field lines, compass needles, flux loops, polarity colors, and induction timing. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
More turns, more current, and a stronger core produce a stronger electromagnet.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use field lines, compass needles, flux loops, polarity colors, and induction timing.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/electromagnet/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/electromagnet/electromagnetSimulation.ts
- src/experiments/electromagnet/electromagnet.css
- src/experiments/electromagnet/electromagnetData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Magnetism.

### 10. Reflection by Plane Mirror

#### A. Current Purpose
Trace incident and reflected rays and verify the law of reflection.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: The angle of incidence equals the angle of reflection, measured from the normal.
- Student should identify key variables from: Law of reflection: i = r.
- Student should record observations using: Trial, Incidence angle, Reflection angle, Object distance, Image distance.
- Student should avoid: Measuring from the mirror surface instead of normal; Confusing image distance with total ray path.

#### D. Current Implementation Summary
- Route/page: /experiments/reflection-plane-mirror.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Incidence angle (degree).
- Formulae: Law of reflection: i = r.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 80, learning 93, classroom 80, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
For a plane mirror, incidence angle equals reflection angle and image distance equals object distance.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/reflection-plane-mirror/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/reflection-plane-mirror/reflection-plane-mirrorSimulation.ts
- src/experiments/reflection-plane-mirror/reflection-plane-mirror.css
- src/experiments/reflection-plane-mirror/reflection-plane-mirrorData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 11. Force and Pressure

#### A. Current Purpose
Compare pressure from force over area and pressure due to liquid depth.

#### B. Correct Physics Goal
Teach fluid mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Pressure is force per unit area; liquid pressure also increases with depth.
- Student should identify key variables from: Pressure: P = \frac{F}{A}.
- Student should record observations using: Trial, Force, Area, Depth, Pressure.
- Student should avoid: Confusing force with pressure; Forgetting area is in square metres.

#### D. Current Implementation Summary
- Route/page: /experiments/force-and-pressure.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Force (N); Area (m^2).
- Formulae: Pressure: P = \frac{F}{A}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce fluid mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 72, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Pressure increases with force and depth, and decreases with larger area.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/force-and-pressure/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/force-and-pressure/force-and-pressure.css
- src/experiments/force-and-pressure/force-and-pressureData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Fluid Mechanics.

### 12. Fluid Pressure with Depth

#### A. Current Purpose
Observe how liquid pressure changes with density and depth.

#### B. Correct Physics Goal
Teach fluid mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Gauge pressure in a liquid is rho gh, so it grows linearly with depth.
- Student should identify key variables from: Hydrostatic pressure: P = P_0 + \rho gh.
- Student should record observations using: Fluid, Density, Depth, Gauge pressure, Absolute pressure.
- Student should avoid: Using centimetres directly in SI formula; Forgetting atmospheric pressure in absolute pressure.

#### D. Current Implementation Summary
- Route/page: /experiments/fluid-pressure.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Density (kg/m^3).
- Formulae: Hydrostatic pressure: P = P_0 + \rho gh.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce fluid mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 72, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Pressure rises linearly as the sensor moves deeper.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/fluid-pressure/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/fluid-pressure/fluid-pressureSimulation.ts
- src/experiments/fluid-pressure/fluid-pressure.css
- src/experiments/fluid-pressure/fluid-pressureData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Fluid Mechanics.

### 13. Sound Pitch and Loudness

#### A. Current Purpose
Relate frequency to pitch, amplitude to loudness, and wavelength to wave speed.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Pitch depends on frequency, loudness depends on amplitude and intensity, and wavelength equals speed divided by frequency.
- Student should identify key variables from: Wave relation: v = f\lambda.
- Student should record observations using: Frequency, Amplitude, Distance, Wavelength, Relative intensity.
- Student should avoid: Calling amplitude pitch; Forgetting sound intensity drops with distance.

#### D. Current Implementation Summary
- Route/page: /experiments/sound-pitch-loudness.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Frequency (Hz) (20-2000); Amplitude (0.1-2); Distance (m) (1-50).
- Formulae: Wave relation: v = f\lambda.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 57, interaction 72, learning 93, classroom 92, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Higher frequency gives higher pitch; higher amplitude gives louder sound.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/sound-pitch-loudness/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/sound-pitch-loudness/sound-pitch-loudnessData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 14. Static Electricity and Lightning

#### A. Current Purpose
Explore attraction, repulsion, and the distance dependence of electric force.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Like charges repel, unlike charges attract, and electric force follows an inverse-square relation.
- Student should identify key variables from: Coulomb's law: F = k\frac{q_1q_2}{r^2}.
- Student should record observations using: Charge 1, Charge 2, Distance, Force, Interaction.
- Student should avoid: Forgetting charge signs; Thinking distance changes force linearly.

#### D. Current Implementation Summary
- Route/page: /experiments/static-electricity.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Charge (C).
- Formulae: Coulomb's law: F = k\frac{q_1q_2}{r^2}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Like charges repel, unlike charges attract, and force reduces rapidly with distance.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/static-electricity/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/static-electricity/static-electricitySimulation.ts
- src/experiments/static-electricity/static-electricity.css
- src/experiments/static-electricity/static-electricityData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 15. Chemical Effects of Current

#### A. Current Purpose
Model electrolysis/electroplating as charge passing through a conducting solution.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Conducting liquids allow current through ions; deposited material depends on current and time.
- Student should identify key variables from: Charge passed: Q = It.
- Student should record observations using: Current, Time, Charge, Relative deposit.
- Student should avoid: Assuming all liquids conduct equally; Ignoring time when comparing deposited mass.

#### D. Current Implementation Summary
- Route/page: /experiments/chemical-effects-current.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Current (A); Time (s).
- Formulae: Charge passed: Q = It.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
More current and longer time produce more deposited material.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/chemical-effects-current/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/chemical-effects-current/chemical-effects-currentSimulation.ts
- src/experiments/chemical-effects-current/chemical-effects-current.css
- src/experiments/chemical-effects-current/chemical-effects-currentData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 16. Free Fall

#### A. Current Purpose
Study motion under gravity and calculate impact speed and time of fall.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: For ideal free fall, acceleration is constant and equal to g downward.
- Student should identify key variables from: Free fall: v^2 = u^2 + 2gh.
- Student should record observations using: Height, Initial speed, g, Time, Impact speed.
- Student should avoid: Using negative height; Confusing g with speed.

#### D. Current Implementation Summary
- Route/page: /experiments/free-fall.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Height (m) (1-500); Initial downward speed (m/s) (0-50); g (m/s2) (1-20).
- Formulae: Free fall: v^2 = u^2 + 2gh.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 2 validation case(s), 100% pass, grade 100.
- Risk note: Has 2 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 71, interaction 80, learning 93, classroom 92, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
For rest drops, fall time varies with square root of height.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/free-fall/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/free-fall/free-fallData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 17. Mass and Weight

#### A. Current Purpose
Compare mass and weight across different gravitational fields.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Mass is amount of matter; weight is gravitational force W = mg.
- Student should identify key variables from: Weight: W = mg.
- Student should record observations using: Mass, g, Weight, Spring stretch.
- Student should avoid: Writing weight in kilograms; Thinking mass changes on the Moon.

#### D. Current Implementation Summary
- Route/page: /experiments/mass-and-weight.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Mass (kg).
- Formulae: Weight: W = mg.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 72, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Mass remains constant but weight changes when g changes.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/mass-and-weight/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/mass-and-weight/mass-and-weightSimulation.ts
- src/experiments/mass-and-weight/mass-and-weight.css
- src/experiments/mass-and-weight/mass-and-weightData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 18. Work and Power

#### A. Current Purpose
Calculate work done and power for a force moving an object through a displacement.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Work is energy transferred by force through displacement; power is work done per unit time.
- Student should identify key variables from: Work and power: W = Fs,\quad P = \frac{W}{t}.
- Student should record observations using: Force, Displacement, Time, Work, Power.
- Student should avoid: Using time in work formula; Forgetting power depends on time.

#### D. Current Implementation Summary
- Route/page: /experiments/work-power.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Force (N).
- Formulae: Work and power: W = Fs,\quad P = \frac{W}{t}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
The same work done in less time gives greater power.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/work-power/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/work-power/work-powerSimulation.ts
- src/experiments/work-power/work-power.css
- src/experiments/work-power/work-powerData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 19. Echo and Speed of Sound

#### A. Current Purpose
Use echo timing to estimate distance or sound speed.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: An echo is reflected sound; the measured time is for the sound to travel to the reflector and back.
- Student should identify key variables from: Echo distance: d = \frac{vt}{2}.
- Student should record observations using: Echo time, Temperature, Speed, Distance.
- Student should avoid: Forgetting round trip distance; Using 330 m/s for every temperature without checking.

#### D. Current Implementation Summary
- Route/page: /experiments/echo-speed-sound.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Sound speed (m/s).
- Formulae: Echo distance: d = \frac{vt}{2}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 92, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Distance to the reflector is half the sound travel distance.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/echo-speed-sound/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/echo-speed-sound/echo-speed-soundSimulation.ts
- src/experiments/echo-speed-sound/echo-speed-sound.css
- src/experiments/echo-speed-sound/echo-speed-soundData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 20. Mirror Formula

#### A. Current Purpose
Use the mirror formula to calculate image distance and magnification for a concave mirror.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: For spherical mirrors, object distance, image distance, and focal length are related by 1/f = 1/v + 1/u.
- Student should identify key variables from: Mirror formula: \frac{1}{f}=\frac{1}{v}+\frac{1}{u}.
- Student should record observations using: Focal length, Object distance, Image distance, Magnification.
- Student should avoid: Ignoring Cartesian sign convention; Mixing cm and m.

#### D. Current Implementation Summary
- Route/page: /experiments/mirror-formula.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Focal length (cm).
- Formulae: Mirror formula: \frac{1}{f}=\frac{1}{v}+\frac{1}{u}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Image position changes sharply when object distance approaches focal length.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/mirror-formula/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/mirror-formula/mirror-formula.css
- src/experiments/mirror-formula/mirror-formulaData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 21. Lens Formula

#### A. Current Purpose
Calculate image distance and magnification for a convex lens.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: For a thin lens, focal length, object distance, and image distance follow 1/f = 1/v - 1/u.
- Student should identify key variables from: Lens formula: \frac{1}{f}=\frac{1}{v}-\frac{1}{u}.
- Student should record observations using: Focal length, Object distance, Image distance, Image type.
- Student should avoid: Using centimetres when calculating power; Ignoring sign convention.

#### D. Current Implementation Summary
- Route/page: /experiments/lens-formula.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Focal length (cm) (5-50); Object distance (cm) (5-120); Object height (cm) (1-20).
- Formulae: Lens formula: \frac{1}{f}=\frac{1}{v}-\frac{1}{u}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 89, interaction 91, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Object outside focus gives real image; object inside focus gives virtual image.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/lens-formula/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/lens-formula/lens-formulaData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 22. Glass Slab Refraction

#### A. Current Purpose
Trace refraction through a rectangular glass slab and calculate refraction angle.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A ray bends towards the normal on entering glass and away from the normal on leaving, emerging parallel with lateral shift.
- Student should identify key variables from: Snell's law: \frac{\sin i}{\sin r}=n.
- Student should record observations using: Incidence angle, Refractive index, Thickness, Refraction angle.
- Student should avoid: Measuring angle from surface instead of normal; Expecting emergent ray to keep bending away.

#### D. Current Implementation Summary
- Route/page: /experiments/glass-slab-refraction.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Refractive index.
- Formulae: Snell's law: \frac{\sin i}{\sin r}=n.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
The emergent ray is parallel to the incident ray but laterally shifted.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/glass-slab-refraction/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/glass-slab-refraction/glass-slab-refraction.css
- src/experiments/glass-slab-refraction/glass-slab-refractionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 23. Prism Dispersion

#### A. Current Purpose
Trace incident, refracted, and emergent rays through a prism, then compare deviation, minimum deviation, and colour dispersion.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A prism refracts light at two faces. Since refractive index is slightly larger for shorter wavelengths, violet bends more than red and white light spreads into VIBGYOR.
- Student should identify key variables from: Approximate deviation: \delta \approx (n-1)A; Minimum deviation: n=\frac{\sin((A+D_m)/2)}{\sin(A/2)}; Snell at prism faces: \sin i=n\sin r_1,\ r_1+r_2=A,\ n\sin r_2=\sin e.
- Student should record observations using: Prism angle A, Material / n, i, r1, r2, e, Deviation, Violet-red spread.
- Student should avoid: Measuring angles from the prism surface instead of the normal; Thinking all colours refract equally; Reversing red and violet order; Confusing deviation with dispersion; Using the minimum-deviation formula when the path is not symmetric.

#### D. Current Implementation Summary
- Route/page: /experiments/prism-dispersion.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Prism angle (degree); Refractive index; Minimum deviation (degree).
- Formulae: Approximate deviation: \delta \approx (n-1)A; Minimum deviation: n=\frac{\sin((A+D_m)/2)}{\sin(A/2)}; Snell at prism faces: \sin i=n\sin r_1,\ r_1+r_2=A,\ n\sin r_2=\sin e.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 81, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Larger prism angle and stronger dispersion create a wider visible spectrum.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/prism-dispersion/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/prism-dispersion/prism-dispersionSimulation.ts
- src/experiments/prism-dispersion/prism-dispersionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 24. Ohm's Law V-I Graph

#### A. Current Purpose
Plot voltage against current and determine resistance from the graph slope.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: For an ohmic conductor at constant temperature, V is directly proportional to I.
- Student should identify key variables from: Ohm's law: V = IR.
- Student should record observations using: Current, Resistance, Voltage, Graph slope.
- Student should avoid: Plotting I on the wrong axis without adjusting slope meaning; Changing temperature during readings.

#### D. Current Implementation Summary
- Route/page: /experiments/ohms-law.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Current (A) (0-5); Resistance (ohm) (1-100); Internal resistance (ohm) (0-10).
- Formulae: Ohm's law: V = IR.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 75, interaction 80, learning 93, classroom 92, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
The V-I graph is a straight line through origin for an ohmic conductor.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/ohms-law/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/ohms-law/ohms-lawData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 25. Series and Parallel Resistance

#### A. Current Purpose
Compare equivalent resistance and current in series and parallel circuits.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Series resistances add; parallel conductances add.
- Student should identify key variables from: Equivalent resistance: R_s=R_1+R_2,\quad R_p=\frac{R_1R_2}{R_1+R_2}.
- Student should record observations using: R1, R2, Voltage, Series current, Parallel current.
- Student should avoid: Adding parallel resistances directly; Confusing current distribution with voltage distribution.

#### D. Current Implementation Summary
- Route/page: /experiments/series-parallel-resistance.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Resistance (ohm).
- Formulae: Equivalent resistance: R_s=R_1+R_2,\quad R_p=\frac{R_1R_2}{R_1+R_2}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 2 validation case(s), 100% pass, grade 100.
- Risk note: Has 2 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 87, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Parallel equivalent resistance is less than each individual branch resistance.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/series-parallel-resistance/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/series-parallel-resistance/series-parallel-resistance.css
- src/experiments/series-parallel-resistance/series-parallel-resistanceData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 26. Electric Power and Energy

#### A. Current Purpose
Connect circuit power to electrical energy consumed over time.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Power is the rate of electrical energy use; P = VI and energy equals power times time.
- Student should identify key variables from: Electric power: P = VI.
- Student should record observations using: Voltage, Current, Power, Time, Energy.
- Student should avoid: Using watts directly as kWh; Forgetting to convert W to kW.

#### D. Current Implementation Summary
- Route/page: /experiments/electric-power.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Power (W).
- Formulae: Electric power: P = VI.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Energy consumed increases with both power rating and usage time.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/electric-power/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/electric-power/electric-powerSimulation.ts
- src/experiments/electric-power/electric-power.css
- src/experiments/electric-power/electric-powerData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 27. Magnetic Field Around Current

#### A. Current Purpose
Visualize magnetic field strength around a wire and coil as current changes.

#### B. Correct Physics Goal
Teach magnetism through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A current-carrying conductor produces circular magnetic field lines; field strength increases with current.
- Student should identify key variables from: Straight wire field: B = \frac{\mu_0 I}{2\pi r}.
- Student should record observations using: Current, Distance, Turns, Field, Direction rule.
- Student should avoid: Reversing field direction; Ignoring distance from wire.

#### D. Current Implementation Summary
- Route/page: /experiments/magnetic-field-current.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Current (A).
- Formulae: Straight wire field: B = \frac{\mu_0 I}{2\pi r}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce magnetism with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 92, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use field lines, compass needles, flux loops, polarity colors, and induction timing. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Field increases with current and coil turns, and decreases with distance.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use field lines, compass needles, flux loops, polarity colors, and induction timing.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/magnetic-field-current/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/magnetic-field-current/magnetic-field-currentSimulation.ts
- src/experiments/magnetic-field-current/magnetic-field-current.css
- src/experiments/magnetic-field-current/magnetic-field-currentData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Magnetism.

### 28. Measurement, Error, and Significant Figures

#### A. Current Purpose
Estimate absolute, relative, and percentage error from repeated measurements.

#### B. Correct Physics Goal
Teach measurement through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Reliable physics measurements include uncertainty, least count, and significant figures.
- Student should identify key variables from: Percentage error: \%\ error = \frac{\Delta x}{x}\times 100.
- Student should record observations using: Reading, Mean, Absolute error, Percentage error, Report.
- Student should avoid: Reporting too many digits; Confusing absolute and percentage error.

#### D. Current Implementation Summary
- Route/page: /experiments/measurement-errors.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Absolute error (unit of x).
- Formulae: Percentage error: \%\ error = \frac{\Delta x}{x}\times 100.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce measurement with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 72, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use a domain-specific scene, not the generic cart/grid pattern. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Smaller least count and repeated readings reduce uncertainty in the final reported value.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use a domain-specific scene, not the generic cart/grid pattern.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/measurement-errors/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/measurement-errors/measurement-errorsSimulation.ts
- src/experiments/measurement-errors/measurement-errors.css
- src/experiments/measurement-errors/measurement-errorsData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Measurement.

### 29. Vector Resolution

#### A. Current Purpose
Resolve a vector into rectangular components and reconstruct its magnitude.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Any two-dimensional vector can be written as Ax i + Ay j using sine and cosine.
- Student should identify key variables from: Vector components: A_x=A\cos\theta,\quad A_y=A\sin\theta.
- Student should record observations using: Magnitude, Angle, x-component, y-component, Reconstructed magnitude.
- Student should avoid: Swapping sine and cosine; Using degrees as radians.

#### D. Current Implementation Summary
- Route/page: /experiments/vector-resolution.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Vector magnitude (unit).
- Formulae: Vector components: A_x=A\cos\theta,\quad A_y=A\sin\theta.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
The component square sum equals the original magnitude squared.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/vector-resolution/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/vector-resolution/vector-resolutionSimulation.ts
- src/experiments/vector-resolution/vector-resolution.css
- src/experiments/vector-resolution/vector-resolutionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 30. Rotational Dynamics

#### A. Current Purpose
Relate torque, moment of inertia, and angular acceleration for rotating bodies.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Rotational motion follows tau = I alpha, the angular analogue of F = ma.
- Student should identify key variables from: Rotational equation: \tau = I\alpha.
- Student should record observations using: Torque, Moment of inertia, Angular acceleration, Angular speed.
- Student should avoid: Using linear acceleration instead of angular acceleration; Ignoring radius distribution.

#### D. Current Implementation Summary
- Route/page: /experiments/rotational-dynamics.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Torque (N m).
- Formulae: Rotational equation: \tau = I\alpha.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
For the same torque, larger moment of inertia gives smaller angular acceleration.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/rotational-dynamics/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/rotational-dynamics/rotational-dynamicsSimulation.ts
- src/experiments/rotational-dynamics/rotational-dynamics.css
- src/experiments/rotational-dynamics/rotational-dynamicsData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 31. Satellite Orbit and Escape Speed

#### A. Current Purpose
Compare orbital speed, escape speed, and orbital period around a planet.

#### B. Correct Physics Goal
Teach astronomy through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Gravity supplies centripetal force for circular orbit; escape speed is sqrt(2) times orbital speed at the same radius.
- Student should identify key variables from: Orbital speed: v_o=\sqrt{\frac{GM}{r}}.
- Student should record observations using: Mass factor, Radius, Orbital speed, Escape speed, Period.
- Student should avoid: Using surface radius when altitude is specified; Confusing orbital and escape speed.

#### D. Current Implementation Summary
- Route/page: /experiments/satellite-orbit.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Orbital radius (m).
- Formulae: Orbital speed: v_o=\sqrt{\frac{GM}{r}}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce astronomy with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use scale bars, orbit paths, parallax baselines, star glow, and dark-sky contrast. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Escape speed is greater than circular orbital speed at the same orbital radius.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use scale bars, orbit paths, parallax baselines, star glow, and dark-sky contrast.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/satellite-orbit/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/satellite-orbit/satellite-orbitSimulation.ts
- src/experiments/satellite-orbit/satellite-orbit.css
- src/experiments/satellite-orbit/satellite-orbitData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Astronomy.

### 32. Bernoulli Fluid Flow

#### A. Current Purpose
Explore pressure-speed-height tradeoffs in streamline fluid flow.

#### B. Correct Physics Goal
Teach fluid mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: For ideal flow, pressure energy, kinetic energy per volume, and gravitational potential per volume remain conserved along a streamline.
- Student should identify key variables from: Bernoulli equation: P+\frac{1}{2}\rho v^2+\rho gh=constant.
- Student should record observations using: Density, Speed, Height, Dynamic pressure, Available pressure.
- Student should avoid: Applying Bernoulli across turbulent losses; Ignoring density units.

#### D. Current Implementation Summary
- Route/page: /experiments/bernoulli-fluid-flow.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Flow speed (m/s).
- Formulae: Bernoulli equation: P+\frac{1}{2}\rho v^2+\rho gh=constant.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce fluid mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Higher flow speed or height leaves less static pressure in the same streamline.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/bernoulli-fluid-flow/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/bernoulli-fluid-flow/bernoulli-fluid-flowSimulation.ts
- src/experiments/bernoulli-fluid-flow/bernoulli-fluid-flow.css
- src/experiments/bernoulli-fluid-flow/bernoulli-fluid-flowData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Fluid Mechanics.

### 33. Gas Laws and Kinetic Theory

#### A. Current Purpose
Use the ideal gas law to connect pressure, volume, temperature, and amount of gas.

#### B. Correct Physics Goal
Teach thermodynamics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Ideal gas pressure comes from molecular collisions and follows PV = nRT.
- Student should identify key variables from: Ideal gas law: PV=nRT.
- Student should record observations using: Moles, Temperature, Volume, Pressure, PV/T.
- Student should avoid: Using Celsius in PV = nRT; Forgetting volume must be in cubic metres.

#### D. Current Implementation Summary
- Route/page: /experiments/gas-laws.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Moles (0.1-10); Temperature (K) (100-800); Volume (m3) (0.1-10).
- Formulae: Ideal gas law: PV=nRT.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 2 validation case(s), 100% pass, grade 100.
- Risk note: Has 2 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce thermodynamics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 92, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
At fixed n, pressure rises with temperature and falls as volume increases.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/gas-laws/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/gas-laws/gas-lawsData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Thermodynamics.

### 34. Thermodynamic Processes

#### A. Current Purpose
Compare isothermal, isobaric, and isochoric process work and heat trends.

#### B. Correct Physics Goal
Teach thermodynamics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Work done by a gas is the area under the PV curve, with different constraints for different processes.
- Student should identify key variables from: Gas work: W=P\Delta V.
- Student should record observations using: Pressure, Delta volume, Process, Work, Heat trend.
- Student should avoid: Using gauge pressure inconsistently; Forgetting no volume change means zero work.

#### D. Current Implementation Summary
- Route/page: /experiments/thermodynamic-process.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Work (J).
- Formulae: Gas work: W=P\Delta V.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce thermodynamics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 75, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Isochoric work is zero, while isobaric work equals pressure times volume change.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/thermodynamic-process/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/thermodynamic-process/thermodynamic-processSimulation.ts
- src/experiments/thermodynamic-process/thermodynamic-process.css
- src/experiments/thermodynamic-process/thermodynamic-processData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Thermodynamics.

### 35. Spring-Mass SHM

#### A. Current Purpose
Study simple harmonic motion of a spring-mass oscillator.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: For small oscillations, angular frequency is sqrt(k/m), independent of amplitude.
- Student should identify key variables from: Spring period: T=2\pi\sqrt{\frac{m}{k}}.
- Student should record observations using: k, Mass, Amplitude, Period, Max speed.
- Student should avoid: Using k/m instead of m/k in period; Confusing angular frequency with frequency.

#### D. Current Implementation Summary
- Route/page: /experiments/shm-spring.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Period (s).
- Formulae: Spring period: T=2\pi\sqrt{\frac{m}{k}}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 92, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Increasing mass increases period; increasing spring constant decreases period.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/shm-spring/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/shm-spring/shm-spring.css
- src/experiments/shm-spring/shm-springData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 36. Electrostatic Field and Potential

#### A. Current Purpose
Compare electric field and potential around point charges.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Electric field is force per unit charge, while potential is work per unit charge.
- Student should identify key variables from: Point charge field: E=\frac{kq}{r^2}.
- Student should record observations using: Charge, Distance, Electric field, Potential, Sign.
- Student should avoid: Treating potential as a vector; Forgetting sign of charge.

#### D. Current Implementation Summary
- Route/page: /experiments/electrostatic-field-potential.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Electric field (N/C).
- Formulae: Point charge field: E=\frac{kq}{r^2}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Field follows inverse square with distance; potential follows inverse distance.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/electrostatic-field-potential/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/electrostatic-field-potential/electrostatic-field-potentialSimulation.ts
- src/experiments/electrostatic-field-potential/electrostatic-field-potential.css
- src/experiments/electrostatic-field-potential/electrostatic-field-potentialData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 37. Capacitor Energy and Combination

#### A. Current Purpose
Calculate charge and stored energy for a capacitor and compare combinations.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A capacitor stores charge with Q = CV and energy U = 1/2 CV^2.
- Student should identify key variables from: Capacitor energy: U=\frac{1}{2}CV^2.
- Student should record observations using: C1, Voltage, Charge, Energy, Equivalent C.
- Student should avoid: Forgetting microfarad conversion; Using U = CV instead of 1/2 CV^2.

#### D. Current Implementation Summary
- Route/page: /experiments/capacitor-lab.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Capacitance (F).
- Formulae: Capacitor energy: U=\frac{1}{2}CV^2.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 87, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Energy grows with the square of voltage.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/capacitor-lab/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/capacitor-lab/capacitor-labSimulation.ts
- src/experiments/capacitor-lab/capacitor-lab.css
- src/experiments/capacitor-lab/capacitor-labData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 38. Kirchhoff Circuit Rules

#### A. Current Purpose
Use junction and loop rules to analyse a two-resistor network.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Charge conservation gives junction rule, and energy conservation gives loop rule.
- Student should identify key variables from: Loop rule: \sum V = 0.
- Student should record observations using: Voltage, R1, R2, Branch currents, Loop check.
- Student should avoid: Mixing sign convention in loops; Adding branch currents incorrectly.

#### D. Current Implementation Summary
- Route/page: /experiments/kirchhoff-circuit.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Potential difference (V).
- Formulae: Loop rule: \sum V = 0.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
At a junction, incoming current equals outgoing current.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/kirchhoff-circuit/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/kirchhoff-circuit/kirchhoff-circuitSimulation.ts
- src/experiments/kirchhoff-circuit/kirchhoff-circuit.css
- src/experiments/kirchhoff-circuit/kirchhoff-circuitData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 39. Lorentz Force on Moving Charge

#### A. Current Purpose
Calculate magnetic force and circular radius for a moving charged particle.

#### B. Correct Physics Goal
Teach magnetism through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A charge moving perpendicular to a magnetic field experiences force qvB and follows circular motion.
- Student should identify key variables from: Magnetic force: F=qvB.
- Student should record observations using: Charge, Speed, B, Force, Radius.
- Student should avoid: Ignoring angle between velocity and field; Confusing electric and magnetic force.

#### D. Current Implementation Summary
- Route/page: /experiments/lorentz-force.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Force (N).
- Formulae: Magnetic force: F=qvB.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce magnetism with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 92, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use field lines, compass needles, flux loops, polarity colors, and induction timing. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Force increases linearly with charge, speed, and magnetic field strength.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use field lines, compass needles, flux loops, polarity colors, and induction timing.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/lorentz-force/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/lorentz-force/lorentz-forceSimulation.ts
- src/experiments/lorentz-force/lorentz-force.css
- src/experiments/lorentz-force/lorentz-forceData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Magnetism.

### 40. Faraday Induction

#### A. Current Purpose
Explore induced emf from changing magnetic flux.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Faraday's law says induced emf equals the negative rate of change of magnetic flux linkage.
- Student should identify key variables from: Faraday's law: \mathcal{E}=-N\frac{\Delta\Phi}{\Delta t}.
- Student should record observations using: Turns, Flux change, Time, Induced emf, Direction.
- Student should avoid: Using flux instead of change in flux; Ignoring time interval.

#### D. Current Implementation Summary
- Route/page: /experiments/emi-faraday.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Induced emf (V).
- Formulae: Faraday's law: \mathcal{E}=-N\frac{\Delta\Phi}{\Delta t}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 89, interaction 91, learning 87, classroom 80, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Faster flux change and more turns produce larger induced emf.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/emi-faraday/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/emi-faraday/emi-faradaySimulation.ts
- src/experiments/emi-faraday/emi-faradayData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 41. AC LCR Resonance

#### A. Current Purpose
Compare reactance, impedance, current, and resonance in a series LCR circuit.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: At resonance, inductive and capacitive reactances cancel and current is maximum.
- Student should identify key variables from: Series LCR impedance: Z=\sqrt{R^2+(X_L-X_C)^2}.
- Student should record observations using: R, Frequency, Capacitance, Reactance gap, Impedance, Current.
- Student should avoid: Adding reactances directly without sign; Confusing impedance and resistance.

#### D. Current Implementation Summary
- Route/page: /experiments/ac-lcr-resonance.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Impedance (ohm).
- Formulae: Series LCR impedance: Z=\sqrt{R^2+(X_L-X_C)^2}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Current peaks when inductive and capacitive reactances are equal.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/ac-lcr-resonance/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/ac-lcr-resonance/ac-lcr-resonanceSimulation.ts
- src/experiments/ac-lcr-resonance/ac-lcr-resonance.css
- src/experiments/ac-lcr-resonance/ac-lcr-resonanceData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 42. Electromagnetic Spectrum

#### A. Current Purpose
Relate wavelength, frequency, energy, and common EM spectrum bands.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: All electromagnetic waves travel at c in vacuum and satisfy c = f lambda.
- Student should identify key variables from: EM wave relation: c=f\lambda.
- Student should record observations using: Frequency, Wavelength, Photon energy, Band.
- Student should avoid: Thinking all EM waves need a medium; Reversing wavelength-frequency relation.

#### D. Current Implementation Summary
- Route/page: /experiments/em-spectrum.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Frequency (Hz).
- Formulae: EM wave relation: c=f\lambda.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 57, interaction 75, learning 93, classroom 92, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Higher frequency means shorter wavelength and higher photon energy.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/em-spectrum/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/em-spectrum/em-spectrum.css
- src/experiments/em-spectrum/em-spectrumData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 43. Young's Double Slit

#### A. Current Purpose
Measure fringe width in a two-slit interference pattern.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Coherent light from two slits creates bright and dark fringes with beta = lambda D / d.
- Student should identify key variables from: Fringe width: \beta=\frac{\lambda D}{d}.
- Student should record observations using: Wavelength, Screen distance, Slit separation, Fringe width.
- Student should avoid: Using nm directly as metres; Confusing slit width with slit separation.

#### D. Current Implementation Summary
- Route/page: /experiments/young-double-slit.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Wavelength (nm) (380-700); Screen distance (m) (0.1-5); Slit separation (mm) (0.01-2).
- Formulae: Fringe width: \beta=\frac{\lambda D}{d}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Validated solver, 0 validation case(s), 0% pass, grade 83.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 89, interaction 91, learning 93, classroom 92, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Fringe width increases with wavelength and screen distance, and decreases with slit separation.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/young-double-slit/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/young-double-slit/young-double-slitSimulation.ts
- src/experiments/young-double-slit/young-double-slitData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 44. Photoelectric Equation

#### A. Current Purpose
Use Einstein's photoelectric equation to compare photon energy, work function, and stopping potential.

#### B. Correct Physics Goal
Teach modern physics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Electron kinetic energy equals photon energy minus metal work function when frequency exceeds threshold.
- Student should identify key variables from: Einstein equation: K_{max}=hf-\phi.
- Student should record observations using: Photon energy, Work function, Kmax, Stopping potential.
- Student should avoid: Thinking intensity increases Kmax; Forgetting threshold frequency.

#### D. Current Implementation Summary
- Route/page: /experiments/photoelectric-equation.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Photon energy (eV) (0.5-10); Work function (eV) (0.5-6); Intensity (0-1).
- Formulae: Einstein equation: K_{max}=hf-\phi.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 2 validation case(s), 100% pass, grade 100.
- Risk note: Has 2 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce modern physics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 85, interaction 91, learning 93, classroom 92, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use spectra, photons, probability clouds, quantized levels, and explicit model limitations. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Intensity changes photocurrent, while frequency controls maximum kinetic energy.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use spectra, photons, probability clouds, quantized levels, and explicit model limitations.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/photoelectric-equation/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/photoelectric-equation/photoelectric-equationData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Modern Physics.

### 45. Nuclear Decay and Half-Life

#### A. Current Purpose
Model exponential radioactive decay and remaining nuclei after multiple half-lives.

#### B. Correct Physics Goal
Teach modern physics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Radioactive nuclei decay randomly, but large samples follow N = N0(1/2)^(t/T).
- Student should identify key variables from: Half-life law: N=N_0\left(\frac{1}{2}\right)^{t/T}.
- Student should record observations using: Initial nuclei, Half-life, Elapsed time, Remaining, Activity fraction.
- Student should avoid: Subtracting a fixed number each half-life; Confusing mean life and half-life.

#### D. Current Implementation Summary
- Route/page: /experiments/nuclear-decay.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Half-life (s).
- Formulae: Half-life law: N=N_0\left(\frac{1}{2}\right)^{t/T}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce modern physics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 75, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use spectra, photons, probability clouds, quantized levels, and explicit model limitations. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
After each half-life, half the remaining undecayed nuclei are left.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use spectra, photons, probability clouds, quantized levels, and explicit model limitations.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/nuclear-decay/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/nuclear-decay/nuclear-decay.css
- src/experiments/nuclear-decay/nuclear-decayData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Modern Physics.

### 46. Semiconductor Diode and Rectifier

#### A. Current Purpose
Compare forward and reverse bias diode current and estimate rectified output.

#### B. Correct Physics Goal
Teach electronics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A p-n junction conducts strongly after cut-in voltage in forward bias and blocks most reverse current.
- Student should identify key variables from: Half-wave output: V_{out}\approx V_{in}-V_D.
- Student should record observations using: Input voltage, Diode drop, Load, Forward current, Rectified output.
- Student should avoid: Assuming an ideal zero-drop diode always; Ignoring load resistance.

#### D. Current Implementation Summary
- Route/page: /experiments/semiconductor-diode.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Diode drop (V).
- Formulae: Half-wave output: V_{out}\approx V_{in}-V_D.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electronics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use a domain-specific scene, not the generic cart/grid pattern. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Forward current flows only when input exceeds diode drop; reverse half-cycle is blocked in half-wave rectification.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use a domain-specific scene, not the generic cart/grid pattern.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/semiconductor-diode/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/semiconductor-diode/semiconductor-diodeSimulation.ts
- src/experiments/semiconductor-diode/semiconductor-diode.css
- src/experiments/semiconductor-diode/semiconductor-diodeData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electronics.

### 47. Shadows and Eclipses

#### A. Current Purpose
Show rectilinear propagation of light using shadows, umbra, penumbra, and eclipses.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Light travels in straight lines. Extended sources produce umbra and penumbra regions behind an opaque object.
- Student should identify key variables from: Similar-triangle shadow: \frac{D_s}{D_o}\approx\frac{L_s}{L_o}.
- Student should record observations using: Source size, Object distance, Screen distance, Umbra, Penumbra.
- Student should avoid: Calling every dark region umbra; Forgetting source size affects penumbra.

#### D. Current Implementation Summary
- Route/page: /experiments/shadows-eclipses.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Shadow diameter (cm); Screen distance (cm).
- Formulae: Similar-triangle shadow: \frac{D_s}{D_o}\approx\frac{L_s}{L_o}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 89, interaction 88, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
A smaller source gives a sharper shadow; an extended source creates penumbra around the umbra.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/shadows-eclipses/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/shadows-eclipses/shadows-eclipsesSimulation.ts
- src/experiments/shadows-eclipses/shadows-eclipsesData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 48. Multiple Reflection and Kaleidoscope

#### A. Current Purpose
Predict number of images formed by two plane mirrors at different angles.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Two mirrors form repeated images. For many school cases, image count is approximately 360/theta - 1 when 360/theta is an integer.
- Student should identify key variables from: Number of images: n=\frac{360}{\theta}-1.
- Student should record observations using: Mirror angle, 360/angle, Predicted images, Observed pattern.
- Student should avoid: Using radians instead of degrees; Applying the integer formula to every non-integer angle without adjustment.

#### D. Current Implementation Summary
- Route/page: /experiments/multiple-reflection.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Mirror angle (degree).
- Formulae: Number of images: n=\frac{360}{\theta}-1.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 80, learning 93, classroom 80, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Smaller mirror angle produces more repeated images.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/multiple-reflection/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/multiple-reflection/multiple-reflectionSimulation.ts
- src/experiments/multiple-reflection/multiple-reflection.css
- src/experiments/multiple-reflection/multiple-reflectionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 49. Longitudinal Sound Wave

#### A. Current Purpose
Visualize compressions, rarefactions, wavelength, frequency, amplitude, and speed of sound.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Sound in air is a longitudinal pressure wave. Particles oscillate back and forth while energy travels through the medium.
- Student should identify key variables from: Wave speed: v=f\lambda.
- Student should record observations using: Frequency, Amplitude, Wavelength, Particle motion, Wave speed.
- Student should avoid: Drawing sound in air as a transverse wave only; Confusing particle motion with wave travel direction.

#### D. Current Implementation Summary
- Route/page: /experiments/sound-wave-anatomy.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Frequency (Hz); Wavelength (m).
- Formulae: Wave speed: v=f\lambda.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 57, interaction 72, learning 93, classroom 92, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
For fixed sound speed, higher frequency gives shorter wavelength.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/sound-wave-anatomy/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/sound-wave-anatomy/sound-wave-anatomySimulation.ts
- src/experiments/sound-wave-anatomy/sound-wave-anatomy.css
- src/experiments/sound-wave-anatomy/sound-wave-anatomyData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 50. Human Eye and Vision Defects

#### A. Current Purpose
Model image formation on the retina and correction of myopia and hypermetropia.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: The eye lens changes focal length to focus images on the retina. Diverging or converging corrective lenses shift the focus back to the retina.
- Student should identify key variables from: Lens power: P=\frac{1}{f}.
- Student should record observations using: Defect, Far point/near point, Correction lens, Image position.
- Student should avoid: Mixing myopia and hypermetropia; Forgetting focal length in metres for dioptres.

#### D. Current Implementation Summary
- Route/page: /experiments/human-eye-defects.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Power (dioptre); Focal length (m).
- Formulae: Lens power: P=\frac{1}{f}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 80, learning 93, classroom 80, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Myopia is corrected by a concave lens; hypermetropia is corrected by a convex lens.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/human-eye-defects/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/human-eye-defects/human-eye-defectsSimulation.ts
- src/experiments/human-eye-defects/human-eye-defects.css
- src/experiments/human-eye-defects/human-eye-defectsData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 51. Sources of Energy Comparator

#### A. Current Purpose
Compare renewable and conventional energy sources using power output, efficiency, cost, and environmental score.

#### B. Correct Physics Goal
Teach energy through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A good energy source is available, economical, efficient, easy to store/transport, and has low environmental impact.
- Student should identify key variables from: Useful energy: E_{useful}=\eta E_{input}.
- Student should record observations using: Source, Input energy, Efficiency, Useful output, Impact score.
- Student should avoid: Comparing only power and ignoring environmental cost; Treating efficiency as energy itself.

#### D. Current Implementation Summary
- Route/page: /experiments/sources-of-energy.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Efficiency.
- Formulae: Useful energy: E_{useful}=\eta E_{input}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce energy with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use a domain-specific scene, not the generic cart/grid pattern. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Higher efficiency increases useful output, while fossil-fuel-heavy mixes raise impact score.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use a domain-specific scene, not the generic cart/grid pattern.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/sources-of-energy/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/sources-of-energy/sources-of-energySimulation.ts
- src/experiments/sources-of-energy/sources-of-energy.css
- src/experiments/sources-of-energy/sources-of-energyData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Energy.

### 52. Meter Bridge

#### A. Current Purpose
Find an unknown resistance using the balanced Wheatstone bridge relation.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: At balance, no current flows through the galvanometer and R/X = l/(100-l).
- Student should identify key variables from: Balance relation: \frac{R}{X}=\frac{l}{100-l}.
- Student should record observations using: Known R, Balance length, Unknown X, Reversed balance.
- Student should avoid: Using l/(100-l) for X/R instead of R/X; Forgetting balance length is in centimetres on the bridge wire.

#### D. Current Implementation Summary
- Route/page: /experiments/meter-bridge.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Balance length (cm).
- Formulae: Balance relation: \frac{R}{X}=\frac{l}{100-l}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Unknown resistance follows X = R(100-l)/l.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/meter-bridge/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/meter-bridge/meter-bridgeSimulation.ts
- src/experiments/meter-bridge/meter-bridge.css
- src/experiments/meter-bridge/meter-bridgeData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 53. Cell Internal Resistance

#### A. Current Purpose
Compare emf, terminal voltage, current, and internal resistance of a cell.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: A real cell has internal resistance, so terminal voltage falls as current increases: V = E - Ir.
- Student should identify key variables from: Terminal voltage: V=E-Ir.
- Student should record observations using: EMF, External R, Current, Terminal V, Internal r.
- Student should avoid: Treating emf and terminal voltage as always equal; Ignoring the cell's internal resistance.

#### D. Current Implementation Summary
- Route/page: /experiments/internal-resistance-cell.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: EMF (V); Internal resistance (ohm).
- Formulae: Terminal voltage: V=E-Ir.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Terminal voltage decreases when load current increases.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/internal-resistance-cell/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/internal-resistance-cell/internal-resistance-cellSimulation.ts
- src/experiments/internal-resistance-cell/internal-resistance-cell.css
- src/experiments/internal-resistance-cell/internal-resistance-cellData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 54. AC Generator

#### A. Current Purpose
Visualize sinusoidal emf generated by rotating a coil in a magnetic field.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Changing magnetic flux through a rotating coil induces emf. For uniform rotation, emf varies sinusoidally.
- Student should identify key variables from: AC generator emf: \mathcal{E}=NBA\omega\sin\omega t.
- Student should record observations using: Turns, Magnetic field, Angular speed, Peak emf, Frequency.
- Student should avoid: Thinking faster rotation changes only amplitude; Ignoring coil turns.

#### D. Current Implementation Summary
- Route/page: /experiments/ac-generator.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Turns; Angular speed (rad/s).
- Formulae: AC generator emf: \mathcal{E}=NBA\omega\sin\omega t.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 89, interaction 91, learning 93, classroom 80, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Peak emf increases with turns, field, area, and angular speed.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/ac-generator/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/ac-generator/ac-generatorSimulation.ts
- src/experiments/ac-generator/ac-generatorData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 55. Transformer Lab

#### A. Current Purpose
Compare primary and secondary voltages, current, and efficiency in a transformer.

#### B. Correct Physics Goal
Teach electricity through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: An ideal transformer follows Vs/Vp = Ns/Np. Practical transformers lose some energy as heat and magnetic leakage.
- Student should identify key variables from: Transformer equation: \frac{V_s}{V_p}=\frac{N_s}{N_p}.
- Student should record observations using: Vp, Np, Ns, Vs, Efficiency.
- Student should avoid: Applying transformer equation to DC; Forgetting current changes opposite to voltage in an ideal transformer.

#### D. Current Implementation Summary
- Route/page: /experiments/transformer-lab.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Number of turns.
- Formulae: Transformer equation: \frac{V_s}{V_p}=\frac{N_s}{N_p}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electricity with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 89, interaction 91, learning 93, classroom 80, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
More secondary turns than primary turns steps voltage up.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use circuit glow, moving charge dots, meters, voltage gradients, and safe current labels.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/transformer-lab/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/transformer-lab/transformer-labSimulation.ts
- src/experiments/transformer-lab/transformer-labData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electricity.

### 56. Total Internal Reflection

#### A. Current Purpose
Find critical angle and show when light reflects completely inside a denser medium.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Total internal reflection occurs when light travels from denser to rarer medium and incidence angle exceeds the critical angle.
- Student should identify key variables from: Critical angle: \sin C=\frac{n_2}{n_1}.
- Student should record observations using: n1, n2, Critical angle, Incidence angle, Result.
- Student should avoid: Expecting TIR from rarer to denser medium; Using degrees directly inside sine without conversion in calculations.

#### D. Current Implementation Summary
- Route/page: /experiments/total-internal-reflection.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Critical angle (degree).
- Formulae: Critical angle: \sin C=\frac{n_2}{n_1}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
For glass to air, angles greater than the critical angle produce total internal reflection.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/total-internal-reflection/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/total-internal-reflection/total-internal-reflectionSimulation.ts
- src/experiments/total-internal-reflection/total-internal-reflection.css
- src/experiments/total-internal-reflection/total-internal-reflectionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 57. Microscope and Telescope

#### A. Current Purpose
Compare magnification of a compound microscope and an astronomical telescope.

#### B. Correct Physics Goal
Teach optics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Optical instruments use objective and eyepiece lenses to form enlarged images at comfortable viewing positions.
- Student should identify key variables from: Telescope magnification: M=\frac{f_o}{f_e}.
- Student should record observations using: Mode, Objective f, Eyepiece f, Magnification, Tube length.
- Student should avoid: Mixing microscope and telescope formulae; Ignoring sign and final-image convention.

#### D. Current Implementation Summary
- Route/page: /experiments/optical-instruments.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Objective focal length (cm); Eyepiece focal length (cm).
- Formulae: Telescope magnification: M=\frac{f_o}{f_e}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce optics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 80, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Shorter eyepiece focal length increases angular magnification.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use rays, normals, focal points, screens, lenses/mirrors/prisms, and measured angles.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/optical-instruments/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/optical-instruments/optical-instrumentsSimulation.ts
- src/experiments/optical-instruments/optical-instruments.css
- src/experiments/optical-instruments/optical-instrumentsData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Optics.

### 58. Polarization Lab

#### A. Current Purpose
Use two polarizers to verify Malus' law for transmitted light intensity.

#### B. Correct Physics Goal
Teach waves through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Plane polarized light passing through an analyzer has intensity I = I0 cos^2(theta).
- Student should identify key variables from: Malus' law: I=I_0\cos^2\theta.
- Student should record observations using: Initial intensity, Analyzer angle, Transmitted intensity, Percent.
- Student should avoid: Using cos theta instead of cos squared theta; Applying Malus' law to unpolarized light without the first polarizer loss.

#### D. Current Implementation Summary
- Route/page: /experiments/polarization-lab.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Analyzer angle (degree).
- Formulae: Malus' law: I=I_0\cos^2\theta.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce waves with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 65, interaction 83, learning 93, classroom 92, accessibility 74.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Intensity is maximum at 0 degrees and near zero at 90 degrees.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/polarization-lab/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/polarization-lab/polarization-labSimulation.ts
- src/experiments/polarization-lab/polarization-lab.css
- src/experiments/polarization-lab/polarization-labData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Waves.

### 59. de Broglie Wavelength

#### A. Current Purpose
Connect particle momentum and accelerating voltage to matter-wave wavelength.

#### B. Correct Physics Goal
Teach modern physics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Moving particles have wavelength lambda = h/p. For electrons accelerated through voltage V, wavelength decreases as voltage increases.
- Student should identify key variables from: Matter wavelength: \lambda=\frac{h}{p}.
- Student should record observations using: Voltage, Momentum, Wavelength, Diffraction trend.
- Student should avoid: Using mass instead of momentum; Forgetting electron wavelength is very small.

#### D. Current Implementation Summary
- Route/page: /experiments/de-broglie-wavelength.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Momentum (kg m/s).
- Formulae: Matter wavelength: \lambda=\frac{h}{p}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce modern physics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use spectra, photons, probability clouds, quantized levels, and explicit model limitations. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Higher accelerating voltage gives shorter de Broglie wavelength.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use spectra, photons, probability clouds, quantized levels, and explicit model limitations.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/de-broglie-wavelength/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/de-broglie-wavelength/de-broglie-wavelengthSimulation.ts
- src/experiments/de-broglie-wavelength/de-broglie-wavelength.css
- src/experiments/de-broglie-wavelength/de-broglie-wavelengthData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Modern Physics.

### 60. Bohr Atom Transitions

#### A. Current Purpose
Visualize hydrogen energy levels, spectral lines, and photon emission/absorption.

#### B. Correct Physics Goal
Teach modern physics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Hydrogen energy levels follow En = -13.6/n^2 eV. A photon is emitted or absorbed when the electron changes levels.
- Student should identify key variables from: Hydrogen energy level: E_n=-\frac{13.6}{n^2}\ eV.
- Student should record observations using: Initial n, Final n, Photon energy, Process, Series.
- Student should avoid: Using positive energy for bound levels; Confusing n with orbit radius only.

#### D. Current Implementation Summary
- Route/page: /experiments/bohr-model.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Principal quantum number.
- Formulae: Hydrogen energy level: E_n=-\frac{13.6}{n^2}\ eV.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce modern physics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 77, interaction 83, learning 93, classroom 80, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use spectra, photons, probability clouds, quantized levels, and explicit model limitations. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Transitions to lower levels emit photons; larger energy gaps produce higher-frequency light.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use spectra, photons, probability clouds, quantized levels, and explicit model limitations.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/bohr-model/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/bohr-model/bohr-modelSimulation.ts
- src/experiments/bohr-model/bohr-model.css
- src/experiments/bohr-model/bohr-modelData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Modern Physics.

### 61. Logic Gates

#### A. Current Purpose
Build truth tables for NOT, AND, OR, NAND, and NOR gates.

#### B. Correct Physics Goal
Teach electronics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Logic gates convert binary inputs into binary outputs and form the building blocks of digital electronics.
- Student should identify key variables from: AND gate: Y=A\cdot B.
- Student should record observations using: Gate, Input A, Input B, Output.
- Student should avoid: Mixing OR with exclusive OR; Forgetting NAND is inverted AND.

#### D. Current Implementation Summary
- Route/page: /experiments/logic-gates.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Binary inputs (0 or 1).
- Formulae: AND gate: Y=A\cdot B.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce electronics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use a domain-specific scene, not the generic cart/grid pattern. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Each gate follows its standard truth table; NAND and NOR invert AND and OR outputs.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use a domain-specific scene, not the generic cart/grid pattern.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/logic-gates/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/logic-gates/logic-gatesSimulation.ts
- src/experiments/logic-gates/logic-gates.css
- src/experiments/logic-gates/logic-gatesData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Electronics.

### 62. Distance-Time Graph Builder

#### A. Current Purpose
Build a distance-time graph and connect slope with speed.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: On a distance-time graph, slope equals speed. A steeper straight line means faster uniform motion, while a horizontal line means rest.
- Student should identify key variables from: Graph speed: v=\frac{\Delta s}{\Delta t}.
- Student should record observations using: Speed, Time, Distance, Graph slope, Motion type.
- Student should avoid: Reading graph height as speed; Forgetting slope is change in distance divided by change in time.

#### D. Current Implementation Summary
- Route/page: /experiments/distance-time-graph.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Speed (m/s); Distance (m); Time (s).
- Formulae: Graph speed: v=\frac{\Delta s}{\Delta t}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 85, interaction 88, learning 93, classroom 80, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Distance increases linearly for uniform motion, and graph slope equals speed.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/distance-time-graph/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/distance-time-graph/distance-time-graphSimulation.ts
- src/experiments/distance-time-graph/distance-time-graphData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 63. Balanced and Unbalanced Forces

#### A. Current Purpose
Compare left and right forces and predict whether an object stays still, moves steadily, or accelerates.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Balanced forces give zero net force and no change in velocity. Unbalanced forces cause acceleration in the direction of net force.
- Student should identify key variables from: Net force and acceleration: F_{net}=F_R-F_L,\quad a=\frac{F_{net}}{m}.
- Student should record observations using: Left force, Right force, Net force, Mass, Acceleration.
- Student should avoid: Thinking balanced forces mean no motion; Ignoring direction when adding forces.

#### D. Current Implementation Summary
- Route/page: /experiments/balanced-unbalanced-forces.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Force (N); Mass (kg).
- Formulae: Net force and acceleration: F_{net}=F_R-F_L,\quad a=\frac{F_{net}}{m}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Equal opposite forces produce zero acceleration; unequal forces accelerate the object toward the larger force.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/balanced-unbalanced-forces/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/balanced-unbalanced-forces/balanced-unbalanced-forces.css
- src/experiments/balanced-unbalanced-forces/balanced-unbalanced-forcesData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 64. Universal Gravitation Field Map

#### A. Current Purpose
Visualize how gravitational force changes with mass and distance.

#### B. Correct Physics Goal
Teach astronomy through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Every mass attracts every other mass. The force is proportional to both masses and inversely proportional to the square of the distance.
- Student should identify key variables from: Universal gravitation: F=G\frac{m_1m_2}{r^2}.
- Student should record observations using: Mass 1, Mass 2, Distance, Force, Field trend.
- Student should avoid: Thinking only planets have gravity; Forgetting the inverse-square distance relation.

#### D. Current Implementation Summary
- Route/page: /experiments/universal-gravitation.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Gravitational constant (N m^2/kg^2); Separation (m).
- Formulae: Universal gravitation: F=G\frac{m_1m_2}{r^2}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce astronomy with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 85, interaction 91, learning 93, classroom 80, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use scale bars, orbit paths, parallax baselines, star glow, and dark-sky contrast. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Doubling distance reduces gravitational force to one-fourth, if masses are unchanged.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use scale bars, orbit paths, parallax baselines, star glow, and dark-sky contrast.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/universal-gravitation/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/universal-gravitation/universal-gravitationSimulation.ts
- src/experiments/universal-gravitation/universal-gravitationData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Flagship cinematic. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Astronomy.

### 65. Density Float-or-Sink Tank

#### A. Current Purpose
Predict whether an object floats or sinks by comparing object density with liquid density.

#### B. Correct Physics Goal
Teach fluid mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: An object floats if its average density is less than the fluid density, and sinks if it is greater.
- Student should identify key variables from: Floating fraction: \frac{V_{sub}}{V}=\frac{\rho_{object}}{\rho_{fluid}}.
- Student should record observations using: Fluid density, Object density, Volume, Submerged fraction, State.
- Student should avoid: Comparing mass alone instead of density; Forgetting submerged fraction cannot exceed 100 percent.

#### D. Current Implementation Summary
- Route/page: /experiments/density-float-sink.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Density (kg/m^3).
- Formulae: Floating fraction: \frac{V_{sub}}{V}=\frac{\rho_{object}}{\rho_{fluid}}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce fluid mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 80, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Objects less dense than the fluid float partially submerged; denser objects sink.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/density-float-sink/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/density-float-sink/density-float-sinkSimulation.ts
- src/experiments/density-float-sink/density-float-sink.css
- src/experiments/density-float-sink/density-float-sinkData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Fluid Mechanics.

### 66. Calorimetry Mixing Lab

#### A. Current Purpose
Mix hot and cold water samples and predict the final equilibrium temperature.

#### B. Correct Physics Goal
Teach thermodynamics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: In an insulated mixture, heat lost by the hot body is approximately equal to heat gained by the cold body.
- Student should identify key variables from: Heat balance: m_hc(T_h-T_f)=m_cc(T_f-T_c).
- Student should record observations using: Hot mass, Hot temp, Cold mass, Cold temp, Final temp.
- Student should avoid: Averaging temperatures without considering mass; Forgetting heat lost equals heat gained only in an insulated setup.

#### D. Current Implementation Summary
- Route/page: /experiments/calorimetry-mixing.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Final temperature (C).
- Formulae: Heat balance: m_hc(T_h-T_f)=m_cc(T_f-T_c).
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce thermodynamics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Good.
- Quality dimensions: accuracy 100, visuals 77, interaction 83, learning 93, classroom 80, accessibility 82.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
The final temperature lies between the hot and cold initial temperatures and shifts toward the larger heat capacity sample.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/calorimetry-mixing/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/calorimetry-mixing/calorimetry-mixingSimulation.ts
- src/experiments/calorimetry-mixing/calorimetry-mixing.css
- src/experiments/calorimetry-mixing/calorimetry-mixingData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Interactive model. Missing layers: none.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Thermodynamics.

### 67. Special Relativity Bridge

#### A. Current Purpose
Explore time dilation, length contraction, and relativistic energy using a light-clock and spacetime graph.

#### B. Correct Physics Goal
Teach modern physics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: At speeds close to light speed, observers can disagree on measured time and length while the spacetime interval remains consistent.
- Student should identify key variables from: Lorentz factor: \gamma=\frac{1}{\sqrt{1-v^2/c^2}}.
- Student should record observations using: Speed fraction, Gamma, Proper time, Measured time, Energy trend.
- Student should avoid: Using everyday speed intuition near light speed; Treating gamma as linear in speed; Forgetting that c is the same for inertial observers.

#### D. Current Implementation Summary
- Route/page: /experiments/special-relativity-bridge.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: Relative speed (m/s); Speed of light (m/s).
- Formulae: Lorentz factor: \gamma=\frac{1}{\sqrt{1-v^2/c^2}}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce modern physics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use spectra, photons, probability clouds, quantized levels, and explicit model limitations. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
As speed approaches light speed, gamma rises, measured time dilates, and energy demand grows sharply.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use spectra, photons, probability clouds, quantized levels, and explicit model limitations.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/special-relativity-bridge/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/special-relativity-bridge/special-relativity-bridgeSimulation.ts
- src/experiments/special-relativity-bridge/special-relativity-bridge.css
- src/experiments/special-relativity-bridge/special-relativity-bridgeData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Modern Physics.

### 68. Chaotic and Coupled Oscillators

#### A. Current Purpose
Compare a simple oscillator with a double-pendulum style coupled oscillator and identify the start of chaotic motion.

#### B. Correct Physics Goal
Teach oscillations through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Coupled nonlinear oscillators can become sensitive to initial conditions, so tiny angle changes can grow into visibly different phase paths.
- Student should identify key variables from: Sensitivity indicator: \Delta(t)\approx\Delta_0e^{\lambda t}.
- Student should record observations using: Angle 1, Angle 2, Coupling, Phase spread, Motion type.
- Student should avoid: Calling every complex path random; Changing damping and angle together; Expecting exact periodic return in chaotic motion.

#### D. Current Implementation Summary
- Route/page: /experiments/chaotic-coupled-oscillators.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Lyapunov-style growth rate (s^-1).
- Formulae: Sensitivity indicator: \Delta(t)\approx\Delta_0e^{\lambda t}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce oscillations with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 53, interaction 75, learning 93, classroom 80, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Small angles stay regular for longer, while larger coupled motion separates quickly and produces complex phase paths.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use wavefronts, phase markers, amplitude rulers, interference coloring, and synchronized graph traces.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/chaotic-coupled-oscillators/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/chaotic-coupled-oscillators/chaotic-coupled-oscillatorsSimulation.ts
- src/experiments/chaotic-coupled-oscillators/chaotic-coupled-oscillators.css
- src/experiments/chaotic-coupled-oscillators/chaotic-coupled-oscillatorsData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Oscillations.

### 69. Advanced Quantum Operators

#### A. Current Purpose
Visualize state vectors, operator action, measurement projection, and tunneling or scattering probability as one compact model.

#### B. Correct Physics Goal
Teach modern physics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Operators transform quantum states and observables return allowed values through eigenstates and probabilities.
- Student should identify key variables from: Eigenvalue equation: \hat A\psi=a\psi.
- Student should record observations using: Operator, State angle, Barrier, Projection, Transmission.
- Student should avoid: Treating the wavefunction as a classical path; Forgetting probability normalization; Reading operator action as a physical push.

#### D. Current Implementation Summary
- Route/page: /experiments/advanced-quantum-operators.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + generic Three.js fallback.
- Controls available: State function; Measured eigenvalue.
- Formulae: Eigenvalue equation: \hat A\psi=a\psi.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce modern physics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use spectra, photons, probability clouds, quantized levels, and explicit model limitations. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Aligned states give high projection probability; stronger barriers reduce transmission except for tunneling tails.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use spectra, photons, probability clouds, quantized levels, and explicit model limitations.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/advanced-quantum-operators/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/advanced-quantum-operators/advanced-quantum-operatorsSimulation.ts
- src/experiments/advanced-quantum-operators/advanced-quantum-operators.css
- src/experiments/advanced-quantum-operators/advanced-quantum-operatorsData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Modern Physics.

### 70. Statistical Ensemble Lab

#### A. Current Purpose
Compare microstates, ensemble averages, phase tendency, and transport response without long derivations.

#### B. Correct Physics Goal
Teach thermodynamics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Statistical mechanics connects many microscopic configurations to macroscopic quantities such as temperature, pressure, entropy, and fluctuations.
- Student should identify key variables from: Boltzmann weight: P(E)\propto e^{-E/kT}.
- Student should record observations using: Temperature, Particles, Interaction, Average energy, Fluctuation.
- Student should avoid: Confusing one particle path with the ensemble average; Ignoring fluctuations near phase changes; Using Celsius directly in Boltzmann factors.

#### D. Current Implementation Summary
- Route/page: /experiments/statistical-ensemble-lab.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Energy (J); Temperature (K).
- Formulae: Boltzmann weight: P(E)\propto e^{-E/kT}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce thermodynamics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Higher temperature broadens the energy distribution and increases average kinetic energy and fluctuations.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use particle speed, heat maps, thermal reservoirs, and energy-flow arrows.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/statistical-ensemble-lab/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/statistical-ensemble-lab/statistical-ensemble-labSimulation.ts
- src/experiments/statistical-ensemble-lab/statistical-ensemble-lab.css
- src/experiments/statistical-ensemble-lab/statistical-ensemble-labData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Thermodynamics.

### 71. Computational Physics Workflow

#### A. Current Purpose
Build a small reproducible physics workflow: choose a model, step size, uncertainty, graph, and verification rule.

#### B. Correct Physics Goal
Teach measurement through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: Computational physics depends on model assumptions, numerical stability, convergence checks, and uncertainty reporting as much as raw output.
- Student should identify key variables from: Relative error: \epsilon=\left|\frac{x_{num}-x_{ref}}{x_{ref}}\right|.
- Student should record observations using: Model, Step size, Result, Reference, Relative error.
- Student should avoid: Reporting many digits without uncertainty; Changing model and step size at the same time; Skipping assumptions in the notebook.

#### D. Current Implementation Summary
- Route/page: /experiments/computational-physics-workflow.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Numerical result; Reference result.
- Formulae: Relative error: \epsilon=\left|\frac{x_{num}-x_{ref}}{x_{ref}}\right|.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Formula calculator, 0 validation case(s), 0% pass, grade 73.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce measurement with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 100, visuals 61, interaction 83, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use a domain-specific scene, not the generic cart/grid pattern. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
A stable workflow shows error shrinking with smaller step size and keeps enough metadata to reproduce the result.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use a domain-specific scene, not the generic cart/grid pattern.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/computational-physics-workflow/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/computational-physics-workflow/computational-physics-workflowSimulation.ts
- src/experiments/computational-physics-workflow/computational-physics-workflow.css
- src/experiments/computational-physics-workflow/computational-physics-workflowData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Low. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Measurement.

### 72. Uniform Motion

#### A. Current Purpose
Explore uniform motion with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Uniform motion: x = x_0 + vt.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/uniform-motion.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Position (m); Velocity (m/s); Time (s).
- Formulae: Uniform motion: x = x_0 + vt.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Sandbox starter, 0 validation case(s), 0% pass, grade 48.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 72, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/uniform-motion/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/uniform-motion/uniform-motionSimulation.ts
- src/experiments/uniform-motion/uniform-motion.css
- src/experiments/uniform-motion/uniform-motionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Critical. Depth tier: Needs depth pass. Missing layers: Replay checkpoints, Non-color cues.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 73. Newton's Second Law

#### A. Current Purpose
Explore newton's second law with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Newton's second law: F = ma.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/newton-s-second-law.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Applied force (N) (0-200); Mass (kg) (0.1-50); Friction force (N) (0-80).
- Formulae: Newton's second law: F = ma.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 72, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/newton-s-second-law/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/newton-s-second-law/newton-s-second-law.css
- src/experiments/newton-s-second-law/newton-s-second-lawData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Medium. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 74. Friction

#### A. Current Purpose
Explore friction with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Kinetic friction: f = \mu N.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/friction.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Coefficient of friction; Normal force (N).
- Formulae: Kinetic friction: f = \mu N.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Sandbox starter, 0 validation case(s), 0% pass, grade 48.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 72, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/friction/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/friction/frictionSimulation.ts
- src/experiments/friction/friction.css
- src/experiments/friction/frictionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Critical. Depth tier: Needs depth pass. Missing layers: Vectors, Replay checkpoints, Non-color cues.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 75. Inclined Plane

#### A. Current Purpose
Explore inclined plane with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Incline acceleration: a = g(\sin\theta - \mu\cos\theta).
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/inclined-plane.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Incline angle (degree); Friction coefficient.
- Formulae: Incline acceleration: a = g(\sin\theta - \mu\cos\theta).
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Sandbox starter, 0 validation case(s), 0% pass, grade 48.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 75, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/inclined-plane/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/inclined-plane/inclined-planeSimulation.ts
- src/experiments/inclined-plane/inclined-plane.css
- src/experiments/inclined-plane/inclined-planeData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Critical. Depth tier: Needs depth pass. Missing layers: Vectors, Replay checkpoints, Non-color cues.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 76. Elastic Collision

#### A. Current Purpose
Explore elastic collision with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Momentum conservation: m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/elastic-collision.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Mass (kg); Initial velocity (m/s); Final velocity (m/s).
- Formulae: Momentum conservation: m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Sandbox starter, 0 validation case(s), 0% pass, grade 48.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 75, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/elastic-collision/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/elastic-collision/elastic-collisionSimulation.ts
- src/experiments/elastic-collision/elastic-collision.css
- src/experiments/elastic-collision/elastic-collisionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Critical. Depth tier: Needs depth pass. Missing layers: Vectors, Replay checkpoints, Non-color cues.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 77. Conservation of Energy

#### A. Current Purpose
Explore conservation of energy with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Mechanical energy: E = \frac{1}{2}mv^2 + mgh.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/conservation-of-energy.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Mass (kg) (0.1-50); Height (m) (0-100); Loss fraction (0-0.9).
- Formulae: Mechanical energy: E = \frac{1}{2}mv^2 + mgh.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Validated solver, 0 validation case(s), 0% pass, grade 83.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 75, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/conservation-of-energy/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/conservation-of-energy/conservation-of-energySimulation.ts
- src/experiments/conservation-of-energy/conservation-of-energy.css
- src/experiments/conservation-of-energy/conservation-of-energyData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Medium. Depth tier: Guided visual. Missing layers: Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 78. Hooke's Law

#### A. Current Purpose
Explore hooke's law with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Hooke's law: F = -kx.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/hooke-s-law.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Spring constant (N/m); Extension (m).
- Formulae: Hooke's law: F = -kx.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Sandbox starter, 0 validation case(s), 0% pass, grade 48.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 75, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/hooke-s-law/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/hooke-s-law/hooke-s-lawSimulation.ts
- src/experiments/hooke-s-law/hooke-s-law.css
- src/experiments/hooke-s-law/hooke-s-lawData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Critical. Depth tier: Needs depth pass. Missing layers: Vectors, Replay checkpoints, Non-color cues.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 79. Simple Pendulum

#### A. Current Purpose
Explore simple pendulum with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Small-angle period: T = 2\pi\sqrt{\frac{L}{g}}.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/simple-pendulum.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG guided visual + Three.js scene + graph/report panes.
- Controls available: Length (m) (0.1-5); Mass (kg) (0.05-5); Damping (0-0.5).
- Formulae: Small-angle period: T = 2\pi\sqrt{\frac{L}{g}}.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Good.
- Accuracy profile: Validated solver, 1 validation case(s), 100% pass, grade 100.
- Risk note: Has 1 executable benchmark case(s), 100% pass. Still needs visual-to-formula alignment checks.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 75, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/simple-pendulum/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/simple-pendulum/simple-pendulum.css
- src/experiments/simple-pendulum/simple-pendulumData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Medium. Depth tier: Guided visual. Missing layers: Vectors, Replay checkpoints.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

### 80. Circular Motion

#### A. Current Purpose
Explore circular motion with editable variables and live measurements.

#### B. Correct Physics Goal
Teach mechanics through a model where the displayed variables, units, formula, motion/field/graph behavior, and observations all agree. The lab should make the main cause-effect relation visible before asking the learner to trust the equation.

#### C. Student Learning Outcomes
- Student should explain the core idea: This starter experiment uses the common lab workspace, object properties, vectors, graphs, and observation table.
- Student should identify key variables from: Centripetal force: F_c = mr\omega^2.
- Student should record observations using: Trial, Variable, Measured value, Expected value, Error %.
- Student should avoid: Using inconsistent units; Running too large a time step; Ignoring friction or restitution settings.

#### D. Current Implementation Summary
- Route/page: /experiments/circular-motion.
- Source files used: src/lib/experiments.ts, src/pages/ExperimentDetailPage.tsx, src/components/GuidedVisualization.tsx, src/components/Experiment3DAnimation.tsx, src/lib/flagshipLabModels.ts, src/lib/accuracyValidation.ts, src/lib/simulationDepth.ts.
- CSS files used: src/styles.css plus component-level classnames; projectile uses ProjectileExperiment class groups.
- Rendering method: Shared SVG mechanics visual + generic Three.js fallback.
- Controls available: Radius (m); Angular speed (rad/s).
- Formulae: Centripetal force: F_c = mr\omega^2.
- Shared components: Toolbar, ExperimentDetailPage tabs, GuidePanel, CoreLearningToolkit, LearningPanel, GuidedExperimentMode, LearningCoach, GuidedVisualization, Experiment3DAnimation, FormulaGlossaryPanel, PlotSvg, UnitConverterPanel, report export.

#### E. Physics Accuracy Review
- Status: Needs Minor Fix.
- Accuracy profile: Sandbox starter, 0 validation case(s), 0% pass, grade 48.
- Risk note: Formula metadata exists, but executable benchmark cases are missing or incomplete.
- Formula/unit check: verify SI units, axis labels, sign convention, valid ranges, and failure conditions before promoting.
- Boundary conditions to test: minimum/maximum controls, zero or near-zero denominators, negative signs, unit conversion, and whether graph shape matches the formula.

#### F. Teacher Perspective
A teacher can use this to introduce mechanics with the aim, formula, guided mode, and report panel. Missing teacher upgrades: a frozen prediction frame, one-click demonstration presets, board-friendly annotations, and a concise "what changed" explanation after each control change.

#### G. Low-IQ / Slow Learner Perspective
Use simpler words, fewer controls at first, large icons, a "change only this" hint, and a "watch this value" box. Replace abstract names with plain-language labels and explain difficult terms before the formula.

#### H. Normal Student Perspective
A regular student should be able to change one variable, observe the visual, compare the numerical output, reset, and answer a short check question. The current shared interface supports this partially, but needs clearer immediate feedback and example tasks.

#### I. Advanced Student Perspective
Add derivation steps, graph presets, numerical table export, uncertainty/assumption notes, edge cases, and parameter sweeps. For this lab, advanced mode should expose the exact model equations and valid range warnings.

#### J. UI/UX Designer Perspective
- UI status: Needs Improvement.
- Quality dimensions: accuracy 80, visuals 53, interaction 75, learning 93, classroom 76, accessibility 78.
- UX issue: the experiment page is rich but dense; controls, 2D, 3D, graph, report, coach, and notes need clearer information hierarchy on small screens.

#### K. Cinematic Creative Director Perspective
Use motion trails, force arrows, vectors, energy bars, and graph cursors. Add a short cinematic transition from setup -> prediction -> variable change -> measured outcome. Avoid reusing the same grid-and-card treatment unless the concept demands it.

#### L. What This Simulation Should Teach
Measured behavior should follow the standard SI-unit physics model for the chosen topic.

#### M. Required Modifications
1. Physics accuracy fixes: add benchmark cases, valid ranges, assumptions, unit checks, and graph-shape assertions.
2. UI/UX fixes: make the first screen focus on one learning task, one primary control group, and one observation panel.
3. Educational content fixes: add beginner explanation, try-this task, misconception warning, and teacher note.
4. Visual/cinematic improvements: Use motion trails, force arrows, vectors, energy bars, and graph cursors.
5. Mobile improvements: collapse secondary panes, make sliders touch-friendly, keep observations sticky, and prevent panel overlap.
6. Code refactoring: migrate high-priority behavior to src/experiments/circular-motion/ with a dedicated engine, data file, and CSS where required.

#### N. Required New Files
Recommended new files:
- src/experiments/circular-motion/circular-motionSimulation.ts
- src/experiments/circular-motion/circular-motion.css
- src/experiments/circular-motion/circular-motionData.ts
- Shared support: ExperimentShell, FormulaBox, ObservationPanel, GraphPanel.

#### O. Priority
Critical. Depth tier: Needs depth pass. Missing layers: Replay checkpoints, Non-color cues.

#### P. Acceptance Criteria
- Formula and units are visible and correct.
- At least two numeric benchmark cases pass where the lab claims quantitative accuracy.
- Visual output changes in the same direction and proportion as the formula predicts.
- Graph axes, labels, and curve shape are correct.
- Beginner, normal, advanced, and teacher views are usable on desktop and mobile.
- The simulation has a distinct visual identity for Mechanics.

## 4. Common Problems Across Experiments

- Same layout repeated: most experiments use ExperimentDetailPage, shared tabs, shared cards, and one generic 2D visualization wrapper.
- Same animation style repeated: many labs share dark SVG grids, cyan highlights, generic arrows, and generic Three.js fallback scenes.
- Generic sliders without explanation: several labs use three numeric controls from the flagship/default model rather than apparatus-specific controls.
- Formulas shown but not always connected to visuals: formula metadata exists, but many experiments need explicit visual formula overlays and graph-shape checks.
- Units and assumptions are inconsistent in emphasis: some formulas use cm, some use SI, some qualitative scenes show no unit guardrail.
- Observation panel exists but needs stronger "what changed" summaries.
- Mobile support is improved but dense; tabs and side panels can still overwhelm weak learners.
- Graph and data table are not always experiment-specific.
- Teacher mode exists globally but needs experiment-specific board presets.
- Visual uniqueness is weaker for non-flagship experiments.

## 5. Recommended Standard Structure For Each Experiment

1. Title with class level and model status.
2. Short concept explanation in plain language.
3. Formula box with symbols, units, and assumptions.
4. Interactive simulation area with concept-specific visual language.
5. Controls panel grouped by cause, environment, and measurement.
6. Observation panel that states what changed and why.
7. What to notice section with one-variable-at-a-time guidance.
8. Real-world example tied to the formula.
9. Graph and data table where relevant.
10. Reset button and preset buttons.
11. Beginner mode with one control.
12. Advanced mode with derivation, edge cases, and uncertainty.
13. Teacher notes and board-friendly replay checkpoints.
14. Mobile layout with stacked controls, sticky observation, and large targets.

## 6. Experiment-Specific CSS And JS Recommendation

| Experiment | Needs Dedicated CSS? | Needs Dedicated JS/TS? | Needs Data File? | Shared Components? | Reason |
|---|---|---|---|---|---|
| Projectile Motion | No | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Unique, accuracy Good. |
| Wave Lab | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Medium, visual status Too Similar, accuracy Needs Minor Fix. |
| Single Slit Diffraction | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority High, visual status Partly Similar, accuracy Needs Minor Fix. |
| Buoyancy | Yes | No | No | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer | Priority Medium, visual status Unique, accuracy Good. |
| Chladni Plate | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority High, visual status Partly Similar, accuracy Needs Minor Fix. |
| Heat and Temperature | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Heat Transfer | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Heating Effect of Current | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Electromagnet | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Reflection by Plane Mirror | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Force and Pressure | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer | Priority Low, visual status Partly Similar, accuracy Good. |
| Fluid Pressure with Depth | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Sound Pitch and Loudness | No | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Low, visual status Unique, accuracy Good. |
| Static Electricity and Lightning | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Chemical Effects of Current | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Free Fall | No | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Unique, accuracy Good. |
| Mass and Weight | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Work and Power | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Echo and Speed of Sound | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Mirror Formula | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Partly Similar, accuracy Good. |
| Lens Formula | No | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Unique, accuracy Good. |
| Glass Slab Refraction | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Partly Similar, accuracy Good. |
| Prism Dispersion | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| Ohm's Law V-I Graph | No | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Unique, accuracy Good. |
| Series and Parallel Resistance | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Good. |
| Electric Power and Energy | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Magnetic Field Around Current | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Measurement, Error, and Significant Figures | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Vector Resolution | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Rotational Dynamics | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Satellite Orbit and Escape Speed | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Bernoulli Fluid Flow | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Gas Laws and Kinetic Theory | No | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Unique, accuracy Good. |
| Thermodynamic Processes | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Spring-Mass SHM | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Low, visual status Partly Similar, accuracy Good. |
| Electrostatic Field and Potential | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Capacitor Energy and Combination | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Kirchhoff Circuit Rules | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Lorentz Force on Moving Charge | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Faraday Induction | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| AC LCR Resonance | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Electromagnetic Spectrum | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Low, visual status Partly Similar, accuracy Good. |
| Young's Double Slit | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| Photoelectric Equation | No | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Unique, accuracy Good. |
| Nuclear Decay and Half-Life | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Good. |
| Semiconductor Diode and Rectifier | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Shadows and Eclipses | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| Multiple Reflection and Kaleidoscope | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Longitudinal Sound Wave | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Human Eye and Vision Defects | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Sources of Energy Comparator | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Meter Bridge | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Cell Internal Resistance | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| AC Generator | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| Transformer Lab | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, FieldLineLayer | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| Total Internal Reflection | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Microscope and Telescope | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, RayDiagram | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Polarization Lab | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, WaveCanvas | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| de Broglie Wavelength | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Bohr Atom Transitions | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Logic Gates | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Distance-Time Graph Builder | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| Balanced and Unbalanced Forces | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Good. |
| Universal Gravitation Field Map | No | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Unique, accuracy Needs Minor Fix. |
| Density Float-or-Sink Tank | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel, Particle/FlowLayer | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Calorimetry Mixing Lab | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Special Relativity Bridge | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Chaotic and Coupled Oscillators | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Advanced Quantum Operators | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Statistical Ensemble Lab | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Computational Physics Workflow | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Low, visual status Partly Similar, accuracy Needs Minor Fix. |
| Uniform Motion | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Critical, visual status Partly Similar, accuracy Needs Minor Fix. |
| Newton's Second Law | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Medium, visual status Unique, accuracy Good. |
| Friction | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Critical, visual status Too Similar, accuracy Needs Minor Fix. |
| Inclined Plane | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Critical, visual status Too Similar, accuracy Needs Minor Fix. |
| Elastic Collision | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Critical, visual status Too Similar, accuracy Needs Minor Fix. |
| Conservation of Energy | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Medium, visual status Unique, accuracy Needs Minor Fix. |
| Hooke's Law | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Critical, visual status Too Similar, accuracy Needs Minor Fix. |
| Simple Pendulum | Yes | No | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Medium, visual status Unique, accuracy Good. |
| Circular Motion | Yes | Yes | Yes | ExperimentShell, FormulaBox, ObservationPanel, GraphPanel | Priority Critical, visual status Partly Similar, accuracy Needs Minor Fix. |

## 7. Physics Accuracy Checklist

- [ ] Correct formula and stated assumptions.
- [ ] Correct SI units and conversion labels.
- [ ] Correct variable names and symbols.
- [ ] Correct graph axes and units.
- [ ] Correct graph shape.
- [ ] Realistic parameter limits.
- [ ] Correct animation direction.
- [ ] Correct proportional behavior.
- [ ] Correct boundary behavior.
- [ ] Proper reset state.
- [ ] Real-world example.
- [ ] Explanation of simplified model limits.
- [ ] Warning when visual is qualitative only.
- [ ] At least two benchmark cases for quantitative claims.
- [ ] No divide-by-zero or impossible state without explanation.

## 8. UI/UX Checklist

- [ ] Clear title.
- [ ] Readable formula.
- [ ] Visible controls.
- [ ] No clutter.
- [ ] Responsive layout.
- [ ] Mobile touch targets.
- [ ] Accessible labels.
- [ ] Keyboard support.
- [ ] Color contrast.
- [ ] Reset button.
- [ ] Fullscreen support.
- [ ] No overlapping panels.
- [ ] Stable canvas resize.
- [ ] Clear selected state.
- [ ] One primary action per learning step.

## 9. Educational Checklist

- [ ] Beginner explanation.
- [ ] Normal student explanation.
- [ ] Advanced explanation.
- [ ] Teacher note.
- [ ] What to observe.
- [ ] Try-it-yourself task.
- [ ] Common misconception.
- [ ] Real-world application.
- [ ] Learning outcome.
- [ ] Short quiz question.
- [ ] Prediction prompt.
- [ ] Conclusion sentence starter.
- [ ] Vocabulary simplifier.

## 10. Visual Uniqueness Guidelines

- Mechanics: motion trails, vectors, force arrows, free-body diagrams, energy bars, and graph cursors.
- Waves: wavefronts, interference colors, amplitude markers, phase indicators, detector probes, and synchronized wave graphs.
- Electricity: circuit glow, moving charge particles, voltage gradients, meters, switch states, and safe-current warnings.
- Magnetism: field lines, compass needles, flux-density visualization, polarity cues, and induced-current timing.
- Optics: rays, lenses, mirrors, focal points, normals, beam colors, screens, and sign-convention overlays.
- Thermodynamics: particle motion, heat maps, temperature gradients, reservoirs, and energy packets.
- Fluids: streamlines, pressure probes, density coloring, submerged volume, buoyancy arrows, and depth rulers.
- Modern physics: probability clouds, photons, spectra, quantized transitions, threshold markers, and explicit model-limit warnings.
- Astronomy: orbit paths, parallax baselines, scale bars, star glow, dark backgrounds, and time-speed controls.

## 11. Priority Roadmap

### Phase A: Critical physics accuracy fixes
- Experiments included: Uniform Motion; Friction; Inclined Plane; Elastic Collision; Hooke's Law; Circular Motion.
- Tasks: add benchmark cases, valid ranges, assumptions, solver/visual separation, and formula-to-graph checks.
- Expected outcome: no quantitative claim without executable validation.
- Risk level: High.

### Phase B: Experiment-specific JS/CSS separation
- Experiments included: all High/Critical and every Generic Placeholder.
- Tasks: create src/experiments/<id>/ folders, domain engines, data files, CSS files, and shared shell contracts.
- Expected outcome: experiments stop looking interchangeable.
- Risk level: Medium.

### Phase C: UI/UX and mobile improvements
- Experiments included: all Poor/Not Mobile Friendly profiles.
- Tasks: responsive panes, sticky observation, clear launch flow, larger controls, fewer first-screen panels.
- Expected outcome: weak and normal students can use labs without teacher rescue.
- Risk level: Medium.

### Phase D: Educational content additions
- Experiments included: all profiles with learning score below 70.
- Tasks: what-to-observe, try-this, misconception, teacher note, quiz question, real-world example.
- Expected outcome: simulation becomes a lesson, not just a moving picture.
- Risk level: Low.

### Phase E: Cinematic visual upgrades
- Experiments included: optics, waves, electricity, magnetism, fluid, thermal, and modern physics first.
- Tasks: field lines, wavefronts, heat maps, particle flow, energy bars, camera focus, replay checkpoints.
- Expected outcome: PhET-level concept identity and stronger engagement.
- Risk level: Medium.

### Phase F: Teacher mode and quiz integration
- Experiments included: every class-level experiment.
- Tasks: board presets, prediction cards, step checkpoints, short classroom quiz, report prompts.
- Expected outcome: ready classroom deployment.
- Risk level: Low.

### Phase G: Final QA
- Experiments included: all 80.
- Tasks: build, physics tests, mobile viewports, accessibility pass, formula verification, visual uniqueness review.
- Expected outcome: stable release candidate.
- Risk level: Medium.

## 12. Final Recommendation

- Fix first: Circular Motion; Elastic Collision; Friction; Hooke's Law; Inclined Plane; Uniform Motion; Chladni Plate; Single Slit Diffraction; Conservation of Energy; Newton's Second Law.
- Redesign fully: Generic Placeholder and Too Similar experiments, especially those with missing validation or domain-specific visuals.
- Minor UI changes only: experiments with Good accuracy, Unique visual status, and Low/Medium priority.
- Shared components to create: ExperimentShell, ControlGroup, FormulaAssumptionBox, ObservationPanel, GraphPanel, DataTable, TeacherReplay, MisconceptionCard, DomainVisualLayer, MobileBottomSheet.
- Replace current shared visualization style gradually. Keep the common shell, but move domain scenes into dedicated engines so mechanics, optics, waves, electricity, magnetism, fluids, thermal, modern physics, and astronomy do not look alike.
- Proposed folder structure: see PHYSICS_EXPERIMENTS_REFACTORING_PLAN.md.

## Files Inspected

- src/lib/experiments.ts
- src/pages/ExperimentDetailPage.tsx
- src/pages/ExperimentsPage.tsx
- src/pages/SimulationDepthPage.tsx
- src/components/ProjectileExperiment.tsx
- src/components/GuidedVisualization.tsx
- src/components/Experiment3DAnimation.tsx
- src/lib/flagshipLabModels.ts
- src/lib/accuracyValidation.ts
- src/lib/simulationQuality.ts
- src/lib/simulationDepth.ts
- src/lib/accessibilityAudit.ts
- src/engine/matterEngine.ts
- src/engine/waveEngine.ts
- src/engine/opticsEngine.ts
- src/engine/doublePendulumSolver.ts
- src/engine/measurementAdapters.ts
- src/App.tsx
- src/styles.css
- scripts/runPhysicsTests.mjs

## Validation Commands For This Audit

- `npm run typecheck`: not available. The repository does not define a `typecheck` script.
- `npm run test`: not available. The repository does not define a generic `test` script.
- `npm run build`: passed. This runs `tsc -b && vite build`; Vite reports a large chunk warning for the main bundle, but the build completes successfully.
- `npm run test:physics`: passed. Result: 165/165 physics validation tests passed.
- Report integrity check: passed. The audit file contains 80 experiment detail sections, matching the experiment inventory exported from `src/lib/experiments.ts`.
- Browser route smoke check: passed. Verified `/simulation-depth`, `/experiments`, `/experiments/projectile-motion`, and `/trust` load in the in-app browser with expected page headings and no captured console errors.
