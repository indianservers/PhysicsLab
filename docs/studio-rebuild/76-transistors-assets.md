# Transistors asset provenance

All apparatus is original native Three.js geometry: rounded two-channel source-measure unit, original canvas LCDs/labels, breadboard with instanced holes, generic labelled E–B–C transistor package, resistor bodies/bands, two ammeters, explicit wire curves and conventional-charge packets. RoomEnvironment is the existing Three.js procedural environment. No image from the reference, screenshot crop, downloaded raster or external generated asset is used in the application.

HTML/CSS reconstructs controls, cards, region strip, selectors and toolbar. Original SVG reconstructs mode icons, calculated output and transfer plots, operating point/load line and the no-WebGL circuit fallback. The existing math renderer renders the forward-active relation.

Geometry uses metre units and a 2.54 mm hole pitch, but breadboard holes are explicitly schematic; explicit conductor curves define connectivity. Charge packets are labelled symbolic branch flux, 100 µC each, not electron particles or microscopic transport. The transistor is a generic illustrative device, not a measured 2N3904 package/model. Materials, camera and proportions remain open for visual refinement.

Sources: `src/components/TransistorBench.tsx`, `src/lib/transistorStudio.ts`, `src/pages/TransistorsStudioPage.tsx`, `src/pages/transistor-studio.css`.
