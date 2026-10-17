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
