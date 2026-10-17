# Current-Carrying Wire native rebuild

Route: `/magnetism/current-wire`  
Reference: `12_magnetism/03_current_wire.png` (1536 × 1024)  
Status: native rebuild; visual refinement remains open. Overall goal incomplete.

## Implemented

The original sidebar markup is unchanged and is excluded from screenshot comparison (target sidebar 209 px, application sidebar 201 px). The page retains only the four reference modes: Observe, Predict, Experiment and Explain. There is no added 3D tab, view selector or fullscreen action.

An original Three.js copper wire, terminals, curved leads, deterministic table texture, compass dials, nine compass bodies and calculated tangent arrows replace the flat SVG. The cyan compass is the measurement probe; the eight surrounding compasses sit at radius 0.15 m. Mouse and real touch dragging, keyboard angle/radius adjustment, current sliders/numeric input, current reversal, probe radius, zoom, reset and playback affect the shared state. The SVG top-view inset and right-hand illustration are original geometry. No mockup crop or screenshot image is imported into the application.

Prediction and challenge answers are checked against proportionality. Experiment records actual SI coordinates and vector components in a quoted nine-column CSV; records survive reset. Explain documents the model and its limits.

## Physics

The previous scalar formula was correct. This rebuild extends it to a signed vector field and compass directions:

- B = μ₀ |I| / (2πr), with μ₀ approximated as 4π × 10⁻⁷ T·m/A.
- The wire lies along z; signed I is positive upward. B(x,y) = μ₀ I (−y,x,0)/(2πr²). Current up gives counterclockwise field viewed from +z; reversing it reverses all field arrows and compass north ends.
- UI radius is in centimetres and converts to metres once. Default 3 A at 5 cm produces 1.20 × 10⁻⁵ T = 12 μT.
- Zero current produces B = 0 and undefined heading: field/current arrows and compass needles are hidden. The rendered 3.2 mm wire core is excluded from the thin-wire field evaluator; the probe range starts at 1 cm.
- This is an infinitely long, isolated, steady wire in vacuum. The visible wire and return leads are schematic; their finite-end/contact fields, Earth’s field and compass dynamics are omitted. Field is independent of height in this model.
- Play is a mechanical probe scan at 0.3 rad/s, not moving magnetic field lines. Static lines and outer compass headings remain fixed. Parameter edits pause the scan while preserving its angle. Reset returns to the paused default.
- The projected ruler measures 0.05 m in world coordinates; both screen-axis scales are used. Camera zoom never changes the numerical field.

Primary references checked: [OpenStax straight-wire field and right-hand rule](https://openstax.org/books/university-physics-volume-2/pages/12-2-magnetic-field-due-to-a-thin-straight-wire) and [Ampère’s law](https://openstax.org/books/university-physics-volume-2/pages/12-5-amperes-law). Explanations and all visual assets are independently implemented.

## Verification evidence

- `model-verification.json`: 32 parameter configurations / 192 probe states. Magnitude, right-hand direction, reversal, tangency, SI conversion, zero field and core exclusion pass. Maximum normalized tangency residual 4.14 × 10⁻¹⁷; finite-difference divergence/curl residuals below 2.07 × 10⁻¹⁰ outside the wire.
- Independent polygon line integration converges to μ₀I: 16 → 256 segments reduces relative error 0.0255046 → 0.000100396. A 100,000-element midpoint Biot–Savart integral matches the finite-wire expression; half-length 0.1 → 1.6 m reduces error relative to the infinite wire from 0.105573 to 0.000487924.
- `browser-verification.json`: all controls, current sign/zero, native compass headings, stable geometry identity, mouse drag, keyboard, zoom, playback, prediction/challenge, independently parsed nine-column CSV and reset/record persistence pass. Viewports: 1536×1024, 1920×912, 1024×768, 768×1024, 390×844, 320×740. Header precedes scene; essential playback follows scene on narrow layouts. Card overflow, actual KaTeX formula bounds and desktop inspector/toolbar separation are checked.
- Resource instrumentation observes 7 native renderer disposals/context releases and 1,610 owned geometry/material/direct-texture disposals during initial StrictMode and three SPA remounts. Environment resources are cleaned by the component but are outside this counter. This is scoped cleanup evidence, not a general heap-leak or FPS certification.
- `runtime-verification.json`: 10/30/60 Hz controlled clocks put the probe at 0.3 rad after one second, with maximum heading error 2.89 × 10⁻¹⁵ rad. Static field-line vertices remain unchanged. Geometry is reused, pause causes no bench renders, resume preserves position, hidden-tab time is excluded, and the owned scan callback is removed on route exit.
- `touch-verification.json`: CDP touchStart/touchMove/touchEnd drag, touch play/pause, direction and reset pass.
- `fallback-verification.json`: forced WebGL failure shows a calculated SVG; current reversal, zero field, probe keyboard, zoom and reset pass.
- `physics-catalog.log`: 581/581 existing catalog checks pass; 80 existing validation-metadata warnings remain. This broad catalog is not a replacement for the direct wire checks.
- `build.log` / `production-smoke.json`: final TypeScript/Vite/PWA build exits successfully; the normal production bundle passes default field, signed current, keyboard slider, zoom, play/pause, independently parsed CSV, record persistence, short-desktop/mobile bounds and four-mode checks with no local console/page/request errors. Final four-file SHA-256 hashes match the build snapshot. PWA precache: 1260 entries / 326898.75 KiB; large-bundle warning remains.

An intermittent React maximum-update-depth warning was reproduced in the first browser runs. The bench had copied projected probe coordinates into React state from its draw effect. Probe/ruler projection now updates owned SVG/DOM refs directly. The latest 2.5-second uninterrupted play and complete browser run have no console errors; the diagnostic wrapper remains in the browser test. Narrow-screen screenshot review also found a clipped μ₀ unit missed by outer-card bounds: the mobile equation is now stacked and formula bounds are explicitly tested. Short-desktop screenshot review then found an inspector/toolbar overlap; shorter-desktop controls/readings/equation heights are compacted, with explicit separation assertions in development and production tests.

## Visual evidence and remaining work

`before.png`, six `after-*.png` captures, `comparison.png`, `difference.png`, `responsive-contact-sheet.png`, regional metrics and paired `scan-0.png` / `scan-2s.png` are saved. Comparison crops only the sidebar; the remaining main areas are aligned to equal widths. RGB MAE improves 24.011 → 20.192, Gaussian-window grayscale SSIM improves 0.5295 → 0.5995. These are diagnostics, not completion percentages.

The main panel/control/toolbar layout is substantially closer. Native lighting, wire/base proportions, surface realism, compass placement/finish and the stylized hand still differ from the reference. This lab is not accepted as a pixel-perfect match. Browser evidence is Chromium on this machine; other browser engines and hardware performance remain unverified. The large existing application bundle / roughly 327 MB PWA precache remain a performance concern.

All 102 canonical references across 17 studios, including further visual refinement of this lab, remain in scope. The overall goal is not complete.
