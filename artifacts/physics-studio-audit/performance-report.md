# Performance status

This change removes unavailable render panels and their navigation entries; it does not change simulation loops or numerical time steps. No controlled frame-rate, memory, or repeated-navigation benchmark was performed in this pass. The production bundle still produces Vite's large chunk warning. Claims of target performance or leak-free behavior remain unverified.

## Standing Waves checkpoint — 2026-10-17

Standing Waves local headless sample: 60 frames averaged 34.48 ms/frame (about 29 fps), maximum 34.90 ms. Native geometry/buffers are reused; static formula/mode thumbnails do not rebuild each frame. Three remounts leave one canvas each and no console errors. This narrows the earlier unmeasured status for this page only; cross-browser, long-run memory and target-device smoothness remain open.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum local headless sample: 60 frames, mean 6.90 ms, maximum 7.10 ms. Foam ridges use instancing; spectral calculation and static plots cache by source parameters; one clock/resize observer and explicit GPU cleanup. Three remounts yield one canvas each, no console errors. This is a limited local measurement; cross-browser, target-device and long-duration memory acceptance remain open.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect: local headless 60-frame sample mean 9.27 ms, maximum 14.20 ms. One analytical parent clock, reusable native geometry, bounded emission-front history and explicit observer/GPU cleanup; three remounts leave one canvas and no normal-run console errors. Limited observation only; long-run memory, cross-browser and target-device performance remain open. Global large-bundle warning remains.

## Reflection checkpoint — 2026-10-17

Reflection: two views share one model clock; instanced rays/packets and explicit observer/GPU/context cleanup. Three SPA unmount/remount cycles retain two canvases and produce no normal-run console errors. Local 60-frame headless observation mean 12.61 ms, maximum 20.90 ms. Extended memory, target-device and cross-browser acceptance remain open; global bundle-size warning persists.


## Refraction checkpoint — 2026-10-17

Refraction caches the trace by parameters, reuses ray/packet instanced meshes, renders on state/resize updates, and disposes geometry/materials/textures/environment/renderer at unmount. Three SPA remounts tested. A 60-frame headless Chromium sample averaged 9.46 ms, maximum 14.10 ms (host-specific). GPU-memory/leak profiling remains open; three remounts alone do not prove memory stability.


## Lenses checkpoint — 2026-10-17

Lenses caches model by configuration, reuses ray/marker instance meshes, disposes resources, and owns no independent animation loop. Three SPA remounts passed. A 60-frame headless host sample averaged 7.08 ms, max 13.90 ms. GPU-memory/leak profiling and cross-device measurements remain open.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors reuses geometry/materials/instanced rays and markers with explicit resize/clock/GPU cleanup. Three SPA remounts checked. A 60-frame headless host sample averaged 6.84 ms, max 7.10 ms. Optional remote fonts no longer block production startup; four deliberately pending stylesheets did not prevent canvas readiness, and later style activation passed. Large-bundle/precache size, cross-device and long-run memory acceptance remain open.


## Interference checkpoint — 2026-10-17

Interference: the aperture profile is memoized by optical configuration; detector/time updates do not recalculate the 2,049-sample profile. Native meshes reuse box/cylinder geometry, instanced rays and markers, a dynamic wavefront buffer and a procedural screen texture updated only on model changes. One parent RAF advances physical time; cleanup cancels it, disconnects observers and disposes geometry/materials/textures/renderer/environment on unmount. Three remounts passed. This is code/resource-lifecycle evidence, not a long-duration memory or frame-rate benchmark. Extended GPU memory and cross-browser performance remain unverified. One browser launch failed from temporary disk exhaustion; stale-profile cleanup was policy-rejected and not performed. A subsequent fresh run passed after authoritative free-space checks.


Final Interference gates: `npm run build` exited 0 (TypeScript, Vite and PWA); shared physics checks passed 581/581; production smoke passed with native canvas, modes/presets/views, detector/reset, mobile transport and unclipped short-desktop formula/toolbar. Build still warns about the existing large main chunk (5,382.96 kB) and broad PWA precache (1,247 entries / 326,559.94 KiB). These application-wide performance issues remain open. Per-lab `verification-status.json` records source hashes and terminal results.


## Diffraction checkpoint - 2026-10-17

Diffraction caches quadrature nodes and memoizes aperture profiles; time and detector changes do not rebuild the optical profile. Original meshes reuse geometry; aperture extrusion is replaced only for aperture type/size changes, and both rendered views dispose resources on unmount. Three SPA remounts verified 14 disposed renderers/context losses with no later renders. While paused, the main renderer produced zero additional frames over 200 ms. Actual marker matrix coordinates agree with the model within 1.4e-08 m; Float32 speed relative error 6.53e-06. This is lifecycle and coordinate evidence, not an extended GPU memory/FPS benchmark. Full build/PWA passed. The application-wide main bundle (5383.07 kB) and precache (1249 entries / 326600.64 KiB) remain large; extended memory, additional browser engines and broad loading optimizations remain open.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force memoizes model/streamlines/contours and skips unchanged parameter updates. Field-strength pixels are regenerated only for source changes when enabled; contour meshes are built only when enabled. Instanced direction markers reuse geometry; replaced line/surface GPU buffers are explicitly disposed. Route cleanup disconnects observers and disposes original geometry/materials/textures/environment/renderer/context. Three SPA remounts verified seven disposed renderers with no further rendering. Runtime inspected 232 native marker matrices, maximum coordinate error 1.85e-08 m and minimum local-E direction cosine 1.0000000000. Paused renderer produced zero additional frames over 200 ms. This is lifecycle/coordinate evidence, not a long-duration GPU-memory or frame-rate benchmark. Full TypeScript/Vite/PWA build passed; broad application bundle/precache size, extended memory, additional browser engines and responsive focus order remain open.


## Electric Field checkpoint - 2026-10-17

Electric Field memoizes source geometry/curves separately from probe coordinates and inspection time. Probe-only changes reuse curve GPU buffers; source/density changes replace and dispose them. Instanced fixed/moving arrows share geometry and instance colors. Original grid/glow resources, observers, renderer and context are disposed on unmount; parent RAF is cancelled. Three SPA remounts verified seven disposed renderers with no further renders. Runtime inspected 358 actual instance matrices: max coordinate error 1.24e-07 m, minimum local-E direction cosine 1.0000000000. Paused main renderer produced zero frames over 200 ms. These are lifecycle/coordinate checks, not extended GPU-memory/FPS benchmarks. Full TypeScript/Vite/PWA build passed; broad app precache remains large (1252 entries / 326682.97 KiB). Additional engines, long-duration memory/FPS and global bundle optimization remain open.

## Electric Potential checkpoint - 2026-10-17

Electric Potential caches mesh/contours across probe scans and reuses guide buffers; no idle rendering after pause (200 ms observation). Seven disposed renderer/context pairs observed across StrictMode/remounts. Deterministic native scan reaches 0.10000000000000142 m after 0.5 s. Final TypeScript/Vite/PWA build passed; existing bundle warning and roughly 327 MB PWA precache remain. These checks do not establish long-duration memory or cross-engine/FPS acceptance.

## Electric Potential visual refinement - 2026-10-17

Native camera and sampled geometry reuse across probe updates; memoized SVG fallback avoids rebuilding its static mesh for probe-only movement. Seven renderer/context lifetimes and 147 geometry/material disposals after final use verified across remount activity; zero idle renders after pause in 200 ms. Build passed; existing main-bundle and roughly 327 MB PWA precache limitations remain. Long-duration GPU/memory/FPS and other browser engines remain unverified.


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
