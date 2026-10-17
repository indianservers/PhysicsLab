# Solenoid native rebuild

Route: `/magnetism/solenoids`  
Reference: `12_magnetism/04_solenoids.png` (1536 × 1024)  
Status: native rebuild; visual refinement and real-material fidelity remain open. Overall goal incomplete.

## Scope and implementation

The original sidebar markup is preserved. Comparison excludes the 193 px target sidebar / 201 px application sidebar and aligns the remaining main regions. Only Observe, Predict, Experiment and Explain are mode tabs. The reference-relevant view selector supports actual Cutaway, Exterior and End cameras; zoom and fullscreen work. No generic 3D tab or enhancement dock is added.

An original Three.js bench includes representative copper winding rings, cutaway/full core, flanges/shafts, frame, ruler, current supply and leads, and a movable ideal Hall probe. Canvas textures are generated locally for the table, labels and supply readout. Winding detail is explicitly schematic: the default 800 physical turns are represented by 33 visible rings; the numerical model uses actual N. Ring count changes with N; the air core removes the magnetic core body and other presets change its appearance. No reference image or cropped pixels are imported by the application.

All inputs, steppers and material buttons change the same SI model used by native probe data, field directions, profile and CSV. Mouse/touch dragging and keyboard move the probe along x. Play is a mechanical 2 cm/s scan reflecting at ±10 cm; the steady field traces remain fixed. Parameter edits pause the scan and preserve the probe location. Reset restores the paused default, cutaway view, zoom and initial challenge; recorded data survives. Five real challenge tasks advance with Next Challenge and grade the actual setup through Check setup. Prediction, experiment recording and quoted nine-column CSV export are functional.

## Corrected model and declared limits

The previous page used `μ₀ μᵣ (N/125) I`. That implicit length is 125 metres; it was used to reproduce 2.41 mT from the mockup. The old VERIFIED claim and calibration are withdrawn. The new dimensions are declared choices for the centimetre-scale apparatus: L = 0.16 m, R = 0.025 m. The image does not fully specify those dimensions; this is not a claim of an exact dimensional reconstruction.

For a tightly wound cylindrical current sheet, Kfree = NI/L. The material model assumes uniform axial magnetization M inside a cylinder of the same dimensions. At the centre, α = (L/2)/√((L/2)² + R²), D = 1 − α, Hcentre = Kfree α − DM. Closing the illustrative linear constitutive law M = (μᵣ − 1)Hcentre gives:

M = (μᵣ − 1) Kfree α / [1 + (μᵣ − 1)D].

Its bound surface current adds to Kfree, so Ktotal = Kfree + M. The exact axial field of this prescribed current-sheet/uniform-M model is:

Bx(x) = μ₀Ktotal/2 × [(x + L/2)/√((x + L/2)² + R²) − (x − L/2)/√((x − L/2)² + R²)].

μ₀ is approximated as 4π × 10⁻⁷ H/m. The displayed B = μnI equation is identified as the long-coil limit, rather than used as a position-independent finite-coil field. For the default N = 800, I = 1.50 A, μᵣ = 200, the model gives α = 0.9544799780, D = 0.0455200220, M = 141627.8352 A/m, effective boost = 19.88371136, and central B = 0.1788691323 T = 178.87 mT. The corresponding naive long-coil expression gives 1.88496 T. Neither result is calibrated back to 2.41 mT.

Off-axis fields integrate the same cylindrical free/bound current sheet: the axial integral is analytical and azimuth uses 512 midpoint samples. RK4 traces use normalized B directions. An excluded 1.5 mm band around the winding sheet avoids near-sheet evaluation. The cutaway shows inner trace segments locally and computed outer return paths; inner continuations outside that diagram region are omitted, not joined with invented curves. Lines ending at the excluded band or bounds are truncated.

Positive current gives +x internally, south at the left and north at the right. End View looks from −x, so its direction readout correctly changes to ⊗ (+x, into view). At zero current, M and B vanish and direction is undefined; native traces and S/N labels disappear. This ideal nonperturbing probe does not model a physical sensor bore or measurement noise.

**Core approximation:** The centre closure is not an exact solution of the nonuniform finite-core boundary problem. Core names label illustrative constant-μᵣ presets from the reference, not measured B–H curves. Saturation, hysteresis, remanence, lead/contact fields, winding pitch, heating and transient induction after edits are omitted. These limits are stated in the UI. Mathematical verification below validates this stated model, not empirical accuracy for a real iron/ferrite/steel specimen.

Primary references checked: [OpenStax finite-solenoid derivation](https://openstax.org/books/university-physics-volume-2/pages/12-6-solenoids-and-toroids), [MIT Electromagnetic Fields and Energy, chapter 9, uniform magnetization of a cylinder](https://ocw.mit.edu/courses/res-6-001-electromagnetic-fields-and-energy-spring-2008/d4860fdc85d667828060e6d72e49a62f_09.pdf), and [Feynman Lectures, ferromagnetism and bound surface currents](https://www.feynmanlectures.caltech.edu/II_36.html). The centre-based closure above is an explicitly derived approximation; the sources are not claimed to validate it as an exact material solution. No source illustrations are reused.

## Verification

- `model-verification.json`: 64 parameter configurations / 576 axial states, plus 12 challenge grading cases. SI axial magnitude, centre constitutive closure, symmetry, zero field and current/turn scaling pass. Maximum normalized constitutive residual 1.27e-13.
- Independent full Biot–Savart surface integration at four off-axis points converges toward the implementation: 32 → 256 axial slices with 512 azimuth samples reduces maximum relative vector error 0.00234527 → 0.0000367284, approximately second order. The 512-versus-1024 azimuth check at 28 near-sheet/end/outer points has maximum relative error 5.3e-13.
- Finite-difference normalized divergence and curl residuals outside the sheet are 1.65e-09 and 6.55e-10. The 12 computed traces / 2316 checked segments have maximum normalized tangent residual 0.000215.
- `browser-verification.json`: all steppers, sliders, core presets/selector, probe keyboard/mouse drag, zero current, three views including end-view direction, zoom/fullscreen, 2.5-second play/pause, prediction, challenge advance/grade, independently parsed nine-column CSV and record persistence pass. Native SI probe data and profile marker agree with the model.
- Eight viewports: 1536×1024, 1920×912, 1251×900, 1250×900, 1024×768, 768×1024, 390×844, 320×740. Document/card/inner-control overflow, actual formula bounds, header order, narrow-screen playback placement and desktop panel separation pass. Short-desktop control overflow found in the first run was corrected before these final captures.
- Scoped resource instrumentation observes 7 renderer disposals/context releases and 1820 owned geometry/material/direct-texture disposals during StrictMode and three SPA remounts. Environment resources are cleaned in source but are outside that counter. This does not certify arbitrary long-session heap usage or FPS.
- `runtime-verification.json`: 10/30/60 Hz clocks reach x = 0.02 m with the same B after one second. Native arrow direction error is at most 5e-16. Field-line vertices stay fixed, probe geometry is reused, pause generates no bench renders, reflection/resume and hidden-tab exclusion pass, and the owned scan callback is removed on route exit.
- `touch-verification.json`: actual CDP touch drag, touch play/pause, core selection and reset pass.
- `fallback-verification.json`: forced WebGL failure shows a calculated axial SVG; zoom, keyboard probe, zero-field handling and reset pass. Unsupported 3D views are disabled and explained; reset maintains cutaway.
- `physics-catalog.log`: 581/581 existing broad catalog checks pass, with 80 existing validation-metadata warnings. Those checks do not replace the direct solenoid tests.
- `build.log`: final TypeScript/Vite/PWA command exits 0. SHA-256 snapshot matches all four delivered source files. PWA precache 1261 entries / 326935.94 KiB; the existing large-bundle warning remains.
- `production-smoke.json`: normal local production bundle, without an external-request mask, passes default finite field, keyboard slider, core/zero current, views and end-view direction, zoom/fullscreen, play/pause, finite-end CSV/profile agreement, record persistence, short-desktop/breakpoint/mobile bounds and only four mode tabs. Local page/console/request errors are empty. Only the script-owned preview server on port 4197 is stopped; the user dev server remains running.

## Visual evidence and unfinished work

Before, eight after screenshots, paired probe scans at 0 and 4 seconds, responsive contact sheet, comparison and difference images, and regional metrics are saved in this directory. Sidebar-excluded RGB MAE is 22.852 → 22.818; Gaussian-window grayscale SSIM is 0.5222 → 0.5217. Average pixel error improves only slightly and structural similarity remains slightly below baseline. These are diagnostics, not matching percentages or acceptance.

Layout and functional reconstruction are in place, but photorealistic materials/lighting, winding and flange finish/proportions, Hall-label placement/callout, field presentation, supply details and other scene differences still require refinement. The reference ruler and rendered coil are not treated as a reliable common pixel-to-length calibration; the rebuilt ruler and coil share actual metre coordinates. The profile and displayed field intentionally differ to remain consistent with the declared model. The exact finite nonlinear core and empirical material response remain unimplemented. Other browser engines, hardware performance and the roughly 327 MB PWA precache remain open concerns.

All 102 canonical references / 17 studios remain in scope. This checkpoint does not mark the lab or the overall goal visually complete.
