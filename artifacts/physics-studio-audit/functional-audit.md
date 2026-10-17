# Functional verification

- 92 experiment routes passed the tab-availability check; 42 unsupported 3D views are hidden and their old #three-d links select Simulate.
- 16 subject homes passed concept selection and six dedicated lab-link checks at desktop and mobile widths: 96 links in total.
- 38 Astronomy concepts passed scene-relevance checks.
- 102 mapped pages were inspected for navigation groups and extra tool docks. The asset inventory is being expanded to include SVG images.
- Work passed parameter/scene synchronization, prediction, experiment, challenge, play/pause/resume, reset, zoom, four widths and panel-overlap checks.
- Gravitational Field passed model sensitivity, inward vectors, density, graph response, all three views, play/pause, prediction, reset and four widths.

The broader route sweep has 763 passing entries and 96 studio concept selections. It retained 650 prior passing entries with matching expectations and checked the remaining 113 using checkpoints after a browser termination. This is not a fresh exhaustive control test of 763 pages.

Evidence: lab-tabs.json, studio-navigation.json, astronomy-navigation.json, reference-tabs.json, work/verification.json, gravitational-field/verification.json and full-route/lesson-3d-results.json. Every other control/export still needs individual verification under the master specification.

Superposition checkpoint (2026-10-17): original native ripple shader and three linked plots, reference-specific controls, actual clock and probe readings replaced the static generic layout. `superposition/verification.json` records 10,206 model cases, full visible-control checks, six responsive sizes, fallback, no shader/page errors and actual inspector/toolbar non-overlap. It is an explicitly declared cylindrical far-field approximation. `superposition/report.md` records limits; visual water/material/type fidelity and other Waves & Sound pages remain open.

## Standing Waves checkpoint — 2026-10-17

Standing Waves: all three numeric/range controls, harmonic dropdown, five mode buttons, learning dialogs, time scrubbing/recording, answer keys, reset/play/pause, three playback rates, native zoom, actual fullscreen with in-scene exit, assignment locks, SVG fallback and three remounts passed. Six responsive sizes pass overflow, readout/zoom clipping and panel-overlap checks. Chromium only; standing-waves/verification.json.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum: all five source choices, source-menu toggle, both numeric/range parameter controls, keyboard editing, actual camera zoom, playback/reset, physical-time scrubbing, slow/real-time choice, recording, learning answer keys, assignment locks, six responsive sizes, native/SVG synchronization and three remounts passed. Test scope/assumptions in sound-spectrum/verification.json and report.md; Chromium only.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect: all three numeric/range parameters, keyboard editing, actual camera/wavefront zoom at four factors, play/pause/reset, physical slow/real-time playback, finite-track stop/restart, time scrubbing, actual microphone records, pass-by/coincidence, learning answer keys, assignment locks, six responsive sizes, fallback and three remounts verified. Source/observer captions and note/axis overlap checks pass. Chromium only; see doppler-effect/verification.json.

## Reflection checkpoint — 2026-10-17

Reflection: all numeric/range/keyboard controls; primary/secondary top/side cameras; native zoom; light-packet play/pause/reset; physical time scrubbing; recorded model configurations retained on reset; quiz answers; assignment locks; six responsive sizes; startup WebGL fallback; and three genuine SPA Home/back remounts with two canvases verified. Last control remains visible. Evidence in reflection/verification.json and visible-packet-motion.json; Chromium only.


## Refraction checkpoint — 2026-10-17

Preset/custom indices, numeric/range incident angle, play/pause/reset, actual camera zoom, learning dialogs, recording, six sizes, WebGL fallback and three SPA remounts tested. Recorded values explicitly identified as model configurations. Dedicated assignment-lock regression also passed: both medium selectors and angle slider disabled. Visible native packet movement verified independently in canvas screenshots.


## Lenses checkpoint — 2026-10-17

Lenses numeric/range controls, all three types, ray/axis toggles, actual native visibility, camera zoom, reset/play/pause, Predict/Challenge answers, recording/Explain, assignment locks, six sizes, fallback and three SPA remounts passed. Mobile controls moved directly below scene. Image properties are derived outputs, not pretend controls.

Lenses keyboard/touch input and numeric-clamping checks also passed; slider tick labels now follow the linear parameter ranges. One transient screenshot ENOSPC failure was followed by successful suite rerun and PNG validation. Evidence: lenses/input-verification.json.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors parameters, type buttons, all five light switches, native scene object visibility, real camera zoom, play/pause/reset, learning dialogs, recording, answer keys, assignment locks, six sizes, fallback, keyboard/touch and three SPA remounts passed. Finite-screen fixes passed both actual scene-object and final production checks in Mirrors and Lenses.


## Interference checkpoint — 2026-10-17

Interference: all three parameter sliders and numeric controls, three presets, three optical modes, three scene views, pause/play/reset, real orthographic camera zoom, pointer/keyboard/touch detector inspection, learning dialogs, both quizzes and configuration recording passed browser checks. Assignment locks cover model variables, presets, setup selection and detector. Incoherent mode disables common-phase wavefronts with an explanation. Reset retains labeled calculated records and restores time, camera and apparatus defaults. Three SPA remounts and a WebGL-disabled fallback passed. Exactly four reference learning modes; no global 3D dock or additional lesson tabs.


## Diffraction checkpoint - 2026-10-17

Diffraction browser and production checks passed for numeric/range controls, synchronized duplicate slit/circular selectors, all three real camera directions, orthographic zoom, pause/reset, three learning levels, prediction/challenge quizzes, Explain, detector pointer/keyboard/touch inspection, Fresnel selection for both apertures and calculated recording. Assignment locks cover all optical variables including propagation and detector position. Actual native holes were inspected for shape dimensions and absence of solid triangles at their centers; sampled texture channels agree with the model with maximum error 0. The main camera remains unchanged when preview cameras switch. Exactly four reference learning modes and three relevant local camera controls; no extra global 3D dock or lesson tabs.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force passed all numeric/range inputs, charge-sign changes, like/unlike/zero cases, four native overlay toggles, graph inspection, symmetric charge dragging, keyboard sphere controls, touch graph input, actual orthographic zoom, fullscreen, pause/reset, prediction/challenge dialogs, Explain, recording and teacher variable locks. Native sphere positions and actual arrow matrices match the signs. Native field segments align with E (minimum tested cosine 0.999999999), native equipotential endpoints have normalized residual 3.39e-07, and strength pixels agree with the model within Canvas alpha quantization. Three SPA remounts, seven disposed renderer/context pairs, no post-disposal renders, and a WebGL-disabled diagram supporting all overlays passed. Exactly four reference learning modes; no unrelated global 3D or lesson tabs.


## Electric Field checkpoint - 2026-10-17

Electric Field passed source charge and all source/probe XYZ controls, bound normalization, source/probe dragging, arrow-key movement, touch probe dragging, density slider/numeric input, vector visibility, actual orthographic zoom, collapsible Source/Probe/Density panels, pause/reset, learning/recording/quizzes and teacher locks. Source positions were inspected in the actual Three scene, including nonzero depth. Native probe-vector component error is 1.11e-16; sampled native field tangents have minimum cosine 0.999999995. Probe moves reuse the field-geometry attribute. Singular, neutral and coincident-cancellation cases show meaningful undefined/zero states. Three SPA remounts verified seven disposed renderers/context losses with no later rendering; WebGL fallback includes computed curves and arrows. Exactly four reference modes, with no global 3D dock or unrelated lesson tabs.

## Electric Potential checkpoint - 2026-10-17

Electric Potential: four layer checkboxes; three distinct source layouts; z range/number and x/y number/keyboard controls; drag/touch probe; reference selector; reset/play/pause/zoom/fullscreen; Predict/Explain/challenge; recording/CSV and assignment variable locks passed. Point singularity hides the invalid probe, and signed source markers use appropriate plot limits at z=0. Six responsive sizes, repeated remounts and calculated WebGL fallback passed. No captured page errors or failed local requests. See `electric-potential/browser-verification.json` and normal production smoke evidence.

## Electric Potential visual refinement - 2026-10-17

Refinement preserves four modes, layouts, XYZ inputs, references, layers, mouse/keyboard/touch, scan/pause/reset, zoom/fullscreen, records/quoted CSV and quizzes. XY controls moved into Experiment and remain assignment-locked. Light/dark button works. Six default layouts, accurate metric base-plane picking, native and fallback parameter/layer updates and normal production checks passed. No captured page/material console errors or failed local requests.


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
