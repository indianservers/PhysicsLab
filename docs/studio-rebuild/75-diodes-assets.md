# Diodes asset provenance

Original native Three.js objects: rounded supply housing, generated digital meter, knobs/terminals, 2.54 mm-pitch breadboard with instanced holes, rounded resistor body and derived bands, axial diode/cathode marking, LED emitter, component case, conductor leads and integrated-charge packets. Table grain and instrument/part labels are original seeded canvas textures. No reference-image crop, downloaded image or static reference background is used.

Live SVG provides mode icons, circuit symbols, graph axes, calculated characteristics, operating point and calculated no-WebGL circuit fallback. Existing math rendering provides the equation. HTML/CSS provides tabs, controls, readings and toolbar.

The diagram-like fallback preserves the model state and signed Zener orientation; it does not claim photographic fidelity. Visible charge packets are explicitly symbolic 100 µC packets, not electron particles. LED emission is a visualization of an illustrative optical-power fraction, not calibrated photometry. Geometry and material/camera refinement remain open.

Sources: `src/components/DiodeBench.tsx`, `src/lib/diodeStudio.ts`, `src/pages/DiodesStudioPage.tsx`, `src/pages/diode-studio.css`.
