# Test results

- npm run build: PASS, including TypeScript, Vite and service-worker generation. build.log contains output. A large chunk warning remains.
- npm run test:physics: 581/581 existing checks PASS.
- npm run test:concepts: 16/16 existing checks PASS.
- auditLabTabs.mjs: 92/92 routes PASS.
- auditStudioNavigation.mjs: 16/16 subject homes PASS, including 96 dedicated links at desktop/mobile widths.
- auditAstronomyNavigation.mjs: 38/38 concepts PASS.
- auditLesson3D.mjs --resume: 763 passing entries; 650 reused and 113 rechecked during this pass. Full logs and JSON checkpoints are saved.
- testWorkStudio.mjs: PASS, including analytical cases, synchronized SVG geometry, learning modes, playback, reset, zoom and four viewport/overlap checks.
- testGravitationalFieldStudio.mjs: PASS, including numerical default, inverse-square sensitivity, density/direction, graph updates, three views, playback, prediction, reset and four widths.
- captureReferencePages.mjs: 102/102 matching-size captures.
- compareReferencePages.py: 102/102 measured comparisons. This does not establish visual acceptance.
- Initial feature matching: 49 image/reference pairs, no flagged shared-image regions. SVG-image coverage is being added. Feature matching is not proof of provenance.

Initial shared-page browser runs terminated and were resumed with fresh pages. Initial screenshots used a default viewport; those were replaced with correctly sized captures. One heading wait assumed h1; it was corrected to support pages whose reference uses an h2 heading.

Rebuild checkpoint: six oscillation routes re-inspected with `node scripts/auditReferenceTabs.mjs --routes=/motion/spring-shm,/motion/pendulum,/motion/energy-exchange,/motion/damping,/motion/resonance,/motion/coupled-oscillators`. All four reference learning modes present, extra dock absent. Latest primary regression: 581/581 passed; raw output `resonance/physics-regression.log`. New Resonance/Coupled functional and physics details are in their per-page reports. These checks do not recertify the rest of the inventory or establish visual completion.

Wave Properties checkpoint (2026-10-17): native instanced wave machine, transverse/longitudinal models, position/time plots and all reference controls rebuilt. `wave-properties/` contains model/browser/build evidence, screenshots and visual differences; `scripts/testWavePropertiesRebuild.mjs` passed 2,754 model cases and six responsive browser sizes. Broad physics regression 581/581 and production build pass. Material/header/type refinements remain open; full inventory not complete. The next Waves & Sound page, Superposition, still has static apparatus and missing time-dependent wave combination/view controls and is not counted as rebuilt.

Superposition: reference layout and shared source-field/scene rebuild verified with 10,206 model cases, all visible controls, six responsive sizes, disabled unsupported fallback camera and three navigation cycles. Broad regression remains 581/581. Native water/material and type fidelity remain open; raw evidence in superposition/. This is a per-page milestone, not a completed global audit.

Interference checkpoint: rebuilt the native tank/reference layout and fixed the centimetre/metre intensity error and unsigned-phase calculation. `interference/verification.json` includes 450 cases with 400-sample time averages each, controls, six responsive sizes, all-panel non-overlap/readout clipping checks, fallback and three remounts. Shared regression passed 581/581. Exact water material/type fidelity and full inventory acceptance remain open.

## Standing Waves checkpoint — 2026-10-17

Standing Waves: dedicated suite passed 540 parameter/time cases and browser checks for all controls, actual instance matrices, fullscreen, SVG fallback, three remounts and six sizes. Shared regression: 581/581 passed. Raw evidence in standing-waves/verification.json, verification.log and regression.log. Production build passed TypeScript, Vite and PWA, recorded in standing-waves/build.log. Production-preview smoke is separately recorded in production-smoke.json. This checkpoint does not recertify untouched pages.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum dedicated suite passed 720 signal/source/frequency/gain/time cases plus direct DFT, Parseval, Hann normalization and noise checks. Browser verified all sources/controls, actual cone-to-waveform signal consistency, six responsive sizes, three remounts and SVG fallback. Shared regression passed 581/581. Raw evidence in sound-spectrum/verification.json, verification.log and regression.log. Production build and production-preview smoke passed, including the updated noise labels/equation. Evidence: sound-spectrum/build.log and production-smoke.json. Untouched pages are not recertified.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect dedicated suite passed 900 motion/time cases and 225 crest-arrival cases, retarded-distance/frequency checks, all controls, actual source/microphone positions and ellipse projection, pass-by/coincidence, track-end restart, six sizes, fallback and remounts. Shared regression 581/581 passed. Evidence in doppler-effect/verification.json, verification.log and regression.log. Production build and final production-preview smoke passed, including coincidence handling and phone note position. Evidence: doppler-effect/build.log and production-smoke.json. Untouched pages are not recertified.

## Reflection checkpoint — 2026-10-17

Reflection dedicated suite passed 2,853 configuration checks and 22,950 packet samples, including all 0.1° mirror settings at boundary incidences and a reproduced/fixed acos roundoff regression. Actual native ray/packet matrices, visible pixel motion, both camera selectors, all controls, calculated/recorded table, six sizes, fallback and three SPA remounts verified. Shared regression 581/581 passed. Evidence in reflection/verification.json, normal-incidence-regression.json, visible-packet-motion.json and logs. Production build and final production-preview smoke passed, including the rotated-normal regression and current receiver-plane explanation. Evidence: reflection/build.log and production-smoke.json. Untouched pages are not recertified.


## Refraction checkpoint — 2026-10-17

Refraction model suite passed 4,525 interface and 4,525 trace cases. Browser suite passed six sizes, default readings, controls, navigation and fallback. Shared physics regression passed 581/581. Evidence: refraction/model-verification.json, browser-verification.json, screenshots. Production build/smoke recorded separately when available; other pages not recertified.

Refraction production type-check/build/PWA passed; final tablet CSS bundle refresh passed. Production smoke verifies native canvas, default angles, grazing missed optics and current air-gap explanation. Evidence: refraction/build.log and production-smoke.json.


## Lenses checkpoint — 2026-10-17

Lenses dedicated model/browser/runtime suites passed; shared physics regression 581/581 passed. Artifacts in lenses/model-verification.json, browser-verification.json, runtime-verification.json and visible-packet-motion.json. Build/smoke status recorded separately; unrelated pages not recertified.

Lenses keyboard/touch input and numeric-clamping checks also passed; slider tick labels now follow the linear parameter ranges. One transient screenshot ENOSPC failure was followed by successful suite rerun and PNG validation. Evidence: lenses/input-verification.json.

Lenses full production build/PWA, final bundle refresh and final production smoke passed. Evidence: lenses/build.log, final-bundle.log and production-smoke.json. Final source type-check is tracked separately.

Lenses final source type-check completed successfully (exit 0), closing the pending verification. Native visual refinement remains open.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors model/browser/native/runtime/control suites and shared 581/581 regression passed. Six production layout captures and touch check passed. Early font-dependent navigation timeouts led to a tested optional-font startup correction: all four font CSS requests can remain pending while the app starts, and styles activate after release. Final current-source type-check, build/PWA, bundle, both production smoke tests and screen-boundary gates passed; mirrors/verification-status.json records the evidence.

Final Mirrors/Lenses release checks passed: 6,992 mirror model cases and 2,208 lens cases with finite-screen regressions; actual large-virtual-image framing; current-source type-check; full build/PWA; final bundle; both production smoke tests; 12 final responsive screenshots; touch; and stalled-font startup plus subsequent style activation. Short desktop toolbars fit 1920 x 912 without clipped inspector controls. Logs and JSON evidence are under mirrors/ and lenses/. The full studio goal remains open.


## Interference checkpoint — 2026-10-17

Interference model and browser gates passed: 180 configurations / 1,620 positions, finite-window energy bounds, far-field/narrow-width comparisons, convergence, native ray/texture/phase checks, all controls, three modes/views/presets, pause/reset/zoom, recording/quizzes, mouse/keyboard/touch detector, six viewport sizes, three remounts, assignment locks and fallback. Native ray maximum error 5.37e−9 m; screen texture maximum channel error 0; 787 rendered pixels changed by >20 levels between physical times 0 and 0.37 ns. Browser page errors, material console errors and failed local requests: zero. Optional external requests excluded for deterministic browser verification. Production/build and current shared-regression results are recorded in the final gate note and per-lab status below.


Final Interference gates: `npm run build` exited 0 (TypeScript, Vite and PWA); shared physics checks passed 581/581; production smoke passed with native canvas, modes/presets/views, detector/reset, mobile transport and unclipped short-desktop formula/toolbar. Build still warns about the existing large main chunk (5,382.96 kB) and broad PWA precache (1,247 entries / 326,559.94 KiB). These application-wide performance issues remain open. Per-lab `verification-status.json` records source hashes and terminal results.


## Diffraction checkpoint - 2026-10-17

Diffraction terminal gates: 240 model configurations / 1680 sampled positions; 12 finite-window power bounds; independent SciPy validation of 216 complex Fresnel fields and 6001 Bessel arguments; native hole/texture/camera checks; all visible controls, pointer/keyboard/touch, assignment locks, learning/recording, both aperture/propagation models, six viewport sizes, three SPA remounts and WebGL-disabled circular fallback passed. Page errors, material console errors and failed local requests were zero in deterministic browser tests. Rendered packet motion changed 101 stage pixels by more than 20 levels. Native propagation/lifecycle checks and production smoke passed. `npm run build` exited 0 (TypeScript/Vite/PWA), and `npm run test:physics` passed 581/581. Browser layout tests exclude optional external requests; production smoke uses the normal local bundle and reports zero page errors and failed local requests.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force terminal gates passed: 343 force/field configurations and potential-gradient checks, 66290 tested field-line segments, RK4 convergence, 6104 refined contour endpoints, all controls, actual native sphere/arrow/field/surface/strength checks, mouse dragging, keyboard/touch, assignment locks, fullscreen, recording/quizzes, six viewport sizes, three SPA remounts, resource disposal and fallback overlays. Browser page errors, material console errors and failed local requests were zero. Runtime compared 232 native direction-marker matrices with the model and observed zero paused frames over 200 ms; 3104 rendered pixels changed by more than 20 levels from inspection time 0 to 0.37 seconds. Full `npm run build` passed (TypeScript/Vite/PWA), current shared physics tests passed 581/581, and production smoke passed including the corrected ruler font/aspect ratio. Optional external requests are excluded for deterministic browser layout tests; production smoke uses the normal local bundle.


## Electric Field checkpoint - 2026-10-17

Electric Field terminal gates passed: 144 configurations, 432 potential-gradient checks, 67398 streamline-segment direction checks, default step-size convergence, source singularity without softening, coincident and nonzero-source cancellation, zero/axial direction semantics and density independence. Browser checked all source/probe XYZ controls, actual 3D positions/vector directions, probe geometry reuse, density, panel collapse, vector visibility, zoom/pause/reset, mouse/keyboard/touch, assignment locks, learning/recording, six sizes, three remounts and fallback. Page/console/local-request errors were zero in deterministic local tests. Runtime compared 358 native marker matrices and observed zero paused frames over 200 ms; 1897 rendered pixels changed by more than 20 levels between inspection times 0 and 0.37 seconds. Full `npm run build` exited 0 (TypeScript/Vite/PWA); current shared physics checks passed 581/581. Production smoke passed normal bundle startup, default values/direction, depth/axial/singular cases, density, collapse/keyboard/vector/recording controls and desktop/mobile layout. Production keyboard check waits for the controlled input's asynchronous value effect rather than assuming immediate passive-effect completion.

## Electric Potential checkpoint - 2026-10-17

Electric Potential: 225 configurations / 675 finite-difference derivatives (max relative discrepancy 2.464e-9); 20/40/80/160 cell convergence (80-cell contour RMS 24.911 V -> 160-cell 6.237 V); native vertex error <=5.959e-8 diagram units; timed scan error 1.416e-15 m; all controls, mouse/keyboard/touch, assignment locks, six sizes, seven disposed native contexts and fallback passed. Production preview 4190 and final `npm run build` exit 0; `npm run test:physics` 581/581. Comparison MAE 24.214 / SSIM 0.5268, both worse than old 20.398 / 0.5805; visual acceptance remains open. Full evidence in `electric-potential/`.

## Electric Potential visual refinement - 2026-10-17

Electric Potential refinement: 225 configurations / 675 derivatives; four grid resolutions; native mesh max error <=5.959e-8 diagram units; 3171 positive / 1142 negative / 207 zero native contour signs checked; metric picking, all controls/modes, theme, CSV numeric parsing, locks, six sizes and fallback updates passed. Seven disposed renderer/context pairs / 147 disposed geometry-material resources. Timed scan/reflection/resume passed; final build and production exit 0; 581/581 shared physics tests passed. Main-region MAE 19.224 / SSIM 0.5299, versus prior native 24.214 / 0.5268: both metrics improved versus the prior native checkpoint; SSIM remains below the static baseline and visual acceptance remains open.


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
