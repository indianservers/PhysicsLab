# Magnetic Field Lines native rebuild checkpoint

Route: `/magnetism/field-lines`. Target: `12_magnetism/01_field_lines.png`. Full 102-reference / 17-studio goal remains incomplete.

Decorative ellipses, a fixed 29-degree direction and a fabricated cursor multiplier are replaced by a common calculated field model. The native tray contains two bipolar bar representations, field-aligned filings, integrated exterior field lines, direction arrows and compass needles. The bottom vector map and cross-section plot use the same sources. Four reference learning modes and the existing sidebar JSX are preserved. No reference crops or external apparatus images are used.

## Model and conventions

Two equivalent point dipoles have moment magnitude 0.5 A m² each, located at the centres of schematic 3 cm bars. The separation control is the edge-to-edge gap (2–10 cm), converted to SI centre coordinates ±(gap/2 + 1.5 cm). Orientation controls identify the ends facing the gap. Both return poles are rendered in the bench and vector map; no isolated magnetic monopoles are implied.

B is the vector sum of 1e-7 [3(m dot rhat)rhat - m]/r³ for each source. This is a far-field approximation, not an exact finite-magnet solution. A 1.8 cm spherical core around each source is excluded from measurements and exterior traces; that exclusion is not a certified accuracy boundary. Magnets are held fixed; mechanical forces/work and magnetic material dynamics are omitted. Earth’s field, hysteresis, probe back-reaction and grain interactions are omitted. Display heights are schematic; tray measurements/filings use the XY plane at z = 0.

Default inward-facing N/S sources produce B = (0.0021947873799725657, 0, 0) T at the midpoint, magnitude 2.19478737997 mT and angle 0 degrees from +x. Like facing poles cancel at the midpoint: B = 0 with undefined direction. Reversing both magnets reverses every field component while preserving magnitude. The initial cursor at (4.2,-2.1,0) cm is evaluated independently, not scaled from the primary reading. Unavailable core measurements disable recording.

Compass north ends align with the local planar field. Their direction is hidden at nulls/unavailable points. Filings show calculated local orientation only. Field traces integrate the normalized field with RK4, step 0.7 mm, and stop at the domain/core boundary; internal closure through excluded magnets is not drawn. The plot samples y = 0, z = 2 cm to avoid singular centres. Direction arrows have qualitative length; the vector map colors clamp |B| to 0.1–10 mT. Numerical readings are not color-clipped.

Play scans the actual probe along y = 7 cm at 0.02 m/s, reflecting at x = ±12 cm. It does not animate static field lines. Pause/resume preserves scan phase; manual movement stops the scan. A StrictMode-dependent reflection bug was found by the controlled runtime test and corrected by updating scan phase once per animation tick outside React state updaters.

## Evidence

- Direct model: 120 configurations/points and 360 independently differenced scalar-potential gradients. Maximum gradient relative error 3.8221e-9. Scaled divergence/curl finite-difference residuals are at most 2.5763e-9 / 3.3269e-8 outside sources. These verify the chosen dipole model, not finite-bar near-field accuracy.
- Trace validation: 32 calculated lines / 3,648 checked segments. Maximum tangent alignment error 1.7802e-7. Fixed 2 cm arclength endpoint errors for 1 / 0.5 / 0.25 mm steps are 1.3954e-9 / 8.7228e-11 / 5.4502e-12 m relative to a finer 0.03125 mm reference, showing fourth-order step-halving convergence.
- Browser: six sizes (1536×1024, 1920×912, 1024×768, 768×1024, 390×844, 320×740), separation, both orientations, all five layers, sampling density, keyboard/mouse probe movement, scan/pause, fullscreen, core masking, prediction and parsed 11-column CSV values. Records survive reset; four reference tabs remain. No horizontal/card overflow, page errors, local console errors or failed local requests in the saved run.
- Native lifecycle: context reuse across source parameter changes; three SPA round trips; seven observed renderer/context disposals and 3,023 observed geometry/material disposals, including replaced dynamic field groups. Internal environment target resources are excluded from the counted proof and explicitly cleaned in source. Long-duration memory/GPU performance is unverified.
- Actual browser timing: 10/30/60 Hz gives x = 0.02 m after one second from the midpoint, y = 0.07 m, with native needle angles matching the model. The primary compass geometry is reused during scanning. Paused rendering adds zero frames; reflection/resume, hidden-tab suspension without catch-up and route clock cleanup pass.
- Touch: actual CDP drag moved the native probe to x = 0.01875 m and changed the measured field to 3.326 mT.
- WebGL-disabled fallback: visible calculated diagram, layer changes, like-pole null direction, keyboard and pointer probe movement; source values remain calculated. The fallback is a schematic, not photographic parity.
- Shared physics catalog: 581/581 pass, 80 catalog warnings. This is separate from the direct model/runtime evidence.

Final build/production gates are recorded in verification-status.json; pending gates are not implied passed here. Before/after captures, comparison/difference images, region diagnostics and a responsive contact sheet are saved alongside JSON evidence.

## Remaining work

The native tray/filings and magnet materials remain visibly more schematic than the reference. Initial comparison shows lower pixel MAE but slightly lower structural similarity than the old page; this is not a visual completion claim. Typography, realistic filing chains, material finish/camera alignment, all parameter/zoom combinations, broader accessibility/cross-engine coverage and long-duration GPU/FPS/memory measurements remain open. The inherited large main bundle/PWA footprint remains open.

Scientific sources:
- https://openstax.org/books/university-physics-volume-2/pages/11-2-magnetic-fields-and-lines
- https://openstax.org/books/university-physics-volume-2/pages/11-summary
- https://openstax.org/books/university-physics-volume-2/pages/12-4-magnetic-field-of-a-current-loop

Latest sidebar-excluded diagnostics: before MAE 31.623 / SSIM 0.4428; after MAE 27.026 / SSIM 0.4337. Metrics are diagnostics, not completion percentages.

Final gates: TypeScript/Vite/PWA build exited 0; all four source hashes match. Normal production checks pass for the calculated default, both poles in bench/map, null direction, keyboard probe, scan/pause, excluded-core handling, independently parsed 11-column CSV, records surviving reset, short desktop/mobile layouts and four reference modes. Page errors, local console errors and failed local requests are empty. The paired final scan images contain 3,156 pixels changing by more than 20 in a channel; this includes probe/compass/readout changes, not moving field lines. Large main-bundle warning and 1,258-entry / 326,846.15 KiB precache remain open.
