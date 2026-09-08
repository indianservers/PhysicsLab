# Concept Overview - Experiment Launcher

Route: `/experiments`. Reference: `01_concept_overview/04_experiment_launcher.png`, 1536 x 1024.

Status: VERIFIED. All completion gates pass. The preceding three pages remain VERIFIED. Historical iteration notes below record defects resolved by the final pass.

## Integration and preservation

The complete existing ExperimentsPage was inspected before integration. The plain route now renders the lazy-loaded ExperimentLauncherPage; Library and any query URL retain ExperimentLibraryPage, including existing filters, syllabus views, constellation map, curriculum links, lesson IDs and datasets. Dedicated application styling applies only to the exact /experiments path.

The new page has five studio models, sidebar navigation/panels, configuration selectors, all parameter sliders, Live Values and Setup tabs, model equations and charts, gallery selection, Observe/Predict/Experiment/Explain modes, pause/play, zoom, fullscreen, dark/light themes, notebook persistence, measured analytics and learning stages. Three difficulty levels select distinct question banks. Precision equipment offers finer control steps and halves the optical beam radius. White-light equipment uses seven incident wavelengths; it hides the irrelevant single-wavelength slider and reports the source band.

## Scientific model and corrections

- Optics: Snell refraction at both faces of a 60-degree prism. For air, n=1.52 and 30-degree incidence, internal refraction is 19.204897497 degrees, correcting the reference's 18.1. Second internal angle is 40.795102503 degrees, exit angle 83.265863402 degrees, deviation 53.265863402 degrees. Unpolarized direct Fresnel transmission is about 0.4553. Secondary internal reflections and absorption are omitted.
- A monochromatic 532 nm source remains monochromatic, correcting the reference rainbow. The white-light kit shares incident power equally among 410, 450, 490, 532, 580, 630 and 680 nm. Its displayed central-angle diagram uses 532 nm. Educational Cauchy dispersion uses B=0.004 micrometre squared, referenced to the selected index at 532 nm.
- The graph is an ideal Gaussian beam profile in an ideal 100 mm angular-to-position relay, calibrated to the default deviation. It is model data, not measured experimental data or a complete finite optical train. TIR and beam peaks outside the plotted window receive distinct graph messages.
- launcherRayGeometry intersects the prism faces using calculated ray angles. TIR's first reflected segment stops at the next boundary. The bench rotates the prism around the fixed entry point and applies the same affine projection to internal and outgoing directions. A separate true-angle diagram avoids interpreting perspective angles as measurements.
- Pendulum: linear small-angle model, maximum 10 degrees, g=9.81 m/s squared. Length changes visible string length and period; mass changes energy but not period. A rolling eight-second graph and a current-reading marker follow the same angle as the bob.
- Circuits: signed I=V/R and positive dissipated P=V squared/R. The scene has a closed return path. The printed resistor value follows the control; misleading fixed color bands were removed. Its graph marks the operating point.
- Thermal: water begins at 20 C; c=4184 J/(kg K); ideal heating stops at 60 seconds. Parameter bounds stay below boiling. Water level follows mass, the thermometer is immersed, and the graph marks current temperature.
- Sound: sinusoidal pressure over 0-2 m, speed 343 m/s, wavelength v/f. Playback is explicitly 0.002 times real time and elapsed time uses four decimals. Scene and graph use the same phase.

## Visual implementation and iteration

Files: ExperimentLauncherPage.tsx, experiment-launcher.css, LauncherScene.tsx, LauncherGraph.tsx, LauncherRayDiagram.tsx and lib/experimentLauncher.ts.

A separate generated empty laboratory image provides room, shelves and tabletop. A generated transparent laser housing supplies photographic hardware material. Rays, prism geometry, apparatus supports, controls and graph data remain rendered from code. Neither asset contains the full mockup or its interface.

Gallery previews use studio-specific viewBoxes without miniature labels. The brand is a faceted SVG mark. Prism projection was changed from a flattened box-like appearance to a triangular cross-section with shallow extrusion. Added laser cable detail. Replaced a zero-height gradient path that made the pendulum support disappear. Light-theme colors now remain readable on panels and the retained dark scene/sidebar.

Screenshot review found and fixed a collapsed chart at 1280 x 720. Short desktop windows now retain sufficient workspace height. On mobile, tiny duplicate bench annotations are hidden; the full true-angle diagram is available in Explain. The bench is shorter and its status label is larger. Readings and equations remain visible below it.

## Evidence

Artifacts directory: `artifacts/studio-rebuild/04-experiment-launcher`.

- `node scripts/testLauncherPhysics.mjs`: eight passing groups, including Snell/Fresnel/TIR boundaries, dispersion, Gaussian profiles, four other models, ray-face intersections and moving-graph/current-angle agreement. Output: physics-results.json.
- `node scripts/testExperimentLauncher.mjs`: ten passing groups. Covers all five studios and gallery buttons, every slider minimum/maximum, equipment/reset, three challenge levels, wrong answers, prediction transition, notebook persistence and blocked-storage feedback, direct refresh, analytics, themes, fullscreen, zoom, modes, stages, settings, next challenge, catalog and query preservation, and registered full-lab targets. Output: interaction-results.json.
- Six viewport PNGs: 1536x1024, 1440x900, 1280x720, 1024x768, 768x1024 and 390x844. No horizontal overflow or missing HTML images. Graph heights respectively 200, 151, 170, 170, 211 and 206 px. Inspected all sizes during the comparison loop; light.png verifies settled light-theme colors.
- Seven scenario PNGs from captureLauncherCases.mjs: TIR, white light, high incidence, long pendulum, negative voltage, low-mass heating and high-frequency sound. These exposed the support, resistor and thermometer corrections. The most recent circuit return path was added after its scenario capture; recapture it in the next material pass.
- `node scripts/checkLauncherRoutes.mjs`: all five actual full-lab destinations loaded with their existing experiment breadcrumb titles; none rendered the launcher. Output: route-results.json. The initial heading-only assertion was corrected after inspecting the existing lab DOM.
- `node scripts/measureExperimentLauncher.mjs`: 90 frames per dynamic model. Median 7 ms for all three; p95 mechanics 14 ms, thermal 13.8 ms, waves 7.1 ms; no sampled interval over 50 ms. Output: frame-timing.json. This is local headless-Chrome evidence, not a universal device guarantee.
- `npm run build`: final source build passed, exit 0, including PWA generation with 721 precache entries. Output: build.log. An earlier build overlapped a source write and read an incomplete file; it was rerun only after the source was complete. Existing large-chunk advisory remains.
- No launcher-specific browser errors/warnings were recorded. Existing React Router future-version migration notices are retained separately in interaction-results.json.

## Remaining before VERIFIED

Revisit room/board placement and detector/relay framing against the reference before accepting the final desktop comparison. Preserve current physics and interaction evidence after further refinements. Do not begin Compare Phenomena yet.

### Laser housing generation prompt


Built-in imagegen, product-mockup: one photorealistic isolated scientific optical-bench laser housing on genuine transparency. Long horizontal black anodized precision rectangular body, nearly side-on with slight top/right-end perspective, right-facing concentric lens barrel, silhouette roughly 3.3:1. Small hex bolts, ventilation ridges, metal microtexture, silver edges and cool overhead reflections. Dark aperture; no beam, glow, text, UI, scene, tabletop, legs, cable or external ground shadow. Tightly framed with breathing room. Used as one replaceable hardware component in the working simulation.

## Hardware and overlay refinement

- Added LauncherHardware.tsx with recessed rail channel, fasteners, feet, post sleeves, clamp screws and machined bases. The dynamic model geometry is unchanged.
- Improved room brightness and added the reference's translucent wall plaque as SVG. Added a separately generated transparent goggles asset at `public/assets/experiment-launcher/safety-goggles.png`, only in the optics foreground. The actual alpha channel was checked and the browser asset-decode test passes.
- Added LauncherCircuitApparatus.tsx: a beveled bench supply, live voltage/current display, signed terminal references, red/black leads, a solder-pad board and a resistor with the current resistance printed on it. The existing Ohm-law engine and graph remain authoritative. Updated gallery framing for this apparatus. Thermal plate and speaker edge/fastener materials were also refined.
- Mobile Explain review exposed a fixed-position containing-block bug: at scrollY=934 its top was -424.8 px. Dialogs and notices now use a document-body portal, or the current fullscreen element when fullscreen is active. Body scrolling is restored on close. The same mobile dialog now spans y=42.2 to 801.8 inside an 844 px viewport.
- Portal rendering exposed global light-theme text rules. Overlays now explicitly declare their dark theme. The test asserts paragraph color rgb(203,228,251), as well as the dialog's viewport bounds. Inspected `mobile-explain-viewport.png` confirms readable text and angle diagram.
- Extended browser checks to decode every SVG raster asset and open Explain in fullscreen. Ten interaction groups pass. The eight physics groups still pass. The final material/overlay source passed the production build (exit 0), including 721 PWA precache entries. The build log is current.

### Goggles generation prompt

Built-in imagegen, product-mockup: one isolated pair of transparent laboratory safety goggles for compositing into a realistic optical laboratory table, genuine transparent alpha background. Clear polycarbonate wraparound lenses, restrained blue-violet upper rim, slim dark-blue open side arms extending backward. Resting naturally, seen slightly from above/front, about 15 degrees above the table; front lenses face the viewer. Cool overhead-strip reflections, realistic optical transparency and silver-blue highlights. Wide 3:2 canvas with 8 percent padding. No person, table, background, text, UI, beam or other objects. Preserve transparent lens areas; only a subtle immediate contact shadow.

## Latest verification results

`checkLauncherCircuit.mjs` verifies the new supply and resistor at -12, 0 and +12 V with R=10 ohms: -1.2, 0 and +1.2 A. Both metallic leads render, terminal wiring is continuous, and the inspected reverse-current screenshot agrees with the graph and supply. Evidence: circuit-boundaries.json and circuit--12.png, circuit-0.png, circuit-12.png.

The initial timing sample after the hardware update recorded three intervals over 50 ms in mechanics (maximum 69.5 ms); other models had none. This evidence is retained in frame-timing-initial.json. A second sample after one second of warm-up per model recorded median 6.9 ms and p95 7.1 ms for all three models, no intervals over 50 ms, and maximum 13.9 ms. frame-timing.json contains that settled sample. No performance source change was needed.

Physics, interactions, responsive behavior and build gates are now VERIFIED for this page. Screenshot comparison remains NEEDS ITERATION: finish the room/board placement and detector/relay framing comparison before marking the whole page VERIFIED or starting the next page.


## Final room and board comparison

Replaced the empty room asset with lab-environment-v2.png: cooler wall lighting, ceiling strips, detailed shelves and an empty optical table. This is an independently generated environment, not a screenshot of the target or an implementation of the UI. All controls, board text, rays, graphs and moving apparatus remain live HTML/SVG. Source: generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-bb8e7bfa-7bd5-4f3a-8f33-8270b31873af.png.

Generation direction: preserve the empty-room camera, materials, shelves and table; cool and brighten the grey wall, add corner ceiling lights, and provide a smaller frameless blank board lower-right. Keep the table empty and exclude all UI, text, rays and apparatus. The generated blank board was smaller than requested, so a code-native board covers it and provides stable coordinates for scientific content.

At 1536 x 1024, compared the final screenshot against 04_experiment_launcher.png: sidebar/header/filter bands, five gallery cards, laboratory/inspector split, equation and graph panels, lower action row and progress footer closely follow the reference geometry. Refined the detector height and pole, prism extrusion, laser aperture/rail alignment and board position. A missing fill=none on the outgoing ray previously made a black polygon; corrected. The final room texture and individual passive hardware details are regenerated assets rather than identical photographic pixels.

Scientific differences are intentional: a 532 nm source produces a green ray and one calculated profile, not the reference's rainbow and unrelated peaks. Correct air/glass refraction is 19.2 degrees, not 18.1. White light exposes actual wavelength-dependent channels. The bench is a projected overview; Explain exposes the accurate angle diagram, and detector readings explicitly use an ideal angular relay model.

Moved the board diagram into the parent SVG coordinate system, outside the apparatus zoom group. This fixes letterboxing-dependent alignment at narrower widths. Its compact ray viewport ends before the board equation for every requested size. The full Explain diagram is uncropped. Tiny board labels and the compact diagram are hidden on phones, where the live values and Explain remain readable.

Evidence: alignment-results.json verifies separation at 1536, 1440, 1280, 1024 and 768 widths and the mobile hidden state. Inspected alignment-1440.png and alignment-390.png at the high-incidence boundary. Reviewed all six default viewport screenshots, plus the TIR and white-light cases. No overflow, missing images or clipped controls were found. Existing catalog/query routes and all five full-lab destinations remain functional.


Final acceptance: all six gates VERIFIED. Latest production build exited 0 with 723 PWA entries. Existing large-chunk advisory remains unrelated to this page. Latest browser suite exited 0 after the mobile-label fix. Four of 102 unique pages are verified; proceed to Compare Phenomena only after this acceptance.
