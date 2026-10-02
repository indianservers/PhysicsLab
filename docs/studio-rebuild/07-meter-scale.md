# Measurement Studio — Meter Scale

Status: VERIFIED. Mockup: 02_measurement/01_meter_scale.png, 1536×1024. New route: /measurement/meter-scale. No other Measurement page has been started.

Studio inventory: meter scale, vernier caliper, micrometer, spherometer, mass/time and uncertainty. All six reference images are in the dynamic inventory; only page 1 is currently being implemented.

## Existing implementation

Inspected measurementErrorsSimulation.ts, MeasurementErrorsLab.tsx, measurementErrorsValidation.ts, App routing, ExperimentDetailPage and the measurement studio metadata. The existing /experiments/measurement-errors browser route currently renders its general measurement/percentage-error controls and 3D uncertainty bench, rather than the dedicated MeasurementErrorsLab component. Captured before.png. Preserve both existing implementations and their data contracts. The new meter rule uses a separate route and links back to the old lesson through Explain. The Measurement studio now has a separate Meter Scale link beside its original interactive-lab link. Both routes were opened in browser tests.

## Physics model

src/lib/meterScale.ts defines a 4 cm block at x=12 cm, 1 mm divisions and zero eye angle. Graduations represent an actual 0–100 cm rule; a local 11.5 cm window follows the block. Position is bounded so the physical object remains on the rule. Endpoints are rounded separately to the selected division, then subtracted. Off-scale apparent endpoints are explicitly reported instead of inventing a reading. Display precision follows the selected division.

The reference edge is 1 cm above the graduation plane. Positive eye angle means an observer to the left: extending a parallel sight line through the edge displaces the apparent endpoint right by delta=h*tan(theta). Default procedure reads the left datum normally and changes the right viewing angle. A settings option views both endpoints at the same angle, correctly cancelling equal geometric shifts in their difference. This explicit procedure avoids falsely claiming that identical parallel shifts necessarily alter length. The mockup's constant +/-0.03 cm at 10 degrees is replaced with the actual current-angle displacement for the stated 1 cm height.

Four independent physics precheck groups pass: default subtraction/resolution; every division and signed angle across ruler boundaries; independent 30-degree triangle/equal-shift cancellation/off-scale detection; and the 3.35 cm fine-division challenge. Evidence: physics-results.json and scripts/testMeterPhysics.mjs.

## Current implementation

New MeterScalePage, MeterScaleScene and meter-scale.css. SVG graduations, block, endpoint projections and material effects are procedural. New independently generated empty-bench.png is passive room imagery, and oak-grain.png is a flat material swatch mapped onto code-defined block faces. Neither contains interface elements or measurements. All new CSS uses msr- prefixes after the first screenshot revealed a collision with the existing meter-bridge classes; those existing classes were not edited.

Object slider/numeric input, draggable/keyboard block, signed eye-angle controls, five scale divisions, camera elevation, zoom, brightness, purposeful scan/pause, reset, three missions, predictions, explanation, session notes, settings and full-screen handling are implemented. They require complete browser acceptance, not just presence in source.

## Verification and visual iteration

The first screenshot revealed a meter-bridge CSS collision, excessive procedural noise, an unsuitable room, tiny phone captions and a non-distinct preview. These were corrected: isolated msr- styles, new passive bench/wood materials, HTML caption text, and a separate oblique preview. Camera elevation changes visible block height and depth. The default 9–20.5 cm window places the left endpoint at the reference's location, while other positions automatically expose the relevant meter-rule range. Dragging uses pointer displacement from the drag start; moving the viewing window cannot accumulate motion.

Nine browser interaction groups pass across testMeterScale.mjs and testMeterAdditional.mjs: all divisions, signed angles, numeric boundary/off-scale readings, scan/pause, camera, zoom, lighting, reset, keyboard and multi-step pointer dragging, predictions/explanation, all three missions, notes retention, both-end cancellation, full screen, direct refresh, Measurement studio link and preserved uncertainty route. Reset restores the original experiment, mission, camera, zoom and endpoint procedure; notes and lighting preference remain session-level choices.

Runtime checks decode both assets, trap dialog keyboard focus, verify readable in-bounds phone dialogs and find no own console warnings/errors or failed requests. Only existing React Router future-flag warnings occur. A 120-frame scan sample gave median 13.8 ms, p95 20.8 ms, maximum 21 ms on this host; this is local evidence rather than a universal frame-rate guarantee.

All six viewport captures have zero horizontal overflow and no clipped measured panel containers. Desktop, tablet and phone screenshots were inspected. The overall frame, sidebar, controls, scene, measurement/equation panels, preview and bottom actions follow the reference. Independent hardware/material appearance and scientific corrections remain documented departures: an actual finite ruler, division-appropriate precision, current-angle parallax, explicit endpoint procedure and an optional angle scan rather than meaningless motion of a static specimen. No mockup is part of the running page.

Final TypeScript/Vite/PWA production build passes after all material/caption refinements. See build.log. All page gates are verified; next in this studio is Vernier Caliper.

## Generated assets and exact prompts

Built-in image_gen.imagegen was used. Final project paths: public/assets/meter-scale/empty-bench.png (1638×960) and public/assets/meter-scale/oak-grain.png (1774×887). Originals remain in the Codex generated_images directory. Both outputs were inspected before integration.

Bench prompt: Use case: photorealistic-natural. Asset type: passive backdrop for a live meter-rule physics simulation. A close laboratory tabletop scene, landscape aspect 1.7:1. Camera at low elevation looking across a matte charcoal stone laboratory bench. Foreground lower 70 percent is an EMPTY flat textured dark grey bench surface with realistic tiny wear and restrained reflections, no holes or optical breadboard grid. Background upper 30 percent is softly defocused laboratory equipment, a subdued horizontal wooden shelf left and two shiny vertical retort stand rods with clamp hardware near the far right. Cool blue-grey subdued lighting, realistic DSLR laboratory photograph. Crucial: no ruler, no scale, no graduations, no block, no sample, no measuring instruments in the foreground, no text, no numbers, no interface, no panels, no arrows. The empty bench must support independently composited dynamic apparatus. Do not create a complete interface or instructional diagram.

Wood prompt: Use case: product-mockup. Asset: flat material texture to map onto code-rendered wooden measurement block. Generate a photorealistic close-up flat orthographic surface of medium brown unfinished oak wood, horizontal fine natural grain running left to right, subtle darker growth lines, small pores, realistic fibrous texture, no large knots. Uniform soft neutral light, no perspective, no shading gradient, no bevel, no object edges, no background, no scene, no ruler, no numbers or letters. Entire landscape 3:1 image filled edge-to-edge with the wood material. Modest contrast and natural warm mid-brown hue suitable for an unvarnished physics-laboratory block. This is a plain material swatch only.
