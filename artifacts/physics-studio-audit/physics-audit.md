# Physics verification

The existing suite passed 581/581 numerical reference and source-policy tests. This is not independent certification of every studio. Its validation metadata covers 81 experiments, whereas the browser catalogue contains 92 entries; coverage reconciliation remains open.

Work: the new apparatus and live output use the existing constant-force model W = Fd cos θ. Six analytical cases test parallel/perpendicular forces, zero force, zero distance, and an oblique force; component magnitudes satisfy Fx² + Fy² = F². Playback prescribes displacement at 0.5 m/s and recalculates work from that distance. It does not model acceleration or net work. See [OpenStax: Work](https://openstax.org/books/university-physics-volume-1/pages/7-1-work).

Field: g = GM/r² and Φ = −GM/r drive the vectors, readings and graph. The test confirms the default numerical value, quarter field at double radius, changed graph at changed mass, inward directions, density changes and synchronized probe playback. The circular trajectory has angular speed √(GM/r³); elapsed simulation time advances at 1000 s per real second. The central planet is a visual marker; the model is a point source and does not model Earth's interior. Arrow lengths use a logarithmic display scale. See [OpenStax: gravitational field](https://openstax.org/books/university-physics-volume-1/pages/13-2-gravitation-near-earths-surface) and [circular orbits](https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy).

The field reference gives 9.22 m/s² for M=5.97e24 kg and r=2.08e7 m, whereas GM/r² is approximately 0.921 m/s². The app retains the correct computation. Its right-side probe has consistent positive-x position and an inward 180° field direction; the reference's negative-x label is inconsistent with that placement.

Raw new-page evidence: work/verification.json and gravitational-field/verification.json. Remaining models, invariants and numerical convergence checks are not recertified by this pass.

## Standing Waves checkpoint — 2026-10-17

Standing Waves: linear fixed-fixed normal modes, SI lengths/time, f=n√(T/μ)/(2L), μ=.005 kg/m, small-slope amplitude cap, physical energy integral. 540 parameter/time cases and independent rendered-instance sampling passed. Corrected contradictory reference readouts; ideal support/forcing assumptions documented. See standing-waves/report.md and verification.json.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum: calibrated SI pressure, five actual source signals, finite ten-harmonic Fourier series, pressure RMS/SPL, source-dependent THD, fλ=343 m/s and T=1/f. Real radix-2 Hann FFT and 40 short-time spectra share generated signal samples; noise is a documented finite periodic digital approximation. Corrected gain=0 handling and contradictory sine/harmonic mockup outputs. 720 source/frequency/gain/time cases plus direct DFT/Parseval/Hann/noise checks passed. See sound-spectrum/report.md.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect: corrected the receding observer sign and spatial wavelength calculation. Signed subsonic velocities, f±=f(c±vo)/(c∓vs), λ±=(c∓vs)/f, exact emission-centred fronts and retarded actual microphone phase share one state. 900 motion cases and 225 crest arrivals passed, with independent finite-difference frequency and rendered-geometry checks. Graph is explicit independent directional comparisons; actual pass-by/coincidence is recorded separately. Assumptions and inconsistent mockup numbers documented in doppler-effect/report.md.

## Reflection checkpoint — 2026-10-17

Reflection: d−2(d·n)n specular vector model; independent parallel-ray intersections, fixed laboratory graduation disc and relative-angle mirror/source configuration. Atan2 avoids a reproduced normal-incidence acos roundoff failure. Passed 2,853 configuration checks and 22,950 packet samples, equal optical paths, native matrix/hit tests and marker speed c. Marker timing uses ideal n=1 propagation and slowed ns playback. Table values are calculated/recorded model states, not real measurements. See reflection/report.md.


## Refraction checkpoint — 2026-10-17

Vector Snell model now traces finite tank/prism faces through explicit air gap, handles TIR/critical/grazing cases and Fresnel power coefficients, and propagates representative packets at c/n. 4,525 interface cases and 4,525 traces passed. Default angles 28.8/19.1 degrees. Idealizations documented in refraction/report.md and Explain. Source: https://openstax.org/books/physics/pages/16-2-refraction .


## Lenses checkpoint — 2026-10-17

Lenses signed thin-lens/ray-slope engine uses SI geometry, cm instruments, exact infinity/virtual handling and finite aperture. 2208 configurations, 6382 valid rays and 14916 packet samples passed. Native instance-matrix endpoints/packets checked. Convex/plano equal selected power is explained; finite body surfaces are illustrative. Source and assumptions in lenses/report.md.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors signed Gaussian model and first-order ray construction passed 6992 configurations, 19438 valid rays and 97503 packet samples; 24 native configurations/matrices checked. Correct default image lies beyond object (di=60 cm). Finite screen dimensions are now enforced in Mirrors and Lenses; large virtual images fit the camera. Assumptions/source/evidence: mirrors/report.md and screen-boundary-verification.json.

Curved Mirrors focal readout retains the exact derived half-step precision for fractional radius controls (for example R=11.5 cm gives f=5.75 cm). Production regression covers this near-focus setup.


## Interference checkpoint — 2026-10-17

Interference uses a finite, equally illuminated long double slit (40 μm width), coherent complex-amplitude superposition, exact Euclidean path differences, a high-frequency scalar obliquity kernel and 32-point Gauss–Legendre integration. Separate point-slit and incoherent comparisons change the actual model. I(0) is normalized to 1 per configuration. Nominal λL/d is distinguished from exact profile extrema. The plotted far-field formula is explicitly approximate. 180 configurations / 1620 sampled positions passed symmetry, positivity, normalization, 32→64 convergence, finite-window energy bounds, independent far-field and narrow-width limits. Maximum quadrature error 1.89e-15; default nominal spacing 2.1666666667 mm. Scene transverse coordinates are disclosed ×50; longitudinal distances remain physical. Native ray endpoints agree with the model within 5.36e-09 m, and sampled texture channels agree exactly with the gamma-adjusted model profile. Representative markers move at c; wavefronts sample every 50,000th center-source phase front. Scalar/polarization/near-field limitations are explained.


## Diffraction checkpoint - 2026-10-17

Diffraction now supports a uniformly illuminated long slit and circular aperture. Fraunhofer sinc-squared/Airy intensity uses angular geometry and obliquity; minima use the first J1 zero 3.8317059702 for a circular opening. At the reference defaults (100 micrometres, 632 nm, 0.50 m), the correct single-slit nominal width is 6.32 mm and first minimum about 0.362 degrees, correcting the mockup's inconsistent 4.32 mm / 0.52 degrees. Far-field validity is disclosed with N = a squared/(wavelength times L) and an amber warning above 0.1. Experiment offers a paraxial Fresnel comparison using slit quadrature or a circular Hankel integral. Fresnel width readings explicitly remain nominal far-field values. 240 configurations / 1680 positions, 12 finite-window energy bounds, symmetry, convergence, limiting cases and physical marker speed passed. Independent SciPy checks cover 216 complex fields (maximum error 3.73e-14) and 6001 Bessel arguments through 600 (maximum error 8.63e-13). SI calculations, relative normalization, display gamma/exposure, optical transverse scale x50, long-slit vertical taper and scalar/paraxial omissions are explained.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force uses signed rightward-axis vectors for sources at x = -r/2 and +r/2: F on A = -k q1 q2/r squared and F on B its opposite. The former page reversed A's sign. External fields exclude self-fields. At +5/-5 microcoulombs and 0.30 m, force magnitude is 2.497222 N and each external field magnitude is 499444.444 N/C, correcting the mockup's inconsistent 89900 N/C. k is explicitly the rounded 8.99e9 constant. Total E and V share the same charges; unsoftened point-charge formulas drive RK4 meridional field lines, bisection-refined equipotential meridians revolved about the charge axis, and a fixed log-strength slice. 343 force/field cases and 343 potential-gradient checks passed (max relative gradient error 1.33e-10). 66290 line segments follow E, with step-size convergence error 7.23e-06 m; 6104 contour endpoints have normalized potential residual at most 4.84e-08. The true log-log force curve has slope -2. Like, unlike, neutral and tiny-charge cases are handled without log(0) or negative-zero force artifacts. Animated markers represent field direction, not charge flow or propagation physics.


## Electric Field checkpoint - 2026-10-17

Electric Field now evaluates unsoftened three-dimensional point-source superposition and potential in SI. All nine source/probe coordinates work; optional depth fields and elevation become visible. The former 3 cm distance clamp is removed. Active-source coincidences produce an undefined probe field; coincident sources combine algebraically for the total field. Zero fields and axial vectors have undefined azimuth. At the stated defaults, Ex = 254950.100408, Ey = -121805.386544, Ez = 0 N/C, magnitude 282552.837341 N/C and azimuth -25.536683 degrees. The correct arrow points down-right, unlike the mockup. 144 configurations / 432 potential-gradient checks passed, maximum relative gradient error 4.99e-10. 67398 curve segments align with E (minimum cosine 0.999980410); default step-halving convergence difference 2.2e-05 m. Adaptive spatial RK4 limits steps using a source-field Jacobian norm bound near cancellation points. Density affects representative count, never the numeric field. Native geometry is an explicitly labeled XY projection of 3D coordinates; probe arrows are normalized for legibility and markers illustrate direction rather than charged-particle motion.

## Electric Potential checkpoint - 2026-10-17

Point-charge potential, actual full-XYZ electric field magnitude and U=qtest V now share SI state. Defaults: 17668.6344627 V / 0.0176686344627 J / 44809.1251349 V/m. Reference mockup values were inconsistent with its microcoulomb/metre units. Infinite and finite-point gauge choices preserve E; singularities are explicit. Height selects a physical z slice, plotted ordinate is clipped at +/-50 kV, contours spaced by 5 kV. Probe scans are instrument motion, not free-charge dynamics. 225 cases, 675 gradient derivatives and four-grid convergence passed; see `electric-potential/report.md` for scientific sources, assumptions and errors.

## Electric Potential visual refinement - 2026-10-17

SI potential/field/energy are unchanged and independently reverified. Default sampled potential range is -48258.635 to +71491.136 V, fully within the new +/-100 kV plot range. Red positive / blue-purple negative / cyan zero contour signs match all 4520 native segments. Probe callout guide ends at the calculated potential surface; metric base-plane picking matches known physical XY coordinates. Model 225 cases / 675 derivatives and four-resolution convergence passed; default 80-cell contour RMS 31.820 V -> 160-cell 7.920 V. See current per-lab report for assumptions and scientific references.


## Capacitors native rebuild checkpoint

See [Capacitors evidence](capacitors/report.md). Correct SI capacitance and analytical RC state replace the old calibrated values; native apparatus and reference-only tabs are implemented. Visual refinement remains open (MAE 23.663, SSIM 0.5799). Full 102-reference / 17-studio completion is not claimed.


## Electric Current native rebuild checkpoint

See [Electric Current evidence](current/report.md) and [current gate status](current/verification-status.json). Static SVG is replaced by a native apparatus and shared-state electron drift. Direct model, six-size browser, runtime and fallback checks pass. Final TypeScript/Vite/PWA build and normal production checks pass, including fullscreen, keyboard slider and independently parsed nine-column CSV. Sidebar and four reference modes are preserved. MAE 20.710 / SSIM 0.5584 (sidebar excluded); visual refinement remains open. All 102 references / 17 studios remain in scope.


## Circuits native rebuild checkpoint

See [Circuits evidence](circuits/report.md) and [current gate status](circuits/verification-status.json). A native breadboard, instruments, lamps, switch and model-driven current replace the static SVG. The explicit 47 ohm series lamps correct the reference power inconsistency. Direct model, six-size browser, touch/runtime and fallback checks pass; final TypeScript/Vite/PWA build and normal production checks pass, including open-switch equations, keyboard controls, CSV values and corrected mobile header ordering. Sidebar and four reference modes are preserved. MAE 34.462 / SSIM 0.4795 (sidebar excluded); visual refinement remains open. All 102 references / 17 studios remain in scope.


## Magnetic Field Lines native rebuild checkpoint

See [Magnetic Field Lines evidence](magnetic-field-lines/report.md) and [current gate status](magnetic-field-lines/verification-status.json). Decorative ellipses and hard-coded readings are replaced by two equivalent dipoles, calculated traces/filings, compass probes and vector/profile plots. Both poles are represented. Direct model, six-size browser, runtime, touch and fallback checks pass; final TypeScript/Vite/PWA build and normal production checks pass, including core/null handling, keyboard probe, both-pole labels and independently parsed CSV values. Sidebar and four reference modes are preserved. MAE 27.026 / SSIM 0.4337 (sidebar excluded): average pixel difference improves, structural similarity remains below the old page. Visual refinement stays open; all 102 references / 17 studios remain in scope.


## Lorentz Force native rebuild checkpoint

See [Lorentz Force evidence](lorentz-force/report.md) and [current gate status](lorentz-force/verification-status.json). The native chamber, signed cross-product motion, instantaneous vector triad and orbit inset share the analytic SI state. Reference force direction and proton numbers are corrected. Model, six-size browser, runtime, touch and fallback checks pass; final TypeScript/Vite/PWA build and normal production checks pass, including signed charge, keyboard slider, views, playback and independently parsed quarter-period CSV. Sidebar/four modes and the relevant reference view selector remain. MAE 21.991 / SSIM 0.5419; visual refinement remains open (SSIM below baseline). The full 102-reference / 17-studio goal remains active.


## Current-Carrying Wire native rebuild checkpoint

See [Current-Carrying Wire evidence](current-wire/report.md) and [current gate status](current-wire/verification-status.json). Original native wire/compass apparatus and calculated insets replace the flat SVG. Signed SI field, probe position, compass headings, readings and nine-column CSV share state; zero current has no defined needle direction. Play scans the probe at 0.3 rad/s while field lines stay fixed. The original sidebar and only the four reference modes remain. Model (32 configurations / 192 states), six-size browser/formula bounds, controlled runtime, actual touch, fallback and scoped cleanup checks pass. Final TypeScript/Vite/PWA build and normal production checks pass; 581/581 broad catalog checks pass with 80 existing metadata warnings. An intermittent derived-state update-depth warning was corrected by drawing the probe overlay through refs; final long-play/browser runs have no console errors. MAE 20.192 / SSIM 0.5995 improve over baseline, but apparatus finish, hand illustration and other visual differences remain. Full 102-reference / 17-studio completion is not claimed; the goal stays active.


## Solenoid native rebuild checkpoint

See [Solenoid evidence](solenoids/report.md) and [current gate status](solenoids/verification-status.json). The implicit 125 m calibration and prior VERIFIED claim are withdrawn. An explicit 16 cm × 2.5 cm radius finite coil, approximate uniform magnetization, original native apparatus and movable Hall probe share SI state with the profile and CSV. Four reference modes remain; the relevant three-view selector, zoom/fullscreen, steppers/core presets and five advancing/graded challenges work. Direct model (64 configurations / 576 axial states plus numerical field/trace checks), eight-view browser, controlled runtime, actual touch, fallback, scoped disposal, final TypeScript/Vite/PWA and normal production checks pass. 581/581 broad catalog checks pass with 80 existing metadata warnings. Default field is 178.87 mT for the declared approximation, not a calibrated 2.41 mT. MAE 22.818 / SSIM 0.5217 remain diagnostic; structural similarity is slightly below baseline. Visual refinement, exact finite/nonlinear material response, cross-engine/hardware verification and application bundle/PWA size remain open. All 102 references / 17 studios stay in scope; overall completion is not claimed.


## Electromagnetic Induction native rebuild checkpoint

See [Induction evidence](induction/report.md) and [current gate status](induction/verification-status.json). The dimensionally invalid NBA v expression and prior VERIFIED claim are withdrawn. A native dipole/finite-width coil apparatus, SI flux gradient, Faraday/Lenz/current/force-power state, actual galvanometer and model plots replace the flat SVG. Normal S-left/N-right orientation makes N-first entry true. Original sidebar/four modes remain; setup polarity, graduated controls, three zooms, placement, replay and recording/export work. Direct model (384 cases plus independent flux/dipole-limit/Faraday convergence), eight-size browser, controlled runtime, actual touch, fallback, scoped cleanup, final TypeScript/Vite/PWA and normal production checks pass. A queued-frame Pause race is corrected and covered by six rapid production pause/resume checks. 581/581 broad catalog checks pass with 80 existing warnings. MAE 25.379 / SSIM 0.5423 improve over baseline; photographic fidelity and model limits remain open. The full 102-reference / 17-studio goal stays active.

## Electromagnets initial native checkpoint — 2026-10-17

Route `/magnetism/electromagnets`: native apparatus and reference four-mode layout integrated; sidebar markup preserved. Initial TypeScript, 36-case model/energy/virtual-work/RK4 checks and eight-layout browser smoke passed. This is not full acceptance: production, runtime/disposal, touch/fallback, full control/data tests and visual comparison/refinement remain open. See `electromagnets/report.md` and its initial verification JSON. Overall goal remains incomplete.


## Electromagnets native verification checkpoint — 2026-10-17

Route `/magnetism/electromagnets` now uses the four reference modes with original native apparatus and preserved sidebar. Model/energy/virtual-work/RK4/winding convergence, eight-layout interior bounds, 17-column CSV, native SI geometry, 10/30/60 fps playback, hidden/pause/end/replay/unmount behavior, real touch, no-WebGL fallback, final production build and normal production smoke pass. Seven renderer instances and 917 tracked scene resources were disposed across navigation. Repository physics catalog: 581/581 passed. Build session 3395 terminal 0; production port 4199 smoke terminal 0. Source hashes checked.

Sidebar-excluded MAE/SSIM: baseline 31.863/0.4934 → native 33.018/0.4916. These metrics do not show visual improvement; photographic fidelity remains open. Corrected two-gap fixed-armature geometry, illustrative material law, omitted fringing/leakage/hysteresis/thermal effects and the large PWA bundle remain limitations. Initial verification gaps listed in the earlier checkpoint are superseded by the specific gates above. See `electromagnets/report.md`, `verification-status.json` and raw verification files. Full repository goal remains incomplete.


## Semiconductors native checkpoint — 2026-10-17

Route `/electronics/semiconductors` rebuilt around only the four reference modes and preserved sidebar. Original Three.js diamond geometry has 512 sites/844 bonds; the calculated fallback shares the actual lattice. Bulk Fermi–Dirac carrier/ionization charge neutrality replaces the old dopant-type-independent density and arbitrary conductivity scale. Live band edges/Fermi energy/readings/CSV share the model. Play displays a declared illustrative acoustic mode with temperature-dependent amplitude; carrier symbols are explicitly schematic.

Evidence: 50 model configurations; neutrality relative residual ≤1.04e−14; independent freeze-out and FD/wave convergence; tetrahedral geometry and harmonic energy; eight-size interior bounds; all controls, 15-column SI CSV, real touch/fallback, 10/30/60 fps native coordinates, hidden/pause/end/replay/unmount and disposal (7 renderers/99 tracked scene resources) pass. Final build session 41557 terminal 0; normal unmasked production smoke port 4200 terminal 0; repository physics catalog 581/581. Source hashes checked.

MAE 25.938 → 25.086; SSIM 0.5394 → 0.5312, excluding the sidebar. MAE improves; SSIM does not. Material/camera refinement, empirical mobility, high-doping effects and full phonon physics remain open. Native material adjustment reduced initial rebuilt MAE 28.306. The early build/save race failed and ended before stable final builds; no live process was restarted merely for timing out. See `semiconductors/report.md`, `verification-status.json` and raw evidence. Full 102-reference objective remains incomplete.


## Diodes native checkpoint — 2026-10-17

Route `/electronics/diodes` rebuilt with the reference's four distinct device tabs (PN, Zener, LED, Schottky) and four learning modes; sidebar markup preserved. Original native breadboard/supply/device/wires use the same SI circuit state as the characteristic and 19-column CSV. Coupled resistor/junction solution replaces the old hard threshold and 50 mA cap. Zener is mounted in reverse and plotted with signed voltage/current; LED emission follows declared illustrative optical power. Quasistatic sweep charge drives packets along a continuous conductor path, not arbitrary drifting dots.

Evidence: 120 configurations, KVL/power balance, forward/Zener test points and charge/energy convergence pass; eight-size interior bounds, all controls/CSV, real touch/fallback, 10/30/60 fps packet/graph/native agreement, pause/hidden/end/replay/unmount and resource cleanup (7 renderers/868 tracked scene resources) pass. Final build session 71246 terminal 0; normal production smoke port 4201 terminal 0; physics catalog 581/581. Current source hashes checked. Browser runtime errors: none in the successful checks.

Sidebar-excluded MAE 29.798 → 23.470 and SSIM 0.5597 → 0.5944 improve; these are not match percentages. Photographic composition/finish, calibrated real-device and transient/thermal effects, LED photometry and the large app/PWA bundle remain open. Previous VERIFIED/capped-current claims are withdrawn in the lab documentation. See `diodes/report.md`, `verification-status.json` and raw evidence. Full 102-reference goal remains incomplete.


## Transistors native checkpoint — 2026-10-18

Route `/electronics/transistors` rebuilt to the reference layout with only four learning modes and preserved sidebar. Native dual-channel test fixture, labelled E–B–C device, resistor/ammeter wiring, output/transfer/region displays and 26-column SI export share a continuous Ebers–Moll transport model with declared approximate Early extension. Controlled VCE changes required supply/power with RC; the load-line circuit changes the operating point. The old RC no-op and abrupt 0.2 V current shutoff are corrected. Undefined cutoff gain and signed reverse base injection are retained correctly.

Evidence: 180 cases and independent Ebers–Moll-limit/KCL/power/KVL checks, quadrature convergence, eight-size interior bounds, all controls/CSV, real touch/fallback, 10/30/60 fps two-branch packet/graph/native agreement, pause/hidden/end/replay/unmount and cleanup (7 renderers/784 tracked scene resources) pass. Both fullscreen controls and challenge accessibility after fullscreen pass. Short-desktop control and mobile toolbar overflow were fixed. Final build session 68133 terminal 0; normal production smoke port 4202 terminal 0; physics catalog 581/581. Final source hashes checked.

Sidebar-excluded MAE 26.341 → 21.789; SSIM 0.5513 → 0.5520. Both improve, but do not establish full visual acceptance. Photographic finish/proportions, real-part and switching/thermal models, ideal-SMU limits, large app/PWA bundle and wider hardware coverage remain open. See `transistors/report.md`, `verification-status.json` and raw evidence. Full 102-reference objective remains incomplete.


## Amplifiers native checkpoint — 2026-10-18

Route `/electronics/amplifiers` now follows the paired-scope/native-instrument/bottom-panel reference layout with the sidebar preserved. Only four lab modes plus Circuit/Waveforms/Equation theory tabs remain. A native function generator, tilted breadboard, NPN/resistors/ideal passband components and oscilloscope share the nonlinear model and clock. All seven hardware actions work. AUTO timebase display and low-frequency limits are corrected; default instrument screens fit all eight tested sizes. Two native resistor-lead gaps were closed.

The previous VERIFIED claim and artificial doubled Vpp/clamp are withdrawn. Default 0.4 Vpp source produces 0.3994 Vpp loaded base and 4.185868 Vpp collector, with fundamental source gain −10.4697. The nominal Rc gain setting, bias and optional ideal emitter bypass affect solved node currents and waveforms. Sources, resistors, device and bypass reservoir balance power; coupling assumptions and omitted dynamics are explicit.

Evidence: 54 configurations / 3456 phase states; independent Ebers–Moll/KCL/KVL/power, small-signal and periodic quadrature checks; eight interior-bound sizes; all controls, seven reference tabs, CSV30, fullscreen/challenge and keyboard; real touch and calculated fallback; shared scope/native state at 10/30/60 fps; pause/hidden/end/replay/unmount and geometry reuse; cleanup of 7 renderers / 868 tracked scene resources. Final build session 67683 terminal 0, normal production port 4203 smoke terminal 0, catalog physics 581/581, final four source hashes checked.

Sidebar-excluded MAE 37.524 → 32.558; SSIM 0.4724 → 0.5179. Neither proves full visual acceptance. Apparatus finish, camera/proportions, cable framing and real-device/capacitor/bandwidth/thermal refinements remain open. See `amplifiers/report.md`, `verification-status.json` and raw evidence. Full 102-reference goal remains incomplete.
