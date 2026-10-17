# Current-Carrying Wire original assets

The application imports no reference image or crop. The visual reference is `12_magnetism/03_current_wire.png` and is used only by the offline comparison script.

- `src/components/CurrentWireBench.tsx`: original Three.js copper cylinder, terminals and curved leads, procedural scratched table texture, compass dial canvas texture, nine compass bodies and needles, static calculated circular field lines, tangent arrows, projected 5 cm scale and pointer probe. The table and compass textures are seeded or deterministic and generated locally.
- `src/pages/CurrentWireStudioPage.tsx`: original SVG top-view field diagram and right-hand illustration; CSS controls and toolbar; rendered equations.
- No new raster files are required at runtime. The WebGL fallback is an original calculated SVG diagram with the same probe state.

Materials, geometries, canvas textures, environment and renderer are disposed on unmount. Apparatus finish and the hand illustration still need visual refinement against the reference. The lead arrangement and finite visible conductor are schematic; the numerical model is an ideal infinitely long isolated wire.
