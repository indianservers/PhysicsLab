# Magnetism Electromagnets

- Mockup: `12_magnetism/06_electromagnets.png`
- Route: `/magnetism/electromagnets`
- Status: IN PROGRESS — initial native rebuild; full acceptance unproven.

The previous VERIFIED claim is withdrawn. Its unexplained field multiplier and saturation gauge did not establish a consistent nonlinear magnetic circuit. The old default numbers are not acceptance criteria.

The rebuilt page keeps the existing sidebar markup and the four reference modes Observe, Predict, Experiment and Explain. No 3D/view tabs are introduced. Theme, fullscreen, zoom, reset and electrical playback are implemented. The native scene uses original Three.js geometry, actual instanced winding turns, two vertical pole gaps and a fixed armature/load fixture; no reference-image crops are used. This differs from the ambiguous horizontal pole geometry in the reference to give lifting force a coherent direction.

The illustrative uniform magnetic circuit solves NI = ℓH + gB/μ₀ with B = μ₀[H + Mₛ tanh(H/H₀)]. Two pole faces give F = AB²/μ₀. Electrical start-up obeys dλ/dt = V − RI, with differential inductance and energy derived from the same constitutive law. Copper resistance follows actual ideal layered winding length. Material constants are illustrative; fringing, leakage, hysteresis, eddy currents, heating, crossover and lead length are omitted. The fixed-gap fixture does not simulate free lifting motion.

Initial evidence (2026-10-17): `npx tsc -b --pretty false` exited 0. `node scripts/testElectromagnetModel.mjs` passed 36 configurations, Ampere residual ≤1.82e−12 At, energy balance residual ≤5.42e−9 J, differential-inductance relative error ≤1.68e−9, virtual-work force relative error ≤8.34e−8. Independent RK4 errors fall from 2.46e−6 A at 10 steps to 5.42e−10 A at 80 steps. `node scripts/testElectromagnetInitial.mjs` passed eight viewport bounds checks, pause stability, recording, theme and zero-current playback, with no page errors. Screenshots and raw JSON are under `artifacts/physics-studio-audit/electromagnets/`.

Open: full control/CSV data validation, touch and keyboard exercise, native coordinate and disposal instrumentation, controlled clock invariance, fallback exercise, independent winding convergence, production build/smoke, regional image comparisons, and material/lighting refinement. The current material finish is visibly simpler than the photographic reference. Bounds checks alone do not prove absence of interior clipping; initial screenshot inspection caught controls clipping and an over-wide tab row, both corrected and recaptured.

Scientific background: MIT OpenCourseWare, *Electromagnetic Fields and Energy*, chapter 11 (energy, dissipation and magnetic force/coenergy): https://ocw.mit.edu/courses/res-6-001-electromagnetic-fields-and-energy-spring-2008/pages/chapter-11/ . Numerical checks establish internal model consistency, not agreement with a calibrated real magnet.


## Native verification checkpoint — 2026-10-17

Full browser verification now passes eight viewports with interior bounds checks, actual native turn counts and pole gaps, flux directions, all five zooms, lab theme/fullscreen, prediction, keyboard mode navigation, 17-column CSV parsing, blank unknown steady energy history, transient energy balance, record persistence/clear and a graded configuration challenge. Repeated SPA navigation disposes seven native renderer instances and 917 tracked scene resources (PMREM/environment cleanup is separate from that tracked count).

Controlled 10/30/60 fps playback agrees at one wall second: model time 0.101837234799 s, current 1.939412228751 A and gap field 0.373174754725 T. Pause adds zero render frames. Repeated hidden-frame advances, automatic stop, replay and route-unmount clock removal pass. The hidden-frame guard was added after reviewing the clock logic. Real CDP touch gap changes and touch play/pause pass; calculated no-WebGL geometry, all zooms and zero-current flux visibility pass. Independent winding polygon convergence and nonlinear transient quadrature convergence pass. The initial 8192-segment winding test was too coarse for the smallest corner radius; refinement to 32768 segments proves the specified error bound without changing the model.

Production build session 3395 exited 0; Vite finished in 27.31 s and PWA generated 1263 precache entries (327006.97 KiB). Normal unmasked production smoke on owned port 4199 exited 0, testing keyboard turns, six rapid pause/resume cycles, CSV energy, theme, zoom and desktop/breakpoint/mobile interior bounds. The first keyboard assertion raced React rendering; the verifier now waits for the numeric input to reflect the actual change. Repository physics tests: 581/581 passed. Four source hashes are saved and checked against current files.

Screenshot diagnostics excluding the preserved sidebar: baseline MAE 31.863 / SSIM 0.4934; native MAE 33.018 / SSIM 0.4916. This is not an improvement in those global metrics. Regional comparisons, difference image, responsive contact sheet and visible electrical-startup evidence are saved. Visual fidelity remains open: material/lighting/background and corrected apparatus composition differ substantially. No percentage-completion claim is made. Source sidebar markup equals HEAD.

The earlier open verification list is superseded for the gates described above; full visual acceptance and empirical material calibration remain unproven. See `verification-status.json` for current limitations. No claim that all 102 reference pages are complete.
