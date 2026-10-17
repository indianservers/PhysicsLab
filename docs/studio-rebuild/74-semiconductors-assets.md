# Semiconductors asset provenance

All silicon sites, covalent bonds, substitution markers, bounding cutaway and carrier symbols are native Three.js geometry/materials. The diamond basis and nearest-neighbour connections are generated from the lattice constant. The no-WebGL SVG uses a projection of those same calculated sites and bonds. The carrier glow texture is an original 64×64 radial canvas gradient. No screenshot element, image crop, downloaded raster or generated external image is used as an application asset.

Band fills, energy-axis lines, Fermi level, gap arrow and schematic occupation symbols are original live SVG. The relation uses the existing math renderer. Legend swatches, cards, controls, tabs and toolbars are native HTML/CSS.

Carrier/dopant symbols are enlarged, oversampled and explicitly schematic. Counts do not represent literal populations or actual atom-to-dopant ratios. Sphere radii are drawing sizes, not measured atomic radii. Play renders a declared illustrative acoustic mode from physical coordinates, not carrier trajectories. Material finish and camera composition remain visually different from the reference.

Sources: `src/components/SemiconductorBench.tsx`, `src/pages/SemiconductorsStudioPage.tsx`, `src/pages/semiconductor-studio.css`, `src/lib/semiconductorStudio.ts`.
