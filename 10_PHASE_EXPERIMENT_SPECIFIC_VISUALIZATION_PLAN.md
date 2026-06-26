# 10 Phase Experiment-Specific Visualization Completion Plan

Goal: make every experiment page feel like its own physics lab, not a reused generic animation. Each phase includes student usefulness, professor/science checks, and UI design work.

Current baseline from audit:

| Metric | Count |
|---|---:|
| Total experiment routes | 80 |
| Experiments needing at least one visualization change | 53 |
| Experiments needing 2D work | 38 |
| Experiments needing 3D work | 38 |
| Experiments already acceptable for first-pass specificity | 27 |

## Phase Strategy

| Phase | Focus | Main Outcome | Validation Gate |
|---:|---|---|---|
| 1 | Visualization contract and shared engine cleanup | Define how each experiment declares 2D scene, 3D scene, outputs, graph metadata, assumptions, and fullscreen behavior. | Every route has an explicit visualization status: custom, specific shared engine, or pending. |
| 2 | Core mechanics labs | Replace generic mechanics visuals with experiment-specific motion, force, collision, spring, and graph labs. | Mechanics pages show the actual apparatus within first viewport. |
| 3 | Fluids and pressure labs | Make pressure, buoyancy, density, and Bernoulli scenes physically recognizable. | Sliders visibly affect depth, area, flow, buoyant force, or pressure. |
| 4 | Thermal and energy transfer labs | Replace generic thermal panels with thermometer, particle, conduction, gas, and calorimetry models. | Heat, temperature, equilibrium, and P-V behavior are visually distinct. |
| 5 | Electricity and circuit labs | Build experiment-specific circuit boards, meters, resistor networks, diode, bridge, cell, and Joule heating visuals. | Circuit topology and measured quantity are visible without scrolling. |
| 6 | Magnetism, induction, and AC labs | Complete 3D field/force/coil/phasor scenes for magnetism and AC topics. | Direction, field, flux, and phase relationships are visually inspectable. |
| 7 | Optics labs | Complete missing 3D optics scenes and replace generic mirror/eclipse/reflection visuals. | Rays, screens, mirrors, media boundaries, and image formation are explicit. |
| 8 | Waves, sound, and spectrum labs | Complete wave tank, Chladni, echo, pitch, polarization, and spectrum scenes. | Frequency, amplitude, wavelength, nodes, and interference are visible. |
| 9 | Modern physics, electronics, measurement, and advanced labs | Build specific quantum, nuclear, electronics, uncertainty, statistical, and computational visuals. | Abstract concepts get visual scaffolds without pretending to be validated research simulations. |
| 10 | Classroom QA, trust UX, and release hardening | Browser screenshot QA, teacher/student flow checks, accessibility, performance, and final science review. | `npm run test:physics`, `npm run build`, and visual route smoke tests pass. |

## Experiment-by-Experiment Plan

| # | Experiment | Phase | Current State | Student Need | Professor/Science Need | UI Designer Need | Deliverable |
|---:|---|---:|---|---|---|---|---|
| 1 | `projectile-motion` Projectile Motion | 10 | Specific 2D and 3D exist. | Clearly see launch angle, velocity components, trajectory, range, and peak. | Confirm kinematics equations, units, and optional air resistance limitation. | Keep controls visible beside trajectory; ensure graph labels remain readable. | QA and polish existing custom projectile lab. |
| 2 | `wave-lab` Wave Lab | 8 | Generic 2D and generic 3D. | See an actual string or ripple tank with wavelength, amplitude, and frequency. | Confirm wave speed relation `v = f lambda` and boundary assumptions. | Replace abstract fallback with wave-specific controls and live labels. | Custom 2D wave tank/string plus 3D wave surface. |
| 3 | `single-slit-diffraction` Single Slit Diffraction | 10 | Specific 2D and 3D exist. | See slit width changing central maximum and fringe spread. | Verify small-angle diffraction formula and invalid range handling. | Keep screen/fringe contrast high in dark panel. | QA and polish existing diffraction lab. |
| 4 | `buoyancy` Buoyancy | 10 | Specific 2D and 3D exist. | See submerged volume, displaced fluid, and upthrust. | Verify Archimedes principle and density comparisons. | Make waterline and object state obvious. | QA and polish existing buoyancy lab. |
| 5 | `chladni-plate` Chladni Plate | 8 | Generic 2D and generic 3D. | See sand moving into nodal lines for different modes. | Map frequency/mode numbers honestly; avoid implying exact plate eigenmode validation unless implemented. | Create striking plate view with mode selector and labels. | Custom Chladni nodal-pattern visualization. |
| 6 | `heat-and-temperature` Heat and Temperature | 4 | Generic 2D, specific 3D. | Understand heat versus temperature using thermometer and particle motion. | Check Celsius/Kelvin/Fahrenheit conversions and heat capacity units. | Show scale conversion and particle speed in one compact panel. | Custom 2D thermometer/particle heating scene. |
| 7 | `heat-transfer` Heat Transfer | 4 | Generic 2D, specific 3D. | Compare conduction, convection, and radiation visually. | Validate conduction equation and distinguish heat rate from heat energy. | Use side-by-side transfer modes with clear arrows. | Custom 2D heat-transfer bench. |
| 8 | `heating-effect-current` Heating Effect of Current | 5 | Generic 2D, specific 3D. | See resistor/wire heat increase with current. | Verify Joule heating relation and squared-current effect. | Add glow/temperature meter without cluttering circuit. | Custom 2D Joule heating circuit. |
| 9 | `electromagnet` Electromagnet | 10 | Specific 2D and 3D exist. | See coil, core, current direction, and field strength. | Confirm field trend with turns/current/core assumptions. | Make polarity and field loops legible. | QA and polish existing electromagnet lab. |
| 10 | `reflection-plane-mirror` Reflection by Plane Mirror | 7 | Specific 2D, generic 3D. | See object-image symmetry behind mirror. | Verify equal angle and equal distance rules. | Add clean 3D mirror plane with object/image markers. | Specific 3D plane mirror scene. |
| 11 | `force-and-pressure` Force and Pressure | 3 | Generic 2D, specific 3D. | See same force over different areas changing pressure. | Validate `P = F / A`, units, and area edge cases. | Add press/piston contact-area visualization. | Custom 2D force-over-area lab. |
| 12 | `fluid-pressure` Fluid Pressure with Depth | 3 | Generic 2D, specific 3D. | See pressure increasing with depth in a tank. | Verify `P = rho g h` and gauge versus absolute pressure. | Add depth scale, probe, and pressure gradient. | Custom 2D fluid-depth lab. |
| 13 | `sound-pitch-loudness` Sound Pitch and Loudness | 8 | Specific 2D, generic 3D. | Connect pitch to frequency and loudness to amplitude. | Check decibel/amplitude language and avoid oversimplified hearing claims. | Add vibrating source with waveform and audio-safe labels. | Specific 3D sound source scene. |
| 14 | `static-electricity` Static Electricity and Lightning | 6 | Specific 2D, generic 3D. | See charge transfer, attraction/repulsion, and discharge. | Confirm qualitative electrostatics and limitation of lightning model. | Add 3D charged bodies and field/spark cue. | Specific 3D static electricity scene. |
| 15 | `chemical-effects-current` Chemical Effects of Current | 5 | Generic 2D and generic 3D. | See electrolysis cell, electrodes, ions, bubbles, and deposit. | Verify Faraday-law language if quantitative output is shown. | Build beaker/electrode visual with flow direction labels. | Custom 2D and 3D electrolysis lab. |
| 16 | `free-fall` Free Fall | 2 | Generic 2D and generic 3D. | See drop height, timer gates, velocity increase, and `g`. | Verify constant acceleration model and air resistance assumption. | Use vertical drop tower that fits first viewport. | Custom 2D and 3D free-fall lab. |
| 17 | `mass-and-weight` Mass and Weight | 2 | Generic 2D and generic 3D. | Compare balance mass and spring-scale weight across planets. | Verify mass invariance, weight `W = mg`, and local gravity values. | Use planet selector and two instruments. | Custom 2D and 3D mass-weight lab. |
| 18 | `work-power` Work and Power | 2 | Specific 2D, generic 3D. | See force through distance and power as rate of work. | Verify work sign, units, and power calculation. | Add 3D ramp/lift with force arrow and timer. | Specific 3D work-power scene. |
| 19 | `echo-speed-sound` Echo and Speed of Sound | 8 | Generic 2D and generic 3D. | See pulse travel to wall/cliff and return. | Verify factor-of-two distance relation and medium temperature assumption. | Add timeline with outgoing/return pulse. | Custom 2D and 3D echo lab. |
| 20 | `mirror-formula` Mirror Formula | 10 | Specific 2D and 3D exist. | See object, mirror, focus, image, and ray construction. | Verify sign convention and real/virtual image cases. | Improve ray readability and image labels. | QA and polish existing mirror formula lab. |
| 21 | `lens-formula` Lens Formula | 10 | Specific 2D and 3D exist. | See focal length, object distance, image distance, and ray paths. | Verify sign convention and invalid object positions. | Keep optical bench scaled and uncluttered. | QA and polish existing lens formula lab. |
| 22 | `glass-slab-refraction` Glass Slab Refraction | 7 | Specific 2D, generic 3D. | See incident/emergent rays and lateral shift. | Verify Snell's law and slab parallel-face behavior. | Add transparent slab with thickness and shift markers. | Specific 3D slab refraction scene. |
| 23 | `prism-dispersion` Prism Dispersion | 10 | Specific 2D and 3D exist. | See white light split into colors. | Verify refractive-index assumptions and dispersion limits. | Fix fullscreen and keep 2D/3D panels readable. | QA and polish existing prism lab. |
| 24 | `ohms-law` Ohm's Law V-I Graph | 5 | Generic 2D, specific 3D. | See voltage/current circuit and live straight-line V-I graph. | Verify resistance slope, units, and non-ohmic limitation. | Add circuit board plus graph in one pane. | Custom 2D Ohm's law circuit graph. |
| 25 | `series-parallel-resistance` Series and Parallel Resistance | 5 | Generic 2D, specific 3D. | See current split and equivalent resistance change. | Verify series/parallel formulas and short/open edge cases. | Add topology toggle with branch current labels. | Custom 2D resistor-network lab. |
| 26 | `electric-power` Electric Power and Energy | 5 | Generic 2D, specific 3D. | See power as voltage-current product and energy accumulation. | Verify `P = VI`, `E = Pt`, and unit conversions. | Add appliance/load meter and energy counter. | Custom 2D electric power lab. |
| 27 | `magnetic-field-current` Magnetic Field Around Current | 10 | Specific 2D and 3D exist. | See circular field around current. | Verify right-hand rule and qualitative field strength. | Make current direction and field arrows clear. | QA and polish existing magnetic-field lab. |
| 28 | `measurement-errors` Measurement, Error, and Significant Figures | 9 | Generic 2D and generic 3D. | Practice reading instruments, repeated readings, mean, and uncertainty. | Verify significant figures, least count, and uncertainty propagation. | Add ruler/vernier/screw gauge style instrument view. | Custom 2D and 3D measurement lab. |
| 29 | `vector-resolution` Vector Resolution | 2 | Specific 2D, generic 3D. | See vector components along axes. | Verify trigonometric component signs and units. | Add 3D axes only if useful; keep 2D primary. | Specific 3D vector decomposition scene. |
| 30 | `rotational-dynamics` Rotational Dynamics | 2 | Generic 2D and generic 3D. | See torque, angular acceleration, and moment of inertia. | Verify `tau = I alpha` and inertia assumptions. | Add rotating disk/pulley with torque arrow. | Custom 2D and 3D rotational dynamics lab. |
| 31 | `satellite-orbit` Satellite Orbit and Escape Speed | 2 | Generic 2D and generic 3D. | See orbit, velocity vector, gravity vector, and escape threshold. | Verify orbital speed, escape speed, and scale disclaimers. | Add orbit map with velocity controls. | Custom 2D and 3D orbit lab. |
| 32 | `bernoulli-fluid-flow` Bernoulli Fluid Flow | 3 | Specific 2D, generic 3D. | See venturi tube, speed increase, and pressure drop. | Verify Bernoulli assumptions: steady, incompressible, non-viscous. | Add 3D tube with pressure taps. | Specific 3D Bernoulli scene. |
| 33 | `gas-laws` Gas Laws and Kinetic Theory | 4 | Generic 2D, specific 3D. | See piston, particle motion, and pressure-volume-temperature relation. | Verify ideal gas assumptions and absolute temperature use. | Add P-V-T dashboard tied to piston. | Custom 2D gas-laws lab. |
| 34 | `thermodynamic-process` Thermodynamic Processes | 4 | Generic 2D and generic 3D. | See process path on P-V diagram plus piston motion. | Verify isothermal/adiabatic/isobaric/isochoric equations and assumptions. | Use split piston + P-V graph layout. | Custom 2D and 3D thermodynamic process lab. |
| 35 | `shm-spring` Spring-Mass SHM | 2 | Specific 2D, generic 3D. | See oscillation, equilibrium, amplitude, and phase. | Verify SHM assumptions and damping handling. | Add 3D spring-mass oscillator. | Specific 3D SHM spring scene. |
| 36 | `electrostatic-field-potential` Electrostatic Field and Potential | 6 | Specific 2D, generic 3D. | See field lines and potential map. | Verify sign, superposition, and potential units. | Add 3D potential surface with charge controls. | Specific 3D field-potential scene. |
| 37 | `capacitor-lab` Capacitor Energy and Combination | 10 | Specific 2D and 3D exist. | See plate charge, electric field, stored energy, and combinations. | Verify capacitance formulas and energy relation. | Keep plate spacing and dielectric labels clear. | QA and polish existing capacitor lab. |
| 38 | `kirchhoff-circuit` Kirchhoff Circuit Rules | 6 | Specific 2D, generic 3D. | See loops, junctions, currents, and voltage drops. | Verify KCL/KVL signs and matrix solution. | Add 3D breadboard/loop current scene. | Specific 3D Kirchhoff scene. |
| 39 | `lorentz-force` Lorentz Force on Moving Charge | 6 | Specific 2D, generic 3D. | See charge velocity, magnetic field, and force direction. | Verify cross product direction and charge sign. | Add 3D field volume with force vector. | Specific 3D Lorentz force scene. |
| 40 | `emi-faraday` Faraday Induction | 10 | Specific 2D and 3D exist. | See changing flux inducing emf. | Verify Faraday/Lenz sign and qualitative assumptions. | Keep coil, magnet, and meter in same view. | QA and polish existing EMI lab. |
| 41 | `ac-lcr-resonance` AC LCR Resonance | 6 | Specific 2D, generic 3D. | See resonance peak and phase behavior. | Verify impedance, resonance frequency, and damping assumptions. | Add 3D circuit/phasor/resonance surface. | Specific 3D LCR resonance scene. |
| 42 | `em-spectrum` Electromagnetic Spectrum | 8 | Specific 2D, generic 3D. | See wavelength/frequency regions from radio to gamma. | Verify inverse relation and domain boundaries. | Add 3D spectrum wall or slider scale. | Specific 3D EM spectrum scene. |
| 43 | `young-double-slit` Young's Double Slit | 10 | Specific 2D and 3D exist. | See interference fringes change with slit separation and wavelength. | Verify fringe formula and small-angle assumption. | Keep slit-screen geometry obvious. | QA and polish existing YDSE lab. |
| 44 | `photoelectric-equation` Photoelectric Equation | 10 | Specific 2D and 3D exist. | See threshold frequency and electron emission. | Verify Einstein equation and stopping potential relation. | Keep photon/electron energy labels readable. | QA and polish existing photoelectric lab. |
| 45 | `nuclear-decay` Nuclear Decay and Half-Life | 9 | Generic 2D and generic 3D. | See random nuclei decay and population half-life curve. | Verify exponential decay, stochastic variation, and half-life definition. | Add nuclei grid plus curve and uncertainty note. | Custom 2D and 3D nuclear decay lab. |
| 46 | `semiconductor-diode` Semiconductor Diode and Rectifier | 9 | Generic 2D and generic 3D. | See PN junction, forward/reverse bias, rectifier output. | Verify diode equation simplification and threshold assumptions. | Add circuit + I-V + ripple layout. | Custom 2D and 3D diode lab. |
| 47 | `shadows-eclipses` Shadows and Eclipses | 7 | Generic 2D and generic 3D. | See umbra, penumbra, solar/lunar eclipse alignment. | Verify geometry and scale simplification disclosure. | Add Sun-object-screen/orbit alignment view. | Custom 2D and 3D shadows/eclipses lab. |
| 48 | `multiple-reflection` Multiple Reflection and Kaleidoscope | 7 | Generic 2D and generic 3D. | See multiple images change with mirror angle. | Verify image count relation and geometry limits. | Add two-mirror ray and kaleidoscope preview. | Custom 2D and 3D multiple-reflection lab. |
| 49 | `sound-wave-anatomy` Longitudinal Sound Wave | 10 | Specific 2D and 3D exist. | See compressions, rarefactions, particle oscillation, and wave travel. | Verify longitudinal wave language and speed assumptions. | Improve contrast between particle motion and wave motion. | QA and polish existing sound anatomy lab. |
| 50 | `human-eye-defects` Human Eye and Vision Defects | 10 | Specific 2D and 3D exist. | See myopia/hyperopia and corrective lens effect. | Verify optical defect descriptions and focal correction. | Keep retina/focus point easy to read. | QA and polish existing eye defects lab. |
| 51 | `sources-of-energy` Sources of Energy Comparator | 9 | Generic 2D and generic 3D. | Compare output, reliability, emissions, and limitations. | Verify data is illustrative unless sourced; show trust level. | Build comparison dashboard, not a generic physics object. | Custom 2D and 3D energy comparator. |
| 52 | `meter-bridge` Meter Bridge | 5 | Generic 2D and generic 3D. | See bridge wire, jockey, galvanometer null point, and unknown resistance. | Verify balance equation and contact resistance limitations. | Add top-down meter bridge apparatus. | Custom 2D and 3D meter bridge lab. |
| 53 | `internal-resistance-cell` Cell Internal Resistance | 5 | Generic 2D and generic 3D. | See terminal voltage drop with current/load. | Verify `V = E - Ir` and graph method. | Add cell, variable resistor, voltmeter, ammeter. | Custom 2D and 3D internal resistance lab. |
| 54 | `ac-generator` AC Generator | 10 | Specific 2D and 3D exist. | See rotating coil and AC waveform. | Verify flux, angular speed, and sinusoidal emf assumptions. | Keep waveform synchronized with coil motion. | QA and polish existing AC generator lab. |
| 55 | `transformer-lab` Transformer Lab | 10 | Specific 2D and 3D exist. | See primary/secondary coils and turns ratio. | Verify ideal transformer limits and loss assumptions. | Show flux core and voltage bars clearly. | QA and polish existing transformer lab. |
| 56 | `total-internal-reflection` Total Internal Reflection | 10 | Specific 2D and 3D exist. | See critical angle and reflected/transmitted ray. | Verify Snell's law and denser-to-rarer condition. | Make critical angle transition obvious. | QA and polish existing TIR lab. |
| 57 | `optical-instruments` Microscope and Telescope | 7 | Specific 2D, generic 3D. | See objective/eyepiece image formation. | Verify angular magnification assumptions. | Add 3D optical tube with ray bundles. | Specific 3D optical instruments scene. |
| 58 | `polarization-lab` Polarization Lab | 8 | Specific 2D, generic 3D. | See polarizer/analyzer angle reducing intensity. | Verify Malus law and unpolarized-light assumptions. | Add 3D polarizer planes and intensity meter. | Specific 3D polarization scene. |
| 59 | `de-broglie-wavelength` de Broglie Wavelength | 9 | Generic 2D, specific 3D. | See particle momentum linked to matter wavelength. | Verify non-relativistic formula and voltage relation. | Add electron beam and wavelength scale in 2D. | Custom 2D de Broglie lab. |
| 60 | `bohr-model` Bohr Atom Transitions | 9 | Generic 2D, specific 3D. | See energy levels, jumps, and spectral lines. | Verify hydrogen-only limitation and energy-level formula. | Add level ladder with photon emission/absorption. | Custom 2D Bohr transition lab. |
| 61 | `logic-gates` Logic Gates | 9 | Generic 2D, specific 3D. | See inputs, gate symbol, truth table, and output. | Verify Boolean logic and gate selection. | Add compact gate-board with truth table. | Custom 2D logic gate lab. |
| 62 | `distance-time-graph` Distance-Time Graph Builder | 2 | Generic 2D, specific 3D. | Build a distance-time graph from motion. | Verify slope-speed relation and units. | Add synchronized cart track and graph builder. | Custom 2D distance-time graph lab. |
| 63 | `balanced-unbalanced-forces` Balanced and Unbalanced Forces | 10 | Specific 2D and 3D exist. | See net force appear only when forces are unbalanced. | Verify force addition and acceleration link. | Keep opposing arrows and result readable. | QA and polish existing balanced-force lab. |
| 64 | `universal-gravitation` Universal Gravitation Field Map | 2 | Generic 2D, specific 3D. | See inverse-square gravity field and orbit tendency. | Verify `F = GmM/r^2` and scaling limitations. | Add 2D field map with force vector. | Custom 2D gravitation field map. |
| 65 | `density-float-sink` Density Float-or-Sink Tank | 10 | Specific 2D and 3D exist. | See density ratio decide float, neutral, or sink. | Verify density and displaced-volume relation. | Keep object state labels clear. | QA and polish existing density tank lab. |
| 66 | `calorimetry-mixing` Calorimetry Mixing Lab | 4 | Generic 2D, specific 3D. | See hot and cold samples reach final temperature. | Verify heat balance and no-loss assumption. | Add beaker/cup mixer and final thermometer. | Custom 2D calorimetry lab. |
| 67 | `special-relativity-bridge` Special Relativity Bridge | 10 | Specific 2D and 3D exist. | See time dilation and length contraction qualitatively. | Verify gamma formula and conceptual limits. | Keep abstract spacetime view understandable. | QA and polish existing relativity lab. |
| 68 | `chaotic-coupled-oscillators` Chaotic and Coupled Oscillators | 10 | Specific 2D and 3D exist. | See coupled pendula, phase trail, and sensitivity. | Verify it is labeled as qualitative/nonlinear visualization unless numerically validated. | Keep phase portrait and oscillator view visible together. | QA and polish existing coupled oscillator lab. |
| 69 | `advanced-quantum-operators` Advanced Quantum Operators | 9 | Generic 2D and generic 3D. | See state vector, operator action, eigenvalue, and measurement expectation. | Verify linear algebra, Hermitian operator, and normalization assumptions. | Build matrix/state visual without overwhelming students. | Custom 2D and 3D quantum operator lab. |
| 70 | `statistical-ensemble-lab` Statistical Ensemble Lab | 9 | Generic 2D and generic 3D. | See particles evolve into a distribution/histogram. | Verify ensemble averages, distribution assumptions, and sampling limits. | Add particle cloud plus histogram panel. | Custom 2D and 3D statistical ensemble lab. |
| 71 | `computational-physics-workflow` Computational Physics Workflow | 9 | Generic 2D and generic 3D. | See numerical method, step size, error, and convergence. | Verify solver method and error estimate disclosure. | Build workflow diagram plus convergence plot. | Custom 2D and 3D computational physics lab. |
| 72 | `uniform-motion` Uniform Motion | 2 | Generic 2D and generic 3D. | See constant speed and linear position-time graph. | Verify `x = x0 + vt`, units, and sign convention. | Add ticker tape/cart track with graph. | Custom 2D and 3D uniform motion lab. |
| 73 | `newton-s-second-law` Newton's Second Law | 10 | Specific 2D and 3D exist. | See force, mass, and acceleration relationship. | Verify `F = ma` and net-force wording. | Keep force vector and acceleration response clear. | QA and polish existing Newton's second law lab. |
| 74 | `friction` Friction | 10 | Specific 2D and 3D exist. | See static/kinetic friction resisting motion. | Verify threshold behavior and coefficient assumptions. | Make friction vector and surface type obvious. | QA and polish existing friction lab. |
| 75 | `inclined-plane` Inclined Plane | 10 | Specific 2D and 3D exist. | See gravity components along and normal to plane. | Verify component equations and friction assumptions. | Keep angle, normal, and parallel components legible. | QA and polish existing inclined plane lab. |
| 76 | `elastic-collision` Elastic Collision | 2 | Generic 2D and generic 3D. | See before/after velocity and momentum conservation. | Verify elastic collision formulas and energy conservation. | Add two-cart collision track with momentum/energy bars. | Custom 2D and 3D elastic collision lab. |
| 77 | `conservation-of-energy` Conservation of Energy | 10 | Specific 2D and 3D exist. | See potential energy convert to kinetic energy. | Verify conservation/loss assumptions and units. | Keep energy bars synchronized with motion. | QA and polish existing energy lab. |
| 78 | `hooke-s-law` Hooke's Law | 2 | Generic 2D and generic 3D. | See spring extension proportional to force. | Verify `F = kx`, sign convention, and elastic-limit warning. | Add spring rig and force-extension graph. | Custom 2D and 3D Hooke's law lab. |
| 79 | `simple-pendulum` Simple Pendulum | 10 | Specific 2D and 3D exist. | See length affect period and small-angle behavior. | Verify small-angle assumption and damping setting. | Keep period readout and swing view compact. | QA and polish existing pendulum lab. |
| 80 | `circular-motion` Circular Motion | 10 | Specific 2D and 3D exist. | See velocity tangent and centripetal force inward. | Verify centripetal relation and angular/radial units. | Keep orbit, arrows, and readouts uncluttered. | QA and polish existing circular motion lab. |

## Phase Completion Gates

| Phase | Must Be True Before Moving On |
|---:|---|
| 1 | No experiment silently falls into a generic visual without an explicit pending marker. |
| 2 | Mechanics pages use apparatus-specific visuals, not generic carts except where the cart is the actual apparatus. |
| 3 | Fluids pages show fluid geometry: tank, probe, venturi, displaced volume, or contact area. |
| 4 | Thermal pages distinguish heat, temperature, gas state, transfer rate, and equilibrium. |
| 5 | Electricity pages show actual circuit topology and meters needed for the experiment. |
| 6 | Field/AC pages show directions, phase, field lines/surfaces, and induced response. |
| 7 | Optics pages show actual rays, media boundaries, screens, mirrors, lenses, or instruments. |
| 8 | Waves pages show frequency, wavelength, amplitude, nodes/fringes, and medium motion where relevant. |
| 9 | Abstract labs include trust labels and do not oversell illustrative models as validated simulations. |
| 10 | All modified routes pass browser screenshot QA, fullscreen QA, keyboard/accessibility checks, `npm run test:physics`, and `npm run build`. |

## Recommended Implementation Order Inside Each Phase

| Step | Action |
|---:|---|
| 1 | Add or update experiment-specific scene mapping in `GuidedVisualization.tsx`. |
| 2 | Add or update 3D config and geometry in `Experiment3DAnimation.tsx`. |
| 3 | Ensure first viewport shows controls plus 2D/3D visualization without forced scrolling on common laptop screens. |
| 4 | Add graph/measurement labels that match calculator units. |
| 5 | Add limitations/trust copy only where needed, especially for qualitative or advanced simulations. |
| 6 | Browser-check the route in normal and fullscreen mode. |
| 7 | Run `npm run test:physics` and `npm run build` at phase end. |
