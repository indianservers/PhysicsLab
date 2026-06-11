# PHASE 2 - PHYSICS ACCURACY, FORMULA VALIDATION, UNITS & MODEL TRUST AUDIT

Audit date: 2026-06-11  
Scope: React/Vite Physics Simulator source under `src/`, with emphasis on formulas, units, graph/export data, numerical engines, and classroom/model trust.  
Phase constraint: Audit only. No implementation code was modified as part of this phase.

---

## A. Executive Summary

The simulator has a broad and ambitious physics surface. Many individual textbook formulas are recognizable and often correct in isolation, especially in mechanics, school-level electricity, geometrical optics, and selected modern physics calculators. However, the product is not yet scientifically trustworthy as a simulation platform because the live model, graph data, units, visual overlays, and exported measurements are not consistently derived from validated physical state.

The most important distinction is this:

- The application is often a formula demonstrator or visual metaphor.
- It sometimes presents itself as a measured simulation.
- Those two modes are not clearly separated in UI, data export, graph labels, or assumptions.

This creates a high risk that students or teachers will believe placeholder values, visual coordinates, or arbitrary scaled quantities are physically meaningful.

### Scorecard

| Category | Score / 100 | Strict assessment |
|---|---:|---|
| Formula correctness | 78 | Many displayed equations are textbook-correct, but assumptions, sign conventions, domains, and special cases are frequently missing. |
| Unit correctness | 52 | Units are partially present but not enforced end-to-end; pixel/model/unit conversions are inconsistent. |
| Graph correctness | 34 | The graph/export layer can plot placeholder quantities and uses incomplete unit mapping. |
| Simulation validity | 45 | Some engines are plausible demos; many labs are calculators or metaphors rather than validated simulations. |
| Numerical stability | 56 | Basic clamping exists, but there is little validation against invariants, singular systems, or conservation laws. |
| Classroom trustworthiness | 60 | Useful with teacher guidance if clearly labeled as illustrative and formula-focused. |
| Undergraduate trustworthiness | 36 | Not reliable for quantitative lab work without major validation, unit, and model disclosures. |
| Research trustworthiness | 18 | Not research-grade; missing verification, reproducibility, uncertainty, and physically rigorous solvers. |

### Overall Verdict

The simulator is not scientifically trustworthy today as a full quantitative physics simulator. It is partly trustworthy as an educational formula-and-visualization prototype for selected school concepts, provided every lab clearly marks whether it is a validated calculation, a simplified model, or a visual metaphor.

---

## B. Critical Scientific Accuracy Risks

| Risk | Severity | Evidence | Impact |
|---|---:|---|---|
| Placeholder graph quantities are labeled as physics | Critical | `MatterSimulationEngine.snapshot()` synthesizes pressure, voltage, current, intensity, wavelength, and frequency from arbitrary object properties. | Graphs and exports may teach false relationships. |
| Pixel coordinates are mixed with physical units | Critical | Matter uses `SCALE = 50`; double pendulum uses `PIXELS_PER_METER = 100`; object positions and sidebar properties can appear as physical values. | Distances, velocities, and energies can be dimensionally inconsistent. |
| Graph units are incomplete | High | `BottomPanel.unitForGraphKey()` omits pressure, volume, temperature, intensity, wavelength, acceleration, and several experiment-specific quantities. | Correct-looking graphs may have wrong or missing units. |
| Observation rows use generic measured/expected mapping | High | Auto rows compare `point.y` against `point.x` with unit `m`. | Exported lab data can be meaningless outside position graphs. |
| Calculators are embedded in page logic | High | `calculateStarterLab()` in `ExperimentDetailPage.tsx` contains many experiment calculators and assumptions. | Hard to test formulas independently and easy to ship regressions. |
| Visual metaphors are not labeled consistently | High | Electromagnet, chemical effects, thermodynamic process factor, quantum operators, spectrum, and current visualizations use relative or illustrative values. | Users may interpret qualitative demos as quantitative models. |
| Circuit solver can silently degrade | High | `gaussianSolve()` continues through near-singular pivots and can return zeros. | Invalid circuits can produce plausible-looking but wrong results. |
| Sign conventions are not explicit | Medium | Mirror/lens formulas, collision direction, charge force direction, and vector conventions need stronger disclosure. | Correct formulas can be used incorrectly by learners. |
| Numerical invariants are not validated | Medium | No conservation tests for energy, momentum, charge, mass, or optical path assumptions. | Simulations may drift without detection. |
| Assumptions are shown as prose, not enforceable metadata | Medium | Formula domains and limitations are not attached to calculations in a typed, testable way. | Trust depends on UI text rather than model guarantees. |

---

## C. Formula Accuracy Matrix

This matrix covers every active formula family found in the formula bank, experiment calculators, and major simulation components. Repeated textbook variants are grouped by domain.

| Domain / formula family | Representative formulas | Accuracy status | Required correction or disclosure |
|---|---|---|---|
| Uniform motion | `x = x0 + vt`, `s = s0 + vt` | Correct | State constant velocity, 1D motion, no acceleration. |
| Constant acceleration | `v = u + at`, `s = ut + 1/2at^2`, `v^2 = u^2 + 2as` | Correct | State constant acceleration and sign convention. |
| Free fall | `h = ut + 1/2gt^2`, `v^2 = u^2 + 2gh` | Correct with assumptions | State no air resistance, constant `g`, vertical-only motion. |
| Projectile motion | Range and component formulas | Correct with assumptions | Needs clear ideal projectile assumptions and angle units. |
| Newton's second law | `F = ma`, `a = Fnet/m` | Correct | Guard zero/negative mass in every calculator path. |
| Balanced/unbalanced forces | `Fnet = Fright - Fleft` | Correct for 1D | Direction convention must be shown. |
| Friction | `N = mg`, `fmax = mu N` | Correct with assumptions | Distinguish static threshold from kinetic friction. |
| Inclined plane | `a = g(sin theta - mu cos theta)` | Partial | Current clamping hides negative/uphill acceleration; state sliding condition. |
| Work and power | `W = Fs`, `P = W/t` | Correct if force parallel | Need dot-product assumption or angle input. |
| Energy conservation | `mgh = 1/2mv^2` | Correct ideal case | Loss model is simplified; mark dissipated energy as assumed percentage. |
| Elastic/inelastic collision | 1D coefficient-of-restitution formulas | Mostly correct | Formula display contains typo-like `em2`; assumptions must state 1D, no external impulse. |
| Momentum | `p = mv` | Correct | Vector direction must be preserved in graph/export. |
| Circular motion | `v = r omega`, `F = mr omega^2` | Correct | Clarify radians/s and uniform circular motion. |
| Universal gravitation | `F = Gm1m2/r^2` | Correct | Distance and mass units need stricter controls. |
| Satellite orbit | `v = sqrt(mu/r)`, `vesc = sqrt(2mu/r)` | Correct ideal case | State point mass, circular orbit, no atmosphere. |
| Hooke's law | `F = -kx`, `T = 2pi sqrt(m/k)` | Correct | Guard `k <= 0`; sign and equilibrium displacement need clarity. |
| Spring SHM | `omega = sqrt(k/m)`, `vmax = omega A` | Correct | State ideal spring, small damping ignored unless modeled. |
| Simple pendulum | `T = 2pi sqrt(L/g)` | Correct only small-angle | Must label small-angle approximation and mass independence. |
| Rotational dynamics | `tau = I alpha`, `omega = alpha t` | Correct | Moment of inertia units and geometry are underspecified. |
| Density and buoyancy | `rho = m/V`, float fraction `rho_obj/rho_fluid` | Correct simplified | Need clamp and partial-submersion assumptions. |
| Pressure | `P = F/A` | Correct | Guard `A = 0`; distinguish gauge and absolute pressure. |
| Hydrostatic pressure | `P = Patm + rho gh` | Correct | State static fluid, constant density, depth from surface. |
| Bernoulli | pressure terms from `P + 1/2rho v^2 + rho gh` | Correct simplified | Needs streamline, incompressible, non-viscous assumptions. |
| Gas laws | `PV = nRT`, `PV/T = constant` | Correct ideal gas | State ideal gas and absolute temperature only. |
| Heat conversion | `K = C + 273.15` | Correct | Avoid Celsius in formulas requiring absolute temperature. |
| Calorimetry | heat balance with `c = 4.18 kJ/kg C` | Correct for water | Current lab assumes same substance/specific heat; disclose. |
| Conduction | `Q/t = kA DeltaT/L` | Correct | State steady-state, 1D conduction. |
| Joule heating | `H = I^2Rt`, `P = I^2R` | Correct | Units should distinguish J, W, and elapsed time. |
| Ohm's law | `V = IR` | Correct | State ohmic material and constant temperature. |
| Series/parallel resistance | `Rs = sum R`, `1/Rp = sum 1/R` | Correct | Guard zero resistance and ideal wire cases. |
| Kirchhoff circuits | KCL/KVL solver-like model | Partial | Solver needs singular detection, ideal source validation, and test circuits. |
| Electric power | `P = VI`, `E = Pt` | Correct | Ensure time units are seconds when energy is joules. |
| Static electricity | `F = kq1q2/r^2` | Correct magnitude | Direction/sign and medium assumptions need display. |
| Electric field/potential | `E = kq/r^2`, `V = kq/r` | Correct point charge | Singularity at `r = 0` must be impossible. |
| Capacitor | `Q = CV`, `E = 1/2CV^2` | Correct | Combination model appears parallel-focused; label limitations. |
| Magnetic field wire | `B = mu0 I / 2pi r` | Correct | Requires long straight wire assumption. |
| Coil/electromagnet | relative `NI` strength | Conceptual | This is not a calibrated field model. Label as relative visualization. |
| Lorentz force | `F = |q|vB` | Correct magnitude | Needs angle term and charge/mass-specific radius; proton mass assumption is too hidden. |
| Faraday induction | `|emf| = N DeltaPhi / DeltaT` | Correct magnitude | Lenz sign omitted; label magnitude-only. |
| AC LCR | `Z = sqrt(R^2 + (XL-XC)^2)` | Correct series LCR | State RMS/peak convention and fixed voltage source. |
| Transformer/generator | standard proportional laws | Correct ideal case | State ideal transformer/generator assumptions. |
| Reflection | `i = r` | Correct | Angle measured from normal. |
| Plane mirror | image distance equals object distance | Correct | Virtual image convention should be labeled. |
| Mirror formula | `1/f = 1/v + 1/u` | Correct with convention | Sign convention must be explicit. |
| Lens formula | `1/f = 1/v - 1/u` | Correct in selected convention | Sign convention must be explicit. |
| Magnification | `m = v/u` or `-v/u` variants | Partial | Mirror/lens sign conventions are not uniformly surfaced. |
| Snell's law | `n1 sin i = n2 sin r` | Correct | Requires media indices and angle-from-normal. |
| Glass slab shift | `d = t sin(i-r) / cos r` | Correct | Valid for parallel slab, geometric optics. |
| Prism | prism deviation/minimum-deviation formulas | Correct simplified | Dispersion is modelled heuristically unless wavelength-index relation is explicit. |
| Total internal reflection | `theta_c = sin^-1(n2/n1)` | Correct if `n1 > n2` | Need domain guard and explicit denser-to-rarer condition. |
| Young double slit | `beta = lambda D / d` | Correct small-angle | State coherent sources and small-angle approximation. |
| Single slit | first minimum and central width | Correct with domain issue | Current clamping of invalid `asin` inputs should become validation. |
| Polarization | Malus-type relations in formula bank | Correct | State ideal polarizers. |
| Sound echo | `d = vt/2`, `v approx 331 + 0.6T` | Correct approximation | Temperature in Celsius; dry air assumption. |
| Sound wavelength | `lambda = v/f` | Correct | Intensity/loudness model is relative, not calibrated dB. |
| Chemical current effects | deposit proportional to `It` | Conceptual | Needs Faraday's law/electrochemical equivalent for quantitative trust. |
| Photoelectric effect | `Kmax = hf - phi`, stopping potential | Correct | Current model is arbitrary; mark intensity-current relationship as qualitative. |
| de Broglie wavelength | `lambda = h/p` | Correct | Particle mass/energy convention must be explicit. |
| Bohr transitions | `DeltaE = 13.6(1/nf^2 - 1/ni^2)`, `lambda = hc/E` | Correct for hydrogen | Label hydrogen-only Bohr model. |
| Nuclear decay | `N = N0(1/2)^(t/T1/2)` | Correct deterministic mean | Real decay is stochastic; simulation should disclose expectation value. |
| Semiconductor diode | threshold approximation in lab; Shockley in bank | Partial | Lab should not imply Shockley behavior if using threshold model. |
| Logic gates | Boolean truth behavior | Correct conceptual | Not an analog electronics model. |
| Relativity bridge | formula-family present | Needs verification | Must expose inertial-frame and low/intermediate-speed limits. |
| Statistical ensemble | distribution concepts | Conceptual | Needs exact distribution, units, and sampling assumptions. |
| Advanced quantum operators | operator concepts | Conceptual | Must be clearly non-solver unless matrices/eigenstates are actually computed. |

---

## D. Unit Consistency Matrix

| Quantity | Current state | Risk | Required action |
|---|---|---|---|
| Canvas position | Often stored/rendered in pixels | High | Use explicit `px`, `m`, and conversion metadata everywhere. |
| Matter engine distance | `SCALE = 50` pixels/meter | High | Centralize scale and expose it in lab assumptions. |
| Double pendulum distance | `PIXELS_PER_METER = 100` | Medium | Do not mix with Matter scale without conversion. |
| Object width/height | UI property rows show numeric values without physical basis | High | Label as pixels or convert to meters consistently. |
| Velocity | Matter velocities depend on engine scale and timestep | High | Store physical m/s separately from drawing velocity. |
| Acceleration | Gravity divided by scale for engine gravity | High | Validate against free-fall benchmark in graph output. |
| Force | Custom forces use arbitrary multipliers | High | Mark as visual force unless calibrated. |
| Energy | `KE`, `PE`, `totalEnergy` are computed from tracked state | Medium | Ensure mass, velocity, height use SI-compatible values. |
| Pressure | Placeholder in graph snapshot | Critical | Remove from measured graph until calculated by a pressure model. |
| Volume | Present in labs but not consistently graphed | Medium | Standardize L, m^3 conversions. |
| Temperature | Celsius and Kelvin both used | Medium | Require Kelvin for gas/thermo formulas. |
| Charge | Some UI values use micro/nano-style magnitudes | Medium | Store SI coulombs internally; display scaled values. |
| Voltage/current | Placeholder graph values exist | Critical | Only graph from circuit/photoelectric models with unit provenance. |
| Resistance | Calculator units mostly ohms | Low | Guard zero/infinite cases. |
| Frequency | Graph placeholder from speed | High | Use Hz only from actual oscillation/wave models. |
| Wavelength | Placeholder from speed | High | Use meters/nm from wave/optics/quantum models only. |
| Intensity | Relative values used | High | Label dimensionless or convert to W/m^2 if calibrated. |
| Angle | Degrees in UI, radians in math functions | Medium | Centralize conversion and label all controls. |
| Graph axes | Unit mapping incomplete | Critical | Make every graph series carry its own unit metadata. |
| Export rows | Generic unit `m` used in observation rows | Critical | Export unit must come from selected measurement type. |

---

## E. Dimensional Analysis Findings

| Finding | Status | Why it matters |
|---|---|---|
| `pressure = 101325 + mass * gravity * 2` | Dimensionally invalid | `mass * gravity` is force; multiplying by `2` does not create pressure without area. |
| `voltage = abs(charge) * 5` | Dimensionally invalid | Charge times arbitrary scalar is not voltage. |
| `current = abs(charge) * 0.5` | Dimensionally invalid | Current is charge per time, not scaled charge. |
| `intensity = max(0, 100 - distance/5)` | Dimensionally invalid | Intensity needs power per area or a declared dimensionless relative scale. |
| `wavelength = 0.5 + abs(vx) * 0.02` | Dimensionally invalid | Velocity scaling cannot produce length without a time/frequency model. |
| `frequency = max(0.1, speed)` | Dimensionally invalid | Speed is m/s; frequency is 1/s. |
| Observation row `measured = point.y`, `expected = point.x` | Domain invalid | Only meaningful for very specific graph types, not all experiments. |
| Thermodynamic process factor | Ad hoc model | Work can be formula-correct only if process path is physically defined. |
| Chemical deposition relative output | Conceptual | Needs Faraday constant or electrochemical equivalent for grams/moles. |
| Electromagnet relative output | Conceptual | `NI` is useful, but not equal to a calibrated magnetic field without geometry. |
| Vector resolution drawing in px units | Acceptable if labeled visual | It should not be exported as physical displacement. |
| Photoelectric current | Qualitative | `intensity * KE` is not a physical current model. |
| Tunneling visual probability | Partly physical, partly ad hoc | Transmission formula is useful; animated visual probability is not a normalized wavefunction. |
| Optics lens ray bend to focal point | Geometric approximation | Fine for teaching diagrams; not a full optical solver. |

---

## F. Graph Accuracy Findings

The graph system is the weakest scientific layer.

| Component | Finding | Severity |
|---|---|---:|
| `MatterSimulationEngine.snapshot()` | Generates generic `graphPoint` fields for many unrelated domains. | Critical |
| `BottomPanel.unitForGraphKey()` | Unit mapping is incomplete and detached from experiment metadata. | High |
| Data export | CSV/JSON can export values that look measured but are placeholders. | Critical |
| Observation table | Uses generic x/y comparison and unit `m`. | High |
| Energy graphing | Potentially useful if scale and height reference are consistent. | Medium |
| Force/momentum graphing | Needs vector axis, sign, and unit provenance. | Medium |
| Thermal/electric/optical graphs | Not trustworthy unless produced by domain-specific calculators/engines. | High |
| Graph labels | Need to show model class: measured simulation, calculated formula, or visual-relative. | High |

Minimum requirement before graph data can be trusted: every plotted series should be generated by a typed measurement adapter with `name`, `symbol`, `unit`, `dimension`, `sourceModel`, `assumptions`, and `validRange`.

---

## G. Simulation Model Classification

Legend:

- Validated candidate: can become quantitatively reliable with tests and explicit assumptions.
- Simplified calculator: formula output is useful, but the scene is not a full simulation.
- Visual metaphor: qualitative teaching aid; not quantitative.
- Prototype / untrusted: should not be used for scientific conclusions yet.

| Experiment / feature | Current model class | Trust level |
|---|---|---|
| Distance-Time Graph Builder | Simplified calculator | Medium |
| Uniform Motion | Simplified calculator | Medium |
| Newton's Second Law | Simplified calculator plus visual scene | Medium |
| Balanced and Unbalanced Forces | Simplified calculator | Medium |
| Free Fall | Validated candidate | Medium |
| Projectile Motion | Validated candidate if ideal assumptions enforced | Medium |
| Friction | Simplified calculator | Medium |
| Inclined Plane | Simplified calculator | Medium-Low |
| Elastic Collision | Validated candidate after formula/display fixes | Medium |
| Conservation of Energy | Simplified calculator | Medium |
| Hooke's Law | Simplified calculator | Medium |
| Spring-Mass SHM | Validated candidate | Medium |
| Simple Pendulum | Validated candidate for small angles | Medium |
| Circular Motion | Simplified calculator | Medium |
| Rotational Dynamics | Simplified calculator | Medium-Low |
| Universal Gravitation Field Map | Simplified calculator / visual field | Medium-Low |
| Satellite Orbit and Escape Speed | Simplified calculator | Medium |
| Density Float-or-Sink Tank | Simplified calculator | Medium |
| Buoyancy | Simplified calculator / visual | Medium-Low |
| Force and Pressure | Simplified calculator | Medium |
| Fluid Pressure with Depth | Simplified calculator | Medium |
| Bernoulli Fluid Flow | Simplified calculator | Medium-Low |
| Gas Laws and Kinetic Theory | Simplified calculator | Medium |
| Thermodynamic Processes | Prototype / visual metaphor | Low |
| Heat and Temperature | Simplified calculator | Medium |
| Heat Transfer | Simplified calculator | Medium |
| Calorimetry Mixing Lab | Simplified calculator | Medium |
| Heating Effect of Current | Simplified calculator | Medium |
| Ohm's Law V-I Graph | Simplified calculator | Medium |
| Series and Parallel Resistance | Simplified calculator | Medium |
| Electric Power and Energy | Simplified calculator | Medium |
| Kirchhoff Circuit Rules | Prototype circuit solver | Low-Medium |
| Meter Bridge | Simplified calculator | Medium |
| Cell Internal Resistance | Simplified calculator | Medium |
| Capacitor Energy and Combination | Simplified calculator | Medium |
| Static Electricity and Lightning | Simplified calculator / visual | Medium-Low |
| Electrostatic Field and Potential | Simplified calculator | Medium |
| Chemical Effects of Current | Visual metaphor | Low |
| Magnetic Field Around Current | Simplified calculator | Medium |
| Electromagnet | Visual metaphor | Low |
| Lorentz Force on Moving Charge | Simplified calculator / visual | Medium-Low |
| Faraday Induction | Simplified calculator | Medium |
| AC Generator | Simplified calculator / animation | Medium-Low |
| Transformer Lab | Simplified calculator | Medium |
| AC LCR Resonance | Simplified calculator | Medium |
| Reflection by Plane Mirror | Simplified calculator / diagram | Medium |
| Mirror Formula | Simplified calculator | Medium |
| Lens Formula | Simplified calculator | Medium |
| Glass Slab Refraction | Simplified calculator | Medium |
| Prism Dispersion | Simplified calculator / visual | Medium-Low |
| Total Internal Reflection | Simplified calculator | Medium |
| Microscope and Telescope | Simplified calculator / diagram | Medium-Low |
| Human Eye and Vision Defects | Visual metaphor / simplified optics | Low-Medium |
| Shadows and Eclipses | Visual metaphor / geometry demo | Medium-Low |
| Multiple Reflection and Kaleidoscope | Visual metaphor | Low |
| Electromagnetic Spectrum | Simplified calculator / reference visualization | Medium |
| Young's Double Slit | Simplified calculator | Medium |
| Single Slit Diffraction | Simplified calculator with validation risk | Medium-Low |
| Polarization Lab | Simplified calculator | Medium |
| Sound Pitch and Loudness | Simplified calculator plus relative model | Medium-Low |
| Echo and Speed of Sound | Simplified calculator | Medium |
| Longitudinal Sound Wave | Visual metaphor | Low |
| Wave Lab / wave engine | Numerical visual model | Low-Medium |
| Chladni Plate | Visual metaphor unless eigenmodes are solved | Low |
| Photoelectric Equation | Simplified calculator | Medium |
| Photoelectric simulation | Correct threshold formula; current qualitative | Medium-Low |
| de Broglie Wavelength | Simplified calculator | Medium |
| Bohr Atom Transitions | Simplified hydrogen calculator | Medium |
| Nuclear Decay and Half-Life | Deterministic expectation calculator | Medium |
| Semiconductor Diode and Rectifier | Simplified threshold model | Low-Medium |
| Logic Gates | Correct digital truth-table model | Medium |
| Special Relativity Bridge | Simplified calculator | Medium-Low |
| Chaotic and Coupled Oscillators | Numerical demo | Low-Medium |
| Advanced Quantum Operators | Conceptual visualization | Low |
| Statistical Ensemble Lab | Conceptual/prototype | Low |
| Computational Physics Workflow | Educational workflow | Medium |
| Measurement/Error/Significant Figures | Simplified calculator | Medium |
| Vector Resolution | Simplified calculator | Medium |
| Sources of Energy Comparator | Informational comparator | Low scientific simulation relevance |

---

## H. Missing Assumptions and Limitations

The simulator needs assumptions as first-class metadata, not only prose.

| Area | Missing or under-enforced assumptions |
|---|---|
| Kinematics | Constant acceleration, inertial frame, no drag unless explicitly enabled. |
| Free fall/projectile | Uniform gravity, no air resistance, flat Earth approximation. |
| Friction | Static vs kinetic friction, surface model, direction of impending motion. |
| Inclined plane | Sliding condition and sign of acceleration. |
| Collision | 1D bodies, coefficient of restitution range, no external impulse. |
| SHM | Linear spring, small displacement, no damping unless shown. |
| Pendulum | Small-angle approximation and mass independence. |
| Circular motion | Uniform circular motion and radial force direction. |
| Gravitation/orbit | Point masses, circular orbit, no atmosphere or perturbations. |
| Fluids | Static/incompressible/non-viscous assumptions by formula. |
| Heat | Specific heat constancy, no phase change, closed system for calorimetry. |
| Gas | Ideal gas, absolute temperature, equilibrium state. |
| Circuits | Ideal wires/sources/meters, ohmic components, no parasitic resistance. |
| Magnetism | Infinite straight wire or ideal solenoid geometry where applicable. |
| Optics | Geometric optics, paraxial approximation, angle from normal, sign convention. |
| Interference/diffraction | Coherent monochromatic light, small-angle approximation. |
| Photoelectric | Single photon energy, clean surface, maximum kinetic energy. |
| Nuclear decay | Deterministic expected value vs stochastic event count. |
| Quantum demos | Whether wavefunction, probability, or visual amplitude is actually normalized. |
| Graph/export | Whether values are measured, calculated, or arbitrary relative visuals. |

---

## I. Numerical Stability Findings

| Component | Finding | Risk | Recommended validation |
|---|---|---|---|
| Matter engine | Timestep clamped between 1/240 and 1/20 s | Good start | Free-fall and energy benchmarks across frame rates. |
| Matter engine | Custom forces use small arbitrary multipliers | High | Calibrate or label as visual effects. |
| Matter engine | Gravity divided by pixel scale | Medium | Verify `s = 1/2gt^2` in meters after conversion. |
| Double pendulum solver | RK4 is appropriate for demo | Medium | Track energy drift with damping disabled. |
| Double pendulum solver | No adaptive timestep | Medium | Stress test high energy and near-singular positions. |
| Wave engine | Fixed grid coefficient `lambda = 0.22` | Medium | Validate CFL stability and wave speed. |
| Wave boundaries | Mur-like boundary approximation | Medium | Measure reflection error at boundaries. |
| Optics engine | Ray tracing is heuristic for lens/prism behavior | Medium | Validate Snell/reflection cases exactly. |
| Circuit solver | Near-singular pivot handling can silently continue | High | Return explicit invalid/singular circuit errors. |
| Circuit solver | Ideal voltage source combinations may be singular | High | Test shorted sources, open circuits, ideal meters. |
| Quantum tunneling | Formula path is useful but visual probability is ad hoc | Medium | Separate analytic transmission from animation. |
| Graph sampling | No visible uncertainty/error propagation | Medium | Add tolerances and confidence metadata. |

---

## J. Validation Test Plan

Every calculator and engine should have deterministic tests with physical tolerances.

| Test | Inputs | Expected result | Tolerance | Target |
|---|---|---:|---:|---|
| Free fall distance | `u=0`, `g=9.8`, `t=2s` | `19.6 m` | `1e-6` calculator, `<2%` engine | Calculator + Matter graph |
| Free fall velocity | `u=0`, `g=9.8`, `t=3s` | `29.4 m/s` | `1e-6` | Calculator |
| Uniform motion | `x0=5`, `v=2`, `t=4` | `13 m` | `1e-6` | Calculator |
| Newton second law | `F=10`, `m=2` | `5 m/s^2` | `1e-6` | Calculator |
| Friction threshold | `m=10`, `mu=0.3` | `29.4 N` | `1e-6` | Calculator |
| Inclined plane | `theta=30`, `mu=0`, `g=9.8` | `4.9 m/s^2` | `1e-6` | Calculator |
| Elastic collision equal masses | `m1=m2`, `u1=5`, `u2=0`, `e=1` | velocities swap | `1e-6` | Calculator |
| Energy conservation | `h=5`, `g=9.8` | `v=sqrt(98)` | `1e-6` | Calculator + scene |
| Hooke force | `k=100`, `x=0.2` | `20 N` magnitude | `1e-6` | Calculator |
| SHM period | `m=1`, `k=4pi^2` | `1 s` | `1e-6` | Calculator |
| Pendulum period | `L=1`, `g=9.80665` | `2.006 s` | `1e-3` | Calculator |
| Circular force | `m=2`, `r=3`, `omega=4` | `96 N` | `1e-6` | Calculator |
| Hydrostatic pressure | water, `h=10m` | `199325 Pa` absolute | `<1 Pa` | Calculator |
| Buoyancy | water, `V=0.01m^3` | `98 N` | `<0.1 N` | Calculator |
| Gas law | `n=1`, `T=300K`, `V=0.02494m^3` | about `100 kPa` | `<1%` | Calculator |
| Ohm's law | `I=2`, `R=5` | `10 V` | `1e-6` | Calculator |
| Series resistance | `2,3,5 ohm` | `10 ohm` | `1e-6` | Calculator |
| Parallel resistance | `2,2 ohm` | `1 ohm` | `1e-6` | Calculator |
| Circuit voltage divider | `12V`, `R1=R2` | midpoint `6V` | `<1e-4` | `circuitSolver.ts` |
| Singular circuit | ideal voltage source short | explicit error | exact | `circuitSolver.ts` |
| Snell law | air to glass, `i=30`, `n=1.5` | `r=19.47 deg` | `<0.01 deg` | Optics calculator |
| Mirror formula | `f=10`, `u=30` with chosen convention | convention-specific `v` | `<0.01` | Calculator |
| Lens formula | `f=10`, `u=30` with chosen convention | convention-specific `v` | `<0.01` | Calculator |
| Young double slit | `lambda=500nm`, `D=1m`, `d=1mm` | `0.5 mm` fringe width | `<1e-6 m` | Calculator |
| Single slit first minimum | `lambda=500nm`, `a=0.1mm` | `theta≈0.286 deg` | `<0.01 deg` | Calculator |
| Photoelectric | `hf=3eV`, `phi=2eV` | `Kmax=1eV`, `Vs=1V` | `1e-6` | Modern physics |
| Half-life | `N0=100`, `t=2T` | `25` | `1e-6` | Calculator |
| Bohr transition | `n=3 to 2` | `656 nm` approx | `<1%` | Bohr model |
| Wave stability | high frequency source | bounded finite grid | no NaN/Inf | `waveEngine.ts` |
| Double pendulum energy | damping off | energy drift bounded | define threshold | `doublePendulumSolver.ts` |
| Graph unit provenance | every graph key | non-empty typed unit | exact | `BottomPanel` / adapters |

---

## K. File-by-File Refactoring Recommendations

| File / area | Recommendation | Priority |
|---|---|---:|
| `src/pages/ExperimentDetailPage.tsx` | Extract `calculateStarterLab()` into testable pure modules by experiment. | Critical |
| `src/lib/formulaBank.ts` | Add assumption, domain, variable unit, and sign-convention metadata to every formula. | High |
| `src/lib/formulas.ts` | Replace loose evaluation with typed variables and dimensional metadata. | High |
| `src/lib/experiments.ts` | Add `modelClass`, `trustLevel`, `measurementSources`, and `limitations` fields. | High |
| `src/lib/units.ts` | Expand into a central unit conversion/dimension registry. | Critical |
| `src/engine/matterEngine.ts` | Remove placeholder electrical/optical/thermal graph fields from generic snapshots. | Critical |
| `src/components/BottomPanel.tsx` | Replace `unitForGraphKey()` with graph series metadata from the producing model. | Critical |
| `src/components/PhysicsCanvas.tsx` | Clearly separate visual overlays from quantitative engine state. | High |
| `src/lib/circuitSolver.ts` | Add singular matrix detection, invalid circuit errors, and ideal component constraints. | High |
| `src/engine/waveEngine.ts` | Document numerical scheme, grid units, CFL condition, and wave speed mapping. | High |
| `src/engine/opticsEngine.ts` | Mark ray diagrams as geometric approximations; validate Snell/reflection. | Medium |
| `src/engine/doublePendulumSolver.ts` | Add energy diagnostics and timestep/stability tests. | Medium |
| `src/components/quantum/*` | Separate analytic quantities from illustrative animation quantities. | Medium |
| `src/components/PropertiesPanel.tsx` | Label properties as pixels, SI units, or model-relative values. | High |
| Test suite | Add `src/tests/physics/*.test.ts` for calculator and engine validation. | Critical |

Recommended new modules:

| New module | Purpose |
|---|---|
| `src/lib/physicsConstants.ts` | Canonical constants with units and source notes. |
| `src/lib/experimentAssumptions.ts` | Shared assumption/limitation metadata. |
| `src/lib/modelTrust.ts` | Model class and trust-level labels. |
| `src/lib/labCalculators/` | Pure functions for each calculator family. |
| `src/engine/measurementAdapters.ts` | Typed graph/export series derived from validated models. |
| `src/tests/physics/` | Unit, dimensional, and benchmark tests. |

---

## L. Priority Fix Roadmap

### P0 - Prevent misleading science

1. Remove placeholder pressure, voltage, current, intensity, wavelength, and frequency from generic Matter graph snapshots.
2. Add graph/export badges: `measured simulation`, `formula calculation`, `relative visual`, or `placeholder disabled`.
3. Block CSV/JSON export for untrusted placeholder series.
4. Fix observation rows so measured/expected/unit come from selected experiment metadata.
5. Label all object coordinates and dimensions as pixels unless converted.

### P1 - Make formulas testable

1. Extract calculator logic from page components.
2. Add unit tests for every calculator formula.
3. Add domain guards for zero area, zero mass, invalid angles, invalid refractive-index ratios, and singular circuits.
4. Add explicit sign conventions for optics, charge, collision, and vectors.
5. Fix collision formula display typo and any mismatch between displayed formula and implemented formula.

### P2 - Add unit and dimension guarantees

1. Build central unit/dimension metadata.
2. Require graph series to carry units from source.
3. Standardize meter/pixel conversions across engines.
4. Add SI internal storage with display converters.
5. Add dimensional checks for derived values.

### P3 - Validate engines

1. Add Matter free-fall, energy, and momentum benchmarks.
2. Add wave stability and speed benchmarks.
3. Add circuit solver validation cases and singular-circuit errors.
4. Add double-pendulum energy drift diagnostics.
5. Add optics ray tests for reflection, refraction, and lens conventions.

### P4 - Improve learning trust

1. Show assumptions beside every formula and graph.
2. Add "valid range" warnings on sliders.
3. Distinguish qualitative visuals from quantitative labs in experiment cards.
4. Add uncertainty/error propagation where appropriate.
5. Add teacher-facing validation notes for each lab.

---

## M. Final Verdict: Is the Simulator Scientifically Trustworthy Today?

No, not as a quantitative simulator.

The codebase contains many correct formulas and several promising numerical or visual engines, but scientific trust requires more than correct equations. It requires that units, assumptions, graph data, visual state, exported measurements, and numerical methods all agree. Today, those layers are not consistently connected.

The simulator can be trusted for selected formula demonstrations when a knowledgeable teacher verifies the assumptions. It should not yet be trusted for:

- quantitative lab reports,
- automated grading,
- exported experimental data,
- undergraduate numerical experiments,
- research use,
- or any claim that graph values are measured physical quantities across all labs.

The product direction is still strong. The next scientific milestone should be to make every value answer three questions:

1. What physical quantity is this?
2. What unit and dimension does it have?
3. Was it measured by a validated model, calculated by a formula, or drawn as a visual metaphor?

Until those answers are enforced in code, the simulator should be marketed and labeled as an educational visualization and formula exploration tool, not a scientifically validated physics simulator.
