# Stellar Spectroscopy

- Route: `/astrophysics/spectroscopy`
- Mockup: `17_astronomy_astrophysics/03_spectroscopy.png`
- Implementation: `src/pages/SpectroscopyStudioPage.tsx`, `src/lib/spectroscopyStudio.ts`

The spectroscopy studio selects target stars, adjusts observed wavelength range and redshift, and computes effective temperature, spectral type, and radial velocity using vᵣ ≈ zc. The spectrum apparatus and readings stay synchronized.

Validation: direct refresh, redshift boundary interaction, reset, six responsive viewports with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
