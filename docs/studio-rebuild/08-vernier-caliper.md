# Measurement — Vernier Caliper

Status: VERIFIED. Reference: 02_measurement/02_vernier_caliper.png, 1536×1024. Route: /measurement/vernier-caliper. No later Measurement page has been started.

## Existing implementation inspected

Read the existing MeasurementErrorsLab controls, jaw/mission logic, measurementErrorsSimulation instrument defaults and statistical equations, measurement routing, and the previous meter-scale integration. The original /experiments/measurement-errors route remains unchanged, as does the existing dedicated measurement-error component. Its baseline browser evidence is recorded under 07-meter-scale/before.png; the new page links to the original lesson from Explain. A discoverable studio link still needs integration.

## Model and correction to the mockup

src/lib/vernierCaliper.ts is independent of presentation. The default 27.12 mm diameter uses 27 main-scale millimeters plus coincident division 6 times 0.02 mm. A genuine direct vernier with this least count has 50 divisions spanning 49 mm: each vernier division is 0.98 mm. The mockup's 10-division close-up is incompatible with its stated 0.02 mm least count. The new magnifier shows a labeled 12-division detail of the real 50-division scale, following the coincident mark.

Raw indication = physical opening + zero error. Corrected opening = main + n*0.02 − zero error. Negative raw indications near closed jaws use the preceding integer millimeter plus a positive vernier fraction; e.g. −0.02 = −1 + 49*0.02. The coincidence equation is exact: raw + n*0.98 = main + n, so the highlighted mark actually meets a main graduation.

Controls: jaw 0–50 mm (minimum specimen diameter while present), diameter 5–40 mm, zero error −0.20 to +0.20 mm, all in 0.02 mm steps. A rigid specimen prevents jaw penetration. Final diameter is suppressed until contact; removing the specimen enables a closed-jaw zero check. The demonstrate action opens then closes the jaw and stops at contact. Reset restores the initial specimen, jaw, zero error, zoom and challenge. Scene lighting remains a viewing preference.

Four physics precheck groups pass: default calculation, every one of 2501 jaw steps across five signed offsets with exact engraving coincidence, contact/gap constraints, and negative-zero decomposition. Evidence: physics-results.json and scripts/testVernierPhysics.mjs.

## Current page

VernierCaliperPage, VernierCaliperScene/VernierMagnifier and vernier-caliper.css implement the dedicated surface. Main and magnified engravings are computed from the same model; no mockup pixels are used. The passive background reuses the generated meter-scale empty bench. Metal and brass are procedural SVG gradients/noise. Sliders, draggable/keyboard jaw, calibration, two correction challenges plus the default reading challenge, prediction/explanation dialogs, zoom, lighting, sidebar collapse and navigation are implemented.

The initial screenshot exposed a sloping fixed-jaw contact face, undersized scale metadata and a nonzero-equation overflow. These were corrected and retested. The fixed and moving jaw contact surfaces now match the physical coordinates. The magnifier uses the true 50-division model, and the scale note remains legible on phones.

## Follow-up verification and refinements

Pause now exposes Resume and continues from the held opening without adding another 10 mm. The browser precheck asserts the resumed jaw does not jump outward. Editing parameters or Reset clears the resumable run. The fixed-jaw face is vertical at the contact coordinate. Scale metadata is readable HTML instead of tiny scaled SVG text. The Measurement studio now offers a distinct Vernier Caliper link while preserving the earlier links.

Additional browser checks exercised a two-millimeter pointer drag, 5/40 mm specimen limits, signed closed-jaw calibration limits and nonzero-equation layout at five sizes. This found clipping in the 1536 px reading panel; tighter equation spacing fixed it. The expanded suite passes, including the studio entry and original lesson destination. Its earlier 30-second entry timeout was investigated with a separate page capture: the link existed and the studio had no page errors. The complete suite then passed with a 60-second readiness allowance for the existing 3D route. Older studio/uncertainty routes emit existing THREE shader/PCFShadowMap warnings; the test records those separately from warnings on the new SVG caliper page, rather than suppressing new-page diagnostics.

A brushed-steel material swatch was generated with built-in image_gen.imagegen, inspected, and copied to public/assets/vernier-caliper/brushed-steel.png. It is mapped onto independent code-defined instrument faces and the magnifier; graduations and numerical states remain SVG, not image content. Final prompt: Use case: product-mockup. A flat edge-to-edge material texture for a code-rendered precision vernier caliper. Photorealistic brushed stainless steel surface, cool neutral silver gray, very fine horizontal machining marks, subtle irregular micro scratches and mottled metal patina, restrained contrast, evenly lit with no strong gradient. Entire image is only material, orthographic front-facing view. No object edges, no caliper silhouette, no ruler, no graduations, no numbers, no labels, no logos, no text, no background scene. Landscape 2:1 swatch suitable to map onto independent SVG instrument faces.

The post-texture screenshot has been inspected. Final responsive screenshots, runtime/asset checks and the production build now pass. No later page has been started.


## Final acceptance evidence

- Four physics groups cover every one of 2501 jaw steps with five signed offsets, contact constraints and exact coincidence geometry.
- Nine browser groups across testVernierCaliper.mjs and testVernierAdditional.mjs cover controls, pause/resume, drag/keyboard boundaries, contact, calibration, correction challenges, modes, zoom/lighting, dialog focus, sidebar disclosure, refresh and integration routes. Runtime checks additionally cover wrong/correct answers for the default challenge.
- Six responsive captures were inspected, including desktop geometry, tablet arrangement and phone typography. No horizontal overflow or clipped checked panels occurs. Nonzero-error layouts were checked separately so the default zero-error case did not conceal clipping.
- Both image assets decode. New-page diagnostics contain no errors or failed requests; only pre-existing React Router future warnings. Older WebGL-route warnings are retained separately in additional-interactions.json.
- A 120-frame live sample reports median 20.8 ms, p95 34.8 ms and maximum 48.6 ms on this host. Motion stops purposefully at contact; this is not a guarantee for all hardware.
- Final TypeScript/Vite/PWA production build succeeds, with 743 precache entries. See build.log.

The overall composition, instrument order, magnifier, three readings, formula, sliders, navigation and action panels follow the reference. Independent hardware contours/materials and the valid 50-division engraving differ from the source photograph; the source's inconsistent ten-division arithmetic is not reproduced. No target screenshot is used in the application. All page gates are verified; next is Measurement — Micrometer.
