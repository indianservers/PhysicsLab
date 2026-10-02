# Concept Overview — Relationship Map

Route: `/graph`. Reference: `01_concept_overview/02_relationship_map.png`, 1536 × 1024.

Status: VERIFIED for implementation, interaction, physics, screenshot, responsive layout and production build. This is page 2 of 102 unique mockups. Later pages have not been advanced.

## Existing implementation and integration

The original KnowledgeGraphPage is a force-directed canvas of experiments. It remains available at `/graph?view=experiments`, linked by Simulations and the Examples panel. The default route now lazily loads the concept relationship map. Existing lesson data and physics engines remain intact. All 20 concept lesson links resolve to IDs in the runtime experiment catalog.

## Implementation and visual comparison

The desktop page recreates the reference's 192-pixel sidebar, 97-pixel header, 937 × 620 concept map, right-hand controls, and five-column details panel. The map uses actual SVG nodes, links, gradients and animated connection markers. Nodes can be dragged or moved with arrow keys, selected by pointer or keyboard, and selected from the focus control. Nothing uses the full mockup image as UI. The rocket is a separately generated photo asset; visual examples are code-rendered SVG.

Screenshot iterations corrected desktop panel overlap, small-screen stacking, clipping, label spacing and encoding, control positions, map node labels, and the tablet visual example width. The target's general layout, hierarchy, navy palette, bright node outlines, typography and panel geometry are preserved. Deliberate differences: corrected work–energy notation, explicit fixed-mass caption, new rocket photograph and schematic block detail, and conceptual rather than measured link weights.

## Behavior and physics

- All 20 focus concepts update node selection, description, formula, live values, examples and observation caption.
- Link strength changes visual emphasis; prerequisite layers filter nodes and links. Zoom has explicit limits and Fit restores it. Reset restores nodes, quantities, mode, filters, zoom and animation.
- Play/Pause controls the SVG connection clock. The moving markers describe conceptual links, not physical particles.
- Three distinct prediction challenges provide feedback and open the corresponding experiment controls.
- Nine example families calculate F/m, constant collinear net work Fd, kinetic energy, near-Earth potential energy, average power, period/frequency, wave speed, vacuum light wavelength and an ideal-solenoid field. Values derive from the same parameter state as their diagrams.
- Net work is labeled W_net = delta K. The mockup's general W = delta E would incorrectly exclude other energy-transfer mechanisms. Force and displacement, height relative to zero and current can be negative. Mass, period and duration remain positive; zero force, speed, wave frequency and current are handled.
- Static example plots explicitly identify time/spatial axes and fixed amplitude. The solenoid diagram changes field direction with current. The block arrow uses force for dynamics and velocity for kinetic energy. Potential energy uses a movable height relative to a labeled zero.
- Notebook saves locally and persists after refresh. Settings, Help, Explain and modal focus/Escape handling work. Icon navigation retains accessible labels on mobile.

## Evidence

`node scripts/testConceptRelationships.mjs`: 12 check groups passed, including all 20 concepts, pointer/keyboard movement, filters, pause/resume, zoom limits, three challenges, all nine equation families with zero/negative/extreme values, notes refresh, reset, original graph accessibility, and all six responsive viewports. Zero uncaught page errors or failed HTTP responses.

Screenshots and results: `artifacts/studio-rebuild/02-relationship-map/`. 1536 × 1024 and 1440 × 900 fit the viewport. 1280 × 720, 1024 × 768, 768 × 1024 and 390 × 844 use deliberate vertical stacking with no horizontal document overflow, overlapping inspector/details panels, or clipped controls.

The first production build exposed the existing service worker's 5 MiB main-bundle cache cap. Lazy loading this page reduced the main bundle by approximately 32 kB and passed the next build without changing service-worker configuration. Final build after the last tablet CSS refinement passed (exit 0), including PWA generation. The existing large-chunk advisory remains.
