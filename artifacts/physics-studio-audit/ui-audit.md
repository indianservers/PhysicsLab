# UI audit: current state

The 102 mapped reference pages have captures at their exact target dimensions. Their native learning modes have been inspected; no extra Guide/Quiz/Coach/3D tab labels were found in the mapped-page sweep. The shared floating Studio tools dock is disabled on dedicated reference pages. Relevant Code/Formula and graph controls shown in the Mastery mockup are retained.

Work and Gravitational Field were rebuilt in this pass. Work has procedural apparatus, synchronized force components, displacement and work. Field has the three views named in its reference, generated inward vectors, equipotentials, an analytic orbit and a model-driven logarithmic graph. Existing left navigation was preserved.

Six dedicated lab links are available for each of the sixteen subject home pages. These replace incomplete and mixed cross-subject shortcut lists.

reference-captures/ contains baseline captures, reference-diffs/ contains amplified differences, and visual-comparison.json records MAE and SSIM. Main-region comparison excludes automatically detected target sidebar columns and current main/sidebar bounds, then aligns region widths. Border detection and image comparisons still need visual inspection. Metrics are not acceptance percentages. completion-matrix.md leaves all visual review/refinement gates open.

No reference screenshot regions were inserted into the rebuilt components. Work uses native SVG. Field combines independent existing Earth/starfield assets with native vectors and geometry. Source checks are continuing for remaining assets.

## Standing Waves checkpoint — 2026-10-17

Standing Waves now matches the reference panel arrangement and primary vertical bounds, with original native string apparatus and four learning modes. Deterministic comparison and remaining PBR/typography differences are in standing-waves/report.md. No screenshot assets inserted; sidebar JSX preserved. Visual acceptance remains open.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum now recreates the reference breadcrumb/modes, apparatus with three source cards, three right plots, three lower cards and transport. Original native geometry/procedural materials/icons; no cropped assets. Sidebar retained. Adaptive graph widths preserve phone labels; tablet zoom wraps. Evidence and remaining material/lighting/typography differences in sound-spectrum/.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect now has the reference header/modes, native siren/cart/microphone/track, right controls, lower graph/readings/formula and medium footer. Existing sidebar retained, no reference crops. Phone captions/note no longer overlap, and air fronts are not rendered below the bench. Frozen screenshots and region comparisons in doppler-effect/. Material/lighting/hardware detail and typography remain open.

## Reflection checkpoint — 2026-10-17

Reflection now recreates the reference primary apparatus, right controls/readings/law, transport, independent side view, mirror-frame diagram and calculated data table. Original procedural geometry/textures only; sidebar retained. Fixed clipped Ray Count and controlled environment glare. Main impact/protractor centres coincide and rays use true selected angles. Native material/lighting/detail/type refinement remains open; evidence in reflection/.


## Refraction checkpoint — 2026-10-17

Reference header, four learning modes, full-width bench, overlaid controls, three lower cards and transport rebuilt. Sidebar preserved; no cropped assets. Six screenshots and sidebar-excluded comparison saved. MAE 16.093, SSIM 0.6354. Materials, lighting, fine apparatus detail, arcs and typography remain open.


## Lenses checkpoint — 2026-10-17

Lenses now follows its reference layout: four learning modes, native bench, ray toggles, image properties, three lens cards, inspector/equations and transport. Sidebar unchanged; no cropped assets. Six sizes captured. MAE 19.218, SSIM 0.6057, with sidebar excluded and main width normalized. Material/lighting, hardware detail, typography and illustrated-scale differences remain open.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors now follows the reference header/four-mode/scene/parameter/lower-card/transport structure, using original native apparatus. Sidebar JSX preserved. Light controls relocated into the main scene to honor that exception. Real-image placement corrects the contradictory mockup. Six responsive sizes captured; MAE 20.169, SSIM 0.5567. Material, lighting, hardware and typography refinement remains open.


## Interference checkpoint — 2026-10-17

Interference now uses its reference header, four learning modes, three scene views, native apparatus, three lower parameter controls/presets, right readings/profile/equations and transport. The original sidebar JSX is unchanged. No screenshot pixels or reflection photograph are application assets. Six viewport screenshots show no horizontal overflow or clipped formula content. Camera framing, original PBR materials and instrument details still differ from the photograph. Sidebar-excluded, width-normalized MAE 18.308, SSIM 0.5491; these are diagnostics, not completion percentages.


## Diffraction checkpoint - 2026-10-17

Diffraction now follows its reference-specific layout: breadcrumb/four learning modes, a large native apparatus, right aperture selection/profile/readings, and lower aperture close-up, controls, equation and 3D camera preview. Top/Side/Front are explicitly present in the mockup and retained as working camera controls. The existing sidebar JSX is unchanged. No screenshot crops or reflection photograph are used. Six sizes have no horizontal overflow or clipped cards, and desktop transport fits. Sidebar-excluded, width-normalized MAE 19.949, SSIM 0.5723; these are diagnostics, not acceptance percentages. Photographic material/background realism, apparatus composition and detailed typography remain open.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force now follows the reference header/four-mode, native apparatus, right controls/readings/equation/log graph and bottom transport layout. Sidebar JSX is unchanged; the reflection photograph is removed. Original spheres, supports, perforated table, ruler and calculated overlays replace the placeholder. Page-scoped rules correct the competing global gutter and an intrinsic grid-height issue that overlapped scene and toolbar on short desktops. Six viewport sizes now have no horizontal overflow, clipped cards or scene/transport overlap. Sidebar-excluded width-normalized MAE 20.01, SSIM 0.5446; these are diagnostic measurements, not completion percentages. Photographic background, sphere/support material detail, fine hardware and typography remain open.


## Electric Field checkpoint - 2026-10-17

Electric Field now follows its reference-specific header/four-mode, projected field/grid, source XYZ, probe XYZ, vector toggle, density, net/contribution readings, equation/definitions and transport layout. Original native spheres/glows, probe/vector, grid and integrated field curves replace control-independent SVG Bezier curves. Sidebar JSX is unchanged and no reference pixels are application assets. Original SVG panel icons replace unrelated text glyphs. Six sizes have no horizontal overflow, clipped cards or scene/transport overlap; desktop transport fits. Sidebar-excluded, width-normalized MAE 14.572, SSIM 0.5988; these are diagnostics, not acceptance percentages. Glow/material detail, curve rendering, typography and composition remain open. Correct metric positions, a consistent 0.5 m scale and calculated probe direction intentionally differ from inconsistent mockup artwork.

## Electric Potential checkpoint - 2026-10-17

Replaced the decorative SVG with a calculated native potential mesh, source/probe markers, base contours, grid and voltage axis. Rebuilt controls, readings, equations, four reference learning modes and transport; sidebar JSX preserved. Main-region MAE 24.214 / SSIM 0.5268 versus old 20.398 / 0.5805: both global metrics are worse. No visual completion claim. Camera/color/contour/glyph/typography and mobile overlay refinement remain open. Six after screenshots, reference comparison and difference are saved in `electric-potential/`.

## Electric Potential visual refinement - 2026-10-17

Refined native framing, sign-colored contours, source projections and grid walls; expanded the plot to +/-100 kV so default peaks are not flattened. Matched header mode widths, original SVG controls, source/control spacing, scientific energy and larger display equations more closely. Numeric XY controls remain under Experiment. Added functional local light/dark view. Small-screen framing keeps source glyphs below the legend/layers; sidebar source and header/nav pixels remain unchanged within one channel level. Main-region MAE 19.224 / SSIM 0.5299, versus prior native 24.214 / 0.5268: both metrics improved versus the prior native checkpoint; SSIM remains below the static baseline and visual acceptance remains open.


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
