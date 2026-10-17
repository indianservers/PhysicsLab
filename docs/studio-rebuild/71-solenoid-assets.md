# Solenoid original assets

No reference image or cropped reference pixels are used by the application.

- `src/components/SolenoidBench.tsx`: original Three.js representative winding rings, full/cutaway core, annular flanges and shafts, support frame, movable Hall probe/carriage, centimetre ruler, supply and curved leads. Locally generated canvas textures provide the seeded table, instrument display, ruler labels and S/N labels. All dimensions are in metres.
- `src/lib/solenoidStudio.ts`: analytic axial field, periodic Biot–Savart quadrature, RK4 field traces and a documented uniform-magnetization approximation. Native/SVG field geometry uses these computed points. Inner trace continuations outside the cutaway region are omitted, not closed with invented paths.
- `src/pages/SolenoidStudioPage.tsx`: native controls, calculated SVG field/profile plots and equations. Browser-generated fallback diagrams share the same state; unsupported 3D viewpoints are disabled with an explanation.

No raster assets are required at runtime beyond generated canvas textures. Geometry, materials, textures, environment and renderer have scoped disposal tests. Representative winding detail is explicitly labelled; it is not a claim that 32 visible rings equal the default 800 physical turns. Photographic finish and other visual differences remain open.
