# Remaining work

The latest instruction requires the pages to follow their mockups, including the exact relevant tabs, and forbids using cropped screenshot parts as UI assets.

Completed in this pass: unsupported 3D cleanup; reference-page dock removal; 96 dedicated lab links; working Work and Gravitational Field rebuilds; 102 captures at matching target dimensions; 102 measured main-region comparisons; a completed resumed 763-entry route sweep.

Still open: manually review and refine every meaningful visual discrepancy across all 102 pages; verify all primary and secondary tab groups against their individual references; replace remaining static apparatus or disconnected visuals; independently validate every model and every visible control; reconcile the 81-entry validation metadata with the 92-entry catalogue; expand source-asset checks; benchmark supported browsers, WebGL fallbacks, disposal and repeated navigation. Automated comparisons show substantial discrepancies on multiple pages and do not prove completion. Prior per-page VERIFIED labels are historical records, not recertification.

## Oscillations rebuild checkpoint (2026-10-17)

All six `/motion/` oscillation reference pages now have dedicated apparatus/layout rebuilds, four matching primary learning modes, and per-control/physics evidence under `spring-shm/`, `pendulum/`, `energy-exchange/`, `damping/`, `resonance/` and `coupled/`. The six-route browser tab/asset inventory was refreshed; no extra floating tools dock was found. This does not close visual acceptance: scenes still differ materially in photorealism, camera/backdrop and typography. Cross-browser/performance acceptance and remaining non-oscillation pages remain open. MAE and SSIM are refreshed by `scripts/compareOscillationRebuilds.py`, with sidebar excluded, and must not be interpreted as completion percentages.

Wave Properties now has a native model-driven rebuild and per-control evidence in `wave-properties/`. It remains open for photographic/material, header/type and cross-browser/performance acceptance. Superposition now also has a native rebuild with its own evidence; the remaining four Waves & Sound pages need the same reference-specific reconstruction and verification.

Superposition has passed model/control/shader checks, but its photographic water detail, exact header/type treatment and multi-browser/performance acceptance remain open. See superposition/report.md.

Interference now has dedicated reconstruction and model/control evidence in interference/. The centimetre/metre mismatch and signed-phase error are corrected. Native water lighting/material appearance, exact type, multi-browser and broad performance acceptance remain open. Standing Waves, Sound Spectrum and Doppler Effect are the remaining Waves & Sound pages awaiting equivalent rebuilds.

## Standing Waves checkpoint — 2026-10-17

Standing Waves native rebuild is functionally/scientifically checked, but material/lighting realism and precise typography remain below the reference. Linear fixed-end model excludes finite moving-support forcing, damping and nonlinear effects. Quarter/real-time high-frequency sampling can alias; Resolve cycles is available and explained. Measured local headless performance is about 29 fps, with long-duration/cross-browser profiling open. Remaining Sound Spectrum, Doppler Effect and the broader 102-page visual/model/control acceptance remain open.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum has validated generated signals, FFT/STFT and working controls, but photographic material/lighting/detail and typography matching remain open. Calibration is assumed, microphone/device audio is not used, periodic digital noise is a finite approximation, and room acoustics/physical speaker transfer are not solved. Correct pure-sine plots intentionally differ from the contradictory mockup. Doppler Effect and the broader 102-page visual/model/control/performance acceptance remain open.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect now has a validated native rebuild, but photographic material/lighting/fine geometry and typography matching remain open. Correct wave spacing, frequency values and graph cycles differ from the contradictory mockup. Phase-only ideal model omits amplitude spreading, reflections, collisions and actual audio capture; exact source/observer coincidence has undefined instantaneous frequency. All six Waves & Sound labs now have native rebuild checkpoints, but their visual/material and broad cross-browser/performance acceptance remains open, alongside the rest of the 102-page inventory.

## Reflection checkpoint — 2026-10-17

Reflection native/physics/control rebuild is verified, with photographic material/lighting, instrument detail and typography matching still open. Physical plane-mirror rays/protractor centre intentionally correct inconsistent illustrated geometry. The mirror-control setup maintains incidence relative to its rotating normal; fixed-source mirror rotation is explained separately. Small printed graduations benefit from zoom on phones; numeric readings stay legible. Ideal n=1 ray model omits diffraction, polarization, reflectivity calibration and hardware obstruction. Remaining optics pages and the broader 102-page acceptance remain open.


## Refraction checkpoint — 2026-10-17

Refraction native materials/lighting and fine hardware detail remain below the reference. Incidence-angle arcs and some scene labels need refinement; target water angle label differs from correct Snell calculation. GPU-memory/leak profiling remains open. Assignment locks and host-specific frame cadence were subsequently tested; see runtime-verification.json. Full 102-reference acceptance remains unproven.


## Lenses checkpoint — 2026-10-17

Lenses native materials/lighting, optical glow, fine apparatus detail and typography remain below reference fidelity. Uniform physical scale intentionally differs from inconsistent reference arrow/ruler proportions. Ideal paraxial optics does not include full curved-surface refraction/aberration. GPU-memory profiling remains open; full 102-reference acceptance is not proven.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors materials/lighting, glow, fine hardware and typography still need visual refinement. Correct default real image is beyond the object; matching the mockup placement would contradict its own numbers. Existing sidebar remains unchanged, with light controls relocated into the main scene. Model is explicitly Gaussian/paraxial, not exact curved-surface ray tracing. Cross-browser and extended memory profiling remain open. Lenses/Mirrors finite-screen regressions were corrected; final release gates passed.

Keyboard parameter editing is verified; a complete keyboard focus-order review across CSS-reordered layouts is still pending. Untouched routes and their typography after optional-font loading are not recertified by these scoped tests.


## Interference checkpoint — 2026-10-17

Interference visual fidelity remains open: photographic lab/background, material/lighting realism, apparatus proportions, detailed instrument hardware and typography need refinement. Optical transverse scale is explicitly magnified ×50 to make micrometre slits and millimetre fringes legible. The scalar model omits polarization, evanescent and material boundary effects; representative phase fronts are not full aperture-field phase surfaces. Actual intensities replace mockup extrema 0.98/0.02. Extended memory, additional browser engines and responsive keyboard focus order need further auditing. The full 102-reference / 17-studio objective remains active.


## Diffraction checkpoint - 2026-10-17

Diffraction remains visually short of the photographic reference: laboratory background, material/lighting realism, apparatus proportions, fine hardware and typography need refinement. Its correct numerical defaults intentionally differ from inconsistent mockup readings. Fraunhofer validity is explicitly limited; the optional Fresnel comparison is paraxial and scalar, omitting polarization, evanescent fields and material-boundary diffraction. A single-slit screen's vertical taper is presentation styling; circular intensity is radial in both transverse dimensions. The red beam is an axis guide, not the diffracted field. Extended GPU memory, additional browser engines and responsive focus-order audits remain unverified. The complete 102-reference / 17-studio objective remains active.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force still differs from the reference photograph in background, metallic surface/lighting detail, fine support/table hardware and typography. Numerical fields and the true slope-minus-two log-log curve intentionally correct inconsistent mockup content. Spheres are point-charge markers, not interacting conductors; induced surface charge, support/table polarization, radiation and retardation are omitted. Equipotential wireframes approximate surfaces between refined endpoints; field-line counts are representative, not quantitative flux. Force arrows use a disclosed logarithmic display scale; moving markers are explicitly not charge flow. Additional browser engines, long-duration GPU/FPS/memory and responsive focus-order checks remain open. The complete 102-reference / 17-studio scope remains active.


## Electric Field checkpoint - 2026-10-17

Electric Field visual refinements remain: source glow/material detail, line brightness/arrow rendering, typography, composition and annotation placement need further reference review. Correct physical positions, a consistent metric scale, downward-right default vector and computed contributions differ from contradictory mockup artwork. This is a static scalar vacuum model of held point charges, omitting induced charge, dielectric boundaries, radiation and retardation. The scene is an XY projection of 3D data; projected curves can overlap at different depths. Representative line counts/colors are not calibrated flux or field-strength measurements. Probe arrow length is normalized; marker animation is a direction illustration, not current or charge speed. Additional browser engines, long-duration GPU/FPS/memory and responsive focus order remain unverified. The complete 102-reference / 17-studio objective remains active.

## Electric Potential checkpoint - 2026-10-17

Electric Potential native physics/function gates passed, but visual fidelity is not complete: MAE 24.214 / SSIM 0.5268 are both worse than its static baseline. Warm-area distribution, native mesh/contour styling, perspective, glyphs, typography, glow, mobile overlay crowding and axis labels need further refinement. Correct SI values and z-slice plot intentionally differ from inconsistent mockup readings. Other browser engines, long-running GPU/memory and broad accessibility focus-order checks remain unverified. The rest of the full 102-reference / 17-studio program remains open.

## Electric Potential visual refinement - 2026-10-17

Main-region MAE 19.224 / SSIM 0.5299, versus prior native 24.214 / 0.5268: both metrics improved versus the prior native checkpoint; SSIM remains below the static baseline and visual acceptance remains open. Physical source topology/values and coherent axes differ from the inconsistent mockup. Perspective, exact contour placement, typography, lighting/glow and overlay composition need further refinement. Six default viewport checks do not establish all parameter/zoom combinations or broad accessibility/cross-engine acceptance. The remaining 102-reference / 17-studio program stays open.


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
