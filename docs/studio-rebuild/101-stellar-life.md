# Stellar Life

- Route: `/astrophysics/stellar-life`
- Mockup: `17_astronomy_astrophysics/02_stellar_life.png`
- Implementation: `src/pages/StellarLifeStudioPage.tsx`, `src/lib/stellarLifeStudio.ts`

The stellar evolution studio computes luminosity with L ∝ M^3.5, estimates surface temperature, and models main-sequence lifetime as mass varies. Mass, metallicity, and evolution-stage controls update the star scene and live properties.

Validation: direct refresh, high-mass boundary interaction, reset, six responsive viewports with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
