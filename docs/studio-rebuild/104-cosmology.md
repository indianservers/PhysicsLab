# Cosmology

- Route: `/astrophysics/cosmology`
- Mockup: `17_astronomy_astrophysics/05_cosmology.png`
- Implementation: `src/pages/CosmologyStudioPage.tsx`, `src/lib/cosmologyStudio.ts`

The expanding-universe scene models epoch-dependent redshift and lookback time, then derives present distance and recession velocity from Hubble’s law. Epoch, Hubble constant, and matter-density controls update the visualization and readings.

Validation: direct refresh, early-epoch boundary interaction, reset, six responsive viewports with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
