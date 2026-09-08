# Galaxies

- Route: `/astrophysics/galaxies`
- Mockup: `17_astronomy_astrophysics/04_galaxies.png`
- Implementation: `src/pages/GalaxiesStudioPage.tsx`, `src/lib/galaxiesStudio.ts`

The galaxy studio visualizes a spiral system and computes probe-radius orbital speed and enclosed mass for selectable morphology and dark-matter halo models. Radius and model controls update the scene and live rotation readings.

Validation: direct refresh, radius boundary interaction, reset, six responsive viewports with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
