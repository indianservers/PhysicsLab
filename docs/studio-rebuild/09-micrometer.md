# Measurement — Micrometer Screw Gauge

Status: VERIFIED. Mockup: 02_measurement/03_micrometer.png, 1536×1024. New route: /measurement/micrometer. No later Measurement page has been started.

## Existing code and scientific scope

Inspected measurementErrorsSimulation instrument defaults (micrometer least count 0.01 mm), its statistical measurement model, MeasurementErrorsLab instrument selection and existing measurement routing. Preserve the original lesson/component and reuse its route as the uncertainty destination. Baseline evidence for that existing route is recorded under 07-meter-scale/before.png. The new page uses a separate mechanical model rather than changing the old data contract.

The reference is inconsistent: a nominal 0.300 mm wire is shown with a 0.820 mm result, 3.2 turns disagree with a 0.500 mm pitch, and TSR is displayed as millimeters although the formula multiplies it by least count. Correct implementation: default physical opening is 0.82 mm = 1.64 turns × 0.5 mm/turn, sleeve 0.50 mm plus 32 divisions × 0.01 mm. There is a 0.52 mm gap. The result is labeled Corrected Opening until actual contact gives a valid 0.30 mm diameter.

Model: raw indication = physical opening − signed zero correction; corrected opening = sleeve + thimbleCount×LC + correction. LC = pitch/50 = 0.01 mm. Half-millimeter carries and negative raw indications at closed jaws use floor division and a positive 0–49 thimble count. The rigid wire prevents spindle penetration; compression is not modeled. The lesson uses 0–2 mm of a nominal 0–25 mm instrument's travel for 0.1/0.2/0.3/0.5/1.0 mm wires. Correction spans −0.05 to +0.05 mm in 0.01 mm steps.

Four physics precheck groups pass across every 0.01 mm opening, all signed correction steps, all wire contact limits and half-millimeter boundaries. Evidence: scripts/testMicrometerPhysics.mjs and physics-results.json.

## Current implementation

MicrometerPage, MicrometerScene, micrometer.ts and micrometer.css. Code-defined frame, spindle, anvil, wire, sleeve marks and rotating thimble marks. Steel and passive bench reuse the already inspected generated materials from the previous pages. No target screenshot is included. The wire width and anvil/spindle positions use a consistent 30 px/mm mapping; thimble translation includes calibrated scale registration. Thimble indices are projected onto the visible cylindrical surface from the same division count used in the readouts.

Visible controls include wire choice, fine rotation slider, draggable/keyboard thimble, signed correction, pause/close motion, reset, three zoom controls, miniature overview, search, lighting, full screen, prediction, explanation, calibration tools, session notes/bookmark and correction challenges. Full interaction acceptance passes; evidence follows.

## Visual iteration and acceptance

Screenshot review led to a generated hammered-enamel texture on the code-defined frame, styled range tracks, normal text weights, readable HTML scale metadata and a synchronized viewport rectangle in the miniature overview. The Measurement studio offers a separate Micrometer link without replacing earlier lesson links. The shared dialog focus selector now includes textareas, fixing keyboard access to session notes; the new Notes test verifies the complete focus cycle.

The 1536×1024 composition follows the reference: top search/header, sidebar, modes, large instrument/controls/readings, three lower panels and bottom actions. Independent hardware contours and scientifically necessary scale/reading differences remain documented. Phone and tablet screenshots were inspected after the refinements; no horizontal overflow or clipped checked panels occurs at any of the six required viewports. No target screenshot is displayed in the application.

- Four physics groups cover every 0.01 mm opening in the lesson range, every signed correction step, five wire sizes, zero, contact and half-millimeter rollovers.
- Nine browser groups across testMicrometer.mjs and testMicrometerAdditional.mjs cover every control class: wire/rotation/correction, physical closure and pause/resume, keyboard and pointer rotation, all three challenge outcomes, search, prediction, notes/bookmark, lighting, full screen, zoom limits/fit, dialog focus, direct refresh and both new/old lesson navigation.
- Both extra correction challenges and the default challenge are exercised. A wrong open-jaw answer is rejected; a valid contact answer is accepted.
- The new page has no console errors or failed requests. Only pre-existing React Router future-flag warnings are accepted; old-route diagnostics are scoped separately.
- All three image assets decode. A 120-frame live sample reports median 6.9 ms, p95 13.9 ms, maximum 14.2 ms on this host; these are local measurements rather than a universal frame-rate guarantee.
- Final TypeScript/Vite/PWA production build passes after all source changes. Evidence: build.log, physics-results.json, interaction-prechecks.json, additional-interactions.json and runtime-results.json.

Reset restores the default wire, opening, zero correction, challenge, mode and zoom. Notes, bookmark and lighting are session-level choices retained by Reset. Closing motion stops at the rigid contact boundary; it does not model wire compression.

## Asset provenance

Built-in image_gen.imagegen generated the frame material. It was inspected and copied to public/assets/micrometer/hammered-enamel.png (1254×1254). Existing verified passive bench and brushed-steel materials are reused. All geometric shapes, spindle motion, divisions, readouts and viewport indicators remain code.

Exact prompt: Use case: product-mockup. Material texture for an independently code-rendered micrometer frame. Full image filled edge-to-edge with dark blue-grey hammered enamel on cast metal, realistic fine pebbled and irregular crinkle finish, subtle silver-blue edge glints on tiny bumps, low contrast navy graphite overall color. Flat orthographic material swatch, uniform diffuse laboratory illumination with no large shading gradient. No object silhouette, no micrometer, no instrument, no numbers, no markings, no typography, no border or background. Photorealistic macro surface suitable as a texture mapped to SVG apparatus geometry.

All Micrometer gates are verified. Next page: Spherometer. No later page has been started.
